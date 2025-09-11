exports.getAllComments = (req, res) => {
  res.status(200).json({ success: true, where: 'listAdmins', data: [] });
};

exports.getComment = (req, res) => {
  res.status(200).json({ success: true, where: 'getComment', id: req.params.id });
};