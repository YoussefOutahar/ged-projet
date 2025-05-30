import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button'
import React, { useState } from 'react'

const Navbar = () => {
  const router = useRouter();
  const [toggle,setToggle] = useState(false);

  const handleRedirectToAuth = () => {
    router.push('/auth');
  };
  return (
    <div className='fixed md:relative bg-white top-0 w-[2000px] z-20'>
      <div className='container mx-5 md:mx-5 flex justify-between items-center px-4 py-4'>
        <div className='flex gap-1 items-center text-2xl md:text-2xl font-bold'>
          <span className='italic text-blue-800'>YAN</span> 
          <i className="pi pi-home" style={{ fontSize: '1.8rem' }}></i>
          <span className='italic text-green-600'>DOC</span> 
        </div>
        <div className='flex gap-8 ml-8 items-center'>
          <Link href="/" className='hover:text-blue-700 tracking-wider text-gray-600 hidden md:flex'>Accueil</Link>
          <Link href="/" className='hover:text-blue-700 tracking-wider text-gray-600 hidden md:flex'>Fonctionnalités</Link>
          <Link href="/" className='hover:text-blue-700 tracking-wider text-gray-600 hidden md:flex'>Produits</Link>
          <Link href="/" className='hover:text-blue-700 tracking-wider text-gray-600 hidden md:flex'>Tarifs</Link>
          <Link href="/" className='hover:text-blue-700 tracking-wider text-gray-600 hidden md:flex'>Documents</Link>
        </div>
        <div className='flex ml-8'>        
          {/* <Button className=' hidden md:flex' label="Se connecter" rounded onClick={handleRedirectToAuth} style={{width: 'auto' , height: '2rem'}} /> */}
          <Button label="Submit" link onClick={handleRedirectToAuth} className='hidden md:flex'/>
        </div>
        {toggle ? (
          <i className='pi pi-times ml-4 md:hidden' style={{ fontSize: '1.6rem' }} onClick={()=>{setToggle(!toggle)}}/>
        ):(
          <i className='pi pi-bars ml-4 md:hidden' style={{ fontSize: '1.8rem' }}onClick={()=>{setToggle(!toggle)}}/>
        )}
      </div>
      {/* Responsive Menu */}
      <div className='md:hidden'>
        <table>
          <tr><Link href="/" className='hover:text-blue-700 text-gray-600'>Accueil</Link></tr>
          <tr><Link href="/" className='hover:text-blue-700 text-gray-600'>Fonctionnalités</Link></tr>
          <tr><Link href="/" className='hover:text-blue-700 text-gray-600'>Produits</Link></tr>
          <tr><Link href="/" className='hover:text-blue-700 text-gray-600'>Tarifs</Link></tr>
          <tr><Link href="/" className='hover:text-blue-700 text-gray-600'>Documents</Link></tr>
          <tr><Button label="Submit" link onClick={handleRedirectToAuth}/></tr>
        </table>
      </div>
    </div>
  )
}

export default Navbar