// Utility: animated scroll to an element id with header offset, easing and cancel-on-user-interaction

// Professional "wow" easing function - easeInOutExpo for smooth, gradual motion
export function easeInOutExpo(t) {
  if (t === 0 || t === 1) return t;
  return t < 0.5
    ? Math.pow(2, 16 * t - 10) / 2 // softened exponent to avoid harsh start
    : (2 - Math.pow(2, -16 * t + 10)) / 2;
}

// Enhanced cubic with slight overshoot for that "wow" bounce effect
export function easeOutCubicBounce(t) {
  const eased = 1 - Math.pow(1 - t, 3);
  // Add subtle overshoot at the end for extra polish
  if (t > 0.9) {
    const overshoot = (t - 0.9) * 10;
    return eased + Math.sin(overshoot * Math.PI) * 0.02;
  }
  return eased;
}

// Original cubic easing (kept for compatibility)
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function animateScrollTo(
  targetY,
  {
    duration = 1300,
    easing = easeInOutExpo, // softer, smoother default easing
  } = {}
) {
  return new Promise((resolve, reject) => {
    const startY = window.scrollY || window.pageYOffset;
    const delta = targetY - startY;

    // Adjust duration based on scroll distance for consistent feel (but keep min fairly high)
    const distance = Math.abs(delta);
    const adjustedDuration = Math.min(Math.max(distance * 0.5 + 700, 900), 1700);
    const finalDuration = duration === 1300 ? adjustedDuration : duration;

    const startTime = performance.now();
    let rafId = null;
    let canceled = false;

    const onUser = () => {
      canceled = true;
      if (rafId) cancelAnimationFrame(rafId);
      cleanup();
      reject(new Error('scroll canceled'));
    };

    function cleanup() {
      window.removeEventListener('wheel', onUser, { passive: true });
      window.removeEventListener('touchstart', onUser, { passive: true });
      window.removeEventListener('keydown', onUser, { passive: true });
    }

    window.addEventListener('wheel', onUser, { passive: true });
    window.addEventListener('touchstart', onUser, { passive: true });
    window.addEventListener('keydown', onUser, { passive: true });

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, Math.max(0, elapsed / finalDuration));
      const eased = easing(t);
      window.scrollTo(0, Math.round(startY + delta * eased));
      if (t < 1 && !canceled) {
        rafId = requestAnimationFrame(step);
      } else if (!canceled) {
        cleanup();
        resolve();
      }
    }

    rafId = requestAnimationFrame(step);
  });
}

// Read header offset from CSS variable (set by Header ResizeObserver) so scroll accounts for actual header height on all breakpoints (desktop, tablet, mobile).
// function getHeaderOffset() {
//   const px = getComputedStyle(document.documentElement).getPropertyValue('--header-offset').trim();
//   const num = parseInt(px, 10);
//   return Number.isFinite(num) ? num : 80;
// }

export function scrollToId(id, opts = {}) {
  const el = document.getElementById(id);
  if (!el) return Promise.reject(new Error('element not found'));

  const useSmooth = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const behavior = useSmooth ? 'smooth' : 'auto';

  // Home section: scroll to top with smooth behavior
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior });
    return Promise.resolve();
  }

  // Sections use scroll-margin-top (CSS) for header offset; native smooth scroll
  el.scrollIntoView({ behavior, block: 'start' });
  return Promise.resolve();
}
