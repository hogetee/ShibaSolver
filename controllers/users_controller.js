exports.getAllUsers = (req, res) => {
  res.status(200).json({ success: true, where: 'listUsers', data: [] });
};


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

exports.deleteUser = async (req, res, next) => {
  try {
    const username = req.user.username;
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


exports.updateUser = async (req, res, next) => {
  try {
    const username = req.user.username;
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