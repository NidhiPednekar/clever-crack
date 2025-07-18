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

function AddNewInterview() {
  const [openDialog,setOpenDialog]= useState(false)
  return (
    <div>
      <div onClick ={() => setOpenDialog(true)}>
         <h2 className='font-bold text-lg text-center'>+ Add New</h2>
      </div>
         <Dialog open={openDialog}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
              <div>
                <h2>Tell us more about your Job Interviewing</h2>
                <h2></h2>
              </div>
                <div>
                  <Button variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button>Start Interview</Button>
             
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddNewInterview