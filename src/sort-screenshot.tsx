import { ActionPanel, Action, Icon, List, Detail, closeMainWindow } from "@raycast/api";
import { useCachedState } from "@raycast/utils"; 
import { useState } from "react"; 
import { execSync } from "child_process"; 
import * as os from "os"
import fs from "fs"; 


/**
 * Orchestrates the selection of preferred screenshot directories
 * and the modal used for saving screenshots. 
 * @param props.launchContext.name - The filename of the taken screenshot.
*/
export default function Command(props) {
	const [dir, setDir] = useCachedState("")

	if (!props.launchContext) {
		return <Detail markdown="This command must be launched from the Screenshot tool."/>;
	}

	var filename = props.launchContext.name + ".png";

	const callback = (directory) => { setDir(directory); }

	if (dir) {
		return (
			<SaveModal
			filename={filename}
			directory={dir}
			/>
		)
	} else {
		return (
			<DirectoryList 
			directory={os.homedir()}
			callback={callback}
			/>
		)
	}
}

/**
 * Displays a Modal for navigating and saving files.
 * @param props.filename - The filename of the taken screenshot.
 * @param props.directory - The users prefered saved directory. 
 */
function SaveModal(props) {
	const [directory, setDirectory] = useState(props.directory);
	const files = getDirectories(directory);

	return (
		<List>
		<List.Item title="Save your screenshot with 'cmd s'" />
		{files.map((item) => (
			<List.Item
			key={item}
			title={item}
			actions={
				<ActionPanel>
				<Action
				title="Select"
				onAction={() => {
					setDirectory(directory + "/" + item);
				}}
				/>
				<Action
				title="Save To Directory"
				shortcut={{ modifiers: ["cmd"], key: "s" }}
				onAction={async() => {
					let filename = "/tmp/raycast-screenshots/" + props.filename; 
					let moveDirectory = props.directory + "/" + item; 
					execSync(`mv ${filename} ${moveDirectory}`); 
					await closeMainWindow();
				}}
				/>
				</ActionPanel>
			}
			/>
		))}
		</List>
	);
}

/**
 * Displays a Modal for navigating and Choosing the preferred directory for the user.
 * The result of this selection will be used when the tool opens in the future. 
 * @param props.directory - The users home directory. Starting here for navigation. 
 * @param props.callback - A callback function used to set the users preferred directory. 
 */
function DirectoryList(props) {
	const [directory, setDirectory] = useState(props.directory);
	const files = getDirectories(directory);

	return (
		<List>
		<List.Item title="Select Your Screenshot Save Directory with 'cmd .'" />
		{files.map((item) => (
			<List.Item
			key={item}
			title={item}
			actions={
				<ActionPanel>
				<Action
				title="Select"
				onAction={() => {
					setDirectory(directory + "/" + item);
				}}
				/>
				<Action
				title="Confirm Directory"
				shortcut={{ modifiers: ["cmd"], key: "." }}
				onAction={() => {
					props.callback(directory); 
				}}
				/>
				</ActionPanel>
			}
			/>
		))}
		</List>
	);
}


/**
 * Produces all the non-hidden directories in a given directory. 
 * @param directory - The given directory
 */
function getDirectories(directory) {
	return fs.readdirSync(directory).filter((f) => {
		return !f.startsWith(".") && fs.lstatSync(directory + "/" + f).isDirectory();
	}); 
}
