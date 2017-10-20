/* 
    RECIPE: SVGInUrl
    -------------------------------------------------------------
    Author: Joshua Berenhaus
    Description: Find CSS Properties with url("___.svg") or url(data:image/svg+xml___)
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function SVGInUrl( element, results) {
        if(element.CSSUsage){
            var x = Object.keys(element.CSSUsage);


            for(var n = 0; n < x.length; n++){
                var value = element.CSSUsage[Object.keys(element.CSSUsage)[n]] //Grab the value of each item in the object
                //we want to know which are urls
                if(/url\((.+\.svg.?)\)/.test(value)){
                    results['SVGInUrl'] = results['SVGInUrl'] || {count : 0}
                    results['SVGInUrl'].count++;
                    break;
                // } else if (/url\((data\:image\/svg\+xml.+)\)/.test(value)){
                } else if (/svg\+xml\;base64/.test(value)){
                    results['SVGInUrlExplicit'] = results['SVGInUrlExplicit'] || {count : 0}
                    results['SVGInUrlExplicit'].count++;
                    break;
                }
            }
        }         
        return results;
    });
}();



