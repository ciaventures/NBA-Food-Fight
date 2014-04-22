define(function(require) {

	var Backbone = require('backbone');
	var $ = require('jquery');
	require('jquery-cookie');

	var User = Backbone.Model.extend({
	
		initialize: function() {
			var curUserName = $.cookie('user-name');

			if (curUserName) {
				this.set('userName', curUserName);
				this.set('id', curUserName);
				this.fetch();
			}
		},

		defaults: {
		    userName: '',
		    password: '',
		    foodAwards: {},
		    record: {},
		    previousResult: {},
		    dailySelection: {},
		    // id: ''
		    // url: 'Users/'
		}, 

		clearData: {
		    userName: '',
		    password: '',
		    foodAwards: {},
		    record: {},
		    previousResult: {},
		    dailySelection: {},

		},

		urlRoot: 'Users/'



	});

	return User;
});

