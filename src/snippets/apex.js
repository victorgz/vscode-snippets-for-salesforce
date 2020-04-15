class ApexSnippetService {

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
        }
    }

    initialize() {
        this.globalPrefix = this.extensionConfiguration.prefix || '!! ';
        this.createReplacementItems();
        this.buildFormattedSnippets();
    }

    createReplacementItems() {
        this.replacementItems = {
            authorName: this.gitConfiguration.name || '${21:Your name}',
            authorEmail: this.gitConfiguration.email || '${22:email@email.com}',
            topClassSeparator: this.extensionConfiguration.apex.lenghtOfClassCommentSeparator === 'long' ? "/*************************************************************************************************************" : "/**",
            bottomClassSeparator: this.extensionConfiguration.apex.lenghtOfClassCommentSeparator === 'long' ? "**************************************************************************************************************/" : "*/",
            topMethodSeparator: this.extensionConfiguration.apex.lenghtOfMethodCommentSeparator === 'long' ? "/*********************************************************************************************************" : "/**",
            bottomMethodSeparator: this.extensionConfiguration.apex.lenghtOfMethodCommentSeparator === 'long' ? "**********************************************************************************************************/" : " */"
        }
    }

    buildFormattedSnippets() {
        this.formattedSnippets = {
            docAuthor: {
                "prefix": "doc @author",
                "scope": "apex",
                "body": [
                    "* @author\t\t\t" + this.replacementItems.authorName.trim() + " <" + this.replacementItems.authorEmail.trim() + ">"
                ]
            },

            docDescription: {
                "prefix": "doc @description",
                "scope": "apex",
                "body": [
                    "* @description\t\t${30:Description of your code}",
                ]
            },

            docVersion: {
                "prefix": "doc @version",
                "scope": "apex",
                "body": [
                    "* @version\t\t${80:1.0}\t\t$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE\t\t" + this.getTabSpacing(20, this.replacementItems.authorName) + " \t${81:Changes desription}",
                ]
            },

            docParam: {
                "prefix": "doc @param",
                "scope": "apex",
                "body": [
                    "* @param\t\t\t${40:String} ${41:param} : ${42:Explanation}"
                ]
            },

            docReturn: {
                "prefix": "doc @return",
                "scope": "apex",
                "body": [
                    "* @return\t\t\t${50:Explanation of the return value}"
                ]
            },

            docException: {
                "prefix": "doc @exception",
                "scope": "apex",
                "body": [
                    "* @exception\t\t${60:ExceptionType} : ${61:Why the exception would be thrown}"
                ]
            },

            docDeprecated: {
                "prefix": "doc @deprecated",
                "scope": "apex",
                "body": [
                    "* @deprecated\t\t${70:Explanation}"
                ]
            },

            docName: {
                "prefix": "doc @name",
                "scope": "apex",
                "body": [
                    "* @name\t\t\t${10:The name of your class or method}"
                ]
            },

            docDate: {
                "prefix": "doc @date",
                "scope": "apex",
                "body": [
                    "* @date\t\t\t$CURRENT_DATE / $CURRENT_MONTH / $CURRENT_YEAR"
                ]
            }
        };

        this.formattedSnippets.docMethodComment = {
            "prefix": "doc method",
            "scope": "apex",
            "body": [
                this.replacementItems.topMethodSeparator,
                " " + this.formattedSnippets.docName.body,
                " " + this.formattedSnippets.docAuthor.body,
                " " + this.formattedSnippets.docDate.body,
                " " + this.formattedSnippets.docDescription.body,
                " " + this.formattedSnippets.docParam.body,
                " " + this.formattedSnippets.docReturn.body,
                this.replacementItems.bottomMethodSeparator
            ]
        };

        this.formattedSnippets.docClassComment = {
            "prefix": "doc class",
            "scope": "apex",
            "body": [
                this.replacementItems.topClassSeparator,
                " " + this.formattedSnippets.docName.body,
                " " + this.formattedSnippets.docAuthor.body,
                " " + this.formattedSnippets.docDate.body,
                " " + this.formattedSnippets.docDescription.body,
                " *",
                " * Changes (version)",
                " * -----------------------------------------------------------------------------------------------------------",
                " * \t\t\t\tNo.\t\tDate\t\t\tAuthor\t\t\t\t\tDescription",
                " * \t\t\t\t----\t------------\t--------------------\t----------------------------------------------",
                " " + this.formattedSnippets.docVersion.body,
                " *",
                this.replacementItems.bottomClassSeparator
            ]
        }
    }

    getCompletionItems(range) {
        let result = [];

        Object.values(this.formattedSnippets).forEach(snippetDef => {
            const completionItem = new this.vscodeModule.CompletionItem(this.globalPrefix + snippetDef.prefix);
            completionItem.filterText = this.globalPrefix + snippetDef.prefix;
            completionItem.insertText = new this.vscodeModule.SnippetString(snippetDef.body.join('\n'));
            completionItem.documentation = new this.vscodeModule.MarkdownString(snippetDef.description);
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

};

module.exports = ApexSnippetService;