import { useState } from "react";

const SignUp = ({ user, socket, input, setInput }) => {
  const addUser = () => {
    if (input.trim() === "") {
      alert("Please enter a valid name");
      return;
    }

    const newUser = {
      name: input,
      id: socket.id || socket.current?.id  // fallback nếu socket là ref
    };

    user.current = newUser;
    socket.emit("new_user", { user: newUser });
    localStorage.setItem("user", input);  // lưu tên
    setInput("");
  };

return (
  <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-white to-purple-100">
    <div className="text-center grid gap-4 p-8 rounded-lg backdrop-blur-md bg-white/80 shadow-2xl max-w-md w-full">
      <h1 className="text-5xl font-bold text-blue-700 drop-shadow-sm">Chat App</h1>
      <h2 className="text-2xl font-semibold text-gray-700">Sign Up</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addUser()}
        className="text-xl text-center rounded-md p-2 my-2 w-full text-blue-500 placeholder-blue-300 focus:outline-none border border-blue-300 focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={addUser}
        disabled={!input.trim()}
        className={`text-xl w-full font-bold py-2 px-4 rounded-md transition duration-200 ${
          input.trim()
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Join Chat
      </button>
    </div>
  </div>
);

};

export default SignUp;
