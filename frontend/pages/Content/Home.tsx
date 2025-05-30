import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import React, { useState } from 'react'
import StatisticsSection from './StatisticsSection';

const Home = () => {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);
  const handleRedirectToAuth = () => {
    router.push('/auth');
  };
  return (
    <div className='flex flex-column'>
      <div className='min-h-[50vh] flex justify-center items-center lg:px-32 px-5 py-8 bg-backgroundColor'>
          <div className='mt-8 items-center text-center w-full lg:w3/4'>
              <h1 className='text-6xl font-semibold leading-tight mt-24 text-center'>Avec la platforme digitale YANDOC
              </h1>
              <span className='text-blue-800 text-3xl font-semibold text-center'>Contactez un partenaire Yan Doc</span>
                <p className='ml-8 mr-8 text-center text-lg mt-2'>
                  Experts dans l’analyse de vos besoins et dans la mise en production des solutions
                  de Gestion de l’Information YanDoc, notre vaste réseau international de partenaires
                  certifiés sont à votre disposition pour renforcer la productivité de vos collaborateurs
                  et vous aider à réaliser des gains financiers.
                  
                </p>
              <div className='flex items-center ml-5 text-xl font-semibold px-4 transition-all py-[0.5rem]'>
                <Button label="Se Connecter" icon="pi pi-lock" onClick={handleRedirectToAuth} rounded style={{background:'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)' , border: 'none'}} 
                  className='flex flex-row items-center mt-4 ml-5 hover:bg-blue-600 hover:text-white text-xl font-semibold px-4 transition-all py-[0.5rem] rounded-xl cursor-pointer'/>
                {/* <Button label="Envoyer une Demande" icon="pi pi-arrow-right" severity="help" rounded onClick={() => router.push('/facture')}
                  className='flex items-center ml-5 text-xl font-semibold px-4 transition-all py-[0.5rem] rounded-xl cursor-pointer'
                  style={{background: !hovered ? 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)' : '#00539c' , border: 'none'}}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  /> */}
              </div>
          </div>
          <div className='mt-20'>
              <img src="/Images/why-us.png" alt='img' width={570}/>
          </div>
      </div>
      <div style={{backgroundColor:'#00539c'}}>
        <StatisticsSection />
      </div>
    </div>
  )

}

export default Home