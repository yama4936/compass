window.addEventListener('deviceorientation', function (event) {
    console.log('方角       : ' + event.alpha);
    console.log('上下の傾き : ' + event.beta);
    console.log('左右の傾き : ' + event.gamma);

    console.log('コンパスの向き : ' + event.webkitCompassHeading);
    console.log('コンパスの精度 : ' + event.webkitCompassAccuracy);
});

// 簡易OS判定
function detectOSSimply() {
    let ret;
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0
    ) {
        // iPad OS13以上のsafariはデフォルト「Macintosh」なので別途要対応
        ret = "iphone";
    } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
    } else {
        ret = "pc";
    }

    return ret;
}

