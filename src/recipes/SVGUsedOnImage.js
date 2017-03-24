/* 
    RECIPE: SVGUsedOnImage
    -------------------------------------------------------------
    Author: <YOUR NAME>
    Description: <WHAT IS YOUR RECIPE LOOKING FOR>
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SVGUsedOnImage( element, results) {
        if(element.nodeName == "IMG") {
            for(var n = 0; n < element.attributes.length; n++) {
                if(element.attributes[n].name == "src") {
                    if(element.attributes[n].value.indexOf(".svg") != -1){
                        results['imgsrc'] = results['imgsrc'] || { count: 0 };
                        results['imgsrc'].count++;
                        break;
                    }
                }
            }    
        }
        
        return results;
    });
}();



