void function() {

    window.HtmlUsage = {};

    // This function has been added to the elementAnalyzers in
    // CSSUsage.js under onready()
    // <param name="element"> is an HTMLElement passed in by elementAnalyzers
    window.HtmlUsage.GetNodeName = function (element) {

        var node = element.nodeName;

        // If the browser doesn't recognize the element - throw it away
        if(element instanceof HTMLUnknownElement) {
            node = "**UNKNOWN";
        }
        // Identify custom elements
        else if(element instanceof HTMLElement && (node.indexOf("-") != -1) && (node != "annotation-xml")) {
            node = "**CUSTOM";
        }
        else {
            GetAttributes(element, node);
        }

        var tags = HtmlUsageResults.tags || (HtmlUsageResults.tags = {});
        var tag = tags[node] || (tags[node] = 0);
        tags[node]++;
    }

    function GetAttributes(element, node) {
        for(var i = 0; i < element.attributes.length; i++) {
            var att = element.attributes[i];

            if(IsValidAttribute(element, att.nodeName)) {
                var attributes = HtmlUsageResults.attributes || (HtmlUsageResults.attributes = {});
                var attribute = attributes[att.nodeName] || (attributes[att.nodeName] = {});
                var attributeTag = attribute[node] || (attribute[node] = {count: 0});
                attributeTag.count++;
            }
        }
    }

    function IsValidAttribute(element, attname) {
        // We need to convert className
        if(attname == "class") {
            attname = "className";
        }

        if(attname == "classname") {
            return false;
        }

        // Only keep attributes that are not data
        if(attname.indexOf('data-') != -1) {
            return false;
        }

        if(typeof(element[attname]) == "undefined") {
            return false;
        }

        return true;
    }
}();