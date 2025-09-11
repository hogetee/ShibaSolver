exports.getAllPosts = (req, res) => {
  res.status(200).json({ success: true, where: 'listPosts', data: [] });
};

exports.getPost = (req, res) => {
  res.status(200).json({ success: true, where: 'getPost', id: req.params.id });
};