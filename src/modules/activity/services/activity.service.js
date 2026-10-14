const path = require("node:path");
const { createId } = require("../../../utils/id");
const { readJsonArray, writeJsonArray } = require("../../../utils/jsonStore");
const HttpError = require("../../../utils/httpError");
const ACTIVITY_FILE_PATH = path.join(process.cwd(), "data", "activity.json");

async function getAllActivity() {
  return readJsonArray(ACTIVITY_FILE_PATH);
}

async function createNewActivity(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Body must be a JSON object.");
  }

  const action = typeof body.action === "string" ? body.action.trim() : "";

  if (!action) {
    throw new HttpError(
      400,
      '"action" is required and must be a non-empty string.',
    );
  }

  if (body.info !== undefined && typeof body.info !== "string") {
    throw new HttpError(400, '"info" must be a string when provided.');
  }

  const list = await readJsonArray(ACTIVITY_FILE_PATH);

  const activity = {
    id: createId(),
    action,
    info: body.info ?? "",
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
