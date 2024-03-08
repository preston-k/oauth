const firebaseConfig = {
  apiKey: 'AIzaSyB-ZYqrpT04a5zOkB5uQYK3lE3CuMhkhC8',
  authDomain: 'oauth-page-ad3c2.firebaseapp.com',
  databaseURL: 'https://oauth-page-ad3c2-default-rtdb.firebaseio.com',
  projectId: 'oauth-page-ad3c2',
  storageBucket: 'oauth-page-ad3c2.appspot.com',
  messagingSenderId: '401481049573',
  appId: '1:401481049573:web:f1f9ca852e96d580cf3b0c'
}; 
firebase.initializeApp(firebaseConfig);
let database = firebase.database();

function urlparam() {
  const urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get('id');
  if (userId != null) {
    console.log('UserID: ' + userId);
  } else {
    console.log('USERID BLANK');
    document.getElementById('center').style.display = 'none';
    document.getElementById('center').style.height = '0';
    document.getElementById('center').style.width = '0';
    document.getElementById('noperms').style.display = 'block';
    document.getElementById('error').innerHTML = 'Error: Missing Perms';
  }
}
urlparam();
function onload() {
  console.log('Onload');
  const urlParams = new URLSearchParams(window.location.search);
  let emailParam = urlParams.get('e');
  if (emailParam) {
      let email = emailParam;
      firebase.database().ref('users/' + email + '/info').once('value').then(function(snapshot) {
          let userInfo = snapshot.val();
          if (userInfo) {
              document.getElementById('fnhtml').value = userInfo.fn;
              document.getElementById('lnhtml').value = userInfo.ln;
          } else {
              console.error('User info not found in database for email: ' + email);
          }
      }).catch(function(error) {
          console.error('Error fetching user info from database:', error);
      });
  } else {
      console.error('Email not found in URL parameters.');
  }
}

onload()
function updateInfo() {
  console.log('Update Info');
  let fnbox = document.getElementById('fnhtml').value;
  let lnbox = document.getElementById('lnhtml').value;
  if (fnbox === '') {
      alert('Please enter a first name to proceed.');
  } else {
      const urlParams = new URLSearchParams(window.location.search);
      let emailParam = urlParams.get('e');
      let email = '';
      if (emailParam) {
          email = emailParam;
          firebase.database().ref('users/' + email + '/info/').update({
              fn: fnbox,
              ln: lnbox
          });
      } else {
          console.error('Email not found in URL parameters.');
      }
  }
}

function logout() {
  document.cookie = "loggedin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.replace('/')
}