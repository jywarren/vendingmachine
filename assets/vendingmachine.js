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

Pad = Class({

})

VendingMachine = Class({
  snacks: [],
  buttons: "ABCD12345678".split(''),
  entry: "",
  initialize: function() {

    /* set up tilt listeners */
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
        name: "Pop Tarts",
        label: "A"+(i+1)
      }))
    }

    var machine = this;
    setInterval(this.draw,50);

    $('.machine').on('click',this,this.onClick);

    /* Set up buttons */
    for (var i in this.buttons) {
      var val       = this.buttons[i],
          classname = 'btn-'+val;

      $('.pad .btns').append('<div class="btn btn-inverse">'+this.buttons[i]+'</div>')
      $('.pad .btns *').last().addClass(classname);
      var btn = $('.'+classname);
      btn.attr('data-val',val);

      /* Set up button listeners */
      btn.click(function(e) {
        machine.entry += $(this).attr('data-val');
        machine.print(machine.entry);
        if (machine.entry.length >= 2) {
          setTimeout(function() {
            $('.pad').hide();
            machine.enter.bind(machine);
          },500)
        }
      })
    }
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

  /* Process user entry */
  enter: function() {
    $.each(this.snacks,function(i,snack) {
      console.log(snack);
      if (snack.label == this.entry) {
        console.log(this.entry);
        snack.active = true;
      }
    },this)
  },

  print: function(msg) {
    if (msg.length > 11) {
      // possibly do a marquee
    }
    $('.readout').html(msg);
  }
})

Snack = Class({
  falling: false,
  vector: 0,
  initialize: function(options) {
    this.name = options['name'];
    this.label = options['label'];
    this.hits = options['hits'] || 3;
    this.active = options['active'] || false;
    $('.machine').append('<div class="slot"></div>');
    this.slot = $('.machine .slot').last();
    this.slot.append('<div class="snack img"><img src="snacks/pop-tarts.png" /></div>');
    this.el = $('.machine .slot .snack').last();
    this.el.append('<div class="snack-label">'+this.label+'</div>');

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

var machine, pad;

jQuery(document).ready(function() {
  machine = new VendingMachine();
  pad = new Pad();
})
