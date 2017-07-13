/* 
    RECIPE: SupportedBrowserPage
    -------------------------------------------------------------
    Author: Malick Sere, Lia Hiscock, Joel Ramos, Morgan Graham
    Description: This recipe looks for strings that would indicate that a page is a "supported browser" page.
*/    



void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SupportedBrowserPage( element, results) {
        
        if(element.nodeName !== "HTML" && element.nodeName !== "SCRIPT" && element.nodeName !== "BODY" )
        {
            var str = element.textContent;
            var find = new RegExp(/((Supported|Compatible|Recommended|Required)[\w\s]{0,15} Browser)|(Browser (Support|Recommendation|Compatibility|Requirement))/gi);
            var matches = str.match(find);
            if(matches !== null)
            {
                results["browserPage"] = results["browserPage"] || {values:[]};
                for(var i = 0; i < matches.length; i++) 
                {
                    results["browserPage"].values[matches[i]] = results["browserPage"].values[matches[i]] || {count: 0};
                    results["browserPage"].values[matches[i]].count++;
                }
                return results;
            }
        }   
    });
}();



