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

    //console.log(str);

    //2018-02-11 01:58:12  Transaction mined (hash cae9c83dbbc92996eec382016b84abf7d8852c299509e7dd81902f265bba050d)
　　var regExp = /(.*) Transaction mined \(hash (.*)\)/;
	var res = regExp.exec(str); 
　　if (res!=null) {
    	//console.log(res[1]);
		timestamp = Date.parse(res[1]);
		timestamp = parseInt(timestamp/1000);
		//console.log(timestamp);
		type = "transaction";
		action = "confirmed";
		hashOrId = res[2];
		info = null;
		return [line, timestamp, type, action, hashOrId, info];
	}


}

module.exports.parse =  parse;