var fs = require('fs');
var http = require("http");

function parse(NetdataLog) {
	var time_netdata = {};

	var cpu = fs.readFileSync(NetdataLog+"cpu.json");
	cpu = JSON.parse(cpu).data;
	for(i in cpu){
		//if(i>100) break;
		if(time_netdata[cpu[i][0]]==null) time_netdata[cpu[i][0]] = {};
		time_netdata[cpu[i][0]]['cpu'] = cpu[i][1];
	}

	var preads = fs.readFileSync(NetdataLog+"preads.json");
	preads = JSON.parse(preads).data;
	for(i in preads){
		//if(i>100) break;
		if(time_netdata[preads[i][0]]==null) time_netdata[preads[i][0]] = {};
		time_netdata[preads[i][0]]['preads'] = preads[i][1];
	}

	var pwrites = fs.readFileSync(NetdataLog+"pwrites.json");
	pwrites = JSON.parse(pwrites).data;
	for(i in pwrites){
		//if(i>100) break;
		if(time_netdata[pwrites[i][0]]==null) time_netdata[pwrites[i][0]] = {};
		time_netdata[pwrites[i][0]]['pwrites'] = pwrites[i][1];
	}

	var mem = fs.readFileSync(NetdataLog+"mem.json");
	mem = JSON.parse(mem).data;
	for(i in mem){
		//if(i>100) break;
		if(time_netdata[mem[i][0]]==null) time_netdata[mem[i][0]] = {};
		time_netdata[mem[i][0]]['mem'] = mem[i][1];
	}

	var vmem = fs.readFileSync(NetdataLog+"vmem.json");
	vmem = JSON.parse(vmem).data;
	for(i in vmem){
		//if(i>100) break;
		if(time_netdata[vmem[i][0]]==null) time_netdata[vmem[i][0]] = {};
		time_netdata[vmem[i][0]]['vmem'] = vmem[i][1];
	}

	var network = fs.readFileSync(NetdataLog+"network.json");
	network = JSON.parse(network).data;
	for(i in network){
		//if(i>100) break;
		if(time_netdata[network[i][0]]==null) time_netdata[network[i][0]] = {};
		time_netdata[network[i][0]]['network_received'] = network[i][1];
		time_netdata[network[i][0]]['network_sent'] = network[i][2];
	}

	return time_netdata;
}

module.exports.parse =  parse;