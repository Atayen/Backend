module.exports = async function (app) {

  	var bep20Manager = {};

    var nullAddress = "0x0000000000000000000000000000000000000000";

    bep20Manager.contract = new app.web3Bep20.eth.Contract(app.config.ctrs.bep20.abi,app.config.ctrs.bep20.address.mainnet);


    bep20Manager.unlockOwner = async () => {
      app.web3Bep20.eth.accounts.wallet.decrypt([app.config.sattBep20], app.config.SattReservePass);
    }

    bep20Manager.eventETHtoBSC = async (error, evt) => {
        var to = evt.returnValues.to;
        var value = evt.returnValues.value;
        var from = evt.returnValues.from;

        await bep20Manager.unlockOwner();

        var mintres = await bep20Manager.mint(value);
        var transferres = await bep20Manager.transfer(from,value);

        var log = {
          type:"ETH-BSC",
          from:from,
          to:to,
          value:value,
          ethTxHash:evt.transactionHash,
          mintTxHash:mintres.transactionHash,
          bscTxHash:transferres.transactionHash,
          date :Math.floor(Date.now()/1000)
        }
        var ins = await app.db.bep20().insertOne(log);


    }

    bep20Manager.eventBSCtoETH = async (error, evt) => {

      var from = evt.returnValues.from;
      var to = evt.returnValues.to;
      var value = evt.returnValues.value;



      if(from == nullAddress)
      {
        return;
      }

        await bep20Manager.unlockOwner();

        var burnres = await bep20Manager.burn(value);

        app.web3.eth.accounts.wallet.decrypt([app.config.sattBep20], app.config.SattReservePass);

        var transferres = await app.token.transfer(from,value,{address:app.config.SattBep20Addr});

        var log = {
          type:"BSC-ETH",
          from:from,
          to:to,
          value:value,
          bscTxHash:evt.transactionHash,
          burnTxHash:burnres.transactionHash,
          ethTxHash:transferres.transactionHash,
          date :Math.floor(Date.now()/1000)
        }
        var ins = await app.db.bep20().insertOne(log);
    }

    bep20Manager.mint = async  (amount) => {
      return new Promise(async (resolve, reject) => {
        try {
          var gasPrice = await app.web3Bep20.eth.getGasPrice();
          var gas = 60000;

          var receipt = await bep20Manager.contract.methods.mint(amount).send({from:app.config.SattBep20Addr,gas:gas,gasPrice: gasPrice})
          .once('transactionHash', function(transactionHash){
            console.log("mint transactionHash",transactionHash)
          });
          resolve({transactionHash:receipt.transactionHash,amount:amount});

        }
        catch (err)
        {
          reject(err);
        }
      });
    }

    bep20Manager.burn = async  (amount)  => {
      return new Promise(async (resolve, reject) => {
        try {
          var gasPrice = await app.web3Bep20.eth.getGasPrice();
          var gas = 60000;

          var receipt = await bep20Manager.contract.methods.burn(amount).send({from:app.config.SattBep20Addr,gas:gas,gasPrice: gasPrice})
          .once('transactionHash', function(transactionHash){
            console.log("burn transactionHash",transactionHash)
          });
          resolve({transactionHash:receipt.transactionHash,amount:amount});

        }
        catch (err)
        {
          reject(err);
        }
      });
    }

    bep20Manager.transfer = async  (to,amount) => {
  		return new Promise(async (resolve, reject) => {
  			var gasPrice = await app.web3Bep20.eth.getGasPrice();
  			var gas  = 60000;

  			try {
  				var receipt = await bep20Manager.contract.methods.transfer(to,amount).send({from:app.config.SattBep20Addr,gas:gas,gasPrice: gasPrice})
  				.once('transactionHash', function(transactionHash){
  					console.log("transfer satt bep20 transactionHash",transactionHash)
  				})
  				resolve({transactionHash:receipt.transactionHash,to:to,amount:amount});
  			}
  			catch (err) {
  				reject(err)
  			}
  		});
  	}

    bep20Manager.transferNativeBNB = async  (to,amount,credentials) => {
  		return new Promise(async (resolve, reject) => {
  			var gasPrice = await app.web3Bep20.eth.getGasPrice();
  			var gas  = 21000;

  			try {
          var receipt = await app.web3Bep20.eth.sendTransaction({from: credentials.address,value:amount, gas: gas,to:to,gasPrice: gasPrice})
  				.once('transactionHash', function(transactionHash){
  					console.log("transfer satt bep20 transactionHash",transactionHash)
  				})
  				resolve({transactionHash:receipt.transactionHash,to:to,amount:amount});
  			}
  			catch (err) {
  				reject(err)
  			}
  		});
  	}

    bep20Manager.getBalance = async function (token,addr) {
  		return new Promise(async (resolve, reject) => {
  			var contract = new app.web3Bep20.eth.Contract(app.config.ctrs.token.abi,token);
  			var amount = await contract.methods.balanceOf(addr).call();


  			resolve({amount:amount.toString()});
  		});
  	}

    bep20Manager.getBalanceNativeBNB = async function (addr) {
  		return new Promise(async (resolve, reject) => {

      	var ether_balance = await app.web3Bep20.eth.getBalance(addr);

  			resolve({amount:ether_balance.toString()});
  		});
  	}

    bep20Manager.approve = async function (token,addr,spender,amount) {
  		return new Promise(async (resolve, reject) => {

  			var contract = new app.web3Bep20.eth.Contract(app.config.ctrs.token.abi,token);

  			var gasPrice = await app.web3Bep20.eth.getGasPrice();
  			var gas = await contract.methods.approve(spender,amount).estimateGas({from:addr});

  			var receipt = await contract.methods.approve(spender,amount).send({from:addr,gas:gas,gasPrice: gasPrice})
  			.once('transactionHash', function(transactionHash){
  				console.log("approve transactionHash",transactionHash)
  			});
  			resolve({transactionHash:receipt.transactionHash,address:addr,spender:spender});
  			console.log(receipt.transactionHash,"confirmed approval from",addr,"to",spender);
  		});
  	}

  	bep20Manager.getApproval = async function (token,addr,spender) {
  		return new Promise(async (resolve, reject) => {
  			var contract = new app.web3Bep20.eth.Contract(app.config.ctrs.token.abi,token);
  			var amount = await contract.methods.allowance(addr,spender).call();
  			console.log("approval",addr,"for",spender,amount.toString());
  			resolve({amount:amount.toString()});
  		});
  	}

    bep20Manager.transferBEP = async  (to,amount,credentials) => {
  		return new Promise(async (resolve, reject) => {
  			var gasPrice = await app.web3Bep20.eth.getGasPrice();
  			var gas  = 60000;

  			try {
  				var receipt = await bep20Manager.contract.methods.transfer(to,amount).send({from:credentials.address,gas:gas,gasPrice: gasPrice})
  				.once('transactionHash', function(transactionHash){
  					console.log("transfer satt bep20 transactionHash",transactionHash)
  				})
  				resolve({transactionHash:receipt.transactionHash,to:to,amount:amount});
  			}
  			catch (err) {
  				reject(err)
  			}
  		});
  	}


      bep20Manager.initEventHandlers =  () => {
        bep20Manager.contract.events.Transfer  ( {filter:{to:app.config.SattBep20Addr}},bep20Manager.eventBSCtoETH);
        app.token.contract.events.Transfer  ( {filter:{to:app.config.SattBep20Addr}},bep20Manager.eventETHtoBSC);
      }




  app.bep20 = bep20Manager;
  return app;
}