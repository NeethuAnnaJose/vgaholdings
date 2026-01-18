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

export default function Header() {
  const [active, setActive] = useState('home');
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    // Scrollspy: observe sections and set active when in view
    const sections = Array.from(document.querySelectorAll('.page-section'));
    if (sections.length === 0) return;

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.45,
      }
    );

    sections.forEach((s) => spy.observe(s));

    return () => {
      spy.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    scrollToId(id, { duration: 1400 })
      .then(() => setActive(id))
      .catch(() => {
        /* canceled or interrupted */
      });
  }

  // handle initial hash on mount and hash changes
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash && window.location.hash.replace('#', '');
      if (hash) {
        scrollToId(hash, { duration: 1400 }).catch(() => { });
        setActive(hash);
      }
    }
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const LEFT_NAV = NAV_ITEMS.slice(0, 3);
  const RIGHT_NAV = NAV_ITEMS.slice(3);

  return (
    <header className={`site-header ${shrink ? 'shrink' : ''}`}>
      <div className="header-overlay" aria-hidden="true" />
      <div className="header-container">

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
              height: "55px",
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

      </div>
    </header>
  );
}
