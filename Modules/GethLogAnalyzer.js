// LogAnalyzer for geth@1.5.9-stable-a07539fb by (zhengpl3@mail2.sysu.edu.cn, QQ/Wechat:326486019)
// Different versions might output the log in differet formats.
// In the private chain, the promotion of tx and block is fast. Thus we consider Tx_input is the time when tx is promoting and Tx_confirmed is the time when tx is removed)
// 
// Input: Tuple of <line0, timestamp1, type2, action3, hashOrId4, info5>
// Output: 
//		TPS:
//		ARD:
//		PDR:
//		RRR:
//		TPR:
//		CET:
//		SUT:
//		CCT:
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
		if (time_defined && (parseresult[i][1]<starttime || parseresult[i][1]>endtime))
			continue;
	
		if (parseresult[i][2]=="block") {
			if (parseresult[i][3]=="imported") {
				txconfirmedcount += JSON.parse(parseresult[i][5]).tx_count;
			}
			if (parseresult[i][3]=="mined")
				for (var j=i; j>=0; --j)
					if (parseresult[j][3]=="commit" && parseresult[j][4]==parseresult[i][4]) {
						txconfirmedcount += JSON.parse(parseresult[j][5]).tx_count;
						break;
					}
		}
	}
	var TPS = txconfirmedcount/((endtime-starttime)/1000);
	if(verbose) console.log("TPS: ", TPS, txconfirmedcount);

	//Average Response Delay
	var txresposecount = 0;
	var sumofdelay = 0;
	for (var i=0;i<parseresult.length;++i) {
		if (time_defined && (parseresult[i][1]<starttime || parseresult[i][1]>endtime))
			continue;
		if (parseresult[i][3]=="promoting")
			for (var j=i;j<parseresult.length;++j) {
				if (parseresult[j][3]=="removed" && parseresult[i+1][4]==parseresult[j+1][4]) {
					txresposecount++;
					sumofdelay += parseresult[j][1]-parseresult[i][1];
					break
				}
			}
	}
	var ARD = sumofdelay/1000/txresposecount;
	if(verbose) if(verbose) console.log("ARD: ", ARD, sumofdelay, txresposecount);

	//Peer Discovery Rate
	var maxadded = 0;
	var minpong = 2000000000000;
	var peers = [];

	for (var i=0;i<parseresult.length;++i) {
		if (time_defined && (parseresult[i][1]<starttime || parseresult[i][1]>endtime))
			continue;
		if (parseresult[i][3]=="added") {
			if (peers.indexOf(parseresult[i][4])==-1)
				peers.push(parseresult[i][4]);
			if (maxadded < parseresult[i][1])
				maxadded = parseresult[i][1];
		}
	}

	for (var i=0;i<parseresult.length;++i) {
		if (time_defined && (parseresult[i][1]<starttime || parseresult[i][1]>endtime))
			continue;
		if (parseresult[i][3]=="pong" && minpong > parseresult[i][1])
			minpong = parseresult[i][1];
	}

	var PDR=peers.length/((maxadded-minpong)/1000);
	if(verbose) if(verbose) console.log("PDR: ", PDR, peers.length, maxadded, minpong);




	//RPC Response Rate
	var respconut = 0;
	for (var i=0;i<parseresult.length;++i) {
		if (time_defined && (parseresult[i][1]<starttime || parseresult[i][1]>endtime))
			continue;
		if (parseresult[i][2]=="rpc" && parseresult[i][3]=="response")
			++respconut;
	}
	var RRR = respconut/((endtime-starttime)/1000);
	if(verbose) console.log("RRR: ", RRR, respconut, endtime, starttime);



	//Transaction Propagating Rate
	var txprogatingcount = 0;
	for (var i=0;i<parseresult.length;++i) {
		if (time_defined && (parseresult[i][1]<starttime || parseresult[i][1]>endtime))
			continue;
		if (parseresult[i][2]=="transaction" && parseresult[i][3]=="promoting")
			++txprogatingcount;
	}
	var TPR = txprogatingcount/((endtime-starttime)/1000);
	if(verbose) console.log("TPR: ", TPR, txprogatingcount, endtime,starttime);


	//Contract Execution Time
	var exetimes = 0;
	var sumofexetime = 0;
	var temptime = 0;
	for (var i=0;i<parseresult.length;++i) {
		if (time_defined && (parseresult[i][1]<starttime || parseresult[i][1]>endtime))
			continue;
		if (parseresult[i][2]=="execution" && parseresult[i][3]=="start") {
			temptime = parseresult[i][1];
			continue;
		}
		if (parseresult[i][2]=="execution" && parseresult[i][3]=="done" &&temptime!=0) {
			++exetimes;
			sumofexetime += parseresult[i][1]-temptime;
			temptime = 0;
		}
	}
	var CET = sumofexetime/1000/exetimes;
	if(verbose) console.log("CET: ", CET, sumofexetime, exetimes);
	


	//State Updating Time
	var uptimes = 0;
	var sumofuptime = 0;
	var temptime = 0;
	for (var i=0;i<parseresult.length;++i) {
		if (time_defined && (parseresult[i][1]<starttime || parseresult[i][1]>endtime))
			continue;
		if (parseresult[i][2]=="execution" && parseresult[i][3]=="done") {
			temptime = parseresult[i][1];
			continue;
		}
		if (parseresult[i][2]=="state" && parseresult[i][3]=="done" &&temptime!=0) {
			++uptimes;
			sumofuptime += parseresult[i][1]-temptime;
			temptime = 0;
		}
	}
	var SUT = sumofuptime/1000/uptimes;
	if(verbose) console.log ("SUT: ", SUT, sumofuptime, uptimes);


	//Consensus-Cost Time
	var txcount = 0;
	var sumofcctime = 0;
	var temptime = 0;
	var wantblock = 0;
	var wanttx = 0;
	for (var i=0;i<parseresult.length;++i) {
		if (time_defined && (parseresult[i][1]<starttime || parseresult[i][1]>endtime))
			continue;
		if (parseresult[i][2]=="block" && parseresult[i][3]=="commit" && parseresult[i][4]>=wantblock) {
			temptime = parseresult[i][1];
			wantblock = parseresult[i][4];
			wanttx = JSON.parse(parseresult[i][5]).tx_count;
			continue;
		}
		if (parseresult[i][2]=="block" && parseresult[i][3]=="mined" && parseresult[i][4]==wantblock) {
			++wantblock;
			sumofcctime += (parseresult[i][1]-temptime)*wanttx;
			txcount += wanttx;
			temptime = 0;
		}
	}
	var CCT = sumofcctime/1000/txcount;
	if(verbose) console.log("CCT: ", CCT, sumofcctime, txcount);

	return {
		TPS: TPS,
		ARD: ARD,
		PDR: PDR,
		RRR: RRR,
		TPR: TPR,
		CET: CET,
		SUT: SUT,
		CCT: CCT,
		starttime: parseInt(starttime/1000),
		endtime: parseInt(endtime/1000),
		txconfirmedcount: txconfirmedcount
	}
}

module.exports.analyze =  analyze;