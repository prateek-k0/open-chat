import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useGetMessagesQuery } from "../../api/MessageApi";
import { useSendMessageMutation } from "../../api/MessageApi";
import { userDetailsSelector } from "../../store/slices/UserDetailsSlice";
import './styles.css';
import MessageItem from "../MessageItem/MessageItem";
import IconSend24 from "../../common/Icons/IconSend24";
import { useFetchUserDetailsQuery } from "../../api/UserAuthApi";

const ChatView = ({ roomId }) => {
  const userDetails = useSelector(userDetailsSelector);
  const { data } = useGetMessagesQuery();
  const room = data[roomId];
  const [message, setMessage] = useState('');
  const otherUsers = room.members.filter((member) => member !== userDetails.userId);
  const [sendMessageTrigger, { isLoading: sendMessageLoading }] = useSendMessageMutation();
  const { data: otherUserDetails, isFetching: isOtherUserDetailsFetching, error: otherUserDetailsError } = useFetchUserDetailsQuery(otherUsers[0]);
  const otherUsername = (isOtherUserDetailsFetching || otherUserDetailsError) ? ' ' : otherUserDetails.user.username;

  useEffect(() => {
    setMessage('');
  }, [room.roomId]);

  const sendMessageHandler = () => {
    if(message !== '') {
      sendMessageTrigger({ userId: userDetails.userId, message, roomId: room.roomId });
      setMessage('');
    }
  }

  const keyUpHandler = (event) => {
    if(event.keyCode === 13 && !event.shiftKey) sendMessageHandler();
  }

  const idClickHandler = (event) => {
    event.target.textContent = 'Copied'
    navigator.clipboard.writeText(room.roomId);
    setTimeout(() => {
      event.target.textContent = 'Copy Room Id'
    }, 1500)
  }

  const containerCallbackRef = (node) => {
    if(node !== null) {
      node.scrollTop = node.scrollHeight;
    }
  };
  
  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="header bg-slate-900 border-b border-slate-700 text-white text-xl px-8 items-center h-16 flex justify-between font-mono">
        {room.isDM === true ? otherUsername : room.roomName} 
        {room.isDM === false && <button className='border rounded-md px-4 hover:bg-white hover:text-slate-800 py-2 text-sm border-white' onClick={idClickHandler}>Copy Room Id</button>}
      </div>
      <div ref={containerCallbackRef} className="content flex-1 overflow-y-auto">
        <div className="messages box-border max-w-full px-8">
          {
            room.messages.map((message, i) => (
              <MessageItem
                includeUsername={(i === 0) || (message.sentBy.userId !== room.messages[i-1].sentBy.userId)}
                message={message} 
                key={`${message.sentBy.userId}#${message.sentAt}`} 
                isSenderSameAsPrevious={(i > 0) && (message.sentBy.userId === room.messages[i-1].sentBy.userId)}
              />
            ))
          }
        </div>
      </div>
      <div className="textbox border-t border-slate-700 text-white text-lg px-8 py-4 h-15 flex gap-4">
        <input onKeyUp={keyUpHandler} className="flex-1 px-4 text-sm py-2 rounded-full text-black outline-none" type="text" onChange={(e) => setMessage(e.target.value)} value={message} placeholder="Enter message" />
        <button onClick={sendMessageHandler} className="rounded-full text-sm border-white h-10 w-10 flex items-center justify-center hover:bg-slate-600 bg-slate-900"><IconSend24 width="22" height="22" /></button>
      </div>
    </div>
  )
}

export default ChatView