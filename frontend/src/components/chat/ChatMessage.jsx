import { motion } from "framer-motion";

export default function ChatMessage({ msg, index, username, listenerColor }) {
  const isSystem = msg.system;
  const isMine = msg.user === username;

  const bubbleClass = isSystem
    ? "bg-white/5 text-white/50 text-center text-[10px] mx-auto"
    : isMine
    ? "bg-aura-pink text-white text-right"
    : "bg-white/10 text-white";

  const wrapperClass = `flex items-start gap-2 ${
    isSystem ? "justify-center" : isMine ? "flex-row-reverse" : ""
  }`;

  const avatarStyle = {
    backgroundColor: listenerColor,
  };

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 ${wrapperClass}`}
    >
      {!isSystem && !isMine && (
        <div
          className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold"
          style={avatarStyle}
        >
          {msg.user.charAt(0).toUpperCase()}
        </div>
      )}
      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${bubbleClass}`}>
        {!isSystem && isMine ? (
          <>
            <div className="text-[10px] font-bold mb-1">{msg.user}</div>
            {msg.text}
          </>
        ) : !isSystem ? (
          <>
            <div className="text-[10px] font-bold mb-1">{msg.user}</div>
            {msg.text}
          </>
        ) : (
          msg.text
        )}
      </div>
      {!isSystem && isMine && (
        <div
          className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold border-2 border-white/20"
          style={avatarStyle}
        >
          {username.charAt(0).toUpperCase()}
        </div>
      )}
    </motion.div>
  );
}
