
define(function(require) {

  var expect = require('chai').expect
  var guardModification = require('guard_modification')

  return function() {

describe('guardModification', function() {

  describe('when applied on object', function() {

    var obj

    beforeEach(function() {
      obj = { a: 1 }
      guardModification(obj, function(guard) {
        obj.x = guard(function() {
          obj.y = 2
          return 'lol'
        })
        return function after() {
          obj.z = 3
        }
      })
    })

    it('should not allow a guarded function to run', function() {
      expect(function() {
        obj.x()
      }).to.throw('apply')
      expect(obj.y).to.equal(undefined)
      expect(obj.z).to.equal(undefined)
    })

    it('should let a guarded function run when using apply', function() {
      obj.apply(function() {
        expect(obj.x()).to.equal('lol')
      })
      expect(obj.y).to.equal(2)
    })

    it('should call the after function after running apply', function() {
      obj.apply(function() {
        obj.x()
      })
      expect(obj.z).to.equal(3)
    })

    it('should not allow nested calls to modify', function() {
      expect(function() {
        obj.apply(function() {
          obj.apply(function() {
          })
        })
      }).to.throw('nested')
    })

    it('should not error when there is no after function', function() {
      var o = { }
      guardModification(o, function(guard) { })
      o.apply(function() { })
    })
    
  })
  
})

  }

})
