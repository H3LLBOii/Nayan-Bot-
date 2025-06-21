const fs = require("fs");
const path = __dirname + "/cache/antiname.json";

// Ensure data file exists
if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

let nameData = JSON.parse(fs.readFileSync(path, "utf-8"));

module.exports.config = {
  name: "antiname",
  version: "1.0.0",
  hasPrefix: false, // ✅ Important: No prefix required
  credits: "YourName",
  description: "Lock group name and auto-revert changes",
  commandCategory: "group",
  usages: "antiname [group name]",
  cooldowns: 3,
  dependencies: {},
  listen: true // ✅ Bot will listen to all messages
};

module.exports.listen = async function ({ event, api }) {
  const threadID = event.threadID;
  const message = event.body?.toLowerCase();

  // ✅ 1. Revert name if changed
  if (event.logMessageType === "log:thread-name") {
    if (nameData[threadID]) {
      api.setTitle(nameData[threadID], threadID, () => {
        api.sendMessage(
          `🚫 Group name change detected!\n✅ Reverted to locked name: "${nameData[threadID]}"`,
          threadID
        );
      });
    }
  }

  // ✅ 2. Lock name if command given (without prefix)
  if (!message?.startsWith("antiname ")) return;

  const nameToLock = event.body.slice(9).trim();
  if (!nameToLock) return api.sendMessage("❌ Please provide a group name to lock.", threadID);

  nameData[threadID] = nameToLock;
  fs.writeFileSync(path, JSON.stringify(nameData, null, 2));

  api.setTitle(nameToLock, threadID);
  return api.sendMessage(
    `🔒 Group name has been locked to: "${nameToLock}".\nAny changes will be reverted automatically.`,
    threadID
  );
};
