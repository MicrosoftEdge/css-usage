// Basic Values
describe('Basic Values', function(){
    it('background-color', function(){
        chai.assert.equal(["green"][0], css.createValueArr("green")[0]);
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
    it('font-family', function() {
        chai.assert.equal('baskerville,baskerville old face,hoefler text,garamond,times new roman,serif', css.createValueArr('Baskerville,Baskerville Old Face,Hoefler Text,Garamond,Times New Roman,serif').join(','));
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