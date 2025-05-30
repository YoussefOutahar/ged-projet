import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';

interface CounterProps {
  start: number;
  end: number;
  title: string;
}

const Counter: React.FC<CounterProps> = ({ start, end, title }) => (
    <div className="col-lg-3 col-3 text-center">
        <CountUp start={start} end={end} duration={5} separator=" " />
        <h3 className="counter-title">{title}</h3>
  </div>
)

export default Counter