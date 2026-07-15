/* ==========================================================================
   Reach Skyline - Interactive Logic (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set footer copyright year dynamically
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Page Loader (Quick Load)
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('hidden');
    }, 150);
  }

  // 15. Full-Screen Interactive Ambient Starfield
  const bgCanvas = document.getElementById('bgCanvas');
  if (bgCanvas) {
    const bgCtx = bgCanvas.getContext('2d');
    let stars = [];
    let bgMouse = { x: null, y: null, radius: 150 };
    
    function resizeBgCanvas() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
    resizeBgCanvas();
    window.addEventListener('resize', resizeBgCanvas);
    
    document.body.addEventListener('mousemove', (e) => {
      bgMouse.x = e.clientX;
      bgMouse.y = e.clientY;
    });
    
    document.body.addEventListener('mouseleave', () => {
      bgMouse.x = null;
      bgMouse.y = null;
    });
    
    class Star {
      constructor() {
        this.reset();
        this.y = Math.random() * bgCanvas.height;
      }
      
      reset() {
        this.x = Math.random() * bgCanvas.width;
        this.y = -10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.alpha = Math.random() * 0.4 + 0.2;
        this.baseColor = Math.random() < 0.5 ? '204, 164, 59' : '229, 193, 88';
      }
      
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        if (bgMouse.x !== null && bgMouse.y !== null) {
          const dx = this.x - bgMouse.x;
          const dy = this.y - bgMouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < bgMouse.radius) {
            const push = (bgMouse.radius - dist) * 0.01;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * push;
            this.y += Math.sin(angle) * push;
          }
        }
        
        if (this.y > bgCanvas.height || this.x < 0 || this.x > bgCanvas.width) {
          this.reset();
        }
      }
      
      draw() {
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(${this.baseColor}, ${this.alpha})`;
        bgCtx.fill();
      }
    }
    
    const starCount = 60;
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
    
    function animateBg() {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      requestAnimationFrame(animateBg);
    }
    
    animateBg();
  }

  // 3. Navigation Controls
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navDrawer = document.getElementById('navDrawer');
  const navOverlay = document.getElementById('navOverlay');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTop = document.getElementById('backToTop');

  // Shrink Nav & Scroll Progress
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Scroll progress bar
    if (docHeight > 0) {
      const scrollPct = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPct}%`;
    }

    // Shrink navbar
    if (scrollTop > 50) {
      navbar.classList.add('shrunk');
    } else {
      navbar.classList.remove('shrunk');
    }

    // Back to top visibility
    if (scrollTop > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  // Mobile Drawer Toggle
  function toggleMenu() {
    menuToggle.classList.toggle('active');
    
    // Animate hamburger lines
    const spans = menuToggle.querySelectorAll('span');
    if (menuToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      navDrawer.classList.add('open');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scroll
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
      navDrawer.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  menuToggle.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', toggleMenu);

  // Close drawer on click links
  const drawerLinks = document.querySelectorAll('.drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu();
    });
  });

  // Smooth scroll to anchors
  const allLinks = document.querySelectorAll('a[href^="#"]');
  allLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Compensate for navbar height
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 4. Desktop Mouse light effect in Hero
  const heroSection = document.getElementById('home');
  const mouseLight = document.getElementById('mouseLight');

  if (heroSection && mouseLight) {
    heroSection.addEventListener('mousemove', (e) => {
      if (window.innerWidth >= 1024) {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseLight.style.setProperty('--x', `${x}px`);
        mouseLight.style.setProperty('--y', `${y}px`);
      }
    });
  }

  // 5. Card dynamic 3D Tilt + Glow borders
  const tiltCards = document.querySelectorAll('.service-card, .portfolio-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      // Pass coordinates for glow borders
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (window.innerWidth >= 1024) {
        const width = rect.width;
        const height = rect.height;
        const mouseXPct = (x / width) - 0.5; // range -0.5 to 0.5
        const mouseYPct = (y / height) - 0.5; // range -0.5 to 0.5

        // Max rotation bounds
        const maxRotation = 8; // degrees
        const rotX = -mouseYPct * maxRotation;
        const rotY = mouseXPct * maxRotation;

        const cardContent = card.querySelector('.glass-card') || card.querySelector('.portfolio-img-box');
        if (cardContent) {
          cardContent.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
        }
      }
    });

    card.addEventListener('mouseleave', () => {
      const cardContent = card.querySelector('.glass-card') || card.querySelector('.portfolio-img-box');
      if (cardContent) {
        cardContent.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });
  });

  // 6. Click Ripple Effect on Action Buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Remove any leftover ripples
      const existingRipples = this.querySelectorAll('.ripple');
      existingRipples.forEach(r => r.remove());

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size/2;
      const y = e.clientY - rect.top - size/2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      // Clean up after animation finishes
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  });

  // 7. Desktop Magnetic Buttons
  const magneticButtons = document.querySelectorAll('.btn-magnetic');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      if (window.innerWidth >= 1024) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Pull button slightly towards mouse (e.g. 35% of vector)
        this.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      }
    });

    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translate(0px, 0px)';
    });
  });

  // 8. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal-fade-up, .split-text-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Stop observing once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 9. Stats Counter Count-Up Animation
  const statNumbers = document.querySelectorAll('.stat-num');
  let counterStarted = false;

  function runCounter() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.textContent.includes('+') ? '+' : '';
      let current = 0;
      const duration = 2000; // ms
      const steps = 60;
      const stepTime = duration / steps;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target + (target === 8 ? '+' : '+');
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current) + '+';
        }
      }, stepTime);
    });
  }

  const counterSection = document.getElementById('home');
  if (counterSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
          counterStarted = true;
          setTimeout(runCounter, 400);
          counterObserver.unobserve(counterSection);
        }
      });
    }, { threshold: 0.1 });
    counterObserver.observe(counterSection);
  }

  // 10. Process Timeline Line Progress
  const processTimeline = document.querySelector('.process-timeline');
  const processSteps = document.querySelectorAll('.process-step');
  const processLine = document.getElementById('processLine');

  if (processTimeline && processLine && processSteps.length > 0) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.45,
      rootMargin: '0px 0px -80px 0px'
    });

    processSteps.forEach(step => stepObserver.observe(step));

    // Smooth scroll-linked progress calculation for line height
    window.addEventListener('scroll', () => {
      const rect = processTimeline.getBoundingClientRect();
      const timelineHeight = rect.height;
      const timelineTop = rect.top;
      
      const triggerPoint = window.innerHeight * 0.55;
      const scrolled = triggerPoint - timelineTop;
      
      let progress = 0;
      if (scrolled > 0) {
        progress = (scrolled / timelineHeight) * 100;
      }
      
      progress = Math.max(0, Math.min(100, progress));
      processLine.style.height = `${progress}%`;
    });
  }

  // 11. Active Nav Highlighter in Navbar
  const navSections = document.querySelectorAll('header, section');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (!id) return;
        
        const hasNavLink = Array.from(navLinks).some(link => link.getAttribute('href') === `#${id}`);
        if (!hasNavLink) return;

        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -30% 0px'
  });

  navSections.forEach(sec => navObserver.observe(sec));

  // 12. Portfolio Showcase Filter logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Force a slight trigger for transition entrance
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // match fade duration
        }
      });
    });
  });

  // 14. Luxury SaaS Floating Dust Particles Canvas
  const particlesCanvas = document.getElementById('particlesCanvas');
  
  if (particlesCanvas) {
    const pCtx = particlesCanvas.getContext('2d');
    let particles = [];
    
    function resizeParticlesCanvas() {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    }
    resizeParticlesCanvas();
    window.addEventListener('resize', resizeParticlesCanvas);
    
    class DustParticle {
      constructor() {
        this.reset();
        this.y = Math.random() * particlesCanvas.height;
      }
      
      reset() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = particlesCanvas.height + 10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.3 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.alpha = Math.random() * 0.3 + 0.1;
        this.color = '204, 164, 59';
      }
      
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        
        if (this.y < -10 || this.x < -10 || this.x > particlesCanvas.width + 10) {
          this.reset();
        }
      }
      
      draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        pCtx.fill();
      }
    }
    
    const dustCount = 45;
    for (let i = 0; i < dustCount; i++) {
      particles.push(new DustParticle());
    }
    
    function animateParticles() {
      pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 16. 3D Logo Centerpiece with continuous rotation
  const logo3DContainer = document.getElementById('logo3DContainer');
  const pedestalShadow = document.getElementById('pedestalShadow');

  if (logo3DContainer) {
    let currentAngleY = 0;
    
    // --- Layered Extrusion Generation (Direct to Container) ---
    const thickness = 30; // 30px thick
    const startZ = -15; // From -15 to +15
    const layers = 120; // 120 layers for an impenetrable solid block
    for (let i = 0; i <= layers; i++) {
      const layer = document.createElement('div');
      layer.className = 'side-ext';
      const currentZ = startZ + (i * (thickness / layers));
      layer.style.transform = `translateZ(${currentZ}px) scale(1.03)`;
      logo3DContainer.insertBefore(layer, logo3DContainer.children[1]); // insert after front face
    }
    // --------------------------------------

    function updateLogoRotation() {
      // Continuous slow Y-axis spin: completes 1 rotation every ~11 seconds (360 degrees / (11 * 60) frames = ~0.54 degrees/frame)
      currentAngleY = (currentAngleY + 0.54) % 360;
      
      const floatOffset = Math.sin(Date.now() * 0.0012) * 16;
      
      // Update floor shadow scale and opacity dynamically based on floatOffset
      if (pedestalShadow) {
        const shadowScale = 1.0 - (floatOffset + 16) * 0.005;
        const shadowOpacity = 0.9 - (floatOffset + 16) * 0.01;
        pedestalShadow.style.transform = `translate(-50%, -50%) rotateX(70deg) scale(${shadowScale})`;
        pedestalShadow.style.opacity = shadowOpacity;
      }
      
      // Apply centered 3D Y-rotation and float offsets (no wobble X/Z tilts)
      logo3DContainer.style.transform = `
        translate3d(0, ${floatOffset}px, 0)
        rotateY(${currentAngleY}deg)
      `;
      
      requestAnimationFrame(updateLogoRotation);
    }
    
    updateLogoRotation();
  }

  // 19. Execution Pipeline Interactive Engine
  const pipelineNodes = document.querySelectorAll('.orbit-node');
  const pipelineCards = document.querySelectorAll('.pipeline-card');
  const connectionLines = document.querySelectorAll('.connection-line');
  
  if (pipelineNodes.length && pipelineCards.length) {
    function activateStep(stepNum) {
      pipelineNodes.forEach(node => {
        if (node.getAttribute('data-step') === stepNum) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      });
      
      pipelineCards.forEach(card => {
        if (card.getAttribute('data-step') === stepNum) {
          card.classList.add('active');
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        } else {
          card.classList.remove('active');
        }
      });
      
      connectionLines.forEach(line => {
        if (line.classList.contains(`line-${stepNum}`)) {
          line.classList.add('active');
        } else {
          line.classList.remove('active');
        }
      });
    }
    
    pipelineNodes.forEach(node => {
      const step = node.getAttribute('data-step');
      node.addEventListener('mouseenter', () => activateStep(step));
      node.addEventListener('click', () => activateStep(step));
    });
    
    pipelineCards.forEach(card => {
      const step = card.getAttribute('data-step');
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
      
      card.addEventListener('mouseenter', () => activateStep(step));
      card.addEventListener('click', () => activateStep(step));
    });
  }
  
  // Wave Canvas Background Loop for Pipeline Section
  const waveCanvas = document.getElementById('pipelineWavesCanvas');
  if (waveCanvas) {
    const wCtx = waveCanvas.getContext('2d');
    let wWidth = waveCanvas.width = waveCanvas.parentElement.clientWidth;
    let wHeight = waveCanvas.height = waveCanvas.parentElement.clientHeight;
    
    window.addEventListener('resize', () => {
      if (waveCanvas.parentElement) {
        wWidth = waveCanvas.width = waveCanvas.parentElement.clientWidth;
        wHeight = waveCanvas.height = waveCanvas.parentElement.clientHeight;
      }
    });
    
    let waveOffset = 0;
    
    function drawWaveBackdrop() {
      wCtx.clearRect(0, 0, wWidth, wHeight);
      wCtx.strokeStyle = 'rgba(204, 164, 59, 0.05)';
      wCtx.lineWidth = 1.5;
      
      for (let w = 0; w < 3; w++) {
        wCtx.beginPath();
        const frequency = 0.003 - w * 0.0005;
        const amplitude = 35 + w * 12;
        const yBase = wHeight * 0.4 + w * 80;
        
        for (let x = 0; x < wWidth; x += 5) {
          const y = yBase + Math.sin(x * frequency + waveOffset + w) * amplitude;
          if (x === 0) wCtx.moveTo(x, y);
          else wCtx.lineTo(x, y);
        }
        wCtx.stroke();
      }
      
      waveOffset += 0.008;
      requestAnimationFrame(drawWaveBackdrop);
    }
    drawWaveBackdrop();
  }
  
  // Intersection Observer for Bottom Metrics Counter Count-Up
  const metricsGrid = document.getElementById('pipelineMetricsGrid');
  const counterElements = document.querySelectorAll('.counter-val');
  
  if (metricsGrid && counterElements.length) {
    let triggered = false;
    
    const countUpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();
            
            function count(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              const easeOutQuad = progress * (2 - progress);
              const currentVal = Math.floor(easeOutQuad * target);
              
              counter.textContent = currentVal;
              
              if (progress < 1) {
                requestAnimationFrame(count);
              } else {
                counter.textContent = target;
              }
            }
            requestAnimationFrame(count);
          });
          countUpObserver.unobserve(metricsGrid);
        }
      });
    }, { threshold: 0.15 });
    
    countUpObserver.observe(metricsGrid);
  }

  // 18. About Holographic Card Mouse Interactive 3D Tilt
  const aboutCard = document.getElementById('aboutInteractiveCard');
  const aboutLogo = document.getElementById('aboutLogoWrapper');
  
  if (aboutCard) {
    let targetX = 0;
    let targetY = 0;
    let easeX = 0;
    let easeY = 0;
    
    aboutCard.addEventListener('mousemove', (e) => {
      const rect = aboutCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      targetX = -y * 0.08;
      targetY = x * 0.08;
      
      if (aboutLogo) {
        // Extrude logo badge further on hover and sway
        aboutLogo.style.transform = `translateZ(45px) translateY(${Math.sin(Date.now() * 0.002) * 6}px) rotateY(${-x * 0.03}deg) rotateX(${y * 0.03}deg)`;
      }
    });
    
    aboutCard.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      if (aboutLogo) {
        aboutLogo.style.transform = 'translateZ(10px) translateY(0px)';
      }
    });
    
    function updateAboutCardTilt() {
      easeX += (targetX - easeX) * 0.08;
      easeY += (targetY - easeY) * 0.08;
      
      aboutCard.style.transform = `rotateX(${easeX}deg) rotateY(${easeY}deg)`;
      
      requestAnimationFrame(updateAboutCardTilt);
    }
    
    updateAboutCardTilt();
  }
});

// Interactive Button Glow & Ripple EXTENDED
document.querySelectorAll('.btn, .mega-btn, .service-link, .filter-btn, .portfolio-cta, .insight-link, .newsletter-btn, .back-to-top, .drawer-link').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--x', `${x}px`);
    btn.style.setProperty('--y', `${y}px`);
  });
  
  btn.addEventListener('click', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.classList.add('btn-ripple');
    
    const size = Math.max(btn.clientWidth, btn.clientHeight);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size/2}px`;
    ripple.style.top = `${y - size/2}px`;
    
    btn.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 400);
  });
});
