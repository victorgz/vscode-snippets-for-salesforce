class ApexSnippetService {

    constructor(apexSettings, vscodeModule, gitConfig, globalPrefix) {
        this.apexSettings = apexSettings;
        this.vscodeModule = vscodeModule;
        this.gitConfig = gitConfig;
        this.globalPrefix = globalPrefix;

        this.replacementItems = {
            authorName: this.gitConfig.username || this.apexSettings.authorname || '${1:Your name}',
            authorEmail: this.gitConfig.useremail || this.apexSettings.authoremail || '${2:email@email.com}',
            topClassSeparator: this.apexSettings.classSeparatorLength === 'long' ? "/*-----------------------------------------------------------------------------------------------------------//" : "/**",
            bottomClassSeparator: this.apexSettings.classSeparatorLength === 'long' ? "*-----------------------------------------------------------------------------------------------------------*/" : "**/",
            topMethodSeparator: this.apexSettings.methodSeparatorLength === 'long' ? "/******************************************************************************************************" : "/**",
            bottomMethodSeparator: this.apexSettings.methodSeparatorLength === 'long' ? "******************************************************************************************************/" : "**/"
        }

        this.formattedSnippets = this.buildFormattedSnippets();
    }


    buildFormattedSnippets() {
        return {
            docMethodComment: {
                "prefix": "apexdoc method",
                "scope": "apex",
                "body": [
                    this.replacementItems.topMethodSeparator,
                    "* @Method\t\t\t:\t${1:nameOfYourMethod}",
                    "* @Author\t\t\t:\t" + this.replacementItems.authorName + " <" + this.replacementItems.authorEmail + ">",
                    "* @Created\t\t\t:\t$CURRENT_DATE / $CURRENT_MONTH / $CURRENT_YEAR",
                    "* @Description\t\t:\t${4:Description of your method}",
                    "* @Param\t\t\t:\t${5:String} ${6:param1} : ${7:Explanation of param1}",
                    "* @Returns\t\t\t:\t${8:Explanation of the return value}",
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
                    "* Author\t\t: " + this.replacementItems.authorName + " <" + this.replacementItems.authorEmail + ">",
                    "* Date\t\t\t: $CURRENT_DATE / $CURRENT_MONTH / $CURRENT_YEAR",
                    "* Description\t: ${3:Description of the class}",
                    "*",
                    "* Changes (version)",
                    "* -----------------------------------------------------------------------------------------------------------",
                    "* \t\t\t\tNo.\t\tDate\t\t\tAuthor\t\t\t\t\tDescription",
                    "* \t\t\t\t----\t------------\t--------------------\t---------------------------------------------",
                    "* @version\t\t${4:1.0}\t\t$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE\t\t" + this.replacementItems.authorName + "\t\t\t\t\t${6:Created}",
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

};

module.exports = ApexSnippetService;
