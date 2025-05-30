import { useRouter } from 'next/router';
import React from 'react'

const Footer = () => {
  const router = useRouter();
  const handleHome = () => {
    router.push('/');
  };
  return (
    <div className='flex flex-row justify-between' style={{paddingLeft: '8rem' , paddingRight:'8rem', justifyContent: 'space-between'}}>
        <div className='flex flex-row gap-10 my-3' style={{gap:'2rem'}}>
            <i className='pi pi-linkedin hover:text-green-300 transition-all cursor-pointer' style={{fontSize: '1.5rem',color:"#49509f"}}></i>
            <i className='pi pi-facebook hover:text-green-300 transition-all cursor-pointer' style={{fontSize: '1.5rem' ,color:"#49509f"}}></i>
            <i className='pi pi-twitter hover:text-green-300 transition-all cursor-pointer' style={{fontSize: '1.5rem' ,color:"#49509f"}}></i>
            <i className='pi pi-discord hover:text-green-300 transition-all cursor-pointer' style={{fontSize: '1.5rem' ,color:"#49509f"}}></i>
            <i className='pi pi-instagram hover:text-green-300 transition-all cursor-pointer' style={{fontSize: '1.5rem',color:"#49509f"}}></i>
        </div>
        <div className='flex flex-row mt-0 items-center cursor-pointer' onClick={handleHome}>
          <h1 style={{color:'#98c34d', fontSize:'2.3rem', fontWeight: 700}}> YANDOC </h1>
          <span className='text-xs mt-4 ml-2' style={{color:'#49509f',fontSize:'2.3rem',fontWeight: 700}}>solution</span>
        </div>
    </div>
  )
}

export default Footer