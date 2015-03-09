/* 
 * https://github.com/richtr/Full-Tilt/blob/master/examples/box2d.html
 */

Class = function(methods) {   
  var klass = function() {    
    this.initialize.apply(this, arguments);          
  };  
  
  for (var property in methods) { 
    klass.prototype[property] = methods[property];
  }
        
  if (!klass.prototype.initialize) klass.prototype.initialize = function(){};      
  
  return klass;    
};

VendingMachine = Class({
  snacks: [],
  initialize: function() {

    this.promise = FULLTILT.getDeviceOrientation({'type': 'game'});

    this.promise.then(function(orientationControl) {
      orientationControl.listen(function() {
        machine.hasTilt = true;

        machine.euler = orientationControl.getScreenAdjustedEuler();
        machine.quaternion = orientationControl.getScreenAdjustedQuaternion();
       
      })

      if (!orientationControl.isAvailable(orientationControl.GAMMA)) {
        machine.noTilt();
      }
    }).catch(function(message) {
      // Device Orientation Events are not supported
      machine.noTilt();
    });

    /* Set up snacks */

    for (var i = 0; i < 15; i++) {
      this.snacks.push(new Snack({
        name: "Pop Tarts"
      }))
    }

    this.snacks.push(new Snack({
      name: "Pop Tarts",
      active: true
    }))

    var machine = this
    setInterval(this.draw,50);
  },

  noTilt: function() {
    this.hasTilt = false;
    console.log('no tilt');
    $(".notilt").modal();
    $(".notilt").show();
  },

  draw: function() {

    if (machine.hasTilt) {

      machine.tilt = -machine.euler.gamma + machine.euler.beta-90;
     
      $(".snack").css('-moz-transform',   'rotate('+machine.tilt+'deg)');
      $(".snack").css('-webkit-transform','rotate('+machine.tilt+'deg)');
      $(".snack").css('-o-transform',     'rotate('+machine.tilt+'deg)');

    }
    $.each(machine.snacks, function(i,snack) {
      snack.draw.apply(snack);
    })

  },
})

Snack = Class({
  falling: false,
  vector: 0,
  initialize: function(options) {
    this.name = options['name'];
    this.hits = options['hits'] || 3;
    this.active = options['active'] || false;
    $('.machine').append('<div class="slot"></div>');
    this.slot = $('.machine .slot').last();
    this.slot.append('<div class="snack poptart"></div>');
    this.el = $('.machine .slot .snack').last();
    this.el.append('<h2>'+this.name+'</h2>');

    /* make toucable */
    if (this.active) {
      this.el.on('click',this,this.onClick);
    }
  },

  onClick: function(e) {
    var snack = e.data;
    snack.hits -= 1;
    if (snack.hits <= 0) {
      snack.falling = true;
      snack.acceleration = 1;
    }
  },

  draw: function() {
    if (this.falling) {
      var height = parseInt(this.el.css('top').split('px')[0]);
      this.acceleration *= 2;
      if (height >= $('.machine').height()) this.acceleration = 0;
      this.el.css('top',height+this.acceleration);
    }
  }
})

var machine

jQuery(document).ready(function() {
  machine = new VendingMachine();
})
