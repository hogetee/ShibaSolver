exports.getAllAdmins = (req, res) => {
  res.status(200).json({ success: true, where: "listAdmins", data: [] });
};

exports.getAdmin = (req, res) => {
  res.status(200).json({ success: true, where: "getAdmin", id: req.params.id });
};