/*
    RECIPE: unsupported browser
    -------------------------------------------------------------
    Author: Morgan Graham, Lia Hiscock
    Description: Looking for phrases that tell users that Edge is not supported, or to switch browers.
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function unsupportedBrowser(element, results) {
        var ignoreElements = ["SCRIPT", "META", "HEAD", "TITLE", "STYLE"];

        if (!element.CSSUsage || ignoreElements.includes(element.nodeName)) { return; }

        if(isElemVisibleTreeWalk(element)) {

        }

        //tests for phrases
        var switchPhraseString = new RegExp("((?:Switch to|Get|Download|Install|Use)(?:\\w|\\s)+(?:Google|Chrome|Safari|firefox|Opera|Internet Explorer))","i");
        var supportedPhraseString = new RegExp("((?:browser|Edge)(?:\\w|\\s)+(?:isn't|is not|not|no longer)(?:\\w|\\s)+(?:supported|compatible))", "i");
        var needles = [{str:switchPhraseString, name:"switchPhrase"},
                        {str:supportedPhraseString, name:"supportedPhrase"}];



        for(var i = 0; i < needles.length; i++) {
            var found = element.textContent.match(needles[i].str);
            if(found) {
                if(found.length > 0 && found !== (null || undefined)) {
                    results[needles[i].name] = results[needles[i].name] || {count: 0, match: [], container: ""};
                    results[needles[i].name].count++;

                    var parent = element.parentElement;
                    if(parent) {
                        var outer = element.parentElement.outerHTML;
                        var val = outer.replace(element.parentElement.innerHTML, "");
                        results[needles[i].name].container = val;
                    }

                    found = remove(found, " ");

                    found.forEach(f => {
                        if(!results[needles[i].name].match.includes(f)) {
                            results[needles[i].name].match.push(f);
                        }
                    });
                }
            }
        }

        return results;
    });

    function isElemVisibleTreeWalk(element) {
        if(element.parentNode !== null) {
            if(!isVisible(element)) {
                return false;
            }
            else {
                // Pass in the parent to check its parent
                isElemVisible(element.parentNode);
            }
        }

        return true;

    }

    function isVisible(element) {
        if (
            (element.CSSUsage["visibility"] && element.CSSUsage["visibility"].includes("hidden")) ||
            (element.CSSUsage["display"] && element.CSSUsage["display"].includes("none")) ||
            (element.CSSUsage["opacity"] && element.CSSUsage["opacity"].valuesArray.includes("0")) ||
            (element.getBoundingClientRect().width !== 0 && element.getBoundingClientRect().height !== 0)
         ) {
                return false;
        }

        return true;
    }

    function remove(array, element) {
        return array.filter(e => e !== element);
    }
}();
