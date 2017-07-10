/* 
    RECIPE: unsupported browser
    -------------------------------------------------------------
    Author: Morgan Graham, Lia Hiscock
    Description: Looking for phrases that tell users that Edge is not supported, or to switch browers. 
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function unsupportedBrowser( element, results) {        
        //tests for phrases
        var switchPhraseString = new RegExp("(Switch to|Get|Download|Install)(\\w|\\s)+(Google|Chrome|Safari|firefox|Opera|Internet Explorer)","i");
        var supportedPhraseString = new RegExp("(browser|Edge)(\\w|\\s)+(isn't|not|no longer)(\\w|\\s)+(supported|compatible)", "i");
        var needles = [{str:switchPhraseString, name:"switchPhrase"},
                        {str:supportedPhraseString, name:"supportedPhrase"}];;

        for(var i = 0; i < needles.length; i++) {
            if((needles[i].str).test(element.textContent)) {
                results[needles[i].name] = results[needles[i].name] || {count: 0};
                results[needles[i].name].count++;
            }
        }
        
        return results;
    });
}();

