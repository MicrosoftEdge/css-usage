/* 
    RECIPE: browserDownloadUrls
    -------------------------------------------------------------
    Author: Morgan, Lia, Joel, Malick
    Description: Looks for the download urls of other browsers
*/


void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function browserDownloadUrls( element, results) {
        //tests for browser download urls
        var linkList = [{url:"https://www.google.com/chrome/", name:"Chrome"}, 
        {url:"https://www.google.com/intl/en/chrome/browser/desktop/index.html", name:"Chrome"},
        {url:"https://support.microsoft.com/en-us/help/17621/internet-explorer-downloads", name:"InternetExplorer"}, 
        {url:"http://windows.microsoft.com/en-US/internet-explorer/downloads/ie", name:"InternetExplorer"}, 
        {url:"https://www.mozilla.org/en-US/firefox/", name:"Firefox"}, 
        {url:"https://www.apple.com/safari/", name:"Safari"}, 
        {url:"https://support.apple.com/en-us/HT204416", name:"Safari"},
        {url:"http://www.opera.com/download", name:"Opera"},
        {url:"https://www.microsoft.com/en-us/download/details.aspx?id=48126", name:"Edge"}];
        for(var j = 0; j < linkList.length; j++) {
            if(element.getAttribute("href") != null) {
                if(element.getAttribute("href").indexOf(linkList[j].url) != -1 ) {
                    results[linkList[j].name] = results[linkList[j].name] || {count: 0};
                    results[linkList[j].name].count++;
                }
            }
            if (element.src != null) {
                if(element.src.indexOf(linkList[j].url) != -1 ) {
                    results[linkList[j].name] = results[linkList[j].name] || {count: 0};
                    results[linkList[j].name].count++;
                }
            }
        }
    });
}();