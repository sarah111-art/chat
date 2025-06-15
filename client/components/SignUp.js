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
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center grid grid-rows-3 gap-2 gradient p-8 rounded-md">
        <h1 className="text-6xl font-bold text-white">Chat App</h1>
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addUser()}
          className="text-2xl text-center rounded-md p-2 my-2 text-blue-400 placeholder-blue-300 focus:outline-none"
        />
        <button
          onClick={addUser}
          disabled={!input}
          className={`text-xl w-full text-white font-bold py-2 px-3 rounded-md
            ${input ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Join Chat
        </button>
      </div>
    </div>
  );
};

export default SignUp;
