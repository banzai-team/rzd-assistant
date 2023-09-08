import React from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
import {useMutation} from 'react-query';
import {sendRecord} from '../domain/api';

const Recorder: React.FC = () => {
    const send = useMutation(sendRecord, {
        onSuccess: (data) => {
            console.log('File sent')
        }
    });
    
    return <React.StrictMode>
        <AudioRecorder
            onRecordingComplete={async (blob: Blob) => send.mutate({ file: blob })}
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
