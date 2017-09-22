/* 
    RECIPE: imgEdgeSearch
    -------------------------------------------------------------
    Author: Morgan, Lia, Joel, Malick
    Description: Looking for sites that do not include edge as a supported browser within images
*/

void function () {
    window.CSSUsage.StyleWalker.recipesToRun.push(function imgEdgeSearch(element, results){
        //doesn't go to microsoft sites
        if(window.location.href.toString().indexOf("microsoft.com") !== -1 || window.location.href.toString().indexOf("forum") !== -1){
            return results;
        }

        //tests for images
        if(element.nodeName == "IMG"){
            var browsers = [{ re: (new RegExp("(internet(\\s|(\\-|\\_))?explorer|(^|\\W)ie($|\\W))", "gi")), name: "Internet Explorer" },
            { re: (new RegExp("chrome[^b|$]", "gi")), name: "Chrome" },
            { re: (new RegExp("firefox", "gi")), name: "Firefox" },
            { re: (new RegExp("safari", "gi")), name: "Safari" },
            { re: (new RegExp("(^|o|\\W)edge", "gi")), name: "Edge" },
            { re: (new RegExp("(^|[o]|\\W)opera([^t]|\\W|$)", "gi")), name: "Opera" }];

            for(var i = 0; i < browsers.length; i++){
                var alt = element.getAttribute("alt");
                if(!!alt){//null check
                    if(browsers[i].re.test(alt)){
                        var altMatch = alt.match(browsers[i].re);

                        results[browsers[i].name] = results[browsers[i].name] || { count: 0, values: [] };
                        results[browsers[i].name].count++;                        
                    }
                }
                var src=element.getAttribute("src");
                if(!!src){//null check
                    if(browsers[i].re.test(src)){
                        var srcMatch = src.match(browsers[i].re);

                        results[browsers[i].name] = results[browsers[i].name] || { count: 0, values: [] };
                        results[browsers[i].name].count++;

                        for(var k = 0; k < srcMatch.length; k++){
                            results[browsers[i].name].values[srcMatch[k]] = results[browsers[i].name].values[srcMatch[k]] || { count: 0 };
                            results[browsers[i].name].values[srcMatch[k]].count++;
                        }

                        ///checks if visible on page
                        results["visibility"] = results["visibility"] || {value:"false"};
                        if(results["visibility"].value === "false"){
                            results["visibility"].value = isVisible(element).toString();
                        }
                    }
                }
            }
        }

        return results;
    });
}();