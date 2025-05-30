import React from 'react';
import Counter from './Counter';

const StatisticsSection: React.FC = () => (
  <section id="counts" className="counts count-bg">
    <div className="container">
      <div>
        <h1 className='mt-2' style={{ color: 'white' }}>Chiffres-clés</h1>
        <p style={{ color: '#c5c8dd', marginTop: 0 }}>de septembre 2022 à decembre 2023</p>
      </div>
      <div className="flex row counters text-gray-50 text-3xl" style={{fontWeight:900}}>
        <Counter start={0} end={25} title="Colaborateurs" />
        <Counter start={0} end={30} title="Formateurs" />
        <Counter start={0} end={6} title="Services" />
        <Counter start={0} end={12} title="Produits" />
      </div>

    </div>
  </section>
);

export default StatisticsSection;
