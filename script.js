// تحميل العربة من localStorage وعرضها
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartContainer = document.querySelector('.cart-items');
let totalPriceElement = document.getElementById('total-price');

// فحص وجود "admin" في URL
if (window.location.href.includes("admin")) {
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
  // عرض المنتجات تلقائياً (مقسم إلى مجموعات كل مجموعة فيها منتجين)
  const products = [
    { name: "عباية بيضاء 1", price: 250, description: "عباية أنيقة", image: "images/abaya1.jpg" },
    { name: "عباية بيضاء 2", price: 270, description: "خامة ناعمة", image: "images/abaya2.jpg" },
    { name: "عباية بيضاء 3", price: 230, description: "عباية راقية", image: "images/abaya3.jpg" },
    { name: "عباية بيضاء 4", price: 260, description: "تفصيل ممتاز", image: "images/abaya4.jpg" },
    // أضف المزيد حسب الحاجة
  ];

  const productsContainer = document.querySelector('.products');
  if (productsContainer) {
    productsContainer.innerHTML = '';

    for (let i = 0; i < products.length; i += 2) {
      const groupDiv = document.createElement('div');
      groupDiv.classList.add('product-group');

      for (let j = i; j < i + 2 && j < products.length; j++) {
        const product = products[j];
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-card');
        productDiv.style.setProperty('--i', j); // للأنيميشن

        productDiv.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>${product.price} ريال</p>
          <button class="btn add-to-cart"
                  data-name="${product.name}"
                  data-price="${product.price}"
                  data-description="${product.description}">أضف إلى السلة</button>
        `;

        groupDiv.appendChild(productDiv);
      }

      productsContainer.appendChild(groupDiv);
    }
  }

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

  // إضافة منتج إلى السلة
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      const btn = e.target;
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      const description = btn.dataset.description;

      const product = { name, price, description };
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();

      if (window.location.href.includes("cart.html")) {
        displayCart();
      }
    }
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

  // إظهار نموذج الدفع
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    document.getElementById('payment-section').style.display = 'block';
  });

  // تنفيذ عملية الدفع
  document.getElementById('payment-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('تم الدفع بنجاح!');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.location.href = "index.html";
  });

  // ضبط رابط زر "الرئيسية"
  document.addEventListener("DOMContentLoaded", () => {
    const homeLink = document.querySelector('.nav a[href="#"][id="home-link"]');
    if (homeLink) {
      const isInSubfolder = window.location.pathname.includes("cart");
      homeLink.setAttribute("href", isInSubfolder ? "../index.html" : "index.html");
    }
  });

  updateCartCount();
  displayCart();

  // التبديل بين اللغات عند الضغط على الزر
  let currentLanguage = 'ar';
  const languageData = {
    ar: {
      home: 'الرئيسية',
      collection: 'المجموعة',
      about: 'عن المتجر',
      cart: 'السلة',
      signin: 'تسجيل الدخول',
      heroTitle: 'عبايات رهام',
      heroDescription: 'تسوق أفضل العبايات بأجمل التصاميم',
      discover: 'اكتشف الآن',
      collectionTitle: 'مجموعة العبايات',
      aboutTitle: 'عن عبايات رهام',
      aboutDescription: 'متجر "عبايات رهام" تأسس ليقدم لكِ أرقى تصاميم العبايات الشرقية.',
      visionTitle: 'رؤيتنا',
      visionDescription: 'أن نصبح الخيار الأول للنساء الباحثات عن الأناقة والجودة.',
      whyUsTitle: 'لماذا نحن؟',
      whyUsList: ['تصاميم حصرية وعصرية.', 'خامات فاخرة مختارة بعناية.', 'خدمة عملاء راقية وتجربة تسوق سلسة.'],
      footerText: '© 2025 عبايات رهام'
    },
    en: {
      home: 'Home',
      collection: 'Collection',
      about: 'About Us',
      cart: 'Cart',
      signin: 'Sign In',
      heroTitle: 'Raham Abayas',
      heroDescription: 'Shop the best abayas with the most beautiful designs',
      discover: 'Discover Now',
      collectionTitle: 'Abaya Collection',
      aboutTitle: 'About Raham Abayas',
      aboutDescription: 'Raham Abayas was established to offer the finest Eastern abaya designs.',
      visionTitle: 'Our Vision',
      visionDescription: 'To become the first choice for women seeking elegance and quality.',
      whyUsTitle: 'Why Us?',
      whyUsList: ['Exclusive and modern designs.', 'Carefully selected luxurious fabrics.', 'Elegant customer service and a smooth shopping experience.'],
      footerText: '© 2025 Raham Abayas'
    }
  };

  document.getElementById('language-toggle').addEventListener('click', () => {
    currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    changeLanguage(currentLanguage);
  });

  function changeLanguage(lang) {
    currentLanguage = lang;
    document.querySelector('.home-link').innerText = languageData[lang].home;
    document.querySelector('.collection-link').innerText = languageData[lang].collection;
    document.querySelector('.about-link').innerText = languageData[lang].about;
    document.querySelector('.cart-link').innerText = languageData[lang].cart;
    document.querySelector('.signin-link').innerText = languageData[lang].signin;
    document.querySelector('.hero-title').innerText = languageData[lang].heroTitle;
    document.querySelector('.hero-description').innerText = languageData[lang].heroDescription;
    document.querySelector('.hero-btn').innerText = languageData[lang].discover;
    document.querySelector('.collection-title').innerText = languageData[lang].collectionTitle;
    document.querySelector('.about-title').innerText = languageData[lang].aboutTitle;
    document.querySelector('.about-description').innerText = languageData[lang].aboutDescription;
    document.querySelector('.vision-title').innerText = languageData[lang].visionTitle;
    document.querySelector('.vision-description').innerText = languageData[lang].visionDescription;
    document.querySelector('.why-us-title').innerText = languageData[lang].whyUsTitle;
    document.querySelector('.why-us-list').innerHTML = languageData[lang].whyUsList.map(item => `<li>${item}</li>`).join('');
    document.querySelector('.footer-text').innerText = languageData[lang].footerText;
  }
}
