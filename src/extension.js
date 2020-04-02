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

	console.log('The new extension is now active!!');
	
	// Get git configuration
	const gitConfig = {
		username: undefined,
		useremail: undefined
	};

	// Get extension configuration
	const extensionConfiguration = vscode.workspace.getConfiguration('snippetsForSalesforceDevs');
	const apexConfiguration = {
		authorname : extensionConfiguration.authorName,
		authoremail : extensionConfiguration.authorEmail,
		classSeparatorLength : extensionConfiguration.apex.lenghtOfClassCommentSeparator,
		methodSeparatorLength : extensionConfiguration.apex.lenghtOfMethodCommentSeparator
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);

	// Create Snippet Service
	const apexService = new ApexSnippetService(apexConfiguration, vscode, gitConfig);

	const completionItemProvider = vscode.languages.registerCompletionItemProvider('apex', {
		provideCompletionItems(document, position) {
			return apexService.getCompletionItems();
		},

	}
	);

	context.subscriptions.push(completionItemProvider);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

function getGitConfiguration(){
	const gitConfig = {};

	//const projectPath = vscode.workspace;
	const projectPath = '/Users/victor.garciazarco/DevWorkspace/vscode-snippets-for-salesforce';
	git(projectPath).raw(['config', 'user.name'], (err, result) => {
		if(!err){
			gitConfig.username = result;
		}
	});

	git(projectPath).raw(['config', 'user.email'], (err, result) => {
		if(!err){
			gitConfig.email = result;
		}
	});

	return gitConfig;
}

module.exports = {
	activate,
	deactivate
}
