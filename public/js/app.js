define(function(require) {

  //Load jquery + add cookie funcitonality to jquery
  var $ = require('jquery');
  require('jquery-cookie');

  var Thorax = require('thorax');
  var backbone = require('backbone');
  var Router = require('router');
  var app = {};
  var UserView = require('views/user-view');

  var UserModel = require('models/user-model');
  var currentUserModel = new UserModel({
    initialize:  function () {
    var curUserName = $.cookie('user-name');

      if (curUserName) {
        this.set('userName', curUserName);
        this.set('id', curUserName);
        this.fetch();
      }
    }
  });
  
  var userView = new UserView({
    el: '#user-display',
    template: require('hbs!templates/user-display'),
    model: currentUserModel
  });

  var userSigninView = new UserView({
    el: '#user-signin',
    template: require('hbs!templates/user-signin'),
    render: function() { this.$el.html(this.template(this.model.toJSON())); },
    model: currentUserModel
  });

  var userSignupView = new UserView({
    el: '#user-signup',
    template: require('hbs!templates/user-signup'),
    render: function() { this.$el.html(this.template(this.model.toJSON())); },
    model: currentUserModel
  });	

  var userFoodView = new UserView({
    el: '#user-food',
    template: require('hbs!templates/user-food'),
    render: function() { this.$el.html(this.template(this.model.toJSON())); },
    model: currentUserModel
  }); 

  
  var Schedule           = require('collections/schedule-collection');
  var ScheduleView = require('views/schedule-view');
  
  var currentSchedule  = new Schedule();

  currentSchedule.fetch();


  var currentScheduleView = new ScheduleView(currentSchedule);

  userView.render();
  var router = new Router({
    // User Header Views
    'userView': userView,
    'userSigninView': userSigninView,
    'userSignupView': userSignupView,

    // Schedule Views
    'currentScheduleView': currentScheduleView,
    'userFoodView': userFoodView
    // User Awards Views
  });

  Backbone.history.start();

});