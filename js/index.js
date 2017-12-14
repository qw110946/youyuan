/**
 * 摇一摇
 */
if(window.DeviceMotionEvent) {
    var speed = 25;
    var x = y = z = lastX = lastY = lastZ = 0;
    window.addEventListener('devicemotion', function(){
        var acceleration =event.accelerationIncludingGravity;
        x = acceleration.x;
        y = acceleration.y;
        if(Math.abs(x-lastX) > speed || Math.abs(y-lastY) > speed) {
            window.location = './html/problem.html'
        }
        lastX = x;
        lastY = y;
    }, false);
}