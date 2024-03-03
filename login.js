const firebaseConfig = {
  apiKey: "AIzaSyB-ZYqrpT04a5zOkB5uQYK3lE3CuMhkhC8",
  authDomain: "oauth-page-ad3c2.firebaseapp.com",
  databaseURL: "https://oauth-page-ad3c2-default-rtdb.firebaseio.com",
  projectId: "oauth-page-ad3c2",
  storageBucket: "oauth-page-ad3c2.appspot.com",
  messagingSenderId: "401481049573",
  appId: "1:401481049573:web:f1f9ca852e96d580cf3b0c"
} 
firebase.initializeApp(firebaseConfig) 

let database = firebase.database() 
// DO NOT EDIT ANYTHING ABOVE^^^

function createCookie(name, value, days) {
  let expires = '';
  if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
  console.log('Cookie Created: '+name+value+expires)
}
let cd = null
function readCookie(cookieName) {
  const nameEQ = cookieName + '=';
  const cookiesArray = document.cookie.split(';');
  let cd = null;
  for (let i = 0; i < cookiesArray.length; i++) {
      let cookie = cookiesArray[i];
      while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
          cd = cookie.substring(nameEQ.length, cookie.length);
          break;
      }
  }
  return cd;
}

let hashPass = '' 

async function hashPassword(password) {
  const encoder = new TextEncoder() 
  const data = encoder.encode(password) 
  const hash = await crypto.subtle.digest('SHA-256', data) 
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('') 
}

let d = new Date().toString().replace(/ /g, "").replace(/GMT/g, "UTC")

let finalRedir = null
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('loginBut').addEventListener('click', async function () {
    console.log('Logging In') 
    let emailInput = document.getElementById('email') 
    let passwordInput = document.getElementById('password') 
    emailInput.disabled = true 
    passwordInput.disabled = true 
    
    let email = emailInput.value.toLowerCase() 
    let pw = passwordInput.value 
    console.log(pw) 
    let firebaseEmail = email.replace(/\./g, ',').replace(/@/g, '_') 
    
    try {
      const hashedInputPassword = await hashPassword(pw) 
      
      const snapshot = await database.ref('users/' + firebaseEmail).once('value') 
      if (snapshot.exists()) {
        let userData = snapshot.val() 
        if (userData.pw === hashedInputPassword) {
          let uid = userData.id 
          const urlParams = new URLSearchParams(window.location.search) 
          let target = urlParams.get('redir') 
          if (target != null) {
            finalRedir = target 
            let time = d.getTime()
            createCookie('loggedin=true', uid, 0.1666666)
            window.location(finalRedir + '?id=' + uid + '?e=' + firebaseEmail + '?s=true' + '?ts=' + d) 
          } else {
            createCookie('loggedin=true', uid, 0.1666666)
            window.location('/account.html?id=' + uid + '?e=' + firebaseEmail + '?s=true' + '?ts=' + d) 
          }
        } else { // Wrong Password
          const userRef = database.ref('users/' + firebaseEmail);
          let fa = 0;
          await userRef.once('value', (snapshot) => {
              const userData = snapshot.val();
              if (userData && userData.failedAttempts != null) {
                fa = userData.failedAttempts + 1;
              } else {
                fa = 1; // Initialize to 1 if failedAttempts doesn't exist
              }
          });
          await userRef.update({ failedAttempts: fa });
          alert('Incorrect Email or Password') 
          window.location('/login.html')
        }
      } else {
        alert('Incorrect Email or Password') 
        window.location('/login.html')
      }
    } catch (error) {
      console.error('Error during login:', error) 
      alert('An error occurred, please try again.') 
      window.reload()
    } finally {
      emailInput.disabled = false 
      passwordInput.disabled = false 
    }
  }) 
}) 

let useruuid = self.crypto.randomUUID() 
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('signupBut').addEventListener('click', async function () {
    console.log('Signing Up') 
    document.getElementById('signupemail').disabled = true 
    document.getElementById('signuppw').disabled = true 
    let email = document.getElementById('signupemail').value 
    let pw = document.getElementById('signuppw').value 
    let firebaseEmail = email.replace(/\./g, ',').replace(/@/g, '_') 

    try {
      const snapshot = await database.ref('users/' + firebaseEmail).once('value') 
      if (snapshot.exists()) {
        alert('Email already in system. Please login.')  
      } else {
        const hashedPassword = await hashPassword(pw)  
        await database.ref('users/' + firebaseEmail).update({ 
          id: useruuid,
          pw: hashedPassword
        }) 
        window.location('/account.html?id='+useruuid) 
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
