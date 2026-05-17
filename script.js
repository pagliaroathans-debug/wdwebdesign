/* ============================================================
   WD WEB SOLUTIONS — script.js
   ============================================================ */

/* --- NAV: Scroll frosted glass effect --- */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });


/* --- NAV: Mobile burger menu --- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* --- SCROLL REVEAL --- */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


/* --- HERO STAT COUNTERS --- */
const counters = document.querySelectorAll('.hero__stat-num');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}


/* --- CONTACT FORM (Formspree) --- */
const contactForm = document.getElementById('contactForm');

// ✏️  Replace YOUR_FORM_ID with the ID from your Formspree dashboard
// Example: if your endpoint is https://formspree.io/f/abcd1234, use "abcd1234"
const FORMSPREE_ID = 'https://formspree.io/f/mykvgppn';

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const btnText = btn.querySelector('span');
  const originalText = btnText.textContent;

  // Loading state
  btnText.textContent = 'Sending…';
  btn.disabled = true;

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      // Success
      btnText.textContent = '✓ Message Sent!';
      btn.style.background = '#16a34a';
      contactForm.reset();

      setTimeout(() => {
        btnText.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);

    } else {
      // Server error
      const data = await response.json();
      const errorMsg = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong.';
      btnText.textContent = '✗ ' + errorMsg;
      btn.style.background = '#dc2626';

      setTimeout(() => {
        btnText.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }

  } catch (err) {
    // Network error
    btnText.textContent = '✗ Network error. Try again.';
    btn.style.background = '#dc2626';

    setTimeout(() => {
      btnText.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }
});


/* --- SMOOTH SCROLL for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = nav.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});
