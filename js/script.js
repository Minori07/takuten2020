$(function () {
  var style = '<link rel="stylesheet" href="./css/style.css">';
  var mstyle = '<link rel="stylesheet" href="./css/mobile_css.css">';
  $("head link:last").after(style);
  if (screen.width < 480) {
    $("head link:last").after(mstyle);
  }
});

let client_h = $(".main-visual-img").height() + 20;
console.log(client_h);
var m_top = client_h + "px";
$(".mobile-main-caption").css({ top: m_top });
var m_bottom = $(".main-visual-img").bottom();
var s_top = window.height - m_bottom + "px";

var headNav = $("header");

if (screen.width > 480) {
  //scrollだけだと読み込み時困るのでloadも追加
  $(window).on("load scroll", function () {
    //現在の位置が500px以上かつ、クラスfixedが付与されていない時
    if ($(this).scrollTop() > 500 && headNav.hasClass("fixed") == false) {
      //headerの高さ分上に設定
      headNav.css({ top: "-100px" });
      $(".menu-info").css({ visibility: "visible" });
      //クラスfixedを付与
      headNav.addClass("fixed");
      //位置を0に設定し、アニメーションのスピードを指定
      headNav.animate({ top: 0 }, 600);
    }
    //現在の位置が300px以下かつ、クラスfixedが付与されている時にfixedを外す
    else if ($(this).scrollTop() < 500 && headNav.hasClass("fixed") == true) {
      headNav.removeClass("fixed");
      $(".menu-info").css({ visibility: "hidden" });
    }
  });
} else {
  $(".main-visual-scroll").css({ bottom: m_top });
  //scrollだけだと読み込み時困るのでloadも追加
  $(window).on("load scroll", function () {
    //現在の位置が500px以上かつ、クラスfixedが付与されていない時
    if ($(this).scrollTop() > 20) {
      //headerの高さ分上に設定
      //クラスfixedを付与
      $(".header-nav-list").css({ opacity: 0 });
      //位置を0に設定し、アニメーションのスピードを指定
      $(".menu-button").css({ visibility: "visible" });
      $(".menu-button").css({ opacity: 1 });
    }
    //現在の位置が300px以下かつ、クラスfixedが付与されている時にfixedを外す
    else if ($(this).scrollTop() < 20) {
      $(".header-nav-list").css({ opacity: 1 });
      $(".menu-button").css({ opacity: 0 });
      $(".menu-button").css({ visibility: "hidden" });
    }
  });
}

$(function () {
  // $("html,body").animate({ scrollTop: 0, scrollLeft: 0 }, "1");

  // #で始まるアンカーをクリックした場合に処理
  $('a[href^="#"]').click(function () {
    // スクロールの速度
    var speed = 400; // ミリ秒
    // アンカーの値取得
    var href = $(this).attr("href");
    // 移動先を取得
    var target = $(href == "#" || href == "" ? "html" : href);
    // 移動先を数値で取得
    var position = target.offset().top - 100;
    // スムーススクロール
    $("body,html").animate(
      { scrollTop: position, scrollLeft: 0 },
      speed,
      "swing"
    );
    return false;
  });

  $(".js-modal-open").each(function () {
    $(this).on("click", function () {
      var target = $(this).data("target");
      var modal = document.getElementById(target);
      $(modal).fadeIn();
      return false;
    });
  });
  $(".modal-close").on("click", function () {
    $(".js-modal").fadeOut();
    return false;
  });

  var menu = document.getElementById("menu");
  var mopen = false;
  $(".menu-button").on("click", function () {
    if (!mopen) {
      $(".menu-open").css({ visibility: "visible" });
      $(".menu-open").css({ opacity: 1 });
      menu.innerHTML = "close";
      $(".menu-button").css({ "background-color": "#f0ede5" });
      mopen = true;
      // 繰り返し処理
      $(".menu-open-nav-list li").each(function (i) {
        $(this)
          .delay(i * 100)
          .animate({ transform: "translate(0, 0)", opacity: 1 }, 1000);
      });
      return false;
    }
    if (mopen) {
      $(".menu-open").css({ opacity: 0 });
      $(".menu-open").css({ visibility: "hidden" });
      menu.innerHTML = "menu";
      $(".menu-button").css({ "background-color": "white" });
      mopen = false;
      $(".menu-open-nav-list li").each(function (i) {
        $(this).animate({ transform: "translate(0, 50px)", opacity: 0 }, 1000);
      });
      return false;
    }
  });
  $(".index-menu a").on("click", function () {
    if (mopen) {
      console.log("ok");
      $(".menu-open").css({ opacity: 0 });
      $(".menu-open").css({ visibility: "hidden" });
      menu.innerHTML = "menu";
      $(".menu-button").css({ "background-color": "white" });
      mopen = false;
      return false;
    }
  });
});

//初回のみアニメーション
const keyName = "visited";
const keyValue = true;

if (!sessionStorage.getItem(keyName)) {
  //sessionStorageにキーと値を追加
  sessionStorage.setItem(keyName, keyValue);
  $("html,body").animate({ scrollTop: 0, scrollLeft: 0 }, "1");
  //ここに初回アクセス時の処理
  console.log("初めての訪問です");
} else {
  //ここに通常アクセス時の処理
  console.log("訪問済みです");
  $("header").css({ animation: "none" });
  $(".top-blank").css({ animation: "none" });
  $(".main-visual-logo-wrap").css({ animation: "none" });
}

// var greet = document.getElementById("greet");
// var size = screen.width + "," + screen.height;
// greet.innerHTML = size;
