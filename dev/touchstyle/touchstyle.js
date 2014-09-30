/*!
 * TouchStyle - v1.0.0
 * 
 * @homepage https://github.com/maxzhang/touchstyle
 * @author maxzhang<zhangdaiping@gmail.com> http://maxzhang.github.io
 */
(function(window) {
    
    /*--------------- 公共方法 ---------------*/
    
    var document = window.document,
        toString = Object.prototype.toString,
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];
    
    function isFunction(it) {
        return toString.call(it) === '[object Function]';
    }
    
    function isArray(it) {
        return toString.call(it) === '[object Array]';
    }
    
    function isNumber(it) {
        return toString.call(it) === '[object Number]';
    }
    
    function isString(it) {
        return toString.call(it) === '[object String]';
    }
    
    function isUndefined(it) {
        return typeof it === 'undefined';
    }
    
    function noop() {}
    
    function each(c, cb) {
        if (c && cb) {
            if (isArray(c)) {
                for (var i = 0, l = c.length; i < l; i++) {
                    if (cb.call(null, c[i], i, c) === false) {
                        break;
                    }
                }
            } else {
                for (var o in c) {
                    if (cb.call(null, o, c[o]) === false) {
                        break;
                    }
                }
            }
        }
    }
    
    function extend(target, obj) {
        if (target && obj && typeof obj === 'object') {
            var i, j, k;

            for (i in obj) {
                target[i] = obj[i];
            }
            
            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (obj.hasOwnProperty(k)) {
                        target[k] = obj[k];
                    }
                }
            }
        }
        return target;
    }
    
    var vendor = (function() {
        var dummyStyle = document.createElement('div').style,
            propPrefix = (function() {
                var vendors = 'webkitT,MozT,msT,OT,t'.split(','),
                    t,
                    i = 0,
                    l = vendors.length;

                for (; i < l; i++) {
                    t = vendors[i] + 'ransform';
                    if (t in dummyStyle) {
                        return vendors[i].substr(0, vendors[i].length - 1);
                    }
                }

                return false;
            }()),
            cssPrefix = propPrefix ? '-' + propPrefix.toLowerCase() + '-' : '',
            prefixStyle = function(style) {
                if (propPrefix === '') return style;
                style = style.charAt(0).toUpperCase() + style.substr(1);
                return propPrefix + style;
            },
            transform = prefixStyle('transform'),
            transition = prefixStyle('transition'),
            transitionProperty = prefixStyle('transitionProperty'),
            transitionDuration = prefixStyle('transitionDuration'),
            transformOrigin = prefixStyle('transformOrigin'),
            transitionTimingFunction = prefixStyle('transitionTimingFunction'),
            transitionDelay = prefixStyle('transitionDelay'),
            transitionEndEvent = (function() {
                if (propPrefix == 'webkit' || propPrefix === 'O') {
                    return propPrefix.toLowerCase() + 'TransitionEnd';
                }
                return 'transitionend';
            }()),
            animation = prefixStyle('animation'),
            animationName = prefixStyle('animationName'),
            animationDuration = prefixStyle('animationDuration'),
            animationTimingFunction = prefixStyle('animationTimingFunction'),
            animationDelay = prefixStyle('animationDelay');

        dummyStyle = null;

        return {
            propPrefix: propPrefix,
            cssPrefix: cssPrefix,
            transform: transform,
            transition: transition,
            transitionProperty: transitionProperty,
            transitionDuration: transitionDuration,
            transformOrigin: transformOrigin,
            transitionTimingFunction: transitionTimingFunction,
            transitionDelay: transitionDelay,
            transitionEndEvent: transitionEndEvent,
            animation: animation,
            animationName: animationName,
            animationDuration: animationDuration,
            animationTimingFunction: animationTimingFunction,
            animationDelay: animationDelay
        };
    }());
    
    function listenTransition(target, duration, callbackFn) {
        var me = this,
            clear = function() {
                if (target.transitionTimer) clearTimeout(target.transitionTimer);
                target.transitionTimer = null;
                target.removeEventListener(vendor.transitionEndEvent, handler, false);
            },
            handler = function() {
                clear();
                if (callbackFn) callbackFn.call(me);
            };
        clear();
        target.addEventListener(vendor.transitionEndEvent, handler, false);
        target.transitionTimer = setTimeout(handler, duration + 50);
    }
    
    function addClass(elem, value) {
        var classes, cur, clazz, i;
        classes = (value || '').match(/\S+/g) || [];
        cur = elem.nodeType === 1 && ( elem.className ? (' ' + elem.className + ' ').replace(/[\t\r\n]/g, ' ') : ' ');
        if (cur) {
            i = 0;
            while ((clazz = classes[i++])) {
                if (cur.indexOf(' ' + clazz + ' ') < 0) {
                    cur += clazz + ' ';
                }
            }
            elem.className = cur.trim();
        }
    }
    
    function removeClass(elem, value) {
        var classes, cur, clazz, i;
        classes = (value || '').match(/\S+/g) || [];
        cur = elem.nodeType === 1 && ( elem.className ? (' ' + elem.className + ' ').replace(/[\t\r\n]/g, ' ') : ' ');
        if (cur) {
            i = 0;
            while ((clazz = classes[i++])) {
                while (cur.indexOf(' ' + clazz + ' ') >= 0) {
                    cur = cur.replace(' ' + clazz + ' ', ' ');
                }
            }
            elem.className = cur.trim();
        }
    }
    
    function insertCss(css) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    }
    
    /*--------------- 公共方法 end ---------------*/
    
    
    var TouchStyle = function(ct, options) {
        var defaultOptions = {
            music: false, // 音乐开关
            upArrow: true, // 向上翻动箭头
            duration: 500 // 动画持续时间
        };
        
        if (ct && !options) {
            options = ct;
            ct = null;
        }
        if (ct) {
            ct = isString(ct) ? document.querySelector(ct) : ct;
        } else {
            ct = document.body;
        }
        this.ct = ct;
        
        this.options = extend(defaultOptions, options);
        this.elements = {};
        
        var boxOptions = this.options.boxOptions || {};
        this.originBeforeSlide = boxOptions.beforeSlide;
        this.originOnSlide = boxOptions.onSlide;
        this.originScope = boxOptions.scope;
        boxOptions.beforeSlide = this.beforeSlide;
        boxOptions.onSlide = this.onSlide;
        boxOptions.scope = this;
        this.box = new TouchBox(ct, boxOptions);
        
        this.initMusic();
        this.initUpArrow();
    };
    
    TouchStyle.prototype = {
        initMusic: function() {
            var self = this;
            var musicOptions = self.options.music;
            if (musicOptions) {
                if (isString(musicOptions)) {
                    musicOptions = { src: musicOptions };
                }
                if (!musicOptions.src) {
                    return;
                }
            
                self.audio = new Audio();
                self.musicEl = document.createElement('div');
                if (musicOptions.css) {
                    self.musicEl.className = musicOptions.css;
                }
                if (musicOptions.style) {
                    self.musicEl.style.cssText = musicOptions.style;
                } else {
                    self.musicEl.style.cssText = vendor.cssPrefix + 'box-sizing:border-box;position:fixed;top:20px;right:20px;z-index:20;width:32px;height:32px;border:2px solid rgba(255,255,255,.7);background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY5MzA4MkZEM0YwOTExRTQ4QTU4OTNENTQzODIzMjJEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY5MzA4MkZFM0YwOTExRTQ4QTU4OTNENTQzODIzMjJEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjkzMDgyRkIzRjA5MTFFNDhBNTg5M0Q1NDM4MjMyMkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjkzMDgyRkMzRjA5MTFFNDhBNTg5M0Q1NDM4MjMyMkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4gyLr5AAADvUlEQVR42uyaXWxMQRTHb9dHNYSiitX6SqpB0IhUKOrzoYl4ERHhgaReRIKQsogHBA19QCpE4iuKB4mXhgc8tNqlCYJaXykVdFPRVpVGfdT6T/asjMnc2bl7d++u2JP8kp2Ze2fmzMyZOWfupgQCAeNflpSkAomkgN/vt1PXeLAQ5IEJYChIp7J20AyegAfgBngWaUNut/vP7542ByAHrAErwGjFcwPBGDCDy3sFLoHToMHpGRgH9oKlwGVzELrBZbBTVxF+Bqw2zmZsF3gElkWh80x6gOWgHuygdExmIIumvEDxzC9S7iGN5g/K70XLbTKhUryalqQ/mjYwCVwDI0zKb4KzoBJ8DFPXILAYrAbzJOVzwB1QBHzRmIGJ4BYZoii3wRbgjXD5zAKHwHRJWRuVP7VjA8Np5MXOfwfraTl5baz/GtqZNlCd4kxdpe3YVFxhjOsiyJaMzHxQDqJxCrI6joBFkuXHtuYKlWGrFNgGCoW8FsqrjcGhyox3LmgV8heAzVZtYCx4DNK4Z7vAbHA3xt4Bs4cqkMrlddLp/kbXBvYInWeyyYHOM6mjjYGXvmC37gzkkOXz666WRt8pz89FO1w+l/cT5DIXJNwMFEuMpsTBzocOxBKJF1AczohZeqVkq/MazksVzQIvrG8pKgXyJKft8Ti6+yeE9EhyRUwVKJR4ipVxVKCSlpNpH0UFpghpFnx8iqMCreQcmvbRJfHzefEZ8Refqo+iAplC+nUCKNCo6qOoQD8h/TkBFOgQ0v3FvZWX3hKv0zSuAH24ffsdHTa6kV0WN4BdigDmm5BO1XXmzDxUD/gAmsBLopFG6gIYong/k6K6Dnon9H4T1bnVakhp9VbCQ36STNIoFMwmr7JbovwVMNPk/QxwgJ7bZ8XnsCIbNaOsaZL8fEXnRafRiIUCLEIarPlsrskdko5kmISvESkwQKjYztK0slz5gUq3o8A6ilnZui5zcOssozYLqA8RG/GwOHmiS4ioG3HCSVKBpAJJBf4DBb6A93HoG2uz064CLJwbZQQveZ08yA5Sm6zteisKtAnpcsoLXcA6JUepTRYTHxPKWlQKlHK3AOxutIIrazf0L7e+aubJJEBtheS8Efy6GQqcSlWuxEkjeEvMAo86ISJjQUiDpld5T5J3X1OBF0Ioy2xwqhG89G2mcqUNPDeCX2Rk4eR2jVk4JTbC1XtGY/Q9JmFltaxeqxEZ+xxaRKGf+LHuLTgHDiveX0vLYZXx94eT0MfB/eC6lQ4l/yuRVMCm/BZgAPNl8CcCmg6KAAAAAElFTkSuQmCC") rgba(0,0,0,.3) center no-repeat;' + vendor.cssPrefix + 'background-size:20px 20px;' + vendor.cssPrefix + 'border-radius:16px 16px;';
                }
                insertCss('@' + vendor.cssPrefix + 'keyframes ts-music-paly-animate { from {' + vendor.cssPrefix + 'transform:rotate(0deg);} to {' + vendor.cssPrefix + 'transform:rotate(360deg);} }');
                self.ct.appendChild(self.musicEl);
                
                self.audio.src = musicOptions.src;
                self.audio.loop = musicOptions.loop === true;
                if (musicOptions.autoPlay !== false) {
                    self.playMusic();
                }
                
                self.audio.addEventListener('ended', this, false);
                self.audio.addEventListener('pause', this, false);
                self.musicEl.addEventListener('click', this, false);
            }
        },
        
        initUpArrow: function() {
            var upArrowOptions = this.options.upArrow;
            if (upArrowOptions) {
                upArrowOptions = upArrowOptions === true ? {} : upArrowOptions;
                this.arrowEl = document.createElement('div');
                if (upArrowOptions.css) {
                    this.arrowEl.className = upArrowOptions.css;
                }
                if (upArrowOptions.style) {
                    this.arrowEl.style.cssText = upArrowOptions.style;
                } else {
                    this.arrowEl.style.cssText = 'position:fixed;bottom:0;left:50%;z-index:20;margin-left:-15px;width:30px;height:17px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAiCAYAAAADILqZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI5QzAxNUU4M0ZEMzExRTQ5Q0Y1OEY5OEJENzgyMEE5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI5QzAxNUU5M0ZEMzExRTQ5Q0Y1OEY5OEJENzgyMEE5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjlDMDE1RTYzRkQzMTFFNDlDRjU4Rjk4QkQ3ODIwQTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjlDMDE1RTczRkQzMTFFNDlDRjU4Rjk4QkQ3ODIwQTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4S8PVcAAACIUlEQVR42tyZv0vDQBTHk64OCi1qF1FRi5OVjqVYxKXQueisKPQPaGf9A4T+ES7ioINOVXDRtV3aDKLQqos6WAVFsfEdvIMScmd+XF4Tv/CBclzevU+Thianm6apEScGrODnS6BPvThlRoGLAc5xjCw64RmOA3UgbRlvAGvAy386wyJZDcfqOOdfCCcksuTSsRDIkkrHCGSXXBzDpRNREx4DziSyB4hI+hRrqA+7SysmATRMcWqAjtQk8xpYS2l/1LL7KMrn6zhGJk0puys5do9KWqVsU9J01UGNKoU0hWzFRa1K0NJByvaBsoeaZTzWLk2/0n5kJ4GWoLEfYNtH7R2soVw6KNlNBT+VrSCkVct+A+sK7/wbWNMuLewlUGG2QFvQwBdQCuCPTAlrK5FWJfsJFAOQ5RRxDd/SKmQ/gEKAspwCrmWXtlNpJwslJbJvQJ5AlpPHNT1L+5HtATlCWU4O1/Yk7VX2FcgOQZaTxR5E0km3wjLZZyAzRFlOBntxJe1W9glIh0CWs4w9OZa2kzUEBR6AxRDJclhPj06lncreA6kQynJS2OOf0k5kb4HpEMtyZrBXuxhcmk2MS95UdID5CMhyFoCu5Hk6ziYdCSbc4bemRYxZ7N0uh+wl2rumaSOWl5k3wCrQ1aKZKdyom7OM92K4mTUYA7czoyrL0kEHwzLe5Nf9NT6NHAPjEbyMRUwAJ+h2xe5HlNulocivAAMAdG2Gl2x2DQwAAAAASUVORK5CYII=") center no-repeat;' + vendor.cssPrefix + 'background-size:30px 17px;' + vendor.cssPrefix + 'animation:ts-arrow-animate 2s infinite;opacity:0;';
                }
                insertCss('@' + vendor.cssPrefix + 'keyframes ts-arrow-animate{ 0% {' + vendor.cssPrefix + 'transform:translateY(0);opacity:0;} 33% {opacity:.8;} 50% {' + vendor.cssPrefix + 'transform:translateY(-8px);opacity:.8;} 66% {opacity:.8;} 100% {' + vendor.cssPrefix + 'transform:translateY(-16px);opacity:0;}');
                this.ct.appendChild(this.arrowEl);
            }
        },
        
        playMusic: function() {
            if (this.musicEl && !this.playing) {
                this.playing = true;
                this.musicEl.style[vendor.animation] = 'ts-music-paly-animate 1s linear infinite';
                this.audio.play();
            }
        },
        
        stopMusic: function() {
            if (this.musicEl && this.playing) {
                this.playing = false;
                this.musicEl.style[vendor.animation] = '';
                this.audio.pause();
            }
        },
        
        onMusicPause: function() {
            this.playing = false;
            this.musicEl.style[vendor.animation] = '';
        },
        
        showUpArrow: function() {
            this.arrowEl.style.display = '';
            this.arrowEl.style.opacity = 0;
            this.arrowEl.style[vendor.animation] = 'ts-arrow-animate 2s infinite';
        },
        
        hideUpArrow: function() {
            this.arrowEl.style.display = 'none';
            this.arrowEl.style[vendor.animation] = '';
        },
        
        beforeSlide: function(toIndex) {
            if (this.originBeforeSlide && this.originBeforeSlide.apply(this.originScope || this.box, arguments) === false) {
                return false;
            }
            
            if (this.box) {
                if (!this.box.loop) {
                    if (toIndex === this.box.getLast()) {
                        this.hideUpArrow();
                    } else {
                        this.showUpArrow();
                    }
                }
                
                this.elementReady(toIndex);
            }
        },
        
        onSlide: function(current, last) {
            if (current != last) {
                this.elementAnimate(current);
                if (isNumber(last) && last > -1) {
                    this.elementReady(last); 
                }
            }
            
            if (this.originOnSlide) {
                this.originOnSlide.apply(this.originScope || this.box, arguments);
            }
        },
        
        getElement: function(index) {
            var itemEl = this.box.getItem(index);
            var id = itemEl.id || index;
            var eles = this.elements[id];
            if (!eles && this.options.elements[id]) {
                eles = this.elements[id] = extend([], this.options.elements[id]);
            }
            return eles;
        },
        
        elementReady: function(current) {
            var self = this;
            var eles = self.getElement(current);
            if (eles) {
                var itemEl = self.box.getItem(current);
                each(eles, function(ele) {
                    var el = ele.el;
                    if (!el) {
                        el = document.createElement('div');
                        if (ele.css) {
                            el.className = ele.css;
                        }
                        el.style.cssText = ele.style || '';
                        el.innerHTML = ele.body;
                        ele.el = el;
                        itemEl.appendChild(el);
                    }
                    each(ele.timer, function(tr) {
                        clearTimeout(tr);
                    });
                    removeClass(el, self.getAnimateFunction(ele) + ' animated');
                    el.style.opacity = 0;
                    el.style.display = 'none';
                });
            }
        },
        
        elementAnimate: function(current) {
            var self = this;
            var eles = self.getElement(current);
            if (eles) {
                self.elementReady(current);
                each(eles, function(ele) {
                    ele.timer = [];
                    var el = ele.el;
                    if (el) {
                        var duration = ele.duration || self.options.duration;
                        el.style[vendor.animationDuration] = duration + 'ms';
                        el.style.display = '';
                        ele.timer.push(setTimeout(function() {
                            var animation = self.getAnimateFunction(ele);
                            listenTransition(el, duration, function() {
                                removeClass(el, animation + ' animated');
                            });
                            el.style.opacity = 1;
                            addClass(el, animation + ' animated');
                        }, ele.delay || 0));
                    }
                });
            }
        },
        
        getAnimateFunction: function(ele) {
            return ele.animation || 'fadeInUp';
        },
        
        handleEvent: function(e) {
            if (e.target === this.audio) {
                if (e.type === 'ended') {
                    this.onMusicPause(e);
                } else if (e.type === 'pause') {
                    this.onMusicPause(e);
                }
            } else if (e.target === this.musicEl) {
                if (e.type === 'click') {
                    if (this.playing) {
                        this.stopMusic();
                    } else {
                        this.playMusic();
                    }
                }
            }
        },

        destroy: function() {
            if (!this.destroyed) {
                this.destroyed = true;
                if (this.musicEl) {
                    this.audio.pause();
                    this.audio.removeEventListener('ended', this, false);
                    this.audio.removeEventListener('pause', this, false);
                    this.audio = null;
                    this.musicEl.removeEventListener('click', this, false);
                    this.ct.removeChild(this.musicEl);
                    this.musicEl = null;
                }
                this.ct = null;
            }
        }
    };
    
    window.TouchStyle = TouchStyle;
    
}(window));