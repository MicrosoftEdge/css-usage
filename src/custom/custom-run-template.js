void function() {
        
        var results = "";

        var title = document.getElementsByTagName('title')[0].textContent;
        results = title;
        appendResults(results);
        
        // Add it to the document dom
        function appendResults(results) {
            var output = document.createElement('script');
            output.id = "css-usage-tsv-results";
            output.textContent = results;
            output.type = 'text/plain';
            document.querySelector('head').appendChild(output);
            var successfulAppend = checkAppend();
        }

        function checkAppend() {
            var elem = document.getElementById('css-usage-tsv-results');
            if(elem === null) {
                if(window.debugCSSUsage) console.log("Element not appended");
                if(window.debugCSSUsage) console.log("Trying to append again");
                appendTSV();
            }
        }
}();