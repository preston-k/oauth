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