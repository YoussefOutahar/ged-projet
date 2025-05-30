import React from 'react'
import "./Portfolio.module.css"

const Portfolio = () => {
  return (
    <div className='flex flex-column justify-around px-5 py-5' style={{backgroundColor:'white'}}>
        <div className='mt-8'>
            <h1 className='text-4xl font-semibold text-center'>Portfolio</h1>
            <h2 className='text-xl font-semibold text-center mt-5 text-gray-600'>Portefeuille d'Excellence YanDoc : Des Réussites Qui Parlent d'Elles-Mêmes</h2>
        </div>
        <div className='flex justify-content-center mt-5'>
            <img
            src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/ab597467817967.5b472699404ea.png'
            alt='Project 1'
            style={{ width: '400px', height: '350px', objectFit: 'cover', transition: 'transform 0.3s ease-in-out' , margin: '0 10px'}}
            className='hover-zoom'
            />
            <img
            src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/409af367817967.5b47269940bf7.png'
            alt='Project 2'
            style={{ width: '400px', height: '350px', objectFit: 'cover', transition: 'transform 0.3s ease-in-out' , margin: '0 10px' }}
            className='hover-zoom'
            />
            <img
            src='https://mir-s3-cdn-cf.behance.net/project_modules/disp/f8edd567817967.5b4726994113c.png'
            alt='Project 3'
            style={{ width: '400px', height: '350px', objectFit: 'cover', transition: 'transform 0.3s ease-in-out' , margin: '0 10px'}}
            className='hover-zoom'
            />
        </div>
        <div className='flex justify-content-center mt-5'>
            <img
            src='https://mir-s3-cdn-cf.behance.net/project_modules/fs/16210767817967.5b4726993fdb4.png'
            alt='Project 1'
            style={{ width: '400px', height: '350px', objectFit: 'cover', transition: 'transform 0.3s ease-in-out' , margin: '0 10px'}}
            className='hover-zoom'
            />
            <img
            src='https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/409af367817967.5b47269940bf7.png'
            alt='Project 2'
            style={{ width: '400px', height: '350px', objectFit: 'cover', transition: 'transform 0.3s ease-in-out' , margin: '0 10px' }}
            className='hover-zoom'
            />
            <img
            src='https://venturebeat.com/wp-content/uploads/2020/10/helpdesk-header-image.png?w=300&strip=all'
            alt='Project 3'
            style={{ width: '400px', height: '350px', objectFit: 'cover', transition: 'transform 0.3s ease-in-out' , margin: '0 10px'}}
            className='hover-zoom'
            />
        </div>
    </div>
  )
}

export default Portfolio