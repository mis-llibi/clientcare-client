'use client'
import React from 'react'
import Image from 'next/image'

import Logo from "@/assets/Logo.png"
import LiveClock from '@/components/LiveClock'

function Header() {
  return (
    <>
    <div className='w-full gap-2 bg-white px-4 py-2 rounded-md shadow-[0px_3px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center flex-col md:flex-row md:justify-between md:w-4/5 md:max-w-5xl md:h-[5rem] '>
      
        <div>
            <Image 
                src={Logo}
                width={200}
                alt='Logo'
            />
        </div>

        <div className='flex flex-col justify-center items-center md:items-end'>
            <div>
                <h1 className='font-bold roboto'>Member <span className='text-[#1E3161]'>Client Care Portal</span></h1>
            </div>
            <div>
                <LiveClock />
            </div>
        </div>


    </div>
    
    
    </>
  )
}

export default Header
