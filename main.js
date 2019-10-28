require("./Modules/MetricCalculator")

function Q1_overhead_tps() {
	var GethValidatingLog = [
		'Logs/Gethlogs_oh_normal/oh_500normal.log',
		'Logs/Gethlogs_oh_logbased/oh_500logbased.log',
		'Logs/Gethlogs_oh_rpcbased/oh_500rpcbased.log',
		'Logs/Gethlogs_oh_normal/oh_1000normal.log',
		'Logs/Gethlogs_oh_logbased/oh_1000logbased.log',
		'Logs/Gethlogs_oh_rpcbased/oh_1000rpcbased.log',
		'Logs/Gethlogs_oh_jia/oh_2000normal.log',
		'Logs/Gethlogs_oh_jia2/oh_2000logbased.log',
		'Logs/Gethlogs_oh_jia/oh_2000rpcbased.log',
		'Logs/Gethlogs_oh_jia/oh_3000normal.log',
		'Logs/Gethlogs_oh_jia2/oh_3000logbased.log',
		'Logs/Gethlogs_oh_jia/oh_3000rpcbased.log'
	];

	var GethNetdataLog = [
		0,0,0,0,0,0,0,0,0,0,0,0
	];

	var Gethperiod = [
		[1518241247,1518241322],
		[1518243397,1518243456],
		[1518246156,1518246240],

		[1518240953,1518241105],
		[1518242338,1518242494], 
		[1518245317,1518245505],


		[1518250700,1518251000],
		[1518252000,1518252300], 
		[1518249400,1518249700],

		[1518251200,1518251750],
		[1518252750,1518253350],
		[1518250004,1518250054]// I0210 16:07:34.202983 server.go:2161] http: Accept error: accept tcp 172.18.196.62:8545: accept4: too many open files; retrying in 20ms
	]; 


	for (var i=0;i<GethValidatingLog.length;++i) {
		if (i==0) console.log("500 requests");
		if (i==3) console.log("1000 requests");
		if (i==6) console.log("2000 requests");
		if (i==9) console.log("3000 requests");
		console.log(GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[i][0]*1000, Gethperiod[i][1]*1000).TPS);
	}
}

function Q1_overhead_netdata() {
	var name_houzhui = [
	"logbased_cpu.json",
	"logbased_mem.json",
	"logbased_net.json",
	"logbased_lreads.json",
	"rpcbased_cpu.json",
	"rpcbased_mem.json",
	"rpcbased_net.json",
	"rpcbased_lreads.json"
	];
	var kaishi = 1518262770000;
	var jieshu = 1518263070000;
	for (i in name_houzhui) {
		var data = fs.readFileSync("172.18.196.62"+name_houzhui[i]);
		var jiexi = JSON.parse(data).data;
		var xieru = [];
		for (j in jiexi) {
			if (jiexi[j][0]>=kaishi && jiexi[j][0]<jieshu) {
				xieru.push(jiexi[j][1]);
			}
		}
		fs.writeFileSync("ok_"+name_houzhui[i],JSON.stringify(xieru));
	}
}

function Q2_overall_platforms() {

	//Geth
	console.log("Geth");
	var GethValidatingLog = [
		'Logs/Gethlogs_nothingcontract_4peer/node0_nothingcontract.log',
		'Logs/Gethlogs_nothingcontract_4peer/node1_nothingcontract.log',
		'Logs/Gethlogs_nothingcontract_4peer/node2_nothingcontract.log',
		'Logs/Gethlogs_nothingcontract_4peer/node3_nothingcontract.log'
	];
	var GethNetdataLog = [
		'Logs/Gethlogs_nothingcontract_4peer/172.18.196.62_geth_',
		'Logs/Gethlogs_nothingcontract_4peer/172.18.196.63_geth_',
		'Logs/Gethlogs_nothingcontract_4peer/172.18.196.64_geth_',
		'Logs/Gethlogs_nothingcontract_4peer/172.18.196.65_geth_'
	];
	var Gethperiod = [1518334968, 1518335443];
	var result = [];
	for (var i=1;i<3;++i) {
		result.push(GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[0]*1000, Gethperiod[1]*1000));
	}
	console.log(overall_avg(result));

	//Parity
	console.log("Parity");
	var ParityValidatingLog = [
		'Logs/Paritylogs_nothingcontract/parity.log',
		'Logs/Paritylogs_nothingcontract/parity.log',
		'Logs/Paritylogs_nothingcontract/parity.log',
		'Logs/Paritylogs_nothingcontract/parity.log'
	];
	var ParityNetdataLog = [
		'Logs/Paritylogs_nothingcontract/172.18.196.62_geth_',
		'Logs/Paritylogs_nothingcontract/172.18.196.63_geth_l_',
		'Logs/Paritylogs_nothingcontract/172.18.196.64_geth_',
		'Logs/Paritylogs_nothingcontract/172.18.196.65_geth_'
	];
	var Parityperiod = [1518333204, 1518333404];
	var result = [];
	for (var i=0;i<ParityValidatingLog.length;++i) {
		result.push(ParityCalculate(ParityValidatingLog[i],ParityNetdataLog[i], Parityperiod[0], Parityperiod[1]));
	}
	var tiaoguo = 1;
	console.log(overall_avg(result,tiaoguo));



	//Fabric
	console.log("Fabric");
	var FabricValidatingLog = [
		'Logs/Fabriclogs0207/vp0.log',
		'Logs/Fabriclogs0207/vp1.log',
		'Logs/Fabriclogs0207/vp2.log',
		'Logs/Fabriclogs0207/vp3.log'
	];
	var FabricNetdataLog = [
		'Logs/Fabriclogs0207/172.18.196.62_fabric_',
		'Logs/Fabriclogs0207/172.18.196.63_fabric_',
		'Logs/Fabriclogs0207/172.18.196.64_fabric_',
		'Logs/Fabriclogs0207/172.18.196.65_fabric_'
	];
	var Fabricperiod = [1518010995, 1518011031];
	var result = [];
	for (var i=0;i<4;++i) {
		result.push(FabricCalculate(FabricValidatingLog[i],FabricNetdataLog[i], Fabricperiod[0], Fabricperiod[1]));
	}
	console.log(overall_avg(result));

	//CITA
	console.log("CITA");
	var CITAValidatingLog = [
		'Logs/CITAlogs0208/node0/cita-auth.log',
		'Logs/CITAlogs0208/node1/cita-auth.log',
		'Logs/CITAlogs0208/node2/cita-auth.log',
		'Logs/CITAlogs0208/node3/cita-auth.log'
	];
	var CITANetdataLog = [
		'Logs/CITAlogs0208/172.18.196.57_cita_',
		'Logs/CITAlogs0208/172.18.196.58_cita_',
		'Logs/CITAlogs0208/172.18.196.59_cita_',
		'Logs/CITAlogs0208/172.18.196.60_cita_'
	];
	var CITAperiod = [1518071402,1518071512]; 
	var result = [];
	for (var i=0;i<4;++i) {
		result.push(CITACalculate(CITAValidatingLog[i],CITANetdataLog[i], CITAperiod[0], CITAperiod[1]));
	}
	console.log(overall_avg(result));


}

function Q2_overall_contracts() {
	var GethValidatingLog = [
		'Logs/Gethlogs_1000store1peer/1000store1peer.log',
		'Logs/Gethlogs_200circle1peer/200circle1peer.log',
		'Logs/Gethlogs_1000acc1w1peer/1000acc1w1peer.log',
		'Logs/Gethlogs_200acc5w1peer/200acc5w1peer.log'
	];
	var GethNetdataLog = [
		'Logs/Gethlogs_1000store1peer/172.18.196.62_geth_',
		'Logs/Gethlogs_200circle1peer/172.18.196.62_geth_',
		'Logs/Gethlogs_1000acc1w1peer/172.18.196.62_geth_',
		'Logs/Gethlogs_200acc5w1peer/172.18.196.62_geth_'
	];
	var Gethperiod = [0, 0];
	for (var i=0;i<GethValidatingLog.length;++i) {
		console.log(["Store","Circle","Acc10000","Acc50000"][i]);
		var result = GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[0]*1000, Gethperiod[1]*1000);
		console.log(overall_avg([result]));
	}
}

function Q3_detailed() {
	var GethValidatingLog = [
		'Logs/Gethlogs_ossol_4peer/node0_4peer.log',
		'Logs/Gethlogs_ossol_4peer/node1_4peer.log',
		'Logs/Gethlogs_ossol_4peer/node2_4peer.log',
		'Logs/Gethlogs_ossol_4peer/node3_4peer.log',
		'Logs/Gethlogs_ossol_2peer/node0_2peer.log',
		'Logs/Gethlogs_ossol_2peer/node1_2peer.log',
		'Logs/Gethlogs_ossol_1peer/node0_1peer.log',
		'Logs/Gethlogs_ossol_1peer/public.log',
	];
	var GethNetdataLog = [
		'Logs/Gethlogs_ossol_4peer/172.18.196.62_geth_',
		'Logs/Gethlogs_ossol_4peer/172.18.196.63_geth_',
		'Logs/Gethlogs_ossol_4peer/172.18.196.64_geth_',
		'Logs/Gethlogs_ossol_4peer/172.18.196.65_geth_',
		'Logs/Gethlogs_ossol_2peer/172.18.196.62_geth_',
		'Logs/Gethlogs_ossol_2peer/172.18.196.63_geth_',
		'Logs/Gethlogs_ossol_1peer/172.18.196.62_geth_',
		0
	];
	var Gethperiod = [
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0],
		[1518193058, 1518193870],
		[0, 0]
	];

	console.log("Pri-4")
	var result = [];
	for (var i=0;i<4;++i) {
		result.push(GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[i][0]*1000, Gethperiod[i][1]*1000));
	}
	console.log(detailed_avg(result));

	console.log("Pri-2")
	var result = [];
	for (var i=4;i<6;++i) {
		result.push(GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[i][0]*1000, Gethperiod[i][1]*1000));
	}
	console.log(detailed_avg(result));

	console.log("Pri-1")
	var result = [];
	for (var i=6;i<7;++i) {
		result.push(GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[i][0]*1000, Gethperiod[i][1]*1000));
	}
	console.log(detailed_avg(result));

	console.log("Pub-1")
	var result = [];
	for (var i=7;i<8;++i) {
		result.push(GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[i][0]*1000, Gethperiod[i][1]*1000));
	}
	console.log(detailed_avg(result));

}

function Q3_detailed_MAX() {
	var GethValidatingLog = [
		'Logs/Gethlogs_ossol_4peer/node0_4peer.log',
		'Logs/Gethlogs_ossol_4peer/node1_4peer.log',
		'Logs/Gethlogs_ossol_4peer/node2_4peer.log',
		'Logs/Gethlogs_ossol_4peer/node3_4peer.log',
		'Logs/Gethlogs_ossol_2peer/node0_2peer.log',
		'Logs/Gethlogs_ossol_2peer/node1_2peer.log',
		'Logs/Gethlogs_ossol_1peer/node0_1peer.log',
		'Logs/Gethlogs_ossol_1peer/public.log',
	];
	var GethNetdataLog = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	//In the evaluation of the paper, we shorten the search range for max value to acclerate computation.
	var Gethperiod = [
		[1518186763, 1518186769],
		[1518186730, 1518186736],
		[1518186726, 1518186732],
		[1518186726, 1518186732],
		[1518191800, 1518191806],
		[1518191762, 1518191768],
		[1518193035, 1518193045],
		[1518268995, 1518269235]
	];

	var duration = 1;
	console.log("Pri-4-MAX")
	var PDRmax = 0;
	var TPRmax = 0;
	for (var i=0;i<4;++i) {
		var res = GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[i][0]*1000, Gethperiod[i][1]*1000);
		for (var timeWindow = res.starttime; timeWindow<res.endtime-duration; timeWindow+=duration) {
			var timeWindowResult = GethCalculate(GethValidatingLog[i],GethNetdataLog[i], timeWindow*1000, (timeWindow+duration)*1000);
			if (timeWindowResult.PDR>PDRmax)
				PDRmax = timeWindowResult.PDR;
			if (timeWindowResult.TPR>TPRmax)
				TPRmax = timeWindowResult.TPR;
		}
	}
	console.log({
		PDRmax: PDRmax,
		TPRmax: TPRmax
	});

	var duration = 1;
	console.log("Pri-2-MAX")
	var PDRmax = 0;
	var TPRmax = 0;
	for (var i=4;i<6;++i) {
		var res = GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[i][0]*1000, Gethperiod[i][1]*1000);
		for (var timeWindow = res.starttime; timeWindow<res.endtime-duration; timeWindow+=duration) {
			var timeWindowResult = GethCalculate(GethValidatingLog[i],GethNetdataLog[i], timeWindow*1000, (timeWindow+duration)*1000);
			if (timeWindowResult.PDR>PDRmax)
				PDRmax = timeWindowResult.PDR;
			if (timeWindowResult.TPR>TPRmax)
				TPRmax = timeWindowResult.TPR;
		}
	}
	console.log({
		PDRmax: PDRmax,
		TPRmax: TPRmax
	});


	var duration = 1;
	console.log("Pri-1-MAX")
	var PDRmax = 0;
	var TPRmax = 0;
	for (var i=6;i<7;++i) {
		var res = GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[i][0]*1000, Gethperiod[i][1]*1000);
		for (var timeWindow = res.starttime; timeWindow<res.endtime-duration; timeWindow+=duration) {
			var timeWindowResult = GethCalculate(GethValidatingLog[i],GethNetdataLog[i], timeWindow*1000, (timeWindow+duration)*1000);
			if (timeWindowResult.PDR>PDRmax)
				PDRmax = timeWindowResult.PDR;
		}
	}
	console.log({
		PDRmax: PDRmax
	});

	var duration = 60;
	console.log("Pub-1-MAX")
	var PDRmax = 0;
	var TPRmax = 0;
	for (var i=7;i<8;++i) {
		var res = GethCalculate(GethValidatingLog[i],GethNetdataLog[i], Gethperiod[i][0]*1000, Gethperiod[i][1]*1000);
		for (var timeWindow = res.starttime; timeWindow<res.endtime-duration; timeWindow+=duration) {
			var timeWindowResult = GethCalculate(GethValidatingLog[i],GethNetdataLog[i], timeWindow*1000, (timeWindow+duration)*1000);
			if (timeWindowResult.PDR>PDRmax)
				PDRmax = timeWindowResult.PDR;
		}
	}
	console.log({
		PDRmax: PDRmax
	});


}


console.log("======Q1_overhead======");
Q1_overhead_tps();
console.log("\n======Q2_platforms======");
Q2_overall_platforms();
console.log("\n======Q2_contracts======");
Q2_overall_contracts();
console.log("\n======Q3_detailed_MAX======");
Q3_detailed_MAX();
console.log("\n======Q3_detailed======");
Q3_detailed();
