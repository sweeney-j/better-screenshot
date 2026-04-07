import { ActionPanel, Action, Icon, List, Cache } from "@raycast/api";
import { useCachedState } from "@raycast/utils"; 
import { useState } from "react"; 
import * as os from "os"
import fs from "fs"; 

const cache = new Cache(); 

export default function Command() {
	const [dir, setDir] = useCachedState("")

	const callback = (directory) => { setDir(directory); }

	if (dir) {
		return (
			<List>
			<List.Item 
			title="Augustiner Helles"
			actions={
				<ActionPanel>
				<Action title="Select" onAction={() => console.log("TESTING")} />
				</ActionPanel>
			}
			/>
			</List>
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

// Displays the directory list for the selected directory
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

function getDirectories(directory) {
	return fs.readdirSync(directory).filter((f) => {
		return !f.startsWith(".") && fs.lstatSync(directory + "/" + f).isDirectory();
	}); 
}
