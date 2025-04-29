// تحميل العربة من localStorage وعرضها
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartContainer = document.querySelector('.cart-items');
let totalPriceElement = document.getElementById('total-price');

// فحص وجود "admin" في URL
if (window.location.href.includes("admin")) {
  // تغيير محتوى الصفحة إلى محتوى محظور
  document.body.innerHTML = `
    <h1>🚫 لا تعبث معي 🚫</h1>
    <img src="https://4kwallpapers.com/images/wallpapers/anonymous-hooded-5120x2880-14722.jpg" alt="Hacker Image" />
    <audio autoplay>
      <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3" />
      متصفحك لا يدعم تشغيل الصوت.
    </audio>
  `;

  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.backgroundColor = 'black';
  document.body.style.color = 'red';
  document.body.style.fontFamily = 'monospace';
  document.body.style.textAlign = 'center';

  const h1 = document.querySelector('h1');
  h1.style.fontSize = '3rem';
  h1.style.marginTop = '2rem';
  h1.style.animation = 'blink 1s infinite';

  const img = document.querySelector('img');
  img.style.width = '60%';
  img.style.maxWidth = '600px';
  img.style.marginTop = '20px';
  img.style.border = '5px solid red';
  img.style.animation = 'shake 0.5s infinite';

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      75% { transform: translateX(-10px); }
      100% { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
} else {
  // عرض المنتجات في السلة
  function displayCart() {
    if (!cartContainer || !totalPriceElement) return;
    cartContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <p>${item.name} - ${item.price} ريال</p>
        <button class="remove-item" data-index="${index}">حذف</button>
      `;
      cartContainer.appendChild(div);
      totalPrice += parseFloat(item.price);
    });

    totalPriceElement.innerText = totalPrice.toFixed(2);
  }

  // تحديث عدد المنتجات في السلة
  function updateCartCount() {
    const cartLink = document.querySelector('.nav a[href="cart.html"]');
    if (cartLink) {
      cartLink.innerHTML = `عربة التسوق (${cart.length})`;
    }
  }

  // إضافة منتج عند الضغط على "أضف إلى السلة"
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      const description = btn.dataset.description;

      const product = { name, price, description };
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();

      // في حالة كنت داخل صفحة السلة، يحدث العرض
      if (window.location.href.includes("cart.html")) {
        displayCart();
      }
    });
  });

  // حذف منتج من السلة
  cartContainer?.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      displayCart();
    }
  });

  // التعامل مع الدفع
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    document.getElementById('payment-section').style.display = 'block';
  });

  // إتمام الدفع
  document.getElementById('payment-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('تم الدفع بنجاح!');

    // مسح المنتجات من السلة بعد الدفع
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // العودة للصفحة الرئيسية بعد إتمام الدفع
    window.location.href = "index.html"; // العودة إلى الصفحة الرئيسية
  });

  // ضبط رابط زر "الرئيسية"
  document.addEventListener("DOMContentLoaded", () => {
    const homeLink = document.querySelector('.nav a[href="#"][id="home-link"]');
    if (homeLink) {
      const isInSubfolder = window.location.pathname.includes("cart");
      homeLink.setAttribute("href", isInSubfolder ? "../index.html" : "index.html");
    }
  });

  // تشغيل عند تحميل الصفحة
  updateCartCount();
  displayCart();
}
