
define(function (require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  require('jquery-cookie');

  var UserView = Backbone.View.extend({
   name: 'UserView',

   events: {
    'click #signup-button': 'signUp',
    'click #signin-button': 'signIn',
    'keypress :input': 'loginKeypressHandler',
    'keypress :input': 'loginKeypressHandler',
    'click #user-signout': 'signOut',
    'click #food': 'removeGreeting',
    'click #home': 'addHello'

   },

    loginKeypressHandler: function(key) {
      if (key.charCode  === 13) {
        this.signIn();
      }
    }, 

    initialize: function (options) {
      
      // Template initialization Workaround
      if (options.template) {
      	this.template = options.template;
        this.menuTemplate = options.menuTemplate;
        this.menu = options.menu;
        this.menuTag = options.menuTag;
      }

      // if (this.menu === true) {
      //   this.showMenu();
      //   $('#user-menu').show();
      // }

      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'manualRerender', this.render);
      
      this.render();
    },

    addHello: function() {
      $('#user-name').show();
    },

    loginTest: function() {
    },

    removeGreeting: function() {
      $('#failed-login').hide();
    },

    render: function() { 
      this.$el.html(this.template(this.model.toJSON())); 
      if (this.model.get('userName')) {

         this.showLastResult(); 
         this.dailyPick();
     

      }

    },


    signUp: function () {
      // this.$el.html(this.template(this.model.toJSON()));
      var userName = this.$el.find('#user-name-signup').val();
      var password = this.$el.find('#password-signup').val();
      this.model.set("id", userName);
      this.model.set("userName", userName)
      this.model.set("password", password);
      // console.log(this.model.id);
      this.model.save();
      $.cookie('user-name', userName, { expires: 7, path: '/' });
      // var userName = $("#user-name")[0];
      console.log('Created user: ' + userName);
      // this.model.userName = $("#user-name").attr('value');

      // alert("Thanks for signing up, " + userName + "!\nYour password is: " + password);
      $('.modal-backdrop').remove();
      window.location.href = "#user-view";

      $('#failed-login').html('<p class="text-success">Thanks for signing up, ' + userName + '!\nYour password is: ' + password);
      $('#failed-login').show();
      $('#user-name').hide();
      $('body').removeClass("modal-open");

    },

    signOut: function() {
      this.$el.hide();
      $.removeCookie('user-name');
      this.model.clear();
      $('#most-recent-result').html('');
      this.removeGreeting();

      window.location.href = '#user-signin';
    },

    signIn: function() {
      this.$el.hide();
      $('#failed-login').html('');
      $('#user-loading').html('<br /><img src="/images/login-loader.gif" />');
      var userName = this.$el.find('#user-name-login').val();
      var password = this.$el.find('#password-login').val();

      this.model.set('id', userName);      
      
      var self = this;

      this.model.fetch({
        success: function(model, response, options) {
          $('#user-loading').html('');
          if(password === model.get('password')) {
            self.model.trigger('manualRerender');
            $.cookie('user-name', userName, { expires: 7, path: '/' });
            window.location.href = '#user-view';


          } else {
             self.$el.show();
             $('#failed-login').html('<p class="text-danger">Invalid username or password.');
             console.log('Incorrect Password');
          }
        }, 

        error: function(model, response, options) {
            $('#user-loading').html('');
            console.log(response);
 
            self.$el.show();
            $('#failed-login').html('<p class="text-danger">Invalid username or password.');
        },

      });
      
     },

     showLastResult: function() {

        var previousResult = this.model.get('previousResult');
        
        if (typeof previousResult == 'object' && previousResult != null) {
          if(Object.keys(previousResult).length) {
              if (previousResult.homeTeam.foodRules[0].foodWon === true) {
                previousResult.result = "WINNER";
              } else {
                previousResult.result = "LOSER";
              }

              var recentTemplate = require('hbs!templates/recent-game');

            $('#most-recent-result').html(recentTemplate(this.model.get('previousResult')));

          } else {

            noRecentResults();
          

          }
        } else {
          noRecentResults();
        }


        function noRecentResults() {
          $('#most-recent-result').html('<h3 style="text-align:center;">You have no previous picks.</h3>');
        }
              
     },

     dailyPick: function() {
      var dailySelection = (this.model.get('dailySelection'));
    
        if (typeof dailySelection === 'object' && dailySelection != null) {

          if (Object.keys(dailySelection).length) {
             $('#today-picks').html('<div class="col-xs-6"><h5>Your pick today is: ' + dailySelection.homeTeam.teamName  + '. Good luck!</h5></div>');
           } else {
            noDailySelection();
           } 
         } else {
          noDailySelection();
        }
        function noDailySelection() {
          $('#today-picks').html('<div class="col-xs-6"><h5>You have not made a pick today. Select below.</h5></div>');
        }
      }
     //            if (typeof currentSelection == null) {
     //              $('#today-picks').html('<div class="col-xs-6"><h5>You have not made a pick today. Select below.</h5></div>');
     //            } else {
     //              $('#today-picks').html('<div class="col-xs-6"><h5>Your pick today is: ' + currentSelection  + '. Good luck!</h5></div>');
     //            }
     //        console.log("currentSElection function has been run.");
     // }



  });
    



  return UserView;

})
