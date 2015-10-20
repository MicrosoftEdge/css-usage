//
// Guards execution against invalid conditions
//
void function() {
    // Don't run in subframes for now
    if (window.self !== window.top) throw new Error("CSSUsage: the script doesn't run in frames for now");
}

//
// Prepare our global namespace
//
void function() {
    window.CSSUsage = {};
	typesMap: 
    window.CSSUsageResults = {
		
		// this will contains the usage stats of various at-rules and rules
        types: [ 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, ], /* 
		types ~= {
			"unknown":0,   //0
			"style":0,     //1
			"charset": 0,  //2
			"import":0,    //3
			"media":0,     //4
			"font-face":0, //5
			"page":0,      //6
			"keyframes":0, //7 This is the @keyframe at rule
			"keyframe":0,  //8 This is the individual 0%, or from/to
			"reserved9":0, //9
			"namespace":0, //10
			"reserved11":0,//11
			"supports":0,  //12
			"reserved13":0,//13
			"reserved14":0,//14
			"viewport":0,  //15
		}*/
		
		// this will contains the usage stats of various css properties and values
        props: Object.create(null),
		
    }
}();

//
// The StyleWalker API cover the extraction of style in the browser
//
void function() { "use strict";

    CSSUsage.StyleWalker = {
        ruleAnalyzers: [],
        parseStylesheets: parseStylesheets,
        parseInlineStyle: parseInlineStyle,
    }

    function parseStylesheets() {
        var styleSheets = document.styleSheets;

        // Loop through StyeSheets
        for (var ssIndex in styleSheets) {
            var styleSheet = styleSheets[ssIndex];
            try {
                parseCssRules(styleSheet.cssRules, styleSheet);
            }
            catch (e) {
                console.log(e);
                if (e.description.indexOf("Access") != -1) {
                    styleSheetsToProcess--; // Since we can't parse this one we shouldn't depend on it to return results
                }
            }
        }
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
    function parseCssRules(/*CSSRuleList*/ cssRules, styleSheet) {
        if (cssRules != undefined) {
            totalRules += cssRules.length;

            // Loop through Rules
            for (var ruleIndex in cssRules) {

                var rule = cssRules[ruleIndex];

                // Until we can correlate animation usage
                // to keyframes do not parse @keyframe rules
                // TODO: https://github.com/gregwhitworth/css-usage/issues/3
                if(rule.type != 7) {
                    CSSUsageResults.types[rule.type]++; // Increase for rule type

                    // Some CssRules have nested rules, so we need to
                    // test those as well, this will start the recursion
                    if (rule.cssRules && rule.cssRules) {
                        parseCssRules(rule.cssRules, styleSheet);
                    }

                    runRuleAnalyzers(rule.style, rule.selectorText, rule.type);
                }

                rulesProcessed++;

            }

            // If we're done processing all of the CSS rules for
            // this stylesheet
            if (rulesProcessed == totalRules) {
                styleSheetsProcessed++;
            }

        }
    }

    /*
     * This creates a dom tree to walk over so that you can
     * get the inline styles and track those
     */
    function parseInlineStyle(obj) {
        obj = obj || document.getElementsByTagName('html')[0];

        if (obj.style.cssText != "") {
            runRuleAnalyzers(obj.style, null, 1, true);
        }

        if (obj.hasChildNodes()) {
            var child = obj.firstChild;
            while (child) {
                if (child.nodeType === 1) {
                    parseInlineStyle(child);
                }
                child = child.nextSibling;
            }
        }
    }

    /*
     *
     */
    function runRuleAnalyzers(style, selector, type, isInline) {
        CSSUsage.StyleWalker.ruleAnalyzers.forEach(function(runAnalyzer) {
            runAnalyzer(style, selector, type, isInline);
        });
    }

}();

//
// helper to work with css values
//
void function() {

    CSSUsage.CSSValues = {
        createValueArray: createValueArray,
        parseValues: parseValues,
		normalizeValue: normalizeValue
    };

    /*
     * This takes a string value and will create
     * an array from it.
     */
    function createValueArray(value) {
        var values = new Array();

        value = normalizeValue(value);

        // Parse values like: width 1s height 5s time 2s
        if (Array.isArray(value)) {

            value.forEach(function(val) {
                // We need to trim again as fonts at times will
                // be Font, Font2, Font3 and so we need to trim
                // the ones next to the commas
                val = val.trim();
                values.push(val);
            });

        }
        // Put the single value into an array so we get all values
        else {
            values = [value];
        }

        return values;
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
             return value.replace(/(\d+)|(\-\d+)|(\.)/g, ""); // Remove any digits eg: 55px -> px
         }
    }

    //-----------------------------------------------------------------------------

    // This will normalize the values so that
    // we only keep the unique values
    function normalizeValue(value) {

        // Trim value on the edges
        value = value.trim();

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

}();

//
// computes various css stats
//
void function() {

    CSSUsage.PropertyValuesAnalyzer = parseStyle;
	CSSUsage.PropertyValuesAnalyzer.cleanSelectorText = cleanSelectorText;

    // This will loop over the styles declarations
    function parseStyle(style, selector, type, isInline) {
        for (var key in style) {

            var normalizedKey = normalizeKey(key);

            // Only keep styles that were declared by the author
            if (style.cssText.indexOf(normalizedKey) == -1) continue;

            // Chrome puts integer keys in for used props and we don't want to parse those
            if (isInteger(key)) continue;

            var styleValue = style[key]; // Get the value of the current style property (eg: color: _black_)

            // We need to make sure we're only checking string props
            if (typeof styleValue !== 'string' && styleValue != "" && styleValue != undefined) {
                continue;
            }

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

            if (count == 0 || selector == undefined) continue;

            var values = CSSUsage.CSSValues.createValueArray(styleValue);

            // instanciate or fetch the property metadata
            var propObject = CSSUsageResults.props[normalizedKey];
            if (!propObject) {
                propObject = CSSUsageResults.props[normalizedKey] = {
                    name: normalizedKey,
                    count: 0,
                    type: type,
                    values: []
                };
            }


            // increment the amount of affected elements
            propObject.count += count;

            values.forEach(function (value) {
                value = CSSUsage.CSSValues.parseValues(value);

                if (value === " " || value === "") {
                    return;
                }

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
            });
        }
    }

    //-------------------------------------------------------------------------

    /*
     * The document.styleSheets lists all of the
     * styles in camel case (e.g. "transitionDelay") but
     * we store them in our props as "transition-delay" so we need
     * to normalize those values to be able to do string comparisons
     */
    function normalizeKey(key) {
		var cache = normalizeKey.cache || (normalizeKey.cache=Object.create(null));
		var result, resultFromCache = cache[key];
		if(resultFromCache) {
			return resultFromCache;
		} else {
			result = key.replace(/([a-z])([A-Z])/g, "$1-$2");
			result = result.toLowerCase();
			switch(result) { case 'stylefloat': case 'cssfloat': return cache[key]='float'; default: return cache[key]=result; }
		}
    }

    /*
     * This will scan the CSS Props object array
     * and determine if the object exists
     */
    function propertyExists(propertyName) {
        return propertyName in CSSUsageResults.props;
    }

    /*
     * This scans the values of all of the properties
     * to determine if the value exists
     */
    function valueExists(propertyName, valueName) {
        var pvalues = CSSUsageResults.props[propertyName].values;
        for (var vIndex in pvalues) {
            if (pvalues[vIndex].name == valueName) {
                return true;
            }
        }
        return false;
    }

    /*
     * If you try to do querySelectorAll on pseudo selectors
     * it returns 0 because you are not actually doing the action the pseudo is stating those things,
     * but we will honor those declarations and we don't want them to be missed,
     * so we remove the pseudo selector from the selector text
     */
    function cleanSelectorText(text) {
        return text.replace(/:(?:hover|active|focus)|::(?:before|after)/g, '');
    }

    // This should be very obvious what it does
    function isInteger(value) {
        return (value == parseInt(value));
    }

}();

//
// Execution scheduler:
// This is where we decide what to run, and when
//
void function() {

    if(document.readyState !== 'complete') {
        document.addEventListener("DOMContentLoaded", onready);
    } else {
        onready();
    }

    function onready() {
		// Uncomment if you want to set breakpoints when running in the console
        //debugger;

        // Keep track of duration
        var startTime = performance.now();

        // register tools
        CSSUsage.StyleWalker.ruleAnalyzers.push(CSSUsage.PropertyValuesAnalyzer);

        // perform analysis
        CSSUsage.StyleWalker.parseStylesheets();
        CSSUsage.StyleWalker.parseInlineStyle();

        // Update duration
        CSSUsageResults.duration = performance.now() - startTime;

        // DO SOMETHING WITH THE CSS OBJECT HERE
        console.log(CSSUsageResults);

        // Convert it to a more efficient format
        var getValuesOf = Object.values || function(o) { return Object.keys(o).map(function(k) { return o[k]; }) };
        CSSUsageResults.props = getValuesOf(CSSUsageResults.props);

    }


}();