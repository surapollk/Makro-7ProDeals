'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProductsAction } from '../app/actions';

export default function ProductList({ initialProducts, initialHasMore, gid, query = '' }) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

  // Reset state when gid or query changes (when user clicks a different category link or searches)
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setHasMore(initialHasMore);
  }, [gid, query, initialProducts, initialHasMore]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchProductsAction(gid, nextPage, 50, query);
      
      setProducts(prev => [...prev, ...result.products]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error("Error loading more products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="product-grid">
        {products.map((product, index) => (
          <ProductCard 
            key={product.item_id ? `${product.item_id}-${index}` : index} 
            product={product} 
          />
        ))}
      </div>
      
      {loading && <div className="loading">กำลังโหลดข้อมูล...</div>}
      
      {!loading && hasMore && (
        <div className="load-more-container" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="btn-load-more" 
            onClick={loadMore} 
            style={{ 
              padding: '10px 30px', 
              fontSize: '1rem', 
              borderRadius: '8px',
              backgroundColor: '#E20025',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ดูเพิ่มเติม...
          </button>
        </div>
      )}
    </>
  );
}
