/* 
    RECIPE: Metaviewport
    -------------------------------------------------------------
    Author: Mustapha Jaber
    Description: Get count of media elements on page like video, audio, object.
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function mediaelements(/*HTML DOM Element*/ element, results) {
        var nodeName = element.nodeName;
        if (nodeName == "OBJECT" || nodeName == "VIDEO" || nodeName == "AUDIO" || nodeName == "EMBED")
        {
            results[nodeName] = results[nodeName] || { count: 0,  };
            results[nodeName].count++;
            for (var n = 0; n < element.attributes.length; n++) {
                results[nodeName][element.attributes[n].name] = element.attributes[n].value;
            }
        }

        return results;
    });
}();