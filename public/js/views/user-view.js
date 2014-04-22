
define(function (require) {
  var Backbone = require('backbone');
  var $ = require('jquery');
  require('jquery-cookie');

  var UserView = Backbone.View.extend({
   name: 'UserView',

   events: {
    'click #signup-button': 'signUp',
    'click #signin-button': 'signIn',
    'click #user-signout': 'signOut'
   },

    initialize: function (options) {
      
      // Template initialization Workaround
      if (options.template) {
      	this.template = options.template;
      }
      var self=this;
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'manualRerender', this.render);
      
      this.render();
    },

    loginTest: function() {
    },

    render: function() { 
      this.$el.html(this.template(this.model.toJSON())); 
      if (this.model.get('userName')) {
         this.renderRecentResult();  
      }
    },

    renderRecentResult: function() {
      var recentTemplate = require('hbs!templates/recent-game');
      $('#most-recent-result').html(recentTemplate());
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

      alert("Thanks for signing up, " + userName + "!\nYour password is: " + password);
      window.location.href = "#user-view"; 
    },

    signOut: function() {
      this.$el.hide();
      $.removeCookie('user-name');
      $('#most-recent-result').html('');
      //this.model.clearData();
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
            $('#failed-login').html('<p class="text-danger">Invalid username or password.');
             self.$el.show();
             console.log('Incorrect Password');
          }
        }, 

        error: function(model, response, options) {
          $('#user-loading').html('');
          console.log(response);
          //if(response.responseText === "No user found.") {
            $('#failed-login').html('<p class="text-danger">Invalid username or password.');
            self.$el.show();
        },


      });
      
   },
    

  });

  return UserView;

})
