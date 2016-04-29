'use strict';
const Noun = require('../noun');
const to_number = require('./to_number');
const to_text = require('./to_text');
const units = require('./units');
const nums = require('../../../data/numbers');
const fns = require('../../../fns');
//get an array of ordinal (first, second...) numbers
let ordinals = Object.assign({}, nums.ordinal_ones, nums.ordinal_teens, nums.ordinal_tens, nums.ordinal_multiples);
ordinals = Object.keys(ordinals);

class Value extends Noun {
  constructor(str, tag) {
    super(str);
    this.tag = tag;
    this.pos['Value'] = true;
    this.number = null;
    this.unit = null;
    this.unit_name = null;
    this.measurement = null;
    // this.text = str;
    // this.normal = str;
    if (this.is_ordinal()) {
      this.pos['Ordinal'] = true;
    }
    this.parse();
  }

  is_ordinal() { //todo: make this clever.
    //1st
    if (this.normal.match(/^[0-9]+(rd|st|nd|th)$/)) {
      return true;
    }
    //first, second...
    for(let i = 0; i < ordinals.length; i++) {
      if (fns.endsWith(this.normal, ordinals[i])) {
        return true;
      }
    }
    return false;
  }

  //turn an integer like 22 into '22nd'
  to_ordinal(num) {
    num = '' + num;
    //fail safely
    if (!num.match(/[0-9]$/)) {
      return num;
    }
    if (fns.endsWith(num, '1')) {
      return num + 'st';
    }
    if (fns.endsWith(num, '2')) {
      return num + 'nd';
    }
    if (fns.endsWith(num, '3')) {
      return num + 'rd';
    }
    return num + 'th';
  }

  normalize() {
    let str = '' + (this.number || '');
    if (this.is_ordinal()) {
      str = this.to_ordinal(str);
    }
    if (this.unit) {
      str += ' ' + this.unit;
    }
    return str;
  }

  root() {
    let str = this.number;
    if (this.unit) {
      str += ' ' + this.unit;
    }
    return str;
  }

  is_unit(s) {
    if (units[s]) {
      return true;
    }
    s = s.toLowerCase();
    if (nums.prefixes[s]) {
      return true;
    }
    //try singular version
    s = s.replace(/s$/); //ew
    if (units[s]) {
      return true;
    }

    return false;
  }

  parse() {
    let words = this.text.toLowerCase().split(' ');
    let number_words = {
      minus: true,
      point: true
    };
    let numbers = '';
    //seperate number-words from unit-words
    for(let i = 0; i < words.length; i++) {
      let w = words[i];
      if (w.match(/[0-9]/) || number_words[w]) {
        numbers += ' ' + w;
      } else if (nums.ones[w] || nums.teens[w] || nums.tens[w] || nums.multiples[w]) {
        numbers += ' ' + w;
      } else if (nums.ordinal_ones[w] || nums.ordinal_teens[w] || nums.ordinal_tens[w] || nums.ordinal_multiples[w]) {
        numbers += ' ' + w;
      } else if (this.is_unit(w)) { //optional units come after the number
        this.unit = w;
        if (units[w]) {
          this.measurement = units[w].category;
          this.unit_name = units[w].name;
        }
      }
    }
    numbers = numbers.trim();
    this.number = to_number(numbers);
  }

  textual() {
    return to_text(this.number);
  }

}
Value.fn = Value.prototype;
module.exports = Value;

// console.log(new Value('twenty first').normalize());
