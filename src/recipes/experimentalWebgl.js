/* 
    RECIPE: Experimental WebGL
    -------------------------------------------------------------
    Author: Mustapha Jaber
    Description: Find use of experimental-webgl in script.
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function experimentalWebgl(/*HTML DOM Element*/ element, results) {
        var nodeName = element.nodeName;
        var script = "experimental-webgl"
        if (nodeName == "SCRIPT")
        {
            // if inline script. ensure that it's not our recipe script and look for string of interest
            if (element.text !== undefined && element.text.indexOf(script) != -1)
            {
                results[nodeName] = results[nodeName] || { count: 0, };
                results[nodeName].count++;
            }
            else if (element.src !== undefined && element.src != "")
            {
                try
                {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", element.src, false);
                    //xhr.setRequestHeader("Content-type", "text/javascript");
                    xhr.send();
                    if (xhr.status === 200 && xhr.responseText.indexOf(script) != -1) {
                        results[nodeName] = results[nodeName] || { count: 0, };
                        results[nodeName].count++;
                    }
                }
                // ignore failure to get script content
                catch(ex) {}
            }
        }
        return results;
    });
}();