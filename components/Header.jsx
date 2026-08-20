'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = ({ categories, activeGid, initialQuery = '' }) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const headerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setExpandedMenus({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(query)}`);
    setIsMenuOpen(false); // Close menu after searching on mobile
  };

  const closeMenu = () => setIsMenuOpen(false);

  const toggleSubMenu = (e, catName) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus(prev => ({
      // Close all other menus and toggle the clicked one
      [catName]: !prev[catName]
    }));
  };

  // Split categories for desktop view
  const visibleCategories = categories ? categories.slice(0, 5) : [];
  const moreCategories = categories && categories.length > 5 ? categories.slice(5) : [];

  const renderCategoryItem = (cat) => (
    <React.Fragment key={cat.name}>
      {cat.gid ? (
        <div className="nav-item-wrapper">
          <Link 
            href={`/?gid=${cat.gid}`}
            className={activeGid === cat.gid ? 'active' : ''}
            onClick={() => { setQuery(''); closeMenu(); }}
          >
            {cat.name}
          </Link>
          {cat.subCategories?.length > 0 && (
            <span 
              className={`dropdown-toggle ${expandedMenus[cat.name] ? 'open' : ''}`}
              onClick={(e) => toggleSubMenu(e, cat.name)}
            >
              ▼
            </span>
          )}
        </div>
      ) : (
        <div className="nav-item-wrapper">
          <span className="nav-group-title">
            {cat.name}
          </span>
          {cat.subCategories?.length > 0 && (
            <span 
              className={`dropdown-toggle ${expandedMenus[cat.name] ? 'open' : ''}`}
              onClick={(e) => toggleSubMenu(e, cat.name)}
            >
              ▼
            </span>
          )}
        </div>
      )}
      
      {cat.subCategories?.length > 0 && (
        <ul className={`dropdown-menu ${expandedMenus[cat.name] ? 'open' : ''}`}>
          {cat.subCategories.map(sub => (
            <li key={sub.gid}>
              <Link 
                href={`/?gid=${sub.gid}`}
                className={activeGid === sub.gid ? 'active' : ''}
                onClick={() => { setQuery(''); closeMenu(); setExpandedMenus({}); }}
              >
                {sub.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </React.Fragment>
  );

  return (
    <header ref={headerRef}>
      <div className="header-container">
        <div className="logo-and-toggle">
          <div className="logo">
            🛒 7Pro <span>Deals</span>
          </div>
          <button 
            className="mobile-menu-toggle" 
            onClick={() => {
              if (!isMenuOpen) {
                setExpandedMenus({}); // Reset sub-menus when opening
              }
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
        
        <div className={`nav-and-search ${isMenuOpen ? 'open' : ''}`}>
          <nav className="main-nav">
            <ul className="desktop-nav">
              {visibleCategories.map((cat) => (
                <li key={cat.name} className={cat.subCategories?.length > 0 ? 'has-dropdown' : ''}>
                  {renderCategoryItem(cat)}
                </li>
              ))}
              
              {moreCategories.length > 0 && (
                <li className="has-dropdown more-dropdown-li">
                  <div className="nav-item-wrapper">
                    <span 
                      className="nav-group-title"
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={(e) => toggleSubMenu(e, 'more_categories')}
                    >
                      ดูเพิ่มเติม
                      <span className={`dropdown-toggle ${expandedMenus['more_categories'] ? 'open' : ''}`} style={{ padding: 0 }}>
                        ▼
                      </span>
                    </span>
                  </div>
                  
                  <ul className={`dropdown-menu ${expandedMenus['more_categories'] ? 'open' : ''}`} style={{ minWidth: '220px' }}>
                    {moreCategories.map(cat => (
                      <li key={cat.name}>
                        <Link 
                          href={`/?gid=${cat.gid}`}
                          className={activeGid === cat.gid ? 'active' : ''}
                          onClick={() => { setQuery(''); closeMenu(); setExpandedMenus({}); }}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
            
            {/* Mobile Nav (Shows all) */}
            <ul className="mobile-nav">
              {categories && categories.map((cat) => (
                <li key={cat.name} className={cat.subCategories?.length > 0 ? 'has-dropdown' : ''}>
                  {renderCategoryItem(cat)}
                </li>
              ))}
            </ul>
          </nav>

          <div className="auth-buttons">
            <button className="btn btn-outline">เข้าสู่ระบบ</button>
            <button className="btn btn-primary">สมัครสมาชิก</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
