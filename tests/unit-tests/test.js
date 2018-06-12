// Basic Values
describe('Basic Values', function(){
    it('background-color', function(){
        chai.assert.equal(["green"][0], CSSUsage.CSSValues.createValueArray("green")[0]);
    });
    it('1-> <int>', function() {
        chai.assert.equal('<int>', CSSUsage.CSSValues.parseValues("1"));
    });
    it('1.5 -> <float>', function() {
        chai.assert.equal('<float>', CSSUsage.CSSValues.parseValues("1.5"));
    });
    it('1.5rem -> rem', function() {
        chai.assert.equal('rem', CSSUsage.CSSValues.parseValues("1.5rem"));
    });
    it('.5em -> em', function() {
        chai.assert.equal('em', CSSUsage.CSSValues.parseValues(".5em"));
    });
    it('2.5px -> px', function() {
        chai.assert.equal('px', CSSUsage.CSSValues.parseValues("2.5px"));
    });
    it('6.785% -> %', function() {
        chai.assert.equal('%', CSSUsage.CSSValues.parseValues("6.785%"));
    });
    it('-5.5em -> em', function() {
        chai.assert.equal('em', CSSUsage.CSSValues.parseValues("-5.5em"));
    });
    it('-65px -> px', function() {
        chai.assert.equal('px', CSSUsage.CSSValues.parseValues("-65px"));
    });
    it('#aaa -> #xxyyzz', function() {
       chai.assert.equal('#xxyyzz', CSSUsage.CSSValues.parseValues("#aaa"));
    });
    it('#aaaaaa -> #xxyyzz', function() {
       chai.assert.equal('#xxyyzz', CSSUsage.CSSValues.parseValues("#aaaaaa"));
    });
    it('table-cell', function() {
        chai.assert.equal('table-cell', CSSUsage.CSSValues.parseValues("table-cell"));
    });
});

describe('Basic Values UnNormalized', function(){
    it('cursor: url("urlsomevalue.cur")', function(){
        chai.assert.equal(["url(somevalue.cur)"][0], CSSUsage.CSSValues.createValueArray("url('somevalue.cur'), pointer", "cursor", true)[0]);
    });
});

// Webkit Values
describe('Prefixed Values', function(){
    it('-webkit-linear-gradient()', function(){
        chai.assert.equal(["-webkit-linear-gradient()"][0], CSSUsage.CSSValues.createValueArray("-webkit-linear-gradient(red, blue)")[0]);
    });
});

// Shorthands
describe('Shorthand & Complex Values', function() {
    it('background', function() {
        chai.assert.equal('linear-gradient()', CSSUsage.CSSValues.createValueArray('linear-gradient( 45deg, blue, red ) no-repeat')[0]);
        chai.assert.equal('no-repeat', CSSUsage.CSSValues.createValueArray('linear-gradient( 45deg, blue, red ) no-repeat')[1]);
    });
    it('font-family: initial testing of comma seperated vals', function() {
        chai.assert.equal('baskerville,baskerville old face,hoefler text,garamond,times new roman,serif', CSSUsage.CSSValues.createValueArray('Baskerville,Baskerville Old Face,Hoefler Text,Garamond,Times New Roman,serif','font-family').join(','));
    });
    it('font-family: just more parsing due to bugs in initial implementation because this value sneaked through due to issue with indexOf', function() {
        chai.assert.equal('roboto', CSSUsage.CSSValues.createValueArray('roboto,arial,sans-serif','font-family')[0]);
    });
    it('box-shadow: initial testing of comma seperated vals', function() {
        chai.assert.equal('3px,blue,1em,red', CSSUsage.CSSValues.createValueArray('3px blue , 1em red','box-shadow').join(','));
    });
	it('background: lime url(")...\\\\\\"\\\\\\...(") repeat', function() {
		chai.assert.equal('lime,url(),repeat', CSSUsage.CSSValues.createValueArray('lime url(")...\\\\\\"\\\\\\...(") repeat','background').join(','));
	});
	it('background-image: -webkit-gradient(linear, left bottom, left top, from(#5AE), to(#036))', function() {
		chai.assert.equal('-webkit-gradient()', CSSUsage.CSSValues.createValueArray('-webkit-gradient(linear, left bottom, left top, from(#5AE), to(#036))','background-image').join(','));
	});
	it('margin-left: calc(-1 * (100% - 15px))', function() {
		chai.assert.equal('calc()', CSSUsage.CSSValues.createValueArray('calc(-1 * (100% - 15px))','margin-left').join(','));
	});
});

// Function Notation
describe('Function Values', function() {
    it('rotate()', function() {
        chai.assert.equal('rotate()', CSSUsage.CSSValues.createValueArray("rotate(90deg)")[0]);
    });
    it('hsla()', function() {
        chai.assert.equal('hsla()', CSSUsage.CSSValues.createValueArray("hsla(120, 100%, 50%, .75)")[0]);
    });
    it('hsl()', function() {
        chai.assert.equal('hsl()', CSSUsage.CSSValues.createValueArray("hsl(120, 100%, 50%)")[0]);
    });
    it('rgba()', function() {
        chai.assert.equal('rgba()', CSSUsage.CSSValues.createValueArray("rgba(200, 54, 54, 0.5)")[0]);
    });
    it('matrix3d()', function() {
        chai.assert.equal('matrix3d()', CSSUsage.CSSValues.createValueArray("matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1)")[0]);
    });
    it('matrix()', function() {
        chai.assert.equal('matrix()', CSSUsage.CSSValues.createValueArray("matrix(1, 0, 0, 1, 0, 0)")[0]);
    });
    it('var()', function() {
        chai.assert.equal('var()', CSSUsage.CSSValues.createValueArray("var(--primary-color)"));
    })
});

describe('Matchable Selectors', function(){
    it('a:hover -> a', function() {
        chai.assert.equal('a', CSSUsage.PropertyValuesAnalyzer.cleanSelectorText('a:hover'));
    });
    it('*:hover -> *', function() {
        chai.assert.equal('*', CSSUsage.PropertyValuesAnalyzer.cleanSelectorText('*:hover'));
    });
    it(':hover -> *', function() {
        chai.assert.equal('*', CSSUsage.PropertyValuesAnalyzer.cleanSelectorText(':hover'));
    });
    it('#id .class:focus -> #id .class', function() {
        chai.assert.equal('#id .class', CSSUsage.PropertyValuesAnalyzer.cleanSelectorText('#id .class:focus'));
    });
    it('ul li:not(:nth-child(2n+1)):active -> ul li:not(:nth-child(2n+1))', function() {
        chai.assert.equal('ul li:not(:nth-child(2n+1))', CSSUsage.PropertyValuesAnalyzer.cleanSelectorText('ul li:not(:nth-child(2n+1)):active'));
    });
    it('a:before -> a', function() {
        chai.assert.equal('a', CSSUsage.PropertyValuesAnalyzer.cleanSelectorText('a:before'));
    });
    it('a::before -> a', function() {
        chai.assert.equal('a', CSSUsage.PropertyValuesAnalyzer.cleanSelectorText('a::before'));
    });
});

describe('Generalized Selectors', function(){
    it('#id1>#id2+#id3 -> #i > #i + #i', function() {
        chai.assert.equal('#i > #i + #i', CSSUsage.PropertyValuesAnalyzer.generalizedSelectorsOf('#id1>#id2+#id3')[0]);
    });
    it('div.box:hover -> div.c:hover', function() {
        chai.assert.equal('div.c:hover', CSSUsage.PropertyValuesAnalyzer.generalizedSelectorsOf('div.box:hover')[0]);
    });
    it('.class1.class2.class3 -> .c.c.c', function() {
        chai.assert.equal('.c.c.c', CSSUsage.PropertyValuesAnalyzer.generalizedSelectorsOf('.class1.class2.class3')[0]);
    });
    it('.class1 .class2 .class3 -> .c .c .c', function() {
        chai.assert.equal('.c .c .c', CSSUsage.PropertyValuesAnalyzer.generalizedSelectorsOf('.class1 .class2 .class3')[0]);
    });
    it('.-class1 ._class2 .Class3 -> .c .c .c', function() {
        chai.assert.equal('.c .c .c', CSSUsage.PropertyValuesAnalyzer.generalizedSelectorsOf('.-class1 ._class2 .Class3')[0]);
    });
    it(':nth-child(2n+1) -> :nth-child', function() {
        chai.assert.equal(':nth-child', CSSUsage.PropertyValuesAnalyzer.generalizedSelectorsOf(':nth-child(2n+1)')[0]);
    });
    it(':not([attribute*="-3-"]) -> :not', function() {
        chai.assert.equal(':not', CSSUsage.PropertyValuesAnalyzer.generalizedSelectorsOf(':not([attribute*="-3-"])')[0]);
    });
    it('div.a#b[c][d].e#f -> div#i#i.c.c[a][a]', function() {
        chai.assert.equal('div#i#i.c.c[a][a]', CSSUsage.PropertyValuesAnalyzer.generalizedSelectorsOf('div.a#b[c][d].e#f')[0]);
    });
});

// Misc
describe('Normalizing Values', function() {
    it('[font-family] remove fancy apostrophes', function() {
        chai.assert.equal('word', CSSUsage.CSSValues.parseValues('‘word’','font-family'));
    });
    it('[font-family] remove regular apostrophes', function() {
        chai.assert.equal('word', CSSUsage.CSSValues.parseValues("'word'",'font-family'));
    });
    it('trim values', function() {
        chai.assert.equal('word', CSSUsage.CSSValues.parseValues(" word "));
    });
    it('grid-template: bracket identifiers', function() {
        chai.assert.equal('<line-names>', CSSUsage.CSSValues.parseValues('[start]','grid-template'));
    });
    it('--var: bracket islands', function() {
        chai.assert.equal('<square-brackets-block>', CSSUsage.CSSValues.parseValues('{toto:true}','--var'));
    });
});