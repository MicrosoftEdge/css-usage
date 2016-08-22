// http://www.gumbyframework.com/docs/grid/#!/basic-grid
var hasGrumbyUsage = function() {
    
    if(!document.querySelector(".row .columns")) {
        return false;
    }
    
    var classesToLookUp = ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve"];
    for(var cl = 0; cl < classesToLookUp.length; cl++ ) {
        var fraction = classesToLookUp[cl];
        if(document.querySelector(".row > .columns."+fraction)) {
            return true;
        }
    }
    return false;
    
}