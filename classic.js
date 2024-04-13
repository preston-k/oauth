let current = document.getElementById('curPW')
let email = document.getElementById('resetEmail')
let newP = document.getElementById('newpass')
let compare = document.getElementById('confirmpass')
let newPwSpan = document.getElementById('newPW')
let noMatch = document.getElementById('nomatch')
let submitBut = document.getElementById('reset-known')
console.log(email.value)
newP.addEventListener('input', () => {
  if (newP.value == compare.value) {
    noMatch.style.display = 'none'
  } else {
    noMatch.style.display = 'block'
  }
})
compare.addEventListener('input', () => {
  if (newP.value == compare.value) {
    noMatch.style.display = 'none'
  } else {
    noMatch.style.display = 'block'
  }
})
current.addEventListener('input', () => {
  if (email.value != '') {
    if (email.value.includes('@') != false) {
      if (email.value.includes('.') != false) {
        newPwSpan.style.display = 'block'
        fullPw.style.display = 'none'
        submitBut.style.display = 'block'
      } else {
        fullPw.style.display = 'block'
      }
    } else {
      fullPw.style.display = 'block'
    }
  }
})
email.addEventListener('input', () => {
  if (current.value != '') {
    if (email.value.includes('@') != false) {
      if (email.value.includes('.') != false) {
        newPwSpan.style.display = 'block'
        fullPw.style.display = 'none'
        submitBut.style.display = 'block'
      } else {
        fullPw.style.display = 'block'
      }
    } else {
      fullPw.style.display = 'block'
    }
  }
})

let url = new URL(window.location.href);
let hostname = url.hostname;
let path = url.pathname;
console.log(url)
console.log(hostname)
console.log(path)
if (hostname != 'oauth.prestonkwei.com') {
  if (path.includes('.html')) {
    let newPath = path.replace('.html', '');
    window.location.replace('https://' + hostname + newPath);
    console.log(newPath)
  }
}
