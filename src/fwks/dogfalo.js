// https://github.com/Dogfalo/materialize/blob/master/sass/components/_grid.scss
var hasDogfaloMaterializeUsage = function() {
    
    if(!document.querySelector(".container > .row > .col")) {
        return false;
    }
    
    for(var i = 12+1; --i;) {
        var classesToLookUp = ['s','m','l'];
        for(var d = 0; d < classesToLookUp.length; d++) {
            var s = classesToLookUp[d];
            if(document.querySelector(".container > .row > .col."+s+""+i)) {
                return true;
            }
        }
    }
    return false;
    
}