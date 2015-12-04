//
// Guards execution against invalid conditions
//
void function() {
    
    // Don't run in subframes for now
    if (window.self !== window.top) throw new Error("CSSUsage: the script doesn't run in frames for now");
    
    // Don't run if already ran
    if (window.INSTRUMENTATION_RESULTS) console.warn("CSSUsage: only one run will be executed; check the right version was chosen");
    
}

//
// Prepare the whole instrumentation world
//
void function() {
    
    var ua = navigator.userAgent;
    var uaName = ua.indexOf('Edge')>=0 ? 'EDGE' :ua.indexOf('Chrome')>=0 ? 'CHROME' : 'FIREFOX';
    window.INSTRUMENTATION_RESULTS = {
        UA: uaName,
        UASTRING: ua,
        URL: location.href,
        TIMESTAMP: Date.now(),
        css: {/*  see CSSUsageResults  */},
        dom: {}
    };
    window.INSTRUMENTATION_RESULTS_TSV = [];
    
}();

//
// Prepare our global namespace
//
void function() {
    window.CSSUsage = {};
    window.CSSUsageResults = {
        
        // this will contain the usage stats of various at-rules and rules
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
        
        // this will contain the usage stats of various css properties and values
        props: Object.create(null), /*
        props ~= {
            "background-color": {
                count: 10,
                values: {
                    "color": 9,
                    "inherit": 1
                }
            }
        }*/
        
        // this will contains the various datapoints we measure on css selector usage
        usages: {},
        
        // this will contain selectors and the properties they refer to
        rules: {"@stylerule":0,"@atrule":0,"@inline":0}, /*
        rules ~= {
            "#id:hover .class": {
                count: 10,
                props: {
                    "background-color": 5,
                    "color": 4,
                    "opacity": 3,
                    "transform": 3
                }
            }
        }*/
        
    }
}();

//
// The StyleWalker API cover the extraction of style in the browser
//
void function() { "use strict";

    CSSUsage.StyleWalker = {
        
        // This array contains the list of functions being run on each CSSStyleDeclaration
        // [ function(style, selectorText, matchedElements, ruleType) { ... }, ... ]
        ruleAnalyzers: [],
        
        // This array contains the list of functions being run on each DOM element of the page
        // [ function(element) { ...} ]
        elementAnalyzers: [],
        
        // 
        walkOverCssStyles: walkOverCssStyles,
        walkOverDomElements: walkOverDomElements,
        
        // Those stats are being collected while walking over the css style rules
        amountOfInlineStyles: 0,
        amountOfSelectorsUnused: 0,
        amountOfSelectors: 0,
    }
    
    // holds @keyframes temporarily while we wait to know how much they are used
    var keyframes = {};
    
    /**
     * For all stylesheets of the document, 
     * walk through the stylerules and run analyzers
     */
    function walkOverCssStyles() {
        var styleSheets = document.styleSheets;

        // Loop through StyeSheets
        for (var ssIndex = styleSheets.length; ssIndex--;) {
            var styleSheet = styleSheets[ssIndex];
            try {
                if(styleSheet.cssRules) {
                    walkOverCssRules(styleSheet.cssRules, styleSheet);
                } else {
                    console.warn("No content loaded for stylesheet: ", styleSheet.href||styleSheet);
                }
            }
            catch (e) {
                console.log(e, e.stack);
                if (e && (e.description||e.message||"").indexOf("Access") != -1) {
                    styleSheetsToProcess--; // Since we can't parse this one we shouldn't depend on it to return results
                }
            }
        }
        
        // Hack: rely on the results to find out which
        // animations actually run, and parse their keyframes
        var animations = (CSSUsageResults.props['animation-name']||{}).values||{};
        for(var animation in keyframes) {
            var keyframe = keyframes[animation];
            var matchCount = animations[animation]|0;
            var fakeElements = initArray(matchCount, (i)=>({tagName:'@keyframes '+animation+' ['+i+']'}));
            processRule(keyframe, fakeElements);
        }

    }

    /**
     * This is the css work horse, this will will loop over the
     * rules and then call the rule analyzers currently registered
     */
    function walkOverCssRules(/*CSSRuleList*/ cssRules, styleSheet, parentMatchedElements) {
        for (var ruleIndex = cssRules.length; ruleIndex--;) {

            // Loop through the rules
            var rule = cssRules[ruleIndex];

            // Until we can correlate animation usage
            // to keyframes do not parse @keyframe rules
            if(rule.type == 7) {
                keyframes[rule.name] = rule;
                continue;
            }
            
            // Filter "@supports" which the current browser doesn't support
            if(rule.type == 12 && (!CSS.supports || !CSS.supports(rule.conditionText))) {
                continue;
            }
                
            // Other rules should be processed immediately
            processRule(rule,parentMatchedElements);
                

        }
    }
    
    /**
     * This function takes a css rule and:
     * [1] walk over its child rules if needed
     * [2] call rule analyzers for that rule if it has style data
     */
    function processRule(rule, parentMatchedElements) {
        
        // Increment the rule type's counter
        CSSUsageResults.types[rule.type|0]++; 

        // Some CssRules have nested rules to walk through:
        if (rule.cssRules && rule.cssRules.length>0) {
            
            walkOverCssRules(rule.cssRules, rule.parentStyleSheet, parentMatchedElements);
            
        }

        // Some CssRules have style we can ananlyze
        if(rule.style) {
            
            // find what the rule applies to
            var selectorText;
            var matchedElements; 
            if(rule.selectorText) {
                selectorText = rule.selectorText;
                if(parentMatchedElements) {
                    matchedElements = [].slice.call(document.querySelectorAll(selectorText));
                    matchedElements.parentMatchedElements = parentMatchedElements;
                } else {
                    matchedElements = [].slice.call(document.querySelectorAll(selectorText));
                }
            } else {
                selectorText = '@atrule:'+rule.type;
                if(parentMatchedElements) {
                    matchedElements = parentMatchedElements;
                } else {
                    matchedElements = [];
                }
            }
            
            // run an analysis on it
            runRuleAnalyzers(rule.style, selectorText, matchedElements, rule.type);
            
        }
    }

    /**
     * This is the dom work horse, this will will loop over the
     * dom elements and then call the element analyzers currently registered,
     * as well as rule analyzers for inline styles
     */
    function walkOverDomElements(obj, index, depth) {
        obj = obj || document.documentElement; index = index|0; depth = depth|0;

        // Loop through the elements
        var elements = [].slice.call(document.all,0);
        for(var i=elements.length; i--;) { var element=elements[i];
        
            // Analyze the element
            runElementAnalyzers(element, index);
            
            // Analyze its style, if any
            if (element.hasAttribute('style')) {
                
                // Inline styles count like a style rule with no selector but one matched element
                var ruleType = 1;
                var isInline = true;
                var selectorText = '@inline:'+element.tagName;
                var matchedElements = [element];
                runRuleAnalyzers(element.style, selectorText, matchedElements, ruleType, isInline);
                
            }
        }
        
    }

    /**
     * Given a rule and its data, send it to all rule analyzers
     */
    function runRuleAnalyzers(style, selectorText, matchedElements, type, isInline) {
        
        // Keep track of the counters
        if(isInline) {
            CSSUsage.StyleWalker.amountOfInlineStyles++;
        } else {
            CSSUsage.StyleWalker.amountOfSelectors++;
        }
        
        // Run all rule analyzers
        CSSUsage.StyleWalker.ruleAnalyzers.forEach(function(runAnalyzer) {
            runAnalyzer(style, selectorText, matchedElements, type, isInline);
        });
        
    }
    
    /**
     * Given an element and its data, send it to all element analyzers
     */
    function runElementAnalyzers(element, index, depth) {
        CSSUsage.StyleWalker.elementAnalyzers.forEach(function(runAnalyzer) {
            runAnalyzer(element,index,depth);
        });
    }
    
    /**
     * Creates an array of "length" elements, by calling initializer for each cell
     */
    function initArray(length, initializer) {
        var array = Array(length);
        for(var i = length; i--;) { 
            array[i] = initializer(i);
        }
        return array;
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

    /**
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

    /**
     * This will take a string value and reduce it down
     * to only the aspects of the value we wish to keep
     */
    function parseValues(value) {
        
         // Map colors to colors (eg: white, blue, yellow)
         if (isKeywordColor(value)) {
            return "color"; 
         }
         
         // Remove any digits eg: 55px -> px, 1.5 -> 0.0, 1 -> 0
         value = value.replace(/([+]|[-]|)(([0-9]+)([.][0-9]+|)|([.][0-9]+))([a-zA-Z%]+)/g, "$6"); 
         value = value.replace(/([+]|[-]|)([0-9]+)([.][0-9]+)/g, "0.0");
         value = value.replace(/([+]|[-]|)([.][0-9]+)/g, "0.0");
         value = value.replace(/([+]|[-]|)([0-9]+)/g, "0");
         
         // Remove quotes
         value = value.replace(/('|‘|’|")/g, "");
         return value;
         
    }

    //-----------------------------------------------------------------------------

    /**
     * This will normalize the values so that
     * we only keep the unique values
     */ 
    function normalizeValue(value) {

        // Trim value on the edges
        value = value.trim();

        // Remove (...)
        if (value.indexOf("(") != -1) {
            value = value.replace(/[(]([^()]+|[(]([^()]+)[)])+[)]/g, "");
        }

        // Remove various quotes
        if (value.indexOf("'") != -1 || value.indexOf("‘") != -1 || value.indexOf('"')) {
            value = value.replace(/('|‘|’|")/g, "");
        }

        // Normalize letter-casing
        value = value.toLowerCase();

        // We need to check if there are commas or spaces and
        // split on those so that we can keep track of each
        if(value.indexOf(",") != -1) {
            value = value.split(",");
            
        } else if(value.indexOf(" ") != -1) {
            value = value.split(" ");
            
        } else {
            value = [ value ];
            
        }

        return value;
    }

    /**
     * So that we don't end up with a ton of color
     * values, this will determine if the color is a
     * keyword color value
     */
    function isKeywordColor(candidateColor) {
        
        // Keyword colors from the W3C specs
        var isColorKeyword = /^(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|navyblue|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)$/;
        return isColorKeyword.test(candidateColor);
        
    }

}();

//
// computes various css stats
//
void function() {

    CSSUsage.PropertyValuesAnalyzer = analyzeStyleOfRule;
    CSSUsage.PropertyValuesAnalyzer.cleanSelectorText = cleanSelectorText;

    // We put a computed style in cache for filtering purposes
    var defaultStyle = getComputedStyle(document.createElement('div'));
    
    /** This will loop over the styles declarations */
    function analyzeStyleOfRule(style, selectorText, matchedElements, type, isInline) { isInline=!!isInline;
        
        // We want to filter rules that are not actually used
        var count = matchedElements.length;
        var selector = selectorText;
        var selectorCat = {'1:true':'@inline','1:false':'@stylerule'}[''+type+':'+isInline]||'@atrule';
        var isRuleUnsed = () => (count == 0);
        
        // Keep track of unused rules
        if(isRuleUnsed()) {
            CSSUsage.StyleWalker.amountOfSelectorsUnused++;
        }
        
        // We need a generalized selector to collect some stats
        // TODO: transform this into an array of generalized selectors
        var generalizedSelector1 = selectorCat;
        var generalizedSelector2 = (selectorCat=='@stylerule') ? generalizedSelectorOf(selector) : selector;
        
        // Increment the occurence counter of found generalized selectors
        var generalizedSelectorData1 = CSSUsageResults.rules[generalizedSelector1] || (CSSUsageResults.rules[generalizedSelector1] = {count:0,props:{}});
        var generalizedSelectorData2 = CSSUsageResults.rules[generalizedSelector2] || (CSSUsageResults.rules[generalizedSelector2] = {count:0,props:{}});
        generalizedSelectorData1.count++;
        generalizedSelectorData2.count++;
        
        // For each property declaration in this rule, we collect some stats
        for (var i = style.length; i--;) {

            var key = style[i];
            var normalizedKey = key.replace(/^--.*/,'--var');
            var styleValue = style.getPropertyValue(key);
            
            // Only keep styles that were declared by the author
            // We need to make sure we're only checking string props
            var isValueInvalid = () => (typeof styleValue !== 'string' && styleValue != "" && styleValue != undefined);
            var isPropertyUndefined = () => (style.cssText.indexOf(key+':') == -1 && (styleValue=='initial' || styleValue==defaultStyle.getPropertyValue(key)));
            
            if (isValueInvalid() || isPropertyUndefined()) {
                continue;
            }
            
            // log the usage per selector
            generalizedSelectorData1.props[normalizedKey] = (generalizedSelectorData1.props[normalizedKey]|0) + 1;
            generalizedSelectorData2.props[normalizedKey] = (generalizedSelectorData2.props[normalizedKey]|0) + 1;
            
            // if we may increment some counts due to this declaration
            if(count > 0) {
                
                // instanciate or fetch the property metadata
                var propObject = CSSUsageResults.props[normalizedKey];
                if (!propObject) {
                    propObject = CSSUsageResults.props[normalizedKey] = {
                        count: 0,
                        values: {}
                    };
                }
                
                // update the occurence counts of the property and value
                matchedElements.forEach(element => {
                    
                    // check what the elements already contributed for this property
                    var knownValues = element['CSSUsage:'+normalizedKey] || (element['CSSUsage:'+normalizedKey] = []);
                    
                    // increment the amount of affected elements which we didn't count yet
                    if(knownValues.length == 0) { propObject.count += 1; }

                    // add newly found values too
                    var values = CSSUsage.CSSValues.createValueArray(styleValue);
                    values.forEach(function (value) {
                        value = CSSUsage.CSSValues.parseValues(value);

                        if (value === " " || value === "") {
                            return;
                        }
                        
                        if(knownValues.indexOf(value) >= 0) { return; }
                        propObject.values[value] = (propObject.values[value]|0) + 1;
                        knownValues.push(value);

                    });
                    
                });
                
            }
            
        }
    }

    //-------------------------------------------------------------------------

    /**
     * If you try to do querySelectorAll on pseudo selectors
     * it returns 0 because you are not actually doing the action the pseudo is stating those things,
     * but we will honor those declarations and we don't want them to be missed,
     * so we remove the pseudo selector from the selector text
     */
    function cleanSelectorText(text) {
        if(text.indexOf(':') == -1) {
            return text;
        } else {
            return text.replace(/([-_a-zA-Z0-9*]?):(?:hover|active|focus|before|after)|::(?:before|after)*/g, '>>$1<<').replace(/^>><</g,'*').replace(/ >><</g,'*').replace(/>>([*a-zA-Z]?)<</g,'$1');
        }
    }
    
    /**
     * Returns an anonimized version of the selector.
     * @example "#menu.open:hover>a.submenu" => "#id.class:hover > a.class"
     */
    function generalizedSelectorOf(value) {
        
        // Trim
        value = value.trim();
        
        // Remove (...)
        if (value.indexOf("(") != -1) {
            value = value.replace(/[(]([^()]+|[(]([^()]+)[)])+[)]/g, "");
        }
        
        // Remove whitespace
        if (value.indexOf("(") != -1) {
            value = value.replace(/\s+/g, " ");
        }
        
        // Simplify [att]
        if (value.indexOf("[") != -1) {
            value = value.replace(/\[[^\[\]]+\]/g, "[att]");
        }
        
        // Simplify .class
        if (value.indexOf(".") != -1) {
            value = value.replace(/[.][-_a-zA-Z][-_a-zA-Z0-9]*/g, ".class");
        }
        
        // Simplify #id
        if (value.indexOf("#") != -1) {
            value = value.replace(/[#][-_a-zA-Z][-_a-zA-Z0-9]*/g, "#id");
        }
        
        // Normalize combinators
        value = value.replace(/[ ]*([>|+|~])[ ]*/g,' $1 ');
        
        // Clean multitple selectors
        value = value.replace(/,.*/,'');

        return value.trim();

    }

}();

//
// extracts valuable informations about selectors in use
//
void function() {
    
    // 
    // To understand framework and general css usage, we collect stats about classes, ids and pseudos.
    // Those objects have the following shape: 
    // {"hover":5,"active":1,"focus":2}
    // 
    var cssPseudos = Object.create(null); // collect stats about which pseudo-classes and pseudo-elements are used in the css
    var domClasses = Object.create(null); // collect stats about which css classes are found in the <... class> attributes of the dom
    var cssClasses = Object.create(null); // collect stats about which css classes are used in the css
    var domIds = Object.create(null);     // collect stats about which ids are found in the <... id> attributes of the dom
    var cssIds = Object.create(null);     // collect stats about which ids are used in the css
    
    // 
    // To understand Modernizer usage, we need to know how often some classes are used at the front of a selector
    // While we're at it, the code also collect the state for ids
    // 
    var cssLonelyIdGates = Object.create(null);    // .class something-else ==> {"class":1}
    var cssLonelyClassGates = Object.create(null); // #id something-else ==> {"id":1}
    var cssLonelyClassGatesMatches = [];           // .class something-else ==> [".class something-else"]
    var cssLonelyIdGatesMatches = [];              // #id something-else ==> ["#id something-else"]
    
    //
    // These regular expressions catch patterns we want to track (see before)
    //
    var ID_REGEXP = /[#][-_a-zA-Z][-_a-zA-Z0-9]*/g;     // #id
    var ID_REGEXP1 = /[#][-_a-zA-Z][-_a-zA-Z0-9]*/;     // #id (only the first one)
    var CLASS_REGEXP = /[.][-_a-zA-Z][-_a-zA-Z0-9]*/g;  // .class
    var CLASS_REGEXP1 = /[.][-_a-zA-Z][-_a-zA-Z0-9]*/;  // .class (only the first one)
    var PSEUDO_REGEXP = /[:][-_a-zA-Z][-_a-zA-Z0-9]*/g; // :pseudo (only the )
    var GATEID_REGEXP = /^\s*[#][-_a-zA-Z][-_a-zA-Z0-9]*([.][-_a-zA-Z][-_a-zA-Z0-9]*|[:][-_a-zA-Z][-_a-zA-Z0-9]*)*\s+[^>+{, ][^{,]+$/; // #id ...
    var GATECLASS_REGEXP = /^\s*[.][-_a-zA-Z][-_a-zA-Z0-9]*([:][-_a-zA-Z][-_a-zA-Z0-9]*)*\s+[^>+{, ][^{,]+$/; // .class ...
    
    /**
     * From a css selector text and a set of counters, 
     * increment the counters for the matches in the selector of the 'feature' regular expression
     */
    function extractFeature(feature, selector, counters) {
        var instances = (selector.match(feature)||[]).map(function(s) { return s.substr(1) });
        instances.forEach((instance) => {
            counters[instance] = (counters[instance]|0) + 1;
        });
    }
    
    /**
     * This analyzer will collect over the selectors the stats defined before
     */
    CSSUsage.SelectorAnalyzer = function parseSelector(style, selectorsText) {
        if(typeof selectorsText != 'string') return;
            
        var selectors = selectorsText.split(',');
        for(var i = selectors.length; i--;) { var selector = selectors[i];
            
            // extract all features from the selectors
            extractFeature(ID_REGEXP, selector, cssIds);
            extractFeature(CLASS_REGEXP, selector, cssClasses);
            extractFeature(PSEUDO_REGEXP, selector, cssPseudos);
            
            // detect specific selector patterns we're interested in
            if(GATEID_REGEXP.test(selector)) {
                cssLonelyIdGatesMatches.push(selector);
                extractFeature(ID_REGEXP1, selector, cssLonelyIdGates);
            }
            if(GATECLASS_REGEXP.test(selector)) {
                cssLonelyClassGatesMatches.push(selector);
                extractFeature(CLASS_REGEXP1, selector, cssLonelyClassGates);
            }
        }
        
    }
    
    /**
     * This analyzer will collect over the dom elements the stats defined before
     */
    CSSUsage.DOMClassAnalyzer = function(element) {
        
        // collect classes used in the wild
        if(element.className) {
            var elementClasses = [].slice.call(element.classList,0);
            elementClasses.forEach(function(c) {
                domClasses[c] = (domClasses[c]|0) + 1;
            });
        }
        
        // collect ids used in the wild
        if(element.id) {
            domIds[element.id] = (domIds[element.id]|0) + 1;
        }
        
    }
    
    /**
     * This function will be called when all stats have been collected
     * at which point we will agregate some of them in useful values like Bootstrap usages, etc...
     */
    CSSUsage.SelectorAnalyzer.finalize = function() {
        
        // get arrays of the classes/ids used ({"hover":5} => ["hover"]))
        var domClassesArray = Object.keys(domClasses);
        var cssClassesArray = Object.keys(cssClasses);
        var domIdsArray = Object.keys(domIds);
        var cssIdsArray = Object.keys(cssIds);

        // get arrays of the .class gates used ({"hover":5} => ["hover"]), filter irrelevant entries
        var cssUniqueLonelyClassGatesArray = Object.keys(cssLonelyClassGates);
        var cssUniqueLonelyClassGatesUsedArray = cssUniqueLonelyClassGatesArray.filter((c) => domClasses[c]);
        var cssUniqueLonelyClassGatesUsedWorthArray = cssUniqueLonelyClassGatesUsedArray.filter((c)=>(cssLonelyClassGates[c]>9));
        console.log(cssLonelyClassGates);
        console.log(cssUniqueLonelyClassGatesUsedWorthArray);

        // get arrays of the #id gates used ({"hover":5} => ["hover"]), filter irrelevant entries
        var cssUniqueLonelyIdGatesArray = Object.keys(cssLonelyIdGates);
        var cssUniqueLonelyIdGatesUsedArray = cssUniqueLonelyIdGatesArray.filter((c) => domIds[c]);
        var cssUniqueLonelyIdGatesUsedWorthArray = cssUniqueLonelyIdGatesUsedArray.filter((c)=>(cssLonelyIdGates[c]>9));
        console.log(cssLonelyIdGates);
        console.log(cssUniqueLonelyIdGatesUsedWorthArray);
        
        //
        // report how many times the classes in the following arrays have been used in the dom
        // (general stats)
        //
        
        /** count how many times the usual clearfix classes are used */
        var detectedClearfixUsages = function(domClasses) {
            
            var trackedClasses = [
                'clearfix','clear',
            ];
            
            return trackedClasses.reduce((a,b) => a+(domClasses[b]|0), 0);
            
        };
        
        /** count how many times the usual hide/show classes are used */
        var detectedVisibilityUsages = function(domClasses) {
            
            var trackedClasses = [
                'show', 'hide', 'visible', 'hidden', 
            ];
            
            return trackedClasses.reduce((a,b) => a+(domClasses[b]|0), 0);
            
        };
        
        //
        // report how many times the classes in the following arrays have been used in the dom
        // (bootstrap stats)
        //
        
        var detectedBootstrapGridUsages = function(domClasses) {
            
            var trackedClasses = [];
            
            var sizes = ['xs','sm','md','lg'];
            for(var i = sizes.length; i--;) { var size = sizes[i];
                for(var j = 12+1; --j;) {
                    trackedClasses.push('col-'+size+'-'+j);
                    for(var k = 12+1; --k;) {
                        trackedClasses.push('col-'+size+'-'+j+'-offset-'+k);
                        trackedClasses.push('col-'+size+'-'+j+'-push-'+k);
                        trackedClasses.push('col-'+size+'-'+j+'-pull-'+k);
                    }
                }
            }
            
            return trackedClasses.reduce((a,b) => a+(domClasses[b]|0), 0);
            
        };
        
        var detectedBootstrapFormUsages = function(domClasses) {
            
            var trackedClasses = [
                'form-group', 'form-group-xs', 'form-group-sm', 'form-group-md', 'form-group-lg',
                'form-control', 'form-horizontal', 'form-inline',
                'btn','btn-primary','btn-secondary','btn-success','btn-warning','btn-danger','btn-error'
            ];
            
            return trackedClasses.reduce((a,b) => a+(domClasses[b]|0), 0);
            
        };
        
        var detectedBootstrapAlertUsages = function(domClasses) {
            
            var trackedClasses = [
                'alert','alert-primary','alert-secondary','alert-success','alert-warning','alert-danger','alert-error'
            ];
            
            return trackedClasses.reduce((a,b) => a+(domClasses[b]|0), 0);
            
        };
        
        var detectedBootstrapFloatUsages = function(domClasses) {
            
            var trackedClasses = [
                'pull-left','pull-right',
            ];
            
            return trackedClasses.reduce((a,b) => a+(domClasses[b]|0), 0);
            
        };
        
        //
        // report how many times the classes in the following arrays have been used as css gate
        // (modernizer stats)
        //
        
        var detectedModernizerUsages = function(cssLonelyClassGates) {
            
            var ModernizerUsages = {count:0,values:{/*  "js":1,  "no-js":2  */}};
            var trackedClasses = ["js","ambientlight","applicationcache","audio","batteryapi","blobconstructor","canvas","canvastext","contenteditable","contextmenu","cookies","cors","cryptography","customprotocolhandler","customevent","dart","dataview","emoji","eventlistener","exiforientation","flash","fullscreen","gamepads","geolocation","hashchange","hiddenscroll","history","htmlimports","ie8compat","indexeddb","indexeddbblob","input","search","inputtypes","intl","json","olreversed","mathml","notification","pagevisibility","performance","pointerevents","pointerlock","postmessage","proximity","queryselector","quotamanagement","requestanimationframe","serviceworker","svg","templatestrings","touchevents","typedarrays","unicoderange","unicode","userdata","vibrate","video","vml","webintents","animation","webgl","websockets","xdomainrequest","adownload","audioloop","audiopreload","webaudio","lowbattery","canvasblending","todataurljpeg,todataurlpng,todataurlwebp","canvaswinding","getrandomvalues","cssall","cssanimations","appearance","backdropfilter","backgroundblendmode","backgroundcliptext","bgpositionshorthand","bgpositionxy","bgrepeatspace,bgrepeatround","backgroundsize","bgsizecover","borderimage","borderradius","boxshadow","boxsizing","csscalc","checked","csschunit","csscolumns","cubicbezierrange","display-runin","displaytable","ellipsis","cssescape","cssexunit","cssfilters","flexbox","flexboxlegacy","flexboxtweener","flexwrap","fontface","generatedcontent","cssgradients","hsla","csshyphens,softhyphens,softhyphensfind","cssinvalid","lastchild","cssmask","mediaqueries","multiplebgs","nthchild","objectfit","opacity","overflowscrolling","csspointerevents","csspositionsticky","csspseudoanimations","csspseudotransitions","cssreflections","regions","cssremunit","cssresize","rgba","cssscrollbar","shapes","siblinggeneral","subpixelfont","supports","target","textalignlast","textshadow","csstransforms","csstransforms3d","preserve3d","csstransitions","userselect","cssvalid","cssvhunit","cssvmaxunit","cssvminunit","cssvwunit","willchange","wrapflow","classlist","createelementattrs,createelement-attrs","dataset","documentfragment","hidden","microdata","mutationobserver","bdi","datalistelem","details","outputelem","picture","progressbar,meter","ruby","template","time","texttrackapi,track","unknownelements","es5array","es5date","es5function","es5object","es5","strictmode","es5string","es5syntax","es5undefined","es6array","contains","generators","es6math","es6number","es6object","promises","es6string","devicemotion,deviceorientation","oninput","filereader","filesystem","capture","fileinput","directory","formattribute","localizednumber","placeholder","requestautocomplete","formvalidation","sandbox","seamless","srcdoc","apng","jpeg2000","jpegxr","sizes","srcset","webpalpha","webpanimation","webplossless,webp-lossless","webp","inputformaction","inputformenctype","inputformmethod","inputformtarget","beacon","lowbandwidth","eventsource","fetch","xhrresponsetypearraybuffer","xhrresponsetypeblob","xhrresponsetypedocument","xhrresponsetypejson","xhrresponsetypetext","xhrresponsetype","xhr2","scriptasync","scriptdefer","speechrecognition","speechsynthesis","localstorage","sessionstorage","websqldatabase","stylescoped","svgasimg","svgclippaths","svgfilters","svgforeignobject","inlinesvg","smil","textareamaxlength","bloburls","datauri","urlparser","videoautoplay","videoloop","videopreload","webglextensions","datachannel","getusermedia","peerconnection","websocketsbinary","atob-btoa","framed","matchmedia","blobworkers","dataworkers","sharedworkers","transferables","webworkers"];
            trackedClasses.forEach(function(c) { countInstancesOfTheClass(c); countInstancesOfTheClass('no-'+c); });
            return ModernizerUsages;
            
            function countInstancesOfTheClass(c) {
                var count = cssLonelyClassGates[c]; if(!count) return; 
                ModernizerUsages.count += count; 
                ModernizerUsages.values[c]=count; 
            }
            
        }

        //
        //
        //
        var results = {
            
            // how many elements on the page (used to compute percentages for css.props)
            DOMElements: document.all.length,
            
            // how many selectors vs inline style, and other usage stats
            SelectorsFound: CSSUsage.StyleWalker.amountOfSelectors,
            InlineStylesFound: CSSUsage.StyleWalker.amountOfInlineStyles,
            SelectorsUnused: CSSUsage.StyleWalker.amountOfSelectorsUnused,
            
            // ids stats
            IdsUsed: domIdsArray.length,
            IdsRecognized: Object.keys(cssIds).length,
            IdsUsedRecognized: domIdsArray.filter(i => cssIds[i]).length,
            
            // classes stats
            ClassesUsed: domClassesArray.length,
            ClassesRecognized: Object.keys(cssClasses).length,
            ClassesUsedRecognized: domClassesArray.filter(c => cssClasses[c]).length,
            
            // non-framework usage stats (see before)
            ClearfixUsage: detectedClearfixUsages(domClasses),
            VisibilityUsage: detectedVisibilityUsages(domClasses),
            
            ClearfixRecognized: detectedClearfixUsages(cssClasses),
            VisibilityRecognized: detectedVisibilityUsages(cssClasses),
            
            // framework usage stats (see before)
            Modernizer: !!window.Modernizer,
            ModernizerDOMUsages: detectedModernizerUsages(domClasses),
            ModernizerCSSUsages: detectedModernizerUsages(cssLonelyClassGates),
           
            Bootstrap: !!((window.jQuery||window.$) && (window.jQuery||window.$).fn.modal)|0,
            
            BootstrapGridUsage: detectedBootstrapGridUsages(domClasses),
            BootstrapFormUsage: detectedBootstrapFormUsages(domClasses),
            BootstrapFloatUsage: detectedBootstrapFloatUsages(domClasses),
            BootstrapAlertUsage: detectedBootstrapAlertUsages(domClasses),
            
            BootstrapGridRecognized: detectedBootstrapGridUsages(cssClasses),
            BootstrapFormRecognized: detectedBootstrapFormUsages(cssClasses),
            BootstrapFloatRecognized: detectedBootstrapFloatUsages(cssClasses),
            BootstrapAlertRecognized: detectedBootstrapAlertUsages(cssClasses),
            
        };
        
        console.log(CSSUsageResults.usages = results);
        
    }
        
}();

//
// Execution scheduler:
// This is where we decide what to run, and when
//
void function() {

    if(document.readyState !== 'complete') {
        
        // if the document is loading, run when it loads or in 10s, whichever is less
        window.addEventListener('load', onready);
        setTimeout(onready, 10000);
        
    } else {
        
        // if the document is ready, run now
        onready();
        
    }

    /**
     * This is the main entrypoint of our script
     */
    function onready() {
        
        // Prevent this code from running multiple times
        var firstTime = !onready.hasAlreadyRun; onready.hasAlreadyRun = true;
        if(!firstTime) { return; /* for now... */ }
        
        // Uncomment if you want to set breakpoints when running in the console
        //debugger;

        // Keep track of duration
        var startTime = performance.now();

        // register tools
        CSSUsage.StyleWalker.ruleAnalyzers.push(CSSUsage.PropertyValuesAnalyzer);
        CSSUsage.StyleWalker.ruleAnalyzers.push(CSSUsage.SelectorAnalyzer);
        CSSUsage.StyleWalker.elementAnalyzers.push(CSSUsage.DOMClassAnalyzer);

        // perform analysis
        CSSUsage.StyleWalker.walkOverDomElements();
        CSSUsage.StyleWalker.walkOverCssStyles();
        CSSUsage.SelectorAnalyzer.finalize();

        // Update duration
        CSSUsageResults.duration = (performance.now() - startTime)|0;

        // DO SOMETHING WITH THE CSS OBJECT HERE
        console.log(CSSUsageResults);

        // Convert it to a more efficient format
        INSTRUMENTATION_RESULTS.css = CSSUsageResults;
        console.log(convertToTSV(INSTRUMENTATION_RESULTS));

        /** convert the instrumentation results to a spreadsheet for analysis */
        function convertToTSV(INSTRUMENTATION_RESULTS) {
            
            var VALUE_COLUMN = 4;
            var finishedRows = [];
            var currentRowTemplate = [
                INSTRUMENTATION_RESULTS.UA,
                INSTRUMENTATION_RESULTS.UASTRING,
                INSTRUMENTATION_RESULTS.URL,
                INSTRUMENTATION_RESULTS.TIMESTAMP,
                0
            ];
            
            currentRowTemplate.push('css');
            convertToTSV(INSTRUMENTATION_RESULTS['css']);
            currentRowTemplate.pop();
            
            currentRowTemplate.push('dom');
            convertToTSV(INSTRUMENTATION_RESULTS['dom']);
            currentRowTemplate.pop();
            
            return finishedRows.map((row) => (row.join('\t'))).join('\n');
            
            /** helper function doing the actual conversion */
            function convertToTSV(object) {
                if(object==null || object==undefined || typeof object == 'number' || typeof object == 'string') {
                    finishedRows.push(new Row(currentRowTemplate, ''+object));
                } else {
                    for(var key in object) {
                        if({}.hasOwnProperty.call(object,key)) {
                            currentRowTemplate.push(key);
                            convertToTSV(object[key]);
                            currentRowTemplate.pop();
                        }
                    }
                }
            }
            
            /** constructor for a row of our table */
            function Row(currentRowTemplate, value) {
                
                // Initialize an empty row with enough columns
                var row = [
                    /*UANAME:     edge                            */'',
                    /*UASTRING:   mozilla/5.0 (...)               */'',
                    /*URL:        http://.../...                  */'',
                    /*TIMESTAMP:  1445622257303                   */'',
                    /*VALUE:      0|1|...                         */'',
                    /*DATATYPE:   css|dom|...                     */'',
                    /*SUBTYPE:    props|types|api|...             */'',
                    /*NAME:       font-size|querySelector|...     */'',
                    /*CONTEXT:    count|values|...                */'',
                    /*SUBCONTEXT: px|em|...                       */'',
                    /*...                                         */'',
                    /*...                                         */'',
                ];
                
                // Copy the column values from the template
                for(var i = currentRowTemplate.length; i--;) {
                    row[i] = currentRowTemplate[i];
                }
                
                // Add the value to the row
                row[VALUE_COLUMN] = value;
                
                return row;
            }

        }
        
    }


}();