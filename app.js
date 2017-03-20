/**
 * Tool for reading data from D-Link DSP-W215 Home Smart Plug.
 *
 * Usage: enter your PIN code to LOGIN_PWD, change value of HNAP_URL according to your device settings.
 *
 * @type {exports|module.exports}
 */

var soapclient = require('./js/soapclient');
var fs = require('fs');

var OUTPUT_FILE = "result.txt";
var LOGIN_USER = "<>";
var LOGIN_PWD = "<>";
var HNAP_URL = "http://<>/HNAP1";
var POLLING_INTERVAL = 60000;
var request = require('then-request');
var lanzar=false;
var lectura_anterior=0;

soapclient.login(LOGIN_USER, LOGIN_PWD, HNAP_URL).done(function (status) {
    if (!status) {
        throw "Login failed!";
    }
    if (status != "success") {
        throw "Login failed!";
    }
    start();
});

function start(){
    soapclient.on().done(function (result){
        console.log(result);
        read();
    })
};

function read() {
    soapclient.consumption().done(function (power) {
        soapclient.temperature().done(function (temperature) {
            console.log(new Date().toLocaleString(), power, temperature);
            save(power, temperature);
            setTimeout(function () {
                read();
            }, POLLING_INTERVAL);
        });
    })
}

function save(power, temperature) {
		if ((power>10&&lectura_anterior<=10)||(power<10&&lectura_anterior>=10)){
			request('POST', 'https://maker.ifttt.com/trigger/<>/with/key/<>', {json: {value1: +power}}).then(function (res) {
			lectura_anterior = power;
			console.log(res.statusCode);
		})};
}