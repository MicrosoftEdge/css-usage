window.debugCSSUsage = true

// Set our usage trackers
var globalUsageGet = 0;
var globalUsageSet = 0;

var globalProxy = {
    get: function() { counts[0].count++; },
    set: function() { counts[1].count++; },
    configurable: true
}

var globalObjectUsageGet = 0;
var globalObjectUsageSet = 0;

var globalObjectProxy = {
    get: function() { counts[2].count++; },
    set: function() { counts[3].count++; },
    configurable: true
}

var globalThisUsageGet = 0;
var globalThisUsageSet = 0;

var globalThisProxy = {
    get: function() { counts[4].count++; },
    set: function() { counts[5].count++; },
    configurable: true
}

var globalsUsageGet = 0;
var globalsUsageSet = 0;

var globalsProxy = {
    get: function() { counts[6].count++; },
    set: function() { counts[7].count++; },
    configurable: true
}

Object.defineProperty(window, 'globals', globalsProxy);
Object.defineProperty(window, 'globalThis', globalThisProxy);
Object.defineProperty(window, 'globalObject', globalObjectProxy);
Object.defineProperty(window, 'global', globalProxy);

var counts = [
    {name: "globalUsageGet",        count: globalUsageGet},
    {name: "globalUsageSet",        count: globalUsageSet},
    {name: "globalObjectUsageGet",  count: globalObjectUsageGet},
    {name: "globalObjectUsageSet",  count: globalObjectUsageSet},
    {name: "globalThisUsageGet",    count: globalThisUsageGet},
    {name: "globalThisUsageSet",    count: globalThisUsageSet},
    {name: "globalsUsageGet",       count: globalsUsageGet},
    {name: "globalsUsageSet",       count: globalsUsageSet}
]

// Define them so that we can determine if they get stomped on

void function() {
    document.addEventListener('DOMContentLoaded', function () {

        var results = new Array();
        counts.forEach(function(i) {
            if(i.count != 0) {
                results.push({"name":i.name, "count": i.count, "href": location.href });
            }
        });

        appendResults(results);

        // Add it to the document dom
        function appendResults(results) {
            if(window.debugCSSUsage) console.log("Trying to append");
            var output = document.createElement('script');
            output.id = "css-usage-tsv-results";
            output.textContent = convertToTSV(results);
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

        function convertToTSV(results) {
            const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
            const header = Object.keys(results[0])
            let csv = results.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join('\t'))
            csv.unshift(header.join('\t'))
            csv = csv.join('\r\n')
            return csv;
        }
    });
}();
