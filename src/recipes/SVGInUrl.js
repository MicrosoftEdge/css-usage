/* 
    RECIPE: SVGInUrl
    -------------------------------------------------------------
    Author: <YOUR NAME>
    Description: <WHAT IS YOUR RECIPE LOOKING FOR>
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SVGInUrl( element, results) {
        if(element.CSSUsage){
            var x = Object.keys(element.CSSUsage);


            for(var n = 0; n < x.length; n++){
                var value = element.CSSUsage[Object.keys(element.CSSUsage)[n]] //Grab the value of each item in the object
                //we want to know which are urls
                var patt = new RegExp(/url\((data\:image\/svg\+xml.+)|(.+\.svg.?)\)/);
                if(patt.test(value)){
                    results['SVGInUrl'] = results['SVGInUrl'] || {count : 0}
                    results['SVGInUrl'].count++;
                    break;
                }
            }
        }         
        return results;
    });
}();



