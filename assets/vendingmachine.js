/* 
 * https://github.com/richtr/Full-Tilt/blob/master/examples/box2d.html

* track machine tapping, tilting; pass on to snacks only if pass threshold 
* change snack color as tapped; as resistance string shortens
* implement numberpad
* "RLFBT" T = tap

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
        active: false,
        name: "Pop Tarts"
      }))
    }

    var machine = this;
    setInterval(this.draw,50);

    $('.machine').on('click',this,this.onClick);
  },

  onClick: function(e) {
    for (var i in machine.snacks) {
      var snack = machine.snacks[i];
      if (snack.active) snack.tap.apply(snack);
    }
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
    }
  },

  tap: function() {
    var snack = this;
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
      if (height >= $('.machine').height()) { 
        this.acceleration = 0;
      }
      this.el.css('top',height+this.acceleration);
    }
  }
})

var machine

jQuery(document).ready(function() {
  machine = new VendingMachine();
})
