class AuradocSnippetService {
  constructor(vscodeModule, extensionConfiguration) {
    this.vscodeModule = vscodeModule;
    this.gitConfiguration = {
      name: undefined,
      email: undefined
    };
    this.extensionConfiguration = extensionConfiguration || {};
    this.globalPrefix = extensionConfiguration.prefix || '!!';
    this.replacementItems = {};
    this.formattedSnippets = {};
  }

  addGitConfiguration(gitUsername, gitEmail) {
    this.gitConfiguration = {
      name: gitUsername,
      email: gitEmail
    };
  }

  initialize() {
    this.globalPrefix = this.extensionConfiguration.prefix || '!! ';
    this.buildFormattedSnippets();
  }

  buildFormattedSnippets() {
    this.formattedSnippets = {
      docBasicStructure: {
        prefix: 'doc auradoc basic structure',
        scope: 'html',
        body: [
          '<aura:documentation>',
          '\n\t<aura:description>',
          '\t\t$BLOCK_COMMENT_START Description of your component $BLOCK_COMMENT_END\n',
          '\t</aura:description>',
          '\n\t$BLOCK_COMMENT_START Note: Examples are not supported for components with dependency on org data or that import internal JavaScript libraries $BLOCK_COMMENT_END',
          '\t$BLOCK_COMMENT_START You can create multiple examples $BLOCK_COMMENT_END',
          '\t<aura:example name="basicExample" ref="c:basicExample" label="Basic Example">',
          '\t\t$BLOCK_COMMENT_START Explanation of your example $BLOCK_COMMENT_END',
          '\t</aura:example>',
          '\n</aura:documentation>'
        ]
      },

      docTitle: {
        prefix: 'doc title',
        scope: 'html',
        body: ['<h4>${1:Title}</h4>']
      },
      docParagraph: {
        prefix: 'doc paragraph',
        scope: 'html',
        body: ['<p>${1:Paragraph}</p>']
      },
      docInlineCode: {
        prefix: 'doc inline code',
        scope: 'html',
        body: ['<code>${1:code}</code>']
      },
      docLink: {
        prefix: 'doc link',
        scope: 'html',
        body: ['<a href="${2:#}" target="_blank">${1:text}</a>']
      },
      docCodeBlock: {
        prefix: 'doc code block',
        scope: 'html',
        body: [
          '$BLOCK_COMMENT_START Code markup must be escaped. For example, replace < characters with &lt; $BLOCK_COMMENT_END',
          '<pre><code class="language-markup">',
          '$0',
          '</code></pre>'
        ]
      },
      docBulletedList: {
        prefix: 'doc bulleted list',
        scope: 'html',
        body: [
          '<ul>',
          '\t<li>${1:Item1}</li>',
          '\t<li>${2:Item2}</li>',
          '</ul>'
        ]
      },
      docNumberedList: {
        prefix: 'doc numbered list',
        scope: 'html',
        body: [
          '<ol>',
          '\t<li>${1:Item1}</li>',
          '\t<li>${2:Item2}</li>',
          '</ol>'
        ]
      },
      docTable: {
        prefix: 'doc table',
        scope: 'html',
        body: [
          '<table>',
          '\t<tr>',
          '\t\t<th>${1:Column1}</th>',
          '\t\t<th>${2:Column2}</th>',
          '\t</tr>',
          '\t<tr>',
          '\t\t<td>${3:row1column1}</td>',
          '\t\t<td>${4:row1column2}</td>',
          '\t</tr>',
          '\t<tr>',
          '\t\t<td>${5:row2column1}</td>',
          '\t\t<td>${6:row2column2}</td>',
          '\t</tr>',
          '</table>'
        ]
      },
      docAuraExample: {
        prefix: 'doc aura:example',
        scope: 'html',
        body: [
          '<aura:example name="${1:basicExample}" ref="${2:c:basicExample}" label="${3:Basic Example}">',
          '\t$BLOCK_COMMENT_START Explanation of your example $BLOCK_COMMENT_END',
          '\t$0',
          '</aura:example>'
        ]
      }
    };
  }

  getCompletionItems(range) {
    let result = [];

    Object.values(this.formattedSnippets).forEach(snippetDef => {
      const completionItem = new this.vscodeModule.CompletionItem(
        this.globalPrefix + snippetDef.prefix
      );
      completionItem.filterText = this.globalPrefix + snippetDef.prefix;
      completionItem.insertText = new this.vscodeModule.SnippetString(
        snippetDef.body.join('\n')
      );
      completionItem.documentation = new this.vscodeModule.MarkdownString(
        snippetDef.description
      );
      completionItem.range = range;

      result.push(completionItem);
    });

    return result;
  }

  getGlobalPrefix() {
    return this.globalPrefix;
  }

  getTabSpacing(totalSpace, text) {
    if (text.lenght >= totalSpace) {
      return text.substring(0, totalSpace);
    }

    const numberOfTabs = (totalSpace - text.length) / 4;
    let tabString = '';
    for (let i = 0; i < Math.ceil(numberOfTabs); i++) {
      tabString += '\t';
    }
    return text.trim() + tabString;
  }
}

module.exports = AuradocSnippetService;
