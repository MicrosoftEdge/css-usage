//
// Documentation:
// ================
// This project is a template script you can customize then insert at the begining of your document.
// It will enable you to log which native functions are being called by your application.
// You can filter the log to only include particular instances like slow function calls.
// You can also log more information like the call stack at the time of the log.
//
void function () {

    //
    // Import stuff we want to use (before we wrap or replace them, eventually)
    //

    var console = window.console;
    var Object = window.Object;
    var Window = window.Window;
    var Document = window.Document;
    var Function = window.Function;
    var Set = window.Set;
    var Proxy = window.Proxy;
    var WeakMap = window.WeakMap;
    var Symbol = window.Symbol;

    var objectToString = Object.prototype.toString;
    var bindFunction = Function.prototype.bind;

    //
    // Prerequirement: be able to distinguish between native and bound functions
    // This is done by adding a tag to user-functions returned by "func.bind(obj)"
    //

    var isBoundUserFunction = window.isBoundUserFunction = Symbol`isBoundUserFunction`;
    var isKnownNativeFunction = window.isBoundUserFunction = Symbol`isKnownNativeFunction`;
    var isNativeFunction = function (f) {
        var isNative = f[isKnownNativeFunction] || (
            !f[isBoundUserFunction]
            && /^function[^]*?\([^]*?\)[^]*?\{[^]*?\[native code\][^]*?\}$/m.test(`${f}`)
        );
        if (isNative && !f[isKnownNativeFunction]) {
            f[isKnownNativeFunction] = true;
        }
        return isNative;
    };

    Function.prototype.toString[isKnownNativeFunction] = true;

    Function.prototype.bind = function () {
        var result = bindFunction.apply(this, arguments);
        if (!isNativeFunction(this)) result[isBoundUserFunction] = true;
        return result;
    };

    //
    // Helper:
    // Returns trus if the object is from this window
    // Returns false if the object is from another iframe/window
    //
    var isFromThisRealm = function (obj) {
        return (obj instanceof Object);
    }

    //
    // Helper:
    // Returns "Object", "Array", "Window", or another native type value
    //

    var getNativeTypeOf = function (o) {
        try { o = o ? (o[pts] || o) : o; } catch (ex) { }
        var s = objectToString.call(o);
        var i = '[object '.length;
        return s.substr(i, s.length - i - 1);
    };

    //
    // Helper:
    // Returns a string representation of an object key (o[key] or o.key)
    //

    var getKeyAsStringFrom = function (o) {
        try { if (typeof (o) == 'symbol') { return `[${o.toString()}]`; } } catch (ex) { return '[symbol]' }
        try { if (/^[0-9]+$/.test(o)) { return '[int]'; } } catch (ex) { }
        try { return `${o}` } catch (ex) { }
        try { return `[${o.toString()}]`; } catch (ex) { }
        try { if (o.constructor) return '[' + o.constructor.name + ']'; } catch (ex) { }
        return '[???]';
    }

    //
    // Storage of the proxy-object to/from source-object links
    //

    var stp = new WeakMap();
    var pts = window.pts = Symbol`proxyToSource`;
    var ptsName = window.ptsName = Symbol`proxyToSourceName`;
    var isAlreadyWrapped = window.isAlreadyWrapped = Symbol`proxyToSourceOverride`;

    //
    // This is the algorithm we want to run when an API is being used
    //

    // CUSTOMIZE HERE:
    // this is where we will store our information, we will export it as window.proxylog on the page
    var log = new Set();

    // this is how operations on the proxies will work:
    var proxyCode = {

        // htmlElement.innerHTML (o = htmlElement, k = "innerHTML")
        get(o, k) {

            // special rule: the proxy-to-source symbol should allow to unwrap the proxy
            if (k === pts) { return o; }

            // special rule: our internal pointers should not trigger the user-logic
            if (k === ptsName || k === isAlreadyWrapped || k === isBoundUserFunction) {
                return o[k];
            }

            try {

                // if we want to measure how long this operation took:
                //var operationTime = -performance.now()

                // get the value from the source object
                var returnValue = o[k];

            } finally {

                // if we want to know how long this operation took:
                //operationTime += performance.now();

                // CUSTOMIZE HERE:
                try { var name = `${getNativeTypeOf(o)}.${getKeyAsStringFrom(k)}`; } catch (ex) {/*debugger;*/ };
                try { if (name) log.add(`${name}`) } catch (ex) {/*debugger;*/ };

            }

            // since we want to continue to receive usage info for the object we are about to return...
            if (returnValue && (typeof returnValue == 'object' || typeof returnValue == 'function') && isFromThisRealm(returnValue)) {

                // first, we need to know if we can wrap it in a proxy...

                var shouldRefrainFromProxying = returnValue[isAlreadyWrapped];
                try {
                    var property = Object.getOwnPropertyDescriptor(o, k);
                    let proto = o;
                    while (!property && proto) {
                        proto = Object.getPrototypeOf(proto);
                        property = proto ? Object.getOwnPropertyDescriptor(proto, k) : null;
                    }
                } catch (ex) {/*debugger;*/ }
                var doesPropertyAllowProxyWrapping = !property || (property.set || property.writable) || property.configurable;

                if (!shouldRefrainFromProxying && doesPropertyAllowProxyWrapping) {

                    // if we can, that is the best option
                    returnValue = wrapInProxy(returnValue);

                } else {

                    // if not (rare) we will do our best by special-casing the object
                    try { wrapPropertiesOf(returnValue, name); } catch (ex) {/*debugger;*/ }
                }

            }

            return returnValue;

        },

        // htmlElement.innerHTML = responseText; (o = htmlElement, k = "innerHTML", v = responseText)
        set(o, k, v) {

            // special rule: when setting a value in the native world, we need to unwrap the value
            if (v && v[pts]) { v = v[pts]; }

            // special rule: our internal pointers should not trigger user-logic
            if (k === ptsName || k === isAlreadyWrapped || k === isBoundUserFunction) {
                o[k] = v; return true;
            }

            try {

                // if we want to measure how long this operation took:
                //var operationTime = -performance.now()

                // set the value on the source object
                o[k] = v;

            } finally {

                // if we want to know how long this operation took:
                //operationTime += performance.now();

                // CUSTOMIZE HERE:
                try { log.add(`${getNativeTypeOf(o)}.${getKeyAsStringFrom(k)}=${getNativeTypeOf(v)}`) } catch (ex) {/*debugger;*/ };

            }

            return true;
        },

        // htmlElement.focus(); (o = htmlElement.focus, t = htmlElement, a = [])
        apply(o, t, a) {

            // special rule: if we are calling a native function, none of the arguments can be proxies
            if (isNativeFunction(o)) {
                t = t ? (t[pts] || t) : t;
                a = a.map(x => x ? (x[pts] || x) : x);
            }

            try {

                // if we want to measure how long this operation took:
                //var operationTime = -performance.now()

                // call the function and return its result
                var returnValue = o.apply(t, a);

            } finally {

                // if we want to know how long this operation took:
                //operationTime += performance.now();

                // CUSTOMIZE HERE:
                try { var name = `${o[ptsName] || (getNativeTypeOf(t || window) + '.' + getKeyAsStringFrom(o.name || '???'))}`; } catch (ex) {/*debugger;*/ };
                try { var name = `${name}(${a.map(x => getNativeTypeOf(x)).join(',')})`; } catch (ex) { /*debugger;*/ };
                try { log.add(`${name}`) } catch (ex) { }

            }

            return wrapInProxy(returnValue, name);

        },

        // new CustomEvent("click"); (o = CustomEvent, a = ["click"])
        construct(o, a) {

            // special rule: if we are calling a native function, none of the arguments can be proxies
            if (isNativeFunction(o)) {
                a = a.map(x => x ? (x[pts] || x) : x);
            }

            try {

                // if we want to measure how long this operation took:
                //var operationTime = -performance.now()

                // create a new instance of the object, and return it
                returnValue = wrapInProxy(Reflect.construct(o, a));

            } finally {

                // if we want to know how long this operation took:
                //operationTime += performance.now();

                // CUSTOMIZE HERE:
                try { var name = `new ${o[ptsName] || (getNativeTypeOf(t || window) + '.' + getKeyAsStringFrom(o.name || '???'))}`; } catch (ex) {/*debugger;*/ };
                try { var name = `${name}(${a.map(x => getNativeTypeOf(x)).join(',')})`; } catch (ex) { /*debugger;*/ };
                try { log.add(`${name}`) } catch (ex) { }

            }

            return returnValue;

        }
    };

    //
    // Helper:
    // Creates a proxy for the given source object and name, if needed (and return it)
    //
    function wrapInProxy(obj, name) {

        // special rule: non-objects do not need a proxy
        if (obj === null) return obj;
        if (obj === undefined) return obj;
        if (!(typeof (obj) == 'function' || typeof (obj) == 'object')) return obj;

        // special rule: do not try to track cross-document objects
        if (!isFromThisRealm(obj)) { return obj; }

        // special rule: do not proxy an object that has been special-cased
        if (obj[isAlreadyWrapped]) { try { obj[ptsName] = name } catch (ex) { }; return obj; }

        // special rule: do not touch an object that is already a proxy
        if (obj[pts] && obj[pts] !== obj) return obj;

        // do not wrap non-native objects (TODO: expand detection?)
        if (!isNativeFunction(obj) && (!obj.constructor || obj.constructor == Object || !isNativeFunction(obj.constructor))) { /*debugger;*/ return obj; }

        // wrap the object in proxy, and add some metadata
        try { obj[pts] = obj } catch (ex) { };
        try { obj[ptsName] = name } catch (ex) { };
        try {
            var pxy = stp.get(obj);
            if (!pxy) {
                pxy = new Proxy(obj, proxyCode);
                stp.set(obj, pxy);
            }
            return pxy;
        } catch (ex) {
            return obj;
        }

    }

    //
    // Helper:
    // Tries to catch get/set on an object without creating a proxy for it (unsafe special case)
    //
    function wrapPropertiesOf(obj, name) {

        // special rule: don't rewrap a wrapped object
        if (obj[isAlreadyWrapped]) return;

        // special rule: don't wrap an object that has a proxy
        if (stp.has(obj)) return;

        // mark the object as wrapper already
        obj[isAlreadyWrapped] = true;
        obj[ptsName] = name;

        // for all the keys of this object
        let objKeys = new Set(Object.getOwnPropertyNames(obj));
        for (let key in obj) { objKeys.add(key) };
        for (let key of objKeys) {
            try {

                // special rule: avoid problematic global properties
                if (obj === window && (key == 'window' || key == 'top' || key == 'self' || key == 'document' || key == 'location' || key == 'Object' || key == 'Array' || key == 'Function' || key == 'Date' || key == 'Number' || key == 'String' || key == 'Boolean' || key === isAlreadyWrapped || key === ptsName)) {
                    continue;
                }

                // TODO?
                // key=='contentWindow' || key=='contentDocument' || key=='parentWindow' || key=='parentDocument' || key=='ownerDocument'

                // try to find where the property has been defined in the prototype chain
                let property = Object.getOwnPropertyDescriptor(obj, key);
                let proto = obj;
                while (!property && proto) {
                    proto = Object.getPrototypeOf(proto);
                    property = proto ? Object.getOwnPropertyDescriptor(proto, key) : null;
                }
                if (!property) continue;

                // try to find if we can override the property
                if (proto !== obj || property.configurable) {

                    if (property.get) {

                        // in the case of a getter/setter, we can just duplicate
                        Object.defineProperty(obj, key, {
                            get() {

                                try {

                                    // if we want to measure how long this operation took:
                                    //var operationTime = -performance.now()

                                    // set the value on the source object
                                    var returnValue = property.get.call(this);

                                } finally {

                                    // if we want to know how long this operation took:
                                    //operationTime += performance.now();

                                    // CUSTOMIZE HERE:
                                    try { log.add(`${getNativeTypeOf(this)}.${getKeyAsStringFrom(key)}`) } catch (ex) {/*debugger;*/ };

                                }

                                return wrapInProxy(returnValue, name);

                            },
                            set(v) {

                                // special rule: when setting a value in the native world, we need to unwrap the value
                                if (v && v[pts]) { v = v[pts]; }

                                try {

                                    // if we want to measure how long this operation took:
                                    //var operationTime = -performance.now()

                                    // set the value on the source object
                                    var returnValue = property.set.call(this, v);

                                } finally {

                                    // if we want to know how long this operation took:
                                    //operationTime += performance.now();

                                    // CUSTOMIZE HERE:
                                    try { log.add(`${getNativeTypeOf(this)}.${getKeyAsStringFrom(key)}=${getNativeTypeOf(v)}`) } catch (ex) {/*debugger;*/ };

                                }

                                return returnValue;

                            }
                        });

                    } else if (property.writable) {

                        // in the case of a read-write data field, we can only wrap preventively
                        if (property.value && (typeof (property.value) == 'object' || typeof (property.value) == 'function')) {
                            try { obj[key] = wrapInProxy(property.value, name + '.' + key); } catch (ex) {/*debugger;*/ }
                        }

                    } else if ("value" in property) {

                        // in the case of a readonly data field, we can just duplicate
                        Object.defineProperty(obj, key, {
                            value: wrapInProxy(property.value, name + '.' + key),
                            enumerable: property.enumerable,
                            writable: false,
                        });

                    } else {

                        // wtf?
                        console.warn("Unable to wrap strange property: ", name, key);

                    }

                } else if (property.writable) {

                    // in the case of a read-write data field, we can try to wrap preventively
                    if (property.value && (typeof (property.value) == 'object' || typeof (property.value) == 'function')) {
                        try { obj[key] = wrapInProxy(property.value, name + '.' + key); } catch (ex) {/*debugger;*/ }
                    }

                } else if ("value" in property) {

                    // in the case of a direct read-write data field, there is nothing we can do
                    if (property.value && (typeof (property.value) == 'object' || typeof (property.value) == 'function')) {
                        console.warn("Unable to wrap readonly property: ", name, key);
                    }

                } else {

                    // wtf?
                    console.warn("Unable to wrap strange property: ", name, key);

                }

            } catch (ex) {

                console.warn("Unable to wrap property: ", name, key, ex);

            }
        }

        // set the metadata again just to be sure
        obj[isAlreadyWrapped] = true;
        obj[ptsName] = name;

    }

    //
    // There are a few objects we don't want to wrap for performance reason
    //

    let objectsToNeverWrap = [
        Object, /*Object.prototype*/, String, String.prototype, Number, Number.prototype, Boolean, Boolean.prototype,
        RegExp, RegExp.prototype, Reflect,
        Error, /*Error.prototype*/, DOMError, /*DOMError.prototype*/, DOMException, /*DOMException.prototype*/,
        // TODO: add more here
    ]
    objectsToNeverWrap.forEach(o => {
        o[isAlreadyWrapped] = true; //TODO: unsafe for prototypes because we don't check hasOwnProperty(isAlreadyWrapped) in usage
        if (typeof (o) == 'function') {
            o[isKnownNativeFunction] = true;
        }
    });

    //
    // Now it is time to wrap the important objects of this realm
    //

    if (window.document) {
        wrapPropertiesOf(window.document, 'document');
    }
    if (window.parent !== window) {
        wrapPropertiesOf(window.parent, 'parent');
    }
    if (window.top !== window) {
        wrapPropertiesOf(window.top, 'top');
    }
    wrapPropertiesOf(window, 'window');

    //
    // Disabled alternatives:
    //

    //wrapPropertiesOf(location, 'location');
    //__window = wrapInProxy(window, 'window');
    //__document = wrapInProxy(document, 'document');
    //__location = wrapInProxy(location, 'location');
    //__top = wrapInProxy(location, 'top');

    //
    // CUSTOMIZE HERE:
    //

    window.proxylog = log;
    log.clear();

}();