import React, { useEffect, useState } from 'react';
import api from '../services/api';

const StorePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div>
      <h1>Store Page</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default StorePage;
