/* 
    RECIPE: SVGSyntaxUsed
    -------------------------------------------------------------
    Author: Joshua Berenhaus
    Description: <svg> tag found
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SVGSyntaxUsed( element, results) {
        if(element.nodeName == "svg") {
            results['SVGSyntaxUsed'] = results['SVGSyntaxUsed'] || { count: 0 };
            results['SVGSyntaxUsed'].count++;
        }
        
        return results;
    });
}();



