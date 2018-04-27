/*
    RECIPE: imgEdgeSearch
    -------------------------------------------------------------
    Author: Morgan, Lia, Joel, Malick
    Description: Looking for sites that do not include edge as a supported browser
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function imgEdgeSearch( element, results) {
        //tests for images
        if(element.nodeName == "IMG") {
            var browsers = ["internetexplorer","ie","firefox","chrome","safari","edge", "opera"];
            for(var i = 0; i < browsers.length; i++) {
                let alt = element.getAttribute("alt");
                let src = element.getAttribute("src");

                if (alt) {
                    alt = alt.toLowerCase();
                }

                if (src) {
                    src = src.toLowerCase();
                }

                if(src.indexOf(browsers[i]) != -1|| alt.indexOf(browsers[i]) != -1) {
                    results[browsers[i]] = results[browsers[i]] || {count: 0, container: ""};
                    results[browsers[i]].count++;
                    var parent = element.parentElement;

                    if(parent) {
                        var outer = element.parentElement.outerHTML;
                        var val = outer.replace(element.parentElement.innerHTML, "");
                        results[browsers[i]].container = val;
                    }
                }

            }
        }

        return results;
    });
}();