window.debugCSSUsage = true

window.apiCount = 0;

document._oldGetElementById = document.getElementById;
document.getElementById = function(elemIdOrName) {
    window.apiCount++;
    return document._oldGetElementById(elemIdOrName);
};

void function() {
    console.log("PIN1")
    document.addEventListener('DOMContentLoaded', function () {
        console.log("PIN2")
        var results = {};
        var recipeName = "getelem"

        if(window.apiCount > 0)
        {
            results[recipeName] = results[recipeName] || { count: 0, href: location.href };
            results[recipeName].count = window.apiCount;
        }
        else
        {
            results[recipeName] = results[recipeName] || { href: location.href };
        }
        console.log("PIN3")
        appendResults(results);
        
        // Add it to the document dom
        function appendResults(results) {
            if(window.debugCSSUsage) console.log("Trying to append");
            var output = document.createElement('script');
            output.id = "css-usage-tsv-results";
            output.textContent = JSON.stringify(results);
            output.type = 'text/plain';
            document.querySelector('head').appendChild(output);
            var successfulAppend = checkAppend();
        }

        function checkAppend() {
            if(window.debugCSSUsage) console.log("Checking append");
            var elem = document.getElementById('css-usage-tsv-results');
            if(elem === null) {
                if(window.debugCSSUsage) console.log("Element not appended");
            }
            else {
                if(window.debugCSSUsage) console.log("Element successfully found");
            }
        }

    });
}();