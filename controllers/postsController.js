/**
 * @desc    Get a single post by ID
 * @route   GET /api/v1/posts/:id
 * @access  Private
 */
exports.getPost = async (req, res,next) => {
  try {
    const pool = req.app.locals.pool;
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid postId" });
    }

    //request the post with author info
    const postSql = `
      SELECT p.post_id, p.title, p.description, p.post_image, p.is_solved, p.created_at,
      u.user_id AS author_id, u.user_name, u.display_name, u.profile_picture
      FROM posts p
      JOIN users u ON u.user_id = p.user_id
      WHERE p.post_id = $1
      LIMIT 1;
    `;
    const postRes = await pool.query(postSql, [postId]);
    if (postRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    const post = postRes.rows[0];

    return res.status(200).json({ success: true, data: post});

  }catch (e) {
    next(e);
  }
};


/**
 * @desc    Create a new post
 * @route   POST /api/v1/posts
 * @access  Private
 */
exports.createPost = async (req, res, next) => {
  try {
    const user_id = req.user.uid; // user ID is from token
    const { title, description, post_image } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const pool = req.app.locals.pool;
    const sql = `
      INSERT INTO public.posts (user_id, title, description, post_image)
      VALUES ($1, $2, $3, $4)
      RETURNING post_id, user_id, title, description, post_image, created_at
    `;
    const { rows } = await pool.query(sql, [user_id, title, description, post_image || null]);

    return res.status(201).json({ success: true, data: rows[0] });
  } catch (e) {
    next(e);
  }
};

/**
 * @desc    Edit a post
 * @route   PUT /api/v1/posts/:id
 * @access  Private
 */
exports.editPost = async (req, res, next) => {
  try {
    const user_id = req.user.uid; // user ID is from token
    const postId = Number(req.params.postId);
    const { title, description, post_image, is_solved } = req.body;
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid postId" });
    }
    const pool = req.app.locals.pool;
    const sql = `
      UPDATE public.posts
      SET 
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        post_image = COALESCE($4, post_image),
        is_solved = COALESCE($5, is_solved)
      WHERE post_id = $1 AND user_id = $6
      RETURNING post_id, user_id, title, description, post_image, is_solved, created_at
    `;
    const { rows } = await pool.query(sql, [postId, 
                                            title ?? null, 
                                            description ?? null, 
                                            post_image ?? null, 
                                            is_solved ?? false, 
                                            user_id]
                                      );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Post not found or not authorized" });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (e) {
    next(e);
  }
}


/**
 * @desc    delete own post
 * @route   DELETE /api/v1/posts/:postId
 * @access  Private
 */

exports.deletePost = async (req, res, next) => {
  try {
    const user_id = req.user.uid; // user ID is from token
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid postId" });
    }
    const pool = req.app.locals.pool;
    const sql = `
      DELETE FROM public.posts
      WHERE post_id = $1 and user_id = $2 
      RETURNING post_id`;

    const { rows } = await pool.query(sql, [postId, user_id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Post not found or not authorized" });
    }
    return res.status(200).json({ success: true, message: "Post deleted", data: rows[0] });
  } catch (e) {
      next(e);
  } 
};

/**
 * @desc    Refresh the feed
 * @route   GET /api/v1/posts/feed
 * @access  Private
 */
exports.refreshFeed = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const { rows } = await pool.query(
      `SELECT * FROM public.posts
      ORDER BY created_at DESC`
    ); //order by creation date desc, might be changed later

    return res.status(200).json({ success: true, count: rows.length, rows });
  } catch (e) {
    next(e);
  }
};

/**
 * @desc    Add a bookmark
 * @route   POST /api/v1/posts/bookmarks
 * @access  Private
 */
exports.addBookmark = async (req, res, next) => {
  try {
    // const { user_id, post_id } = req.body;
    const { post_id } = req.body;
    const user_id = req.user.uid; // เอาจาก token
    if (!/^\d+$/.test(String(user_id)) || !/^\d+$/.test(String(post_id))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user_id or post_id" });
    }

    const pool = req.app.locals.pool;

    // SINGLE query: insert or do nothing, then check rowCount via RETURNING
    const sql = `
      INSERT INTO public.bookmarks (user_id, post_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, post_id) DO NOTHING
      RETURNING user_id, post_id, created_at
    `;
    const { rows } = await pool.query(sql, [user_id, post_id]);

    if (rows.length === 1) {
      return res.status(201).json({ success: true, data: rows[0] });
    }
    return res
      .status(200)
      .json({ success: false, message: "Already bookmarked" });
  } catch (e) {
    if (e.code === "23503") {
      // FK violation
      return res
        .status(400)
        .json({ success: false, message: "user_id or post_id does not exist" });
    }
    next(e);
  }
};

/**
 * @desc    Get bookmarks for a user
 * @route   GET /api/v1/posts/bookmarks
 * @access  Private
 */

exports.getBookmarks = async (req, res, next) => {
  try {
    // const { user_id } = req.params;
    const user_id = req.user.uid;  // เอาจาก token
    if (!/^\d+$/.test(String(user_id))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user_id" });
    }

    const pool = req.app.locals.pool;
    const { rows } = await pool.query(
      `SELECT
      b.user_id, b.post_id, b.created_at AS bookmarked_at,
      p.post_id AS pid, p.title, p.description, p.post_image, p.is_solved, p.created_at AS post_created_at,
      u.user_id AS author_id, u.user_name, u.display_name, u.profile_picture
      FROM public.bookmarks b
      JOIN public.posts p ON p.post_id = b.post_id
      JOIN public.users u ON u.user_id = p.user_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC`,
      [user_id]
    );

    return res.status(200).json({ success: true, count: rows.length, rows });
  } catch (e) {
    next(e);
  }
};
