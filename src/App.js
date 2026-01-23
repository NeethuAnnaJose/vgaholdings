import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
// import { scrollToId } from './utils/smoothScroll';

function App() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const [newsIndex, setNewsIndex] = useState(0);

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  // const [isScrolling, setIsScrolling] = useState(false);

  // const sections = [
  //   'home',
  //   'about',
  //   'what-we-do',
  //   'investment-portfolio',
  //   'services',
  //   'news',
  //   'clients',
  //   'leaders',
  //   'inspiration',
  //   'why-choose-us',
  //   'stealth-video',
  //   'contact'
  // ];



  const newsItems = [
    {
      id: 1,
      title: 'GREEK STREET "MYKONOS" GETS SOLD TO THE BAHRAIN SOLYMAR GROUP.',
      text: 'Greek Street first opened its doors on the 6th April 2022. In a very short period of time our customers became regulars and Greek Street became the most attractive hang-out spot in the Kingdom of Bahrain.',
      image: "/Greekstreet.jpg",
      link: "https://vgaholdings.com/latest-news-01/",
    },
    {
      id: 2,
      title: 'GREEK STREET "MYKONOS" GOES LIVE ON BAHRAIN & GREEK TV CHANNELS.',
      text: 'Live on Bahrain and ALPHA Greek TV. The founders who have brought "a taste of Mykonos" to the Kingdom of Bahrain.',
      image: "/alphalive.jpg",
      link: "https://vgaholdings.com/latest-news-02/",
    },
    {
      id: 3,
      title: 'VGA CHEMICALS SIGNS AGREEMENT WITH CARBONTECH IN BAHRAIN.',
      text: 'VGA Chemicals signs an exclusive agreement with Carbontech for the supply of Revowrap, a very High-End Leak repair product for the Oil & Gas Industry in the Kingdom of Bahrain.',
      image: "/CARBONTECH-composite.jpg",
      link: "https://vgaholdings.com/latest-news-03/",
    },
    {
      id: 4,
      title: 'VGA CONSULTANTS SIGN AGREEMENT WITH ARTHUR D. LITTLE IN SAUDI ARABIA.',
      text: 'VGA and Arthur D. Little sign an agreement in Saudi to provide excellent consultancy and planning services for a large insurance firm.',
      image: "/arthurlittle.jpg",
      link: "https://vgaholdings.com/latest-news-04/",
    },
    {
      id: 5,
      title: 'STEALTH-LOCK "NEW GENERATION" LAUNCHED.',
      text: 'Automation, remote-control, data capture, stabilizer modules – this new generation of the Stealth-Lock pipeline connection technology is the product of innovation.',
      image: "/STEALTH-LOGO.png",
      link: "https://vgaholdings.com/latest-news-05/",
    },
    {
      id: 6,
      title: 'AGODCO & TENARIS INK STEALTH-LOCK LATIN AMERICA CONTRACT.',
      text: 'After 4 years of relationship development, field trials, end-user qualifications and contractual negotiations, AGODCO and TENARIS inked their deal.',
      image: "/TENARIS.png",
      link: "https://vgaholdings.com/latest-news-06/",
    },
  ];

  const handleNewsNext = () => {
    if (newsIndex < newsItems.length - 3) {
      setNewsIndex(newsIndex + 1);
    }
  };

  const handleNewsPrev = () => {
    if (newsIndex > 0) {
      setNewsIndex(newsIndex - 1);
    }
  };



  // Full page scroll functionality with internal scroll support
  useEffect(() => {
    let isScrolling = false;
    let scrollTimeout;

    const handleWheel = (e) => {
      // Find current section index first
      const currentScrollY = window.pageYOffset;
      const sections = document.querySelectorAll('.section');
      let targetIndex = -1;
      let minDiff = Infinity;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const diff = Math.abs(currentScrollY - sectionTop);
        if (diff < minDiff) {
          minDiff = diff;
          targetIndex = i;
        }
      }

      // Edge case: if at very top (home), ensure we start from index 0
      if (currentScrollY < 50 && targetIndex !== 0) {
        targetIndex = 0;
      }

      const activeSection = sections[targetIndex];



      // Check for scrollable internal content
      // We look for specific scrollable containers we know of, or generic scrollable divs
      const scrollableContent = activeSection ? activeSection.querySelector('.about-shell, .what-we-do-grid-wrapper, .portfolio-content, .services-grid, .news-carousel-container, .leaders-grid, .clients-scroll-wrapper, .wcu-grid') : null;

      if (scrollableContent) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableContent;
        const isScrollable = scrollHeight > clientHeight;

        if (isScrollable) {
          // Special handling for what-we-do-container: NEVER auto-transition
          if (scrollableContent.classList.contains('what-we-do-grid-wrapper')) {
            // Always allow native scroll, never trigger page transition
            // User must scroll past the section boundary to move to next section
            return;
          }

          // Special handling for about-shell: NEVER auto-transition
          if (scrollableContent.classList.contains('about-shell')) {
            // Always allow native scroll, never trigger page transition
            // User must scroll past the section boundary to move to next section
            return;
          }

          // For other scrollable containers, use boundary detection
          if (e.deltaY > 0) {
            // Scrolling DOWN
            if (Math.ceil(scrollTop + clientHeight) < scrollHeight - 10) {
              return; // Allow native scroll
            }
          } else {
            // Scrolling UP
            if (scrollTop > 10) {
              return; // Allow native scroll
            }
          }
        }
      }

      // Default Page Transition Logic
      e.preventDefault();

      if (isScrolling) return;
      isScrolling = true;

      if (e.deltaY > 0) {
        // Scroll down
        if (targetIndex < sections.length - 1) {
          sections[targetIndex + 1].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } else {
        // Scroll up
        if (targetIndex > 0) {
          sections[targetIndex - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }

      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 1000);
    };

    const handleKeyDown = (e) => {
      if (isScrolling) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const currentScrollY = window.pageYOffset;
        const sections = document.querySelectorAll('.section');
        let targetIndex = -1;
        let minDiff = Infinity;

        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const sectionTop = section.offsetTop;
          const diff = Math.abs(currentScrollY - sectionTop);
          if (diff < minDiff) {
            minDiff = diff;
            targetIndex = i;
          }
        }



        e.preventDefault();
        isScrolling = true;

        if (e.key === 'ArrowDown') {
          if (targetIndex < sections.length - 1) {
            sections[targetIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          if (targetIndex > 0) {
            sections[targetIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }

        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    };

    const handleTouchStart = (e) => {
      window.touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isScrolling) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = window.touchStartY - touchEndY;

      // Find active section
      const currentScrollY = window.pageYOffset;
      const sections = document.querySelectorAll('.section');
      let targetIndex = -1;
      let minDiff = Infinity;
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const diffAbs = Math.abs(currentScrollY - sectionTop);
        if (diffAbs < minDiff) { minDiff = diffAbs; targetIndex = i; }
      }

      const activeSection = sections[targetIndex];
      const activeSectionId = activeSection ? activeSection.id : '';
      if (['what-we-do', 'about', 'investment-portfolio', 'services', 'news', 'leaders', 'clients', 'why-choose-us'].includes(activeSectionId)) {
        return; // Allow native swipe scroll
      }

      if (Math.abs(diff) > 50) {
        // ... standard transition logic ...
        isScrolling = true;

        if (diff > 0) {
          if (targetIndex < sections.length - 1) sections[targetIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          if (targetIndex > 0) sections[targetIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setTimeout(() => { isScrolling = false; }, 1000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Handle scroll for header transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // When the About section comes into view, gently fade out the home video underneath
  useEffect(() => {
    const home = document.getElementById('home');
    const about = document.getElementById('about');
    // const aboutShell = document.querySelector('.about-shell'); // Removed
    if (!home || !about || !('IntersectionObserver' in window)) return;

    // Observer for "about" section transition - Simplified to just fade out home
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === about) {
            if (entry.isIntersecting) {
              home.classList.add('home-fade-out');
              // aboutShell.classList.add('about-rise'); // Removed
              // document.getElementById('main-content-flow').classList.add('pull-up'); // Removed
            } else {
              home.classList.remove('home-fade-out');
              // aboutShell.classList.remove('about-rise'); // Removed
              // document.getElementById('main-content-flow').classList.remove('pull-up'); // Removed
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-5% 0px -5% 0px'
      }
    );
    observer.observe(about);

    // Observer for scrollspy (centralized in App.js)
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const dataNav = entry.target.getAttribute('data-nav');
            if (dataNav) {
              setActiveSection(dataNav);
            } else if (id === 'what-we-do' || id === 'investment-portfolio') {
              setActiveSection('about');
            } else if (id === 'stealth-video' || id === 'why-choose-us') {
              setActiveSection('what-we-do');
            } else {
              setActiveSection(id);
            }
          }
        });
      },
      { threshold: 0.45 }
    );

    const sections = document.querySelectorAll('.page-section');
    sections.forEach((s) => spyObserver.observe(s));

    // Observer for generic reveal animations
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.revealed = "true";
            revealObserver.unobserve(entry.target); // Trigger once
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => revealObserver.observe(el));

    return () => {
      observer.disconnect();
      spyObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  // const handleNavClick = (e, id) => {
  //   e.preventDefault();
  //   const targetSection = document.getElementById(id);
  //   if (targetSection) {
  //     targetSection.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start'
  //     });
  //   }
  // };

  // const navDots = [
  //   { id: 'home', label: 'Home' },
  //   { id: 'about', label: 'About' },
  //   { id: 'what-we-do', label: 'Services' },
  //   { id: 'news', label: 'News' },
  //   { id: 'clients', label: 'Clients' },
  //   { id: 'leaders', label: 'Leaders' },
  //   { id: 'contact', label: 'Contact' }
  // ];

  return (
    <div className="App">
      <Header scrolled={scrolled} activeSection={activeSection} />

      {/* Vertical Navigation Dots - Hidden */}
      {/* <nav className="scroll-nav" aria-label="Quick navigation pins">
        {navDots.map((dot) => (
          <button
            key={dot.id}
            className={`scroll-dot ${activeSection === dot.id ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, dot.id)}
            aria-label={`Go to ${dot.label}`}
            title={dot.label}
          />
        ))}
      </nav> */}
      <main>
        <section id="home" className="section page-section section-odd fullscreen-video-section" data-anchor="home">
          <div className="fullscreen-video-container">
            <div className="fullscreen-video-wrapper">
              <video
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                className="fullscreen-video"
              >
                <source src="/VGA_Holdings_Corporate_Video_1080P.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        <section id="about" className="section page-section section-even reveal" data-anchor="about">
          <div className="about-shell">
            <div className="about-card">
              <div className="about-text">
                <h2 className="about-heading reveal">
                  Who We Are
                </h2>
                <p>
                  VGA was established in 2014 in the Kingdom of Bahrain. We engage in a variety
                  of sectors, such as Brokerage, Consultancy, Chemical Distribution, Oil and Gas
                  Pipeline Services and various other investment portfolios.
                </p>
                <p>
                  Goal setting is a powerful process for thinking about your ideal future and for
                  motivating yourself to turn your vision of this future into reality, and VGA has
                  the skills and the knowledge to help you do so.
                </p>
                <p className="about-signoff">The VGA Team</p>
              </div>
              <div className="about-image-panel" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section id="what-we-do" className="section page-section section-odd" data-anchor="what-we-do">
          <div className="what-we-do-container">
            <h2 className="what-we-do-heading">What We Do</h2>

            <div className="what-we-do-grid-wrapper">
              <div className="what-we-do-grid">
                {/* Item 1: Oil and Gas */}
                <div className="what-we-do-card reveal delay-100">
                  <div className="wd-card-content-top">
                    <h3 className="wd-title">Oil and Gas Pipeline Services</h3>
                    <p className="wd-text">
                      AGODCO the proprietary owner of the Stealth-Lock technology designs, builds and develops,
                      innovative and technically advanced pipeline construction technology. But it doesn't stop there.
                      Its Integrated Services Resource typically delivers pipeline construction ten times faster than
                      welding with 2km of constructed carbon steel pipeline per crew, per day. We carry your energy
                      in safe, reliable and responsible ways. We are committed to the communities to which we serve to.
                    </p>
                  </div>
                  <div className="wd-card-image-box">
                    <a href="https://www.agodco.com/" target="_blank" rel="noreferrer">
                      <img src="/SL-Pipeline-Construction.jpeg" alt="Oil and Gas" className="wd-card-img" />
                    </a>
                    <div className="wd-card-img-overlay"></div>
                  </div>
                  <footer className="wd-card-footer">
                    <div className="wd-footer-top">
                      <span className="wd-footer-label">OIL AND GAS</span>
                      <span className="wd-footer-percent">50%</span>
                    </div>
                    <div className="wd-footer-progress">
                      <div className="wd-footer-progress-bar" style={{ width: '50%' }}></div>
                    </div>
                  </footer>
                </div>

                {/* Item 2: Chemical Distribution */}
                <div className="what-we-do-card reveal delay-200">
                  <div className="wd-card-content-top">
                    <h3 className="wd-title">Chemical Distribution</h3>
                    <p className="wd-text">
                      VGA Chemicals is the exclusive distributor of Carbontech in the Kingdom of Bahrain. The place
                      where chemistry, engineering and global expertise meet to create a solution for your every need.
                      Carbontech is a leading developer and manufacturer of composite repair systems. It provides
                      engineered solutions for the repair of damaged equipment and pipelines.
                    </p>
                  </div>
                  <div className="wd-card-image-box">
                    <a href="https://revowrap.com/" target="_blank" rel="noreferrer">
                      <img src="/carbontechimg.jpg" alt="Chemical Distribution" className="wd-card-img" />
                    </a>
                    <div className="wd-card-img-overlay"></div>
                  </div>
                  <footer className="wd-card-footer">
                    <div className="wd-footer-top">
                      <span className="wd-footer-label">CHEMICAL DISTRIBUTION</span>
                      <span className="wd-footer-percent">20%</span>
                    </div>
                    <div className="wd-footer-progress">
                      <div className="wd-footer-progress-bar" style={{ width: '20%' }}></div>
                    </div>
                  </footer>
                </div>

                {/* Item 3: Consultancy Services */}
                <div className="what-we-do-card reveal delay-300">
                  <div className="wd-card-content-top">
                    <h3 className="wd-title">Consultancy Services</h3>
                    <p className="wd-text">
                      We are a group of multi-skilled and diverse business advisors experienced in global markets,
                      specifically in the Middle East. Our practitioners have worked in the United States, Europe,
                      and across the Middle East in Finance/Banking, Oil, Gas & Energy, Transaction Advisory,
                      Process Improvement and Project & Programme Management.
                    </p>
                  </div>
                  <div className="wd-card-image-box">
                    <a href="https://vgaholdings.com/wp-content/uploads/2024/09/VGA-CONSULTANCY-SERVICES.pdf" target="_blank" rel="noreferrer">
                      <img src="/Consultancy-service.jpg" alt="Consultancy" className="wd-card-img" />
                    </a>
                    <div className="wd-card-img-overlay"></div>
                  </div>
                  <footer className="wd-card-footer">
                    <div className="wd-footer-top">
                      <span className="wd-footer-label">CONSULTANCY</span>
                      <span className="wd-footer-percent">5%</span>
                    </div>
                    <div className="wd-footer-progress">
                      <div className="wd-footer-progress-bar" style={{ width: '5%' }}></div>
                    </div>
                  </footer>
                </div>

                {/* Item 4: Brokerage Services */}
                <div className="what-we-do-card reveal delay-400">
                  <div className="wd-card-content-top">
                    <h3 className="wd-title">Brokerage Services</h3>
                    <p className="wd-text">
                      Connecting the west to the Middle East and to the Far East, VGA has longstanding, mutually
                      respectful relationships with industry leaders, as well as governments across the world.
                      As part of its brokerage services, VGA is well positioned to act as a principal or an agent
                      across various sectors, and its global presence enables its access to diverse markets and opportunities.
                    </p>
                  </div>
                  <div className="wd-card-image-box">
                    <a href="https://vgaholdings.com/wp-content/uploads/2024/09/VGA-BROKERAGE-SERVICES.pdf" target="_blank" rel="noreferrer">
                      <img src="/Brokerage.jpg" alt="Brokerage" className="wd-card-img" />
                    </a>
                    <div className="wd-card-img-overlay"></div>
                  </div>
                  <footer className="wd-card-footer">
                    <div className="wd-footer-top">
                      <span className="wd-footer-label">BROKERAGE</span>
                      <span className="wd-footer-percent">5%</span>
                    </div>
                    <div className="wd-footer-progress">
                      <div className="wd-footer-progress-bar" style={{ width: '5%' }}></div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="investment-portfolio" className="section page-section section-even" data-anchor="investment-portfolio">
          <div className="portfolio-content reveal">
            <h2 className="portfolio-heading">
              Investment Portfolio
            </h2>
            <p className="portfolio-subheading">
              Welcome to VGA Holdings Investment Portfolios, where innovation meets opportunity!
            </p>
            <p className="portfolio-text">
              Our diverse offerings are designed to enhance your entertainment, event planning, and educational experiences.
              At the forefront is Playsy, our dual reality innovative play center that seamlessly merges creativity and
              technology for unparalleled fun. We also feature VGA Events, your one-stop shop for event solutions,
              serving everything from corporate gatherings to VIP events. The Agency introduces Orizon, our groundbreaking
              3-step system that transforms sales and marketing strategies for measurable success. Additionally, Playbox
              encourages kids to step away from screens and engage their craft skills and imagination through hands-on
              activities. Metakid offers interactive dual challenges, teaching kids how to use technology as a tool rather
              than mere entertainment. Finally, MoneyTree is our initiative focused on fostering financial literacy in
              children from an early age, ensuring they are well-prepared for the future.
            </p>
            <p className="portfolio-cta">
              Discover the potential of each portfolio by clicking on the logos below and embark on a journey of engagement and growth with VGA!
            </p>
            <div className="portfolio-logos">
              {/* Image 1 */}
              <div className="portfolio-logo-item">
                <a href="https://www.playsy.com/" target="_blank" rel="noreferrer">
                  <img src="/Playsy-logo.jpg" alt="Playsy" className="portfolio-logo-img" />
                </a>
              </div>

              {/* Image 2 */}
              <div className="portfolio-logo-item">
                <a href="https://vga-events.com/" target="_blank" rel="noreferrer">
                  <img src="/vga-events-logo.jpg" alt="VGA Events" className="portfolio-logo-img" />
                </a>
              </div>

              {/* Image 3 */}
              <div className="portfolio-logo-item">
                <a
                  href="https://vgaholdings.com/wp-content/uploads/2024/09/The-Agency-3-Step-System.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/agency-logo.jpg" alt="The Agency" className="portfolio-logo-img" />
                </a>
              </div>

              {/* Image 4 */}
              <div className="portfolio-logo-item">
                <a href="https://playboxbh.com/" target="_blank" rel="noreferrer">
                  <img src="/Playbox-Logo.jpg" alt="Playbox" className="portfolio-logo-img" />
                </a>
              </div>

              {/* Image 5 (No redirection) */}
              <div className="portfolio-logo-item">
                <img src="/metakid-logo.jpg" alt="Metakid" className="portfolio-logo-img" />
              </div>

              {/* Image 6 */}
              <div className="portfolio-logo-item">
                <a
                  href="https://vgaholdings.com/wp-content/uploads/2024/09/MoneyTree_2024.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/Moneytree_logo.png" alt="MoneyTree" className="portfolio-logo-img" />
                </a>
              </div>
            </div>

            <div className="wd-progress portfolio-progress">
              <div className="progress-bar-container">
                <div className="progress-bar-label">
                  <span className="progress-bar-title">Investment Portfolio</span>
                  <span className="progress-bar-percentage">20%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: "20%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section page-section section-odd" data-anchor="services">
          <div className="services-container">
            <h2 className="services-heading">
              Our Services
            </h2>
            <p className="services-intro">
              We carry your energy in safe, reliable and responsible ways. We are committed to the communities to
              which we serve on land and sea. We are part of those communities and as such, we fulfil our obligations
              to protect and vouch safe all people, all wildlife and our globally shared environment.
            </p>

            <div className="services-grid">
              {/* Analytics */}
              <div className="service-item reveal delay-100">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                </div>
                <h3 className="service-title">ANALYTICS</h3>
                <p className="service-desc">
                  Involves sifting through massive data sets to discover, interpret, and share new insights and knowledge.
                </p>
              </div>

              {/* Design */}
              <div className="service-item reveal delay-200">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h3 className="service-title">DESIGN</h3>
                <p className="service-desc">
                  The process of envisioning and planning the creation of interactive and safe systems.
                </p>
              </div>

              {/* Consulting */}
              <div className="service-item reveal delay-300">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <h3 className="service-title">CONSULTING</h3>
                <p className="service-desc">
                  Offering advice and our expertise to client organisations to help them improve their business performance.
                </p>
              </div>

              {/* Fair Profits */}
              <div className="service-item reveal delay-400">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="service-title">FAIR PROFITS</h3>
                <p className="service-desc">
                  We grow businesses to profit in fair and sustainable ways.
                </p>
              </div>

              {/* Best Practice */}
              <div className="service-item reveal delay-500">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="service-title">BEST PRACTICE</h3>
                <p className="service-desc">
                  Is within our DNA in every thing we say and make.
                </p>
              </div>

              {/* Implementation */}
              <div className="service-item reveal delay-600">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="service-title">IMPLEMENTATION</h3>
                <p className="service-desc">
                  Having the right integrated services resources in putting a decision or plan into effect.
                </p>
              </div>

              {/* Enabling Partners */}
              <div className="service-item reveal delay-700">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="service-title">ENABLING PARTNERS</h3>
                <p className="service-desc">
                  We join hands for JVs, licensing, acquisitions and more.
                </p>
              </div>

              {/* Adding Value */}
              <div className="service-item reveal delay-800">
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                </div>
                <h3 className="service-title">ADDING VALUE</h3>
                <p className="service-desc">
                  To stakeholders, communities and the families that rely on us.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="news" className="section page-section section-even" data-anchor="news">
          <div className="news-container">
            <h2 className="news-heading">
              Latest news
            </h2>
            <div className="news-carousel-container">
              <div className="news-carousel-viewport">
                <div
                  className="news-carousel-track"
                  style={{ transform: `translateX(-${newsIndex * (100 / 3)}%)` }}
                >
                  {newsItems.map((item) => (
                    <article key={item.id} className="news-card">
                      <div className="news-thumb">
                        <img src={item.image} alt={item.title} className="news-image" />
                      </div>
                      <div className="news-body">
                        <h3 className="news-title">{item.title}</h3>
                        <p className="news-excerpt">
                          {item.text}
                        </p>
                        <div className="news-meta">
                          <button
                            className="news-cta"
                            onClick={() => window.open(item.link, "_blank")}
                          >
                            READ MORE
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              {newsIndex > 0 && (
                <button className="carousel-nav-btn prev-btn" onClick={handleNewsPrev} aria-label="Previous News">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
              )}
              {newsIndex < newsItems.length - 3 && (
                <button className="carousel-nav-btn next-btn" onClick={handleNewsNext} aria-label="Next News">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              )}
            </div>
          </div>
        </section>

        <section id="clients" className="section page-section section-odd reveal" data-anchor="clients">
          <div className="clients-container">
            <h2 className="clients-heading">
              Meet Our Clients
            </h2>

            <div className="clients-scroll-wrapper">
              {/* First Row - Left to Right */}
              <div className="marquee-row marquee-left">
                <div className="marquee-content">
                  {[...Array(2)].map((_, i) => (
                    <React.Fragment key={i}>
                      <div className="client-logo-item"><img src="/ADNOC.png" alt="ADNOC" /></div>
                      <div className="client-logo-item"><img src="/Bapco.jpg" alt="Bapco" /></div>
                      <div className="client-logo-item"><img src="/GALFAR.png" alt="GALFAR" /></div>
                      <div className="client-logo-item"><img src="/PDO.png" alt="PDO" /></div>
                      <div className="client-logo-item"><img src="/TENARIS.png" alt="TENARIS" /></div>
                      <div className="client-logo-item"><img src="/RAFCO.png" alt="RAFCO" /></div>
                      <div className="client-logo-item"><img src="/OXY.png" alt="OXY" /></div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Second Row - Right to Left */}
              <div className="marquee-row marquee-right">
                <div className="marquee-content">
                  {[...Array(2)].map((_, i) => (
                    <React.Fragment key={i}>
                      <div className="client-logo-item"><img src="/ADNOC.png" alt="ADNOC" /></div>
                      <div className="client-logo-item"><img src="/Bapco.jpg" alt="Bapco" /></div>
                      <div className="client-logo-item"><img src="/GALFAR.png" alt="GALFAR" /></div>
                      <div className="client-logo-item"><img src="/PDO.png" alt="PDO" /></div>
                      <div className="client-logo-item"><img src="/TENARIS.png" alt="TENARIS" /></div>
                      <div className="client-logo-item"><img src="/RAFCO.png" alt="RAFCO" /></div>
                      <div className="client-logo-item"><img src="/OXY.png" alt="OXY" /></div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="leaders" className="section page-section section-even" data-anchor="leaders">
          <div className="leaders-container">
            <h2 className="leaders-heading">
              Meet Our Leaders
            </h2>

            <div className="leaders-grid">
              {/* Terry */}
              <div className="leader-card reveal delay-100">
                <div className="leader-image-wrapper">
                  <img src="/ceo.jpg" alt="Terry Antoniadis" className="leader-image" />
                </div>
                <h3 className="leader-role">CEO</h3>
                <p className="leader-name">Terry Antoniadis</p>

                <div className="leader-social">
                  <a
                    href="https://www.linkedin.com/in/eleftherios-antoniadis-64675820?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Terry Antoniadis LinkedIn"
                    className="leader-linkedin-link"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Yana */}
              <div className="leader-card reveal delay-200">
                <div className="leader-image-wrapper">
                  <img src="/managingdirector.png" alt="Yana Antoniadis" className="leader-image" />
                </div>
                <h3 className="leader-role">Managing Director</h3>
                <p className="leader-name">Yana Antoniadis</p>

                <div className="leader-social">
                  <a
                    href="https://www.linkedin.com/in/yana-antoniadis-a66817148/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Yana Antoniadis LinkedIn"
                    className="leader-linkedin-link"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Brett */}
              <div className="leader-card reveal delay-300">
                <div className="leader-image-wrapper">
                  <img src="/compliancedirector.png" alt="Brett Paul Maclagan" className="leader-image" />
                </div>
                <h3 className="leader-role">Compliance Director</h3>
                <p className="leader-name">Brett Paul Maclagan</p>

                <div className="leader-social">
                  <a
                    href="https://www.linkedin.com/in/brett-maclagan-b250975/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Brett Paul Maclagan LinkedIn"
                    className="leader-linkedin-link"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>


        <section id="inspiration" className="section page-section full-width-section" data-anchor="inspiration">
          <div className="inspiration-container">
            <div className="inspiration-image-panel reveal reveal-left" />
            <div className="inspiration-content reveal reveal-right">
              <div className="inspiration-inner">
                <svg className="inspiration-icon" viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.2" fill="none">
                  <path d="M18.18 8.64a5.13 5.13 0 0 0-4.64 3.36L12 15l-1.54-3A5.13 5.13 0 0 0 5.82 8.64 5.36 5.36 0 0 0 0 14a5.36 5.36 0 0 0 5.82 5.36 5.13 5.13 0 0 0 4.64-3.36L12 13l1.54 3a5.13 5.13 0 0 0 4.64 3.36A5.36 5.36 0 0 0 24 14a5.36 5.36 0 0 0-5.82-5.36z" />
                </svg>
                <p className="inspiration-quote">
                  Don't get wrapped up in an infinite loop. Life is short so do not waste it,
                  live it, breathe it, love it. Don't be scared to fail as failure will only
                  make you stronger.
                </p>
                <p className="inspiration-signature">Terry Antoniadis</p>
              </div>
            </div>
          </div>
        </section>

        <section id="why-choose-us" className="section page-section section-odd reveal" data-anchor="why-choose-us">
          <div className="wcu-container">
            <h2 className="wcu-heading">WHY CHOOSE US?</h2>
            <div className="wcu-grid">
              {/* Item 1: Timeline Recovery */}
              <div className="wcu-item reveal delay-100">
                <div className="wcu-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="50" height="50" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="wcu-title">PROJECT TIMELINE RECOVERY</h3>
                <p className="wcu-text">
                  We have performed countless project recovery missions whereby conventional welding has failed to deliver pipelines to agreed project deadlines. How about 25-km of 12-inch carbon steel with 47 expansion loops and 12 major road crossings? Timeline – 16 days after two days of mobilization.
                </p>
              </div>

              {/* Item 2: Oil Production Acceleration */}
              <div className="wcu-item reveal delay-200">
                <div className="wcu-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="50" height="50" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="wcu-title">OIL PRODUCTION ACCELERATION</h3>
                <p className="wcu-text">
                  Many national economies and global Oil & Gas operators are dependent on accelerated production volumes in order to maintain margin over and above their fixed operating costs. Through its fast pipeline construction, Stealth-Lock is an important partner to increasing volume production ready for export.
                </p>
              </div>

              {/* Item 3: Faster Flow-line Development */}
              <div className="wcu-item reveal delay-300">
                <div className="wcu-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="50" height="50" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h3 className="wcu-title">FASTER FLOW-LINE DEVELOPMENT</h3>
                <p className="wcu-text">
                  If you consider that with welding, it might take a four-year contract to complete a gathering network comprising of over 300 hook ups. Then, consider Stealth-Lock that performed its scope in 14 months! Substantial operational cost savings, not to mention the hydrocarbon production brought forward.
                </p>
              </div>

              {/* Item 4: Project & Programme Management */}
              <div className="wcu-item reveal delay-400">
                <div className="wcu-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="50" height="50" stroke="currentColor" strokeWidth="1.5" fill="none">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="wcu-title">PROJECT & PROGRAMME MANAGEMENT</h3>
                <p className="wcu-text">
                  We are a group of multi-skilled and diverse business advisors experienced in global markets, specifically the Middle East. Our practitioners have worked in the United States, Europe, and across the Middle East in Finance/Banking, Oil, Gas & Energy, Transaction Advisory, Process Improvement and Project & Programme Management.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="stealth-video" className="section page-section section-even reveal" data-anchor="stealth-lock">
          <div className="stealth-video-container">
            <div className="stealth-card">
              <div className="stealth-image" />
              <div className="stealth-content">
                <h3 className="stealth-title">
                  Stealth-Lock - The fastest mechanical pipeline in the world
                </h3>
                <button
                  className="stealth-play-btn"
                  onClick={() => setVideoModalOpen(true)}
                  aria-label="Play Video"
                >
                  <div className="youtube-icon-shape">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </div>
                  <span className="youtube-label">Youtube</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section page-section section-dark reveal" data-anchor="contact">
          <div className="contact-container">
            <h2 className="contact-heading-hello">
              Say hello
            </h2>

            <div className="contact-grid">
              {/* Phone */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1" fill="none">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3 className="contact-label">Switchboard</h3>
                <p className="contact-info">(+973) 17005357</p>
              </div>

              {/* Address */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                {/* No label for address as per typical design, or maybe empty */}
                <p className="contact-info address-text">
                  Mandarin Tower, Office 101, 10th Floor, Road 3615, Block
                  <br />
                  436, Building 681, Al Seef, Kingdom Of Bahrain.
                </p>
              </div>

              {/* Email */}
              <div className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h3 className="contact-label">Email</h3>
                <p className="contact-info">info@vgaholdings.com</p>
              </div>
            </div>

            <footer className="site-footer">
              <p>&copy;Copyright VGA Holdings 2024. Design by <span style={{ opacity: 0.6 }}>VGA</span></p>
              <button
                className="scroll-top-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll to top"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </footer>
          </div>
        </section>
      </main>

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="video-modal-overlay" onClick={() => setVideoModalOpen(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-modal-close"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Close Video"
            >
              ×
            </button>
            <div className="video-wrapper">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/jvobKDCtljA?autoplay=1"
                title="Stealth-Lock Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
