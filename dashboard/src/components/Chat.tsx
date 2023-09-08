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

const Chat: React.FC = () => {
    const messages: any = [];
    
    const sendMessage = (innerHtml: string) => {
        console.log(innerHtml);
        messages.push(<Message model={{
            message: innerHtml,
            sentTime: "just now",
            sender: "Joe",
            direction: "outgoing",
            position: 'normal'
        }}/>)
    };
    
    return <Box height="100vh">
        <MainContainer>
            <ChatContainer>
                <ConversationHeader>
                    <Avatar src='' name="Emily" />
                    <ConversationHeader.Content userName="Emily" info="Active 10 mins ago" />
                    <ConversationHeader.Actions>
                        {/*<InfoButton onClick={async (values) => send.mutate({ file: values.files[0] })}/>*/}
                        <Recorder />
                    </ConversationHeader.Actions>
                </ConversationHeader>
                <MessageList>
                    {messages}
                    {/*<Message model={{
                        message: "Hello my friend",
                        sentTime: "just now",
                        sender: "Joe",
                        direction: "outgoing",
                        position: 'normal'
                    }}/>*/}
                </MessageList>
                <MessageInput placeholder="Type message here" onSend={sendMessage}/>
            </ChatContainer>
        </MainContainer>
    </Box>;
};

export default Chat