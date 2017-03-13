/* 
    RECIPE: Payment Request
    -------------------------------------------------------------
    Author: Stanley Hon
    Description: This counts any page that includes any script references to PaymentRequest
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function paymentrequest(/*HTML DOM Element*/ element, results) {

        if(element.nodeName == "SCRIPT") {
            if (element.innerText.indexOf("PaymentRequest") != -1) {
                results["use"] = results["use"] || { count: 0 };
                results["use"].count++;
            }
        }

        return results;
    });
}();