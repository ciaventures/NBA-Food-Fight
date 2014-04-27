define(function (require) {
  var Handlebars = require('hbs/handlebars');


  function checkIfOneLoss( context, options ) {

    if (context != 1) {
    	return " losses"
    } else {
    	return " loss"
    }

  }

Handlebars.registerHelper( 'checkIfOneLoss', checkIfOneLoss);

  return checkIfOneLoss;


});
