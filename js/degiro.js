/* global Class */

/* Magic Mirror
 * Module: DeGiro
 *
 * By Prog Party! https://github.com/Prog-Party
 * Jens (Epic) den Braber & Dennis (Awesome) Rosenbaum
 * MIT Licensed.
 * 
 */


//const degiro = DeGiro.create({
//    // username: 'your-username',
//    // password: 'your-password',
//});

//degiro.login().then(degiro.getCashFunds)
//.then(console.log)
//.catch(console.error);

class DeGiroWrapper {
	constructor() {
		Log.info("Starting DeGiroWrapper()");
//		const DeGiro = require('degiro');
//		const degiro = DeGiro.create();
		
		//const degiro = DeGiro.create({
		//    // username: 'your-username',
		//    // password: 'your-password',
		//});
		
//		degiro.login().catch(console.error);
	}
	
	getCashFunds() {
		//return "getCashFund()";
		return "{   cashFunds: [     {id: '2', name: 'EUR', value: 1935.8, valueBaseCurr: 1935.8, rate: 1},     {id: '9885', name: 'USD', value: 0, valueBaseCurr: 0, rate: 0.9102},   ] }";
		//return degiro.getCashFunds().catch(console.error);
	}
	
	getPortfolio() {
		
		return "getPortfolio()";
		//return '{"portfolio": [			{			   "name": "positionrow",			   "id": 1156604,			   "value": [				 {				   "name": "id",				   "value": "1156604",				   "isAdded": true				 },				 {				   "name": "product",				   "value": "DEUTSCHE BANK AG COMMO",				   "isAdded": true				 }]			}]		}"
		
		////return degiro.getPortfolio().catch(console.error);
	}
	
	//getClientInfo() {
		//return "getClientInfo()"; // degiro.getClientInfo().catch(console.error);
	//}
}
	
