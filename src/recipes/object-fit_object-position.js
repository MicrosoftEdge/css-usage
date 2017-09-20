/* 
    RECIPE: object_fit_object_position
    -------------------------------------------------------------
    Author: joevery
    Description: Get count of how many times object-fit and object-position CSS properties are used on websites and classify by HTML tag.
*/
void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push(
        function object_fit_object_position(element, results) 
        {
            // Need this to ensure no errors on html and head tags when running the code below.
            if (!element.CSSUsage) return;

            if (element.CSSUsage["object-fit"])
            {
                // Allows counting of number of HTML tags using object-fit CSS property on page.
                results["object-fit"] = results["object-fit"] || { count: 0, };
                results["object-fit"].count++;

                // Classify count by HTML tag.
                var nodeName = element.nodeName;
                results["object-fit"][nodeName] = results["object-fit"][nodeName] || { count: 0, };
                results["object-fit"][nodeName].count++;
            }

            if (element.CSSUsage["object-position"])
            {
                // Allows counting of number of HTML tags using object-position CSS property on page.
                results["object-position"] = results["object-position"] || { count: 0, };
                results["object-position"].count++;

                // Classify count by HTML tag.
                var nodeName = element.nodeName;
                results["object-position"][nodeName] = results["object-position"][nodeName] || { count: 0, };
                results["object-position"][nodeName].count++;
            }

            return results;
        });
}();
