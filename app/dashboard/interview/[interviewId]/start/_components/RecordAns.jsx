"use client"
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

function RecordAns() {
    const webcamRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if window is defined (client-side)
        if (typeof window === 'undefined') {
            setBrowserSupportsSpeech(false);
            return;
        }

        // Check browser support for speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setBrowserSupportsSpeech(false);
            return;
        }

        // Initialize speech recognition
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            setTranscript(finalTranscript + interimTranscript);
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsRecording(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        } else {
            setTranscript('');
            if (recognitionRef.current) {
                recognitionRef.current.start();
            }
        }
        setIsRecording(!isRecording);
    };

    return (
        <div className=" flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Record Your Answer</h2>
            
            <div className="relative w-full pt-[56.25%] bg-gray-100 rounded-md overflow-hidden mb-6">
                <Image src="/webcam.png" alt="Webcam" width={200} height={200} className='absolute' />
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    mirrored={true}
                />
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-md min-h-20">
                <p className="text-gray-700">{transcript || 'Your speech will appear here...'}</p>
            </div>

            <Button
                onClick={toggleRecording}
                variant={isRecording ? 'destructive' : 'default'}
                className="w-full py-6 text-lg"
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>

            {!browserSupportsSpeech && (
                <p className="mt-4 text-red-500 text-sm">
                    Note: Your browser doesn't support speech recognition. Try using Chrome or Edge.
                </p>
            )}
        </div>
    );
}

export default RecordAns