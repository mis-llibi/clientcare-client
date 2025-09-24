'use client'
import React from "react"
import { MoonLoader } from "react-spinners"

function Loading() {
  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-white/80">
      <MoonLoader size={50} />
    </div>
  )
}

export default Loading
