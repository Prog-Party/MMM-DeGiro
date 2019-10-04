/* Magic Mirror
 * Module: DeGiro
 *
 * By Prog Party! https://github.com/Prog-Party
 * Jens (Epic) den Braber & Dennis (Awesome) Rosenbaum
 * MIT Licensed.
 */
 
 var DeGiroServer;
 
 Module.register("MMM-DeGiro" ,{
	defaults: {
		username: "",
		password: "",
		showCashFunds: false,
		cashFundsTemplate: "{{#cashFunds}}<div>{{name}} {{value}}</div>{{/cashFunds}}", 
		showPortfolio: true,
		portfolioTemplate: "<table>" 
+ "<tr>"
+ "<th>Naam</th><th>Aantal</th><th>Waarde</th><th>Totaal</th><th>Dagresultaat</th>"
+ "</tr>"
+ "{{#portfolio}}"
+ "<tr data-total='{{total}}'>"
+ "<td>{{name}}</td>"
+ "<td>{{size}}</td>"
+ "<td>{{currency}} {{price}}</td>"
+ "<td>{{currency}} {{total}}</td>"
+ "<td class='{{#dayResultPositive}}positive{{/dayResultPositive}}{{#dayResultNegative}}negative{{/dayResultNegative}}'>{{currency}} {{dayResult}}</td>"
+ "</tr>"
+ "{{/portfolio}}"
+ "</table>"

	},
	getScripts: function() {
		return [
			this.file("js/jquery-3.4.1.min.js"),
			this.file("js/mustache.min.js")
		];
	},
	getStyles: function() {
		return [this.file("css/degiro_styles.css")];
	},
	start: function() {
		DeGiroServer = this;
		Log.info("Starting module: " + this.name);
		Log.info("showCashFunds:   " + this.config.showCashFunds);
		Log.info("showPortfolio:   " + this.config.showPortfolio);
		
		var html = "<div id='deGiroCashFundsDiv'></div>";
		html += "<div id='deGiroPortfolioDiv'></div>";
				
		this.wrapper = document.createElement("div");
		this.wrapper.id = "DeGiroWrapper";
		$(this.wrapper).html(html);

		this.executeGetDeGiro();

		var self = this;
		setInterval(function() { self.executeGetDeGiro(); }, 1000 * 60 * 10); //every 10 minutes
	},
	executeGetDeGiro: function() {
		var payload = {username: this.config.username, password: this.config.password};
			
		if(this.config.showCashFunds) {
			Log.info("Retrieve deGiro cashfund");
			DeGiroServer.sendSocketNotification("getCashFunds", payload);
		}
		if(this.config.showPortfolio) {
			Log.info("Retrieve deGiro portfolio");
			DeGiroServer.sendSocketNotification("getPortfolio", payload);
		}		
	},
	getDom: function() {
		return this.wrapper;
	}, 
	socketNotificationReceived: function(notification, payload) {			
		switch(notification) {
			case "cashFundsReceived":
				Log.info("Received deGiro cashfund");
				
				var html = Mustache.render(this.config.cashFundsTemplate, payload);
				Log.info(html);
				$("#deGiroCashFundsDiv").html(html);
				this.updateDom();	
				break;
			case "portfolioReceived":
				Log.info("Received deGiro portfolio");
				
				var portfolio = payload.portfolio.map(this.mapPortfolioItems);				
				var filteredPayload = portfolio.filter(this.filterPortfolioOnAvailability);
				this.portfolioItems = filteredPayload;
				
				var productIdsPayload = {
					username: this.config.username, 
					password: this.config.password,
					productIds: filteredPayload.map(p => p.id)
				};
				DeGiroServer.sendSocketNotification("getProductIds", productIdsPayload);
				break;
			case "productIdsReceived":
				Log.info("Product ids received");
				Log.info(payload);
				Log.info(this.portfolioItems);
				for(var i = 0; i < this.portfolioItems.length; i++)
				{
					var id = this.portfolioItems[i].id;
					this.portfolioItems[i].name = payload.data[id].name;
					
					var currency = payload.data[id].currency;
					if(currency == "EUR") currency = "€";
					if(currency == "USD") currency = "$";
					this.portfolioItems[i].currency = currency;
				};
				
				var newPayload = {portfolio: this.portfolioItems};
				var html = Mustache.render(this.config.portfolioTemplate, newPayload);
				$("#deGiroPortfolioDiv").html(html);
				this.updateDom();	
				break;
		}
	},
	mapPortfolioItems: function(portfolio) {
		var values = portfolio.value;
		var size = 0;
		var price = 0.0;
		var total = 0.0;
		var positionType = "";
		var dayResult = 0.0;
		
		for(var i=0; i < values.length; i++) {
			var name = values[i].name;
			var value = values[i].value;
			
			if(name == "size") 
				size = value;
			if(name == "price")
				price = value;
			if(name == "value")
				total = value;
			if(name == "positionType")
				positionType = value;
			if(name == "todayRealizedProductPl")
				dayResult = value;
		}
		
		return { 
			id: portfolio.id,	
			size: size, 
			price: price,
			total: total,
			positionType: positionType,
			dayResult: dayResult,
			dayResultPositive: dayResult > 0,
			dayResultNegative: dayResult < 0,
		}; 
	},	
	filterPortfolioOnAvailability: function (portfolio) {
		return portfolio.size != 0 && portfolio.positionType == "PRODUCT";
	}
 });
 