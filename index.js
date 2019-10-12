const request = require('request-promise-native');

function init(config) {
	this.stub = 'https://api.simwood.com/v3';
	this.types = {
		NUMBERS: 'numbers',
		ACCOUNT: 'accounts',
		FILES: 'files'
	};

	this.config = config;

	return this;
}

function apiGet(type, endpoint, {stub, config}) {
	const apistub = `${type}/${config.account}`;
	const url = `${stub}/${apistub}/${endpoint}`;


	return request.get(url).auth(config.username, config.password, false)
}

function apiPut(type, endpoint, body, {stub, config}) {
	const apistub = `${type}/${config.account}`;
	const url = `${stub}/${apistub}/${endpoint}`;

	const options = {
		method: 'PUT',
		uri: url,
		body: JSON.stringify(body)
	};
	return request(options).auth(config.username, config.password, false)
}

function apiPost(type, endpoint, body, {stub, config}) {
	const apistub = `${type}/${config.account}`;
	const url = `${stub}/${apistub}/${endpoint}`;
	
	const options = {
		method: 'POST',
		uri: url,
		body: JSON.stringify(body)
	};

	return request(options).auth(config.username, config.password, false)
}


function apiDelete(type, endpoint, {stub, config}) {
	const apistub = `${type}/${config.account}`;
	const url = `${stub}/${apistub}/${endpoint}`;

	return request.delete(url).auth(config.username, config.password, false)
}


function accountGetDetails(SETTINGS = this) {
	return new Promise(function(resolve, reject) {
		apiGet(SETTINGS.types.ACCOUNT, 'prepay/balance', SETTINGS)
		.then((r) => {
			r = JSON.parse(r);
			resolve({ success:true, data: {balance: r[0].balance, currency: r[0].currency }});
		})
		.catch((e) => e)
	});
}

function accountGetSummary(SETTINGS = this) {
	return new Promise(function(resolve, reject) {
		apiGet(SETTINGS.types.ACCOUNT, 'reports/voice/summary/day/in', SETTINGS)
		.then((r) => {
			r = JSON.parse(r);
			return apiGet(SETTINGS.types.FILES, r.hash, SETTINGS);
		})
		.then((r) => {
			resolve({ success:true, data: r });
		})
		.catch((e) => e)
	});
}

function filesGetList(SETTINGS = this) {
	return new Promise(function(resolve, reject) {
		apiGet(SETTINGS.typesFILES, '', SETTINGS)
		.then((r) => {
			r = JSON.parse(r);
			resolve({ success:true, data: r });
		})
		.catch((e) => e)
	});
}

function numberAllocate(number, SETTINGS = this) {
	return new Promise(function(resolve, reject) {
		apiPut(SETTINGS.types.NUMBERS, 'allocated/${number}')
		.then((r) => {
			r = JSON.parse(r);
			resolve({ success:true, data: r });
		})
		.catch((e) => e)
	});
}

function numberConfigure(number, config, SETTINGS = this) {
	return new Promise(function(resolve, reject) {
		apiPut(SETTINGS.types.NUMBERS, 'allocated/${number}/config', config, SETTINGS)
		.then((r) => {
			r = JSON.parse(r);
			resolve({ success:true, data: r });
		})
		.catch((e) => e)
	});
}

function numberConfigureRemove(number, config, SETTINGS = this) {
	return new Promise(function(resolve, reject) {
		apiDelete(SETTINGS.types.NUMBERS, 'allocated/${number}/config', config, SETTINGS)
		.then((r) => {
			r = JSON.parse(r);
			resolve({ success:true, data: r });
		})
		.catch((e) => e)
	});
}

function numberDelete(number, SETTINGS = this) {
	return new Promise(function(resolve, reject) {
		apiDelete(SETTINGS.types.NUMBERS, 'allocated/${number}', SETTINGS)
		.then((r) => {
			r = JSON.parse(r);
			resolve({ success:true, data: r });
		})
		.catch((e) => e)
	});
}

function numberConfigureRedirectPSTN(number, targetNumber, SETTINGS = this) {
	return new Promise(function(resolve, reject) {
		const config = {
		 "routing": { "default": [ [ {
		 	"type": "pstn",
		 	"number": targetNumber
		 } ] ] }
		};

		apiPut(SETTINGS.types.NUMBERS, `allocated/${number}/config`, config, SETTINGS)
		.then((r) => {
			resolve(r);
		})
		.catch((e) => e)

	});
}

function numberConfigureBusy(number, SETTINGS = this) {
	return new Promise(function(resolve, reject) {
		const config = {
		 "routing": { "default": [ [ {
		 	"type": "busy"
		 } ] ] }
		};

		apiPut(SETTINGS.types.NUMBERS, `allocated/${number}/config`, config, SETTINGS)
		.then((r) => {
			resolve(r);
		})
		.catch((e) => e)

	});
}

module.exports =  {
	init,
	accountGetDetails,
	accountGetSummary,
	//
	filesGetList,
	//
	numberAllocate,
	numberConfigure,
	numberDelete,
	//
	// Helpers
	//
	numberConfigureRedirectPSTN,
	numberConfigureBusy
}