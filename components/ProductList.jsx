'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProductsAction } from '../app/actions';

export default function ProductList({ initialProducts, initialHasMore, initialTotalPages, gid, query = '' }) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  // Reset state when gid or query changes
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setTotalPages(initialTotalPages);
  }, [gid, query, initialProducts, initialTotalPages]);

  const loadPage = async (pageNumber) => {
    if (loading || pageNumber === page || pageNumber < 1 || pageNumber > totalPages) return;
    
    setLoading(true);
    try {
      const result = await fetchProductsAction(gid, pageNumber, 50, query);
      setProducts(result.products);
      setPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <>
      <div className="product-grid" style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {products.map((product, index) => (
          <ProductCard 
            key={product.item_id ? `${product.item_id}-${index}` : index} 
            product={product} 
          />
        ))}
      </div>
      
      {loading && <div className="loading" style={{ margin: '2rem 0' }}>กำลังโหลดข้อมูล...</div>}
      
      {totalPages > 1 && (
        <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '3rem 0', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            disabled={page === 1}
            onClick={() => loadPage(page - 1)}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', background: page === 1 ? '#f5f5f5' : 'white', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            &lt;
          </button>
          
          <span style={{ marginRight: '10px', fontSize: '0.9rem', color: '#666' }}>
            หน้า {page}/{totalPages}
          </span>

          {getPageNumbers().map((p, i) => (
            p === '...' ? (
              <span key={`dots-${i}`} style={{ padding: '8px' }}>...</span>
            ) : (
              <button 
                key={p}
                onClick={() => loadPage(p)}
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '4px', 
                  border: p === page ? '1px solid #E20025' : '1px solid #ccc',
                  background: p === page ? '#E20025' : 'white',
                  color: p === page ? 'white' : 'black',
                  cursor: 'pointer',
                  fontWeight: p === page ? 'bold' : 'normal'
                }}
              >
                {p}
              </button>
            )
          ))}

          <button 
            disabled={page === totalPages}
            onClick={() => loadPage(page + 1)}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', background: page === totalPages ? '#f5f5f5' : 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', marginLeft: '10px' }}
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
}
