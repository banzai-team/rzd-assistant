import React from 'react';
import "../styles/chat.css"

import {Box, Flex, Button, Center, Text, Select, Card} from '@chakra-ui/react';
import {
    ChatContainer,
    MainContainer,
    Message,
    MessageInput,
    MessageList,
    ConversationHeader,
    Avatar
} from '@chatscope/chat-ui-kit-react';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Recorder from './AudioRecorder';
import logo from '../images/rzd.jpg';
import {useMutation} from 'react-query';
import {createChat, getConversationHistory, sendMessage, sendRecord} from '../domain/api';
import {STORAGE_KEYS, trainsTypes} from '../objects';

const Chat: React.FC = () => {
    const [train, setTrain] = React.useState(trainsTypes[0].value);
    const [chatHistory, setChatHistory] = React.useState([]);
    
    const chatId = localStorage.getItem(STORAGE_KEYS.CHAT_ID);
    
    React.useEffect(() => {
        chatId && getChatHistory.mutate(chatId);
    }, []);
    
    const create = useMutation(createChat, {
        onSuccess: (res) => {
            localStorage.setItem(STORAGE_KEYS.CHAT_ID, res.data.id);
        }
    });

    const getChatHistory = useMutation(getConversationHistory, {
        onSuccess: (res) => {
            setChatHistory(res.data.content);
        }
    });

    const sendText = useMutation(sendMessage, {
        onSuccess: (data) => {
            console.log('File sent')
        }
    });

    const onCreate = () => create.mutate(train);
    const onSend = (textContent: string) => sendText.mutate({text: textContent, id: chatId});

    /*const messages = chatHistory.map(el => ({
        message: "Hello my friend",
        sentTime: "just now",
        sender: "Joe",
        direction: "incoming",
        position: "normal"
    }))*/
    
    const messages = [
        {
            message: "Hello my friend",
            sentTime: "just now",
            sender: "Joe",
            direction: "incoming",
            position: "normal"
        },
        {
            message: "Hello my friend",
            sentTime: "just now",
            sender: "Joe",
            direction: "incoming",
            position: "normal"
        },
        {
            message: "Hello my friend 1 2 3 4 5",
            sentTime: "just now",
            sender: "Joe",
            direction: "incoming",
            position: "normal"
        },
        {
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            sentTime: "just now",
            sender: "Joe",
            direction: "incoming",
            position: "normal"
        },
        {
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            sentTime: "just now",
            sender: "Joe",
            direction: "outgoing",
            position: "normal"
        },
        {
            message: "Hello my friend",
            sentTime: "just now",
            sender: "Joe",
            direction: "outgoing",
            position: "normal"
        }
    ];

    return <Box height="100vh">
        <MainContainer>
            <ChatContainer>
                <ConversationHeader className="chat_header">
                    <Avatar src={logo} name="Your Assistant" className="main_avatar" />
                    <ConversationHeader.Content userName="Your Assistant" info="Active 10 mins ago" className="transparent" />
                    {/*<ConversationHeader.Actions className="transparent">*/}
                    {/*    <Recorder />*/}
                    {/*</ConversationHeader.Actions>*/}
                </ConversationHeader>
                <MessageList>
                {
                    chatId ? (
                        <>
                                {
                                    messages.map((message, key) => (
                                        // Problem with types
                                        // @ts-ignore
                                        <Message key={`message-${key}`} model={message}/>
                                    ))
                                }

                        </>
                    ) : (
                            <MessageList.Content>
                                <Center>
                                    <Card p={10} mt={10} width={400}>
                                        <Text fontSize="xl" align="center">
                                            Please select type of train
                                        </Text>
                                        <Select
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
                                            colorScheme='messenger'
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