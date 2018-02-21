/* 
    RECIPE: Edit controls on the web
    -------------------------------------------------------------
    Author: Grisha Lyukshin
    Description: Counts pages that have either input, textarea, or content editable elements
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function editControls(/*HTML DOM Element*/ element, results) {
        
        // we only care about special kind of inputs
        if(element.nodeName.toLowerCase() === "input" && 
        	(element.getAttribute("type").toLowerCase() === "email" ||
        	 element.getAttribute("type").toLowerCase() === "number" ||
        	 element.getAttribute("type").toLowerCase() === "search" ||
        	 element.getAttribute("type").toLowerCase() === "tel" ||
        	 element.getAttribute("type").toLowerCase() === "url" ||
        	 element.getAttribute("type").toLowerCase() === "text")) 
        {
            results["input"] = results["input"] || { count: 0 };
            results["input"].count++;    
        }
        else if (element.nodeName.toLowerCase() === "textarea")
        {
			results["textarea"] = results["textarea"] || { count: 0 };
            results["textarea"].count++;
        }
        else if (element.nodeName.toLowerCase() === "div" || element.nodeName.toLowerCase() === "p" || element.nodeName.toLowerCase() === "table")
        {
        	if(element.getAttribute("contenteditable").toLowerCase() === "true" || element.getAttribute("contenteditable").toLowerCase() === "plain-text")
        	{
				results["contenteditable"] = results["contenteditable"] || { count: 0 };
            	results["contenteditable"].count++;
        	}
        }
        return results;
    });
}();
