/* 
    RECIPE: imgEdgeSearch
    -------------------------------------------------------------
    Author: Morgan, Lia, Joel, Malick
    Description: Looking for sites that do not include edge as a supported browser within images
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function imgEdgeSearch( element, results) {
        //tests for images
        if(element.nodeName == "IMG") {
            var browsers = [{str:(new RegExp("(internet(\\s|(\\-|\\_))?explorer|ie)", "i")), name:"Internet Explorer"}, 
            {str:(new RegExp("chrome", "i")), name:"Chrome"},
            {str:(new RegExp("firefox", "i")), name:"Firefox"},
            {str:(new RegExp("safari", "i")), name:"Safari"},
            {str:(new RegExp("edge", "i")), name:"Edge"},
            {str:(new RegExp("opera", "i")), name:"Opera"}];

            for(var i = 0; i < browsers.length; i++) {
                if(element.getAttribute("alt") != null) {
                    if(browsers[i].str.test(element.getAttribute("alt").toString())) {
                        results[browsers[i].name] = results[browsers[i].str] || {count: 0};
                        results[browsers[i].name].count++;
                    }
                }
                if(element.getAttribute("src") != null) {
                    if(browsers[i].str.test(element.getAttribute("src").toString())) {
                        results[browsers[i].name] = results[browsers[i].str] || {count: 0};
                        results[browsers[i].name].count++;
                    }
                }
            }    
        }

        return results;
    });
}();