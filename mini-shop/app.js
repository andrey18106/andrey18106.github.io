document.addEventListener('DOMContentLoaded', function() {
    let data = {
        'products': [],
        'cart': []
    };

    let productList = document.querySelector('.product-list');
    let productListLoader = document.querySelector('.product-list > .loader');
    let cartList = document.querySelector('.cart-list');



    let saveCartData = () => {
        localStorage.setItem('MiniShopCartData', JSON.stringify(data.cart));
    }

    let getCartData = () => {
        data.cart = JSON.parse(localStorage.getItem('MiniShopCartData')) || [];
    }

    let increaseCartProductCount = (id) => {
        let cartProduct = data.cart.filter(item => item.id == id)[0];
        let productCartIndex = data.cart.indexOf(cartProduct);
        if (cartProduct.count + 1 <= data.products.filter(item => item.id == id)[0].available) {
            data.cart[productCartIndex].count += 1;
            saveCartData();
            renderCart();
        } else {
            alert('Reached maximum available product count');
        }
    }

    let decreaseCartProductCount = (id) => {
        let cartProduct = data.cart.filter(item => item.id == id)[0];
        let productCartIndex = data.cart.indexOf(cartProduct);
        if (cartProduct.count - 1 > 0) {
            data.cart[productCartIndex].count -= 1;
            saveCartData();
            renderCart();
        } else {
            data.cart.splice(productCartIndex, 1);
            saveCartData();
            renderCart();
        }
    }

    let addToCart = (id) => {
        data.products.forEach(product => {
            if (product.id == id) {
                if (product.available > 0) {
                    if (data.cart !== null) {
                        if (data.cart.filter(item => item.id == id).length > 0) {
                            increaseCartProductCount(id);
                        } else {
                            product.count = 1;
                            data.cart.push(product);
                        }
                    } else {
                        product.count = 1;
                        data.cart = [product];
                    }
                    saveCartData();
                    renderCart();
                } else {
                    alert('Product not available now.');
                }
            }
        });
    }

    let renderList = () => {
        productListLoader.parentNode.removeChild(productListLoader);
        let productListHTML = data.products.map(product => {
            return `<div class="product-list-item border-bottom mb-3 p-3">
                        <h3>${product.name}</h3>
                        <small class="product-description">short description of product</small>
                        <p class="product-price my-3 d-flex align-items-center">
                            <span>\$${product.price}</span>
                            <button class="btn btn-primary py-0 mx-2" data-id="${product.id}" ${product.available > 0 ? '': 'disabled'}>Add</button>
                        </p>
                    </div>`;
        }).join('');
        productList.innerHTML = productListHTML;
        let productButtons = document.querySelectorAll('.product-list .btn');
        productButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                addToCart(button.dataset.id);
            });
        })
    }

    let renderCart = () => {
        if (data.cart == null || data.cart.length == 0) {
            let cartListLoader = document.querySelector('.cart-list > .loader');
            if (cartListLoader !== null) {
                cartListLoader.parentNode.removeChild(cartListLoader);
            }
            cartList.innerHTML = '<p class="text-muted text-center">Your cart is empty</p>';
        } else {
            let emptyText = document.querySelector('.cart-list p.text-muted');
            if (emptyText !== null) {
                emptyText.parentNode.removeChild(emptyText);
            }
            let totalPrice = 0;
            let cartListHTML = data.cart.map(item => {
                totalPrice += item.count * item.price;
                return `<div class="cart-list-item border-bottom my-3">
                            <div class="cart-list-item-heading d-flex justify-content-between align-items-center">
                                <h4>${item.name}</h4>
                                <span class="cart-list-item-price">\$${item.count * item.price}</span>
                            </div>
                            <div class="product-count-wrapper d-flex align-items-center">
                                <button class="btn btn-secondary py-0 px-2 my-2" data-id="${item.id}">-</button>
                                <button class="btn btn-secondary py-0 px-2 my-2 mx-2" data-id="${item.id}">+</button>
                                <div class="product-count my-2 mx-2">${item.count}</div>
                            </div>
                        </div>`
            }).join('');
            let cartTotal = `<div class="total d-flex mt-2 mb-5 justify-content-between">
                                <span>Total:</span>
                                <span class="price">\$${totalPrice}</span>
                            </div>`;
            cartList.innerHTML = cartListHTML + cartTotal;
            let cartMinusButtons = document.querySelectorAll('.product-count-wrapper .btn:nth-child(1)');
            let cartPlusButtons = document.querySelectorAll('.product-count-wrapper .btn:nth-child(2)');

            cartMinusButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    decreaseCartProductCount(button.dataset.id);
                });
            });
            
            cartPlusButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    increaseCartProductCount(button.dataset.id);
                });
            });
        }
    }

    let getProductsData = () => {
        fetch('https://jsonbox.io/box_778eabc2fa9ee6c909ce', {
            method: 'GET',
            headers: {'Content-type': 'application/json'}
        }).then(response => response.json()).then(responseData => {
            data.products = responseData;
            renderList();
            getCartData();
            renderCart();
            window.addEventListener('storage', () => {
                getCartData();
                renderCart();
            });
        });
    }

    getProductsData();
});