exports.getAllComments = (req, res) => {
  res.status(200).json({ success: true, where: 'listComments', data: [] });
};

exports.getComment = (req, res) => {
  res.status(200).json({ success: true, where: 'getComment', id: req.params.id });
};