import { dataToSocket, dataToDataBase, renderProductsOnTable } from './helpers.js';

const postBtn = document.querySelector('#postBtn');
const updateBtn = document.querySelector('#putBtn');
const deleteBtn = document.querySelector('#deleteBtn');
const idProduct = document.querySelector('#productId');
const product = document.querySelector('#product');
const price = document.querySelector('#price');
const image = document.querySelector('#image');
const errorContainer = document.querySelector('#errorContainer');
const productContainer = document.querySelector('#productsContainer');
const btnLogout = document.querySelector('#btnLogout');
const emailUser = document.querySelector('#emailUser');
const messageUser = document.querySelector('#messageUser');
const typeMessage = document.querySelector('#type');
const btnSendChatMessage = document.querySelector('#btnSendChatMessage');
const messagesContainer = document.querySelector('#messages');
const percentageReduction = document.querySelector('#percentageReduction');
const origin1 = window.location.origin;
const origin = window.location.origin;
const origin2 = window.location.host;
const origin3 = window.location.href;
console.log('origin', origin1);
console.log('host', origin2);
console.log('href', origin3);

const socket = io({
	autoConnect: false,
	reconnection: false,
});

socket.connect();

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

btnLogout.addEventListener('click', async (e) => {
	const response = await fetch(`${origin}/api/v1/profile/logout`, {
		method: 'POST',
	});
	if (response.redirected) {
		location.href = response.url;
	}
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

document.addEventListener('DOMContentLoaded', () => {
	const { origin } = window.location;
	socket.on('initialLoad', async (data) => {
		if (data.error) {
			errorContainer.classList.add('errorContainer');
			errorContainer.classList.remove('hidden');
			return (errorContainer.innerHTML = data.error);
		}
		const tableToHTML = await renderProductsOnTable(data, origin);
		productContainer.innerHTML = tableToHTML;
	});

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
});

document.addEventListener('click', (e) => {
	if (e.target.type !== 'checkbox') return;
	const checkboxes = document.querySelectorAll('#idRetriever');
	if (e.target.checked === true) {
		checkboxes.forEach((item) => {
			if (item !== e.target) item.checked = false;
		});
		idProduct.value = e.target.value;
		postBtn.setAttribute('disabled', 'true');
		postBtn.classList.add('btn-disable');
	}
	if (e.target.checked === false) {
		idProduct.value = '';
		postBtn.removeAttribute('disabled');
		postBtn.classList.remove('btn-disable');
	}
});

socket.on('prueba', async (data) => {
	if (data.error) {
		errorContainer.classList.add('errorContainer');
		errorContainer.classList.remove('hidden');
		return (errorContainer.innerHTML = data.error);
	}
	const tableToHTML = await renderProductsOnTable(data, origin);
	productContainer.innerHTML = tableToHTML;
});

socket.on('newDataAfterDeletion', async (data) => {
	if (data.error) {
		errorContainer.classList.add('errorContainer');
		errorContainer.classList.remove('hidden');
		return (errorContainer.innerHTML = data.error);
	}
	const tableToHTML = await renderProductsOnTable(data, origin);
	productContainer.innerHTML = tableToHTML;
});

socket.on('dataUpdated', async (data) => {
	if (data.error) {
		errorContainer.classList.add('errorContainer');
		errorContainer.classList.remove('hidden');
		return (errorContainer.innerHTML = data.error);
	}
	const tableToHTML = await renderProductsOnTable(data, origin);
	productContainer.innerHTML = tableToHTML;
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

postBtn.addEventListener('click', async (e) => {
	e.preventDefault();
	const newProductToDataBase = dataToDataBase(image.files, product.value, price.value);
	const newProductToSocket = dataToSocket(image.value, product.value, price.value);
	const response = await fetch(`${origin}/api/v1/productos`, {
		method: 'POST',
		body: newProductToDataBase,
	});
	if (!response.ok) {
		errorContainer.classList.add('errorContainer');
		errorContainer.classList.remove('hidden');
		errorContainer.innerHTML = 'Error: Something went wrong.';
	} else {
		socket.emit('sendOneProduct', newProductToSocket);
	}

	product.value = '';
	price.value = '';
});

deleteBtn.addEventListener('click', async (e) => {
	e.preventDefault();
	const productId = idProduct.value;
	const response = await fetch(`${origin}/api/v1/productos/${productId}`, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
		},
		body: null,
	});
	if (!response.ok) {
		errorContainer.classList.add('errorContainer');
		errorContainer.classList.remove('hidden');
		errorContainer.innerHTML = 'Error: Something went wrong.';
	} else {
		socket.emit('productDeleted', productId);
	}
	postBtn.removeAttribute('disabled');
	postBtn.classList.remove('btn-disable');
	idProduct.value = '';
});

updateBtn.addEventListener('click', async (e) => {
	e.preventDefault();
	let productId = idProduct.value;
	if (!productId) throw new Error('Debe ingresar el id del producto a actualizar');

	const productUpdatedToDataBase = dataToDataBase(image.files, product.value, price.value);

	const productUpdatedToSocket = dataToSocket(image.value, product.value, price.value);

	const response = await fetch(`${origin}/api/v1/productos/${productId}`, {
		method: 'PUT',
		body: productUpdatedToDataBase,
	});
	if (!response.ok) {
		errorContainer.classList.add('errorContainer');
		errorContainer.classList.remove('hidden');
		errorContainer.innerHTML = `Error: Something went wrong. ${response.message}`;
	} else {
		socket.emit('productUpdate', { productId, ...productUpdatedToSocket });
	}
	postBtn.removeAttribute('disabled');
	postBtn.classList.remove('btn-disable');
	product.value = '';
	price.value = '';
	idProduct.value = '';
});
