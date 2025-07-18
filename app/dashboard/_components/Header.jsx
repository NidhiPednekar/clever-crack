"use client"
import {React, useEffect} from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

function Header() {

    const path=usePathname();
    useEffect(()=>{
        console.log(path)
    },[])

  return (
    <div className='flex p-4 items-center justify-between shadow-md bg-secondary'>
       <Image src={'/logo.svg'} width={100} height={80} alt='logo'/>
        <ul className='hidden md:flex gap-6 ' >
            <li className={`hover:font-bold transition-all cursor-pointer'
                ${path=='/dashboard' &&'text-secondary-foreground font-bold'}
            `}
            >Dashboard</li>

            <li className={`hover:font-bold transition-all cursor-pointer'
                ${path=='/dashboard/questions' &&'text-secondary-foreground font-bold'}
            `}>Questions</li>

            <li className={`hover:font-bold transition-all cursor-pointer'
                ${path=='/dashboard/ipgarde' &&'text-secondary-foreground font-bold'}
            `}>Upgarde</li>

            <li className={`hover:font-bold transition-all cursor-pointer'
                ${path=='/dashboard/how' &&'text-secondary-foreground font-bold'}
            `}>How it works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header
