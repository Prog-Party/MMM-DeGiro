# MMM-DeGiro
A MagicMirror² (https://magicmirror.builders) module to display your data from the DeGiro broker.

## Installation
1. Navigate into your MagicMirror's `~MagicMirror` folder
1. Install the DeGiro API with `npm install degiro --save` 
1. Navigate into your MagicMirror's `~MagicMirror/modules` folder
1. Execute `git clone https://github.com/Prog-Party/MMM-DeGiro.git`
1. A new folder `MMM-DeGiro` will appear, navigate into it by `cd MMM-DeGiro`
1. Install with `npm install`

## Configuration
Add this to your modules array in the configuration file `config/config.js`

```
{
	module: "MMM-DeGiro",
	config: {
		username: "<YOUR_USERNAME>",
		password: "<YOUR_PASSWORD>",
		showPortfolio: true,	
		portfolioTemplate: "<YOUR_TEMPLATE>"
	}
}
```

### Simple Version
```default template
	"<table>" 
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
```
