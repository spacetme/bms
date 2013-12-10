
define(function(require) {
  
  var ObjectPool = require('object_pool')
  var expect = require('chai').expect

  return function() {

describe('ObjectPool', function() {
  
  var pool, instances

  beforeEach(function() {

    instances = []

    function MyClass() {
      this.set = function(data) {
        this.data = data
        this.inactive = false
      }
      this.deactivate = function() {
        this.inactive = true
      }
      this.get = function() {
        return this.data
      }
      instances.push(this)
    }

    MyClass.hashKey = function(data) {
      return data.key
    }

    pool = new ObjectPool(MyClass)

  })

  it('should create a new object when asked', function() {
    pool.begin()
    var a = pool.use({ key: 'a' })
    var b = pool.use({ key: 'b' })
    expect(a.get().key).to.equal('a')
    expect(b.get().key).to.equal('b')
    pool.commit()
    expect(instances[0].get().key).to.equal('a')
    expect(instances[1].get().key).to.equal('b')
  })

  it('should deactivate old object when unused', function() {
    pool.update(function(use) {
      use({ key: 'a' })
    })
    pool.update(function(use) { })
    expect(instances[0].inactive).to.equal(true)
  })

  it('should return same instance for old key', function() {
    var a
    pool.update(function(use) {
      a = use({ key: 'a', lol: 1 })
    })
    expect(a.get().lol).to.equal(1)
    pool.update(function(use) {
      use({ key: 'a', lol: 3 })
    })
    expect(instances.length).to.equal(1)
    expect(a.get().lol).to.equal(3)
  })

  it('should reuse instances', function() {
    pool.update(function(use) {
      use({ key: 'a' })
    })
    pool.update(function(use) { })
    pool.update(function(use) {
      use({ key: 'b' })
    })
    expect(instances.length).to.equal(1)
    expect(instances[0].inactive).to.equal(false)
    expect(instances[0].get().key).to.equal('b')
  })

})

  }

})
