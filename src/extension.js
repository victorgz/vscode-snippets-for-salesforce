const vscode = require('vscode');
const ApexSnippetService = require('./snippets/apex');
const AuradocSnippetService = require('./snippets/auradoc');
const git = require('simple-git');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const projectPath = vscode.workspace.rootPath;
  const extensionConfiguration = getExtensionConfiguration();
  const apexSnippetService = new ApexSnippetService(
    vscode,
    extensionConfiguration
  );
  const auradocSnippetService = new AuradocSnippetService(
    vscode,
    extensionConfiguration
  );

  Promise.all([getGitUserName(projectPath), getGitUserEmail(projectPath)]).then(
    function(values) {
      apexSnippetService.addGitConfiguration(values[0], values[1]);
      auradocSnippetService.addGitConfiguration(values[0], values[1]);
      apexSnippetService.initialize();
      auradocSnippetService.initialize();
    }
  );

  const prefix = apexSnippetService.getGlobalPrefix();
  const regexString = prefix[0] + '\\s*[\\w\\s]*';
  const regex = new RegExp(regexString);

  const apexCompletionItemProvider = vscode.languages.registerCompletionItemProvider(
    'apex',
    {
      provideCompletionItems(document, position) {
        if (!document.lineAt(position.line).text.match(regex)) {
          return;
        }

        const range = new vscode.Range(
          position.line,
          document.lineAt(position.line).text.match(regex).index,
          position.line,
          position.character
        );

        return apexSnippetService.getCompletionItems(range);
      }
    },
    prefix[0]
  );

  const auradocCompletionItemProvider = vscode.languages.registerCompletionItemProvider(
    'html',
    {
      provideCompletionItems(document, position) {
        if (!document.lineAt(position.line).text.match(regex)) {
          return;
        }

        const range = new vscode.Range(
          position.line,
          document.lineAt(position.line).text.match(regex).index,
          position.line,
          position.character
        );

        return auradocSnippetService.getCompletionItems(range);
      }
    },
    prefix[0]
  );

  context.subscriptions.push(apexCompletionItemProvider);
  context.subscriptions.push(auradocCompletionItemProvider);
}

function deactivate() {}

function getGitUserName(projectPath) {
  return new Promise((resolve, reject) => {
    git(projectPath).raw(['config', 'user.name'], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function getGitUserEmail(projectPath) {
  return new Promise((resolve, reject) => {
    git(projectPath).raw(['config', 'user.email'], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function getExtensionConfiguration() {
  return vscode.workspace.getConfiguration();
}

module.exports = {
  activate,
  deactivate
};
