/* =============================================
   DAPUR CEMILAN - JavaScript Interaktif
   Fitur: Navbar scroll, Hamburger menu,
          Tambah ke keranjang, Notifikasi toast,
          Scroll animations, Smooth scroll
   ============================================= */

// ========== INISIALISASI ==========
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburgerMenu();
  initSmoothScroll();
  initScrollAnimations();
  initProductInteractions();
  initCartFloat();
});

// ========== DATA KERANJANG ==========
// Menyimpan data keranjang belanja secara sederhana
let cart = [];
let cartCount = 0;

// ========== NAVBAR SCROLL EFFECT ==========
// Mengubah tampilan navbar saat halaman di-scroll
function initNavbar() {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Set active link berdasarkan posisi scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ========== HAMBURGER MENU (MOBILE) ==========
// Toggle menu navigasi di perangkat mobile
function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  const links = document.querySelectorAll('.nav-links a');

  if (!hamburger) return;

  // Toggle menu saat hamburger diklik
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Tutup menu saat link diklik
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Tutup menu saat overlay diklik
  if (overlay) {
    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

// ========== SMOOTH SCROLL ==========
// Scroll halus saat klik link navigasi
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70; // Offset untuk navbar fixed
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========== SCROLL ANIMATIONS ==========
// Efek fade-in saat elemen muncul di viewport
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Tambahkan delay bertahap untuk grid items
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  }, {
    threshold: 0.1,    // Trigger saat 10% elemen terlihat
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ========== INTERAKSI PRODUK ==========
// Menangani semua interaksi pada card produk
function initProductInteractions() {
  // Event listener untuk tombol "Tambah ke Keranjang"
  document.querySelectorAll('.btn-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.product-card');
      const productName = card.querySelector('.product-name').textContent;
      const productPrice = card.querySelector('.product-price').childNodes[0].textContent;

      // Tambahkan ke keranjang
      addToCart(productName, productPrice);

      // Animasi tombol saat diklik
      this.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

  // Event listener untuk tombol love/favorit
  document.querySelectorAll('.product-love').forEach(btn => {
    btn.addEventListener('click', function () {
      this.classList.toggle('liked');

      if (this.classList.contains('liked')) {
        this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        showToast('<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', 'Ditambahkan ke Favorit!', 'Produk telah disimpan ke daftar favorit');
      } else {
        this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      }
    });
  });

  // Event listener untuk filter kategori
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Animasi re-render produk
      const cards = document.querySelectorAll('.product-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100 + index * 80);
      });
    });
  });
}

// ========== FUNGSI KERANJANG ==========
// Menambahkan produk ke keranjang dan menampilkan notifikasi
function addToCart(name, price) {
  cart.push({ name, price });
  cartCount++;

  // Update badge keranjang
  updateCartBadge();

  // Tampilkan notifikasi toast
  showToast('<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>', 'Ditambahkan ke Keranjang!', `${name} — ${price}`);
}

// Update jumlah item di floating cart badge
function updateCartBadge() {
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    countEl.textContent = cartCount;

    // Animasi bump
    countEl.classList.add('bump');
    setTimeout(() => countEl.classList.remove('bump'), 300);
  }
}

// ========== FLOATING CART ==========
// Inisialisasi tombol keranjang mengambang
function initCartFloat() {
  const cartFloat = document.querySelector('.cart-float');

  if (cartFloat) {
    cartFloat.addEventListener('click', () => {
      if (cartCount === 0) {
        showToast('<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>', 'Keranjang Kosong', 'Yuk, tambahkan jajanan favoritmu!');
      } else {
        // Format daftar pesanan untuk dikirim via WhatsApp
        let message = 'Halo, Faida Shop!\nSaya ingin memesan:\n\n';
        cart.forEach((item, index) => {
          message += `${index + 1}. ${item.name} - ${item.price}\n`;
        });
        message += `\nTotal item: ${cartCount}\nTerima kasih!`;

        // Buka WhatsApp dengan pesan pesanan
        const waUrl = `https://wa.me/6287739227477?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
      }
    });
  }
}

// ========== NOTIFIKASI TOAST ==========
// Menampilkan notifikasi toast di pojok kanan atas
function showToast(icon, title, message) {
  const container = document.querySelector('.toast-container');

  // Buat elemen toast baru
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="closeToast(this)">✕</button>
  `;

  container.appendChild(toast);

  // Auto-close setelah 3 detik
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('closing');
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
}

// Menutup toast secara manual
function closeToast(btn) {
  const toast = btn.closest('.toast');
  toast.classList.add('closing');
  setTimeout(() => toast.remove(), 300);
}

// ========== PARALLAX RINGAN ==========
// Efek parallax sederhana untuk hero section
window.addEventListener('scroll', () => {
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
    }
  }
});
