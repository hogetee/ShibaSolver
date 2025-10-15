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
    const userId = req.user.uid; // จาก JWT middleware

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
      WHERE c.user_id = $1 AND is_deleted = FALSE
      GROUP BY c.comment_id
      ORDER BY c.created_at DESC;
    `;

    const { rows } = await pool.query(sql, [userId]);

    return res
      .status(200)
      .json({ success: true, count: rows.length, data: rows });
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid postId" });
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
      WHERE c.post_id = $1 AND is_deleted = FALSE
      GROUP BY c.comment_id
      ORDER BY total_votes DESC, c.created_at ASC, c.comment_id ASC
      LIMIT 1;
    `;
    const { rows } = await pool.query(sql, [postId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No comments found for this post" });
    }

    return res.status(200).json({ success: true, data: rows[0] });
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
      WHERE c.comment_id = $1 AND is_deleted = FALSE
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
    const userId = req.user?.uid; // จาก JWT middleware
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
          "SELECT comment_id, post_id FROM comments WHERE comment_id = $1 AND is_deleted = FALSE",
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
    const userId = req.user.uid; // จาก JWT middleware
    const { text, comment_image } = req.body;

    if (!Number.isInteger(commentId) || commentId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid commentId" });
    }
    if (typeof text === "string") text = text.trim();
    if (!text && !comment_image) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing to update" });
    }

    const sql = `
      UPDATE comments
      SET 
        text = COALESCE($2, text),
        comment_image = COALESCE($3, comment_image),
        is_updated = TRUE
      WHERE comment_id = $1 AND user_id = $4 AND is_deleted = FALSE
      RETURNING comment_id, user_id, post_id, parent_comment, text, comment_image, 
                is_solution, is_updated, created_at;
    `;
    const { rows } = await pool.query(sql, [
      commentId,
      text ?? null,
      comment_image ?? null,
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or not authorized",
      });
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
    const userId = req.user.uid; // จาก JWT middleware

    if (!Number.isInteger(commentId) || commentId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid commentId" });
    }
    // เปลี่ยนจาก DELETE -> UPDATE (soft delete)
    const sql = `
      UPDATE comments
      SET is_deleted = TRUE
      WHERE comment_id = $1 AND user_id = $2 AND is_deleted = FALSE
      RETURNING comment_id;
    `;
    const { rows } = await pool.query(sql, [commentId, userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or not authorized",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Comment deleted", data: rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Toggle flag/unflag solution on a comment
 * @route   PATCH /api/v1/comments/:commentId/solution
 * @access  Private
 */
exports.toggleMyCommentSolution = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.uid;
    const { commentId } = req.params;

    const { rows } = await pool.query(
      `SELECT comment_id, user_id, is_solution
       FROM comments
       WHERE comment_id = $1 AND is_deleted = FALSE`,
      [commentId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Comment not found" });
    }

    const comment = rows[0];

    if (Number(comment.user_id) !== Number(userId)) {
      return res.status(403).json({
        success: false,
        error: "You are not the owner of this comment",
      });
    }

    const newValue = !comment.is_solution;

    const update = await pool.query(
      `UPDATE comments
       SET is_solution = $1,
           is_updated  = TRUE
       WHERE comment_id = $2 AND is_deleted = FALSE
       RETURNING comment_id, user_id, is_solution, is_updated, created_at`,
      [newValue, commentId]
    );

    return res.status(200).json({
      success: true,
      data: update.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reply to a comment
 * @route   POST /api/v1/comments/:commentId/replies
 * @access  Private
 */
exports.replyToComment = async (req, res, next) => {
  const client = await req.app.locals.pool.connect();
  try {
    const actorUserId = req.user.uid;
    const { commentId } = req.params; // parent comment id
    const { text, comment_image } = req.body;

    if (!text || !text.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Text is required" });
    }

    await client.query("BEGIN");

    // 1) หา parent (ถ้า delete ไปแล้ว จะไม่พบ)
    const par = await client.query(
      `SELECT comment_id, user_id AS parent_user_id, post_id
       FROM comments
       WHERE comment_id = $1 AND is_deleted = FALSE`,
      [commentId]
    );
    if (par.rowCount === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ success: false, error: "Parent comment not found" });
    }
    const parent = par.rows[0];

    // 2) สร้าง reply (ผูก post เดียวกับ parent)
    const ins = await client.query(
      `INSERT INTO comments (user_id, post_id, parent_comment, text, comment_image, is_updated)
       VALUES ($1, $2, $3, $4, $5, FALSE)
       RETURNING comment_id, user_id, post_id, parent_comment, text, comment_image, is_solution, is_updated, created_at`,
      [
        actorUserId,
        parent.post_id,
        commentId,
        text.trim(),
        comment_image || null,
      ]
    );
    const reply = ins.rows[0];

    // 3) แจ้งเตือน (อย่าแจ้งเตือนถ้าตอบคอมเมนต์ตัวเอง)
    if (parent.parent_user_id !== actorUserId) {
      await client.query(
        `INSERT INTO notifications
         (receiver_id, sender_id, post_id, comment_id, parent_comment_id, notification_type)
         VALUES ($1, $2, $3, $4, $5, 'reply')`,
        [
          parent.parent_user_id,
          actorUserId,
          parent.post_id,
          reply.comment_id,
          parent.comment_id,
        ]
      );
    }

    await client.query("COMMIT");
    return res.status(201).json({ success: true, data: reply });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (_) {}
    next(err);
  } finally {
    client.release();
  }
};

/**
 * @desc    Get all comments from a specific post with sorting and optional solution filtering.
 * @access  Internal
 */
async function fetchCommentsByPost(
  pool,
  postId,
  sort = "latest",
  filterSolutionsForAnonymous = false
) {
  let orderBy = `c.created_at DESC, c.comment_id DESC`;
  switch (sort) {
    case "popular":
      orderBy = `total_votes DESC, c.created_at ASC, c.comment_id ASC`;
      break;
    case "oldest":
      orderBy = `c.created_at ASC, c.comment_id ASC`;
      break;
    case "ratio":
      orderBy = `ratio DESC NULLS LAST, total_votes DESC, c.created_at ASC`;
      break;
  }

  const sql = `
    WITH agg AS (
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
        COALESCE(SUM(CASE WHEN r.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
      FROM comments c
      LEFT JOIN ratings r ON c.comment_id = r.comment_id
      WHERE c.post_id = $1 AND c.is_deleted = FALSE
      GROUP BY c.comment_id
    )
    SELECT *,
      (likes + dislikes) AS total_votes,
      CASE WHEN (likes + dislikes) > 0 THEN (likes::decimal / (likes + dislikes)) ELSE NULL END AS ratio
    FROM agg
    ${filterSolutionsForAnonymous ? `WHERE is_solution = FALSE` : ``}
    ORDER BY ${orderBy};
  `;

  const { rows } = await pool.query(sql, [postId]);
  return rows;
}
exports.fetchCommentsByPost = fetchCommentsByPost;

/**
 * @desc    Get all comments from post with sort option
 * @route   GET /api/v1/comments/post/:postId?sort=popular|latest|oldest
 * @access  Private
 */
exports.getComments = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const postId = Number(req.params.postId);
    const sort = (req.query.sort || "latest").toLowerCase();

    if (!Number.isInteger(postId) || postId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid postId" });
    }

    const rows = await fetchCommentsByPost(pool, postId, sort);
    return res
      .status(200)
      .json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get comments with access control (30-day / premium rules)
 * @route   GET /api/v1/comments/post/:postId?sort=popular|latest|oldest|ratio
 * @access  Public (optionalAuth)
 */
exports.getCommentsAccessControlled = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const postId = Number(req.params.postId);
    const sort = (req.query.sort || "latest").toLowerCase();

    if (!Number.isInteger(postId) || postId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid postId" });
    }

    // ตรวจ post อายุ
    const postQ = await pool.query(
      `
      SELECT post_id, created_at,
             CASE WHEN created_at >= (now() - interval '30 days') THEN TRUE ELSE FALSE END AS is_recent
      FROM posts WHERE post_id = $1 LIMIT 1`,
      [postId]
    );

    if (postQ.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    const post = postQ.rows[0];
    const isRecent = !!post.is_recent;

    // ตรวจ user/premium
    let currentUserId = req.user?.uid ?? null;
    let isPremium = false;
    if (currentUserId) {
      const u = await pool.query(
        `SELECT is_premium FROM users WHERE user_id = $1`,
        [currentUserId]
      );
      if (u.rowCount === 1) isPremium = !!u.rows[0].is_premium;
    }

    // เงื่อนไข access
    if (!currentUserId && !isRecent)
      return res.status(200).json({
        success: true,
        restricted: true,
        reason: "LOGIN_REQUIRED",
        data: [],
      });

    if (currentUserId && !isRecent && !isPremium)
      return res.status(200).json({
        success: true,
        restricted: true,
        reason: "PREMIUM_REQUIRED",
        data: [],
      });

    // ดึง comment data โดย reuse getComments logic
    const filterSolutionsForAnonymous = !currentUserId && isRecent;
    const rows = await fetchCommentsByPost(
      pool,
      postId,
      sort,
      filterSolutionsForAnonymous
    );

    return res.status(200).json({
      success: true,
      restricted: false,
      reason: null,
      post: {
        post_id: post.post_id,
        created_at: post.created_at,
        is_recent_30d: isRecent,
      },
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    next(err);
  }
};
