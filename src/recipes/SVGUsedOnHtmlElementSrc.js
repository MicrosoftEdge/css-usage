/* 
    RECIPE: SVGUsedOnHtmlElementSrc
    -------------------------------------------------------------
    Author: <YOUR NAME>
    Description: <WHAT IS YOUR RECIPE LOOKING FOR>
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SVGUsedOnHtmlElementSrc( element, results) {
        for(var n = 0; n < element.attributes.length; n++) {
            if(element.attributes[n].name == "src") {
                if(element.attributes[n].value.indexOf(".svg") != -1){
                    results['SVGUsedOnHtmlElementSrc'] = results['SVGUsedOnHtmlElementSrc'] || { count: 0 };
                    results['SVGUsedOnHtmlElementSrc'].count++;
                    break;
                }
            }
        }    
        return results;
    });
}();



