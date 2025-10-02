'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

import { applink } from '@/lib/applink'



function DeclineTou() {

    const router = useRouter()
    const params = useParams()

    const { id } = params

  return (
    <>
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md roboto">
        {/* Sad face icon */}
        {/* <div className="text-6xl text-gray-500 mb-4">😔</div> */}

        {/* Main Heading */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h1>

        {/* Subheading */}
        <p className="text-gray-600 mb-6">
          You need to accept the Terms of Use to access this website.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {/* Review Terms Button */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
            onClick={() => router.push(`${applink}/provider/${id}`)}
          >
            Review Terms
          </button>
        </div>
      </div>
    </div>
    
    
    </>
  )
}

export default DeclineTou
