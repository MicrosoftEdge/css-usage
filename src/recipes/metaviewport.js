void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function metaviewport(/*HTML DOM Element*/ element, results) {
        var needles = ["width", "height", "initial-scale", "minimum-scale", "maximum-scale", "user-scalable"];

        if(element.nodeName == "META") {
            for(var n = 0; n < element.attributes.length; n++) {
                if(element.attributes[n].name == "content") {
                    
                    for(var needle = 0; needle < needles.length; needle++) {
                        var value = element.attributes[n].value;

                        if(value.indexOf(needles[needle] != -1)) {
                            results[value] = results[value] || { count: 0 };
                            results[value].count++;
                            break;
                        }
                    }
                }
            }    
        }

        return results;
    });
}();