// import axios from "axios";

// export const getMessages = async (conversationId) => {
//   try {
//     const {data} = await axios.get(`${process.env.CHAT_SERVICE_URL}/get-messages/${conversationId}`);
//     return data;
//   } 
//   catch (error) {
//     console.error("Error fetching messages:", error);
//     return null;
//   }
// }

import Message from "../../chat/models/message.model.js";

export const getMessages = async (conversationId) => {
  try {
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    return messages.map((m) => ({ role: m.role, content: m.content }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};