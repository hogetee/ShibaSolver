/**
 * Search users by display name and user name
 * GET /api/v1/search/users?query=
 */

exports.searchUsers = async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ success: false, message: 'Query parameter is required' });
        }
        const searchSql = `
            SELECT user_id, user_name, display_name, profile_picture
            FROM users
            WHERE display_name ILIKE $1 OR user_name ILIKE $1
            LIMIT 20;
        `;
        const values = [`%${query}%`];
        const result = await pool.query(searchSql, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }else {
            res.status(200).json({ success: true, users: result.rows });
        }
    } catch (error) {
        console.error('Error in searchUsers:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};