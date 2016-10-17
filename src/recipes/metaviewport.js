void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function (/*HTML DOM Element*/ element) {
        var recipeResult = {};

        if(element.nodeName == "META") {
            for(var n = 0; n < element.attributes.length; n++) {
                console.log(element.attributes[n]);
                if(element.attributes[n].name == "content") {
                    
                }
            }    
        }
    });
}();