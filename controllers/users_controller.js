exports.getAllUsers = (req, res) => {
  res.status(200).json({ success: true, where: 'listUsers', data: [] });
};

exports.getUser = (req, res) => {
  res.status(200).json({ success: true, where: 'getUser', id: req.params.id });
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
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