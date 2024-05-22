/** @type {typeof import("./static.json")} */
const data = await fetch("/static.json").then((x) => x.json())

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
  const urlParams = new URLSearchParams(window.location.search);
  let target = urlParams.get('redir');
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


let ratelimitCookie = document.cookie.split(';').find(row => row.startsWith('ratelimit='))
if (ratelimitCookie) {
  ratelimitCookie = ratelimitCookie.split('=')[1]
} else {
  ratelimitCookie = null
}
console.log(ratelimitCookie)
if (ratelimitCookie == null) {
  document.cookie = 'ratelimit=0; max-age=300; path=/'
}
if (ratelimitCookie >= 5) {
  // Rate limiting in place
  document.querySelector('#formdiv').remove()
  document.querySelector('#resetlink').remove()
  document.querySelector('#blocked-parent').style.display = 'flex'
  let currentTime = new Date()
  let fiveminutes = new Date(currentTime.getTime() + 5 * 60000)
  localStorage.setItem('ratelimit', fiveminutes)
  ratelimit()
}
