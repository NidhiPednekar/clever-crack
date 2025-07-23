"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { use, useEffect,useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAns from './_components/RecordAns';

function StartInterview({params}) {
    const actualParams = use(params)
    const [interviewData,setInterviewData] = useState();
    const [mockInterviewQuestion,setmockInterviewQuestion] = useState();

    useEffect(() =>{
        GetInterviewDetails();
    },[]);

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
          .where(eq(MockInterview.mockId, actualParams.interviewId));
       
          const jsonMockResp = JSON.parse(result[0].jsonMockResp);

          // Regex to match question and answer pairs
          // Enhanced regex to handle different question-answer formats
          const qaRegex = /(?:###?\s*\d+\.?\s*|##\s*Question\s*\d+\s*:?\s*)([^\n]+)\s*\n\s*(?:\*\*Answer:?\*\*|[Aa]nswer:?|\*\*[Aa]nswer:?\*\*)\s*\n([\s\S]*?)(?=\n\s*(?:###?\s*\d+\.?|##\s*Question\s*\d+|$))/g;
          const questionsAndAnswers = [];
          let match;
          while ((match = qaRegex.exec(jsonMockResp.response)) !== null) {
            questionsAndAnswers.push({
              question: match[1].trim(),
              answer: match[2].trim()
            });
          }

          console.log('Extracted Q&A pairs:', questionsAndAnswers);
          console.log('Total questions found:', questionsAndAnswers.length);

          setmockInterviewQuestion(questionsAndAnswers); 
          setInterviewData(result[0]);
      };


  return (
    <div>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 p-4'>
        <div className='lg:col-span-2'>
          <QuestionsSection mockInterviewQuestion={mockInterviewQuestion}/>
        </div>
        <div className='lg:col-span-1'>
          <RecordAns/>
        </div>
      </div>
    
    </div>
  )
}

export default StartInterview