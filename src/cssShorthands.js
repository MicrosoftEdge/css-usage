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

