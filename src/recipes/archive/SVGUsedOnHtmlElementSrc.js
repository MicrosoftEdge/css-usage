/* 
    RECIPE: SVGUsedOnHtmlElementSrc
    -------------------------------------------------------------
    Author: Joshua Berenhaus
    Description: Find instances of <img src="___.svg"
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SVGUsedOnHtmlElementSrc( element, results) {
        var patt = new RegExp(/data\:image\/svg\+xml.+/);
        for(var n = 0; n < element.attributes.length; n++) {
            if(element.attributes[n].name == "src") {
                if(element.attributes[n].value.indexOf(".svg") != -1){
                    results['SVGUsedOnHtmlElementSrc'] = results['SVGUsedOnHtmlElementSrc'] || { count: 0 };
                    results['SVGUsedOnHtmlElementSrc'].count++;
                    break;
                } else if (patt.test(element.attributes[n].value)){
                    results['SVGUsedOnHtmlElementSrcExplicit'] = results['SVGUsedOnHtmlElementSrcExplicit'] || {count : 0}
                    results['SVGUsedOnHtmlElementSrcExplicit'].count++;
                    break;
                }
            }
        }    
        return results;
    });
}();



