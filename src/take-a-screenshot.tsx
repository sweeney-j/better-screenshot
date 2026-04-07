import { closeMainWindow, launchCommand, LaunchType } from "@raycast/api"; 
import { promisify } from "util";
import { exec } from "child_process";
import fs from "fs";
const path = require("node:path"); 

const execAsync = promisify(exec);

function getUniqueFileName(): string { 
	const files = fs.readdirSync("/tmp/raycast-screenshots"); 
	const names = files.map((file) => path.parse(file).name); 
	let randomFileName: string;
	do {
		randomFileName = Math.random().toString(36).slice(2); 
	} while (names.includes(randomFileName)); 

	return randomFileName;
}

export default async function Command() {
	await closeMainWindow({ clearRootSearch: true }); 
	await execAsync('mkdir -p /tmp/raycast-screenshots'); 
	let name = getUniqueFileName(); 
	await execAsync(`/usr/sbin/screencapture -i /tmp/raycast-screenshots/${name}.png`);
	await launchCommand({ name: "sort-screenshot", type: LaunchType.UserInitiated });
}
