class ApexSnippetService {

    constructor(apexSettings, vscodeModule, gitConfig) {
        this.apexSettings = apexSettings;
        this.vscodeModule = vscodeModule;
        this.gitConfig = gitConfig;

        this.replacementItems = {
            authorName: this.gitConfig.username || '${1:Your name}',
            authorEmail: this.gitConfig.useremail || '${2:email@email.com}'
        }

        this.formattedSnippets = this.buildFormattedSnippets();
    }


    buildFormattedSnippets() {
        return {
            "Comment for Method Documentation": {
                "prefix": "!! apexdoc method",
                "scope": "apex",
                "body": [
                    "/******************************************************************************************************",
                    "* @Method\t\t\t:\t${1:nameOfYourMethod}",
                    "* @Author\t\t\t:\t" + this.replacementItems.authorName + " <" + this.replacementItems.authorEmail + ">",
                    "* @Created\t\t\t:\t$CURRENT_DATE / $CURRENT_MONTH / $CURRENT_YEAR",
                    "* @Description\t\t:\t${4:Description of your method}",
                    "* @Param\t\t\t:\t${5:String} ${6:param1} : ${7:Explanation of param1}",
                    "* @Returns\t\t\t:\t${8:Explanation of the return value}",
                    "******************************************************************************************************/"
                ]
            },

            "New Param for Method Comment Documentation": {
                "prefix": "!! apexdoc @param for method comment",
                "scope": "apex",
                "body": [
                    "* @Param\t\t\t:\t${1:String} ${2:param} : ${3:Explanation}"
                ]
            },

            "Comment for Class Documentation": {
                "prefix": "!! apexdoc class",
                "scope": "apex",
                "body": [
                    "/*-----------------------------------------------------------------------------------------------------------//",
                    "* Class Name\t: $TM_FILENAME_BASE",
                    "* Author\t\t: " + this.replacementItems.authorName + " <" + this.replacementItems.authorEmail + ">",
                    "* Date\t\t\t: $CURRENT_DATE / $CURRENT_MONTH / $CURRENT_YEAR",
                    "* Description\t: ${3:Description of the class}",
                    "*",
                    "* Changes (version)",
                    "* -------------------------------------------------------------------------------------------------",
                    "* \t\t\t\tNo.\t\tDate\t\t\tAuthor\t\t\t\t\tDescription",
                    "* \t\t\t\t----\t------------\t--------------------\t-----------------------------------",
                    "* @version\t\t${4:1.0}\t\t$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE\t\t" + this.replacementItems.authorName + "\t\t\t\t\t${6:Created}",
                    "* ",
                    "*-----------------------------------------------------------------------------------------------------------*/"
                ]
            },

            version: {
                "prefix": "!! apexdoc version for class comment",
                "scope": "apex",
                "description": "inserting new @versio here",
                "body": [
                    "* @version\t\t${4:1.0}\t\t$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE\t\t${5:Author}\t\t\t\t\t${6:Changes description}"
                ]
            }
        };
    }

    getCompletionItems() {
        let result = [];

        Object.values(this.formattedSnippets).forEach(snippetDef => {
            const completionItem = new this.vscodeModule.CompletionItem(snippetDef.prefix);
            completionItem.insertText = new this.vscodeModule.SnippetString(snippetDef.body.join('\n'));
            completionItem.documentation = new this.vscodeModule.MarkdownString(snippetDef.description);

            result.push(completionItem);
        });

        return result;
    }

};

module.exports = ApexSnippetService;
