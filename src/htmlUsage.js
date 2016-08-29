void function() {

    window.HtmlUsage = {};

    // This function has been added to the elementAnalyzers in
    // CSSUsage.js under onready()
    // <param name="element"> is an HTMLElement passed in by elementAnalyzers
    window.HtmlUsage.GetNodeName = function (element) {
        var node = element.nodeName;

        var tags = HtmlUsageResults.tags || (HtmlUsageResults.tags = {});
        var tag = tags[node] || (tags[node] = 0);
        tags[node]++;

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

                var attributes = HtmlUsageResults.attributes || (HtmlUsageResults.attributes = {});
                var attributeTag = attributes[node] || (attributes[node] = {});
                var attribute = attributeTag[att.nodeName] || (attributeTag[att.nodeName] = { count: 0, values: {}});        
                

                if (whitelist.indexOf(att.nodeName) > -1 || (att.nodeName == "name" && node == "META")) {
                    var attributeValue = attribute.values[att.value];

                    attribute.values[att.value] = 1;
                }
                
                attribute.count++;
            }
        }
    }
}();