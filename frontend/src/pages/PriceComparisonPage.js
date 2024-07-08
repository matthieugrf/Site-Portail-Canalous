import React, { useEffect, useState } from 'react';
import api from '../services/api';

const PriceComparisonPage = () => {
  const [comparisons, setComparisons] = useState([]);

  useEffect(() => {
    api.get('/price-comparisons/')
      .then(response => {
        setComparisons(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div>
      <h1>Price Comparison Page</h1>
      <ul>
        {comparisons.map(comparison => (
          <li key={comparison.id}>{comparison.product.name} - {comparison.vendor}: ${comparison.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default PriceComparisonPage;
