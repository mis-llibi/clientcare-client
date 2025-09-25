import React from 'react'

function Input({type="text", className, disabled = false, placeholder, ...props}) {
  return (
    <input 
        type={type} 
        {...props}
        disabled={disabled}
        className={`border border-black/30 w-full py-1 px-2 rounded-lg outline-[#1E3161] ${className}`}
        placeholder={placeholder}
    />
  )
}

export default Input
