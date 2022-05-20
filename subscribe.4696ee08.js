function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire61e5"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire61e5"] = parcelRequire;
}
parcelRequire.register("hSYfs", function(module, exports) {
/*!
  * Bootstrap event-handler.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory();
})(module.exports, function() {
    'use strict';
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const getjQuery = ()=>{
        const { jQuery: jQuery  } = window;
        if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) return jQuery;
        return null;
    };
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */ const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
    const stripNameRegex = /\..*/;
    const stripUidRegex = /::\d+$/;
    const eventRegistry = {}; // Events storage
    let uidEvent = 1;
    const customEvents = {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout'
    };
    const customEventsRegex = /^(mouseenter|mouseleave)/i;
    const nativeEvents = new Set([
        'click',
        'dblclick',
        'mouseup',
        'mousedown',
        'contextmenu',
        'mousewheel',
        'DOMMouseScroll',
        'mouseover',
        'mouseout',
        'mousemove',
        'selectstart',
        'selectend',
        'keydown',
        'keypress',
        'keyup',
        'orientationchange',
        'touchstart',
        'touchmove',
        'touchend',
        'touchcancel',
        'pointerdown',
        'pointermove',
        'pointerup',
        'pointerleave',
        'pointercancel',
        'gesturestart',
        'gesturechange',
        'gestureend',
        'focus',
        'blur',
        'change',
        'reset',
        'select',
        'submit',
        'focusin',
        'focusout',
        'load',
        'unload',
        'beforeunload',
        'resize',
        'move',
        'DOMContentLoaded',
        'readystatechange',
        'error',
        'abort',
        'scroll'
    ]);
    /**
   * ------------------------------------------------------------------------
   * Private methods
   * ------------------------------------------------------------------------
   */ function getUidEvent(element, uid) {
        return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
    }
    function getEvent(element) {
        const uid = getUidEvent(element);
        element.uidEvent = uid;
        eventRegistry[uid] = eventRegistry[uid] || {};
        return eventRegistry[uid];
    }
    function bootstrapHandler(element, fn) {
        return function handler(event) {
            event.delegateTarget = element;
            if (handler.oneOff) EventHandler.off(element, event.type, fn);
            return fn.apply(element, [
                event
            ]);
        };
    }
    function bootstrapDelegationHandler(element, selector, fn) {
        return function handler(event) {
            const domElements = element.querySelectorAll(selector);
            for(let { target: target  } = event; target && target !== this; target = target.parentNode){
                for(let i = domElements.length; i--;)if (domElements[i] === target) {
                    event.delegateTarget = target;
                    if (handler.oneOff) EventHandler.off(element, event.type, selector, fn);
                    return fn.apply(target, [
                        event
                    ]);
                }
            } // To please ESLint
            return null;
        };
    }
    function findHandler(events, handler, delegationSelector = null) {
        const uidEventList = Object.keys(events);
        for(let i = 0, len = uidEventList.length; i < len; i++){
            const event = events[uidEventList[i]];
            if (event.originalHandler === handler && event.delegationSelector === delegationSelector) return event;
        }
        return null;
    }
    function normalizeParams(originalTypeEvent, handler, delegationFn) {
        const delegation = typeof handler === 'string';
        const originalHandler = delegation ? delegationFn : handler;
        let typeEvent = getTypeEvent(originalTypeEvent);
        const isNative = nativeEvents.has(typeEvent);
        if (!isNative) typeEvent = originalTypeEvent;
        return [
            delegation,
            originalHandler,
            typeEvent
        ];
    }
    function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
        if (typeof originalTypeEvent !== 'string' || !element) return;
        if (!handler) {
            handler = delegationFn;
            delegationFn = null;
        } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
        // this prevents the handler from being dispatched the same way as mouseover or mouseout does
        if (customEventsRegex.test(originalTypeEvent)) {
            const wrapFn = (fn)=>{
                return function(event) {
                    if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) return fn.call(this, event);
                };
            };
            if (delegationFn) delegationFn = wrapFn(delegationFn);
            else handler = wrapFn(handler);
        }
        const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
        const events = getEvent(element);
        const handlers = events[typeEvent] || (events[typeEvent] = {});
        const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);
        if (previousFn) {
            previousFn.oneOff = previousFn.oneOff && oneOff;
            return;
        }
        const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
        const fn1 = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
        fn1.delegationSelector = delegation ? handler : null;
        fn1.originalHandler = originalHandler;
        fn1.oneOff = oneOff;
        fn1.uidEvent = uid;
        handlers[uid] = fn1;
        element.addEventListener(typeEvent, fn1, delegation);
    }
    function removeHandler(element, events, typeEvent, handler, delegationSelector) {
        const fn = findHandler(events[typeEvent], handler, delegationSelector);
        if (!fn) return;
        element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
        delete events[typeEvent][fn.uidEvent];
    }
    function removeNamespacedHandlers(element, events, typeEvent, namespace) {
        const storeElementEvent = events[typeEvent] || {};
        Object.keys(storeElementEvent).forEach((handlerKey)=>{
            if (handlerKey.includes(namespace)) {
                const event = storeElementEvent[handlerKey];
                removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
            }
        });
    }
    function getTypeEvent(event) {
        // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
        event = event.replace(stripNameRegex, '');
        return customEvents[event] || event;
    }
    const EventHandler = {
        on (element, event, handler, delegationFn) {
            addHandler(element, event, handler, delegationFn, false);
        },
        one (element, event, handler, delegationFn) {
            addHandler(element, event, handler, delegationFn, true);
        },
        off (element, originalTypeEvent, handler, delegationFn) {
            if (typeof originalTypeEvent !== 'string' || !element) return;
            const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
            const inNamespace = typeEvent !== originalTypeEvent;
            const events = getEvent(element);
            const isNamespace = originalTypeEvent.startsWith('.');
            if (typeof originalHandler !== 'undefined') {
                // Simplest case: handler is passed, remove that listener ONLY.
                if (!events || !events[typeEvent]) return;
                removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
                return;
            }
            if (isNamespace) Object.keys(events).forEach((elementEvent)=>{
                removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
            });
            const storeElementEvent = events[typeEvent] || {};
            Object.keys(storeElementEvent).forEach((keyHandlers)=>{
                const handlerKey = keyHandlers.replace(stripUidRegex, '');
                if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
                    const event = storeElementEvent[keyHandlers];
                    removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
                }
            });
        },
        trigger (element, event, args) {
            if (typeof event !== 'string' || !element) return null;
            const $ = getjQuery();
            const typeEvent = getTypeEvent(event);
            const inNamespace = event !== typeEvent;
            const isNative = nativeEvents.has(typeEvent);
            let jQueryEvent;
            let bubbles = true;
            let nativeDispatch = true;
            let defaultPrevented = false;
            let evt = null;
            if (inNamespace && $) {
                jQueryEvent = $.Event(event, args);
                $(element).trigger(jQueryEvent);
                bubbles = !jQueryEvent.isPropagationStopped();
                nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
                defaultPrevented = jQueryEvent.isDefaultPrevented();
            }
            if (isNative) {
                evt = document.createEvent('HTMLEvents');
                evt.initEvent(typeEvent, bubbles, true);
            } else evt = new CustomEvent(event, {
                bubbles: bubbles,
                cancelable: true
            });
             // merge custom information in our event
            if (typeof args !== 'undefined') Object.keys(args).forEach((key)=>{
                Object.defineProperty(evt, key, {
                    get () {
                        return args[key];
                    }
                });
            });
            if (defaultPrevented) evt.preventDefault();
            if (nativeDispatch) element.dispatchEvent(evt);
            if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') jQueryEvent.preventDefault();
            return evt;
        }
    };
    return EventHandler;
});

});

parcelRequire.register("1j4M2", function(module, exports) {
/*!
  * Bootstrap manipulator.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory();
})(module.exports, function() {
    'use strict';
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ function normalizeData(val) {
        if (val === 'true') return true;
        if (val === 'false') return false;
        if (val === Number(val).toString()) return Number(val);
        if (val === '' || val === 'null') return null;
        return val;
    }
    function normalizeDataKey(key) {
        return key.replace(/[A-Z]/g, (chr)=>`-${chr.toLowerCase()}`
        );
    }
    const Manipulator = {
        setDataAttribute (element, key, value) {
            element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
        },
        removeDataAttribute (element, key) {
            element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
        },
        getDataAttributes (element) {
            if (!element) return {};
            const attributes = {};
            Object.keys(element.dataset).filter((key)=>key.startsWith('bs')
            ).forEach((key)=>{
                let pureKey = key.replace(/^bs/, '');
                pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
                attributes[pureKey] = normalizeData(element.dataset[key]);
            });
            return attributes;
        },
        getDataAttribute (element, key) {
            return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
        },
        offset (element) {
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.pageYOffset,
                left: rect.left + window.pageXOffset
            };
        },
        position (element) {
            return {
                top: element.offsetTop,
                left: element.offsetLeft
            };
        }
    };
    return Manipulator;
});

});

parcelRequire.register("1x0pq", function(module, exports) {
/*!
  * Bootstrap selector-engine.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory();
})(module.exports, function() {
    'use strict';
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const isElement = (obj)=>{
        if (!obj || typeof obj !== 'object') return false;
        if (typeof obj.jquery !== 'undefined') obj = obj[0];
        return typeof obj.nodeType !== 'undefined';
    };
    const isVisible = (element)=>{
        if (!isElement(element) || element.getClientRects().length === 0) return false;
        return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    };
    const isDisabled = (element)=>{
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
        if (element.classList.contains('disabled')) return true;
        if (typeof element.disabled !== 'undefined') return element.disabled;
        return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
    };
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const NODE_TEXT = 3;
    const SelectorEngine = {
        find (selector, element = document.documentElement) {
            return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
        },
        findOne (selector, element = document.documentElement) {
            return Element.prototype.querySelector.call(element, selector);
        },
        children (element, selector) {
            return [].concat(...element.children).filter((child)=>child.matches(selector)
            );
        },
        parents (element, selector) {
            const parents = [];
            let ancestor = element.parentNode;
            while(ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT){
                if (ancestor.matches(selector)) parents.push(ancestor);
                ancestor = ancestor.parentNode;
            }
            return parents;
        },
        prev (element, selector) {
            let previous = element.previousElementSibling;
            while(previous){
                if (previous.matches(selector)) return [
                    previous
                ];
                previous = previous.previousElementSibling;
            }
            return [];
        },
        next (element, selector) {
            let next = element.nextElementSibling;
            while(next){
                if (next.matches(selector)) return [
                    next
                ];
                next = next.nextElementSibling;
            }
            return [];
        },
        focusableChildren (element) {
            const focusables = [
                'a',
                'button',
                'input',
                'textarea',
                'select',
                'details',
                '[tabindex]',
                '[contenteditable="true"]'
            ].map((selector)=>`${selector}:not([tabindex^="-"])`
            ).join(', ');
            return this.find(focusables, element).filter((el)=>!isDisabled(el) && isVisible(el)
            );
        }
    };
    return SelectorEngine;
});

});

parcelRequire.register("f323N", function(module, exports) {


/*!
  * Bootstrap base-component.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory((parcelRequire("l6JP8")), (parcelRequire("hSYfs")));
})(module.exports, function(Data, EventHandler) {
    'use strict';
    const _interopDefaultLegacy = (e)=>e && typeof e === 'object' && 'default' in e ? e : {
            default: e
        }
    ;
    const Data__default = /*#__PURE__*/ _interopDefaultLegacy(Data);
    const EventHandler__default = /*#__PURE__*/ _interopDefaultLegacy(EventHandler);
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const MILLISECONDS_MULTIPLIER = 1000;
    const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)
    const getTransitionDurationFromElement = (element)=>{
        if (!element) return 0;
         // Get transition-duration of the element
        let { transitionDuration: transitionDuration , transitionDelay: transitionDelay  } = window.getComputedStyle(element);
        const floatTransitionDuration = Number.parseFloat(transitionDuration);
        const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found
        if (!floatTransitionDuration && !floatTransitionDelay) return 0;
         // If multiple durations are defined, take the first
        transitionDuration = transitionDuration.split(',')[0];
        transitionDelay = transitionDelay.split(',')[0];
        return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    };
    const triggerTransitionEnd = (element)=>{
        element.dispatchEvent(new Event(TRANSITION_END));
    };
    const isElement = (obj)=>{
        if (!obj || typeof obj !== 'object') return false;
        if (typeof obj.jquery !== 'undefined') obj = obj[0];
        return typeof obj.nodeType !== 'undefined';
    };
    const getElement = (obj)=>{
        if (isElement(obj)) // it's a jQuery object or a node element
        return obj.jquery ? obj[0] : obj;
        if (typeof obj === 'string' && obj.length > 0) return document.querySelector(obj);
        return null;
    };
    const execute = (callback)=>{
        if (typeof callback === 'function') callback();
    };
    const executeAfterTransition = (callback, transitionElement, waitForTransition = true)=>{
        if (!waitForTransition) {
            execute(callback);
            return;
        }
        const durationPadding = 5;
        const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
        let called = false;
        const handler = ({ target: target  })=>{
            if (target !== transitionElement) return;
            called = true;
            transitionElement.removeEventListener(TRANSITION_END, handler);
            execute(callback);
        };
        transitionElement.addEventListener(TRANSITION_END, handler);
        setTimeout(()=>{
            if (!called) triggerTransitionEnd(transitionElement);
        }, emulatedDuration);
    };
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */ const VERSION = '5.1.3';
    class BaseComponent {
        dispose() {
            Data__default.default.remove(this._element, this.constructor.DATA_KEY);
            EventHandler__default.default.off(this._element, this.constructor.EVENT_KEY);
            Object.getOwnPropertyNames(this).forEach((propertyName)=>{
                this[propertyName] = null;
            });
        }
        _queueCallback(callback, element, isAnimated = true) {
            executeAfterTransition(callback, element, isAnimated);
        }
        /** Static */ static getInstance(element) {
            return Data__default.default.get(getElement(element), this.DATA_KEY);
        }
        static getOrCreateInstance(element, config = {}) {
            return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
        }
        static get VERSION() {
            return VERSION;
        }
        static get NAME() {
            throw new Error('You have to implement the static method "NAME", for each component!');
        }
        static get DATA_KEY() {
            return `bs.${this.NAME}`;
        }
        static get EVENT_KEY() {
            return `.${this.DATA_KEY}`;
        }
        constructor(element){
            element = getElement(element);
            if (!element) return;
            this._element = element;
            Data__default.default.set(this._element, this.constructor.DATA_KEY, this);
        }
    }
    return BaseComponent;
});

});
parcelRequire.register("l6JP8", function(module, exports) {
/*!
  * Bootstrap data.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    module.exports = factory();
})(module.exports, function() {
    'use strict';
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */ const elementMap = new Map();
    const data = {
        set (element, key, instance) {
            if (!elementMap.has(element)) elementMap.set(element, new Map());
            const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
            // can be removed later when multiple key/instances are fine to be used
            if (!instanceMap.has(key) && instanceMap.size !== 0) {
                // eslint-disable-next-line no-console
                console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
                return;
            }
            instanceMap.set(key, instance);
        },
        get (element, key) {
            if (elementMap.has(element)) return elementMap.get(element).get(key) || null;
            return null;
        },
        remove (element, key) {
            if (!elementMap.has(element)) return;
            const instanceMap = elementMap.get(element);
            instanceMap.delete(key); // free up element references if there are no instances left for an element
            if (instanceMap.size === 0) elementMap.delete(element);
        }
    };
    return data;
});

});


parcelRequire.register("jbNaB", function(module, exports) {

$parcel$export(module.exports, "popperGenerator", function () { return (parcelRequire("fR7p4")).popperGenerator; });
$parcel$export(module.exports, "detectOverflow", function () { return (parcelRequire("ev9kE")).default; });
$parcel$export(module.exports, "createPopperBase", function () { return (parcelRequire("fR7p4")).createPopper; });
$parcel$export(module.exports, "createPopper", function () { return (parcelRequire("dX9X6")).createPopper; });
$parcel$export(module.exports, "createPopperLite", function () { return (parcelRequire("tqOX8")).createPopper; });

var $88cGx = parcelRequire("88cGx");

var $biDui = parcelRequire("biDui");

var $fR7p4 = parcelRequire("fR7p4");
var $ev9kE = parcelRequire("ev9kE");

var $dX9X6 = parcelRequire("dX9X6");

var $tqOX8 = parcelRequire("tqOX8");
$parcel$exportWildcard(module.exports, $88cGx);
$parcel$exportWildcard(module.exports, $biDui);

});
parcelRequire.register("88cGx", function(module, exports) {

$parcel$export(module.exports, "top", function () { return $5eb8e918b7b37d4d$export$1e95b668f3b82d; });
$parcel$export(module.exports, "bottom", function () { return $5eb8e918b7b37d4d$export$40e543e69a8b3fbb; });
$parcel$export(module.exports, "right", function () { return $5eb8e918b7b37d4d$export$79ffe56a765070d2; });
$parcel$export(module.exports, "left", function () { return $5eb8e918b7b37d4d$export$eabcd2c8791e7bf4; });
$parcel$export(module.exports, "auto", function () { return $5eb8e918b7b37d4d$export$dfb5619354ba860; });
$parcel$export(module.exports, "basePlacements", function () { return $5eb8e918b7b37d4d$export$aec2ce47c367b8c3; });
$parcel$export(module.exports, "start", function () { return $5eb8e918b7b37d4d$export$b3571188c770cc5a; });
$parcel$export(module.exports, "end", function () { return $5eb8e918b7b37d4d$export$bd5df0f255a350f8; });
$parcel$export(module.exports, "clippingParents", function () { return $5eb8e918b7b37d4d$export$390fd549c5303b4d; });
$parcel$export(module.exports, "viewport", function () { return $5eb8e918b7b37d4d$export$d7b7311ec04a3e8f; });
$parcel$export(module.exports, "popper", function () { return $5eb8e918b7b37d4d$export$ae5ab1c730825774; });
$parcel$export(module.exports, "reference", function () { return $5eb8e918b7b37d4d$export$ca50aac9f3ba507f; });
$parcel$export(module.exports, "variationPlacements", function () { return $5eb8e918b7b37d4d$export$368f9a87e87fa4e1; });
$parcel$export(module.exports, "placements", function () { return $5eb8e918b7b37d4d$export$803cd8101b6c182b; });
$parcel$export(module.exports, "beforeRead", function () { return $5eb8e918b7b37d4d$export$421679a7c3d56e; });
$parcel$export(module.exports, "read", function () { return $5eb8e918b7b37d4d$export$aafa59e2e03f2942; });
$parcel$export(module.exports, "afterRead", function () { return $5eb8e918b7b37d4d$export$6964f6c886723980; });
$parcel$export(module.exports, "beforeMain", function () { return $5eb8e918b7b37d4d$export$c65e99957a05207c; });
$parcel$export(module.exports, "main", function () { return $5eb8e918b7b37d4d$export$f22da7240b7add18; });
$parcel$export(module.exports, "afterMain", function () { return $5eb8e918b7b37d4d$export$bab79516f2d662fe; });
$parcel$export(module.exports, "beforeWrite", function () { return $5eb8e918b7b37d4d$export$8d4d2d70e7d46032; });
$parcel$export(module.exports, "write", function () { return $5eb8e918b7b37d4d$export$68d8715fc104d294; });
$parcel$export(module.exports, "afterWrite", function () { return $5eb8e918b7b37d4d$export$70a6e5159acce2e6; });
$parcel$export(module.exports, "modifierPhases", function () { return $5eb8e918b7b37d4d$export$d087d3878fdf71d5; });
var $5eb8e918b7b37d4d$export$1e95b668f3b82d = 'top';
var $5eb8e918b7b37d4d$export$40e543e69a8b3fbb = 'bottom';
var $5eb8e918b7b37d4d$export$79ffe56a765070d2 = 'right';
var $5eb8e918b7b37d4d$export$eabcd2c8791e7bf4 = 'left';
var $5eb8e918b7b37d4d$export$dfb5619354ba860 = 'auto';
var $5eb8e918b7b37d4d$export$aec2ce47c367b8c3 = [
    $5eb8e918b7b37d4d$export$1e95b668f3b82d,
    $5eb8e918b7b37d4d$export$40e543e69a8b3fbb,
    $5eb8e918b7b37d4d$export$79ffe56a765070d2,
    $5eb8e918b7b37d4d$export$eabcd2c8791e7bf4
];
var $5eb8e918b7b37d4d$export$b3571188c770cc5a = 'start';
var $5eb8e918b7b37d4d$export$bd5df0f255a350f8 = 'end';
var $5eb8e918b7b37d4d$export$390fd549c5303b4d = 'clippingParents';
var $5eb8e918b7b37d4d$export$d7b7311ec04a3e8f = 'viewport';
var $5eb8e918b7b37d4d$export$ae5ab1c730825774 = 'popper';
var $5eb8e918b7b37d4d$export$ca50aac9f3ba507f = 'reference';
var $5eb8e918b7b37d4d$export$368f9a87e87fa4e1 = /*#__PURE__*/ $5eb8e918b7b37d4d$export$aec2ce47c367b8c3.reduce(function(acc, placement) {
    return acc.concat([
        placement + "-" + $5eb8e918b7b37d4d$export$b3571188c770cc5a,
        placement + "-" + $5eb8e918b7b37d4d$export$bd5df0f255a350f8
    ]);
}, []);
var $5eb8e918b7b37d4d$export$803cd8101b6c182b = /*#__PURE__*/ [].concat($5eb8e918b7b37d4d$export$aec2ce47c367b8c3, [
    $5eb8e918b7b37d4d$export$dfb5619354ba860
]).reduce(function(acc, placement) {
    return acc.concat([
        placement,
        placement + "-" + $5eb8e918b7b37d4d$export$b3571188c770cc5a,
        placement + "-" + $5eb8e918b7b37d4d$export$bd5df0f255a350f8
    ]);
}, []); // modifiers that need to read the DOM
var $5eb8e918b7b37d4d$export$421679a7c3d56e = 'beforeRead';
var $5eb8e918b7b37d4d$export$aafa59e2e03f2942 = 'read';
var $5eb8e918b7b37d4d$export$6964f6c886723980 = 'afterRead'; // pure-logic modifiers
var $5eb8e918b7b37d4d$export$c65e99957a05207c = 'beforeMain';
var $5eb8e918b7b37d4d$export$f22da7240b7add18 = 'main';
var $5eb8e918b7b37d4d$export$bab79516f2d662fe = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)
var $5eb8e918b7b37d4d$export$8d4d2d70e7d46032 = 'beforeWrite';
var $5eb8e918b7b37d4d$export$68d8715fc104d294 = 'write';
var $5eb8e918b7b37d4d$export$70a6e5159acce2e6 = 'afterWrite';
var $5eb8e918b7b37d4d$export$d087d3878fdf71d5 = [
    $5eb8e918b7b37d4d$export$421679a7c3d56e,
    $5eb8e918b7b37d4d$export$aafa59e2e03f2942,
    $5eb8e918b7b37d4d$export$6964f6c886723980,
    $5eb8e918b7b37d4d$export$c65e99957a05207c,
    $5eb8e918b7b37d4d$export$f22da7240b7add18,
    $5eb8e918b7b37d4d$export$bab79516f2d662fe,
    $5eb8e918b7b37d4d$export$8d4d2d70e7d46032,
    $5eb8e918b7b37d4d$export$68d8715fc104d294,
    $5eb8e918b7b37d4d$export$70a6e5159acce2e6
];

});

parcelRequire.register("biDui", function(module, exports) {

$parcel$export(module.exports, "applyStyles", function () { return (parcelRequire("i75eg")).default; });
$parcel$export(module.exports, "arrow", function () { return (parcelRequire("38EpB")).default; });
$parcel$export(module.exports, "computeStyles", function () { return (parcelRequire("1PfVV")).default; });
$parcel$export(module.exports, "eventListeners", function () { return (parcelRequire("gELNi")).default; });
$parcel$export(module.exports, "flip", function () { return (parcelRequire("bFPrx")).default; });
$parcel$export(module.exports, "hide", function () { return (parcelRequire("dtIGY")).default; });
$parcel$export(module.exports, "offset", function () { return (parcelRequire("djaL7")).default; });
$parcel$export(module.exports, "popperOffsets", function () { return (parcelRequire("lb5MU")).default; });
$parcel$export(module.exports, "preventOverflow", function () { return (parcelRequire("fXR4l")).default; });

var $i75eg = parcelRequire("i75eg");

var $38EpB = parcelRequire("38EpB");

var $1PfVV = parcelRequire("1PfVV");

var $gELNi = parcelRequire("gELNi");

var $bFPrx = parcelRequire("bFPrx");

var $dtIGY = parcelRequire("dtIGY");

var $djaL7 = parcelRequire("djaL7");

var $lb5MU = parcelRequire("lb5MU");

var $fXR4l = parcelRequire("fXR4l");

});
parcelRequire.register("i75eg", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $d2fcefd2d262a544$export$2e2bcd8739ae039; });

var $jdMql = parcelRequire("jdMql");

var $euW85 = parcelRequire("euW85");
// and applies them to the HTMLElements such as popper and arrow
function $d2fcefd2d262a544$var$applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function(name1) {
        var style = state.styles[name1] || {};
        var attributes = state.attributes[name1] || {};
        var element = state.elements[name1]; // arrow is optional + virtual elements
        if (!$euW85.isHTMLElement(element) || !$jdMql.default(element)) return;
         // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]
        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function(name) {
            var value = attributes[name];
            if (value === false) element.removeAttribute(name);
            else element.setAttribute(name, value === true ? '' : value);
        });
    });
}
function $d2fcefd2d262a544$var$effect(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
        popper: {
            position: state.options.strategy,
            left: '0',
            top: '0',
            margin: '0'
        },
        arrow: {
            position: 'absolute'
        },
        reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;
    if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
    return function() {
        Object.keys(state.elements).forEach(function(name) {
            var element = state.elements[name];
            var attributes = state.attributes[name] || {};
            var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them
            var style1 = styleProperties.reduce(function(style, property) {
                style[property] = '';
                return style;
            }, {}); // arrow is optional + virtual elements
            if (!$euW85.isHTMLElement(element) || !$jdMql.default(element)) return;
            Object.assign(element.style, style1);
            Object.keys(attributes).forEach(function(attribute) {
                element.removeAttribute(attribute);
            });
        });
    };
} // eslint-disable-next-line import/no-unused-modules
var $d2fcefd2d262a544$export$2e2bcd8739ae039 = {
    name: 'applyStyles',
    enabled: true,
    phase: 'write',
    fn: $d2fcefd2d262a544$var$applyStyles,
    effect: $d2fcefd2d262a544$var$effect,
    requires: [
        'computeStyles'
    ]
};

});
parcelRequire.register("jdMql", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $dfe4cb33ec770388$export$2e2bcd8739ae039; });
function $dfe4cb33ec770388$export$2e2bcd8739ae039(element) {
    return element ? (element.nodeName || '').toLowerCase() : null;
}

});

parcelRequire.register("euW85", function(module, exports) {

$parcel$export(module.exports, "isElement", function () { return $a8e0f553fa7dccae$export$45a5e7f76e0caa8d; });
$parcel$export(module.exports, "isHTMLElement", function () { return $a8e0f553fa7dccae$export$1b3bfaa9684536aa; });
$parcel$export(module.exports, "isShadowRoot", function () { return $a8e0f553fa7dccae$export$af51f0f06c0f328a; });

var $f4wJW = parcelRequire("f4wJW");
function $a8e0f553fa7dccae$export$45a5e7f76e0caa8d(node) {
    var OwnElement = $f4wJW.default(node).Element;
    return node instanceof OwnElement || node instanceof Element;
}
function $a8e0f553fa7dccae$export$1b3bfaa9684536aa(node) {
    var OwnElement = $f4wJW.default(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
}
function $a8e0f553fa7dccae$export$af51f0f06c0f328a(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') return false;
    var OwnElement = $f4wJW.default(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
}

});
parcelRequire.register("f4wJW", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $af90a03598d34a4f$export$2e2bcd8739ae039; });
function $af90a03598d34a4f$export$2e2bcd8739ae039(node) {
    if (node == null) return window;
    if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
    }
    return node;
}

});



parcelRequire.register("38EpB", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $24917766341f5a7f$export$2e2bcd8739ae039; });

var $cu2wT = parcelRequire("cu2wT");

var $aDPrU = parcelRequire("aDPrU");

var $k5er6 = parcelRequire("k5er6");

var $ghmPE = parcelRequire("ghmPE");

var $7TyMF = parcelRequire("7TyMF");

var $7oIqj = parcelRequire("7oIqj");

var $32Gl7 = parcelRequire("32Gl7");

var $8uMLG = parcelRequire("8uMLG");

var $88cGx = parcelRequire("88cGx");

var $24917766341f5a7f$var$toPaddingObject = function toPaddingObject(padding, state) {
    padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
    })) : padding;
    return $32Gl7.default(typeof padding !== 'number' ? padding : $8uMLG.default(padding, $88cGx.basePlacements));
};
function $24917766341f5a7f$var$arrow(_ref) {
    var _state$modifiersData$;
    var state = _ref.state, name = _ref.name, options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = $cu2wT.default(state.placement);
    var axis = $7TyMF.default(basePlacement);
    var isVertical = [
        $88cGx.left,
        $88cGx.right
    ].indexOf(basePlacement) >= 0;
    var len = isVertical ? 'height' : 'width';
    if (!arrowElement || !popperOffsets) return;
    var paddingObject = $24917766341f5a7f$var$toPaddingObject(options.padding, state);
    var arrowRect = $aDPrU.default(arrowElement);
    var minProp = axis === 'y' ? $88cGx.top : $88cGx.left;
    var maxProp = axis === 'y' ? $88cGx.bottom : $88cGx.right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
    var startDiff = popperOffsets[axis] - state.rects.reference[axis];
    var arrowOffsetParent = $ghmPE.default(arrowElement);
    var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds
    var min = paddingObject[minProp];
    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset = $7oIqj.within(min, center, max); // Prevents breaking syntax highlighting...
    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}
function $24917766341f5a7f$var$effect(_ref2) {
    var state = _ref2.state, options = _ref2.options;
    var _options$element = options.element, arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;
    if (arrowElement == null) return;
     // CSS selector
    if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);
        if (!arrowElement) return;
    }
    if (!$k5er6.default(state.elements.popper, arrowElement)) return;
    state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules
var $24917766341f5a7f$export$2e2bcd8739ae039 = {
    name: 'arrow',
    enabled: true,
    phase: 'main',
    fn: $24917766341f5a7f$var$arrow,
    effect: $24917766341f5a7f$var$effect,
    requires: [
        'popperOffsets'
    ],
    requiresIfExists: [
        'preventOverflow'
    ]
};

});
parcelRequire.register("cu2wT", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $916a3fada4c98054$export$2e2bcd8739ae039; });

function $916a3fada4c98054$export$2e2bcd8739ae039(placement) {
    return placement.split('-')[0];
}

});

parcelRequire.register("aDPrU", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $7bf574a76a615229$export$2e2bcd8739ae039; });

var $6hgQx = parcelRequire("6hgQx");
function $7bf574a76a615229$export$2e2bcd8739ae039(element) {
    var clientRect = $6hgQx.default(element); // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    if (Math.abs(clientRect.width - width) <= 1) width = clientRect.width;
    if (Math.abs(clientRect.height - height) <= 1) height = clientRect.height;
    return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
    };
}

});
parcelRequire.register("6hgQx", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $492165ee10a8831d$export$2e2bcd8739ae039; });

var $euW85 = parcelRequire("euW85");

var $8XyuM = parcelRequire("8XyuM");
function $492165ee10a8831d$export$2e2bcd8739ae039(element, includeScale) {
    if (includeScale === void 0) includeScale = false;
    var rect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;
    if ($euW85.isHTMLElement(element) && includeScale) {
        var offsetHeight = element.offsetHeight;
        var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
        // Fallback to 1 in case both values are `0`
        if (offsetWidth > 0) scaleX = $8XyuM.round(rect.width) / offsetWidth || 1;
        if (offsetHeight > 0) scaleY = $8XyuM.round(rect.height) / offsetHeight || 1;
    }
    return {
        width: rect.width / scaleX,
        height: rect.height / scaleY,
        top: rect.top / scaleY,
        right: rect.right / scaleX,
        bottom: rect.bottom / scaleY,
        left: rect.left / scaleX,
        x: rect.left / scaleX,
        y: rect.top / scaleY
    };
}

});
parcelRequire.register("8XyuM", function(module, exports) {

$parcel$export(module.exports, "max", function () { return $685e978191609c68$export$8960430cfd85939f; });
$parcel$export(module.exports, "min", function () { return $685e978191609c68$export$96ec731ed4dcb222; });
$parcel$export(module.exports, "round", function () { return $685e978191609c68$export$2077e0241d6afd3c; });
var $685e978191609c68$export$8960430cfd85939f = Math.max;
var $685e978191609c68$export$96ec731ed4dcb222 = Math.min;
var $685e978191609c68$export$2077e0241d6afd3c = Math.round;

});



parcelRequire.register("k5er6", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $e9ef78f81bfc764b$export$2e2bcd8739ae039; });

var $euW85 = parcelRequire("euW85");
function $e9ef78f81bfc764b$export$2e2bcd8739ae039(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method
    if (parent.contains(child)) return true;
    else if (rootNode && $euW85.isShadowRoot(rootNode)) {
        var next = child;
        do {
            if (next && parent.isSameNode(next)) return true;
             // $FlowFixMe[prop-missing]: need a better way to handle this...
            next = next.parentNode || next.host;
        }while (next)
    } // Give up, the result is false
    return false;
}

});

parcelRequire.register("ghmPE", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $bd9ff1d72d573396$export$2e2bcd8739ae039; });

var $f4wJW = parcelRequire("f4wJW");

var $jdMql = parcelRequire("jdMql");

var $34Re9 = parcelRequire("34Re9");

var $euW85 = parcelRequire("euW85");

var $fFMGR = parcelRequire("fFMGR");

var $4czsO = parcelRequire("4czsO");
function $bd9ff1d72d573396$var$getTrueOffsetParent(element) {
    if (!$euW85.isHTMLElement(element) || $34Re9.default(element).position === 'fixed') return null;
    return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block
function $bd9ff1d72d573396$var$getContainingBlock(element) {
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
    var isIE = navigator.userAgent.indexOf('Trident') !== -1;
    if (isIE && $euW85.isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = $34Re9.default(element);
        if (elementCss.position === 'fixed') return null;
    }
    var currentNode = $4czsO.default(element);
    if ($euW85.isShadowRoot(currentNode)) currentNode = currentNode.host;
    while($euW85.isHTMLElement(currentNode) && [
        'html',
        'body'
    ].indexOf($jdMql.default(currentNode)) < 0){
        var css = $34Re9.default(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || [
            'transform',
            'perspective'
        ].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') return currentNode;
        else currentNode = currentNode.parentNode;
    }
    return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
function $bd9ff1d72d573396$export$2e2bcd8739ae039(element) {
    var window = $f4wJW.default(element);
    var offsetParent = $bd9ff1d72d573396$var$getTrueOffsetParent(element);
    while(offsetParent && $fFMGR.default(offsetParent) && $34Re9.default(offsetParent).position === 'static')offsetParent = $bd9ff1d72d573396$var$getTrueOffsetParent(offsetParent);
    if (offsetParent && ($jdMql.default(offsetParent) === 'html' || $jdMql.default(offsetParent) === 'body' && $34Re9.default(offsetParent).position === 'static')) return window;
    return offsetParent || $bd9ff1d72d573396$var$getContainingBlock(element) || window;
}

});
parcelRequire.register("34Re9", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $23db08aa60135f8c$export$2e2bcd8739ae039; });

var $f4wJW = parcelRequire("f4wJW");
function $23db08aa60135f8c$export$2e2bcd8739ae039(element) {
    return $f4wJW.default(element).getComputedStyle(element);
}

});

parcelRequire.register("fFMGR", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $b690743fc5b708d4$export$2e2bcd8739ae039; });

var $jdMql = parcelRequire("jdMql");
function $b690743fc5b708d4$export$2e2bcd8739ae039(element) {
    return [
        'table',
        'td',
        'th'
    ].indexOf($jdMql.default(element)) >= 0;
}

});

parcelRequire.register("4czsO", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $30f3cac1ef3f1013$export$2e2bcd8739ae039; });

var $jdMql = parcelRequire("jdMql");

var $3biSF = parcelRequire("3biSF");

var $euW85 = parcelRequire("euW85");
function $30f3cac1ef3f1013$export$2e2bcd8739ae039(element) {
    if ($jdMql.default(element) === 'html') return element;
    return(// $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || element.parentNode || ($euW85.isShadowRoot(element) ? element.host : null) || // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    $3biSF.default(element) // fallback
    );
}

});
parcelRequire.register("3biSF", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $25110b7bec63d7ac$export$2e2bcd8739ae039; });

var $euW85 = parcelRequire("euW85");
function $25110b7bec63d7ac$export$2e2bcd8739ae039(element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return (($euW85.isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}

});



parcelRequire.register("7TyMF", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $5bf8a6d0c5f6ee56$export$2e2bcd8739ae039; });
function $5bf8a6d0c5f6ee56$export$2e2bcd8739ae039(placement) {
    return [
        'top',
        'bottom'
    ].indexOf(placement) >= 0 ? 'x' : 'y';
}

});

parcelRequire.register("7oIqj", function(module, exports) {

$parcel$export(module.exports, "within", function () { return $562d3bd98feba12c$export$f28d906d67a997f3; });
$parcel$export(module.exports, "withinMaxClamp", function () { return $562d3bd98feba12c$export$86c8af6d3ef0b4a; });

var $8XyuM = parcelRequire("8XyuM");
function $562d3bd98feba12c$export$f28d906d67a997f3(min, value, max) {
    return $8XyuM.max(min, $8XyuM.min(value, max));
}
function $562d3bd98feba12c$export$86c8af6d3ef0b4a(min, value, max) {
    var v = $562d3bd98feba12c$export$f28d906d67a997f3(min, value, max);
    return v > max ? max : v;
}

});

parcelRequire.register("32Gl7", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $237266c59e44ca85$export$2e2bcd8739ae039; });

var $h7qDH = parcelRequire("h7qDH");
function $237266c59e44ca85$export$2e2bcd8739ae039(paddingObject) {
    return Object.assign({}, $h7qDH.default(), paddingObject);
}

});
parcelRequire.register("h7qDH", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $c767c11cbd6428f7$export$2e2bcd8739ae039; });
function $c767c11cbd6428f7$export$2e2bcd8739ae039() {
    return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
}

});


parcelRequire.register("8uMLG", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $62f6f46052ba1ffd$export$2e2bcd8739ae039; });
function $62f6f46052ba1ffd$export$2e2bcd8739ae039(value, keys) {
    return keys.reduce(function(hashMap, key) {
        hashMap[key] = value;
        return hashMap;
    }, {});
}

});


parcelRequire.register("1PfVV", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $1546e9ddfea08d77$export$2e2bcd8739ae039; });

var $88cGx = parcelRequire("88cGx");

var $ghmPE = parcelRequire("ghmPE");

var $f4wJW = parcelRequire("f4wJW");

var $3biSF = parcelRequire("3biSF");

var $34Re9 = parcelRequire("34Re9");

var $cu2wT = parcelRequire("cu2wT");

var $8hAYq = parcelRequire("8hAYq");

var $8XyuM = parcelRequire("8XyuM");
var $1546e9ddfea08d77$var$unsetSides = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.
function $1546e9ddfea08d77$var$roundOffsetsByDPR(_ref) {
    var x = _ref.x, y = _ref.y;
    var win = window;
    var dpr = win.devicePixelRatio || 1;
    return {
        x: $8XyuM.round(x * dpr) / dpr || 0,
        y: $8XyuM.round(y * dpr) / dpr || 0
    };
}
function $1546e9ddfea08d77$export$378fa78a8fea596f(_ref2) {
    var _Object$assign2;
    var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
    var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
        x: x,
        y: y
    }) : {
        x: x,
        y: y
    };
    x = _ref3.x;
    y = _ref3.y;
    var hasX = offsets.hasOwnProperty('x');
    var hasY = offsets.hasOwnProperty('y');
    var sideX = $88cGx.left;
    var sideY = $88cGx.top;
    var win = window;
    if (adaptive) {
        var offsetParent = $ghmPE.default(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';
        if (offsetParent === $f4wJW.default(popper)) {
            offsetParent = $3biSF.default(popper);
            if ($34Re9.default(offsetParent).position !== 'static' && position === 'absolute') {
                heightProp = 'scrollHeight';
                widthProp = 'scrollWidth';
            }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it
        if (placement === $88cGx.top || (placement === $88cGx.left || placement === $88cGx.right) && variation === $88cGx.end) {
            sideY = $88cGx.bottom;
            var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
            y -= offsetY - popperRect.height;
            y *= gpuAcceleration ? 1 : -1;
        }
        if (placement === $88cGx.left || (placement === $88cGx.top || placement === $88cGx.bottom) && variation === $88cGx.end) {
            sideX = $88cGx.right;
            var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
            x -= offsetX - popperRect.width;
            x *= gpuAcceleration ? 1 : -1;
        }
    }
    var commonStyles = Object.assign({
        position: position
    }, adaptive && $1546e9ddfea08d77$var$unsetSides);
    var _ref4 = roundOffsets === true ? $1546e9ddfea08d77$var$roundOffsetsByDPR({
        x: x,
        y: y
    }) : {
        x: x,
        y: y
    };
    x = _ref4.x;
    y = _ref4.y;
    if (gpuAcceleration) {
        var _Object$assign;
        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }
    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}
function $1546e9ddfea08d77$var$computeStyles(_ref5) {
    var state = _ref5.state, options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    var transitionProperty, property;
    var commonStyles = {
        placement: $cu2wT.default(state.placement),
        variation: $8hAYq.default(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === 'fixed'
    };
    if (state.modifiersData.popperOffsets != null) state.styles.popper = Object.assign({}, state.styles.popper, $1546e9ddfea08d77$export$378fa78a8fea596f(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive: adaptive,
        roundOffsets: roundOffsets
    })));
    if (state.modifiersData.arrow != null) state.styles.arrow = Object.assign({}, state.styles.arrow, $1546e9ddfea08d77$export$378fa78a8fea596f(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
        roundOffsets: roundOffsets
    })));
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
    });
} // eslint-disable-next-line import/no-unused-modules
var $1546e9ddfea08d77$export$2e2bcd8739ae039 = {
    name: 'computeStyles',
    enabled: true,
    phase: 'beforeWrite',
    fn: $1546e9ddfea08d77$var$computeStyles,
    data: {}
};

});
parcelRequire.register("8hAYq", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $607c976c5a631f1c$export$2e2bcd8739ae039; });
function $607c976c5a631f1c$export$2e2bcd8739ae039(placement) {
    return placement.split('-')[1];
}

});


parcelRequire.register("gELNi", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $c20574b15a9fa487$export$2e2bcd8739ae039; });

var $f4wJW = parcelRequire("f4wJW");
var $c20574b15a9fa487$var$passive = {
    passive: true
};
function $c20574b15a9fa487$var$effect(_ref) {
    var state = _ref.state, instance = _ref.instance, options = _ref.options;
    var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
    var window = $f4wJW.default(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
    if (scroll) scrollParents.forEach(function(scrollParent) {
        scrollParent.addEventListener('scroll', instance.update, $c20574b15a9fa487$var$passive);
    });
    if (resize) window.addEventListener('resize', instance.update, $c20574b15a9fa487$var$passive);
    return function() {
        if (scroll) scrollParents.forEach(function(scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, $c20574b15a9fa487$var$passive);
        });
        if (resize) window.removeEventListener('resize', instance.update, $c20574b15a9fa487$var$passive);
    };
} // eslint-disable-next-line import/no-unused-modules
var $c20574b15a9fa487$export$2e2bcd8739ae039 = {
    name: 'eventListeners',
    enabled: true,
    phase: 'write',
    fn: function fn() {},
    effect: $c20574b15a9fa487$var$effect,
    data: {}
};

});

parcelRequire.register("bFPrx", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $87fb6d99fa34d1db$export$2e2bcd8739ae039; });

var $cL4TC = parcelRequire("cL4TC");

var $cu2wT = parcelRequire("cu2wT");

var $hBsMK = parcelRequire("hBsMK");

var $ev9kE = parcelRequire("ev9kE");

var $buLIa = parcelRequire("buLIa");

var $88cGx = parcelRequire("88cGx");

var $8hAYq = parcelRequire("8hAYq");
function $87fb6d99fa34d1db$var$getExpandedFallbackPlacements(placement) {
    if ($cu2wT.default(placement) === $88cGx.auto) return [];
    var oppositePlacement = $cL4TC.default(placement);
    return [
        $hBsMK.default(placement),
        oppositePlacement,
        $hBsMK.default(oppositePlacement)
    ];
}
function $87fb6d99fa34d1db$var$flip(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    if (state.modifiersData[name]._skip) return;
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = $cu2wT.default(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [
        $cL4TC.default(preferredPlacement)
    ] : $87fb6d99fa34d1db$var$getExpandedFallbackPlacements(preferredPlacement));
    var placements = [
        preferredPlacement
    ].concat(fallbackPlacements).reduce(function(acc, placement) {
        return acc.concat($cu2wT.default(placement) === $88cGx.auto ? $buLIa.default(state, {
            placement: placement,
            boundary: boundary,
            rootBoundary: rootBoundary,
            padding: padding,
            flipVariations: flipVariations,
            allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements[0];
    for(var i = 0; i < placements.length; i++){
        var placement1 = placements[i];
        var _basePlacement = $cu2wT.default(placement1);
        var isStartVariation = $8hAYq.default(placement1) === $88cGx.start;
        var isVertical = [
            $88cGx.top,
            $88cGx.bottom
        ].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = $ev9kE.default(state, {
            placement: placement1,
            boundary: boundary,
            rootBoundary: rootBoundary,
            altBoundary: altBoundary,
            padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? $88cGx.right : $88cGx.left : isStartVariation ? $88cGx.bottom : $88cGx.top;
        if (referenceRect[len] > popperRect[len]) mainVariationSide = $cL4TC.default(mainVariationSide);
        var altVariationSide = $cL4TC.default(mainVariationSide);
        var checks = [];
        if (checkMainAxis) checks.push(overflow[_basePlacement] <= 0);
        if (checkAltAxis) checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        if (checks.every(function(check) {
            return check;
        })) {
            firstFittingPlacement = placement1;
            makeFallbackChecks = false;
            break;
        }
        checksMap.set(placement1, checks);
    }
    if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;
        var _loop = function _loop(_i) {
            var fittingPlacement = placements.find(function(placement) {
                var checks = checksMap.get(placement);
                if (checks) return checks.slice(0, _i).every(function(check) {
                    return check;
                });
            });
            if (fittingPlacement) {
                firstFittingPlacement = fittingPlacement;
                return "break";
            }
        };
        for(var _i1 = numberOfChecks; _i1 > 0; _i1--){
            var _ret = _loop(_i1);
            if (_ret === "break") break;
        }
    }
    if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
    }
} // eslint-disable-next-line import/no-unused-modules
var $87fb6d99fa34d1db$export$2e2bcd8739ae039 = {
    name: 'flip',
    enabled: true,
    phase: 'main',
    fn: $87fb6d99fa34d1db$var$flip,
    requiresIfExists: [
        'offset'
    ],
    data: {
        _skip: false
    }
};

});
parcelRequire.register("cL4TC", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $949dac12746867ff$export$2e2bcd8739ae039; });
var $949dac12746867ff$var$hash = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
};
function $949dac12746867ff$export$2e2bcd8739ae039(placement) {
    return placement.replace(/left|right|bottom|top/g, function(matched) {
        return $949dac12746867ff$var$hash[matched];
    });
}

});

parcelRequire.register("hBsMK", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $cd0c3885ca2965e0$export$2e2bcd8739ae039; });
var $cd0c3885ca2965e0$var$hash = {
    start: 'end',
    end: 'start'
};
function $cd0c3885ca2965e0$export$2e2bcd8739ae039(placement) {
    return placement.replace(/start|end/g, function(matched) {
        return $cd0c3885ca2965e0$var$hash[matched];
    });
}

});

parcelRequire.register("ev9kE", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $a8eb3317be81183c$export$2e2bcd8739ae039; });

var $kkUEN = parcelRequire("kkUEN");

var $3biSF = parcelRequire("3biSF");

var $6hgQx = parcelRequire("6hgQx");

var $ku65z = parcelRequire("ku65z");

var $hRx9w = parcelRequire("hRx9w");

var $88cGx = parcelRequire("88cGx");

var $euW85 = parcelRequire("euW85");

var $32Gl7 = parcelRequire("32Gl7");

var $8uMLG = parcelRequire("8uMLG");
function $a8eb3317be81183c$export$2e2bcd8739ae039(state, options) {
    if (options === void 0) options = {};
    var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? $88cGx.clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? $88cGx.viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? $88cGx.popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = $32Gl7.default(typeof padding !== 'number' ? padding : $8uMLG.default(padding, $88cGx.basePlacements));
    var altContext = elementContext === $88cGx.popper ? $88cGx.reference : $88cGx.popper;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = $kkUEN.default($euW85.isElement(element) ? element : element.contextElement || $3biSF.default(state.elements.popper), boundary, rootBoundary);
    var referenceClientRect = $6hgQx.default(state.elements.reference);
    var popperOffsets = $ku65z.default({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
    });
    var popperClientRect = $hRx9w.default(Object.assign({}, popperRect, popperOffsets));
    var elementClientRect = elementContext === $88cGx.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect
    var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element
    if (elementContext === $88cGx.popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function(key) {
            var multiply = [
                $88cGx.right,
                $88cGx.bottom
            ].indexOf(key) >= 0 ? 1 : -1;
            var axis = [
                $88cGx.top,
                $88cGx.bottom
            ].indexOf(key) >= 0 ? 'y' : 'x';
            overflowOffsets[key] += offset[axis] * multiply;
        });
    }
    return overflowOffsets;
}

});
parcelRequire.register("kkUEN", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $ece19fd1cd164de7$export$2e2bcd8739ae039; });

var $88cGx = parcelRequire("88cGx");

var $28cqX = parcelRequire("28cqX");

var $51U3S = parcelRequire("51U3S");

var $bEjiG = parcelRequire("bEjiG");

var $ghmPE = parcelRequire("ghmPE");

var $3biSF = parcelRequire("3biSF");

var $34Re9 = parcelRequire("34Re9");

var $euW85 = parcelRequire("euW85");

var $6hgQx = parcelRequire("6hgQx");

var $4czsO = parcelRequire("4czsO");

var $k5er6 = parcelRequire("k5er6");

var $jdMql = parcelRequire("jdMql");

var $hRx9w = parcelRequire("hRx9w");

var $8XyuM = parcelRequire("8XyuM");
function $ece19fd1cd164de7$var$getInnerBoundingClientRect(element) {
    var rect = $6hgQx.default(element);
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
}
function $ece19fd1cd164de7$var$getClientRectFromMixedType(element, clippingParent) {
    return clippingParent === $88cGx.viewport ? $hRx9w.default($28cqX.default(element)) : $euW85.isElement(clippingParent) ? $ece19fd1cd164de7$var$getInnerBoundingClientRect(clippingParent) : $hRx9w.default($51U3S.default($3biSF.default(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`
function $ece19fd1cd164de7$var$getClippingParents(element) {
    var clippingParents = $bEjiG.default($4czsO.default(element));
    var canEscapeClipping = [
        'absolute',
        'fixed'
    ].indexOf($34Re9.default(element).position) >= 0;
    var clipperElement = canEscapeClipping && $euW85.isHTMLElement(element) ? $ghmPE.default(element) : element;
    if (!$euW85.isElement(clipperElement)) return [];
     // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414
    return clippingParents.filter(function(clippingParent) {
        return $euW85.isElement(clippingParent) && $k5er6.default(clippingParent, clipperElement) && $jdMql.default(clippingParent) !== 'body';
    });
} // Gets the maximum area that the element is visible in due to any number of
function $ece19fd1cd164de7$export$2e2bcd8739ae039(element, boundary, rootBoundary) {
    var mainClippingParents = boundary === 'clippingParents' ? $ece19fd1cd164de7$var$getClippingParents(element) : [].concat(boundary);
    var clippingParents = [].concat(mainClippingParents, [
        rootBoundary
    ]);
    var firstClippingParent = clippingParents[0];
    var clippingRect = clippingParents.reduce(function(accRect, clippingParent) {
        var rect = $ece19fd1cd164de7$var$getClientRectFromMixedType(element, clippingParent);
        accRect.top = $8XyuM.max(rect.top, accRect.top);
        accRect.right = $8XyuM.min(rect.right, accRect.right);
        accRect.bottom = $8XyuM.min(rect.bottom, accRect.bottom);
        accRect.left = $8XyuM.max(rect.left, accRect.left);
        return accRect;
    }, $ece19fd1cd164de7$var$getClientRectFromMixedType(element, firstClippingParent));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
}

});
parcelRequire.register("28cqX", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $18d5f937cbe37798$export$2e2bcd8739ae039; });

var $f4wJW = parcelRequire("f4wJW");

var $3biSF = parcelRequire("3biSF");

var $9DfEt = parcelRequire("9DfEt");
function $18d5f937cbe37798$export$2e2bcd8739ae039(element) {
    var win = $f4wJW.default(element);
    var html = $3biSF.default(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
    // can be obscured underneath it.
    // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
    // if it isn't open, so if this isn't available, the popper will be detected
    // to overflow the bottom of the screen too early.
    if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
        // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
        // errors due to floating point numbers, so we need to check precision.
        // Safari returns a number <= 0, usually < -1 when pinch-zoomed
        // Feature detection fails in mobile emulation mode in Chrome.
        // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
        // 0.001
        // Fallback here: "Not Safari" userAgent
        if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
            x = visualViewport.offsetLeft;
            y = visualViewport.offsetTop;
        }
    }
    return {
        width: width,
        height: height,
        x: x + $9DfEt.default(element),
        y: y
    };
}

});
parcelRequire.register("9DfEt", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $7033e5b5902e0e5d$export$2e2bcd8739ae039; });

var $6hgQx = parcelRequire("6hgQx");

var $3biSF = parcelRequire("3biSF");

var $1ioQe = parcelRequire("1ioQe");
function $7033e5b5902e0e5d$export$2e2bcd8739ae039(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return $6hgQx.default($3biSF.default(element)).left + $1ioQe.default(element).scrollLeft;
}

});
parcelRequire.register("1ioQe", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $0f1abde6c30c8a1d$export$2e2bcd8739ae039; });

var $f4wJW = parcelRequire("f4wJW");
function $0f1abde6c30c8a1d$export$2e2bcd8739ae039(node) {
    var win = $f4wJW.default(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
    };
}

});



parcelRequire.register("51U3S", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $3a98885f6a50f4e3$export$2e2bcd8739ae039; });

var $3biSF = parcelRequire("3biSF");

var $34Re9 = parcelRequire("34Re9");

var $9DfEt = parcelRequire("9DfEt");

var $1ioQe = parcelRequire("1ioQe");

var $8XyuM = parcelRequire("8XyuM");
function $3a98885f6a50f4e3$export$2e2bcd8739ae039(element) {
    var _element$ownerDocumen;
    var html = $3biSF.default(element);
    var winScroll = $1ioQe.default(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = $8XyuM.max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = $8XyuM.max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + $9DfEt.default(element);
    var y = -winScroll.scrollTop;
    if ($34Re9.default(body || html).direction === 'rtl') x += $8XyuM.max(html.clientWidth, body ? body.clientWidth : 0) - width;
    return {
        width: width,
        height: height,
        x: x,
        y: y
    };
}

});

parcelRequire.register("bEjiG", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $87b266c2444ba75b$export$2e2bcd8739ae039; });

var $5nk0D = parcelRequire("5nk0D");

var $4czsO = parcelRequire("4czsO");

var $f4wJW = parcelRequire("f4wJW");

var $4x5QT = parcelRequire("4x5QT");
function $87b266c2444ba75b$export$2e2bcd8739ae039(element, list) {
    var _element$ownerDocumen;
    if (list === void 0) list = [];
    var scrollParent = $5nk0D.default(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = $f4wJW.default(scrollParent);
    var target = isBody ? [
        win
    ].concat(win.visualViewport || [], $4x5QT.default(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : updatedList.concat($87b266c2444ba75b$export$2e2bcd8739ae039($4czsO.default(target)));
}

});
parcelRequire.register("5nk0D", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $3e9e9f24736fb02a$export$2e2bcd8739ae039; });

var $4czsO = parcelRequire("4czsO");

var $4x5QT = parcelRequire("4x5QT");

var $jdMql = parcelRequire("jdMql");

var $euW85 = parcelRequire("euW85");
function $3e9e9f24736fb02a$export$2e2bcd8739ae039(node) {
    if ([
        'html',
        'body',
        '#document'
    ].indexOf($jdMql.default(node)) >= 0) // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
    if ($euW85.isHTMLElement(node) && $4x5QT.default(node)) return node;
    return $3e9e9f24736fb02a$export$2e2bcd8739ae039($4czsO.default(node));
}

});
parcelRequire.register("4x5QT", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $34cec895db6c43ca$export$2e2bcd8739ae039; });

var $34Re9 = parcelRequire("34Re9");
function $34cec895db6c43ca$export$2e2bcd8739ae039(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = $34Re9.default(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

});



parcelRequire.register("hRx9w", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $d0111a55c8f38e2b$export$2e2bcd8739ae039; });
function $d0111a55c8f38e2b$export$2e2bcd8739ae039(rect) {
    return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
    });
}

});


parcelRequire.register("ku65z", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $ee9b551c707223e9$export$2e2bcd8739ae039; });

var $cu2wT = parcelRequire("cu2wT");

var $8hAYq = parcelRequire("8hAYq");

var $7TyMF = parcelRequire("7TyMF");

var $88cGx = parcelRequire("88cGx");
function $ee9b551c707223e9$export$2e2bcd8739ae039(_ref) {
    var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
    var basePlacement = placement ? $cu2wT.default(placement) : null;
    var variation = placement ? $8hAYq.default(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;
    switch(basePlacement){
        case $88cGx.top:
            offsets = {
                x: commonX,
                y: reference.y - element.height
            };
            break;
        case $88cGx.bottom:
            offsets = {
                x: commonX,
                y: reference.y + reference.height
            };
            break;
        case $88cGx.right:
            offsets = {
                x: reference.x + reference.width,
                y: commonY
            };
            break;
        case $88cGx.left:
            offsets = {
                x: reference.x - element.width,
                y: commonY
            };
            break;
        default:
            offsets = {
                x: reference.x,
                y: reference.y
            };
    }
    var mainAxis = basePlacement ? $7TyMF.default(basePlacement) : null;
    if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';
        switch(variation){
            case $88cGx.start:
                offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
                break;
            case $88cGx.end:
                offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
                break;
            default:
        }
    }
    return offsets;
}

});


parcelRequire.register("buLIa", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $85e78187d3c18bcf$export$2e2bcd8739ae039; });

var $8hAYq = parcelRequire("8hAYq");

var $88cGx = parcelRequire("88cGx");

var $ev9kE = parcelRequire("ev9kE");

var $cu2wT = parcelRequire("cu2wT");
function $85e78187d3c18bcf$export$2e2bcd8739ae039(state, options) {
    if (options === void 0) options = {};
    var _options = options, placement1 = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? $88cGx.placements : _options$allowedAutoP;
    var variation = $8hAYq.default(placement1);
    var placements = variation ? flipVariations ? $88cGx.variationPlacements : $88cGx.variationPlacements.filter(function(placement) {
        return $8hAYq.default(placement) === variation;
    }) : $88cGx.basePlacements;
    var allowedPlacements = placements.filter(function(placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
    });
    if (allowedPlacements.length === 0) allowedPlacements = placements;
     // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...
    var overflows = allowedPlacements.reduce(function(acc, placement) {
        acc[placement] = $ev9kE.default(state, {
            placement: placement,
            boundary: boundary,
            rootBoundary: rootBoundary,
            padding: padding
        })[$cu2wT.default(placement)];
        return acc;
    }, {});
    return Object.keys(overflows).sort(function(a, b) {
        return overflows[a] - overflows[b];
    });
}

});


parcelRequire.register("dtIGY", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $9d00a6b25c149be3$export$2e2bcd8739ae039; });

var $88cGx = parcelRequire("88cGx");

var $ev9kE = parcelRequire("ev9kE");
function $9d00a6b25c149be3$var$getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) preventedOffsets = {
        x: 0,
        y: 0
    };
    return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
    };
}
function $9d00a6b25c149be3$var$isAnySideFullyClipped(overflow) {
    return [
        $88cGx.top,
        $88cGx.right,
        $88cGx.bottom,
        $88cGx.left
    ].some(function(side) {
        return overflow[side] >= 0;
    });
}
function $9d00a6b25c149be3$var$hide(_ref) {
    var state = _ref.state, name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = $ev9kE.default(state, {
        elementContext: 'reference'
    });
    var popperAltOverflow = $ev9kE.default(state, {
        altBoundary: true
    });
    var referenceClippingOffsets = $9d00a6b25c149be3$var$getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = $9d00a6b25c149be3$var$getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = $9d00a6b25c149be3$var$isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = $9d00a6b25c149be3$var$isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
    });
} // eslint-disable-next-line import/no-unused-modules
var $9d00a6b25c149be3$export$2e2bcd8739ae039 = {
    name: 'hide',
    enabled: true,
    phase: 'main',
    requiresIfExists: [
        'preventOverflow'
    ],
    fn: $9d00a6b25c149be3$var$hide
};

});

parcelRequire.register("djaL7", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $9b056539298e9e2b$export$2e2bcd8739ae039; });

var $cu2wT = parcelRequire("cu2wT");

var $88cGx = parcelRequire("88cGx");
function $9b056539298e9e2b$export$7fa02d8595b015ed(placement, rects, offset) {
    var basePlacement = $cu2wT.default(placement);
    var invertDistance = [
        $88cGx.left,
        $88cGx.top
    ].indexOf(basePlacement) >= 0 ? -1 : 1;
    var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
    })) : offset, skidding = _ref[0], distance = _ref[1];
    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [
        $88cGx.left,
        $88cGx.right
    ].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
    } : {
        x: skidding,
        y: distance
    };
}
function $9b056539298e9e2b$var$offset(_ref2) {
    var state = _ref2.state, options = _ref2.options, name = _ref2.name;
    var _options$offset = options.offset, offset = _options$offset === void 0 ? [
        0,
        0
    ] : _options$offset;
    var data = $88cGx.placements.reduce(function(acc, placement) {
        acc[placement] = $9b056539298e9e2b$export$7fa02d8595b015ed(placement, state.rects, offset);
        return acc;
    }, {});
    var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
    if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
    }
    state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules
var $9b056539298e9e2b$export$2e2bcd8739ae039 = {
    name: 'offset',
    enabled: true,
    phase: 'main',
    requires: [
        'popperOffsets'
    ],
    fn: $9b056539298e9e2b$var$offset
};

});

parcelRequire.register("lb5MU", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $f6af1d628293374a$export$2e2bcd8739ae039; });

var $ku65z = parcelRequire("ku65z");
function $f6af1d628293374a$var$popperOffsets(_ref) {
    var state = _ref.state, name = _ref.name;
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = $ku65z.default({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
    });
} // eslint-disable-next-line import/no-unused-modules
var $f6af1d628293374a$export$2e2bcd8739ae039 = {
    name: 'popperOffsets',
    enabled: true,
    phase: 'read',
    fn: $f6af1d628293374a$var$popperOffsets,
    data: {}
};

});

parcelRequire.register("fXR4l", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $b9f58820dffcf24e$export$2e2bcd8739ae039; });

var $88cGx = parcelRequire("88cGx");

var $cu2wT = parcelRequire("cu2wT");

var $7TyMF = parcelRequire("7TyMF");

var $pXDME = parcelRequire("pXDME");

var $7oIqj = parcelRequire("7oIqj");

var $aDPrU = parcelRequire("aDPrU");

var $ghmPE = parcelRequire("ghmPE");

var $ev9kE = parcelRequire("ev9kE");

var $8hAYq = parcelRequire("8hAYq");

var $h7qDH = parcelRequire("h7qDH");

var $8XyuM = parcelRequire("8XyuM");
function $b9f58820dffcf24e$var$preventOverflow(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = $ev9kE.default(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
    });
    var basePlacement = $cu2wT.default(state.placement);
    var variation = $8hAYq.default(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = $7TyMF.default(basePlacement);
    var altAxis = $pXDME.default(mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
    })) : tetherOffset;
    var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
    } : Object.assign({
        mainAxis: 0,
        altAxis: 0
    }, tetherOffsetValue);
    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
    var data = {
        x: 0,
        y: 0
    };
    if (!popperOffsets) return;
    if (checkMainAxis) {
        var _offsetModifierState$;
        var mainSide = mainAxis === 'y' ? $88cGx.top : $88cGx.left;
        var altSide = mainAxis === 'y' ? $88cGx.bottom : $88cGx.right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min = offset + overflow[mainSide];
        var max = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === $88cGx.start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === $88cGx.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds
        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? $aDPrU.default(arrowElement) : {
            width: 0,
            height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : $h7qDH.default();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)
        var arrowLen = $7oIqj.within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && $ghmPE.default(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = $7oIqj.within(tether ? $8XyuM.min(min, tetherMin) : min, offset, tether ? $8XyuM.max(max, tetherMax) : max);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
    }
    if (checkAltAxis) {
        var _offsetModifierState$2;
        var _mainSide = mainAxis === 'x' ? $88cGx.top : $88cGx.left;
        var _altSide = mainAxis === 'x' ? $88cGx.bottom : $88cGx.right;
        var _offset = popperOffsets[altAxis];
        var _len = altAxis === 'y' ? 'height' : 'width';
        var _min = _offset + overflow[_mainSide];
        var _max = _offset - overflow[_altSide];
        var isOriginSide = [
            $88cGx.top,
            $88cGx.left
        ].indexOf(basePlacement) !== -1;
        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
        var _preventedOffset = tether && isOriginSide ? $7oIqj.withinMaxClamp(_tetherMin, _offset, _tetherMax) : $7oIqj.within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
    }
    state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules
var $b9f58820dffcf24e$export$2e2bcd8739ae039 = {
    name: 'preventOverflow',
    enabled: true,
    phase: 'main',
    fn: $b9f58820dffcf24e$var$preventOverflow,
    requiresIfExists: [
        'offset'
    ]
};

});
parcelRequire.register("pXDME", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $04e0994f2343110f$export$2e2bcd8739ae039; });
function $04e0994f2343110f$export$2e2bcd8739ae039(axis) {
    return axis === 'x' ? 'y' : 'x';
}

});



parcelRequire.register("fR7p4", function(module, exports) {

$parcel$export(module.exports, "popperGenerator", function () { return $b8b18c6dd97b637d$export$ed5e13716264f202; });
$parcel$export(module.exports, "createPopper", function () { return $b8b18c6dd97b637d$export$8f7491d57c8f97a9; });
$parcel$export(module.exports, "detectOverflow", function () { return (parcelRequire("ev9kE")).default; });

var $7XKXa = parcelRequire("7XKXa");

var $aDPrU = parcelRequire("aDPrU");

var $bEjiG = parcelRequire("bEjiG");

var $ghmPE = parcelRequire("ghmPE");


var $cw4gM = parcelRequire("cw4gM");

var $5CwJo = parcelRequire("5CwJo");




var $jfxTE = parcelRequire("jfxTE");

var $ev9kE = parcelRequire("ev9kE");

var $euW85 = parcelRequire("euW85");

var $b8b18c6dd97b637d$var$INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var $b8b18c6dd97b637d$var$INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var $b8b18c6dd97b637d$var$DEFAULT_OPTIONS = {
    placement: 'bottom',
    modifiers: [],
    strategy: 'absolute'
};
function $b8b18c6dd97b637d$var$areValidElements() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
    return !args.some(function(element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
    });
}
function $b8b18c6dd97b637d$export$ed5e13716264f202(generatorOptions) {
    if (generatorOptions === void 0) generatorOptions = {};
    var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? $b8b18c6dd97b637d$var$DEFAULT_OPTIONS : _generatorOptions$def2;
    return function $b8b18c6dd97b637d$export$8f7491d57c8f97a9(reference1, popper1, options1) {
        if (options1 === void 0) options1 = defaultOptions;
        var state1 = {
            placement: 'bottom',
            orderedModifiers: [],
            options: Object.assign({}, $b8b18c6dd97b637d$var$DEFAULT_OPTIONS, defaultOptions),
            modifiersData: {},
            elements: {
                reference: reference1,
                popper: popper1
            },
            attributes: {},
            styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
            state: state1,
            setOptions: function setOptions(setOptionsAction) {
                var options = typeof setOptionsAction === 'function' ? setOptionsAction(state1.options) : setOptionsAction;
                cleanupModifierEffects();
                state1.options = Object.assign({}, defaultOptions, state1.options, options);
                state1.scrollParents = {
                    reference: $euW85.isElement(reference1) ? $bEjiG.default(reference1) : reference1.contextElement ? $bEjiG.default(reference1.contextElement) : [],
                    popper: $bEjiG.default(popper1)
                }; // Orders the modifiers based on their dependencies and `phase`
                // properties
                var orderedModifiers = $cw4gM.default($jfxTE.default([].concat(defaultModifiers, state1.options.modifiers))); // Strip out disabled modifiers
                state1.orderedModifiers = orderedModifiers.filter(function(m) {
                    return m.enabled;
                }); // Validate the provided modifiers so that the consumer will get warned
                var modifiers, _ref, name, flipModifier, _ref2, name1, _getComputedStyle, marginTop, marginRight, marginBottom, marginLeft, margin;
                runModifierEffects();
                return instance.update();
            },
            // Sync update – it will always be executed, even if not necessary. This
            // is useful for low frequency updates where sync behavior simplifies the
            // logic.
            // For high frequency updates (e.g. `resize` and `scroll` events), always
            // prefer the async Popper#update method
            forceUpdate: function forceUpdate() {
                if (isDestroyed) return;
                var _state$elements = state1.elements, reference = _state$elements.reference, popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
                // anymore
                if (!$b8b18c6dd97b637d$var$areValidElements(reference, popper)) return;
                 // Store the reference and popper rects to be read by modifiers
                state1.rects = {
                    reference: $7XKXa.default(reference, $ghmPE.default(popper), state1.options.strategy === 'fixed'),
                    popper: $aDPrU.default(popper)
                }; // Modifiers have the ability to reset the current update cycle. The
                // most common use case for this is the `flip` modifier changing the
                // placement, which then needs to re-run all the modifiers, because the
                // logic was previously ran for the previous placement and is therefore
                // stale/incorrect
                state1.reset = false;
                state1.placement = state1.options.placement; // On each update cycle, the `modifiersData` property for each modifier
                // is filled with the initial data specified by the modifier. This means
                // it doesn't persist and is fresh on each update.
                // To ensure persistent data, use `${name}#persistent`
                state1.orderedModifiers.forEach(function(modifier) {
                    return state1.modifiersData[modifier.name] = Object.assign({}, modifier.data);
                });
                var __debug_loops__ = 0;
                for(var index = 0; index < state1.orderedModifiers.length; index++){
                    if (state1.reset === true) {
                        state1.reset = false;
                        index = -1;
                        continue;
                    }
                    var _state$orderedModifie = state1.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                    if (typeof fn === 'function') state1 = fn({
                        state: state1,
                        options: _options,
                        name: name,
                        instance: instance
                    }) || state1;
                }
            },
            // Async and optimistically optimized update – it will not be executed if
            // not necessary (debounced to run at most once-per-tick)
            update: $5CwJo.default(function() {
                return new Promise(function(resolve) {
                    instance.forceUpdate();
                    resolve(state1);
                });
            }),
            destroy: function destroy() {
                cleanupModifierEffects();
                isDestroyed = true;
            }
        };
        if (!$b8b18c6dd97b637d$var$areValidElements(reference1, popper1)) return instance;
        instance.setOptions(options1).then(function(state) {
            if (!isDestroyed && options1.onFirstUpdate) options1.onFirstUpdate(state);
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.
        function runModifierEffects() {
            state1.orderedModifiers.forEach(function(_ref3) {
                var name = _ref3.name, _ref3$options = _ref3.options, options = _ref3$options === void 0 ? {} : _ref3$options, effect = _ref3.effect;
                if (typeof effect === 'function') {
                    var cleanupFn = effect({
                        state: state1,
                        name: name,
                        instance: instance,
                        options: options
                    });
                    var noopFn = function noopFn() {};
                    effectCleanupFns.push(cleanupFn || noopFn);
                }
            });
        }
        function cleanupModifierEffects() {
            effectCleanupFns.forEach(function(fn) {
                return fn();
            });
            effectCleanupFns = [];
        }
        return instance;
    };
}
var $b8b18c6dd97b637d$export$8f7491d57c8f97a9 = /*#__PURE__*/ $b8b18c6dd97b637d$export$ed5e13716264f202(); // eslint-disable-next-line import/no-unused-modules

});
parcelRequire.register("7XKXa", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $5cc2770eacdf5e3f$export$2e2bcd8739ae039; });

var $6hgQx = parcelRequire("6hgQx");

var $6Sv7B = parcelRequire("6Sv7B");

var $jdMql = parcelRequire("jdMql");

var $euW85 = parcelRequire("euW85");

var $9DfEt = parcelRequire("9DfEt");

var $3biSF = parcelRequire("3biSF");

var $4x5QT = parcelRequire("4x5QT");

var $8XyuM = parcelRequire("8XyuM");
function $5cc2770eacdf5e3f$var$isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = $8XyuM.round(rect.width) / element.offsetWidth || 1;
    var scaleY = $8XyuM.round(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
function $5cc2770eacdf5e3f$export$2e2bcd8739ae039(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) isFixed = false;
    var isOffsetParentAnElement = $euW85.isHTMLElement(offsetParent);
    var offsetParentIsScaled = $euW85.isHTMLElement(offsetParent) && $5cc2770eacdf5e3f$var$isElementScaled(offsetParent);
    var documentElement = $3biSF.default(offsetParent);
    var rect = $6hgQx.default(elementOrVirtualElement, offsetParentIsScaled);
    var scroll = {
        scrollLeft: 0,
        scrollTop: 0
    };
    var offsets = {
        x: 0,
        y: 0
    };
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if ($jdMql.default(offsetParent) !== 'body' || $4x5QT.default(documentElement)) scroll = $6Sv7B.default(offsetParent);
        if ($euW85.isHTMLElement(offsetParent)) {
            offsets = $6hgQx.default(offsetParent, true);
            offsets.x += offsetParent.clientLeft;
            offsets.y += offsetParent.clientTop;
        } else if (documentElement) offsets.x = $9DfEt.default(documentElement);
    }
    return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
    };
}

});
parcelRequire.register("6Sv7B", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $501fed598e3aa959$export$2e2bcd8739ae039; });

var $1ioQe = parcelRequire("1ioQe");

var $f4wJW = parcelRequire("f4wJW");

var $euW85 = parcelRequire("euW85");

var $ho3OU = parcelRequire("ho3OU");
function $501fed598e3aa959$export$2e2bcd8739ae039(node) {
    if (node === $f4wJW.default(node) || !$euW85.isHTMLElement(node)) return $1ioQe.default(node);
    else return $ho3OU.default(node);
}

});
parcelRequire.register("ho3OU", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $ca87a422c6f17cc2$export$2e2bcd8739ae039; });
function $ca87a422c6f17cc2$export$2e2bcd8739ae039(element) {
    return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
    };
}

});



parcelRequire.register("cw4gM", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $91cbc90c6bda1c93$export$2e2bcd8739ae039; });

var $88cGx = parcelRequire("88cGx");
function $91cbc90c6bda1c93$var$order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function(modifier) {
        map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively
    function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function(dep) {
            if (!visited.has(dep)) {
                var depModifier = map.get(dep);
                if (depModifier) sort(depModifier);
            }
        });
        result.push(modifier);
    }
    modifiers.forEach(function(modifier) {
        if (!visited.has(modifier.name)) // check for visited object
        sort(modifier);
    });
    return result;
}
function $91cbc90c6bda1c93$export$2e2bcd8739ae039(modifiers) {
    // order based on dependencies
    var orderedModifiers = $91cbc90c6bda1c93$var$order(modifiers); // order based on phase
    return $88cGx.modifierPhases.reduce(function(acc, phase) {
        return acc.concat(orderedModifiers.filter(function(modifier) {
            return modifier.phase === phase;
        }));
    }, []);
}

});

parcelRequire.register("5CwJo", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $4179e413a8dc1988$export$2e2bcd8739ae039; });
function $4179e413a8dc1988$export$2e2bcd8739ae039(fn) {
    var pending;
    return function() {
        if (!pending) pending = new Promise(function(resolve) {
            Promise.resolve().then(function() {
                pending = undefined;
                resolve(fn());
            });
        });
        return pending;
    };
}

});

parcelRequire.register("jfxTE", function(module, exports) {

$parcel$export(module.exports, "default", function () { return $e039b6317025cc7d$export$2e2bcd8739ae039; });
function $e039b6317025cc7d$export$2e2bcd8739ae039(modifiers) {
    var merged1 = modifiers.reduce(function(merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
            options: Object.assign({}, existing.options, current.options),
            data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
    }, {}); // IE11 does not support Object.values
    return Object.keys(merged1).map(function(key) {
        return merged1[key];
    });
}

});


parcelRequire.register("dX9X6", function(module, exports) {

$parcel$export(module.exports, "createPopper", function () { return $a288815abd8fd683$export$8f7491d57c8f97a9; });

var $fR7p4 = parcelRequire("fR7p4");
var $ev9kE = parcelRequire("ev9kE");

var $gELNi = parcelRequire("gELNi");

var $lb5MU = parcelRequire("lb5MU");

var $1PfVV = parcelRequire("1PfVV");

var $i75eg = parcelRequire("i75eg");

var $djaL7 = parcelRequire("djaL7");

var $bFPrx = parcelRequire("bFPrx");

var $fXR4l = parcelRequire("fXR4l");

var $38EpB = parcelRequire("38EpB");

var $dtIGY = parcelRequire("dtIGY");


var $a288815abd8fd683$export$d34966752335dd47 = [
    $gELNi.default,
    $lb5MU.default,
    $1PfVV.default,
    $i75eg.default,
    $djaL7.default,
    $bFPrx.default,
    $fXR4l.default,
    $38EpB.default,
    $dtIGY.default
];
var $a288815abd8fd683$export$8f7491d57c8f97a9 = /*#__PURE__*/ $fR7p4.popperGenerator({
    defaultModifiers: $a288815abd8fd683$export$d34966752335dd47
}); // eslint-disable-next-line import/no-unused-modules

});

parcelRequire.register("tqOX8", function(module, exports) {

$parcel$export(module.exports, "createPopper", function () { return $0587839aae4ecc76$export$8f7491d57c8f97a9; });

var $fR7p4 = parcelRequire("fR7p4");
var $ev9kE = parcelRequire("ev9kE");

var $gELNi = parcelRequire("gELNi");

var $lb5MU = parcelRequire("lb5MU");

var $1PfVV = parcelRequire("1PfVV");

var $i75eg = parcelRequire("i75eg");
var $0587839aae4ecc76$export$d34966752335dd47 = [
    $gELNi.default,
    $lb5MU.default,
    $1PfVV.default,
    $i75eg.default
];
var $0587839aae4ecc76$export$8f7491d57c8f97a9 = /*#__PURE__*/ $fR7p4.popperGenerator({
    defaultModifiers: $0587839aae4ecc76$export$d34966752335dd47
}); // eslint-disable-next-line import/no-unused-modules

});


var $6a952502bd5a366b$exports = {};
function $99f71fbb6d299c4f$export$2e2bcd8739ae039(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}


function $3e7d710376864ec3$export$2e2bcd8739ae039(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
        ownKeys.forEach(function(key) {
            $99f71fbb6d299c4f$export$2e2bcd8739ae039(target, key, source[key]);
        });
    }
    return target;
}







/*!
  * Bootstrap modal.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    $6a952502bd5a366b$exports = factory((parcelRequire("hSYfs")), (parcelRequire("1j4M2")), (parcelRequire("1x0pq")), (parcelRequire("f323N")));
})(undefined, function(EventHandler, Manipulator, SelectorEngine, BaseComponent) {
    'use strict';
    const _interopDefaultLegacy = (e)=>e && typeof e === 'object' && 'default' in e ? e : {
            default: e
        }
    ;
    const EventHandler__default = /*#__PURE__*/ _interopDefaultLegacy(EventHandler);
    const Manipulator__default = /*#__PURE__*/ _interopDefaultLegacy(Manipulator);
    const SelectorEngine__default = /*#__PURE__*/ _interopDefaultLegacy(SelectorEngine);
    const BaseComponent__default = /*#__PURE__*/ _interopDefaultLegacy(BaseComponent);
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const MILLISECONDS_MULTIPLIER = 1000;
    const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)
    const toType = (obj)=>{
        if (obj === null || obj === undefined) return `${obj}`;
        return ({}).toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
    };
    const getSelector = (element)=>{
        let selector = element.getAttribute('data-bs-target');
        if (!selector || selector === '#') {
            let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
            // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
            // `document.querySelector` will rightfully complain it is invalid.
            // See https://github.com/twbs/bootstrap/issues/32273
            if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) return null;
             // Just in case some CMS puts out a full URL with the anchor appended
            if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) hrefAttr = `#${hrefAttr.split('#')[1]}`;
            selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
        }
        return selector;
    };
    const getElementFromSelector = (element)=>{
        const selector = getSelector(element);
        return selector ? document.querySelector(selector) : null;
    };
    const getTransitionDurationFromElement = (element)=>{
        if (!element) return 0;
         // Get transition-duration of the element
        let { transitionDuration: transitionDuration , transitionDelay: transitionDelay  } = window.getComputedStyle(element);
        const floatTransitionDuration = Number.parseFloat(transitionDuration);
        const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found
        if (!floatTransitionDuration && !floatTransitionDelay) return 0;
         // If multiple durations are defined, take the first
        transitionDuration = transitionDuration.split(',')[0];
        transitionDelay = transitionDelay.split(',')[0];
        return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    };
    const triggerTransitionEnd = (element)=>{
        element.dispatchEvent(new Event(TRANSITION_END));
    };
    const isElement = (obj)=>{
        if (!obj || typeof obj !== 'object') return false;
        if (typeof obj.jquery !== 'undefined') obj = obj[0];
        return typeof obj.nodeType !== 'undefined';
    };
    const getElement = (obj)=>{
        if (isElement(obj)) // it's a jQuery object or a node element
        return obj.jquery ? obj[0] : obj;
        if (typeof obj === 'string' && obj.length > 0) return document.querySelector(obj);
        return null;
    };
    const typeCheckConfig = (componentName, config, configTypes)=>{
        Object.keys(configTypes).forEach((property)=>{
            const expectedTypes = configTypes[property];
            const value = config[property];
            const valueType = value && isElement(value) ? 'element' : toType(value);
            if (!new RegExp(expectedTypes).test(valueType)) throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
        });
    };
    const isVisible = (element)=>{
        if (!isElement(element) || element.getClientRects().length === 0) return false;
        return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    };
    const isDisabled = (element)=>{
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
        if (element.classList.contains('disabled')) return true;
        if (typeof element.disabled !== 'undefined') return element.disabled;
        return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
    };
    /**
   * Trick to restart an element's animation
   *
   * @param {HTMLElement} element
   * @return void
   *
   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
   */ const reflow = (element)=>{
        // eslint-disable-next-line no-unused-expressions
        element.offsetHeight;
    };
    const getjQuery = ()=>{
        const { jQuery: jQuery  } = window;
        if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) return jQuery;
        return null;
    };
    const DOMContentLoadedCallbacks = [];
    const onDOMContentLoaded = (callback1)=>{
        if (document.readyState === 'loading') {
            // add listener on the first call when the document is in loading state
            if (!DOMContentLoadedCallbacks.length) document.addEventListener('DOMContentLoaded', ()=>{
                DOMContentLoadedCallbacks.forEach((callback)=>callback()
                );
            });
            DOMContentLoadedCallbacks.push(callback1);
        } else callback1();
    };
    const isRTL = ()=>document.documentElement.dir === 'rtl'
    ;
    const defineJQueryPlugin = (plugin)=>{
        onDOMContentLoaded(()=>{
            const $ = getjQuery();
            /* istanbul ignore if */ if ($) {
                const name = plugin.NAME;
                const JQUERY_NO_CONFLICT = $.fn[name];
                $.fn[name] = plugin.jQueryInterface;
                $.fn[name].Constructor = plugin;
                $.fn[name].noConflict = ()=>{
                    $.fn[name] = JQUERY_NO_CONFLICT;
                    return plugin.jQueryInterface;
                };
            }
        });
    };
    const execute = (callback)=>{
        if (typeof callback === 'function') callback();
    };
    const executeAfterTransition = (callback, transitionElement, waitForTransition = true)=>{
        if (!waitForTransition) {
            execute(callback);
            return;
        }
        const durationPadding = 5;
        const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
        let called = false;
        const handler = ({ target: target  })=>{
            if (target !== transitionElement) return;
            called = true;
            transitionElement.removeEventListener(TRANSITION_END, handler);
            execute(callback);
        };
        transitionElement.addEventListener(TRANSITION_END, handler);
        setTimeout(()=>{
            if (!called) triggerTransitionEnd(transitionElement);
        }, emulatedDuration);
    };
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
    const SELECTOR_STICKY_CONTENT = '.sticky-top';
    class ScrollBarHelper {
        getWidth() {
            // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
            const documentWidth = document.documentElement.clientWidth;
            return Math.abs(window.innerWidth - documentWidth);
        }
        hide() {
            const width = this.getWidth();
            this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width
            this._setElementAttributes(this._element, 'paddingRight', (calculatedValue)=>calculatedValue + width
            ); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
            this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', (calculatedValue)=>calculatedValue + width
            );
            this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', (calculatedValue)=>calculatedValue - width
            );
        }
        _disableOverFlow() {
            this._saveInitialAttribute(this._element, 'overflow');
            this._element.style.overflow = 'hidden';
        }
        _setElementAttributes(selector, styleProp, callback) {
            const scrollbarWidth = this.getWidth();
            const manipulationCallBack = (element)=>{
                if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) return;
                this._saveInitialAttribute(element, styleProp);
                const calculatedValue = window.getComputedStyle(element)[styleProp];
                element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
            };
            this._applyManipulationCallback(selector, manipulationCallBack);
        }
        reset() {
            this._resetElementAttributes(this._element, 'overflow');
            this._resetElementAttributes(this._element, 'paddingRight');
            this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');
            this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
        }
        _saveInitialAttribute(element, styleProp) {
            const actualValue = element.style[styleProp];
            if (actualValue) Manipulator__default.default.setDataAttribute(element, styleProp, actualValue);
        }
        _resetElementAttributes(selector, styleProp) {
            const manipulationCallBack = (element)=>{
                const value = Manipulator__default.default.getDataAttribute(element, styleProp);
                if (typeof value === 'undefined') element.style.removeProperty(styleProp);
                else {
                    Manipulator__default.default.removeDataAttribute(element, styleProp);
                    element.style[styleProp] = value;
                }
            };
            this._applyManipulationCallback(selector, manipulationCallBack);
        }
        _applyManipulationCallback(selector, callBack) {
            if (isElement(selector)) callBack(selector);
            else SelectorEngine__default.default.find(selector, this._element).forEach(callBack);
        }
        isOverflowing() {
            return this.getWidth() > 0;
        }
        constructor(){
            this._element = document.body;
        }
    }
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const Default$2 = {
        className: 'modal-backdrop',
        isVisible: true,
        // if false, we use the backdrop helper without adding any element to the dom
        isAnimated: false,
        rootElement: 'body',
        // give the choice to place backdrop under different elements
        clickCallback: null
    };
    const DefaultType$2 = {
        className: 'string',
        isVisible: 'boolean',
        isAnimated: 'boolean',
        rootElement: '(element|string)',
        clickCallback: '(function|null)'
    };
    const NAME$2 = 'backdrop';
    const CLASS_NAME_FADE$1 = 'fade';
    const CLASS_NAME_SHOW$1 = 'show';
    const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$2}`;
    class Backdrop {
        show(callback) {
            if (!this._config.isVisible) {
                execute(callback);
                return;
            }
            this._append();
            if (this._config.isAnimated) reflow(this._getElement());
            this._getElement().classList.add(CLASS_NAME_SHOW$1);
            this._emulateAnimation(()=>{
                execute(callback);
            });
        }
        hide(callback) {
            if (!this._config.isVisible) {
                execute(callback);
                return;
            }
            this._getElement().classList.remove(CLASS_NAME_SHOW$1);
            this._emulateAnimation(()=>{
                this.dispose();
                execute(callback);
            });
        }
        _getElement() {
            if (!this._element) {
                const backdrop = document.createElement('div');
                backdrop.className = this._config.className;
                if (this._config.isAnimated) backdrop.classList.add(CLASS_NAME_FADE$1);
                this._element = backdrop;
            }
            return this._element;
        }
        _getConfig(config) {
            config = $3e7d710376864ec3$export$2e2bcd8739ae039({}, Default$2, typeof config === 'object' ? config : {}); // use getElement() with the default "body" to get a fresh Element on each instantiation
            config.rootElement = getElement(config.rootElement);
            typeCheckConfig(NAME$2, config, DefaultType$2);
            return config;
        }
        _append() {
            if (this._isAppended) return;
            this._config.rootElement.append(this._getElement());
            EventHandler__default.default.on(this._getElement(), EVENT_MOUSEDOWN, ()=>{
                execute(this._config.clickCallback);
            });
            this._isAppended = true;
        }
        dispose() {
            if (!this._isAppended) return;
            EventHandler__default.default.off(this._element, EVENT_MOUSEDOWN);
            this._element.remove();
            this._isAppended = false;
        }
        _emulateAnimation(callback) {
            executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
        }
        constructor(config){
            this._config = this._getConfig(config);
            this._isAppended = false;
            this._element = null;
        }
    }
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/focustrap.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const Default$1 = {
        trapElement: null,
        // The element to trap focus inside of
        autofocus: true
    };
    const DefaultType$1 = {
        trapElement: 'element',
        autofocus: 'boolean'
    };
    const NAME$1 = 'focustrap';
    const DATA_KEY$1 = 'bs.focustrap';
    const EVENT_KEY$1 = `.${DATA_KEY$1}`;
    const EVENT_FOCUSIN = `focusin${EVENT_KEY$1}`;
    const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$1}`;
    const TAB_KEY = 'Tab';
    const TAB_NAV_FORWARD = 'forward';
    const TAB_NAV_BACKWARD = 'backward';
    class FocusTrap {
        activate() {
            const { trapElement: trapElement , autofocus: autofocus  } = this._config;
            if (this._isActive) return;
            if (autofocus) trapElement.focus();
            EventHandler__default.default.off(document, EVENT_KEY$1); // guard against infinite focus loop
            EventHandler__default.default.on(document, EVENT_FOCUSIN, (event)=>this._handleFocusin(event)
            );
            EventHandler__default.default.on(document, EVENT_KEYDOWN_TAB, (event)=>this._handleKeydown(event)
            );
            this._isActive = true;
        }
        deactivate() {
            if (!this._isActive) return;
            this._isActive = false;
            EventHandler__default.default.off(document, EVENT_KEY$1);
        }
        _handleFocusin(event) {
            const { target: target  } = event;
            const { trapElement: trapElement  } = this._config;
            if (target === document || target === trapElement || trapElement.contains(target)) return;
            const elements = SelectorEngine__default.default.focusableChildren(trapElement);
            if (elements.length === 0) trapElement.focus();
            else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) elements[elements.length - 1].focus();
            else elements[0].focus();
        }
        _handleKeydown(event) {
            if (event.key !== TAB_KEY) return;
            this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
        }
        _getConfig(config) {
            config = $3e7d710376864ec3$export$2e2bcd8739ae039({}, Default$1, typeof config === 'object' ? config : {});
            typeCheckConfig(NAME$1, config, DefaultType$1);
            return config;
        }
        constructor(config){
            this._config = this._getConfig(config);
            this._isActive = false;
            this._lastTabNavDirection = null;
        }
    }
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/component-functions.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const enableDismissTrigger = (component, method = 'hide')=>{
        const clickEvent = `click.dismiss${component.EVENT_KEY}`;
        const name = component.NAME;
        EventHandler__default.default.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
            if ([
                'A',
                'AREA'
            ].includes(this.tagName)) event.preventDefault();
            if (isDisabled(this)) return;
            const target = getElementFromSelector(this) || this.closest(`.${name}`);
            const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
            instance[method]();
        });
    };
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */ const NAME = 'modal';
    const DATA_KEY = 'bs.modal';
    const EVENT_KEY = `.${DATA_KEY}`;
    const DATA_API_KEY = '.data-api';
    const ESCAPE_KEY = 'Escape';
    const Default = {
        backdrop: true,
        keyboard: true,
        focus: true
    };
    const DefaultType = {
        backdrop: '(boolean|string)',
        keyboard: 'boolean',
        focus: 'boolean'
    };
    const EVENT_HIDE = `hide${EVENT_KEY}`;
    const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
    const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
    const EVENT_SHOW = `show${EVENT_KEY}`;
    const EVENT_SHOWN = `shown${EVENT_KEY}`;
    const EVENT_RESIZE = `resize${EVENT_KEY}`;
    const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
    const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
    const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY}`;
    const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
    const CLASS_NAME_OPEN = 'modal-open';
    const CLASS_NAME_FADE = 'fade';
    const CLASS_NAME_SHOW = 'show';
    const CLASS_NAME_STATIC = 'modal-static';
    const OPEN_SELECTOR = '.modal.show';
    const SELECTOR_DIALOG = '.modal-dialog';
    const SELECTOR_MODAL_BODY = '.modal-body';
    const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="modal"]';
    /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */ class Modal extends BaseComponent__default.default {
        static get Default() {
            return Default;
        }
        static get NAME() {
            return NAME;
        }
        toggle(relatedTarget) {
            return this._isShown ? this.hide() : this.show(relatedTarget);
        }
        show(relatedTarget) {
            if (this._isShown || this._isTransitioning) return;
            const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW, {
                relatedTarget: relatedTarget
            });
            if (showEvent.defaultPrevented) return;
            this._isShown = true;
            if (this._isAnimated()) this._isTransitioning = true;
            this._scrollBar.hide();
            document.body.classList.add(CLASS_NAME_OPEN);
            this._adjustDialog();
            this._setEscapeEvent();
            this._setResizeEvent();
            EventHandler__default.default.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, ()=>{
                EventHandler__default.default.one(this._element, EVENT_MOUSEUP_DISMISS, (event)=>{
                    if (event.target === this._element) this._ignoreBackdropClick = true;
                });
            });
            this._showBackdrop(()=>this._showElement(relatedTarget)
            );
        }
        hide() {
            if (!this._isShown || this._isTransitioning) return;
            const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE);
            if (hideEvent.defaultPrevented) return;
            this._isShown = false;
            const isAnimated = this._isAnimated();
            if (isAnimated) this._isTransitioning = true;
            this._setEscapeEvent();
            this._setResizeEvent();
            this._focustrap.deactivate();
            this._element.classList.remove(CLASS_NAME_SHOW);
            EventHandler__default.default.off(this._element, EVENT_CLICK_DISMISS);
            EventHandler__default.default.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);
            this._queueCallback(()=>this._hideModal()
            , this._element, isAnimated);
        }
        dispose() {
            [
                window,
                this._dialog
            ].forEach((htmlElement)=>EventHandler__default.default.off(htmlElement, EVENT_KEY)
            );
            this._backdrop.dispose();
            this._focustrap.deactivate();
            super.dispose();
        }
        handleUpdate() {
            this._adjustDialog();
        }
        _initializeBackDrop() {
            return new Backdrop({
                isVisible: Boolean(this._config.backdrop),
                // 'static' option will be translated to true, and booleans will keep their value
                isAnimated: this._isAnimated()
            });
        }
        _initializeFocusTrap() {
            return new FocusTrap({
                trapElement: this._element
            });
        }
        _getConfig(config) {
            config = $3e7d710376864ec3$export$2e2bcd8739ae039({}, Default, Manipulator__default.default.getDataAttributes(this._element), typeof config === 'object' ? config : {});
            typeCheckConfig(NAME, config, DefaultType);
            return config;
        }
        _showElement(relatedTarget) {
            const isAnimated = this._isAnimated();
            const modalBody = SelectorEngine__default.default.findOne(SELECTOR_MODAL_BODY, this._dialog);
            if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) // Don't move modal's DOM position
            document.body.append(this._element);
            this._element.style.display = 'block';
            this._element.removeAttribute('aria-hidden');
            this._element.setAttribute('aria-modal', true);
            this._element.setAttribute('role', 'dialog');
            this._element.scrollTop = 0;
            if (modalBody) modalBody.scrollTop = 0;
            if (isAnimated) reflow(this._element);
            this._element.classList.add(CLASS_NAME_SHOW);
            const transitionComplete = ()=>{
                if (this._config.focus) this._focustrap.activate();
                this._isTransitioning = false;
                EventHandler__default.default.trigger(this._element, EVENT_SHOWN, {
                    relatedTarget: relatedTarget
                });
            };
            this._queueCallback(transitionComplete, this._dialog, isAnimated);
        }
        _setEscapeEvent() {
            if (this._isShown) EventHandler__default.default.on(this._element, EVENT_KEYDOWN_DISMISS, (event)=>{
                if (this._config.keyboard && event.key === ESCAPE_KEY) {
                    event.preventDefault();
                    this.hide();
                } else if (!this._config.keyboard && event.key === ESCAPE_KEY) this._triggerBackdropTransition();
            });
            else EventHandler__default.default.off(this._element, EVENT_KEYDOWN_DISMISS);
        }
        _setResizeEvent() {
            if (this._isShown) EventHandler__default.default.on(window, EVENT_RESIZE, ()=>this._adjustDialog()
            );
            else EventHandler__default.default.off(window, EVENT_RESIZE);
        }
        _hideModal() {
            this._element.style.display = 'none';
            this._element.setAttribute('aria-hidden', true);
            this._element.removeAttribute('aria-modal');
            this._element.removeAttribute('role');
            this._isTransitioning = false;
            this._backdrop.hide(()=>{
                document.body.classList.remove(CLASS_NAME_OPEN);
                this._resetAdjustments();
                this._scrollBar.reset();
                EventHandler__default.default.trigger(this._element, EVENT_HIDDEN);
            });
        }
        _showBackdrop(callback) {
            EventHandler__default.default.on(this._element, EVENT_CLICK_DISMISS, (event)=>{
                if (this._ignoreBackdropClick) {
                    this._ignoreBackdropClick = false;
                    return;
                }
                if (event.target !== event.currentTarget) return;
                if (this._config.backdrop === true) this.hide();
                else if (this._config.backdrop === 'static') this._triggerBackdropTransition();
            });
            this._backdrop.show(callback);
        }
        _isAnimated() {
            return this._element.classList.contains(CLASS_NAME_FADE);
        }
        _triggerBackdropTransition() {
            const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE_PREVENTED);
            if (hideEvent.defaultPrevented) return;
            const { classList: classList , scrollHeight: scrollHeight , style: style  } = this._element;
            const isModalOverflowing = scrollHeight > document.documentElement.clientHeight; // return if the following background transition hasn't yet completed
            if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) return;
            if (!isModalOverflowing) style.overflowY = 'hidden';
            classList.add(CLASS_NAME_STATIC);
            this._queueCallback(()=>{
                classList.remove(CLASS_NAME_STATIC);
                if (!isModalOverflowing) this._queueCallback(()=>{
                    style.overflowY = '';
                }, this._dialog);
            }, this._dialog);
            this._element.focus();
        }
        // the following methods are used to handle overflowing modals
        // ----------------------------------------------------------------------
        _adjustDialog() {
            const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
            const scrollbarWidth = this._scrollBar.getWidth();
            const isBodyOverflowing = scrollbarWidth > 0;
            if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) this._element.style.paddingLeft = `${scrollbarWidth}px`;
            if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) this._element.style.paddingRight = `${scrollbarWidth}px`;
        }
        _resetAdjustments() {
            this._element.style.paddingLeft = '';
            this._element.style.paddingRight = '';
        }
        static jQueryInterface(config, relatedTarget) {
            return this.each(function() {
                const data = Modal.getOrCreateInstance(this, config);
                if (typeof config !== 'string') return;
                if (typeof data[config] === 'undefined') throw new TypeError(`No method named "${config}"`);
                data[config](relatedTarget);
            });
        }
        constructor(element, config){
            super(element);
            this._config = this._getConfig(config);
            this._dialog = SelectorEngine__default.default.findOne(SELECTOR_DIALOG, this._element);
            this._backdrop = this._initializeBackDrop();
            this._focustrap = this._initializeFocusTrap();
            this._isShown = false;
            this._ignoreBackdropClick = false;
            this._isTransitioning = false;
            this._scrollBar = new ScrollBarHelper();
        }
    }
    /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */ EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
        const target = getElementFromSelector(this);
        if ([
            'A',
            'AREA'
        ].includes(this.tagName)) event.preventDefault();
        EventHandler__default.default.one(target, EVENT_SHOW, (showEvent)=>{
            if (showEvent.defaultPrevented) // only register focus restorer if modal will actually get shown
            return;
            EventHandler__default.default.one(target, EVENT_HIDDEN, ()=>{
                if (isVisible(this)) this.focus();
            });
        }); // avoid conflict when clicking moddal toggler while another one is open
        const allReadyOpen = SelectorEngine__default.default.findOne(OPEN_SELECTOR);
        if (allReadyOpen) Modal.getInstance(allReadyOpen).hide();
        const data = Modal.getOrCreateInstance(target);
        data.toggle(this);
    });
    enableDismissTrigger(Modal);
    /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Modal to jQuery only if jQuery is present
   */ defineJQueryPlugin(Modal);
    return Modal;
});


var $7be44d29b417a6dc$exports = {};


/*!
  * Bootstrap alert.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    $7be44d29b417a6dc$exports = factory((parcelRequire("hSYfs")), (parcelRequire("f323N")));
})($7be44d29b417a6dc$exports, function(EventHandler, BaseComponent) {
    'use strict';
    const _interopDefaultLegacy = (e)=>e && typeof e === 'object' && 'default' in e ? e : {
            default: e
        }
    ;
    const EventHandler__default = /*#__PURE__*/ _interopDefaultLegacy(EventHandler);
    const BaseComponent__default = /*#__PURE__*/ _interopDefaultLegacy(BaseComponent);
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const getSelector = (element)=>{
        let selector = element.getAttribute('data-bs-target');
        if (!selector || selector === '#') {
            let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
            // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
            // `document.querySelector` will rightfully complain it is invalid.
            // See https://github.com/twbs/bootstrap/issues/32273
            if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) return null;
             // Just in case some CMS puts out a full URL with the anchor appended
            if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) hrefAttr = `#${hrefAttr.split('#')[1]}`;
            selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
        }
        return selector;
    };
    const getElementFromSelector = (element)=>{
        const selector = getSelector(element);
        return selector ? document.querySelector(selector) : null;
    };
    const isDisabled = (element)=>{
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
        if (element.classList.contains('disabled')) return true;
        if (typeof element.disabled !== 'undefined') return element.disabled;
        return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
    };
    const getjQuery = ()=>{
        const { jQuery: jQuery  } = window;
        if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) return jQuery;
        return null;
    };
    const DOMContentLoadedCallbacks = [];
    const onDOMContentLoaded = (callback1)=>{
        if (document.readyState === 'loading') {
            // add listener on the first call when the document is in loading state
            if (!DOMContentLoadedCallbacks.length) document.addEventListener('DOMContentLoaded', ()=>{
                DOMContentLoadedCallbacks.forEach((callback)=>callback()
                );
            });
            DOMContentLoadedCallbacks.push(callback1);
        } else callback1();
    };
    const defineJQueryPlugin = (plugin)=>{
        onDOMContentLoaded(()=>{
            const $ = getjQuery();
            /* istanbul ignore if */ if ($) {
                const name = plugin.NAME;
                const JQUERY_NO_CONFLICT = $.fn[name];
                $.fn[name] = plugin.jQueryInterface;
                $.fn[name].Constructor = plugin;
                $.fn[name].noConflict = ()=>{
                    $.fn[name] = JQUERY_NO_CONFLICT;
                    return plugin.jQueryInterface;
                };
            }
        });
    };
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/component-functions.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const enableDismissTrigger = (component, method = 'hide')=>{
        const clickEvent = `click.dismiss${component.EVENT_KEY}`;
        const name = component.NAME;
        EventHandler__default.default.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
            if ([
                'A',
                'AREA'
            ].includes(this.tagName)) event.preventDefault();
            if (isDisabled(this)) return;
            const target = getElementFromSelector(this) || this.closest(`.${name}`);
            const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
            instance[method]();
        });
    };
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */ const NAME = 'alert';
    const DATA_KEY = 'bs.alert';
    const EVENT_KEY = `.${DATA_KEY}`;
    const EVENT_CLOSE = `close${EVENT_KEY}`;
    const EVENT_CLOSED = `closed${EVENT_KEY}`;
    const CLASS_NAME_FADE = 'fade';
    const CLASS_NAME_SHOW = 'show';
    /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */ class Alert extends BaseComponent__default.default {
        // Getters
        static get NAME() {
            return NAME;
        }
        close() {
            const closeEvent = EventHandler__default.default.trigger(this._element, EVENT_CLOSE);
            if (closeEvent.defaultPrevented) return;
            this._element.classList.remove(CLASS_NAME_SHOW);
            const isAnimated = this._element.classList.contains(CLASS_NAME_FADE);
            this._queueCallback(()=>this._destroyElement()
            , this._element, isAnimated);
        }
        _destroyElement() {
            this._element.remove();
            EventHandler__default.default.trigger(this._element, EVENT_CLOSED);
            this.dispose();
        }
        static jQueryInterface(config) {
            return this.each(function() {
                const data = Alert.getOrCreateInstance(this);
                if (typeof config !== 'string') return;
                if (data[config] === undefined || config.startsWith('_') || config === 'constructor') throw new TypeError(`No method named "${config}"`);
                data[config](this);
            });
        }
    }
    /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */ enableDismissTrigger(Alert, 'close');
    /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Alert to jQuery only if jQuery is present
   */ defineJQueryPlugin(Alert);
    return Alert;
});


var $10dbfefe44d02411$exports = {};


/*!
  * Bootstrap button.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    $10dbfefe44d02411$exports = factory((parcelRequire("hSYfs")), (parcelRequire("f323N")));
})($10dbfefe44d02411$exports, function(EventHandler, BaseComponent) {
    'use strict';
    const _interopDefaultLegacy = (e)=>e && typeof e === 'object' && 'default' in e ? e : {
            default: e
        }
    ;
    const EventHandler__default = /*#__PURE__*/ _interopDefaultLegacy(EventHandler);
    const BaseComponent__default = /*#__PURE__*/ _interopDefaultLegacy(BaseComponent);
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const getjQuery = ()=>{
        const { jQuery: jQuery  } = window;
        if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) return jQuery;
        return null;
    };
    const DOMContentLoadedCallbacks = [];
    const onDOMContentLoaded = (callback1)=>{
        if (document.readyState === 'loading') {
            // add listener on the first call when the document is in loading state
            if (!DOMContentLoadedCallbacks.length) document.addEventListener('DOMContentLoaded', ()=>{
                DOMContentLoadedCallbacks.forEach((callback)=>callback()
                );
            });
            DOMContentLoadedCallbacks.push(callback1);
        } else callback1();
    };
    const defineJQueryPlugin = (plugin)=>{
        onDOMContentLoaded(()=>{
            const $ = getjQuery();
            /* istanbul ignore if */ if ($) {
                const name = plugin.NAME;
                const JQUERY_NO_CONFLICT = $.fn[name];
                $.fn[name] = plugin.jQueryInterface;
                $.fn[name].Constructor = plugin;
                $.fn[name].noConflict = ()=>{
                    $.fn[name] = JQUERY_NO_CONFLICT;
                    return plugin.jQueryInterface;
                };
            }
        });
    };
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */ const NAME = 'button';
    const DATA_KEY = 'bs.button';
    const EVENT_KEY = `.${DATA_KEY}`;
    const DATA_API_KEY = '.data-api';
    const CLASS_NAME_ACTIVE = 'active';
    const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="button"]';
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
    /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */ class Button extends BaseComponent__default.default {
        // Getters
        static get NAME() {
            return NAME;
        }
        toggle() {
            // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
            this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE));
        }
        static jQueryInterface(config) {
            return this.each(function() {
                const data = Button.getOrCreateInstance(this);
                if (config === 'toggle') data[config]();
            });
        }
    }
    /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */ EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, (event)=>{
        event.preventDefault();
        const button = event.target.closest(SELECTOR_DATA_TOGGLE);
        const data = Button.getOrCreateInstance(button);
        data.toggle();
    });
    /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Button to jQuery only if jQuery is present
   */ defineJQueryPlugin(Button);
    return Button;
});


var $271fff3f2a38a33f$exports = {};





/*!
  * Bootstrap carousel.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    $271fff3f2a38a33f$exports = factory((parcelRequire("hSYfs")), (parcelRequire("1j4M2")), (parcelRequire("1x0pq")), (parcelRequire("f323N")));
})(undefined, function(EventHandler, Manipulator, SelectorEngine, BaseComponent) {
    'use strict';
    const _interopDefaultLegacy = (e)=>e && typeof e === 'object' && 'default' in e ? e : {
            default: e
        }
    ;
    const EventHandler__default = /*#__PURE__*/ _interopDefaultLegacy(EventHandler);
    const Manipulator__default = /*#__PURE__*/ _interopDefaultLegacy(Manipulator);
    const SelectorEngine__default = /*#__PURE__*/ _interopDefaultLegacy(SelectorEngine);
    const BaseComponent__default = /*#__PURE__*/ _interopDefaultLegacy(BaseComponent);
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)
    const toType = (obj)=>{
        if (obj === null || obj === undefined) return `${obj}`;
        return ({}).toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
    };
    const getSelector = (element)=>{
        let selector = element.getAttribute('data-bs-target');
        if (!selector || selector === '#') {
            let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
            // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
            // `document.querySelector` will rightfully complain it is invalid.
            // See https://github.com/twbs/bootstrap/issues/32273
            if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) return null;
             // Just in case some CMS puts out a full URL with the anchor appended
            if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) hrefAttr = `#${hrefAttr.split('#')[1]}`;
            selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
        }
        return selector;
    };
    const getElementFromSelector = (element)=>{
        const selector = getSelector(element);
        return selector ? document.querySelector(selector) : null;
    };
    const triggerTransitionEnd = (element)=>{
        element.dispatchEvent(new Event(TRANSITION_END));
    };
    const isElement = (obj)=>{
        if (!obj || typeof obj !== 'object') return false;
        if (typeof obj.jquery !== 'undefined') obj = obj[0];
        return typeof obj.nodeType !== 'undefined';
    };
    const typeCheckConfig = (componentName, config, configTypes)=>{
        Object.keys(configTypes).forEach((property)=>{
            const expectedTypes = configTypes[property];
            const value = config[property];
            const valueType = value && isElement(value) ? 'element' : toType(value);
            if (!new RegExp(expectedTypes).test(valueType)) throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
        });
    };
    const isVisible = (element)=>{
        if (!isElement(element) || element.getClientRects().length === 0) return false;
        return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    };
    /**
   * Trick to restart an element's animation
   *
   * @param {HTMLElement} element
   * @return void
   *
   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
   */ const reflow = (element)=>{
        // eslint-disable-next-line no-unused-expressions
        element.offsetHeight;
    };
    const getjQuery = ()=>{
        const { jQuery: jQuery  } = window;
        if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) return jQuery;
        return null;
    };
    const DOMContentLoadedCallbacks = [];
    const onDOMContentLoaded = (callback1)=>{
        if (document.readyState === 'loading') {
            // add listener on the first call when the document is in loading state
            if (!DOMContentLoadedCallbacks.length) document.addEventListener('DOMContentLoaded', ()=>{
                DOMContentLoadedCallbacks.forEach((callback)=>callback()
                );
            });
            DOMContentLoadedCallbacks.push(callback1);
        } else callback1();
    };
    const isRTL = ()=>document.documentElement.dir === 'rtl'
    ;
    const defineJQueryPlugin = (plugin)=>{
        onDOMContentLoaded(()=>{
            const $ = getjQuery();
            /* istanbul ignore if */ if ($) {
                const name = plugin.NAME;
                const JQUERY_NO_CONFLICT = $.fn[name];
                $.fn[name] = plugin.jQueryInterface;
                $.fn[name].Constructor = plugin;
                $.fn[name].noConflict = ()=>{
                    $.fn[name] = JQUERY_NO_CONFLICT;
                    return plugin.jQueryInterface;
                };
            }
        });
    };
    /**
   * Return the previous/next element of a list.
   *
   * @param {array} list    The list of elements
   * @param activeElement   The active element
   * @param shouldGetNext   Choose to get next or previous element
   * @param isCycleAllowed
   * @return {Element|elem} The proper element
   */ const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed)=>{
        let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed
        if (index === -1) return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
        const listLength = list.length;
        index += shouldGetNext ? 1 : -1;
        if (isCycleAllowed) index = (index + listLength) % listLength;
        return list[Math.max(0, Math.min(index, listLength - 1))];
    };
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */ const NAME = 'carousel';
    const DATA_KEY = 'bs.carousel';
    const EVENT_KEY = `.${DATA_KEY}`;
    const DATA_API_KEY = '.data-api';
    const ARROW_LEFT_KEY = 'ArrowLeft';
    const ARROW_RIGHT_KEY = 'ArrowRight';
    const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch
    const SWIPE_THRESHOLD = 40;
    const Default = {
        interval: 5000,
        keyboard: true,
        slide: false,
        pause: 'hover',
        wrap: true,
        touch: true
    };
    const DefaultType = {
        interval: '(number|boolean)',
        keyboard: 'boolean',
        slide: '(boolean|string)',
        pause: '(string|boolean)',
        wrap: 'boolean',
        touch: 'boolean'
    };
    const ORDER_NEXT = 'next';
    const ORDER_PREV = 'prev';
    const DIRECTION_LEFT = 'left';
    const DIRECTION_RIGHT = 'right';
    const KEY_TO_DIRECTION = {
        [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
        [ARROW_RIGHT_KEY]: DIRECTION_LEFT
    };
    const EVENT_SLIDE = `slide${EVENT_KEY}`;
    const EVENT_SLID = `slid${EVENT_KEY}`;
    const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
    const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`;
    const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`;
    const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`;
    const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`;
    const EVENT_TOUCHEND = `touchend${EVENT_KEY}`;
    const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
    const EVENT_POINTERUP = `pointerup${EVENT_KEY}`;
    const EVENT_DRAG_START = `dragstart${EVENT_KEY}`;
    const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
    const CLASS_NAME_CAROUSEL = 'carousel';
    const CLASS_NAME_ACTIVE = 'active';
    const CLASS_NAME_SLIDE = 'slide';
    const CLASS_NAME_END = 'carousel-item-end';
    const CLASS_NAME_START = 'carousel-item-start';
    const CLASS_NAME_NEXT = 'carousel-item-next';
    const CLASS_NAME_PREV = 'carousel-item-prev';
    const CLASS_NAME_POINTER_EVENT = 'pointer-event';
    const SELECTOR_ACTIVE = '.active';
    const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
    const SELECTOR_ITEM = '.carousel-item';
    const SELECTOR_ITEM_IMG = '.carousel-item img';
    const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
    const SELECTOR_INDICATORS = '.carousel-indicators';
    const SELECTOR_INDICATOR = '[data-bs-target]';
    const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
    const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
    const POINTER_TYPE_TOUCH = 'touch';
    const POINTER_TYPE_PEN = 'pen';
    /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */ class Carousel extends BaseComponent__default.default {
        static get Default() {
            return Default;
        }
        static get NAME() {
            return NAME;
        }
        next() {
            this._slide(ORDER_NEXT);
        }
        nextWhenVisible() {
            // Don't call next when the page isn't visible
            // or the carousel or its parent isn't visible
            if (!document.hidden && isVisible(this._element)) this.next();
        }
        prev() {
            this._slide(ORDER_PREV);
        }
        pause(event) {
            if (!event) this._isPaused = true;
            if (SelectorEngine__default.default.findOne(SELECTOR_NEXT_PREV, this._element)) {
                triggerTransitionEnd(this._element);
                this.cycle(true);
            }
            clearInterval(this._interval);
            this._interval = null;
        }
        cycle(event) {
            if (!event) this._isPaused = false;
            if (this._interval) {
                clearInterval(this._interval);
                this._interval = null;
            }
            if (this._config && this._config.interval && !this._isPaused) {
                this._updateInterval();
                this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
            }
        }
        to(index) {
            this._activeElement = SelectorEngine__default.default.findOne(SELECTOR_ACTIVE_ITEM, this._element);
            const activeIndex = this._getItemIndex(this._activeElement);
            if (index > this._items.length - 1 || index < 0) return;
            if (this._isSliding) {
                EventHandler__default.default.one(this._element, EVENT_SLID, ()=>this.to(index)
                );
                return;
            }
            if (activeIndex === index) {
                this.pause();
                this.cycle();
                return;
            }
            const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
            this._slide(order, this._items[index]);
        }
        _getConfig(config) {
            config = $3e7d710376864ec3$export$2e2bcd8739ae039({}, Default, Manipulator__default.default.getDataAttributes(this._element), typeof config === 'object' ? config : {});
            typeCheckConfig(NAME, config, DefaultType);
            return config;
        }
        _handleSwipe() {
            const absDeltax = Math.abs(this.touchDeltaX);
            if (absDeltax <= SWIPE_THRESHOLD) return;
            const direction = absDeltax / this.touchDeltaX;
            this.touchDeltaX = 0;
            if (!direction) return;
            this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
        }
        _addEventListeners() {
            if (this._config.keyboard) EventHandler__default.default.on(this._element, EVENT_KEYDOWN, (event)=>this._keydown(event)
            );
            if (this._config.pause === 'hover') {
                EventHandler__default.default.on(this._element, EVENT_MOUSEENTER, (event)=>this.pause(event)
                );
                EventHandler__default.default.on(this._element, EVENT_MOUSELEAVE, (event)=>this.cycle(event)
                );
            }
            if (this._config.touch && this._touchSupported) this._addTouchEventListeners();
        }
        _addTouchEventListeners() {
            const hasPointerPenTouch = (event)=>{
                return this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
            };
            const start = (event)=>{
                if (hasPointerPenTouch(event)) this.touchStartX = event.clientX;
                else if (!this._pointerEvent) this.touchStartX = event.touches[0].clientX;
            };
            const move = (event)=>{
                // ensure swiping with one touch and not pinching
                this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
            };
            const end = (event1)=>{
                if (hasPointerPenTouch(event1)) this.touchDeltaX = event1.clientX - this.touchStartX;
                this._handleSwipe();
                if (this._config.pause === 'hover') {
                    // If it's a touch-enabled device, mouseenter/leave are fired as
                    // part of the mouse compatibility events on first tap - the carousel
                    // would stop cycling until user tapped out of it;
                    // here, we listen for touchend, explicitly pause the carousel
                    // (as if it's the second time we tap on it, mouseenter compat event
                    // is NOT fired) and after a timeout (to allow for mouse compatibility
                    // events to fire) we explicitly restart cycling
                    this.pause();
                    if (this.touchTimeout) clearTimeout(this.touchTimeout);
                    this.touchTimeout = setTimeout((event)=>this.cycle(event)
                    , TOUCHEVENT_COMPAT_WAIT + this._config.interval);
                }
            };
            SelectorEngine__default.default.find(SELECTOR_ITEM_IMG, this._element).forEach((itemImg)=>{
                EventHandler__default.default.on(itemImg, EVENT_DRAG_START, (event)=>event.preventDefault()
                );
            });
            if (this._pointerEvent) {
                EventHandler__default.default.on(this._element, EVENT_POINTERDOWN, (event)=>start(event)
                );
                EventHandler__default.default.on(this._element, EVENT_POINTERUP, (event)=>end(event)
                );
                this._element.classList.add(CLASS_NAME_POINTER_EVENT);
            } else {
                EventHandler__default.default.on(this._element, EVENT_TOUCHSTART, (event)=>start(event)
                );
                EventHandler__default.default.on(this._element, EVENT_TOUCHMOVE, (event)=>move(event)
                );
                EventHandler__default.default.on(this._element, EVENT_TOUCHEND, (event)=>end(event)
                );
            }
        }
        _keydown(event) {
            if (/input|textarea/i.test(event.target.tagName)) return;
            const direction = KEY_TO_DIRECTION[event.key];
            if (direction) {
                event.preventDefault();
                this._slide(direction);
            }
        }
        _getItemIndex(element) {
            this._items = element && element.parentNode ? SelectorEngine__default.default.find(SELECTOR_ITEM, element.parentNode) : [];
            return this._items.indexOf(element);
        }
        _getItemByOrder(order, activeElement) {
            const isNext = order === ORDER_NEXT;
            return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap);
        }
        _triggerSlideEvent(relatedTarget, eventDirectionName) {
            const targetIndex = this._getItemIndex(relatedTarget);
            const fromIndex = this._getItemIndex(SelectorEngine__default.default.findOne(SELECTOR_ACTIVE_ITEM, this._element));
            return EventHandler__default.default.trigger(this._element, EVENT_SLIDE, {
                relatedTarget: relatedTarget,
                direction: eventDirectionName,
                from: fromIndex,
                to: targetIndex
            });
        }
        _setActiveIndicatorElement(element) {
            if (this._indicatorsElement) {
                const activeIndicator = SelectorEngine__default.default.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
                activeIndicator.classList.remove(CLASS_NAME_ACTIVE);
                activeIndicator.removeAttribute('aria-current');
                const indicators = SelectorEngine__default.default.find(SELECTOR_INDICATOR, this._indicatorsElement);
                for(let i = 0; i < indicators.length; i++)if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
                    indicators[i].classList.add(CLASS_NAME_ACTIVE);
                    indicators[i].setAttribute('aria-current', 'true');
                    break;
                }
            }
        }
        _updateInterval() {
            const element = this._activeElement || SelectorEngine__default.default.findOne(SELECTOR_ACTIVE_ITEM, this._element);
            if (!element) return;
            const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
            if (elementInterval) {
                this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
                this._config.interval = elementInterval;
            } else this._config.interval = this._config.defaultInterval || this._config.interval;
        }
        _slide(directionOrOrder, element) {
            const order = this._directionToOrder(directionOrOrder);
            const activeElement = SelectorEngine__default.default.findOne(SELECTOR_ACTIVE_ITEM, this._element);
            const activeElementIndex = this._getItemIndex(activeElement);
            const nextElement = element || this._getItemByOrder(order, activeElement);
            const nextElementIndex = this._getItemIndex(nextElement);
            const isCycling = Boolean(this._interval);
            const isNext = order === ORDER_NEXT;
            const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
            const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
            const eventDirectionName = this._orderToDirection(order);
            if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE)) {
                this._isSliding = false;
                return;
            }
            if (this._isSliding) return;
            const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);
            if (slideEvent.defaultPrevented) return;
            if (!activeElement || !nextElement) // Some weirdness is happening, so we bail
            return;
            this._isSliding = true;
            if (isCycling) this.pause();
            this._setActiveIndicatorElement(nextElement);
            this._activeElement = nextElement;
            const triggerSlidEvent = ()=>{
                EventHandler__default.default.trigger(this._element, EVENT_SLID, {
                    relatedTarget: nextElement,
                    direction: eventDirectionName,
                    from: activeElementIndex,
                    to: nextElementIndex
                });
            };
            if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
                nextElement.classList.add(orderClassName);
                reflow(nextElement);
                activeElement.classList.add(directionalClassName);
                nextElement.classList.add(directionalClassName);
                const completeCallBack = ()=>{
                    nextElement.classList.remove(directionalClassName, orderClassName);
                    nextElement.classList.add(CLASS_NAME_ACTIVE);
                    activeElement.classList.remove(CLASS_NAME_ACTIVE, orderClassName, directionalClassName);
                    this._isSliding = false;
                    setTimeout(triggerSlidEvent, 0);
                };
                this._queueCallback(completeCallBack, activeElement, true);
            } else {
                activeElement.classList.remove(CLASS_NAME_ACTIVE);
                nextElement.classList.add(CLASS_NAME_ACTIVE);
                this._isSliding = false;
                triggerSlidEvent();
            }
            if (isCycling) this.cycle();
        }
        _directionToOrder(direction) {
            if (![
                DIRECTION_RIGHT,
                DIRECTION_LEFT
            ].includes(direction)) return direction;
            if (isRTL()) return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
            return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
        }
        _orderToDirection(order) {
            if (![
                ORDER_NEXT,
                ORDER_PREV
            ].includes(order)) return order;
            if (isRTL()) return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
            return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
        }
        static carouselInterface(element, config) {
            const data = Carousel.getOrCreateInstance(element, config);
            let { _config: _config  } = data;
            if (typeof config === 'object') _config = $3e7d710376864ec3$export$2e2bcd8739ae039({}, _config, config);
            const action = typeof config === 'string' ? config : _config.slide;
            if (typeof config === 'number') data.to(config);
            else if (typeof action === 'string') {
                if (typeof data[action] === 'undefined') throw new TypeError(`No method named "${action}"`);
                data[action]();
            } else if (_config.interval && _config.ride) {
                data.pause();
                data.cycle();
            }
        }
        static jQueryInterface(config) {
            return this.each(function() {
                Carousel.carouselInterface(this, config);
            });
        }
        static dataApiClickHandler(event) {
            const target = getElementFromSelector(this);
            if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) return;
            const config = $3e7d710376864ec3$export$2e2bcd8739ae039({}, Manipulator__default.default.getDataAttributes(target), Manipulator__default.default.getDataAttributes(this));
            const slideIndex = this.getAttribute('data-bs-slide-to');
            if (slideIndex) config.interval = false;
            Carousel.carouselInterface(target, config);
            if (slideIndex) Carousel.getInstance(target).to(slideIndex);
            event.preventDefault();
        }
        constructor(element, config){
            super(element);
            this._items = null;
            this._interval = null;
            this._activeElement = null;
            this._isPaused = false;
            this._isSliding = false;
            this.touchTimeout = null;
            this.touchStartX = 0;
            this.touchDeltaX = 0;
            this._config = this._getConfig(config);
            this._indicatorsElement = SelectorEngine__default.default.findOne(SELECTOR_INDICATORS, this._element);
            this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
            this._pointerEvent = Boolean(window.PointerEvent);
            this._addEventListeners();
        }
    }
    /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */ EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
    EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, ()=>{
        const carousels = SelectorEngine__default.default.find(SELECTOR_DATA_RIDE);
        for(let i = 0, len = carousels.length; i < len; i++)Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]));
    });
    /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Carousel to jQuery only if jQuery is present
   */ defineJQueryPlugin(Carousel);
    return Carousel;
});


var $63d6d5830121487a$exports = {};






/*!
  * Bootstrap dropdown.js v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */ (function(global, factory) {
    $63d6d5830121487a$exports = factory((parcelRequire("jbNaB")), (parcelRequire("hSYfs")), (parcelRequire("1j4M2")), (parcelRequire("1x0pq")), (parcelRequire("f323N")));
})(undefined, function(Popper, EventHandler, Manipulator, SelectorEngine, BaseComponent) {
    'use strict';
    const _interopDefaultLegacy = (e)=>e && typeof e === 'object' && 'default' in e ? e : {
            default: e
        }
    ;
    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        const n = Object.create(null);
        if (e) {
            for(const k in e)if (k !== 'default') {
                const d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: ()=>e[k]
                });
            }
        }
        n.default = e;
        return Object.freeze(n);
    }
    const Popper__namespace = /*#__PURE__*/ _interopNamespace(Popper);
    const EventHandler__default = /*#__PURE__*/ _interopDefaultLegacy(EventHandler);
    const Manipulator__default = /*#__PURE__*/ _interopDefaultLegacy(Manipulator);
    const SelectorEngine__default = /*#__PURE__*/ _interopDefaultLegacy(SelectorEngine);
    const BaseComponent__default = /*#__PURE__*/ _interopDefaultLegacy(BaseComponent);
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ const toType = (obj)=>{
        if (obj === null || obj === undefined) return `${obj}`;
        return ({}).toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
    };
    const getSelector = (element)=>{
        let selector = element.getAttribute('data-bs-target');
        if (!selector || selector === '#') {
            let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
            // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
            // `document.querySelector` will rightfully complain it is invalid.
            // See https://github.com/twbs/bootstrap/issues/32273
            if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) return null;
             // Just in case some CMS puts out a full URL with the anchor appended
            if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) hrefAttr = `#${hrefAttr.split('#')[1]}`;
            selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
        }
        return selector;
    };
    const getElementFromSelector = (element)=>{
        const selector = getSelector(element);
        return selector ? document.querySelector(selector) : null;
    };
    const isElement = (obj)=>{
        if (!obj || typeof obj !== 'object') return false;
        if (typeof obj.jquery !== 'undefined') obj = obj[0];
        return typeof obj.nodeType !== 'undefined';
    };
    const getElement = (obj)=>{
        if (isElement(obj)) // it's a jQuery object or a node element
        return obj.jquery ? obj[0] : obj;
        if (typeof obj === 'string' && obj.length > 0) return document.querySelector(obj);
        return null;
    };
    const typeCheckConfig = (componentName, config, configTypes)=>{
        Object.keys(configTypes).forEach((property)=>{
            const expectedTypes = configTypes[property];
            const value = config[property];
            const valueType = value && isElement(value) ? 'element' : toType(value);
            if (!new RegExp(expectedTypes).test(valueType)) throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
        });
    };
    const isVisible = (element)=>{
        if (!isElement(element) || element.getClientRects().length === 0) return false;
        return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    };
    const isDisabled = (element)=>{
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
        if (element.classList.contains('disabled')) return true;
        if (typeof element.disabled !== 'undefined') return element.disabled;
        return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
    };
    const noop = ()=>{};
    const getjQuery = ()=>{
        const { jQuery: jQuery  } = window;
        if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) return jQuery;
        return null;
    };
    const DOMContentLoadedCallbacks = [];
    const onDOMContentLoaded = (callback1)=>{
        if (document.readyState === 'loading') {
            // add listener on the first call when the document is in loading state
            if (!DOMContentLoadedCallbacks.length) document.addEventListener('DOMContentLoaded', ()=>{
                DOMContentLoadedCallbacks.forEach((callback)=>callback()
                );
            });
            DOMContentLoadedCallbacks.push(callback1);
        } else callback1();
    };
    const isRTL = ()=>document.documentElement.dir === 'rtl'
    ;
    const defineJQueryPlugin = (plugin)=>{
        onDOMContentLoaded(()=>{
            const $ = getjQuery();
            /* istanbul ignore if */ if ($) {
                const name = plugin.NAME;
                const JQUERY_NO_CONFLICT = $.fn[name];
                $.fn[name] = plugin.jQueryInterface;
                $.fn[name].Constructor = plugin;
                $.fn[name].noConflict = ()=>{
                    $.fn[name] = JQUERY_NO_CONFLICT;
                    return plugin.jQueryInterface;
                };
            }
        });
    };
    /**
   * Return the previous/next element of a list.
   *
   * @param {array} list    The list of elements
   * @param activeElement   The active element
   * @param shouldGetNext   Choose to get next or previous element
   * @param isCycleAllowed
   * @return {Element|elem} The proper element
   */ const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed)=>{
        let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed
        if (index === -1) return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
        const listLength = list.length;
        index += shouldGetNext ? 1 : -1;
        if (isCycleAllowed) index = (index + listLength) % listLength;
        return list[Math.max(0, Math.min(index, listLength - 1))];
    };
    /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.1.3): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */ /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */ const NAME = 'dropdown';
    const DATA_KEY = 'bs.dropdown';
    const EVENT_KEY = `.${DATA_KEY}`;
    const DATA_API_KEY = '.data-api';
    const ESCAPE_KEY = 'Escape';
    const SPACE_KEY = 'Space';
    const TAB_KEY = 'Tab';
    const ARROW_UP_KEY = 'ArrowUp';
    const ARROW_DOWN_KEY = 'ArrowDown';
    const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button
    const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY}`);
    const EVENT_HIDE = `hide${EVENT_KEY}`;
    const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
    const EVENT_SHOW = `show${EVENT_KEY}`;
    const EVENT_SHOWN = `shown${EVENT_KEY}`;
    const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
    const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
    const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`;
    const CLASS_NAME_SHOW = 'show';
    const CLASS_NAME_DROPUP = 'dropup';
    const CLASS_NAME_DROPEND = 'dropend';
    const CLASS_NAME_DROPSTART = 'dropstart';
    const CLASS_NAME_NAVBAR = 'navbar';
    const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="dropdown"]';
    const SELECTOR_MENU = '.dropdown-menu';
    const SELECTOR_NAVBAR_NAV = '.navbar-nav';
    const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
    const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
    const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
    const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
    const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
    const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
    const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
    const Default = {
        offset: [
            0,
            2
        ],
        boundary: 'clippingParents',
        reference: 'toggle',
        display: 'dynamic',
        popperConfig: null,
        autoClose: true
    };
    const DefaultType = {
        offset: '(array|string|function)',
        boundary: '(string|element)',
        reference: '(string|element|object)',
        display: 'string',
        popperConfig: '(null|object|function)',
        autoClose: '(boolean|string)'
    };
    /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */ class Dropdown extends BaseComponent__default.default {
        static get Default() {
            return Default;
        }
        static get DefaultType() {
            return DefaultType;
        }
        static get NAME() {
            return NAME;
        }
        toggle() {
            return this._isShown() ? this.hide() : this.show();
        }
        show() {
            if (isDisabled(this._element) || this._isShown(this._menu)) return;
            const relatedTarget = {
                relatedTarget: this._element
            };
            const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW, relatedTarget);
            if (showEvent.defaultPrevented) return;
            const parent = Dropdown.getParentFromElement(this._element); // Totally disable Popper for Dropdowns in Navbar
            if (this._inNavbar) Manipulator__default.default.setDataAttribute(this._menu, 'popper', 'none');
            else this._createPopper(parent);
             // If this is a touch-enabled device we add extra
            // empty mouseover listeners to the body's immediate children;
            // only needed because of broken event delegation on iOS
            // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
            if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) [].concat(...document.body.children).forEach((elem)=>EventHandler__default.default.on(elem, 'mouseover', noop)
            );
            this._element.focus();
            this._element.setAttribute('aria-expanded', true);
            this._menu.classList.add(CLASS_NAME_SHOW);
            this._element.classList.add(CLASS_NAME_SHOW);
            EventHandler__default.default.trigger(this._element, EVENT_SHOWN, relatedTarget);
        }
        hide() {
            if (isDisabled(this._element) || !this._isShown(this._menu)) return;
            const relatedTarget = {
                relatedTarget: this._element
            };
            this._completeHide(relatedTarget);
        }
        dispose() {
            if (this._popper) this._popper.destroy();
            super.dispose();
        }
        update() {
            this._inNavbar = this._detectNavbar();
            if (this._popper) this._popper.update();
        }
        _completeHide(relatedTarget) {
            const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE, relatedTarget);
            if (hideEvent.defaultPrevented) return;
             // If this is a touch-enabled device we remove the extra
            // empty mouseover listeners we added for iOS support
            if ('ontouchstart' in document.documentElement) [].concat(...document.body.children).forEach((elem)=>EventHandler__default.default.off(elem, 'mouseover', noop)
            );
            if (this._popper) this._popper.destroy();
            this._menu.classList.remove(CLASS_NAME_SHOW);
            this._element.classList.remove(CLASS_NAME_SHOW);
            this._element.setAttribute('aria-expanded', 'false');
            Manipulator__default.default.removeDataAttribute(this._menu, 'popper');
            EventHandler__default.default.trigger(this._element, EVENT_HIDDEN, relatedTarget);
        }
        _getConfig(config) {
            config = $3e7d710376864ec3$export$2e2bcd8739ae039({}, this.constructor.Default, Manipulator__default.default.getDataAttributes(this._element), config);
            typeCheckConfig(NAME, config, this.constructor.DefaultType);
            if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') // Popper virtual elements require a getBoundingClientRect method
            throw new TypeError(`${NAME.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
            return config;
        }
        _createPopper(parent) {
            if (typeof Popper__namespace === 'undefined') throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
            let referenceElement = this._element;
            if (this._config.reference === 'parent') referenceElement = parent;
            else if (isElement(this._config.reference)) referenceElement = getElement(this._config.reference);
            else if (typeof this._config.reference === 'object') referenceElement = this._config.reference;
            const popperConfig = this._getPopperConfig();
            const isDisplayStatic = popperConfig.modifiers.find((modifier)=>modifier.name === 'applyStyles' && modifier.enabled === false
            );
            this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);
            if (isDisplayStatic) Manipulator__default.default.setDataAttribute(this._menu, 'popper', 'static');
        }
        _isShown(element = this._element) {
            return element.classList.contains(CLASS_NAME_SHOW);
        }
        _getMenuElement() {
            return SelectorEngine__default.default.next(this._element, SELECTOR_MENU)[0];
        }
        _getPlacement() {
            const parentDropdown = this._element.parentNode;
            if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) return PLACEMENT_RIGHT;
            if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) return PLACEMENT_LEFT;
             // We need to trim the value because custom properties can also include spaces
            const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
            if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
            return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
        }
        _detectNavbar() {
            return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
        }
        _getOffset() {
            const { offset: offset  } = this._config;
            if (typeof offset === 'string') return offset.split(',').map((val)=>Number.parseInt(val, 10)
            );
            if (typeof offset === 'function') return (popperData)=>offset(popperData, this._element)
            ;
            return offset;
        }
        _getPopperConfig() {
            const defaultBsPopperConfig = {
                placement: this._getPlacement(),
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            boundary: this._config.boundary
                        }
                    },
                    {
                        name: 'offset',
                        options: {
                            offset: this._getOffset()
                        }
                    }
                ]
            }; // Disable Popper if we have a static display
            if (this._config.display === 'static') defaultBsPopperConfig.modifiers = [
                {
                    name: 'applyStyles',
                    enabled: false
                }
            ];
            return $3e7d710376864ec3$export$2e2bcd8739ae039({}, defaultBsPopperConfig, typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig);
        }
        _selectMenuItem({ key: key , target: target  }) {
            const items = SelectorEngine__default.default.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);
            if (!items.length) return;
             // if target isn't included in items (e.g. when expanding the dropdown)
            // allow cycling to get the last item in case key equals ARROW_UP_KEY
            getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
        }
        static jQueryInterface(config) {
            return this.each(function() {
                const data = Dropdown.getOrCreateInstance(this, config);
                if (typeof config !== 'string') return;
                if (typeof data[config] === 'undefined') throw new TypeError(`No method named "${config}"`);
                data[config]();
            });
        }
        static clearMenus(event) {
            if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY)) return;
            const toggles = SelectorEngine__default.default.find(SELECTOR_DATA_TOGGLE);
            for(let i = 0, len = toggles.length; i < len; i++){
                const context = Dropdown.getInstance(toggles[i]);
                if (!context || context._config.autoClose === false) continue;
                if (!context._isShown()) continue;
                const relatedTarget = {
                    relatedTarget: context._element
                };
                if (event) {
                    const composedPath = event.composedPath();
                    const isMenuTarget = composedPath.includes(context._menu);
                    if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) continue;
                     // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
                    if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY || /input|select|option|textarea|form/i.test(event.target.tagName))) continue;
                    if (event.type === 'click') relatedTarget.clickEvent = event;
                }
                context._completeHide(relatedTarget);
            }
        }
        static getParentFromElement(element) {
            return getElementFromSelector(element) || element.parentNode;
        }
        static dataApiKeydownHandler(event) {
            // If not input/textarea:
            //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
            // If input/textarea:
            //  - If space key => not a dropdown command
            //  - If key is other than escape
            //    - If key is not up or down => not a dropdown command
            //    - If trigger inside the menu => not a dropdown command
            if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) return;
            const isActive = this.classList.contains(CLASS_NAME_SHOW);
            if (!isActive && event.key === ESCAPE_KEY) return;
            event.preventDefault();
            event.stopPropagation();
            if (isDisabled(this)) return;
            const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE) ? this : SelectorEngine__default.default.prev(this, SELECTOR_DATA_TOGGLE)[0];
            const instance = Dropdown.getOrCreateInstance(getToggleButton);
            if (event.key === ESCAPE_KEY) {
                instance.hide();
                return;
            }
            if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
                if (!isActive) instance.show();
                instance._selectMenuItem(event);
                return;
            }
            if (!isActive || event.key === SPACE_KEY) Dropdown.clearMenus();
        }
        constructor(element, config){
            super(element);
            this._popper = null;
            this._config = this._getConfig(config);
            this._menu = this._getMenuElement();
            this._inNavbar = this._detectNavbar();
        }
    }
    /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */ EventHandler__default.default.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Dropdown.dataApiKeydownHandler);
    EventHandler__default.default.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
    EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus);
    EventHandler__default.default.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
    EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
        event.preventDefault();
        Dropdown.getOrCreateInstance(this).toggle();
    });
    /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Dropdown to jQuery only if jQuery is present
   */ defineJQueryPlugin(Dropdown);
    return Dropdown;
});


// Thanks to:
// http://fightingforalostcause.net/misc/2006/compare-email-regex.php
// http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
// http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378
var $0dad1e6ab328c247$export$a22775fa5e2eebd9;
"use strict";
var $0dad1e6ab328c247$var$tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
$0dad1e6ab328c247$export$a22775fa5e2eebd9 = function(email) {
    if (!email) return false;
    if (email.length > 254) return false;
    var valid = $0dad1e6ab328c247$var$tester.test(email);
    if (!valid) return false;
    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if (parts[0].length > 64) return false;
    var domainParts = parts[1].split(".");
    if (domainParts.some(function(part) {
        return part.length > 63;
    })) return false;
    return true;
};


function $5a29daed42ef6a13$var$formHandler() {
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var email = document.getElementById("email").value;
    var agree = document.getElementById("agreetotos").checked;
    if ([
        firstname,
        lastname,
        email
    ].includes("") || agree == false) // var messageToUser =
    //   "<div class='alert alert-danger' role='alert'> Please make sure you have entered your full name, email address and you have agreed to your Terms of Service</div>";
    return false;
    else if ($0dad1e6ab328c247$export$a22775fa5e2eebd9(email) == false) var messageToUser = "<div class='alert alert-danger' role='alert'> Please make sure you have typed your email address in correctly </div>";
    else var messageToUser = "<div class='alert alert-primary' role='alert'> Thanks for subscribing to our newsletter " + firstname + " " + lastname + ". We have sent an email to " + email + " to confirm your subscription.</div>";
    document.getElementById("modalBody").innerHTML = messageToUser;
    new (/*@__PURE__*/$parcel$interopDefault($6a952502bd5a366b$exports))(document.getElementById("modal")).show();
}
document.getElementById("submitButton").onclick = function() {
    $5a29daed42ef6a13$var$formHandler();
};
function $5a29daed42ef6a13$var$tosHandler() {
    document.getElementById("modalBody").innerHTML = "<div class='alert alert-primary' role='alert'> The TOS is a lie, it don't exists, innit bruv.</div>";
    new (/*@__PURE__*/$parcel$interopDefault($6a952502bd5a366b$exports))(document.getElementById("modal")).show();
}
document.getElementById("tos").onclick = function() {
    $5a29daed42ef6a13$var$tosHandler();
};


//# sourceMappingURL=subscribe.4696ee08.js.map
