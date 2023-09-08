import React from 'react';

import {Box} from '@chakra-ui/react';
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

const Chat: React.FC = () => {
    return <Box height="100vh">
        <MainContainer>
            <ChatContainer>
                <ConversationHeader>
                    <Avatar src={logo} name="Emily" />
                    <ConversationHeader.Content userName="Emily" info="Active 10 mins ago" />
                    <ConversationHeader.Actions>
                        {/*<InfoButton onClick={async (values) => send.mutate({ file: values.files[0] })}/>*/}
                        <Recorder />
                    </ConversationHeader.Actions>
                </ConversationHeader>
                <MessageList>
                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "just now",
                        sender: "Joe",
                        direction: "incoming",
                        position: 'normal'
                    }}/>
                    <Message model={{
                        message: "Hello my friend",
                        sentTime: "just now",
                        sender: "Joe",
                        direction: "outgoing",
                        position: 'normal'
                    }}/>
                </MessageList>
                <MessageInput placeholder="Type message here"/>
            </ChatContainer>
        </MainContainer>
    </Box>;
};

export default Chat