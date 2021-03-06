// ALL VAR
var unlock = 'UNLOCKED';
var netcurrentblock = '';
var netdiff = '';
var title1 = '';
var title2 = '';
var maturity1 = '';
var maturity2 = '';
var maturity3 = '';
var maturity4 = '';
var maturity5 = '';
var currentdate = '';
var currentdate2 = '';
var validValue = 'true';
var chainHeight = '';
var lastpoolroundhash = '';
var lastvalidblock = '';

// TITLE
function UpdateTitle(){
	$('title').html(title1+' H/s - '+title2+' Blocks');	 // BROWSER TITLE
}

// NETWORK
function UpdateNetworkStats(){
	$.getJSON("https://"+yourpool+"/api/network/stats", function(data) {
			$("#netcurrentblock span").html((data.height).toLocaleString());	// NETWORK CURRENT BLOCK
			netcurrentblock = data.height;
			networkblockfound = data.ts * 1000;
			currentdate = new Date();
			currentdate2 = currentdate.getTime();
			networktime = parseInt(currentdate2) - parseInt(networkblockfound);
			networkdate = new Date(networktime);
			networkminute = networkdate.getUTCMinutes();
			datenetworkblockfound = new Date(networkblockfound);
			datestringnetworkblockfound = datenetworkblockfound.toLocaleString();
			$("#datenetworkblockfound span").html(datestringnetworkblockfound);	//  NETWORK DATE BLOCK FOUND
			$("#networktime span").html(networkminute+' minutes');	// NETWORK LAST BLOCK FOUND			
			$("#diff span").html((data.difficulty).toLocaleString());	// NETWORK DIFF
			$("#reward span").html(data.value / 1000000000000); // NETWORK REWARD
			netdiff = parseInt(data.difficulty);
			$("#networkhashrate span").html((netdiff / 120 / 1000000).toFixed(1));	// NETWORK HASHRATE
	UpdatePoolStats();
	});

}

// POOL
function UpdatePoolStats(){
	$.getJSON("https://"+yourpool+"/api/pool/blocks/pplns?limit=5", function(data) {
			lastvalidblock = data[0].valid;
			lastpoolroundhash = parseInt(data[0].shares);
			lastnetdiff = parseInt(data[0].diff);
			if (validValue = data[0].valid){
				if (validValue = data[1].valid){$("#lastblockluck span").html(parseInt(((lastpoolroundhash / lastnetdiff) * 100).toFixed(0)));
					} else {$("#lastblockluck span").html(parseInt((((parseInt(data[0].shares) + parseInt(data[1].shares)) / parseInt(data[1].diff) * 100).toFixed(0))));}
			} else {$("#lastblockluck span").html(parseInt(((parseInt(data[1].shares) / parseInt(data[1].diff) * 100).toFixed(0))));};
			chainHeight = parseInt(netcurrentblock);
			if (validValue = data[0].valid){
			maturity1 = 60 - (chainHeight - data[0].height);
			} else {maturity1 = 0};
			if (validValue = data[1].valid){
			maturity2 = 60 - (chainHeight - data[1].height)
			} else {maturity2 = 0};
			if (validValue = data[2].valid){
			maturity3 = 60 - (chainHeight - data[2].height);
			} else {maturity3 = 0};
			if (validValue = data[3].valid){
			maturity4 = 60 - (chainHeight - data[3].height);
			} else {maturity4 = 0};
			if (validValue = data[4].valid){
			maturity5 = 60 - (chainHeight - data[4].height);
			} else {maturity5 = 0};
	UpdateMaturity();
	});

	$.getJSON("https://"+yourpool+"/api/pool/stats/pplns", function(data) {
			$("#currentblock span").html((data.pool_statistics.lastBlockFound).toLocaleString());	// POOL CURRENT BLOCK
			currentblock = parseInt(data.pool_statistics.lastBlockFound);
			$("#network-poolblock span").html(chainHeight - currentblock);	// POOLtoNETWORK BLOCK
			$("#poolhashrate span").html((data.pool_statistics.hashRate / 1000).toFixed(1));
			$("#roundhash span").html((data.pool_statistics.roundHashes).toLocaleString());
			roundhash = parseInt(data.pool_statistics.roundHashes);
			if (validValue = lastvalidblock){ 	//POOL CURRENT LUCK
				$("#luck span").html(parseInt(((roundhash / netdiff) * 100).toFixed(0)));}
			else {$("#luck span").html(parseInt((((roundhash + lastpoolroundhash)  / netdiff) * 100).toFixed(0)));}
			blockfound = data.pool_statistics.lastBlockFoundTime * 1000;
			time = parseInt(currentdate2) - parseInt(blockfound);
			date = new Date(time);
			hour = date.getUTCHours();
			minute = date.getUTCMinutes();
			dateblockfound = new Date(blockfound);
			datestringblockfound = dateblockfound.toLocaleString();
			$("#dateblockfound span").html(datestringblockfound); // POOL DATE BLOCK FOUND
			if (time < 3600000) {	// POOL LAST BLOCK FOUND
				$("#time span").html(minute+' minutes');
			} else {$("#time span").html(hour+' hours '+minute+' minutes');}
			$("#totalblockfound span").html(data.pool_statistics.totalBlocksFound);	// POOL TOTAL BLOCK FOUND
			title2 = parseInt(data.pool_statistics.totalBlocksFound);
	});
}

// MINERS
function UpdateMinerStats(){
	$.getJSON("https://"+yourpool+"/api/miner/"+wallet+"/stats", function(data) {
			$("#totaldue span").html((data.amtDue / 1000000000000).toFixed(10));	// MINER PENDING BALANCE
			$("#totalpaid span").html((data.amtPaid / 1000000000000).toFixed(10));	// MINER TOTAL PAID			
			$("#totalhash span").html(data.totalHashes);	// MINER TOTAL HASH
			$("#hashrate span").html(data.hash);	// MINER GLOBAL HASHRATE
			title1 = parseInt(data.hash);	
	});	
	$.getJSON("https://"+yourpool+"/api/miner/"+wallet+"/identifiers", function(identifierData) {
			identifiers = identifierData;  // SORT THE IDENTIFIERS FOR CONSISTENT DISPLAY
			identifiers.sort();
			$.getJSON("https://"+yourpool+"/api/miner/"+wallet+"/stats/allWorkers", function(workerData) {
				$("#minerhashrate").html(workerData["global"].hash);	// GET ALL OF THE WORKERS HASHRATE
				
				var miner_divs = $("div.miner");	// CLEAR OUT THE OLD WORKERS DATA
				for(var i = 0; i < miner_divs.length; i++) {
					miner_divs[i].remove();
				}
				
				for(var i = 0; i < identifiers.length; i++) {		// REPLACE WITH THE NEW WORKERS DATA
					var minerid = i < 10 ? "0" + i : i;
					$("#miner").append(
						"<div class=\"data-section-item miner\" style=\"padding-bottom: 10px\">\n"+
						"<div class=\"data-item-name\" style=\"display: inline\"><span class=\"minerid\"><b><font color=\"4DC3FA\">"+minerid+" # </font></span><font color=\"0f0f0f\">"+identifiers[i]+":</font></b></div>\n"+
						"<div class=\"data-item-value\" id="+identifiers[i]+"\" style=\"display: inline\"><b><font color=\"red\">"+workerData[identifiers[i]].hash+"</font></b></div>\n"+
						"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> H/s</font></b></div>\n"+
						"</div>\n"
					);
				}
			});
	});
}

// OVERALL LUCK
function LuckAvg(){
	$.getJSON("https://"+yourpool+"/api/pool/blocks/pplns?limit=10000", function(data) {
			sumpoolroundhash = 0;
			for (var i = 0; i < data.length; i++){
				sumpoolroundhash += data[i].shares;
			}
			avgroundhash = parseInt(sumpoolroundhash / data.length);
			sumnetdiff = 0;
			for (var x = 0; x < data.length; x++){
				sumnetdiff += data[x].diff;
			}
			avgnetdiff = parseInt(sumnetdiff / data.length);
			$("#luckavg span").html(((avgroundhash / avgnetdiff) * 100).toFixed(2));	// POOL OVERALL LUCK
	});
}

function UpdateMarketExchange(){
	$.getJSON("https://shapeshift.io/rate/xmr_btc", function(data) {
			$("#shapeshift span").html(data.rate);												// SHAPESHIFT.IO EXCHANGE RATE
	});
	$.getJSON("https://xmr.to/api/v1/xmr2btc/order_parameter_query/?format=json", function(data) {
			$("#xmrdotto span").html(data.price);												// XMR.TO EXCHANGE RATE
	});
	$.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=XMR&tsyms=USD", function(data) {
			$("#xmr-usd1 span").html(data.XMR.USD * 1);											// CRYPTOCOMPARE XMR/USD RATE
	});
	$.getJSON("https://api.cryptonator.com/api/ticker/xmr-usd", function(data) {
			$("#xmr-usd2 span").html((data.ticker.price * 1).toFixed(2));						// CRYPTONATOR XMR/USD RATE
	});
}


// MARTURITY
function showMaturityPanel(maturityAvailable){
	if (maturityAvailable) {
		$("#maturityOFF").hide();
		$("#maturityON").show();
	} else {
		$("#maturityON").hide();
		$("#maturityOFF").show();
	}
}
function UpdateMaturity(){
		if (maturity5 > 0) {
			showMaturityPanel(true);
			var maturity_divs = $("div.maturityON");
				for(var i = 0; i < maturity_divs.length; i++) {
					maturity_divs[i].remove();
				}
			$("#maturityON").append(
				"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
				"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 1:</font></b></div>\n"+
				"<div class=\"data-item-value\" id="+maturity1+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity1+"</font></b></div>\n"+
				"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
				"</div>\n"+
				"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
				"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 2:</font></b></div>\n"+
				"<div class=\"data-item-value\" id="+maturity2+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity2+"</font></b></div>\n"+
				"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
				"</div>\n"+
				"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
				"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 3:</font></b></div>\n"+
				"<div class=\"data-item-value\" id="+maturity3+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity3+"</font></b></div>\n"+
				"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
				"</div>\n"+
				"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
				"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 4:</font></b></div>\n"+
				"<div class=\"data-item-value\" id="+maturity4+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity4+"</font></b></div>\n"+
				"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
				"</div>\n"+
				"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
				"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 5:</font></b></div>\n"+
				"<div class=\"data-item-value\" id="+maturity5+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity5+"</font></b></div>\n"+
				"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
				"</div>\n"
			);
		} else {
				if (maturity4 > 0) {
					showMaturityPanel(true);
					var maturity_divs = $("div.maturityON");
						for(var i = 0; i < maturity_divs.length; i++) {
							maturity_divs[i].remove();
						}
					$("#maturityON").append(
						"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
						"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 1:</font></b></div>\n"+
						"<div class=\"data-item-value\" id="+maturity1+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity1+"</font></b></div>\n"+
						"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
						"</div>\n"+
						"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
						"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 2:</font></b></div>\n"+
						"<div class=\"data-item-value\" id="+maturity2+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity2+"</font></b></div>\n"+
						"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
						"</div>\n"+
						"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
						"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 3:</font></b></div>\n"+
						"<div class=\"data-item-value\" id="+maturity3+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity3+"</font></b></div>\n"+
						"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
						"</div>\n"+
						"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
						"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 4:</font></b></div>\n"+
						"<div class=\"data-item-value\" id="+maturity4+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity4+"</font></b></div>\n"+
						"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
						"</div>\n"
			);
				} else {
					if (maturity3 > 0) {
						showMaturityPanel(true);
						var maturity_divs = $("div.maturityON");
							for(var i = 0; i < maturity_divs.length; i++) {
								maturity_divs[i].remove();
							}
						$("#maturityON").append(
							"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
							"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 1:</font></b></div>\n"+
							"<div class=\"data-item-value\" id="+maturity1+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity1+"</font></b></div>\n"+
							"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
							"</div>\n"+
							"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
							"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 2:</font></b></div>\n"+
							"<div class=\"data-item-value\" id="+maturity2+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity2+"</font></b></div>\n"+
							"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
							"</div>\n"+
							"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
							"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 3:</font></b></div>\n"+
							"<div class=\"data-item-value\" id="+maturity3+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity3+"</font></b></div>\n"+
							"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
							"</div>\n"
						);
					} else {
						if (maturity2 > 0) {
							showMaturityPanel(true);
							var maturity_divs = $("div.maturityON");
								for(var i = 0; i < maturity_divs.length; i++) {
									maturity_divs[i].remove();
								}
							$("#maturityON").append(
								"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
								"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 1:</font></b></div>\n"+
								"<div class=\"data-item-value\" id="+maturity1+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity1+"</font></b></div>\n"+
								"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
								"</div>\n"+
								"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
								"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 2:</font></b></div>\n"+
								"<div class=\"data-item-value\" id="+maturity2+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity2+"</font></b></div>\n"+
								"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
								"</div>\n"
							);
						} else {
							if (maturity1 > 0) {
								showMaturityPanel(true);
								var maturity_divs = $("div.maturityON");
									for(var i = 0; i < maturity_divs.length; i++) {
										maturity_divs[i].remove();
									}
								$("#maturityON").append(
									"<div class=\"data-section-item maturityON\" style=\"padding-bottom: 5px\">\n"+
									"<div class=\"data-item-name\" style=\"display: inline\"><b><font color=\"4DC3FA\">MATURITY 1:</font></b></div>\n"+
									"<div class=\"data-item-value\" id="+maturity1+"\" style=\"display: inline\"><b><font color=\"red\">"+maturity1+"</font></b></div>\n"+
									"<div class=\"data-item-units\" style=\"display: inline\"><b><font color=\"5EFF33\"> to go</font></b></div>\n"+
									"</div>\n"
								);
							} else {
								showMaturityPanel(false);
							}
						}
					}
				}
		}
}

// UPDATE INTERVAL
function UpdateAllStats(){
	UpdateMinerStats();
	UpdateMaturity();
	UpdatePoolStats();
	UpdateNetworkStats();
	UpdateMarketExchange();
	UpdateTitle();
	LuckAvg();
}

// SET TIME TO REFRESH ALL VALUE in SECOND
var time = 5;

$(window).on("load", function() {
	UpdateAllStats();
	setInterval(UpdateAllStats, time * 1000);
});
