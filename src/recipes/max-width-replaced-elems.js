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

        if(!maxWidth.includes('%')) return;

         // We only want auto sized boxes
        if(width && !width.includes('auto')) return;

        if(replacedElems.includes(element.nodeName)) {

            if(element.nodeName == "INPUT" && element.type != "text") {
                return;
            }

            var s2fParent = parentIsPotentialShrinkToFit(element);
            if(s2fParent == undefined) return;

            // TSV eg: 5 recipe MaxWidthPercentOnReplacedElem INPUT count
            results[element.nodeName] = results[element.nodeName] || { 
                                                                        count: 0, 
                                                                        html: {}, 
                                                                        parent: {} 
                                                                    };

            results[element.nodeName].html[element.outerHTML] = "outerHTML";
            results[element.nodeName].parent[s2fParent.nodeName] = results[element.nodeName].parent[s2fParent.nodeName] || { classes: "", id: "" }
            results[element.nodeName].parent[s2fParent.nodeName].classes = [...s2fParent.classList].join();
            results[element.nodeName].parent[s2fParent.nodeName].id = s2fParent.id;
            results[element.nodeName].count++;
        }

        return results;
    });

    function parentIsPotentialShrinkToFit(elem) {
        var parent = elem.parentNode;

        if(parent != undefined && parent.nodeName != '#document') {
            var gcs = window.getComputedStyle(parent);

            // Check that a parent is potentially shrink to fit
            if(gcs.float == ('right') ||
               gcs.float == ('left') ||
               gcs.display == ('table-cell') || 
               gcs.display == ('flex') ||
               gcs.position == ('fixed') ||
               gcs.position == ('absolute')
            ) {
                return parent;
            }
            else {
                return parentIsPotentialShrinkToFit(parent);
            }
        }
    }
}();