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

// DO NOT EDIT ANYTHING ABOVE ^^


function urlparam() {
  const urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get('id');
  if (userId != null) {
    console.log('UserID: ' + userId)
  } else {
    console.log('USERID BLANK')
    document.getElementById('center').style.display = 'none'
    document.getElementById('center').style.height = '0'
    document.getElementById('center').style.width = '0'
    document.getElementById('noperms').style.display = 'block'
    document.getElementById("error").innerHTML = 'Error: Missing Perms'
  }
}
urlparam()

