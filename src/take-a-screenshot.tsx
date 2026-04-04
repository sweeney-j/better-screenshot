import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { useExec } from "@raycast/utils";
const { exec } = require('node:child_process'); 

/* 
	The Plan 
When the command runs we immediately want to call the screenshot command in macos 
As an MVP lets just try to rename the screenshot. 
	After the screenshot is complete we want to popup the list of ITEMS. 
	This list of ITEMS is going to be a collection of folders held within screenshots 
Basically we are going to explore all the directories until we find a directory called screenshot. 
	When we find that directory we are going to fetch the folders in that directory and those folders 
are going to populate the list modal 
After the user makes their selection we are going to save the screenshot to the folder specified.

	*/ 

const ITEMS = Array.from(Array(3).keys()).map((key) => {
	return {
		id: key,
		icon: Icon.Bird,
		title: "Title " + key,
		subtitle: "Subtitle",
		accessory: "Accessory",
	};
});

export default function Command() {
	const { isLoading, data } = useExec('screencapture', ['-i', '~/Desktop/screenshot.png']); 
	console.log({isLoading}); 
		return (
			<List isLoading={isLoading}>
			{ !isLoading && ITEMS.map((item) => (
				<List.Item
				key={item.id}
				icon={Icon.Text}
				title={item.title}
				subtitle={item.subtitle}
				accessories={[{ icon: Icon.Text, text: item.accessory }]}
				actions={
					<ActionPanel>
					<Action.CopyToClipboard content={item.title} />
					</ActionPanel>
				}
				/>
			))}
			</List>
		);
}
