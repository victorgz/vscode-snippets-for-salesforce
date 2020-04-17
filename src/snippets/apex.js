class ApexSnippetService {
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
    this.createReplacementItems();
    this.buildFormattedSnippets();
  }

  createReplacementItems() {
    this.replacementItems = {
      authorName: this.gitConfiguration.name || '${21:Your name}',
      authorEmail: this.gitConfiguration.email || '${22:email@email.com}',
      topClassSeparator:
        this.extensionConfiguration.apex.lenghtOfClassCommentSeparator ===
        'long'
          ? '/*************************************************************************************************************'
          : '/**',
      bottomClassSeparator:
        this.extensionConfiguration.apex.lenghtOfClassCommentSeparator ===
        'long'
          ? '**************************************************************************************************************/'
          : '*/',
      topMethodSeparator:
        this.extensionConfiguration.apex.lenghtOfMethodCommentSeparator ===
        'long'
          ? '/*********************************************************************************************************'
          : '/**',
      bottomMethodSeparator:
        this.extensionConfiguration.apex.lenghtOfMethodCommentSeparator ===
        'long'
          ? '**********************************************************************************************************/'
          : ' */'
    };
  }

  buildFormattedSnippets() {
    this.formattedSnippets = {
      docName: {
        prefix: 'doc @name',
        scope: 'Classes, methods and interfaces',
        description:
          'Add a new @name tag for your class and method comments. It represents the name of your class or method',
        body: ['* @name\t\t\t${10:The name of your class or method}'],
        example: ['* @name\tmyAwesomeMethod']
      },

      docAuthor: {
        prefix: 'doc @author',
        scope: 'Classes, methods and interfaces',
        description:
          'Add a new @author tag for your class and method comments. This includes the name and the email of the author. By default, these values will be filled automatically if there is an existing git cofiguration for the current project',
        body: [
          '* @author\t\t\t' +
            this.replacementItems.authorName.trim() +
            ' <' +
            this.replacementItems.authorEmail.trim() +
            '>'
        ],
        example: [
          '* @author\t' + 'John Snippet' + ' <' + 'john@snippet.demo' + '>'
        ]
      },

      docCreated: {
        prefix: 'doc @created',
        scope: 'Classes, methods and interfaces',
        description:
          'Add a new @created tag for your class and method comments. This indicate the date when the code was originally created. By default, the date will be filled automatically to today',
        body: [
          '* @created\t\t\t$CURRENT_DATE / $CURRENT_MONTH / $CURRENT_YEAR'
        ],
        example: ['* @created\t01 / 02 / 2020']
      },

      docDescription: {
        prefix: 'doc @description',
        scope: 'Classes, methods and interfaces',
        description:
          'Add a new @description tag for your class and method comments. You can provide an explanation of what your code does',
        body: ['* @description\t\t${30:Description of your code}'],
        example: [
          '* @description\tThis is an awesome piece of code doing cool stuff'
        ]
      },

      docVersion: {
        prefix: 'doc @version',
        scope: 'Classes and interfaces',
        description:
          'Add a new @version tag for your class comments. This refers is used to generate a change log, in which every contribution specifies the version, the date, the author and a description of the changes done',
        body: [
          '* @version\t\t${80:1.0}\t\t$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE\t\t' +
            this.getTabSpacing(20, this.replacementItems.authorName) + '\t${81:Changes desription}'
        ],
        example: [
          '* @version\t1.0\t2020-02-01\t' + 'John Snippet' + ' \tFix bugs'
        ]
      },

      docParam: {
        prefix: 'doc @param',
        scope: 'Methods',
        description:
          'Add a new @param tag for your method comments. Multiple @param lines can be included, and each of them will include its object type and name',
        body: ['* @param\t\t\t${40:String} ${41:param} : ${42:Explanation}'],
        example: ['* @param\tString username : The username used for login']
      },

      docReturn: {
        prefix: 'doc @return',
        scope: 'Methods',
        description:
          'Add a new @return tag for your method comments. This option describes what is returned in your method. Omit this tag for methods that returns void',
        body: ['* @return\t\t\t${50:Explanation of the return value}'],
        example: ['* @return\tA list of users subscribed to the campaign']
      },

      docException: {
        prefix: 'doc @exception',
        scope: 'Methods',
        description:
          'Add a new @exception tag for your method comments. This contains the type and a description of the exception that can potentially be thrown from your method',
        body: [
          '* @exception\t\t${60:ExceptionType} : ${61:Explanation of the exception thrown}'
        ],
        example: [
          '* @exception\tAuraHandledException : An external callout exception to be handled by the aura component'
        ]
      },

      docDeprecated: {
        prefix: 'doc @deprecated',
        scope: 'Classes, methods and interfaces',
        description:
          'Add a new @deprecated tag for your class and method coments. You can provide a description of why this code has been deprecated, in which API version and whether it has been replaced by another functionality',
        body: ['* @deprecated\t\t${70:Explanation}'],
        example: [
          '* @deprecated\tAs of API 1.1, replaced by Item.doSomethingMoreCool'
        ]
      }
    };

    this.formattedSnippets.docMethodComment = {
      prefix: 'doc method',
      scope: 'Methods',
      description:
        'Add a new block comment for your method. The comment includes basic information about your method explained with different tags. By default, it will include the name, author, created, description, param and return tags. Other additional tags can be included inside this comment',
      body: [
        this.replacementItems.topMethodSeparator,
        ' ' + this.formattedSnippets.docName.body,
        ' ' + this.formattedSnippets.docAuthor.body,
        ' ' + this.formattedSnippets.docCreated.body,
        ' ' + this.formattedSnippets.docDescription.body,
        ' ' + this.formattedSnippets.docParam.body,
        ' ' + this.formattedSnippets.docReturn.body,
        this.replacementItems.bottomMethodSeparator
      ],
      example: [
        '/**',
        ' ' + this.formattedSnippets.docName.example,
        ' ' + this.formattedSnippets.docAuthor.example,
        ' ' + this.formattedSnippets.docCreated.example,
        ' ' + this.formattedSnippets.docDescription.example,
        ' ' + this.formattedSnippets.docParam.example,
        ' ' + this.formattedSnippets.docReturn.example,
        ' */'
      ]
    };

    this.formattedSnippets.docClassComment = {
      prefix: 'doc class',
      scope: 'Classes and interfaces',
      description:
        'Add a new block comment for your class. The comment includes basic information about your class explained with different tags. By default, it will include the name, author, created, description and a changelog with version tags. Other additional tags can be included inside this comment',
      body: [
        this.replacementItems.topClassSeparator,
        ' * @name\t\t\t$TM_FILENAME_BASE',
        ' ' + this.formattedSnippets.docAuthor.body,
        ' ' + this.formattedSnippets.docCreated.body,
        ' ' + this.formattedSnippets.docDescription.body,
        ' *',
        ' * Changes (version)',
        ' * -----------------------------------------------------------------------------------------------------------',
        ' * \t\t\t\tNo.\t\tDate\t\t\tAuthor\t\t\t\t\tDescription',
        ' * \t\t\t\t----\t------------\t--------------------\t----------------------------------------------',
        ' ' + this.formattedSnippets.docVersion.body,
        ' *',
        this.replacementItems.bottomClassSeparator
      ],
      example: [
        '/**',
        ' ' + this.formattedSnippets.docName.example,
        ' ' + this.formattedSnippets.docAuthor.example,
        ' ' + this.formattedSnippets.docCreated.example,
        ' ' + this.formattedSnippets.docDescription.example,
        ' *',
        ' * Changes (version)',
        ' * -------------------',
        ' ' + this.formattedSnippets.docVersion.example,
        ' *',
        ' */'
      ]
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
    text = text.trim()
    if (text.length >= totalSpace) {
      return text.substring(0, totalSpace);
    }

    const numberOfTabs = (totalSpace - text.length) / 4;
    let tabString = '';
    for (let i = 0; i < Math.ceil(numberOfTabs); i++) {
      tabString += '\t';
    }
    return text + tabString;
  }
}

module.exports = ApexSnippetService;
