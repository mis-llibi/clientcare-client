import React from 'react'
import Image from 'next/image'

import Logo from "@/assets/Logo.png"

function Header() {
  return (
    <div className='py-2 bg-white px-4 shadow-[0px_3px_4px_1px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center gap-1'>
      <Image 
        src={Logo}
        width={200}
        height={200}
        alt='Logo'
      />

      <h1 className='roboto font-bold text-sm'>Member <span className='text-[#1E3161]'>Client Care Portal</span></h1>
      {/* <h1 className='text-xs font-bold roboto text-black/70'>Tuesday, September 23rd, 2025, 10:49:18AM</h1> */}
    </div>
  )
}

export default Header
