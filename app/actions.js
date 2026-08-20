'use server';

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres.jtqkhsjuzsgrbhnvljps:.%40AUIIIii%232611963@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres'
});

export async function getCategories() {
  try {
    const res = await pool.query('SELECT DISTINCT category FROM makro_products ORDER BY category');
    const categories = res.rows.map((row, index) => ({
      name: row.category,
      gid: String(index + 1)
    }));
    return categories;
  } catch (err) {
    console.error("Failed to fetch categories from Supabase", err);
    return [];
  }
}

export async function fetchProductsAction(gid, page = 1, limit = 50, query = '') {
  try {
    const categories = await getCategories();
    let catName = '';
    if (gid) {
      catName = categories.find(c => c.gid === String(gid))?.name || '';
    }

    let countQueryText = 'SELECT COUNT(*) FROM makro_products WHERE 1=1';
    let queryText = 'SELECT * FROM makro_products WHERE 1=1';
    let queryParams = [];
    
    if (catName) {
      queryParams.push(catName);
      countQueryText += ` AND category = $${queryParams.length}`;
      queryText += ` AND category = $${queryParams.length}`;
    }
    
    if (query) {
      queryParams.push(`%${query}%`);
      countQueryText += ` AND (product_name ILIKE $${queryParams.length} OR category ILIKE $${queryParams.length})`;
      queryText += ` AND (product_name ILIKE $${queryParams.length} OR category ILIKE $${queryParams.length})`;
    }
    
    // Get total count
    const countRes = await pool.query(countQueryText, queryParams);
    const totalCount = parseInt(countRes.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    const offset = (page - 1) * limit;
    queryText += ` ORDER BY product_name LIMIT ${limit} OFFSET ${offset}`;

    const res = await pool.query(queryText, queryParams);
    const rows = res.rows;

    const products = rows.map(p => {
      const cleanPrice = (val) => {
        if (!val) return 0;
        const num = parseFloat(String(val).replace(/[^\d.-]/g, ''));
        return isNaN(num) ? 0 : num;
      };
      
      let picUrl = p['URL รูปภาพ'] || p.image_url || '';
      if (picUrl && picUrl.startsWith('/')) {
        picUrl = 'https://affiliate.makro.pro' + picUrl;
      }
      
      const priceVal = cleanPrice(p['ราคาขาย'] || p.sale_price);
      const originalPriceVal = cleanPrice(p.original_price);
      
      return {
        ...p,
        _category_name: p.category,
        picture_url: picUrl,
        product_name: p.product_name || '',
        sale_price: originalPriceVal || priceVal || 0,
        discounted_price: priceVal || 0,
        promo_short_link: p.product_url || '',
        unit: p.unit || '',
        sold: 0
      };
    });

    return {
      products,
      hasMore: page < totalPages,
      totalPages,
      totalCount
    };
  } catch (err) {
    console.error("Failed to fetch products from Supabase", err);
    return { products: [], hasMore: false, totalPages: 1, totalCount: 0 };
  }
}
