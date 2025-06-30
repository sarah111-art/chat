const Chat = ({ chat, user, typing }) => {
  return (
    <div className="h-full pb-12 md:p-4">
      <div className="w-full h-full max-h-screen rounded-md overflow-y-auto gradient pt-2 md:pt-6">
        {
          chat.map((message, index) => {
            const own = message.user?.id === user.id;
            return message.type === "server" ? (
              <ServerMessage key={index} content={message.content} />
            ) : (
              <Message key={index} content={message.content} own={own} type={message.type} />
            );
          })
        }
        {Array.isArray(typing) && typing.length > 0 && <Typing users={typing} />}
      </div>
    </div>
  );
};

const Message = ({ content, own, type }) => {
  if (type === "server") {
    return <p className="w-full text-center text-gray-500 italic my-2">{content}</p>;
  }

  return (
    <p className={`message px-6 py-1 flex ${own ? 'justify-end' : 'justify-start'} items-center`}>
      <span className={`text-3xl py-2 rounded-2xl 
        ${type === "text" ? "px-6" : "px-2"}
        ${own ? "bg-sky-400 text-white" : "bg-slate-200 text-sky-400"}`}>
        {
          type === "text"
            ? content
            : <img src={content} className="rounded-md max-w-xs max-h-60" alt="image" />
        }
      </span>
    </p>
  );
};

const Typing = ({ users }) => {
  return users.map((user, index) => (
    <div key={index} className="px-6 py-1 flex">
      <span className="bg-blue-300 text-blue-600 rounded-full py-2 my-auto text-center px-4 mr-2 flex items-center">
        {user.name?.charAt(0).toUpperCase()}
      </span>
      <div className="loader bg-slate-300 rounded-2xl p-5 flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
      </div>
    </div>
  ));
};

const ServerMessage = ({ content }) => (
  <p className="w-full text-center text-gray-500 italic my-2">{content}</p>
);

export default Chat;
