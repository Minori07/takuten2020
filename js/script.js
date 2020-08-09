// var rellax = new Rellax(" .rellax ", {
//   // 中央寄せ
//   center: true,
// });

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

var bg = $("#loader-bg"),
  loader = $("#loader");
/* ローディング画面の非表示を解除 */
bg.removeClass("is-hide");
loader.removeClass("is-hide");

/* 読み込み完了 */

/* 10秒経ったら強制的にローディング画面を非表示にする */
setTimeout("stopload()", 10000);

//初回のみアニメーション
const keyName = "visited";
const keyValue = true;

if (!sessionStorage.getItem(keyName)) {
  //sessionStorageにキーと値を追加
  sessionStorage.setItem(keyName, keyValue);
  $("html,body").animate({ scrollTop: 0, scrollLeft: 0 }, "1");
  //ここに初回アクセス時の処理
  console.log("初めての訪問です");
  $(window).on("load", stopload);
} else {
  //ここに通常アクセス時の処理
  console.log("訪問済みです");
  bg.fadeOut(800);
  loader.fadeOut(300);
  $(".main-visual-green-wrap").css({
    animation: " main-nami-animation 4s ease-in alternate forwards",
  });
  $("svg .st0").css({
    animation: "main-animation 4s ease-in alternate forwards",
  });
  $("svg .st1").css({
    animation: "main-animation 4s ease-in alternate forwards",
  });
  $("header").css({ animation: "none" });
  $(".top-blank").css({ animation: "none" });
  $(".main-visual-logo-wrap").css({ animation: "none" });
}

/* ローディング画面を非表示にする処理 */
function stopload() {
  bg.fadeOut(800);
  loader.fadeOut(300);
  console.log("ok");
  $("header").css({
    animation: "header-first-animation 5s ease-in alternate forwards",
  });
  $(".top-blank").css({
    animation: "blank-animation 5s ease-in alternate forward",
  });
  $(".main-visual-logo-wrap").css({
    animation: "main-logo-animation 6s ease-in alternate forwards",
  });
  $(".main-visual-green-wrap").css({
    animation: " main-nami-animation 4s ease-in alternate forwards",
  });
  $("svg .st0").css({
    animation: "main-animation 4s ease-in alternate forwards",
  });
  $("svg .st1").css({
    animation: "main-animation 4s ease-in alternate forwards",
  });
}
