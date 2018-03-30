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
		for(var s = 0; s <= source.length; s++) {
			var value = source[s];
			if(shouldValueBeIncluded(value)) {
				clone[i++] = value
			}
		}
		clone.length = i;
		return clone;
	}
	
	function reduce(source, computeReduction, reduction) {
		for(var s = 0; s <= source.length; s++) {
			var value = source[s];
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
		for(var sh = 0; sh <= shorthands.length; sh++) {
            var shorthand = shorthands[sh];
			if(this.expand(shorthand).indexOf(prefixFreeProperty) >= 0) {
				result.push(prefix+shorthand);
				result.push.apply(result,this.unexpand(prefix+shorthand));
			}
		}
		
		return unexpandCache[property] = result;
		
	}
	
}.call(window.CSSShorthands={});


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
//
// report how many times the classes in the following arrays have been used in the dom
// (bootstrap stats)
//

var detectedBootstrapGridUsages = function(domClasses) {
    var _ = window.CSSUsageLodash;
	var reduce = _.reduce.bind(_);
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
    var _ = window.CSSUsageLodash;
	var reduce = _.reduce.bind(_);
    var trackedClasses = [
        'form-group', 'form-group-xs', 'form-group-sm', 'form-group-md', 'form-group-lg',
        'form-control', 'form-horizontal', 'form-inline',
        'btn','btn-primary','btn-secondary','btn-success','btn-warning','btn-danger','btn-error'
    ];
    
    return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
    
};

var detectedBootstrapAlertUsages = function(domClasses) {
    var _ = window.CSSUsageLodash;
	var reduce = _.reduce.bind(_);
    var trackedClasses = [
        'alert','alert-primary','alert-secondary','alert-success','alert-warning','alert-danger','alert-error'
    ];
    
    return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
    
};

var detectedBootstrapFloatUsages = function(domClasses) {
    var _ = window.CSSUsageLodash;
	var reduce = _.reduce.bind(_);
    var trackedClasses = [
        'pull-left','pull-right',
    ];
    
    return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
    
};
// https://github.com/Dogfalo/materialize/blob/master/sass/components/_grid.scss
var hasDogfaloMaterializeUsage = function() {
    
    if(!document.querySelector(".container > .row > .col")) {
        return false;
    }
    
    for(var i = 12+1; --i;) {
        var classesToLookUp = ['s','m','l'];
        for(var d = 0; d < classesToLookUp.length; d++) {
            var s = classesToLookUp[d];
            if(document.querySelector(".container > .row > .col."+s+""+i)) {
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
    
    var classesToLookUp = ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve"];
    for(var cl = 0; cl < classesToLookUp.length; cl++ ) {
        var fraction = classesToLookUp[cl];
        if(document.querySelector(".row > .columns."+fraction)) {
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
    
    var classesToLookUp = ["one-whole","one-half","one-third","two-thirds","one-quarter","two-quarters","one-half","three-quarters","one-fifth","two-fifths","three-fifths","four-fifths","one-sixth","two-sixths","one-third","three-sixths","one-half","four-sixths","two-thirds","five-sixths","one-eighth","two-eighths","one-quarter","three-eighths","four-eighths","one-half","five-eighths","six-eighths","three-quarters","seven-eighths","one-tenth","two-tenths","one-fifth","three-tenths","four-tenths","two-fifths","five-tenths","one-half","six-tenths","three-fifths","seven-tenths","eight-tenths","four-fifths","nine-tenths","one-twelfth","two-twelfths","one-sixth","three-twelfths","one-quarter","four-twelfths","one-third","five-twelfths","six-twelfths","one-half","seven-twelfths","eight-twelfths","two-thirds","nine-twelfths","three-quarters","ten-twelfths","five-sixths","eleven-twelfths"];

    for(var cu = 0; cu < classesToLookUp.length; cu++ ) {
        var fraction = classesToLookUp[cu];

        var subClassesToLookUp = ["","palm-","lap-","portable-","desk-"];
        for(var sc = 0; sc < subClassesToLookUp.length; sc++) {
            var ns = subClassesToLookUp[sc];
            if(document.querySelector(".grid > .grid__item."+ns+fraction)) {
                return true;
            }
        }
    }
    return false;
    
}
var getLonelyGatesUsage = function (cssLonelyClassGates, domClasses, domIds, cssLonelyIdGates) {

    var _ = window.CSSUsageLodash;

    if((cssLonelyClassGates || domClasses || domIds || cssLonelyIdGates) == undefined) return;
    
    // get arrays of the .class gates used ({"hover":5} => ["hover"]), filter irrelevant entries
    var cssUniqueLonelyClassGatesArray = Object.keys(cssLonelyClassGates);
    var cssUniqueLonelyClassGatesUsedArray = _(cssUniqueLonelyClassGatesArray).filter((c) => domClasses[c]).value();
    var cssUniqueLonelyClassGatesUsedWorthArray = _(cssUniqueLonelyClassGatesUsedArray).filter((c)=>(cssLonelyClassGates[c]>9)).value();
    if(window.debugCSSUsage) if(window.debugCSSUsage) console.log(cssLonelyClassGates);
    if(window.debugCSSUsage) if(window.debugCSSUsage) console.log(cssUniqueLonelyClassGatesUsedWorthArray);

    // get arrays of the #id gates used ({"hover":5} => ["hover"]), filter irrelevant entries
    var cssUniqueLonelyIdGatesArray = Object.keys(cssLonelyIdGates);
    var cssUniqueLonelyIdGatesUsedArray = _(cssUniqueLonelyIdGatesArray).filter((c) => domIds[c]).value();
    var cssUniqueLonelyIdGatesUsedWorthArray = _(cssUniqueLonelyIdGatesUsedArray).filter((c)=>(cssLonelyIdGates[c]>9)).value();
    if(window.debugCSSUsage) if(window.debugCSSUsage) console.log(cssLonelyIdGates);
    if(window.debugCSSUsage) if(window.debugCSSUsage) console.log(cssUniqueLonelyIdGatesUsedWorthArray);
}
//
// report how many times the classes in the following arrays have been used as css gate
// (modernizer stats)
//

// https://modernizr.com/docs#features
var detectedModernizerUsages = function(cssLonelyClassGates) {

    if((cssLonelyClassGates) == undefined) return;
    
    var ModernizerUsages = {count:0,values:{/*  "js":1,  "no-js":2  */}};
    var trackedClasses = ["js","ambientlight","applicationcache","audio","batteryapi","blobconstructor","canvas","canvastext","contenteditable","contextmenu","cookies","cors","cryptography","customprotocolhandler","customevent","dart","dataview","emoji","eventlistener","exiforientation","flash","fullscreen","gamepads","geolocation","hashchange","hiddenscroll","history","htmlimports","ie8compat","indexeddb","indexeddbblob","input","search","inputtypes","intl","json","olreversed","mathml","notification","pagevisibility","performance","pointerevents","pointerlock","postmessage","proximity","queryselector","quotamanagement","requestanimationframe","serviceworker","svg","templatestrings","touchevents","typedarrays","unicoderange","unicode","userdata","vibrate","video","vml","webintents","animation","webgl","websockets","xdomainrequest","adownload","audioloop","audiopreload","webaudio","lowbattery","canvasblending","todataurljpeg,todataurlpng,todataurlwebp","canvaswinding","getrandomvalues","cssall","cssanimations","appearance","backdropfilter","backgroundblendmode","backgroundcliptext","bgpositionshorthand","bgpositionxy","bgrepeatspace,bgrepeatround","backgroundsize","bgsizecover","borderimage","borderradius","boxshadow","boxsizing","csscalc","checked","csschunit","csscolumns","cubicbezierrange","display-runin","displaytable","ellipsis","cssescape","cssexunit","cssfilters","flexbox","flexboxlegacy","flexboxtweener","flexwrap","fontface","generatedcontent","cssgradients","hsla","csshyphens,softhyphens,softhyphensfind","cssinvalid","lastchild","cssmask","mediaqueries","multiplebgs","nthchild","objectfit","opacity","overflowscrolling","csspointerevents","csspositionsticky","csspseudoanimations","csspseudotransitions","cssreflections","regions","cssremunit","cssresize","rgba","cssscrollbar","shapes","siblinggeneral","subpixelfont","supports","target","textalignlast","textshadow","csstransforms","csstransforms3d","preserve3d","csstransitions","userselect","cssvalid","cssvhunit","cssvmaxunit","cssvminunit","cssvwunit","willchange","wrapflow","classlist","createelementattrs,createelement-attrs","dataset","documentfragment","hidden","microdata","mutationobserver","bdi","datalistelem","details","outputelem","picture","progressbar,meter","ruby","template","time","texttrackapi,track","unknownelements","es5array","es5date","es5function","es5object","es5","strictmode","es5string","es5syntax","es5undefined","es6array","contains","generators","es6math","es6number","es6object","promises","es6string","devicemotion,deviceorientation","oninput","filereader","filesystem","capture","fileinput","directory","formattribute","localizednumber","placeholder","requestautocomplete","formvalidation","sandbox","seamless","srcdoc","apng","jpeg2000","jpegxr","sizes","srcset","webpalpha","webpanimation","webplossless,webp-lossless","webp","inputformaction","inputformenctype","inputformmethod","inputformtarget","beacon","lowbandwidth","eventsource","fetch","xhrresponsetypearraybuffer","xhrresponsetypeblob","xhrresponsetypedocument","xhrresponsetypejson","xhrresponsetypetext","xhrresponsetype","xhr2","scriptasync","scriptdefer","speechrecognition","speechsynthesis","localstorage","sessionstorage","websqldatabase","stylescoped","svgasimg","svgclippaths","svgfilters","svgforeignobject","inlinesvg","smil","textareamaxlength","bloburls","datauri","urlparser","videoautoplay","videoloop","videopreload","webglextensions","datachannel","getusermedia","peerconnection","websocketsbinary","atob-btoa","framed","matchmedia","blobworkers","dataworkers","sharedworkers","transferables","webworkers"];
    for(var tc = 0; tc < trackedClasses.length; tc++) {
        var c = trackedClasses[tc];
        countInstancesOfTheClass(c); 
        countInstancesOfTheClass('no-'+c);
    }
    return ModernizerUsages;
    
    function countInstancesOfTheClass(c) {
        var count = cssLonelyClassGates[c]; if(!count) return; 
        ModernizerUsages.count += count; 
        ModernizerUsages.values[c]=count; 
    }
    
}
function getFwkUsage(results, cssLonelyClassGates, domClasses, domIds, cssLonelyIdGates, cssClasses) {

    // Modernizer
    getLonelyGatesUsage(cssLonelyClassGates, domClasses, domIds, cssLonelyIdGates);
    detectedModernizerUsages(cssLonelyClassGates);
    results.FwkModernizer = !!window.Modernizer;
    results.FwkModernizerDOMUsages = detectedModernizerUsages(domClasses);
	results.FwkModernizerCSSUsages = detectedModernizerUsages(cssLonelyClassGates);

    // Bootstrap
    results.FwkBootstrap = !!((window.jQuery||window.$) && (window.jQuery||window.$).fn && (window.jQuery||window.$).fn.modal)|0;
    results.FwkBootstrapGridUsage = detectedBootstrapGridUsages(domClasses);
    results.FwkBootstrapFormUsage = detectedBootstrapFormUsages(domClasses);
    results.FwkBootstrapFloatUsage = detectedBootstrapFloatUsages(domClasses);
    results.FwkBootstrapAlertUsage = detectedBootstrapAlertUsages(domClasses);    
    results.FwkBootstrapGridRecognized = detectedBootstrapGridUsages(cssClasses);
    results.FwkBootstrapFormRecognized = detectedBootstrapFormUsages(cssClasses);
    results.FwkBootstrapFloatRecognized = detectedBootstrapFloatUsages(cssClasses);
    results.FwkBootstrapAlertRecognized = detectedBootstrapAlertUsages(cssClasses);

    // Grumby
    results.FwkGrumby = hasGrumbyUsage()|0;

    // Inuit
    results.FwkInuit = hasInuitUsage()|0;

    // Blueprint
    results.FwkBluePrint = hasBluePrintUsage()|0;

    // Dog Falo
    results.FwkDogfaloMaterialize = hasDogfaloMaterializeUsage()|0;

    return results;
}
//
// report how many times the classes in the following arrays have been used in the dom
// (general stats)
//

/** count how many times the usual clearfix classes are used */
var detectedClearfixUsages = function(domClasses) {

    var _ = window.CSSUsageLodash;
	var reduce = _.reduce.bind(_);
    
    var trackedClasses = [
        'clearfix','clear',
    ];
    
    return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
    
};

/** count how many times the usual hide/show classes are used */
var detectedVisibilityUsages = function(domClasses) {
    var _ = window.CSSUsageLodash;
	var reduce = _.reduce.bind(_);
    
    var trackedClasses = [
        'show', 'hide', 'visible', 'hidden', 
    ];
    
    return reduce(trackedClasses, (a,b) => a+(domClasses[b]|0), 0);
    
};
function getPatternUsage(results, domClasses, cssClasses) {
    results.PatClearfixUsage = detectedClearfixUsages(domClasses);
	results.PatVisibilityUsage = detectedVisibilityUsages(domClasses);
    results.PatClearfixRecognized = detectedClearfixUsages(cssClasses);
    results.PatVisibilityRecognized = detectedVisibilityUsages(cssClasses);

    return results;
}
void function() {

    window.HtmlUsage = {};

    // This function has been added to the elementAnalyzers in
    // CSSUsage.js under onready()
    // <param name="element"> is an HTMLElement passed in by elementAnalyzers
    window.HtmlUsage.GetNodeName = function (element) {

        // If the browser doesn't recognize the element - throw it away
        if(element instanceof HTMLUnknownElement) {
            return;
        }

        var node = element.nodeName;

        var tags = HtmlUsageResults.tags || (HtmlUsageResults.tags = {});
        var tag = tags[node] || (tags[node] = 0);
        tags[node]++;

        GetAttributes(element, node);
    }

    function GetAttributes(element, node) {
        for(var i = 0; i < element.attributes.length; i++) {
            var att = element.attributes[i];

            if(IsValidAttribute(element, att.nodeName)) {
                var attributes = HtmlUsageResults.attributes || (HtmlUsageResults.attributes = {});
                var attribute = attributes[att.nodeName] || (attributes[att.nodeName] = {});
                var attributeTag = attribute[node] || (attribute[node] = {count: 0});             
                attributeTag.count++;
            }
        }
    }

    function IsValidAttribute(element, attname) {
        // We need to convert className
        if(attname == "class") {
            attname = "className";
        } 

        if(attname == "classname") {
            return false;
        }

        // Only keep attributes that are not data
        if(attname.indexOf('data-') != -1) {
            return false;
        }

        if(typeof(element[attname]) == "undefined") {
            return false;
        }

        return true;
    }
}();
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

			atrules: {}/*
			atrules ~= {
				"@atrule:4": {
					count: 3,
					props: {
						"background-color": 1,
						"color": 4,
						"opacity": 3,
						"transform": 3
					},
					nested: {
						"h3": 1
					},
					conditions: {
						"screen": 1
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

			// Some CssRules have style we can analyze
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

			// run analysis on at rules to populate CSSUsageResults.atrules
			if(isRuleAnAtRule(rule)) {
				if(rule.conditionText) {
					processConditionalAtRules(rule);
				} else {
					processGeneralAtRules(rule);
				} 
			}
		}


		/**
		 * Checks whether an rule is an @atrule.
		 */
		function isRuleAnAtRule(rule) {
			/**
			 *  @atrules types ~= {
						"charset": 0,  //2
						"import":0,    //3
						"media":0,     //4
						"font-face":0, //5
						"page":0,      //6
						"keyframes":0, //7 This is the @keyframe at rule
						"keyframe":0,  //8 This is the individual 0%, or from/to

						"namespace":0, //10
						"supports":0,  //12
						"viewport":0,  //15
			 */
			let type = rule.type;
			return (type >= 2 && type <= 8) || (type == 10) || (type == 12) || (type == 15);
		}


		/**
		 * This process @atrules with conditional statements such as @supports.
		 * [1] It will process any props and values used within the body of the rule.
		 * [2] It will count the occurence of usage of nested atrules.
		 * [3] It will process condition statements to conform to a standardized version. 
		 */
		function processConditionalAtRules(rule) {
			var selectorText = '@atrule:' + rule.type;
			var atrulesUsage = CSSUsageResults.atrules;

			if(!atrulesUsage[selectorText]) {
				atrulesUsage[selectorText] = Object.create(null);
				atrulesUsage[selectorText] = {"count": 1, 
											  "props": {},
											  "conditions": {}} 
			} else {
				var count = atrulesUsage[selectorText].count;
				atrulesUsage[selectorText].count = count + 1;
			}

			var selectedAtruleUsage = atrulesUsage[selectorText];

			if(rule.cssRules) {
				CSSUsage.PropertyValuesAnalyzer.anaylzeStyleOfRulePropCount(rule, selectedAtruleUsage);
			}

			processConditionText(rule.conditionText, selectedAtruleUsage.conditions);
		}

		/**
		 * This processes the usage of conditions of conditional @atrules like @media.
		 * Requires the condition of the rule to process and the current recorded usage 
		 * of the @atrule in question.
		 */
		function processConditionText(conditionText, selectedAtruleConditionalUsage) {
			// replace numeric specific information from condition statements
			conditionText = CSSUsage.CSSValues.parseValues(conditionText);

			if(!selectedAtruleConditionalUsage[conditionText]) {
				selectedAtruleConditionalUsage[conditionText] = Object.create(null);
				selectedAtruleConditionalUsage[conditionText] = {"count": 1}
			} else {
				var count = selectedAtruleConditionalUsage[conditionText].count;
				selectedAtruleConditionalUsage[conditionText].count = count + 1;
			}
		}

		/**
		 * This will process all other @atrules that don't have conditions or styles.
		 * [1] It will process any props and values used within the body of the rule.
		 * [2] It will count the occurence of usage of nested atrules.
		 */
		function processGeneralAtRules(rule) {
			var selectorText = '@atrule:' + rule.type;
			var atrulesUsage = CSSUsageResults.atrules;

			if(!atrulesUsage[selectorText]) {
				atrulesUsage[selectorText] = Object.create(null);
				atrulesUsage[selectorText] = {"count": 1, 
											  "props": {}} 
			} else {
				var count = atrulesUsage[selectorText].count;
				atrulesUsage[selectorText].count = count + 1;
			}

			// @keyframes rule type is 7
			if(rule.type == 7) {
				processKeyframeAtRules(rule);
			} else if(CSSUsageResults.rules[selectorText].props) {
				atrulesUsage[selectorText].props = CSSUsageResults.rules[selectorText].props;
				delete atrulesUsage[selectorText].props.values;
			}
		}

		/**
		 * Processes on @keyframe to add the appropriate props from the frame and a counter of which
		 * frames are used throughout the document.
		 */
		function processKeyframeAtRules(rule) {
			var selectorText = '@atrule:' + rule.type;
			var atrulesUsageForSelector = CSSUsageResults.atrules[selectorText];

			if(!atrulesUsageForSelector["keyframes"]) {
				atrulesUsageForSelector["keyframes"] = Object.create(null);
			}

			/**
			 * grab the props from the individual keyframe props that was already populated 
			 * under CSSUsageResults.rules. Note: @atrule:8 is the individual frames.
			 * WARN: tightly coupled with previous processing of rules.
			 */
			atrulesUsageForSelector.props = CSSUsageResults.rules["@atrule:8"].props;
			delete atrulesUsageForSelector.props.values;

			for(let index in rule.cssRules) {
				let keyframe = rule.cssRules[index];
				var atrulesUsageForKeyframeOfSelector = atrulesUsageForSelector.keyframes;

				if(!keyframe.keyText) {
					continue;
				}

				var frame = keyframe.keyText;

				// replace extra whitespaces
				frame = frame.replace(/\s/g, '');

				if(!atrulesUsageForKeyframeOfSelector[frame]) {
					atrulesUsageForKeyframeOfSelector[frame] = { "count" : 1 };
				} else {
					var keyframeCount = atrulesUsageForKeyframeOfSelector[frame].count;
					atrulesUsageForKeyframeOfSelector[frame].count = keyframeCount + 1;
				}
			}
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
			if (isKeywordColor(value)) { return "<color-keyword>"; }
			value = value.replace(/[#][0-9a-fA-F]+/g, '#xxyyzz');
			
			// Escapce identifiers containing numbers
			var numbers = ['ZERO','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE'];
			value = value.replace(
				/([_a-z][-_a-z]|[_a-df-z])[0-9]+[-_a-z0-9]*/g, 
				s=>numbers.reduce(
					(m,nstr,nint)=>m.replace(RegExp(nint,'g'),nstr),
					s
				)
			);
			
			// Remove any digits eg: 55px -> px, 1.5 -> 0.0, 1 -> 0
			value = value.replace(/(?:[+]|[-]|)(?:(?:[0-9]+)(?:[.][0-9]+|)|(?:[.][0-9]+))(?:[e](?:[+]|[-]|)(?:[0-9]+))?(%|e[a-z]+|[a-df-z][a-z]*)/g, "$1"); 
			value = value.replace(/(?:[+]|[-]|)(?:[0-9]+)(?:[.][0-9]+)(?:[e](?:[+]|[-]|)(?:[0-9]+))?/g, " <float> ");
			value = value.replace(/(?:[+]|[-]|)(?:[.][0-9]+)(?:[e](?:[+]|[-]|)(?:[0-9]+))?/g, " <float> ");
			value = value.replace(/(?:[+]|[-]|)(?:[0-9]+)(?:[e](?:[+]|[-]|)(?:[0-9]+))/g, " <float> ");
			value = value.replace(/(?:[+]|[-]|)(?:[0-9]+)/g, " <int> ");
			
			// Unescapce identifiers containing numbers
			value = numbers.reduce(
				(m,nstr,nint)=>m.replace(RegExp(nstr,'g'),nint),
				value
			)
			
			// Remove quotes
			value = value.replace(/('|‘|’|")/g, "");
			
			//
			switch(propertyName) {
				case 'counter-increment':
				case 'counter-reset':
					
					// Anonymize the user identifier
					value = value.replace(/[-_a-zA-Z0-9]+/g,' <custom-ident> ');
					break;
					
				case 'grid':
				case 'grid-template':
				case 'grid-template-rows':
				case 'grid-template-columns':
				case 'grid-template-areas':
					
					// Anonymize line names
					value = value.replace(/\[[-_a-zA-Z0-9 ]+\]/g,' <line-names> ');
					break;
					
				case '--var':
				
					// Replace (...), {...} and [...]
					value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, " <parentheses-block> ");
					value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, " <parentheses-block> ");
					value = value.replace(/\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]*)\])*\])*\])*\])*\]/g, " <curly-brackets-block> ");
					value = value.replace(/\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]*)\])*\])*\])*\])*\]/g, " <curly-brackets-block> ");
					value = value.replace(/\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]*)\})*\})*\})*\})*\}/g, " <square-brackets-block> ");
					value = value.replace(/\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]*)\})*\})*\})*\})*\}/g, " <square-brackets-block> ");
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
			
			// Remove comments and !important
			value = value.replace(/([/][*](?:.|\r|\n)*[*][/]|[!]important.*)/g,'');
			
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
					value = value.replace(/"([^"\\]|\\[^"\\]|\\\\|\\")*"/g,' <string> ')
					value = value.replace(/'([^'\\]|\\[^'\\]|\\\\|\\')*'/g,' <string> ');
					
					// Replace url(...) functions by dummies
					value = value.replace(/([a-z]?)[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "$1()");
					value = value.replace(/([a-z]?)[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "$1()");
					
					// Remove group contents (...), {...} and [...]
					value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, " <parentheses-block> ");
					value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, " <parentheses-block> ");
					value = value.replace(/[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]*)[}])*[}])*[}])*[}])*[}]/g, " <curly-brackets-block> ");
					value = value.replace(/[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]*)[}])*[}])*[}])*[}])*[}]/g, " <curly-brackets-block> ");
					value = value.replace(/[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]*)[\]])*[\]])*[\]])*[\]])*[\]]/g, " <square-brackets-block> ");
					value = value.replace(/[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]*)[\]])*[\]])*[\]])*[\]])*[\]]/g, " <square-brackets-block> ");
					
					break;
					
				default:
				
					// Replace strings by dummies
					value = value.replace(/"([^"\\]|\\[^"\\]|\\\\|\\")*"/g,' <string> ')
								 .replace(/'([^'\\]|\\[^'\\]|\\\\|\\')*'/g,' <string> ');
					
					// Replace url(...) functions by dummies
					if (value.indexOf("(") != -1) {
						value = value.replace(/([a-z]?)[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "$1() ");
						value = value.replace(/([a-z]?)[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "$1() ");
					}
					
			}
			
			// Collapse whitespace
			value = value.trim().replace(/\s+/g, " ");
			
			// Divide at commas and spaces to separate different values
			value = value.split(/\s*(?:,|[/])\s*|\s+/g);
			
			return value;
		}

		/**
		 * So that we don't end up with a ton of color
		 * values, this will determine if the color is a
		 * keyword color value
		 */
		function isKeywordColor(candidateColor) {
			
			// Keyword colors from the W3C specs
			var isColorKeyword = /^(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|grey|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgreen|lightgray|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lighslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|navyblue|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)$/;
			return isColorKeyword.test(candidateColor);
			
		}

	}();

	//
	// computes various css stats (PropertyValuesAnalyzer)
	//
	void function() {

		CSSUsage.PropertyValuesAnalyzer = analyzeStyleOfRule;
		CSSUsage.PropertyValuesAnalyzer.cleanSelectorText = cleanSelectorText;
		CSSUsage.PropertyValuesAnalyzer.generalizedSelectorsOf = generalizedSelectorsOf;
		CSSUsage.PropertyValuesAnalyzer.finalize = finalize;
		CSSUsage.PropertyValuesAnalyzer.anaylzeStyleOfRulePropCount = anaylzeStyleOfRulePropCount;

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

		function anaylzeStyleOfRulePropCount(rule, selectedAtrulesUsage) {
			for(let index in rule.cssRules) {
				let ruleBody = rule.cssRules[index];
				let style = ruleBody.style;

				// guard for non css objects
				if(!style) {
					continue;
				}

				if(ruleBody.selector) { 
					try {
						var selectorText = CssPropertyValuesAnalyzer.cleanSelectorText(ruleBody.selectorText);
						var matchedElements = [].slice.call(document.querySelectorAll(selectorText));
						
						if (matchedElements.length == 0) {
							continue;
						}
					} catch (ex) {
						console.warn(ex.stack||("Invalid selector: "+selectorText+" -- via "+ruleBody.selectorText));
						continue;
					}
				}	

				let cssText = ' ' + style.cssText.toLowerCase(); 

				for (var i = style.length; i--;) {
					// processes out normalized prop name for style
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

					var propsForSelectedAtrule = selectedAtrulesUsage.props;

					if(!propsForSelectedAtrule[normalizedKey]) {
						propsForSelectedAtrule[normalizedKey] = Object.create(null);
						propsForSelectedAtrule[normalizedKey] = {"count": 1};
					} else {
						var propCount = propsForSelectedAtrule[normalizedKey].count;
						propsForSelectedAtrule[normalizedKey].count = propCount + 1;
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
			deleteDuplicatedAtRules(); // TODO: issue #52

			if(window.debugCSSUsage) if(window.debugCSSUsage) console.log(CSSUsageResults.usages);
		}

		/**
		 * Removes duplicated at rules data that was generated under CSSUsageResults.rules
		 * TODO: should not be using such a function, refer to issue #52
		 */
		function deleteDuplicatedAtRules() {
			var cssUsageRules = CSSUsageResults.rules;
			var keys = Object.keys(cssUsageRules);

			for(let key of keys) {
				// only remove specific atrules
				if (key.includes("atrule:")) {
					delete cssUsageRules[key];
				}
			}

			delete CSSUsageResults.atrules["@atrule:8"];  // delete duplicated data from atrule:7, keyframe
		}
    }();
	
} catch (ex) { /* do something maybe */ throw ex; } }();

/*
    RECIPE: scriptElemStats
    -------------------------------------------------------------
    Author: thomasmo
    Description: Collect stats for script elements
*/


void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function scriptElemStats( element, results) {
        window._elementCount = window._elementCount || 0;
        window._elementCount++;
        if(element.nodeName.toLowerCase() == "script") {
            results["data"] = results["data"] || [];
            
            var elemData = {
                index :         window._elementCount,
                async :         element.hasAttribute("async")   ? 1 : 0,
                defer :         element.hasAttribute("defer")   ? 1 : 0,
                externalSrc :   element.hasAttribute("src")     ? 1 : 0,
                parentElem :    element.parentNode.nodeName.toLowerCase()
            };
            
            results["data"].push(elemData);
        }

        return results;
    });
}();

/*
void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function scriptElemStats( element, results) {
        if(element.nodeName.toLowerCase() == "script") {
            results["data"] = results["data"] || {
                total : 0,
                async : 0,
                defer : 0,
                externalSrc : 0,
                parentElemHead : 0,
                parentElemBody : 0,
                parentElemOther : 0
            };

            var result = results["data"];
            result.total++;

            if (element.hasAttribute("async")) {
                result.async++;
            }
            if (element.hasAttribute("defer")) {
                result.defer++;
            }
            if (element.hasAttribute("src")) {
                result.externalSrc++;
            }

            parentElemName = element.parentNode.nodeName.toLowerCase();
            if (parentElemName === "head") {
                result.parentElemHead++;
            } else if (parentElemName === "body") {
                result.parentElemBody++;
            } else {
                result.parentElemOther++;
            }
        }

        return results;
    });
}();
*/
//
// This file is only here to create the TSV
// necessary to collect the data from the crawler
//
void function() {
	
	/*	String hash function
	/*	credits goes to http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash- */
	const hashCodeOf = (str) => {
		var hash = 5381; var char = 0;
		for (var i = 0; i < str.length; i++) {
			char = str.charCodeAt(i);
			hash = ((hash << 5) + hash) + char;
		}
		return hash;
	}
	
	var ua = navigator.userAgent;
	var uaName = ua.indexOf('Edge')>=0 ? 'EDGE' :ua.indexOf('Chrome')>=0 ? 'CHROME' : 'FIREFOX';
	window.INSTRUMENTATION_RESULTS = {
		UA: uaName,
		UASTRING: ua,
		UASTRING_HASH: hashCodeOf(ua),
		URL: location.href,
		TIMESTAMP: Date.now(),
		css: {/*  see CSSUsageResults  */},
		html: {/* see HtmlUsageResults */},
		dom: {},
		scripts: {/* "bootstrap.js": 1 */},
	};
	window.INSTRUMENTATION_RESULTS_TSV = [];
	
	/* make the script work in the context of a webview */
	try {
		var console = window.console || (window.console={log:function(){},warn:function(){},error:function(){}});
		console.unsafeLog = console.log;
		console.log = function() {
			try {
				this.unsafeLog.apply(this,arguments);
			} catch(ex) {
				// ignore
			}
		};
	} catch (ex) {
		// we tried...
	}	
}();

window.onCSSUsageResults = function onCSSUsageResults(CSSUsageResults) {
	// Collect the results (css)
	INSTRUMENTATION_RESULTS.css = CSSUsageResults;
	INSTRUMENTATION_RESULTS.html = HtmlUsageResults;
	INSTRUMENTATION_RESULTS.recipe = RecipeResults;
	
	// Convert it to a more efficient format
	INSTRUMENTATION_RESULTS_TSV = convertToTSV(INSTRUMENTATION_RESULTS);
	
	// Remove tabs and new lines from the data
	for(var i = INSTRUMENTATION_RESULTS_TSV.length; i--;) {
		var row = INSTRUMENTATION_RESULTS_TSV[i];
		for(var j = row.length; j--;) {
			row[j] = (''+row[j]).replace(/(\s|\r|\n)+/g, ' ');
		}
	}
	
	// Convert into one signle tsv file
	var tsvString = INSTRUMENTATION_RESULTS_TSV.map((row) => (row.join('\t'))).join('\n');
	appendTSV(tsvString);
	
	// Add it to the document dom
	function appendTSV(content) {
		if(window.debugCSSUsage) console.log("Trying to append");
		var output = document.createElement('script');
		output.id = "css-usage-tsv-results";
		output.textContent = tsvString;
		output.type = 'text/plain';
		document.querySelector('head').appendChild(output);
		var successfulAppend = checkAppend();
	}

	function checkAppend() {
		if(window.debugCSSUsage) if(window.debugCSSUsage) console.log("Checking append");
		var elem = document.getElementById('css-usage-tsv-results');
		if(elem === null) {
			if(window.debugCSSUsage) console.log("Element not appended");
			if(window.debugCSSUsage) console.log("Trying to append again");
			appendTSV();
		}
		else {
			if(window.debugCSSUsage) console.log("Element successfully found");
		}
	}

	/** convert the instrumentation results to a spreadsheet for analysis */
	function convertToTSV(INSTRUMENTATION_RESULTS) {
		if(window.debugCSSUsage) console.log("Converting to TSV");
		
		var VALUE_COLUMN = 4;
		var finishedRows = [];
		var currentRowTemplate = [
			INSTRUMENTATION_RESULTS.UA,
			INSTRUMENTATION_RESULTS.UASTRING_HASH,
			INSTRUMENTATION_RESULTS.URL,
			INSTRUMENTATION_RESULTS.TIMESTAMP,
			0
		];
		
		currentRowTemplate.push('ua');
		convertToTSV({identifier: INSTRUMENTATION_RESULTS.UASTRING});
		currentRowTemplate.pop();
		
		currentRowTemplate.push('css');
		convertToTSV(INSTRUMENTATION_RESULTS['css']);
		currentRowTemplate.pop();
		
		currentRowTemplate.push('dom');
		convertToTSV(INSTRUMENTATION_RESULTS['dom']);
		currentRowTemplate.pop();

		currentRowTemplate.push('html');
		convertToTSV(INSTRUMENTATION_RESULTS['html']);
		currentRowTemplate.pop();

		currentRowTemplate.push('recipe');
		convertToTSV(INSTRUMENTATION_RESULTS['recipe']);
		currentRowTemplate.pop();
		
		var l = finishedRows[0].length;
		finishedRows.sort((a,b) => {
			for(var i = VALUE_COLUMN+1; i<l; i++) {
				if(a[i]<b[i]) return -1;
				if(a[i]>b[i]) return +1;
			}
			return 0;
		});
		
		return finishedRows;
		
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
				/*DATATYPE:   css|dom|html...                     */'',
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
};
//
// Execution scheduler:
// This is where we decide what to run, and when
//
void function() {

    var browserIsEdge = navigator.userAgent.indexOf('Edge')>=0;
	var browserIsFirefox = navigator.userAgent.indexOf('Firefox')>=0;

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

        // Check to see if you're on a Firefox failure page
        if(document.styleSheets.length == 1 && browserIsFirefox) {
            if(document.styleSheets[0].href !== null && document.styleSheets[0].href.indexOf('aboutNetError') != -1) {
                return;
            }
        }

        // Keep track of duration
        var startTime = performance.now();

        // register tools
        CSSUsage.StyleWalker.ruleAnalyzers.push(CSSUsage.PropertyValuesAnalyzer);
        CSSUsage.StyleWalker.ruleAnalyzers.push(CSSUsage.SelectorAnalyzer);
        CSSUsage.StyleWalker.elementAnalyzers.push(CSSUsage.DOMClassAnalyzer);
        CSSUsage.StyleWalker.elementAnalyzers.push(HtmlUsage.GetNodeName);			

        // perform analysis
        CSSUsage.StyleWalker.walkOverDomElements();
        CSSUsage.StyleWalker.walkOverCssStyles();
        CSSUsage.PropertyValuesAnalyzer.finalize();
        CSSUsage.SelectorAnalyzer.finalize();

        // Walk over the dom elements again for Recipes
        CSSUsage.StyleWalker.runRecipes = true;
        CSSUsage.StyleWalker.walkOverDomElements();

        // Update duration
        CSSUsageResults.duration = (performance.now() - startTime)|0;

        // DO SOMETHING WITH THE CSS OBJECT HERE
        window.debugCSSUsage = false;
        if(window.onCSSUsageResults) {
            window.onCSSUsageResults(CSSUsageResults);
        }  
    }
}();