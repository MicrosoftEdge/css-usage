/* 
    RECIPE: SVGUsedOnHtmlElementData
    -------------------------------------------------------------
    Author: <YOUR NAME>
    Description: <WHAT IS YOUR RECIPE LOOKING FOR>
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SVGUsedOnHtmlElementData( element, results) {
        for(var n = 0; n < element.attributes.length; n++) {
            if(element.attributes[n].name == "type" && element.attributes[n].value.indexOf("image/svg+xml") != -1) {
                if(element.attributes[n+1].name == "data" && element.attributes[n+1].value.indexOf(".svg") != -1){
                    results['SVGUsedOnHtmlElementDataExplicit'] = results['SVGUsedOnHtmlElementDataExplicit'] || { count: 0 };
                    results['SVGUsedOnHtmlElementDataExplicit'].count++;
                    break;
                }
            } else if (element.attributes[n].name == "data" && element.attributes[n].value.indexOf(".svg") != -1){
                results['SVGUsedOnHtmlElementData'] = results['SVGUsedOnHtmlElementData'] || { count: 0 };
                results['SVGUsedOnHtmlElementData'].count++;
                break;
            }
        }    
        return results;
    });
}();



