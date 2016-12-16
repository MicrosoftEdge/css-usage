/* 
    RECIPE: APP MANIFEST
    -------------------------------------------------------------
    Author: Joel Kucera
    Description: This recipe looks for app manifest declarations.
        ex, <link rel='manifest' href='/manifest.json'>
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push(function appManifest(element, results) {
        if(element.nodeName == 'LINK') {
            var relValue = element.getAttribute('rel');
            if (relValue == 'manifest')
            {
                var hrefValue = element.getAttribute('href');
                results[window.location.href] = { manifesthref: hrefValue };
            }
        }

        return results;
    });
}();