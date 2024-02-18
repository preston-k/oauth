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

let finalRedir = null
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('loginBut').addEventListener('click', function () {
    console.log('Logging In');
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password');
    emailInput.disabled = true;
    passwordInput.disabled = true;
    
    let email = emailInput.value.toLowerCase();
    let pw = passwordInput.value;
    
    let firebaseEmail = email.replace(/\./g, ',').replace(/@/g, '_');
    
    database.ref('users/' + firebaseEmail).once('value', snapshot => {
      if (snapshot.exists()) {
        let userData = snapshot.val();
        if (userData.pw === pw) {
          let uid = userData.id;
          const urlParams = new URLSearchParams(window.location.search);
          let target = urlParams.get('redir');
          if (target != null) {
            finalRedir = target
            window.location.replace(finalRedir + '?id=' + uid + '?e=' + firebaseEmail)
          } else {
            window.location.replace('/account.html?id=' + uid + '?e=' + firebaseEmail)
          }
        } else {
          alert('Incorrect Email or Password');
        }
      } else {
        alert('Incorrect Email or Password');
      }
      emailInput.disabled = false;
      passwordInput.disabled = false;
    }).catch(error => {
      console.error('Error during login:', error);
      emailInput.disabled = false;
      passwordInput.disabled = false;
    });
  });
});

let useruuid = self.crypto.randomUUID() 
document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('signupBut').addEventListener('click', function () {
    console.log('Signing Up') 
    document.getElementById('signupemail').disabled = true 
    document.getElementById('signuppw').disabled = true 
    let email = document.getElementById('signupemail').value 
    let pw = document.getElementById('signuppw').value 
    console.log(email + ' : ' + pw) 
    let firebaseEmail = email.replace(/\./g, ',').replace(/@/g, '_') 
    console.log(firebaseEmail + ' : ' + pw) 
    database.ref('users/' + firebaseEmail).once('value', snapshot => {
      if (snapshot.exists()) {
        alert('Email already in system. Please login.')  // EMAIL EXISTS
        document.getElementById('signupemail').disabled = false 
        document.getElementById('signuppw').disabled = false 
      } else {
        database.ref('users/' + firebaseEmail).update({
          id: useruuid,
          pw: pw 
        })
          .then(() => {
            window.location.replace('/account.html?id='+useruuid)
          })
          .catch(error => {
            console.error('Signup failed:', error)
            alert('An error occurred, please try again.')  // FAIL
            document.getElementById('email').disabled = false 
            document.getElementById('password').disabled = false 
          }) 
      }
    }).catch(error => {
      console.error('Error checking user:', error)  // ERROR
      alert('An error occurred, please try again.') 
      document.getElementById('email').disabled = false 
      document.getElementById('password').disabled = false 
    }) 
  })
})
