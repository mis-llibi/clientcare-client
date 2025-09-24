import React from 'react'

function Card({children}) {
  return (
    <div className='py-1 px-2'>
        <div className='bg-white p-3 border-2 border-black/30 rounded-lg'>
            {children}
        </div>
    </div>
  )
}

export default Card
