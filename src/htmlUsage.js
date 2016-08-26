void function() {
    window.HtmlUsage = {};

    // This function has been added to the elementAnalyzers in
    // CSSUsage.js under onready()
    // <param name="element"> is an HTMLElement passed in by elementAnalyzers
    window.HtmlUsage.GetNodeName = function (element) {
        var node = element.nodeName;
        window.HtmlUsageResults.tags.push(node);

        GetAttributes(element, node);
    }

    function GetAttributes(element, node) {
        // The attributes that we want to keep values for
        var whitelist = [
                        "aria-hidden",
                        "aria-live",
                        "aria-atomic",
                        "aria-busy",
                        "aria-disabled",
                        "aria-expanded",
                        "aria-sort",
                        "aria-readonly",
                        "aria-required",
                        "aria-selected",
                        "type",
                        "dir",
                        "disabled",
                        "draggable",
                        "lang",
                        "role",
                        "content",
                        "name"
                        ];

        for(var i = 0; i < element.attributes.length; i++) {
            var att = element.attributes[i];

            // Only keep attributes that do not contain a dash unless they're in the whitelist
            if(att.nodeName.indexOf('-') == -1 || whitelist.indexOf('aria-') > -1) {
                var tempAttr = {name: att.nodeName, tag: node, value: ""};
                var storeAttrValue = true;

                // We only want to gather values for the name attributes
                // on the meta tag
                if(att.nodeName == "name" && node != "META") {
                    storeAttrValue = false;
                }

                // var att = object[attributeName]||(object[attributeName]={});
                // var attTag = att[tagName]||(att[tagName]={});
                // var attTagValue = attTag[value]||(attTag[value]=0);
                // attTag[value]++;

                if (whitelist.indexOf(att.nodeName) > -1) {
                    tempAttr.value = att.value;
                }

                if(storeAttrValue) {
                    window.HtmlUsageResults.attributes.push(tempAttr);
                }
            }
        }
    }
}();