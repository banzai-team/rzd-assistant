import React, { useEffect, useRef } from 'react';
import "../styles/chat.css"

import {Box, Flex, Button, Center, Text, Select, Card, IconButton} from '@chakra-ui/react';
import { AiOutlineClose } from "react-icons/ai"
import {
    ChatContainer,
    MainContainer,
    MessageInput,
    MessageList,
    ConversationHeader,
    Avatar
} from '@chatscope/chat-ui-kit-react';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Recorder from './AudioRecorder';
import logo from '../images/rzd.jpg';
import {useMutation} from 'react-query';
import {createChat, sendMessage} from '../domain/api';
import {STORAGE_KEYS, trainsTypes} from '../objects';
import ChatMessages from "./ChatMessages";

const Chat: React.FC = () => {
    const [train, setTrain] = React.useState(trainsTypes[0].value);
    const [chatId, setChatId] = React.useState(localStorage.getItem(STORAGE_KEYS.CHAT_ID));

    const create = useMutation(createChat, {
        onSuccess: (res) => {
            localStorage.setItem(STORAGE_KEYS.CHAT_ID, res.data.id);
            setChatId(res.data.id);
        }
    });

    const sendText = useMutation(sendMessage, {
        onSuccess: (data) => {
            console.log('File sent')
        }
    });

    const onCreate = () => create.mutate(train);
    const onSend = (_: any, textContent: string) => {
        console.log(textContent);
        sendText.mutate({text: textContent, id: chatId})
    };
    const editorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const msgInput = document.querySelector(".cs-message-input__content-editor") as HTMLDivElement;
        editorRef.current = msgInput;
        editorRef.current?.setAttribute("contenteditable", "plaintext-only");
    },[]);

    return <Box height="100vh">
        <MainContainer>
            <ChatContainer>
                <ConversationHeader className="chat_header">
                    <Avatar src={logo} name="Your Assistant" className="main_avatar" />
                    <ConversationHeader.Content userName="Your Assistant" info="Online" className="transparent" />
                    {
                        chatId && (
                            <ConversationHeader.Actions className="transparent">
                                <IconButton
                                    isRound={true}
                                    colorScheme='purple'
                                    size="sm"
                                    aria-label="close"
                                    icon={<AiOutlineClose />}
                                    onClick={() => {
                                        localStorage.removeItem(STORAGE_KEYS.CHAT_ID);
                                        setChatId(null);
                                    }}>Close</IconButton>
                            </ConversationHeader.Actions>
                        )
                    }
                </ConversationHeader>
                <MessageList>
                {
                    chatId ? <ChatMessages chatId={chatId}/>
                        : (
                            <MessageList.Content>
                                <Center>
                                    <Card p={10} mt={10} width={400}>
                                        <Text fontSize="xl" align="center" color='purple'>
                                            Please select type of train
                                        </Text>
                                        <Select
                                            colorScheme='purple'
                                            variant='outline'
                                            mt={4}
                                            mb={10}
                                            onChange={(ev) => setTrain(ev.target.value)}
                                        >
                                            {
                                                trainsTypes.map(train => (
                                                    <option value={train.value} key={train.value}>
                                                        {train.text}
                                                    </option>
                                                ))
                                            }
                                        </Select>

                                        <Button
                                            colorScheme='purple'
                                            variant='outline'
                                            onClick={onCreate}
                                        >
                                            Start chat
                                        </Button>
                                    </Card>
                                </Center>

                            </MessageList.Content>
                    )
                }
                </MessageList>
                {/*<MessageInput placeholder="Type message here" attachButton={false}/>*/}
                {
                    chatId ? (
                        <Flex
                            // @ts-ignore
                            as="MessageInput"
                            width="100%"
                            borderTop="1px solid #d1dbe3"
                            alignItems="end"
                        >
                            <MessageInput
                              contentEditable={false}
                                placeholder="Type message here"
                                attachButton={false}
                                style={{flex: "1", borderTop: "none"}}
                                onSend={onSend}
                            />
                            <Box p={1}><Recorder /></Box>
                        </Flex>
                    ) : null
                }
            </ChatContainer>
        </MainContainer>
    </Box>;
};

export default Chat