
var fs = require('fs')
var name = process.argv[2]
var out = name + '.pak'
var crypto = require('crypto')

console.log('out', out)
var fd = fs.openSync(out, 'w')
var offset = 0
var json = [ ]
var hash = crypto.createHash('sha1')

process.argv.slice(3).forEach(function(file) {
  var buffer = fs.readFileSync(file)
  var start = offset
  var end = start + fs.writeSync(fd, buffer, 0, buffer.length)
  var info = { file: file, start: start, end: end }
  offset = end
  console.log('file', info.file, info.start, info.end)
  hash.update(buffer)
  json.push(info)
})

var digest = hash.digest('hex')
console.log('hash', digest)
var out2 = name + '-' + digest + '.pak'
fs.renameSync(out, out2)
fs.writeFileSync(name + '.json', JSON.stringify({ pak: out2, files: json }), 'utf-8')

