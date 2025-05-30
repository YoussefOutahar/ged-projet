import React, { useState } from 'react'
import {Link} from 'react-scroll'
import Links from 'next/link';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [toggle,setToggle] = useState(false);
  const router = useRouter();

  return (
    <div className='fixed w-full z-10'>
      {/* <div>
        <div className='flex flex-row justify-between p-2 md:px-32 px-5 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <div className='flex flex-row items-center cursor-pointer ml-5'>
                <img src='/Images/logo-yan.png' alt="logo" width={50}/>
                <span style={{color:'#98c34d', fontSize:'2.3rem', fontWeight: 700}}>YANDOC</span>
                <p className='text-xs mt-4 ml-2' style={{color:'#49509f',fontSize:'2.3rem',fontWeight: 700}}>Solution</p>
          </div>
          <nav className='hidden lg:flex flex-row items-center text-lg font-medium gap-8 ml-8 mt-3 justify-center'>
            <Link to='home' spy={true} smooth={true} duration={500} className='transition-all cursor-pointer text-blue-600 hover:text-green-600'>Home</Link>
            <Link to='about' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all'>About</Link>
            <Link to='produits' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all'>Produits</Link>
            <Link to='services' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all'>Services</Link>
            <Link to='princing' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all'>Pricing</Link>
            <Link to='portfolio' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all'>Portfolio</Link>
          </nav>
          <div className='lg:hidden flex items-center'>
            {toggle ?(
              <i className='pi pi-times ml-4 mt-2' style={{ fontSize: '1.6rem' }} onClick={()=>{setToggle(!toggle)}}/>
            ):(
              <i className='pi pi-bars ml-4 mt-2' style={{ fontSize: '1.8rem' }}onClick={()=>{setToggle(!toggle)}}/>
            )}
          </div>
        </div>
        {toggle && <div className={`${toggle ? "translate-x-0" : "-translate-x-full"} lg:hidden flex flex-col absolute bg-gray-200 text-blue-600 left-0 top-20 font-semibold text-2xl text-center z-10 pt-4 pb-4 gap-8 w-full h-fit transition-transform duration-300`}>
          <table>
            <tr><Link to='home' spy={true} smooth={true} duration={500} className='transition-all cursor-pointer text-blue-600 hover:text-green-600' onClick={()=>{setToggle(false)}}>Home</Link></tr>
            <tr><Link to='about' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all' onClick={()=>{setToggle(false)}}>About</Link></tr>
            <tr><Link to='produits' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all' onClick={()=>{setToggle(false)}}>Produits</Link></tr>
            <tr><Link to='services' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all' onClick={()=>{setToggle(false)}}>Services</Link></tr>
            <tr><Link to='princing' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all' onClick={()=>{setToggle(false)}}>Pricing</Link></tr>
            <tr><Link to='portfolio' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all' onClick={()=>{setToggle(false)}}>Portfolio</Link></tr>
          </table>
        </div>}
      </div> */}
      <div className="layout-topbar flex justify-between items-center px-5">
            <div className='flex items-center cursor-pointer ml-5'>
                <img src='/Images/logo-yan.png' alt="logo" width={50}/>
                <span style={{color:'#98c34d', fontSize:'2.3rem', fontWeight: 700}}>YANDOC</span>
                <p className='text-xs mt-4 ml-2' style={{color:'#49509f',fontSize:'2.3rem',fontWeight: 700}}>Solution</p>
            </div>
            <nav className='hidden lg:flex flex-row items-center text-lg font-medium gap-8 ml-8 mt-2 justify-center'>
              <Link to='home' spy={true} smooth={true} duration={500} className='transition-all cursor-pointer text-blue-600 hover:text-green-600'>Home</Link>
              <Link to='about' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all'>About</Link>
              <Link to='produits' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all'>Produits</Link>
              <Link to='services' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all'>Services</Link>
              <Link to='princing' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all'>Pricing</Link>
              <Link to='portfolio' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all'>Portfolio</Link>
            </nav>
            <div className='lg:hidden flex items-center'>
              {toggle ?(
                <i className='pi pi-times ml-4 mt-2' style={{ fontSize: '1.6rem' }} onClick={()=>{setToggle(!toggle)}}/>
              ):(
                <i className='pi pi-bars ml-4 mt-2' style={{ fontSize: '1.8rem' }}onClick={()=>{setToggle(!toggle)}}/>
              )}
            </div>
            <div className="layout-topbar-menu mr-1">
              <Button label="Espaces Visiteurs" 
                className="hover:scale-98 hover:border-transparent transform transition-all duration-300 rounded-lg"
                style={{background:'linear-gradient(-235deg,#bbd151 0%,#3a8ec8 48%,#4801FF 100%)' , border: 'none', width:'180px', height:'40px'}} 
                rounded onClick={() => router.push('/facture')}/>
            </div>
            {toggle && <div className={`${toggle ? "translate-x-0" : "-translate-x-full"} lg:hidden flex flex-col absolute bg-gray-200 text-blue-600 left-0 top-20 font-semibold text-2xl text-center z-10 pt-4 pb-4 gap-8 w-full h-fit transition-transform duration-300`}>
              <table>
                <tr><Link to='home' spy={true} smooth={true} duration={500} className='transition-all cursor-pointer text-blue-600 hover:text-green-600' onClick={()=>{setToggle(false)}}>Home</Link></tr>
                <tr><Link to='about' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all' onClick={()=>{setToggle(false)}}>About</Link></tr>
                <tr><Link to='produits' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all' onClick={()=>{setToggle(false)}}>Produits</Link></tr>
                <tr><Link to='services' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all' onClick={()=>{setToggle(false)}}>Services</Link></tr>
                <tr><Link to='princing' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all' onClick={()=>{setToggle(false)}}>Pricing</Link></tr>
                <tr><Link to='portfolio' spy={true} smooth={true} duration={500} className='cursor-pointer text-blue-600 hover:text-green-600 transition-all' onClick={()=>{setToggle(false)}}>Portfolio</Link></tr>
              </table>
          </div>}
        </div>
    </div>
  )
}

export default Navbar