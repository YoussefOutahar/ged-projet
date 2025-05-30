import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Divider } from 'primereact/divider';


const Products = () => {
    return (
        <div className='flex flex-column justify-around px-5 py-5' style={{backgroundColor:'white'}}>
            <div className='mt-8'>
                <h1 className='text-4xl font-semibold text-center'>Produits</h1>
                <h2 className='text-xl font-semibold text-center mt-5 text-gray-600'>Produits YanDoc : Innovation Numérique Redéfinissant Votre Gestion Documentaire</h2>
            </div>
            {/* <Divider style={{width:500}}/> */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Accordion activeIndex={0} style={{width:750, marginBottom:5}}>
                    <AccordionTab header={
                        <div className="flex align-items-center">
                            <i className="pi pi-calendar mr-2"></i>
                            <span className="vertical-align-middle">Gestion electronic </span>
                        </div>
                    }>
                        <p className="m-0" style={{textAlign:'justify'}}>
                            Notre mission est de vous guider à travers les multiples facettes
                            de la Gestion électronique, en mettant l'accent sur la numérisation
                            intelligente, l'automatisation des processus et l'intégration transparente
                            des technologies émergentes. Que vous soyez une entreprise en croissance ou 
                            une organisation établie, nous vous offrons des conseils pratiques pour tirer 
                            le meilleur parti de la GED, transformant vos défis documentaires en opportunités 
                            stratégiques.
                        </p>
                    </AccordionTab>
                    <AccordionTab header={
                        <div className="flex align-items-center">
                            <i className="pi pi-user mr-2"></i>
                            <span className="vertical-align-middle">Signature electronique</span>
                        </div>}
                    >
                        <p className="m-0" style={{textAlign:'justify'}}>
                        La signature électronique offre une alternative moderne et juridiquement 
                        contraignante aux signatures manuscrites traditionnelles, permettant une 
                        validation rapide et efficace des accords, contrats et autres documents importants.

                        Découvrez comment la signature électronique peut accélérer vos processus métier,
                        réduire les délais de traitement et éliminer les barrières liées à la distance 
                        géographique. Nous vous guiderons à travers les aspects pratiques de la mise en 
                        œuvre de la signature électronique, des protocoles de sécurité aux intégrations 
                        logicielles, afin de garantir une expérience fluide et conforme.
                        </p>
                    </AccordionTab>
                    <AccordionTab header={
                        <div className="flex align-items-center">
                            <i className="pi pi-cog mr-2"></i>
                            <span className="vertical-align-middle">Parapheur électronique</span>
                        </div>}
                    >
                        <p className="m-0" style={{textAlign:'justify'}}>
                        Le parapheur électronique offre une approche numérique et sécurisée pour la validation
                        des documents, permettant une gestion efficace des Workflows et une traçabilité
                        transparente des approbations.

                        Explorez les avantages du parapheur électronique en découvrant comment il simplifie
                        le processus d'approbation, accélère les cycles de validation et élimine les 
                        contraintes liées aux approbations manuelles. Nous vous accompagnons dans la 
                        compréhension des fonctionnalités avancées du parapheur électronique, des annotations
                        personnalisées à la gestion intelligente des tâches, pour optimiser vos processus 
                        internes.
                        </p>
                    </AccordionTab>
                </Accordion>
                <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end',marginLeft:'2rem'}}>
                    <img src="/Images/hero-img.png" alt='img' width={470}/>
                </div>
            </div>
        </div>
    )

};
export default Products;