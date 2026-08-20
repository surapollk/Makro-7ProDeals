import React from 'react';

const ProductCard = ({ product }) => {
  const cleanNum = (str) => typeof str === 'string' ? parseFloat(str.replace(/[^\d.-]/g, '')) : parseFloat(str);
  // Use discounted price if available, else use sale price
  const price = cleanNum(product.discounted_price) || cleanNum(product.sale_price) || 0;
  const originalPrice = cleanNum(product.sale_price) || 0;
  const discount = product.discounted_percentage;
  
  return (
    <div className="product-card">
      <a href={product.promo_short_link || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <div className="product-image-container">
          <img 
            src={product.picture_url} 
            alt={product.product_name} 
            className="product-image" 
            loading="lazy" 
          />
        </div>
        <div className="product-info">
          <h3 className="product-title" title={product.product_name}>
            {product.product_name}
          </h3>
          
          <div className="product-price-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <div>
              <span className="price-current">฿{price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
              <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '4px' }}>/ {product.unit || 'ชิ้น'}</span>
              {originalPrice > price && (
                <div style={{ marginTop: '2px' }}>
                  <span className="price-original">฿{originalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
          </div>

          <button className="btn-details">
            สั่งซื้อบน Makro Pro
          </button>
        </div>
      </a>
    </div>
  );
};

export default ProductCard;
