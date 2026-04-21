import { useState, useEffect } from 'react';

export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/properties.json')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(p => {
          const numericPrice = parseInt((p.price || '').replace(/\D/g, ''), 10) || 0;
          const dealType = numericPrice > 500000 ? 'Venda' : 'Arrendamento';
          
          return {
            id: p.id,
            image: p.images && p.images.length > 0 ? p.images[0] : '/property_placeholder.png',
            title: p.title,
            price: p.price,
            location: p.location,
            beds: parseInt(p.bedrooms || '0', 10),
            baths: parseInt(p.bathrooms || '0', 10),
            area: Math.floor(Math.random() * 300) + 100, // random fallback for area
            status: p.type === 'Apartment' ? 'Apartamento' : 'Moradia',
            dealType: dealType,
            exclusive: p.id % 3 === 0,
            images: p.images || [],
            description: p.description
          };
        });
        setProperties(mapped);
      })
      .catch(err => {
        console.error("Failed to fetch properties", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { properties, loading };
}
