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

function resetCheck() {
  console.log('Reset Password Check')
}