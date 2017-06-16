(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _environment = require('./utils/environment');

var _html = require('./utils/html');

var _detectHashtag = require('./utils/detectHashtag');

var _detectHashtag2 = _interopRequireDefault(_detectHashtag);

var _globals = require('./utils/globals');

var _globals2 = _interopRequireDefault(_globals);

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


// Global functions and tools


var App = function () {
    function App() {
        _classCallCheck(this, App);

        this.modules = modules;
        this.currentModules = [];
    }

    /**
     * Execute global functions and settings
     * @return {Object}
     */


    App.prototype.initGlobals = function initGlobals() {
        (0, _globals2.default)();
        return this;
    };

    /**
     * Find modules and initialize them
     * @return  {Object}  this  Allows chaining
     */


    App.prototype.initModules = function initModules() {
        // Elements with module
        var moduleEls = document.querySelectorAll('[data-module]');

        // Loop through elements
        var i = 0;
        var elsLen = moduleEls.length;

        for (; i < elsLen; i++) {

            // Current element
            var el = moduleEls[i];

            // All data- attributes considered as options
            var options = (0, _html.getNodeData)(el);

            // Add current DOM element and jQuery element
            options.el = el;
            options.$el = $(el);

            // Module does exist at this point
            var attr = options.module;

            // Splitting modules found in the data-attribute
            var moduleIdents = attr.replace(/\s/g, '').split(',');

            // Loop modules
            var j = 0;
            var modulesLen = moduleIdents.length;

            for (; j < modulesLen; j++) {
                var moduleAttr = moduleIdents[j];

                if (typeof this.modules[moduleAttr] === 'function') {
                    var module = new this.modules[moduleAttr](options);
                    this.currentModules.push(module);
                }
            }
        }

        return this;
    };

    App.prototype.destroyModules = function destroyModules() {

        // Looping registered modules.
        var length = this.currentModules.length;
        while (length--) {
            var module = this.currentModules[length];

            // If there were modules applied to the current element,
            // remove them, so that initModules() calls them back.
            if (typeof module.$el != 'undefined') {
                var $el = module.$el;
                if ($el.data('_modules')) {
                    $el.data('_modules', false);
                }
            }

            // Automatic call to destroy
            if (typeof module.destroy === 'function') {
                module.destroy();
            }

            // Removing last item of the array
            // Will always works because we're looping
            // the array from the end to the beginning.
            this.currentModules.pop();
        }

        return this;
    };

    /**
     * Initialize app after document ready
     */


    App.prototype.init = function init() {
        this.initGlobals().initModules();
    };

    return App;
}();

(function () {
    var ready = false;
    var loaded = false;
    var done = false;
    var minLoad = 450;
    var maxLoad = 3000;

    _environment.$body.addClass('is-loading');

    // On load
    // ==========================================================================
    _environment.$window.on('load', function () {
        loaded = true;

        if (ready && !done) {
            load();
        }
    });

    // Minimum load
    // ==========================================================================
    setTimeout(function () {
        ready = true;
        if (loaded && !done) {
            load();
        }
    }, minLoad);

    // Maximum load
    // ==========================================================================
    setTimeout(function () {
        if (!done) {
            load();
        }
    }, maxLoad);

    // Load
    // ==========================================================================
    function load() {
        done = true;
        window.App = new App();
        window.App.init();

        (0, _detectHashtag2.default)();

        _environment.$body.removeClass('is-loading').addClass('is-loaded');

        setTimeout(function () {
            _environment.$body.addClass('is-animated');
        }, 450);
    }
})();

},{"./modules":5,"./utils/detectHashtag":21,"./utils/environment":22,"./utils/globals":23,"./utils/html":24}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var transition = 'default';

    var options = {
        blacklist: '.no-transitions',
        forms: false,
        onBefore: function onBefore($currentTarget, $container) {
            transition = $currentTarget.data('transition');

            _environment.$document.triggerHandler('turnOff.ScrollPage');

            if (transition === 'scale') {}
        },
        onStart: {
            duration: 450, // Duration of our animation
            render: function render($container) {
                if (window.matchMedia("(min-width: 1200px)").matches) {
                    // Add your CSS animation reversing class
                    if (transition === 'scale') {
                        _environment.$body.removeClass('is-scaled').addClass('has-no-transition is-spinning');
                    } else if (transition === 'next') {
                        _environment.$body.removeClass('is-scaled').addClass('has-no-transition is-transitioning-next is-spinning');
                        $('.js-scroll-section').animate({ scrollTop: $('.js-scroll-section-content').height() }, 450);
                    } else {
                        _environment.$body.removeClass('has-no-transition has-nav-open has-map-open').addClass('is-spinning is-transitioning');
                    }
                } else {
                    _environment.$body.removeClass('has-no-transition has-nav-open has-map-open').addClass('is-spinning is-transitioning');
                }

                // Restart your animation
                smoothState.restartCSSAnimations();
            }
        },
        onReady: {
            duration: 10,
            render: function render($container, $newContent) {
                // Inject the new content
                window.App.destroyModules();
                $container.html($newContent);

                var template = $('.js-template').data('template');

                if (!template) {
                    template = '';
                }

                _environment.$body.removeClass('is-animated is-transitioning is-scaled is-translated is-next has-half-transition').attr('data-template', template);
            }
        },
        onAfter: function onAfter($container, $newContent) {
            _environment.$body.removeClass('is-spinning is-transitioning-next').addClass('is-animated');

            window.App.initModules();

            (0, _detectHashtag2.default)();
        }
    },
        smoothState = $('#main').smoothState(options).data('smoothState');
};

var _environment = require('../utils/environment');

var _detectHashtag = require('../utils/detectHashtag');

var _detectHashtag2 = _interopRequireDefault(_detectHashtag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../utils/detectHashtag":21,"../utils/environment":22}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	svg4everybody();
};

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	svg4everybody();
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ScrollPage = require('./modules/ScrollPage');

Object.defineProperty(exports, 'ScrollPage', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ScrollPage).default;
  }
});

var _Nav = require('./modules/Nav');

Object.defineProperty(exports, 'Nav', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Nav).default;
  }
});

var _Carousel = require('./modules/Carousel');

Object.defineProperty(exports, 'Carousel', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Carousel).default;
  }
});

var _CarouselContent = require('./modules/CarouselContent');

Object.defineProperty(exports, 'CarouselContent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CarouselContent).default;
  }
});

var _Projects = require('./modules/Projects');

Object.defineProperty(exports, 'Projects', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Projects).default;
  }
});

var _EntryList = require('./modules/EntryList');

Object.defineProperty(exports, 'EntryList', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_EntryList).default;
  }
});

var _Map = require('./modules/Map');

Object.defineProperty(exports, 'Map', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Map).default;
  }
});

var _ContactForm = require('./modules/ContactForm');

Object.defineProperty(exports, 'ContactForm', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ContactForm).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./modules/Carousel":7,"./modules/CarouselContent":8,"./modules/ContactForm":9,"./modules/EntryList":11,"./modules/Map":13,"./modules/Nav":14,"./modules/Projects":15,"./modules/ScrollPage":17}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _environment = require('../utils/environment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


/**
 * Abstract module
 * Gives access to generic jQuery nodes
 */
var _class = function _class(options) {
	_classCallCheck(this, _class);

	this.$document = _environment.$document;
	this.$window = _environment.$window;
	this.$html = _environment.$html;
	this.$body = _environment.$body;
	this.$el = options.$el;
};

exports.default = _class;

},{"../utils/environment":22}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ==========================================================================
// Carousel module
// ==========================================================================


var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.$el.slick({
            prevArrow: '<button class="c-carousel_button -prev" type="button"><svg class="c-carousel_button_icon" role="img" title="Previous"><use xlink:href="assets/images/sprite.svg#icon-prev"></use></svg></button>',
            nextArrow: '<button class="c-carousel_button -next" type="button"><svg class="c-carousel_button_icon" role="img" title="Next"><use xlink:href="assets/images/sprite.svg#icon-next"></use></svg></button>'
        });
        return _this;
    }

    // Destroy
    // ==========================================================================


    _class.prototype.destroy = function destroy() {
        this.$el.slick('unslick');
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"./AbstractModule":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ==========================================================================
// Carousel module
// ==========================================================================


var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.$carousel = _this.$el.find('.js-carousel-content');
        _this.initSlick();
        _this.$el.on('click.CarouselContent', '.js-carousel-dot', function (event) {
            return _this.goToSlide(event);
        });
        _this.$el.on('click.CarouselContent', '.js-carousel-arrow', function (event) {
            return _this.changeSlide(event);
        });
        _this.$carousel.on('swipe', function () {
            return _this.changeSlide();
        });
        return _this;
    }

    // Init carousel
    // ==========================================================================


    _class.prototype.initSlick = function initSlick() {
        this.$carousel.slick({
            speed: 600,
            cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
            prevArrow: '<button class="c-carousel_button -prev -orange js-carousel-arrow" type="button"><svg class="c-carousel_button_icon" role="img" title="Previous"><use xlink:href="assets/images/sprite.svg#icon-prev"></use></svg></button>',
            nextArrow: '<button class="c-carousel_button -next -orange js-carousel-arrow" type="button"><svg class="c-carousel_button_icon" role="img" title="Next"><use xlink:href="assets/images/sprite.svg#icon-next"></use></svg></button>'
        });
    };

    // Go to slide
    // ==========================================================================


    _class.prototype.goToSlide = function goToSlide(event) {
        var $target = $(event.currentTarget);
        var slide = $target.data('slide');

        this.$el.find('.js-carousel-dot.is-active').removeClass('is-active');
        $target.addClass('is-active');
        this.$carousel.slick('slickGoTo', slide, false);
    };

    // Change slide
    // ==========================================================================


    _class.prototype.changeSlide = function changeSlide(event) {
        var currentSlide = this.$carousel.slick('slickCurrentSlide');

        this.$el.find('.js-carousel-dot.is-active').removeClass('is-active');
        this.$el.find('.js-carousel-dot[data-slide="' + currentSlide + '"]').addClass('is-active');
    };

    // Destroy
    // ==========================================================================


    _class.prototype.destroy = function destroy() {
        this.$carousel.slick('unslick');
        this.$el.off('CarouselContent');
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"./AbstractModule":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.isTransmitting = false;
        _this.hasFormdata = false;

        // Basic elements needed for visual interactions
        _this.$form = null;
        _this.$errorMessages = null;
        _this.$preSubmit = null;
        _this.$postSubmit = null;
        _this.$captcha = null;

        _this.setElements();

        // Check for FormData availability
        // if (typeof window.FormData !== 'function') {
        //     this.$hasFormdataEl.hide();
        //     this.$hasNoFormdataEl.show();
        // }

        _this.$el.on('submit.ContactForm', '.js-form', function (event) {
            event.preventDefault();
            _this.manageSubmit(new FormData(event.currentTarget));
        });

        _this.$el.on('change.ContactForm', '.js-file', function (event) {
            return _this.updateFile(event);
        });
        _this.$el.on('change.ContactForm', 'input', function () {
            return _this.showCaptcha();
        });

        setTimeout(function () {
            _this.$captcha.each(function () {
                grecaptcha.render(this.id, {
                    sitekey: window.templateData.recaptcha
                });
            });
        }, 1000);
        return _this;
    }

    /**
     * Manage errors sent by back end on front end
     * @param  {array}  errors  List of error objects
     * @return void
     */


    _class.prototype.manageErrors = function manageErrors(errors) {
        // Reset captcha
        if (typeof window.grecaptcha !== 'undefined') {
            window.grecaptcha.reset();
        }

        var i = 0,
            len = errors.length;
        for (; i < len; i++) {
            $('#' + errors[i].property).addClass('has-error');
        }
    };

    /**
     * Submits the form data to an URL with $.ajax
     *
     * @param  FormData
     * @return void
     */


    _class.prototype.manageSubmit = function manageSubmit(data) {
        var _this2 = this;

        if (!this.isTransmitting) {
            this.isTransmitting = true;
            this.$form.find('.has-error').removeClass('has-error');
            this.toggleLoading();

            setTimeout(function () {
                var jqxhr = $.ajax({
                    method: 'POST',
                    url: _this2.$form.attr('action'),
                    processData: false,
                    contentType: false,
                    data: data
                }).done(function (response) {
                    if (response.success === true) {
                        _this2.$preSubmit.fadeOut(function () {
                            _this2.$postSubmit.fadeIn();
                        });
                    } else {
                        _this2.manageErrors(response.errors);
                    }
                }).always(function () {
                    setTimeout(function () {
                        _this2.toggleLoading();
                        _this2.isTransmitting = false;
                    }, 600);
                });
            }, 600);
        }
    };

    /**
     * Method used to set needed elements when document is ready.
     * Basically for any form with Ractive
     */


    _class.prototype.setElements = function setElements() {
        this.$form = this.$el.find('.js-form');
        this.$preSubmit = this.$el.find('.js-pre-submit');
        this.$postSubmit = this.$el.find('.js-post-submit');
        this.$captcha = this.$el.find('.js-captcha');
        this.$hasFormdataEl = this.$el.find('.js-has-formdata');
        this.$hasNoFormdataEl = this.$el.find('.js-has-no-formdata');
    };

    /**
     * Simple method for toggling animation states
     * @return void
     */


    _class.prototype.toggleLoading = function toggleLoading() {
        this.$el.toggleClass('is-form-state-loading');
    };

    _class.prototype.updateFile = function updateFile(event) {
        var $target = $(event.currentTarget);
        var fileName = $target[0].files[0].name;

        $target.siblings('.js-file-label').text(fileName);
    };

    _class.prototype.showCaptcha = function showCaptcha() {
        this.$el.addClass('is-focus');
    };

    _class.prototype.destroy = function destroy() {
        this.$el.off('.ContactForm');
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"./AbstractModule":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ==========================================================================
// Count module
// ==========================================================================


var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.initHunt();
        return _this;
    }

    // Hunt
    // ==========================================================================


    _class.prototype.initHunt = function initHunt() {
        var self = this;
        $('.js-count').each(function (index, el) {
            self.count(this);
        });
    };

    // Count
    // ==========================================================================


    _class.prototype.count = function count(target) {
        var options = {
            useEasing: false,
            useGrouping: true,
            separator: '',
            decimal: '.',
            prefix: '',
            suffix: ''
        };

        var $target = $(target);
        var startNumber = 0;
        var endNumber = $target.data('count');
        var delay = $target.data('count-delay');
        var duration = 1.5;

        var counter = new CountUp(target, startNumber, endNumber, 0, duration, options);

        this.$document.on('isAnimated.App', function (event) {
            setTimeout(function () {
                counter.start();
            }, delay);
        });
    };

    // Destroy
    // ==========================================================================


    _class.prototype.destroy = function destroy() {
        this.$el.off();
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"./AbstractModule":6}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _EntryLoader2 = require('./EntryLoader');

var _EntryLoader3 = _interopRequireDefault(_EntryLoader2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var _class = function (_EntryLoader) {
    _inherits(_class, _EntryLoader);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _EntryLoader.call(this, options));

        _this.hasRactiveList = typeof options['ractive-list'] !== 'undefined';

        if (_this.hasRactiveList) {
            _this.controller = _this.initController({
                entriesPerPage: 8,
                onInit: function onInit() {
                    return _this.setEvents();
                },
                image: '<img src="[[ featuredImage ]]" alt="">'
            });
        } else {
            _this.setEvents();
        }
        return _this;
    }

    _class.prototype.setEvents = function setEvents() {
        var _this2 = this;

        this.$el.on('click.EntryList', '.js-entry-item', function (event) {
            var $target = $(event.currentTarget);
            if (!$target.hasClass('is-open')) {
                _this2.open($target);
            }
        });

        this.$el.on('click.EntryList', '.js-entry-close', function (event) {
            var $target = $(event.currentTarget);
            if ($target.parents('.js-entry-item').hasClass('is-open')) {
                _this2.close(event, $target);
            }
        });
    };

    // Open
    // ==========================================================================


    _class.prototype.open = function open($target) {
        var _this3 = this;

        this.closeAll();

        $target.find('.js-entry-main').stop().slideDown(400).parents('.js-entry-item').addClass('is-open');

        // Scroll to section, after delay
        setTimeout(function () {
            _this3.scrollTo($target);
        }, 400);
    };

    // Close
    // ==========================================================================


    _class.prototype.close = function close(event, $target) {
        event.stopPropagation();

        $target.parents('.js-entry-item').removeClass('is-open').find('.js-entry-main').stop().slideUp(400);
    };

    // Close all
    // ==========================================================================


    _class.prototype.closeAll = function closeAll() {
        this.$el.find('.js-entry-item.is-open').removeClass('is-open').find('.js-entry-main').stop().slideUp(400);
    };

    // Scroll to
    // ==========================================================================


    _class.prototype.scrollTo = function scrollTo($target) {
        this.$body.animate({
            scrollTop: $target.offset().top - $('.js-header-logo').height()
        }, 300);
    };

    // Destroy
    // ==========================================================================


    _class.prototype.destroy = function destroy() {
        this.$el.off('.EntryList');
        if (this.hasRactiveList) {
            this.controller.teardown();
        }
    };

    return _class;
}(_EntryLoader3.default);

exports.default = _class;

},{"./EntryLoader":12}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

var _ractiveEventsTap = require('../ractive/ractive-events-tap');

var _ractiveEventsTap2 = _interopRequireDefault(_ractiveEventsTap);

var _ractiveTransitionsCss = require('../ractive/ractive-transitions-css');

var _ractiveTransitionsCss2 = _interopRequireDefault(_ractiveTransitionsCss);

var _html = require('../utils/html');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, _AbstractModule.call(this, options));
    }

    /**
     * Creates the Ractive entry list controller
     *
     * @param  object          options
     * @return Ractive object          Ractive instance
     */


    _class.prototype.initController = function initController(options) {
        var _this = this;
        var controller = new Ractive({
            el: this.$el,
            template: typeof this.template !== 'undefined' ? this.template : (0, _html.unescapeHtml)(this.$el.html()),
            data: {
                displayEntryList: true,
                entryList: window.templateData.entryList,
                entriesPerPage: options.entriesPerPage,
                page: 1,
                state: 'inert'
            },
            computed: {
                hasMoreEntries: function hasMoreEntries() {
                    return this.get('page') < this.maxPages();
                },
                pageArray: function pageArray() {
                    var entryList = this.get('entryList');
                    var entriesPerPage = this.get('entriesPerPage');
                    var pageArray = [];
                    var i = 0;
                    var len = this.get('page');
                    for (; i < len; i++) {
                        var min = entriesPerPage * i;
                        var max = entriesPerPage * i + entriesPerPage;
                        var page = entryList.slice(min, max);
                        pageArray[i] = {
                            entries: page
                        };
                    }
                    return pageArray;
                }
            },
            partials: {
                image: options.image
            },
            delimiters: ['[[', ']]'],
            tripleDelimiters: ['[[[', ']]]'],
            events: { tap: _ractiveEventsTap2.default },
            transitions: { css: _ractiveTransitionsCss2.default },
            /**
             * Calculate the max pages possible for EntryList
             * @return {int}
             */
            maxPages: function maxPages() {
                var entryCount = this.get('entryList').length;
                var entriesPerPage = this.get('entriesPerPage');
                var remainder = entryCount % entriesPerPage;
                return (entryCount - remainder) / entriesPerPage;
                // return (entryCount - remainder) / entriesPerPage + (remainder !== 0 ? 1 : 0);
            },
            /**
             * Allows us to set proxy events and run other tasks when controller is initialized
             */
            oninit: function oninit() {
                this.on({
                    /**
                     * Fired by the load more button
                     */
                    loadNextPage: function loadNextPage() {
                        this.add('page');
                    }
                });

                if (typeof options.onInit === 'function') {
                    options.onInit();
                }
            },
            /**
             * Swich values that are toggled between two states on load state
             * @param  {boolean}  state  Controls towards which state the animation goes
             *                           True -> display list
             *                           False -> hide list
             * @return {Promise}         Allows chaining with a .then()
             */
            toggleLoading: function toggleLoading(state) {
                var values = typeof state === 'boolean' && state === false ? {
                    displayEntryList: false,
                    state: 'loading'
                } : {
                    displayEntryList: true,
                    state: 'inert'
                };
                return this.set(values);
            }
        });

        return controller;
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../ractive/ractive-events-tap":18,"../ractive/ractive-transitions-css":19,"../utils/html":24,"./AbstractModule":6}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ==========================================================================
// Generic module
// ==========================================================================


var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.map;
        _this.center;
        _this.markers = [];

        _this.officeLocations = window.templateData.officeLocations;
        _this.projectLocations = window.templateData.projectLocations;

        _this.$document.on('init.Map', function () {
            return _this.initMap();
        });

        _this.$el.on('click.Map', '.js-map-open', function (event) {
            return _this.openMap();
        });
        _this.$el.on('click.Map', '.js-map-close', function (event) {
            return _this.closeMap();
        });
        return _this;
    }

    // Init maps
    // ==========================================================================


    _class.prototype.initMap = function initMap() {
        this.center = new google.maps.LatLng(-1.2668138, -25.6396894);
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: this.center,
            zoom: 3,
            mapTypeControl: false,
            scrollwheel: false,
            styles: [{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#000000" }, { "lightness": 40 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 }] }, { "featureType": "administrative", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.country", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "administrative.country", "elementType": "geometry", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "administrative.country", "elementType": "labels.text", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "administrative.province", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.locality", "elementType": "all", "stylers": [{ "visibility": "simplified" }, { "saturation": "-100" }, { "lightness": "30" }] }, { "featureType": "administrative.neighborhood", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.land_parcel", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "visibility": "simplified" }, { "gamma": "0.00" }, { "lightness": "74" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "landscape.man_made", "elementType": "all", "stylers": [{ "lightness": "3" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 21 }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 19 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 17 }] }]
        });

        for (var i = 0; i < this.officeLocations.length; i++) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.officeLocations[i][0], this.officeLocations[i][1]),
                map: this.map,
                icon: window.baseUrl + 'assets/images/marker.svg'
            });
            this.markers.push(marker);
        }

        for (var _i = 0; _i < this.projectLocations.length; _i++) {
            var _marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.projectLocations[_i][0], this.projectLocations[_i][1]),
                map: this.map,
                icon: window.baseUrl + 'assets/images/marker-white.svg'
            });
            this.markers.push(_marker);
        }
    };

    // Open map
    // ==========================================================================


    _class.prototype.openMap = function openMap() {
        this.$body.addClass('has-map-open');
    };

    // Close map
    // ==========================================================================


    _class.prototype.closeMap = function closeMap() {
        this.$body.removeClass('has-map-open');
    };

    // Destroy
    // ==========================================================================


    _class.prototype.destroy = function destroy() {
        var $mapEl = $('#map');
        google.maps.event.clearInstanceListeners(window);
        google.maps.event.clearInstanceListeners(document);
        google.maps.event.clearInstanceListeners($mapEl[0]);
        $mapEl.detach();
        this.markers = [];
        this.center = null;
        this.map = null;
        this.$document.off('.Map');
        this.$el.off('.Map');
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"./AbstractModule":6}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ==========================================================================
// IGE
// ==========================================================================


var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.$el.on('click.Nav', '.js-nav-toggle', function () {
            return _this.toggleNav();
        });
        return _this;
    }

    // Init carousel
    // ==========================================================================


    _class.prototype.toggleNav = function toggleNav() {
        this.$body.toggleClass('has-nav-open');
    };

    // Destroy
    // ==========================================================================


    _class.prototype.destroy = function destroy() {
        this.$el.off('.Nav');
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"./AbstractModule":6}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _EntryLoader2 = require('./EntryLoader');

var _EntryLoader3 = _interopRequireDefault(_EntryLoader2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var _class = function (_EntryLoader) {
    _inherits(_class, _EntryLoader);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _EntryLoader.call(this, options));

        _this.controller = _this.initController({
            entriesPerPage: 30,
            image: '<div class="o-background" style="background-image: url([[ thumbnail ]]);"></div>'
        });
        return _this;
    }

    _class.prototype.destroy = function destroy() {
        this.controller.teardown();
    };

    return _class;
}(_EntryLoader3.default);

exports.default = _class;

},{"./EntryLoader":12}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('../utils/environment');

var _throttledResize = require('throttled-resize');

var _throttledResize2 = _interopRequireDefault(_throttledResize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


/**
 * Manage animation of elements on the page according to scroll position.
 *
 * @todo  Manage some options (normally from data attributes) with constructor options (ex.: set repeat for all)
 * @todo  Method to get the distance (as percentage) of an element in the viewport
 */
var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.options = options;
        this.container = options.container;
        this.$container = $(this.container);
        this.$selector = $(options.selector);

        this.scroll = {
            x: 0,
            y: 0,
            direction: ''
        };

        window.App.scroll = this.scroll;

        this.windowHeight = _environment.$window.height();
        this.windowMiddle = this.windowHeight / 2;

        this.containerHeight = this.$container.height();

        this.animatedElements = [];

        this.init();
    }

    /**
     * Initialize scrolling animations
     */


    _class.prototype.init = function init() {
        var _this = this;

        this.addElements();
        this.animateElements();

        this.resize = new _throttledResize2.default();
        this.resize.on('resize:end', function () {
            return _this.updateElements();
        });

        _environment.$document.on('scrollTo.Scroll', function (event) {
            return _this.scrollTo(event.options);
        });
        // Update event
        this.$container.on('update.Scroll', function (event, options) {
            return _this.updateElements(options);
        });
        // Render event
        this.$container.on('scroll.Scroll', function () {
            return _this.renderAnimations(false);
        });

        // Rebuild event
        _environment.$document.on('rebuild.Scroll', function () {
            // this.scrollTo(0);
            _this.updateElements();
        });

        _environment.$document.on('animate.Scroll', function () {
            _this.updateElements();
            _this.animateElements();
        });
    };

    /**
     * Find all animatable elements.
     * Called on page load and any subsequent updates.
     */


    _class.prototype.addElements = function addElements() {
        this.animatedElements = [];

        var $elements = $(this.options.selector);
        var i = 0;
        var len = $elements.length;

        for (; i < len; i++) {
            var $element = $elements.eq(i);
            var elementTarget = $element.data('target');
            var elementPosition = $element.data('position');
            var $target = elementTarget ? $(elementTarget) : $element;
            var elementOffset = $target.offset().top;
            var elementLimit = elementOffset + $target.outerHeight();

            // If elements loses its animation after scrolling past it
            var elementRepeat = typeof $element.data('repeat') === 'string';

            var elementInViewClass = $element.data('inview-class');
            if (typeof elementInViewClass === 'undefined') {
                elementInViewClass = 'is-show';
            }

            // Don't add element if it already has its in view class and doesn't repeat
            // if (elementRepeat) {
            this.animatedElements[i] = {
                $element: $element,
                offset: Math.round(elementOffset),
                repeat: elementRepeat,
                position: elementPosition,
                limit: elementLimit,
                inViewClass: elementInViewClass
            };
            // }
        };
    };

    /**
     * Loop through all animatable elements and apply animation method(s).
     */


    _class.prototype.animateElements = function animateElements() {
        var len = this.animatedElements.length;
        var i = 0;
        var removeIndexes = [];
        for (; i < len; i++) {
            var element = this.animatedElements[i];

            // If the element's visibility must not be manipulated any further, remove it from the list
            if (this.toggleElementClasses(element, i)) {
                removeIndexes.push(i);
            }
        }

        // Remove animated elements after looping through elements
        i = removeIndexes.length;
        while (i--) {
            this.animatedElements.splice(removeIndexes[i], 1);
        }
    };

    /**
     * Render the class animations, and update the global scroll positionning.
     */


    _class.prototype.renderAnimations = function renderAnimations() {
        if (window.pageYOffset > this.scroll.y) {
            if (this.scroll.direction !== 'down') {
                this.scroll.direction = 'down';
            }
        } else if (window.pageYOffset < this.scroll.y) {
            if (this.scroll.direction !== 'up') {
                this.scroll.direction = 'up';
            }
        }

        this.scroll.y = this.$container.scrollTop();
        this.scroll.x = this.$container.scrollLeft();

        this.animateElements();
    };

    /**
     * Toggle classes on an element if it's visible.
     *
     * @param  {object}      element Current element to test
     * @param  {int}         index   Index of the element within it's container
     * @return {boolean}             Wether the item must be removed from its container
     */


    _class.prototype.toggleElementClasses = function toggleElementClasses(element, index) {
        var removeFromContainer = false;

        if (typeof element !== 'undefined') {
            // Find the bottom edge of the scroll container
            var scrollTop = this.scroll.y;
            var scrollBottom = scrollTop + this.windowHeight;

            // Define if the element is inView
            var inView;

            if (element.position == 'top') {
                inView = scrollTop >= element.offset && scrollTop <= element.limit;
            } else {
                inView = scrollBottom >= element.offset && scrollTop <= element.limit;
            }

            // Add class if inView, remove if not
            if (inView) {
                element.$element.addClass(element.inViewClass);

                if (!element.repeat) {
                    removeFromContainer = true;
                }
            } else if (element.repeat) {
                element.$element.removeClass(element.inViewClass);
            }
        }

        return removeFromContainer;
    };

    /**
     * Scroll to a desired target.
     *
     * @param  {object|int} target Either a jQuery element or a `y` position
     * @return {void}
     */
    // scrollTo(target) {
    //     var targetOffset = 0;
    //     if (target instanceof jQuery && target.length > 0) {
    //         var targetData;

    //         if (target.data('target')) {
    //             targetData = target.data('target');
    //         } else {
    //             targetData = target.attr('href');
    //         }

    //         targetOffset = $(targetData).offset().top + this.scrollbar.scrollTop;
    //     } else {
    //         targetOffset = target;
    //     }

    //     $body.animate({
    //         scrollTop:targetOffset
    //     }, 'slow');
    // }


    /**
     * Scroll to a desired target.
     *
     * @param  {object} options
     * @return {void}
     */


    _class.prototype.scrollTo = function scrollTo(options) {
        var targetOffset = 0;

        var $targetElem = options.targetElem;
        var $sourceElem = options.sourceElem;
        var targetOffset = options.targetOffset;

        if (typeof $targetElem === 'undefined' && typeof $sourceElem === 'undefined' && typeof targetOffset === 'undefined') {
            console.warn('You must specify at least one parameter.');
            return false;
        }

        if (typeof $targetElem !== 'undefined' && $targetElem instanceof jQuery && $targetElem.length > 0) {
            targetOffset = $targetElem.offset().top;
        }

        if (typeof $sourceElem !== 'undefined' && $sourceElem instanceof jQuery && $sourceElem.length > 0) {
            var targetData;

            if ($sourceElem.data('target')) {
                targetData = $sourceElem.data('target');
            } else {
                targetData = $sourceElem.attr('href');
            }

            targetOffset = $(targetData).offset().top;
        }

        this.$container.animate({
            scrollTop: targetOffset
        }, 'slow');
    };

    /**
     * Update elements and recalculate all the positions on the page
     */


    _class.prototype.updateElements = function updateElements() {
        this.addElements();
    };

    /**
     * Destroy
     */


    _class.prototype.destroy = function destroy() {
        this.resize.destroy();
        this.$container.off('.Scroll');
        _environment.$document.off('.Scroll');
        this.animatedElements = undefined;
    };

    return _class;
}();

exports.default = _class;

},{"../utils/environment":22,"throttled-resize":27}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

var _Scroll = require('../modules/Scroll');

var _Scroll2 = _interopRequireDefault(_Scroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.scroll;

        // If not mobile
        if (!/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent || navigator.vendor || window.opera) && window.matchMedia('(min-width: 1200px)').matches) {
            _this.currentSection = 1;
            _this.currentGroup;
            _this.$scrollSections = _this.$el.find('.js-scroll-section');
            _this.maxSection = _this.$scrollSections.length;
            _this.timeout;
            _this.isScrolling = false;

            // Add section index data
            _this.$scrollSections.each(function (index, el) {
                $(this).attr('data-scroll-section', index + 1);
            });

            // Current section
            _this.$currentSection = _this.getCurrentSection();

            // Next section
            _this.$el.on('click.ScrollPage', '.js-scroll-section-next', function () {
                _this.moveDown();
                _this.checkScale();
            });

            // Scroll to
            _this.$el.on('click.ScrollPage', '.js-scroll-section-to', function (event) {
                return _this.scrollTo(event);
            });

            // Scroll to last
            _this.$document.on('click.ScrollPage', '.js-scroll-section-last', function () {
                _this.scrollToLast();
            });

            _this.$document.on('scrollToLast.ScrollPage', function () {
                _this.scrollToLast();
            });

            // Init wheel indicator
            _this.mousewheel = new WheelIndicator({
                elem: window,
                callback: function callback(event) {
                    return _this.checkWheel(event);
                },
                preventMouse: false
            });

            _this.scroll = new _Scroll2.default({
                container: '.js-scroll-container',
                selector: '.js-scroll'
            });

            _this.$document.on('turnOff.ScrollPage', function () {
                return _this.mousewheel.turnOff();
            });
            _this.$document.on('turnOn.ScrollPage', function () {
                return _this.mousewheel.turnOn();
            });
            // If mobile
        } else {
            _this.$body.addClass('is-mobile');
            _this.$document.on('click.ScrollPage', '.js-scroll-section-last', function () {
                _this.$body.removeClass('has-nav-open');
            });
            _this.$el.on('click.ScrollPage', '.js-scroll-section-next', function () {
                var offset = $('.js-scroll-section').eq(1).offset().top - $('.js-header').height();
                _this.$body.stop().animate({ scrollTop: offset }, '600');
            });
            _this.$el.on('click.ScrollPage', '.js-scroll-section-last', function () {
                var offset = $('.js-scroll-section').eq(1).offset().top - $('.js-header').height();
                _this.$body.stop().animate({ scrollTop: offset }, '600');
            });
            setTimeout(function () {
                _this.scroll = new _Scroll2.default({
                    container: document,
                    selector: '.js-scroll'
                });
            }, 300);
        }
        return _this;
    }

    // Check move
    // ==========================================================================


    _class.prototype.checkWheel = function checkWheel(event) {
        // Check scroll direction
        if (event.direction == 'down') {
            if (this.currentSection < this.maxSection) {
                this.moveDown();
            } else {
                if (!this.isScrolling) {
                    this.isScrolling = true;
                    this.$currentSection.addClass('is-scrolling');
                    this.$document.trigger('rebuild.Scroll');
                }
            }
        } else {
            if (this.currentSection > 1) {
                this.checkScrolltop();
            }
        }

        this.checkScale();

        this.currentGroup = this.$currentSection.data('scroll-group');

        this.$el.find('.js-scroll-section-dot.is-active').removeClass('is-active');
        this.$el.find('.js-scroll-section-dot[data-scroll-section="' + this.currentSection + '"]').addClass('is-active');
        this.$el.find('.js-scroll-section-dot[data-scroll-group="' + this.currentGroup + '"]').addClass('is-active');
    };

    // Check scale
    // ==========================================================================


    _class.prototype.checkScale = function checkScale() {
        // Check scale data
        this.$currentSection = this.getCurrentSection();

        // Scale
        if (this.$currentSection.data('scroll-section-scale') === true) {
            this.$body.addClass('is-scaled');
        } else if (this.$currentSection.data('scroll-section-scale') === false) {
            this.$body.removeClass('is-scaled');
        }
        // Translate
        if (this.$currentSection.data('scroll-section-translate') === true) {
            this.$body.addClass('is-translated');
        } else if (this.$currentSection.data('scroll-section-translate') === false) {
            this.$body.removeClass('is-translated');
        }
        // Next
        if (this.$currentSection.data('scroll-section-next') === true) {
            this.$body.addClass('is-next');
        } else if (this.$currentSection.data('scroll-section-next') === false) {
            this.$body.removeClass('is-next');
        }
    };

    // Check down
    // ==========================================================================


    _class.prototype.moveDown = function moveDown() {
        var _this2 = this;

        this.$currentSection = this.getCurrentSection();

        // Add prev
        this.$currentSection.addClass('is-prev').removeClass('is-active');
        this.currentSection++;

        // Add active
        this.$currentSection = this.getCurrentSection();
        this.$currentSection.addClass('is-active');

        if (this.$currentSection.data('scroll-section-scrollbar') == true) {
            setTimeout(function () {
                _this2.$document.trigger('animate.Scroll');
            }, 300);
        }
    };

    // Check up
    // ==========================================================================


    _class.prototype.moveUp = function moveUp() {
        this.$currentSection = this.getCurrentSection();

        // Remove active
        this.$currentSection.removeClass('is-active is-ready');
        this.currentSection--;
        // Remove prev
        this.$currentSection = this.getCurrentSection();
        this.$currentSection.removeClass('is-prev').addClass('is-active');
    };

    // Scroll to
    // ==========================================================================


    _class.prototype.scrollTo = function scrollTo(event) {
        this.$currentSection = this.getCurrentSection();
        var $target = $(event.currentTarget);
        var group = $target.data('scroll-group');
        var $newSection = this.$scrollSections.filter('[data-scroll-group="' + group + '"]').first();
        var newSectionIndex = $newSection.data('scroll-section');

        $('.js-scroll-section-dot.is-active').removeClass('is-active');
        $target.addClass('is-active');

        if (this.currentSection < newSectionIndex) {
            $newSection.prevAll('.js-scroll-section').addClass('is-prev');
        } else if (this.currentSection > newSectionIndex) {
            $newSection.nextAll('.js-scroll-section').removeClass('is-prev');
        }

        this.$currentSection.removeClass('is-active');
        this.$currentSection = $newSection;
        this.$currentSection.removeClass('is-prev').addClass('is-active');
        this.currentSection = newSectionIndex;
    };

    // Check scrolltop
    // ==========================================================================


    _class.prototype.checkScrolltop = function checkScrolltop() {
        if (this.$currentSection.data('scroll-section-scrollbar') == true) {
            if (this.$currentSection.scrollTop() === 0) {
                if (this.isScrolling) {
                    this.$currentSection.removeClass('is-scrolling');
                    this.isScrolling = false;
                }

                this.moveUp();
            }
        } else {
            this.moveUp();
        }
    };

    _class.prototype.scrollToLast = function scrollToLast() {
        var _this3 = this;

        // Super quick shit WIP
        this.currentSection = this.maxSection - 1;
        this.$currentSection = this.getCurrentSection();
        this.moveDown();
        this.checkScale();
        this.updateAll();

        if (this.$currentSection.data('scroll-section-scrollbar') == true) {
            setTimeout(function () {
                if (window.location.hash === '#projects' || window.location.hash === '#awards') {
                    var $targetElem = $(window.location.hash).first();
                    if ($targetElem.length) {
                        _this3.$currentSection.addClass('is-scrolling');
                        _this3.$document.triggerHandler({
                            type: 'scrollTo.Scroll',
                            options: {
                                targetElem: $targetElem
                            }
                        });
                    }
                }
                _this3.$document.trigger('animate.Scroll');
            }, 600);
        }
    };

    _class.prototype.updateAll = function updateAll() {
        this.$scrollSections.addClass('is-active is-prev');
    };

    _class.prototype.getCurrentSection = function getCurrentSection() {
        return this.$scrollSections.filter('[data-scroll-section="' + this.currentSection + '"]');
    };

    // Destroy
    // ==========================================================================


    _class.prototype.destroy = function destroy() {
        if (_typeof(this.mousewheel) === 'object') {
            this.mousewheel.destroy();
        }
        this.mousewheel = null;
        if (typeof this.scroll !== 'undefined') {
            this.scroll.destroy();
        }
        this.$el.off('.ScrollPage');
        this.$document.off('.ScrollPage');
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../modules/Scroll":16,"./AbstractModule":6}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = tap;
var DISTANCE_THRESHOLD = 5; // maximum pixels pointer can move before cancel
var TIME_THRESHOLD = 400; // maximum milliseconds between down and up before cancel

function tap(node, callback) {
    return new TapHandler(node, callback);
}

function TapHandler(node, callback) {
    this.node = node;
    this.callback = callback;

    this.preventMousedownEvents = false;

    this.bind(node);
}

TapHandler.prototype = {
    bind: function bind(node) {
        // listen for mouse/pointer events...
        if (window.navigator.pointerEnabled) {
            node.addEventListener('pointerdown', handleMousedown, false);
        } else if (window.navigator.msPointerEnabled) {
            node.addEventListener('MSPointerDown', handleMousedown, false);
        } else {
            node.addEventListener('mousedown', handleMousedown, false);

            // ...and touch events
            node.addEventListener('touchstart', handleTouchstart, false);
        }

        // native buttons, and <input type='button'> elements, should fire a tap event
        // when the space key is pressed
        if (node.tagName === 'BUTTON' || node.type === 'button') {
            node.addEventListener('focus', handleFocus, false);
        }

        node.__tap_handler__ = this;
    },
    fire: function fire(event, x, y) {
        this.callback({
            node: this.node,
            original: event,
            x: x,
            y: y
        });
    },
    mousedown: function mousedown(event) {
        var _this = this;

        if (this.preventMousedownEvents) {
            return;
        }

        if (event.which !== undefined && event.which !== 1) {
            return;
        }

        var x = event.clientX;
        var y = event.clientY;

        // This will be null for mouse events.
        var pointerId = event.pointerId;

        var handleMouseup = function handleMouseup(event) {
            if (event.pointerId != pointerId) {
                return;
            }

            _this.fire(event, x, y);
            cancel();
        };

        var handleMousemove = function handleMousemove(event) {
            if (event.pointerId != pointerId) {
                return;
            }

            if (Math.abs(event.clientX - x) >= DISTANCE_THRESHOLD || Math.abs(event.clientY - y) >= DISTANCE_THRESHOLD) {
                cancel();
            }
        };

        var cancel = function cancel() {
            _this.node.removeEventListener('MSPointerUp', handleMouseup, false);
            document.removeEventListener('MSPointerMove', handleMousemove, false);
            document.removeEventListener('MSPointerCancel', cancel, false);
            _this.node.removeEventListener('pointerup', handleMouseup, false);
            document.removeEventListener('pointermove', handleMousemove, false);
            document.removeEventListener('pointercancel', cancel, false);
            _this.node.removeEventListener('click', handleMouseup, false);
            document.removeEventListener('mousemove', handleMousemove, false);
        };

        if (window.navigator.pointerEnabled) {
            this.node.addEventListener('pointerup', handleMouseup, false);
            document.addEventListener('pointermove', handleMousemove, false);
            document.addEventListener('pointercancel', cancel, false);
        } else if (window.navigator.msPointerEnabled) {
            this.node.addEventListener('MSPointerUp', handleMouseup, false);
            document.addEventListener('MSPointerMove', handleMousemove, false);
            document.addEventListener('MSPointerCancel', cancel, false);
        } else {
            this.node.addEventListener('click', handleMouseup, false);
            document.addEventListener('mousemove', handleMousemove, false);
        }

        setTimeout(cancel, TIME_THRESHOLD);
    },
    touchdown: function touchdown(event) {
        var _this2 = this;

        var touch = event.touches[0];

        var x = touch.clientX;
        var y = touch.clientY;

        var finger = touch.identifier;

        var handleTouchup = function handleTouchup(event) {
            var touch = event.changedTouches[0];

            if (touch.identifier !== finger) {
                cancel();
                return;
            }

            event.preventDefault(); // prevent compatibility mouse event

            // for the benefit of mobile Firefox and old Android browsers, we need this absurd hack.
            _this2.preventMousedownEvents = true;
            clearTimeout(_this2.preventMousedownTimeout);

            _this2.preventMousedownTimeout = setTimeout(function () {
                _this2.preventMousedownEvents = false;
            }, 400);

            _this2.fire(event, x, y);
            cancel();
        };

        var handleTouchmove = function handleTouchmove(event) {
            if (event.touches.length !== 1 || event.touches[0].identifier !== finger) {
                cancel();
            }

            var touch = event.touches[0];
            if (Math.abs(touch.clientX - x) >= DISTANCE_THRESHOLD || Math.abs(touch.clientY - y) >= DISTANCE_THRESHOLD) {
                cancel();
            }
        };

        var cancel = function cancel() {
            _this2.node.removeEventListener('touchend', handleTouchup, false);
            window.removeEventListener('touchmove', handleTouchmove, false);
            window.removeEventListener('touchcancel', cancel, false);
        };

        this.node.addEventListener('touchend', handleTouchup, false);
        window.addEventListener('touchmove', handleTouchmove, false);
        window.addEventListener('touchcancel', cancel, false);

        setTimeout(cancel, TIME_THRESHOLD);
    },
    teardown: function teardown() {
        var node = this.node;

        node.removeEventListener('pointerdown', handleMousedown, false);
        node.removeEventListener('MSPointerDown', handleMousedown, false);
        node.removeEventListener('mousedown', handleMousedown, false);
        node.removeEventListener('touchstart', handleTouchstart, false);
        node.removeEventListener('focus', handleFocus, false);
    }
};

function handleMousedown(event) {
    this.__tap_handler__.mousedown(event);
}

function handleTouchstart(event) {
    this.__tap_handler__.touchdown(event);
}

function handleFocus() {
    this.addEventListener('keydown', handleKeydown, false);
    this.addEventListener('blur', handleBlur, false);
}

function handleBlur() {
    this.removeEventListener('keydown', handleKeydown, false);
    this.removeEventListener('blur', handleBlur, false);
}

function handleKeydown(event) {
    if (event.which === 32) {
        // space key
        this.__tap_handler__.fire();
    }
}

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = css;
var DEFAULTS = {
    delay: 0,
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
};

function css(t, params) {
    var targetValue;

    params.delay = t.element.parentFragment.index * 100 + 300;
    params = t.processParams(params, DEFAULTS);

    if (typeof params.property !== 'undefined' && typeof params.value !== 'undefined') {
        if (t.isIntro) {
            targetValue = t.getStyle(params.property);
            t.setStyle(params.property, params.value);
        } else {
            targetValue = params.value;
        }

        t.animateStyle(params.property, targetValue, params).then(t.complete);
    } else {
        throw 'CSS transitions need a property and value to transition.';
    }
}

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.addToArray = addToArray;
exports.arrayContains = arrayContains;
exports.arrayContentsMatch = arrayContentsMatch;
exports.ensureArray = ensureArray;
exports.lastItem = lastItem;
exports.removeFromArray = removeFromArray;
exports.toArray = toArray;
exports.findByKeyValue = findByKeyValue;

var _is = require('./is');

function addToArray(array, value) {
	var index = array.indexOf(value);

	if (index === -1) {
		array.push(value);
	}
}

function arrayContains(array, value) {
	for (var i = 0, c = array.length; i < c; i++) {
		if (array[i] == value) {
			return true;
		}
	}

	return false;
}

function arrayContentsMatch(a, b) {
	var i;

	if (!(0, _is.isArray)(a) || !(0, _is.isArray)(b)) {
		return false;
	}

	if (a.length !== b.length) {
		return false;
	}

	i = a.length;
	while (i--) {
		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
}

function ensureArray(x) {
	if (typeof x === 'string') {
		return [x];
	}

	if (x === undefined) {
		return [];
	}

	return x;
}

function lastItem(array) {
	return array[array.length - 1];
}

function removeFromArray(array, member) {
	if (!array) {
		return;
	}

	var index = array.indexOf(member);

	if (index !== -1) {
		array.splice(index, 1);
	}
}

function toArray(arrayLike) {
	var array = [],
	    i = arrayLike.length;
	while (i--) {
		array[i] = arrayLike[i];
	}

	return array;
}

function findByKeyValue(array, key, value) {
	return array.filter(function (obj) {
		return obj[key] === value;
	});
}

},{"./is":25}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    if (window.location.hash !== '') {
        if (window.location.hash === '#projects' || window.location.hash === '#awards') {
            _environment.$document.triggerHandler('scrollToLast.ScrollPage');
        }
    }
};

var _environment = require('./environment');

},{"./environment":22}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $document = $(document);
var $window = $(window);
var $html = $(document.documentElement);
var $body = $(document.body);

exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	(0, _Svg2.default)();
	(0, _PageTransitions2.default)();
};

var _Svg = require('../global/Svg');

var _Svg2 = _interopRequireDefault(_Svg);

var _PageTransitions = require('../global/PageTransitions');

var _PageTransitions2 = _interopRequireDefault(_PageTransitions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../global/PageTransitions":2,"../global/Svg":3}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.escapeHtml = escapeHtml;
exports.unescapeHtml = unescapeHtml;
exports.getNodeData = getNodeData;
/**
 * @see  https://github.com/ractivejs/ractive/blob/dev/src/utils/html.js
 */
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Prepare HTML content that contains mustache characters for use with Ractive
 * @param  {string} str
 * @return {string}
 */
function unescapeHtml(str) {
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/**
 * Get element data attributes
 * @param   {DOMElement}  node
 * @return  {Array}       data
 */
function getNodeData(node) {
    // All attributes
    var attributes = node.attributes;

    // Regex Pattern
    var pattern = /^data\-(.+)$/;

    // Output
    var data = {};

    for (var i in attributes) {
        // Attributes name (ex: data-module)
        var name = attributes[i].name;

        // This happens.
        if (!name) {
            continue;
        }

        var match = name.match(pattern);
        if (!match) {
            continue;
        }

        // If this throws an error, you have some
        // serious problems in your HTML.
        data[match[1]] = node.getAttribute(name);
    }

    return data;
}

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isArray = isArray;
exports.isArrayLike = isArrayLike;
exports.isEqual = isEqual;
exports.isNumeric = isNumeric;
exports.isObject = isObject;
exports.isFunction = isFunction;
var toString = Object.prototype.toString,
    arrayLikePattern = /^\[object (?:Array|FileList)\]$/;

// thanks, http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
function isArray(thing) {
	return toString.call(thing) === '[object Array]';
}

function isArrayLike(obj) {
	return arrayLikePattern.test(toString.call(obj));
}

function isEqual(a, b) {
	if (a === null && b === null) {
		return true;
	}

	if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
		return false;
	}

	return a === b;
}

// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
function isNumeric(thing) {
	return !isNaN(parseFloat(thing)) && isFinite(thing);
}

function isObject(thing) {
	return thing && toString.call(thing) === '[object Object]';
}

function isFunction(thing) {
	var getType = {};
	return thing && getType.toString.call(thing) === '[object Function]';
}

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.visibilityApi = undefined;

var _is = require('./is');

var _array = require('./array');

var _environment = require('./environment');

var CALLBACKS = {
	hidden: [],
	visible: []
}; /* jshint esnext: true */


var ACTIONS = ['addCallback', 'removeCallback'];

var STATES = ['visible', 'hidden'];

var PREFIX = 'v-';

var UUID = 0;

// Main event
_environment.$document.on('visibilitychange', function (event) {
	if (document.hidden) {
		onDocumentChange('hidden');
	} else {
		onDocumentChange('visible');
	}
});

/**
 * Add a callback
 * @param {string}   state
 * @param {function} callback
 * @return {string}  ident
 */
function addCallback(state, options) {
	var callback = options.callback || '';

	if (!(0, _is.isFunction)(callback)) {
		console.warn('Callback is not a function');
		return false;
	}

	var ident = PREFIX + UUID++;

	CALLBACKS[state].push({
		ident: ident,
		callback: callback
	});

	return ident;
}

/**
 * Remove a callback
 * @param  {string}   state  Visible or hidden
 * @param  {string}   ident  Unique identifier
 * @return {boolean}         If operation was a success
 */
function removeCallback(state, options) {
	var ident = options.ident || '';

	if (typeof ident === 'undefined' || ident === '') {
		console.warn('Need ident to remove callback');
		return false;
	}

	var index = (0, _array.findByKeyValue)(CALLBACKS[state], 'ident', ident)[0];

	// console.log(ident)
	// console.log(CALLBACKS[state])

	if (typeof index !== 'undefined') {
		(0, _array.removeFromArray)(CALLBACKS[state], index);
		return true;
	} else {
		console.warn('Callback could not be found');
		return false;
	}
}

/**
 * When document state changes, trigger callbacks
 * @param  {string}  state  Visible or hidden
 */
function onDocumentChange(state) {
	var callbackArray = CALLBACKS[state];
	var i = 0;
	var len = callbackArray.length;

	for (; i < len; i++) {
		callbackArray[i].callback();
	}
}

/**
 * Public facing API for adding and removing callbacks
 * @param   {object}           options  Options
 * @return  {boolean|integer}           Unique identifier for the callback or boolean indicating success or failure
 */
function visibilityApi(options) {
	var action = options.action || '';
	var state = options.state || '';
	var ret = void 0;

	// Type and value checking
	if (!(0, _array.arrayContains)(ACTIONS, action)) {
		console.warn('Action does not exist');
		return false;
	}
	if (!(0, _array.arrayContains)(STATES, state)) {
		console.warn('State does not exist');
		return false;
	}

	// @todo Magic call function pls
	if (action === 'addCallback') {
		ret = addCallback(state, options);
	} else if (action === 'removeCallback') {
		ret = removeCallback(state, options);
	}

	return ret;
}

exports.visibilityApi = visibilityApi;

},{"./array":20,"./environment":22,"./is":25}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wolfy87Eventemitter = require('wolfy87-eventemitter');

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Resize = function (_eventEmitter) {
  _inherits(Resize, _eventEmitter);

  function Resize() {
    _classCallCheck(this, Resize);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Resize).call(this));

    _this.onResizeHandle = _this.onResize.bind(_this);

    window.addEventListener('resize', _this.onResizeHandle);
    window.addEventListener('orientationchange', _this.onResizeHandle);
    return _this;
  }

  _createClass(Resize, [{
    key: 'onResize',
    value: function onResize() {
      if (!this.started) {
        this.started = true;
        this.times = 0;

        this.emitEvent('resize:start');
      }

      if (this.handle != null) {
        this.times = 0;

        window.cancelAnimationFrame(this.handle);
      }

      this.handle = window.requestAnimationFrame(function tick() {
        if (++this.times === 10) {
          this.handle = null;
          this.started = false;
          this.times = 0;

          this.emitEvent('resize:end');
        } else {
          this.handle = window.requestAnimationFrame(tick.bind(this));
        }
      }.bind(this));
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      window.removeEventListener('resize', this.onResizeHandle);
      window.removeEventListener('orientationchange', this.onResizeHandle);

      this.removeAllListeners();
    }
  }]);

  return Resize;
}(_wolfy87Eventemitter2.default);

exports.default = Resize;

},{"wolfy87-eventemitter":28}],28:[function(require,module,exports){
/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);
                i = listeners.length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));

},{}]},{},[1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWwvUGFnZVRyYW5zaXRpb25zLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2xvYmFsL1N2Zy5qcyIsImFzc2V0cy9zY3JpcHRzL2dsb2JhbC9zdmcuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy9BYnN0cmFjdE1vZHVsZS5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQ2Fyb3VzZWwuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0Nhcm91c2VsQ29udGVudC5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQ29udGFjdEZvcm0uanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0NvdW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy9FbnRyeUxpc3QuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0VudHJ5TG9hZGVyLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy9NYXAuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL05hdi5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvUHJvamVjdHMuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL1Njcm9sbC5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvU2Nyb2xsUGFnZS5qcyIsImFzc2V0cy9zY3JpcHRzL3JhY3RpdmUvcmFjdGl2ZS1ldmVudHMtdGFwLmpzIiwiYXNzZXRzL3NjcmlwdHMvcmFjdGl2ZS9yYWN0aXZlLXRyYW5zaXRpb25zLWNzcy5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2FycmF5LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvZGV0ZWN0SGFzaHRhZy5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvZ2xvYmFscy5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2h0bWwuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9pcy5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL3Zpc2liaWxpdHkuanMiLCJub2RlX21vZHVsZXMvdGhyb3R0bGVkLXJlc2l6ZS9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3dvbGZ5ODctZXZlbnRlbWl0dGVyL0V2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOztJQUFZLE87Ozs7OzswSkFQWjs7O0FBS0E7OztJQUlNLEc7QUFDRixtQkFBYztBQUFBOztBQUNWLGFBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxhQUFLLGNBQUwsR0FBc0IsRUFBdEI7QUFDSDs7QUFFRDs7Ozs7O2tCQUlBLFcsMEJBQWM7QUFDVjtBQUNBLGVBQU8sSUFBUDtBQUNILEs7O0FBRUQ7Ozs7OztrQkFJQSxXLDBCQUFjO0FBQ1Y7QUFDQSxZQUFJLFlBQVksU0FBUyxnQkFBVCxDQUEwQixlQUExQixDQUFoQjs7QUFFQTtBQUNBLFlBQUksSUFBSSxDQUFSO0FBQ0EsWUFBSSxTQUFTLFVBQVUsTUFBdkI7O0FBRUEsZUFBTyxJQUFJLE1BQVgsRUFBbUIsR0FBbkIsRUFBd0I7O0FBRXBCO0FBQ0EsZ0JBQUksS0FBSyxVQUFVLENBQVYsQ0FBVDs7QUFFQTtBQUNBLGdCQUFJLFVBQVUsdUJBQVksRUFBWixDQUFkOztBQUVBO0FBQ0Esb0JBQVEsRUFBUixHQUFhLEVBQWI7QUFDQSxvQkFBUSxHQUFSLEdBQWMsRUFBRSxFQUFGLENBQWQ7O0FBRUE7QUFDQSxnQkFBSSxPQUFPLFFBQVEsTUFBbkI7O0FBRUE7QUFDQSxnQkFBSSxlQUFlLEtBQUssT0FBTCxDQUFhLEtBQWIsRUFBb0IsRUFBcEIsRUFBd0IsS0FBeEIsQ0FBOEIsR0FBOUIsQ0FBbkI7O0FBRUE7QUFDQSxnQkFBSSxJQUFJLENBQVI7QUFDQSxnQkFBSSxh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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJHdpbmRvdywgJGRvY3VtZW50LCAkYm9keSB9IGZyb20gJy4vdXRpbHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgZ2V0Tm9kZURhdGEgfSBmcm9tICcuL3V0aWxzL2h0bWwnO1xuaW1wb3J0IGRldGVjdEhhc2h0YWcgZnJvbSAnLi91dGlscy9kZXRlY3RIYXNodGFnJztcblxuLy8gR2xvYmFsIGZ1bmN0aW9ucyBhbmQgdG9vbHNcbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vdXRpbHMvZ2xvYmFscyc7XG5pbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcyc7XG5cbmNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMgPSBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGdsb2JhbCBmdW5jdGlvbnMgYW5kIHNldHRpbmdzXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGluaXRHbG9iYWxzKCkge1xuICAgICAgICBnbG9iYWxzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgbW9kdWxlcyBhbmQgaW5pdGlhbGl6ZSB0aGVtXG4gICAgICogQHJldHVybiAge09iamVjdH0gIHRoaXMgIEFsbG93cyBjaGFpbmluZ1xuICAgICAqL1xuICAgIGluaXRNb2R1bGVzKCkge1xuICAgICAgICAvLyBFbGVtZW50cyB3aXRoIG1vZHVsZVxuICAgICAgICB2YXIgbW9kdWxlRWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kdWxlXScpO1xuXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBlbGVtZW50c1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHZhciBlbHNMZW4gPSBtb2R1bGVFbHMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoOyBpIDwgZWxzTGVuOyBpKyspIHtcblxuICAgICAgICAgICAgLy8gQ3VycmVudCBlbGVtZW50XG4gICAgICAgICAgICBsZXQgZWwgPSBtb2R1bGVFbHNbaV07XG5cbiAgICAgICAgICAgIC8vIEFsbCBkYXRhLSBhdHRyaWJ1dGVzIGNvbnNpZGVyZWQgYXMgb3B0aW9uc1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBnZXROb2RlRGF0YShlbCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBjdXJyZW50IERPTSBlbGVtZW50IGFuZCBqUXVlcnkgZWxlbWVudFxuICAgICAgICAgICAgb3B0aW9ucy5lbCA9IGVsO1xuICAgICAgICAgICAgb3B0aW9ucy4kZWwgPSAkKGVsKTtcblxuICAgICAgICAgICAgLy8gTW9kdWxlIGRvZXMgZXhpc3QgYXQgdGhpcyBwb2ludFxuICAgICAgICAgICAgbGV0IGF0dHIgPSBvcHRpb25zLm1vZHVsZTtcblxuICAgICAgICAgICAgLy8gU3BsaXR0aW5nIG1vZHVsZXMgZm91bmQgaW4gdGhlIGRhdGEtYXR0cmlidXRlXG4gICAgICAgICAgICBsZXQgbW9kdWxlSWRlbnRzID0gYXR0ci5yZXBsYWNlKC9cXHMvZywgJycpLnNwbGl0KCcsJyk7XG5cbiAgICAgICAgICAgIC8vIExvb3AgbW9kdWxlc1xuICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgbGV0IG1vZHVsZXNMZW4gPSBtb2R1bGVJZGVudHMubGVuZ3RoO1xuXG4gICAgICAgICAgICBmb3IgKDsgaiA8IG1vZHVsZXNMZW47IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBtb2R1bGVBdHRyID0gbW9kdWxlSWRlbnRzW2pdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1vZHVsZSA9IG5ldyB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRlc3Ryb3lNb2R1bGVzKCkge1xuXG4gICAgICAgIC8vIExvb3BpbmcgcmVnaXN0ZXJlZCBtb2R1bGVzLlxuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5jdXJyZW50TW9kdWxlcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAgICAgbGV0IG1vZHVsZSA9IHRoaXMuY3VycmVudE1vZHVsZXNbbGVuZ3RoXTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgd2VyZSBtb2R1bGVzIGFwcGxpZWQgdG8gdGhlIGN1cnJlbnQgZWxlbWVudCxcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGVtLCBzbyB0aGF0IGluaXRNb2R1bGVzKCkgY2FsbHMgdGhlbSBiYWNrLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUuJGVsICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdmFyICRlbCA9IG1vZHVsZS4kZWw7XG4gICAgICAgICAgICAgICAgaWYgKCRlbC5kYXRhKCdfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICRlbC5kYXRhKCdfbW9kdWxlcycsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEF1dG9tYXRpYyBjYWxsIHRvIGRlc3Ryb3lcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbW9kdWxlLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBtb2R1bGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZW1vdmluZyBsYXN0IGl0ZW0gb2YgdGhlIGFycmF5XG4gICAgICAgICAgICAvLyBXaWxsIGFsd2F5cyB3b3JrcyBiZWNhdXNlIHdlJ3JlIGxvb3BpbmdcbiAgICAgICAgICAgIC8vIHRoZSBhcnJheSBmcm9tIHRoZSBlbmQgdG8gdGhlIGJlZ2lubmluZy5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMucG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGFwcCBhZnRlciBkb2N1bWVudCByZWFkeVxuICAgICAqL1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuaW5pdEdsb2JhbHMoKS5pbml0TW9kdWxlcygpO1xuICAgIH1cbn1cblxuKGZ1bmN0aW9uKCkge1xuICAgIGxldCByZWFkeSA9IGZhbHNlO1xuICAgIGxldCBsb2FkZWQgPSBmYWxzZTtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIGxldCBtaW5Mb2FkID0gNDUwO1xuICAgIGxldCBtYXhMb2FkID0gMzAwMDtcblxuICAgICRib2R5LmFkZENsYXNzKCdpcy1sb2FkaW5nJyk7XG5cbiAgICAvLyBPbiBsb2FkXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAkd2luZG93Lm9uKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvYWRlZCA9IHRydWU7XG5cbiAgICAgICAgaWYocmVhZHkgJiYgIWRvbmUpIHtcbiAgICAgICAgICAgIGxvYWQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTWluaW11bSBsb2FkXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZWFkeSA9IHRydWU7XG4gICAgICAgIGlmKGxvYWRlZCAmJiAhZG9uZSkge1xuICAgICAgICAgICAgbG9hZCgpO1xuICAgICAgICB9XG4gICAgfSwgbWluTG9hZCk7XG5cbiAgICAvLyBNYXhpbXVtIGxvYWRcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCFkb25lKSB7XG4gICAgICAgICAgICBsb2FkKCk7XG4gICAgICAgIH1cbiAgICB9LCBtYXhMb2FkKTtcblxuICAgIC8vIExvYWRcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICB3aW5kb3cuQXBwID0gbmV3IEFwcCgpO1xuICAgICAgICB3aW5kb3cuQXBwLmluaXQoKTtcblxuICAgICAgICBkZXRlY3RIYXNodGFnKCk7XG5cbiAgICAgICAgJGJvZHkucmVtb3ZlQ2xhc3MoJ2lzLWxvYWRpbmcnKS5hZGRDbGFzcygnaXMtbG9hZGVkJyk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRib2R5LmFkZENsYXNzKCdpcy1hbmltYXRlZCcpO1xuICAgICAgICB9LCA0NTApO1xuICAgIH1cbn0pKCk7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyAkZG9jdW1lbnQsICRib2R5IH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5pbXBvcnQgZGV0ZWN0SGFzaHRhZyBmcm9tICcuLi91dGlscy9kZXRlY3RIYXNodGFnJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRyYW5zaXRpb24gPSAnZGVmYXVsdCc7XG5cbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgYmxhY2tsaXN0OiAnLm5vLXRyYW5zaXRpb25zJyxcbiAgICAgICAgZm9ybXM6IGZhbHNlLFxuICAgICAgICBvbkJlZm9yZTogZnVuY3Rpb24oJGN1cnJlbnRUYXJnZXQsICRjb250YWluZXIpIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSAkY3VycmVudFRhcmdldC5kYXRhKCd0cmFuc2l0aW9uJyk7XG5cbiAgICAgICAgICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcigndHVybk9mZi5TY3JvbGxQYWdlJyk7XG5cbiAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uID09PSAnc2NhbGUnKSB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25TdGFydDoge1xuICAgICAgICAgICAgZHVyYXRpb246IDQ1MCwgLy8gRHVyYXRpb24gb2Ygb3VyIGFuaW1hdGlvblxuICAgICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoJGNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihtaW4td2lkdGg6IDEyMDBweClcIikubWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgeW91ciBDU1MgYW5pbWF0aW9uIHJldmVyc2luZyBjbGFzc1xuICAgICAgICAgICAgICAgICAgICBpZiAodHJhbnNpdGlvbiA9PT0gJ3NjYWxlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGJvZHkucmVtb3ZlQ2xhc3MoJ2lzLXNjYWxlZCcpLmFkZENsYXNzKCdoYXMtbm8tdHJhbnNpdGlvbiBpcy1zcGlubmluZycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb24gPT09ICduZXh0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGJvZHkucmVtb3ZlQ2xhc3MoJ2lzLXNjYWxlZCcpLmFkZENsYXNzKCdoYXMtbm8tdHJhbnNpdGlvbiBpcy10cmFuc2l0aW9uaW5nLW5leHQgaXMtc3Bpbm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5qcy1zY3JvbGwtc2VjdGlvbicpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoJy5qcy1zY3JvbGwtc2VjdGlvbi1jb250ZW50JykuaGVpZ2h0KCkgfSwgNDUwKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRib2R5LnJlbW92ZUNsYXNzKCdoYXMtbm8tdHJhbnNpdGlvbiBoYXMtbmF2LW9wZW4gaGFzLW1hcC1vcGVuJykuYWRkQ2xhc3MoJ2lzLXNwaW5uaW5nIGlzLXRyYW5zaXRpb25pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRib2R5LnJlbW92ZUNsYXNzKCdoYXMtbm8tdHJhbnNpdGlvbiBoYXMtbmF2LW9wZW4gaGFzLW1hcC1vcGVuJykuYWRkQ2xhc3MoJ2lzLXNwaW5uaW5nIGlzLXRyYW5zaXRpb25pbmcnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSZXN0YXJ0IHlvdXIgYW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgc21vb3RoU3RhdGUucmVzdGFydENTU0FuaW1hdGlvbnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25SZWFkeToge1xuICAgICAgICAgICAgZHVyYXRpb246IDEwLFxuICAgICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoJGNvbnRhaW5lciwgJG5ld0NvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBJbmplY3QgdGhlIG5ldyBjb250ZW50XG4gICAgICAgICAgICAgICAgd2luZG93LkFwcC5kZXN0cm95TW9kdWxlcygpO1xuICAgICAgICAgICAgICAgICRjb250YWluZXIuaHRtbCgkbmV3Q29udGVudCk7XG5cblxuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoJy5qcy10ZW1wbGF0ZScpLmRhdGEoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJGJvZHkucmVtb3ZlQ2xhc3MoJ2lzLWFuaW1hdGVkIGlzLXRyYW5zaXRpb25pbmcgaXMtc2NhbGVkIGlzLXRyYW5zbGF0ZWQgaXMtbmV4dCBoYXMtaGFsZi10cmFuc2l0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXRlbXBsYXRlJywgdGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvbkFmdGVyOiBmdW5jdGlvbigkY29udGFpbmVyLCAkbmV3Q29udGVudCkge1xuICAgICAgICAgICAgJGJvZHkucmVtb3ZlQ2xhc3MoJ2lzLXNwaW5uaW5nIGlzLXRyYW5zaXRpb25pbmctbmV4dCcpLmFkZENsYXNzKCdpcy1hbmltYXRlZCcpO1xuXG4gICAgICAgICAgICB3aW5kb3cuQXBwLmluaXRNb2R1bGVzKCk7XG5cbiAgICAgICAgICAgIGRldGVjdEhhc2h0YWcoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc21vb3RoU3RhdGUgPSAkKCcjbWFpbicpLnNtb290aFN0YXRlKG9wdGlvbnMpLmRhdGEoJ3Ntb290aFN0YXRlJyk7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblx0c3ZnNGV2ZXJ5Ym9keSgpO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cdHN2ZzRldmVyeWJvZHkoKTtcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmV4cG9ydCB7ZGVmYXVsdCBhcyBTY3JvbGxQYWdlfSBmcm9tICcuL21vZHVsZXMvU2Nyb2xsUGFnZSc7XG5leHBvcnQge2RlZmF1bHQgYXMgTmF2fSBmcm9tICcuL21vZHVsZXMvTmF2JztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBDYXJvdXNlbH0gZnJvbSAnLi9tb2R1bGVzL0Nhcm91c2VsJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBDYXJvdXNlbENvbnRlbnR9IGZyb20gJy4vbW9kdWxlcy9DYXJvdXNlbENvbnRlbnQnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIFByb2plY3RzfSBmcm9tICcuL21vZHVsZXMvUHJvamVjdHMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEVudHJ5TGlzdH0gZnJvbSAnLi9tb2R1bGVzL0VudHJ5TGlzdCc7XG5leHBvcnQge2RlZmF1bHQgYXMgTWFwfSBmcm9tICcuL21vZHVsZXMvTWFwJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBDb250YWN0Rm9ybX0gZnJvbSAnLi9tb2R1bGVzL0NvbnRhY3RGb3JtJztcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7ICRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5IH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG4vKipcbiAqIEFic3RyYWN0IG1vZHVsZVxuICogR2l2ZXMgYWNjZXNzIHRvIGdlbmVyaWMgalF1ZXJ5IG5vZGVzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucykge1xuXHRcdHRoaXMuJGRvY3VtZW50ID0gJGRvY3VtZW50O1xuXHRcdHRoaXMuJHdpbmRvdyA9ICR3aW5kb3c7XG5cdFx0dGhpcy4kaHRtbCA9ICRodG1sO1xuXHRcdHRoaXMuJGJvZHkgPSAkYm9keTtcblx0XHR0aGlzLiRlbCA9IG9wdGlvbnMuJGVsO1xuXHR9XG59XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ2Fyb3VzZWwgbW9kdWxlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLiRlbC5zbGljayh7XG4gICAgICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIGNsYXNzPVwiYy1jYXJvdXNlbF9idXR0b24gLXByZXZcIiB0eXBlPVwiYnV0dG9uXCI+PHN2ZyBjbGFzcz1cImMtY2Fyb3VzZWxfYnV0dG9uX2ljb25cIiByb2xlPVwiaW1nXCIgdGl0bGU9XCJQcmV2aW91c1wiPjx1c2UgeGxpbms6aHJlZj1cImFzc2V0cy9pbWFnZXMvc3ByaXRlLnN2ZyNpY29uLXByZXZcIj48L3VzZT48L3N2Zz48L2J1dHRvbj4nLFxuICAgICAgICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiBjbGFzcz1cImMtY2Fyb3VzZWxfYnV0dG9uIC1uZXh0XCIgdHlwZT1cImJ1dHRvblwiPjxzdmcgY2xhc3M9XCJjLWNhcm91c2VsX2J1dHRvbl9pY29uXCIgcm9sZT1cImltZ1wiIHRpdGxlPVwiTmV4dFwiPjx1c2UgeGxpbms6aHJlZj1cImFzc2V0cy9pbWFnZXMvc3ByaXRlLnN2ZyNpY29uLW5leHRcIj48L3VzZT48L3N2Zz48L2J1dHRvbj4nXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIERlc3Ryb3lcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuJGVsLnNsaWNrKCd1bnNsaWNrJyk7XG4gICAgfVxufVxuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENhcm91c2VsIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy4kY2Fyb3VzZWwgPSB0aGlzLiRlbC5maW5kKCcuanMtY2Fyb3VzZWwtY29udGVudCcpO1xuICAgICAgICB0aGlzLmluaXRTbGljaygpO1xuICAgICAgICB0aGlzLiRlbC5vbignY2xpY2suQ2Fyb3VzZWxDb250ZW50JywgJy5qcy1jYXJvdXNlbC1kb3QnLCAoZXZlbnQpID0+IHRoaXMuZ29Ub1NsaWRlKGV2ZW50KSk7XG4gICAgICAgIHRoaXMuJGVsLm9uKCdjbGljay5DYXJvdXNlbENvbnRlbnQnLCAnLmpzLWNhcm91c2VsLWFycm93JywgKGV2ZW50KSA9PiB0aGlzLmNoYW5nZVNsaWRlKGV2ZW50KSk7XG4gICAgICAgIHRoaXMuJGNhcm91c2VsLm9uKCdzd2lwZScsICgpID0+IHRoaXMuY2hhbmdlU2xpZGUoKSk7XG4gICAgfVxuXG4gICAgLy8gSW5pdCBjYXJvdXNlbFxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW5pdFNsaWNrKCkge1xuICAgICAgICB0aGlzLiRjYXJvdXNlbC5zbGljayh7XG4gICAgICAgICAgICBzcGVlZDogNjAwLFxuICAgICAgICAgICAgY3NzRWFzZTogJ2N1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSknLFxuICAgICAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiBjbGFzcz1cImMtY2Fyb3VzZWxfYnV0dG9uIC1wcmV2IC1vcmFuZ2UganMtY2Fyb3VzZWwtYXJyb3dcIiB0eXBlPVwiYnV0dG9uXCI+PHN2ZyBjbGFzcz1cImMtY2Fyb3VzZWxfYnV0dG9uX2ljb25cIiByb2xlPVwiaW1nXCIgdGl0bGU9XCJQcmV2aW91c1wiPjx1c2UgeGxpbms6aHJlZj1cImFzc2V0cy9pbWFnZXMvc3ByaXRlLnN2ZyNpY29uLXByZXZcIj48L3VzZT48L3N2Zz48L2J1dHRvbj4nLFxuICAgICAgICAgICAgbmV4dEFycm93OiAnPGJ1dHRvbiBjbGFzcz1cImMtY2Fyb3VzZWxfYnV0dG9uIC1uZXh0IC1vcmFuZ2UganMtY2Fyb3VzZWwtYXJyb3dcIiB0eXBlPVwiYnV0dG9uXCI+PHN2ZyBjbGFzcz1cImMtY2Fyb3VzZWxfYnV0dG9uX2ljb25cIiByb2xlPVwiaW1nXCIgdGl0bGU9XCJOZXh0XCI+PHVzZSB4bGluazpocmVmPVwiYXNzZXRzL2ltYWdlcy9zcHJpdGUuc3ZnI2ljb24tbmV4dFwiPjwvdXNlPjwvc3ZnPjwvYnV0dG9uPidcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gR28gdG8gc2xpZGVcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGdvVG9TbGlkZShldmVudCkge1xuICAgICAgICBsZXQgJHRhcmdldCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGxldCBzbGlkZSA9ICR0YXJnZXQuZGF0YSgnc2xpZGUnKTtcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcuanMtY2Fyb3VzZWwtZG90LmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgJHRhcmdldC5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGNhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBzbGlkZSwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIENoYW5nZSBzbGlkZVxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2hhbmdlU2xpZGUoZXZlbnQpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRTbGlkZSA9IHRoaXMuJGNhcm91c2VsLnNsaWNrKCdzbGlja0N1cnJlbnRTbGlkZScpO1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5qcy1jYXJvdXNlbC1kb3QuaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuanMtY2Fyb3VzZWwtZG90W2RhdGEtc2xpZGU9XCInK2N1cnJlbnRTbGlkZSsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgIH1cblxuICAgIC8vIERlc3Ryb3lcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuJGNhcm91c2VsLnNsaWNrKCd1bnNsaWNrJyk7XG4gICAgICAgIHRoaXMuJGVsLm9mZignQ2Fyb3VzZWxDb250ZW50Jyk7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLmlzVHJhbnNtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaGFzRm9ybWRhdGEgPSBmYWxzZTtcblxuICAgICAgICAvLyBCYXNpYyBlbGVtZW50cyBuZWVkZWQgZm9yIHZpc3VhbCBpbnRlcmFjdGlvbnNcbiAgICAgICAgdGhpcy4kZm9ybSA9IG51bGw7XG4gICAgICAgIHRoaXMuJGVycm9yTWVzc2FnZXMgPSBudWxsO1xuICAgICAgICB0aGlzLiRwcmVTdWJtaXQgPSBudWxsO1xuICAgICAgICB0aGlzLiRwb3N0U3VibWl0ID0gbnVsbDtcbiAgICAgICAgdGhpcy4kY2FwdGNoYSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5zZXRFbGVtZW50cygpO1xuXG4gICAgICAgIC8vIENoZWNrIGZvciBGb3JtRGF0YSBhdmFpbGFiaWxpdHlcbiAgICAgICAgLy8gaWYgKHR5cGVvZiB3aW5kb3cuRm9ybURhdGEgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gICAgIHRoaXMuJGhhc0Zvcm1kYXRhRWwuaGlkZSgpO1xuICAgICAgICAvLyAgICAgdGhpcy4kaGFzTm9Gb3JtZGF0YUVsLnNob3coKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIHRoaXMuJGVsLm9uKCdzdWJtaXQuQ29udGFjdEZvcm0nLCAnLmpzLWZvcm0nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZVN1Ym1pdChuZXcgRm9ybURhdGEoZXZlbnQuY3VycmVudFRhcmdldCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlbC5vbignY2hhbmdlLkNvbnRhY3RGb3JtJywgJy5qcy1maWxlJywgKGV2ZW50KSA9PiB0aGlzLnVwZGF0ZUZpbGUoZXZlbnQpKTtcbiAgICAgICAgdGhpcy4kZWwub24oJ2NoYW5nZS5Db250YWN0Rm9ybScsICdpbnB1dCcsICgpID0+IHRoaXMuc2hvd0NhcHRjaGEoKSk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLiRjYXB0Y2hhLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZ3JlY2FwdGNoYS5yZW5kZXIodGhpcy5pZCwge1xuICAgICAgICAgICAgICAgICAgICBzaXRla2V5OiB3aW5kb3cudGVtcGxhdGVEYXRhLnJlY2FwdGNoYVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1hbmFnZSBlcnJvcnMgc2VudCBieSBiYWNrIGVuZCBvbiBmcm9udCBlbmRcbiAgICAgKiBAcGFyYW0gIHthcnJheX0gIGVycm9ycyAgTGlzdCBvZiBlcnJvciBvYmplY3RzXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgbWFuYWdlRXJyb3JzKGVycm9ycykge1xuICAgICAgICAvLyBSZXNldCBjYXB0Y2hhXG4gICAgICAgIGlmICh0eXBlb2Yod2luZG93LmdyZWNhcHRjaGEpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgd2luZG93LmdyZWNhcHRjaGEucmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gMCwgbGVuID0gZXJyb3JzLmxlbmd0aDtcbiAgICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgJCgnIycgKyBlcnJvcnNbaV0ucHJvcGVydHkpLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1Ym1pdHMgdGhlIGZvcm0gZGF0YSB0byBhbiBVUkwgd2l0aCAkLmFqYXhcbiAgICAgKlxuICAgICAqIEBwYXJhbSAgRm9ybURhdGFcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBtYW5hZ2VTdWJtaXQoZGF0YSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNUcmFuc21pdHRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuaXNUcmFuc21pdHRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy4kZm9ybS5maW5kKCcuaGFzLWVycm9yJykucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgdGhpcy50b2dnbGVMb2FkaW5nKCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBqcXhociA9ICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHRoaXMuJGZvcm0uYXR0cignYWN0aW9uJyksXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZSgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHByZVN1Ym1pdC5mYWRlT3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRwb3N0U3VibWl0LmZhZGVJbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZUVycm9ycyhyZXNwb25zZS5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYWx3YXlzKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUxvYWRpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNUcmFuc21pdHRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNjAwKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIDYwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byBzZXQgbmVlZGVkIGVsZW1lbnRzIHdoZW4gZG9jdW1lbnQgaXMgcmVhZHkuXG4gICAgICogQmFzaWNhbGx5IGZvciBhbnkgZm9ybSB3aXRoIFJhY3RpdmVcbiAgICAgKi9cbiAgICBzZXRFbGVtZW50cygpIHtcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1mb3JtJyk7XG4gICAgICAgIHRoaXMuJHByZVN1Ym1pdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1wcmUtc3VibWl0Jyk7XG4gICAgICAgIHRoaXMuJHBvc3RTdWJtaXQgPSB0aGlzLiRlbC5maW5kKCcuanMtcG9zdC1zdWJtaXQnKTtcbiAgICAgICAgdGhpcy4kY2FwdGNoYSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1jYXB0Y2hhJyk7XG4gICAgICAgIHRoaXMuJGhhc0Zvcm1kYXRhRWwgPSB0aGlzLiRlbC5maW5kKCcuanMtaGFzLWZvcm1kYXRhJyk7XG4gICAgICAgIHRoaXMuJGhhc05vRm9ybWRhdGFFbCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1oYXMtbm8tZm9ybWRhdGEnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaW1wbGUgbWV0aG9kIGZvciB0b2dnbGluZyBhbmltYXRpb24gc3RhdGVzXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgdG9nZ2xlTG9hZGluZygpIHtcbiAgICAgICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ2lzLWZvcm0tc3RhdGUtbG9hZGluZycpO1xuICAgIH1cblxuICAgIHVwZGF0ZUZpbGUoZXZlbnQpIHtcbiAgICAgICAgbGV0ICR0YXJnZXQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICBsZXQgZmlsZU5hbWUgPSAkdGFyZ2V0WzBdLmZpbGVzWzBdLm5hbWU7XG5cbiAgICAgICAgJHRhcmdldC5zaWJsaW5ncygnLmpzLWZpbGUtbGFiZWwnKS50ZXh0KGZpbGVOYW1lKTtcbiAgICB9XG5cbiAgICBzaG93Q2FwdGNoYSgpIHtcbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2lzLWZvY3VzJyk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy4kZWwub2ZmKCcuQ29udGFjdEZvcm0nKTtcbiAgICB9XG59XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ291bnQgbW9kdWxlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLmluaXRIdW50KCk7XG4gICAgfVxuXG4gICAgLy8gSHVudFxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW5pdEh1bnQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgJCgnLmpzLWNvdW50JykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgIHNlbGYuY291bnQodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIENvdW50XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjb3VudCh0YXJnZXQpIHtcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgIOKAg+KAg3VzZUVhc2luZyA6IGZhbHNlLFxuICAgICAgICDigIPigIN1c2VHcm91cGluZyA6IHRydWUsXG4gICAgICAgIOKAg+KAg3NlcGFyYXRvciA6ICcnLFxuICAgICAgICDigIPigINkZWNpbWFsIDogJy4nLFxuICAgICAgICDigIPigINwcmVmaXggOiAnJyxcbiAgICAgICAg4oCD4oCDc3VmZml4IDogJydcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgJHRhcmdldCA9ICQodGFyZ2V0KTtcbiAgICAgICAgbGV0IHN0YXJ0TnVtYmVyID0gMDtcbiAgICAgICAgbGV0IGVuZE51bWJlciA9ICR0YXJnZXQuZGF0YSgnY291bnQnKTtcbiAgICAgICAgbGV0IGRlbGF5ID0gJHRhcmdldC5kYXRhKCdjb3VudC1kZWxheScpO1xuICAgICAgICBsZXQgZHVyYXRpb24gPSAxLjU7XG5cbiAgICAgICAgbGV0IGNvdW50ZXIgPSBuZXcgQ291bnRVcCh0YXJnZXQsIHN0YXJ0TnVtYmVyLCBlbmROdW1iZXIsIDAsIGR1cmF0aW9uLCBvcHRpb25zKTtcblxuICAgICAgICB0aGlzLiRkb2N1bWVudC5vbignaXNBbmltYXRlZC5BcHAnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY291bnRlci5zdGFydCgpO1xuICAgICAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBEZXN0cm95XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLiRlbC5vZmYoKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgRW50cnlMb2FkZXIgZnJvbSAnLi9FbnRyeUxvYWRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgRW50cnlMb2FkZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5oYXNSYWN0aXZlTGlzdCA9ICh0eXBlb2Ygb3B0aW9uc1sncmFjdGl2ZS1saXN0J10gIT09ICd1bmRlZmluZWQnKTtcblxuICAgICAgICBpZiAodGhpcy5oYXNSYWN0aXZlTGlzdCkge1xuICAgICAgICAgICAgdGhpcy5jb250cm9sbGVyID0gdGhpcy5pbml0Q29udHJvbGxlcih7XG4gICAgICAgICAgICAgICAgZW50cmllc1BlclBhZ2U6IDgsXG4gICAgICAgICAgICAgICAgb25Jbml0OiAoKSA9PiB0aGlzLnNldEV2ZW50cygpLFxuICAgICAgICAgICAgICAgIGltYWdlOiAnPGltZyBzcmM9XCJbWyBmZWF0dXJlZEltYWdlIF1dXCIgYWx0PVwiXCI+J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldEV2ZW50cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0RXZlbnRzKCkge1xuICAgICAgICB0aGlzLiRlbC5vbignY2xpY2suRW50cnlMaXN0JywgJy5qcy1lbnRyeS1pdGVtJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICBpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2lzLW9wZW4nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbigkdGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZWwub24oJ2NsaWNrLkVudHJ5TGlzdCcsICcuanMtZW50cnktY2xvc2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICAgIGlmICgkdGFyZ2V0LnBhcmVudHMoJy5qcy1lbnRyeS1pdGVtJykuaGFzQ2xhc3MoJ2lzLW9wZW4nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoZXZlbnQsICR0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBPcGVuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBvcGVuKCR0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5jbG9zZUFsbCgpO1xuXG4gICAgICAgICR0YXJnZXRcbiAgICAgICAgICAgIC5maW5kKCcuanMtZW50cnktbWFpbicpXG4gICAgICAgICAgICAuc3RvcCgpXG4gICAgICAgICAgICAuc2xpZGVEb3duKDQwMClcbiAgICAgICAgICAgIC5wYXJlbnRzKCcuanMtZW50cnktaXRlbScpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2lzLW9wZW4nKVxuICAgICAgICA7XG5cbiAgICAgICAgIC8vIFNjcm9sbCB0byBzZWN0aW9uLCBhZnRlciBkZWxheVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8oJHRhcmdldCk7XG4gICAgICAgIH0sIDQwMCk7XG4gICAgfVxuXG4gICAgLy8gQ2xvc2VcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsb3NlKGV2ZW50LCAkdGFyZ2V0KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICR0YXJnZXRcbiAgICAgICAgICAgIC5wYXJlbnRzKCcuanMtZW50cnktaXRlbScpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2lzLW9wZW4nKVxuICAgICAgICAgICAgLmZpbmQoJy5qcy1lbnRyeS1tYWluJylcbiAgICAgICAgICAgIC5zdG9wKClcbiAgICAgICAgICAgIC5zbGlkZVVwKDQwMClcbiAgICAgICAgO1xuICAgIH1cblxuICAgIC8vIENsb3NlIGFsbFxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xvc2VBbGwoKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5qcy1lbnRyeS1pdGVtLmlzLW9wZW4nKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdpcy1vcGVuJylcbiAgICAgICAgICAgIC5maW5kKCcuanMtZW50cnktbWFpbicpXG4gICAgICAgICAgICAuc3RvcCgpXG4gICAgICAgICAgICAuc2xpZGVVcCg0MDApO1xuICAgIH1cblxuICAgIC8vIFNjcm9sbCB0b1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgc2Nyb2xsVG8oJHRhcmdldCkge1xuICAgICAgICB0aGlzLiRib2R5LmFuaW1hdGUoe1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtICQoJy5qcy1oZWFkZXItbG9nbycpLmhlaWdodCgpXG4gICAgICAgIH0sIDMwMCk7XG4gICAgfVxuXG4gICAgLy8gRGVzdHJveVxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy4kZWwub2ZmKCcuRW50cnlMaXN0Jyk7XG4gICAgICAgIGlmICh0aGlzLmhhc1JhY3RpdmVMaXN0KSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIudGVhcmRvd24oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5pbXBvcnQgdGFwIGZyb20gJy4uL3JhY3RpdmUvcmFjdGl2ZS1ldmVudHMtdGFwJztcbmltcG9ydCBjc3MgZnJvbSAnLi4vcmFjdGl2ZS9yYWN0aXZlLXRyYW5zaXRpb25zLWNzcyc7XG5cbmltcG9ydCB7IHVuZXNjYXBlSHRtbCB9IGZyb20gJy4uL3V0aWxzL2h0bWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgdGhlIFJhY3RpdmUgZW50cnkgbGlzdCBjb250cm9sbGVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIG9iamVjdCAgICAgICAgICBvcHRpb25zXG4gICAgICogQHJldHVybiBSYWN0aXZlIG9iamVjdCAgICAgICAgICBSYWN0aXZlIGluc3RhbmNlXG4gICAgICovXG4gICAgaW5pdENvbnRyb2xsZXIob3B0aW9ucykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY29udHJvbGxlciA9IG5ldyBSYWN0aXZlKHtcbiAgICAgICAgICAgIGVsOiB0aGlzLiRlbCxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAodHlwZW9mIHRoaXMudGVtcGxhdGUgIT09ICd1bmRlZmluZWQnKSA/IHRoaXMudGVtcGxhdGUgOiB1bmVzY2FwZUh0bWwodGhpcy4kZWwuaHRtbCgpKSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5RW50cnlMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudHJ5TGlzdDogd2luZG93LnRlbXBsYXRlRGF0YS5lbnRyeUxpc3QsXG4gICAgICAgICAgICAgICAgZW50cmllc1BlclBhZ2U6IG9wdGlvbnMuZW50cmllc1BlclBhZ2UsXG4gICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICBzdGF0ZTogJ2luZXJ0J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXB1dGVkOiB7XG4gICAgICAgICAgICAgICAgaGFzTW9yZUVudHJpZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdwYWdlJykgPCB0aGlzLm1heFBhZ2VzKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYWdlQXJyYXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVudHJ5TGlzdCA9IHRoaXMuZ2V0KCdlbnRyeUxpc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVudHJpZXNQZXJQYWdlID0gdGhpcy5nZXQoJ2VudHJpZXNQZXJQYWdlJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYWdlQXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gdGhpcy5nZXQoJ3BhZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1pbiA9IGVudHJpZXNQZXJQYWdlICogaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtYXggPSAoZW50cmllc1BlclBhZ2UgKiBpKSArIGVudHJpZXNQZXJQYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhZ2UgPSBlbnRyeUxpc3Quc2xpY2UobWluLCBtYXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZUFycmF5W2ldID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJpZXM6IHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2VBcnJheTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFydGlhbHM6IHtcbiAgICAgICAgICAgICAgICBpbWFnZTogb3B0aW9ucy5pbWFnZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlbGltaXRlcnM6IFsnW1snLCAnXV0nXSxcbiAgICAgICAgICAgIHRyaXBsZURlbGltaXRlcnM6IFsnW1tbJywgJ11dXSddLFxuICAgICAgICAgICAgZXZlbnRzOiB7IHRhcCB9LFxuICAgICAgICAgICAgdHJhbnNpdGlvbnM6IHsgY3NzIH0sXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENhbGN1bGF0ZSB0aGUgbWF4IHBhZ2VzIHBvc3NpYmxlIGZvciBFbnRyeUxpc3RcbiAgICAgICAgICAgICAqIEByZXR1cm4ge2ludH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWF4UGFnZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBlbnRyeUNvdW50ID0gdGhpcy5nZXQoJ2VudHJ5TGlzdCcpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgZW50cmllc1BlclBhZ2UgPSB0aGlzLmdldCgnZW50cmllc1BlclBhZ2UnKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVtYWluZGVyID0gKGVudHJ5Q291bnQgJSBlbnRyaWVzUGVyUGFnZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChlbnRyeUNvdW50IC0gcmVtYWluZGVyKSAvIGVudHJpZXNQZXJQYWdlO1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiAoZW50cnlDb3VudCAtIHJlbWFpbmRlcikgLyBlbnRyaWVzUGVyUGFnZSArIChyZW1haW5kZXIgIT09IDAgPyAxIDogMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBbGxvd3MgdXMgdG8gc2V0IHByb3h5IGV2ZW50cyBhbmQgcnVuIG90aGVyIHRhc2tzIHdoZW4gY29udHJvbGxlciBpcyBpbml0aWFsaXplZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvbmluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMub24oe1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogRmlyZWQgYnkgdGhlIGxvYWQgbW9yZSBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGxvYWROZXh0UGFnZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZCgncGFnZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMub25Jbml0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25Jbml0KClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTd2ljaCB2YWx1ZXMgdGhhdCBhcmUgdG9nZ2xlZCBiZXR3ZWVuIHR3byBzdGF0ZXMgb24gbG9hZCBzdGF0ZVxuICAgICAgICAgICAgICogQHBhcmFtICB7Ym9vbGVhbn0gIHN0YXRlICBDb250cm9scyB0b3dhcmRzIHdoaWNoIHN0YXRlIHRoZSBhbmltYXRpb24gZ29lc1xuICAgICAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBUcnVlIC0+IGRpc3BsYXkgbGlzdFxuICAgICAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBGYWxzZSAtPiBoaWRlIGxpc3RcbiAgICAgICAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgQWxsb3dzIGNoYWluaW5nIHdpdGggYSAudGhlbigpXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRvZ2dsZUxvYWRpbmc6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9ICh0eXBlb2Ygc3RhdGUgPT09ICdib29sZWFuJyAmJiBzdGF0ZSA9PT0gZmFsc2UpID9cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlFbnRyeUxpc3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogJ2xvYWRpbmcnXG4gICAgICAgICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUVudHJ5TGlzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGU6ICdpbmVydCdcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNldCh2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICB9XG59XG5cbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHZW5lcmljIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5tYXA7XG4gICAgICAgIHRoaXMuY2VudGVyO1xuICAgICAgICB0aGlzLm1hcmtlcnMgPSBbXTtcblxuICAgICAgICB0aGlzLm9mZmljZUxvY2F0aW9ucyA9IHdpbmRvdy50ZW1wbGF0ZURhdGEub2ZmaWNlTG9jYXRpb25zO1xuICAgICAgICB0aGlzLnByb2plY3RMb2NhdGlvbnMgPSB3aW5kb3cudGVtcGxhdGVEYXRhLnByb2plY3RMb2NhdGlvbnM7XG5cblx0XHR0aGlzLiRkb2N1bWVudC5vbignaW5pdC5NYXAnLCAoKSA9PiB0aGlzLmluaXRNYXAoKSk7XG5cbiAgICAgICAgdGhpcy4kZWwub24oJ2NsaWNrLk1hcCcsICcuanMtbWFwLW9wZW4nLCAoZXZlbnQpID0+IHRoaXMub3Blbk1hcCgpKTtcbiAgICAgICAgdGhpcy4kZWwub24oJ2NsaWNrLk1hcCcsICcuanMtbWFwLWNsb3NlJywgKGV2ZW50KSA9PiB0aGlzLmNsb3NlTWFwKCkpO1xuICAgIH1cblxuICAgIC8vIEluaXQgbWFwc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRpbml0TWFwKCkge1xuICAgICAgICB0aGlzLmNlbnRlciA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoLTEuMjY2ODEzOCwgLTI1LjYzOTY4OTQpO1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgICAgICBjZW50ZXI6IHRoaXMuY2VudGVyLFxuXHRcdFx0em9vbTogMyxcblx0XHRcdG1hcFR5cGVDb250cm9sOiBmYWxzZSxcblx0XHRcdHNjcm9sbHdoZWVsOiBmYWxzZSxcblx0XHRcdHN0eWxlczogW3tcImZlYXR1cmVUeXBlXCI6XCJhbGxcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcInNhdHVyYXRpb25cIjozNn0se1wiY29sb3JcIjpcIiMwMDAwMDBcIn0se1wibGlnaHRuZXNzXCI6NDB9XX0se1wiZmVhdHVyZVR5cGVcIjpcImFsbFwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0LnN0cm9rZVwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvblwifSx7XCJjb2xvclwiOlwiIzAwMDAwMFwifSx7XCJsaWdodG5lc3NcIjoxNn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwiYWxsXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLmljb25cIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImFkbWluaXN0cmF0aXZlXCIsXCJlbGVtZW50VHlwZVwiOlwiZ2VvbWV0cnkuZmlsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzAwMDAwMFwifSx7XCJsaWdodG5lc3NcIjoyMH1dfSx7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmVcIixcImVsZW1lbnRUeXBlXCI6XCJnZW9tZXRyeS5zdHJva2VcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiMwMDAwMDBcIn0se1wibGlnaHRuZXNzXCI6MTd9LHtcIndlaWdodFwiOjEuMn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHNcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImFkbWluaXN0cmF0aXZlLmNvdW50cnlcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJhZG1pbmlzdHJhdGl2ZS5jb3VudHJ5XCIsXCJlbGVtZW50VHlwZVwiOlwiZ2VvbWV0cnlcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJhZG1pbmlzdHJhdGl2ZS5jb3VudHJ5XCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHRcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJhZG1pbmlzdHJhdGl2ZS5wcm92aW5jZVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmUubG9jYWxpdHlcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifSx7XCJzYXR1cmF0aW9uXCI6XCItMTAwXCJ9LHtcImxpZ2h0bmVzc1wiOlwiMzBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmUubmVpZ2hib3Job29kXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJhZG1pbmlzdHJhdGl2ZS5sYW5kX3BhcmNlbFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcInNpbXBsaWZpZWRcIn0se1wiZ2FtbWFcIjpcIjAuMDBcIn0se1wibGlnaHRuZXNzXCI6XCI3NFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJnZW9tZXRyeVwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzAwMDAwMFwifSx7XCJsaWdodG5lc3NcIjoyMH1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlLm1hbl9tYWRlXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcImxpZ2h0bmVzc1wiOlwiM1wifV19LHtcImZlYXR1cmVUeXBlXCI6XCJwb2lcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInBvaVwiLFwiZWxlbWVudFR5cGVcIjpcImdlb21ldHJ5XCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjMDAwMDAwXCJ9LHtcImxpZ2h0bmVzc1wiOjIxfV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkXCIsXCJlbGVtZW50VHlwZVwiOlwiZ2VvbWV0cnlcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmhpZ2h3YXlcIixcImVsZW1lbnRUeXBlXCI6XCJnZW9tZXRyeS5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjMDAwMDAwXCJ9LHtcImxpZ2h0bmVzc1wiOjE3fV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmhpZ2h3YXlcIixcImVsZW1lbnRUeXBlXCI6XCJnZW9tZXRyeS5zdHJva2VcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiMwMDAwMDBcIn0se1wibGlnaHRuZXNzXCI6Mjl9LHtcIndlaWdodFwiOjAuMn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5hcnRlcmlhbFwiLFwiZWxlbWVudFR5cGVcIjpcImdlb21ldHJ5XCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjMDAwMDAwXCJ9LHtcImxpZ2h0bmVzc1wiOjE4fV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmxvY2FsXCIsXCJlbGVtZW50VHlwZVwiOlwiZ2VvbWV0cnlcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiMwMDAwMDBcIn0se1wibGlnaHRuZXNzXCI6MTZ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInRyYW5zaXRcIixcImVsZW1lbnRUeXBlXCI6XCJnZW9tZXRyeVwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzAwMDAwMFwifSx7XCJsaWdodG5lc3NcIjoxOX1dfSx7XCJmZWF0dXJlVHlwZVwiOlwid2F0ZXJcIixcImVsZW1lbnRUeXBlXCI6XCJnZW9tZXRyeVwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzAwMDAwMFwifSx7XCJsaWdodG5lc3NcIjoxN31dfV1cblx0XHR9KTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub2ZmaWNlTG9jYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcodGhpcy5vZmZpY2VMb2NhdGlvbnNbaV1bMF0sIHRoaXMub2ZmaWNlTG9jYXRpb25zW2ldWzFdKSxcbiAgICAgICAgICAgICAgICBtYXA6IHRoaXMubWFwLFxuICAgICAgICAgICAgICAgIGljb246IGAke3dpbmRvdy5iYXNlVXJsfWFzc2V0cy9pbWFnZXMvbWFya2VyLnN2Z2BcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5tYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wcm9qZWN0TG9jYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcodGhpcy5wcm9qZWN0TG9jYXRpb25zW2ldWzBdLCB0aGlzLnByb2plY3RMb2NhdGlvbnNbaV1bMV0pLFxuICAgICAgICAgICAgICAgIG1hcDogdGhpcy5tYXAsXG4gICAgICAgICAgICAgICAgaWNvbjogYCR7d2luZG93LmJhc2VVcmx9YXNzZXRzL2ltYWdlcy9tYXJrZXItd2hpdGUuc3ZnYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLm1hcmtlcnMucHVzaChtYXJrZXIpO1xuXHRcdH1cblx0fVxuXG4gICAgLy8gT3BlbiBtYXBcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIG9wZW5NYXAoKSB7XG4gICAgXHR0aGlzLiRib2R5LmFkZENsYXNzKCdoYXMtbWFwLW9wZW4nKTtcbiAgICB9XG5cbiAgICAvLyBDbG9zZSBtYXBcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsb3NlTWFwKCkge1xuICAgIFx0dGhpcy4kYm9keS5yZW1vdmVDbGFzcygnaGFzLW1hcC1vcGVuJyk7XG4gICAgfVxuXG4gICAgLy8gRGVzdHJveVxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgY29uc3QgJG1hcEVsID0gJCgnI21hcCcpO1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5jbGVhckluc3RhbmNlTGlzdGVuZXJzKHdpbmRvdyk7XG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmNsZWFySW5zdGFuY2VMaXN0ZW5lcnMoZG9jdW1lbnQpO1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5jbGVhckluc3RhbmNlTGlzdGVuZXJzKCRtYXBFbFswXSk7XG4gICAgICAgICRtYXBFbC5kZXRhY2goKVxuICAgICAgICB0aGlzLm1hcmtlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBudWxsO1xuICAgICAgICB0aGlzLm1hcCA9IG51bGw7XG4gICAgICAgIHRoaXMuJGRvY3VtZW50Lm9mZignLk1hcCcpO1xuICAgICAgICB0aGlzLiRlbC5vZmYoJy5NYXAnKTtcbiAgICB9XG59XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSUdFXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLiRlbC5vbignY2xpY2suTmF2JywgJy5qcy1uYXYtdG9nZ2xlJywgKCkgPT4gdGhpcy50b2dnbGVOYXYoKSk7XG4gICAgfVxuXG4gICAgLy8gSW5pdCBjYXJvdXNlbFxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgdG9nZ2xlTmF2KCkge1xuICAgICAgICB0aGlzLiRib2R5LnRvZ2dsZUNsYXNzKCdoYXMtbmF2LW9wZW4nKTtcbiAgICB9XG5cbiAgICAvLyBEZXN0cm95XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLiRlbC5vZmYoJy5OYXYnKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgRW50cnlMb2FkZXIgZnJvbSAnLi9FbnRyeUxvYWRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgRW50cnlMb2FkZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gdGhpcy5pbml0Q29udHJvbGxlcih7XG4gICAgICAgICAgICBlbnRyaWVzUGVyUGFnZTogMzAsXG4gICAgICAgICAgICBpbWFnZTogJzxkaXYgY2xhc3M9XCJvLWJhY2tncm91bmRcIiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6IHVybChbWyB0aHVtYm5haWwgXV0pO1wiPjwvZGl2PidcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnRlYXJkb3duKCk7XG4gICAgfVxufVxuXG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyAkd2luZG93ICwgJGRvY3VtZW50ICwgJGJvZHl9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCBSZXNpemUgZnJvbSAndGhyb3R0bGVkLXJlc2l6ZSc7XG5cbi8qKlxuICogTWFuYWdlIGFuaW1hdGlvbiBvZiBlbGVtZW50cyBvbiB0aGUgcGFnZSBhY2NvcmRpbmcgdG8gc2Nyb2xsIHBvc2l0aW9uLlxuICpcbiAqIEB0b2RvICBNYW5hZ2Ugc29tZSBvcHRpb25zIChub3JtYWxseSBmcm9tIGRhdGEgYXR0cmlidXRlcykgd2l0aCBjb25zdHJ1Y3RvciBvcHRpb25zIChleC46IHNldCByZXBlYXQgZm9yIGFsbClcbiAqIEB0b2RvICBNZXRob2QgdG8gZ2V0IHRoZSBkaXN0YW5jZSAoYXMgcGVyY2VudGFnZSkgb2YgYW4gZWxlbWVudCBpbiB0aGUgdmlld3BvcnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcjtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyID0gJCh0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuJHNlbGVjdG9yID0gJChvcHRpb25zLnNlbGVjdG9yKTtcblxuICAgICAgICB0aGlzLnNjcm9sbCA9IHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgZGlyZWN0aW9uOiAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LkFwcC5zY3JvbGwgPSB0aGlzLnNjcm9sbDtcblxuICAgICAgICB0aGlzLndpbmRvd0hlaWdodCA9ICR3aW5kb3cuaGVpZ2h0KCk7XG4gICAgICAgIHRoaXMud2luZG93TWlkZGxlID0gdGhpcy53aW5kb3dIZWlnaHQgLyAyO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVySGVpZ2h0ID0gdGhpcy4kY29udGFpbmVyLmhlaWdodCgpO1xuXG4gICAgICAgIHRoaXMuYW5pbWF0ZWRFbGVtZW50cyA9IFtdO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgc2Nyb2xsaW5nIGFuaW1hdGlvbnNcbiAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmFkZEVsZW1lbnRzKCk7XG4gICAgICAgIHRoaXMuYW5pbWF0ZUVsZW1lbnRzKCk7XG5cbiAgICAgICAgdGhpcy5yZXNpemUgPSBuZXcgUmVzaXplKCk7XG4gICAgICAgIHRoaXMucmVzaXplLm9uKCdyZXNpemU6ZW5kJywgKCkgPT4gdGhpcy51cGRhdGVFbGVtZW50cygpKTtcblxuICAgICAgICAkZG9jdW1lbnQub24oJ3Njcm9sbFRvLlNjcm9sbCcsIChldmVudCkgPT4gdGhpcy5zY3JvbGxUbyhldmVudC5vcHRpb25zKSk7XG4gICAgICAgIC8vIFVwZGF0ZSBldmVudFxuICAgICAgICB0aGlzLiRjb250YWluZXIub24oJ3VwZGF0ZS5TY3JvbGwnLCAoZXZlbnQsIG9wdGlvbnMpID0+IHRoaXMudXBkYXRlRWxlbWVudHMob3B0aW9ucykpO1xuICAgICAgICAvLyBSZW5kZXIgZXZlbnRcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLm9uKCdzY3JvbGwuU2Nyb2xsJywgKCkgPT4gdGhpcy5yZW5kZXJBbmltYXRpb25zKGZhbHNlKSk7XG5cbiAgICAgICAgLy8gUmVidWlsZCBldmVudFxuICAgICAgICAkZG9jdW1lbnQub24oJ3JlYnVpbGQuU2Nyb2xsJywgKCkgPT57XG4gICAgICAgICAgICAvLyB0aGlzLnNjcm9sbFRvKDApO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50cygpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkZG9jdW1lbnQub24oJ2FuaW1hdGUuU2Nyb2xsJywgKCkgPT57XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzKCk7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGVFbGVtZW50cygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGFsbCBhbmltYXRhYmxlIGVsZW1lbnRzLlxuICAgICAqIENhbGxlZCBvbiBwYWdlIGxvYWQgYW5kIGFueSBzdWJzZXF1ZW50IHVwZGF0ZXMuXG4gICAgICovXG4gICAgYWRkRWxlbWVudHMoKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0ZWRFbGVtZW50cyA9IFtdO1xuXG4gICAgICAgIHZhciAkZWxlbWVudHMgPSAkKHRoaXMub3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdmFyIGxlbiA9ICRlbGVtZW50cy5sZW5ndGg7XG5cbiAgICAgICAgZm9yICg7IGkgPCBsZW47IGkgKyspIHtcbiAgICAgICAgICAgIGxldCAkZWxlbWVudCA9ICRlbGVtZW50cy5lcShpKTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50VGFyZ2V0ID0gJGVsZW1lbnQuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICBsZXQgZWxlbWVudFBvc2l0aW9uID0gJGVsZW1lbnQuZGF0YSgncG9zaXRpb24nKTtcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gKGVsZW1lbnRUYXJnZXQpID8gJChlbGVtZW50VGFyZ2V0KSA6ICRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRPZmZzZXQgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcDtcbiAgICAgICAgICAgIGxldCBlbGVtZW50TGltaXQgPSBlbGVtZW50T2Zmc2V0ICsgJHRhcmdldC5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICAvLyBJZiBlbGVtZW50cyBsb3NlcyBpdHMgYW5pbWF0aW9uIGFmdGVyIHNjcm9sbGluZyBwYXN0IGl0XG4gICAgICAgICAgICBsZXQgZWxlbWVudFJlcGVhdCA9ICh0eXBlb2YgJGVsZW1lbnQuZGF0YSgncmVwZWF0JykgPT09ICdzdHJpbmcnKTtcblxuICAgICAgICAgICAgbGV0IGVsZW1lbnRJblZpZXdDbGFzcyA9ICRlbGVtZW50LmRhdGEoJ2ludmlldy1jbGFzcycpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50SW5WaWV3Q2xhc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudEluVmlld0NsYXNzID0gJ2lzLXNob3cnXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERvbid0IGFkZCBlbGVtZW50IGlmIGl0IGFscmVhZHkgaGFzIGl0cyBpbiB2aWV3IGNsYXNzIGFuZCBkb2Vzbid0IHJlcGVhdFxuICAgICAgICAgICAgLy8gaWYgKGVsZW1lbnRSZXBlYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGVkRWxlbWVudHNbaV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50OiAkZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBNYXRoLnJvdW5kKGVsZW1lbnRPZmZzZXQpLFxuICAgICAgICAgICAgICAgICAgICByZXBlYXQ6IGVsZW1lbnRSZXBlYXQsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBlbGVtZW50UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGxpbWl0OiBlbGVtZW50TGltaXQsXG4gICAgICAgICAgICAgICAgICAgIGluVmlld0NsYXNzOiBlbGVtZW50SW5WaWV3Q2xhc3NcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9vcCB0aHJvdWdoIGFsbCBhbmltYXRhYmxlIGVsZW1lbnRzIGFuZCBhcHBseSBhbmltYXRpb24gbWV0aG9kKHMpLlxuICAgICAqL1xuICAgIGFuaW1hdGVFbGVtZW50cygpIHtcbiAgICAgICAgdmFyIGxlbiA9IHRoaXMuYW5pbWF0ZWRFbGVtZW50cy5sZW5ndGg7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdmFyIHJlbW92ZUluZGV4ZXMgPSBbXTtcbiAgICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmFuaW1hdGVkRWxlbWVudHNbaV07XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBlbGVtZW50J3MgdmlzaWJpbGl0eSBtdXN0IG5vdCBiZSBtYW5pcHVsYXRlZCBhbnkgZnVydGhlciwgcmVtb3ZlIGl0IGZyb20gdGhlIGxpc3RcbiAgICAgICAgICAgIGlmICh0aGlzLnRvZ2dsZUVsZW1lbnRDbGFzc2VzKGVsZW1lbnQsIGkpKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlSW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFuaW1hdGVkIGVsZW1lbnRzIGFmdGVyIGxvb3BpbmcgdGhyb3VnaCBlbGVtZW50c1xuICAgICAgICBpID0gcmVtb3ZlSW5kZXhlcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0ZWRFbGVtZW50cy5zcGxpY2UocmVtb3ZlSW5kZXhlc1tpXSwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXIgdGhlIGNsYXNzIGFuaW1hdGlvbnMsIGFuZCB1cGRhdGUgdGhlIGdsb2JhbCBzY3JvbGwgcG9zaXRpb25uaW5nLlxuICAgICAqL1xuICAgIHJlbmRlckFuaW1hdGlvbnMoKSB7XG4gICAgICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiB0aGlzLnNjcm9sbC55KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGwuZGlyZWN0aW9uICE9PSAnZG93bicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbC5kaXJlY3Rpb24gPSAnZG93bic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LnBhZ2VZT2Zmc2V0IDwgdGhpcy5zY3JvbGwueSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsLmRpcmVjdGlvbiAhPT0gJ3VwJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsLmRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjcm9sbC55ID0gdGhpcy4kY29udGFpbmVyLnNjcm9sbFRvcCgpO1xuICAgICAgICB0aGlzLnNjcm9sbC54ID0gdGhpcy4kY29udGFpbmVyLnNjcm9sbExlZnQoKTtcblxuICAgICAgICB0aGlzLmFuaW1hdGVFbGVtZW50cygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSBjbGFzc2VzIG9uIGFuIGVsZW1lbnQgaWYgaXQncyB2aXNpYmxlLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7b2JqZWN0fSAgICAgIGVsZW1lbnQgQ3VycmVudCBlbGVtZW50IHRvIHRlc3RcbiAgICAgKiBAcGFyYW0gIHtpbnR9ICAgICAgICAgaW5kZXggICBJbmRleCBvZiB0aGUgZWxlbWVudCB3aXRoaW4gaXQncyBjb250YWluZXJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICBXZXRoZXIgdGhlIGl0ZW0gbXVzdCBiZSByZW1vdmVkIGZyb20gaXRzIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHRvZ2dsZUVsZW1lbnRDbGFzc2VzKGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICAgIHZhciByZW1vdmVGcm9tQ29udGFpbmVyID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgLy8gRmluZCB0aGUgYm90dG9tIGVkZ2Ugb2YgdGhlIHNjcm9sbCBjb250YWluZXJcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLnNjcm9sbC55O1xuICAgICAgICAgICAgdmFyIHNjcm9sbEJvdHRvbSA9IHNjcm9sbFRvcCArIHRoaXMud2luZG93SGVpZ2h0O1xuXG4gICAgICAgICAgICAvLyBEZWZpbmUgaWYgdGhlIGVsZW1lbnQgaXMgaW5WaWV3XG4gICAgICAgICAgICB2YXIgaW5WaWV3O1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5wb3NpdGlvbiA9PSAndG9wJykge1xuICAgICAgICAgICAgICAgIGluVmlldyA9IChzY3JvbGxUb3AgPj0gZWxlbWVudC5vZmZzZXQgJiYgc2Nyb2xsVG9wIDw9IGVsZW1lbnQubGltaXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpblZpZXcgPSAoc2Nyb2xsQm90dG9tID49IGVsZW1lbnQub2Zmc2V0ICYmIHNjcm9sbFRvcCA8PSBlbGVtZW50LmxpbWl0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIGNsYXNzIGlmIGluVmlldywgcmVtb3ZlIGlmIG5vdFxuICAgICAgICAgICAgaWYgKGluVmlldykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuJGVsZW1lbnQuYWRkQ2xhc3MoZWxlbWVudC5pblZpZXdDbGFzcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnQucmVwZWF0KXtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRnJvbUNvbnRhaW5lciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnJlcGVhdCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoZWxlbWVudC5pblZpZXdDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVtb3ZlRnJvbUNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY3JvbGwgdG8gYSBkZXNpcmVkIHRhcmdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge29iamVjdHxpbnR9IHRhcmdldCBFaXRoZXIgYSBqUXVlcnkgZWxlbWVudCBvciBhIGB5YCBwb3NpdGlvblxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgLy8gc2Nyb2xsVG8odGFyZ2V0KSB7XG4gICAgLy8gICAgIHZhciB0YXJnZXRPZmZzZXQgPSAwO1xuICAgIC8vICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgalF1ZXJ5ICYmIHRhcmdldC5sZW5ndGggPiAwKSB7XG4gICAgLy8gICAgICAgICB2YXIgdGFyZ2V0RGF0YTtcblxuICAgIC8vICAgICAgICAgaWYgKHRhcmdldC5kYXRhKCd0YXJnZXQnKSkge1xuICAgIC8vICAgICAgICAgICAgIHRhcmdldERhdGEgPSB0YXJnZXQuZGF0YSgndGFyZ2V0Jyk7XG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgIHRhcmdldERhdGEgPSB0YXJnZXQuYXR0cignaHJlZicpO1xuICAgIC8vICAgICAgICAgfVxuXG4gICAgLy8gICAgICAgICB0YXJnZXRPZmZzZXQgPSAkKHRhcmdldERhdGEpLm9mZnNldCgpLnRvcCArIHRoaXMuc2Nyb2xsYmFyLnNjcm9sbFRvcDtcbiAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgIHRhcmdldE9mZnNldCA9IHRhcmdldDtcbiAgICAvLyAgICAgfVxuXG4gICAgLy8gICAgICRib2R5LmFuaW1hdGUoe1xuICAgIC8vICAgICAgICAgc2Nyb2xsVG9wOnRhcmdldE9mZnNldFxuICAgIC8vICAgICB9LCAnc2xvdycpO1xuICAgIC8vIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBTY3JvbGwgdG8gYSBkZXNpcmVkIHRhcmdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge29iamVjdH0gb3B0aW9uc1xuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc2Nyb2xsVG8ob3B0aW9ucykge1xuICAgICAgICB2YXIgdGFyZ2V0T2Zmc2V0ID0gMDtcblxuICAgICAgICB2YXIgJHRhcmdldEVsZW0gPSBvcHRpb25zLnRhcmdldEVsZW07XG4gICAgICAgIHZhciAkc291cmNlRWxlbSA9IG9wdGlvbnMuc291cmNlRWxlbTtcbiAgICAgICAgdmFyIHRhcmdldE9mZnNldCA9IG9wdGlvbnMudGFyZ2V0T2Zmc2V0O1xuXG4gICAgICAgIGlmICh0eXBlb2YgJHRhcmdldEVsZW0gPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiAkc291cmNlRWxlbSA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHRhcmdldE9mZnNldCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignWW91IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgcGFyYW1ldGVyLicpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mICR0YXJnZXRFbGVtICE9PSAndW5kZWZpbmVkJyAmJiAkdGFyZ2V0RWxlbSBpbnN0YW5jZW9mIGpRdWVyeSAmJiAkdGFyZ2V0RWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0YXJnZXRPZmZzZXQgPSAkdGFyZ2V0RWxlbS5vZmZzZXQoKS50b3A7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mICRzb3VyY2VFbGVtICE9PSAndW5kZWZpbmVkJyAmJiAkc291cmNlRWxlbSBpbnN0YW5jZW9mIGpRdWVyeSAmJiAkc291cmNlRWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RGF0YTtcblxuICAgICAgICAgICAgaWYgKCRzb3VyY2VFbGVtLmRhdGEoJ3RhcmdldCcpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0RGF0YSA9ICRzb3VyY2VFbGVtLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXREYXRhID0gJHNvdXJjZUVsZW0uYXR0cignaHJlZicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YXJnZXRPZmZzZXQgPSAkKHRhcmdldERhdGEpLm9mZnNldCgpLnRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0T2Zmc2V0XG4gICAgICAgIH0sICdzbG93Jyk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgZWxlbWVudHMgYW5kIHJlY2FsY3VsYXRlIGFsbCB0aGUgcG9zaXRpb25zIG9uIHRoZSBwYWdlXG4gICAgICovXG4gICAgdXBkYXRlRWxlbWVudHMoKSB7XG4gICAgICAgIHRoaXMuYWRkRWxlbWVudHMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95XG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5yZXNpemUuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLiRjb250YWluZXIub2ZmKCcuU2Nyb2xsJyk7XG4gICAgICAgICRkb2N1bWVudC5vZmYoJy5TY3JvbGwnKTtcbiAgICAgICAgdGhpcy5hbmltYXRlZEVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsImltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcbmltcG9ydCBTY3JvbGwgZnJvbSAnLi4vbW9kdWxlcy9TY3JvbGwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsO1xuXG4gICAgICAgIC8vIElmIG5vdCBtb2JpbGVcbiAgICAgICAgaWYoISgvQW5kcm9pZHxpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8V2luZG93cyBQaG9uZS9pKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnZlbmRvciB8fCB3aW5kb3cub3BlcmEpICYmICh3aW5kb3cubWF0Y2hNZWRpYSgnKG1pbi13aWR0aDogMTIwMHB4KScpLm1hdGNoZXMpKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gMTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEdyb3VwO1xuICAgICAgICAgICAgdGhpcy4kc2Nyb2xsU2VjdGlvbnMgPSB0aGlzLiRlbC5maW5kKCcuanMtc2Nyb2xsLXNlY3Rpb24nKTtcbiAgICAgICAgICAgIHRoaXMubWF4U2VjdGlvbiA9IHRoaXMuJHNjcm9sbFNlY3Rpb25zLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMudGltZW91dDtcbiAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gQWRkIHNlY3Rpb24gaW5kZXggZGF0YVxuICAgICAgICAgICAgdGhpcy4kc2Nyb2xsU2VjdGlvbnMuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2RhdGEtc2Nyb2xsLXNlY3Rpb24nLCBpbmRleCArIDEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEN1cnJlbnQgc2VjdGlvblxuICAgICAgICAgICAgdGhpcy4kY3VycmVudFNlY3Rpb24gPSB0aGlzLmdldEN1cnJlbnRTZWN0aW9uKCk7XG5cbiAgICAgICAgICAgIC8vIE5leHQgc2VjdGlvblxuICAgICAgICAgICAgdGhpcy4kZWwub24oJ2NsaWNrLlNjcm9sbFBhZ2UnLCAnLmpzLXNjcm9sbC1zZWN0aW9uLW5leHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlRG93bigpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tTY2FsZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFNjcm9sbCB0b1xuICAgICAgICAgICAgdGhpcy4kZWwub24oJ2NsaWNrLlNjcm9sbFBhZ2UnLCAnLmpzLXNjcm9sbC1zZWN0aW9uLXRvJywgKGV2ZW50KSA9PiB0aGlzLnNjcm9sbFRvKGV2ZW50KSk7XG5cbiAgICAgICAgICAgIC8vIFNjcm9sbCB0byBsYXN0XG4gICAgICAgICAgICB0aGlzLiRkb2N1bWVudC5vbignY2xpY2suU2Nyb2xsUGFnZScsICcuanMtc2Nyb2xsLXNlY3Rpb24tbGFzdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvTGFzdCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuJGRvY3VtZW50Lm9uKCdzY3JvbGxUb0xhc3QuU2Nyb2xsUGFnZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvTGFzdCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEluaXQgd2hlZWwgaW5kaWNhdG9yXG4gICAgICAgICAgICB0aGlzLm1vdXNld2hlZWwgPSBuZXcgV2hlZWxJbmRpY2F0b3Ioe1xuICAgICAgICAgICAgICAgIGVsZW06IHdpbmRvdyxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKGV2ZW50KSA9PiB0aGlzLmNoZWNrV2hlZWwoZXZlbnQpLFxuICAgICAgICAgICAgICAgIHByZXZlbnRNb3VzZTogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbCA9IG5ldyBTY3JvbGwoe1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogJy5qcy1zY3JvbGwtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJy5qcy1zY3JvbGwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy4kZG9jdW1lbnQub24oJ3R1cm5PZmYuU2Nyb2xsUGFnZScsICgpID0+IHRoaXMubW91c2V3aGVlbC50dXJuT2ZmKCkpO1xuICAgICAgICAgICAgdGhpcy4kZG9jdW1lbnQub24oJ3R1cm5Pbi5TY3JvbGxQYWdlJywgKCkgPT4gdGhpcy5tb3VzZXdoZWVsLnR1cm5PbigpKTtcbiAgICAgICAgLy8gSWYgbW9iaWxlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRib2R5LmFkZENsYXNzKCdpcy1tb2JpbGUnKTtcbiAgICAgICAgICAgIHRoaXMuJGRvY3VtZW50Lm9uKCdjbGljay5TY3JvbGxQYWdlJywgJy5qcy1zY3JvbGwtc2VjdGlvbi1sYXN0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHkucmVtb3ZlQ2xhc3MoJ2hhcy1uYXYtb3BlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLiRlbC5vbignY2xpY2suU2Nyb2xsUGFnZScsICcuanMtc2Nyb2xsLXNlY3Rpb24tbmV4dCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0ID0gJCgnLmpzLXNjcm9sbC1zZWN0aW9uJykuZXEoMSkub2Zmc2V0KCkudG9wIC0gJCgnLmpzLWhlYWRlcicpLmhlaWdodCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHkuc3RvcCgpLmFuaW1hdGUoe3Njcm9sbFRvcDogb2Zmc2V0fSwgJzYwMCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLiRlbC5vbignY2xpY2suU2Nyb2xsUGFnZScsICcuanMtc2Nyb2xsLXNlY3Rpb24tbGFzdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0ID0gJCgnLmpzLXNjcm9sbC1zZWN0aW9uJykuZXEoMSkub2Zmc2V0KCkudG9wIC0gJCgnLmpzLWhlYWRlcicpLmhlaWdodCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGJvZHkuc3RvcCgpLmFuaW1hdGUoe3Njcm9sbFRvcDogb2Zmc2V0fSwgJzYwMCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbCA9IG5ldyBTY3JvbGwoe1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6IGRvY3VtZW50LFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJy5qcy1zY3JvbGwnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgbW92ZVxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2hlY2tXaGVlbChldmVudCkge1xuICAgICAgICAvLyBDaGVjayBzY3JvbGwgZGlyZWN0aW9uXG4gICAgICAgIGlmIChldmVudC5kaXJlY3Rpb24gPT0gJ2Rvd24nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50U2VjdGlvbiA8IHRoaXMubWF4U2VjdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZURvd24oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiRjdXJyZW50U2VjdGlvbi5hZGRDbGFzcygnaXMtc2Nyb2xsaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGRvY3VtZW50LnRyaWdnZXIoJ3JlYnVpbGQuU2Nyb2xsJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24gPiAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1Njcm9sbHRvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaGVja1NjYWxlKCk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50R3JvdXAgPSB0aGlzLiRjdXJyZW50U2VjdGlvbi5kYXRhKCdzY3JvbGwtZ3JvdXAnKTtcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCcuanMtc2Nyb2xsLXNlY3Rpb24tZG90LmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmpzLXNjcm9sbC1zZWN0aW9uLWRvdFtkYXRhLXNjcm9sbC1zZWN0aW9uPVwiJyArIHRoaXMuY3VycmVudFNlY3Rpb24gKyAnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuanMtc2Nyb2xsLXNlY3Rpb24tZG90W2RhdGEtc2Nyb2xsLWdyb3VwPVwiJyArIHRoaXMuY3VycmVudEdyb3VwICsgJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBzY2FsZVxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2hlY2tTY2FsZSgpIHtcbiAgICAgICAgLy8gQ2hlY2sgc2NhbGUgZGF0YVxuICAgICAgICB0aGlzLiRjdXJyZW50U2VjdGlvbiA9IHRoaXMuZ2V0Q3VycmVudFNlY3Rpb24oKTtcblxuICAgICAgICAvLyBTY2FsZVxuICAgICAgICBpZiAodGhpcy4kY3VycmVudFNlY3Rpb24uZGF0YSgnc2Nyb2xsLXNlY3Rpb24tc2NhbGUnKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy4kYm9keS5hZGRDbGFzcygnaXMtc2NhbGVkJyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy4kY3VycmVudFNlY3Rpb24uZGF0YSgnc2Nyb2xsLXNlY3Rpb24tc2NhbGUnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuJGJvZHkucmVtb3ZlQ2xhc3MoJ2lzLXNjYWxlZCcpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyYW5zbGF0ZVxuICAgICAgICBpZiAodGhpcy4kY3VycmVudFNlY3Rpb24uZGF0YSgnc2Nyb2xsLXNlY3Rpb24tdHJhbnNsYXRlJykgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuJGJvZHkuYWRkQ2xhc3MoJ2lzLXRyYW5zbGF0ZWQnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLiRjdXJyZW50U2VjdGlvbi5kYXRhKCdzY3JvbGwtc2VjdGlvbi10cmFuc2xhdGUnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuJGJvZHkucmVtb3ZlQ2xhc3MoJ2lzLXRyYW5zbGF0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBOZXh0XG4gICAgICAgIGlmICh0aGlzLiRjdXJyZW50U2VjdGlvbi5kYXRhKCdzY3JvbGwtc2VjdGlvbi1uZXh0JykgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuJGJvZHkuYWRkQ2xhc3MoJ2lzLW5leHQnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLiRjdXJyZW50U2VjdGlvbi5kYXRhKCdzY3JvbGwtc2VjdGlvbi1uZXh0JykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLiRib2R5LnJlbW92ZUNsYXNzKCdpcy1uZXh0Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBkb3duXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBtb3ZlRG93bigpIHtcbiAgICAgICAgdGhpcy4kY3VycmVudFNlY3Rpb24gPSB0aGlzLmdldEN1cnJlbnRTZWN0aW9uKCk7XG5cbiAgICAgICAgLy8gQWRkIHByZXZcbiAgICAgICAgdGhpcy4kY3VycmVudFNlY3Rpb24uYWRkQ2xhc3MoJ2lzLXByZXYnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuY3VycmVudFNlY3Rpb24rKztcblxuICAgICAgICAvLyBBZGQgYWN0aXZlXG4gICAgICAgIHRoaXMuJGN1cnJlbnRTZWN0aW9uID0gdGhpcy5nZXRDdXJyZW50U2VjdGlvbigpO1xuICAgICAgICB0aGlzLiRjdXJyZW50U2VjdGlvbi5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuJGN1cnJlbnRTZWN0aW9uLmRhdGEoJ3Njcm9sbC1zZWN0aW9uLXNjcm9sbGJhcicpID09IHRydWUpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuJGRvY3VtZW50LnRyaWdnZXIoJ2FuaW1hdGUuU2Nyb2xsJyk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgdXBcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIG1vdmVVcCgpIHtcbiAgICAgICAgdGhpcy4kY3VycmVudFNlY3Rpb24gPSB0aGlzLmdldEN1cnJlbnRTZWN0aW9uKCk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFjdGl2ZVxuICAgICAgICB0aGlzLiRjdXJyZW50U2VjdGlvbi5yZW1vdmVDbGFzcygnaXMtYWN0aXZlIGlzLXJlYWR5Jyk7XG4gICAgICAgIHRoaXMuY3VycmVudFNlY3Rpb24tLTtcbiAgICAgICAgLy8gUmVtb3ZlIHByZXZcbiAgICAgICAgdGhpcy4kY3VycmVudFNlY3Rpb24gPSB0aGlzLmdldEN1cnJlbnRTZWN0aW9uKCk7XG4gICAgICAgIHRoaXMuJGN1cnJlbnRTZWN0aW9uLnJlbW92ZUNsYXNzKCdpcy1wcmV2JykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG4gICAgfVxuXG4gICAgLy8gU2Nyb2xsIHRvXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBzY3JvbGxUbyhldmVudCkge1xuICAgICAgICB0aGlzLiRjdXJyZW50U2VjdGlvbiA9IHRoaXMuZ2V0Q3VycmVudFNlY3Rpb24oKTtcbiAgICAgICAgdmFyICR0YXJnZXQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICB2YXIgZ3JvdXAgPSAkdGFyZ2V0LmRhdGEoJ3Njcm9sbC1ncm91cCcpO1xuICAgICAgICB2YXIgJG5ld1NlY3Rpb24gPSB0aGlzLiRzY3JvbGxTZWN0aW9ucy5maWx0ZXIoJ1tkYXRhLXNjcm9sbC1ncm91cD1cIicgKyBncm91cCArICdcIl0nKS5maXJzdCgpO1xuICAgICAgICB2YXIgbmV3U2VjdGlvbkluZGV4ID0gJG5ld1NlY3Rpb24uZGF0YSgnc2Nyb2xsLXNlY3Rpb24nKTtcblxuICAgICAgICAkKCcuanMtc2Nyb2xsLXNlY3Rpb24tZG90LmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgJHRhcmdldC5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24gPCBuZXdTZWN0aW9uSW5kZXgpIHtcbiAgICAgICAgICAgICRuZXdTZWN0aW9uLnByZXZBbGwoJy5qcy1zY3JvbGwtc2VjdGlvbicpLmFkZENsYXNzKCdpcy1wcmV2Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50U2VjdGlvbiA+IG5ld1NlY3Rpb25JbmRleCkge1xuICAgICAgICAgICAgJG5ld1NlY3Rpb24ubmV4dEFsbCgnLmpzLXNjcm9sbC1zZWN0aW9uJykucmVtb3ZlQ2xhc3MoJ2lzLXByZXYnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGN1cnJlbnRTZWN0aW9uLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kY3VycmVudFNlY3Rpb24gPSAkbmV3U2VjdGlvbjtcbiAgICAgICAgdGhpcy4kY3VycmVudFNlY3Rpb24ucmVtb3ZlQ2xhc3MoJ2lzLXByZXYnKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuY3VycmVudFNlY3Rpb24gPSBuZXdTZWN0aW9uSW5kZXg7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgc2Nyb2xsdG9wXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjaGVja1Njcm9sbHRvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuJGN1cnJlbnRTZWN0aW9uLmRhdGEoJ3Njcm9sbC1zZWN0aW9uLXNjcm9sbGJhcicpID09IHRydWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLiRjdXJyZW50U2VjdGlvbi5zY3JvbGxUb3AoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2Nyb2xsaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGN1cnJlbnRTZWN0aW9uLnJlbW92ZUNsYXNzKCdpcy1zY3JvbGxpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMubW92ZVVwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVVcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2Nyb2xsVG9MYXN0KCkge1xuICAgICAgICAvLyBTdXBlciBxdWljayBzaGl0IFdJUFxuICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gdGhpcy5tYXhTZWN0aW9uIC0gMTtcbiAgICAgICAgdGhpcy4kY3VycmVudFNlY3Rpb24gPSB0aGlzLmdldEN1cnJlbnRTZWN0aW9uKCk7XG4gICAgICAgIHRoaXMubW92ZURvd24oKTtcbiAgICAgICAgdGhpcy5jaGVja1NjYWxlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlQWxsKCk7XG5cblxuICAgICAgICBpZiAodGhpcy4kY3VycmVudFNlY3Rpb24uZGF0YSgnc2Nyb2xsLXNlY3Rpb24tc2Nyb2xsYmFyJykgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoID09PSAnI3Byb2plY3RzJyB8fCB3aW5kb3cubG9jYXRpb24uaGFzaCA9PT0gJyNhd2FyZHMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGFyZ2V0RWxlbSA9ICQod2luZG93LmxvY2F0aW9uLmhhc2gpLmZpcnN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGFyZ2V0RWxlbS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJGN1cnJlbnRTZWN0aW9uLmFkZENsYXNzKCdpcy1zY3JvbGxpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc2Nyb2xsVG8uU2Nyb2xsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEVsZW06ICR0YXJnZXRFbGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy4kZG9jdW1lbnQudHJpZ2dlcignYW5pbWF0ZS5TY3JvbGwnKTtcbiAgICAgICAgICAgIH0sIDYwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVBbGwoKSB7XG4gICAgICAgIHRoaXMuJHNjcm9sbFNlY3Rpb25zLmFkZENsYXNzKCdpcy1hY3RpdmUgaXMtcHJldicpO1xuICAgIH1cblxuICAgIGdldEN1cnJlbnRTZWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy4kc2Nyb2xsU2VjdGlvbnMuZmlsdGVyKCdbZGF0YS1zY3JvbGwtc2VjdGlvbj1cIicgKyB0aGlzLmN1cnJlbnRTZWN0aW9uICsgJ1wiXScpO1xuICAgIH1cblxuICAgIC8vIERlc3Ryb3lcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5tb3VzZXdoZWVsID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy5tb3VzZXdoZWVsLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdXNld2hlZWwgPSBudWxsO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2Nyb2xsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGwuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJGVsLm9mZignLlNjcm9sbFBhZ2UnKTtcbiAgICAgICAgdGhpcy4kZG9jdW1lbnQub2ZmKCcuU2Nyb2xsUGFnZScpO1xuICAgIH1cbn1cbiIsImNvbnN0IERJU1RBTkNFX1RIUkVTSE9MRCA9IDU7IC8vIG1heGltdW0gcGl4ZWxzIHBvaW50ZXIgY2FuIG1vdmUgYmVmb3JlIGNhbmNlbFxuY29uc3QgVElNRV9USFJFU0hPTEQgPSA0MDA7ICAgLy8gbWF4aW11bSBtaWxsaXNlY29uZHMgYmV0d2VlbiBkb3duIGFuZCB1cCBiZWZvcmUgY2FuY2VsXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRhcCAoIG5vZGUsIGNhbGxiYWNrICkge1xuICAgIHJldHVybiBuZXcgVGFwSGFuZGxlciggbm9kZSwgY2FsbGJhY2sgKTtcbn1cblxuZnVuY3Rpb24gVGFwSGFuZGxlciAoIG5vZGUsIGNhbGxiYWNrICkge1xuICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgdGhpcy5wcmV2ZW50TW91c2Vkb3duRXZlbnRzID0gZmFsc2U7XG5cbiAgICB0aGlzLmJpbmQoIG5vZGUgKTtcbn1cblxuVGFwSGFuZGxlci5wcm90b3R5cGUgPSB7XG4gICAgYmluZCAoIG5vZGUgKSB7XG4gICAgICAgIC8vIGxpc3RlbiBmb3IgbW91c2UvcG9pbnRlciBldmVudHMuLi5cbiAgICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQpIHtcbiAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJkb3duJywgaGFuZGxlTW91c2Vkb3duLCBmYWxzZSApO1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCkge1xuICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyRG93bicsIGhhbmRsZU1vdXNlZG93biwgZmFsc2UgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGhhbmRsZU1vdXNlZG93biwgZmFsc2UgKTtcblxuICAgICAgICAgICAgLy8gLi4uYW5kIHRvdWNoIGV2ZW50c1xuICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIGhhbmRsZVRvdWNoc3RhcnQsIGZhbHNlICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBuYXRpdmUgYnV0dG9ucywgYW5kIDxpbnB1dCB0eXBlPSdidXR0b24nPiBlbGVtZW50cywgc2hvdWxkIGZpcmUgYSB0YXAgZXZlbnRcbiAgICAgICAgLy8gd2hlbiB0aGUgc3BhY2Uga2V5IGlzIHByZXNzZWRcbiAgICAgICAgaWYgKCBub2RlLnRhZ05hbWUgPT09ICdCVVRUT04nIHx8IG5vZGUudHlwZSA9PT0gJ2J1dHRvbicgKSB7XG4gICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoICdmb2N1cycsIGhhbmRsZUZvY3VzLCBmYWxzZSApO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5fX3RhcF9oYW5kbGVyX18gPSB0aGlzO1xuICAgIH0sXG5cbiAgICBmaXJlICggZXZlbnQsIHgsIHkgKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2soe1xuICAgICAgICAgICAgbm9kZTogdGhpcy5ub2RlLFxuICAgICAgICAgICAgb3JpZ2luYWw6IGV2ZW50LFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIHlcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIG1vdXNlZG93biAoIGV2ZW50ICkge1xuICAgICAgICBpZiAoIHRoaXMucHJldmVudE1vdXNlZG93bkV2ZW50cyApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggZXZlbnQud2hpY2ggIT09IHVuZGVmaW5lZCAmJiBldmVudC53aGljaCAhPT0gMSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHggPSBldmVudC5jbGllbnRYO1xuICAgICAgICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WTtcblxuICAgICAgICAvLyBUaGlzIHdpbGwgYmUgbnVsbCBmb3IgbW91c2UgZXZlbnRzLlxuICAgICAgICBjb25zdCBwb2ludGVySWQgPSBldmVudC5wb2ludGVySWQ7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlTW91c2V1cCA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmICggZXZlbnQucG9pbnRlcklkICE9IHBvaW50ZXJJZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZmlyZSggZXZlbnQsIHgsIHkgKTtcbiAgICAgICAgICAgIGNhbmNlbCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZU1vdXNlbW92ZSA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmICggZXZlbnQucG9pbnRlcklkICE9IHBvaW50ZXJJZCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggKCBNYXRoLmFicyggZXZlbnQuY2xpZW50WCAtIHggKSA+PSBESVNUQU5DRV9USFJFU0hPTEQgKSB8fCAoIE1hdGguYWJzKCBldmVudC5jbGllbnRZIC0geSApID49IERJU1RBTkNFX1RIUkVTSE9MRCApICkge1xuICAgICAgICAgICAgICAgIGNhbmNlbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGNhbmNlbCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyVXAnLCBoYW5kbGVNb3VzZXVwLCBmYWxzZSApO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlck1vdmUnLCBoYW5kbGVNb3VzZW1vdmUsIGZhbHNlICk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyQ2FuY2VsJywgY2FuY2VsLCBmYWxzZSApO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdwb2ludGVydXAnLCBoYW5kbGVNb3VzZXVwLCBmYWxzZSApO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJtb3ZlJywgaGFuZGxlTW91c2Vtb3ZlLCBmYWxzZSApO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJjYW5jZWwnLCBjYW5jZWwsIGZhbHNlICk7XG4gICAgICAgICAgICB0aGlzLm5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgaGFuZGxlTW91c2V1cCwgZmFsc2UgKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCBoYW5kbGVNb3VzZW1vdmUsIGZhbHNlICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkICkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoICdwb2ludGVydXAnLCBoYW5kbGVNb3VzZXVwLCBmYWxzZSApO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJtb3ZlJywgaGFuZGxlTW91c2Vtb3ZlLCBmYWxzZSApO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJjYW5jZWwnLCBjYW5jZWwsIGZhbHNlICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCApIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyVXAnLCBoYW5kbGVNb3VzZXVwLCBmYWxzZSApO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlck1vdmUnLCBoYW5kbGVNb3VzZW1vdmUsIGZhbHNlICk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyQ2FuY2VsJywgY2FuY2VsLCBmYWxzZSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGhhbmRsZU1vdXNldXAsIGZhbHNlICk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgaGFuZGxlTW91c2Vtb3ZlLCBmYWxzZSApO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0VGltZW91dCggY2FuY2VsLCBUSU1FX1RIUkVTSE9MRCApO1xuICAgIH0sXG5cbiAgICB0b3VjaGRvd24gKCBldmVudCApIHtcbiAgICAgICAgY29uc3QgdG91Y2ggPSBldmVudC50b3VjaGVzWzBdO1xuXG4gICAgICAgIGNvbnN0IHggPSB0b3VjaC5jbGllbnRYO1xuICAgICAgICBjb25zdCB5ID0gdG91Y2guY2xpZW50WTtcblxuICAgICAgICBjb25zdCBmaW5nZXIgPSB0b3VjaC5pZGVudGlmaWVyO1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZVRvdWNodXAgPSBldmVudCA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG4gICAgICAgICAgICBpZiAoIHRvdWNoLmlkZW50aWZpZXIgIT09IGZpbmdlciApIHtcbiAgICAgICAgICAgICAgICBjYW5jZWwoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgY29tcGF0aWJpbGl0eSBtb3VzZSBldmVudFxuXG4gICAgICAgICAgICAvLyBmb3IgdGhlIGJlbmVmaXQgb2YgbW9iaWxlIEZpcmVmb3ggYW5kIG9sZCBBbmRyb2lkIGJyb3dzZXJzLCB3ZSBuZWVkIHRoaXMgYWJzdXJkIGhhY2suXG4gICAgICAgICAgICB0aGlzLnByZXZlbnRNb3VzZWRvd25FdmVudHMgPSB0cnVlO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KCB0aGlzLnByZXZlbnRNb3VzZWRvd25UaW1lb3V0ICk7XG5cbiAgICAgICAgICAgIHRoaXMucHJldmVudE1vdXNlZG93blRpbWVvdXQgPSBzZXRUaW1lb3V0KCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2ZW50TW91c2Vkb3duRXZlbnRzID0gZmFsc2U7XG4gICAgICAgICAgICB9LCA0MDAgKTtcblxuICAgICAgICAgICAgdGhpcy5maXJlKCBldmVudCwgeCwgeSApO1xuICAgICAgICAgICAgY2FuY2VsKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgaGFuZGxlVG91Y2htb3ZlID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgaWYgKCBldmVudC50b3VjaGVzLmxlbmd0aCAhPT0gMSB8fCBldmVudC50b3VjaGVzWzBdLmlkZW50aWZpZXIgIT09IGZpbmdlciApIHtcbiAgICAgICAgICAgICAgICBjYW5jZWwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdG91Y2ggPSBldmVudC50b3VjaGVzWzBdO1xuICAgICAgICAgICAgaWYgKCAoIE1hdGguYWJzKCB0b3VjaC5jbGllbnRYIC0geCApID49IERJU1RBTkNFX1RIUkVTSE9MRCApIHx8ICggTWF0aC5hYnMoIHRvdWNoLmNsaWVudFkgLSB5ICkgPj0gRElTVEFOQ0VfVEhSRVNIT0xEICkgKSB7XG4gICAgICAgICAgICAgICAgY2FuY2VsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaGVuZCcsIGhhbmRsZVRvdWNodXAsIGZhbHNlICk7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIGhhbmRsZVRvdWNobW92ZSwgZmFsc2UgKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2hjYW5jZWwnLCBjYW5jZWwsIGZhbHNlICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaGVuZCcsIGhhbmRsZVRvdWNodXAsIGZhbHNlICk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAndG91Y2htb3ZlJywgaGFuZGxlVG91Y2htb3ZlLCBmYWxzZSApO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoY2FuY2VsJywgY2FuY2VsLCBmYWxzZSApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoIGNhbmNlbCwgVElNRV9USFJFU0hPTEQgKTtcbiAgICB9LFxuXG4gICAgdGVhcmRvd24gKCkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlO1xuXG4gICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJkb3duJywgICBoYW5kbGVNb3VzZWRvd24sIGZhbHNlICk7XG4gICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlckRvd24nLCBoYW5kbGVNb3VzZWRvd24sIGZhbHNlICk7XG4gICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsICAgICBoYW5kbGVNb3VzZWRvd24sIGZhbHNlICk7XG4gICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCAgICBoYW5kbGVUb3VjaHN0YXJ0LCBmYWxzZSApO1xuICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdmb2N1cycsICAgICAgICAgaGFuZGxlRm9jdXMsIGZhbHNlICk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gaGFuZGxlTW91c2Vkb3duICggZXZlbnQgKSB7XG4gICAgdGhpcy5fX3RhcF9oYW5kbGVyX18ubW91c2Vkb3duKCBldmVudCApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVUb3VjaHN0YXJ0ICggZXZlbnQgKSB7XG4gICAgdGhpcy5fX3RhcF9oYW5kbGVyX18udG91Y2hkb3duKCBldmVudCApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVGb2N1cyAoKSB7XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIGhhbmRsZUtleWRvd24sIGZhbHNlICk7XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCAnYmx1cicsIGhhbmRsZUJsdXIsIGZhbHNlICk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUJsdXIgKCkge1xuICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBoYW5kbGVLZXlkb3duLCBmYWxzZSApO1xuICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2JsdXInLCBoYW5kbGVCbHVyLCBmYWxzZSApO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVLZXlkb3duICggZXZlbnQgKSB7XG4gICAgaWYgKCBldmVudC53aGljaCA9PT0gMzIgKSB7IC8vIHNwYWNlIGtleVxuICAgICAgICB0aGlzLl9fdGFwX2hhbmRsZXJfXy5maXJlKCk7XG4gICAgfVxufVxuIiwiY29uc3QgREVGQVVMVFMgPSB7XG4gICAgZGVsYXk6IDAsXG4gICAgZHVyYXRpb246IDMwMCxcbiAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3NzICggdCwgcGFyYW1zICkge1xuICAgIHZhciB0YXJnZXRWYWx1ZTtcblxuICAgIHBhcmFtcy5kZWxheSA9ICh0LmVsZW1lbnQucGFyZW50RnJhZ21lbnQuaW5kZXggKiAxMDApICsgMzAwO1xuICAgIHBhcmFtcyA9IHQucHJvY2Vzc1BhcmFtcyggcGFyYW1zLCBERUZBVUxUUyApO1xuXG4gICAgaWYgKHR5cGVvZiBwYXJhbXMucHJvcGVydHkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwYXJhbXMudmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmICggdC5pc0ludHJvICkge1xuICAgICAgICAgICAgdGFyZ2V0VmFsdWUgPSB0LmdldFN0eWxlKCBwYXJhbXMucHJvcGVydHkgKTtcbiAgICAgICAgICAgIHQuc2V0U3R5bGUoIHBhcmFtcy5wcm9wZXJ0eSwgcGFyYW1zLnZhbHVlICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXRWYWx1ZSA9IHBhcmFtcy52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHQuYW5pbWF0ZVN0eWxlKCBwYXJhbXMucHJvcGVydHksIHRhcmdldFZhbHVlLCBwYXJhbXMgKS50aGVuKCB0LmNvbXBsZXRlICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3coJ0NTUyB0cmFuc2l0aW9ucyBuZWVkIGEgcHJvcGVydHkgYW5kIHZhbHVlIHRvIHRyYW5zaXRpb24uJyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vaXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9BcnJheSAoIGFycmF5LCB2YWx1ZSApIHtcblx0dmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZiggdmFsdWUgKTtcblxuXHRpZiAoIGluZGV4ID09PSAtMSApIHtcblx0XHRhcnJheS5wdXNoKCB2YWx1ZSApO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbnRhaW5zICggYXJyYXksIHZhbHVlICkge1xuXHRmb3IgKCBsZXQgaSA9IDAsIGMgPSBhcnJheS5sZW5ndGg7IGkgPCBjOyBpKysgKSB7XG5cdFx0aWYgKCBhcnJheVtpXSA9PSB2YWx1ZSApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGVudHNNYXRjaCAoIGEsIGIgKSB7XG5cdHZhciBpO1xuXG5cdGlmICggIWlzQXJyYXkoIGEgKSB8fCAhaXNBcnJheSggYiApICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlmICggYS5sZW5ndGggIT09IGIubGVuZ3RoICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGkgPSBhLmxlbmd0aDtcblx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0aWYgKCBhW2ldICE9PSBiW2ldICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlQXJyYXkgKCB4ICkge1xuXHRpZiAoIHR5cGVvZiB4ID09PSAnc3RyaW5nJyApIHtcblx0XHRyZXR1cm4gWyB4IF07XG5cdH1cblxuXHRpZiAoIHggPT09IHVuZGVmaW5lZCApIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHRyZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhc3RJdGVtICggYXJyYXkgKSB7XG5cdHJldHVybiBhcnJheVsgYXJyYXkubGVuZ3RoIC0gMSBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbUFycmF5ICggYXJyYXksIG1lbWJlciApIHtcblx0aWYgKCAhYXJyYXkgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCBtZW1iZXIgKTtcblxuXHRpZiAoIGluZGV4ICE9PSAtMSApIHtcblx0XHRhcnJheS5zcGxpY2UoIGluZGV4LCAxICk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkgKCBhcnJheUxpa2UgKSB7XG5cdHZhciBhcnJheSA9IFtdLCBpID0gYXJyYXlMaWtlLmxlbmd0aDtcblx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0YXJyYXlbaV0gPSBhcnJheUxpa2VbaV07XG5cdH1cblxuXHRyZXR1cm4gYXJyYXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQnlLZXlWYWx1ZSggYXJyYXksIGtleSwgdmFsdWUgKSB7XG5cdHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4gb2JqW2tleV0gPT09IHZhbHVlO1xuXHR9KTtcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7ICRkb2N1bWVudCB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9PSAnJykge1xuICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggPT09ICcjcHJvamVjdHMnIHx8IHdpbmRvdy5sb2NhdGlvbi5oYXNoID09PSAnI2F3YXJkcycpIHtcbiAgICAgICAgICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcignc2Nyb2xsVG9MYXN0LlNjcm9sbFBhZ2UnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImNvbnN0ICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xuY29uc3QgJHdpbmRvdyA9ICQod2luZG93KTtcbmNvbnN0ICRodG1sID0gJChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuY29uc3QgJGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xuXG5leHBvcnQgeyAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSB9O1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IFN2ZyBmcm9tICcuLi9nbG9iYWwvU3ZnJztcbmltcG9ydCBQYWdlVHJhbnNpdGlvbnMgZnJvbSAnLi4vZ2xvYmFsL1BhZ2VUcmFuc2l0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXHRTdmcoKTtcblx0UGFnZVRyYW5zaXRpb25zKCk7XG59XG4iLCIvKipcbiAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9yYWN0aXZlanMvcmFjdGl2ZS9ibG9iL2Rldi9zcmMvdXRpbHMvaHRtbC5qc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlSHRtbChzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIEhUTUwgY29udGVudCB0aGF0IGNvbnRhaW5zIG11c3RhY2hlIGNoYXJhY3RlcnMgZm9yIHVzZSB3aXRoIFJhY3RpdmVcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJmx0Oy9nLCAnPCcpXG4gICAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csICc+JylcbiAgICAgICAgLnJlcGxhY2UoLyZhbXA7L2csICcmJyk7XG59XG5cbi8qKlxuICogR2V0IGVsZW1lbnQgZGF0YSBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0gICB7RE9NRWxlbWVudH0gIG5vZGVcbiAqIEByZXR1cm4gIHtBcnJheX0gICAgICAgZGF0YVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZURhdGEobm9kZSkge1xuICAgIC8vIEFsbCBhdHRyaWJ1dGVzXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgICAvLyBSZWdleCBQYXR0ZXJuXG4gICAgdmFyIHBhdHRlcm4gPSAvXmRhdGFcXC0oLispJC87XG5cbiAgICAvLyBPdXRwdXRcbiAgICB2YXIgZGF0YSA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIC8vIEF0dHJpYnV0ZXMgbmFtZSAoZXg6IGRhdGEtbW9kdWxlKVxuICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcblxuICAgICAgICAvLyBUaGlzIGhhcHBlbnMuXG4gICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0Y2ggPSBuYW1lLm1hdGNoKHBhdHRlcm4pO1xuICAgICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoaXMgdGhyb3dzIGFuIGVycm9yLCB5b3UgaGF2ZSBzb21lXG4gICAgICAgIC8vIHNlcmlvdXMgcHJvYmxlbXMgaW4geW91ciBIVE1MLlxuICAgICAgICBkYXRhW21hdGNoWzFdXSA9IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuIiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcblx0YXJyYXlMaWtlUGF0dGVybiA9IC9eXFxbb2JqZWN0ICg/OkFycmF5fEZpbGVMaXN0KVxcXSQvO1xuXG4vLyB0aGFua3MsIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL2luc3RhbmNlb2YtY29uc2lkZXJlZC1oYXJtZnVsLW9yLWhvdy10by13cml0ZS1hLXJvYnVzdC1pc2FycmF5L1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkgKCB0aGluZyApIHtcblx0cmV0dXJuIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZSAoIG9iaiApIHtcblx0cmV0dXJuIGFycmF5TGlrZVBhdHRlcm4udGVzdCggdG9TdHJpbmcuY2FsbCggb2JqICkgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXF1YWwgKCBhLCBiICkge1xuXHRpZiAoIGEgPT09IG51bGwgJiYgYiA9PT0gbnVsbCApIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGlmICggdHlwZW9mIGEgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBiID09PSAnb2JqZWN0JyApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4gYSA9PT0gYjtcbn1cblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODA4Mi92YWxpZGF0ZS1udW1iZXJzLWluLWphdmFzY3JpcHQtaXNudW1lcmljXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljICggdGhpbmcgKSB7XG5cdHJldHVybiAhaXNOYU4oIHBhcnNlRmxvYXQoIHRoaW5nICkgKSAmJiBpc0Zpbml0ZSggdGhpbmcgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0ICggdGhpbmcgKSB7XG5cdHJldHVybiAoIHRoaW5nICYmIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IE9iamVjdF0nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKCB0aGluZyApIHtcblx0dmFyIGdldFR5cGUgPSB7fTtcblx0cmV0dXJuIHRoaW5nICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbCh0aGluZykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pcyc7XG5pbXBvcnQgeyBhcnJheUNvbnRhaW5zLCBmaW5kQnlLZXlWYWx1ZSwgcmVtb3ZlRnJvbUFycmF5IH0gZnJvbSAnLi9hcnJheSc7XG5pbXBvcnQgeyAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuXG5jb25zdCBDQUxMQkFDS1MgPSB7XG5cdGhpZGRlbjogW10sXG5cdHZpc2libGU6IFtdXG59O1xuXG5jb25zdCBBQ1RJT05TID0gW1xuXHQnYWRkQ2FsbGJhY2snLFxuXHQncmVtb3ZlQ2FsbGJhY2snXG5dO1xuXG5jb25zdCBTVEFURVMgPSBbXG5cdCd2aXNpYmxlJyxcblx0J2hpZGRlbidcbl07XG5cbmNvbnN0IFBSRUZJWCA9ICd2LSc7XG5cbmxldCBVVUlEID0gMDtcblxuLy8gTWFpbiBldmVudFxuJGRvY3VtZW50Lm9uKCd2aXNpYmlsaXR5Y2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0aWYgKGRvY3VtZW50LmhpZGRlbikge1xuXHRcdG9uRG9jdW1lbnRDaGFuZ2UoJ2hpZGRlbicpO1xuXHR9IGVsc2Uge1xuXHRcdG9uRG9jdW1lbnRDaGFuZ2UoJ3Zpc2libGUnKTtcblx0fVxufSk7XG5cbi8qKlxuICogQWRkIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIHN0YXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7c3RyaW5nfSAgaWRlbnRcbiAqL1xuZnVuY3Rpb24gYWRkQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG5cdGxldCBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2sgfHwgJyc7XG5cblx0aWYgKCFpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuXHRcdGNvbnNvbGUud2FybignQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRsZXQgaWRlbnQgPSBQUkVGSVggKyBVVUlEKys7XG5cblx0Q0FMTEJBQ0tTW3N0YXRlXS5wdXNoKHtcblx0XHRpZGVudDogaWRlbnQsXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdH0pO1xuXG5cdHJldHVybiBpZGVudDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBjYWxsYmFja1xuICogQHBhcmFtICB7c3RyaW5nfSAgIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICogQHBhcmFtICB7c3RyaW5nfSAgIGlkZW50ICBVbmlxdWUgaWRlbnRpZmllclxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBJZiBvcGVyYXRpb24gd2FzIGEgc3VjY2Vzc1xuICovXG5mdW5jdGlvbiByZW1vdmVDYWxsYmFjayAoc3RhdGUsIG9wdGlvbnMpIHtcblx0bGV0IGlkZW50ID0gb3B0aW9ucy5pZGVudCB8fCAnJztcblxuXHRpZiAodHlwZW9mKGlkZW50KSA9PT0gJ3VuZGVmaW5lZCcgfHwgaWRlbnQgPT09ICcnKSB7XG5cdFx0Y29uc29sZS53YXJuKCdOZWVkIGlkZW50IHRvIHJlbW92ZSBjYWxsYmFjaycpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGxldCBpbmRleCA9IGZpbmRCeUtleVZhbHVlKENBTExCQUNLU1tzdGF0ZV0sICdpZGVudCcsIGlkZW50KVswXTtcblxuXHQvLyBjb25zb2xlLmxvZyhpZGVudClcblx0Ly8gY29uc29sZS5sb2coQ0FMTEJBQ0tTW3N0YXRlXSlcblxuXHRpZiAodHlwZW9mKGluZGV4KSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRyZW1vdmVGcm9tQXJyYXkoQ0FMTEJBQ0tTW3N0YXRlXSwgaW5kZXgpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnNvbGUud2FybignQ2FsbGJhY2sgY291bGQgbm90IGJlIGZvdW5kJyk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbi8qKlxuICogV2hlbiBkb2N1bWVudCBzdGF0ZSBjaGFuZ2VzLCB0cmlnZ2VyIGNhbGxiYWNrc1xuICogQHBhcmFtICB7c3RyaW5nfSAgc3RhdGUgIFZpc2libGUgb3IgaGlkZGVuXG4gKi9cbmZ1bmN0aW9uIG9uRG9jdW1lbnRDaGFuZ2UgKHN0YXRlKSB7XG5cdGxldCBjYWxsYmFja0FycmF5ID0gQ0FMTEJBQ0tTW3N0YXRlXTtcblx0bGV0IGkgPSAwO1xuXHRsZXQgbGVuID0gY2FsbGJhY2tBcnJheS5sZW5ndGg7XG5cblx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdGNhbGxiYWNrQXJyYXlbaV0uY2FsbGJhY2soKTtcblx0fVxufVxuXG4vKipcbiAqIFB1YmxpYyBmYWNpbmcgQVBJIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIGNhbGxiYWNrc1xuICogQHBhcmFtICAge29iamVjdH0gICAgICAgICAgIG9wdGlvbnMgIE9wdGlvbnNcbiAqIEByZXR1cm4gIHtib29sZWFufGludGVnZXJ9ICAgICAgICAgICBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNhbGxiYWNrIG9yIGJvb2xlYW4gaW5kaWNhdGluZyBzdWNjZXNzIG9yIGZhaWx1cmVcbiAqL1xuZnVuY3Rpb24gdmlzaWJpbGl0eUFwaSAob3B0aW9ucykge1xuXHRsZXQgYWN0aW9uID0gb3B0aW9ucy5hY3Rpb24gfHwgJyc7XG5cdGxldCBzdGF0ZSA9IG9wdGlvbnMuc3RhdGUgfHwgJyc7XG5cdGxldCByZXQ7XG5cblx0Ly8gVHlwZSBhbmQgdmFsdWUgY2hlY2tpbmdcblx0aWYgKCFhcnJheUNvbnRhaW5zKEFDVElPTlMsIGFjdGlvbikpIHtcblx0XHRjb25zb2xlLndhcm4oJ0FjdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpZiAoIWFycmF5Q29udGFpbnMoU1RBVEVTLCBzdGF0ZSkpIHtcblx0XHRjb25zb2xlLndhcm4oJ1N0YXRlIGRvZXMgbm90IGV4aXN0Jyk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gQHRvZG8gTWFnaWMgY2FsbCBmdW5jdGlvbiBwbHNcblx0aWYgKGFjdGlvbiA9PT0gJ2FkZENhbGxiYWNrJykge1xuXHRcdHJldCA9IGFkZENhbGxiYWNrKHN0YXRlLCBvcHRpb25zKTtcblx0fSBlbHNlIGlmIChhY3Rpb24gPT09ICdyZW1vdmVDYWxsYmFjaycpIHtcblx0XHRyZXQgPSByZW1vdmVDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG5cdH1cblxuXHRyZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgeyB2aXNpYmlsaXR5QXBpIH07XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfd29sZnk4N0V2ZW50ZW1pdHRlciA9IHJlcXVpcmUoJ3dvbGZ5ODctZXZlbnRlbWl0dGVyJyk7XG5cbnZhciBfd29sZnk4N0V2ZW50ZW1pdHRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF93b2xmeTg3RXZlbnRlbWl0dGVyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgUmVzaXplID0gZnVuY3Rpb24gKF9ldmVudEVtaXR0ZXIpIHtcbiAgX2luaGVyaXRzKFJlc2l6ZSwgX2V2ZW50RW1pdHRlcik7XG5cbiAgZnVuY3Rpb24gUmVzaXplKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSZXNpemUpO1xuXG4gICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgT2JqZWN0LmdldFByb3RvdHlwZU9mKFJlc2l6ZSkuY2FsbCh0aGlzKSk7XG5cbiAgICBfdGhpcy5vblJlc2l6ZUhhbmRsZSA9IF90aGlzLm9uUmVzaXplLmJpbmQoX3RoaXMpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIF90aGlzLm9uUmVzaXplSGFuZGxlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBfdGhpcy5vblJlc2l6ZUhhbmRsZSk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFJlc2l6ZSwgW3tcbiAgICBrZXk6ICdvblJlc2l6ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uUmVzaXplKCkge1xuICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy50aW1lcyA9IDA7XG5cbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoJ3Jlc2l6ZTpzdGFydCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5oYW5kbGUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnRpbWVzID0gMDtcblxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5oYW5kbGUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gdGljaygpIHtcbiAgICAgICAgaWYgKCsrdGhpcy50aW1lcyA9PT0gMTApIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZSA9IG51bGw7XG4gICAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy50aW1lcyA9IDA7XG5cbiAgICAgICAgICB0aGlzLmVtaXRFdmVudCgncmVzaXplOmVuZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaGFuZGxlID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2Rlc3Ryb3knLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemVIYW5kbGUpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgdGhpcy5vblJlc2l6ZUhhbmRsZSk7XG5cbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFJlc2l6ZTtcbn0oX3dvbGZ5ODdFdmVudGVtaXR0ZXIyLmRlZmF1bHQpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBSZXNpemU7XG4iLCIvKiFcbiAqIEV2ZW50RW1pdHRlciB2NC4yLjExIC0gZ2l0LmlvL2VlXG4gKiBVbmxpY2Vuc2UgLSBodHRwOi8vdW5saWNlbnNlLm9yZy9cbiAqIE9saXZlciBDYWxkd2VsbCAtIGh0dHA6Ly9vbGkubWUudWsvXG4gKiBAcHJlc2VydmVcbiAqL1xuXG47KGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKipcbiAgICAgKiBDbGFzcyBmb3IgbWFuYWdpbmcgZXZlbnRzLlxuICAgICAqIENhbiBiZSBleHRlbmRlZCB0byBwcm92aWRlIGV2ZW50IGZ1bmN0aW9uYWxpdHkgaW4gb3RoZXIgY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIEBjbGFzcyBFdmVudEVtaXR0ZXIgTWFuYWdlcyBldmVudCByZWdpc3RlcmluZyBhbmQgZW1pdHRpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge31cblxuICAgIC8vIFNob3J0Y3V0cyB0byBpbXByb3ZlIHNwZWVkIGFuZCBzaXplXG4gICAgdmFyIHByb3RvID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZTtcbiAgICB2YXIgZXhwb3J0cyA9IHRoaXM7XG4gICAgdmFyIG9yaWdpbmFsR2xvYmFsVmFsdWUgPSBleHBvcnRzLkV2ZW50RW1pdHRlcjtcblxuICAgIC8qKlxuICAgICAqIEZpbmRzIHRoZSBpbmRleCBvZiB0aGUgbGlzdGVuZXIgZm9yIHRoZSBldmVudCBpbiBpdHMgc3RvcmFnZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gbGlzdGVuZXJzIEFycmF5IG9mIGxpc3RlbmVycyB0byBzZWFyY2ggdGhyb3VnaC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gbG9vayBmb3IuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBJbmRleCBvZiB0aGUgc3BlY2lmaWVkIGxpc3RlbmVyLCAtMSBpZiBub3QgZm91bmRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgaSA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxpYXMgYSBtZXRob2Qgd2hpbGUga2VlcGluZyB0aGUgY29udGV4dCBjb3JyZWN0LCB0byBhbGxvdyBmb3Igb3ZlcndyaXRpbmcgb2YgdGFyZ2V0IG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSB0YXJnZXQgbWV0aG9kLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgYWxpYXNlZCBtZXRob2RcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGlhcyhuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBhbGlhc0Nsb3N1cmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tuYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxpc3RlbmVyIGFycmF5IGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFdpbGwgaW5pdGlhbGlzZSB0aGUgZXZlbnQgb2JqZWN0IGFuZCBsaXN0ZW5lciBhcnJheXMgaWYgcmVxdWlyZWQuXG4gICAgICogV2lsbCByZXR1cm4gYW4gb2JqZWN0IGlmIHlvdSB1c2UgYSByZWdleCBzZWFyY2guIFRoZSBvYmplY3QgY29udGFpbnMga2V5cyBmb3IgZWFjaCBtYXRjaGVkIGV2ZW50LiBTbyAvYmFbcnpdLyBtaWdodCByZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYmFyIGFuZCBiYXouIEJ1dCBvbmx5IGlmIHlvdSBoYXZlIGVpdGhlciBkZWZpbmVkIHRoZW0gd2l0aCBkZWZpbmVFdmVudCBvciBhZGRlZCBzb21lIGxpc3RlbmVycyB0byB0aGVtLlxuICAgICAqIEVhY2ggcHJvcGVydHkgaW4gdGhlIG9iamVjdCByZXNwb25zZSBpcyBhbiBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZXR1cm4gdGhlIGxpc3RlbmVycyBmcm9tLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uW118T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciB0aGUgZXZlbnQuXG4gICAgICovXG4gICAgcHJvdG8uZ2V0TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TGlzdGVuZXJzKGV2dCkge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG4gICAgICAgIHZhciByZXNwb25zZTtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICAvLyBSZXR1cm4gYSBjb25jYXRlbmF0ZWQgYXJyYXkgb2YgYWxsIG1hdGNoaW5nIGV2ZW50cyBpZlxuICAgICAgICAvLyB0aGUgc2VsZWN0b3IgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAgICAgIGlmIChldnQgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkgJiYgZXZ0LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVtrZXldID0gZXZlbnRzW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBldmVudHNbZXZ0XSB8fCAoZXZlbnRzW2V2dF0gPSBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRha2VzIGEgbGlzdCBvZiBsaXN0ZW5lciBvYmplY3RzIGFuZCBmbGF0dGVucyBpdCBpbnRvIGEgbGlzdCBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBsaXN0ZW5lcnMgUmF3IGxpc3RlbmVyIG9iamVjdHMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb25bXX0gSnVzdCB0aGUgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqL1xuICAgIHByb3RvLmZsYXR0ZW5MaXN0ZW5lcnMgPSBmdW5jdGlvbiBmbGF0dGVuTGlzdGVuZXJzKGxpc3RlbmVycykge1xuICAgICAgICB2YXIgZmxhdExpc3RlbmVycyA9IFtdO1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBmbGF0TGlzdGVuZXJzLnB1c2gobGlzdGVuZXJzW2ldLmxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmbGF0TGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSByZXF1ZXN0ZWQgbGlzdGVuZXJzIHZpYSBnZXRMaXN0ZW5lcnMgYnV0IHdpbGwgYWx3YXlzIHJldHVybiB0aGUgcmVzdWx0cyBpbnNpZGUgYW4gb2JqZWN0LiBUaGlzIGlzIG1haW5seSBmb3IgaW50ZXJuYWwgdXNlIGJ1dCBvdGhlcnMgbWF5IGZpbmQgaXQgdXNlZnVsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmV0dXJuIHRoZSBsaXN0ZW5lcnMgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFsbCBsaXN0ZW5lciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IGluIGFuIG9iamVjdC5cbiAgICAgKi9cbiAgICBwcm90by5nZXRMaXN0ZW5lcnNBc09iamVjdCA9IGZ1bmN0aW9uIGdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCkge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnMoZXZ0KTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lcnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgICAgIHJlc3BvbnNlW2V2dF0gPSBsaXN0ZW5lcnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2UgfHwgbGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIgZnVuY3Rpb24gdG8gdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBUaGUgbGlzdGVuZXIgd2lsbCBub3QgYmUgYWRkZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUuXG4gICAgICogSWYgdGhlIGxpc3RlbmVyIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBpdCBpcyBjYWxsZWQuXG4gICAgICogSWYgeW91IHBhc3MgYSByZWd1bGFyIGV4cHJlc3Npb24gYXMgdGhlIGV2ZW50IG5hbWUgdGhlbiB0aGUgbGlzdGVuZXIgd2lsbCBiZSBhZGRlZCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZW1pdHRlZC4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBjYWxsaW5nLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgbGlzdGVuZXJJc1dyYXBwZWQgPSB0eXBlb2YgbGlzdGVuZXIgPT09ICdvYmplY3QnO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnNba2V5XSwgbGlzdGVuZXIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldLnB1c2gobGlzdGVuZXJJc1dyYXBwZWQgPyBsaXN0ZW5lciA6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgICAgICBvbmNlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGFkZExpc3RlbmVyXG4gICAgICovXG4gICAgcHJvdG8ub24gPSBhbGlhcygnYWRkTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIFNlbWktYWxpYXMgb2YgYWRkTGlzdGVuZXIuIEl0IHdpbGwgYWRkIGEgbGlzdGVuZXIgdGhhdCB3aWxsIGJlXG4gICAgICogYXV0b21hdGljYWxseSByZW1vdmVkIGFmdGVyIGl0cyBmaXJzdCBleGVjdXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZW1pdHRlZC4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBjYWxsaW5nLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZE9uY2VMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZE9uY2VMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZExpc3RlbmVyKGV2dCwge1xuICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgb25jZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgYWRkT25jZUxpc3RlbmVyLlxuICAgICAqL1xuICAgIHByb3RvLm9uY2UgPSBhbGlhcygnYWRkT25jZUxpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGFuIGV2ZW50IG5hbWUuIFRoaXMgaXMgcmVxdWlyZWQgaWYgeW91IHdhbnQgdG8gdXNlIGEgcmVnZXggdG8gYWRkIGEgbGlzdGVuZXIgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIElmIHlvdSBkb24ndCBkbyB0aGlzIHRoZW4gaG93IGRvIHlvdSBleHBlY3QgaXQgdG8ga25vdyB3aGF0IGV2ZW50IHRvIGFkZCB0bz8gU2hvdWxkIGl0IGp1c3QgYWRkIHRvIGV2ZXJ5IHBvc3NpYmxlIG1hdGNoIGZvciBhIHJlZ2V4PyBOby4gVGhhdCBpcyBzY2FyeSBhbmQgYmFkLlxuICAgICAqIFlvdSBuZWVkIHRvIHRlbGwgaXQgd2hhdCBldmVudCBuYW1lcyBzaG91bGQgYmUgbWF0Y2hlZCBieSBhIHJlZ2V4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBjcmVhdGUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZGVmaW5lRXZlbnQgPSBmdW5jdGlvbiBkZWZpbmVFdmVudChldnQpIHtcbiAgICAgICAgdGhpcy5nZXRMaXN0ZW5lcnMoZXZ0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzZXMgZGVmaW5lRXZlbnQgdG8gZGVmaW5lIG11bHRpcGxlIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nW119IGV2dHMgQW4gYXJyYXkgb2YgZXZlbnQgbmFtZXMgdG8gZGVmaW5lLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmRlZmluZUV2ZW50cyA9IGZ1bmN0aW9uIGRlZmluZUV2ZW50cyhldnRzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZ0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kZWZpbmVFdmVudChldnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIGZyb20gdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBXaGVuIHBhc3NlZCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhcyB0aGUgZXZlbnQgbmFtZSwgaXQgd2lsbCByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byByZW1vdmUgZnJvbSB0aGUgZXZlbnQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyc1trZXldLCBsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIHJlbW92ZUxpc3RlbmVyXG4gICAgICovXG4gICAgcHJvdG8ub2ZmID0gYWxpYXMoJ3JlbW92ZUxpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGxpc3RlbmVycyBpbiBidWxrIHVzaW5nIHRoZSBtYW5pcHVsYXRlTGlzdGVuZXJzIG1ldGhvZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gYWRkIHRoZSBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqIFllYWgsIHRoaXMgZnVuY3Rpb24gZG9lcyBxdWl0ZSBhIGJpdC4gVGhhdCdzIHByb2JhYmx5IGEgYmFkIHRoaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byBhZGQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkTGlzdGVuZXJzID0gZnVuY3Rpb24gYWRkTGlzdGVuZXJzKGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIFBhc3MgdGhyb3VnaCB0byBtYW5pcHVsYXRlTGlzdGVuZXJzXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoZmFsc2UsIGV2dCwgbGlzdGVuZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBsaXN0ZW5lcnMgaW4gYnVsayB1c2luZyB0aGUgbWFuaXB1bGF0ZUxpc3RlbmVycyBtZXRob2QuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiByZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSByZW1vdmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXJzIGZyb20gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIHJlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcnMoZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgLy8gUGFzcyB0aHJvdWdoIHRvIG1hbmlwdWxhdGVMaXN0ZW5lcnNcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyh0cnVlLCBldnQsIGxpc3RlbmVycyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEVkaXRzIGxpc3RlbmVycyBpbiBidWxrLiBUaGUgYWRkTGlzdGVuZXJzIGFuZCByZW1vdmVMaXN0ZW5lcnMgbWV0aG9kcyBib3RoIHVzZSB0aGlzIHRvIGRvIHRoZWlyIGpvYi4gWW91IHNob3VsZCByZWFsbHkgdXNlIHRob3NlIGluc3RlYWQsIHRoaXMgaXMgYSBsaXR0bGUgbG93ZXIgbGV2ZWwuXG4gICAgICogVGhlIGZpcnN0IGFyZ3VtZW50IHdpbGwgZGV0ZXJtaW5lIGlmIHRoZSBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgKHRydWUpIG9yIGFkZGVkIChmYWxzZSkuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiBhZGQvcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQvcmVtb3ZlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYW5pcHVsYXRlIHRoZSBsaXN0ZW5lcnMgb2YgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSByZW1vdmUgVHJ1ZSBpZiB5b3Ugd2FudCB0byByZW1vdmUgbGlzdGVuZXJzLCBmYWxzZSBpZiB5b3Ugd2FudCB0byBhZGQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZC9yZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byBhZGQvcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLm1hbmlwdWxhdGVMaXN0ZW5lcnMgPSBmdW5jdGlvbiBtYW5pcHVsYXRlTGlzdGVuZXJzKHJlbW92ZSwgZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgdmFyIHNpbmdsZSA9IHJlbW92ZSA/IHRoaXMucmVtb3ZlTGlzdGVuZXIgOiB0aGlzLmFkZExpc3RlbmVyO1xuICAgICAgICB2YXIgbXVsdGlwbGUgPSByZW1vdmUgPyB0aGlzLnJlbW92ZUxpc3RlbmVycyA6IHRoaXMuYWRkTGlzdGVuZXJzO1xuXG4gICAgICAgIC8vIElmIGV2dCBpcyBhbiBvYmplY3QgdGhlbiBwYXNzIGVhY2ggb2YgaXRzIHByb3BlcnRpZXMgdG8gdGhpcyBtZXRob2RcbiAgICAgICAgaWYgKHR5cGVvZiBldnQgPT09ICdvYmplY3QnICYmICEoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICAgICAgZm9yIChpIGluIGV2dCkge1xuICAgICAgICAgICAgICAgIGlmIChldnQuaGFzT3duUHJvcGVydHkoaSkgJiYgKHZhbHVlID0gZXZ0W2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBzaW5nbGUgbGlzdGVuZXIgc3RyYWlnaHQgdGhyb3VnaCB0byB0aGUgc2luZ3VsYXIgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSBwYXNzIGJhY2sgdG8gdGhlIG11bHRpcGxlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNvIGV2dCBtdXN0IGJlIGEgc3RyaW5nXG4gICAgICAgICAgICAvLyBBbmQgbGlzdGVuZXJzIG11c3QgYmUgYW4gYXJyYXkgb2YgbGlzdGVuZXJzXG4gICAgICAgICAgICAvLyBMb29wIG92ZXIgaXQgYW5kIHBhc3MgZWFjaCBvbmUgdG8gdGhlIG11bHRpcGxlIG1ldGhvZFxuICAgICAgICAgICAgaSA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgc2luZ2xlLmNhbGwodGhpcywgZXZ0LCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycyBmcm9tIGEgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIElmIHlvdSBkbyBub3Qgc3BlY2lmeSBhbiBldmVudCB0aGVuIGFsbCBsaXN0ZW5lcnMgd2lsbCBiZSByZW1vdmVkLlxuICAgICAqIFRoYXQgbWVhbnMgZXZlcnkgZXZlbnQgd2lsbCBiZSBlbXB0aWVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGEgcmVnZXggdG8gcmVtb3ZlIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gW2V2dF0gT3B0aW9uYWwgbmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yLiBXaWxsIHJlbW92ZSBmcm9tIGV2ZXJ5IGV2ZW50IGlmIG5vdCBwYXNzZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbiByZW1vdmVFdmVudChldnQpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgZXZ0O1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGRpZmZlcmVudCB0aGluZ3MgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZiBldnRcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1tldnRdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBldmVudHMgbWF0Y2hpbmcgdGhlIHJlZ2V4LlxuICAgICAgICAgICAgZm9yIChrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGV2dC50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGluIGFsbCBldmVudHNcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgcmVtb3ZlRXZlbnQuXG4gICAgICpcbiAgICAgKiBBZGRlZCB0byBtaXJyb3IgdGhlIG5vZGUgQVBJLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUFsbExpc3RlbmVycyA9IGFsaWFzKCdyZW1vdmVFdmVudCcpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHMgYW4gZXZlbnQgb2YgeW91ciBjaG9pY2UuXG4gICAgICogV2hlbiBlbWl0dGVkLCBldmVyeSBsaXN0ZW5lciBhdHRhY2hlZCB0byB0aGF0IGV2ZW50IHdpbGwgYmUgZXhlY3V0ZWQuXG4gICAgICogSWYgeW91IHBhc3MgdGhlIG9wdGlvbmFsIGFyZ3VtZW50IGFycmF5IHRoZW4gdGhvc2UgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIHRvIGV2ZXJ5IGxpc3RlbmVyIHVwb24gZXhlY3V0aW9uLlxuICAgICAqIEJlY2F1c2UgaXQgdXNlcyBgYXBwbHlgLCB5b3VyIGFycmF5IG9mIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCBhcyBpZiB5b3Ugd3JvdGUgdGhlbSBvdXQgc2VwYXJhdGVseS5cbiAgICAgKiBTbyB0aGV5IHdpbGwgbm90IGFycml2ZSB3aXRoaW4gdGhlIGFycmF5IG9uIHRoZSBvdGhlciBzaWRlLCB0aGV5IHdpbGwgYmUgc2VwYXJhdGUuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gZW1pdCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW2FyZ3NdIE9wdGlvbmFsIGFycmF5IG9mIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gZWFjaCBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5lbWl0RXZlbnQgPSBmdW5jdGlvbiBlbWl0RXZlbnQoZXZ0LCBhcmdzKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnNNYXAgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBsaXN0ZW5lcnM7XG4gICAgICAgIHZhciBsaXN0ZW5lcjtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIHZhciByZXNwb25zZTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnNNYXApIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNNYXAuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVyc01hcFtrZXldLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgIGkgPSBsaXN0ZW5lcnMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgcmV0dXJucyB0cnVlIHRoZW4gaXQgc2hhbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZnVuY3Rpb24gaXMgZXhlY3V0ZWQgZWl0aGVyIHdpdGggYSBiYXNpYyBjYWxsIG9yIGFuIGFwcGx5IGlmIHRoZXJlIGlzIGFuIGFyZ3MgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9uY2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lci5saXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGxpc3RlbmVyLmxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3MgfHwgW10pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdGhpcy5fZ2V0T25jZVJldHVyblZhbHVlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lci5saXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgZW1pdEV2ZW50XG4gICAgICovXG4gICAgcHJvdG8udHJpZ2dlciA9IGFsaWFzKCdlbWl0RXZlbnQnKTtcblxuICAgIC8qKlxuICAgICAqIFN1YnRseSBkaWZmZXJlbnQgZnJvbSBlbWl0RXZlbnQgaW4gdGhhdCBpdCB3aWxsIHBhc3MgaXRzIGFyZ3VtZW50cyBvbiB0byB0aGUgbGlzdGVuZXJzLCBhcyBvcHBvc2VkIHRvIHRha2luZyBhIHNpbmdsZSBhcnJheSBvZiBhcmd1bWVudHMgdG8gcGFzcyBvbi5cbiAgICAgKiBBcyB3aXRoIGVtaXRFdmVudCwgeW91IGNhbiBwYXNzIGEgcmVnZXggaW4gcGxhY2Ugb2YgdGhlIGV2ZW50IG5hbWUgdG8gZW1pdCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG4gICAgICogQHBhcmFtIHsuLi4qfSBPcHRpb25hbCBhZGRpdGlvbmFsIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gZWFjaCBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5lbWl0ID0gZnVuY3Rpb24gZW1pdChldnQpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0RXZlbnQoZXZ0LCBhcmdzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBhZ2FpbnN0IHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy4gSWYgYVxuICAgICAqIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGUgb25lIHNldCBoZXJlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkXG4gICAgICogYWZ0ZXIgZXhlY3V0aW9uLiBUaGlzIHZhbHVlIGRlZmF1bHRzIHRvIHRydWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBuZXcgdmFsdWUgdG8gY2hlY2sgZm9yIHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5zZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBzZXRPbmNlUmV0dXJuVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb25jZVJldHVyblZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGFnYWluc3Qgd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLiBJZlxuICAgICAqIHRoZSBsaXN0ZW5lcnMgcmV0dXJuIHZhbHVlIG1hdGNoZXMgdGhpcyBvbmUgdGhlbiBpdCBzaG91bGQgYmUgcmVtb3ZlZFxuICAgICAqIGF1dG9tYXRpY2FsbHkuIEl0IHdpbGwgcmV0dXJuIHRydWUgYnkgZGVmYXVsdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4geyp8Qm9vbGVhbn0gVGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgZm9yIG9yIHRoZSBkZWZhdWx0LCB0cnVlLlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHByb3RvLl9nZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBfZ2V0T25jZVJldHVyblZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnX29uY2VSZXR1cm5WYWx1ZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25jZVJldHVyblZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgZXZlbnRzIG9iamVjdCBhbmQgY3JlYXRlcyBvbmUgaWYgcmVxdWlyZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBldmVudHMgc3RvcmFnZSBvYmplY3QuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgcHJvdG8uX2dldEV2ZW50cyA9IGZ1bmN0aW9uIF9nZXRFdmVudHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudHMgfHwgKHRoaXMuX2V2ZW50cyA9IHt9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV2ZXJ0cyB0aGUgZ2xvYmFsIHtAbGluayBFdmVudEVtaXR0ZXJ9IHRvIGl0cyBwcmV2aW91cyB2YWx1ZSBhbmQgcmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGlzIHZlcnNpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gTm9uIGNvbmZsaWN0aW5nIEV2ZW50RW1pdHRlciBjbGFzcy5cbiAgICAgKi9cbiAgICBFdmVudEVtaXR0ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gICAgICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gb3JpZ2luYWxHbG9iYWxWYWx1ZTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgICB9O1xuXG4gICAgLy8gRXhwb3NlIHRoZSBjbGFzcyBlaXRoZXIgdmlhIEFNRCwgQ29tbW9uSlMgb3IgdGhlIGdsb2JhbCBvYmplY3RcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpe1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuICAgIH1cbn0uY2FsbCh0aGlzKSk7XG4iXX0=
