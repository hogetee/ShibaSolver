/**
 * @desc    Get a single user by username
 * @route   GET /api/v1/users/:username
 * @access  Private 
 */
exports.getUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    if (!/^[\w-]+$/.test(username)) return res.status(400).json({ success:false, message:'Invalid username' });

    const pool = req.app.locals.pool;
    const { rows } = await pool.query(
      `SELECT * FROM public.users 
      WHERE user_name = $1`, [username]
    );
    if (rows.length === 0) return res.status(404).json({ success:false, message:'User not found' });

    return res.status(200).json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

/**
 * @desc    Delete a user by ID
 * @route   DELETE /api/v1/users/:id
 * @access  Private
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.user.uid;
    if (!/^\d+$/.test(id)) return res.status(400).json({ success:false, message:'Invalid id' });

    const pool = req.app.locals.pool;
    const { rows } = await pool.query(
      `DELETE FROM public.users WHERE user_id = $1
      RETURNING user_id, user_name, google_account`, [id]
    );
    if (rows.length === 0) return res.status(404).json({ success:false, message:'User not found' });

    return res.status(200).json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

/** 
  * @desc    Admin delete a user by username
  * @route   DELETE /api/v1/users/:username
  * @access  Private/Admin
*/
exports.adminDeleteUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!/^[\w-]+$/.test(username)) return res.status(400).json({ success:false, message:'Invalid username' });

    const pool = req.app.locals.pool;
    const { rows } = await pool.query(
      `DELETE FROM public.users WHERE user_name = $1
      RETURNING user_id, user_name, google_account`, [username]
    );
    if (rows.length === 0) return res.status(404).json({ success:false, message:'User not found' });

    return res.status(200).json({ success:true, data: rows[0] });
  } catch (err) { next(err); }
};

/** 
 * @desc    Update a user by ID
 * @route   PUT /api/v1/users/:id
 * @access  Private
 */
exports.updateUser = async (req, res, next) => {
  try {
    const id  = req.user.uid;
    const { new_data } = req.body;

      if (!/^\d+$/.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
      }

    if (!new_data || Object.keys(new_data).length === 0) {
      return res.status(400).json({ success: false, message: 'No data to update' });
    }

    const allowedFields = [
      "is_premium",
      "user_state",
      "user_name",
      "display_name",
      "education_level",
      "like",
      "dislike",
      "bio",
      "interested_subjects",
      "profile_picture"
    ];

    const pool = req.app.locals.pool;

    // Filter only valid fields
    const fields = Object.keys(new_data).filter(f => allowedFields.includes(f));
    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const values = fields.map(f => new_data[f]);

    // Build SET clause like "field1=$1, field2=$2"
    const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(", ");

    const query = `
      UPDATE public.users
      SET ${setClause}
      WHERE user_id = $${fields.length + 1}
      RETURNING user_id, google_account, is_premium, user_state, user_name, display_name, education_level, "like", "dislike", bio, interested_subjects, profile_picture
    `;

    const { rows } = await pool.query(query, [...values, id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Fail to Update' });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Admin update a user by username
 * @route   PUT /api/v1/users/:username
 * @access  Private/Admin
 */
exports.adminUpdateUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { new_data } = req.body;

    if (!/^[\w-]+$/.test(username)) {
      return res.status(400).json({ success: false, message: 'Invalid username' });
    }

    if (!new_data || Object.keys(new_data).length === 0) {
      return res.status(400).json({ success: false, message: 'No data to update' });
    }

    const allowedFields = [
      "is_premium",
      "user_state",
      "user_name",
      "display_name",
      "education_level",
      "like",
      "dislike",
      "bio",
      "interested_subjects",
      "profile_picture"
    ];

    const pool = req.app.locals.pool;

    // Filter only valid fields
    const fields = Object.keys(new_data).filter(f => allowedFields.includes(f));
    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const values = fields.map(f => new_data[f]);

    // Build SET clause like "field1=$1, field2=$2"
    const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(", ");

    const query = `
      UPDATE public.users
      SET ${setClause}
      WHERE user_name = $${fields.length + 1}
      RETURNING user_id, google_account, is_premium, user_state, user_name, display_name, education_level, "like", "dislike", bio, interested_subjects, profile_picture
    `;

    const { rows } = await pool.query(query, [...values, username]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Fail to Update' });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all posts created by a specific user
 * @route   GET /api/v1/users/:userID/posts
 * @access  Private
 * @return  {post_id, title, description, post_image, is_solved, created_at, poster info, tags: [], top_comment: {}, rating info}
 */

exports.getPostbyUserId = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const userID = req.params.userID;
    const currentUserID = req.user?.uid || null;

    //pagination parameter
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    //Posts with author info + aggregated ratings + my rating
    const postSql = `
      SELECT 
        p.post_id,
        p.title,
        p.description,
        p.post_image,
        p.is_solved,
        p.created_at,
        u.user_id,
        u.display_name,
        u.profile_picture,
        COALESCE(SUM(CASE WHEN r.rating_type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
        COALESCE(SUM(CASE WHEN r.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
        BOOL_OR(r_me.rating_type = 'like') AS liked_by_user,
        BOOL_OR(r_me.rating_type = 'dislike') AS disliked_by_user
      FROM posts p
      JOIN users u ON u.user_id = p.user_id
      LEFT JOIN ratings r ON r.post_id = p.post_id
      LEFT JOIN ratings r_me ON r_me.post_id = p.post_id AND r_me.user_id = $1
      WHERE p.user_id = $2 AND p.is_deleted = FALSE
      GROUP BY p.post_id, u.user_id, u.display_name, u.profile_picture
      ORDER BY p.created_at DESC
      LIMIT $3 OFFSET $4;
      `;

    //Tags for each post (aggregated as array)
    const tagSql = `
      SELECT 
        pt.post_id,
        ARRAY_AGG(t.tag_name) AS tags
      FROM post_tags pt
      JOIN tags t ON t.tag_id = pt.tag_id
      GROUP BY pt.post_id;
    `;

    //Top comment per post (most total_ratings)
    const topCommentSql = `
      WITH comment_ratings AS (
        SELECT 
          c.comment_id,
          c.post_id,
          c.text,
          c.created_at,
          c.user_id,
          u.display_name,
          u.profile_picture,
          COUNT(CASE WHEN r.rating_type='like' THEN 1 END) AS likes,
          COUNT(CASE WHEN r.rating_type='dislike' THEN 1 END) AS dislikes
        FROM comments c
        JOIN users u ON u.user_id = c.user_id
        LEFT JOIN ratings r ON r.comment_id = c.comment_id
        GROUP BY c.comment_id, c.post_id, u.display_name, u.profile_picture, c.user_id
      )
      SELECT DISTINCT ON (post_id)
        *,
        (likes + dislikes) AS total_ratings
      FROM comment_ratings
      ORDER BY post_id, total_ratings DESC, created_at ASC;
    `;

    //Run all queries in parallel
    const [postsRes, tagsRes, topCommentsRes] = await Promise.all([
      pool.query(postSql, [currentUserID, userID, limit, offset]),
      pool.query(tagSql),
      pool.query(topCommentSql)
    ]);

    //Convert tags + comments into lookup maps for merging
    const tagsByPost = Object.fromEntries(
      tagsRes.rows.map(t => [t.post_id, t.tags])
    );

    const topComments = Object.fromEntries(
      topCommentsRes.rows.map(c => [c.post_id, c])
    );

    //Merge all data into final response
    const feed = postsRes.rows.map(p => ({
      ...p,
      tags: tagsByPost[p.post_id] || [],
      top_comment: topComments[p.post_id] || null,
    }));

    const totalRes = await pool.query(
      `SELECT COUNT(*) AS total FROM posts WHERE user_id = $1 AND is_deleted = FALSE;`,
      [userID]
    );

    const total = parseInt(totalRes.rows[0].total, 10);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    
    console.log('Feed data:', feed);
    return res.status(200).json({
      success: true,
      count: feed.length,
      meta: {
        page, limit, total, totalPages,
        hasNext: page < totalPages,
        nextPage: page < totalPages ? page + 1 : null
      },
      data: feed.map(({ total, ...r }) => r)
    });

  } catch (err) {
    console.error('Error in getPostbyId:', err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc    update user's premium status
 * @route   PUT /api/v1/users/premium
 * @access  Private
 */
exports.updatePremium = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const id = req.user?.uid;
    if (!id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const sql = `
      UPDATE users
      SET is_premium = TRUE,
          updated_at = now()
      WHERE user_id = $1 AND is_premium = FALSE
      RETURNING user_id, is_premium, updated_at
    `;
    const { rows } = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(200).json({ success: true, message: 'User is already premium', data: null });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};