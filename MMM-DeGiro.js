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
+ "<th>Naam</th><th>Aantal</th><th>Waarde</th>"
+ "<th><div>Totaal</div>"
+ "<div class='sub number'>{{currency}} {{totalFormat}}</div></th>"
+ "<th><div>Dagresultaat</div>"
+ "<div class='sub number {{#dayResultPositive}}positive{{/dayResultPositive}}{{#dayResultNegative}}negative{{/dayResultNegative}}'>"
+ "{{currency}} {{dayResultFormat}}"
+ "</div></th>"
+ "</tr>"
+ "{{#portfolio}}"
+ "<tr data-total='{{total}}'>"
+ "<td>{{name}}</td>"
+ "<td class='number'>{{size}}</td>"
+ "<td class='number'>{{currency}} {{priceFormat}}</td>"
+ "<td class='number'>{{currency}} {{totalFormat}}</td>"
+ "<td class='number {{#dayResultPositive}}positive{{/dayResultPositive}}{{#dayResultNegative}}negative{{/dayResultNegative}}'>"
+ "{{currency}} {{dayResultFormat}}"
+ "</td>"
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
				
				Log.info(JSON.stringify(payload.portfolio));
				var portfolio = payload.portfolio.map(m => this.mapPortfolioItems(m));				
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
					var product = payload.data[id];
										
					var dayResult = (this.portfolioItems[i].price - product.closePrice) * this.portfolioItems[i].size;
					var currency = payload.data[id].currency;
					if(currency == "EUR") currency = "€";
					if(currency == "USD") currency = "$";
					
					this.portfolioItems[i].currency = currency;
					this.portfolioItems[i].name = product.name;
					this.portfolioItems[i].dayResult = dayResult;
					this.portfolioItems[i].dayResultFormat = this.formatDecimal(dayResult,2);
					this.portfolioItems[i].dayResultPositive = dayResult > 0;
					this.portfolioItems[i].dayResultNegative = dayResult < 0;
				};
				
				var portfolio = this.portfolioItems;
				
				//Calculate the (sub)total of all
				var total = 0;
				var dayResult = 0;
				var currency = "EUR";
				if(portfolio.length > 0)
				{
					currency = portfolio[0].currency;	
					total = portfolio.reduce((a,b) => a.total+b.total);
					dayResult = portfolio.reduce((a,b) => a.dayResult+b.dayResult);			
				}
				
				var data = {
					portfolio: portfolio, 
					total: total, 
					totalFormat: this.formatDecimal(total),
					currency: currency, 
					dayResult: dayResult,
					dayResultFormat: this.formatDecimal(dayResult,2),
					dayResultPositive: dayResult > 0,
					dayResultNegative: dayResult < 0
				};
				
				
				var html = Mustache.render(this.config.portfolioTemplate, data);
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
		var priceFormat = this.formatDecimal(price,2);
		var totalFormat = this.formatDecimal(total);
		
		return { 
			id: portfolio.id,	
			size: size, 
			price: price,
			priceFormat: priceFormat,
			total: total,
			totalFormat: totalFormat,
			positionType: positionType
		}; 
	},	
	filterPortfolioOnAvailability: function (portfolio) {
		return portfolio.size != 0 && portfolio.positionType == "PRODUCT";
	},
	formatDecimal: function(decimal, digits) {
		if(digits === undefined)
			digits = 0;
		//todo: use this.language for the locale
		return decimal.toLocaleString('nl-NL', {maximumFractionDigits:digits});
	}
 });
 