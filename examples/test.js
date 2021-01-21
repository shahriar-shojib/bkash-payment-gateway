const sqrt = num => {
	return new Promise(r => {
		setTimeout(() => {
			r(Math.sqrt(num));
		});
	});
};
const randNum = () => {
	return new Promise(r => {
		setTimeout(() => {
			r(Math.round(Math.random() * 10));
		});
	});
};
const asyncLogger = item => {
	return new Promise(r => {
		setTimeout(() => {
			console.log(item);
			r();
		});
	});
};

async function* sqrtAsync() {
	const randArr = [...Array(1000000)].map(randNum);
	for await (let item of randArr) {
		yield await sqrt(item);
	}
}

const iterator = sqrtAsync();
const test = async () => {
	for await (let x of iterator) {
		asyncLogger(x);
	}
};
module.exports = { test };
