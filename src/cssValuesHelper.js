//
// helper to work with css values
//
void function() {

    CSSUsage.CSSValues = {
        createValueArray: createValueArray,
        parseValues: parseValues,
        normalizeValue: createValueArray
    };

    /**
     * This will take a string value and reduce it down
     * to only the aspects of the value we wish to keep
     */
    function parseValues(value,propertyName) {
        
        // Trim value on the edges
        value = value.trim();
        
        // Normalize letter-casing
        value = value.toLowerCase();

        // Map colors to a standard value (eg: white, blue, yellow)
        if (isKeywordColor(value)) { return "<color-keyword>"; }
        value = value.replace(/[#][0-9a-fA-F]+/g, '#xxyyzz');
        
        // Escapce identifiers containing numbers
        var numbers = ['ZERO','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE'];
        value = value.replace(
            /([_a-z][-_a-z]|[_a-df-z])[0-9]+[-_a-z0-9]*/g, 
            s=>numbers.reduce(
                (m,nstr,nint)=>m.replace(RegExp(nint,'g'),nstr),
                s
            )
        );
        
        // Remove any digits eg: 55px -> px, 1.5 -> 0.0, 1 -> 0
        value = value.replace(/(?:[+]|[-]|)(?:(?:[0-9]+)(?:[.][0-9]+|)|(?:[.][0-9]+))(?:[e](?:[+]|[-]|)(?:[0-9]+))?(%|e[a-z]+|[a-df-z][a-z]*)/g, "$1"); 
        value = value.replace(/(?:[+]|[-]|)(?:[0-9]+)(?:[.][0-9]+)(?:[e](?:[+]|[-]|)(?:[0-9]+))?/g, " <float> ");
        value = value.replace(/(?:[+]|[-]|)(?:[.][0-9]+)(?:[e](?:[+]|[-]|)(?:[0-9]+))?/g, " <float> ");
        value = value.replace(/(?:[+]|[-]|)(?:[0-9]+)(?:[e](?:[+]|[-]|)(?:[0-9]+))/g, " <float> ");
        value = value.replace(/(?:[+]|[-]|)(?:[0-9]+)/g, " <int> ");
        
        // Unescapce identifiers containing numbers
        value = numbers.reduce(
            (m,nstr,nint)=>m.replace(RegExp(nstr,'g'),nint),
            value
        )
        
        // Remove quotes
        value = value.replace(/('|‘|’|")/g, "");
        
        //
        switch(propertyName) {
            case 'counter-increment':
            case 'counter-reset':
                
                // Anonymize the user identifier
                value = value.replace(/[-_a-zA-Z0-9]+/g,' <custom-ident> ');
                break;
                
            case 'grid':
            case 'grid-template':
            case 'grid-template-rows':
            case 'grid-template-columns':
            case 'grid-template-areas':
                
                // Anonymize line names
                value = value.replace(/\[[-_a-zA-Z0-9 ]+\]/g,' <line-names> ');
                break;
                
            case '--var':
            
                // Replace (...), {...} and [...]
                value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, " <parentheses-block> ");
                value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, " <parentheses-block> ");
                value = value.replace(/\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]*)\])*\])*\])*\])*\]/g, " <curly-brackets-block> ");
                value = value.replace(/\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]+|\[(?:[^()]*)\])*\])*\])*\])*\]/g, " <curly-brackets-block> ");
                value = value.replace(/\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]*)\})*\})*\})*\})*\}/g, " <square-brackets-block> ");
                value = value.replace(/\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]+|\{(?:[^()]*)\})*\})*\})*\})*\}/g, " <square-brackets-block> ");
                break;
                
        }
            
        return value.trim();
            
    }

    //-----------------------------------------------------------------------------

    /**
     * This will transform a value into an array of value identifiers
     */ 
    function createValueArray(value, propertyName) {

        // Trim value on the edges
        value = value.trim();
        
        // Normalize letter-casing
        value = value.toLowerCase();
        
        // Remove comments and !important
        value = value.replace(/([/][*](?:.|\r|\n)*[*][/]|[!]important.*)/g,'');
        
        // Do the right thing in function of the property
        switch(propertyName) {
            case 'font-family':
                
                // Remove various quotes
                if (value.indexOf("'") != -1 || value.indexOf("‘") != -1 || value.indexOf('"')) {
                    value = value.replace(/('|‘|’|")/g, "");
                }
                
                // Divide at commas to separate different font names
                value = value.split(/\s*,\s*/g);
                return value;
                
            case '--var':
            
                // Replace strings by dummies
                value = value.replace(/"([^"\\]|\\[^"\\]|\\\\|\\")*"/g,' <string> ')
                value = value.replace(/'([^'\\]|\\[^'\\]|\\\\|\\')*'/g,' <string> ');
                
                // Replace url(...) functions by dummies
                value = value.replace(/([a-z]?)[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "$1()");
                value = value.replace(/([a-z]?)[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "$1()");
                
                // Remove group contents (...), {...} and [...]
                value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, " <parentheses-block> ");
                value = value.replace(/[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, " <parentheses-block> ");
                value = value.replace(/[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]*)[}])*[}])*[}])*[}])*[}]/g, " <curly-brackets-block> ");
                value = value.replace(/[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]+|[{](?:[^{}]*)[}])*[}])*[}])*[}])*[}]/g, " <curly-brackets-block> ");
                value = value.replace(/[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]*)[\]])*[\]])*[\]])*[\]])*[\]]/g, " <square-brackets-block> ");
                value = value.replace(/[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]+|[\[](?:[^\[\]]*)[\]])*[\]])*[\]])*[\]])*[\]]/g, " <square-brackets-block> ");
                
                break;
                
            default:
            
                // Replace strings by dummies
                value = value.replace(/"([^"\\]|\\[^"\\]|\\\\|\\")*"/g,' <string> ')
                                .replace(/'([^'\\]|\\[^'\\]|\\\\|\\')*'/g,' <string> ');
                
                // Replace url(...) functions by dummies
                if (value.indexOf("(") != -1) {
                    value = value.replace(/([a-z]?)[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "$1() ");
                    value = value.replace(/([a-z]?)[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]+|[(](?:[^()]*)[)])*[)])*[)])*[)])*[)]/g, "$1() ");
                }
                
        }
        
        // Collapse whitespace
        value = value.trim().replace(/\s+/g, " ");
        
        // Divide at commas and spaces to separate different values
        value = value.split(/\s*(?:,|[/])\s*|\s+/g);
        
        return value;
    }

    /**
     * So that we don't end up with a ton of color
     * values, this will determine if the color is a
     * keyword color value
     */
    function isKeywordColor(candidateColor) {
        
        // Keyword colors from the W3C specs
        var isColorKeyword = /^(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|grey|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgreen|lightgray|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lighslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|navyblue|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)$/;
        return isColorKeyword.test(candidateColor);
        
    }

}();