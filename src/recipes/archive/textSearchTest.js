/* 
    RECIPE: textSearchTest
    -------------------------------------------------------------
    Author: Morgan, Lia, Joel, Malick
    Description: Looking for sites that do not include edge as a supported browser
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function textSearchTest( element, results) {
        //tests for phrases
        if((new RegExp("(Switch to|Get|Download|Install)(\w|\s)+(Google|Chrome|Safari|firefox|Opera|Internet Explorer)","i")).test(element.innerHTML)) {
            results["switchPhrase"] = results["switchPhrase"] || {count: 0};
            results["switchPhrase"].count++;
        }
        if((new RegExp("(browser|Edge)(\w|\s)+(isn't|not)(\w|\s)+(supported|compatible)","i")).test(element.innerHTML)) {
            results["supportedPhrase"] = results["supportedPhrase"] || {count: 0};
            results["supportedPhrase"].count++;
        }
        //tests for presence of browsers
        var browsers = ["Chrome", "Firefox", "Safari", "Opera", "InternetExplorer", "Edge"];
        for (var i = 0; i < browsers.length; i++) {
            if(element.innerHTML.includes(browsers[i])) {
                results[browsers[i]] = results[browsers[i]] || {count: 0};
                results[browsers[i]].count++;
            }
        }
        
        return results;
    });
}();
