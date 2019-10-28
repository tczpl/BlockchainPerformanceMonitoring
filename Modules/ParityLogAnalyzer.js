// LogAnalyzer for CITA@v0.13 by (zhengpl3@mail2.sysu.edu.cn, QQ/Wechat:326486019)
// Different versions might output the log in differet formats.
// 
// Input:
// 		Tuple of <line0, timestamp1, type2, action3, hashOrId4, info5>
// 		starttime(or not):
// 		endtime(or not):
// 			
// Output: 
//		TPS:
//		starttime:
//		endtime:


function analyze(parseresult, starttime=0, endtime=0, verbose=0) {

	var time_defined=false;

	if (starttime!=0 && endtime!=0)
		time_defined=true;
	else  {
		starttime = parseresult[0][1];
		endtime = parseresult[parseresult.length-1][1];
	}

	//Transactions Per Second
	var txconfirmedcount = 0;
	for (var i=0;i<parseresult.length;++i) {
		//focus on starttime~endtime
		if (time_defined && (parseresult[i][1]<starttime || parseresult[i][1]>endtime))
			continue;

		//console.log(parseresult[i]);
		//if (parseresult[i][2]=="block")
		//	if (parseresult[i][3]=="commit")
		if (parseresult[i][2]=="transaction")
			txconfirmedcount++;
	}
		
	var TPS = txconfirmedcount/((endtime-starttime));
	if(verbose) console.log("TPS: ", TPS, txconfirmedcount, (endtime-starttime));

	return {
		TPS: TPS,
		starttime: starttime,
		endtime: endtime,
		txconfirmedcount: txconfirmedcount
	}
}

module.exports.analyze =  analyze;