var fs = require('fs');
var superagent = require('superagent');

var orcKey = process.env.ORC_KEY || fs.readFileSync('./orcKey', {encoding: 'utf8'}).replace('\n', '');

//Grab xmlstats API key from local file
var xmlstatsKey = process.env.XMLSTATS_KEY || fs.readFileSync('./xmlstatsKey', {encoding: 'utf8'}).replace('\n', '');
var xmlstatsRoot = 'https://erikberg.com/';
var db = require('orchestrate')(orcKey);

function updateTeamsFromXMLStats() {


	superagent
	.get(xmlstatsRoot + 'nba/teams.json')
	.set('User-Agent', 'NBA-FF v.1 (colin.lebens@gmail.com)')
	.end(function(res) {
		
		res.body.forEach(function(xmlTeamObj) {
			var dbObject={};
			var team_id;
			
			team_id = xmlTeamObj['team_id'];
			dbObject['teamName'] = xmlTeamObj['first_name'] + ' ' +
										xmlTeamObj['last_name'];
			dbObject['teamLogo'] = '/images/logos/' + team_id + '-logo.png';
			dbObject['foodRules'] = [];

			addRuleInfoTodbObject(dbObject, team_id);

		});
			
	});		
}

function addFoodTodbObject(dbObject, team_id) {
	var foodsComplete = 0;
	
	dbObject.foodRules.forEach(function(item, index, array) {
	
	//console.log(item.foodId);
		db.get('Foods', item.foodId)
		.then(function(result) {
			item.foodId = result.body.foodId;
			item.foodIcon = result.body.foodIcon;
			item.foodDescription = result.body.foodDescription;
			item.foodDescription = result.body.foodDescription;
			foodsComplete++;
			console.log(foodsComplete + ',' + array.length);
			if (foodsComplete === array.length) {
				addTeamToDB(dbObject, team_id);
			} 
		})
		.fail(function(err) {
			console.log('food error');
			//console.log(err);
		});
	});

}

function addRuleInfoTodbObject(dbObject, team_id) {
	var rulesComplete = 0;
	
	dbObject.foodRules.forEach(function(item, index, array) {
	
	//console.log(item.foodId);
		db.get('Rules', item.ruleId)
		.then(function(result) {
			item.ruleId = result.body.ruleId;
			item.ruleDescription = parseDescription(result.body.ruleDescription, dbObject);
			item.ruleLogic = result.body.ruleLogic;
			rulesComplete++;
			console.log(rulesComplete + ',' + array.length);
			if (rulesComplete === array.length) {
				addFoodTodbObject(dbObject, team_id);
			} 
		})
		.fail(function(err) {
			console.log('rule error: ' + item.ruleId);
			//console.log(err);
		});
	});
}

function parseDescription(description, dbObject) {
	return description.replace('$homeTeamName', dbObject.teamName);
}

function addTeamToDB(dbObject, team_id) {
	console.log(team_id + ': ' + JSON.stringify(dbObject));
	db.put('Teams', team_id, dbObject); 
}

function addTeamKeyToDB(key) {
	var success = false;
	var intervalObj;

	function dbEdit() {
		db.get('Teams', 'keys')
		.then (function(result) {
			var keyList = result.body.keyList;
			var ref = result.headers.etag;
			
			keyList.push(key);
			console.log(keyList);
			db.put('Teams', 'keys', {"keyList": keyList}, ref)
			.then(function(result) {
				clearInterval(intervalObj);
				console.log(keyList);
			})
			.fail(function(err) {
				//console.log(err);
			});
		})
		.fail(function(err) {
			console.log('Cant find keys');
		});

			
	}

	intervalObj = setInterval(dbEdit, Math.floor(Math.random() * 2000) + 1000);

}


updateTeamsFromXMLStats();
