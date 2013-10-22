(function(window) {
    var navigator = window.navigator,
        adapter = window.adapter,
        supporter = window.supporter,
        result = function(val, defaultValue) {
            var type = typeof val;
            return type === 'undefined' ? defaultValue : (type === 'function' ? val.call(window) : val);
        };

    var initialized = false,
        callbackFn, options,
        resizeTimer,
        resizer;

    function init() {
        if (!initialized) {
            initialized = true;
            window.addEventListener('resize', resize, false);
            window.addEventListener('orientationchange', adapter.createOrientationChangeProxy(resize), false);
        }
    }

    function resize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            resizeTimer = null;
            processResize();
        }, 100);
    }

    function processResize() {
        var innerWidth = window.innerWidth,
            innerHeight = window.innerHeight,
            screenWidth = window.screen.width,
            screenHeight = window.screen.height,
            offsetLeft = result(options.offsetLeft, 0),
            offsetRight = result(options.offsetRight, 0),
            offsetTop = result(options.offsetTop, 0),
            offsetBottom = result(options.offsetBottom, 0),
            width = innerWidth, height;

        if (supporter.isSmartDevice && supporter.isSafari && !supporter.os.ios7) { // 计算高度，收起 iOS6 顶部导航条
            height = navigator.standalone ? innerHeight : (window.orientation === 0 ? screenHeight - 44 : screenWidth - 32) - 20;
            height = height < innerHeight ? innerHeight : height;
        } else {
            height = innerHeight;
        }

        width -= offsetLeft - offsetRight;
        height -= offsetTop - offsetBottom;

        if (width != resizer.width || height != resizer.height) {
            resizer.width = width;
            resizer.height = height;
            if (callbackFn) callbackFn.call(window, width, height);
        }
    }

    resizer = {
        on: function(cb, opts) {
            callbackFn = cb;
            options = opts || {};
            init();
            resize();
        }
    };

    window.resizer = resizer;
})(window);