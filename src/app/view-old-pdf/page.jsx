'use client'
import React, {useState} from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import Swal from 'sweetalert2'


function Page() {


  const [filename, setFilename] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault()
    await axios.get('https://corporate-api.llibi.app/api/view-old/generated-loa', {
      params: {
        filename
      }
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      if(err){
        Swal.fire({
          title: "Error",
          text: "Cannot find OLD LOA, please contact MIS",
          icon: "error"
        })
      }
    })

    

  }


  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <form onSubmit={handleSubmit} className='flex gap-3 '>
        <Input 
          type='text'
          className={"w-92"}
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <button 
          type='submit'
          className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md"
        >Find</button>
      </form>
    </div>
  )
}

export default Page
