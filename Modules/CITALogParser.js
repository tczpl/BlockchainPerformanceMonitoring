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



    //2018-02-08T15:06:12.537214827+08:00 - INFO - BLOCKTXHASHES come height 1036, tx_hashes count is: 821
	var regExp = /(.*) - INFO - BLOCKTXHASHES come height (.*), tx_hashes count is: (.*)/
	var res = regExp.exec(str); 
　　if (res!=null) {
    	//console.log(res);
		timestamp = Date.parse(res[1]);
		timestamp = parseInt(timestamp/1000);
		type = "block";
		action = "commit";
		hashOrId = +res[2];
		var tx_count = +res[3];
		info = JSON.stringify({tx_count: tx_count});
		return [line, timestamp, type, action, hashOrId, info];
	}


}

module.exports.parse =  parse;