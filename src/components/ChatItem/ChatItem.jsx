import { useSelector } from "react-redux";
import { userDetailsSelector } from "../../store/slices/UserDetailsSlice";
import FetchUserName from "../FetchUserName/FetchUserName";

const ChatItem = ({ room = null, clickHandler = () => {}, collapsed = false }) => {
  const userDetails = useSelector(userDetailsSelector);
  if(!room) return <div>Error!</div>
  const lastMessage = room.messages.length > 0 ? room.messages[room.messages.length - 1].message : 'Last Message';
  const unseenMessageCount = room.messages.filter((message) => message.sentAt > room.lastOpenedAt).length;
  const isRoomUpdated = room.lastOpenedAt < room.lastUpdateAt;
  const otherUsers = room.members.filter((member) => member !== userDetails.userId);
  const roomNameInitials = room.isDM === true ? 'DM' : room.roomName.trim().split(' ').map(s => s[0].toUpperCase()).slice(0, 3).join('');
  return (
    <div 
      className={`relative group py-2 hover:bg-white hover:text-slate-800 cursor-pointer h-16 font-sans flex ${collapsed ? 'justify-center' : 'pl-2 pr-7'} gap-4 items-center max-w-full box-border rounded-md`}
      onClick={() => clickHandler(room)}>
      <div className="relative group-hover:bg-slate-800 group-hover:text-white w-10 h-10 flex flex-shrink-0 items-center justify-center border border-white rounded-full logo">
        {roomNameInitials}
        {isRoomUpdated && <div className="bg-red-500 w-2 h-2 rounded-full absolute right-1 top-0 notification-dot"></div>}
      </div>
      {collapsed === false && <div className="max-w-full box-border overflow-hidden content">
        <p className="text-md font-semibold whitespace-nowrap text-ellipsis overflow-hidden">{room.isDM ? <FetchUserName userId={otherUsers[0]} /> : room.roomName}</p>
        <p className={`text-sm ${isRoomUpdated ? 'font-bold' : 'font-extralight'} whitespace-nowrap text-ellipsis overflow-hidden`}>{lastMessage}</p>
      </div>}
      {collapsed === false && unseenMessageCount > 0 && <div 
        className=" bg-slate-50 text-slate-800 absolute text-xs bottom-3 right-1 group-hover:text-white group-hover:bg-slate-800 w-5 h-5 flex justify-center items-center font-mono font-semibold rounded-full unseen-message-count"
      >
        {unseenMessageCount > 9 ? '9+' : unseenMessageCount}
      </div>}
    </div>
  )
}

export default ChatItem