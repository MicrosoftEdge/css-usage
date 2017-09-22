/* 
    RECIPE: navigatorLanguages
    -------------------------------------------------------------
    Author: sclow
    Description: Looks for navigator.languages usage on the web

*/

var searchString = "navigator.languages";
var separatedRe = /navigator(.|\r|\n){0,200}\.languages/g;
var separatedKey = "navigator{0,200}.languages";

function findMatches(text, results) {
    if (text.indexOf(searchString) != -1) {
        results[searchString] = results[searchString] || {
            count: 0,
        };
        results[searchString].count ++;
    } else if (text.match(separatedRe) != null) {
        results[separatedKey] = results[separatedKey] || {
            count: 0,
        };
        results[separatedKey].count ++;
    }
}

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push(function navigatorLanguages(element, results) {
        var nodeName = element.nodeName;
        if (nodeName == "SCRIPT") {
            if (element.text !== undefined && element.text !== "") {
                findMatches(element.text, results);
            } else if (element.src !== undefined && element.src != "" && element.src.indexOf("Recipe.min.js") == -1) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", element.src, false);
                xhr.send();
                if (xhr.status === 200) {
                    findMatches(xhr.responseText, results);
                }
            }
        }
        return results;
    });
}();