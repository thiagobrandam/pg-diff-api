const PgDiff = require("../src/index").PgDiff;
const Config = require("../src/index").Config;
const TableDefinition = require("../src/models/tableDefinition");

Config.targetClient.database = "pg_diff_test2";
Config.sourceClient.database = "pg_diff_test1";
Config.targetClient.password = "postgres";
Config.sourceClient.password = "postgres";
Config.compareOptions.outputDirectory = 1;
// Config.compareOptions.schemaCompare.roles = ["postgres", "huko"];
Config.compareOptions.schemaCompare.namespaces = []; //["public", "schema_one"];
Config.compareOptions.dataCompare.enable = true;
Config.compareOptions.dataCompare.tables.push(new TableDefinition("test_generic", ["id"]));
Config.compareOptions.dataCompare.tables.push(new TableDefinition("test_columnd_def_value", ["id"]));
Config.compareOptions.dataCompare.tables.push(new TableDefinition("diff_test", ["id"]));

var pgDiff = new PgDiff(Config);
pgDiff.events.on("compare", (message, percentage) => {
	console.log(`Complete at ${percentage}%: ${message}`);
});
pgDiff
	.compare("test_api_2")
	.then((result) => {
		if (result == null) console.log("No patch has been created because no differences have been found!");
		else console.log(`The patch "${result}" has been created.`);
	})
	.catch((err) => {
		console.error(`ERROR: ${err.message}\n${err.stack}`);
	})
	.finally(() => {
		process.exit(0);
	});
