const firebaseConfig = {
  apiKey: 'AIzaSyB-ZYqrpT04a5zOkB5uQYK3lE3CuMhkhC8',
  authDomain: 'oauth-page-ad3c2.firebaseapp.com',
  databaseURL: 'https://oauth-page-ad3c2-default-rtdb.firebaseio.com',
  projectId: 'oauth-page-ad3c2',
  storageBucket: 'oauth-page-ad3c2.appspot.com',
  messagingSenderId: '401481049573',
  appId: '1:401481049573:web:f1f9ca852e96d580cf3b0c',
}
firebase.initializeApp(firebaseConfig)

let database = firebase.database()
// DO NOT EDIT ANYTHING ABOVE^^^
const urlParams = new URLSearchParams(window.location.search)
let goto = ''
if (urlParams.get('redir') != null) {
  goto = urlParams.get('redir')
  sessionStorage.setItem('target', goto)
}

console.log('target added')
console.log(sessionStorage.getItem('target'))
function rateLimit() {
  let c = document.cookie.split(';')
  let rl = null
  for (let i = 0; i < c.length; i++) {
    let cookie = c[i].trim()
    if (cookie.startsWith('ratelimit=')) {
      rl = cookie.substring('ratelimit='.length)
      break
    }
  }
  rl = parseInt(rl)
  if (isNaN(rl)) {
    rl = 0
  }
  console.log(rl)
  let newRateLimit = rl + 1
  document.cookie = `ratelimit=${newRateLimit}; max-age=300; path=/`
}

function createCookie(name, value, days) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + value + expires + '; path=/'
  console.log('Cookie Created: ' + name + value + expires)
}

function readCookie(cookieName) {
  const nameEQ = cookieName + '='
  const cookiesArray = document.cookie.split(';')
  let cd = null
  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEQ) === 0) {
      cd = cookie.substring(nameEQ.length, cookie.length)
      break
    }
  }
  return cd
}

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

let d = new Date().toString().replace(/ /g, '').replace(/GMT/g, 'UTC')
let ipAuthToken = ''
let emailAuthToken = ''
let tsAuthToken = ''
let statusAuthToken = true
let uuidAuthToken = self.crypto.randomUUID()
async function authToken(email) {
  console.log('Creating Auth Token')
  let tsAuthToken = Math.floor(Date.now() / 1000)
  emailAuthToken = email
  let expiration = new Date(Date.now() + 6 * 60 * 60 * 1000)
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    ipAuthToken = data.ip
    console.log(ipAuthToken)
    await database.ref('auth-tokens/' + uuidAuthToken).update({
      id: uuidAuthToken,
      status: statusAuthToken,
      ts: tsAuthToken,
      email: emailAuthToken,
      ip: ipAuthToken,
    })
    document.cookie = 'auth-token=id=' + uuidAuthToken + '&ip=' + ipAuthToken + '&ts=' + tsAuthToken + '&status=' + statusAuthToken + '&e=' + emailAuthToken + '; expires=' + expiration.toUTCString()
    console.log('Auth Token Created!')
  } catch (error) {
    ipAuthToken = 'ERROR'
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('loginform').addEventListener('submit', async function login(event) {
      event.preventDefault()
      console.log('Logging In')
      document.querySelector('#login-loader-box').style.display = 'flex'
      // document.cookie.split(';').forEach((c) => (document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/')) // DELETING ALL COOKIES
      rateLimit()
      let emailInput = document.getElementById('email')
      let passwordInput = document.getElementById('password')
      emailInput.disabled = true
      passwordInput.disabled = true

      let email = emailInput.value.toLowerCase()
      let pw = passwordInput.value
      let firebaseEmail = email.replace(/\./g, ',').replace(/@/g, '_')

      try {
        console.log(100)
        const hashedInputPassword = await hashPassword(pw)

        const snapshot = await database
          .ref('users/' + firebaseEmail)
          .once('value')
        if (snapshot.exists()) {
          let userData = snapshot.val()
          if (userData.pw === hashedInputPassword) {
            let uid = userData.id
            const urlParams = new URLSearchParams(window.location.search)
            let target = urlParams.get('redir')
            let d = new Date()
            let time = d.getTime()
            createCookie('loggedin=true', uid, 0.1666666)
            if (target != null) {
              window.location.replace(target + '?id=' + uid + '&e=' + firebaseEmail + '&s=true' + '&ts=' + time)
            } else {
              await authToken(email)
              let force2fa = urlParams.get('f2fa')
              console.log('Force 2FA: ' + force2fa)
              if (force2fa == 'true') {
                localStorage.setItem('sent-2fa', true)
                localStorage.setItem('newdevice', false)
                window.location.replace(
                  'https://emailserver.prestonkwei.com/referrer?id=' +
                    uid +
                    '&e=' +
                    firebaseEmail +
                    '&s=true' +
                    '&ts=' +
                    time
                )
              } else {
                function prompt2FA() {
                  let newDevice = localStorage.getItem('newdevice')
                  if (newDevice != 'false') {
                    console.log('False')
                    return true
                  } else {
                    return false
                  }
                }
                if (prompt2FA()) {
                  localStorage.setItem('sent-2fa', true)
                  localStorage.setItem('newdevice', false)
                  window.location.replace(
                    'https://emailserver.prestonkwei.com/referrer?id=' + uid + '&e=' + firebaseEmail + '&s=true' + '&ts=' + time
                  )
                } else {
                  localStorage.setItem('newdevice', false)
                  window.location.replace( '/account.html?id=' + uid + '&e=' + firebaseEmail + '&s=true' + '&ts=' + time)
                }
              }
            }
          } else {
            const userRef = database.ref('users/' + firebaseEmail)
            let fa = 0
            await userRef.once('value', (snapshot) => {
              const userData = snapshot.val()
              if (userData && userData.failedAttempts != null) {
                fa = userData.failedAttempts + 1
              } else {
                fa = 1
              }
            })
            await userRef.update({ failedAttempts: fa })
            alert('Incorrect Email or Password')
            window.location.replace('/login?f2fa=true')
          }
        } else {
          alert('Incorrect Email or Password')
          window.location.replace('/login')
        }
      } catch (error) {
        console.error('Error during login:', error)
        alert(error)
        window.location.reload()
      } finally {
        emailInput.disabled = false
        passwordInput.disabled = false
      }
    })
})

let captchaStatus = false

let useruuid = self.crypto.randomUUID()
document.addEventListener('DOMContentLoaded', (event) => {
  document
    .getElementById('signupform')
    .addEventListener('submit', async function (event) {
      event.preventDefault()
      console.log('Signing Up')
      document.querySelector('#login-loader-box').style.display = 'flex'
      document.cookie
        .split(';')
        .forEach(
          (c) =>
            (document.cookie =
              c.trim().split('=')[0] +
              '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/')
        )
      document.getElementById('signupemail').disabled = true
      document.getElementById('signuppw').disabled = true
      let email = document.getElementById('signupemail').value
      let pw = document.getElementById('signuppw').value
      let firebaseEmail = email.replace(/\./g, ',').replace(/@/g, '_')
      try {
        const snapshot = await database
          .ref('users/' + firebaseEmail)
          .once('value')
        if (snapshot.exists()) {
          alert('Email already in system. Please login.')
        } else {
          const hashedPassword = await hashPassword(pw)
          await database.ref('users/' + firebaseEmail).update({
            id: useruuid,
            pw: hashedPassword,
          })
          await database.ref('users/' + firebaseEmail + '/info').update({
            fn: '',
            ln: '',
          })
          await authToken(email)
          createCookie('loggedin=true', useruuid, 0.1666666)
          let savedTarget = sessionStorage.getItem('target')
          console.log(savedTarget)
          if (savedTarget != null) {
            sessionStorage.removeItem('target')
            window.location.replace(savedTarget + '?id=' + useruuid + '&e=' + firebaseEmail)
          } else {
            window.location.replace('/account.html?id=' + useruuid + '&e=' + firebaseEmail + '&ts=')
          }
          
        }
      } catch (error) {
        console.error('Error:', error)
        alert('An error occurred, please try again.')
      } finally {
        document.getElementById('signupemail').disabled = false
        document.getElementById('signuppw').disabled = false
      }
    })
})
function resetKnown() {
  preventDefault()
  console.log('Reset-Known')
}
let shapeGuide = {0:'Circle-Green', 1:'Circle-Purple', 2:'Circle-Yellow',3:'Octagon-Green', 4:'Octagon-Purple', 5:'Octagon-Red', 6:'Square-Blue', 7:'Square-Green', 8:'Square-Orange', 9:'Star-Blue', 10:'Star-Red', 11:'Star-Yellow', 12:'Trapezoid-Blue', 13:'Trapezoid-Green', 14:'Trapezoid-Orange', 15:'Triangle-Blue', 16:'Triangle-Green', 17:'Triangle-Red'}
let emailSelect
async function passwordlessLogin(event) {
  event.preventDefault()
  document.querySelector('#noPw-step2').style.display = 'flex'
  let shape = Math.floor((Math.random()*18))
  let shapeId = shapeGuide[shape]
  console.log(`https://cdn.prestonkwei.com/${shapeId}.png`)
  document.querySelector('#login-shape').src = `https://cdn.prestonkwei.com/2fa-shapes/${shapeId}.png`
  document.querySelector('#shape-id').innerHTML = shapeId
  let unshuffled = [shapeGuide[Math.floor((Math.random()*18))], shapeId, shapeGuide[Math.floor((Math.random()*18))]]
  let shuffled = unshuffled.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)
  console.log(shuffled)
  let linkid = self.crypto.randomUUID()
  let userId
  let loginLink = `https://oauth.prestonkwei.com/loginv2?now=1&id=${linkid}`
  await database.ref(`users/${document.querySelector('#noPwEmailbox').value.replace(/@/g, '_').replace(/\./g, ',')}/id`).once('value').then(snapshot => {
    console.log(snapshot.val())
    userId = snapshot.val()
  })
  let expiration = Date.now() + 900000
  database.ref(`noPw/${linkid}`).update({
    email: document.querySelector('#noPwEmailbox').value.replace(/@/g, '_').replace(/\./g, ','),
    uId: userId,
    status: 'unused',
    expires: expiration
  })
  database.ref(`noPw/${linkid}/shapes`).update({
    list: shuffled,
    correct: shapeId
  })
  const data = new FormData()
  data.set('sendto', document.querySelector('#noPwEmailbox').value)
  data.set('subject', 'Finish Logging In!')
  data.set('content', `Please finish logging in by clicking this link: ${loginLink}. For your security, this link will expire in 15 minutes. \n \n \nExp: ${expiration}, ID: ${linkid}`)
  fetch('https://emailserver.prestonkwei.com/email', {
    method: "post",
    body:data,
  }).catch(()=>{})
  // Wait for database
  database.ref(`noPw/${linkid}/status`).on('value', async function(snapshot) {
    console.log(snapshot.val())
    if (snapshot.val() == 'sucess') {
      await authToken(document.querySelector('#noPwEmailbox').value.replace(/@/g, '_').replace(/\./g, ','))
      window.location.replace(`/account.html?id=${userId}&e=${document.querySelector('#noPwEmailbox').value.replace(/@/g, '_').replace(/\./g, ',')}&s=true&ts=${Date.now()}`)
    }
  })
}
document.querySelector('#noPwLogin').addEventListener('submit', passwordlessLogin)
if (window.location.pathname == '/loginv2.html' || window.location.pathname == '/loginv2') {
  console.log(window.location.pathname)
  if (urlParams.get('now') == 1 && urlParams.get('id') != '' && urlParams.get('id') != null) {
    document.querySelector('#noPw-step2').innerHTML = ''
    document.querySelector('#noPwLogin').innerHTML = ''
    document.querySelector('#noPw-email').style.display = 'block'
    // LOGIN PART
    database.ref(`noPw/${urlParams.get('id')}`).once('value').then(snapshot => {
      if (snapshot.val() == null) {
        console.log('no data')
        return
      } else {
        console.log(snapshot.val())
        let data = snapshot.val()
        let list = data['shapes']['list']
        document.querySelector('#shape1-img').src = `https://cdn.prestonkwei.com/2fa-shapes/${list[0]}.png`
        document.querySelector('#shape1-label').innerHTML = list[0]
        document.querySelector('#shape2-img').src = `https://cdn.prestonkwei.com/2fa-shapes/${list[1]}.png`
        document.querySelector('#shape2-label').innerHTML = list[1]
        document.querySelector('#shape3-img').src = `https://cdn.prestonkwei.com/2fa-shapes/${list[2]}.png`
        document.querySelector('#shape3-label').innerHTML = list[2]
        let correct = data['shapes']['correct']
        let correctId = data['shapes']['list'].indexOf(correct)+1
        document.querySelector('#shape1').addEventListener('click', () => {
          if (correctId == 1) {
            database.ref(`noPw/${urlParams.get('id')}`).update({
              status: 'sucess'
            })
            document.querySelector('#nopw-sucess').style.display = 'flex'
          } else {
            console.log('Incorrect Shape')
            window.location.replace('/loginv2.html')
          }
        })
        document.querySelector('#shape2').addEventListener('click', () => {
          if (correctId == 2) {
            database.ref(`noPw/${urlParams.get('id')}`).update({
              status: 'sucess'
            })
            document.querySelector('#nopw-sucess').style.display = 'flex'
          } else {
            console.log('Incorrect Shape')
            window.location.replace('/loginv2.html')
          }
        })
        document.querySelector('#shape3').addEventListener('click', () => {
          if (correctId == 3) {
            database.ref(`noPw/${urlParams.get('id')}`).update({
              status: 'sucess'
            })
            document.querySelector('#nopw-sucess').style.display = 'flex'
          } else {
            console.log('Incorrect Shape')
            window.location.replace('/loginv2.html')
          }
        })
      }
    })
  }
}