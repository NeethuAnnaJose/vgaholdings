import React, { useEffect, useState } from 'react';
import './Header.css';
import { scrollToId } from '../utils/smoothScroll';

const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT US' },
  { id: 'services', label: 'SERVICES' },
  { id: 'news', label: 'NEWS' },
  { id: 'clients', label: 'OUR CLIENTS' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Header({ scrolled, activeSection }) {
  const active = activeSection || 'home';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolled = scrolled;

  // Keep a CSS variable in sync with the header height so anchors and CSS can
  // use a correct offset even when the header shrinks or the window resizes.
  useEffect(() => {
    const headerEl = document.querySelector('.site-header');
    if (!headerEl) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const h = entry.target.offsetHeight;
        document.documentElement.style.setProperty('--header-offset', `${h}px`);
      }
    });

    resizeObserver.observe(headerEl);
    return () => resizeObserver.disconnect();
  }, []);

  function handleNavClick(e, id) {
    e.preventDefault();
    setMobileMenuOpen(false);

    setTimeout(() => {
      scrollToId(id, { duration: 1400 })
        .catch(() => { });
    }, 50);
  }


  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  // handle initial hash on mount and hash changes
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash && window.location.hash.replace('#', '');
      if (hash) {
        scrollToId(hash, { duration: 1400 }).catch(() => { });
      }
    }
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const LEFT_NAV = NAV_ITEMS.slice(0, 3);
  const RIGHT_NAV = NAV_ITEMS.slice(3);

  return (
    <header className={`site-header ${mobileMenuOpen ? 'mobile-menu-open' : ''} ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-overlay" aria-hidden="true" />
      <div className="header-container">

        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          className="hamburger-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Left Nav */}
        <nav className="site-nav nav-left" aria-label="Main navigation left">
          <ul>
            {LEFT_NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? 'active' : ''}
                  onClick={(e) => handleNavClick(e, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Centered Brand */}
        <a
          className="brand"
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img
            src="/vgalogo.png"
            alt="VGA Holdings Logo"
            style={{
              height: "50px",
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </a>


        {/* Right Nav */}
        <nav className="site-nav nav-right" aria-label="Main navigation right">
          <ul>
            {RIGHT_NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? 'active' : ''}
                  onClick={(e) => handleNavClick(e, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation Drawer */}
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? 'active' : ''}
                  onClick={(e) => handleNavClick(e, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </div>
      {/* ✅ Mobile Navigation Drawer */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={active === item.id ? 'active' : ''}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>


      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
