"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getGeminiResponse } from '../../../utils/GeminiAIModal' // <-- Correct import
import { db } from '@/utils/db'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment';
import { MockInterview } from '@/utils/schema'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPos, setJobPos] = useState('')
  const [jobExp, setJobExp] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [loading, setLoading] = useState(false)
  const {user }= useUser()
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setAiResult('')

    if (!user || !user.primaryEmailAddress || !user.primaryEmailAddress.emailAddress) {
      setAiResult('User not loaded. Please sign in.');
      setLoading(false);
      return;
    }

    const inputPrompt = `Generate exactly 5 interview questions for a ${jobPos} position requiring ${jobExp} years of experience.
    Job Description: ${jobDesc}
    
    IMPORTANT: You MUST generate EXACTLY 5 questions with 2 line answers. Do not stop at 2 questions.
    
    Format each question and answer EXACTLY like this:
    
    ### 1. **Question: [Topic]**
    [The question text]
    
    **Answer:**
    [The 2 line answer]
    
    ### 2. **Question: [Different Topic]**
    [The question text]
    
    **Answer:**
    [The 2 line answer]

     ### 3. **Question: [Different Topic]**
    [The question text]
    
    **Answer:**
    [The 2 line answer]

     ### 4. **Question: [Different Topic]**
    [The question text]
    
    **Answer:**
    [The 2 line answer]

     ### 5. **Question: [Different Topic]**
    [The question text]
    
    **Answer:**
    [The 2 line answer]
    
     `;

    try {
      const result = await getGeminiResponse(inputPrompt)
      const responseJSON = { response: result }
      setAiResult(result)

      const resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: responseJSON,
          jobPosition: jobPos,       
          jobDesc: jobDesc,
          jobExperience: jobExp,     
          createdBy: user.primaryEmailAddress.emailAddress,
          createdAt: moment().format('DD-MM-YY')
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("inserted ID: ", resp)

      if(resp){
        setOpenDialog(false);
        router.push('/dashboard/interview/' + resp[0]?.mockId)
      }
    } catch (err) {
      setAiResult('Error fetching AI response.')
      console.log("ERROR", err)
    }
    setLoading(false)
  }

  return (
    <div>
      <div onClick={() => setOpenDialog(true)}>
        <h2 className='font-bold text-lg text-center'>+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tell us more about your Job Interview</DialogTitle>
            <DialogDescription>
              Add details about Job Position/Role, Job Description and years of experience
            </DialogDescription>
            <form className="flex flex-col gap-4 mt-4" onSubmit={onSubmit}>
              <div className="flex flex-col gap-1">
                <label htmlFor="jobRole" className="font-medium text-sm">Job Role/Position</label>
                <input
                  required
                  onChange={(event) => setJobPos(event.target.value)}
                  id="jobRole"
                  name="jobRole"
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="jobDescription" className="font-medium text-sm">Job Description / Tech Stack</label>
                <Textarea
                  required
                  onChange={(event) => setJobDesc(event.target.value)}
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Ex. React, Angular, Node.js, AI/ML, SQL "
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="yearsExperience" className="font-medium text-sm">Years of Experience</label>
                <input
                  required
                  onChange={(event) => setJobExp(event.target.value)}
                  id="yearsExperience"
                  name="yearsExperience"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 3"
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Start Interview'}</Button>
              </div>
            </form>
            {aiResult && (
              <div className="mt-4 p-2 border rounded bg-gray-50">
                <strong>AI Response:</strong>
                {/* <pre className="whitespace-pre-wrap">{aiResult}</pre> */}
               
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview