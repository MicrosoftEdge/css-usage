//
// computes various css stats (PropertyValuesAnalyzer)
//
void function() {

    CSSUsage.PropertyValuesAnalyzer = analyzeStyleOfRule;
    CSSUsage.PropertyValuesAnalyzer.cleanSelectorText = cleanSelectorText;
    CSSUsage.PropertyValuesAnalyzer.generalizedSelectorsOf = generalizedSelectorsOf;
    CSSUsage.PropertyValuesAnalyzer.finalize = finalize;

    // We put a computed style in cache for filtering purposes
    var defaultStyle = getComputedStyle(document.createElement('div'));
    // As well as some basic lies
    var getBuggyValuesForThisBrowser = function() {
        var buggyValues = getBuggyValuesForThisBrowser.cache;
        if(buggyValues) { return buggyValues; }
        else { buggyValues = Object.create(null); }
        
        // Edge reports initial value instead of "initial", we have to be cautious
        if(browserIsEdge) {

            buggyValues['*'] = 1; // make 0 values automatic for longhand properties
            
            //buggyValues['list-style-position:outside'] = 0;
            buggyValues['list-style-image:none'] = 1;
            //buggyValues['outline-color:invert'] = 0;
            //buggyValues['outline-style:none'] = 0;
            //buggyValues['outline-width:medium'] = 0;
            //buggyValues['background-image:none'] = 0;
            //buggyValues['background-attachment:scroll'] = 0;
            //buggyValues['background-repeat:repeat'] = 0;
            //buggyValues['background-repeat-x:repeat'] = 0;
            //buggyValues['background-repeat-y:repeat'] = 0;
            //buggyValues['background-position-x:0%'] = 0;
            //buggyValues['background-position-y:0%'] = 0;
            //buggyValues['background-size:auto'] = 0;
            //buggyValues['background-origin:padding-box'] = 0;
            //buggyValues['background-clip:border-box'] = 0;
            //buggyValues['background-color:transparent'] = 0;
            buggyValues['border-top-color:currentcolor'] = 1;
            buggyValues['border-right-color:currentcolor'] = 1;
            buggyValues['border-bottom-color:currentcolor'] = 1;
            buggyValues['border-left-color:currentcolor'] = 1;
            //buggyValues['border-top-style:solid'] = 0;
            //buggyValues['border-right-style:solid'] = 0;
            //buggyValues['border-bottom-style:solid'] = 0;
            //buggyValues['border-left-style:solid'] = 0;
            buggyValues['border-top-width:medium'] = 1;
            buggyValues['border-right-width:medium'] = 1;
            buggyValues['border-bottom-width:medium'] = 1;
            buggyValues['border-left-width:medium'] = 1;
            buggyValues['border-image-source:none'] = 1;
            buggyValues['border-image-outset:0'] = 1;
            buggyValues['border-image-width:1'] = 1;
            buggyValues['border-image-repeat:repeat'] = 1;
            buggyValues['border-image-repeat-x:repeat'] = 1;
            buggyValues['border-image-repeat-y:repeat'] = 1;
            buggyValues['line-height:normal'] = 1;
            //buggyValues['font-size-adjust:none'] = 0;
            buggyValues['font-stretch:normal'] = 1;
            
        }
        
        // Firefox reports initial values instead of "initial", we have to be cautious
        if(browserIsFirefox) {
            
            buggyValues['*'] = 1; // make 0 values automatic for longhand properties
            
        }
        
        // Attempt to force to optimize the object somehow
        Object.create(buggyValues);
        
        return getBuggyValuesForThisBrowser.cache = buggyValues;

    };
    var valueExistsInRootProperty = (cssText,key,rootKey,value) => {
        value = value.trim().toLowerCase();
        
        // detect suspicious values
        var buggyValues = getBuggyValuesForThisBrowser();
        
        // apply common sense to the given value, per browser
        var buggyState = buggyValues[key+':'+value];
        if(buggyState === 1) { return false; }
        if(buggyState !== 0 && (!buggyValues['*'] || CSSShorthands.unexpand(key).length == 0)) { return true; }

        // root properties are unlikely to lie
        if(key==rootKey) return false;			
        
        // ask the browser is the best we can do right now
        var values = value.split(/\s+|\s*,\s*/g);
        var validValues = ' ';
        var validValuesExtractor = new RegExp(' '+rootKey+'(?:[-][-_a-zA-Z0-9]+)?[:]([^;]*)','gi');
        var match; while(match = validValuesExtractor.exec(cssText)) {
            validValues += match[1] + ' ';
        }
        for(var i = 0; i < values.length; i++) {
            var value = values[i];
            if(validValues.indexOf(' '+value+' ')==-1) return false;
        }
        return true;
        
    };

    
    /** This will loop over the styles declarations */
    function analyzeStyleOfRule(style, selectorText, matchedElements, type, isInline) { isInline=!!isInline;
        
        // We want to filter rules that are not actually used
        var count = matchedElements.length;
        var selector = selectorText;
        var selectorCat = {'1:true':'@inline','1:false':'@stylerule'}[''+type+':'+isInline]||'@atrule';
        
        // Keep track of unused rules
        var isRuleUnused = (count == 0);
        if(isRuleUnused) {
            CSSUsage.StyleWalker.amountOfSelectorsUnused++;
        }
        
        // We need a generalized selector to collect some stats
        var generalizedSelectors = (
            (selectorCat=='@stylerule')
                ? [selectorCat].concat(generalizedSelectorsOf(selector))
                : [selectorCat, selector]
        );
        
        // Get the datastores of the generalized selectors
        var generalizedSelectorsData = map(generalizedSelectors, (generalizedSelector) => (
            CSSUsageResults.rules[generalizedSelector] || (CSSUsageResults.rules[generalizedSelector] = {count:0,props:Object.create(null)})
        ));
        
        // Increment the occurence counter of found generalized selectors
        for(var i = 0; i < generalizedSelectorsData.length; i++) {
            var generalizedSelectorData = generalizedSelectorsData[i];
            generalizedSelectorData.count++
        }
        
        // avoid most common browser lies
        var cssText = ' ' + style.cssText.toLowerCase(); 
        if(browserIsEdge) {
            cssText = cssText.replace(/border: medium; border-image: none;/,'border: none;');
            cssText = cssText.replace(/ border-image: none;/,' ');
        }
        
        // TODO: console.log(style);
        // For each property declaration in this rule, we collect some stats
        for (var i = style.length; i--;) {

            var key = style[i], rootKeyIndex=key.indexOf('-'), rootKey = rootKeyIndex==-1 ? key : key.substr(0,rootKeyIndex);
            var normalizedKey = rootKeyIndex==0&&key.indexOf('-',1)==1 ? '--var' : key;
            var styleValue = style.getPropertyValue(key);

            // TODO: console.log(normalizedKey);
            // TODO: console.log(styleValue);
            
            // Only keep styles that were declared by the author
            // We need to make sure we're only checking string props
            var isValueInvalid = typeof styleValue !== 'string' && styleValue != "" && styleValue != undefined;
            if (isValueInvalid) { 
                continue;
            }
            
            var isPropertyUndefined = (cssText.indexOf(' '+key+':') == -1) && (styleValue=='initial' || !valueExistsInRootProperty(cssText, key, rootKey, styleValue));
            if (isPropertyUndefined) {
                continue;
            }
            
            // divide the value into simplified components
            var specifiedValuesArray = CSSUsage.CSSValues.createValueArray(styleValue,normalizedKey);
            var values = new Array();
            for(var j = specifiedValuesArray.length; j--;) {
                values.push(CSSUsage.CSSValues.parseValues(specifiedValuesArray[j],normalizedKey));
            }
            
            // log the property usage per selector
            for(var gs = 0; gs < generalizedSelectorsData.length; gs++) {
                var generalizedSelectorData = generalizedSelectorsData[gs];
                // get the datastore for current property
                var propStats = generalizedSelectorData.props[normalizedKey] || (generalizedSelectorData.props[normalizedKey] = {count:0,values:Object.create(null)});

                // we saw the property one time
                propStats.count++;
                
                // we also saw a bunch of values
                for(var v = 0; v < values.length; v++) {
                    var value = values[v];				
                    // increment the counts for those by one, too
                    if(value.length>0) {
                        propStats.values[value] = (propStats.values[value]|0) + 1
                    }
                    
                }
                
            }
            
            // if we may increment some counts due to this declaration
            if(count > 0) {
                
                // instanciate or fetch the property metadata
                var propObject = CSSUsageResults.props[normalizedKey];
                if (!propObject) {
                    propObject = CSSUsageResults.props[normalizedKey] = {
                        count: 0,
                        values: Object.create(null)
                    };
                }
                
                // update the occurence counts of the property and value
                for(var e = 0; e < matchedElements.length; e++) {
                    var element = matchedElements[e];

                    // check what the elements already contributed for this property
                    var cssUsageMeta = element.CSSUsage || (element.CSSUsage=Object.create(null));
                    var knownValues = cssUsageMeta[normalizedKey] || (cssUsageMeta[normalizedKey] = []);

                    // For recipes, at times we want to look at the specified values as well so hang
                    // these on the element so we don't have to recompute them
                    knownValues.valuesArray = knownValues.valuesArray || (knownValues.valuesArray = []);
                    
                    for(var sv = 0; sv < specifiedValuesArray.length; sv++) {
                        var currentSV = specifiedValuesArray[sv];
                        if(knownValues.valuesArray.indexOf(currentSV) == -1) {
                            knownValues.valuesArray.push(currentSV)
                        }
                    }

                    // increment the amount of affected elements which we didn't count yet
                    if(knownValues.length == 0) { propObject.count += 1; }

                    // add newly found values too
                    for(var v = 0; v < values.length; v++) {
                        var value = values[v];
                        if(knownValues.indexOf(value) >= 0) { return; }
                        propObject.values[value] = (propObject.values[value]|0) + 1;
                        knownValues.push(value);
                    }
                    
                }
                
            }
            
        }
    }
    
    function finalize() {
        
        // anonymize identifiers used for animation-name
        function removeAnimationNames() {
            
            // anonymize identifiers used for animation-name globally
            if(CSSUsageResults.props["animation-name"]) {
                CSSUsageResults.props["animation-name"].values = {"<custom-ident>":CSSUsageResults.props["animation-name"].count};
            }
            
            // anonymize identifiers used for animation-name per selector
            for(var selector in CSSUsageResults.rules) { 
                var rule = CSSUsageResults.rules[selector];
                if(rule && rule.props && rule.props["animation-name"]) {
                    rule.props["animation-name"].values = {"<custom-ident>":rule.props["animation-name"].count};
                }
            }
            
        }
        
        removeAnimationNames();			
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
            return text.replace(/([-_a-zA-Z0-9*\[\]]?):(?:hover|active|focus|before|after|not\(:(hover|active|focus)\))|::(?:before|after)/gi, '>>$1<<').replace(/(^| |>|\+|~)>><</g,'$1*').replace(/\(>><<\)/g,'(*)').replace(/>>([-_a-zA-Z0-9*\[\]]?)<</g,'$1');
        }
    }
    
    /**
     * Returns an anonymized version of the selector.
     * @example "#menu.open:hover>a.submenu" => "#id.class:hover > a.class"
     */
    function generalizedSelectorsOf(value) {
        
        // Trim
        value = value.trim();
        
        // Collapse whitespace
        if (value) {
            value = value.replace(/\s+/g, " ");
        }
        
        // Remove (...)
        if (value.indexOf("(") != -1) {
            value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "");
            value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "");
        }
        
        // Simplify "..." and '...'
        value = value.replace(/"([^"\\]|\\[^"\\]|\\\\|\\")*"/g,'""')
        value = value.replace(/'([^'\\]|\\[^'\\]|\\\\|\\')*'/g,"''");

        
        // Simplify [att]
        if (value.indexOf("[") != -1) {
            value = value.replace(/\[[^=\[\]]+="([^"\\]|\\[^"\\]|\\\\|\\")*"\]/g, "[a]");
            value = value.replace(/\[[^=\[\]]+='([^'\\]|\\[^'\\]|\\\\|\\')*'\]/g, "[a]");
            value = value.replace(/\[[^\[\]]+\]/g, "[a]");
        }
        
        // Simplify .class
        if (value.indexOf(".") != -1) {
            value = value.replace(/[.][-_a-zA-Z][-_a-zA-Z0-9]*/g, ".c");
        }
        
        // Simplify #id
        if (value.indexOf("#") != -1) {
            value = value.replace(/[#][-_a-zA-Z][-_a-zA-Z0-9]*/g, "#i");
        }
        
        // Normalize combinators
        value = value.replace(/[ ]*([>|+|~])[ ]*/g,' $1 ');
        
        // Trim whitespace
        value = value.trim();
        
        // Remove unnecessary * to match Chrome
        value = value.replace(/[*]([#.\x5B:])/g,'$1');
        
        // Now we can sort components so that all browsers give results similar to Chrome
        value = sortSelectorComponents(value)
        
        // Split multiple selectors
        value = value.split(/\s*,\s*/g);

        return value;

    }
    
    var ID_REGEXP = "[#]i";         // #id
    var CLASS_REGEXP = "[.]c";      // .class
    var ATTR_REGEXP = "\\[a\\]";    // [att]
    var PSEUDO_REGEXP = "[:][:]?[-_a-zA-Z][-_a-zA-Z0-9]*"; // :pseudo
    var SORT_REGEXPS = [
        
        // #id first
        new RegExp("("+CLASS_REGEXP+")("+ID_REGEXP+")",'g'),
        new RegExp("("+ATTR_REGEXP+")("+ID_REGEXP+")",'g'),
        new RegExp("("+PSEUDO_REGEXP+")("+ID_REGEXP+")",'g'),
        
        // .class second
        new RegExp("("+ATTR_REGEXP+")("+CLASS_REGEXP+")",'g'),
        new RegExp("("+PSEUDO_REGEXP+")("+CLASS_REGEXP+")",'g'),
        
        // [attr] third
        new RegExp("("+PSEUDO_REGEXP+")("+ATTR_REGEXP+")",'g'),
        
        // :pseudo last
        
    ];
    function sortSelectorComponents(value) {
        
        var oldValue; do { // Yeah this is a very inefficient bubble sort. I know.
            
            oldValue = value;
            for(var i = 0; i < SORT_REGEXPS.length; i++) {
                var wrongPair = SORT_REGEXPS[i];
                value = value.replace(wrongPair,'$2$1');
            }
            
        } while(oldValue != value); return value;

    }

}();