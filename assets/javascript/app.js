// Initialize Firebase
var config = {
	apiKey: "AIzaSyDdtUDCBGsLwADsfQSlPr3V7Xu_X8jjkVc",
	authDomain: "rock-paper-scissors-356f4.firebaseapp.com",
	databaseURL: "https://rock-paper-scissors-356f4.firebaseio.com",
	storageBucket: "",
};

firebase.initializeApp(config);
var dbRef = firebase.database().ref();
dbRef.child('player1').set('');
dbRef.child('player2').set('');
var valueInP1;
var valueInP2;
var userName1 = '';
var userName2 = '';
$('#addUserBtn').on('click', function() {
	if (!valueInP1 && !valueInP2) { //nothing in player 1 or 2
		userName1 = $('#userNameInput').val();
		dbRef.child('player1').set(userName1);
	} else if (valueInP1 && !valueInP2) { // if somethign in player 1 and nothing in player 2
		userName2 = $('#userNameInput').val();
		dbRef.child('player2').set(userName2);
	} else if (!valueInP1 && valueInP2) { // if nothing in pplayer 1 and something in player 2
		userName1 = $('#userNameInput').val();
		dbRef.child('player1').set(userName1);
	}

	$('#userNameInput').val('');
});
 // if valueInP1 || valueInP2 ... replace form with "HI ... you are player1"
dbRef.on('value', function(snapshot) {
	console.log(snapshot.val().player1);
	valueInP1 = snapshot.val().player1;
	valueInP2 = snapshot.val().player2;
	if (userName1) {
		dbRef.child('player1').set(userName1);
	} else if (userName2) {
		dbRef.child('player2').set(userName2);
	}
});
