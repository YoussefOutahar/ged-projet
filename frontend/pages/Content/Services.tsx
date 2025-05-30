import React from 'react'
import ServiceCard from './ServiceCard'

const Services = () => {
    const icon1 = <i className='pi pi-th-large text-orange-500' style={{fontSize: '2.5rem'}}></i>
    const icon2 = <i className='pi pi-camera text-green-500' style={{fontSize: '2.5rem'}}></i>
    const icon3 = <i className='pi pi-cart-plus text-blue-500' style={{fontSize: '2.5rem'}}></i>
    const icon4 = <i className='pi pi-gift text-yellow-500' style={{fontSize: '2.5rem'}}></i>
    const icon5 = <i className='pi pi-globe text-purple-500' style={{fontSize: '2.5rem'}}></i>
    const icon6 = <i className='pi pi-id-card text-pink-500' style={{fontSize: '2.5rem'}}></i>
    const body = 'Garantissez la confidentialité totale'
  return (
    <div className='min-h-screen flex flex-column justify-center items-center px-5 bg-gray-100'>
        <div className='mt-8'>
            <h1 className='text-4xl font-semibold text-center lg:mt-2'> Services </h1>
            <h2 className='text-xl font-semibold text-center mt-5 text-gray-600'>Services YanDoc : Excellence Opérationnelle, Accompagnement Personnalisé</h2>
        </div>
        <div className='flex flex-wrap justify-content-center gap-6 mt-4 mb-4'>
            <ServiceCard icon={icon1} title={"Partage Sécurisé"} body={body} color={'orange'}/>
            <ServiceCard icon={icon2} title={"Confidentialité Documents"} body={body} color={'green'}/>
            <ServiceCard icon={icon3} title={"Lutte Antishadow"} body={body} color={'blue'}/>
            <ServiceCard icon={icon4} title={"Plateforme Prête"} body={body} color={'yellow'}/>
            <ServiceCard icon={icon5} title={"Digitalisation Rapide"} body={body} color={'purple'}/>
            <ServiceCard icon={icon6} title={"Espaces Interactifs"} body={body} color={'pink'}/>
        </div>
    </div>
  )
}


export default Services