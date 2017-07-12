/* 
    RECIPE: browserMentions
    -------------------------------------------------------------
    Author: Morgan, Malick, Lia, Joel
    Description: Finding sites that support other browsers but don't include Edge
*/

void function () {
    window.CSSUsage.StyleWalker.recipesToRun.push(function browserMentions(element, results) {
        var str = element.innerText.toLowerCase();
        var browsers = ["internet explorer", "opera", "chrome", "firefox", "safari", "microsoft edge"];
        if (str !== "") {
            for (var x = 0; x < browsers.length; x++) {
                if (str.includes(browsers[x])) {
                    results[browsers[x]] = results[browsers[x]] || { count: 0 };
                    results[browsers[x]].count++;
                }
            }
        }
        return results;
    });
}();

