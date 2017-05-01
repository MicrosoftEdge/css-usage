/* 
    RECIPE: Calc using REM or EM units
    -------------------------------------------------------------
    Author: Greg Whitworth
    Description: We have a regression that affects the resolution
    of rem or em units within a calc() function.
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push(function calcRemOrEm(/*HTML DOM Element*/ element, results) {

        if(!element.CSSUsage) return;

        for(var i in element.CSSUsage) {
            var values = element.CSSUsage[i].valuesArray;

            values.forEach(function(value) {
                if(value.indexOf('calc(') != -1) {
                    var reg = /(rem|(?!r)em)/g;
                    var found = value.match(reg);

                    if(found != null) {
                        found.forEach(function(matched){
                            results[matched] = results[matched] || { count: 0 };
                            results[matched].count++;
                        }, this);
                    }
                }
            }, this);                
        }

        return results;
    });
}();