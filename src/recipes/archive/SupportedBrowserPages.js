/* 
    RECIPE: SupportedBrowserPages
    -------------------------------------------------------------
    Author: <YOUR NAME>
    Description: <WHAT IS YOUR RECIPE LOOKING FOR>
*/    



void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SupportedBrowserPages( element, results) {
        var str = element.textContent;
        var find = new RegExp("((Supported|Compatible|Recommended|Required) (Desktop)?(\\w|\\s)+Browser)|(Browser (Support|Recommendation|Compatibility|Requirement))","i");
        if(find.test(str))
        {
            results["browserPage"] = results["browserPage"] || {count:0};
            results.browserPage.count++;
        }

        return results;
    });
}();

