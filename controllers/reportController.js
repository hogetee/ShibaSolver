/**
 * @desc    Report a violating account (user)
 * @route   POST /api/v1/reports/accounts
 * @access  Private
 * @body    { target_id: number, reason: string }
 */
exports.reportAccount = async (req, res, next) => {
  const pool = req.app.locals.pool;
  try {
    const reporterId = req.user?.uid;
    const { target_id, reason } = req.body || {};

    // 1 Validation
    if (!reporterId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!Number.isInteger(target_id) || target_id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid target_id" });
    }
    if (reporterId === target_id) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot report yourself" });
    }
    if (!reason || typeof reason !== "string" || reason.trim().length < 3) {
      return res
        .status(400)
        .json({ success: false, message: "Reason is required and must be valid" });
    }

    // 2 ตรวจสอบว่า user ที่ถูกรายงานมีอยู่จริง
    const userCheck = await pool.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [target_id]
    );
    if (userCheck.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Target user not found" });
    }

    // 3 ป้องกันการรายงานซ้ำภายใน 24 ชม.
    const dupCheck = await pool.query(
      `SELECT report_id 
       FROM reports 
       WHERE reporter_id = $1 
         AND target_type = 'user'
         AND target_id = $2
         AND created_at >= (now() - interval '24 hours')
       LIMIT 1`,
      [reporterId, target_id]
    );
    if (dupCheck.rowCount > 0) {
      return res.status(429).json({
        success: false,
        message: "You have already reported this user recently",
      });
    }

    // 4 บันทึกลง reports table
    const insert = await pool.query(
      `INSERT INTO reports (reporter_id, target_type, target_id, reason)
       VALUES ($1, 'user', $2, $3)
       RETURNING report_id, reporter_id, target_type, target_id, reason, status, created_at`,
      [reporterId, target_id, reason.trim()]
    );

    // 5 แจ้งเตือนแอดมิน (ถ้ามี notifications table)
    await pool.query(
      `INSERT INTO notifications (receiver_id, sender_id, notification_type, payload)
       SELECT a.admin_id, $1, 'user_report', jsonb_build_object('target_id',$2,'report_id',$3)
       FROM admins a
       WHERE a.is_active = TRUE`,
      [reporterId, target_id, insert.rows[0].report_id]
    ).catch(() => {}); // เผื่อไม่มี notifications table

    return res.status(201).json({
      success: true,
      message: "User reported successfully",
      data: insert.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Report a violating post or comment
 * @route   POST /api/v1/reports/content
 * @access  Private
 * @body    { target_type: "post"|"comment", target_id: number, reason: string }
 */
exports.reportPostOrComment = async (req, res, next) => {
  const pool = req.app.locals.pool;
  try {
    const reporterId = req.user?.uid;
    const { target_type, target_id, reason } = req.body || {};

    // 1 Validation
    if (!reporterId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const allowedTypes = ["post", "comment"];
    if (!allowedTypes.includes(target_type)) {
      return res.status(400).json({
        success: false,
        message: `target_type must be one of: ${allowedTypes.join(", ")}`,
      });
    }

    if (!Number.isInteger(target_id) || target_id <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid target_id" });
    }

    if (!reason || typeof reason !== "string" || reason.trim().length < 3) {
      return res
        .status(400)
        .json({ success: false, message: "Reason is required and must be valid" });
    }

    // 2 ตรวจสอบว่า content มีอยู่จริงและยังไม่ถูกลบ
    let checkSql = "";
    if (target_type === "post") {
      checkSql = `SELECT post_id FROM posts WHERE post_id = $1 AND is_deleted = FALSE`;
    } else {
      checkSql = `SELECT comment_id FROM comments WHERE comment_id = $1 AND is_deleted = FALSE`;
    }

    const check = await pool.query(checkSql, [target_id]);
    if (check.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: `The ${target_type} you are trying to report has been removed or not found`,
      });
    }

    // 3 ป้องกันการรายงานซ้ำใน 24 ชม.
    const dup = await pool.query(
      `SELECT report_id
       FROM reports
       WHERE reporter_id = $1
         AND target_type = $2
         AND target_id = $3
         AND created_at >= (now() - interval '24 hours')
       LIMIT 1`,
      [reporterId, target_type, target_id]
    );

    if (dup.rowCount > 0) {
      return res.status(429).json({
        success: false,
        message: `You have already reported this ${target_type} recently`,
      });
    }

    // 4 แทรกข้อมูลรีพอร์ตใหม่
    const insert = await pool.query(
      `INSERT INTO reports (reporter_id, target_type, target_id, reason)
       VALUES ($1, $2, $3, $4)
       RETURNING report_id, reporter_id, target_type, target_id, reason, status, created_at`,
      [reporterId, target_type, target_id, reason.trim()]
    );

    // 5 แจ้งเตือนแอดมิน (optional)
    await pool.query(
      `INSERT INTO notifications (receiver_id, sender_id, notification_type, payload)
       SELECT a.admin_id, $1, 'content_report', jsonb_build_object('target_type',$2,'target_id',$3,'report_id',$4)
       FROM admins a
       WHERE a.is_active = TRUE`,
      [reporterId, target_type, target_id, insert.rows[0].report_id]
    ).catch(() => {});

    return res.status(201).json({
      success: true,
      message: `${target_type} reported successfully`,
      data: insert.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

