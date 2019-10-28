// Input: Validating Log, Synchronize Log(if needed), Netdata Log
// Output: Metric

var fs = require('fs');

var GethLogParser = require('./GethLogParser');
var GethLogAnalyzer = require('./GethLogAnalyzer');
var CITALogParser = require('./CITALogParser');
var CITALogAnalyzer = require('./CITALogAnalyzer');

var FabricLogParser = require('./FabricLogParser');
var FabricLogAnalyzer = require('./FabricLogAnalyzer');
var ParityLogParser = require('./ParityLogParser');
var ParityLogAnalyzer = require('./ParityLogAnalyzer');

var NetdataParser = require('./NetdataParser');
var F = 3.6;// GHz


function GethCalculate(ValidatingLog, NetdataLog, starttime, endtime) {
	var data = fs.readFileSync(ValidatingLog, {flag: 'r+', encoding: 'utf8'});
    //Parse
    var parseResult=[];
    var dataToRow= data.split('\n');
	var tuple;
	var rows = 0;
	var outputToFile="";
	
    for (var i=rows;i<dataToRow.length-1;++i) {
    	tuple = GethLogParser.parse(i,dataToRow[i]);
    	if (tuple!=null) {
			parseResult.push(tuple);
			outputToFile += tuple.toString()+"\n";
    	}
    }
    //fs.writeFileSync("parseResult.txt",outputToFile);

    //Analyze
    var analyzeResult = GethLogAnalyzer.analyze(parseResult, starttime, endtime);
    //console.log(analyzeResult.starttime, analyzeResult.endtime);
    
    if (NetdataLog == 0) {//overhead detailed
	    //console.log(analyzeResult.TPS);
	    return analyzeResult;
    }


    //overall metrics
    var time_netdata = NetdataParser.parse(NetdataLog);
	var sum_tx = analyzeResult.txconfirmedcount;
	var sum_cpu = 0;
	var sum_mem = 0;
	var sum_disk = 0;
	var sum_network = 0;
    for (var i = analyzeResult.starttime; i<analyzeResult.endtime; ++i) {
		sum_cpu += time_netdata[i*1000].cpu;
		sum_mem += time_netdata[i*1000].mem;
		sum_disk += time_netdata[i*1000].preads + time_netdata[i*1000].pwrites;
		sum_network += time_netdata[i*1000].network_received - time_netdata[i*1000].network_sent;
    }
	var TPC = sum_tx/(sum_cpu*F);
	var TPMS = sum_tx/sum_mem;
	var TPDIO = sum_tx/sum_disk;
	var TPND = sum_tx/sum_network;

	analyzeResult['TPC'] = TPC;
	analyzeResult['TPMS'] = TPMS;
	analyzeResult['TPDIO'] = TPDIO;
	analyzeResult['TPND'] = TPND;
	
	return analyzeResult;
}


function FabricCalculate(ValidatingLog, NetdataLog, starttime, endtime) {
	var data = fs.readFileSync(ValidatingLog, {flag: 'r+', encoding: 'utf8'});
    //Parse
    var parseResult=[];
    var dataToRow= data.split('{"log":');
	var tuple;
	var rows = 0
	var outputToFile="";
	
    for (var i=rows;i<dataToRow.length-1;++i) {
    	tuple = FabricLogParser.parse(i,dataToRow[i]);
    	if (tuple!=null) {
    		var donotcare = 0;
    		if (tuple[2]=="peer" && tuple[4]!="192.168.152.129:30303") {
    			//donotcare=1; 
    		}

    		if (!donotcare) {
    			//outputToFile += tuple.toString()+"\n";
    			//console.log(tuple[0]);
    			parseResult.push(tuple);
    		}
    	}
    }

    //fs.writeFile("laile2.txt", outputToFile, function(err) {});
    //console.log(parseResult);

    //Analyze
    var analyzeResult = FabricLogAnalyzer.analyze(parseResult, starttime, endtime);
    //console.log(analyzeResult.starttime, analyzeResult.endtime);

    //overall metrics
    var time_netdata = NetdataParser.parse(NetdataLog);
	var sum_tx = analyzeResult.txconfirmedcount;
	var sum_cpu = 0;
	var sum_mem = 0;
	var sum_disk = 0;
	var sum_network = 0;
    for (var i = analyzeResult.starttime; i<analyzeResult.endtime; ++i) {
		sum_cpu += time_netdata[i*1000].cpu;
		sum_mem += time_netdata[i*1000].mem;
		sum_disk += time_netdata[i*1000].preads + time_netdata[i*1000].pwrites;
		sum_network += time_netdata[i*1000].network_received - time_netdata[i*1000].network_sent;
    }
	var TPC = sum_tx/(sum_cpu*F);
	var TPMS = sum_tx/sum_mem;
	var TPDIO = sum_tx/sum_disk;
	var TPND = sum_tx/sum_network;

	analyzeResult['TPC'] = TPC;
	analyzeResult['TPMS'] = TPMS;
	analyzeResult['TPDIO'] = TPDIO;
	analyzeResult['TPND'] = TPND;
	
	//console.log(analyzeResult);
	return analyzeResult;
}

function ParityCalculate(ValidatingLog, NetdataLog, starttime, endtime) {
	var data = fs.readFileSync(ValidatingLog, {flag: 'r+', encoding: 'utf8'});
    //Parse
    var parseResult=[];
    var dataToRow= data.split('\n');
	var tuple;
	var rows = 0
	var outputToFile="";
	
    for (var i=rows;i<dataToRow.length-1;++i) {
    	tuple = ParityLogParser.parse(i,dataToRow[i]);
    	if (tuple!=null) {
			parseResult.push(tuple);
    	}
    }
    //console.log(parseResult.length);

    //Analyze
    var analyzeResult = ParityLogAnalyzer.analyze(parseResult, starttime, endtime);
    //console.log(analyzeResult.starttime, analyzeResult.endtime);

    //overall metrics
    var time_netdata = NetdataParser.parse(NetdataLog);
	var sum_tx = analyzeResult.txconfirmedcount;
	var sum_cpu = 0;
	var sum_mem = 0;
	var sum_disk = 0;
	var sum_network = 0;
    for (var i = analyzeResult.starttime; i<analyzeResult.endtime; ++i) {
		sum_cpu += time_netdata[i*1000].cpu;
		sum_mem += time_netdata[i*1000].mem;
		sum_disk += time_netdata[i*1000].preads + time_netdata[i*1000].pwrites;
		sum_network += time_netdata[i*1000].network_received - time_netdata[i*1000].network_sent;
    }
	var TPC = sum_tx/(sum_cpu*F);
	var TPMS = sum_tx/sum_mem;
	var TPDIO = sum_tx/sum_disk;
	var TPND = sum_tx/sum_network;

	analyzeResult['TPC'] = TPC;
	analyzeResult['TPMS'] = TPMS;
	analyzeResult['TPDIO'] = TPDIO;
	analyzeResult['TPND'] = TPND;
	
	//console.log(analyzeResult);
	return analyzeResult;
}


function CITACalculate(ValidatingLog, NetdataLog, starttime, endtime) {
	var data = fs.readFileSync(ValidatingLog, {flag: 'r+', encoding: 'utf8'});
    //Parse
    var parseResult=[];
    var dataToRow= data.split('\n');
	var tuple;
	var rows = 0
	var outputToFile="";
	
    for (var i=rows;i<dataToRow.length-1;++i) {
    	tuple = CITALogParser.parse(i,dataToRow[i]);
    	if (tuple!=null) {
    		var donotcare = 0;
    		if (tuple[2]=="peer" && tuple[4]!="192.168.152.129:30303") {
    			//donotcare=1; 
    		}

    		if (!donotcare) {
    			//outputToFile += tuple.toString()+"\n";
    			//console.log(tuple[0]);
    			parseResult.push(tuple);
    		}
    	}
    }

    //fs.writeFile("laile2.txt", outputToFile, function(err) {});
    //console.log(parseResult);

    //Analyze
    var analyzeResult = CITALogAnalyzer.analyze(parseResult, starttime, endtime);
    //console.log(analyzeResult.starttime, analyzeResult.endtime);

    //overall metrics
    var time_netdata = NetdataParser.parse(NetdataLog);
	var sum_tx = analyzeResult.txconfirmedcount;
	var sum_cpu = 0;
	var sum_mem = 0;
	var sum_disk = 0;
	var sum_network = 0;
    for (var i = analyzeResult.starttime; i<analyzeResult.endtime; ++i) {
		sum_cpu += time_netdata[i*1000].cpu;
		sum_mem += time_netdata[i*1000].mem;
		sum_disk += time_netdata[i*1000].preads + time_netdata[i*1000].pwrites;
		sum_network += time_netdata[i*1000].network_received - time_netdata[i*1000].network_sent;
    }
	var TPC = sum_tx/(sum_cpu*F);
	var TPMS = sum_tx/sum_mem;
	var TPDIO = sum_tx/sum_disk;
	var TPND = sum_tx/sum_network;

	analyzeResult['TPC'] = TPC;
	analyzeResult['TPMS'] = TPMS;
	analyzeResult['TPDIO'] = TPDIO;
	analyzeResult['TPND'] = TPND;
	
	//console.log(analyzeResult);
	return analyzeResult;
}


function overall_avg(result, skip=0) {
	var TPS = 0;
	var TPC = 0;
	var TPMS = 0;
	var TPDIO = 0;
	var TPND = 0;
	if (skip==0) {
		for (var i=0;i<result.length;++i) {
			TPS += result[i].TPS;
			TPC += result[i].TPC;
			TPMS += result[i].TPMS;
			TPDIO += result[i].TPDIO;
			TPND += result[i].TPND;
		}
		return {
			TPS: TPS/result.length,
			TPC: TPC/result.length,
			TPMS: TPMS/result.length,
			TPDIO: TPDIO/result.length,
			TPND: TPND/result.length
		}	
	}
	else {
		for (var i=0;i<result.length;++i) {
			TPS += result[i].TPS;
			TPC += result[i].TPC;
			TPMS += result[i].TPMS;
			if(i!=1) TPDIO += result[i].TPDIO;
			TPND += result[i].TPND;
		}
		return {
			TPS: TPS/result.length,
			TPC: TPC/result.length,
			TPMS: TPMS/result.length,
			TPDIO: TPDIO/(result.length-1),
			TPND: TPND/result.length
		}	
	}

}

function detailed_avg(result) {
	var PDR = 0;
	var RRR = 0;
	var TPR = 0;
	var CET = 0;
	var SUT = 0;
	var CCT = 0;
	for (var i=0;i<result.length;++i) {
		CET += result[i].CET;
		SUT += result[i].SUT;
		CCT += result[i].CCT;
	}
	return {
		CET: CET/result.length,
		SUT: SUT/result.length,
		CCT: CCT/result.length
	}
}


global.GethCalculate = GethCalculate;
global.FabricCalculate = FabricCalculate;
global.ParityCalculate = ParityCalculate;
global.CITACalculate = CITACalculate;
global.overall_avg = overall_avg;
global.detailed_avg = detailed_avg;