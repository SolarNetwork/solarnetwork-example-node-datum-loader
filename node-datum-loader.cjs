var { Domain, Net, Tool } = require("solarnetwork-api-core");
var { AsciiTable3 } = require("ascii-table3");
var Getopt = require("node-getopt");

const snEnv = new Net.Environment();
const snApi = new Net.SolarQueryApi(snEnv);

/**
 * Parse a date string in YYY-MM-DD HH:MM form (time optional).
 *
 * @param {string | undefined} str the date string to parse
 * @returns {Date | undefined} the parsed date
 */
function parseDate(str) {
	if (!str) {
		return undefined;
	}
	const m = str.match(/(\d+)-(\d+)-(\d+)(?:[ T](\d+):(\d+))?/);
	if (!m) {
		return undefined;
	}
	return new Date(
		m[4] !== undefined && m[5] !== undefined
			? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])
			: new Date(+m[1], +m[2] - 1, +m[3])
	);
}

async function query(options) {
	const filter = new Domain.DatumFilter();
	filter.nodeId = +options.node;
	filter.sourceIds = options.source;
	if (options.aggregate) {
		filter.aggregation = Domain.Aggregation.valueOf(options.aggregate);
	} else {
		filter.aggregation = Domain.Aggregations.Day;
	}
	filter.localStartDate = parseDate(options["begin-date"]);
	filter.localEndDate = parseDate(options["end-date"]);

	const token = options.token || process.env.SN_TOKEN;
	const secret = options.secret || process.env.SN_SECRET;

	let auth = undefined;
	if (token && secret) {
		auth = new Net.AuthorizationV2Builder(token, snEnv);
		auth.saveSigningKey(secret);
	}

	try {
		const data = await new Tool.DatumLoader(snApi, filter, auth).fetch();

		if (data.length) {
			// render results in ASCII table
			const rows = [];
			const colOrder = new Map([
				["created", 0],
				["sourceId", 1],
			]);
			for (const datum of data) {
				const row = [];
				for (const key of Object.keys(datum)) {
					if (key === "nodeId") {
						continue;
					}
					if (!colOrder.has(key)) {
						colOrder.set(key, colOrder.size);
					}
					let val = datum[key];
					const n = Number(val);
					if (!Number.isNaN(n)) {
						if (!Number.isInteger(n)) {
							val = Number(n.toFixed(3));
						}
					}
					row[colOrder.get(key)] = val;
				}
				rows.push(row);
			}

			const table = new AsciiTable3().setHeading(...colOrder.keys()).addRowMatrix(rows);
			console.log(table.toString());
		}
		console.info(`${data.length} results returned.`);
	} catch (error) {
		console.error("Error requesting data: " + error);
	}
}

var getopt = new Getopt([
	["n", "node=ARG", "node ID"],
	["s", "source=ARG+", "source ID"],
	["b", "begin-date=ARG", "local begin date, in YYYY-MM-DD HH:mm or YYYY-MM-DD format"],
	["e", "end-date=ARG", "local end date, exclusive"],
	["a", "aggregate=ARG", "aggregate, e.g. None, Hour, Day, Month"],
	["t", "token=ARG", "a SolarNet token to use; SN_TOKEN environment variable also supported"],
	[
		"S",
		"secret=ARG",
		"the SolarNet token secret to use; SN_SECRET environment variable also supported",
	],
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
