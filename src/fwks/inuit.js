// https://raw.githubusercontent.com/csswizardry/inuit.css/master/generic/_widths.scss
var hasInuitUsage = function() {
    
    if(!document.querySelector(".grid .grid__item")) {
        return false;
    }
    
    var classesToLookUp = ["one-whole","one-half","one-third","two-thirds","one-quarter","two-quarters","one-half","three-quarters","one-fifth","two-fifths","three-fifths","four-fifths","one-sixth","two-sixths","one-third","three-sixths","one-half","four-sixths","two-thirds","five-sixths","one-eighth","two-eighths","one-quarter","three-eighths","four-eighths","one-half","five-eighths","six-eighths","three-quarters","seven-eighths","one-tenth","two-tenths","one-fifth","three-tenths","four-tenths","two-fifths","five-tenths","one-half","six-tenths","three-fifths","seven-tenths","eight-tenths","four-fifths","nine-tenths","one-twelfth","two-twelfths","one-sixth","three-twelfths","one-quarter","four-twelfths","one-third","five-twelfths","six-twelfths","one-half","seven-twelfths","eight-twelfths","two-thirds","nine-twelfths","three-quarters","ten-twelfths","five-sixths","eleven-twelfths"];

    for(var cu = 0; cu < classesToLookUp.length; cu++ ) {
        var fraction = classesToLookUp[cu];

        var subClassesToLookUp = ["","palm-","lap-","portable-","desk-"];
        for(var sc = 0; sc < subClassesToLookUp.length; sc++) {
            var ns = subClassesToLookUp[sc];
            if(document.querySelector(".grid > .grid__item."+ns+fraction)) {
                return true;
            }
        }
    }
    return false;
    
}