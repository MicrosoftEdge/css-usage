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