var hours = document.querySelector('.hours')
var minutes = document.querySelector('.minutes')
var seconds = document.querySelector('.seconds')

function clock() {
  var today = new Date()
  var h = today.getHours() % 12 + today.getMinutes() / 60
  var m = today.getMinutes() + today.getSeconds() / 60
  var s = today.getSeconds()
  h *= 30
  m *= 6
  s *= 6
  hours.style.transform = 'rotate(' + h + 'deg)'
  minutes.style.transform = 'rotate(' + m + 'deg)'
  seconds.style.transform = 'rotate(' + s + 'deg)'
  setTimeout(clock, 500)
}
clock()
