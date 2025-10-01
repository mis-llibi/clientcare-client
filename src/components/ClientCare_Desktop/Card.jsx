import React from 'react'

function Card({children}) {
  return (
    <>
    <div className='w-full gap-2 bg-white py-4 px-2 lg:p-4 rounded-md shadow-[0px_3px_4px_1px_rgba(0,0,0,0.25)] md:w-4/5 md:max-w-5xl '>
        {children}
    </div>

    </>
  )
}

export default Card
