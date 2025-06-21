module.exports.config = {
  name: "antiname",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "ChatGPT x You",
  description: "Lock group name",
  commandCategory: "group",
  usages: "[group name to lock]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Threads }) {
  const nameToLock = args.join(" ");
  if (!nameToLock) return api.sendMessage("⚠️ Please provide a group name to lock.\nUsage: antiname [name]", event.threadID);

  let threadData = await Threads.getData(event.threadID);
  threadData.data = threadData.data || {};
  threadData.data.lockedName = nameToLock;
  await Threads.setData(event.threadID, threadData);

  return api.sendMessage(`✅ Group name has been locked to: "${nameToLock}".\nIf someone changes it, I'll change it back.`, event.threadID);
};
