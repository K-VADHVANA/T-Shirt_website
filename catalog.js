const products = [
    { id: 1, name: 'Green Polo', price: 250.00, color: 'green', type: 'polo', gender: 'male', image: 'tshirt1.webp', quantity: 10 },
    { id: 2, name: 'Red V-Neck', price: 300.00, color: 'red', type: 'vneck', gender: 'female', image: 'tshirt1.webp', quantity: 5 },
    { id: 3, name: 'Blue Crewneck', price: 200.00, color: 'blue', type: 'crewneck', gender: 'unisex', image: 'tshirt1.webp', quantity: 8 },
    { id: 3, name: 'Blue v-Neck', price: 350.00, color: 'blue', type: 'crewneck', gender: 'unisex', image: 'tshirt1.webp', quantity: 8 },
  ];
  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    const template = document.getElementById('product-template').content;
  
    products.forEach(product => {
      const clone = template.cloneNode(true);
      clone.querySelector('.card-img-top').src = product.image;
      clone.querySelector('.product-name').textContent = product.name;
      clone.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
      clone.querySelector('.product-attributes').textContent = `${product.color} | ${product.type} | ${product.gender}`;
      clone.querySelector('.add-to-cart').onclick = () => addToCart(product.id);
      productList.appendChild(clone);
    });
  }
  
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
  
    if (cartItem) {
      if (cartItem.quantity < product.quantity) {
        cartItem.quantity++;
      } else {
        alert('Cannot add more items than available in stock');
        return;
      }
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
  }
  
  function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.reduce((count, item) => count + item.quantity, 0);
  }
  
  function renderCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
  
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - ${item.quantity} x $${item.price.toFixed(2)}`;
      const btn = document.createElement('button');
      btn.textContent = 'Remove';
      btn.onclick = () => removeFromCart(item.id);
      li.appendChild(btn);
      cartItems.appendChild(li);
      total += item.quantity * item.price;
    });
  
    document.getElementById('cart-total').textContent = total.toFixed(2);
  }
  
  function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
      cart.splice(index, 1);
      saveCart();
      updateCartCount();
      renderCart();
    }
  }
  
  function filterProducts() {
    const gender = document.getElementById('filter-gender').value;
    const color = document.getElementById('filter-color').value;
    const type = document.getElementById('filter-type').value;
    const priceMin = parseFloat(document.getElementById('filter-price-min').value) || 0;
    const priceMax = parseFloat(document.getElementById('filter-price-max').value) || Infinity;
  
    const filteredProducts = products.filter(product => {
      return (gender === 'all' || product.gender === gender) &&
             (color === 'all' || product.color === color) &&
             (type === 'all' || product.type === type) &&
             product.price >= priceMin &&
             product.price <= priceMax;
    });
  
    renderFilteredProducts(filteredProducts);
  }
  
  function renderFilteredProducts(filteredProducts) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
  
    const template = document.getElementById('product-template').content;
  
    filteredProducts.forEach(product => {
      const clone = template.cloneNode(true);
      clone.querySelector('.card-img-top').src = product.image;
      clone.querySelector('.product-name').textContent = product.name;
      clone.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
      clone.querySelector('.product-attributes').textContent = `${product.color} | ${product.type} | ${product.gender}`;
      clone.querySelector('.add-to-cart').onclick = () => addToCart(product.id);
      productList.appendChild(clone);
    });
  }
  
  document.getElementById('apply-filters').onclick = filterProducts;
  document.getElementById('view-cart').onclick = () => {
    renderCart();
    document.getElementById('cart-modal').style.display = 'block';
  };
  
  document.querySelector('.close').onclick = () => {
    document.getElementById('cart-modal').style.display = 'none';
  };
  
  window.onclick = event => {
    if (event.target == document.getElementById('cart-modal')) {
      document.getElementById('cart-modal').style.display = 'none';
    }
  };
  
  document.getElementById('search').oninput = function () {
    const query = this.value.toLowerCase();
    const filteredProducts = products.filter(product => {
      return product.name.toLowerCase().includes(query) ||
             product.color.toLowerCase().includes(query) ||
             product.type.toLowerCase().includes(query);
    });
    renderFilteredProducts(filteredProducts);
  };
  
  window.onload = () => {
    renderProducts();
    updateCartCount();
  };
  