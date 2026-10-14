const path = require("node:path");
const { createId } = require("../../../utils/id");
const { readJsonArray, writeJsonArray } = require("../../../utils/jsonStore");

const ACTIVITY_FILE_PATH = path.join(process.cwd(), "data", "activity.json");

async function getAllActivity() {
  return readJsonArray(ACTIVITY_FILE_PATH);
}

async function createNewActivity(body) {
  const list = await readJsonArray(ACTIVITY_FILE_PATH);

  const activity = {
    id: createId(),
    action: body.action,
    info: body.info,
    when: new Date().toISOString(),
  };

  list.push(activity);

  await writeJsonArray(ACTIVITY_FILE_PATH, list);

  return activity;
}

module.exports = {
  getAllActivity,
  createNewActivity,
};
