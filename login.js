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
let ratelimitCookie = parseInt(
  document.cookie.replace(
    /(?:(?:^|.*;\s*)ratelimit\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  ),
  10
)
console.log(ratelimitCookie)
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
let cd = null
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
  ;``
  return cd
}

let hashPass = ''

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
    // SUCCESS!
    // ENDING -- NOTHING ELSE SHOULD HAPPEN PAST THIS POINT:
    document.cookie =
      'auth-token=id=' +
      uuidAuthToken +
      '&ip=' +
      ipAuthToken +
      '&ts=' +
      tsAuthToken +
      '&status=' +
      statusAuthToken +
      '&e=' +
      emailAuthToken +
      '; expires=' +
      expiration.toUTCString()
    console.log('Auth Token Created!')
  } catch (error) {
    ipAuthToken = 'ERROR'
  }
}

let finalRedir = null
document.addEventListener('DOMContentLoaded', (event) => {
  document
    .getElementById('loginform')
    .addEventListener('submit', async function login(event) {
      event.preventDefault()
      console.log('Logging In')
      let newRate = parseInt(ratelimitCookie) + 1
      document.cookie
        .split(';')
        .forEach(
          (c) =>
            (document.cookie =
              c.trim().split('=')[0] +
              '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/')
        ) // CLEAR ALL COOKIES
      document.cookie = `ratelimit=${newRate}; max-age=300; path=/`
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
            console.log('Rate Limit: ' + ratelimitCookie)
            let newrate = parseInt(ratelimitCookie) + 1
            // alert(newrate)
            document.cookie = `ratelimit=${newrate}; max-age=300; path=/`
            createCookie('loggedin=true', uid, 0.1666666)
            if (target != null) {
              window.location.replace(
                target +
                  '?id=' +
                  uid +
                  '&e=' +
                  firebaseEmail +
                  '&s=true' +
                  '&ts=' +
                  time
              )
            } else {
              const urlParams = new URLSearchParams(window.location.search)
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
                    // return Math.random() < 0.15
                    return false
                  }
                }
                if (prompt2FA()) {
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
                  localStorage.setItem('newdevice', false)
                  window.location.replace(
                    '/account.html?id=' +
                      uid +
                      '&e=' +
                      firebaseEmail +
                      '&s=true' +
                      '&ts=' +
                      time
                  )
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
        //alert('An error occurred, please try again.')
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
          window.location.replace(
            '/account.html?id=' + useruuid + '&e=' + firebaseEmail + '&ts='
          )
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
