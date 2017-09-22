/* 
    RECIPE: practiceTestForEdge
    -------------------------------------------------------------
    Author: Morgan
    Description: Looking for sites that do not include edge as a supported browser
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function practiceTestForEdge( element, results) {
        if(element.nodeName == "IMG" && element.innerText.indexOf("alt") != -1) {
            if(element.alt.indexOf("(Internet Explorer|IE|firefox|Chrome|Safari|Edge") != -1) {
                
            }
        }
        if(element.innerHTML.indexOf("(Get.{0,5}(Google|Chrome)|(browser|Edge).{0,6}(isn't|not).{0,7}(supported|compatible))") != -1) {
            results[""] = results[testForEdge] || {count: 0};
            results[testForEdge].count++;
        }
        return results;
    });
}();

