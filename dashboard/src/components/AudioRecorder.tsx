import React from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
import {useMutation} from 'react-query';
import {sendRecord} from '../domain/api';
import {Spinner} from "@chakra-ui/react";

const Recorder: React.FC<{ chatId: string }> = ({ chatId }) => {
    const send = useMutation(sendRecord, {
        onSuccess: (data) => {
            console.log('File sent')
        }
    });

    if (send.isLoading) {
        return <Spinner width="30px" height="30px" ml="10px" color="purple" />
    }

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

