import React from 'react';
import "../styles/chat.css"
import {useQuery} from 'react-query';
import { FaRegFileAudio } from "react-icons/fa"

import { Message, MessageList } from '@chatscope/chat-ui-kit-react';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { getConversationHistory } from '../domain/api';
import Loader from "./Loader";
import {Center, Link, Text} from "@chakra-ui/react";
import {config} from "../config/config";


const ChatMessages: React.FC<{ chatId: string }> = ({ chatId }) => {
    const { data, isLoading } = useQuery([], () => getConversationHistory(chatId));

    if (isLoading) {
        return (
            <MessageList.Content>
                <Center flexDirection="column">
                    <Text fontSize="xl" align="center" mt={10} color='purple'> Load Chat </Text>
                    <Loader/>
                </Center>
            </MessageList.Content>
        );
    }

    const firstMessage = {
        message: "Здравствуйте! Чем могу помочь?",
        sentTime: "",
        sender: "bot",
        position: "normal",
        direction: "incoming"
    };


    const messages = [firstMessage,
        // @ts-ignore
        ...data?.data?.content.map(message => ({
        message: message.content,
        sentTime: message.time,
        sender: message.source,
        position: "normal",
        audio: message.audio,
        direction: message.source === "user" ? "outgoing" : "incoming"
    })).reverse()
    ];

    return (
        <>
            {
                // @ts-ignore
                messages.map((message, key) => (
                    // Problem with types
                    // @ts-ignore
                    <Message key={`message-${key}`} model={message}>
                        <Message.CustomContent>
                            {message.audio ? (
                                <Link
                                    display="block"
                                    maxWidth="fit-content"
                                    mb={1}
                                    isExternal
                                    href={`${config.apiUrl}${message.audio.replace('/tmp', '')}`}
                                    fontSize={25}
                                    _hover={{
                                        opacity: 0.5
                                    }}
                                >
                                    <FaRegFileAudio />
                                </Link>
                            ) : null}
                            {message.message}
                        </Message.CustomContent>
                    </Message>
                ))
            }

        </>
    );
};

export default ChatMessages