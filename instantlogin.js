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

const urlParams = new URLSearchParams(window.location.search)

let loginHint = urlParams.get('loginHint')
let ssoId = urlParams.get('ssoIds')
console.log(loginHint)
console.log(ssoId)
if (loginHint == null || loginHint == '') {
  if (ssoId == null || ssoId == '') {
    document.querySelector('#instant-missingperms').style.display = 'block'
    document.querySelector('#instant-lander').style.display = 'none'
  }
}
// KNOWN ISSUE: when visiting this page, the url params dont register "%26" as a &, so loginHint will always return null. To do: fix it so that it either switches %26 to a & and then reloads the page with the new url params, or qr code creation fix to encode unicode?
