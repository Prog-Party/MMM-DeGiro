/* Magic Mirror
 * Module: DeGiro
 *
 * By Prog Party! https://github.com/Prog-Party
 * Jens (Epic) den Braber & Dennis (Awesome) Rosenbaum
 * MIT Licensed.
 */
 
var NodeHelper = require("node_helper");
var DeGiro = require("degiro");

module.exports = NodeHelper.create({
	start: function() {
	},
	
	socketNotificationReceived: function(notification, payload) {
		switch(notification) {
			case "getCashFunds":
				console.log("Retrieving cash funds");
				var degiro = this.getDeGiroInstance(payload);
				
				var self = this;
				degiro.login()
					  .then(degiro.getCashFunds)
					  .then(
							function(response) {
								self.sendSocketNotification("cashFundsReceived", response);	
							})
					  .catch(console.error);								
			break;
			case "getPortfolio":
				console.log("Retrieving portfolio");
				var degiro = this.getDeGiroInstance(payload);
				var self = this;
				degiro.login()
					  .then(degiro.getPortfolio)
					  .then(function(response) {
								self.sendSocketNotification("portfolioReceived", response);	
							})
					  .catch(console.error);
			break;
			case "getProductIds":
				console.log("Retrieving product id's");
				var degiro = this.getDeGiroInstance(payload);
				var self = this;
				degiro.login()
					  .then(function() {
							return degiro.getProductsByIds(payload.productIds);
						})
					  .then(function(response) {
								self.sendSocketNotification("productIdsReceived", response);	
							})
					  .catch(console.error);
			break;
		}
	},
	
	 getDeGiroInstance: function(payload) {
		 var degiro = DeGiro.create({ 
		      username: payload.username,
		      password: payload.password,
		 });

		 return degiro;
	 }
})