const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc    Get all admins
 * @route   GET /api/v1/admins
 * @access  Private/Admin
 */
exports.getAllAdmins = (req, res) => {
  res.status(200).json({ success: true, where: "listAdmins", data: [] });
};

/**
 * @desc    Get a single admin by ID
 * @route   GET /api/v1/admins/:id
 * @access  Private/Admin
 */
exports.adminDeletePost = async (req, res, next) => {
  const pool = req.app.locals.pool;
  const client = await pool.connect();

  try {
    const adminId = req.admin?.adminId;            // มาจาก adminProtect
    const postId = Number(req.params.postId);
    if (!adminId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid postId" });
    }

    await client.query("BEGIN");

    // 1) soft delete post (เฉพาะยังไม่ถูกลบ)
    const upPost = await client.query(
      `
      UPDATE posts
      SET is_deleted = TRUE
      WHERE post_id = $1 AND is_deleted = FALSE
      RETURNING post_id
      `,
      [postId]
    );
    if (upPost.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Post not found or already deleted" });
    }

    // 2) cascade soft delete comments ใต้โพสต์นี้
    await client.query(
      `
      UPDATE comments
      SET is_deleted = TRUE
      WHERE post_id = $1 AND is_deleted = FALSE
      `,
      [postId]
    );

    // 3) บันทึก admin action (มินิมอล ไม่ใส่รายละเอียด)
    // หมายเหตุ: ถ้าคุณใช้ ENUM ให้ cast ตามสคีมาของคุณ เช่น:
    // 'delete_post'::admin_action_type และถ้ามี target_type เป็น ENUM ให้ใช้ 'post'::report_target_type
    await client.query(
      `
      INSERT INTO admin_actions (admin_id, action_type, target_type, target_id)
      VALUES ($1, 'delete_post'::admin_action_type, 'post'::report_target_type, $2)
      `,
      [adminId, postId]
    );

    await client.query("COMMIT");
    return res
      .status(200)
      .json({ success: true, message: "Post deleted with comments cascaded", data: upPost.rows[0] });
  } catch (e) {
    try { await client.query("ROLLBACK"); } catch (_) {}
    next(e);
  } finally {
    client.release();
  }
};

/**
 * @desc    Ban a user by admin
 * @route   POST /api/v1/admins/banUser/:userId
 * @access  Private/Admin
 */
exports.adminBanUser = async (req, res, next) => {
  const pool = req.app.locals.pool;
  const client = await pool.connect();

  try {
    const adminId = req.admin?.adminId;           // จาก adminProtect
    const userId = Number(req.params.userId);

    if (!adminId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    await client.query("BEGIN");

    // ล็อกแถวผู้ใช้
    const qUser = await client.query(
      `SELECT user_id, user_state
         FROM users
        WHERE user_id = $1
        FOR UPDATE`,
      [userId]
    );
    if (qUser.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const alreadyBanned = qUser.rows[0].user_state === 'ban';

    // อัปเดตเฉพาะเมื่อยังไม่ถูกแบน
    if (!alreadyBanned) {
      await client.query(
        `UPDATE users
            SET user_state = 'ban'::user_state,
                updated_at = now()
          WHERE user_id = $1`,
        [userId]
      );
    }

    // บันทึกแอ็กชันของแอดมิน (ENUM casts ให้ตรงสคีมา)
    await client.query(
      `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id)
       VALUES ($1, 'ban_user'::admin_action_type, 'user'::report_target_type, $2)`,
      [adminId, userId]
    );

    await client.query("COMMIT");
    return res.status(200).json({
      success: true,
      data: { user_id: userId, user_state: 'ban' },
      alreadyBanned
    });
  } catch (e) {
    try { await client.query("ROLLBACK"); } catch (_) {}
    next(e);
  } finally {
    client.release();
  }
};

/**
 * @desc    Unban a user by admin
 * @route   PATCH /api/v1/admins/unbanUser/:userId
 * @access  Private/Admin
 */
exports.adminUnbanUser = async (req, res, next) => {
  const pool = req.app.locals.pool;
  const client = await pool.connect();

  try {
    const adminId = req.admin?.adminId;          // จาก adminProtect
    const userId = Number(req.params.userId);

    if (!adminId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    await client.query("BEGIN");

    // ล็อกแถวผู้ใช้กัน race
    const qUser = await client.query(
      `SELECT user_id, user_state
         FROM users
        WHERE user_id = $1
        FOR UPDATE`,
      [userId]
    );
    if (qUser.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const alreadyNormal = qUser.rows[0].user_state === 'normal';

    // อัปเดตเฉพาะเมื่อยังไม่เป็น normal
    if (!alreadyNormal) {
      await client.query(
        `UPDATE users
            SET user_state = 'normal'::user_state,
                updated_at = now()
          WHERE user_id = $1`,
        [userId]
      );
    }

    // บันทึกแอ็กชันของแอดมิน (ENUM casts ให้ตรงสคีมา)
    await client.query(
      `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id)
       VALUES ($1, 'unban_user'::admin_action_type, 'user'::report_target_type, $2)`,
      [adminId, userId]
    );

    await client.query("COMMIT");
    return res.status(200).json({
      success: true,
      data: { user_id: userId, user_state: 'normal' },
      alreadyNormal
    });
  } catch (e) {
    try { await client.query("ROLLBACK"); } catch (_) {}
    next(e);
  } finally {
    client.release();
  }
};

/**
 * @desc    Admin: view all user account reports
 * @route   GET /api/v1/admins/accounts?status=pending|accepted|rejected
 * @access  Admin
 */
exports.adminGetAccountReports = async (req, res, next) => {
  const pool = req.app.locals.pool;
  try {
    const { status } = req.query;
    const validStatuses = ["pending", "accepted", "rejected"];
    const conditions = [`r.target_type = 'user'`];

    if (status && validStatuses.includes(status)) {
      conditions.push(`r.status = '${status}'`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const sql = `
      SELECT 
        r.report_id, r.reporter_id, r.target_id, r.reason, r.status, r.created_at,
        u1.display_name AS reporter_name,
        u2.display_name AS target_name
      FROM reports r
      JOIN users u1 ON u1.user_id = r.reporter_id
      JOIN users u2 ON u2.user_id = r.target_id
      ${whereClause}
      ORDER BY r.created_at DESC;
    `;

    const { rows } = await pool.query(sql);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};


/**
 * @desc    Admin: view all post reports
 * @route   GET /api/v1/admins/posts?status=pending|accepted|rejected
 * @access  Admin
 */
exports.adminGetPostReports = async (req, res, next) => {
  const pool = req.app.locals.pool;
  try {
    const { status } = req.query;
    const validStatuses = ["pending", "accepted", "rejected"];
    const conditions = [`r.target_type = 'post'`];

    if (status && validStatuses.includes(status)) {
      conditions.push(`r.status = '${status}'`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const sql = `
      SELECT 
        r.report_id, r.reporter_id, r.target_id, r.reason, r.status, r.created_at,
        u1.display_name AS reporter_name,
        p.title AS post_title,
        u2.display_name AS post_owner_name,
        u2.user_name     AS post_owner_username

      FROM reports r
      JOIN users u1 ON u1.user_id = r.reporter_id
      JOIN posts p ON p.post_id = r.target_id
      JOIN users u2 ON u2.user_id = p.user_id
      ${whereClause}
      ORDER BY r.created_at DESC;
    `;

    const { rows } = await pool.query(sql);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};


/**
 * @desc    Admin: view all comment reports
 * @route   GET /api/v1/admins/comments?status=pending|accepted|rejected
 * @access  Admin
 */
exports.adminGetCommentReports = async (req, res, next) => {
  const pool = req.app.locals.pool;
  try {
    const { status } = req.query;
    const validStatuses = ["pending", "accepted", "rejected"];
    const conditions = [`r.target_type = 'comment'`];

    if (status && validStatuses.includes(status)) {
      conditions.push(`r.status = '${status}'`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const sql = `
      SELECT 
        r.report_id, r.reporter_id, r.target_id, r.reason, r.status, r.created_at,
        u1.display_name AS reporter_name,
        c.text AS comment_text,
        u2.display_name AS comment_owner_name
      FROM reports r
      JOIN users u1 ON u1.user_id = r.reporter_id
      JOIN comments c ON c.comment_id = r.target_id
      JOIN users u2 ON u2.user_id = c.user_id
      ${whereClause}
      ORDER BY r.created_at DESC;
    `;

    const { rows } = await pool.query(sql);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Admin: update report status (accept / reject)
 * @route   PATCH /api/v1/reports/:id/status
 * @access  Admin
 */
exports.adminUpdateReportStatus = async (req, res, next) => {
  const pool = req.app.locals.pool;
  try {
    // รองรับได้ทั้ง :id และ :reportId
    const idParam = req.params.id ?? req.params.reportId ?? req.params.report_id;
    const { status } = req.body;

    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const reportId = Number.parseInt(idParam, 10);
    if (!Number.isInteger(reportId) || reportId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid report id" });
    }

    const adminId = req.admin?.admin_id;
    if (!adminId) {
      return res.status(403).json({ success: false, message: 'Admin authentication required' });
    }

    const sql = `
      UPDATE reports
      SET status = $1::report_status,
          admin_id = COALESCE($3, admin_id)
      WHERE report_id = $2
      RETURNING report_id, target_type, target_id, status, admin_id;
    `;
    const { rows } = await pool.query(sql, [status, reportId, adminId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Report #${reportId} updated to '${status}'`,
      data: rows[0],
    });
  } catch (err) {
    next(err);
  }
};