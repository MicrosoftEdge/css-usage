/* 
    RECIPE: <NAME OF RECIPE>
    -------------------------------------------------------------
    Author: <YOUR NAME>
    Description: <WHAT IS YOUR RECIPE LOOKING FOR>*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function edge_search ( element, results) {
        if (element.textContent.includes("Edge"/i))
        {
            results["edge"] = results["edge"] || {count: 0};
            results["edge"]++;
        }
        return results;
    });
}();
