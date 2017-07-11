/* 
    RECIPE: SupportedBrowserPage
    -------------------------------------------------------------
    Author: Malick Sere, Lia Hiscock, Joel Ramos, Morgan Graham
    Description: This recipe looks for strings that would indicate that a page is a "supported browser" page.
*/    



void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SupportedBrowserPage( element, results) {
        var str = element.textContent;
        var find = new RegExp("((Supported|Compatible|Recommended|Required) (Desktop)?[\w\s]{0,15} Browser)|(Browser (Support|Recommendation|Compatibility|Requirement))","i");
        if(find.test(str))
        {
            results["browserPage"] = results["browserPage"] || {count:0};
            results.browserPage.count++;
        }

        return results;
    });
}();

