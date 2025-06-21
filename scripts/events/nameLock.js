module.exports.config = {
  name: "nameLock",
  eventType: ["log:thread-name"],
  version: "1.0.0",
  credits: "ChatGPT x You",
  description: "Prevent group name change"
};

module.exports.run = async ({ event, api, Threads }) => {
  const threadID = event.threadID;
  const newName = event.logMessageData.name;

  const threadData = await Threads.getData(threadID);
  const lockedName = threadData.data?.lockedName;

  if (!lockedName) return;

  if (newName !== lockedName) {
    // Change it back
    api.setTitle(lockedName, threadID, (err) => {
      if (!err) {
        api.sendMessage(`⚠️ Group name was changed. Reverted back to: "${lockedName}"`, threadID);
      }
    });
  }
};
