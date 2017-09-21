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

		if (!window.HtmlUsage) throw new Error("APIUsage: missing HtmlUsage dependancy");
		
		// Do not allow buggy trim() to bother usage
		if((''+String.prototype.trim).indexOf("[native code]") == -1) {
			console.warn('Replaced custom trim function with something known to work. Might break website.');
			String.prototype.trim = function() {
				return this.replace(/^\s+|\s+$/g, '');
			}
		}
		
	}();

	//
	// Prepare our global namespace
	//
	void function() {
		if(window.debugCSSUsage) console.log("STAGE: Building up namespace");
		window.HtmlUsageResults = {
			// this will contain all of the HTML tags used on a page
			tags: {}, /*
			tags ~= [nodeName] */

			// this will contain all of the attributes used on an HTML tag
			// and their values if they are in the whitelist
			attributes: {} /*
			attributes ~= {
				name: <string>, // The name of the attribute 
				tag: <string>,  // The tag that the attr was used on
				value: <string> // The value of the attr
			} */
		};

		window.RecipeResults = {};
		window.Recipes = {
			recipes: []
		};

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
						"<color-keyword>": 9,
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

			atrules: {}
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
			for(var i = 0; i < instances.length; i++) {
				var instance = instances[i];
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
				for(var cl = 0; cl < elementClasses.length; cl++) {
					var c = elementClasses[cl];
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
			};

			results = getFwkUsage(results, cssLonelyClassGates, domClasses, domIds, cssLonelyIdGates, cssClasses);
			results = getPatternUsage(results, domClasses, cssClasses);
			
			CSSUsageResults.usages = results;
			console.log(CSSUsageResults);
			if(window.debugCSSUsage) if(window.debugCSSUsage) console.log(CSSUsageResults.usages);
		}
			
    }();


    //
    // playground for at rules anaylsis
    // 
    void function () {
		CSSUsage.Playground = {};
		CSSUsage.Playground.printStyling = test;
		
		function test() {
			printStyling();
		}
    }();
	
} catch (ex) { /* do something maybe */ throw ex; } }();