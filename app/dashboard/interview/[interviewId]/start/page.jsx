"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { use, useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAns from './_components/RecordAns';
import dynamic from 'next/dynamic';

// Dynamically import FeedbackSummary to avoid SSR issues
const FeedbackSummary = dynamic(
    () => import('./_components/FeedbackSummary'),
    { ssr: false }
);

function StartInterview({ params }) {
    const actualParams = use(params)
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setmockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [allFeedback, setAllFeedback] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, actualParams.interviewId));

            if (!result || result.length === 0) {
                console.error('No interview found with ID:', actualParams.interviewId);
                return;
            }

            const jsonMockResp = typeof result[0].jsonMockResp === 'string'
                ? JSON.parse(result[0].jsonMockResp)
                : result[0].jsonMockResp;

            console.log('Raw JSON response:', jsonMockResp);

            // First, try to parse the response if it's a string
            let responseText = jsonMockResp.response || jsonMockResp;
            if (typeof responseText === 'string') {
                // Try to parse if it's a JSON string
                try {
                    const parsedResponse = JSON.parse(responseText);
                    if (parsedResponse) {
                        responseText = parsedResponse;
                    }
                } catch (e) {
                    // Not a JSON string, use as is
                    console.log('Response is not JSON, using as plain text');
                }
            }

            console.log('Response text to parse:', responseText);

            // Try different parsing strategies
            let questionsAndAnswers = [];

            // First, split by the introduction text to get to the questions
            const introEnd = responseText.indexOf('### 1.');
            const questionsText = responseText.substring(introEnd);

            // Split the text into question blocks
            const questionBlocks = questionsText.split(/### \d+\./).slice(1);

            // Process each question block
            questionsAndAnswers = questionBlocks.map((block, index) => {
                // Split into question and answer parts
                const [questionPart, ...answerParts] = block.split(/\*\*Answer:\*\*/i);

                // Extract the question (handles both **Question: ** and plain text formats)
                let question = questionPart
                    .replace(/^\s*\*\*Question:?\s*([^*]+)\*\*/i, (_, q) => q.trim()) // Remove **Question: **
                    .replace(/\*\*/g, '')
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                // Clean up the answer
                let answer = answerParts.join('')
                    .replace(/^[\s\n]+/, '')  // Remove leading whitespace and newlines
                    .replace(/[\n\s]+$/, '')  // Remove trailing whitespace and newlines
                    .replace(/\n{3,}/g, '\n\n')  // Normalize multiple newlines
                    .trim();

                // If we didn't find a question in the expected format, use the first line
                if (!question) {
                    const firstLine = questionPart.split('\n')[0].trim();
                    question = firstLine.replace(/\*\*/g, '').trim();
                }

                return {
                    question: `Question ${index + 1}: ${question}`,
                    answer: answer || 'No answer provided'
                };
            });

            // Log the parsed questions for debugging
            console.log('Parsed questions:', questionsAndAnswers);
            console.log('Number of questions found:', questionsAndAnswers.length);

            setmockInterviewQuestion(questionsAndAnswers);
            setInterviewData(result[0]);
        } catch (error) {
            console.error('Error in GetInterviewDetails:', error);
            // Set empty array to prevent undefined errors
            setmockInterviewQuestion([]);
        }
    };

    const handleDownloadPdf = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `interview-feedback-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 my-10">
                <div className="max-w-7xl mx-auto ">
                    <div className="flex items-center justify-between ">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>
                            <p className="text-gray-600 mt-1">
                                {interviewData?.jobPosition} • {interviewData?.jobExperience} years experience
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Question Progress</p>
                                <p className="text-lg font-semibold text-blue-600">
                                    {activeQuestionIndex + 1} / {mockInterviewQuestion?.length || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {!showSummary ? (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                        {/* Questions Section - Takes up 2/3 of the width */}
                        <div className="xl:col-span-2">
                            <QuestionsSection
                                mockInterviewQuestion={mockInterviewQuestion}
                                activeQuestionIndex={activeQuestionIndex}
                                setActiveQuestionIndex={setActiveQuestionIndex}
                            />
                        </div>

                        {/* Recording Section - Takes up 1/3 of the width */}
                        <div className="xl:col-span-1">
                            <RecordAns
                                mockInterviewQuestion={mockInterviewQuestion}
                                activeQuestionIndex={activeQuestionIndex}
                                interviewData={interviewData}
                                allFeedback={allFeedback}
                                setAllFeedback={setAllFeedback}
                                setShowSummary={setShowSummary}
                                setPdfUrl={setPdfUrl}
                            />
                        </div>
                    </div>
                ) : (
                    <FeedbackSummary 
                        feedbackData={{
                            responses: allFeedback,
                            totalQuestions: mockInterviewQuestion?.length || 0,
                            averageRating: allFeedback.reduce((sum, item) => sum + (item.rating || 0), 0) / allFeedback.length,
                            overallFeedback: 'Great job! You have completed all the questions.'
                        }}
                        onDownloadPdf={handleDownloadPdf}
                    />
                )}
            </div>
        </div>
    )
}

export default StartInterview