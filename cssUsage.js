/*
    Example:
    URL: www.google.com


    Font-weight: 5
        - bold: 3
        - normal: 2
*/

var liveSiteTesting = {
    "URL": "",
    "UA": "",
    "js": {},
    "css": {}
}

var css = {
    props: []
};

document.addEventListener("DOMContentLoaded", function (event) {

    var styleSheets = document.styleSheets;


    // Loop through StyeSheets
    [].forEach.call(document.styleSheets, function (styleSheet, styleSheetIndex)
    {
        // Loop through Rules
        [].forEach.call(styleSheet.cssRules, function (rule, ruleIndex) {

            // Loop through Declarations
            if (rule.selectorText == ".wrapper") {

                for (var key in rule.style) {
                    if (!isInteger(key)) { // Chrome puts integer keys in for used props
                        var styleValue = rule.style[key];
                        console.log(key + ": " + rule.style[key]);
                        if (typeof styleValue === 'string' && key != 'cssText' && styleValue != "" && styleValue != undefined) {

                            var count = document.querySelectorAll(rule.selectorText).length;
                            if (count > 0) {

                            }

                            console.log(key + ": " + rule.style[key]);
                        }
                    }
                }
            }
        });
    });

    function htmlTree(obj) {
        var obj = obj || document.getElementsByTagName('html')[0];

        if (obj.hasChildNodes()) {
            var child = obj.firstChild;
            while (child) {
                if (child.nodeType === 1) {
                    htmlTree(child);
                }
                child = child.nextSibling;
            }
        }
    }

    function isInteger(value) {
        return (value == parseInt(value));
    }


});