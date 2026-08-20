'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const Footer = ({ categories }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const footerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (footerRef.current && !footerRef.current.contains(event.target)) {
        setExpandedMenus({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSubMenu = (e, catName) => {
    e.preventDefault();
    setExpandedMenus(prev => ({
      [catName]: !prev[catName]
    }));
  };

  const visibleCategories = categories ? categories.slice(0, 5) : [];
  const moreCategories = categories && categories.length > 5 ? categories.slice(5) : [];

  const renderCategoryItem = (cat) => (
    <li key={cat.name} style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {cat.gid ? (
          <Link href={`/?gid=${cat.gid}`} style={{ fontWeight: '500', color: '#ffffff', marginRight: '8px' }}>
            {cat.name}
          </Link>
        ) : (
          <span style={{ fontWeight: '500', color: '#ffffff', marginRight: '8px' }}>{cat.name}</span>
        )}
        {cat.subCategories?.length > 0 && (
          <span 
            className={`footer-dropdown-toggle ${expandedMenus[cat.name] ? 'open' : ''}`}
            onClick={(e) => toggleSubMenu(e, cat.name)}
          >
            ▼
          </span>
        )}
      </div>
      
      {cat.subCategories?.length > 0 && (
        <ul className={`footer-sub-menu ${expandedMenus[cat.name] ? 'open' : ''}`} style={{ paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {cat.subCategories.map(sub => (
            <li key={sub.gid}>
              <Link href={`/?gid=${sub.gid}`} style={{ color: '#f3f4f6', fontSize: '0.9em' }}>
                - {sub.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <footer ref={footerRef}>
      <div className="footer-content">
        <div className="footer-col">
          <h3>เกี่ยวกับเรา</h3>
          <p>
            เว็บไซต์รวบรวมสินค้าคุณภาพ โปรโมชั่นพิเศษ และดีลเด็ดๆ จากพาร์ทเนอร์ชั้นนำ
            เพื่อคุณโดยเฉพาะ
          </p>
        </div>
        
        <div className="footer-col">
          <h3>หมวดหมู่สินค้า</h3>
          <ul className="footer-menu">
            {visibleCategories.map(renderCategoryItem)}
            
            {moreCategories.length > 0 && (
              <li className="footer-has-popup" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span 
                    style={{ fontWeight: '500', color: '#ffffff', marginRight: '8px', cursor: 'pointer' }}
                    onClick={(e) => toggleSubMenu(e, 'footer_more_categories')}
                  >
                    ดูเพิ่มเติม
                  </span>
                  <span 
                    className={`footer-dropdown-toggle ${expandedMenus['footer_more_categories'] ? 'open' : ''}`}
                    onClick={(e) => toggleSubMenu(e, 'footer_more_categories')}
                  >
                    ▼
                  </span>
                </div>
                
                <ul className={`footer-popup-menu ${expandedMenus['footer_more_categories'] ? 'open' : ''}`}>
                  {moreCategories.map(cat => (
                    <li key={cat.name}>
                      <Link href={`/?gid=${cat.gid}`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
        
        <div className="footer-col">
          <h3>ศูนย์ช่วยเหลือ</h3>
          <ul>
            <li><a href="#">ติดต่อเรา</a></li>
            <li><a href="#">คำถามที่พบบ่อย</a></li>
            <li><a href="#">นโยบายความเป็นส่วนตัว</a></li>
            <li><a href="#">เงื่อนไขการใช้งาน</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} 7Pro Deals. สงวนลิขสิทธิ์.
      </div>
    </footer>
  );
};

export default Footer;
