/* 
    RECIPE: PADDING HACK
    -------------------------------------------------------------
    Author: Greg Whitworth
    Description: The padding hack is utilized in CSS by setting
    a bottom padding with a percentage value of great than 50%
    as this forces the box to set its height to that of the width
    and artificially creating aspect ratio based on its contents.
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