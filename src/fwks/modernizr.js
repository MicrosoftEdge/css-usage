//
// report how many times the classes in the following arrays have been used as css gate
// (modernizer stats)
//

// https://modernizr.com/docs#features
var detectedModernizerUsages = function(cssLonelyClassGates) {

    if((cssLonelyClassGates) == undefined) return;
    
    var ModernizerUsages = {count:0,values:{/*  "js":1,  "no-js":2  */}};
    var trackedClasses = ["js","ambientlight","applicationcache","audio","batteryapi","blobconstructor","canvas","canvastext","contenteditable","contextmenu","cookies","cors","cryptography","customprotocolhandler","customevent","dart","dataview","emoji","eventlistener","exiforientation","flash","fullscreen","gamepads","geolocation","hashchange","hiddenscroll","history","htmlimports","ie8compat","indexeddb","indexeddbblob","input","search","inputtypes","intl","json","olreversed","mathml","notification","pagevisibility","performance","pointerevents","pointerlock","postmessage","proximity","queryselector","quotamanagement","requestanimationframe","serviceworker","svg","templatestrings","touchevents","typedarrays","unicoderange","unicode","userdata","vibrate","video","vml","webintents","animation","webgl","websockets","xdomainrequest","adownload","audioloop","audiopreload","webaudio","lowbattery","canvasblending","todataurljpeg,todataurlpng,todataurlwebp","canvaswinding","getrandomvalues","cssall","cssanimations","appearance","backdropfilter","backgroundblendmode","backgroundcliptext","bgpositionshorthand","bgpositionxy","bgrepeatspace,bgrepeatround","backgroundsize","bgsizecover","borderimage","borderradius","boxshadow","boxsizing","csscalc","checked","csschunit","csscolumns","cubicbezierrange","display-runin","displaytable","ellipsis","cssescape","cssexunit","cssfilters","flexbox","flexboxlegacy","flexboxtweener","flexwrap","fontface","generatedcontent","cssgradients","hsla","csshyphens,softhyphens,softhyphensfind","cssinvalid","lastchild","cssmask","mediaqueries","multiplebgs","nthchild","objectfit","opacity","overflowscrolling","csspointerevents","csspositionsticky","csspseudoanimations","csspseudotransitions","cssreflections","regions","cssremunit","cssresize","rgba","cssscrollbar","shapes","siblinggeneral","subpixelfont","supports","target","textalignlast","textshadow","csstransforms","csstransforms3d","preserve3d","csstransitions","userselect","cssvalid","cssvhunit","cssvmaxunit","cssvminunit","cssvwunit","willchange","wrapflow","classlist","createelementattrs,createelement-attrs","dataset","documentfragment","hidden","microdata","mutationobserver","bdi","datalistelem","details","outputelem","picture","progressbar,meter","ruby","template","time","texttrackapi,track","unknownelements","es5array","es5date","es5function","es5object","es5","strictmode","es5string","es5syntax","es5undefined","es6array","contains","generators","es6math","es6number","es6object","promises","es6string","devicemotion,deviceorientation","oninput","filereader","filesystem","capture","fileinput","directory","formattribute","localizednumber","placeholder","requestautocomplete","formvalidation","sandbox","seamless","srcdoc","apng","jpeg2000","jpegxr","sizes","srcset","webpalpha","webpanimation","webplossless,webp-lossless","webp","inputformaction","inputformenctype","inputformmethod","inputformtarget","beacon","lowbandwidth","eventsource","fetch","xhrresponsetypearraybuffer","xhrresponsetypeblob","xhrresponsetypedocument","xhrresponsetypejson","xhrresponsetypetext","xhrresponsetype","xhr2","scriptasync","scriptdefer","speechrecognition","speechsynthesis","localstorage","sessionstorage","websqldatabase","stylescoped","svgasimg","svgclippaths","svgfilters","svgforeignobject","inlinesvg","smil","textareamaxlength","bloburls","datauri","urlparser","videoautoplay","videoloop","videopreload","webglextensions","datachannel","getusermedia","peerconnection","websocketsbinary","atob-btoa","framed","matchmedia","blobworkers","dataworkers","sharedworkers","transferables","webworkers"];
    for(var tc = 0; tc < trackedClasses.length; tc++) {
        var c = trackedClasses[tc];
        countInstancesOfTheClass(c); 
        countInstancesOfTheClass('no-'+c);
    }
    return ModernizerUsages;
    
    function countInstancesOfTheClass(c) {
        var count = cssLonelyClassGates[c]; if(!count) return; 
        ModernizerUsages.count += count; 
        ModernizerUsages.values[c]=count; 
    }
    
}