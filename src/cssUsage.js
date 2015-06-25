var css = (function (document, window) {
    "use strict";
    // Don't run in subframes for now
    if (window.self !== window.top) return;

    var css = window.css || {
        props: [],
        types: {
            "import": 0,
            "font-face": 0,
            "charset": 0,
            "keyframe": 0,
            "keyframes": 0,
            "media": 0,
            "namespace": 0,
            "page": 0,
            "style": 0,
            "unknown": 0,
            "supports": 0,
            "viewport": 0
        },
        url : location.href,
        duration: 0,
        version: "0.1.0",
        createValueArr: createValueArr,
        normalizeValue: normalizeValue,
        parseValues: parseValues,
        cleanSelectorText: cleanSelectorText
    };

    // This stores a mapping of the
    // property key in css.props
    var propMap = [];
    
    // Keep track of duration
    var startTime = new Date().getTime();

    // This maps the style ID stored
    // in document.styleSheets[X].cssRules
    // to their value
    // NOTE: They need to match the keys in css.types
    var typeMap = {
        "0": "unknown",
        "1": "style",
        "2": "charset",
        "3": "import",
        "4": "media",
        "5": "font-face",
        "6": "page",
        "7": "keyframes", // This is the @keyframe at rule
        "8": "keyframe", // This is the individual 0%, or from/to
        "10": "namespace",
        "12": "supports",
        "15": "viewport"
    }

    var _stringify = JSON.stringify;
    document.addEventListener("DOMContentLoaded", function (event) {
            parseStylesheets();
            htmlTree();
            
            // Update duration
            css.duration = new Date().getTime() - startTime;
            
            // DO SOMETHING WITH THE CSS OBJECT HERE
            console.log(css);
    });

    function parseStylesheets() {
        var styleSheets = document.styleSheets;           

        // Loop through StyeSheets
        for (var ssIndex in styleSheets) {
            var styleSheet = styleSheets[ssIndex];
            try {
                parseCssRules(styleSheet.cssRules, styleSheet);
            }
            catch (e) {
                styleSheetsToProcess--; // Since we can't parse this one we shouldn't depend on it to return results
                if (e.description.indexOf("Access") != -1) {
                }
            }
        }
    }

    /*
     * This just adds 1 to the type provided
     * to the css.types object
     */
    function iterateType(type) {
        if (type !== "" || type !== undefined) {
            var typeKey = typeMap[type];
            css.types[typeKey]++;
        }
    }

    /*
     * The document.styleSheets lists all of the
     * styles in the following way: transitionDelay but they
     * are stored in our props as transition-delay so we need
     * to normalize those values to be able to do string comparisons
     */
    function normalizeKey(key) {
        key = key.replace(/([a-z])([A-Z])/g, "$1-$2");
        return key.toLowerCase();
    }

    /*
     * If you try to do querySelectorAll on pseudo selectors
     * it returns 0 because you are not actually doing the action the pseudo is stating those things,
     * but we will honor those declarations and we don't want them to be missed,
     * so we remove the pseudo selector from the selector text
     */
    function cleanSelectorText(text) {
        return text.replace(/:(?:hover|active|link|focus)/g, '');
    }

    /*
     * This is the work horse, this will will loop over the
     * rules and then determine which ones were actually used
     * and place them into our css object
     */
    var totalRules = 0;
    var rulesProcessed = 0;
    var styleSheetsToProcess = document.styleSheets.length;
    var styleSheetsProcessed = 0;
    function parseCssRules(cssRules, styleSheet) {
        if (cssRules != undefined) {
            totalRules += cssRules.length;

            // Loop through Rules
            for (var ruleIndex in cssRules) {
                
                var rule = cssRules[ruleIndex];
                
                // Until we can correlate animation usage
                // to keyframes do not parse @keyframe rules
                // TODO: https://github.com/gregwhitworth/css-usage/issues/3
                if(rule.type != 7) {
                    iterateType(rule.type); // Increase for rule type

                    // Some CssRules have nested rules, so we need to
                    // test those as well, this will start the recursion
                    if (rule.cssRules && rule.cssRules) {
                        parseCssRules(rule.cssRules, styleSheet);
                    }

                    parseStyle(rule.style, rule.selectorText, rule.type);
                }

                rulesProcessed++;

                // If we're done processing all of the CSS rules for
                // this stylesheet
                if (rulesProcessed == totalRules) {
                    styleSheetsProcessed++;             
                }
            }
        }
    }

    // This will loop over the styles declarations
    function parseStyle(style, selector, type, isInline) {

        for (var key in style) {

            var normalizedKey = normalizeKey(key);

            if (style.cssText.indexOf(normalizedKey) != -1) { // Only keep styles that were declared by the author

                if (!isInteger(key)) { // Chrome puts integer keys in for used props and we don't want to parse those

                    var styleValue = style[key]; // Get the value of the current style property (eg: color: _black_)

                    // We need to make sure we're only checking string props
                    if (typeof styleValue === 'string' && styleValue != "" && styleValue != undefined) {

                        var count = 0;

                        // If there is a pseudo style clean it, other wise just pass it along
                        // TODO: Come up with a better solution for parsing certain @rules
                        if (selector != undefined) {
                            var selectorText = (selector.indexOf(':') != -1) ? cleanSelectorText(selector) : selector;
                            count = document.querySelectorAll(selectorText).length;
                        }

                        // Since this is an inline style we know this will be applied
                        // one time
                        if (isInline == true) {
                            count = 1;
                        }

                        var propExists = propertyExists(normalizedKey);
                        var propObject;
                        var cssPointer = propMap[normalizedKey];

                        if (count > 0 || selector == undefined) {
                            var values = createValueArr(styleValue);

                            if (!propExists) {
                                // Instantiate a new property object
                                css.props.push({ name: normalizedKey, count: count, type: type, values: [] });
                                // Create a key to object mapping
                                propMap[normalizedKey] = css.props.length - 1;
                                cssPointer = propMap[normalizedKey];
                                iterateType(type); // Increase for rule type
                                propObject = css.props[cssPointer];
                            }
                            else {
                                propObject = css.props[cssPointer];
                                propObject.count += count;
                            }

                            values.forEach(function (value) {
                                value = parseValues(value);
                                if (value !== " " || value !== "") {
                                    var valExists = valueExists(normalizedKey, value);
                                    if (!valExists) {
                                        propObject.values.push({ name: value, count: count });
                                    }
                                    else {
                                        for (var valIndex in propObject.values) {
                                            if (propObject.values[valIndex].name == value) {
                                                propObject.values[valIndex].count += count;
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    /*
     * This takes a string value and will create
     * an array from it.
     */
    function createValueArr(value) {
        var values = new Array();          

        value = normalizeValue(value);

        // Parse values like: width 1s height 5s time 2s
        if (Array.isArray(value)) {    
                            
            value.forEach(function(val) {          
                // We need to trim again as fonts at times will
                // be Font, Font2, Font3 and so we need to trim
                // the ones next to the commas
                val = trim(val);
                values.push(val);
            });                
        }
        // Put the single value into an array so we get all values
        else {
            values = [value];
        }

        return values;
    }
        
    function trim(str) {
        return str.replace(/(^\s+)|(\s+$)/g, "");
    }
        
    // This will normalize the values so that
    // we only keep the unique values
    function normalizeValue(value) {
        // Trim value on the edges
        value = trim(value);
        
        // Remove (
        if (value.indexOf("(") != -1) {
            value = value.replace(/\(([^\)]+)\)/g, "");
        }       
        
        // Remove varous quotes
        if (value.indexOf("'") != -1 || value.indexOf("‘") != -1 || value.indexOf('"')) {
            value = value.replace(/('|‘|’|")/g, "");
        }
        
        value = value.toLowerCase();
        
        // We need to check if there are commas or spaces and 
        // split on those so that we can keep track of each  
        if (value.indexOf(" ") != -1 || value.indexOf(",") != - 1) {                       
            if(value.indexOf(",") != -1) {
                value = value.split(",");
            }
            else {
                value = value.split(" ");
            }
        }  
        
        return value;    
    }

    /*
     * This will take a string value and reduce it down
     * to only the aspects of the value we wish to keep
     */
    function parseValues(value) {
         if (isKeywordColor(value)) {
            return "keyword"; // eg: white, blue, yellow
         }
         else if (value.indexOf('"') != -1) {
             return value.replace(/"/g, "");
         }
         else if (value.indexOf("'") != -1) {
             return value.replace(/'/g, "");
         }
         else {
             if(value.indexOf(".") != -1) {
                value = value.replace(/\./g, "");
             }
             return value.replace(/\d+/g, ""); // Remove any digits eg: 55px -> px
         }
    }

    /*
     * This will scan the CSS Props object array
     * and determine if the object exists
     */
    function propertyExists(propertyName) {
        var exists = false;

        for (var pIndex in css.props) {
            if (css.props[pIndex].name == propertyName) {
                exists = true;
            }
        }
        return exists;
    }

    /*
     * This scans the values of all of the properties
     * to determine if the value exists
     */
    function valueExists(propertyName, valueName) {
        var exists = false;
        for(var pIndex in css.props) {
            if (css.props[pIndex].name == propertyName) {
                for (var vIndex in css.props[pIndex].values) {
                    if (css.props[pIndex].values[vIndex].name == valueName) {
                        exists = true;
                    }
                }
            }
        }
        return exists;
    }        

    // This should be very obvious what it does
    function isInteger(value) {
        return (value == parseInt(value));
    }

    /*
     * So that we don't end up with a ton of color
     * values, this will determine if the color is a
     * keyword color value
     */
    function isKeywordColor(color) {
        // Keyword colors from the W3C specs
        var colors = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "navyblue", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];
    
        if (colors.indexOf(color) != -1) {
            return true;
        }
        return false;
    }

    /*
     * This creates a dom tree to walk over so that you can
     * get the inline styles and track those
     */
    function htmlTree(obj) {
        obj = obj || document.getElementsByTagName('html')[0];

        if (obj.style.cssText != "") {
            parseStyle(obj.style, null, 1, true);
        }

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

    return css;
})(document, window);