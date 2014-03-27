
define(function(require) {

  return {
    check: function(creator) {
      describe('enum check', function() {
        var e
        beforeEach(function() {
          e = creator.each ? creator : creator()
        })
        describe('when always returning true', function() {
          it('should not return false from the callback', function() {
            expect(e.each(function() { return true })).not.to.equal(false)
          })
        })
        describe('when always returning false', function() {
          it('should return false', function() {
            var run = false
            var result = e.each(function() { run = true; return false })
            if (run) expect(result).to.equal(false)
          })
          it('should not call the callback anymore', function() {
            var callCount = 0
            e.each(function() { callCount += 1; return false })
            expect(callCount).not.to.be.greaterThan(1)
          })
        })
      })
    }
  }
  
})
