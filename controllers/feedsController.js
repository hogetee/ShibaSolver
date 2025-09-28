/**
 * @desc    Get all feeds
 * @route   GET /api/v1/feeds
 * @access  Private
 */
exports.getAllFeeds = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;
    const { rows } = await pool.query(
      `SELECT 
            p.post_id,
            p.title,
            p.description,
            p.created_at AS post_created_at,
            c.comment_id,
            c.text AS top_comment_text,
            c.created_at AS comment_created_at,
            COALESCE(rc.rating_count, 0) AS total_ratings
            FROM posts p
                LEFT JOIN LATERAL (
                    SELECT 
                    c.comment_id,
                    c.text,
                    c.created_at,
                    COUNT(r.rating_id) AS rating_count
                FROM comments c
                LEFT JOIN ratings r ON r.comment_id = c.comment_id
                WHERE c.post_id = p.post_id
                GROUP BY c.comment_id, c.text, c.created_at
                ORDER BY rating_count DESC, c.created_at ASC
                LIMIT 1
            ) c ON true
            LEFT JOIN LATERAL (
                SELECT COUNT(rating_id) AS rating_count
                FROM ratings r
                WHERE r.comment_id = c.comment_id
            ) rc ON true
            ORDER BY p.created_at DESC`
    ); 


    return res.status(200).json({ success: true, count: rows.length, rows });
  } catch (e) {
    next(e);
  }
}