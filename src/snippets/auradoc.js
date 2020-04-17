class AuradocSnippetService {
  constructor(vscodeModule, extensionConfiguration) {
    this.vscodeModule = vscodeModule;
    this.gitConfiguration = {
      name: undefined,
      email: undefined
    };
    this.extensionConfiguration = extensionConfiguration || {};
    this.globalPrefix =
      extensionConfiguration.prefix != undefined &&
      extensionConfiguration.prefix != ''
        ? extensionConfiguration.prefix
        : '!!';
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
    this.globalPrefix = this.globalPrefix =
      this.extensionConfiguration.prefix != undefined &&
      this.extensionConfiguration.prefix != ''
        ? this.extensionConfiguration.prefix
        : '!!';
    this.buildFormattedSnippets();
  }

  buildFormattedSnippets() {
    this.formattedSnippets = {
      docBasicStructure: {
        prefix: 'doc auradoc structure',
        description: 'Add a the basic structure for the auradoc file',
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
        ],
        example: [
          '<aura:documentation>',
          '\t<aura:description>',
          '\t\tDisplay a list of users',
          '\t</aura:description>',
          '\n',
          '\t<aura:example name="basicExample" ref="c:cmpExample" label="Basic Example">',
          '\tList of users with picture',
          '\t</aura:example>',
          '</aura:documentation>'
        ]
      },

      docTitle: {
        prefix: 'doc title',
        description: 'Insert a title in your auradoc description',
        body: ['<h4>${1:Title}</h4>'],
        example: ['<h4>Title</h4>']
      },
      docParagraph: {
        prefix: 'doc paragraph',
        description: 'Insert a paragraph in your auradoc description',
        body: ['<p>${1:Paragraph}</p>'],
        example: ['<p>Paragraph</p>']
      },
      docInlineCode: {
        prefix: 'doc inline code',
        description:
          'Insert an inline block of code in your auradoc description',
        body: ['<code>${1:code}</code>'],
        example: ['some <code>code</code> here']
      },
      docLink: {
        prefix: 'doc link',
        description: 'Insert a link to a URL in your auradoc description',
        body: ['<a href="${2:#}" target="_blank">${1:text}</a>'],
        example: ['<a href="#" target="_blank">link</a>']
      },
      docCodeBlock: {
        prefix: 'doc code block',
        description:
          'Insert a full code of block inside your auradoc description',
        body: [
          '$BLOCK_COMMENT_START Code markup must be escaped. For example, replace < characters with &lt; $BLOCK_COMMENT_END',
          '<pre><code class="language-markup">',
          '$0',
          '</code></pre>'
        ],
        example: [
          '<pre><code class="language-markup">',
          '\t<h1>Code</h1>',
          '\t<p>This is a code block</p>',
          '</code></pre>'
        ]
      },
      docBulletedList: {
        prefix: 'doc bulleted list',
        description: 'Insert a bulleted list in your auradoc description',
        body: [
          '<ul>',
          '\t<li>${1:Item1}</li>',
          '\t<li>${2:Item2}</li>',
          '</ul>'
        ],
        example: ['<ul>', '\t<li>Item1</li>', '\t<li>Item2</li>', '</ul>']
      },
      docNumberedList: {
        prefix: 'doc numbered list',
        description: 'Insert a numbered list in your auradoc description',
        body: [
          '<ol>',
          '\t<li>${1:Item1}</li>',
          '\t<li>${2:Item2}</li>',
          '</ol>'
        ],
        example: ['<ol>', '\t<li>Item1</li>', '\t<li>Item2</li>', '</ol>']
      },
      docTable: {
        prefix: 'doc table',
        description: 'Insert a table in your auradoc description',
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
        ],
        example: [
          '<table>',
          '\t<tr>',
          '\t\t<th>Column1</th>',
          '\t\t<th>Column2</th>',
          '\t</tr>',
          '\t<tr>',
          '\t\t<td>row1column1</td>',
          '\t\t<td>row1column2</td>',
          '\t</tr>',
          '\t<tr>',
          '\t\t<td>row2column1</td>',
          '\t\t<td>row2column2</td>',
          '\t</tr>',
          '</table>'
        ]
      },
      docAuraExample: {
        prefix: 'doc aura:example',
        description: 'Create a new example reference in your auradoc',
        body: [
          '<aura:example name="${1:basicExample}" ref="${2:c:basicExample}" label="${3:Basic Example}">',
          '\t$BLOCK_COMMENT_START Explanation of your example $BLOCK_COMMENT_END',
          '\t$0',
          '</aura:example>'
        ],
        example: [
          '<aura:example name="basicExample" ref="c:cmpExample" label="Basic Example">',
          '\tList of users with picture\n',
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
      completionItem.label = this.globalPrefix + snippetDef.prefix;
      completionItem.detail = `${snippetDef.prefix} - ${snippetDef.scope}`;
      completionItem.insertText = new this.vscodeModule.SnippetString(
        snippetDef.body.join('\n')
      );
      completionItem.documentation = new this.vscodeModule.MarkdownString(
        snippetDef.description +
          '\n' +
          '\n$(file-code) Example\n' +
          '\n```\n' +
          snippetDef.example.join('\n') +
          '\n```',
        true
      );
      completionItem.kind = this.vscodeModule.CompletionItemKind.Snippet;
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
