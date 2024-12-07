// OS識別用
let os;

// DOM構築完了イベントハンドラ登録
window.addEventListener("DOMContentLoaded", init);//ページ内のHTML構造（DOM）がすべて読み込まれた後、外部リソース（画像やCSSなど）の読み込みが完了する前に実行される。

// 初期化
function init() {
    // 簡易的なOS判定
    os = detectOSSimply();
    if (os == "iphone") {
        //document.addEventListener("touchstart", permitDeviceOrientationForSafari);
        //document.addEventListener("scroll", permitDeviceOrientationForSafari);
        //document.addEventListener("touchstart", alert("タップしたよ"));
        //document.addEventListener("scroll", alert("スクロールしたよ"));
        
        // safari用。DeviceOrientation APIの使用をユーザに許可して貰う
        document.querySelector("#permit").addEventListener("click", permitDeviceOrientationForSafari);

        window.addEventListener(
            "deviceorientation",
            orientation,
            true
        );
    } else if (os == "android") {
        window.addEventListener(
            "deviceorientationabsolute",
            orientation,
            true
        );
    } else {
        window.alert("センサーがついていないため対応していません");
    }
}


// ジャイロスコープと地磁気をセンサーから取得
function orientation(event) {//addEventListenerからもらってる
    let absolute = event.absolute;
    let alpha = event.alpha;
    let beta = event.beta;
    let gamma = event.gamma;

    let degrees;
    if (os == "iphone") {
        // webkitCompasssHeading値を採用
        degrees = event.webkitCompassHeading;//iPhone特有のプロパティで、デバイスの地磁気センサーを使った方向データ（0～360度）を直接取得

    } else {
        // deviceorientationabsoluteイベントのalphaを補正
        degrees = compassHeading(alpha, beta, gamma);//デバイスのジャイロスコープのデータを基に方向を計算する
    }

    let direction;
    if (
        (degrees > 337.5 && degrees < 360) ||
        (degrees > 0 && degrees < 22.5)
    ) {
        direction = "北";
    } else if (degrees > 22.5 && degrees < 67.5) {
        direction = "北東";
    } else if (degrees > 67.5 && degrees < 112.5) {
        direction = "東";
    } else if (degrees > 112.5 && degrees < 157.5) {
        direction = "東南";
    } else if (degrees > 157.5 && degrees < 202.5) {
        direction = "南";
    } else if (degrees > 202.5 && degrees < 247.5) {
        direction = "南西";
    } else if (degrees > 247.5 && degrees < 292.5) {
        direction = "西";
    } else if (degrees > 292.5 && degrees < 337.5) {
        direction = "北西";
    }

    document.querySelector("#direction").innerHTML = direction + " : " + degrees;
    document.querySelector("#absolute").innerHTML = absolute;
    document.querySelector("#alpha").innerHTML = alpha;
    document.querySelector("#beta").innerHTML = beta;
    document.querySelector("#gamma").innerHTML = gamma;

    // コンパス針を回転
    const needle = document.getElementById('needle');
    needle.style.transform = `translate(-50%, 0) rotate(${degrees}deg)`;

    // イベントリスナーを追加してジャイロスコープイベントを監視
    window.addEventListener('deviceorientationabsolute', orientation);

}

// 端末の傾き補正（Android用）
// https://www.w3.org/TR/orientation-event/
function compassHeading(alpha, beta, gamma) {//Android専用の角度計算用関数なので読まない
    let degtorad = Math.PI / 180; // Degree-to-Radian conversion

    let _x = beta ? beta * degtorad : 0; // beta value
    let _y = gamma ? gamma * degtorad : 0; // gamma value
    let _z = alpha ? alpha * degtorad : 0; // alpha value

    let cX = Math.cos(_x);
    let cY = Math.cos(_y);
    let cZ = Math.cos(_z);
    let sX = Math.sin(_x);
    let sY = Math.sin(_y);
    let sZ = Math.sin(_z);

    // Calculate Vx and Vy components
    let Vx = -cZ * sY - sZ * sX * cY;
    let Vy = -sZ * sY + cZ * sX * cY;

    // Calculate compass heading
    let compassHeading = Math.atan(Vx / Vy);

    // Convert compass heading to use whole unit circle
    if (Vy < 0) {
        compassHeading += Math.PI;
    } else if (Vx < 0) {
        compassHeading += 2 * Math.PI;
    }

    return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
}

// OSの判定
function detectOSSimply() {
    let ret;//userAgentで読み込んでindexofで探している
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0
    ) {
        // iPad OS13のsafariはデフォルト「Macintosh」なので別途要対応
        ret = "iphone";
    } else if (navigator.userAgent.indexOf("Android") > 0) {
        ret = "android";
    } else {
        ret = "pc";
    }

    return ret;
}

// iPhone + Safariの場合はDeviceOrientation APIの使用許可をユーザに求める
function permitDeviceOrientationForSafari() {
    DeviceOrientationEvent.requestPermission()//requestPermission()で通知を送るDeviceOrientationEventが許可したい内容
        .then(response => {
            if (response === "granted") {
                window.addEventListener(
                    "deviceorientation",
                    detectDirection
                );
            }
        })
        .catch(console.error);
}