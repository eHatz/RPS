// Initialize Firebase
var config = {
	apiKey: "AIzaSyDdtUDCBGsLwADsfQSlPr3V7Xu_X8jjkVc",
	authDomain: "rock-paper-scissors-356f4.firebaseapp.com",
	databaseURL: "https://rock-paper-scissors-356f4.firebaseio.com",
	storageBucket: "",
};

firebase.initializeApp(config);
var dbRef = firebase.database().ref();
dbRef.child('player1').set(''); //every time someone leaves or refreshes the page the values in player 1 and 2 will be reset
dbRef.child('player2').set('');
var valueInP1; //will be set to the current values set on the database for player 1 and 2 
var valueInP2;
var localUser1 = ''; //will store the value of player 1 and 2 locally
var localUser2 = '';
$('#addUserBtn').on('click', function() {
	if (!valueInP1 && !valueInP2) { 	//if there is currently no player1 and 2 the value entered in the text box will be set to player 1 and stored in the localUser1 var
		localUser1 = $('#userNameInput').val();
		dbRef.child('player1').set(localUser1); //resets the value on the database to the value in localUser1
		$('#userNameForm').html('Hi ' + localUser1 + ', you are Player 1!');
	} else if (valueInP1 && !valueInP2) { 	//if there is currently a player 1 and no player 2 the value entered in the text box will be set to player 2 and stored in the localUser2 var
		localUser2 = $('#userNameInput').val();
		dbRef.child('player2').set(localUser2); //resets the value on the database to the value in localUser1
		$('#userNameForm').html('Hi ' + localUser2 + ', you are Player 2!');
	} else if (!valueInP1 && valueInP2) {	// if there is currently no player1 and there is a player 2 the value entered in the text box will be set to player 1 and stored in the localUser1 var
		localUser1 = $('#userNameInput').val();
		dbRef.child('player1').set(localUser1);
		$('#userNameForm').html('Hi ' + localUser1 + ', you are Player 1!');
	}
	$('#userNameInput').val(''); //resets the text inside the text box
	return false;
});

//automatically runs at when the page loads and sets the values in the 
//database of player 1 and 2 to the variable valueInP1 and valueInP2. this will also run everytime a value is changed on the database
dbRef.on('value', function(snapshot) { 
	valueInP1 = snapshot.val().player1;
	valueInP2 = snapshot.val().player2;

	//once this page is refreshed or opened it will automatically run this function again, 
	//so if another user closes the page, the values stored in the current users sessions will be pushed to the database so the current user wont lose their session
	if (localUser1) { //if there is a value in localUser1 change the value of player1 in the database (each player will only have one of the variables, the other 1 will remain undefined locally)
		dbRef.child('player1').set(localUser1); 
	} else if (localUser2) { //if there is a value in localUser2 change the value of player2 in the database 
		dbRef.child('player2').set(localUser2);
	}

	if (!valueInP1) {
		$('#p1BoxTitle').html('Waiting For Player 1...');
	} else if (valueInP1) {
		$('#p1BoxTitle').html(valueInP1);
	}
	if (!valueInP2) {
		$('#p2BoxTitle').html('Waiting For Player 2...');
	} else if (valueInP2) {
		$('#p2BoxTitle').html(valueInP2);
	}
});
