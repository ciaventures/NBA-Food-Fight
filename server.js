// Includes
var $ = require('jquery');
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var superagent = require('superagent');
var exphbs = require('express3-handlebars');

//Global Variable Declarations

//Grab Orchestrate.io API key from local file 
//(to support easy key shielding)
var orcKey = fs.readFileSync('./orcKey', {encoding: 'utf8'}).replace('\n', '');

//Grab xmlstats API key from local file
var xmlstatsKey = fs.readFileSync('./xmlstatsKey', {encoding: 'utf8'}).replace('\n', '');
var xmlstatsRoot = 'https://erikberg.com/';
var db = require('orchestrate')(orcKey);

var app = express();

var port = Number(process.env.PORT || 5000);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.bodyParser());


app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/Teams', function(req, res) {
	db.list('Teams', {limit: 100})
	.then(function(result) {
		console.log(result.body.results);
		res.send(result.body.results);
	});
});


// use the following if you want to be able to parse the body of the request
// app.configure(function(){
//   app.use(express.bodyParser());
// });



app.listen(port, function() {
 	console.log('Listening on port: ' + port);
});

// Get Users

app.get('/Users/:username', function (req, res) {
	 db.get('Users', req.params.username)
	.then(function (result) {
		console.log(result.body);
		res.send(result.body)
	})
	.fail(function (err) {

		res.end('No user found.')
	})
});


app.get('/Users', function (req, res) {
	 db.list('Users')
	.then(function (result) {
		console.log(result.body);
		res.send(result.body)
	})
	.fail(function (err) {

		res.end('No users found.')
	})
})



// Get Events

app.get('/Events/Today', function (req, res) {
	 console.log(getTodaysDate());
	 db.search('Events', getTodaysDate())
	.then(function (result) {
		var outputArr = [];
		
		result.body.results.forEach(function(item) {
			outputArr.push(item.value);
		});
		
		res.send(outputArr);
	})
	.fail(function (err) {

		res.end('/Events/date/:date - There are no games on that date.')
	})
})

app.get('/Events/Date/:date', function (req, res) {
	 db.search('Events', req.params.date)
	.then(function (result) {
		var outputArr = [];
		
		result.body.results.forEach(function(item) {
			outputArr.push(item.value);
		});
		
		res.send(outputArr);
	})
	.fail(function (err) {

		res.end('/Events/date/:date - There are no games on that date.')
	})
})

app.get('/Events/:gamekey', function (req, res) {
	 db.get('Events', req.params.gamekey)
	.then(function (result) {
		console.log(result.body);
		res.send(result.body)
	})
	.fail(function (err) {

		res.end('That game does not exist.')
	})
})

app.get('/Events', function (req, res) {
	 db.list('Events')
	.then(function (result) {
		var outputArr = [];
		
		result.body.results.forEach(function(item) {
			outputArr.push(item.value);
		});
		
		res.send(outputArr);
	})
	.fail(function (err) {

		res.end('No games found.')
	});
});


app.get('/Schedule', function (req, res) {
	 db.list('Events')
	.then(function (result) {
		console.log(result.body);
		outputArr = [];
		result.body.results.forEach(function(item) {
			outputArr.push(item.value);
		});
		res.send(outputArr);
	})
	.fail(function (err) {

		res.end('No games found.')
	});
});
// Get Foods

app.get('/Foods', function (req, res) {
	 db.list('Foods')
	.then(function (result) {
		console.log(result.body);
		res.send(result.body)
	})
	.fail(function (err) {

		res.end('No food found.')
	})
})


app.get('/Foods/:food', function (req, res) {
	 db.get('Foods', req.params.food)
	.then(function (result) {
		console.log(result.body);
		res.send(result.body)
	})
	.fail(function (err) {

		res.end('That food does not exist.')
	})
})


// Get Teams
app.get('/Teams', function (req, res) {
	 db.list('Teams')
	.then(function (result) {
		console.log(result.body);
		res.send(result.body)
	})
	.fail(function (err) {

		res.end('No teams found.')
	})
})


app.get('/Teams/:teamname', function (req, res) {
	 db.get('Teams', req.params.teamname)
	.then(function (result) {
		console.log(result.body);
		res.send(result.body)
	})
	.fail(function (err) {

		res.end('That team was not found.')
	})
})


// Put Routes
// Andrew


app.put("/Users/:userName", function(req, res) {
  // addUserInfo(req);
    var user = {
    "id": req.body.id,
    "userName": req.body.userName,
    "password": req.body.password || "",
    "foodAwards": req.body.foodAwards || [],
    "record": req.body.record || {},
    "previousResult": req.body.previousResult || {},
    "dailySelection": req.body.dailySelection || {}
  };
  db.put('Users', req.params.userName, user);
  res.send("Adding profile for user: " + req.params.userId + ".");
});

// app.put("/Users/:userId/add/:foodAwards/:record/:previousResult/:dailySelection", function(req, res) {
//   // addUserInfo(req);
//     var user = {
//     "userName": req.params.userId,
//     "foodAwards": req.params.foodAwards,
//     "record": req.params.record,
//     "previousResult": req.params.previousResult,
//     "dailySelection": req.params.dailySelection
//   };
//   db.put('Users', req.params.userId, user);
//   res.send("Adding profile for user: " + req.params.userId + ".");
// });

// app.put("/Users/:userId/edit", function(req, res) {
//   // editUserInfo(req);
//   res.send("Editing profile for user: " + req.params.userId + ".");
// });

app.get('*', function(req, res) {
	console.log('[' + req.ip + '] ' + req.url  + ': Request from World.');
	res.send(404);
});


// function addUserInfo (info) {

//   var user = {
//     "userName": "info.params.userId"
    // foodAwards: info.params.foodAwards,
    // record: info.params.record,
    // previousResult: info.params.previousResult,
    // dailySelection: info.params.dailySelection
//   };

//   db.put('Users', info.params.userId, user);

// }


//db.put("collection", "key", obj) -->
//to change one field, need to get the complete db object, then overwrite the field and put it back


// End Put Routes



// Get Routes
// Ian


// End Get Routes

// Database Updates
// Colin

function getTodaysDate() {
 	var dateString = '';
 	var date = new Date();
 
 	dateString += date.getFullYear();

 	if(date.getMonth() < 10) 
 		dateString += '0'; 

 	dateString += date.getMonth()+1;

 	if(date.getDate() < 10) 
	 	dateString += '0';

	 dateString += date.getDate();

	 return dateString;		 
}

// End Database Updates

