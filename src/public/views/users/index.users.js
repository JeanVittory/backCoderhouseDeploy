const errorContainer = document.querySelector('#errorContainer');
const quantityCart = document.querySelector('#qntyCart');
const cards = document.querySelector('#cards');
const productsTemplate = document.querySelector('#productsTemplate').content;
const fragment = document.createDocumentFragment();
const productCard = document.querySelector('#card');
const btnSendChatMessage = document.querySelector('#btnSendChatMessage');
const emailUser = document.querySelector('#emailUser');
const messageUser = document.querySelector('#messageUser');
const typeMessage = document.querySelector('#type');
const messagesContainer = document.querySelector('#messages');
const percentageReduction = document.querySelector('#percentageReduction');
const origin = window.location.origin;
const URL = 'https://backcoderhousedeploy-production.up.railway.app/';

const socket = io({
	autoConnect: false,
	reconnection: false,
});

socket.connect();

const toastyAlert = (message) => {
	return Toastify({
		text: message,
		className: 'alert',
		style: {
			background: 'linear-gradient(to right, #eb5757, #000000)',
			color: 'wheat',
			fontFamily: 'monospace',
		},
	}).showToast();
};

[emailUser, messageUser, typeMessage].forEach((element) => {
	element.addEventListener('keyup', () => {
		if (element.value !== '') {
			element.classList.remove('alert');
		}
		return;
	});

	element.addEventListener('blur', () => {
		if (element.value !== '') return;
		element.classList.add('alert');
		return;
	});
});

btnSendChatMessage.addEventListener('click', (e) => {
	e.preventDefault();
	if (emailUser.value === '' || messageUser.value === '' || typeMessage.value === '') {
		[emailUser, messageUser, typeMessage].forEach((element) => {
			element.classList.add('alert');
		});
		Toastify({
			text: 'Please fill the form completely',
			className: 'alert',
			style: {
				background:
					'linear-gradient(90deg, rgba(208,199,15,1) 0%, rgba(214,9,68,1) 100%, rgba(0,212,255,1) 100%)',
			},
		}).showToast();
		return;
	}
	const messageToSocket = {
		email: emailUser.value,
		typeMessage: typeMessage.value,
		message: messageUser.value,
	};
	socket.emit('newMessageFromChat', messageToSocket);

	[emailUser, messageUser, typeMessage].forEach((element) => {
		element.value = '';
	});
});

document.addEventListener('DOMContentLoaded', async (e) => {
	socket.on('initialMessageLoad', (data) => {
		if (data.error) {
			const errorContainer = document.querySelector('.welcomeMessageChat');
			errorContainer.textContent = `${data.error}`;
		}
		const { messages, percentage } = data;
		messages.forEach((message) => {
			let p = document.createElement('p');
			p.classList.add('messageChat');
			percentageReduction.textContent = ` ${percentage}%`;
			p.innerHTML = `<span class="email">${message.author.email}</span><span class= "date"> [${message.author.date}]:</span> <span class= "message">${message.message}</span>`;
			messagesContainer.prepend(p);
		});
	});
	quantityCart.textContent = 0;
	const responseDataProducts = await fetch(`${origin}/api/v1/productos`);
	const dataProducts = await responseDataProducts.json();
	if (!dataProducts.length) {
		errorContainer.classList.remove('hidden');
		const message = document.createElement('p');
		message.appendChild(
			document.createTextNode(
				'En este momento no tenemos productos en stock, comunicate con un administrador para que actualice la lista de productos.'
			)
		);
		errorContainer.appendChild(message);
	} else {
		errorContainer.classList.add('hidden');
		dataProducts.forEach((product) => {
			productsTemplate.querySelector('img').setAttribute('src', product.thumbnail);
			productsTemplate.querySelector('img').setAttribute('alt', `${product.productName}`);
			productsTemplate.querySelector('figcaption').textContent = product.productName;
			productsTemplate.querySelector('p').textContent = `$${product.price}`;
			productsTemplate.querySelector('.buyButton').setAttribute('data-productid', product.id);
			productsTemplate.querySelector('.deleteButton').setAttribute('data-productid', product.id);
			let clone = document.importNode(productsTemplate, true);
			fragment.appendChild(clone);
		});
		cards.appendChild(fragment);
	}
});

socket.on('newMessageToChat', (message) => {
	const { newMessageFormat, newPercentage } = message;
	percentageReduction.textContent = ` ${newPercentage}%`;
	let p = document.createElement('p');
	p.classList.add('messageChat');
	p.innerHTML = `<span class="email">${newMessageFormat.author.email}</span><span class= "date"> [${newMessageFormat.author.date}]:</span> <span class= "message">${newMessageFormat.message}</span>`;
	messagesContainer.prepend(p);
});

socket.on('errorChat', (message) => {
	let p = document.createElement('p');
	p.classList.add('messageChat');
	p.innerHTML = `<p class= "message">${message.error}</p>`;
});

document.addEventListener('click', async (e) => {
	if (e.target.matches('#btnLogout')) {
		try {
			const response = await fetch(`${origin}/api/v1/profile/logout`, {
				method: 'POST',
			});
			if (response.redirected) {
				location.href = response.url;
			}
		} catch (error) {
			toastyAlert(error.message);
		}
	}

	if (e.target.matches('.buyButton')) {
		if (quantityCart.textContent === '0') {
			try {
				const createCartResponse = await fetch(`${origin}/api/v1/carrito/`, {
					method: 'POST',
				});
				const dataCart = await createCartResponse.json();
				sessionStorage.setItem('cartId', dataCart.id);
				const addProductToCartResponse = await fetch(
					`${origin}/api/v1/carrito/${dataCart.id}/productos`,
					{
						headers: { 'Content-type': 'application/json; charset=UTF-8' },
						method: 'POST',
						body: JSON.stringify({ id: e.target.dataset.productid }),
					}
				);
				await addProductToCartResponse.json();

				quantityCart.textContent = parseInt(quantityCart.textContent) + 1;
				toastyAlert('You have added a product');
			} catch (error) {
				toastyAlert(error.message);
			}
		} else {
			try {
				const addProductToCartResponse = await fetch(
					`${origin}/api/v1/carrito/${sessionStorage.getItem('cartId')}/productos`,
					{
						headers: { 'Content-type': 'application/json; charset=UTF-8' },
						method: 'POST',
						body: JSON.stringify({ id: e.target.dataset.productid }),
					}
				);
				await addProductToCartResponse.json();
				quantityCart.textContent = parseInt(quantityCart.textContent) + 1;
				toastyAlert("You've added a product");
			} catch (error) {
				toastyAlert(error.message);
			}
		}
	}
	if (e.target.matches('.deleteButton')) {
		if (quantityCart.textContent === '0') {
			toastyAlert("there's not products in your cart");
		} else {
			try {
				const responseFromDelete = await fetch(
					`${origin}/api/v1/carrito/${sessionStorage.getItem('cartId')}/productos/${
						e.target.dataset.productid
					}`,
					{
						method: 'DELETE',
					}
				);
				const deleteData = await responseFromDelete.json();
				if (deleteData.code !== 0) {
					toastyAlert("You've deleted a product");
					quantityCart.textContent = parseInt(quantityCart.textContent) - 1;
				} else {
					toastyAlert("The product don't exist in your cart");
				}
			} catch (error) {
				toastyAlert(error.message);
			}
		}
	}

	if (e.target.matches('#btnOrder')) {
		const username = document.querySelector('#username');

		if (quantityCart.textContent <= '0') {
			toastyAlert('Your cart is empty!');
		} else {
			try {
				const responsefromOrder = await fetch(`${origin}/api/v1/order/`, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json; charset=UTF-8',
					},
					body: JSON.stringify({
						cartId: sessionStorage.getItem('cartId'),
						username: username.dataset.username,
					}),
				});
				if (responsefromOrder.ok) {
					const messageFromOrder = await responsefromOrder.json();
					toastyAlert(messageFromOrder.message);
					quantityCart.textContent = 0;
					sessionStorage.clear();
				}
			} catch (error) {
				toastyAlert(error.message);
			}
		}
	}
});
