exports.getFeed = async (req, res, next) => {
  try {
    const pool = req.app.locals.pool;

    //Posts with author info + post like/dislike summary
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
        COALESCE(SUM(CASE WHEN r.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
      FROM posts p
      JOIN users u ON u.user_id = p.user_id
      LEFT JOIN ratings r ON r.post_id = p.post_id
      GROUP BY p.post_id, u.user_id, u.display_name, u.profile_picture
      ORDER BY p.created_at DESC
      LIMIT 20;
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
      SELECT DISTINCT ON (c.post_id)
        c.post_id,
        c.comment_id,
        c.text,
        c.user_id,
        u.display_name,
        u.profile_picture,
        COALESCE(SUM(CASE WHEN r.rating_type='like' THEN 1 ELSE 0 END), 0) +
        COALESCE(SUM(CASE WHEN r.rating_type='dislike' THEN 1 ELSE 0 END), 0) AS total_ratings,
        COALESCE(SUM(CASE WHEN r.rating_type='like' THEN 1 ELSE 0 END), 0) AS likes,
        COALESCE(SUM(CASE WHEN r.rating_type='dislike' THEN 1 ELSE 0 END), 0) AS dislikes
      FROM comments c
      JOIN users u ON u.user_id = c.user_id
      LEFT JOIN ratings r ON r.comment_id = c.comment_id
      GROUP BY c.post_id, c.comment_id, u.display_name, u.profile_picture, c.user_id
      ORDER BY c.post_id, total_ratings DESC;
    `;

    // Run all queries in parallel ⚡
    const [postsRes, tagsRes, topCommentsRes] = await Promise.all([
      pool.query(postSql),
      pool.query(tagSql),
      pool.query(topCommentSql)
    ]);

    // Convert tags + comments into lookup maps for quick merge
    const tagsByPost = Object.fromEntries(
      tagsRes.rows.map(t => [t.post_id, t.tags])
    );

    const topComments = Object.fromEntries(
      topCommentsRes.rows.map(c => [c.post_id, c])
    );

    // Merge all data into final feed structure
    const feed = postsRes.rows.map(p => ({
      ...p,
      tags: tagsByPost[p.post_id] || [],
      top_comment: topComments[p.post_id] || null,
    }));

    return res.status(200).json({
      success: true,
      count: feed.length,
      data: feed
    });

  } catch (err) {
    console.error('Error in getFeed:', err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
