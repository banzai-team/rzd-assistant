import React from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
import {useMutation} from 'react-query';
import {sendRecord} from '../domain/api';
import {STORAGE_KEYS} from '../objects';
import {Spinner} from "@chakra-ui/react";

const Recorder: React.FC = () => {
    const chatId = localStorage.getItem(STORAGE_KEYS.CHAT_ID) ?? 29;

    const send = useMutation(sendRecord, {
        onSuccess: (data) => {
            console.log('File sent')
        }
    });

    if (send.isLoading) {
        return <Spinner width="30px" height="30px" ml="10px" />
    };

    return <React.StrictMode>
        <AudioRecorder
            onRecordingComplete={async (blob: Blob) => send.mutate({ file: blob, id: chatId.toString()})}
            audioTrackConstraints={{
                noiseSuppression: true,
                echoCancellation: true,
            }}
            downloadOnSavePress={false}
            downloadFileExtension="webm"
        />
    </React.StrictMode>
};

export default Recorder;

