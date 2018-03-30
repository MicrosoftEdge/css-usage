/*
    RECIPE: scriptElemStats
    -------------------------------------------------------------
    Author: thomasmo
    Description: Collect stats for script elements
*/


void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function scriptElemStats( element, results) {
        window._elementCount = window._elementCount || 0;
        window._elementCount++;
        if(element.nodeName.toLowerCase() == "script") {
            results["data"] = results["data"] || [];
            
            var elemData = {
                index :         window._elementCount,
                async :         element.hasAttribute("async")   ? 1 : 0,
                defer :         element.hasAttribute("defer")   ? 1 : 0,
                externalSrc :   element.hasAttribute("src")     ? 1 : 0,
                parentElem :    element.parentNode.nodeName.toLowerCase()
            };
            
            results["data"].push(elemData);
        }

        return results;
    });
}();

/*
void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function scriptElemStats( element, results) {
        if(element.nodeName.toLowerCase() == "script") {
            results["data"] = results["data"] || {
                total : 0,
                async : 0,
                defer : 0,
                externalSrc : 0,
                parentElemHead : 0,
                parentElemBody : 0,
                parentElemOther : 0
            };

            var result = results["data"];
            result.total++;

            if (element.hasAttribute("async")) {
                result.async++;
            }
            if (element.hasAttribute("defer")) {
                result.defer++;
            }
            if (element.hasAttribute("src")) {
                result.externalSrc++;
            }

            parentElemName = element.parentNode.nodeName.toLowerCase();
            if (parentElemName === "head") {
                result.parentElemHead++;
            } else if (parentElemName === "body") {
                result.parentElemBody++;
            } else {
                result.parentElemOther++;
            }
        }

        return results;
    });
}();
*/