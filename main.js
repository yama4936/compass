window.addEventListener('deviceorientation', function(event) {
    console.log('方角       : ' + event.alpha);
    console.log('上下の傾き : ' + event.beta);
    console.log('左右の傾き : ' + event.gamma);
    
    console.log('コンパスの向き : ' + event.webkitCompassHeading);
    console.log('コンパスの精度 : ' + event.webkitCompassAccuracy);
  });