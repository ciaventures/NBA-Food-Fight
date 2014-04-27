define(function (require) {
  var Handlebars = require('hbs/handlebars');


  function checkIfOne( context, options ) {
  	console.log(options);
  	console.log(context);
    if (context > 1) {
    	return " losses"
    } else {
    	return " loss"
    }

  }

Handlebars.registerHelper( 'checkIfOne', checkIfOne);

  return checkIfOne;


});
