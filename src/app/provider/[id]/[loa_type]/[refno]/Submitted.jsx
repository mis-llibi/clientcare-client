import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Card from '@/components/ClientCare/Card'
import Link from 'next/link'
import { applink } from '@/lib/applink'

function Submitted({message, provider_id, loa_type}) {
  return (
    <>
    <DotLottieReact
      src="https://lottie.host/ae54c3fb-de68-4105-a73d-7b880caa692b/1fekd3JVwC.lottie"
      autoplay
    />
    
    <Card>
        <h1 className='font-bold roboto'>{message}</h1>

        <div className='flex justify-center items-center text-center mt-2'>
          <Link href={`${applink}/provider/${provider_id}/${loa_type}`} className='text-white roboto bg-[#1E3161] py-1 rounded-r-4xl w-full cursor-pointer rounded-bl-4xl'>Back to Request</Link>
        </div>

    </Card>
    
    
    </>
  )
}

export default Submitted