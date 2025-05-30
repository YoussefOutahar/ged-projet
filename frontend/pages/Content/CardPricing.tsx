import React from 'react'; 
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

const CardPricing = () => {
    const header = (
        <>
            {/* <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" /> */}
            <img alt="Card" src="https://acaciaeducation.edu.au/wp-content/uploads/2023/05/img-banner-bg-03-min.jpg"/>
            <h1 className='ml-4 text-2xl' style={{color:'#fcc044',fontWeight:700}}>678£</h1>
            <Divider style={{width:400}}/>
        </>
    );
    const footer = (
        <>
            <Button label="Consulter l'offre" icon="pi pi-check" className='mb-4 hover:bg-blue-900' style={{backgroundColor:'#32c1bb',border:'none'}}/>
        </>
    );

    return (
        <div className='flex flex-column justify-around px-5 py-5'>
            <div className='mt-8'>
                <h1 className='text-4xl font-semibold text-center'>Pricing</h1>
                <h2 className='text-xl font-semibold text-center mt-5 text-gray-600'>Exploration Tarifaire YanDoc : Des Plans Sur Mesure pour Chaque Entreprise</h2>
            </div>
            <div className="flex justify-content-center gap-4">
                <Card title="Plans personnalisés" subTitle="For individual developers" footer={footer} header={header} className="md:w-25rem">
                    <p className="m-0" style={{textAlign:'justify'}}>
                        Proposez des plans adaptés aux besoins spécifiques de chaque entreprise. Mettez en avant la flexibilité de YanDoc pour répondre aux exigences uniques de chaque client.
                    </p>
                </Card>
                <Card title="Formation et support" subTitle="For small teams" footer={footer} header={header} className="md:w-25rem">
                    <p className="m-0" style={{textAlign:'justify'}}>
                        Mettez en avant les services de formation et de support inclus dans les différents plans, soulignant l'engagement de YanDoc à accompagner ses clients à chaque étape.
                    </p>
                </Card>
                <Card title="Mises à niveau flexibles" subTitle="For larger teams" footer={footer} header={header} className="md:w-25rem">
                    <p className="m-0" style={{textAlign:'justify'}}>
                        Expliquez comment les clients peuvent facilement mettre à niveau leur plan en fonction de leur croissance ou de l'évolution de leurs besoins pour inciter les clients à s'associer à YanDoc par le biais de vos partenaires.
                    </p>
                </Card>
            </div>
        </div>
    )

};
export default CardPricing;
        