// Initialize Firebase
var config = {
	apiKey: "AIzaSyDdtUDCBGsLwADsfQSlPr3V7Xu_X8jjkVc",
	authDomain: "rock-paper-scissors-356f4.firebaseapp.com",
	databaseURL: "https://rock-paper-scissors-356f4.firebaseio.com",
	storageBucket: "",
};

firebase.initializeApp(config);
var dbRef = firebase.database().ref();
var playerName = '';
var player1Losses = 0;
var player1Wins = 0;
var player2Losses = 0;
var player2Wins = 0;
var playerChoice = '';

dbRef.child('player1').set({ //every time someone leaves or refreshes the page the values in player 1 and 2 will be reset
	dbPlayerName: playerName,
	dbPlayerWins: player1Wins,
	dbPlayerLosses: player1Losses,
	dbPlayerChoice: playerChoice
}); 

dbRef.child('player2').set({ //every time someone leaves or refreshes the page the values in player 1 and 2 will be reset
	dbPlayerName: playerName,
	dbPlayerWins: player1Wins,
	dbPlayerLosses: player1Losses,
	dbPlayerChoice: playerChoice
});
var valueInP1; //will be set to the current values set on the database for player 1 and 2 
var valueInP2;
var localUser1 = ''; //will store the value of player 1 and 2 locally
var localUser2 = ''; //each player will only have one of the variables, the other 1 will remain undefined

function addRpsButtons() {
	var choices = ['ROCK', 'PAPER', 'SCISSORS'];
	var buttonContainer = $('<div>'); // makes empty div called buttonContainer
	for (var i = 0; i < choices.length; i++) { //runs through the array above and makes 3 buttons
		var buttons = $('<button>', {
		text: choices[i],
		id: choices[i],
		class: 'rpsButtons'
	});
		$(buttonContainer).append(buttons); //button container get 3 buttons with content from the array
	};

	if (localUser1) { //if the localUser1 variable has a value inside of it push the div containing the buttons into the respective div for that player
		$('#buttonBox1').html(buttonContainer); 
	} else if (localUser2) { //if the localUser2 variable has a value inside of it push the div containing the buttons into the respective div for that player
		$('#buttonBox2').html(buttonContainer);
	};
};

$('#addUserBtn').on('click', function() {
	if ($('#userNameInput').val() == false) {
		$('#errorMessage').text('Please Enter A Username');
		return false;
	}
	if (!valueInP1 && !valueInP2) { 	//if there is currently no player1 and 2 set on the database
		localUser1 = $('#userNameInput').val(); //localUser1 is set the value inside the text box
		playerName = localUser1;
		dbRef.child('player1').child('dbPlayerName').set(localUser1); //resets the value of player1 in the database to the value in localUser1
		$('#userNameForm').html('Hi ' + localUser1 + ', you are Player 1'); //removes the form and welcomes the user
		addRpsButtons(); //runs the function above which adds rock paper scissor buttons to the page

	} else if (valueInP1 && !valueInP2) { 	//if there is a value in player 1 and no value in player 2 set on the database
		localUser2 = $('#userNameInput').val(); //localUser1 is set the value inside the text box
		playerName = localUser2;
		dbRef.child('player2').child('dbPlayerName').set(localUser2); //resets the value of player2 in the database to the value in localUser2
		$('#userNameForm').html('Hi ' + localUser2 + ', you are Player 2');
		addRpsButtons(); //runs the function above which adds rock paper scissor buttons to the page

	} else if (!valueInP1 && valueInP2) {	//if there is no value in player 1 and there is a value in player 2 on the database
		localUser1 = $('#userNameInput').val(); //localUser1 is set the value inside the text box
		playerName = localUser1;
		dbRef.child('player1').child('dbPlayerName').set(localUser1); //resets the value of player1 in the database to the value in localUser1
		$('#userNameForm').html('Hi ' + localUser1 + ', you are Player 1'); //removes the form and welcomes the user
		addRpsButtons(); //runs the function above which adds rock paper scissor buttons to the page
	};
	$('#userNameInput').val(''); //resets the text inside the text box
	return false;
});

$('#buttonBox1, #buttonBox2').on('click', '.rpsButtons', function() {  // on click function for rock paper scissors buttons
	if (this.id === 'ROCK') { 
		playerChoice = this.id; //the variable playerChoice becomes ROCK
	} else if (this.id === 'PAPER') {
		playerChoice = this.id; //the variable playerChoice becomes PAPER
	} else if (this.id === 'SCISSORS') {
		playerChoice = this.id; //the variable playerChoice becomes SCISSORS
	};

	if(localUser1) { // if there is a value in player 1, in other word, if the current browser that is open is player 1
		dbRef.child('player1').child('dbPlayerChoice').set(playerChoice); //takes the value stored in playerChoice and saves it on the database
		$('#buttonBox1').text('Waiting for Player 2 to choose...'); // removes the buttons and adds text that says waiting for the other player
	} else if (localUser2) {
		dbRef.child('player2').child('dbPlayerChoice').set(playerChoice);
		$('#buttonBox2').text('Waiting for Player 1 to choose...');
	};
});

 
//automatically runs when the page loads and sets the values in the 
//database of player 1 and 2 to the variable valueInP1 and valueInP2. this will also run everytime a value is changed on the database
dbRef.on('value', function(snapshot) { 
	valueInP1 = snapshot.val().player1.dbPlayerName; //stores the value of the player name on the database in a variable called valueInP1
	valueInP2 = snapshot.val().player2.dbPlayerName; //stores the value of the player name on the database in a variable called valueInP2

	//once this page is refreshed or opened it will automatically run this function again, 
	//so if another user closes the page, the values stored in the current users sessions will be pushed to the database so the current user wont lose their session

//if there is a value in localUser1 change the value of player1 in the database to all the local variables
//(this if and if else statement prevent the user who has not refreshed or left the page from losing all of their data and progress)
	if (localUser1) { 
		dbRef.child('player2').child('dbPlayerName').set(playerName); 
		dbRef.child('player2').child('dbPlayerChoice').set(playerChoice);
		dbRef.child('player1').child('dbPlayerChoice').set(playerChoice);
		dbRef.child('player1').child('dbPlayerWins').set(player1Wins); 
		dbRef.child('player1').child('dbPlayerLosses').set(player1Losses); 
	
	} else if (localUser2) { //if there is a value in localUser2 change the value of player2 in the database to all the local variables
		dbRef.child('player2').child('dbPlayerName').set(playerName); 
		dbRef.child('player2').child('dbPlayerChoice').set(playerChoice);
		dbRef.child('player2').child('dbPlayerWins').set(player2Wins); 
		dbRef.child('player2').child('dbPlayerLosses').set(player2Losses); 

	};

	if (!valueInP1) { //if user is player 2
		$('#p1BoxTitle').html('Waiting For Player 1...'); //displays in the player 1 box the waiting message
	
	} else if (valueInP1) { //if user is player1
		$('#p1BoxTitle').html(valueInP1); // changes the value inside the player 1 box the the players name
	}
	
	if (!valueInP2) { //if user is player1
		$('#p2BoxTitle').html('Waiting For Player 2...'); //displays in the player 2 box the waiting message
	
	} else if (valueInP2) { //if user is player 2
		$('#p2BoxTitle').html(valueInP2); // changes the value inside the player 2 box the the players name
	}

	var dbPlayer1Choice = snapshot.val().player1.dbPlayerChoice; //current value of player choices stored on the database
	var dbPlayer2Choice = snapshot.val().player2.dbPlayerChoice;
	if (!dbPlayer1Choice) { // if there is no inside player 1's chice attribute
		addRpsButtons(); // redisplays the buttons
	} else if (!dbPlayer2Choice) { // if there is no inside player 2's chice attribute
		addRpsButtons(); // redisplays the buttons
	}

	//RPS Gameplay, finally...

	if(dbPlayer1Choice === dbPlayer2Choice) { //if users chose the same
		playerChoice = ''; // resets player choice local variable 
		dbRef.child('player1').child('dbPlayerChoice').set(''); //resets player1 choice on the database
		dbRef.child('player2').child('dbPlayerChoice').set(''); //resets player2 choice on the database
	}else if (dbPlayer1Choice ==='ROCK' && dbPlayer2Choice === "PAPER") {
		playerChoice = ''; // resets player choice local variable
		dbRef.child('player1').child('dbPlayerChoice').set('');//resets player1 choice on the database
		dbRef.child('player2').child('dbPlayerChoice').set('');//resets player2 choice on the database
		player1Losses++; //player 1 losses counter is increased
		player2Wins++; //player 2 wins counter is increased
	} else if (dbPlayer1Choice ==='PAPER' && dbPlayer2Choice === "SCISSORS") {
		playerChoice = '';
		dbRef.child('player1').child('dbPlayerChoice').set('');
		dbRef.child('player2').child('dbPlayerChoice').set('');
		player1Losses++;
		player2Wins++;
	} else if (dbPlayer1Choice ==='SCISSORS' && dbPlayer2Choice === "ROCK") {
		playerChoice = '';
		dbRef.child('player1').child('dbPlayerChoice').set('');
		dbRef.child('player2').child('dbPlayerChoice').set('');
		player1Losses++;
		player2Wins++;
	}else if (dbPlayer2Choice ==='ROCK' && dbPlayer1Choice === "PAPER") {
		playerChoice = '';
		dbRef.child('player1').child('dbPlayerChoice').set('');
		dbRef.child('player2').child('dbPlayerChoice').set('');
		player2Losses++;
		player1Wins++;
	} else if (dbPlayer2Choice ==='PAPER' && dbPlayer1Choice === "SCISSORS") {
		playerChoice = '';
		dbRef.child('player1').child('dbPlayerChoice').set('');
		dbRef.child('player2').child('dbPlayerChoice').set('');
		player2Losses++;
		player1Wins++;
	} else if (dbPlayer2Choice ==='SCISSORS' && dbPlayer1Choice === "ROCK") {
		playerChoice = '';
		dbRef.child('player1').child('dbPlayerChoice').set('');
		dbRef.child('player2').child('dbPlayerChoice').set('');
		player2Losses++;
		player1Wins++;
	}

});
