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