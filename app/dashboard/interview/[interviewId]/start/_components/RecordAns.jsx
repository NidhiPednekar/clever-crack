"use client"
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { getGeminiResponse } from '@/utils/GeminiAIModal';
import { toast } from "sonner";
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function RecordAns({ 
    mockInterviewQuestion = [], 
    activeQuestionIndex = 0, 
    interviewData = {},
    allFeedback,
    setAllFeedback,
    setShowSummary,
    setPdfUrl
}) {
    const { user } = useUser();
    const webcamRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [permissionError, setPermissionError] = useState('');
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
            setPermissionError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        // Initialize speech recognition
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
            // Only process the most recent result
            const last = event.results.length - 1;
            const result = event.results[last];
            
            if (result.isFinal) {
                // If it's a final result, update the transcript
                setTranscript(prev => prev + (prev ? ' ' : '') + result[0].transcript);
            }
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsRecording(false);
            if (event.error === 'not-allowed') {
                setPermissionDenied(true);
                setPermissionError('Microphone access was denied. Please allow microphone access in your browser settings.');
            } else if (event.error === 'audio-capture') {
                setPermissionError('No microphone was found. Please ensure a microphone is connected.');
            } else {
                setPermissionError('Error occurred with speech recognition. Please try again.');
            }
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop all tracks to release the microphone
            stream.getTracks().forEach(track => track.stop());
            
            // Reset error states
            setPermissionDenied(false);
            setPermissionError('');
            
            // Start speech recognition
            recognitionRef.current.start();
            setIsRecording(true);
            setTranscript('');
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setPermissionDenied(true);
            setPermissionError('Could not access microphone. Please ensure you have granted microphone permissions.');
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    const analyzeAnswer = async () => {
        if (!transcript.trim()) {
            toast.error('Please provide an answer before submitting.');
            return;
        }

        setIsLoading(true);
        try {
            const currentQuestion = mockInterviewQuestion[activeQuestionIndex]?.question || 'No question available';
            const correctAnswer = mockInterviewQuestion[activeQuestionIndex]?.answer || 'No answer available';

            // Call Gemini AI to analyze the answer
            const prompt = `You are an expert interviewer. Analyze the following interview answer and provide feedback.\n\nQuestion: ${currentQuestion}\n\nCorrect Answer: ${correctAnswer}\n\nUser's Answer: ${transcript}\n\nPlease provide detailed feedback and a rating from 1-5 in this format:\nRating: X/5 (where X is a number from 1-5)\nFeedback: [your detailed feedback here]`;
            const response = await getGeminiResponse(prompt);

            // Parse the response to extract rating and feedback
            const feedbackText = response || 'No feedback available';
            const ratingMatch = feedbackText.match(/Rating: (\d+(?:\.\d+)?)\/5/);
            const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

            const feedbackData = {
                question: currentQuestion,
                answer: transcript,
                feedback: feedbackText,
                rating: rating,
                timestamp: new Date().toISOString()
            };

            setFeedback(feedbackData);
            
            // Save feedback to the allFeedback array
            const updatedFeedback = [...allFeedback, feedbackData];
            setAllFeedback(updatedFeedback);

            // If this was the last question, show summary
            if (mockInterviewQuestion?.length && activeQuestionIndex === mockInterviewQuestion.length - 1) {
                setShowSummary(true);
                // Generate and save the feedback data URL for QR code
                generateFeedbackPdf(updatedFeedback);
            }

        } catch (error) {
            console.error('Error analyzing answer:', error);
            toast.error('Failed to analyze answer. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const generateFeedbackPdf = (feedbackData) => {
        try {
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(20);
            doc.text('Interview Feedback Report', 14, 22);
            
            // Add date
            doc.setFontSize(12);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32);
            
            // Add user info if available
            if (user) {
                const userName = user.fullName || user.username || user.primaryEmailAddress?.emailAddress || 'N/A';
                doc.text(`Candidate: ${userName}`, 14, 40);
            }
            
            // Add feedback for each question
            let yPosition = 60;
            
            feedbackData.forEach((item, index) => {
                // Add question
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(`Question ${index + 1}: ${item.question}`, 14, yPosition);
                yPosition += 10;
                
                // Add answer
                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
                const answerLines = doc.splitTextToSize(`Your Answer: ${item.answer}`, 180);
                doc.text(answerLines, 20, yPosition);
                yPosition += answerLines.length * 7 + 5;
                
                // Add rating and feedback
                doc.text(`Rating: ${item.rating}/5`, 20, yPosition);
                yPosition += 7;
                
                const feedbackLines = doc.splitTextToSize(`Feedback: ${item.feedback}`, 180);
                doc.text(feedbackLines, 20, yPosition);
                yPosition += feedbackLines.length * 7 + 15;
                
                // Add page break if needed
                if (yPosition > 250 && index < feedbackData.length - 1) {
                    doc.addPage();
                    yPosition = 20;
                }
            });
            
            // Save the PDF
            const pdfBlob = doc.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
            
            return url;
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF. Please try again.');
            return null;
        }
    };

    // Render error message if there are permission issues
    if (permissionError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{permissionError}</p>
                {permissionDenied && (
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Reload and Try Again
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold">
                        Question {Math.min(activeQuestionIndex + 1, mockInterviewQuestion?.length || 0)} of {mockInterviewQuestion?.length || 0}
                    </h3>
                    <p className="text-gray-700 mt-2">
                        {mockInterviewQuestion[activeQuestionIndex]?.question || 'No question available'}
                    </p>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                            <span className="text-sm text-gray-600">
                                {isRecording ? 'Recording...' : 'Not Recording'}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            {!isRecording ? (
                                <Button 
                                    onClick={startRecording}
                                    disabled={!browserSupportsSpeech || permissionDenied}
                                    variant="outline"
                                >
                                    Start Recording
                                </Button>
                            ) : (
                                <Button 
                                    onClick={stopRecording}
                                    variant="outline"
                                    className="bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                    Stop Recording
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md min-h-32">
                        {transcript ? (
                            <p className="text-gray-800 whitespace-pre-wrap">{transcript}</p>
                        ) : (
                            <p className="text-gray-400 italic">
                                {isRecording ? 'Listening... Speak now.' : 'Your transcribed answer will appear here...'}
                            </p>
                        )}
                    </div>
                    
                    {feedback && (
                        <div className="p-4 bg-blue-50 rounded-md">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-blue-800">Feedback</h4>
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-blue-800">Rating: </span>
                                    <div className="flex ml-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg 
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.round(feedback.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                                fill="currentColor" 
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-1 text-sm text-gray-600">
                                        ({feedback.rating.toFixed(1)}/5.0)
                                    </span>
                                </div>
                            </div>
                            <p className="text-blue-700 whitespace-pre-wrap">{feedback.feedback}</p>
                        </div>
                    )}
                    
                    <div className="flex justify-between pt-4">
                        <Button 
                            onClick={() => {
                                setTranscript('');
                                setFeedback(null);
                            }}
                            variant="outline"
                            disabled={isRecording || !transcript}
                        >
                            Clear Answer
                        </Button>
                        
                        <Button 
                            onClick={() => {
                                stopRecording();
                                analyzeAnswer();
                            }}
                            disabled={isRecording || !transcript || isLoading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isLoading ? 'Analyzing...' : 'Submit Answer'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecordAns;