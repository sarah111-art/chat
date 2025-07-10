"use client";
import { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import Chat from "@/components/Chat";
import Inputs from "@/components/Inputs";
import SignUp from "@/components/SignUp";

export default function Home() {
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState([]);
  const [input, setInput] = useState("");
  const socket = useRef(io(process.env.NEXT_PUBLIC_SOCKET_URL));
  const user = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      user.current = { name: savedUser, id: socket.current.id };
      socket.current.emit("new_user", { user: user.current });
    }

    socket.current.on("receive_message", (msg) => {
      setChat(prev => [...prev, msg]);
    });

    socket.current.on("new_user", (name) => {
      setChat(prev => [...prev, { content: `${name} has joined the chat`, type: "server" }]);
    });

    socket.current.on("user_typing", (data) => {
      if (!data.typing) return;
      setTyping((prev) => {
        if (!prev.find((u) => u.id === data.user.id)) {
          return [...prev, data.user];
        }
        return prev;
      });
    });

    socket.current.on("user_stop_typing", (u) => {
      setTyping(prev => prev.filter((user) => user.id !== u.id));
    });

    return () => socket.current.disconnect();
  }, []);

  return (
    <main className="h-screen max-h-screen max-w-screen mx-auto bg-white text-gray-900">
      {user.current?.name && user.current?.id ? (
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="h-[60px] px-6 border-b flex items-center justify-between bg-white shadow">
            <div className="font-semibold text-lg">
              Xin chào, {user.current.name}
            </div>
            <div className="w-9 h-9 bg-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.current.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-blue-50">
            <Chat user={user.current} chat={chat} typing={typing} />
          </div>

          {/* Nhập tin nhắn */}
          <div className="px-4 py-3 bg-white border-t shadow-sm">
            <Inputs user={user.current} socket={socket.current} setChat={setChat} />
          </div>
        </div>
      ) : (
        <SignUp user={user} socket={socket.current} input={input} setInput={setInput} />
      )}
    </main>
  );
}
