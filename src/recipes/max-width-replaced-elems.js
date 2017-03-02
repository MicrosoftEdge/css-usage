/* 
    RECIPE: Max-width on Replaced Elements
    -------------------------------------------------------------
    Author: Greg Whitworth
    Description: This is investigation for the CSSWG looking into
    max-width with a % on a replaced element. If the results return
    too large we may want to take the next step to roughly determine
    if one of the parent's are depending on the sizing of its child.
    For example, abspos, table cell, floats, etc. That will be more
    computationally extensive so we'll start a simpler investigation first.

    Action Link: https://log.csswg.org/irc.w3.org/css/2017-03-01/#e778075
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function MaxWidthPercentOnReplacedElem(element, results) {
        // Bail if the element doesn't have the props we're looking for
        if(!element.CSSUsage || !(element.CSSUsage["max-width"])) return;

        var replacedElems = ["INPUT", "TEXTAREA"];
        var maxWidth = element.CSSUsage['max-width'];
        var width = element.CSSUsage['width'];

        if(width != undefined) return; // We only want auto sized boxes

        if(replacedElems.includes(element.nodeName)) {

            if(element.nodeName == "INPUT" && element.type != "text") {
                return;
            }

            // TSV eg: 5 recipe MaxWidthPercentOnReplacedElem INPUT count
            results[element.nodeName] = results[element.nodeName] || { count: 0 };
            results[element.nodeName].count++;
        }

        return results;
    });
}();