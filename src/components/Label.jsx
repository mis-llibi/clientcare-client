import React from 'react'

function Label({label, className, htmlFor}) {
  return (
    <label htmlFor={htmlFor} className={`text-[#1E3161] font-semibold ${className}`}>{label}</label>
  )
}

export default Label
