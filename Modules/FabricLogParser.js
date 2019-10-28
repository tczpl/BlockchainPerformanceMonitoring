// LogParser for CITA@v0.13 by (zhengpl3@mail2.sysu.edu.cn, QQ/Wechat:326486019)
// Different versions might output the log in differet formats.
// 
// Input: Log of CITA
// Output: Tuple of <line, timestamp, type, action, hashOrId, info>

function parse(line, str) {
    var timestamp;
    var type;
    var action;
    var hashOrId;
    var info;



    //0m Committed block with 500 transactions, intended to include 500\r\n","stream":"stdout","time":"2018-02-07T13:45:46.733915168Z"}
　　var regExp = /0m Committed block with (.*) transactions, (.*),"time":"(.*)"}/;
	var res = regExp.exec(str); 
　　if (res!=null) {
    	//console.log(res);
		timestamp = Date.parse(res[3]);
		timestamp = parseInt(timestamp/1000);
		type = "block";
		action = "commit";
		hashOrId = null;
		var tx_count = +res[1];
		info = JSON.stringify({tx_count: tx_count});
		return [line, timestamp, type, action, hashOrId, info];
	}

	//0m Committed block 152 with hash f9001cc21abcd792f92bc577f12f1a80d84c8162cf0de9c23df621cd1f10343f6000de889c30dad77d7bb81f91386769990b53bd8d313177446fe6df86d9d78d to chain\r\n","stream":"stdout","time":"2018-02-07T13:45:46.191702162Z"}
　　var regExp = /0m Committed block (.*) with hash(.*)"time":"(.*)"}/;
	var res = regExp.exec(str); 
　　if (res!=null) {
    	//console.log(res);
		timestamp = Date.parse(res[3]);
		timestamp = parseInt(timestamp/1000);
		type = "block";
		action = "commit";
		hashOrId = +res[1];
		info = null;
		return [line, timestamp, type, action, hashOrId, info];
	}

}

module.exports.parse =  parse;