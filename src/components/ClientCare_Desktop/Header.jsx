'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import Logo from "@/assets/Logo.png"
import LiveClock from '@/components/LiveClock'
import { useSearchParams } from 'next/navigation'
import axios from '@/lib/axios'

function Header() {

    const params = useSearchParams()
    const cceId = params.get('cce_id')

    const [fullname, setFullname] = useState("")

    useEffect(() => {
        if(!cceId) return

        const findCceUser = async() => {
            try {
                const res = await axios.get(`/api/cce/${cceId}`)
                if(res.status == 200){
                    setFullname(res.data)
                }
            } catch (error) {
                if(error) throw error
            }
        }

        findCceUser()



    }, [cceId])

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
            {cceId && (
                <div>
                    <h1 className='text-xs font-bold roboto text-black/70'>Hello, <span className='text-[#1E3161]'>{fullname}</span></h1>
                </div>
            )}
        </div>


    </div>
    
    
    </>
  )
}

export default Header
