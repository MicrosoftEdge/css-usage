//
// The StyleWalker API cover the extraction of style in the browser
//
void function() { "use strict";

    window.CSSUsage.StyleWalker = {
        
        // This array contains the list of functions being run on each CSSStyleDeclaration
        // [ function(style, selectorText, matchedElements, ruleType) { ... }, ... ]
        ruleAnalyzers: [],
        
        // This array contains the list of functions being run on each DOM element of the page
        // [ function(element) { ...} ]
        elementAnalyzers: [],

        recipesToRun: [],
        runRecipes: false,

        // 
        walkOverCssStyles: walkOverCssStyles,
        walkOverDomElements: walkOverDomElements,
        
        // Those stats are being collected while walking over the css style rules
        amountOfInlineStyles: 0,
        amountOfSelectorsUnused: 0,
        amountOfSelectors: 0,
    }
    
    var hasWalkedDomElementsOnce = false;
    // holds @keyframes temporarily while we wait to know how much they are used
    var keyframes = Object.create(null);
    
    /**
     * For all stylesheets of the document, 
     * walk through the stylerules and run analyzers
     */
    function walkOverCssStyles() {
        if(window.debugCSSUsage) console.log("STAGE: Walking over styles");
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
                if(window.debugCSSUsage) console.log(e, e.stack);
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
        if(window.debugCSSUsage) console.log("STAGE: Walking over rules");
        // TODO: console.log(cssRules);
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
        // TODO: console.log(rule);
        
        // Increment the rule type's counter
        CSSUsageResults.types[rule.type|0]++; 

        // Some CssRules have nested rules to walk through:
        if (rule.cssRules && rule.cssRules.length>0) {
            
            walkOverCssRules(rule.cssRules, rule.parentStyleSheet, parentMatchedElements);
            
        }

        // Some CssRules have style we can analyze
        if(rule.style) {
            // find what the rule applies to
            var selectorText;
            var matchedElements; 
            if(rule.selectorText) {
                selectorText = CSSUsage.PropertyValuesAnalyzer.cleanSelectorText(rule.selectorText);
                try {
                    // NOTE: parentMatchedElement always nil, never set
                    if(parentMatchedElements) {
                        matchedElements = [].slice.call(document.querySelectorAll(selectorText));
                        matchedElements.parentMatchedElements = parentMatchedElements;
                    } else {
                        matchedElements = [].slice.call(document.querySelectorAll(selectorText));
                    }
                } catch(ex) {
                    matchedElements = [];
                    console.warn(ex.stack||("Invalid selector: "+selectorText+" -- via "+rule.selectorText));
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

        if((rule.type >= 2 && rule.type <= 8) || (rule.type >= 10 && rule.type <= 15)) {
            if(rule.conditionText) {
                processConditionalAtRules(rule);
            } else {
                processGeneralAtRules(rule);
            } 
        }


    }

    /**
     * This process @atrules with conditional statements such as @supports.
     * It will call helpers to process condition statements to conform to
     * a standardized version.
     */
    function processConditionalAtRules(rule) {
        var selectorText = '@atrule:' + rule.type;

        if(!CSSUsageResults.atrules[selectorText]) {
            CSSUsageResults.atrules[selectorText] = Object.create(null);
            CSSUsageResults.atrules[selectorText] = {"count": 1, 
                                                        "props": {},
                                                        "conditions": {}} // TODO: process condition
        } else {
            var previousCount = CSSUsageResults.atrules[selectorText].count
            CSSUsageResults.atrules[selectorText].count = previousCount + 1
        }
        
    }


    /**
     * This process all other @atrules that don't have conditions or styles.
     */
    function processGeneralAtRules(rule) {
        var selectorText = '@atrule:' + rule.type;

        if(!CSSUsageResults.atrules[selectorText]) {
            CSSUsageResults.atrules[selectorText] = Object.create(null);
            CSSUsageResults.atrules[selectorText] = {"count": 1, 
                                                        "props": {}} // TODO: process props
        } else {
            var previousCount = CSSUsageResults.atrules[selectorText].count
            CSSUsageResults.atrules[selectorText].count = previousCount + 1
        }

        if(rule.type == 7) {
            if(!CSSUsageResults.atrules[selectorText]["keyframes"]) {
                CSSUsageResults.atrules[selectorText]["keyframes"] = Object.create(null);
            }
            CSSUsageResults.atrules[selectorText].props = CSSUsageResults.rules["@atrule:8"].props;

            for(let index in rule.cssRules) {
                let keyframe = rule.cssRules[index];
                if(keyframe.keyText) {
                    if(!CSSUsageResults.atrules[selectorText].keyframes[keyframe.keyText]) {
                        CSSUsageResults.atrules[selectorText].keyframes[keyframe.keyText] = {"count": 1};
                    } else {
                        var previousKeyframeCount = CSSUsageResults.atrules[selectorText].keyframes[keyframe.keyText].count;
                        CSSUsageResults.atrules[selectorText].keyframes[keyframe.keyText].count = previousKeyframeCount + 1;
                    }
                }
            }
        } else if(rule.type == 5) {
            CSSUsageResults.atrules[selectorText].props = CSSUsageResults.rules["@atrule:5"].props;
        }
        // TODO: add props
        
    }


    /**
     * This is the dom work horse, this will will loop over the
     * dom elements and then call the element analyzers currently registered,
     * as well as rule analyzers for inline styles
     */
    function walkOverDomElements(obj, index) {
        if(window.debugCSSUsage) console.log("STAGE: Walking over DOM elements");
        var recipesToRun = CSSUsage.StyleWalker.recipesToRun;			
        obj = obj || document.documentElement; index = index|0;

        // Loop through the elements
        var elements = [].slice.call(document.all,0);
        for(var i = 0; i < elements.length; i++) { 
            var element=elements[i];			
            
            // Analyze its style, if any
            if(!CSSUsage.StyleWalker.runRecipes) {
                // Analyze the element
                runElementAnalyzers(element, index);

                if (element.hasAttribute('style')) {					
                    // Inline styles count like a style rule with no selector but one matched element
                    var ruleType = 1;
                    var isInline = true;
                    var selectorText = '@inline:'+element.tagName;
                    var matchedElements = [element];
                    runRuleAnalyzers(element.style, selectorText, matchedElements, ruleType, isInline);					
                }
            } else { // We've already walked the DOM crawler and need to run the recipes
                for(var r = 0; r < recipesToRun.length ; r++) {
                    var recipeToRun = recipesToRun[r];
                    var results = RecipeResults[recipeToRun.name] || (RecipeResults[recipeToRun.name]={});
                    recipeToRun(element, results, true);
                }
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
        for(var i = 0; i < CSSUsage.StyleWalker.ruleAnalyzers.length; i++) {
            var runAnalyzer = CSSUsage.StyleWalker.ruleAnalyzers[i];
            // TODO: console.log(runAnalyzer);
            runAnalyzer(style, selectorText, matchedElements, type, isInline);
        }
        
    }
    
    /**
     * Given an element and its data, send it to all element analyzers
     */
    function runElementAnalyzers(element, index, depth) {
        for(var i = 0; i < CSSUsage.StyleWalker.elementAnalyzers.length; i++) {
            var runAnalyzer = CSSUsage.StyleWalker.elementAnalyzers[i];
            runAnalyzer(element, index, depth);
        }
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