document.addEventListener('DOMContentLoaded', () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const container = document.getElementById('product-container');
    const relatedContainer = document.getElementById('related-products');
    
    if (!productId) {
        container.innerHTML = '<h2>Product not found</h2><a href="index.html" class="btn btn-primary">Back to Home</a>';
        return;
    }

    const product = products.find(p => p.id === productId);
    
    if (!product) {
        container.innerHTML = '<h2>Product not found</h2><a href="index.html" class="btn btn-primary">Back to Home</a>';
        return;
    }

    const isCity = product.team === 'Manchester City';
    const accentClass = isCity ? 'city-theme' : '';
    
    // Render Product Layout
    const priceHtml = product.originalPrice 
        ? `<span>${formatPrice(product.price)}</span> <span class="original">${formatPrice(product.originalPrice)}</span>`
        : `<span>${formatPrice(product.price)}</span>`;

    let sizesHtml = product.sizes.map(size => 
        `<button class="size-btn" data-size="${size}">${size}</button>`
    ).join('');

    container.innerHTML = `
        <div class="product-layout ${accentClass}">
            <div class="product-gallery">
                <img src="${product.image}" alt="${product.name}" id="main-image">
            </div>
            <div class="product-info-panel">
                <span class="product-team-subtitle">${product.team}</span>
                <h1>${product.name}</h1>
                <div class="price-block">
                    ${priceHtml}
                </div>
                
                <p class="description">${product.description}</p>
                
                <div class="selection-group">
                    <h4>Select Size</h4>
                    <div class="size-grid" id="size-options">
                        ${sizesHtml}
                    </div>
                    <p id="size-error" style="color: var(--sale-color); font-size: 0.9rem; margin-top: 0.5rem; display: none;">Please select a size before adding to cart.</p>
                </div>
                
                <div class="selection-group">
                    <h4>Quantity</h4>
                    <div class="qty-controls">
                        <button type="button" class="qty-btn" id="qty-minus"><i class="fas fa-minus"></i></button>
                        <input type="number" class="qty-value" id="qty-input" value="1" min="1" max="10" required style="width: 50px; border: none; background: transparent; text-align: center; color: inherit; font-family: inherit; -moz-appearance: textfield; outline: none;">
                        <button type="button" class="qty-btn" id="qty-plus"><i class="fas fa-plus"></i></button>
                    </div>
                    <div id="qty-error" class="error-msg">Please enter a valid quantity between 1 and 10.</div>
                </div>
                
                <button class="btn btn-primary add-to-cart-btn" id="add-to-cart-btn">
                    ADD TO CART
                </button>
                
                <div class="product-meta">
                    <p>Season: <span>${product.season}</span></p>
                    <p>Availability: <span>In Stock - Ready to Ship</span></p>
                </div>
            </div>
        </div>
    `;

    // Interactive Logic
    let selectedSize = null;
    let currentQty = 1;
    
    const sizeBtns = document.querySelectorAll('.size-btn');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const sizeError = document.getElementById('size-error');
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyError = document.getElementById('qty-error');

    if (isCity) {
        addToCartBtn.classList.remove('btn-primary');
        addToCartBtn.classList.add('btn-accent');
    }

    // Size Selection
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            sizeBtns.forEach(b => {
                b.classList.remove('selected');
                b.classList.remove('selected-city');
            });
            
            if (isCity) {
                e.target.classList.add('selected-city');
            } else {
                e.target.classList.add('selected');
            }
            
            selectedSize = e.target.getAttribute('data-size');
            sizeError.classList.remove('visible');
        });
    });

    function updateQty(newVal) {
        // Enforce boundaries
        if(isNaN(newVal) || newVal < 1 || newVal > 10 || !Number.isInteger(Number(newVal))) {
            qtyError.classList.add('visible');
            qtyInput.classList.add('invalid');
            return false;
        }
        qtyError.classList.remove('visible');
        qtyInput.classList.remove('invalid');
        currentQty = parseInt(newVal, 10);
        qtyInput.value = currentQty;
        return true;
    }

    // Quantity Controls
    qtyInput.addEventListener('input', (e) => {
        updateQty(e.target.value);
    });

    qtyMinus.addEventListener('click', () => {
        updateQty(parseInt(qtyInput.value, 10) - 1);
    });

    qtyPlus.addEventListener('click', () => {
        updateQty(parseInt(qtyInput.value, 10) + 1);
    });

    // Add To Cart
    addToCartBtn.addEventListener('click', () => {
        let valid = true;
        if (!selectedSize) {
            sizeError.classList.add('visible');
            valid = false;
        }
        
        if (!updateQty(qtyInput.value)) {
            valid = false;
        }
        
        if (!valid) return;
        
        addToCart(product, selectedSize, currentQty);
        
        // Show Toast
        const toast = document.getElementById('action-toast');
        const msg = document.getElementById('action-msg');
        const title = document.getElementById('action-title');
        
        title.innerText = 'Added to Cart';
        toast.style.borderLeftColor = 'var(--success-color)';
        msg.innerHTML = `${currentQty}x ${product.name} (Size: ${selectedSize}) was added to your cart.<br><a href="checkout.html" style="color: var(--accent-color); font-weight: bold; margin-top: 10px; display: inline-block;">Proceed to Checkout &rarr;</a>`;
        
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
        
        // Button Feedback
        const originalText = addToCartBtn.textContent;
        addToCartBtn.textContent = 'ADDED!';
        addToCartBtn.style.backgroundColor = 'var(--success-color)';
        addToCartBtn.style.color = '#fff';
        
        setTimeout(() => {
            addToCartBtn.textContent = originalText;
            addToCartBtn.style.backgroundColor = '';
            addToCartBtn.style.color = '';
        }, 2000);
    });

    // Render Related Products (Just show 4 random other products)
    let related = products.filter(p => p.id !== product.id);
    // Shuffle simple implementation
    related = related.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // Make sure City products appear prominently if looking at a City shirt
    if (isCity) {
        let cityRelated = products.filter(p => p.id !== product.id && p.team === 'Manchester City');
        let others = products.filter(p => p.id !== product.id && p.team !== 'Manchester City');
        related = [...cityRelated, ...others].slice(0, 4);
    }
    
    renderProducts(related, relatedContainer);
});
