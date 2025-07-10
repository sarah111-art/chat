import { send, upload } from '@/assets';
import Image from 'next/image';
import { useRef, useState } from 'react';

const Inputs = ({ user, socket, setChat }) => {
  const [input, setInput] = useState("");
  const uploadInput = useRef(null);

  const sendMessage = () => {
    if (input.trim()) {
      const msg = { content: input, type: "text", user };
      socket.emit("send_message", msg);
      setChat(prev => [...prev, msg]);
      setInput("");
      socket.emit("user_typing", { user, typing: false });
    } else {
      uploadInput.current.click();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const msg = { content: reader.result, type: "image", user };
        socket.emit("send_message", msg);
        setChat(prev => [...prev, msg]);
      };
      reader.readAsDataURL(file);
    }
    uploadInput.current.value = null;
  };

  const userTyping = (e) => {
    const value = e.target.value;
    setInput(value);
    socket.emit("user_typing", { user, typing: value.length > 0 });
  };

  return (
    <div className="w-full p-3 bg-white border-t border-gray-200 fixed bottom-0 md:static">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={userTyping}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />

        <input
          type="file"
          ref={uploadInput}
          onChange={handleImageUpload}
          className="hidden"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 transition text-white p-3 rounded-full"
          title={input ? "Gửi tin nhắn" : "Tải ảnh"}
        >
          <Image
            src={input ? send : upload}
            alt="send"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
};

export default Inputs;
