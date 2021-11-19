//Start back to top button ********************************************************

let btnBack2Top = document.getElementById("btn-back-to-top");

window.onscroll = function () {
	scrollFunction();
};

function scrollFunction() {
	if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		btnBack2Top.style.display = "block";
	} else {
		btnBack2Top.style.display = "none";
	}
}

btnBack2Top.addEventListener("click", backToTop);

function backToTop() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

//End back to top button **********************************************************
//Start refresh amount of characters out of MAX_LEN *******************************

$("#leakTextArea").on('input propertychange paste', function() {
	$("#charAmount").text($("#leakTextArea").val().length);
});

//End refresh amount of characters out of MAX_LEN**********************************
//Start web3 app ******************************************************************

abi = 
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "KWCtoken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "LeakPublished",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "LeakUnpublished",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [],
		"name": "availableKWC",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "donate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "getLeakByHash",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "text",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isPublic",
						"type": "bool"
					}
				],
				"internalType": "struct KiwiLeaks.Leak",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLeaks",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "text",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isPublic",
						"type": "bool"
					}
				],
				"internalType": "struct KiwiLeaks.Leak[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMaxLen",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "leakString",
				"type": "string"
			}
		],
		"name": "publishLeak",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "unpublishLeak",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];
var addressKiwiLeaks = '0x1A4d973448aC86386faF149D9C80b4779515dC15';
var addressKWC = '0x8ED81AFb7E888f51A6965d592359f9E3aAD2E83a';
var contract;
var MAX_LEN = 0;
var blockHeight;

$(function() {
	initWeb3();
});

function initWeb3() {
	if (typeof window.ethereum !== 'undefined') {

		try {
			window.ethereum.autoRefreshOnNetworkChange = true;
		} catch (error) {
			console.log('User denied web3 access');
			noWallet();
			return;
		}

		web3 = new Web3(window.ethereum);
		window.ethereum.enable();

		window.ethereum.on('accountsChanged', function (accounts) {
			location.reload();
		});

		window.ethereum.on('networkChanged', function(networkId){
			location.reload();
		});

	//} else if (window.web3) {
	//	web3 = new Web3(web3.currentProvider);
	//	
	} else {
		console.log('No web3 provider detected');
		noWallet();
		return;
	}

	web3.eth.getCode(addressKiwiLeaks).then(function(code) {
		if(code !== "0x0" && code !== "0x") {
			initContract();
		} else {
			noWallet();
			return;
		}
	});
}

function noWallet() {
	web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/791be6ecf5bb45de8fb48616b7435f81"));

	contract = new web3.eth.Contract(abi, addressKiwiLeaks);
	console.log('contract  OK');
	console.log(contract);

	contract.methods.getLeaks().call({from: "0x0000000000000000000000000000000000000000"}, function(error, result) {
		var leaks = [...result];
		leaks.sort((l1, l2) => l1.date - l2.date);
		leaks.forEach(leak => addLeak(leak));
	});
}

function initContract() {
	contract = new web3.eth.Contract(abi, addressKiwiLeaks);
	console.log('contract  OK');
	console.log(contract);
	web3.eth.getBlockNumber().then(result => blockHeight = result);

	contract.methods.getMaxLen().call({from: web3.eth.accounts.currentProvider.selectedAddress}, function(error, result){
		if(error) {
			console.log(error);
		} else {
			MAX_LEN = result;
			$("#leakTextArea").attr("maxlength", MAX_LEN);
			$("#charMax").text(MAX_LEN);
			$("#leakButton").toggleClass("d-none");

			$("#sendLeakBtn").on("click", function() {
				publishLeak();
			});
		}
	});

	refreshAvailableKWC();

	getLeaks();

	// Subscribe publish event
	let optionsPublish = {
		fromBlock: 0,
		address: [addressKiwiLeaks],
		topics: [web3.utils.sha3('LeakPublished(bytes32)')]
	};

	let subscriptionPublish = web3.eth.subscribe('logs', optionsPublish,(err,event) => {
		if (err) {
			console.log(err);
		}
	});

	subscriptionPublish.on('data', function(event) {
		if(event.blockNumber > blockHeight) {
			contract.methods.getLeakByHash(event.data).call({from: web3.eth.accounts.currentProvider.selectedAddress}, function(error, result) {
				addLeak({date: result.date, text: result.text, isPublic: result.isPublic});
			});
		}
	});

	// Subscribe unpublish event
	let optionsUnpublish = {
		fromBlock: 0,
		address: [addressKiwiLeaks],
		topics: [web3.utils.sha3('LeakUnpublished(bytes32)')]
	};

	let subscriptionUnpublish = web3.eth.subscribe('logs', optionsUnpublish,(err,event) => {
		if (err) {
			console.log(err);
		}
	});

	subscriptionUnpublish.on('data', function(event) {
		if(event.blockNumber > blockHeight) {
			removeLeak(event.data.substring(2));
		}
	});

	// Subscribe transfer event
	let optionsTransfer = {
		fromBlock: 0,
		address: [addressKWC],
		topics: [web3.utils.sha3('Transfer(address,address,uint256)')]
	};

	let subscriptionTransfer = web3.eth.subscribe('logs', optionsTransfer,(err,event) => {
		if (err) {
			console.log(err);
		}
	});

	subscriptionTransfer.on('data', function(event) {
		if(event.blockNumber > blockHeight) {
			stringKiwiLeaksAddress = addressKiwiLeaks.toLowerCase().substring(2)
			if(event.topics[1].endsWith(stringKiwiLeaksAddress) || event.topics[2].endsWith(stringKiwiLeaksAddress)) {
				refreshAvailableKWC();
			}
		}
	});
}

function publishLeak() {
	var leakString = $("#leakTextArea").val().substring(0, MAX_LEN);
	if(leakString !== '') {
		contract.methods.publishLeak(leakString).send({from: web3.eth.accounts.currentProvider.selectedAddress});
		$("#leakTextArea").val('');
		$("#leakModal button.btn-close").click();
	}
}

function getLeaks() {
	contract.methods.getLeaks().call({from: web3.eth.accounts.currentProvider.selectedAddress}, function(error, result) {
		var leaks = [...result];
		leaks.sort((l1, l2) => l1.date - l2.date);
		leaks.forEach(leak => addLeak(leak));
	});
}

function refreshAvailableKWC() {
	contract.methods.availableKWC().call({from: web3.eth.accounts.currentProvider.selectedAddress}, function(error, result){
		if(error) {
			console.log(error);
			if(!$("#donateButton").hasClass("d-none")) {
				$("#donateButton").toggleClass("d-none");
			}
			if($("#donateModal").hasClass("show")) {
				$("#donateModal button.btn-close").click();
			}
		} else {
			let tokens = result / 10**18;
			$("#availableTokens").text(tokens);

			if(tokens >= 1) {
				if($("#donateButton").hasClass("d-none")) {
					$("#donateButton").toggleClass("d-none");
				}
				if($("#KWC1toETH").hasClass("d-none")) {
					$("#KWC1toETH").toggleClass("d-none");
				}

				if(tokens >= 2) {
					if($("#KWC2toETH").hasClass("d-none")) {
						$("#KWC2toETH").toggleClass("d-none");
					}
				} else {
					if(!$("#KWC2toETH").hasClass("d-none")) {
						$("#KWC2toETH").toggleClass("d-none");
					}
				}

				if(tokens >= 5) {
					if($("#KWC5toETH").hasClass("d-none")) {
						$("#KWC5toETH").toggleClass("d-none");
					}
				} else {
					if(!$("#KWC5toETH").hasClass("d-none")) {
						$("#KWC5toETH").toggleClass("d-none");
					}
				}
			} else {
				if(!$("#donateButton").hasClass("d-none")) {
					$("#donateButton").toggleClass("d-none");
				}
				if($("#donateModal").hasClass("show")) {
					$("#donateModal button.btn-close").click();
				}
			}
		}
	});
}

function addLeak(leak) {
	const itemHash = web3.utils.sha3(leak.text).substring(2);
	unpublishButton = (MAX_LEN > 0) ? '<button type="button" class="btn-close leak-trash" onclick="unpublishLeakModal(\''+itemHash+'\')"><i class="far fa-trash-alt text-secondary"></i></button>' : '';
	listItem = '<div id="'+ itemHash +'" class="list-group-item list-group-item-action d-flex gap-3 py-3 text-light bg-dark">'
			+		'<div class="gap-2 w-100">'
			+			'<div class="list-group-item-header d-flex w-100 justify-content-between">'
			+				'<small class="opacity-50 leak-date">' + secToDate(leak.date) + '</small>'
			+				unpublishButton
			+			'</div>'
			+			'<div>'
			+				'<p class="mb-0 mt-1 opacity-75 leak-text">' + leak.text + '</p>'
			+			'</div>'
			+		'</div>'
			+	'</div>';

	if(leak.isPublic) {
		$("#leaksList").prepend(listItem);
	}
}

function removeLeak(hash) {
	$("#"+hash).remove();
}

function unpublishLeakModal(hash) {
	$("#unpublishPreview small").text($("#"+hash+" .leak-date").text());
	$("#unpublishPreview p").text($("#"+hash+" .leak-text").text());
	$("#unpublishLeakBtn").attr("onclick", "unpublishLeak('"+hash+"')");

	$("#unpublishModal").modal("show");
}

function unpublishLeak(hash) {
	if(hash !== '') {
		contract.methods.unpublishLeak("0x"+hash).send({from: web3.eth.accounts.currentProvider.selectedAddress});
		$("#unpublishModal button.btn-close").click();
	}
}

function donate(BWCamount) {
	var ETHamount = 0;
	switch(BWCamount) {
		case 1:
			ETHamount = 1500000000000000;
			break;
		case 2:
			ETHamount = 2500000000000000;
			break;
		case 5:
			ETHamount = 5000000000000000;
			break;
	}
	contract.methods.donate().send({from: web3.eth.accounts.currentProvider.selectedAddress, value: ETHamount});
}

function secToDate(seconds) {
	var date = new Date(Date.UTC(1970, 0, 1));
	date.setUTCSeconds(seconds);
	return date;
}

//End web3 app ********************************************************************
