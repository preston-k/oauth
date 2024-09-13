/** @type {typeof import("./static.json")} */
const data = await fetch("/static.json").then((x) => x.json())
if (window.location.href.includes('oauth.prestonkwei.com')) {
  console.log = function() {}
}
const urlParams = new URLSearchParams(window.location.search);
let version = data.version
let sessid = self.crypto.randomUUID();
document.getElementById("static").innerHTML = 'Version ' + version + ' · ' + 'Session ID: ' + sessid;
function makeCookie(cname, cvalue, days) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
} 

let finalRedir =  null
function urlparam() {
  const urlParams = new URLSearchParams(window.location.search)
  let target = urlParams.get('redir')
  if (target != null) {
    finalRedir = target
    document.getElementById('redirP').innerHTML = 'After logging in, you will be redirected to ' + '<u>' + target + '</u>'
  } else {
    finalRedir = null
    document.getElementById('redirP').innerHTML = 'You are logging in to <u>account management</u>.'
  }
}
urlparam()
console.log(finalRedir)
let cookies = document.cookie.split(';')
let ratelimit = null
for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim()
    if (cookie.startsWith('ratelimit=')) {
        ratelimit = cookie.substring('ratelimit='.length)
        break
    }
}
if (ratelimit == null || isNaN(parseInt(ratelimit))) {
  ratelimit = '0'
  document.cookie = `ratelimit=${ratelimit}; max-age=300; path=/`
}
console.log(ratelimit)

if (ratelimit >= 5) {
  document.querySelector('#loginform').innerHTML = ''
  document.querySelector('#resetlink').innerHTML = ''
  document.querySelector('#blocked-parent').style.display = 'flex'
}
document.querySelector('#ratelimit-why').addEventListener('click', () => {
  alert('Why was I rate limited?\n\nYou were ratelimited because you have created too many login attempts, too fast. This is to protect our user\'s accounts, and to prevent abuse on our sites.')
})
console.log(localStorage.getItem('beenonsitebefore'))
if (localStorage.getItem('beenonsitebefore') == null) {
  localStorage.setItem('beenonsitebefore', 'true')
} else if (localStorage.getItem('beenonsitebefore') != 'true') {
  localStorage.setItem('beenonsitebefore', 'true')
}

if (urlParams.get('snackbar') == 'loggedout') {
  if (localStorage.getItem('beenonsitebefore') == 'true') {
    document.querySelector('#loggedout-notif').style.display = 'block'
  }
}
document.querySelector('#loggedoutnotif-x').addEventListener('click', () => {
  document.querySelector('#loggedout-notif').style.display='none'
  window.location.replace('/')
})

let deviceId = self.crypto.randomUUID()
let storedDeId = localStorage.getItem('oauthDeviceId')
console.log(storedDeId)
console.log(89)
if (storedDeId = null || storedDeId == '' || storedDeId == undefined) {
  localStorage.setItem('oauthDeviceId', deviceId)
}

if (window.location.href.includes('.com')) {
  const url = window.location.href
  const baseUrl = window.location.origin + window.location.pathname

  if (baseUrl.endsWith('.html')) {
    const newUrl = baseUrl.slice(0, -5) + window.location.search + window.location.hash
    window.history.pushState({}, '', newUrl)
  }
}
