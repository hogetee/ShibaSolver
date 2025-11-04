async function createNotification(pool, {
  toUserId,
  type,
  message,
  link = null,
}) {
  if (!toUserId || !message) return;

  await pool.query(
    `INSERT INTO notifications (user_id, notification_type, message, link)
     VALUES ($1, $2, $3, $4)`,
    [toUserId, type, message, link]
  );
}

module.exports = {
  createNotification,
};