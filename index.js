import { menuArray as jimmyMenu } from './data-jimmy.js';
import { menuArray as pastaMenu } from './data-pasta.js';
import { menuArray as sushiMenu } from './data-sushi.js';

const restaurant = window.location.pathname.split('/').pop().replace('.html', '');

let menuArray;
switch (restaurant) {
    case 'jimmy':
        menuArray = jimmyMenu;
        break;
    case 'pasta':
        menuArray = pastaMenu;
        break;
    case 'sushi':
        menuArray = sushiMenu;
        break;
    default:
        menuArray = [];
}

const cart = [];

document.addEventListener('click', function(e){
    if(e.target.dataset.add){
        handleAddClick(e.target.dataset.add);
    } else if(e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove);
    } else if(e.target.classList.contains('complete-order-btn')){
        showPaymentModal();
    } else if(e.target.id === 'closeModalBtn'){
        hidePaymentModal();
    }
});

document.getElementById('paymentForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const name = e.target.querySelector('input').value;
    showConfirmationMessage(name);
    clearCart();
});

function handleAddClick(itemId) {
    const targetItem = menuArray.find(item => item.id == itemId);
    if(targetItem){
        cart.push(targetItem);
        renderCart();
    }
}

function handleRemoveClick(itemId) {
    const index = cart.findIndex(item => item.id == itemId);
    if(index > -1){
        cart.splice(index, 1);
        renderCart();
    }
}

function renderCart() {
    const cartSection = document.querySelector(".cart");
    cartSection.innerHTML = `
        <h2>Your order</h2>
        ${cart.length ? getCartHtml() : '<p class="empty-cart">Your cart is empty</p>'}
        ${cart.length ? '<button class="complete-order-btn">Complete order</button>' : ''}
    `;
}

function getCartHtml() {
    let cartHtml = ``;
    let totalPrice = 0;
    cart.forEach(function(item){
        cartHtml += `
            <div class="cart-item">
                <span class="cart-emoji">${item.emoji}</span>
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <button class="remove-btn" data-remove="${item.id}">remove</button>
                </div>
                <span class="cart-item-price">$${item.price}</span>
            </div>
        `;
        totalPrice += item.price;
    });
    return `
        ${cartHtml}
        <div class="total-container">
            <div class="total-price">
                <p>Total price:</p>
                <p>$${totalPrice}</p>
            </div>
        </div>
    `;
}

function renderMenu() {
    document.querySelector('.feed').innerHTML = menuArray.map(item => `
        <div class="item">
            <span class="emoji">${item.emoji}</span>
            <div class="item-details">
                <h3 class="name">${item.name}</h3>
                <p class="ingredients">${item.ingredients.join(', ')}</p>
                <p class="price">$${item.price}</p>
            </div>
            <button class="add-button" data-add="${item.id}">+</button>
        </div>
    `).join('');
}

function showPaymentModal() {
    document.getElementById('paymentModal').style.display = 'flex';
}

function hidePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function showConfirmationMessage(name) {
    hidePaymentModal();
    document.getElementById('confirmationMessage').style.display = 'block';
    document.getElementById('customerName').textContent = name;
    document.querySelector('.cart').innerHTML = '';
}

function clearCart() {
    cart.length = 0;
    renderCart();
}

renderMenu();
renderCart();