const aSvc = require("../services/activity.service");

function get_activity(req, res) {
  const x = aSvc.getAllActivity();
  res.json(x);
}

async function addActivity(req, res) {
  const activity = await aSvc.createNewActivity(req.body);
  res.status(201).json(activity);
}

module.exports = {
  get_activity,
  addActivity,
};
