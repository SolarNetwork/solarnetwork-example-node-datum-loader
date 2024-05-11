import { Aggregation, Aggregations, DatumFilter } from "solarnetwork-api-core/lib/domain/index.js";
import {
	AuthorizationV2Builder,
	Environment,
	SolarQueryApi,
} from "solarnetwork-api-core/lib/net/index.js";
import { DatumLoader } from "solarnetwork-datum-loader";
import { AsciiTable3 } from "ascii-table3";
import Getopt from "node-getopt";

const snEnv = new Environment();
const snApi = new SolarQueryApi(snEnv);

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
	const filter = new DatumFilter();
	filter.nodeId = +options.node;
	filter.sourceIds = options.source;
	if (options.aggregate) {
		filter.aggregation = Aggregation.valueOf(options.aggregate);
	} else {
		filter.aggregation = Aggregations.Day;
	}
	filter.localStartDate = parseDate(options["begin-date"]);
	filter.localEndDate = parseDate(options["end-date"]);

	let auth = undefined;
	if (options.token && options.secret) {
		auth = new AuthorizationV2Builder(options.token, snEnv);
		auth.saveSigningKey(options.secret);
	}

	try {
		const data = await new DatumLoader(snApi, filter, auth).fetch();

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
	["a", "aggregate=ARG", "aggregate, e.g. Hour, Day, Month"],
	["t", "token=ARG", "a SolarNet token to use"],
	["S", "secret=ARG", "the SolarNet token secret to use"],
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
