
define(function(require) {

  /**
   * Checks if the browser support this audio type.
   * (createjs sound getCapability not working)
   */
  function checkType(type) {
    // http://stackoverflow.com/questions/8469145/how-to-detect-html5-audio-mp3-support
    var a = document.createElement('audio')
    return !!(a.canPlayType && a.canPlayType(type).replace(/no/, ''))
  }

  function getPreferredType() {
    var mp3 = checkType('audio/mpeg;')
    var ogg = checkType('audio/ogg; codecs="vorbis"')
    if (mp3) return { extension: 'mp3', mime: 'audio/mpeg' }
    if (ogg) return { extension: 'ogg', mime: 'audio/ogg' }
    return null
  }

  return { getPreferredType: getPreferredType }

})
