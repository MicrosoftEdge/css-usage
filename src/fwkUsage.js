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