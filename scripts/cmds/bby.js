const axios = require("axios");

const mahmud = [
  "baby",
  "bby",
  "babu",
  "bbu",
  "jan",
  "bot",
  "",
  "",
  "",
  "Rocky",
  "hinata",
  " Jannati",
  "Taiba",
  " Tahar"
];

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

/**
* @author MahMUD
* @author: do not delete it
*/

module.exports.config = {
   name: "hinata",
   aliases: ["baby", "bby", "bbu", "jan", "Taiba", "Rocky", "bot"," Jannati","Tahar"],
   version: "1.7",
   author: "MahMUD",
   role: 0,
   category: "chat",
   guide: {
     en: "{pn} [message] OR teach [question] - [response1, response2,...] OR remove [question] - [index] OR list OR list all OR edit [question] - [newResponse] OR msg [question]\nNote: The most updated and fastest all-in-one Simi Chat."
   }
 };

module.exports.onStart = async ({ api, event, args, usersData }) => {
      const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);  if (module.exports.config.author !== obfuscatedAuthor) {  return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID); }
      const msg = args.join(" ").toLowerCase();
      const uid = event.senderID;

  try {
    if (!args[0]) {
      const ran = ["Bolo baby", "I love you", "type !bby hi"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }

 
    if (args[0] === "teach") {
      const mahmud = msg.replace("teach ", "");
      const [trigger, ...responsesArr] = mahmud.split(" - ");
      const responses = responsesArr.join(" - ");
      if (!trigger || !responses) return api.sendMessage(" | teach [question] - [response1, response2,...]", event.threadID, event.messageID);
      const response = await axios.post(`${await baseApiUrl()}/api/jan/teach`, { trigger, responses, userID: uid,  });
      const userName = (await usersData.getName(uid)) || "Unknown User";
      return api.sendMessage( ` Replies added: "${responses}" to "${trigger}"\n : ${userName}\n : ${response.data.count || 0}`, event.threadID, event.messageID  );
   }

    
    if (args[0] === "remove") {
      const mahmud = msg.replace("remove ", "");
      const [trigger, index] = mahmud.split(" - ");
      if (!trigger || !index || isNaN(index)) return api.sendMessage(" | remove [question] - [index]", event.threadID, event.messageID);
      const response = await axios.delete(`${await baseApiUrl()}/api/jan/remove`, {
      data: { trigger, index: parseInt(index, 10) }, });
      return api.sendMessage(response.data.message, event.threadID, event.messageID);
   }

    
    if (args[0] === "list") {
      const endpoint = args[1] === "all" ? "/list/all" : "/list";
      const response = await axios.get(`${await baseApiUrl()}/api/jan${endpoint}`);
      if (args[1] === "all") {  let message = " List of Hinata teachers:\n\n";
      const data = Object.entries(response.data.data) .sort((a, b) => b[1] - a[1])  .slice(0, 15); for (let i = 0; i < data.length; i++) {
      const [userID, count] = data[i];
      const name = (await usersData.getName(userID)) || "Unknown"; message += `${i + 1}. ${name}: ${count}\n`; } return api.sendMessage(message, event.threadID, event.messageID); }
      return api.sendMessage(response.data.message, event.threadID, event.messageID);
   }

    
    if (args[0] === "edit") {
      const mahmud = msg.replace("edit ", "");
      const [oldTrigger, ...newArr] = mahmud.split(" - ");
      const newResponse = newArr.join(" - ");  if (!oldTrigger || !newResponse)
      return api.sendMessage(" | Format: edit [question] - [newResponse]", event.threadID, event.messageID);
      await axios.put(`${await baseApiUrl()}/api/jan/edit`, { oldTrigger, newResponse });
      return api.sendMessage(` Edited "${oldTrigger}" to "${newResponse}"`, event.threadID, event.messageID);
   }

    
    if (args[0] === "msg") {
      const searchTrigger = args.slice(1).join(" ");
      if (!searchTrigger) return api.sendMessage("Please provide a message to search.", event.threadID, event.messageID); try {
      const response = await axios.get(`${await baseApiUrl()}/api/jan/msg`, {  params: { userMessage: `msg ${searchTrigger}` }, });
      return api.sendMessage(response.data.message || "No message found.", event.threadID, event.messageID);  } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "error";
      return api.sendMessage(errorMessage, event.threadID, event.messageID);   }
   }

    
    const getBotResponse = async (text, attachments) => { try { 
      const res = await axios.post(`${await baseApiUrl()}/api/hinata`, { text, style: 3, attachments }); return res.data.message; } catch { return "error janu"; } };
      const botResponse = await getBotResponse(msg, event.attachments || []);
      api.sendMessage(botResponse, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "hinata",
          type: "reply",
          messageID: info.messageID,
          author: uid,
          text: botResponse
        });
      }
    }, event.messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage(`${err.response?.data || err.message}`, event.threadID, event.messageID);
  }
};


module.exports.onReply = async ({ api, event }) => {
   if (event.type !== "message_reply") return; try { const getBotResponse = async (text, attachments) => {  try {
    const res = await axios.post(`${await baseApiUrl()}/api/hinata`, { text, style: 3, attachments }); return res.data.message; } catch {  return "error janu"; } };
    const replyMessage = await getBotResponse(event.body?.toLowerCase() || "meow", event.attachments || []);
    api.sendMessage(replyMessage, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "hinata",
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          text: replyMessage
        });
      }
    }, event.messageID);
  } catch (err) {
    console.error(err);
  }
};


module.exports.onChat = async ({ api, event }) => {
  try {
    const message = event.body?.toLowerCase() || "";
    const attachments = event.attachments || [];

    if (event.type !== "message_reply" && mahmud.some(word => message.startsWith(word))) {
      api.setMessageReaction("", event.messageID, () => {}, true); api.sendTypingIndicator(event.threadID, true);   const messageParts = message.trim().split(/\s+/);
      const getBotResponse = async (text, attachments) => {
      try {
      const res = await axios.post(`${await baseApiUrl()}/api/hinata`, { text, style: 3, attachments });  return res.data.message; } catch {  return "error janu";
        }
      };

       const randomMessage = [
          "babu khuda lagse",
          "Hop beda,Boss  boss",  
          "  ,     ",  
          "",
          "bye",
          "naw amr boss k message daw t.me/alveeevanrocky320",
          "mb ney bye",
          "meww",
          "       ",
          "  ,    ?",  
          "  __",
          "  __",
          "   ",
          "",
          " ",
          " sir__",
          " __",
          "      __",
          "",
          "   _",
          "    ",
          " _",
          "     __",
          "  ,  ",
          " bby Bbby  leave   ",
          "__     ",
          "  ,   ? ",
          "bolo baby",
          "       ,    ?",
          "      ",
          "      ,        ",
          "  .!     .!_    ",
          "     ",
          " ,    ,      ",
          "    ?     ",
          "          _",
          " __",
          "  ,  ",
          "    ",
          "      , ROCKY ,ROCKY    ?",
          "  ,   ? ",
          "    ..!      ",
          "    ",
          "   ,",
          " ",
          "      ",
          "   ",
          "   ,     ",
          "    mood  ",
          "   ",
          " Bolo  ,  ? ",
          " BF   ",
          "      ",
          "oi mama ar dakis na pilis ",
          "",
          "__    ",
          "   _",
          " _   ",
          "    ",
          " ,  ?",
          " _",
          "amr JaNu lagbe,Tumi ki single aso?",
          "        ",
          "      ,,",
          "        _",
          "      -   ",
          "      __",
          "  ,    ?",
          "   ",
          "   ..",
          "         ",
          "   ,      ",
          "      ",
          "   ...!! ",
          "  Disturb   ,       ",
          "        ",
          "       ",
          "  single ? ",
          "  ",
          "Meow",     
          "    ,  ",
          " ,     ",
          "Bolo Babu,    ? ",
          "  m   ",
          "   Crush",
          "    ,   /' .!",
          "  '  !!  ' -     !'",
          "      ",
          "__ '  '     ",
          "      'Snapchat' ! " 
        ];
                                                                                                                    
        const hinataMessage = randomMessage[Math.floor(Math.random() * randomMessage.length)];
        if (messageParts.length === 1 && attachments.length === 0) {
        api.sendMessage(hinataMessage, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "hinata",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              text: hinataMessage
            });
          }
        }, event.messageID);
      } else { let userText = message; for (const prefix of mahmud) {
          if (message.startsWith(prefix)) { userText = message.substring(prefix.length).trim();
          break;
          }
        }

        const botResponse = await getBotResponse(userText, attachments);
        api.sendMessage(botResponse, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "hinata",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              text: botResponse
            });
          }
        }, event.messageID);
      }
    }
  } catch (err) {
    console.error(err);
  }
};
