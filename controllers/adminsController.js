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