import { send, upload } from '@/assets';
import Image from 'next/image';
import { useRef, useState } from 'react';

const Inputs = ({ user, socket, setChat }) => {
  const [input, setInput] = useState("");
  const uploadInput = useRef(null);

  const sendMessage = () => {
    if (input) {
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

  if (value.length > 0) {
    socket.emit("user_typing", { user, typing: true });
  } else {
    socket.emit("user_typing", { user, typing: false }); // Hoặc emit "user_stop_typing"
  }
};


  return (
    <div className="w-full absolute bottom-0 text-xl grid grid-cols-5 
        gradient md:bg-none md:text-3xl md:flex md:justify-center md:relative">
      <input className="focus:outline-none rounded-2xl p-3 text-white placeholder-slate-200 
            col-span-4 gradient md:w-6/12 md:mr-3"
        type="text"
        placeholder="Enter your message"
        value={input}
        onChange={userTyping}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <input className='hidden' type="file" ref={uploadInput} onChange={handleImageUpload} />
      <button onClick={sendMessage} className="w-full py-2 px-3 bg-sky-400 text-black
            font-bold rounded-md text-xl gradient md:w-1/12 md:text-2xl">
        <Image src={input ? send : upload} alt="sent" className='w-6 md:w-12 mx-auto' height={20} width={20} />
      </button>
    </div>
  );
};

export default Inputs;
