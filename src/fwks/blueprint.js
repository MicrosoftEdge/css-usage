// http://blueprintcss.org/tests/parts/grid.html
var hasBluePrintUsage = function() {
    
    if(!document.querySelector(".container")) {
        return false;
    }
    
    for(var i = 24+1; --i;) {
        if(document.querySelector(".container > .span-"+i)) {
            return true;
        }
    }
    return false;
    
}