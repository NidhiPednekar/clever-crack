"use client"
import { Volume2, VolumeX, Clock, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    const playQuestion = () => {
        if ('speechSynthesis' in window) {
            // Stop any current speech
            speechSynthesis.cancel();
            
            if (!isSpeaking) {
                const utterance = new SpeechSynthesisUtterance(questions[activeQuestionIndex]?.question);
                utterance.onend = () => setIsSpeaking(false);
                utterance.onstart = () => setIsSpeaking(true);
                speechSynthesis.speak(utterance);
            } else {
                setIsSpeaking(false);
            }
        } else {
            console.warn('Text-to-speech is not supported in this browser');
        }
    };
    
    // Clean up speech synthesis on component unmount
    React.useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
                setIsSpeaking(false);
            }
        };
    }, []);

    // Stop speech when question changes
    React.useEffect(() => {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, [activeQuestionIndex]);

    if (!mockInterviewQuestion) {
        return (
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (mockInterviewQuestion.length === 0) {
        return (
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No questions found</p>
                    <p className="text-gray-400 text-sm mt-1">Please check the interview details</p>
                </div>
            </div>
        );
    }

    // Limit to first 5 questions
    const questions = mockInterviewQuestion.slice(0, 5);

    return (
        <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex h-full">
               

                {/* Question Detail Panel */}
                <div className="flex-1 flex flex-col">
                    {questions.length > 0 && (
                        <>
                            {/* Header */}
                            <div className="px-6 py-4 bg-white border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold">
                                                {activeQuestionIndex + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Question {activeQuestionIndex + 1} of {questions.length}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Take your time to read and understand the question
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={playQuestion}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                            isSpeaking 
                                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                        }`}
                                    >
                                        {isSpeaking ? (
                                            <>
                                                <VolumeX className="w-4 h-4" />
                                                <span className="text-sm">Stop</span>
                                            </>
                                        ) : (
                                            <>
                                                <Volume2 className="w-4 h-4" />
                                                <span className="text-sm">Listen</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Question Content */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="max-w-4xl">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">Q</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-900 text-lg leading-relaxed font-medium">
                                                    {questions[activeQuestionIndex].question?.replace(/^Question \d+:\s*/, '') || 'No question text available'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Tips Section */}
                                    <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Interview Tips
                                        </h4>
                                        <ul className="text-sm text-yellow-700 space-y-1">
                                            <li>• Take a moment to think before answering</li>
                                            <li>• Structure your response clearly</li>
                                            <li>• Use specific examples when possible</li>
                                            <li>• Speak clearly and at a moderate pace</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Navigation Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <button 
                                        onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                                        disabled={activeQuestionIndex === 0}
                                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous
                                    </button>
                                    
                                    <div className="flex items-center space-x-2">
                                        {questions.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveQuestionIndex(index)}
                                                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                                                    activeQuestionIndex === index
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        onClick={() => setActiveQuestionIndex(Math.min(questions.length - 1, activeQuestionIndex + 1))}
                                        disabled={activeQuestionIndex === questions.length - 1}
                                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuestionsSection;