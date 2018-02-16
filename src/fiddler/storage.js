/* 
    JSAPI RECIPE: storage usage as event
    -------------------------------------------------------------
    Author: joevery + stahon
    Description: Find instances of window.storage event
*/

window.debugCSSUsage = true

// We want to catch all called instances of addEventListener("<event we care about>").
window.apiCounts = new Map(
    [
        ["storage", 0]
    ]);;

window._addEventListener = window.addEventListener;
window.addEventListener = function (a, b, c) {
    window._addEventListener(a, b, c);

    // Increment listening count for event argument.
    if (window.apiCounts.has(a)) {
        window.apiCounts.set(a, window.apiCounts.get(a) + 1);
    }
};

void function () {
    document.addEventListener('DOMContentLoaded', function () {
        var results = {};
        var recipeName = "pointer_touch_events";

        // Format the results for Cosmos output.
        window.apiCounts.forEach(function(value, key, map) {
            if (value > 0) {
                results[recipeName] = results[recipeName] || { href: location.href, };
                results[recipeName][key] = results[recipeName][key] || { count: 0, };
                results[recipeName][key].count = value;
            }
            else {
                results[recipeName] = results[recipeName] || { href: location.href };
            }
        });

        appendResults(results);

        // Add it to the document dom
        function appendResults(results) {
            if (window.debugCSSUsage) console.log("Trying to append");
            var output = document.createElement('script');
            output.id = "css-usage-tsv-results";
            output.textContent = JSON.stringify(results);
            output.type = 'text/plain';
            document.querySelector('head').appendChild(output);
            var successfulAppend = checkAppend();
        }

        function checkAppend() {
            if (window.debugCSSUsage) console.log("Checking append");
            var elem = document.getElementById('css-usage-tsv-results');
            if (elem === null) {
                if (window.debugCSSUsage) console.log("Element not appended");
            }
            else {
                if (window.debugCSSUsage) console.log("Element successfully found");
            }
        }

    });
}();