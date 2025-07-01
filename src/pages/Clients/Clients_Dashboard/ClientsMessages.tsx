import { useParams } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import ClientsMessagesInbox from "./ClientsMessagesInbox";
import ClientChatRoom from "./ClientChatRoom";

const ClientsMessages = () => {
    const { chatId } = useParams();

    return (
        <>
            <PageMeta
                title="Red | Client Messages"
                description="Communicate and collaborate with freelancers through messages on Red."
            />

            {chatId ? <ClientChatRoom /> : <ClientsMessagesInbox />}
        </>
    );
};

export default ClientsMessages;
