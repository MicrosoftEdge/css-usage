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