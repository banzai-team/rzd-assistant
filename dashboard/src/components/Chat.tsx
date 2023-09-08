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
    VoiceCallButton,
    VideoCallButton,
    InfoButton
} from '@chatscope/chat-ui-kit-react';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const Chat: React.FC = () => {
    return <Box height="100vh">
        <MainContainer>
            <ChatContainer>
                <ConversationHeader>
                    <Avatar src='' name="Emily" />
                    <ConversationHeader.Content userName="Emily" info="Active 10 mins ago" />
                    <ConversationHeader.Actions>
                        <VoiceCallButton />
                        <VideoCallButton />
                        <InfoButton />
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