/* 
    RECIPE: svg_css-transform_preserve-3d
    -------------------------------------------------------------
    Author: joevery
    Description: Get count of svg elements on page along with how many contain the transform CSS property and the transform-style CSS property with value preserve-3d in their namespace.
*/
void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push(
        function svg_css_transform_preserve_3d(element, results) 
        {
            var nodeName = element.nodeName;

            if (nodeName == "svg")
            {
                var elementsToCheck = [element];
                var elementHasTranform = false;
                var elementHas3DStyle = false;

                while (elementsToCheck.length > 0 && (!elementHas3DStyle || !elementHasTranform))
                {
                    var children = [];

                    for (var i = 0; i < elementsToCheck.length; ++i)
                    {
                        var e = elementsToCheck[i];

                        // If no CSS on element, then don't do what is inside if statement, otherwise it will hit error.
                        if (e.CSSUsage)
                        {
                            if (e.CSSUsage["transform"]) {
                                elementHasTranform = true;
                            }

                            // We have to check for the transform-style property first before checking its values, otherwise it will hit error.
                            var transformStyle = e.CSSUsage["transform-style"];
                            if (transformStyle)
                            {
                                if (transformStyle.valuesArray.includes("preserve-3d")) {
                                    elementHas3DStyle = true;
                                }
                            }
                        }

                        // Need to convert children HTML collection to array to combine with other children found.
                        children = children.concat(Array.from(e.children));
                    }
                    elementsToCheck = children;
                }

                results["svg"] = results["svg"] || { count: 0, };
                results["svg"].count++;

                if (elementHasTranform)
                {
                    results["svg"]["transform"] = results["svg"]["transform"] || { count: 0, };
                    results["svg"]["transform"].count++;
                }

                if (elementHas3DStyle)
                {
                    results["svg"]["transform-style_preserve-3d"] = results["svg"]["transform-style_preserve-3d"] || { count: 0, };
                    results["svg"]["transform-style_preserve-3d"].count++;
                }
            }

            return results;
        });
}();
