// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


import ollama from 'ollama';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "deepseek-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const helloWorld = vscode.commands.registerCommand('deepseek-extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from deepseek-extension!');
	});

	const deepseek = vscode.commands.registerCommand('deepseek-extension.deepseek', () => {
		
		const panel = vscode.window.createWebviewPanel(
			'Deep Seek',
			'Deep Seek Chat',
			vscode.ViewColumn.One,
			{enableScripts: true}
		)


		panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ask Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            text-align: center;
        }
        textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: none;
        }
        button {
            margin-top: 10px;
            padding: 10px;
            width: 100%;
            background: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            background: #0056b3;
        }
        #response {
            margin-top: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #f9f9f9;
            color: #333;
            min-height: 50px;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
        <textarea placeholder="Type your question..."></textarea>
        <button>Ask</button>
        <div id="response">Response will appear here...</div>
    </div>
</body>
<script>
const vscodeapi = acquireVsCodeApi();
document.querySelector('button').addEventListener('click', () => {
const text = document.querySelector('textarea').value;
vscodeapi.postMessage({command: 'deepseek', text});
});

window.addEventListener('message', event => {
    const message = event.data;
    // alert(message.text);
    document.querySelector('#response').innerText = message.text;
});
</script>
</html>
`

panel.webview.onDidReceiveMessage(async (message: any) => {
if (message.command === 'deepseek') {
    let answer = '';

    try {
        const response = await ollama.chat({
            model: 'deepseek-r1:7b',
            messages: [{ role: 'user', content: message.text }],
            stream: true
        });
    
        for await (const part of response) {
            answer += part.message.content;
            panel.webview.postMessage({command: 'response', text: answer});
            // console.log(answer);
            }
    } catch (error) {
        panel.webview.postMessage({command: 'response', text: `Error: ${error}`});
    }
    
	}
})

	});

	context.subscriptions.push(helloWorld);
	context.subscriptions.push(deepseek);
}

// This method is called when your extension is deactivated
export function deactivate() {}
