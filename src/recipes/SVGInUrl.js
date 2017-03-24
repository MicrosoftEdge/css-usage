/* 
    RECIPE: SVGUsedOnImage
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
                //alert(value);
                // if(value == "url()"){
                //     alert("url found");

                //     value
                    // var patttemp = new RegExp("url\((.+)\)");
                    // if(patttemp.test(value)){
                    //     alert(value)
                        var patt = new RegExp("url\(.+(\.svg).+\)");
                        if(patt.test(value)){
                            results['svginurl'] = results['svginurl'] || {count : 0}
                            results['svginurl'].count++;
                            break;
                            // alert("found a url that has svg in it!")
                        }
                    // }
                // }
            }
        }
        
        // for(var n = 0; n < element.CSSUsage.length; n++) {
        //         if(element.CSSUsage[n].value)
        //         if(element.attributes[n].name == "url") {
        //             if(element.attributes[n].value.indexOf(".svg") != -1){
        //                 results['imgsrc'] = results['imgsrc'] || { count: 0 };
        //                 results['imgsrc'].count++;
        //                 break;
        //             }
        //         }
        //     }          
        return results;
    });
}();



