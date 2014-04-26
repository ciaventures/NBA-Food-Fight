define(function(require) {

	var Backbone = require('backbone');
	var template = require('hbs!templates/game-in-schedule');
	var User = require('models/user-model');

	var GameView = Backbone.View.extend({

			tagName: 'div',
			className: 'gameContainer',
			template: template,
		events: {
			"click": "selectGame"
		},

		initialize: function() {
			this.setReadableDate();

			this.listenTo(this.model, 'manualRerender', this.render);
		},


		setReadableDate: function() {
			var unreadableDate = new Date(this.model.get('eventTime'));
		
			this.model.set('readableDate', unreadableDate.toLocaleDateString());
			this.model.set('readableTime', unreadableDate.toLocaleTimeString());


		},

		gameBorder: function() {
			$('.active').removeClass('active');
			$(this.el).find('.panel').addClass("active");
			$('.modal-title').removeClass('red').addClass('green');
			this.showModal('Game Selected', 'You have chosen the ' + this.model.attributes.homeTeam.teamName + ' vs. the ' + this.model.attributes.awayTeam.teamName
			+ '<p> ' + this.model.attributes.homeTeam.foodRules[0].ruleDescription + '</p>' );
		},


		render: function () {
			$(this.el).data('event_id', this.model.get('id'));
			this.$el.html( this.template(this.model.toJSON()));
			return this;
		},

		showModal: function (header, description) {
			$('#alert-modal').find('.modal-body').empty();
			$('#alert-modal').find('.alert-title').empty();
			$('#alert-modal').find('.modal-body').html('<p>'+description+'</p>');
			$('#alert-modal').find('.alert-title').html('<p>'+header+'</p>');
			$('#alert-modal').modal('show');
		},

		selectGame: function() {
			// $.cookie('user-name', 'doggy');

			if (!($.cookie('user-name'))) {
				// showModal.call(this, 'Blah Title', 'Blah Description');
				$('.modal-title').removeClass('green').addClass('red');
				this.showModal('Not Signed In', 'Sign up or sign in to select a game.');				
				return;
			}



			var curUser = new User({
				id: $.cookie('user-name')
			});
			var curEventId = this.model.get('id');
			var unreadableGametime = Date.parse(this.model.get('eventTime'));
			if (Date.now() >= unreadableGametime) {
			// 	$('#pick-new-game').modal('toggle');
			//	$('.modal-backdrop').remove();
			$('.modal-title').removeClass('green').addClass('red');
			this.showModal('Invalid Game', 'This game has already started. Please pick another game.');				
				return;
			} else {
			this.gameBorder();
			curUser.fetch({
				success: function(model, response, options) {
					model.set('dailySelection', curEventId);
					console.log(model.get('id'));
					console.log(model.get('userName'));
					console.log(model.get('password'));
					console.log(model.get('dailySelection'));
					console.log(model.get('id') + " selected " + model.get('dailySelection'));
					model.save();
					
				},


				error: function(model, response, options) {
					console.log(response.responseText);
				}
			});
		}
			
			//curUser.save();
		}

	});

	return GameView;
});




// 	$(".gameContainer").addClass("active");
// 			}, function () {
// 				$(".gameContainer").removeClass("active");
// 			});
// });
