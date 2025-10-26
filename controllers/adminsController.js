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
exports.getAdmin = (req, res) => {
  res.status(200).json({ success: true, where: "getAdmin", id: req.params.id });
};


/**
 * @desc    Delete a post by ID
 * @route   DELETE /api/v1/admin/posts/:postId
 * @access  Private/Admin
 */
exports.adminDeletePost = async (req, res, next) => {
  const pool = req.app.locals.pool;
  const client = await pool.connect();

  try {
    const postId = Number(req.params.postId);
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
      return res
        .status(404)
        .json({ success: false, message: "Post not found or already deleted" });
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

    // 3) บันทึก admin actio
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