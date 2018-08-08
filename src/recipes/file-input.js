/*
    RECIPE: File Input Usage
    -------------------------------------------------------------
    Author: Greg Whitworth
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function fileInputUsage(/*HTML DOM Element*/ element, results) {
        if(element.nodeName == "INPUT") {
            if (element.attributes.length > 0) {
                for(var n = 0; n < element.attributes.length; n++) {
                    if(element.attributes[n].name == "type") {
                        if (element.attributes[n].value.toLowerCase() === "file") {
                            results["file"] = results["file"] || { count: 0 };
                            results["file"].count++;
                        }
                    }
                }
            }
        }

        return results;
    });
}();