import { Aggregation, Aggregations, DatumFilter } from "solarnetwork-api-core/lib/domain/index.js";
import { Environment, SolarQueryApi } from "solarnetwork-api-core/lib/net/index.js";
import { DatumLoader } from "solarnetwork-datum-loader";
import Getopt from "node-getopt";

//var datumLoader = require("solarnetwork-datum-loader"),
//	sn = require("solarnetwork-api-core"),
//	Getopt = require("node-getopt");

const snEnv = new Environment();
const snApi = new SolarQueryApi(snEnv);

async function query(options) {
	const filter = new DatumFilter();
	filter.nodeId = +options.node;
	filter.sourceIds = options.source;
	if (options.aggregate) {
		filter.aggregation = Aggregation.valueOf(options.aggregate);
	} else {
		filter.aggregation = Aggregations.Day;
	}
	filter.startDate = new Date(options["begin-date"]);
	filter.endDate = new Date(options["end-date"]);

	try {
		const data = await new DatumLoader(snApi, filter).fetch();
		for (const d of data) {
			console.log(JSON.stringify(d));
		}
		console.info(`${data.length} results returned.`);
	} catch (error) {
		console.error("Error requesting data: " + error);
	}
}

var getopt = new Getopt([
	["n", "node=ARG", "node ID"],
	["s", "source=ARG+", "source ID"],
	["b", "begin-date=ARG", "begin date, in YYYY-MM-DD HH:mm or YYYY-MM-DD format"],
	["e", "end-date=ARG", "end date, exclusive"],
	["a", "aggregate=ARG", "aggregate, e.g. Hour, Day, Month"],
	["h", "help", "show this help"],
]).bindHelp(
	"Usage: node node-datum-loader.js [OPTIONS]\n" +
		"\n" +
		"Execute a SolarQuery datum query and show the results.\n" +
		"\n" +
		"[[OPTIONS]]\n"
);

var options = getopt.parseSystem();

query(options.options);
