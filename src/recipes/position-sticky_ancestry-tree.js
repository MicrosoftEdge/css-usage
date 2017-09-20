/* 
    RECIPE: position-sticky_ancestry-tree
    -------------------------------------------------------------
    Author: joevery
    Description: Get count of how many times position CSS property with value sticky are used on websites and classify by HTML tag.
*/
void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push(
        function position_sticky_ancestry_tree(element, results) 
        {
            // Need this to ensure no errors on html and head tags when running the code below.
            if (!element.CSSUsage) return;

            if (element.CSSUsage["position"] == "sticky")
            {
                var nodeName = element.nodeName;

                var ancestryTreeArray = [nodeName];

                var currentParent = element.parentElement;

                while (currentParent)
                {
                    ancestryTreeArray.push(currentParent.nodeName);
                    currentParent = currentParent.parentElement;
                }

                var ancestryTree = ancestryTreeArray.join("-");

                results["sticky"] = results["sticky"] || { count: 0, };
                results["sticky"].count++;

                results["sticky"][nodeName] = results["sticky"][nodeName] || { count: 0, };
                results["sticky"][nodeName].count++;

                results["sticky"][nodeName][ancestryTree] = results["sticky"][nodeName][ancestryTree] || { count: 0, };
                results["sticky"][nodeName][ancestryTree].count++;
            }

            return results;
        });
}();
