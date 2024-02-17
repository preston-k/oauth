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

