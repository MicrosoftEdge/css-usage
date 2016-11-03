void function() {

	// import stuff we want to use (before we wrap them, eventually)
	var console = window.console;
	var Object = window.Object;
	var Window = window.Window;
	var Document = window.Document;
	var Function = window.Function;
	var Set = window.Set;
	var Proxy = window.Proxy;
	var WeakMap = window.WeakMap;
	var Symbol = window.Symbol;

	var log = new Set();
	var stp = new WeakMap();
	var pts = Symbol`proxyToSource`;
	var ptsName = Symbol`proxyToSourceName`;
	var ptsOverride = Symbol`proxyToSourceOverride`;
	var isBind = Symbol`isBind`;
	var tsx = Object.prototype.toString;
	var ts = function(o) {
		try { o = o ? (o[pts]||o) : o; } catch(ex) {}
		var s = tsx.call(o);
		var i = '[object '.length;
		return s.substr(i,s.length-i-1);
	};
	var ss = function(o) {
		try { if(typeof(o) == 'symbol') { return `[${o.toString()}]`; } } catch(ex) {}
		try { if(/^[0-9]+$/.test(o)) { return '[int]'; } } catch (ex) {}
		try { return `${o}` } catch (ex) {}
		try { return `[${o.toString()}]`; } catch (ex) {}
		try { if(o.constructor) return '['+o.constructor.name+']'; } catch (ex) {}
		return '[???]';
	}
	
	var isNative = function(f) { return !f[isBind] && /^function[^]*?\([^]*?\)[^]*?\{[^]*?\[native code\][^]*?\}$/m.test(`${f}`) };
	var bind = Function.prototype.bind;
	Function.prototype.bind = function() {
		var shouldSetFlag = isNative(this);
		var result = bind.apply(this, arguments);
		if(!shouldSetFlag) result[isBind] = true;
		return result;
	};
	
	var proxyCode = {
		get(o,k) {
			if(k === pts) { return o; }
			var v = o[k];
			if(k !== ptsName && k !== ptsOverride && k != isBind) {
				try { var name = `${ts(o)}.${ss(k)}`; } catch (ex) {/*debugger;*/};
				try { if(name) log.add(`${name}`) } catch (ex) {/*debugger;*/};
				try { var property = Object.getOwnPropertyDescriptor(o,k); } catch (ex) {/*debugger;*/}
			}
			if(property && (!property.set && !property.writable) && !property.configurable) { /*debugger;*/ wrapPropertiesOf(v,name); return v; }
			return wrapInProxy(v,name);
		},
		set(o,k,v) {
			if(v && v[pts]) { v=v[pts]; }
			if(k !== ptsName && k !== ptsOverride && k != isBind) {
				try { log.add(`${ts(o)}.${ss(k)}=${ts(v)}`) } catch (ex) {/*debugger;*/};
			}
			o[k]=v;
			return true;
		},
		apply(o,t,a) {
			try { var name = `${o[ptsName]||(ts(t||window)+'.'+ss(o.name||'???'))}`; } catch (ex) {/*debugger;*/};
			try { var name = `${name}(${a.map(x=>ts(x)).join(',')})`; } catch (ex) { /*debugger;*/ };
			try { log.add(`${name}`) } catch (ex) {}
			if(isNative(o)) {
				t = t ? (t[pts]||t) : t;
				a=a.map(x => x ? (x[pts]||x) : x);
			}
			var v = o.apply(t,a);
			return wrapInProxy(v,name);
		},
		construct(o,a) {
			try { var name = `new ${o[ptsName]||(ts(t||window)+'.'+ss(o.name||'???'))}`; } catch (ex) {/*debugger;*/};
			try { var name = `${name}(${a.map(x=>ts(x)).join(',')})`; } catch (ex) { /*debugger;*/ };
			try { log.add(`${name}`) } catch (ex) {}
			if(isNative(o)) {
				a=a.map(x => x ? (x[pts]||x) : x);
			}
			return wrapInProxy(Reflect.construct(o,a));
		}
	};
	function wrapInProxy(obj,name) {
		if(obj === null) return obj;
		if(obj === undefined) return obj;
		if(!(typeof(obj) == 'function' || typeof(obj) == 'object')) return obj;
		if(!(obj instanceof Object) || (obj instanceof Window) || (obj instanceof Document)) {
			// do not try to track cross-document objects
			return obj;
		}
		if(obj[ptsOverride]) { try { obj[ptsName]=name } catch (ex) {}; return obj; }
		if(obj[pts] && obj[pts]!==obj) return obj;
		if(!isNative(obj) && (!obj.constructor || obj.constructor==Object || !isNative(obj.constructor))) { /*debugger;*/ return obj; }
		try { obj[pts]=obj } catch (ex) {};
		try { obj[ptsName]=name } catch (ex) {};
		try {
			var pxy = stp.get(obj);
			if(!pxy) {
				pxy = new Proxy(obj, proxyCode);
				stp.set(obj, pxy);
			}
			return pxy;
		} catch (ex) {
			return obj;
		}
	}

	function wrapPropertiesOf(obj, name) {
		if(obj[ptsOverride]) return;
		if(stp.has(obj)) return;

		obj[ptsOverride] = true;
		obj[ptsName] = name;

		var ckey = '';

		let objKeys = new Set(Object.getOwnPropertyNames(obj));
		for(let key in obj) { objKeys.add(key) };
		for(let key of objKeys) {
			ckey=key;
			try {
				//alert(key);
				if(obj === window && (key == 'window' || key=='top' || key=='self' || key=='document' || key=='location' || key=='contentWindow' || key=='contentDocument' || key=='parentWindow' || key=='parentDocument' || key=='ownerDocument' || key=='Object' || key=='Array' || key=='Function' || key=='Date' || key=='Number' || key=='String' || key=='Boolean' || key===ptsOverride || key===ptsName)) {
					continue;
				}
				let property = Object.getOwnPropertyDescriptor(obj,key);
				let proto = Object.getPrototypeOf(obj);
				while(!property && proto) {
					property = Object.getOwnPropertyDescriptor(proto,key);
					proto=Object.getPrototypeOf(proto);
				}
				if(!property) continue; 
				if(property.configurable) {
					if(property.get) {
						Object.defineProperty(obj, key, {
							get() {
								var v = property.get.call(this);
								try { var name = `${ts(this)}.${ss(key)}`; } catch (ex) {/*debugger;*/};
								try { if(name) log.add(`${name}`) } catch (ex) {/*debugger;*/};
								return wrapInProxy(v, name);
							},
							set(v) {
								if(v && v[pts]) { v=v[pts]; }
								try { log.add(`${ts(this)}.${ss(key)}=${ts(v)}`) } catch (ex) {/*debugger;*/};
								return property.set.call(this, v);
							}
						});
					} else if(property.writable) {
						obj[key] = wrapInProxy(property.value,name+'.'+key);
					} else {
						Object.defineProperty(obj, key, { 
							value: wrapInProxy(property.value,name+'.'+key), 
							enumerable:property.enumerable,
							writable:false,  
						});
					} 
				} else if (property.writable) {
					obj[key] = wrapInProxy(property.value,name+'.'+key);
				} else {
					console.log(name, key);
				}
			} catch (ex) {
				console.warn(name,key,ex);
			}
		}
		obj[ptsOverride] = true;
		obj[ptsName] = name;
	}

	if(window.document) {
		wrapPropertiesOf(window.document, 'document');
	}
	if(window.top !== window) {
		wrapPropertiesOf(window.top, 'top');
	}
	wrapPropertiesOf(window, 'window');
	//wrapPropertiesOf(location, 'location');
	window.log = log;
	log.clear();
	//__window = wrapInProxy(window, 'window');
	//__document = wrapInProxy(document, 'document');
	//__location = wrapInProxy(location, 'location');
	//__top = wrapInProxy(location, 'top');
}();