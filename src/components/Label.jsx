import React from 'react'

function Label({label, className, htmlFor, required}) {
  return (
    <label htmlFor={htmlFor} className={`text-[#1E3161] font-semibold roboto ${className}`}>{label} <span className='text-red-700'>{required && "*"}</span></label>
  )
}

export default Label
