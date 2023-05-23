const percentageCalculator = (initialValue, endValue) => {
	return (((initialValue - endValue) / initialValue) * 100).toFixed(1);
};

const randomNumbers = (max) => {
	const numbers = [];
	const numObj = {};
	for (let i = 0; i < max; i++) {
		const number = Math.floor(Math.random() * max) + 1;
		numbers.push(number);
	}

	numbers.forEach((num) => {
		numObj[num] = (numObj[num] || 0) + 1;
	});

	return numObj;
};

process.on('message', (message) => {
	if (message.action === 'go') {
		const result = randomNumbers(message.value);
		process.send(result);
	}
});

const capitalize = (word) => {
	const array = word.split('').shift().toUpperCase();
	const newArray = word.split('').slice(1, word.length).join('');
	return array + newArray;
};

export { percentageCalculator, randomNumbers, capitalize };
