// Cart state
let cart = JSON.parse(localStorage.getItem('halftime_cart')) || [];

// Update cart counter in navigation
function updateCartCount() {
    const countEl = document.getElementById('nav-cart-count');
    if (countEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.textContent = totalItems;
        
        // Simple animation to draw attention
        countEl.style.transform = 'scale(1.3)';
        setTimeout(() => {
            countEl.style.transform = 'scale(1)';
        }, 200);
    }
}

// Add to cart globally
function addToCart(product, size, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: quantity,
            team: product.team
        });
    }
    
    localStorage.setItem('halftime_cart', JSON.stringify(cart));
    updateCartCount();
}

// Common function to render product cards
function renderProducts(productsToRender, container) {
    if(!container) return;
    
    container.innerHTML = '';
    
    productsToRender.forEach(product => {
        const isCity = product.team === 'Manchester City';
        const cardClass = isCity ? 'product-card city-pick' : 'product-card';
        
        let badgesHtml = '';
        if (isCity) {
            badgesHtml += '<div class="city-badge">City Pick</div>';
        }
        if (product.originalPrice) {
            badgesHtml += '<div class="sale-badge" style="position: absolute; top: 10px; right: 10px; background-color: var(--sale-color); color: #fff; font-size: 0.7rem; font-weight: bold; padding: 4px 8px; text-transform: uppercase; z-index: 2;">SALE</div>';
        }
        
        const priceHtml = product.originalPrice 
            ? `<span class="product-price">${formatPrice(product.price)}</span>
               <span class="original-price">${formatPrice(product.originalPrice)}</span>`
            : `<span class="product-price">${formatPrice(product.price)}</span>`;

        const card = document.createElement('div');
        card.className = cardClass;
        card.innerHTML = `
            ${badgesHtml}
            <a href="product.html?id=${product.id}" class="product-image" style="background-color: #fff;">
                <img src="${product.image}" alt="${product.name}" style="object-fit: contain; padding: 1rem;">
            </a>
            <div class="product-info">
                <span class="product-team" ${isCity ? 'style="color: var(--accent-color); font-weight: bold;"' : ''}>${product.team}</span>
                <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
                <div class="product-price-container">
                    ${priceHtml}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Search validation
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Trim unnecessary spaces
            const query = searchInput.value.trim();
            searchInput.value = query; // Do not silently modify except harmless trimming
            
            if (query === '') {
                // Do not submit empty search. We show a non-intrusive UI error if we can, 
                // but since it's a tiny nav bar, a simple custom placeholder or changing border color works.
                searchInput.style.borderColor = 'var(--sale-color)';
                setTimeout(() => { searchInput.style.borderColor = ''; }, 2000);
                return;
            }
            
            if (query.length > 50) {
                searchInput.value = query.substring(0, 50);
                searchInput.style.borderColor = 'var(--sale-color)';
                setTimeout(() => { searchInput.style.borderColor = ''; }, 2000);
                return;
            }
            
            // Proceed with search
            window.location.href = `index.html?search=${encodeURIComponent(query)}#catalogue`;
        });
        
        searchInput.addEventListener('input', () => {
            searchInput.style.borderColor = '';
        });
    }
});
