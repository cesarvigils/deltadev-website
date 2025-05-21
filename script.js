document.addEventListener('DOMContentLoaded', () => {
    const fivemLink = document.getElementById('fivemLink');
    const fivemOptions = document.getElementById('fivemOptions');
    const track = document.querySelector('.carousel-track');
    const listProductHTML = document.querySelector('.listProduct');
    const listCartHTML = document.querySelector('.listCart');
    const iconCart = document.querySelector('.icon-cart');
    const iconCartSpan = document.querySelector('.icon-cart span');
    const body = document.querySelector('body');
    const closeCart = document.querySelector('.close');
    let products = [];
    let cart = [];
    let currentIndex = 0;
    const modal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalPrice = document.getElementById('modalPrice');
const closeModal = document.querySelector('.close-modal');

function closeModalWindow() {
  modal.classList.remove('show');
  modal.classList.add('hide');
  modal.querySelector('.modal-content').classList.add('hide');

  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('hide');
    modal.querySelector('.modal-content').classList.remove('hide');
  }, 300); // mismo tiempo que tu animación CSS
}

closeModal.addEventListener('click', () => {
  closeModalWindow();
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModalWindow();
  }
});


    if (fivemLink && fivemOptions) {
        fivemLink.addEventListener('click', (event) => {
            event.preventDefault();
            const isVisible = fivemOptions.style.display === 'block';
            fivemOptions.style.display = isVisible ? 'none' : 'block';
        });
    }

    if (track) {
        const items = track.children.length;
        setInterval(() => {
            currentIndex = (currentIndex + 1) % items;
            track.style.transform = `translateX(-${currentIndex * 320}px)`;
        }, 3000);
    }

    document.querySelectorAll('.dropdown-parent > a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const parent = this.parentElement;
            const isActive = parent.classList.contains('active');
            document.querySelectorAll('.dropdown-parent').forEach(item => item.classList.remove('active'));
            if (!isActive) parent.classList.add('active');
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown-parent')) {
            document.querySelectorAll('.dropdown-parent').forEach(item => item.classList.remove('active'));
        }
    });

    if (iconCart) {
        iconCart.addEventListener('click', () => {
            body.classList.toggle('showCart');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            body.classList.toggle('showCart');
        });
    }

    const addDataToHTML = () => {
        listProductHTML.innerHTML = '';
        if (products.length > 0) {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML =
                    `<img src="${product.image}" alt="">
                    <h2>${product.name}</h2>
                    <div class="price">$${product.price}</div>
                    <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    }
listProductHTML.addEventListener('click', (event) => {
    let itemElement = event.target.closest('.item');
    if (!itemElement) return;

    let id_product = itemElement.dataset.id;

    if (event.target.classList.contains('addCart')) {
        addToCart(id_product);
    } else {
        let productInfo = products.find(p => p.id == id_product);
        if (productInfo) {
            modalTitle.textContent = productInfo.name;
            modalImage.src = productInfo.image;
            modalPrice.textContent = `${productInfo.description}`;
            modal.style.display = 'block';
        }
    }
});


    const addToCart = (product_id) => {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
        if (cart.length <= 0) {
            cart = [{
                product_id: product_id,
                quantity: 1
            }];
        } else if (positionThisProductInCart < 0) {
            cart.push({
                product_id: product_id,
                quantity: 1
            });
        } else {
            cart[positionThisProductInCart].quantity += 1;
        }
        addCartToHTML();
        addCartToMemory();
    }

    const addCartToMemory = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        if (cart.length > 0) {
            cart.forEach(item => {
                let product = products.find(p => p.id == item.product_id);
                if (!product) return;
                totalQuantity += item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;
                newItem.innerHTML = `
                <div class="image"><img src="${product.image}"></div>
                <div class="name">${product.name}</div>
                <div class="totalPrice">$${product.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>`;
                listCartHTML.appendChild(newItem);
            });
        }
        iconCartSpan.innerText = totalQuantity;
    }

    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
            changeQuantityCart(product_id, type);
        }
    });

    const changeQuantityCart = (product_id, type) => {
        let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
        if (positionItemInCart >= 0) {
            let item = cart[positionItemInCart];
            if (type === 'plus') {
                item.quantity += 1;
            } else {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    cart.splice(positionItemInCart, 1);
                }
            }
        }
        addCartToHTML();
        addCartToMemory();
    }

    const initApp = () => {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                addDataToHTML();
                if (localStorage.getItem('cart')) {
                    cart = JSON.parse(localStorage.getItem('cart'));
                    addCartToHTML();
                }
            })
            .catch(err => {
                console.error('No se pudo cargar products.json', err);
            });
    }

    initApp();
});