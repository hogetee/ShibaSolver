/**
 * @desc    Search users by display name or username
 * @route   GET /api/v1/search/users?query=abc&page=1&limit=20
 * @access  Public
 */
exports.searchUsers = async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const query = req.query.query?.trim();

        if (!query) {
            return res.status(400).json({ success: false, message: "Query parameter is required" });
        }

        // Pagination setup
        const limit = Math.min(Number(req.query.limit) || 20, 50);
        const page = Math.max(Number(req.query.page) || 1, 1);
        const offset = (page - 1) * limit;

        // Search + similarity ranking
        const searchSql = `
        SELECT 
            user_id, 
            user_name, 
            display_name, 
            profile_picture,
            GREATEST(similarity(display_name, $1), similarity(user_name, $1)) AS rank
        FROM users
        WHERE display_name ILIKE $2 OR user_name ILIKE $2
        ORDER BY rank DESC
        LIMIT $3 OFFSET $4;
        `;
        const values = [query, `%${query}%`, limit + 1, offset]; // fetch one extra for has_next_page check

        const result = await pool.query(searchSql, values);

        // Handle no result
        if (result.rows.length === 0) {
            return res.status(200).json({ success: true, message: "User not found", users: [] });
        }

        // Determine has_next_page
        const hasNextPage = result.rows.length > limit;
        const users = hasNextPage ? result.rows.slice(0, limit) : result.rows;

        res.status(200).json({
            success: true,
            count: users.length,
            page,
            has_next_page: hasNextPage,
            users,
        });
    } catch (error) {
        console.error("Error in searchUsers:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * @desc    Search posts by display name or username
 * @route   GET /api/v1/search/posts?query=abc&page=1&limit=20
 * @access  Public
 */
exports.searchPosts = async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const query = req.query.query?.trim();

        if (!query) {
            return res.status(400).json({ success: false, message: "Query parameter is required" });
        }

        // Pagination setup
        const limit = Math.min(Number(req.query.limit) || 20, 50);
        const page = Math.max(Number(req.query.page) || 1, 1);
        const offset = (page - 1) * limit;

        const searchSql = `
            WITH matching_posts AS (
                SELECT p.post_id
                FROM posts p
                LEFT JOIN users u ON p.user_id = u.user_id
                LEFT JOIN post_tags pt ON p.post_id = pt.post_id
                LEFT JOIN tags t ON pt.tag_id = t.tag_id
                WHERE p.is_deleted = FALSE AND (
                    p.title ILIKE $2 OR
                    p.description ILIKE $2 OR
                    u.user_name ILIKE $2 OR
                    u.display_name ILIKE $2 OR
                    t.tag_name ILIKE $2
                )
                GROUP BY p.post_id
            )
            SELECT
                p.post_id, p.title, p.description, p.created_at, p.is_solved,
                json_build_object('user_id', u.user_id, 'user_name', u.user_name, 'display_name', u.display_name, 'profile_picture', u.profile_picture) as author,
                ARRAY_AGG(DISTINCT t.tag_name) as tags,
                MAX(
                    GREATEST(
                        similarity(p.title, $1),
                        similarity(p.description, $1),
                        similarity(u.user_name, $1),
                        similarity(u.display_name, $1),
                        similarity(t.tag_name, $1)
                    )
                ) AS rank
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            LEFT JOIN post_tags pt ON p.post_id = pt.post_id
            LEFT JOIN tags t ON pt.tag_id = t.tag_id
            WHERE p.post_id IN (SELECT post_id FROM matching_posts)
            GROUP BY p.post_id, u.user_id
            ORDER BY rank DESC
            LIMIT $3 OFFSET $4;
        `;
        const values = [query, `%${query}%`, limit + 1, offset]; // fetch one extra for has_next_page check

        const result = await pool.query(searchSql, values);

        // Determine has_next_page
        const hasNextPage = result.rows.length > limit;
        const posts = hasNextPage ? result.rows.slice(0, limit) : result.rows;

        res.status(200).json({
            success: true,
            count: posts.length,
            page,
            has_next_page: hasNextPage,
            posts: posts.map(({ rank, ...post }) => post), // Exclude rank from final output
        });
    } catch (error) {
        console.error("Error in searchPosts:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
