document.addEventListener('DOMContentLoaded', () => {
    
    const checkoutContent = document.getElementById('checkout-content');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotals = document.getElementById('checkout-totals');
    
    let discountApplied = 0;
    let subtotalAmount = 0;
    let couponActive = false;
    
    function renderCheckoutSummary() {
        if (!cart || cart.length === 0) {
            checkoutContent.innerHTML = `
                <div class="empty-cart-msg">
                    <i class="fas fa-shopping-basket" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <h2>Your cart is empty</h2>
                    <p style="color: var(--text-secondary); margin: 1rem 0 2rem;">Add some gear before heading to checkout.</p>
                    <a href="index.html#catalogue" class="btn btn-primary">Return to Shop</a>
                </div>
            `;
            return;
        }

        let itemsHtml = '';
        subtotalAmount = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotalAmount += itemTotal;
            
            const isCity = item.team === 'Manchester City';

            itemsHtml += `
                <div class="cart-item-sm" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-sm-details">
                        <div class="cart-item-sm-title" ${isCity ? 'style="color: var(--accent-color);"' : ''}>${item.name}</div>
                        <div class="cart-item-sm-meta" style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                            <span>Size: ${item.size}</span>
                            <div style="display: flex; align-items: center; gap: 5px; background: var(--bg-color); border-radius: 4px; padding: 2px;">
                                <button type="button" class="cart-qty-btn minus-btn" data-id="${item.id}" data-size="${item.size}" style="background: none; border: none; cursor: pointer; padding: 0 5px; font-size: 0.8rem;"><i class="fas fa-minus"></i></button>
                                <span style="font-size: 0.8rem; min-width: 15px; text-align: center;">${item.quantity}</span>
                                <button type="button" class="cart-qty-btn plus-btn" data-id="${item.id}" data-size="${item.size}" style="background: none; border: none; cursor: pointer; padding: 0 5px; font-size: 0.8rem;"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                        <span style="font-weight: 600;">${formatPrice(itemTotal)}</span>
                        <button type="button" class="cart-remove-btn" data-id="${item.id}" data-size="${item.size}" style="background: none; border: none; color: var(--sale-color); cursor: pointer; font-size: 0.8rem; text-decoration: underline;">Remove</button>
                    </div>
                </div>
            `;
        });

        const shipping = subtotalAmount > 10000 ? 0 : 250;
        
        // Handle Coupon logic
        if (couponActive) {
            discountApplied = Math.floor(subtotalAmount * 0.26); // 26% discount
        } else {
            discountApplied = 0;
        }

        let total = subtotalAmount + shipping - discountApplied;
        if (total < 0) total = 0;

        checkoutItems.innerHTML = itemsHtml;
        
        // Bind Cart Controls
        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const size = e.currentTarget.getAttribute('data-size');
                const item = cart.find(i => i.id === id && i.size === size);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    localStorage.setItem('halftime_cart', JSON.stringify(cart));
                    updateCartCount();
                    renderCheckoutSummary();
                }
            });
        });

        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const size = e.currentTarget.getAttribute('data-size');
                const item = cart.find(i => i.id === id && i.size === size);
                if (item && item.quantity < 10) {
                    item.quantity++;
                    localStorage.setItem('halftime_cart', JSON.stringify(cart));
                    updateCartCount();
                    renderCheckoutSummary();
                }
            });
        });

        document.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const size = e.currentTarget.getAttribute('data-size');
                cart = cart.filter(i => !(i.id === id && i.size === size));
                localStorage.setItem('halftime_cart', JSON.stringify(cart));
                updateCartCount();
                renderCheckoutSummary();
            });
        });
        
        let totalsHtml = `
            <div class="summary-row">
                <span>Subtotal (${cart.length} items)</span>
                <span>${formatPrice(subtotalAmount)}</span>
            </div>
        `;
        
        if (discountApplied > 0) {
            totalsHtml += `
            <div class="summary-row" style="color: var(--success-color);">
                <span>CITY26 (26%)</span>
                <span>-${formatPrice(discountApplied)}</span>
            </div>
            `;
        }

        totalsHtml += `
            <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            ${shipping > 0 ? `<p style="font-size: 0.8rem; color: var(--text-secondary); text-align: right; margin-top: -5px; margin-bottom: 1rem;">Free shipping over ₹10,000</p>` : ''}
        `;
        
        totalsHtml += `
            <div class="summary-row grand-total">
                <span>Total</span>
                <span style="color: var(--accent-color);">${formatPrice(total)}</span>
            </div>
        `;
        
        checkoutTotals.innerHTML = totalsHtml;
    }

    renderCheckoutSummary();
    
    // Validation Logic
    const form = document.getElementById('checkout-form');
    
    // Helpers
    const showError = (id, show) => {
        const errEl = document.getElementById('err-' + id);
        const inputEl = document.getElementById(id);
        if(show) {
            errEl.classList.add('visible');
            inputEl.classList.add('invalid');
        } else {
            errEl.classList.remove('visible');
            inputEl.classList.remove('invalid');
        }
    };

    const validateField = (id, value) => {
        value = value.trim();
        let isValid = true;
        
        switch(id) {
            case 'fname':
            case 'lname':
                isValid = /^[a-zA-Z\s]{2,50}$/.test(value);
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                break;
            case 'phone':
                isValid = /^[6-9]\d{9}$/.test(value);
                break;
            case 'address':
                isValid = value.length >= 10 && value.length <= 150 && /^[a-zA-Z0-9\s,\.\-\/]+$/.test(value) && value.replace(/\s/g, '').length > 0;
                break;
            case 'city':
                isValid = /^[a-zA-Z\s]{2,50}$/.test(value);
                break;
            case 'pincode':
                isValid = /^\d{6}$/.test(value);
                break;
            case 'cname':
                isValid = /^[a-zA-Z\s]{2,50}$/.test(value);
                break;
            case 'cnum':
                let cnumRaw = value.replace(/\s/g, '');
                isValid = /^\d{16}$/.test(cnumRaw);
                break;
            case 'cexp':
                let cexpRaw = value.replace(/\s/g, '').replace('/', '');
                if (/^\d{4}$/.test(cexpRaw)) {
                    let month = parseInt(cexpRaw.substring(0, 2), 10);
                    let year = parseInt(cexpRaw.substring(2, 4), 10);
                    let now = new Date();
                    let currentMonth = now.getMonth() + 1;
                    let currentYear = now.getFullYear() % 100; // last two digits
                    
                    if (month >= 1 && month <= 12) {
                        if (year > currentYear || (year === currentYear && month >= currentMonth)) {
                            isValid = true;
                        } else {
                            isValid = false; // expired
                        }
                    } else {
                        isValid = false; // invalid month
                    }
                } else {
                    isValid = false;
                }
                break;
            case 'ccvv':
                isValid = /^\d{3}$/.test(value);
                break;
        }
        
        showError(id, !isValid);
        return isValid;
    };

    // Attach listeners
    const shippingFields = ['fname', 'lname', 'email', 'phone', 'address', 'city', 'pincode'];
    const paymentFields = ['cname', 'cnum', 'cexp', 'ccvv'];
    
    [...shippingFields, ...paymentFields].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', (e) => {
            if (id === 'cnum') {
                let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                e.target.value = val.replace(/(\d{4})(?=\d)/g, '$1 ');
            } else if (id === 'cexp') {
                let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                if (val.length >= 3) {
                    e.target.value = val.substring(0, 2) + ' / ' + val.substring(2, 4);
                } else if (val.length >= 1) {
                    // Only add slash if user is typing forward
                    if (e.target.value.length === 2 && e.inputType !== 'deleteContentBackward') {
                        e.target.value = val.substring(0, 2) + ' / ';
                    } else {
                        e.target.value = val;
                    }
                } else {
                    e.target.value = '';
                }
            } else if (id === 'ccvv') {
                e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
            }
            validateField(id, e.target.value);
        });
        el.addEventListener('blur', (e) => {
            if (id !== 'cnum' && id !== 'cexp' && id !== 'ccvv') {
                e.target.value = e.target.value.trim();
            }
            validateField(id, e.target.value);
        });
    });

    // Two-step logic
    const continueBtn = document.getElementById('continue-to-payment');
    const shippingFieldsContainer = document.getElementById('shipping-fields');
    const paymentSection = document.getElementById('payment-section');
    const shippingDone = document.getElementById('shipping-done');
    
    continueBtn.addEventListener('click', () => {
        let isShippingValid = true;
        shippingFields.forEach(id => {
            const el = document.getElementById(id);
            el.value = el.value.trim();
            if (!validateField(id, el.value)) {
                isShippingValid = false;
            }
        });
        
        if (isShippingValid) {
            shippingFieldsContainer.classList.add('collapsed');
            shippingDone.classList.add('show');
            paymentSection.classList.add('visible');
            
            // Optional: Scroll to payment section smoothly
            setTimeout(() => {
                paymentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });

    // Coupon Logic
    const couponInput = document.getElementById('coupon');
    const applyCouponBtn = document.getElementById('apply-coupon');
    const errCoupon = document.getElementById('err-coupon');
    const succCoupon = document.getElementById('succ-coupon');

    applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        couponInput.value = code;
        
        errCoupon.classList.remove('visible');
        succCoupon.style.display = 'none';
        
        if (code === '') {
            return; // don't show error if empty apply
        }
        
        if (!/^[A-Z0-9]{1,20}$/.test(code)) {
            errCoupon.classList.add('visible');
            return;
        }
        
        if (code === 'CITY26') {
            if (!couponActive) {
                couponActive = true;
                succCoupon.textContent = 'CITY26 applied successfully!';
                succCoupon.style.display = 'block';
                renderCheckoutSummary();
            } else {
                errCoupon.textContent = 'Coupon already applied.';
                errCoupon.classList.add('visible');
            }
        } else {
            errCoupon.textContent = 'Invalid coupon code.';
            errCoupon.classList.add('visible');
            couponActive = false;
            renderCheckoutSummary();
        }
    });

    couponInput.addEventListener('input', () => {
        errCoupon.classList.remove('visible');
        succCoupon.style.display = 'none';
    });
    
    // Form Submission
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent native submission completely
        
        // At this point we just validate payment since shipping must be valid
        // But let's re-validate all just in case
        let isFormValid = true;
        [...shippingFields, ...paymentFields].forEach(id => {
            const el = document.getElementById(id);
            if (id !== 'cnum' && id !== 'cexp' && id !== 'ccvv') {
                el.value = el.value.trim();
            }
            if (!validateField(id, el.value)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            return;
        }
        
        // Show success overlay
        document.getElementById('success-overlay').classList.add('show');
        
        // Clear cart
        cart = [];
        localStorage.setItem('halftime_cart', JSON.stringify(cart));
        updateCartCount();
    });
});
