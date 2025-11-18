import { useChat } from "../../contexts/ChatContext";
import ChatWindow from "./ChatWindow";

export default function ChatManager() {
  const { openChats } = useChat();

  return (
    <div className="fixed bottom-4 right-4 flex gap-4 z-50">
      {openChats.map(chat => (
        <ChatWindow key={chat.chatId} chat={chat} />
      ))}
    </div>
  );
}
