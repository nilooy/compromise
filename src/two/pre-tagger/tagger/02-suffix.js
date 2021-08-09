import setTag from './_setTag.js'

//sweep-through all suffixes
const suffixLoop = function (str = '', suffixes = []) {
  const len = str.length
  let max = 7
  if (len <= max) {
    max = len - 1
  }
  for (let i = max; i > 1; i -= 1) {
    let suffix = str.substr(len - i, len)
    if (suffixes[suffix.length].hasOwnProperty(suffix) === true) {
      let tag = suffixes[suffix.length][suffix]
      return tag
    }
  }
  return null
}

// decide tag from the ending of the word
const tagBySuffix = function (term, model) {
  if (term.tags.size === 0) {
    let tag = suffixLoop(term.normal, model.two.suffixPatterns)
    if (tag !== null) {
      setTag(term, tag, 'suffix')
      return true
    }
    // try implicit form of word, too
    if (term.implicit) {
      tag = suffixLoop(term.implicit, model.two.suffixPatterns)
      if (tag !== null) {
        setTag(term, tag, 'implicit-suffix')
        return true
      }
    }
  }
  return null
}
export default tagBySuffix
