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
if (window.location.href.includes('oauth.prestonkwei.com')) {
  console.log = function() {}
}
let currentUrl = window.location.href
if (currentUrl.includes('%26')) {
  let updatedUrl = currentUrl.replace(/%26/g, '&')
  window.location.href = updatedUrl
}

const urlParams = new URLSearchParams(window.location.search)

let loginHint = urlParams.get('loginHint')
let ssoId = urlParams.get('sso')
console.log(loginHint)
console.log(ssoId)
if (loginHint == null || loginHint == '') {
  if (ssoId == null || ssoId == '') {
    document.querySelector('#instant-missingperms').style.display = 'block'
    document.querySelector('#instant-lander').style.display = 'none'
  }
}

let ssoConfirmed = false
let loginHintConfirmed = false
let userId = null
async function checkDatabase() {
  try {
    let snapshot = await database.ref(`sso/${ssoId}/`).once('value')
    const data = snapshot.val()
    let email = data?.email || null
    console.log(email)
    if (email != null && email == loginHint) {
      loginHintConfirmed = true
    } else {
      document.querySelector('#instant-missingperms').style.display = 'block'
      document.querySelector('#instant-lander').style.display = 'none'
    }

    snapshot = await database.ref(`sso/${ssoId}/`).once('value')
    const sso = data?.ssoId || null
    console.log(sso)
    if (sso != null && sso == ssoId) {
      ssoConfirmed = true
    } else {
      document.querySelector('#instant-missingperms').style.display = 'block'
      document.querySelector('#instant-lander').style.display = 'none'
    }
    snapshot = await database.ref(`sso/${ssoId}/`).once('value')
    const accid = data?.accUuid || null
    console.log(accid)
    userId = accid
    snapshot = await database.ref(`sso/${ssoId}/`).once('value')
    const expiration = data?.expires || null
    console.log(expiration)
    console.log(Date.now())
    if ((expiration - Date.now()) > 0) {
      if (ssoConfirmed) {
        console.log('ssoConfirmed')
        if (loginHintConfirmed) {
          console.log('loginHintConfirmed')
          // QR CODE AUTHENTICATED -- PROCEED WITH LOGIN, REDIRECT AND AUTHTOKEN
          document.querySelector('#instant-confirm-wrapper').style.display = 'flex'
          document.querySelector('#instant-lander').style.display = 'none'
          document.getElementById('instant-confirm-button').classList.add('buttonshade')
          setTimeout(() => {
            document.getElementById('instant-confirm-button').disabled = false
            document.getElementById('instant-confirm-button').style.cursor = 'pointer'
          }, '3000')
        }
      }
    } else {
      document.querySelector('#instant-missingperms').style.display = 'block'
      document.querySelector('#instant-lander').style.display = 'none'
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

checkDatabase()
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
    console.error('Error creating auth token:', error)
    ipAuthToken = 'ERROR'
    throw error
  }
}

document.querySelector('#instant-confirm-button').addEventListener('click', () => {
  console.log('Confirm Login')
  document.querySelector('#instant-confirm').style.display = 'none'
  document.querySelector('#confirm-loader').style.display = 'block'
  authToken(loginHint.replace(/_/g, '@').replace(/,/g, '.')).then(() => {
    let date = new Date()
    date.setTime(date.getTime() + (0.1666666 * 24 * 60 * 60 * 1000))
    let expires = 'expires=' + date.toUTCString()
    document.cookie = 'loggedin=true; userId=' + userId + '; ' + expires  
    window.location.replace(`/account.html?id=${userId}&e=${loginHint}&s=true&ts=${Date.now()}`)
  }).catch(error => {
    console.error('Login failed:', error)
    // Handle login failure, e.g., show an error message to the user
  })
})