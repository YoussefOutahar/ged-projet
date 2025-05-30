import React from 'react'
import SkillCard from './SkillCard'

const About = () => {
    return (
        <div className='min-h-screen flex flex-column justify-around lg:gap-8 lg:px-32 px-5' style={{backgroundColor:'#e0e8f6'}}>
            <div className='mt-8'>
                <h1 className='text-4xl font-semibold text-center lg:mt-2'>About US</h1>
            </div>
            <div className=' -mt-8'>
                <div className='mb-10'>
                    <h2 className='text-xl font-semibold text-center mt-5 text-gray-600'>Collaboration Gagnante : Optimisez Vos Ressources avec les Experts YanDoc</h2>
                    <div style={{display: 'flex' ,justifyContent: 'space-between'}}>
                        <p className='mt-4 lg:mt-2 w-5' style={{textAlign:'justify'}}>
                        Faites équipe avec nos partenaires certifiés YanDoc, des experts dédiés à l'analyse approfondie de vos besoins en matière de gestion de l'information. Forts d'une expérience étendue et d'une compréhension approfondie des solutions YanDoc, nos partenaires sont prêts à collaborer avec vous pour mettre en production des solutions sur mesure.
                        </p>
                        <p className='mt-4 lg:mt-2 w-5' style={{textAlign:'justify'}}>
                        Notre vaste réseau international de partenaires certifiés est votre ressource dédiée pour renforcer la productivité de vos collaborateurs. En comprenant parfaitement les spécificités de votre entreprise, nos partenaires sont en mesure de recommander et de mettre en œuvre des solutions qui maximisent l'efficacité de vos processus métiers.
                        </p>
                    </div>
                </div>
                <div>
                    {/* <h2 className=' text-3xl font-semibold text-center lg:mt-2'> Skills</h2> */}
                    <div>
                        <SkillCard title='Securité' width='90%' val='90%' />
                        <SkillCard title='Support' width='70%' val='70%' />
                        <SkillCard title='Techniques' width='90%' val='90%' />
                        <SkillCard title='Programming' width='80%' val='80%' />
                    </div>
                </div>
            </div>
        </div>
      )
    
}

export default About