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

 * Merge images module customed by HaPK

 * First input image is uploaded img render by size 66.66% x 66.66%  position 22.13% x 24.46%

 * Second input image is square 100% 100% size

 */

(function (global, factory) {

    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.mergeImages = factory();
})(this, function () {

    "use strict";

    // Defaults

    var defaultOptions = {

        format: "image/jpeg",

        quality: 0.92,

        width: 1000,

        height: 1000,

        Canvas: undefined,

        crossOrigin: undefined

    };

    // Return Promise

    var mergeImages = function (sources, options) {

        if (sources === void 0) sources = [];

        if (options === void 0) options = {};

        return new Promise(function (resolve) {

            options = Object.assign({}, defaultOptions, options);

            // Setup browser/Node.js specific variables

            var canvas = options.Canvas ? new options.Canvas() : window.document.createElement("canvas");

            var Image = options.Image || window.Image;

            // Load sources

            var images = sources.map(function (source) {

                return new Promise(function (resolve, reject) {

                    // Convert sources to objects

                    if (source.constructor.name !== "Object") {

                        source = { src: source };
                    }

                    // Resolve source and img when loaded

                    var img = new Image();

                    img.crossOrigin = options.crossOrigin;

                    img.onerror = function () {

                        return reject(new Error("Couldn't load image"));
                    };

                    img.onload = function () {

                        return resolve(Object.assign({}, source, {

                            img: img,

                            width: img.width,

                            height: img.height

                        }));
                    };

                    img.src = source.src;
                });
            });

            // Get canvas context

            var ctx = canvas.getContext("2d");

            // When sources have loaded

            resolve(Promise.all(images).then(function (images) {

                // Set canvas dimensions

                var getSize = function (dim) {

                    return options[dim] || Math.max.apply(Math, images.map(function (image) {

                        return image.img[dim];
                    }));
                };

                canvas.width = getSize("width");

                canvas.height = getSize("height");

                // Draw images to canvas

                images.forEach(function (image, index) {

                    ctx.globalAlpha = image.opacity ? image.opacity : 1;

                    if (index === 0) {

                        let position = {

                            width: 0.6666,

                            height: 0.6666,

                            top: 0.2213,

                            left: 0.2446

                        };

                        if (image.width >= image.height) {

                            let height = canvas.height * position.height;

                            let top = canvas.height * position.top;

                            let width = height * image.width / image.height;

                            let left = canvas.width * (position.left + position.width / 2) - width / 2;

                            return ctx.drawImage(image.img, left, top, width, height);
                        }

                        let width = canvas.width * position.width;

                        let left = canvas.width * position.left;

                        let height = width * image.height / image.width;

                        let top = canvas.height * (position.top + position.height / 2) - height / 2;

                        return ctx.drawImage(image.img, left, top, width, height);
                    }

                    return ctx.drawImage(image.img, 0, 0, 1000, 1000); // edited code

                    // return ctx.drawImage(image.img, image.x || 0, image.y || 0); // An old line code
                });

                if (options.Canvas && options.format === "image/jpeg") {

                    // Resolve data URI for node-canvas jpeg async

                    return new Promise(function (resolve, reject) {

                        canvas.toDataURL(options.format, {

                            quality: options.quality,

                            progressive: false

                        }, function (err, jpeg) {

                            if (err) {

                                reject(err);

                                return;
                            }

                            resolve(jpeg);
                        });
                    });
                }

                // Resolve all other data URIs sync

                return canvas.toDataURL(options.format, options.quality);
            }));
        });
    };

    return mergeImages;
});

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

    const $previewInput = $(".js-input-preview");

    const $hiddenInput = $(".js-image-value");

    const $section = $(".frame");

    const $downloadBtn = $(".js-download-image");

    const overlayImage = document.querySelector(".frame__overlay");

    if (!$previewInput.length) return;

    $previewInput.on("change", function () {

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

                    // uploaded image

                    var uploadedImageData = event.target.result;

                    mergeImages([uploadedImageData, overlayImage.src]).then(mergedImg => {

                        // show uploaded image to dom

                        $($.parseHTML("<img>")).attr("src", uploadedImageData).appendTo($target);

                        // add to hidden input

                        $hiddenInput.val(mergedImg);

                        // show download + share btns

                        $section.addClass("active");
                    });
                };

                reader.readAsDataURL(input.files[i]);
            }
        }
    });

    $downloadBtn.on("click", function (e) {

        e.preventDefault();

        var imgData = $hiddenInput.val();

        if (imgData) {

            $(this).attr("disabled", true).css("opacity", 0.6);

            return download(imgData);
        }

        console.log("No image data!");
    });
});

function download(image, type = "download", social_chanel = "") {

    $.ajax({

        url: "https://vitualevent.zend.website/download-image",

        type: "POST",

        dataType: "json",

        data: {

            image: image

        },

        success: async function (res) {

            if (res.hasOwnProperty("error")) {

                $(".ajax-response").html("<span class='text-danger'>" + res.error.message + "</span>");
            } else {

                $(".frame__btn--facebook").attr("href", "");

                $(".frame__btn--twitter").attr("href", "");

                if (type === "download") {

                    downloadImage(res.image_url, "your_image.jpg");
                } else {

                    let url_share = "";

                    if (social_chanel === "Facebook") {

                        url_share = "https://www.facebook.com/sharer.php?u=" + res.image_url + "&amp;style=layout-explore";
                    } else {

                        url_share = "https://twitter.com/share?url=" + res.image_url + "&amp;style=layout-explore";
                    }

                    window.open(url_share, this.title, "width=500,height=500,top=300px,left=300px");

                    return false;
                }
            }
        }

    });
}

function downloadImage(imageSrc, fileName = "your_image.jpg") {

    $(".js-download-image").attr("disabled", false).css("opacity", 1);

    if (iOS()) {

        window.location.href = imageSrc;

        return;
    }

    saveAs(imageSrc, fileName);
}

// Detect iPhone + iPad + Mac

function iOS() {

    return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) ||

    // iPad on iOS 13 detection

    navigator.userAgent.includes("Mac") && "ontouchend" in document;
}