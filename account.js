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
    document.getElementById('desktopTools').style.display = 'none';
    document.getElementById('mobileTool').style.display = 'none';
    document.getElementById('logOutBut').style.display = 'none';
    document.getElementById('center').style.height = '0';
    document.getElementById('center').style.width = '0';
    document.getElementById('noperms').style.display = 'block';
    document.getElementById('error').innerHTML = 'Error: Missing Perms';
  }
}
urlparam();
function logoutmod(reason) {
  document.getElementById('center').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('mobileTool').style.display = 'none';
    console.log('URL Issue Detected')
    let modal = new bootstrap.Modal(document.getElementById('loggedoutmod'), {
      backdrop: 'static',
      keyboard: false 
    });
    modal.show();
    document.getElementById('errorp').innerHTML = 'Error: ' + reason
}
function checkURL() {
  console.log('Checking URL')
  const urlParams = new URLSearchParams(window.location.search);
  let e = urlParams.get('e');
  let id = urlParams.get('id');
  console.log('URL CHECK INIT COMPLETE')
  if (e == null || e == '' || id == null || id == '') {
    logoutmod('Missing Perms')
  }
}
checkURL() 
function tscheck() {
  const urlParams = new URLSearchParams(window.location.search);
  const timestampParam = urlParams.get('ts');
  
  if (timestampParam) {
    let decodedTimestamp = decodeURIComponent(timestampParam);
    const match = decodedTimestamp.match(/(\w{3})(\w{3})(\d{2})(\d{4})(\d{2}):(\d{2}):(\d{2})UTC([+-]\d{4})/);

    if (match) {
      const year = match[4];
      const month = 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(match[2]) / 3 + 1;
      const day = match[3];
      const time = `${match[5]}:${match[6]}:${match[7]}`;
      const timezone = match[8];
      const dateString = `${year}-${month.toString().padStart(2, '0')}-${day}T${time}${timezone.slice(0, 3)}:${timezone.slice(3)}`;

      const urlTimestamp = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - urlTimestamp) / (1000 * 60 * 60);

      if (Math.abs(diffInHours) > 6) {
        logoutmod('Token Expired')
      } else {
        console.log('Timestamp OK');
      }
    } else {
      console.log('Failed to parse timestamp:', timestampParam);
    }
  } else {
    console.log('No timestamp provided in the URL.');
  }
}

tscheck();

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
  const urlParams = new URLSearchParams(window.location.search);
  let emailParam = urlParams.get('e');
  
  if (!emailParam) {
    console.error('Email parameter not found in URL.');
    document.getElementById('progress').innerHTML = ('Error! Your changes were not saved. Please try again.');
    document.getElementById('progress').style.color = 'red';
    setTimeout(() => {
      document.getElementById('progress').innerHTML = ('');
    }, 3000);
    return;
  }

  // Remove any whitespace and split the emailParam into parts if necessary
  const email = emailParam.trim();

  firebase.database().ref('users/' + email + '/info/').once('value', snapshot => {
    if (snapshot.exists()) {
      firebase.database().ref('users/' + email + '/info/').update({
        fn: fnbox,
        ln: lnbox
      }).then(() => {
        document.getElementById('progress').innerHTML = ('Success! Your changes have been saved!');
        setTimeout(() => {
          document.getElementById('progress').innerHTML = ('');
        }, 3000);
      }).catch((error) => {
        console.error('Error updating user info:', error);
        document.getElementById('progress').innerHTML = ('Error! Your changes were not saved. Please try again.');
        document.getElementById('progress').style.color = 'red';
        setTimeout(() => {
          document.getElementById('progress').innerHTML = ('');
        }, 3000);
      });
    } else {
      console.error('User info not found for email:', email);
      document.getElementById('progress').innerHTML = ('Error! Your changes were not saved. Please try again.');
      document.getElementById('progress').style.color = 'red';
      setTimeout(() => {
        document.getElementById('progress').innerHTML = ('');
      }, 3000);
    }
  });
}


function logout() {
  document.cookie = "loggedin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.replace('/')
}