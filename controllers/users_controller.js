exports.getAllUsers = (req, res) => {
  res.status(200).json({ success: true, where: 'listUsers', data: [] });
};

exports.getUser = (req, res) => {
  res.status(200).json({ success: true, where: 'getUser', id: req.params.id });
};