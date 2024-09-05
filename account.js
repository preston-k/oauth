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

// Initialize User Information
let urlUserId
let urlEmail
sessionStorage.removeItem('target')
function denyaccess() {
  console.log('Access denied')
  // document.getElementById('center').innerHTML = ''
  // document.getElementById('desktopTools').innerHTML = ''
  // document.getElementById('mobileTool').innerHTML = ''
  // // document.getElementById('logOutBut').style.display = 'none'
  // document.getElementById('center').style.height = '0'
  // document.getElementById('center').style.width = '0'
  // document.getElementById('center').innerHTML = ''
  // document.querySelector('#main-content').innerHTML = ''
  // document.querySelector('#pfpstuff').innerHTML = ''
  // document.getElementById('noperms').style.display = 'block'
  
  document.querySelectorAll('div').forEach(div => div.innerHTML='')
  document.body.insertAdjacentHTML('beforeend', `<u><h1 id="ad"><b>Access Denied</b></h1></u> <h4>You don't have the required permissions to view this page.</h4> <div id="optionbox"> <a href="/" class="optiondiv-link"> <img class="optionimg" src="https://cdn.prestonkwei.com/backarrow.png"> <p>Go Back and Login</p> </a> <a href="https://prestonkwei.com" class="optiondiv-link"> <img class="optionimg" src="https://cdn.prestonkwei.com/home.png"> <p>Go To: PrestonKwei.com</p> </a> </div>`)
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
function showDiv(divId, displayType) {
  document.querySelectorAll('div').forEach(div => div.style.display = 'none')
  console.log('div:'+divId)
  console.log('display:'+displayType)
  if (window.innerWidth < 1000) {
    document.querySelector('#mobileTool').style.display = 'block'
  } else {
    document.querySelector('#desktopTool').style.display = 'block'
  }
  document.querySelector(divId).style.display = displayType
}
function toNormal() {
  document.querySelectorAll('div').forEach(div => {
    div.style.display = 'none'
    console.log(div)
  })
  
  if (window.innerWidth < 1000) {
    let mobileTool = document.querySelector('#mobileTool')
    if (mobileTool) mobileTool.style.display = 'block'
  } else {
    let desktopTool = document.querySelector('#desktopTool')
    if (desktopTool) desktopTool.style.display = 'block'
  }
  
  let center = document.querySelector('#center')
  if (center) center.style.display = 'block'
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
let timesincelogin = Date.now() - urlParams.get('ts') > 21600000
if (Date.now() - urlParams.get('ts') > 21600000) {
  console.log('More than 6 hours since login')
  denyaccess()
} else {
  let tslToM = parseInt(Date.now() - urlParams.get('ts'))/ 60000
  console.log('timesincelogin: '+tslToM)
}
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
    if (document.querySelector('#danger-confirm-textbox').value === textvalue) {
      document.querySelector('#danger-proceed').disabled = false
    } else {
      document.querySelector('#danger-proceed').disabled = true
    }
  })
})
document.querySelector('#danger-deleteacc').addEventListener('click', () => {
  console.log('Delete Account')
  textvalue = 'deleteaccount'
  document.querySelector('#danger-confirm-textbox').value = ''
  document.querySelector('#danger-confirm-about').innerHTML = 'delete your account'
  document.querySelector('#danger-confirm-type').innerHTML = textvalue
  document.querySelector('#danger-confirm-textbox').placeholder = textvalue
  dangerOverlay()
  document.querySelector('#danger-confirm-textbox').addEventListener('input', () => {
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
  if (textvalue == 'deleteaccount') {
    // DELETE ACCOUNT
    let accountInfo
    await database.ref(`/users/${urlParams.get('e')}/`).once('value').then(snapshot => {
      accountInfo = snapshot.val()
    })
    await database.ref(`/deleted/${urlParams.get('e')}><${Date.now()}/`).update ({
      accountInfo
    })
    await database.ref(`/users/${urlParams.get('e')}/`).remove()
    const data = new FormData()
          data.set('sendto', urlParams.get('e').replace(/\,/g, '.').replace(/_/g, '@'))
          data.set('subject', 'Sorry to see you go!')
          data.set('html', `<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Sorry to see you go!</title> </head> <body style='width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #7EC8E3; font-family: "Trebuchet MS"; margin: 0;'> <table width='100%' height='100%' align='center' bgcolor='#7EC8E3' style='margin: 0; padding: 0;'> <tr> <td align='center'> <table width='80%' min-width='300px' bgcolor='white' style='padding: 50px; text-align: center;'> <tr> <td> <h1 style='margin: 0;'>Thanks for Creating an Account!</h1> <div style='text-align: left;'> <strong><p>Hi there!</p></strong> <p>We noticed that you just submitted a request to delete your account. </p> <img src='https://cdn.prestonkwei.com/newaccountclipart.png' alt='Image of a new account' style='width: 250px; display: block; margin-left: auto; margin-right: auto;'> <p>Have you explored all of our apps? Check out our <a href='https://chat.prestonkwei.com' style='color: #000080;'>chat app</a> and <a href='https://whiteboard.prestonkwei.com' style='color: #000080;'>collaborative whiteboard</a>!</p> <br> <p>If you did NOT create an account on our website, please <a href='mailto:help@prestonkwei.com' style='color: #000080;'>contact us</a> immediately.</p> </div> <br> <div style='text-align: right;'> <strong><p>Best regards,</p></strong> <p>The team at prestonkwei.com</p> </div> <div style='font-size: 10px;'> <hr style='border: 1px solid #000080;'> <p>You are receiving this email because you signed up for an account on our website.</p> <p>PrestonKwei.com ⋅ PO Box 20987 ⋅ Oakland, CA 94620</p> <p>This is an unmonitored email address. Responses will not be received.</p> <a href='https://prestonkwei.com' style='color: #000080;'>prestonkwei.com</a> </div> </td> </tr> </table> </td> </tr> </table> </body> </html>`)
          data.set('content', `Hi there! We noticed that you recently created an account for the prestonkwei.com suite of apps. The email and password combination that you used to sign up will be your single login to ALL of our apps. We highly recommend storing your login information in your browser or password manager to login faster. If you did NOT create an account on our website, please email help@prestonkwei.com to contact us. Thank you!`)
          // fetch('https://emailserver.prestonkwei.com/email', {
          //   method: "post",
          //   body:data,
          // }).catch(()=>{})
    document.cookie.split(';').forEach((c) => (document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'))
    // SEND TO ANOTHER LOGIN PAGE
    // window.location.replace('/')
  }
})
function securityOptions() {
  console.log('securityoptions')
  document.querySelector('#security-options').style.display = 'block'
}
async function generateQr() {
  console.log(Date.now())
  let expTime = Date.now()+ 5 * 60 * 1000
  let ssoUuid = self.crypto.randomUUID()
  document.querySelector('#qrlogin').style.display='block'
  document.querySelector('#center').style.display='none'
  await database.ref(`sso/${ssoUuid}`).update({
    ssoId: ssoUuid,
    expires: expTime,
    email: urlParams.get('e'),
    accUuid: urlParams.get('id'),
    status:'new'
  })
  console.log(`https://oauth.prestonkwei.com/instant.html?sso=${ssoUuid}%26loginHint=${urlParams.get('e')}`)
  document.querySelector('#login-qrcode').src=`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://oauth.prestonkwei.com/instant.html?sso=${ssoUuid}%26loginHint=${urlParams.get('e')}`
}
function autologout() {

}
let isLoggedOut = false
function logoutFromInactivity() {
  isLoggedOut = true
  let counter = 30
  console.log('Log out')
  document.querySelector('#stillthere').style.display = 'flex'
  let count = 0
  let interval = setInterval(() => {
    if (count > 30) {
      clearInterval(interval)
    } else {
      if (counter <= 3) {
        document.querySelector('#stillthere-countdown').style.color = 'red'
      }
      document.querySelector('#stillthere-countdown').innerHTML = counter
      counter -= 1
      count++

      if (counter == 0) {
        console.log('Autologout Required')
        document.cookie.split(';').forEach((c) => (document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'))
        window.location.replace('/login.html?snackbar=loggedout')
      }
    }
  }, 1000)
}
function inactivelogout() {
  let inactiveTime

  function resetTimer() {
    if (!isLoggedOut) {
      clearTimeout(inactiveTime)
      inactiveTime = setTimeout(logoutFromInactivity, 1800000) // 1800000 = 30 mins
    }
  }
  window.onload = resetTimer
  window.onmousemove = resetTimer
  window.ontouchstart = resetTimer
  window.ontouchmove = resetTimer
  window.onclick = resetTimer
  window.onkeydown = resetTimer
  window.addEventListener('scroll', resetTimer, true)
}
inactivelogout()

function stayin() {
  isLoggedOut = false
  document.querySelector('#stillthere').style.display = 'none'
}
database.ref(`users/${urlParams.get('e')}/info/e`).once('value').then(snapshot => {
  document.querySelector('#email').value = snapshot.val()
})


let answerSelect = document.querySelector('#answer')
let vacationQ = ['Beach', 'Snow', 'Camping', 'Road Trip', 'Cruise', 'Adventure', 'Staycation', 'Volunteer Work']
let fruitQ = ['Apple', 'Pear', 'Peach', 'Lychee', 'Orange', 'Blueberry', 'Cherry', 'Papaya']
let leastFavVeg = ['Brocolli', 'Lettuce', 'Carrot', 'Mushrooms', 'Celery', 'Corn', 'Bell Pepper', 'Zucchinni']
vacationQ = vacationQ.sort(() => 0.5 - Math.random());
fruitQ = fruitQ.sort(() => 0.5 - Math.random());
leastFavVeg = leastFavVeg.sort(() => 0.5 - Math.random());
let questiontext = document.querySelector('#squestion')
let question = document.querySelector('#questionOpt')
console.log(question.value)
question.addEventListener('input', () => {
  while (answerSelect.children.length > 1) {
    answerSelect.removeChild(answerSelect.lastChild);
  }

  if (question.value == 'vacation') {
    vacationQ.forEach(function(option) {
      let newOption = document.createElement('option');
      newOption.value = option;
      newOption.innerHTML = option;
      answerSelect.appendChild(newOption);
    });
    answerSelect.style.display = 'block';
    answerSelect.style.marginLeft = 'auto';
    answerSelect.style.marginRight = 'auto';
  } else if (question.value == 'fruit') {
    fruitQ.forEach(function(option) {
      let newOption = document.createElement('option');
      newOption.value = option;
      newOption.innerHTML = option;
      answerSelect.appendChild(newOption);
    });
    answerSelect.style.display = 'block';
    answerSelect.style.marginLeft = 'auto';
    answerSelect.style.marginRight = 'auto';
  } else if (question.value == 'vegetable') {
    leastFavVeg.forEach(function(option) {
      let newOption = document.createElement('option');
      newOption.value = option;
      newOption.innerHTML = option;
      answerSelect.appendChild(newOption);
    });
    answerSelect.style.display = 'block';
    answerSelect.style.marginLeft = 'auto';
    answerSelect.style.marginRight = 'auto';
  }
})

async function securityQuestionSubmit() {
  let question = document.querySelector('#questionOpt').value
  let answer = document.querySelector('#answer').value
  if (question != 'Select a Question') {
    if (answer != 'Choose') {
      await database.ref(`/users/${urlParams.get('e')}/info/security/questions`).update ({
        [question]: answer
      })
    }
  }
}