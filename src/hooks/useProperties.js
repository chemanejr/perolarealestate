import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);

  const mapRow = (p) => {
    const numericPrice = parseInt((p.price || '').replace(/\D/g, ''), 10) || 0;
    const dealType     = p.purpose || (numericPrice > 500000 ? 'Venda' : 'Arrendamento');
    const typeMap = {
      Apartment: 'Apartamento',
      House:     'Moradia',
      Villa:     'Vivenda',
      Office:    'Escritório',
      Land:      'Terreno',
    };
    return {
      id:          p.id,
      image:       Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (typeof p.images === 'string' && p.images.startsWith('[') ? JSON.parse(p.images)[0] : '/property_placeholder.png'),
      title:       p.title,
      price:       p.price,
      location:    p.location,
      beds:        parseInt(p.bedrooms  || '0', 10),
      baths:       parseInt(p.bathrooms || '0', 10),
      area:        p.area ? parseInt(p.area, 10) : Math.floor(Math.random() * 300) + 100,
      status:      typeMap[p.type] || p.type || 'Imóvel',
      dealType:    dealType,
      exclusive:   false,
      images:      Array.isArray(p.images) ? p.images : (typeof p.images === 'string' && p.images.startsWith('[') ? JSON.parse(p.images) : []),
      description: p.description,
      map_embed:   p.map_embed,
      source:      p.source || 'supabase',
    };
  };

  const fetchProperties = async () => {
    setLoading(true);
    
    let supabaseProps = [];
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        supabaseProps = data.map(mapRow);
      }
    } catch {
      // Supabase unavailable
    }

    // Fetch local JSON to combine with Supabase data
    let jsonProps = [];
    try {
      const res  = await fetch('/properties.json');
      const data = await res.json();
      jsonProps = data.map(p => {
        const numericPrice = parseInt((p.price || '').replace(/\D/g, ''), 10) || 0;
        const dealType     = numericPrice > 500000 ? 'Venda' : 'Arrendamento';
        return {
          id:          `json_${p.id}`,
          image:       p.images && p.images.length > 0 ? p.images[0] : '/property_placeholder.png',
          title:       p.title,
          price:       p.price,
          location:    p.location,
          beds:        parseInt(p.bedrooms  || '0', 10),
          baths:       parseInt(p.bathrooms || '0', 10),
          area:        Math.floor(Math.random() * 300) + 100,
          status:      p.type === 'Apartment' ? 'Apartamento' : 'Moradia',
          dealType:    dealType,
          exclusive:   p.id % 3 === 0,
          images:      p.images || [],
          description: p.description,
          map_embed:   p.map_embed,
          source:      'json',
        };
      });
    } catch (err) {
      console.error('Failed to fetch properties', err);
    }

    setProperties([...supabaseProps, ...jsonProps]);
    setLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  const deleteProperty = async (id) => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (!error) setProperties(prev => prev.filter(p => p.id !== id));
    return !error;
  };

  return { properties, loading, refetch: fetchProperties, deleteProperty };
}
