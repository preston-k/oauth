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
// Initialize User Information
function denyaccess() {
  document.getElementById('center').style.display = 'none'
  document.getElementById('desktopTools').style.display = 'none'
  document.getElementById('mobileTool').style.display = 'none'
  // document.getElementById('logOutBut').style.display = 'none'
  document.getElementById('center').style.height = '0'
  document.getElementById('center').style.width = '0'
  document.getElementById('noperms').style.display = 'block'
}
function getCookie(name) {
  let cookieArr = document.cookie.split(';')
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split('=')
    if (name === cookiePair[0].trim()) {
      return cookiePair.slice(1).join('=')
    }
  }
  console.log('Cookie not found')
}
let ipCookie = ''
let idCookie = ''
let tsCookie = ''
let statusCookie = ''
let eCookie = ''
const urlParams = new URLSearchParams(window.location.search)
async function checkAuthStat() {
  let cookieData = getCookie('auth-token')
  let cookieUrl = new URL('https://oauth.prestonkwei.com/account')
  cookieUrl.search = cookieData
  let ipCookie = cookieUrl.searchParams.get('ip')
  let idCookie = cookieUrl.searchParams.get('id')
  let eCookie = cookieUrl.searchParams.get('e')
  let statusCookie = cookieUrl.searchParams.get('e')
  let tsCookie = cookieUrl.searchParams.get('ts')
  console.log(ipCookie, idCookie, tsCookie, statusCookie, eCookie)
  firebase
    .database()
    .ref(`auth-tokens/${idCookie}`)
    .once('value')
    .then((snapshot) => {
      const data = snapshot.val()
      if (data) {
        const { id, ts, email, status, ip } = data
        if (ip == ipCookie) {
          if (ts == tsCookie) {
            if (email == eCookie) {
              if (id == idCookie) {
                if (urlParams.get('e') != eCookie) {
                  // denyaccess()
                }
              }
            }
          }
        }
      } else {
        denyaccess()
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}
checkAuthStat()
let useremail = ''
let userid = ''
function urlparam() {
  const urlParams = new URLSearchParams(window.location.search)
  let userId = urlParams.get('id')
  if (userId != null) {
    console.log('UserID: ' + userId)
  } else {
    console.log('USERID BLANK')
    denyaccess()
  }
}
urlparam()
function logoutmod(reason) {
  document.getElementById('center').style.display = 'none'
  document.getElementById('overlay').style.display = 'none'
  document.getElementById('mobileTool').style.display = 'none'
  console.log('URL Issue Detected')
  let modal = new bootstrap.Modal(document.getElementById('loggedoutmod'), {
    backdrop: 'static',
    keyboard: false,
  })
  modal.show()
  document.getElementById('errorp').innerHTML = 'Error: ' + reason
}
function checkURL() {
  console.log('Checking URL')
  const urlParams = new URLSearchParams(window.location.search)
  let e = urlParams.get('e')
  let id = urlParams.get('id')
  console.log('URL CHECK INIT COMPLETE')
  if (e == null || e == '' || id == null || id == '') {
    logoutmod('Missing Perms')
  }
}
checkURL()
function tscheck() {
  const urlParams = new URLSearchParams(window.location.search)
  const timestampParam = urlParams.get('ts')

  if (timestampParam) {
    let decodedTimestamp = decodeURIComponent(timestampParam)
    const match = decodedTimestamp.match(
      /(\w{3})(\w{3})(\d{2})(\d{4})(\d{2}):(\d{2}):(\d{2})UTC([+-]\d{4})/
    )

    if (match) {
      const year = match[4]
      const month =
        'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(match[2]) / 3 + 1
      const day = match[3]
      const time = `${match[5]}:${match[6]}:${match[7]}`
      const timezone = match[8]
      const dateString = `${year}-${month
        .toString()
        .padStart(2, '0')}-${day}T${time}${timezone.slice(
        0,
        3
      )}:${timezone.slice(3)}`

      const urlTimestamp = new Date(dateString)
      const now = new Date()
      const diffInHours = (now - urlTimestamp) / (1000 * 60 * 60)

      if (Math.abs(diffInHours) > 6) {
        logoutmod('Token Expired')
      } else {
        console.log('Timestamp OK')
      }
    } else {
      console.log('Failed to parse timestamp:', timestampParam)
    }
  } else {
    console.log('No timestamp provided in the URL.')
    denyaccess()
  }
}

tscheck()

function onload() {
  console.log('Onload')
  const urlParams = new URLSearchParams(window.location.search)
  let emailParam = urlParams.get('e')
  if (emailParam) {
    let email = emailParam
    firebase
      .database()
      .ref('users/' + email + '/info')
      .once('value')
      .then(function (snapshot) {
        let userInfo = snapshot.val()
        if (userInfo) {
          document.getElementById('fnhtml').value = userInfo.fn
          document.getElementById('lnhtml').value = userInfo.ln
          if (userInfo.pfp == null) {} else {
            document.querySelector('#iconpng').src = `https://profilephotosprestonkwei.s3.us-east-2.amazonaws.com/pfp-${userInfo.pfp}.png`
            document.querySelector('#iconpng').style.border = '2px solid black'
          }
          console.log(`https://profilephotosprestonkwei.s3.us-east-2.amazonaws.com/pfp-${userInfo.pfp}.png`)
        } else {
          console.error('User info not found in database for email: ' + email)
        }
      })
      .catch(function (error) {
        console.error('Error fetching user info from database:', error)
      })
  } else {
    console.error('Email not found in URL parameters.')
  }
}

onload()
function updateInfo() {
  console.log('Update Info')
  let fnbox = document.getElementById('fnhtml').value
  let lnbox = document.getElementById('lnhtml').value
  const urlParams = new URLSearchParams(window.location.search)
  let emailParam = urlParams.get('e')

  if (!emailParam) {
    console.error('Email parameter not found in URL.')
    document.getElementById('progress').innerHTML =
      'Error! Your changes were not saved. Please try again.'
    document.getElementById('progress').style.color = 'red'
    setTimeout(() => {
      document.getElementById('progress').innerHTML = ''
    }, 3000)
    return
  }

  // Remove any whitespace and split the emailParam into parts if necessary
  const email = emailParam.trim()

  firebase
    .database()
    .ref('users/' + email + '/info/')
    .once('value', (snapshot) => {
      if (snapshot.exists()) {
        firebase
          .database()
          .ref('users/' + email + '/info/')
          .update({
            fn: fnbox,
            ln: lnbox,
          })
          .then(() => {
            document.getElementById('progress').innerHTML =
              'Success! Your changes have been saved!'
            setTimeout(() => {
              document.getElementById('progress').innerHTML = ''
            }, 3000)
          })
          .catch((error) => {
            console.error('Error updating user info:', error)
            document.getElementById('progress').innerHTML =
              'Error! Your changes were not saved. Please try again.'
            document.getElementById('progress').style.color = 'red'
            setTimeout(() => {
              document.getElementById('progress').innerHTML = ''
            }, 3000)
          })
      } else {
        console.error('User info not found for email:', email)
        document.getElementById('progress').innerHTML =
          'Error! Your changes were not saved. Please try again.'
        document.getElementById('progress').style.color = 'red'
        setTimeout(() => {
          document.getElementById('progress').innerHTML = ''
        }, 3000)
      }
    })
}

function logout() {
  document.cookie = 'loggedin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie
    .split(';')
    .forEach(
      (c) =>
        (document.cookie =
          c.trim().split('=')[0] +
          '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/')
    )
  window.location.replace('/')
}

document.querySelector('#policylink').addEventListener('click', () => {
  location.replace('https://legal.prestonkwei.com/policies/pick')
})

document.addEventListener('sendpfp', async (event) => {
  console.log('Sendpfp')
  console.log('Data:', event.detail)
  await database.ref('users/' + urlParams.get('e') + '/info/').update({
    pfp: event.detail,
  })
  location.reload()
})
function dangerOverlay() {
  document.querySelector('#center').style.display = 'none'
  // document.querySelector('#overlay-grey').style.opacity = 0
  // document.querySelector('#overlay-grey').style.pointerEvents = 'none'
  document.querySelector('#danger-confirm-hold').style.display = 'flex'
  document.querySelector('#overlay-grey').style.display = 'block'
  document.querySelector('#danger-confirm').style.display = 'block'
  document.querySelector('#danger-exit').style.display = 'block'
}
function dangerOverlayHide() {
  document.querySelector('#center').style.display = 'block'
  // document.querySelector('#overlay-grey').style.opacity = 1
  // document.querySelector('#overlay-grey').style.pointerEvents = 'auto'
  document.querySelector('#danger-confirm-hold').style.display = 'none'
  document.querySelector('#overlay-grey').style.display = 'none'
  document.querySelector('#danger-confirm').style.display = 'none'
  document.querySelector('#danger-exit').style.display = 'none'
}
document.querySelector('#danger-exit').addEventListener('click', () => {
  dangerOverlayHide()
})
let textvalue = ''
document.querySelector('#danger-deletepfp').addEventListener('click', () => {
  console.log('Delete PFP')
  textvalue = 'deletepfp'
  document.querySelector('#danger-confirm-textbox').value = ''
  document.querySelector('#danger-confirm-about').innerHTML = 'delete your profile picture'
  document.querySelector('#danger-confirm-type').innerHTML = textvalue
  document.querySelector('#danger-confirm-textbox').placeholder = textvalue
  dangerOverlay()
  document.querySelector('#danger-confirm-textbox').addEventListener('input', () => {
    console.log(document.querySelector('#danger-confirm-textbox').value)
    if (document.querySelector('#danger-confirm-textbox').value === textvalue) {
      document.querySelector('#danger-proceed').disabled = false
    } else {
      document.querySelector('#danger-proceed').disabled = true
    }
  })
})

document.querySelector('#danger-confirm-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  console.log('Form Submitted')
  dangerOverlayHide()
  if (textvalue == 'deletepfp') {
    const snapshot = await firebase.database().ref(`users/${urlParams.get('e')}/info/pfp`).once('value')
    let value = snapshot.val()
    console.log(value)
    let ts = new Date()
    let newPfp = firebase.database().ref(`users/${urlParams.get('e')}/info/oldpfps/${ts.toString()}/`)
    await newPfp.set(value)
    await firebase.database().ref(`users/${urlParams.get('e')}/info/pfp`).remove()
    alert('Success! We have successfully deleted your profile picture. Upload a new one by clicking on the profile photo placeholder.')
    window.location.replace(window.location.href)
  }
})