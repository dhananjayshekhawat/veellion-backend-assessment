const path = require("node:path");
const { readJsonArray } = require("../../../utils/jsonStore");

const TASKS_FILE_PATH = path.join(process.cwd(), "data", "tasks.json");

const ACTIVITY_FILE_PATH = path.join(process.cwd(), "data", "activity.json");

async function getTasksSummary() {
  const [tasks, activities] = await Promise.all([
    readJsonArray(TASKS_FILE_PATH),
    readJsonArray(ACTIVITY_FILE_PATH),
  ]);

  const byStatus = {
    todo: 0,
    "in-progress": 0,
    done: 0,
  };

  for (const task of tasks) {
    if (task.completed === true) {
      byStatus.done += 1;
    } else if (task.completed === false) {
      byStatus.todo += 1;
    }
  }

  return {
    total: tasks.length,
    byStatus,
    recentActivityCount: activities.length,
  };
}

module.exports = {
  getTasksSummary,
};
