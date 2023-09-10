import React from 'react';
import "../styles/chat.css"
import {useQuery} from 'react-query';
import { FaRegFileAudio } from "react-icons/fa"

import { Message, MessageList } from '@chatscope/chat-ui-kit-react';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { getConversationHistory } from '../domain/api';
import Loader from "./Loader";
import {Center, Link, Text, Spinner} from "@chakra-ui/react";
import {config} from "../config/config";


const ChatMessages: React.FC<{ chatId: string }> = ({ chatId }) => {
    const { data, isLoading } = useQuery([], () => getConversationHistory(chatId),{refetchInterval: 1000});

    if (isLoading) {
        return (
            <MessageList.Content>
                <Center flexDirection="column">
                    <Text fontSize="xl" align="center" mt={10} color='purple'> Загружаем чат</Text>
                    <Loader/>
                </Center>
            </MessageList.Content>
        );
    }

    const firstMessage = {
        message: "Здравствуйте! Я бот Banzai. \n\nНемного информации обо мне:\n-Чтобы начать запись - нажмите на 🎤 в правом нижнем углу.\n-Если хотите начать новый чат - нажмите на ❌ в правом верхнем углу.\n-Так же вы можете вводить информацию текстом, если вам так будет проще\n\nВ LLM моде ответы могут занимать до двух минут - я не повис, я просто думаю\n\nЧем могу помочь?",
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
                            {!message.audio && !message.message && message.direction ===  "incoming"
                                // ? <Spinner color="purple"/>
                                ? <Spinner color="purple" ml={5} mr={5}/>
                                : null
                            }
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