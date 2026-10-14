# VeeLion Backend Assessment — Code Review

## 1. Bugs

### B1. JSON storage silently accepts non-array JSON data

- **File:** `src/utils/jsonStore.js`
- **What is wrong:** The `readJsonArray()` function returns an empty array when the parsed JSON value is not an array.
- **Why it is a problem:** If a JSON file contains a valid JSON object or another unexpected structure, the application silently treats it as empty data. A subsequent write could overwrite the existing contents.
- **Suggested improvement:** Validate the parsed data and throw an error if it is not an array. Avoid silently treating unexpected data as an empty collection.

### B2. Activity API does not validate request bodies

- **File:** `src/modules/activity/controllers/activity.controller.js`
- **What is wrong:** The controller forwards the request body directly to the service without validating its structure or field types.
- **Why it is a problem:** Missing or incorrectly typed values can result in malformed activity records.
- **Suggested improvement:** Validate that the request body is a JSON object, `action` is a non-empty string, and `info` is a string when provided.

## 2. Performance

### P1. Synchronous file operations block the event loop

- **File:** `src/modules/activity/services/activity.service.js`
- **What is wrong:** The service uses synchronous filesystem operations to read and write activity data.
- **Why it is a problem:** Synchronous filesystem operations block the Node.js event loop while the operations are running, delaying other requests.
- **Suggested improvement:** Reuse the asynchronous JSON storage utility in `src/utils/jsonStore.js`.

### P2. Entire JSON files are read and rewritten

- **Files:** Task and Activity services.
- **What is wrong:** The services load complete JSON arrays into memory and rewrite the entire file when records are changed.
- **Why it is a problem:** File I/O and memory usage increase as the number of records grows.
- **Suggested improvement:** Retain JSON storage to satisfy the assessment constraints, but document its scalability limitations. A database could be considered if the application's data volume or concurrency requirements increase.

## 3. Maintainability

### M1. Task validation is duplicated

- **Files:** `src/modules/tasks/controllers/tasks.controller.js` and `src/modules/tasks/utils/taskValidator.js`
- **What is wrong:** The controller contains validation logic even though a dedicated validator module already exists.
- **Why it is a problem:** Validation rules can become inconsistent, and changes may need to be made in multiple places.
- **Suggested improvement:** Reuse the existing validator functions in the controller. Keep the controller focused on request and response handling.

### M2. Activity storage logic is duplicated

- **File:** `src/modules/activity/services/activity.service.js`
- **What is wrong:** The functions `loadDataA()` and `loadDataB()` perform essentially the same file-loading operations.
- **Why it is a problem:** Duplicate implementations increase maintenance effort and can lead to inconsistent behavior when one implementation is changed but the other is not.
- **Suggested improvement:** Remove the duplicate functions and reuse the shared JSON storage utility.

### M3. Activity service function names are unclear

- **File:** `src/modules/activity/services/activity.service.js`
- **What is wrong:** Function names such as `loadDataA()` and `loadDataB()` do not clearly communicate their responsibilities.
- **Why it is a problem:** Developers must inspect the implementation to understand the purpose of each function.
- **Suggested improvement:** Remove the redundant helpers and use descriptive names for any remaining functions.

## 4. Code Quality

### Q1. API response formats are inconsistent

- **Files:** Task and Activity controllers.
- **What is wrong:** Task endpoints return responses wrapped in a `{ data: ... }` object, whereas Activity endpoints return raw arrays or objects.
- **Why it is a problem:** API consumers need to handle different response structures across modules.
- **Suggested improvement:** Preserve the existing response formats to avoid breaking compatibility with existing clients. Document the formats and consider standardization in a future API version.

### Q2. Activity IDs are generated using timestamps

- **File:** `src/modules/activity/services/activity.service.js`
- **What is wrong:** Activity IDs are generated using `String(Date.now())`.
- **Why it is a problem:** Two activity records created within the same millisecond can receive the same ID.
- **Suggested improvement:** Use the existing UUID-based ID utility in `src/utils/id.js` to generate unique identifiers.

### Q3. JSON writes can lose updates during concurrent requests

- **File:** `src/utils/jsonStore.js` and module services.
- **What is wrong:** Concurrent read-modify-write operations can read the same initial data and then overwrite each other's changes.
- **Why it is a problem:** Some successfully processed updates may not be present in the final JSON file.
- **Suggested improvement:** Serialize read-modify-write operations per file within a single Node.js process and use atomic file replacement. Document that this does not provide coordination across multiple server processes.
