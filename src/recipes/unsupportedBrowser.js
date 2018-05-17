/* 
    RECIPE: unsupported browser
    -------------------------------------------------------------
    Author: Morgan Graham, Lia Hiscock
    Description: Looking for phrases that tell users that Edge is not supported, or to switch browers. 
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function unsupportedBrowser( element, results) {        
        //tests for phrases
        var switchPhraseString = new RegExp("((?:Switch to|Get|Download|Install)(?:\\w|\\s)+(?:Google|Chrome|Safari|firefox|Opera|Internet Explorer|IE))","i");
        var supportedPhraseString = new RegExp("((?:browser|Edge)(?:\\w|\\s)+(?:isn't|not|no longer)(?:\\w|\\s)+(?:supported|compatible))", "i");
        var needles = [{str:switchPhraseString, name:"switchPhrase"},
                        {str:supportedPhraseString, name:"supportedPhrase"}];;

        for(var i = 0; i < needles.length; i++) {
            var found = element.textContent.match(needles[i].str);            
            if(found) {
                if(found.length > 0 && found !== (null || undefined)) {
                    results[needles[i].name] = results[needles[i].name] || {count: 0, match: "", container: ""};
                    results[needles[i].name].count++;

                    var parent = element.parentElement;
                    if(parent) {
                        var outer = element.parentElement.outerHTML;
                        var val = outer.replace(element.parentElement.innerHTML, "");
                        results[needles[i].name].container = val;
                    }
                    
                    found = remove(found, " ");
                    results[needles[i].name].match = found.join();
                }
            }
        }
        
        return results;
    });

    function remove(array, element) {
        return array.filter(e => e !== element);
    }
}();
