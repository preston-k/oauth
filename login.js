const firebaseConfig = {
  apiKey: "AIzaSyB-ZYqrpT04a5zOkB5uQYK3lE3CuMhkhC8",
  authDomain: "oauth-page-ad3c2.firebaseapp.com",
  databaseURL: "https://oauth-page-ad3c2-default-rtdb.firebaseio.com",
  projectId: "oauth-page-ad3c2",
  storageBucket: "oauth-page-ad3c2.appspot.com",
  messagingSenderId: "401481049573",
  appId: "1:401481049573:web:f1f9ca852e96d580cf3b0c"
};
firebase.initializeApp(firebaseConfig);

let database = firebase.database();
// DO NOT EDIT ANYTHING ABOVE^^^

function loginGo() {
  console.log('Logging In')
  let email = document.getElementById('email').value
  console.log(email)
  let pw = document.getElementById('password').value
  console.log(pw)
}
function signupGo() {
  console.log('Signing Up')
}
