import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Card from '@/components/ClientCare/Card'

function Error({message}) {
  return (
    <div>
        <DotLottieReact
        src="https://lottie.host/0daf9d7b-1b7a-4a41-b336-4949e87d6085/kIqILQaWeF.lottie"
        loop
        autoplay
        />
        {/* <div className='px-2'>
            <h1 className='font-bold roboto'>{message}</h1>
        </div> */}
        <Card>
            <h1 className='font-bold roboto'>{message}</h1>
        </Card>
    </div>
  )
}

export default Error
