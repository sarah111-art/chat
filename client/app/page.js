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
  if (!data.typing) return; // ✅ Chỉ hiển thị nếu đang gõ

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
      <div className="flex h-full w-full">
        {/* Sidebar trái */}
        <aside className="hidden md:flex flex-col w-[280px] bg-white border-r shadow-sm">
          <div className="p-4 font-bold text-xl border-b">Zalo Chat</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Danh sách bạn */}
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">P</div>
              <div className="font-medium">Phát Võ</div>
            </div>
            {/* ... thêm bạn khác nếu có */}
          </div>
        </aside>

        {/* Khung chat chính */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="h-[60px] px-4 border-b flex items-center justify-between bg-white shadow">
            <div className="font-semibold text-lg">Nguyễn Tiết Xuân Quý</div>
            {/* Avatar bên phải */}
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">N</div>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-y-auto bg-blue-100">
            <Chat user={user.current} chat={chat} typing={typing} />
          </div>

          {/* Nhập tin nhắn */}
          <div className="px-4 py-3 bg-white border-t">
            <Inputs user={user.current} socket={socket.current} setChat={setChat} />
          </div>
        </div>
      </div>
    ) : (
      <SignUp user={user} socket={socket.current} input={input} setInput={setInput} />
    )}
  </main>
);

}
