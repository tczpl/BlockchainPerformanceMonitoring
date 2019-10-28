// LogParser for geth@1.5.9-stable-a07539fb by (zhengpl3@mail2.sysu.edu.cn, QQ/Wechat:326486019)
// Different versions might output the log in differet formats.
// 
// Input: Log of Geth
// Output: Tuple of <line, timestamp, type, action, hashOrId, info>


var CONST_YEAR = 2018;


function parse(line, str) {
    var timestamp;
    var type;
    var action;
    var hashOrId;
    var info;


    //I0907 02:27:27.564393 internal/ethapi/api.go:1143] Tx(0xd07e8fb644bf661602f292f70899c2706a465e7480c5244238af19d9daab2cee) to: 0xaae260314e3cb5023200da699177bc827db1b982
    var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) internal\/ethapi\/api.go:1143] Tx\((.*)\) to:(.*)/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
    	//console.log(res);
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "transaction";
		action = "firstin";
		hashOrId = res[4];
		info = "toac: "+res[5];
		return [line, timestamp, type, action, hashOrId, info];
    }

    //I0907 02:21:05.677381 internal/ethapi/api.go:1141] Tx(0x288ce4254ce6ee88a554da8acff59a1f9f02913639fd5b6d2aec36f2c3d1225a) created: 0x2a8ab576204725807b7bae4ac43e8bd31b336a2f
    var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) internal\/ethapi\/api.go:1141] Tx\((.*)\) created:(.*)/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
    	//console.log(res);
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "transaction";
		action = "firstin";
		hashOrId = res[4];
		info = "createdac: "+res[5];
		return [line, timestamp, type, action, hashOrId, info];
    }

    //I0907 02:24:54.032288 core/blockchain.go:1070] imported    3 blocks,     3 txs (262.503 Mg) in 917.112ms (286.228 Mg/s). #87 [52dab1cb… / b5cf2a7c…]
　　var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) core\/blockchain.go:1070] imported (.*) blocks, (.*) txs (.*) #(.*)\[/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		//console.log(res);
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "block";
		action = "imported";
		hashOrId = +res[7];
		var block_count = +res[4];
		var tx_count = +res[5];
		info = JSON.stringify({block_count:block_count, tx_count: tx_count});
		return [line, timestamp, type, action, hashOrId, info];
    }

    //I0907 02:27:28.567969 miner/worker.go:517] commit new work on block 101 with 1 txs & 0 uncles. Took 8.380564ms
　　var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) miner\/worker.go:517] commit new work on block(.*)with(.*)txs/;   
	var res = regExp.exec(str); 
	if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "block";
		action = "commit";
		hashOrId = +res[4];
		var tx_count = +res[5];
		info = JSON.stringify({tx_count: tx_count});
		return [line, timestamp, type, action, hashOrId, info];
	}


	//I0907 02:27:29.122591 miner/unconfirmed.go:83] 🔨  mined potential block #101 [88049f4b…], waiting for 5 blocks to confirm
	var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) miner\/unconfirmed.go:83] 🔨  mined potential block #(.*) \[/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "block";
		action = "mined";
		hashOrId = +res[4];
		info = null;
		return [line, timestamp, type, action, hashOrId, info];
    }

    //Tx confirmed
    //In the private chain, the promotion of tx and block is fast. Thus we consider Tx_input is the time when tx is promoting and Tx_confirmed is the time when tx is removed)
    
    //I0907 02:24:35.714632 p2p/discover/udp.go:467] >>> 212.32.240.214:30303 discover.ping
	var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) p2p\/discover\/udp.go:467] >>> (.*) discover.ping/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "peer";
		action = "pong";
		hashOrId = res[4];
		info = "discover.ping";
		return [line, timestamp, type, action, hashOrId, info];
    }

    //I0907 02:24:44.096555 p2p/server.go:470] new task: static dial 3f76f50037e9ddf4 192.168.152.129:30303
	var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) p2p\/server.go:470] new task: static dial (.*) (.*)/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "peer";
		action = "pong";
		hashOrId = res[5];
		info = "static";
		return [line, timestamp, type, action, hashOrId, info];
    }



	//I0907 02:24:40.342887 p2p/server.go:737] Added Peer 6fd97488cc58e0af 212.32.240.214:30303
	//I0907 02:24:44.100567 p2p/server.go:737] Added Peer 3f76f50037e9ddf4 192.168.152.129:30303
	var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) p2p\/server.go:737] Added Peer (.*) (.*)/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "peer";
		action = "added";
		hashOrId = res[5];
		info = null;
		return [line, timestamp, type, action, hashOrId, info];
    }

    //I0907 02:21:03.520078 rpc/client.go:505] <-readResp: response {"jsonrpc":"2.0","id":40,"result":true}
	var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) rpc\/client.go:505] <-readResp: response (.*)/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "rpc";
		action = "response";
		hashOrId = null;
		info = res[4];
		return [line, timestamp, type, action, hashOrId, info];
    }


    //I0907 02:27:28.702213 core/tx_pool.go:534] Promoting queued transaction: 
	//TX(390e101b7670e86abf03eda9ca48b1d451f03fe2707f8d7c72c7eeedde9ac6a5)
	var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) core\/tx_pool.go:534] Promoting queued transaction: /;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "transaction";
		action = "promoting";
		hashOrId = null;
		info = null;
		return [line, timestamp, type, action, hashOrId, info];
    }
	var regExp = /TX\((.*)\)/;
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = null;
		type = null;
		action = null;
		hashOrId = res[1];
		info = null;
		return [line, timestamp, type, action, hashOrId, info];
    }



    //I0907 02:21:05.681136 core/vm/vm.go:121] evm running: 69b37e7d
	var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) core\/vm\/vm.go:121] evm running: (.*)/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "execution";
		action = "start";
		hashOrId = null;
		info = res[4];
		return [line, timestamp, type, action, hashOrId, info];
    }


    //I0907 02:30:15.323768 core/vm/vm.go:124] evm done: 7c9c3758. time: 7.712515322s
	var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) core\/vm\/vm.go:124] evm done: (.*). time: (.*)/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "execution";
		action = "done";
		hashOrId = null;
		info = res[4];
		return [line, timestamp, type, action, hashOrId, info];
    }


    //I0907 02:30:15.324279 core/state_processor.go:125] receipt{med=c96bcb25ae930bfcbba71f4e01bd4c44868a90dbec21366c606f4187c9603f58 cgas=229041126 bloom=00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 logs=[]}
	var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) core\/state_processor.go:125] receipt(.*)/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "state";
		action = "done";
		hashOrId = null;
		info = res[4];
		return [line, timestamp, type, action, hashOrId, info];
    }


	//I0907 02:27:29.549264 core/tx_pool.go:655] Removed old pending transaction: 
	//TX(d07e8fb644bf661602f292f70899c2706a465e7480c5244238af19d9daab2cee)
	var regExp = /I([0-9][0-9])([0-9][0-9]) (.*) core\/tx_pool.go:655] Removed old pending transaction:/;   
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = new Date(CONST_YEAR+'-'+res[1]+'-'+res[2]+' '+res[3]).getTime();
		type = "transaction";
		action = "removed";
		hashOrId = null;
		info = null;
		return [line, timestamp, type, action, hashOrId, info];
    }
	var regExp = /TX\((.*)\)/;
　　var res = regExp.exec(str); 
　　if (res!=null) {
		timestamp = null;
		type = null;
		action = null;
		hashOrId = res[1];
		info = null;
		return [line, timestamp, type, action, hashOrId, info];
    }



}

module.exports.parse =  parse;