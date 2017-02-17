/* 
    RECIPE: Metaviewport
    -------------------------------------------------------------
    Author: Mustapha Jaber
    Description: Get count of media elements on page like video, audio, object.
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function mediaelements(/*HTML DOM Element*/ element, results) {
        var nodeName = element.nodeName;
        if (nodeName == "OBJECT") {
            results[nodeName] = results[nodeName] || { count: 0, width: element.width, height: element.height, classid: element.attributes['classid'].value };
            results[nodeName].count++;
        }
        else if(nodeName == "VIDEO") {
            results[nodeName] = results[nodeName] || { count: 0, width: element.width, height: element.height, src: element.src };
            results[nodeName].count++;
        }
        else if (nodeName == "AUDIO")
        {
            results[nodeName] = results[nodeName] || { count: 0, src: element.src };
            results[nodeName].count++;
        }

        return results;
    });
}();