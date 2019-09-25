/* Magic Mirror
 * Module: DeGiro
 *
 * By Prog Party! https://github.com/Prog-Party
 * Jens (Epic) den Braber & Dennis (Awesome) Rosenbaum
 * MIT Licensed.
 */
 
 Module.register("MMM-DeGiro" ,{
	// Define module defaults
	defaults: {
		showCashFunds: true,
		showPortfolio: false,
		showClientInfo: false
	},
	// Define required scripts.
	getScripts: function() {
		return [
			this.file("js/jquery-3.4.1.min.js"),
			this.file("js/jsrender.min.js"),
			this.file("js/degiro_template.js"),
			this.file("js/degiro.js")
		];
	},
	// Define styles.
	getStyles: function() {
		return [this.file("css/degiro_styles.css")];
	},
	//// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		Log.info("showCashFunds:  " + this.config.showCashFunds);
		Log.info("showPortfolio:  " + this.config.showPortfolio);
		Log.info("showClientInfo: " + this.config.showClientInfo);
		
		this.wrapper = document.createElement("div");
		//this.wrapper.innerHTML = "MMM-DeGiro";
		
		this.degirowrapper = new DeGiroWrapper();

		this.deGiroCashFundsDiv = document.createElement("div").setAttribute("id", "deGiroCashFundsDiv");;

		this.wrapper.innerHTML = $("#deGiroCashFundsDiv");

		var self = this;
		setInterval(function() {
			
			//Log.info("self.degirowrapper: " + self.degirowrapper);
			//Log.info("self.degirowrapper.getCashFunds(): " + self.degirowrapper.getCashFunds());
					
			if(self.config.showCashFunds) {
				//var cashfunds = degirowrapper.getCashFunds();

				//this.wrapper.html(cashfunds);
				
				var cashFunds = self.degirowrapper.getCashFunds();
				Log.info("cashFunds: " + cashFunds);

				$("#deGiroCashFundsDiv").html($.render.cashFundsTemplate(cashFunds));
				//Log.info("html: " + html);

				//self.deGiroCashFundsDiv.innerHTML = html;
				//Log.info("this.deGiroCashFundsDiv.innerHTML" + self.deGiroCashFundsDiv.innerHTML)
				
				//var tmpl = jsrender.templates('Name: {{:name}}<br/>'); // Compile template from string

				//var html = tmpl.render({name: "Jim"}); // Render
				// result: "Jim Varsov"
			
	//	var divContent = '<table><tbody id="deGiroCashFunds"></tbody></table><div class="divTable" id="deGiroCashFunds"><div class="divTableBody"><div class="divTableRow"><div class="divTableCell">Currency</div><div class="divTableCell">Value</div><div class="divTableCell">valueBaseCurr</div><div class="divTableCell">Rate</div></div>";
	//	divContent = divContent + <script id="deGiroCashFundsTemplate" type="text/x-jsrender">{^{for cashFunds}}<div class="divTableRow"><div class="divTableCell">{{:name}}</div><div class="divTableCell">{{:value}}</div><div class="divTableCell">{{:valueBaseCurr}}</div><div class="divTableCell">{{:rate}}</div></div>  {{/for}}</script>
	//		divContent = divContent + "</div></div>';		
				

				//for(var i = 0; i < cashFunds.length; i++)
				//{
				//	var cashFund = cashFunds[i];
			//		divContent += `<div>${cashFund.name} ${cashFund.value} (ID: ${cashFund.id})</div>`;
		//		}

			//	var newDiv = `<div>${divContent}</div>`;

				
				// app.get('/...', function(req, res) {
				//   res.send(html);
				// });
				
				//self.wrapper.innerHTML = html;
				//self.wrapper.innerHTML = divContent;
				
				//self.wrapper.innerHTML("cashfunds()");
			}

			if(this.config.showPortfolio) {
				//var portfolio = degirowrapper.getPortfolio();

				//this.wrapper.innerHTML(portfolio);
			}

			if(this.config.showClientInfo) {
				//var clientInfo = degirowrapper.getClientInfo();

				//this.wrapper.innerHTML(clientInfo);
			}
						
			self.updateDom();			
		}, 1000);
	},
	// Override dom generator.
	getDom: function() {
		
		//if(showCashFunds) {
			//var cashfunds = degiro.getCashFunds();
			
			//wrapper.html(cashfunds);					
		//}
		
		//if(showPortfolio) {
			//var portfolio = degiro.getPortfolio();
			
			//wrapper.html(portfolio);
		//}
		
		//if(showClientInfo) {
			//var clientInfo = degiro.getClientInfo();
			
			//wrapper.html(clientInfo);
		//}
		
		return this.wrapper;
	}
 });
 
