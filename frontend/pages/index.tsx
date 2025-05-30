import { Button } from 'primereact/button';
import React from 'react';
import Navbar from './Content/Navbar';
import Head from 'next/head';
import Home from './Content/Home';
import About from './Content/About';
import Services from './Content/Services';
import Footer from './Content/Footer';
import Products from './Content/Accordin';
import CardPricing from './Content/CardPricing';
import Portfolio from './Content/Portfolio';
import { ScrollTop } from 'primereact/scrolltop';


const HomePage = () => {
  
  return (
    <>
      <Head><title>YanDoc Application</title> </Head>
      <div>
        <Navbar />
        <main>
          <div id='home'>
            <Home/>
          </div>
          <div id='about'>
            <About />
          </div>
          <div id='services'>
            <Services />
          </div>
          <div id='produits'>
            <Products />
          </div>
          <div id='princing'>
            <CardPricing />
          </div>
          {/* <div id='portfolio'>
            <Portfolio />
          </div> */}
        </main>
        <Footer/>
        <ScrollTop />
      </div>
    </>

  );
};
HomePage.getLayout = (page: React.ReactElement) => page; 
export default HomePage;
