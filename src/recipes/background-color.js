/*
    RECIPE: BACKGROUND-COLOR
    -------------------------------------------------------------
    Author: Greg Whitworth
    Description: This recipe is solely checking for background-color for
    data analysis purposes.
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push(function backgroundColorProp(/*HTML DOM Element*/ element, results) {

        // Bail if the element doesn't have the props we're looking for
        if(!element.CSSUsage || !(element.CSSUsage["background-color"])) return;

        var values = [];

        values = values.concat(element.CSSUsage["background-color"].valuesArray);

        for(var i = 0; i < values.length; i++) {
            var value = values[i];
            results["backgroundColorCount"] = results["backgroundColorCount"] || { count: 0 };
            results["backgroundColorCount"].count++;
        }

        return results;
    });
}();