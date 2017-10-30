/* 
    RECIPE: Request Payment
    -------------------------------------------------------------
    Author: Mustapha Jaber
    Description: Find use of RequestPayment in script.
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function paymentRequest(/*HTML DOM Element*/ element, results) {
        var nodeName = element.nodeName;
        var script = "RequestPayment"
        if (nodeName == "SCRIPT")
        {
            results[nodeName] = results[nodeName] || { count: 0, };
            // if inline script. ensure that it's not our recipe script and look for string of interest
            if (element.text !== undefined && element.text.indexOf(script) != -1)
            {
                results[nodeName].count++;
            }
            else if (element.src !== undefined && element.src != "")
            {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", element.src, false);
                //xhr.setRequestHeader("Content-type", "text/javascript");
                xhr.send();
                if (xhr.status === 200 && xhr.responseText.indexOf(script) != -1)
                {
                    results[nodeName].count++;
                }
            }
        }
        return results;
    });
}();