const offers = [
    { id: 1, name: 'Discounted Green Polo', price: 150.00, color: 'green', type: 'polo', gender: 'male', image: 'tshirt1.webp', quantity: 10 },
    { id: 2, name: 'Sale Red V-Neck', price: 100.00, color: 'red', type: 'vneck', gender: 'female', image: 'tshirt1.webp', quantity: 5 },
    { id: 3, name: 'Clearance Blue Crewneck', price: 100.00, color: 'blue', type: 'crewneck', gender: 'unisex', image: 'tshirt1.webp', quantity: 8 },

  ];
  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  function renderOffers() {
    const offerList = document.getElementById('offer-list');
    offerList.innerHTML = '';
    
    const template = document.getElementById('offer-template').content;
  
    offers.forEach(offer => {
      const clone = template.cloneNode(true);
      clone.querySelector('.card-img-top').src = offer.image;
      clone.querySelector('.offer-name').textContent = offer.name;
      clone.querySelector('.offer-price').textContent = `$${offer.price.toFixed(2)}`;
      clone.querySelector('.offer-attributes').textContent = `${offer.color} | ${offer.type} | ${offer.gender}`;
      clone.querySelector('.add-to-cart').onclick = () => addToCart(offer.id);
      offerList.appendChild(clone);
    });
  }
  
  function addToCart(offerId) {
    const offer = offers.find(o => o.id === offerId);
    if (offer.quantity > 0) {
      const cartItem = cart.find(item => item.id === offerId);
      if (cartItem) {
        if (cartItem.quantity < offer.quantity) {
          cartItem.quantity++;
        } else {
          alert('Cannot add more items than available in stock');
          return;
        }
      } else {
        cart.push({ ...offer, quantity: 1 });
      }
      saveCart();
      updateCartCount();
    } else {
      alert('Offer is out of stock');
    }
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
  
  function removeFromCart(offerId) {
    const index = cart.findIndex(item => item.id === offerId);
    if (
        index !== -1) {
            cart.splice(index, 1);
            saveCart();
            updateCartCount();
            renderCart();
          }
        }
        
        function filterOffers() {
          const gender = document.getElementById('filter-gender').value;
          const color = document.getElementById('filter-color').value;
          const type = document.getElementById('filter-type').value;
          const priceMin = document.getElementById('filter-price-min').value;
          const priceMax = document.getElementById('filter-price-max').value;
        
          const filteredOffers = offers.filter(offer => {
            return (gender === 'all' || offer.gender === gender) &&
                   (color === 'all' || offer.color === color) &&
                   (type === 'all' || offer.type === type) &&
                   (!priceMin || offer.price >= parseFloat(priceMin)) &&
                   (!priceMax || offer.price <= parseFloat(priceMax));
          });
        
          renderFilteredOffers(filteredOffers);
        }
        
        function renderFilteredOffers(filteredOffers) {
          const offerList = document.getElementById('offer-list');
          offerList.innerHTML = '';
          
          const template = document.getElementById('offer-template').content;
        
          filteredOffers.forEach(offer => {
            const clone = template.cloneNode(true);
            clone.querySelector('.card-img-top').src = offer.image;
            clone.querySelector('.offer-name').textContent = offer.name;
            clone.querySelector('.offer-price').textContent = `$${offer.price.toFixed(2)}`;
            clone.querySelector('.offer-attributes').textContent = `${offer.color} | ${offer.type} | ${offer.gender}`;
            clone.querySelector('.add-to-cart').onclick = () => addToCart(offer.id);
            offerList.appendChild(clone);
          });
        }
        
        document.getElementById('apply-filters').onclick = filterOffers;
        document.getElementById('view-cart').onclick = () => {
          renderCart();
          $('#cart-modal').modal('show');
        };
        
        window.onload = () => {
          renderOffers();
          updateCartCount();
        };
          