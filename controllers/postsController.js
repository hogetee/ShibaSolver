/**
 * @desc    Get a single post by ID
 * @route   GET /api/v1/posts/:id
 * @access  Private
 * @return {post_id, title, description, post_image, is_solved, created_at, poster_id, tags: []}
 */
exports.getPost = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const postId = Number(req.params.postId);
    const userId = req.user?.uid || null;

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid postId" });
    }

    const sql = `
      SELECT 
        p.post_id, p.title, p.description, p.post_image, p.is_solved, p.created_at,p.is_deleted,
        json_build_object(
          'user_id', u.user_id,
          'display_name', u.display_name,
          'profile_picture', u.profile_picture
        ) AS author,
        COALESCE(SUM(CASE WHEN r_all.rating_type = 'like' THEN 1 ELSE 0 END), 0)    AS likes,
        COALESCE(SUM(CASE WHEN r_all.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
        CASE 
          WHEN MAX(CASE WHEN r_me.rating_type = 'like' THEN 1 END) = 1 THEN TRUE
          WHEN MAX(CASE WHEN r_me.rating_type = 'dislike' THEN 1 END) = 1 THEN FALSE
          ELSE NULL
        END AS my_rating
      FROM posts p
      JOIN users u ON u.user_id = p.user_id
      LEFT JOIN ratings r_all ON r_all.post_id = p.post_id
      LEFT JOIN ratings r_me ON r_me.post_id = p.post_id AND r_me.user_id = $2
      WHERE p.post_id = $1
      GROUP BY p.post_id, u.user_id, u.display_name, u.profile_picture
      LIMIT 1;
    `;

    const postRes = await pool.query(sql, [postId, userId]);
    if (postRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }else if (postRes.rows[0].is_deleted) {
      return res.status(410).json({ success: false, message: "Post has been deleted" });
    }

    const post = postRes.rows[0];

    const tagSql = `
      SELECT t.tag_name 
      FROM post_tags pt
      JOIN tags t ON t.tag_id = pt.tag_id
      WHERE pt.post_id = $1;
    `;
    const tagRes = await pool.query(tagSql, [postId]);
    post.tags = tagRes.rows.map(row => row.tag_name);

    return res.status(200).json({ success: true, data: post });
  } catch (e) {
    console.error(e);
    next(e);
  }
};


/**
 * @desc    Create a new post
 * @route   POST /api/v1/posts
 * @access  Private
 * @request {user_id, title, description, post_image, tags: [tag1, tag2, ...]}
 */
exports.createPost = async (req, res, next) => {
  const pool = req.app.locals.pool;
  const client = await pool.connect();
  try {
    const user_id = req.user.uid;
    const { title, description, post_image, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }
    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ success: false, message: "Tags must be a non-empty array" });
    }

    await client.query("BEGIN");

    // Check if all tags exist
    const tagCheckSql = `SELECT tag_name FROM public.tags WHERE tag_name = ANY($1)`;
    const { rows: foundTags } = await client.query(tagCheckSql, [tags]);
    const foundTagNames = foundTags.map(row => row.tag_name);
    const missingTags = tags.filter(tag => !foundTagNames.includes(tag));
    if (missingTags.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: `Tag(s) do not exist: ${missingTags.join(", ")}`
      });
    }

    // Insert post
    const sql = `
      INSERT INTO public.posts (user_id, title, description, post_image)
      VALUES ($1, $2, $3, $4)
      RETURNING post_id, user_id, title, description, post_image, created_at
    `;
    const { rows } = await client.query(sql, [user_id, title, description, post_image || null]);
    const post = rows[0];

    // Insert tags
    const tagInsertSql = `
      INSERT INTO public.post_tags (post_id, tag_id)
      SELECT $1, tag_id FROM public.tags WHERE tag_name = ANY($2)
      ON CONFLICT (post_id, tag_id) DO NOTHING
    `;
    await client.query(tagInsertSql, [post.post_id, tags]);

    await client.query("COMMIT");
    return res.status(201).json({ success: true, data: post, tags: tags });
  } catch (e) {
    await client.query("ROLLBACK");
    next(e);
  } finally {
    client.release();
  }
};

/**
 * @desc    Edit a post and update its tags
 * @route   PUT /api/v1/posts/:id
 * @access  Private
 * @request {title, description, post_image, is_solved, tags: [tag1, tag2, ...]}
 */
exports.editPost = async (req, res, next) => {
  try {
    const user_id = req.user.uid; // user ID is from token
    const postId = Number(req.params.postId);
    const { title, description, post_image, is_solved, tags } = req.body;
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid postId" });
    }
    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ success: false, message: "Tags must be a non-empty array" });
    }
    const pool = req.app.locals.pool;

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update post fields
      const sql = `
        UPDATE public.posts
        SET 
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          post_image = COALESCE($4, post_image),
          is_solved = COALESCE($5, is_solved)
        WHERE post_id = $1 AND user_id = $6 AND is_deleted = FALSE
        RETURNING post_id, user_id, title, description, post_image, is_solved, created_at
      `;
      const { rows } = await client.query(sql, [
        postId,
        title ?? null,
        description ?? null,
        post_image ?? null,
        is_solved ?? false,
        user_id,
      ]);
      if (rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, message: "Post not found or not authorized" });
      }

      
      // Check if all tags exist
      const tagCheckSql = `
        SELECT tag_name FROM public.tags WHERE tag_name = ANY($1)
      `;
      const { rows: foundTags } = await client.query(tagCheckSql, [tags]);
      const foundTagNames = foundTags.map(row => row.tag_name);
      const missingTags = tags.filter(tag => !foundTagNames.includes(tag));

      if (missingTags.length > 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: `Tag(s) do not exist: ${missingTags.join(", ")}`
        });
      }

      // Delete old tags
      await client.query(
        `DELETE FROM public.post_tags WHERE post_id = $1`,
        [postId]
      );

      // Insert new tags (if any)
      if (tags.length > 0) {
        const tagInsertSql = `
          INSERT INTO public.post_tags (post_id, tag_id)
          SELECT $1, tag_id FROM public.tags WHERE tag_name = ANY($2)
          ON CONFLICT (post_id, tag_id) DO NOTHING
        `;
        await client.query(tagInsertSql, [postId, tags]);
      }

      await client.query("COMMIT");
      return res.status(200).json({ success: true, data: rows[0], tags: tags });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (e) {
    next(e);
  }
};

/**
 * @desc    delete own post
 * @route   DELETE /api/v1/posts/:postId
 * @access  Private
 */

exports.deletePost = async (req, res, next) => {
  const pool = req.app.locals.pool;
  const client = await pool.connect();
  try {
    const user_id = req.user.uid;
    const postId = Number(req.params.postId);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid postId" });
    }

    await client.query("BEGIN");

    // 1) soft delete post (owner only, and only if not already deleted)
    const upPost = await client.query(
      `
      UPDATE posts
      SET is_deleted = TRUE
      WHERE post_id = $1 AND user_id = $2 AND is_deleted = FALSE
      RETURNING post_id
      `,
      [postId, user_id]
    );
    if (upPost.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Post not found or not authorized" });
    }

    // 2) cascade soft delete comments under this post
    await client.query(
      `
      UPDATE comments
      SET is_deleted = TRUE
      WHERE post_id = $1 AND is_deleted = FALSE
      `,
      [postId]
    );

    await client.query("COMMIT");
    return res.status(200).json({ success: true, message: "Post deleted with comments cascaded", data: upPost.rows[0] });
  } catch (e) {
    try { await client.query("ROLLBACK"); } catch (_) {}
    next(e);
  } finally {
    client.release();
  }
};

/**
 * @desc    Refresh the feed
 * @route   GET /api/v1/posts
 * @access  Private
 */
exports.refreshFeed = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const { rows } = await pool.query(
      `SELECT * FROM public.posts
      where is_deleted=false
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
      AND p.is_deleted = FALSE
      ORDER BY b.created_at DESC`,
      [user_id]
    );

    return res.status(200).json({ success: true, count: rows.length, rows });
  } catch (e) {
    next(e);
  }
};
