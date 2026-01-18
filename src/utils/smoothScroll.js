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

export function scrollToId(id, opts = {}) {
  const el = document.getElementById(id);
  if (!el) return Promise.reject(new Error('element not found'));

  // Home section always scrolls to the very top (fixed 0)
  if (id === 'home') {
    return animateScrollTo(0, opts);
  }

  // For interior sections, use the "shrunk" header height (78px) as the consistent offset.
  // This prevents the gap caused by the header shrinking from 120px during scroll.
  const SHRUNK_HEADER_HEIGHT = 78;

  // Account for specialized animations
  let specializedOffset = 0;
  if (id === 'about') {
    // The about card "rises" 300px into the Hero space
    specializedOffset -= 300;
  }

  // Check if #main-content-flow has the pull-up class active
  const mainContentFlow = document.getElementById('main-content-flow');
  const isPulledUp = mainContentFlow && mainContentFlow.classList.contains('pull-up');

  if (isPulledUp) {
    // Check if the target element is inside #main-content-flow
    const isInsideMainFlow = mainContentFlow.contains(el);

    // Check if the target element comes after #main-content-flow in the DOM
    const isAfterMainFlow = !isInsideMainFlow &&
      mainContentFlow.compareDocumentPosition(el) === Node.DOCUMENT_POSITION_FOLLOWING;

    // If the element is inside or comes after #main-content-flow, and pull-up is active,
    // we need to add 300px because the pull-up will be removed as we scroll away from About
    if (isInsideMainFlow || isAfterMainFlow) {
      specializedOffset += 300;
    }
  }

  const target = Math.round(el.getBoundingClientRect().top + window.scrollY - SHRUNK_HEADER_HEIGHT + specializedOffset);

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    window.scrollTo(0, target);
    return Promise.resolve();
  }

  return animateScrollTo(target, opts);
}
