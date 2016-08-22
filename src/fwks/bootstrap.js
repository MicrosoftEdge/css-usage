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