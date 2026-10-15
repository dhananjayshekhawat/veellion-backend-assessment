const aSvc = require("../services/activity.service");

async function get_activity(req, res, next) {
  try {
    const x = await aSvc.getAllActivity();
    res.json(x);
  } catch (error) {
    next(error);
  }
}

async function addActivity(req, res, next) {
  try {
    const activity = await aSvc.createNewActivity(req.body);
    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  get_activity,
  addActivity,
};
