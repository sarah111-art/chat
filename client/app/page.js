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
  const socket = useRef(io("http://localhost:3001"));
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
    <main className="h-screen max-h-screen max-w-screen mx-auto md:container md:p-20 md:pt-4">
    {user.current?.name && user.current?.id ? (
  <>
    <Chat user={user.current} chat={chat} typing={typing} />
    <Inputs user={user.current} socket={socket.current} setChat={setChat} />
  </>
) : (
  <SignUp user={user} socket={socket.current} input={input} setInput={setInput} />
)}


    </main>
  );
}
