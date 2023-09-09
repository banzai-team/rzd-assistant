import React from 'react';
import "../styles/chat.css"

import {Box, Flex} from '@chakra-ui/react';
import {
    ChatContainer,
    MainContainer,
    Message,
    MessageInput,
    MessageList,
    ConversationHeader,
    Avatar,
    InfoButton
} from '@chatscope/chat-ui-kit-react';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Recorder from './AudioRecorder';
import logo from '../images/rzd.jpeg';
import {useMutation} from 'react-query';
import {createChat} from '../domain/api';

const Chat: React.FC = () => {
    const create = useMutation(createChat, {
        onSuccess: (data) => {
            console.log('Chat created')
        }
    });
    
    React.useEffect(() => {
        create.mutate();
    }, []);
    
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
                        messages.map((message, key) => (
                            // Problem with types
                            // @ts-ignore
                            <Message model={message}/>
                        ))
                    }
                </MessageList>
                {/*<MessageInput placeholder="Type message here" attachButton={false}/>*/}
                {/*@ts-ignore*/}
                <Flex as="MessageInput"
                      width="100%"
                      borderTop="1px solid #d1dbe3"
                      alignItems="end"
                >
                    <MessageInput placeholder="Type message here" attachButton={false} style={{flex: "1", borderTop: "none"}}/>
                    <Box p={1}><Recorder /></Box>
                </Flex>
            </ChatContainer>
        </MainContainer>
    </Box>;
};

export default Chat