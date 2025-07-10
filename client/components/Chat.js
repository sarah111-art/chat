const Chat = ({ chat, user, typing }) => {
  return (
    <div className="h-full pb-24 px-4 overflow-y-auto custom-scrollbar">
      {chat.map((message, index) => {
        const own = message.user?.id === user.id;
        return message.type === "server" ? (
          <ServerMessage key={index} content={message.content} />
        ) : (
          <Message key={index} content={message.content} own={own} type={message.type} />
        );
      })}

      {/* Người dùng đang gõ */}
      {Array.isArray(typing) && typing.length > 0 && <Typing users={typing} />}
    </div>
  );
};

const Message = ({ content, own, type }) => {
  return (
    <div className={`my-2 flex ${own ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          ${own ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}
          ${type === "text" ? "px-4 py-2" : "p-2"}
          rounded-2xl max-w-[80%] break-words
        `}
      >
        {type === "text" ? (
          <span className="text-lg">{content}</span>
        ) : (
          <img
            src={content}
            alt="uploaded"
            className="rounded-lg max-w-xs max-h-60 object-cover"
          />
        )}
      </div>
    </div>
  );
};

const Typing = ({ users }) => {
  return users.map((user, index) => (
    <div key={index} className="flex items-center gap-2 my-2 px-2">
      <div className="w-8 h-8 bg-blue-300 text-white flex items-center justify-center rounded-full text-sm font-bold">
        {user.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex gap-1 items-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
      </div>
    </div>
  ));
};

const ServerMessage = ({ content }) => (
  <p className="text-center text-sm text-gray-500 italic my-2">{content}</p>
);

export default Chat;
