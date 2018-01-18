/*
    RECIPE: Div Count
    -------------------------------------------------------------
    Author: Greg Whitworth
    Description: This recipe is solely counting divs for
    data analysis purposes.
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function divCount(/*HTML DOM Element*/ element, results) {
        if(!element.CSSUsage) return;

        if(element.nodeName == "DIV") {
            results["DIV"] = results["DIV"] || { count: 0 };
            results["DIV"].count++;
        }

        return results;
    });
}();