describe('basic values', function(){
    it('background', function(){
        chai.assert.equal(["background"][0], css.createValueArr("background")[0], "background failed");
    });
});