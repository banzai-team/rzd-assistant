import React from 'react';
import "../styles/chat.css"
import {useQuery} from 'react-query';

import { Message, MessageList } from '@chatscope/chat-ui-kit-react';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { getConversationHistory } from '../domain/api';
import Loader from "./Loader";
import {Center, Text} from "@chakra-ui/react";


const ChatMessages: React.FC<{ chatId: string }> = ({ chatId }) => {
    const { data, isLoading } = useQuery([], () => getConversationHistory(chatId));

    if (isLoading) {
        return (
            <MessageList.Content>
                <Center flexDirection="column">
                    <Text fontSize="xl" align="center" mt={10}> Load Chat </Text>
                    <Loader/>
                </Center>
            </MessageList.Content>
        );
    }

    // @ts-ignore
    const messages = data?.data?.content.map(message => ({
        message: message.content,
        sentTime: message.time,
        sender: message.source,
        position: "normal",
        direction: message.source === "user" ? "outgoing" : "incoming"
    }));

    return (
        <>
            {
                // @ts-ignore
                messages.map((message, key) => (
                    // Problem with types
                    // @ts-ignore
                    <Message key={`message-${key}`} model={message}/>
                ))
            }

        </>
    );
};

export default ChatMessages