"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { WebcamIcon } from 'lucide-react'
import React, { useEffect, useState,use } from 'react'
import Webcam from 'react-webcam'
import Link from 'next/link';
import { Lightbulb } from 'lucide-react';

function Interview({ params }) {
  const actualParams = use(params);
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    const GetInterviewDetails = async () => {
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, actualParams.interviewId));
      setInterviewData(result[0]);
    };
    GetInterviewDetails();
  }, [actualParams.interviewId]);

  return (
    <div>
      <h2>Let's get Started</h2>
      <div>
        {webCamEnabled ? (
          <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored={true}
          />
        ) : (
          <>
            <WebcamIcon />
            <Button onClick={() => setWebCamEnabled(true)}>
              Enable webcam and microphone
            </Button>
          </>
        )}
      </div>

      {interviewData && (
        <div>
          <h2>Job Role/Job Position: {interviewData.jobPosition}</h2>
          <h2>Job Description/ Tech Stack: {interviewData.jobDesc}</h2>
          <h2>Years of Experience: {interviewData.jobExperience}</h2>

          <h2>
          <Lightbulb className="mb-2" size={32} />
          <strong>Enable webcam to start ur interviwe and crack it cleverly with AI .Web cam on will capture you.We dont use ur data.bE sure with us.</strong>
          </h2>
        </div>
      )}

      <div>

      <Link href={`/dashboard/interview/${actualParams.interviewId}/start`}>
      <Button>Start Interview</Button>
      </Link>
      </div>

    </div>
  );
}

export default Interview; 