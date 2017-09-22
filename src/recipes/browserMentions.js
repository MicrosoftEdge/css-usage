
/*    
        RECIPE: browserMentions 
        Authors: Morgan, Lia, Malick, Joel
*/

void function () {
    window.CSSUsage.StyleWalker.recipesToRun.push(function browserMentions(element, results) {
        //doesn't go to microsoft sites
        if (window.location.href.toString().indexOf("microsoft.com") !== -1 || window.location.href.toString().indexOf("forum") !== -1) {
            return results;
        }

        if (element.nodeName !== "SCRIPT" && element.nodeName !== "META") {

            var str = element.cloneNode(true);
            var directTextContent = '';
            for (var i = element.childNodes.length; i > 0; i--) {
                var childNode = element.childNodes[i - 1];
                if (childNode.nodeType === Node.TEXT_NODE) { directTextContent = childNode.nodeValue + ' ' + directTextContent; }
            }

            var browsers = new RegExp(/(\s|^)(Opera|Internet Explorer|Firefox|Chrome|Edge|Safari|IE)(\r\n|\n|\W|\s|$)/gi);
            var browsers2 = new RegExp(/(Opera|Internet Explorer|Firefox|Chrome|Edge|Safari|IE)/gi);
            var matches = directTextContent.match(browsers);
            if (matches !== null) {
                results["browser"] = results["browser"] || { count: 0, values: [] };
                results["browser"].count++;

                for (var x = 0; x < matches.length; x++) {
                    var foundBrowserName = matches[x].match(browsers2)[0].toLowerCase();
                    results["browser"].values[foundBrowserName] = results["browser"].values[foundBrowserName] || { count: 0 }
                    results["browser"].values[foundBrowserName].count++;
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