define(function (require) {
  var Handlebars = require('hbs/handlebars');


  function checkIfOneWin( context, options ) {
  	console.log(context);

    if (context != 1) {
    	return 'wins'
    } else {

    	return "win"
    }

  }

Handlebars.registerHelper( 'checkIfOneWin', checkIfOneWin);

  return checkIfOneWin;


});
