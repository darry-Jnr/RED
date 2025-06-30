// pages/Clients/ClientsMessages.tsx

import { Routes, Route } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import ClientsMessagesInbox from "./ClientsMessagesInbox";
import ClientChatRoom from "./ClientChatRoom";

const ClientsMessages = () => {
    return (
        <>
            <PageMeta
                title="Red | Client Messages"
                description="Communicate and collaborate with freelancers through messages on Red."
            />

            <Routes>
                <Route index element={<ClientsMessagesInbox />} />
                <Route path=":chatId" element={<ClientChatRoom />} />
            </Routes>
        </>
    );
};

export default ClientsMessages;
