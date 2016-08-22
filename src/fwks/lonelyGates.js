var getLonelyGatesUsage = function (cssLonelyClassGates, domClasses, domIds, cssLonelyIdGates) {

    var _ = window.CSSUsageLodash;

    if((cssLonelyClassGates || domClasses || domIds || cssLonelyIdGates) == undefined) return;
    
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
}