/*
    RECIPE: browserMentions
    -------------------------------------------------------------
    Author: Morgan, Malick, Lia, Joel
    Description: Finding sites that support other browsers but don't include Edge

*/
void function () {
    window.CSSUsage.StyleWalker.recipesToRun.push(function browserMentions(element, results) {
        var browsers = ["internet explorer", "opera", "chrome", "firefox", "safari", "edge"];
        var string = element.innerText;
        if(string != null)
            {
                var str = string.toLowerCase();
                for (var x = 0; x < browsers.length; x++)
                    {
                        if(str.includes(browsers[x]))
                            {
                                results[browsers[x].name].values[matches[m]] = results[browsers[x]] || { count: 0 };
                                results[browsers[x].name].values[matches[m]].count++;
                            }
                    }
            }
        return results;
    });
}();



