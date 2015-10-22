void function() {

	var _ = (a => new ArrayWrapper(a));
	_.mapInline = mapInline;
	_.map = map; /*.......*/ map.bind = (()=>map);
	_.filter = filter; /*.*/ filter.bind = (()=>filter);
	_.reduce = reduce; /*.*/ reduce.bind = (()=>reduce);
	window.CSSUsageLodash = _;
	// test case: 
	// 35 = CSSUsageLodash([1,2,3,4,5]).map(v => v*v).filter(v => v%2).reduce(0, (a,b)=>(a+b)).value()
	
	function ArrayWrapper(array) {
		this.source = array;
		this.mapInline = function(f) { mapInline(this.source, f); return this; };
		this.map = function(f) { this.source = map(this.source, f); return this; };
		this.filter = function(f) { this.source = filter(this.source, f); return this; };
		this.reduce = function(v,f) { this.source = reduce(this.source, f, v); return this; };
		this.value = function() { return this.source };
	}
	
	function map(source, transform) {
		var clone = new Array(source.length);
		for(var i = source.length; i--;) {
			clone[i] = transform(source[i]);
		}
		return clone;
	}
	
	function mapInline(source, transform) {
		for(var i = source.length; i--;) {
			source[i] = transform(source[i]);
		}
		return source;
	}
	
	function filter(source, shouldValueBeIncluded) {
		var clone = new Array(source.length), i=0;
		for(var value of source) {
			if(shouldValueBeIncluded(value)) {
				clone[i++] = value
			}
		}
		clone.length = i;
		return clone;
	}
	
	function reduce(source, computeReduction, reduction) {
		for(var value of source) {
			reduction = computeReduction(reduction, value);
		}
		return reduction;
	}
	
}();
/*!
 * Based on:
 * https://github.com/gilmoreorless/css-shorthand-properties
 * MIT Licensed: http://gilmoreorless.mit-license.org/
 */
void function () {
    /**
     * Data collated from multiple W3C specs: http://www.w3.org/Style/CSS/current-work
     */
    var shorthands = this.shorthandProperties = {
		
        // CSS 2.1: http://www.w3.org/TR/CSS2/propidx.html
        'list-style':          ['-type', '-position', '-image'],
        'margin':              ['-top', '-right', '-bottom', '-left'],
        'outline':             ['-width', '-style', '-color'],
        'padding':             ['-top', '-right', '-bottom', '-left'],

        // CSS Backgrounds and Borders Module Level 3: http://www.w3.org/TR/css3-background/
        'background':          ['-image', '-position', '-size', '-repeat', '-origin', '-clip', '-attachment', '-color'],
		'background-repeat':   ['-x','-y'],
		'background-position': ['-x','-y'],
        'border':              ['-width', '-style', '-color'],
        'border-color':        ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
        'border-style':        ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
        'border-width':        ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
        'border-top':          ['-width', '-style', '-color'],
        'border-right':        ['-width', '-style', '-color'],
        'border-bottom':       ['-width', '-style', '-color'],
        'border-left':         ['-width', '-style', '-color'],
        'border-radius':       ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
        'border-image':        ['-source', '-slice', '-width', '-outset', '-repeat'],

        // CSS Fonts Module Level 3: http://www.w3.org/TR/css3-fonts/
        'font':                ['-style', '-variant', '-weight', '-stretch', '-size', 'line-height', '-family'],
        'font-variant':        ['-ligatures', '-alternates', '-caps', '-numeric', '-east-asian'],

        // CSS Masking Module Level 1: http://www.w3.org/TR/css-masking/
        'mask':                ['-image', '-mode', '-position', '-size', '-repeat', '-origin', '-clip'],
        'mask-border':         ['-source', '-slice', '-width', '-outset', '-repeat', '-mode'],

        // CSS Multi-column Layout Module: http://www.w3.org/TR/css3-multicol/
        'columns':             ['column-width', 'column-count'],
        'column-rule':         ['-width', '-style', '-color'],

        // CSS Speech Module: http://www.w3.org/TR/css3-speech/
        'cue':                 ['-before', '-after'],
        'pause':               ['-before', '-after'],
        'rest':                ['-before', '-after'],

        // CSS Text Decoration Module Level 3: http://www.w3.org/TR/css-text-decor-3/
        'text-decoration':     ['-line', '-style', '-color'],
        'text-emphasis':       ['-style', '-color'],

        // CSS Animations (WD): http://www.w3.org/TR/css3-animations
        'animation':           ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],

        // CSS Transitions (WD): http://www.w3.org/TR/css3-transitions/
        'transition':          ['-property', '-duration', '-timing-function', '-delay'],

        // CSS Flexible Box Layout Module Level 1 (WD): http://www.w3.org/TR/css3-flexbox/
        'flex':                ['-grow', '-shrink', '-basis'],
		
		// CSS Grid: https://drafts.csswg.org/css-grid/#grid-shorthand
		'grid':                ['-template', '-auto-flow', '-auto-rows','-auto-columns'],
		'grid-template':       ['-rows', '-columns', '-areas'],
		
		// Others:
		'overflow':            ['-x','-y','-style'], // https://drafts.csswg.org/css-overflow-3/
		
    };
	
	var expandCache = Object.create(null);
	var unexpandCache = Object.create(null);

    /**
     * Expand a shorthand property into an array of longhand properties which are set by it
     * @param  {string} property CSS property name
     * @return {array}           List of longhand properties, or an empty array if it's not a shorthand
     */
    this.expand = function (property) {
		
		var result = expandCache[property];
		if(result) { return result; }
		
		var prefixData = property.match(/^(-[a-zA-Z]+-)?(.*)$/);
		var prefix = prefixData[1]||'', prefixFreeProperty = prefixData[2]||'';
        if (!shorthands.hasOwnProperty(prefixFreeProperty)) {
            return [];
        }
		
		result = [];
        shorthands[prefixFreeProperty].forEach((p) => {
            var longhand = p[0] === '-' ? property + p : prefix + p;
            result.push(longhand);
			result.push.apply(result, this.expand(longhand));
        });
		
		return expandCache[property] = result;
		
    };
	
	/**
	 * Expand a longhand property into an array of shorthand which may set the value
     * @param  {string} property CSS property name
     * @return {array}           List of shorthand properties, or the original property if it's not a shorthand
	 */
	this.unexpand = function unexpand(property) {
		
		var result = unexpandCache[property];
		if(result) { return result; }
		
		var prefixData = property.match(/^(-[a-zA-Z]+-)?(.*)$/);
		var prefix = prefixData[1]||'', prefixFreeProperty = prefixData[2]||'';
		
		result = [];
		for(var shorthand in shorthands) {
			if(this.expand(shorthand).indexOf(prefixFreeProperty) >= 0) {
				result.push(prefix+shorthand);
				result.push.apply(result,this.unexpand(prefix+shorthand));
			}
		}
		
		return unexpandCache[property] = result;
		
	}
	
}.call(window.CSSShorthands={});


void function() { try {
	
	var _ = window.CSSUsageLodash;
	var map = _.map.bind(_);
	var mapInline = _.mapInline ? _.mapInline : map;
	var reduce = _.reduce.bind(_);
	var filter = _.filter.bind(_);
	
	var browserIsEdge = navigator.userAgent.indexOf('Edge')>=0;
	var browserIsFirefox = navigator.userAgent.indexOf('Firefox')>=0;
	
	//
	// Guards execution against invalid conditions
	//
	void function() {
		
		// Don't run in subframes for now
		if (top.location.href !== location.href) throw new Error("CSSUsage: the script doesn't run in frames for now");
		
		// Don't run if already ran
		if (window.CSSUsage) throw new Error("CSSUsage: second execution attempted; only one run can be executed; if you specified parameters, check the right ones were chosen");
		
		// Don't run if we don't have lodash
		if (!window.CSSUsageLodash) throw new Error("CSSUsage: missing CSSUsageLodash dependency");
		
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
						"namedcolor": 9,
						"inherit": 1
					}
				}
			}*/
			
			// this will contains the various datapoints we measure on css selector usage
			usages: {"SuccessfulCrawls":1},
			
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
		var keyframes = Object.create(null);
		
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
					selectorText = CSSUsage.PropertyValuesAnalyzer.cleanSelectorText(rule.selectorText);
					try {
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
			for(var runAnalyzer of CSSUsage.StyleWalker.ruleAnalyzers) {
				runAnalyzer(style, selectorText, matchedElements, type, isInline);
			}
			
		}
		
		/**
		 * Given an element and its data, send it to all element analyzers
		 */
		function runElementAnalyzers(element, index, depth) {
			for(var runAnalyzer of CSSUsage.StyleWalker.elementAnalyzers) {
				runAnalyzer(element,index,depth);
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

	//
	// helper to work with css values
	//
	void function() {

		CSSUsage.CSSValues = {
			createValueArray: createValueArray,
			parseValues: parseValues,
			normalizeValue: createValueArray
		};

		/**
		 * This will take a string value and reduce it down
		 * to only the aspects of the value we wish to keep
		 */
		function parseValues(value,propertyName) {
			
			// Trim value on the edges
			value = value.trim();
			
			// Normalize letter-casing
			value = value.toLowerCase();

			// Map colors to a standard value (eg: white, blue, yellow)
			if (isKeywordColor(value)) { return "namedcolor"; }
			value = value.replace(/[#][0-9a-fA-F]+/g, '#0');
			
			// Remove any digits eg: 55px -> px, 1.5 -> 0.0, 1 -> 0
			value = value.replace(/([+]|[-]|)(([0-9]+)([.][0-9]+|)|([.][0-9]+))([a-zA-Z%]+)/g, "$6"); 
			value = value.replace(/([+]|[-]|)([0-9]+)([.][0-9]+)/g, "0.0");
			value = value.replace(/([+]|[-]|)([.][0-9]+)/g, "0.0");
			value = value.replace(/([+]|[-]|)([0-9]+)/g, "0");
			
			// Remove quotes
			value = value.replace(/('|‘|’|")/g, "");
			
			//
			switch(propertyName) {
				case 'counter-increment':
				case 'counter-reset':
					
					// Anonymize the user identifier
					value = value.replace(/[-_a-zA-Z0-9]+/g,'iden');
					break;
					
				case 'grid':
				case 'grid-template':
				case 'grid-template-rows':
				case 'grid-template-columns':
				case 'grid-template-areas':
					
					// Anonymize line names
					value = value.replace(/\[[-_a-zA-Z0-9 ]+\]/g,'[names]');
					break;
					
				case '--var':
				
					// Replace {...} and [...]
					value = value.replace(/\[([^\[\]]+|\[[^\[\]]+\])+\]/g, "[...]");
					value = value.replace(/\{([^\{\}]+|\{[^\{\}]+\})+\}/g, "{...}");
					break;
					
			}
			 
			return value.trim();
			 
		}

		//-----------------------------------------------------------------------------

		/**
		 * This will transform a value into an array of value identifiers
		 */ 
		function createValueArray(value, propertyName) {

			// Trim value on the edges
			value = value.trim();
			
			// Normalize letter-casing
			value = value.toLowerCase();
			
			// Do the right thing in function of the property
			switch(propertyName) {
				case 'font-family':
					
					// Remove various quotes
					if (value.indexOf("'") != -1 || value.indexOf("‘") != -1 || value.indexOf('"')) {
						value = value.replace(/('|‘|’|")/g, "");
					}
					
					// Divide at commas to separate different font names
					value = value.split(/\s*,\s*/g);
					return value;
					
				case '--var':
				
					// Replace strings by dummies
					value = value.replace(/"([^"\\]|\\[^"\\]|\\\\|\\")*"/g,'"..."')
					value = value.replace(/'([^'\\]|\\[^'\\]|\\\\|\\')*'/g,'"..."');
					
					// Remove group contents (...), {...} and [...]
					value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "(...)");
					value = value.replace(/[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]*)[}])*[}])*[}])*[}])*[}]/g, "{...}");
					value = value.replace(/[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]*)[\]])*[\]])*[\]])*[\]])*[\]]/g, "[...]");
					
					break;
					
				default:
				
					// Replace strings by dummies
					value = value.replace(/"([^"\\]|\\[^"\\]|\\\\|\\")*"/g,'"..."')
								 .replace(/'([^'\\]|\\[^'\\]|\\\\|\\')*'/g,'"..."');
					
					// Remove (...)
					if (value.indexOf("(") != -1) {
						value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "");
					}
					
			}
			
			
			// Divide at commas and spaces to separate different values
			value = value.split(/\s*,\s*|\s+/g);
			
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
			for(var value of values) {
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
			for(var generalizedSelectorData of generalizedSelectorsData) {
				generalizedSelectorData.count++
			}
			
			// avoid most common browser lies
			var cssText = ' '+style.cssText.toLowerCase(); 
			if(browserIsEdge) {
				cssText = cssText.replace(/border: medium; border-image: none;/,'border: none;');
				cssText = cssText.replace(/ border-image: none;/,' ');
			}
			
			// For each property declaration in this rule, we collect some stats
			for (var i = style.length; i--;) {

				var key = style[i], rootKeyIndex=key.indexOf('-'), rootKey = rootKeyIndex==-1 ? key : key.substr(0,rootKeyIndex);
				var normalizedKey = rootKeyIndex==0&&key.indexOf('-',1)==1 ? '--var' : key;
				var styleValue = style.getPropertyValue(key);
				
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
				var values = CSSUsage.CSSValues.createValueArray(styleValue,normalizedKey);
				for(var j=values.length; j--;) {
					values[j] = CSSUsage.CSSValues.parseValues(values[j],normalizedKey)
				}
				
				// log the property usage per selector
				for(var generalizedSelectorData of generalizedSelectorsData) {
					
					// get the datastore for current property
					var propStats = generalizedSelectorData.props[normalizedKey] || (generalizedSelectorData.props[normalizedKey] = {count:0,values:Object.create(null)});

					// we saw the property one time
					propStats.count++;
					
					// we also saw a bunch of values
					for(var value of values) {
												
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
					for(var element of matchedElements) {
						
						// check what the elements already contributed for this property
						var cssUsageMeta = element.CSSUsage || (element.CSSUsage=Object.create(null));
						var knownValues = cssUsageMeta[normalizedKey] || (cssUsageMeta[normalizedKey] = []);
						
						// increment the amount of affected elements which we didn't count yet
						if(knownValues.length == 0) { propObject.count += 1; }

						// add newly found values too
						for(var value of values) {
							
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
					CSSUsageResults.props["animation-name"].values = {"iden":CSSUsageResults.props["animation-name"].count};
				}
				
				// anonymize identifiers used for animation-name per selector
				for(var selector in CSSUsageResults.rules) { 
					var rule = CSSUsageResults.rules[selector];
					if(rule && rule.props && rule.props["animation-name"]) {
						rule.props["animation-name"].values = {"iden":rule.props["animation-name"].count};
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
				value = value.replace(/[(]([^()]+|[(]([^()]+)[)])+[)]/g, "");
			}
			
			// Simplify [att]
			if (value.indexOf("[") != -1) {
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
				for(var wrongPair of SORT_REGEXPS) {
					value = value.replace(wrongPair,'$2$1');
				}
				
			} while(oldValue != value); return value;

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
			var instances = selector.match(feature)||[];
			for(var instance of instances) {
				instance = instance.substr(1);
				counters[instance] = (counters[instance]|0) + 1;
			}
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
				var elementClasses = element.classList;
				for(var c of elementClasses) {
					domClasses[c] = (domClasses[c]|0) + 1;
				}
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
			var cssUniqueLonelyClassGatesUsedArray = _(cssUniqueLonelyClassGatesArray).filter((c) => domClasses[c]).value();
			var cssUniqueLonelyClassGatesUsedWorthArray = _(cssUniqueLonelyClassGatesUsedArray).filter((c)=>(cssLonelyClassGates[c]>9)).value();
			if(window.debugCSSUsage) console.log(cssLonelyClassGates);
			if(window.debugCSSUsage) console.log(cssUniqueLonelyClassGatesUsedWorthArray);

			// get arrays of the #id gates used ({"hover":5} => ["hover"]), filter irrelevant entries
			var cssUniqueLonelyIdGatesArray = Object.keys(cssLonelyIdGates);
			var cssUniqueLonelyIdGatesUsedArray = _(cssUniqueLonelyIdGatesArray).filter((c) => domIds[c]).value();
			var cssUniqueLonelyIdGatesUsedWorthArray = _(cssUniqueLonelyIdGatesUsedArray).filter((c)=>(cssLonelyIdGates[c]>9)).value();
			if(window.debugCSSUsage) console.log(cssLonelyIdGates);
			if(window.debugCSSUsage) console.log(cssUniqueLonelyIdGatesUsedWorthArray);
			
			//
			// report how many times the classes in the following arrays have been used in the dom
			// (general stats)
			//
			
			/** count how many times the usual clearfix classes are used */
			var detectedClearfixUsages = function(domClasses) {
				
				var trackedClasses = [
					'clearfix','clear',
				];
				
				return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
				
			};
			
			/** count how many times the usual hide/show classes are used */
			var detectedVisibilityUsages = function(domClasses) {
				
				var trackedClasses = [
					'show', 'hide', 'visible', 'hidden', 
				];
				
				return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
				
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
				
				return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
				
			};
			
			var detectedBootstrapFormUsages = function(domClasses) {
				
				var trackedClasses = [
					'form-group', 'form-group-xs', 'form-group-sm', 'form-group-md', 'form-group-lg',
					'form-control', 'form-horizontal', 'form-inline',
					'btn','btn-primary','btn-secondary','btn-success','btn-warning','btn-danger','btn-error'
				];
				
				return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
				
			};
			
			var detectedBootstrapAlertUsages = function(domClasses) {
				
				var trackedClasses = [
					'alert','alert-primary','alert-secondary','alert-success','alert-warning','alert-danger','alert-error'
				];
				
				return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
				
			};
			
			var detectedBootstrapFloatUsages = function(domClasses) {
				
				var trackedClasses = [
					'pull-left','pull-right',
				];
				
				return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
				
			};
			
			//
			// report how many times the classes in the following arrays have been used as css gate
			// (modernizer stats)
			//
			
			// https://modernizr.com/docs#features
			var detectedModernizerUsages = function(cssLonelyClassGates) {
				
				var ModernizerUsages = {count:0,values:{/*  "js":1,  "no-js":2  */}};
				var trackedClasses = ["js","ambientlight","applicationcache","audio","batteryapi","blobconstructor","canvas","canvastext","contenteditable","contextmenu","cookies","cors","cryptography","customprotocolhandler","customevent","dart","dataview","emoji","eventlistener","exiforientation","flash","fullscreen","gamepads","geolocation","hashchange","hiddenscroll","history","htmlimports","ie8compat","indexeddb","indexeddbblob","input","search","inputtypes","intl","json","olreversed","mathml","notification","pagevisibility","performance","pointerevents","pointerlock","postmessage","proximity","queryselector","quotamanagement","requestanimationframe","serviceworker","svg","templatestrings","touchevents","typedarrays","unicoderange","unicode","userdata","vibrate","video","vml","webintents","animation","webgl","websockets","xdomainrequest","adownload","audioloop","audiopreload","webaudio","lowbattery","canvasblending","todataurljpeg,todataurlpng,todataurlwebp","canvaswinding","getrandomvalues","cssall","cssanimations","appearance","backdropfilter","backgroundblendmode","backgroundcliptext","bgpositionshorthand","bgpositionxy","bgrepeatspace,bgrepeatround","backgroundsize","bgsizecover","borderimage","borderradius","boxshadow","boxsizing","csscalc","checked","csschunit","csscolumns","cubicbezierrange","display-runin","displaytable","ellipsis","cssescape","cssexunit","cssfilters","flexbox","flexboxlegacy","flexboxtweener","flexwrap","fontface","generatedcontent","cssgradients","hsla","csshyphens,softhyphens,softhyphensfind","cssinvalid","lastchild","cssmask","mediaqueries","multiplebgs","nthchild","objectfit","opacity","overflowscrolling","csspointerevents","csspositionsticky","csspseudoanimations","csspseudotransitions","cssreflections","regions","cssremunit","cssresize","rgba","cssscrollbar","shapes","siblinggeneral","subpixelfont","supports","target","textalignlast","textshadow","csstransforms","csstransforms3d","preserve3d","csstransitions","userselect","cssvalid","cssvhunit","cssvmaxunit","cssvminunit","cssvwunit","willchange","wrapflow","classlist","createelementattrs,createelement-attrs","dataset","documentfragment","hidden","microdata","mutationobserver","bdi","datalistelem","details","outputelem","picture","progressbar,meter","ruby","template","time","texttrackapi,track","unknownelements","es5array","es5date","es5function","es5object","es5","strictmode","es5string","es5syntax","es5undefined","es6array","contains","generators","es6math","es6number","es6object","promises","es6string","devicemotion,deviceorientation","oninput","filereader","filesystem","capture","fileinput","directory","formattribute","localizednumber","placeholder","requestautocomplete","formvalidation","sandbox","seamless","srcdoc","apng","jpeg2000","jpegxr","sizes","srcset","webpalpha","webpanimation","webplossless,webp-lossless","webp","inputformaction","inputformenctype","inputformmethod","inputformtarget","beacon","lowbandwidth","eventsource","fetch","xhrresponsetypearraybuffer","xhrresponsetypeblob","xhrresponsetypedocument","xhrresponsetypejson","xhrresponsetypetext","xhrresponsetype","xhr2","scriptasync","scriptdefer","speechrecognition","speechsynthesis","localstorage","sessionstorage","websqldatabase","stylescoped","svgasimg","svgclippaths","svgfilters","svgforeignobject","inlinesvg","smil","textareamaxlength","bloburls","datauri","urlparser","videoautoplay","videoloop","videopreload","webglextensions","datachannel","getusermedia","peerconnection","websocketsbinary","atob-btoa","framed","matchmedia","blobworkers","dataworkers","sharedworkers","transferables","webworkers"];
				for(var c of trackedClasses) { countInstancesOfTheClass(c); countInstancesOfTheClass('no-'+c); }
				return ModernizerUsages;
				
				function countInstancesOfTheClass(c) {
					var count = cssLonelyClassGates[c]; if(!count) return; 
					ModernizerUsages.count += count; 
					ModernizerUsages.values[c]=count; 
				}
				
			}
			
			//
			// try to detect other popular frameworks
			//
			
			// https://github.com/Dogfalo/materialize/blob/master/sass/components/_grid.scss
			var hasDogfaloMaterializeUsage = function() {
				
				if(!document.querySelector(".container > .row > .col")) {
					return false;
				}
				
				for(var i = 12+1; --i;) {
					for(var s of ['s','m','l']) {
						if(document.querySelector(".container > .row > .col."+s+""+i)) {
							return true;
						}
					}
				}
				return false;
				
			}
			
			// http://blueprintcss.org/tests/parts/grid.html
			var hasBluePrintUsage = function() {
				
				if(!document.querySelector(".container")) {
					return false;
				}
				
				for(var i = 24+1; --i;) {
					if(document.querySelector(".container > .span-"+i)) {
						return true;
					}
				}
				return false;
				
			}
			
			// https://raw.githubusercontent.com/csswizardry/inuit.css/master/generic/_widths.scss
			var hasInuitUsage = function() {
				
				if(!document.querySelector(".grid .grid__item")) {
					return false;
				}
				
				for(var fraction of ["one-whole","one-half","one-third","two-thirds","one-quarter","two-quarters","one-half","three-quarters","one-fifth","two-fifths","three-fifths","four-fifths","one-sixth","two-sixths","one-third","three-sixths","one-half","four-sixths","two-thirds","five-sixths","one-eighth","two-eighths","one-quarter","three-eighths","four-eighths","one-half","five-eighths","six-eighths","three-quarters","seven-eighths","one-tenth","two-tenths","one-fifth","three-tenths","four-tenths","two-fifths","five-tenths","one-half","six-tenths","three-fifths","seven-tenths","eight-tenths","four-fifths","nine-tenths","one-twelfth","two-twelfths","one-sixth","three-twelfths","one-quarter","four-twelfths","one-third","five-twelfths","six-twelfths","one-half","seven-twelfths","eight-twelfths","two-thirds","nine-twelfths","three-quarters","ten-twelfths","five-sixths","eleven-twelfths"]) {
					for(var ns of ["","palm-","lap-","portable-","desk-"]) {
						if(document.querySelector(".grid > .grid__item."+ns+fraction)) {
							return true;
						}
					}
				}
				return false;
				
			}
			
			// http://www.gumbyframework.com/docs/grid/#!/basic-grid
			var hasGrumbyUsage = function() {
				
				if(!document.querySelector(".row .columns")) {
					return false;
				}
				
				for(var fraction of ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve"]) {
					if(document.querySelector(".row > .columns."+fraction)) {
						return true;
					}
				}
				return false;
				
			}

			//
			//
			//
			var results = {
				
				// how many crawls are aggregated in this file (one of course in this case)
				SuccessfulCrawls: 1,
				
				// how many elements on the page (used to compute percentages for css.props)
				DOMElements: document.all.length,
				
				// how many selectors vs inline style, and other usage stats
				SelectorsFound: CSSUsage.StyleWalker.amountOfSelectors,
				InlineStylesFound: CSSUsage.StyleWalker.amountOfInlineStyles,
				SelectorsUnused: CSSUsage.StyleWalker.amountOfSelectorsUnused,
				
				// ids stats
				IdsUsed: domIdsArray.length,
				IdsRecognized: Object.keys(cssIds).length,
				IdsUsedRecognized: filter(domIdsArray, i => cssIds[i]).length,
				
				// classes stats
				ClassesUsed: domClassesArray.length,
				ClassesRecognized: Object.keys(cssClasses).length,
				ClassesUsedRecognized: filter(domClassesArray, c => cssClasses[c]).length,
				
				// non-framework usage stats (see before)
				NFwkClearfixUsage: detectedClearfixUsages(domClasses),
				NFwkVisibilityUsage: detectedVisibilityUsages(domClasses),
				
				NFwkClearfixRecognized: detectedClearfixUsages(cssClasses),
				NFwkVisibilityRecognized: detectedVisibilityUsages(cssClasses),
				
				// framework usage stats (see before)
				FwkModernizer: !!window.Modernizer,
				FwkModernizerDOMUsages: detectedModernizerUsages(domClasses),
				FwkModernizerCSSUsages: detectedModernizerUsages(cssLonelyClassGates),
			   
				FwkBootstrap: !!((window.jQuery||window.$) && (window.jQuery||window.$).fn && (window.jQuery||window.$).fn.modal)|0,
				
				FwkBootstrapGridUsage: detectedBootstrapGridUsages(domClasses),
				FwkBootstrapFormUsage: detectedBootstrapFormUsages(domClasses),
				FwkBootstrapFloatUsage: detectedBootstrapFloatUsages(domClasses),
				FwkBootstrapAlertUsage: detectedBootstrapAlertUsages(domClasses),
				
				FwkBootstrapGridRecognized: detectedBootstrapGridUsages(cssClasses),
				FwkBootstrapFormRecognized: detectedBootstrapFormUsages(cssClasses),
				FwkBootstrapFloatRecognized: detectedBootstrapFloatUsages(cssClasses),
				FwkBootstrapAlertRecognized: detectedBootstrapAlertUsages(cssClasses),
				
				FwkDogfaloMaterialize: hasDogfaloMaterializeUsage()|0,
				FwkBluePrint: hasBluePrintUsage()|0,
				FwkInuit: hasInuitUsage()|0,
				FwkGrumby: hasGrumbyUsage()|0,
				
			};
			
			CSSUsageResults.usages = results;
			if(window.debugCSSUsage) console.log(CSSUsageResults.usages);
			
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
			
			// Uncomment if you want to set breakpoints when running in the console
			//debugger;
			
			// Prevent this code from running multiple times
			var firstTime = !onready.hasAlreadyRun; onready.hasAlreadyRun = true;
			if(!firstTime) { return; /* for now... */ }
			
			// Prevent this code from running when the page has no stylesheet (probably a redirect page)
			if(document.styleSheets.length == 0) { return; }

			// Keep track of duration
			var startTime = performance.now();

			// register tools
			CSSUsage.StyleWalker.ruleAnalyzers.push(CSSUsage.PropertyValuesAnalyzer);
			CSSUsage.StyleWalker.ruleAnalyzers.push(CSSUsage.SelectorAnalyzer);
			CSSUsage.StyleWalker.elementAnalyzers.push(CSSUsage.DOMClassAnalyzer);

			// perform analysis
			CSSUsage.StyleWalker.walkOverDomElements();
			CSSUsage.StyleWalker.walkOverCssStyles();
			CSSUsage.PropertyValuesAnalyzer.finalize();
			CSSUsage.SelectorAnalyzer.finalize();

			// Update duration
			CSSUsageResults.duration = (performance.now() - startTime)|0;

			// DO SOMETHING WITH THE CSS OBJECT HERE
			if(window.debugCSSUsage) console.log(CSSUsageResults);
			if(window.onCSSUsageResults) {
				window.onCSSUsageResults(CSSUsageResults);
			};
			
		}


	}();
	
} catch (ex) { /* do something maybe */ throw ex; } }();