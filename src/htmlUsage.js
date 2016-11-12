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
        for(var i = 0; i < element.attributes.length; i++) {
            var att = element.attributes[i];

            // Only keep attributes that do not contain a dash unless they're in the whitelist
            if(att.nodeName.indexOf('data-') == -1) {
                var attributes = HtmlUsageResults.attributes || (HtmlUsageResults.attributes = {});
                var attribute = attributes[att.nodeName] || (attributes[att.nodeName] = {});
                var attributeTag = attribute[node] || (attribute[node] = {count: 0});             
                attributeTag.count++;
            }
        }
    }
}();