/* 
    RECIPE: <NAME OF RECIPE>
    -------------------------------------------------------------
    Author: <YOUR NAME>
    Description: <WHAT IS YOUR RECIPE LOOKING FOR>
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SVGSyntaxUsed( element, results) {
        if(element.nodeName == "svg") {
            results['svgHTML'] = results['svgHTML'] || { count: 0 };
            results['svgHTML'].count++;
        }
        
        return results;
    });
}();



