/**
 * @desc    like or dislike a post or comment
 * @route   POST /api/v1/ratings
 * @access  Private 
 */
exports.rate = async (req, res, next) => {
    try {
        const pool = req.app.locals.pool;
        const user_id = req.user.uid;
        const { target_type, target_id, rating_type } = req.body;

        // ----- Validate input -----
        if (!["post", "comment"].includes(target_type)) {
        return res.status(400).json({ success: false, message: "target_type must be 'post' or 'comment'" });
        }
        if (!Number.isInteger(target_id) || target_id <= 0) {
        return res.status(400).json({ success: false, message: "Invalid target_id" });
        }
        if (!["like", "dislike"].includes(rating_type)) {
        return res.status(400).json({ success: false, message: "rating_type must be 'like' or 'dislike'" });
        }

        const isPost = target_type === "post";
        const postId = isPost ? target_id : null;
        const commentId = isPost ? null : target_id;

        // UPSERT (insert or update)
        const sql = `
        INSERT INTO ratings (user_id, post_id, comment_id, rating_type)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, ${isPost ? "post_id" : "comment_id"})
        WHERE (${isPost ? "post_id IS NOT NULL" : "comment_id IS NOT NULL"})
        DO UPDATE SET rating_type = EXCLUDED.rating_type, created_at = now()
        RETURNING rating_id, user_id, post_id, comment_id, rating_type, created_at;
        `;
        const { rows } = await pool.query(sql, [user_id, postId, commentId, rating_type]);
        const rating = rows[0];

        // Get update counts
        const summarySql = `
        SELECT
            COALESCE(SUM(CASE WHEN rating_type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
            COALESCE(SUM(CASE WHEN rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
        FROM ratings
        WHERE ${isPost ? "post_id = $1" : "comment_id = $1"};
        `;
        const { rows: summaryRows } = await pool.query(summarySql, [target_id]);

        return res.status(200).json({
        success: true,
        data: {
            target_type,
            target_id,
            rating,
            summary: summaryRows[0],
        },
        });
    } catch (err) {
        if (err.code === '23503') {
            return res.status(404).json({
                success: false,
                message: `Target ${req.body?.target_type || 'resource'} not found`,
            });
        }
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * @desc    remove like or dislike from a post or comment
 * @route   DELETE /api/v1/ratings
 * @access  Private
 */
exports.unrate = async (req, res, next) => {
    try {
        const pool = req.app.locals.pool;
        const user_id = req.user.uid;

        const { target_type, target_id } = req.body;

        // ----- Validate input -----
        if (!["post", "comment"].includes(target_type)) {
            return res.status(400).json({ success: false, message: "target_type must be 'post' or 'comment'" });
        }
        if (!Number.isInteger(target_id) || target_id <= 0) {
            return res.status(400).json({ success: false, message: "Invalid target_id" });
        }

        const isPost = target_type === 'post';

        const delSql = `
        DELETE FROM ratings
        WHERE user_id = $1 AND ${isPost ? 'post_id = $2' : 'comment_id = $2'}
        RETURNING rating_id;
        `;
        const { rows } = await pool.query(delSql, [user_id, target_id]);

        // get updated counts
        const countSql = `
        SELECT
            COALESCE(SUM(CASE WHEN rating_type = 'like' THEN 1 ELSE 0 END), 0) AS likes,
            COALESCE(SUM(CASE WHEN rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
        FROM ratings
        WHERE ${isPost ? 'post_id = $1' : 'comment_id = $1'};
        `;
        const { rows: cnt } = await pool.query(countSql, [target_id]);

        return res.status(200).json({
        success: true,
        message: rows.length ? 'Unrated' : 'No rating to remove',
        summary: cnt[0],
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * @desc    get rating summary for a post or comment
 * @route   GET /api/v1/ratings/summary?target_type=post|comment&ids=1,2,3
 * @access  Private
 * @param   target_type - 'post' or 'comment'
 * @param   target_id - id of the post or comment
 */
exports.getSummaryBatch = async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { target_type, ids } = req.query;
        const user_id = req.user?.uid || null;

        // ----- Validate input -----

        if (!["post", "comment"].includes(target_type)) {
        return res.status(400).json({ success: false, message: "target_type must be 'post' or 'comment'" });
        }
        if (!ids) {
        return res.status(400).json({ success: false, message: "ids is required (comma-separated)" });
        }

        const idList = ids.split(",").map(x => Number(x)).filter(x => Number.isInteger(x) && x > 0);
        if (idList.length === 0) {
        return res.status(400).json({ success: false, message: "ids must contain positive integers" });
        }

        const isPost = target_type === "post";

        // Query to get summary and user's rating
        const sql = `
        SELECT
            t.id,
            COALESCE(SUM(CASE WHEN r_all.rating_type = 'like' THEN 1 ELSE 0 END), 0)    AS likes,
            COALESCE(SUM(CASE WHEN r_all.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
            CASE
            WHEN MAX(CASE WHEN r_me.rating_type = 'like' THEN 1 END) = 1 THEN 'like'
            WHEN MAX(CASE WHEN r_me.rating_type = 'dislike' THEN 1 END) = 1 THEN 'dislike'
            ELSE NULL
            END AS my_rating
        FROM (SELECT UNNEST($1::bigint[]) AS id) t
        LEFT JOIN ratings r_all
            ON ${isPost ? 'r_all.post_id = t.id' : 'r_all.comment_id = t.id'}
        LEFT JOIN ratings r_me
            ON ${isPost ? 'r_me.post_id = t.id'   : 'r_me.comment_id = t.id'}
        AND r_me.user_id = $2
        GROUP BY t.id
        ORDER BY t.id;
        `;

        const { rows } = await pool.query(sql, [idList, user_id]);
        return res.status(200).json({ success: true, target_type, data: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * @desc    get ShibaMeter (trust ratio) for a user based on their solution comments
 * @route   GET /api/v1/users/:username/shibameter
 * @access  Public
 */
exports.getShibaMeter = async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const {username} = req.params;
        if (!/^[\w-]+$/.test(username)) return res.status(400).json({ success:false, message:'Invalid username' });

        const userID = await pool.query(
            `SELECT user_id FROM public.users WHERE user_name = $1`, [username]
        );
        if (userID.rows.length === 0) return res.status(404).json({ success:false, message:'User not found' });
        
        const sql = `SELECT
            COUNT(DISTINCT c.comment_id) AS solution_comment_count,
            COALESCE(SUM(CASE WHEN r.rating_type = 'like'    THEN 1 ELSE 0 END), 0) AS likes,
            COALESCE(SUM(CASE WHEN r.rating_type = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
            COALESCE(SUM(CASE WHEN r.rating_type IN ('like','dislike') THEN 1 ELSE 0 END), 0) AS total_ratings,
            -- ratio 0..1 (NULL if no ratings)
            CASE
            WHEN COALESCE(SUM(CASE WHEN r.rating_type IN ('like','dislike') THEN 1 END), 0) = 0
                THEN NULL
            ELSE ROUND(
                COALESCE(SUM(CASE WHEN r.rating_type = 'like' THEN 1 ELSE 0 END), 0)::numeric
                / NULLIF(
                    COALESCE(SUM(CASE WHEN r.rating_type IN ('like','dislike') THEN 1 ELSE 0 END), 0), 0
                ),
                4
            )
            END AS trust_ratio
        FROM comments c
        LEFT JOIN ratings r ON r.comment_id = c.comment_id
        WHERE c.user_id = $1 AND c.is_solution = TRUE;
        `;
        const { rows } = await pool.query(sql, [userID.rows[0].user_id]);
        const trust_percentage = rows[0].trust_ratio === null ? 0 : Number((Number(rows[0].trust_ratio) * 100).toFixed(2));
        return res.status(200).json({ success: true, username, shibaMeter: trust_percentage });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * @desc    checking if (logged in) user has liked liked or disliked posts or comments
 * @route   GET /api/v1/ratings/check?target_type=post|comment&target_id=1
 * @access  Private
 * @param   target_type - 'post' or 'comment'
 */

exports.getUserRating = async (req, res,next) => {
    try {
        const pool = req.app.locals.pool;
        const user_id = req.user.uid;
        const { target_type, target_id } = req.query;
        // ----- Validate input -----

        if (!["post", "comment"].includes(target_type)) {
            return res.status(400).json({ success: false, message: "target_type must be 'post' or 'comment'" });
        }
        if (!Number.isInteger(Number(target_id)) || Number(target_id) <= 0) {
            return res.status(400).json({ success: false, message: "Invalid target_id" });
        }
        const isPost = target_type === "post";
        const sql = `
            SELECT rating_type
            FROM ratings
            WHERE user_id = $1 AND ${isPost ? 'post_id = $2' : 'comment_id = $2'};
        `;
        const { rows } = await pool.query(sql, [user_id, target_id]);
        if (rows.length === 0) {
            return res.status(200).json({ success: true, target_type, target_id, my_rating: null });
        }
            return res.status(200).json({ success: true, target_type, target_id, my_rating: rows[0].rating_type });
    } catch (err) {
        return next(err);
    }
};