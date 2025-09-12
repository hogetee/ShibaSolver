exports.getPost = (req, res) => {
  res.status(200).json({ success: true, where: 'getPost', id: req.params.id });
};

exports.refreshFeed = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const { rows } = await pool.query(
      `SELECT * FROM public.posts
      ORDER BY created_at DESC`
    );//order by creation date desc, might be changed later

    return res.status(200).json({ success: true, count: rows.length, rows });
  } catch (e) { next(e); }
}

exports.addBookmark = async (req, res, next) => {
  try {
    const { user_id, post_id } = req.body;
    if (!/^\d+$/.test(String(user_id)) || !/^\d+$/.test(String(post_id))) {
      return res.status(400).json({ success: false, message: 'Invalid user_id or post_id' });
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
    return res.status(200).json({ success: false, message: 'Already bookmarked' });
  } catch (e) {
    if (e.code === '23503') { // FK violation
      return res.status(400).json({ success: false, message: 'user_id or post_id does not exist' });
    }
    next(e);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    if (!/^\d+$/.test(String(user_id))) {
      return res.status(400).json({ success: false, message: 'Invalid user_id' });
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
  } catch (e) { next(e); }
};