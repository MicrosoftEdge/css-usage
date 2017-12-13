/* 
    RECIPE: z-index on static flex items
    -------------------------------------------------------------
    Author: Francois Remy
    Description: Get count of flex items who should create a stacking context but do not really
*/

void function() {

    window.CSSUsage.StyleWalker.recipesToRun.push( function zstaticflex(/*HTML DOM Element*/ element, results) {
        if(!element.parentElement) return;

        // the problem happens if the element is a flex item with static position and non-auto z-index
        if(getComputedStyle(element.parentElement).display != 'flex') return results;
        if(getComputedStyle(element).position != 'static') return results;
        if(getComputedStyle(element).zIndex != 'auto') {
            results.likely = 1;
        }

        // the problem might happen if z-index could ever be non-auto
        if(element.CSSUsage["z-index"] && element.CSSUsage["z-index"].valuesArray.length > 0) {
            results.possible = 1;
        }

    });
}();
