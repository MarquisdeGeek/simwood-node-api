const request = require('request-promise-native');
const 
er = require('./server');

function init(config) {
	this.stub = 'https://api.simwood.com/v3';
	this.types = {
		NUMBERS: 'numbers',
		ACCOUNT: 'accounts',
		FILES: 'files',
		MESSAGING: 'messaging'
	};

function init(config) {
  this.stub = 'https://api.simwood.com/v3';
  this.types = {
    NUMBERS: 'numbers',
    ACCOUNT: 'accounts',
    FILES: 'files',
    MESSAGING: 'messaging',
  };

  this.config = config;


  return this;
}

function server(cb) {
  runServer(this.config.uri, cb, module.exports);
}

function apiGet(type, endpoint, { stub, config }) {
  const apistub = `${type}/${config.account}`;
  const url = `${stub}/${apistub}/${endpoint}`;

  return request.get(url)
    .auth(config.username, config.password, false)
}

function apiPut(type, endpoint, body, { stub, config }) {
  const apistub = `${type}/${config.account}`;
  const url = `${stub}/${apistub}/${endpoint}`;

  const options = {
    method: 'PUT',
    uri: url,
    body: JSON.stringify(body)
  };
  return request(options)
    .auth(config.username, config.password, false)
}

function apiPost(type, endpoint, body, { stub, config }) {
  const apistub = `${type}/${config.account}`;
  const url = `${stub}/${apistub}/${endpoint}`;

  const options = {
    method: 'POST',
    uri: url,
    body: JSON.stringify(body)
  };

  return request(options)
    .auth(config.username, config.password, false)
}

function apiDelete(type, endpoint, { stub, config }) {
  const apistub = `${type}/${config.account}`;
  const url = `${stub}/${apistub}/${endpoint}`;

  return request.delete(url)
    .auth(config.username, config.password, false)
}

function accountGetDetails(SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    apiGet(SETTINGS.types.ACCOUNT, 'prepay/balance', SETTINGS)
      .then((r) => {
        r = JSON.parse(r);
        resolve({ success: true, data: { balance: r[0].balance, currency: r[0].currency } });
      })
      .catch((e) => e)
  });
}

function accountGetSummary(SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    apiGet(SETTINGS.types.ACCOUNT, 'reports/voice/summary/day/in', SETTINGS)
      .then((r) => {
        r = JSON.parse(r);
        return apiGet(SETTINGS.types.FILES, r.hash, SETTINGS);
      })
      .then((r) => {
        resolve({ success: true, data: r });
      })
      .catch((e) => e)
  });
}

function filesGetList(SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    apiGet(SETTINGS.typesFILES, '', SETTINGS)
      .then((r) => {
        r = JSON.parse(r);
        resolve({ success: true, data: r });
      })
      .catch((e) => e)
  });
}

function numberAllocate(number, SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    apiPut(SETTINGS.types.NUMBERS, 'allocated/${number}')
      .then((r) => {
        r = JSON.parse(r);
        resolve({ success: true, data: r });
      })
      .catch((e) => e)
  });
}

function numberConfigure(number, config, SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    apiPut(SETTINGS.types.NUMBERS, 'allocated/${number}/config', config, SETTINGS)
      .then((r) => {
        r = JSON.parse(r);
        resolve({ success: true, data: r });
      })
      .catch((e) => e)
  });
}

function numberConfigureRemove(number, config, SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    apiDelete(SETTINGS.types.NUMBERS, 'allocated/${number}/config', config, SETTINGS)
      .then((r) => {
        r = JSON.parse(r);
        resolve({ success: true, data: r });
      })
      .catch((e) => e)
  });
}

function numberDelete(number, SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    apiDelete(SETTINGS.types.NUMBERS, 'allocated/${number}', SETTINGS)
      .then((r) => {
        r = JSON.parse(r);
        resolve({ success: true, data: r });
      })
      .catch((e) => e)
  });
}

function messagingSmsSend(number_from, number_to, text, options = {}, SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    const message = {
      number_from,
      number_to,
      message: text,
      ...options
    };

    apiPost(SETTINGS.types.MESSAGING, `sms`, message, SETTINGS)
      .then((r) => {
        resolve(r);
      })
      .catch((e) => e)

  });
}

function numberConfigureRedirectPSTN(number, targetNumber, params, SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    const config = {
      "routing": {
        "default": [[{
          "type": "pstn",
          "number": targetNumber,
          "delay": params.delay || 1,
          "timeout": params.timeout || 20
		 }]]
      }
    };

    apiPut(SETTINGS.types.NUMBERS, `allocated/${number}/config`, config, SETTINGS)
      .then((r) => {
        resolve(r);
      })
      .catch((e) => e)

  });
}

function numberConfigureBusy(number, SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    const config = {
      "routing": {
        "default": [[{
          "type": "busy"
		 }]]
      }
    };

    apiPut(SETTINGS.types.NUMBERS, `allocated/${number}/config`, config, SETTINGS)
      .then((r) => {
        resolve(r);
      })
      .catch((e) => e)

  });
}

function numberConfigureSmsReceive(number, mode = 'http_json', SETTINGS = this) {
  return new Promise(function (resolve, reject) {
    const config = {
      mode,
      endpoint: `${SETTINGS.config.uri}/sms`
    };
    apiPut(SETTINGS.types.NUMBERS, `allocated/${number}/sms`, config, SETTINGS)
      .then((r) => {
        resolve(r);
      })
      .catch((e) => e)

  });
}

module.exports = {
  init,
  server,
  accountGetDetails,
  accountGetSummary,
  //
  filesGetList,
  //
  numberAllocate,
  numberConfigure,
  numberDelete,
  //
  messagingSmsSend,
  //
  // Helpers
  //
  numberConfigureRedirectPSTN,
  numberConfigureSmsReceive,
  numberConfigureBusy

}
