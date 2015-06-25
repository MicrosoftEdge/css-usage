// Basic Values
describe('Basic Values', function(){
    it('background-color', function(){
        chai.assert.equal(["green"][0], css.createValueArr("green")[0]);
    });
    it('1.5rem -> rem', function() {
        chai.assert.equal('rem', css.parseValues("1.5rem"));
    });
    it('.5em -> em', function() {
        chai.assert.equal('em', css.parseValues(".5em"));
    });
    it('2.5px -> px', function() {
        chai.assert.equal('px', css.parseValues("2.5px"));
    });
    it('6.78.5% -> %', function() {
        chai.assert.equal('%', css.parseValues("6.78.5%"));
    });
});

// Webkit Values
describe('Prefixed Values', function(){
    it('-webkit-linear-gradient', function(){
        chai.assert.equal(["-webkit-linear-gradient"][0], css.createValueArr("-webkit-linear-gradient(red, blue)")[0]);
    });
});

// Shorthands
describe('Shorthand & Complex Values', function() {
    it('background', function() {
        chai.assert.equal(['linear-gradient'][0], css.createValueArr('linear-gradient( 45deg, blue, red ) no-repeat')[0]);
    });
    it('font-family: initial testing of comma seperated vals', function() {
        chai.assert.equal('baskerville,baskerville old face,hoefler text,garamond,times new roman,serif', css.createValueArr('Baskerville,Baskerville Old Face,Hoefler Text,Garamond,Times New Roman,serif').join(','));
    });
    it('font-family: just more parsing due to bugs in initial implementation because this value sneaked through due to issue with indexOf', function() {
        chai.assert.equal('roboto', css.createValueArr('roboto,arial,sans-serif')[0]);
    });
});

// Transforms
describe('Function Values', function() {
    it('rotate()', function() {
        chai.assert.equal('rotate', css.createValueArr("rotate(90deg)")[0]);
    });
    it('hsla()', function() {
        chai.assert.equal('hsla', css.createValueArr("hsla(120, 100%, 50%, .75)")[0]);
    });
    it('hsl()', function() {
        chai.assert.equal('hsl', css.createValueArr("hsl(120, 100%, 50%)")[0]);
    });
    it('rgba()', function() {
        chai.assert.equal('rgba', css.createValueArr("rgba(200, 54, 54, 0.5)")[0]);
    });
});

describe('Selectors', function(){
    it('a:hover -> a', function() {
        chai.assert.equal('a', css.cleanSelectorText('a:hover'));
    });
    it('#id .class:focus -> #id .class', function() {
        chai.assert.equal('#id .class', css.cleanSelectorText('#id .class:focus'));
    });
    it('ul li:not(:nth-child(2n+1)):active -> ul li:not(:nth-child(2n+1))', function() {
        chai.assert.equal('ul li:not(:nth-child(2n+1))', css.cleanSelectorText('ul li:not(:nth-child(2n+1)):active'));
    });
    it('a:link -> a', function() {
        chai.assert.equal('a', css.cleanSelectorText('a:link'));
    });
});

// Misc
describe('Normalizing Values', function() {
    it('remove fancy apostrophes', function() {
        chai.assert.equal('word', css.normalizeValue('‘word’'));
    });
    it('remove regular apostrophes', function() {
        chai.assert.equal('word', css.normalizeValue("'word'"));
    });
    it('trim values', function() {
        chai.assert.equal('word', css.normalizeValue(" word "));
    });
});