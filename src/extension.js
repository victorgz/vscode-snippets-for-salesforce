// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const ApexSnippetService = require('./snippets/apex');
const git = require('simple-git')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const projectPath = vscode.workspace.rootPath || '/Users/victor.garciazarco/DevWorkspace/vscode-snippets-for-salesforce';
	const extensionConfiguration = getExtensionConfiguration();
	const apexSnippetService = new ApexSnippetService(vscode, extensionConfiguration);
	
	Promise.all([getGitUserName(projectPath), getGitUserEmail(projectPath)]).then(function (values) {
		apexSnippetService.addGitConfiguration(values[0], values[1]);
		apexSnippetService.initialize();
	});

	// Create replacement REGEX - To be moved into the Common configuration class
	const prefix = apexSnippetService.getGlobalPrefix();
	const regexString = prefix[0] + '\\s*[\\w\\s]*';
	const regex = new RegExp(regexString);

	const completionItemProvider = vscode.languages.registerCompletionItemProvider('apex', {
		provideCompletionItems(document, position) {
			if (!document.lineAt(position.line).text.match(regex)) {
				return;
			}

			const range = new vscode.Range(position.line, document.lineAt(position.line).text.match(regex).index, position.line, position.character)

			return apexSnippetService.getCompletionItems(range);
		}
	}, prefix[0]
	);

	context.subscriptions.push(completionItemProvider);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

/*********** */
function getGitUserName(projectPath) {
	return new Promise((resolve, reject) => {
		git(projectPath).raw(['config', 'user.name'], (err, result) => {
			if (err) return reject(err)
			resolve(result)
		});
	})
}

function getGitUserEmail(projectPath) {
	return new Promise((resolve, reject) => {
		git(projectPath).raw(['config', 'user.email'], (err, result) => {
			if (err) return reject(err)
			resolve(result)
		});
	})
}

function getExtensionConfiguration() {
	return vscode.workspace.getConfiguration();
}

/*********** */


module.exports = {
	activate,
	deactivate
}
