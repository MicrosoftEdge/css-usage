/* 
    RECIPE: object_fit_onvideo
    -------------------------------------------------------------
    Author: joevery
    Description: Get count of how many times object-fit CSS property is used on a video element on websites.
*/
void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push(
        function object_fit_onvideo(element, results) 
        {
            var nodeName = element.nodeName;

            if (nodeName == "VIDEO")
            {
                if (element.CSSUsage["object-fit"])
                {
                    var key = "VIDEO" + "_" + "object-fit";
                    results[key] = results[key] || { count: 0, };
                    results[key].count++;
                }
            }
            return results;
        });
}();
