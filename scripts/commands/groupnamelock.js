module.exports = {
  config: {
    name: "groupnamelock",
    version: "1.0",
    author: "YourName",
    countDown: 5,
    role: 2, // Only bot admin (role 2) can use
    description: {
      vi: "Khoá tên nhóm theo tên chỉ định",
      en: "Lock group name to specified name"
    },
    category: "box chat",
    guide: {
      vi: "{pn} [tên nhóm mới] | {pn} off",
      en: "{pn} [new group name] | {pn} off"
    }
  },

  onStart: async function ({ message, args, threadsData, event }) {
    const { threadID } = event;

    if (args[0]?.toLowerCase() === "off") {
      await threadsData.set(threadID, {
        name: null,
        status: false
      }, "data.groupNameLock");
      return message.reply("✅ Đã tắt khoá tên nhóm.");
    }

    const newName = args.join(" ");
    if (!newName)
      return message.reply("❌ Vui lòng nhập tên nhóm cần khoá.");

    await threadsData.set(threadID, {
      name: newName,
      status: true
    }, "data.groupNameLock");

    return message.reply(`🔒 Đã khoá tên nhóm thành: "${newName}"`);
  },

  onEvent: async function ({ event, threadsData, api, role }) {
    if (event.logMessageType !== "log:thread-name")
      return;

    const { threadID, logMessageData, author } = event;
    const data = await threadsData.get(threadID, "data.groupNameLock", {});

    if (!data?.status || !data?.name)
      return;

    const newName = logMessageData?.name || "";

    if (newName !== data.name && api.getCurrentUserID() !== author && role < 2) {
      api.setTitle(data.name, threadID);
    }
  }
};
