#!/usr/bin/env node

const exec = require("child_process").exec;

const readline = require("readline");

const getInput = (() => new Promise((res) => {
	const rl = readline.createInterface({
		input: process.stdin,
	});
	const lines = [];

	rl.on("line", (line) => {
		lines.push(line);
	}).on("close", () => {
		res(lines);
	});
}));

const runLighthouse = (url) => new Promise((res, rej) => {
	const command = `docker run --rm femtopixel/google-lighthouse bash -c 'entrypoint "${url}" --output json --output-path /home/chrome/reports/report.json --throttling-method=provided > /dev/null 2> /dev/null && cat /home/chrome/reports/*'`;

	exec(command, {maxBuffer: 1024 * 1024 * 10},
		(error, stdout) => {
			if (error !== null) {
				rej(error);
			} else {
				res(stdout);
			}
		}
	);
});

(async () => {
	const input = await getInput();
	const res = {};
	for (url of input) {
		res[url] = JSON.parse(await runLighthouse(url));
	}

	console.log(JSON.stringify(res));
})();
