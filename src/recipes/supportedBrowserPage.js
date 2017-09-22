/* 
    RECIPE: SupportedBrowserPage
    -------------------------------------------------------------
    Author: Malick Sere, Lia Hiscock, Joel Ramos, Morgan Graham
    Description: This recipe looks for strings that would indicate that a page is a "supported browser" page.
*/



void function () {
    window.CSSUsage.StyleWalker.recipesToRun.push(function SupportedBrowserPage(element, results) {
        //doesn't go to microsoft sites
        if (window.location.href.toString().indexOf("microsoft.com") !== -1 || window.location.href.toString().indexOf("forum") !== -1) {
            return results;
        }

        if (element.nodeName !== "HTML" && element.nodeName !== "SCRIPT" && element.nodeName !== "BODY") {
            var directTextContent = '';
            for (var i = element.childNodes.length; i>0; i--) {
                var childNode = element.childNodes[i-1];
                if (childNode.nodeType === Node.TEXT_NODE) { directTextContent = childNode.nodeValue + ' ' + directTextContent; }
            }
            var find = new RegExp(/(\s|^)((Supported|Compatible|Recommended|Required)\s(\w+\s){0,3}Browser)|(Browser (Support|Recommendation|Compatibility|Requirement))|(System Requirement)s?(\r\n|\n|\W|\s|$)/gi);
            var matches = directTextContent.match(find);

            if (matches !== null) {
                results["browserPage"] = results["browserPage"] || { count: 0, values: [] };
                results["browserPage"].count++;
                for (var i = 0; i < matches.length; i++) {
                    results["browserPage"].values[matches[i]] = results["browserPage"].values[matches[i]] || { count: 0 };
                    results["browserPage"].values[matches[i]].count++;
                }

                //checks if is visible on page
                results["visibility"] = results["visibility"] || { value: "false" };
                if (results["visibility"].value === "false") {
                    results["visibility"].value = isVisible(element).toString();
                }

            }
        }
        return results;
    });
}();



