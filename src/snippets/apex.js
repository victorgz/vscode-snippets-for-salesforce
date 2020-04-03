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

    initialize(){
        this.globalPrefix = this.extensionConfiguration.prefix || '!! ';
        this.createReplacementItems();
        this.buildFormattedSnippets();
    }

    createReplacementItems() {
        this.replacementItems = {
            authorName: this.gitConfiguration.name || this.extensionConfiguration.apex.authorname || '${1:Your name}',
            authorEmail: this.gitConfiguration.email || this.extensionConfiguration.apex.authoremail || '${2:email@email.com}',
            topClassSeparator: this.extensionConfiguration.apex.classSeparatorLength === 'long' ? "/*-----------------------------------------------------------------------------------------------------------//" : "/**",
            bottomClassSeparator: this.extensionConfiguration.apex.classSeparatorLength === 'long' ? "*-----------------------------------------------------------------------------------------------------------*/" : "*/",
            topMethodSeparator: this.extensionConfiguration.apex.methodSeparatorLength === 'long' ? "/******************************************************************************************************" : "/**",
            bottomMethodSeparator: this.extensionConfiguration.apex.methodSeparatorLength === 'long' ? "******************************************************************************************************/" : " */"
        }
    }

    buildFormattedSnippets() {
        this.formattedSnippets = {
            docMethodComment: {
                "prefix": "apexdoc method",
                "scope": "apex",
                "body": [
                    this.replacementItems.topMethodSeparator,
                    " * @Method\t\t\t:\t${1:nameOfYourMethod}",
                    " * @Author\t\t\t:\t" + this.replacementItems.authorName.trim() + " <" + this.replacementItems.authorEmail.trim() + ">",
                    " * @Created\t\t\t:\t$CURRENT_DATE / $CURRENT_MONTH / $CURRENT_YEAR",
                    " * @Description\t\t:\t${4:Description of your method}",
                    " * @Param\t\t\t:\t${5:String} ${6:param1} : ${7:Explanation of param1}",
                    " * @Returns\t\t\t:\t${8:Explanation of the return value}",
                    this.replacementItems.bottomMethodSeparator
                ]
            },

            docMethodItemParam: {
                "prefix": "apexdoc @param for method comment",
                "scope": "apex",
                "body": [
                    "* @Param\t\t\t:\t${1:String} ${2:param} : ${3:Explanation}"
                ]
            },

            docClassComment: {
                "prefix": "apexdoc class",
                "scope": "apex",
                "body": [
                    this.replacementItems.topClassSeparator,
                    "* Class Name\t: $TM_FILENAME_BASE",
                    "* Author\t\t: " + this.replacementItems.authorName.trim() + " <" + this.replacementItems.authorEmail.trim() + ">",
                    "* Date\t\t\t: $CURRENT_DATE / $CURRENT_MONTH / $CURRENT_YEAR",
                    "* Description\t: ${3:Description of the class}",
                    "*",
                    "* Changes (version)",
                    "* -----------------------------------------------------------------------------------------------------------",
                    "* \t\t\t\tNo.\t\tDate\t\t\tAuthor\t\t\t\t\tDescription",
                    "* \t\t\t\t----\t------------\t--------------------\t---------------------------------------------",
                    "* @version\t\t${4:1.0}\t\t$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE\t\t" + this.getTabSpacing(20, this.replacementItems.authorName) + " \t${6:Created}",
                    "* ",
                    this.replacementItems.bottomClassSeparator
                ]
            },

            docClassItemVersion: {
                "prefix": "apexdoc version for class comment",
                "scope": "apex",
                "description": "inserting new @versio here",
                "body": [
                    "* @version\t\t${4:1.0}\t\t$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE\t\t${5:Author}\t\t\t\t\t${6:Changes description}"
                ]
            }
        };
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

    getGlobalPrefix(){
        return this.globalPrefix;
    }

    getTabSpacing(totalSpace, text){
        if(text.lenght >= totalSpace){
            return text.substring(0, totalSpace);
        }

        const numberOfTabs = (totalSpace - text.length) / 4;
        let tabString = '';
        for(let i = 0; i < Math.ceil(numberOfTabs); i++){
            tabString += '\t';
        }
        return text.trim() + tabString;
    }

};

module.exports = ApexSnippetService;
