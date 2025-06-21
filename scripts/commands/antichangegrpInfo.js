const fs = require("fs-extra");
const path = require("path");

const groupSettingsPath = path.join(__dirname, "..", "events", "Nayan", "groupSettings.json");

let lockedNames = {};
if (fs.existsSync(groupSettingsPath)) {
  try {
    const fileData = fs.readFileSync(groupSettingsPath, "utf-8");
    lockedNames = JSON.parse(fileData);
  } catch (err) {
    console.error("Failed to load locked group names:", err);
  }
}

const saveLockedNames = () => {
  try {
    fs.writeFileSync(groupSettingsPath, JSON.stringify(lockedNames, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save locked group names:", err);
  }
};

module.exports = {
  config: {
    name: "antiname",
    version: "1.0.1",
    permission: 0,
    credits: "Modified by ChatGPT based on Nayan",
    description: "Locks group name to a specific value",
    prefix: false,
    category: "box",
    usages: "antiname [new name]",
    cooldowns: 5,
    listen: true
  },

  start: async function ({ nayan, events, args }) {
    const threadID = events.threadID;
    const senderID = events.senderID;
    const botAdmins = global.config.ADMINBOT || [];

    const threadInfo = await nayan.getThreadInfo(threadID);
    const groupAdmins = threadInfo.adminIDs.map(admin => admin.id);

    // Only group admin or bot admin can use
    if (!groupAdmins.includes(senderID) && !botAdmins.includes(senderID)) {
      return nayan.sendMessage("⚠️ Only group admins or bot admins can use this command.", threadID);
    }

    if (args.length === 0) {
      return nayan.sendMessage("⚠️ Please provide a name. Usage: antiname [group name]", threadID);
    }

    const newName = args.join(" ");

    // Save new locked name
    lockedNames[threadID] = newName;
    saveLockedNames();

    await nayan.changeGroupName(newName, threadID);
    return nayan.sendMessage(`✅ Group name locked as: ${newName}`, threadID);
  },

  handleEvent: async function ({ nayan, events }) {
    const threadID = events.threadID;
    const lockedName = lockedNames[threadID];

    if (!lockedName) return;

    const currentThreadInfo = await nayan.getThreadInfo(threadID);
    const currentName = currentThreadInfo.threadName;

    if (currentName !== lockedName) {
      await nayan.changeGroupName(lockedName, threadID);
      nayan.sendMessage(`🚫 Group name change detected! Resetting to locked name: ${lockedName}`, threadID);
    }
  }
};
