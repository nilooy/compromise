/* eslint no-console: 0 */
const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}
const fns = {
  /** add a given tag, to all these terms */
  tag: function (input, reason = '', isSafe) {
    if (!this.found || !input) {
      return this
    }
    let terms = this.termList()
    if (terms.length === 0) {
      return this
    }
    const { methods, verbose, world } = this
    // logger
    if (verbose === true) {
      console.log(' +  ', input, reason || '')
    }
    if (isArray(input)) {
      input.forEach(tag => methods.one.setTag(terms, tag, world, isSafe, reason))
    } else {
      methods.one.setTag(terms, input, world, isSafe, reason)
    }
    // uncache
    this.uncache()
    return this
  },

  /** add a given tag, only if it is consistent */
  tagSafe: function (input, reason = '') {
    return this.tag(input, reason, true)
  },

  /** remove a given tag from all these terms */
  unTag: function (input, reason) {
    if (!this.found || !input) {
      return this
    }
    let terms = this.termList()
    if (terms.length === 0) {
      return this
    }
    const { methods, verbose, model } = this
    // logger
    if (verbose === true) {
      console.log(' -  ', input, reason || '')
    }
    let tagSet = model.one.tagSet
    if (isArray(input)) {
      input.forEach(tag => methods.one.unTag(terms, tag, tagSet))
    } else {
      methods.one.unTag(terms, input, tagSet)
    }
    // uncache
    this.uncache()
    return this
  },

  /** return only the terms that can be this tag  */
  canBe: function (tag) {
    let tagSet = this.model.one.tagSet
    // everything can be an unknown tag
    if (!tagSet.hasOwnProperty(tag)) {
      return this
    }
    let not = tagSet[tag].not || []
    let nope = []
    this.document.forEach((terms, n) => {
      terms.forEach((term, i) => {
        let found = not.find(no => term.tags.has(no))
        if (found) {
          nope.push([n, i, i + 1])
        }
      })
    })
    let noDoc = this.update(nope)
    return this.difference(noDoc)
  },
}
export default fns
