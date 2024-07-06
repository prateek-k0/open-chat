import { userDetailsSelector } from "../../store/slices/UserDetailsSlice";
import { useSelector } from 'react-redux';
import './styles.css';
import moment from 'moment';

const MessageItem = ({ message, includeUsername = true, isSenderSameAsPrevious = false }) => {
  const userDetails = useSelector(userDetailsSelector);
  const isUser = userDetails.userId === message.sentBy.userId;
  const isSysMessage = message.type.toLowerCase() === 'sys';
  const isNotCurrentDay = (new Date()).getDay() !== moment(message.sentAt).day();
  const date = moment(message.sentAt).format(`${isNotCurrentDay ? 'D/MM/Y h:mm A' : 'h:mm A'} `);
  if(isSysMessage) {
    return (
      <div className="flex justify-center w-full my-6">
        <div className="mx-20 max-w-full box-border rounded-lg bg-gray-800 w-fit px-4 py-2">
          <p className="text-slate-400 font-light font-sans">{message.message}</p>
        </div>
      </div>
    )
  }
  return (
    <div className={`mx-2 ${isSenderSameAsPrevious ? 'mt-0.5' : 'mt-2'} flex w-fit flex-col gap-y-1 ${isUser ? 'ml-auto' : 'mr-auto'} message-container-${isUser ? 'left' : 'right'}`}>
      {includeUsername && <p className="text-gray-200 font-light text-sm w-fit font-sans">{message.sentBy.username}</p>}
      <div className={`${isUser ? 'text-slate-800 bg-white text-right' : 'text-white bg-slate-700 text-left'} py-2 px-4 rounded-lg w-fit break-all`}>
        {message.message}
        <p className={` ${isUser ? 'text-slate-600' : 'text-slate-100'} font-light text-xs mt-1 font-sans`}>{date}</p>
      </div>
      
    </div>
  )
}

export default MessageItem