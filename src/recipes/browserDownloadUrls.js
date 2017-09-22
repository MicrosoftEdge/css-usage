/* 
    RECIPE: browserDownloadUrls
    -------------------------------------------------------------
    Author: Morgan, Lia, Joel, Malick
    Description: Looks for the download urls of other browsers
*/


void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push(function browserDownloadUrls(element, results){
        //excludes Microsoft sites and forums because they will have irrelevant user comments about switching browsers 
        if(window.location.href.indexOf("microsoft.com") !== -1 || window.location.href.indexOf("forum") !== -1){
            return results;
        }
        
        //tests for browser download urls
        var browsers = [{co:"google", browser:"chrome", name:"Chrome", re:null}, {co:"microsoft", browser:"(internet-explorer|\\Wie)", name:"IE", re:null}, 
                {co:"microsoft", browser:"(microsoft-edge)", name:"Edge", re:null},{co:"(mozilla|getfirefox|firefox)", browser:"", name:"Firefox", re:null}, 
                {co:"apple", browser:"safari", name:"Safari", re:null}, {co:"opera", browser:"", name:"Opera", re:null}];
        //creates regex for urls and adds it to array
        for (var i = 0; i < browsers.length; i++) {
            browsers[i].re = new RegExp("^http(s)?\\:\\/\\/(\\w{0,9}\\.)?" + browsers[i].co + "\\.(\\w{0,4})\\/?((\\W|\\w)+)?" + browsers[i].browser + "($|\\W)", "gi");
        }        

        for(var link of browsers){
            if(element.hasAttribute("href")){
                var href = element.getAttribute("href");
                //filtering out results that begin with "answers" to exclude answer forum results  
                if(link.re.test(href) && href.indexOf("answers") === -1 && href.indexOf("itunes") === -1){
                    results[link.name] = results[link.name] || {count: 0};
                    results[link.name].count++;
                    //checks if is visible on page
                    results["visibility"] = results["visibility"] || {value:"false"};
                    if(isVisible(element)){
                        results["visibility"] = "true";
                    }
                }
            }
        }
    });
}();