/**
 * @desc    Get all notifications of current user (latest first)
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.uid;

    const { rows } = await pool.query(
      `
      SELECT notification_id, notification_type, message, link, is_read, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [userId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get unread notifications of current user
 * @route   GET /api/notifications/unread
 * @access  Private
 */
exports.getUnreadNotifications = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.uid;

    const { rows } = await pool.query(
      `
      SELECT notification_id, notification_type, message, link, is_read, created_at
      FROM notifications
      WHERE user_id = $1 AND is_read = FALSE
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getUnreadNotifications error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get unread notifications count (for badge)
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.uid;

    const { rows } = await pool.query(
      `SELECT COUNT(*) AS count
       FROM notifications
       WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );

    res.json({ success: true, unread: Number(rows[0].count) });
  } catch (err) {
    console.error('getUnreadCount error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 * @param   {id} notification ID
 */
exports.markAsRead = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.uid;
    const notificationId = req.params.id;

    const { rowCount } = await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE notification_id = $1 AND user_id = $2`,
      [notificationId, userId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('markAsRead error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.uid;

    await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('markAllAsRead error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};