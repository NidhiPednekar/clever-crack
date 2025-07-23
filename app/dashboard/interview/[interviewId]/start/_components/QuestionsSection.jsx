"use client"
import React from 'react'

function QuestionsSection({ mockInterviewQuestion }) {
    if (!mockInterviewQuestion) {
        return (
            <div className="p-4 text-center">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (mockInterviewQuestion.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No questions found. Please check the interview details.
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full">
            {mockInterviewQuestion.map((item, index) => (
                <div 
                    key={index} 
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                    <div className="flex items-start">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {item.question}
                            </h3>
                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Suggested Answer:</h4>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default QuestionsSection