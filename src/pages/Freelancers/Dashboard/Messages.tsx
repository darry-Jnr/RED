import { Routes, Route } from "react-router-dom";
import MessagesInbox from "./MessagesInbox";
import FreelancerChatRoom from "./FreelancerChatRoom";

const Messages = () => {
    return (
        <Routes>
            <Route index element={<MessagesInbox />} />
            <Route path=":chatId" element={<FreelancerChatRoom />} />
        </Routes>
    );
};

export default Messages;
