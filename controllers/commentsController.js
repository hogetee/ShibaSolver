// helper เล็ก ๆ สำหรับ validation แบบง่าย
function isNonEmptyString(s) {
  return typeof s === 'string' && s.trim().length > 0;
}

/**
 * @desc    Get all comments
 * @route   GET /api/v1/comments
 * @access  Private
 */
exports.getAllComments = (req, res) => {
  res.status(200).json({ success: true, where: 'listComments', data: [] });
};

/**
 * @desc    Get a single comment by ID
 * @route   GET /api/v1/comments/:id
 * @access  Private
 */
exports.getComment = (req, res) => {
  res.status(200).json({ success: true, where: 'getComment', id: req.params.id });
};




exports.createComment = async (req, res) => {
  try {
    const pool = req.app.locals.pool; 
    const userId = req.user.id; // จาก JWT middleware
    const { post_id, text, parent_comment, comment_image } = req.body || {};

    // 1) validate input ขั้นพื้นฐาน
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!(Number.isInteger(post_id) || (typeof post_id === 'string' && /^\d+$/.test(post_id)))) {
      return res.status(400).json({ error: 'post_id must be an integer' });
    }
    if (!isNonEmptyString(text)) {
      return res.status(400).json({ error: 'text is required' });
    }
    if (parent_comment != null && !(Number.isInteger(parent_comment) || (typeof parent_comment === 'string' && /^\d+$/.test(parent_comment)))) {
      return res.status(400).json({ error: 'parent_comment must be an integer if provided' });
    }

    // 2) เปิด transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 3) เช็คว่า post มีอยู่จริง
      const postRes = await client.query(
        'SELECT post_id FROM posts WHERE post_id = $1',
        [post_id]
      );
      if (postRes.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'post not found' });
      }

      // 4) ถ้ามี parent_comment ให้เช็คว่าอยู่โพสต์เดียวกัน
      let parentId = null;
      if (parent_comment != null) {
        const parentRes = await client.query(
          'SELECT comment_id, post_id FROM comments WHERE comment_id = $1',
          [parent_comment]
        );
        if (parentRes.rowCount === 0) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'parent_comment does not exist' });
        }
        if (Number(parentRes.rows[0].post_id) !== Number(post_id)) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'parent_comment must belong to the same post' });
        }
        parentId = parent_comment;
      }

      // 5) INSERT comment
      const insertRes = await client.query(
        `INSERT INTO comments (user_id, post_id, parent_comment, text, comment_image)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING comment_id, user_id, post_id, parent_comment, text, comment_image, is_solution, created_at`,
        [userId, post_id, parentId, text.trim(), comment_image ?? null]
      );

      await client.query('COMMIT');

      return res.status(201).json({ data: insertRes.rows[0] });
    } catch (e) {
      await client.query('ROLLBACK');
      // จัดการ error ของ FK/constraint
      if (e.code === '23503') {
        // foreign_key_violation
        return res.status(400).json({ error: 'Foreign key violation', detail: e.detail });
      }
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('createComment error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};