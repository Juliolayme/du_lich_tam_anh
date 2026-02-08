(function ($) {
    "use strict";

    function hideSpinner() {
        setTimeout(function () {
            var $s = $('#spinner');
            if ($s.length > 0) {
                $s.removeClass('show');
            }
        }, 1);
    }

    function initSite() {
        hideSpinner();
        new WOW().init();

        // Sticky Navbar: keep navbar fixed at top; only toggle shadow on scroll
        $(window).off('scroll.site').on('scroll.site', function () {
            if ($(this).scrollTop() > 50) {
                $('.sticky-top').addClass('shadow-sm');
            } else {
                $('.sticky-top').removeClass('shadow-sm');
            }
        });

            // Services carousel (used on Blog/Services section)
            if ($.fn.owlCarousel && $('.services-carousel').length) {
                $('.services-carousel').owlCarousel({
                    autoplay: false,
                    smartSpeed: 800,
                    dots: false,
                    loop: true,
                    margin: 25,
                    nav: true,
                    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
                    responsiveClass: true,
                    responsive: {
                        0: { items: 1 },
                        576: { items: 1 },
                        768: { items: 2 },
                        992: { items: 3 }
                    }
                });
            }

        // Car Categories
        if ($.fn.owlCarousel) {
            $(".categories-carousel").owlCarousel({
                autoplay: true,
                smartSpeed: 1000,
                dots: false,
                loop: true,
                margin: 25,
                nav : true,
                navText : [
                    '<i class="fas fa-chevron-left"></i>',
                    '<i class="fas fa-chevron-right"></i>'
                ],
                responsiveClass: true,
                responsive: {
                    0:{ items:1 },
                    576:{ items:1 },
                    768:{ items:1 },
                    992:{ items:2 },
                    1200:{ items:3 }
                }
            });
        }

       // Back to top button
       $(window).off('scroll.backtotop').on('scroll.backtotop', function () {
            if ($(this).scrollTop() > 300) {
                $('.back-to-top').fadeIn('slow');
            } else {
                $('.back-to-top').fadeOut('slow');
            }
        });
        $(document).off('click.backtotop', '.back-to-top').on('click.backtotop', '.back-to-top', function () {
            $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
            return false;
        });

        // Quote form -> open mail client with filled details
        $(document).off('click.quote', '#quoteSubmit').on('click.quote', '#quoteSubmit', function (e) {
            e.preventDefault();
            var $f = $('#quoteForm');
            if ($f.length === 0) return;
            var vehicle = $f.find('[name="vehicle_type"]').val() || '';
            var full_name = $f.find('[name="full_name"]').val() || '';
            var phone = $f.find('[name="phone"]').val() || '';
            var pickup = $f.find('[name="pickup"]').val() || '';
            var dropoff = $f.find('[name="dropoff"]').val() || '';
            var pickup_date = $f.find('[name="pickup_date"]').val() || '';
            var pickup_time = $f.find('[name="pickup_time"]').val() || '';
            var drop_date = $f.find('[name="drop_date"]').val() || '';
            var drop_time = $f.find('[name="drop_time"]').val() || '';

            var subject = encodeURIComponent('Yêu cầu đặt xe - Du Lịch Tâm Anh');
            var bodyLines = [];
            bodyLines.push('Loại xe: ' + vehicle);
            bodyLines.push('Địa điểm đón: ' + pickup);
            bodyLines.push('Địa điểm đến: ' + dropoff);
            bodyLines.push('Họ và tên: ' + full_name);
            bodyLines.push('SĐT: ' + phone);
            bodyLines.push('Ngày giờ đón: ' + pickup_date + ' ' + pickup_time);
            bodyLines.push('Ngày giờ đến: ' + drop_date + ' ' + drop_time);
            var body = encodeURIComponent(bodyLines.join('\n'));

            // change the email below to the destination address you want (used as fallback)
            var mailto = 'mailto:tamanhluxury@gmail.com?subject=' + subject + '&body=' + body;

            // Configurable Formspree endpoint. Replace with your Formspree form ID:
            // e.g. 'https://formspree.io/f/XXXXXXXX'
            var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvzbpzpd';

            function showPopup(message) {
                var $p = $('<div class="quote-popup">').text(message).css({
                    position: 'fixed',
                    right: '20px',
                    bottom: '20px',
                    'background-color': '#0d6efd',
                    color: '#fff',
                    padding: '12px 16px',
                    'border-radius': '6px',
                    'box-shadow': '0 4px 12px rgba(13,110,253,0.2)',
                    'z-index': 2000,
                    display: 'none'
                }).appendTo('body');
                $p.fadeIn(200);
                setTimeout(function () {
                    $p.fadeOut(300, function () { $p.remove(); });
                }, 3500);
            }

            // If Formspree endpoint is configured, send via fetch; otherwise fallback to mailto
            if (FORMSPREE_ENDPOINT && FORMSPREE_ENDPOINT.indexOf('formspree.io') !== -1) {
                var payload = {
                    full_name: full_name,
                    phone: phone,
                    vehicle_type: vehicle,
                    pickup: pickup,
                    dropoff: dropoff,
                    pickup_date: pickup_date,
                    pickup_time: pickup_time,
                    drop_date: drop_date,
                    drop_time: drop_time
                };
                fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }).then(function (res) {
                    if (res.ok) {
                        showPopup('Gửi thông tin thành công. Tâm Anh sẽ liên hệ lại quý khách! Cảm ơn quý khách đã tin tưởng!');
                        $f[0].reset();
                    } else {
                        return res.json().then(function (data) { throw data; });
                    }
                }).catch(function (err) {
                    showPopup('Gửi thất bại. Đang mở ứng dụng mail làm phương án dự phòng.');
                    window.location.href = mailto;
                });
            } else {
                // no endpoint configured — fallback to opening mail client
                showPopup('Mở ứng dụng mail để gửi (fallback).');
                window.location.href = mailto;
            }
        });
    }

    // Load header/footer partials first, then initialize site
    $(function () {
        $('#site-header').load('partials/header.html', function () {
            $('#site-footer').load('partials/footer.html', function () {
                initSite();
            });
        });
    });

})(jQuery);

