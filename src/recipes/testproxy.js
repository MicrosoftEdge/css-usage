/* 
    RECIPE: Fiddler proxy tester
    -------------------------------------------------------------
    Author: Mustapha Jaber
    Description: Use Fiddler to check usage of getElementById on the web.
*/

window.apiCount = 0;
window.alert = function (alert) {
    return function (string) {
        window.apiCount++;
        return alert(string);
    };
}(window.alert);

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function testFiddler(/*HTML DOM Elements*/ elements, results) {
        var recipeName = "alert"
        if(window.apiCount > 0)
        {
            results[recipeName] = results[recipeName] || { count: 0, };
            results[recipeName].count = window.apiCount;
        }return results;
    });
}();