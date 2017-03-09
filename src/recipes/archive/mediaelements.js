/* 
    RECIPE: Metaviewport
    -------------------------------------------------------------
    Author: Mustapha Jaber
    Description: Get count of media elements on page like video, audio, object.
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function mediaelements(/*HTML DOM Element*/ element, results) {
        var nodeName = element.nodeName;
        if (nodeName == "OBJECT" || nodeName == "VIDEO" || nodeName == "AUDIO" || nodeName == "EMBED")
        {
            results[nodeName] = results[nodeName] || { count: 0,  };
            results[nodeName].count++;
            for (var n = 0; n < element.attributes.length; n++) {
                results[nodeName][element.attributes[n].name] = element.attributes[n].value;
            }
        }
        else if (IsAdobeFlashDownloadUrl(element))
        {
            results[nodeName] = results[nodeName] || { flashDownloadUrl: true, count: 0 };
            results[nodeName].count++;
        }
        return results;
    });

    function IsAdobeFlashDownloadUrl(element)
    {
        var isFlashDownloadLink = false;

        if (element.nodeName == "A")
        {
            if (element.attributes["href"] !== undefined) {
                var host = element.attributes["href"].value;

                if (host.match("get.adobe.com") || host.match("get2.adobe.com")) {
                    if (host.match("flash")) {
                        // url is get.adobe.com/*flash*
                        isFlashDownloadLink = true;
                    }
                }
                else if (host.match("adobe.com") || host.match("macromedia.com") ||
                         host.match("www.adobe.com") || host.match("www.macromedia.com")) {
                    var token = host.match("/go/");
                    if (token != null) {
                        token = token.match("get");
                        if (token != null) {
                            token = token.match("flash");
                            if (token != null) {
                                // url is (www).adobe.com/*/go/*get*flash* or (www).macromedia.com/*/go/*get*flash*
                                isFlashDownloadLink = true;
                            }
                        }
                    }
                    else if (host.match("/shockwave/download/") &&
                             host.match("download.cgi") || host.match("index.cgi")) {
                        if (host.match("?P1_Prod_Version=ShockwaveFlash")) {
                            // url is (www).(adobe || macromedia).com/shockwave/download/(download || index).cgi?P1_Prod_Version=ShockwaveFlash
                            isFlashDownloadLink = true;
                        }
                    }
                }
            }
        }

        return isFlashDownloadLink;
    }
}();