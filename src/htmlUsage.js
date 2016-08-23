void function() {
    window.HtmlUsage = {};
    window.HtmlUsage.tags = [];
    window.HtmlUsage.attributes = [];

    // This function has been added to the elementAnalyzers in
    // CSSUsage.js under onready()
    // <param name="element"> is an HTMLElement passed in by elementAnalyzers
    window.HtmlUsage.GetNodeName = function (element) {
        var node = element.nodeName;
        window.HtmlUsage.tags.push(node);

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
                        "role"
                        ];

        for(var i = 0; i < element.attributes.length; i++) {
            var att = element.attributes[i];
            var tempAttr = {name: att.nodeName, tag: node, value: ""};

            if(whitelist.indexOf(att.nodeName) > -1) {
                tempAttr.value = att.value;
            }

            window.HtmlUsage.attributes.push(tempAttr);
        }
    }
}();