import React from 'react'

const ServiceCard = (props:any) => {
  return (
    <div className={`flex flex-column text-center items-center bg-white hover:bg-${props.color}-200 hover:text-white transition-all hover:-translate-y-2 lg:w-1/4 py-5 gap-4 cursor-pointer`} style={{width:'25%' , borderRadius: '0.5rem'}}>
        <div>
            <span>{props.icon}</span>
        </div>
        <h2 className='text-xl font-semibold'>{props.title}</h2>
        <p className='mx-2'>{props.body}</p>
    </div>
  )
}

export default ServiceCard