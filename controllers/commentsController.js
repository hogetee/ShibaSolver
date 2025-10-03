// helper เล็ก ๆ สำหรับ validation แบบง่าย
function isNonEmptyString(s) {
  return typeof s === "string" && s.trim().length > 0;
}

/**
 * @desc    Get all comments of the current user
 * @route   GET /api/v1/comments/me
 * @access  Private
 */
exports.getMyComments = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.id; // มาจาก JWT middleware

    const sql = `
      SELECT 
          c.comment_id,
          c.user_id,
          c.post_id,
          c.parent_comment,
          c.text,
          c.comment_image,
          c.is_solution,
          c.is_updated,
          c.created_at,
          COALESCE(SUM(CASE WHEN r.rating_type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
          COALESCE(SUM(CASE WHEN r.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
          COALESCE(COUNT(r.rating_id), 0) AS total_votes
      FROM comments c
      LEFT JOIN ratings r ON c.comment_id = r.comment_id
      WHERE c.user_id = $1
      GROUP BY c.comment_id
      ORDER BY c.created_at DESC;
    `;

    const { rows } = await pool.query(sql, [userId]);

    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get top comment (most popular) of a post
 * @route   GET /api/v1/comments/post/:postId/top
 * @access  Public
 */
exports.getTopComment = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid postId" });
    }

    const sql = `
      SELECT 
          c.comment_id,
          c.user_id,
          c.post_id,
          c.text,
          c.comment_image,
          c.is_solution,
          c.is_updated,
          c.created_at,
          COALESCE(SUM(CASE WHEN r.rating_type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
          COALESCE(SUM(CASE WHEN r.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
          COALESCE(COUNT(r.rating_id), 0) AS total_votes
      FROM comments c
      LEFT JOIN ratings r ON c.comment_id = r.comment_id
      WHERE c.post_id = $1
      GROUP BY c.comment_id
      ORDER BY total_votes DESC, c.created_at ASC, c.comment_id ASC
      LIMIT 1;
    `;
    const { rows } = await pool.query(sql, [postId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "No comments found for this post" });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};


/**
 * @desc    Get all comments from post ordered by popularity (likes + dislikes)
 * @route   GET /api/v1/comments/post/:postId/popular
 * @access  Private
 */
exports.getCommentsByPopularity = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid postId" });
    }

    const sql = `
      SELECT 
          c.comment_id,
          c.user_id,
          c.post_id,
          c.parent_comment,
          c.text,
          c.comment_image,
          c.is_solution,
          c.is_updated,
          c.created_at,
          COALESCE(SUM(CASE WHEN r.rating_type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
          COALESCE(SUM(CASE WHEN r.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
          COALESCE(COUNT(r.rating_id), 0) AS total_votes
      FROM comments c
      LEFT JOIN ratings r ON c.comment_id = r.comment_id
      WHERE c.post_id = $1
      GROUP BY c.comment_id
      ORDER BY total_votes DESC, c.created_at ASC, c.comment_id ASC;
    `;
    const { rows } = await pool.query(sql, [postId]);

    return res
      .status(200)
      .json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all comments from post ordered by latest (newest first)
 * @route   GET /api/v1/comments/post/:postId/latest
 * @access  Private
 */
exports.getCommentsByLatest = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid postId" });
    }

    const sql = `
      SELECT 
          c.comment_id,
          c.user_id,
          c.post_id,
          c.parent_comment,
          c.text,
          c.comment_image,
          c.is_solution,
          c.is_updated,
          c.created_at,
          COALESCE(SUM(CASE WHEN r.rating_type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
          COALESCE(SUM(CASE WHEN r.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
          COALESCE(COUNT(r.rating_id), 0) AS total_votes
      FROM comments c
      LEFT JOIN ratings r ON c.comment_id = r.comment_id
      WHERE c.post_id = $1
      GROUP BY c.comment_id
      ORDER BY c.created_at DESC, c.comment_id DESC;
    `;
    const { rows } = await pool.query(sql, [postId]);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all comments from post ordered by oldest (oldest first)
 * @route   GET /api/v1/comments/post/:postId/oldest
 * @access  Private
 */
exports.getCommentsByOldest = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid postId" });
    }

    const sql = `
      SELECT 
          c.comment_id,
          c.user_id,
          c.post_id,
          c.parent_comment,
          c.text,
          c.comment_image,
          c.is_solution,
          c.is_updated,
          c.created_at,
          COALESCE(SUM(CASE WHEN r.rating_type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
          COALESCE(SUM(CASE WHEN r.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
          COALESCE(COUNT(r.rating_id), 0) AS total_votes
      FROM comments c
      LEFT JOIN ratings r ON c.comment_id = r.comment_id
      WHERE c.post_id = $1
      GROUP BY c.comment_id
      ORDER BY c.created_at ASC, c.comment_id ASC;
    `;
    const { rows } = await pool.query(sql, [postId]);
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single comment by ID
 * @route   GET /api/v1/comments/:id
 * @access  Private
 */
exports.getComment = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const commentId = Number(req.params.id);

    if (!Number.isInteger(commentId) || commentId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid commentId" });
    }

    const sql = `
      SELECT 
        c.comment_id, 
        c.user_id, 
        c.post_id, 
        c.parent_comment, 
        c.text,
        c.comment_image, 
        c.is_solution, 
        c.is_updated, 
        c.created_at,
        COALESCE(SUM(CASE WHEN r.rating_type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
        COALESCE(SUM(CASE WHEN r.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
        COALESCE(COUNT(r.rating_id), 0) AS total_votes
      FROM comments c
      LEFT JOIN ratings r ON c.comment_id = r.comment_id
      WHERE c.comment_id = $1
      GROUP BY c.comment_id
      LIMIT 1;
    `;

    const { rows } = await pool.query(sql, [commentId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a comment
 * @route   POST /api/v1/comments
 * @access  Private
 * @request {post_id, text, parent_comment, comment_image (optional)}
 */
exports.createComment = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.id; // จาก JWT middleware
    const { post_id, text, parent_comment, comment_image } = req.body || {};

    // 1) validate input ขั้นพื้นฐาน
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (
      !(
        Number.isInteger(post_id) ||
        (typeof post_id === "string" && /^\d+$/.test(post_id))
      )
    ) {
      return res.status(400).json({ error: "post_id must be an integer" });
    }
    if (!isNonEmptyString(text)) {
      return res.status(400).json({ error: "text is required" });
    }
    if (
      parent_comment != null &&
      !(
        Number.isInteger(parent_comment) ||
        (typeof parent_comment === "string" && /^\d+$/.test(parent_comment))
      )
    ) {
      return res
        .status(400)
        .json({ error: "parent_comment must be an integer if provided" });
    }

    // 2) เปิด transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 3) เช็คว่า post มีอยู่จริง
      const postRes = await client.query(
        "SELECT post_id FROM posts WHERE post_id = $1",
        [post_id]
      );
      if (postRes.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "post not found" });
      }

      // 4) ถ้ามี parent_comment ให้เช็คว่าอยู่โพสต์เดียวกัน
      let parentId = null;
      if (parent_comment != null) {
        const parentRes = await client.query(
          "SELECT comment_id, post_id FROM comments WHERE comment_id = $1",
          [parent_comment]
        );
        if (parentRes.rowCount === 0) {
          await client.query("ROLLBACK");
          return res
            .status(400)
            .json({ error: "parent_comment does not exist" });
        }
        if (Number(parentRes.rows[0].post_id) !== Number(post_id)) {
          await client.query("ROLLBACK");
          return res
            .status(400)
            .json({ error: "parent_comment must belong to the same post" });
        }
        parentId = parent_comment;
      }

      // 5) INSERT comment
      const insertRes = await client.query(
        `INSERT INTO comments (user_id, post_id, parent_comment, text, comment_image)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING comment_id, user_id, post_id, parent_comment, text, comment_image, is_solution, is_updated, created_at`,
        [userId, post_id, parentId, text.trim(), comment_image ?? null]
      );

      await client.query("COMMIT");

      return res.status(201).json({ data: insertRes.rows[0] });
    } catch (e) {
      await client.query("ROLLBACK");
      // จัดการ error ของ FK/constraint
      if (e.code === "23503") {
        // foreign_key_violation
        return res
          .status(400)
          .json({ error: "Foreign key violation", detail: e.detail });
      }
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("createComment error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Edit a comment
 * @route   PUT /api/v1/comments/:id
 * @access  Private
 */
exports.editComment = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const commentId = Number(req.params.id);
    const userId = req.user.id; // จาก JWT middleware
    const { text, comment_image } = req.body;

    if (!Number.isInteger(commentId) || commentId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid commentId" });
    }
    if (!text && !comment_image) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    const sql = `
      UPDATE comments
      SET 
        text = COALESCE($2, text),
        comment_image = COALESCE($3, comment_image),
        is_updated = TRUE
      WHERE comment_id = $1 AND user_id = $4
      RETURNING comment_id, user_id, post_id, parent_comment, text, comment_image, 
                is_solution, is_updated, created_at;
    `;
    const { rows } = await pool.query(sql, [commentId, text ?? null, comment_image ?? null, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Comment not found or not authorized" });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/v1/comments/:id
 * @access  Private
 */
exports.deleteComment = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const commentId = Number(req.params.id);
    const userId = req.user.id; // จาก JWT middleware

    if (!Number.isInteger(commentId) || commentId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid commentId" });
    }

    const sql = `
      DELETE FROM comments
      WHERE comment_id = $1 AND user_id = $2
      RETURNING comment_id;
    `;
    const { rows } = await pool.query(sql, [commentId, userId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Comment not found or not authorized" });
    }

    return res.status(200).json({ success: true, message: "Comment deleted", data: rows[0] });
  } catch (err) {
    next(err);
  }
};