// menu toggle
$(function () {
    $(".menu-toggle").on("click", function () {
        var $toggle = $(this);

        $toggle.toggleClass("active").siblings(".menu-sub").slideToggle();

        $toggle.siblings(".menu-mega").children(".menu-sub").slideToggle();

        $toggle.parent().siblings(".menu-item-group").children(".menu-sub").slideUp();

        $toggle.parent().siblings(".menu-item-group").children(".menu-mega").children(".menu-sub").slideUp();

        $toggle.parent().siblings(".menu-item-group").children(".menu-toggle").removeClass("active");
    });

    $(".menu-item-group > .menu-link, .menu-item-mega > .menu-link").on("click", function (e) {
        if ($(window).width() < 1200 || !mobileAndTabletCheck()) return;

        e.preventDefault();
    });
});

// navbar mobile toggle
$(function () {
    var $body = $("html, body");
    var $navbar = $(".js-navbar");
    var $navbarToggle = $(".js-navbar-toggle");

    $navbarToggle.on("click", function () {
        $navbarToggle.toggleClass("active");
        $navbar.toggleClass("is-show");
        $body.toggleClass("overflow-hidden");
    });
});

$(function () {
    var $moveTop = $(".btn-movetop");
    var $window = $(window);
    var $body = $("html");

    if (!$moveTop.length) return;

    $window.on("scroll", function () {
        if ($window.scrollTop() > 150) {
            $moveTop.addClass("show");

            return;
        }

        $moveTop.removeClass("show");
    });

    $moveTop.on("click", function () {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    });
});

// swiper template
function addSwiper(selector, options = {}) {
    return Array.from(document.querySelectorAll(selector), function (item) {
        var $sliderContainer = $(item),
            $sliderEl = $sliderContainer.find(selector + "__container");

        if (options.navigation) {
            $sliderContainer.addClass("has-nav");
            options.navigation = {
                prevEl: $sliderContainer.find(selector + "__prev"),
                nextEl: $sliderContainer.find(selector + "__next")
            };
        }

        if (options.pagination) {
            $sliderContainer.addClass("has-pagination");
            options.pagination = {
                el: $sliderContainer.find(selector + "__pagination"),
                clickable: true
            };
        }

        return new Swiper($sliderEl, options);
    });
}

/**

 * Thiết lập trò chơi vòng quay may mắn

 */

$(function () {

    const $circle = $(".m-game__bg");

    const $light = $(".m-game__light");

    var turn = 0; // Số lượt quay

    var token = true;

    var totalGift = 8; // Tổng số phần thưởng (chia đều cho vòng quay 360 độ)

    var oneGiftDeg = 360 / totalGift;

    $(".js-game-start").on("click", function () {

        /**
           *  Kiểm tra token (đang quay thì không được ấn thêm)
           */

        if (!token) return;

        token = false;

        // Chặn chỉ cho quay 1 lượt

        if (turn >= 1) {

            // Thông báo hết lượt quay

            console.log("Bạn đã hết lượt chơi!");

            return;
        }

        turn++;

        $light.hide();

        var giftIndex = randomGift();

        console.log("GiftIndex: ", giftIndex);

        var oldDeg = $circle.data("rotate") ? $circle.data("rotate") : 0;

        var deg = giftIndex * oneGiftDeg + 3 * 360 + oldDeg + oldDeg % 360;

        $circle.data("rotate", deg);

        $circle.css("transform", `rotate(${deg}deg)`);

        /**
           * Sau thời gian quay
           * Cần tạo 1 hàm tên showGameResult(giftIndex) để
           * tính toán đưa ra phần thưởng tương ứng
           * Truyền vào tham số 'giftIndex' là số thứ tự phần thưởng (tính từ 0 - 15)
           *
           * Nếu chưa tạo hàm này sẽ chạy code show sản phẩm demo
           */

        setTimeout(() => {

            token = true;

            if (window.showGameResult && typeof window.showGameResult == "function") {

                showGameResult(giftIndex);
            } else {

                // Hiển thị phần thưởng demo

                $light.fadeIn();

                var href = "./success.html";

                if (giftIndex === 1 || giftIndex === 5) {

                    href = "./goodluck.html";
                }

                setTimeout(() => {

                    window.location.href = href;
                }, 1500);
            }
        }, 7000);
    });
});

/**

 * Lấy random 1 sản phẩm dựa theo tỉ lệ cho sẵn;

 * @returns index sản phẩm đếm từ 0->7

 */

function randomGift() {

    var ratios = Array.from(document.querySelectorAll(".js-game-gift"), item => {

        return parseFloat($(item).data("scale") || 0);
    });

    var length = ratios.length;

    var rand = Math.random() * 100;

    var total = 0;

    var giftIndex = 0;

    do {

        total += ratios[giftIndex++];
    } while (giftIndex < length && (ratios[giftIndex - 1] == 0 || total <= rand));

    return giftIndex - 1;
}

/**

 * Preview image input when uploaded

 */

$(function () {

    $(".js-input-preview").on("change", function () {

        let input = this;

        let parent = $(input).data("parent");

        let target = $(input).data("target");

        let multiple = $(input).prop("multiple");

        let $target;

        if (!target) return;

        if (parent) {

            $target = $(input).closest(parent).find(target);
        } else {

            $target = $(target);
        }

        if (!multiple) {

            $target.empty();
        }

        if (input.files) {

            let filesAmount = input.files.length;

            for (i = 0; i < filesAmount; i++) {

                let reader = new FileReader();

                reader.onload = function (event) {

                    $($.parseHTML("<img>")).attr("src", event.target.result).appendTo($target);
                };

                reader.readAsDataURL(input.files[i]);
            }
        }
    });
});

/**

 * Download image

 *

 */

$(function () {

    const $previewInput = $(".js-input-preview");

    if (!$previewInput.length) return;

    const $hiddenInput = $(".js-image-value");

    const $section = $(".frame");

    $previewInput.on("change", function () {

        const el = document.querySelector(".frame__frame");

        const scale = 3;

        setTimeout(() => {

            domtoimage.toJpeg(el, {

                width: el.clientWidth * scale,

                height: el.clientHeight * scale,

                style: {

                    transform: "scale(" + scale + ")",

                    "transform-origin": "top left"

                }

            }).then(dataUrl => {

                $section.addClass("active");

                $hiddenInput.val(dataUrl);
            });
        }, 300);
    });

    $(".js-download-image").on("click", function (e) {

        e.preventDefault();

        var imgData = $hiddenInput.val();

        if (imgData) {

            download([imgData]);

            return;
        }

        console.log("No image data!");
    });
});

function download(images) {

    images.map(function (image) {

        let link = document.createElement("a");

        link.href = image;

        link.download = "Download.jpg";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    });
}