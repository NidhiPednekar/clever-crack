import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'

function Dashboard() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2>Create and start your Mock Interview</h2>

      <div>
        <AddNewInterview/>
      </div>
    </div>
  )
}

export default Dashboard