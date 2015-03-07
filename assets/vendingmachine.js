/* 
 * https://github.com/richtr/Full-Tilt/blob/master/examples/box2d.html
 */

$V = {

  initialize: function() {

    this.promise = FULLTILT.getDeviceOrientation({'type': 'game'});

    this.promise.then(function(orientationControl) {
      orientationControl.listen(function() {

        //euler = orientationControl.getLastRawEventData();
        $V.euler = orientationControl.getScreenAdjustedEuler();
        $V.quaternion = orientationControl.getScreenAdjustedQuaternion();
       
      })
    })

    setInterval($V.draw,50);
  },

  draw: function() {

    $V.tilt = -$V.euler.gamma + $V.euler.beta-90;

    $(".snack").css('-moz-transform',   'rotate('+$V.tilt+'deg)')
    $(".snack").css('-webkit-transform','rotate('+$V.tilt+'deg)')
    $(".snack").css('-o-transform',     'rotate('+$V.tilt+'deg)')
  }

}

$V.initialize()
