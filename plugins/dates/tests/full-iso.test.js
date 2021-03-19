const test = require('tape')
const nlp = require('./_lib')

test('full iso start+end tests', function (t) {
  let context = {
    timezone: 'Asia/Shanghai',
    today: '2021-02-19', //friday
    dayStart: '8:00am',
    dayEnd: '8:00pm',
  }
  let arr = [
    ['monday', '2021-02-22T08:00:00.000+08:00', '2021-02-22T20:00:00.000+08:00'],
    ['monday at 3pm', '2021-02-22T15:00:00.000+08:00', '2021-02-22T20:00:00.000+08:00'],
    ['monday 3pm to 5pm', '2021-02-22T15:00:00.000+08:00', '2021-02-22T17:00:00.000+08:00'],
    ['9am to 5pm', '2021-02-19T09:00:00.000+08:00', '2021-02-19T17:00:00.000+08:00'],
    ['9am to 5pm feb 26th', '2021-02-26T09:00:00.000+08:00', '2021-02-26T17:00:00.000+08:00'],
    ['9am to 5am', '2021-02-19T05:00:00.000+08:00', '2021-02-19T09:00:00.000+08:00'],
    ['4pm sharp on tuesday', '2021-02-23T16:00:00.000+08:00', '2021-02-23T20:00:00.000+08:00'],
    ['tuesday 4pm sharp', '2021-02-23T16:00:00.000+08:00', '2021-02-23T20:00:00.000+08:00'],
    ['tuesday 3:30 on the dot', '2021-02-23T15:30:00.000+08:00', '2021-02-23T20:00:00.000+08:00'],
  ]
  arr.forEach((a) => {
    let doc = nlp(a[0])
    let dates = doc.dates(context).get(0)
    t.equal(dates.start, a[1], '[start] ' + a[0])
    t.equal(dates.end, a[2], '[end] ' + a[0])
  })
  t.end()
})
