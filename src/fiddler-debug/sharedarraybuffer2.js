
window.apiCount = 0;

void(function() {
    var TrueSharedArrayBuffer = window.SharedArrayBuffer;
    var SharedArrayBuffer = new Proxy(TrueSharedArrayBuffer, {
    construct: function(target, argumentsList, newTarget) {
        window.apiCount++;
        return new TrueSharedArrayBuffer();
    }
    });
    window.SharedArrayBuffer = SharedArrayBuffer;
}());

void function() {
    document.addEventListener('DOMContentLoaded', function () {
        var results = {};
        var recipeName = "sab";
        if(window.apiCount > 0)
        {
            results[recipeName] = results[recipeName] || { count: 0, href: location.href };
            results[recipeName].count = window.apiCount;
        }
        else
        {
            results[recipeName] = results[recipeName] || { href: location.href };
        }

        appendResults(results);

        // Add it to the document dom
        function appendResults(results) {
            var output = document.createElement('script');
            output.id = "css-usage-tsv-results";
            output.textContent = JSON.stringify(results);
            output.type = 'text/plain';
            document.querySelector('head').appendChild(output);
        }
    });
}();