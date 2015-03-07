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

    for (var i = 0; i < 16; i++) {
      this.snacks.push(new Snack({
        name: "Pop Tarts"
      }))
    }

    setInterval(this.draw,50);
  },

  noTilt: function() {
    machine.hasTilt = false;
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

  },
})

Snack = Class({
  falling: false,
  vector: 0,
  initialize: function(options) {
    this.name = options['name'];
    this.hits = options['hits'] || 3;
    $('.machine').append('<div class="snack poptart"></div>');
    this.el = $('.machine .snack').last();
    this.el.append('<h2>'+this.name+'</h2>');

    /* make toucable */
    this.el.click(this.onClick);
  },

  onClick: function(e) {
    this.hits -= 1;
    console.log('clicked',this,this.hits)
    if (this.hits <= 0) this.falling = true;
  },

  draw: function() {
    if (this.falling) {
      var height = this.el.css('top');
      this.el.css('top',height-5);
    }
  }
})

var machine

jQuery(document).ready(function() {
  machine = new VendingMachine();
})
