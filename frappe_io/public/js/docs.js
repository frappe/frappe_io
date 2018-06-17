(function () {
'use strict';

/*!
 * Vue.js v2.5.8
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */


// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.functionalOptions = undefined;
  this.functionalScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if ("development" !== 'production' && inject) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                ("timeout (" + (res.timeout) + "ms)")
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      data && data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ("development" !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if ("development" !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(function (key) {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if ("development" !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor,
  isOnce
) {
  // render fns generated by compiler < 2.5.4 does not provide v-once
  // information to runtime so be conservative
  var isOldVersion = arguments.length < 3;
  // if a static tree is generated by v-once, it is cached on the instance;
  // otherwise it is purely static and can be cached on the shared options
  // across all instances.
  var renderFns = this.$options.staticRenderFns;
  var cached = isOldVersion || isOnce
    ? (this._staticTrees || (this._staticTrees = []))
    : (renderFns.cached || (renderFns.cached = []));
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = renderFns[index].call(this._renderProxy, null, this);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.functionalScopeId = options._scopeId;
        vnode.functionalContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.functionalContext = contextVm;
    vnode.functionalOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("development" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        // _rendered is a flag added by renderSlot, but may not be present
        // if the slot is passed from manually written render functions
        if (slot._rendered || (slot[0] && slot[0].elm)) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && cached$$1 !== current) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.8';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.functionalScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.functionalContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("development" !== 'production' && !vnodeToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE9 || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = { value: value };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;



function parseModel (val) {
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + value + "=$$a.concat([$$v]))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    if (value$1) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally'
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("development" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("development" !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;



function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$1 = 0; i$1 < postTransforms.length; i$1++) {
        postTransforms[i$1](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "development" !== 'production' && warn$2(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if ("development" !== 'production' && el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          true
        );
      }
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

/**
 * Expand input[v-model] with dyanmic type bindings into v-if-else chains
 * Turn this:
 *   <input v-model="data[type]" :type="type">
 * into this:
 *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
 *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
 *   <input v-else :type="type" v-model="data[type]">
 */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (map['v-model'] && (map['v-bind:type'] || map[':type'])) {
      var typeBinding = getBindingAttr(el, 'type');
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

var model$2 = {
  preTransformNode: preTransformNode
};

var modules$1 = [
  klass$1,
  style$1,
  model$2
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var code = keyCodes[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(code)) + "," +
    "$event.key)"
  )
}

/*  */

function on (el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state, once$$1) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + "," + (el.staticInFor ? 'true' : 'false') + "," + (once$$1 ? 'true' : 'false') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state, true)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (
  ident,
  type,
  text,
  errors
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
    }
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) {
        warn$$1(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

function $$(expr, con) {
	return typeof expr === "string"? (con || document).querySelector(expr) : expr || null;
}

$$.create = function (tag, o) {
	var element = document.createElement(tag);
	var container = null;

	if (o.withLabel) {
		container = document.createElement('div');
		container.classList.add('input-wrapper');
		element.label = document.createElement('label');
		element.label.innerHTML = o.withLabel;
		container.appendChild(element.label);
		container.appendChild(element);
	}

	for (var i in o) {
		var val = o[i];

		if(i === "inside") {
			var child = container ? container : element;

			$$(val).appendChild(child);

		} else if (i === "around") {
			var ref = $$(val);
			ref.parentNode.insertBefore(element, ref);
			element.appendChild(ref);

		} else if (i === "onClick" ) {
			element.addEventListener('click', val);

		} else if (i === "onInput" ) {
			element.addEventListener('input', function(e) {
				val(element.value);
			});

		} else if (i === "onChange" ) {
			element.addEventListener('change', function(e) {
				val(element.value);
			});

		} else if (i === "styles") {
			if(typeof val === "object") {
				Object.keys(val).map(function (prop) {
					element.style[prop] = val[prop];
				});
			}
		} else if (i in element ) {
			element[i] = val;
		}
		else {
			element.setAttribute(i, val);
		}
	}

	return container ? container : element;
};

function toTitleCase(str) {
    return str.replace(/\w*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function scrub(text) {
	return text.replace(/ /g, "_").toLowerCase();
}

// export class demoBuilder {
var demoBuilder = function demoBuilder(LIB_OBJ) {
	this.LIB_OBJ = LIB_OBJ;
};

demoBuilder.prototype.makeSection = function makeSection (parent, sys) {
	return new docSection(this.LIB_OBJ, parent, sys);
};

var docSection = function docSection(LIB_OBJ, parent, sys) {
	this.LIB_OBJ = LIB_OBJ;
	this.parent = parent;
	this.sys = sys;
	this.blockMap = {};
	this.demos = [];

	this.make();
};

docSection.prototype.make = function make () {
		var this$1 = this;

	// const section = document.querySelector(this.parent);
	var s = this.sys;
	if(s.title) {
		$$.create('h6', { inside: this.parent, innerHTML: s.title });
	}

	if(s.contentBlocks) {
		s.contentBlocks.forEach(function (blockConf, index) {
			this$1.blockMap[index] = this$1.getBlock(blockConf);
		});
	} else {
		// TODO:
		this.blockMap['test'] = this.getDemo(s);
	}
};

docSection.prototype.getBlock = function getBlock (blockConf) {
	var fnName = 'get' + toTitleCase(blockConf.type);
	if(this[fnName]) {
		return this[fnName](blockConf);
	} else {
		throw new Error(("Unknown section block type '" + (blockConf.type) + "'."));
	}
};

docSection.prototype.getText = function getText (blockConf) {
	return $$.create('p', {
		inside: this.parent,
		className: 'new-context',
		innerHTML: blockConf.content
	});
};

docSection.prototype.getCode = function getCode (blockConf) {
	var pre = $$.create('pre', { inside: this.parent });
	var lang = blockConf.lang || 'javascript';
	var code = $$.create('code', {
		inside: pre,
		className: ("hljs " + lang),
		innerHTML: blockConf.content
	});
};

docSection.prototype.getCustom = function getCustom (blockConf) {
	this.parent.innerHTML +=  blockConf.html;
};

docSection.prototype.getDemo = function getDemo (blockConf) {
	var bc = blockConf;
	var args = bc.config;

	var figure, row;
	if(!bc.sideContent) {
		figure = $$.create('figure', { inside: this.parent });
	} else {
		row = $$.create('div', {
			inside: this.parent,
			className: "row",
			innerHTML: "<div class=\"col-sm-8\"></div>\n\t\t\t\t\t<div class=\"col-sm-4\"></div>",
		});
		figure = $$.create('figure', { inside: row.querySelector('.col-sm-8') });
		row.querySelector('.col-sm-4').innerHTML += bc.sideContent;
	}

	var libObj = new this.LIB_OBJ(figure, args);
	var demoIndex = this.demos.length;
	this.demos.push(libObj);

	if(bc.postSetup) {
		bc.postSetup(this.demos[demoIndex], figure, row);
	}

	this.getDemoOptions(demoIndex, bc.options, args, figure);
	this.getDemoActions(demoIndex, bc.actions, args);
};

docSection.prototype.getDemoOptions = function getDemoOptions (demoIndex, options, args, figure) {
		var this$1 = this;
		if ( options === void 0 ) options=[];
		if ( args === void 0 ) args={};

	options.forEach(function (o) {
		var btnGroup = $$.create('div', {
			inside: this$1.parent,
			className: ("btn-group " + (scrub(o.name)) + " mr-3 mb-3 type")
		});
		var mapKeys = o.mapKeys;

		if(o.type === "number") {
			var numOpts = o.numberOptions;
			var activeState = o.activeState ? o.activeState : 0;

			var inputGroup = $$.create('input', {
				inside: btnGroup,
				withLabel: o.name + ': ' + '<b>' + activeState + '</b>',
				className: "form-control",
				type: "range",
				min: numOpts.min,
				max: numOpts.max,
				step: numOpts.step,
				value: activeState,
				// (max - min)/2
				onInput: function (value) {
					if(o.path[1]) {
						args[o.path[0]][o.path[1]] = value;
					} else {
						args[o.path[0]] = value;
					}

					var label = inputGroup.querySelector('label');
					if(label) {
						label.innerHTML = o.name + ': ' + '<b>' + value + '</b>';
					}

					this$1.demos[demoIndex] = new this$1.LIB_OBJ(figure, args);
				}
			});

		} else if(["Map", "String", "Boolean", "Array", "Object"].includes(o.type)) {
			args[o.path[0]] = {};

			Object.keys(o.states).forEach(function (key) {
				var state = o.states[key];
				var activeClass = key === o.activeState ? 'active' : '';

				var button = $$.create('button', {
					inside: btnGroup,
					className: ("btn btn-sm btn-outline-secondary " + activeClass),
					innerHTML: key,
					onClick: function (e) {
						// map
						if(o.type === "map") {
							mapKeys.forEach(function (attr, i) {
								args[o.path[0]][attr] = state[i];
							});
						} else {
							// boolean, string, number, object
							args[o.path[0]] = state;
						}
						this$1.demos[demoIndex] = new this$1.LIB_OBJ(figure, args);
					}
				});

				if(activeClass) { button.click(); }
			});
		}
	});
};

docSection.prototype.getDemoActions = function getDemoActions (demoIndex, actions, args) {
		var this$1 = this;
		if ( actions === void 0 ) actions=[];
		if ( args === void 0 ) args={};

	actions.forEach(function (o) {
		var args = o.args || [];
		$$.create('button', {
			inside: this$1.parent,
			className: "btn btn-action btn-sm btn-outline-secondary mr-3 mb-3",
			innerHTML: o.name,
			onClick: function () {
				var ref;
(ref = this$1.demos[demoIndex])[o.fn].apply(ref, args);}
		});
	});
};

var COMPONENT_NAME = 'project-demo';

var getDemoVue = function (lib, getDemoConfig) {
	var dbd = new demoBuilder(lib);

	return {
		name: COMPONENT_NAME,
		config: {
			template: '<div class="project-demo"></div>',
			props: ['data', 'config', 'options', 'actions'],
			mounted: function() {
				dbd.makeSection(this.$el, getDemoConfig(this));
			}
		}
	}
};

function __$styleInject(css, ref) {
  if ( ref === void 0 ) { ref = {}; }
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

__$styleInject(".chart-container{position:relative;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.chart-container .axis,.chart-container .chart-label{fill:#555b51}.chart-container .axis line,.chart-container .chart-label line{stroke:#dadada}.chart-container .dataset-units circle{stroke:#fff;stroke-width:2}.chart-container .dataset-units path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container .dataset-path{stroke-width:2px}.chart-container .path-group path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container line.dashed{stroke-dasharray:5,3}.chart-container .axis-line .specific-value{text-anchor:start}.chart-container .axis-line .y-line{text-anchor:end}.chart-container .axis-line .x-line{text-anchor:middle}.chart-container .legend-dataset-text{fill:#6c7680;font-weight:600}.graph-svg-tip{position:absolute;z-index:1;padding:10px;font-size:12px;color:#959da5;text-align:center;background:rgba(0,0,0,.8);border-radius:3px}.graph-svg-tip ol,.graph-svg-tip ul{padding-left:0;display:-webkit-box;display:-ms-flexbox;display:flex}.graph-svg-tip ul.data-point-list li{min-width:90px;-webkit-box-flex:1;-ms-flex:1;flex:1;font-weight:600}.graph-svg-tip strong{color:#dfe2e5;font-weight:600}.graph-svg-tip .svg-pointer{position:absolute;height:5px;margin:0 0 0 -5px;content:\" \";border:5px solid transparent;border-top-color:rgba(0,0,0,.8)}.graph-svg-tip.comparison{padding:0;text-align:left;pointer-events:none}.graph-svg-tip.comparison .title{display:block;padding:10px;margin:0;font-weight:600;line-height:1;pointer-events:none}.graph-svg-tip.comparison ul{margin:0;white-space:nowrap;list-style:none}.graph-svg-tip.comparison li{display:inline-block;padding:5px 10px}", {});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function $$1(expr, con) {
	return typeof expr === "string" ? (con || document).querySelector(expr) : expr || null;
}



$$1.create = function (tag, o) {
	var element = document.createElement(tag);

	for (var i in o) {
		var val = o[i];

		if (i === "inside") {
			$$1(val).appendChild(element);
		} else if (i === "around") {
			var ref = $$1(val);
			ref.parentNode.insertBefore(element, ref);
			element.appendChild(ref);
		} else if (i === "onClick") {
			element.addEventListener('click', val);
		} else if (i === "onInput") {
			element.addEventListener('input', function (e) {
				val(element.value);
			});
		} else if (i === "styles") {
			if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === "object") {
				Object.keys(val).map(function (prop) {
					element.style[prop] = val[prop];
				});
			}
		} else if (i in element) {
			element[i] = val;
		} else {
			element.setAttribute(i, val);
		}
	}

	return element;
};

function getOffset(element) {
	var rect = element.getBoundingClientRect();
	return {
		// https://stackoverflow.com/a/7436602/6495043
		// rect.top varies with scroll, so we add whatever has been
		// scrolled to it to get absolute distance from actual page top
		top: rect.top + (document.documentElement.scrollTop || document.body.scrollTop),
		left: rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft)
	};
}

function isElementInViewport(el) {
	// Although straightforward: https://stackoverflow.com/a/7557433/6495043
	var rect = el.getBoundingClientRect();

	return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
	rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	;
}

function getElementContentWidth(element) {
	var styles = window.getComputedStyle(element);
	var padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);

	return element.clientWidth - padding;
}





function fire(target, type, properties) {
	var evt = document.createEvent("HTMLEvents");

	evt.initEvent(type, true, true);

	for (var j in properties) {
		evt[j] = properties[j];
	}

	return target.dispatchEvent(evt);
}

// https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/

var BASE_MEASURES = {
	margins: {
		top: 10,
		bottom: 10,
		left: 20,
		right: 20
	},
	paddings: {
		top: 20,
		bottom: 40,
		left: 30,
		right: 10
	},

	baseHeight: 240,

	titleHeight: 20,
	legendHeight: 30,

	titleFontSize: 12
};

function getTopOffset(m) {
	return m.titleHeight + m.margins.top + m.paddings.top;
}

function getLeftOffset(m) {
	return m.margins.left + m.paddings.left;
}

function getExtraHeight(m) {
	var totalExtraHeight = m.margins.top + m.margins.bottom + m.paddings.top + m.paddings.bottom + m.titleHeight + m.legendHeight;
	return totalExtraHeight;
}

function getExtraWidth(m) {
	var totalExtraWidth = m.margins.left + m.margins.right + m.paddings.left + m.paddings.right;

	return totalExtraWidth;
}

var INIT_CHART_UPDATE_TIMEOUT = 700;
var CHART_POST_ANIMATE_TIMEOUT = 400;

var AXIS_CHART_DEFAULT_TYPE = 'line';


var AXIS_DATASET_CHART_TYPES = ['line', 'bar'];



var AXIS_LEGEND_BAR_SIZE = 100;

var BAR_CHART_SPACE_RATIO = 1;
var MIN_BAR_PERCENT_HEIGHT = 0.02;

var LINE_CHART_DOT_SIZE = 4;
var DOT_OVERLAY_SIZE_INCR = 4;

var PERCENTAGE_BAR_DEFAULT_HEIGHT = 20;
var PERCENTAGE_BAR_DEFAULT_DEPTH = 2;

// Fixed 5-color theme,
// More colors are difficult to parse visually
var HEATMAP_DISTRIBUTION_SIZE = 5;

var HEATMAP_SQUARE_SIZE = 10;
var HEATMAP_GUTTER_SIZE = 2;

var DEFAULT_CHAR_WIDTH = 7;

var TOOLTIP_POINTER_TRIANGLE_HEIGHT = 5;

var DEFAULT_CHART_COLORS = ['light-blue', 'blue', 'violet', 'red', 'orange', 'yellow', 'green', 'light-green', 'purple', 'magenta', 'light-grey', 'dark-grey'];
var HEATMAP_COLORS_GREEN = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];



var DEFAULT_COLORS = {
	bar: DEFAULT_CHART_COLORS,
	line: DEFAULT_CHART_COLORS,
	pie: DEFAULT_CHART_COLORS,
	percentage: DEFAULT_CHART_COLORS,
	heatmap: HEATMAP_COLORS_GREEN
};

// Universal constants
var ANGLE_RATIO = Math.PI / 180;
var FULL_ANGLE = 360;

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SvgTip = function () {
	function SvgTip(_ref) {
		var _ref$parent = _ref.parent,
		    parent = _ref$parent === undefined ? null : _ref$parent,
		    _ref$colors = _ref.colors,
		    colors = _ref$colors === undefined ? [] : _ref$colors;

		_classCallCheck$4(this, SvgTip);

		this.parent = parent;
		this.colors = colors;
		this.titleName = '';
		this.titleValue = '';
		this.listValues = [];
		this.titleValueFirst = 0;

		this.x = 0;
		this.y = 0;

		this.top = 0;
		this.left = 0;

		this.setup();
	}

	_createClass$3(SvgTip, [{
		key: 'setup',
		value: function setup() {
			this.makeTooltip();
		}
	}, {
		key: 'refresh',
		value: function refresh() {
			this.fill();
			this.calcPosition();
		}
	}, {
		key: 'makeTooltip',
		value: function makeTooltip() {
			var _this = this;

			this.container = $$1.create('div', {
				inside: this.parent,
				className: 'graph-svg-tip comparison',
				innerHTML: '<span class="title"></span>\n\t\t\t\t<ul class="data-point-list"></ul>\n\t\t\t\t<div class="svg-pointer"></div>'
			});
			this.hideTip();

			this.title = this.container.querySelector('.title');
			this.dataPointList = this.container.querySelector('.data-point-list');

			this.parent.addEventListener('mouseleave', function () {
				_this.hideTip();
			});
		}
	}, {
		key: 'fill',
		value: function fill() {
			var _this2 = this;

			var title = void 0;
			if (this.index) {
				this.container.setAttribute('data-point-index', this.index);
			}
			if (this.titleValueFirst) {
				title = '<strong>' + this.titleValue + '</strong>' + this.titleName;
			} else {
				title = this.titleName + '<strong>' + this.titleValue + '</strong>';
			}
			this.title.innerHTML = title;
			this.dataPointList.innerHTML = '';

			this.listValues.map(function (set$$1, i) {
				var color = _this2.colors[i] || 'black';
				var value = set$$1.formatted === 0 || set$$1.formatted ? set$$1.formatted : set$$1.value;

				var li = $$1.create('li', {
					styles: {
						'border-top': '3px solid ' + color
					},
					innerHTML: '<strong style="display: block;">' + (value === 0 || value ? value : '') + '</strong>\n\t\t\t\t\t' + (set$$1.title ? set$$1.title : '')
				});

				_this2.dataPointList.appendChild(li);
			});
		}
	}, {
		key: 'calcPosition',
		value: function calcPosition() {
			var width = this.container.offsetWidth;

			this.top = this.y - this.container.offsetHeight - TOOLTIP_POINTER_TRIANGLE_HEIGHT;
			this.left = this.x - width / 2;
			var maxLeft = this.parent.offsetWidth - width;

			var pointer = this.container.querySelector('.svg-pointer');

			if (this.left < 0) {
				pointer.style.left = 'calc(50% - ' + -1 * this.left + 'px)';
				this.left = 0;
			} else if (this.left > maxLeft) {
				var delta = this.left - maxLeft;
				var pointerOffset = 'calc(50% + ' + delta + 'px)';
				pointer.style.left = pointerOffset;

				this.left = maxLeft;
			} else {
				pointer.style.left = '50%';
			}
		}
	}, {
		key: 'setValues',
		value: function setValues(x, y) {
			var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
			var listValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
			var index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;

			this.titleName = title.name;
			this.titleValue = title.value;
			this.listValues = listValues;
			this.x = x;
			this.y = y;
			this.titleValueFirst = title.valueFirst || 0;
			this.index = index;
			this.refresh();
		}
	}, {
		key: 'hideTip',
		value: function hideTip() {
			this.container.style.top = '0px';
			this.container.style.left = '0px';
			this.container.style.opacity = '0';
		}
	}, {
		key: 'showTip',
		value: function showTip() {
			this.container.style.top = this.top + 'px';
			this.container.style.left = this.left + 'px';
			this.container.style.opacity = '1';
		}
	}]);

	return SvgTip;
}();

function floatTwo(d) {
	return parseFloat(d.toFixed(2));
}

/**
 * Returns whether or not two given arrays are equal.
 * @param {Array} arr1 First array
 * @param {Array} arr2 Second array
 */


/**
 * Shuffles array in place. ES6 version
 * @param {Array} array An array containing the items.
 */


/**
 * Fill an array with extra points
 * @param {Array} array Array
 * @param {Number} count number of filler elements
 * @param {Object} element element to fill with
 * @param {Boolean} start fill at start?
 */
function fillArray(array, count, element) {
	var start = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	if (!element) {
		element = start ? array[0] : array[array.length - 1];
	}
	var fillerArray = new Array(Math.abs(count)).fill(element);
	array = start ? fillerArray.concat(array) : array.concat(fillerArray);
	return array;
}

/**
 * Returns pixel width of string.
 * @param {String} string
 * @param {Number} charWidth Width of single char in pixels
 */
function getStringWidth(string, charWidth) {
	return (string + "").length * charWidth;
}



// https://stackoverflow.com/a/29325222


function getPositionByAngle(angle, radius) {
	return {
		x: Math.sin(angle * ANGLE_RATIO) * radius,
		y: Math.cos(angle * ANGLE_RATIO) * radius
	};
}

function getBarHeightAndYAttr(yTop, zeroLine) {
	var height = void 0,
	    y = void 0;
	if (yTop <= zeroLine) {
		height = zeroLine - yTop;
		y = yTop;
	} else {
		height = yTop - zeroLine;
		y = zeroLine;
	}

	return [height, y];
}

function equilizeNoOfElements(array1, array2) {
	var extraCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : array2.length - array1.length;


	// Doesn't work if either has zero elements.
	if (extraCount > 0) {
		array1 = fillArray(array1, extraCount);
	} else {
		array2 = fillArray(array2, extraCount);
	}
	return [array1, array2];
}

var PRESET_COLOR_MAP = {
	'light-blue': '#7cd6fd',
	'blue': '#5e64ff',
	'violet': '#743ee2',
	'red': '#ff5858',
	'orange': '#ffa00a',
	'yellow': '#feef72',
	'green': '#28a745',
	'light-green': '#98d85b',
	'purple': '#b554ff',
	'magenta': '#ffa3ef',
	'black': '#36114C',
	'grey': '#bdd3e6',
	'light-grey': '#f0f4f7',
	'dark-grey': '#b8c2cc'
};

function limitColor(r) {
	if (r > 255) { return 255; }else if (r < 0) { return 0; }
	return r;
}

function lightenDarkenColor(color, amt) {
	var col = getColor(color);
	var usePound = false;
	if (col[0] == "#") {
		col = col.slice(1);
		usePound = true;
	}
	var num = parseInt(col, 16);
	var r = limitColor((num >> 16) + amt);
	var b = limitColor((num >> 8 & 0x00FF) + amt);
	var g = limitColor((num & 0x0000FF) + amt);
	return (usePound ? "#" : "") + (g | b << 8 | r << 16).toString(16);
}

function isValidColor(string) {
	// https://stackoverflow.com/a/8027444/6495043
	return (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(string)
	);
}

var getColor = function getColor(color) {
	return PRESET_COLOR_MAP[color] || color;
};

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) { break; } } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) { _i["return"](); } } finally { if (_d) { throw _e; } } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var AXIS_TICK_LENGTH = 6;
var LABEL_MARGIN = 4;
var FONT_SIZE = 10;
var BASE_LINE_COLOR = '#dadada';
var FONT_FILL = '#555b51';

function $$1$1(expr, con) {
	return typeof expr === "string" ? (con || document).querySelector(expr) : expr || null;
}

function createSVG(tag, o) {
	var element = document.createElementNS("http://www.w3.org/2000/svg", tag);

	for (var i in o) {
		var val = o[i];

		if (i === "inside") {
			$$1$1(val).appendChild(element);
		} else if (i === "around") {
			var ref = $$1$1(val);
			ref.parentNode.insertBefore(element, ref);
			element.appendChild(ref);
		} else if (i === "styles") {
			if ((typeof val === 'undefined' ? 'undefined' : _typeof$2(val)) === "object") {
				Object.keys(val).map(function (prop) {
					element.style[prop] = val[prop];
				});
			}
		} else {
			if (i === "className") {
				i = "class";
			}
			if (i === "innerHTML") {
				element['textContent'] = val;
			} else {
				element.setAttribute(i, val);
			}
		}
	}

	return element;
}

function renderVerticalGradient(svgDefElem, gradientId) {
	return createSVG('linearGradient', {
		inside: svgDefElem,
		id: gradientId,
		x1: 0,
		x2: 0,
		y1: 0,
		y2: 1
	});
}

function setGradientStop(gradElem, offset, color, opacity) {
	return createSVG('stop', {
		'inside': gradElem,
		'style': 'stop-color: ' + color,
		'offset': offset,
		'stop-opacity': opacity
	});
}

function makeSVGContainer(parent, className, width, height) {
	return createSVG('svg', {
		className: className,
		inside: parent,
		width: width,
		height: height
	});
}

function makeSVGDefs(svgContainer) {
	return createSVG('defs', {
		inside: svgContainer
	});
}

function makeSVGGroup(className) {
	var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

	var args = {
		className: className,
		transform: transform
	};
	if (parent) { args.inside = parent; }
	return createSVG('g', args);
}



function makePath(pathStr) {
	var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	var stroke = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'none';
	var fill = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'none';

	return createSVG('path', {
		className: className,
		d: pathStr,
		styles: {
			stroke: stroke,
			fill: fill
		}
	});
}

function makeArcPathStr(startPosition, endPosition, center, radius) {
	var clockWise = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
	var arcStartX = center.x + startPosition.x,
	    arcStartY = center.y + startPosition.y;
	var arcEndX = center.x + endPosition.x,
	    arcEndY = center.y + endPosition.y;


	return 'M' + center.x + ' ' + center.y + '\n\t\tL' + arcStartX + ' ' + arcStartY + '\n\t\tA ' + radius + ' ' + radius + ' 0 0 ' + (clockWise ? 1 : 0) + '\n\t\t' + arcEndX + ' ' + arcEndY + ' z';
}

function makeGradient(svgDefElem, color) {
	var lighter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	var gradientId = 'path-fill-gradient' + '-' + color + '-' + (lighter ? 'lighter' : 'default');
	var gradientDef = renderVerticalGradient(svgDefElem, gradientId);
	var opacities = [1, 0.6, 0.2];
	if (lighter) {
		opacities = [0.4, 0.2, 0];
	}

	setGradientStop(gradientDef, "0%", color, opacities[0]);
	setGradientStop(gradientDef, "50%", color, opacities[1]);
	setGradientStop(gradientDef, "100%", color, opacities[2]);

	return gradientId;
}

function percentageBar(x, y, width, height) {
	var depth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PERCENTAGE_BAR_DEFAULT_DEPTH;
	var fill = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'none';


	var args = {
		className: 'percentage-bar',
		x: x,
		y: y,
		width: width,
		height: height,
		fill: fill,
		styles: {
			'stroke': lightenDarkenColor(fill, -25),
			// Diabolically good: https://stackoverflow.com/a/9000859
			// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
			'stroke-dasharray': '0, ' + (height + width) + ', ' + width + ', ' + height,
			'stroke-width': depth
		}
	};

	return createSVG("rect", args);
}

function heatSquare(className, x, y, size) {
	var fill = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'none';
	var data = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

	var args = {
		className: className,
		x: x,
		y: y,
		width: size,
		height: size,
		fill: fill
	};

	Object.keys(data).map(function (key) {
		args[key] = data[key];
	});

	return createSVG("rect", args);
}

function legendBar(x, y, size) {
	var fill = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'none';
	var label = arguments[4];

	var args = {
		className: 'legend-bar',
		x: 0,
		y: 0,
		width: size,
		height: '2px',
		fill: fill
	};
	var text = createSVG('text', {
		className: 'legend-dataset-text',
		x: 0,
		y: 0,
		dy: FONT_SIZE * 2 + 'px',
		'font-size': FONT_SIZE * 1.2 + 'px',
		'text-anchor': 'start',
		fill: FONT_FILL,
		innerHTML: label
	});

	var group = createSVG('g', {
		transform: 'translate(' + x + ', ' + y + ')'
	});
	group.appendChild(createSVG("rect", args));
	group.appendChild(text);

	return group;
}

function legendDot(x, y, size) {
	var fill = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'none';
	var label = arguments[4];

	var args = {
		className: 'legend-dot',
		cx: 0,
		cy: 0,
		r: size,
		fill: fill
	};
	var text = createSVG('text', {
		className: 'legend-dataset-text',
		x: 0,
		y: 0,
		dx: FONT_SIZE + 'px',
		dy: FONT_SIZE / 3 + 'px',
		'font-size': FONT_SIZE * 1.2 + 'px',
		'text-anchor': 'start',
		fill: FONT_FILL,
		innerHTML: label
	});

	var group = createSVG('g', {
		transform: 'translate(' + x + ', ' + y + ')'
	});
	group.appendChild(createSVG("circle", args));
	group.appendChild(text);

	return group;
}

function makeText(className, x, y, content) {
	var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

	var fontSize = options.fontSize || FONT_SIZE;
	var dy = options.dy !== undefined ? options.dy : fontSize / 2;
	var fill = options.fill || FONT_FILL;
	var textAnchor = options.textAnchor || 'start';
	return createSVG('text', {
		className: className,
		x: x,
		y: y,
		dy: dy + 'px',
		'font-size': fontSize + 'px',
		fill: fill,
		'text-anchor': textAnchor,
		innerHTML: content
	});
}

function makeVertLine(x, label, y1, y2) {
	var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

	if (!options.stroke) { options.stroke = BASE_LINE_COLOR; }
	var l = createSVG('line', {
		className: 'line-vertical ' + options.className,
		x1: 0,
		x2: 0,
		y1: y1,
		y2: y2,
		styles: {
			stroke: options.stroke
		}
	});

	var text = createSVG('text', {
		x: 0,
		y: y1 > y2 ? y1 + LABEL_MARGIN : y1 - LABEL_MARGIN - FONT_SIZE,
		dy: FONT_SIZE + 'px',
		'font-size': FONT_SIZE + 'px',
		'text-anchor': 'middle',
		innerHTML: label + ""
	});

	var line = createSVG('g', {
		transform: 'translate(' + x + ', 0)'
	});

	line.appendChild(l);
	line.appendChild(text);

	return line;
}

function makeHoriLine(y, label, x1, x2) {
	var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

	if (!options.stroke) { options.stroke = BASE_LINE_COLOR; }
	if (!options.lineType) { options.lineType = ''; }
	var className = 'line-horizontal ' + options.className + (options.lineType === "dashed" ? "dashed" : "");

	var l = createSVG('line', {
		className: className,
		x1: x1,
		x2: x2,
		y1: 0,
		y2: 0,
		styles: {
			stroke: options.stroke
		}
	});

	var text = createSVG('text', {
		x: x1 < x2 ? x1 - LABEL_MARGIN : x1 + LABEL_MARGIN,
		y: 0,
		dy: FONT_SIZE / 2 - 2 + 'px',
		'font-size': FONT_SIZE + 'px',
		'text-anchor': x1 < x2 ? 'end' : 'start',
		innerHTML: label + ""
	});

	var line = createSVG('g', {
		transform: 'translate(0, ' + y + ')',
		'stroke-opacity': 1
	});

	if (text === 0 || text === '0') {
		line.style.stroke = "rgba(27, 31, 35, 0.6)";
	}

	line.appendChild(l);
	line.appendChild(text);

	return line;
}

function yLine(y, label, width) {
	var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	if (!options.pos) { options.pos = 'left'; }
	if (!options.offset) { options.offset = 0; }
	if (!options.mode) { options.mode = 'span'; }
	if (!options.stroke) { options.stroke = BASE_LINE_COLOR; }
	if (!options.className) { options.className = ''; }

	var x1 = -1 * AXIS_TICK_LENGTH;
	var x2 = options.mode === 'span' ? width + AXIS_TICK_LENGTH : 0;

	if (options.mode === 'tick' && options.pos === 'right') {
		x1 = width + AXIS_TICK_LENGTH;
		x2 = width;
	}

	// let offset = options.pos === 'left' ? -1 * options.offset : options.offset;

	x1 += options.offset;
	x2 += options.offset;

	return makeHoriLine(y, label, x1, x2, {
		stroke: options.stroke,
		className: options.className,
		lineType: options.lineType
	});
}

function xLine(x, label, height) {
	var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	if (!options.pos) { options.pos = 'bottom'; }
	if (!options.offset) { options.offset = 0; }
	if (!options.mode) { options.mode = 'span'; }
	if (!options.stroke) { options.stroke = BASE_LINE_COLOR; }
	if (!options.className) { options.className = ''; }

	// Draw X axis line in span/tick mode with optional label
	//                        	y2(span)
	// 						|
	// 						|
	//				x line	|
	//						|
	// 					   	|
	// ---------------------+-- y2(tick)
	//						|
	//							y1

	var y1 = height + AXIS_TICK_LENGTH;
	var y2 = options.mode === 'span' ? -1 * AXIS_TICK_LENGTH : height;

	if (options.mode === 'tick' && options.pos === 'top') {
		// top axis ticks
		y1 = -1 * AXIS_TICK_LENGTH;
		y2 = 0;
	}

	return makeVertLine(x, label, y1, y2, {
		stroke: options.stroke,
		className: options.className,
		lineType: options.lineType
	});
}

function yMarker(y, label, width) {
	var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	if (!options.labelPos) { options.labelPos = 'right'; }
	var x = options.labelPos === 'left' ? LABEL_MARGIN : width - getStringWidth(label, 5) - LABEL_MARGIN;

	var labelSvg = createSVG('text', {
		className: 'chart-label',
		x: x,
		y: 0,
		dy: FONT_SIZE / -2 + 'px',
		'font-size': FONT_SIZE + 'px',
		'text-anchor': 'start',
		innerHTML: label + ""
	});

	var line = makeHoriLine(y, '', 0, width, {
		stroke: options.stroke || BASE_LINE_COLOR,
		className: options.className || '',
		lineType: options.lineType
	});

	line.appendChild(labelSvg);

	return line;
}

function yRegion(y1, y2, width, label) {
	var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

	// return a group
	var height = y1 - y2;

	var rect = createSVG('rect', {
		className: 'bar mini', // remove class
		styles: {
			fill: 'rgba(228, 234, 239, 0.49)',
			stroke: BASE_LINE_COLOR,
			'stroke-dasharray': width + ', ' + height
		},
		// 'data-point-index': index,
		x: 0,
		y: 0,
		width: width,
		height: height
	});

	if (!options.labelPos) { options.labelPos = 'right'; }
	var x = options.labelPos === 'left' ? LABEL_MARGIN : width - getStringWidth(label + "", 4.5) - LABEL_MARGIN;

	var labelSvg = createSVG('text', {
		className: 'chart-label',
		x: x,
		y: 0,
		dy: FONT_SIZE / -2 + 'px',
		'font-size': FONT_SIZE + 'px',
		'text-anchor': 'start',
		innerHTML: label + ""
	});

	var region = createSVG('g', {
		transform: 'translate(0, ' + y2 + ')'
	});

	region.appendChild(rect);
	region.appendChild(labelSvg);

	return region;
}

function datasetBar(x, yTop, width, color) {
	var label = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
	var index = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
	var offset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
	var meta = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};

	var _getBarHeightAndYAttr = getBarHeightAndYAttr(yTop, meta.zeroLine),
	    _getBarHeightAndYAttr2 = _slicedToArray(_getBarHeightAndYAttr, 2),
	    height = _getBarHeightAndYAttr2[0],
	    y = _getBarHeightAndYAttr2[1];

	y -= offset;

	if (height === 0) {
		height = meta.minHeight;
		y -= meta.minHeight;
	}

	var rect = createSVG('rect', {
		className: 'bar mini',
		style: 'fill: ' + color,
		'data-point-index': index,
		x: x,
		y: y,
		width: width,
		height: height
	});

	label += "";

	if (!label && !label.length) {
		return rect;
	} else {
		rect.setAttribute('y', 0);
		rect.setAttribute('x', 0);
		var text = createSVG('text', {
			className: 'data-point-value',
			x: width / 2,
			y: 0,
			dy: FONT_SIZE / 2 * -1 + 'px',
			'font-size': FONT_SIZE + 'px',
			'text-anchor': 'middle',
			innerHTML: label
		});

		var group = createSVG('g', {
			'data-point-index': index,
			transform: 'translate(' + x + ', ' + y + ')'
		});
		group.appendChild(rect);
		group.appendChild(text);

		return group;
	}
}

function datasetDot(x, y, radius, color) {
	var label = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
	var index = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

	var dot = createSVG('circle', {
		style: 'fill: ' + color,
		'data-point-index': index,
		cx: x,
		cy: y,
		r: radius
	});

	label += "";

	if (!label && !label.length) {
		return dot;
	} else {
		dot.setAttribute('cy', 0);
		dot.setAttribute('cx', 0);

		var text = createSVG('text', {
			className: 'data-point-value',
			x: 0,
			y: 0,
			dy: FONT_SIZE / 2 * -1 - radius + 'px',
			'font-size': FONT_SIZE + 'px',
			'text-anchor': 'middle',
			innerHTML: label
		});

		var group = createSVG('g', {
			'data-point-index': index,
			transform: 'translate(' + x + ', ' + y + ')'
		});
		group.appendChild(dot);
		group.appendChild(text);

		return group;
	}
}

function getPaths(xList, yList, color) {
	var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	var meta = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

	var pointsList = yList.map(function (y, i) {
		return xList[i] + ',' + y;
	});
	var pointsStr = pointsList.join("L");
	var path = makePath("M" + pointsStr, 'line-graph-path', color);

	// HeatLine
	if (options.heatline) {
		var gradient_id = makeGradient(meta.svgDefs, color);
		path.style.stroke = 'url(#' + gradient_id + ')';
	}

	var paths = {
		path: path
	};

	// Region
	if (options.areaFill) {
		var gradient_id_region = makeGradient(meta.svgDefs, color, true);

		var pathStr = "M" + (xList[0] + ',' + meta.zeroLine + 'L') + pointsStr + ('L' + xList.slice(-1)[0] + ',' + meta.zeroLine);
		paths.region = makePath(pathStr, 'region-fill', 'none', 'url(#' + gradient_id_region + ')');
	}

	return paths;
}

var makeOverlay = {
	'bar': function bar(unit) {
		var transformValue = void 0;
		if (unit.nodeName !== 'rect') {
			transformValue = unit.getAttribute('transform');
			unit = unit.childNodes[0];
		}
		var overlay = unit.cloneNode();
		overlay.style.fill = '#000000';
		overlay.style.opacity = '0.4';

		if (transformValue) {
			overlay.setAttribute('transform', transformValue);
		}
		return overlay;
	},

	'dot': function dot(unit) {
		var transformValue = void 0;
		if (unit.nodeName !== 'circle') {
			transformValue = unit.getAttribute('transform');
			unit = unit.childNodes[0];
		}
		var overlay = unit.cloneNode();
		var radius = unit.getAttribute('r');
		var fill = unit.getAttribute('fill');
		overlay.setAttribute('r', parseInt(radius) + DOT_OVERLAY_SIZE_INCR);
		overlay.setAttribute('fill', fill);
		overlay.style.opacity = '0.6';

		if (transformValue) {
			overlay.setAttribute('transform', transformValue);
		}
		return overlay;
	},

	'heat_square': function heat_square(unit) {
		var transformValue = void 0;
		if (unit.nodeName !== 'circle') {
			transformValue = unit.getAttribute('transform');
			unit = unit.childNodes[0];
		}
		var overlay = unit.cloneNode();
		var radius = unit.getAttribute('r');
		var fill = unit.getAttribute('fill');
		overlay.setAttribute('r', parseInt(radius) + DOT_OVERLAY_SIZE_INCR);
		overlay.setAttribute('fill', fill);
		overlay.style.opacity = '0.6';

		if (transformValue) {
			overlay.setAttribute('transform', transformValue);
		}
		return overlay;
	}
};

var updateOverlay = {
	'bar': function bar(unit, overlay) {
		var transformValue = void 0;
		if (unit.nodeName !== 'rect') {
			transformValue = unit.getAttribute('transform');
			unit = unit.childNodes[0];
		}
		var attributes = ['x', 'y', 'width', 'height'];
		Object.values(unit.attributes).filter(function (attr) {
			return attributes.includes(attr.name) && attr.specified;
		}).map(function (attr) {
			overlay.setAttribute(attr.name, attr.nodeValue);
		});

		if (transformValue) {
			overlay.setAttribute('transform', transformValue);
		}
	},

	'dot': function dot(unit, overlay) {
		var transformValue = void 0;
		if (unit.nodeName !== 'circle') {
			transformValue = unit.getAttribute('transform');
			unit = unit.childNodes[0];
		}
		var attributes = ['cx', 'cy'];
		Object.values(unit.attributes).filter(function (attr) {
			return attributes.includes(attr.name) && attr.specified;
		}).map(function (attr) {
			overlay.setAttribute(attr.name, attr.nodeValue);
		});

		if (transformValue) {
			overlay.setAttribute('transform', transformValue);
		}
	},

	'heat_square': function heat_square(unit, overlay) {
		var transformValue = void 0;
		if (unit.nodeName !== 'circle') {
			transformValue = unit.getAttribute('transform');
			unit = unit.childNodes[0];
		}
		var attributes = ['cx', 'cy'];
		Object.values(unit.attributes).filter(function (attr) {
			return attributes.includes(attr.name) && attr.specified;
		}).map(function (attr) {
			overlay.setAttribute(attr.name, attr.nodeValue);
		});

		if (transformValue) {
			overlay.setAttribute('transform', transformValue);
		}
	}
};

var _slicedToArray$2 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) { break; } } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) { _i["return"](); } } finally { if (_d) { throw _e; } } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var UNIT_ANIM_DUR = 350;
var PATH_ANIM_DUR = 350;
var MARKER_LINE_ANIM_DUR = UNIT_ANIM_DUR;
var REPLACE_ALL_NEW_DUR = 250;

var STD_EASING = 'easein';

function translate(unit, oldCoord, newCoord, duration) {
	var old = typeof oldCoord === 'string' ? oldCoord : oldCoord.join(', ');
	return [unit, { transform: newCoord.join(', ') }, duration, STD_EASING, "translate", { transform: old }];
}

function translateVertLine(xLine, newX, oldX) {
	return translate(xLine, [oldX, 0], [newX, 0], MARKER_LINE_ANIM_DUR);
}

function translateHoriLine(yLine, newY, oldY) {
	return translate(yLine, [0, oldY], [0, newY], MARKER_LINE_ANIM_DUR);
}

function animateRegion(rectGroup, newY1, newY2, oldY2) {
	var newHeight = newY1 - newY2;
	var rect = rectGroup.childNodes[0];
	var width = rect.getAttribute("width");
	var rectAnim = [rect, { height: newHeight, 'stroke-dasharray': width + ', ' + newHeight }, MARKER_LINE_ANIM_DUR, STD_EASING];

	var groupAnim = translate(rectGroup, [0, oldY2], [0, newY2], MARKER_LINE_ANIM_DUR);
	return [rectAnim, groupAnim];
}

function animateBar(bar, x, yTop, width) {
	var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	var meta = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

	var _getBarHeightAndYAttr = getBarHeightAndYAttr(yTop, meta.zeroLine),
	    _getBarHeightAndYAttr2 = _slicedToArray$2(_getBarHeightAndYAttr, 2),
	    height = _getBarHeightAndYAttr2[0],
	    y = _getBarHeightAndYAttr2[1];

	y -= offset;
	if (bar.nodeName !== 'rect') {
		var rect = bar.childNodes[0];
		var rectAnim = [rect, { width: width, height: height }, UNIT_ANIM_DUR, STD_EASING];

		var oldCoordStr = bar.getAttribute("transform").split("(")[1].slice(0, -1);
		var groupAnim = translate(bar, oldCoordStr, [x, y], MARKER_LINE_ANIM_DUR);
		return [rectAnim, groupAnim];
	} else {
		return [[bar, { width: width, height: height, x: x, y: y }, UNIT_ANIM_DUR, STD_EASING]];
	}
	// bar.animate({height: args.newHeight, y: yTop}, UNIT_ANIM_DUR, mina.easein);
}

function animateDot(dot, x, y) {
	if (dot.nodeName !== 'circle') {
		var oldCoordStr = dot.getAttribute("transform").split("(")[1].slice(0, -1);
		var groupAnim = translate(dot, oldCoordStr, [x, y], MARKER_LINE_ANIM_DUR);
		return [groupAnim];
	} else {
		return [[dot, { cx: x, cy: y }, UNIT_ANIM_DUR, STD_EASING]];
	}
	// dot.animate({cy: yTop}, UNIT_ANIM_DUR, mina.easein);
}

function animatePath(paths, newXList, newYList, zeroLine) {
	var pathComponents = [];

	var pointsStr = newYList.map(function (y, i) {
		return newXList[i] + ',' + y;
	});
	var pathStr = pointsStr.join("L");

	var animPath = [paths.path, { d: "M" + pathStr }, PATH_ANIM_DUR, STD_EASING];
	pathComponents.push(animPath);

	if (paths.region) {
		var regStartPt = newXList[0] + ',' + zeroLine + 'L';
		var regEndPt = 'L' + newXList.slice(-1)[0] + ', ' + zeroLine;

		var animRegion = [paths.region, { d: "M" + regStartPt + pathStr + regEndPt }, PATH_ANIM_DUR, STD_EASING];
		pathComponents.push(animRegion);
	}

	return pathComponents;
}

function animatePathStr(oldPath, pathStr) {
	return [oldPath, { d: pathStr }, UNIT_ANIM_DUR, STD_EASING];
}

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) { break; } } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) { _i["return"](); } } finally { if (_d) { throw _e; } } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Leveraging SMIL Animations

var EASING = {
	ease: "0.25 0.1 0.25 1",
	linear: "0 0 1 1",
	// easein: "0.42 0 1 1",
	easein: "0.1 0.8 0.2 1",
	easeout: "0 0 0.58 1",
	easeinout: "0.42 0 0.58 1"
};

function animateSVGElement(element, props, dur) {
	var easingType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "linear";
	var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
	var oldValues = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};


	var animElement = element.cloneNode(true);
	var newElement = element.cloneNode(true);

	for (var attributeName in props) {
		var animateElement = void 0;
		if (attributeName === 'transform') {
			animateElement = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
		} else {
			animateElement = document.createElementNS("http://www.w3.org/2000/svg", "animate");
		}
		var currentValue = oldValues[attributeName] || element.getAttribute(attributeName);
		var value = props[attributeName];

		var animAttr = {
			attributeName: attributeName,
			from: currentValue,
			to: value,
			begin: "0s",
			dur: dur / 1000 + "s",
			values: currentValue + ";" + value,
			keySplines: EASING[easingType],
			keyTimes: "0;1",
			calcMode: "spline",
			fill: 'freeze'
		};

		if (type) {
			animAttr["type"] = type;
		}

		for (var i in animAttr) {
			animateElement.setAttribute(i, animAttr[i]);
		}

		animElement.appendChild(animateElement);

		if (type) {
			newElement.setAttribute(attributeName, "translate(" + value + ")");
		} else {
			newElement.setAttribute(attributeName, value);
		}
	}

	return [animElement, newElement];
}

function transform(element, style) {
	// eslint-disable-line no-unused-vars
	element.style.transform = style;
	element.style.webkitTransform = style;
	element.style.msTransform = style;
	element.style.mozTransform = style;
	element.style.oTransform = style;
}

function animateSVG(svgContainer, elements) {
	var newElements = [];
	var animElements = [];

	elements.map(function (element) {
		var unit = element[0];
		var parent = unit.parentNode;

		var animElement = void 0,
		    newElement = void 0;

		element[0] = unit;

		var _animateSVGElement = animateSVGElement.apply(undefined, _toConsumableArray$1(element));

		var _animateSVGElement2 = _slicedToArray$1(_animateSVGElement, 2);

		animElement = _animateSVGElement2[0];
		newElement = _animateSVGElement2[1];


		newElements.push(newElement);
		animElements.push([animElement, parent]);

		parent.replaceChild(animElement, unit);
	});

	var animSvg = svgContainer.cloneNode(true);

	animElements.map(function (animElement, i) {
		animElement[1].replaceChild(newElements[i], animElement[0]);
		elements[i][0] = newElements[i];
	});

	return animSvg;
}

function runSMILAnimation(parent, svgElement, elementsToAnimate) {
	if (elementsToAnimate.length === 0) { return; }

	var animSvgElement = animateSVG(svgElement, elementsToAnimate);
	if (svgElement.parentNode == parent) {
		parent.removeChild(svgElement);
		parent.appendChild(animSvgElement);
	}

	// Replace the new svgElement (data has already been replaced)
	setTimeout(function () {
		if (animSvgElement.parentNode == parent) {
			parent.removeChild(animSvgElement);
			parent.appendChild(svgElement);
		}
	}, REPLACE_ALL_NEW_DUR);
}

var CSSTEXT = ".chart-container{position:relative;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif}.chart-container .axis,.chart-container .chart-label{fill:#555b51}.chart-container .axis line,.chart-container .chart-label line{stroke:#dadada}.chart-container .dataset-units circle{stroke:#fff;stroke-width:2}.chart-container .dataset-units path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container .dataset-path{stroke-width:2px}.chart-container .path-group path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container line.dashed{stroke-dasharray:5,3}.chart-container .axis-line .specific-value{text-anchor:start}.chart-container .axis-line .y-line{text-anchor:end}.chart-container .axis-line .x-line{text-anchor:middle}.chart-container .legend-dataset-text{fill:#6c7680;font-weight:600}.graph-svg-tip{position:absolute;z-index:99999;padding:10px;font-size:12px;color:#959da5;text-align:center;background:rgba(0,0,0,.8);border-radius:3px}.graph-svg-tip ul{padding-left:0;display:flex}.graph-svg-tip ol{padding-left:0;display:flex}.graph-svg-tip ul.data-point-list li{min-width:90px;flex:1;font-weight:600}.graph-svg-tip strong{color:#dfe2e5;font-weight:600}.graph-svg-tip .svg-pointer{position:absolute;height:5px;margin:0 0 0 -5px;content:' ';border:5px solid transparent;border-top-color:rgba(0,0,0,.8)}.graph-svg-tip.comparison{padding:0;text-align:left;pointer-events:none}.graph-svg-tip.comparison .title{display:block;padding:10px;margin:0;font-weight:600;line-height:1;pointer-events:none}.graph-svg-tip.comparison ul{margin:0;white-space:nowrap;list-style:none}.graph-svg-tip.comparison li{display:inline-block;padding:5px 10px}";

function downloadFile(filename, data) {
	var a = document.createElement('a');
	a.style = "display: none";
	var blob = new Blob(data, { type: "image/svg+xml; charset=utf-8" });
	var url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(function () {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 300);
}

function prepareForExport(svg) {
	var clone = svg.cloneNode(true);
	clone.classList.add('chart-container');
	clone.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	clone.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
	var styleEl = $$1.create('style', {
		'innerHTML': CSSTEXT
	});
	clone.insertBefore(styleEl, clone.firstChild);

	var container = $$1.create('div');
	container.appendChild(clone);

	return container.innerHTML;
}

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BOUND_DRAW_FN = void 0;

var BaseChart = function () {
	function BaseChart(parent, options) {
		_classCallCheck$3(this, BaseChart);

		this.parent = typeof parent === 'string' ? document.querySelector(parent) : parent;

		if (!(this.parent instanceof HTMLElement)) {
			throw new Error('No `parent` element to render on was provided.');
		}

		this.rawChartArgs = options;

		this.title = options.title || '';
		this.type = options.type || 'line';

		this.realData = this.prepareData(options.data);
		this.data = this.prepareFirstData(this.realData);

		this.colors = this.validateColors(options.colors, this.type);

		this.config = {
			showTooltip: 1, // calculate
			showLegend: 1, // calculate
			isNavigable: options.isNavigable || 0,
			animate: 1
		};

		this.measures = JSON.parse(JSON.stringify(BASE_MEASURES));
		var m = this.measures;
		this.setMeasures(options);
		if (!this.title.length) {
			m.titleHeight = 0;
		}
		if (!this.config.showLegend) { m.legendHeight = 0; }
		this.argHeight = options.height || m.baseHeight;

		this.state = {};
		this.options = {};

		this.initTimeout = INIT_CHART_UPDATE_TIMEOUT;

		if (this.config.isNavigable) {
			this.overlays = [];
		}

		this.configure(options);
	}

	_createClass$2(BaseChart, [{
		key: 'prepareData',
		value: function prepareData(data) {
			return data;
		}
	}, {
		key: 'prepareFirstData',
		value: function prepareFirstData(data) {
			return data;
		}
	}, {
		key: 'validateColors',
		value: function validateColors(colors, type) {
			var validColors = [];
			colors = (colors || []).concat(DEFAULT_COLORS[type]);
			colors.forEach(function (string) {
				var color = getColor(string);
				if (!isValidColor(color)) {
					console.warn('"' + string + '" is not a valid color.');
				} else {
					validColors.push(color);
				}
			});
			return validColors;
		}
	}, {
		key: 'setMeasures',
		value: function setMeasures() {
			// Override measures, including those for title and legend
			// set config for legend and title
		}
	}, {
		key: 'configure',
		value: function configure() {
			var height = this.argHeight;
			this.baseHeight = height;
			this.height = height - getExtraHeight(this.measures);

			// Bind window events
			BOUND_DRAW_FN = this.boundDrawFn.bind(this);
			window.addEventListener('resize', BOUND_DRAW_FN);
			window.addEventListener('orientationchange', this.boundDrawFn.bind(this));
		}
	}, {
		key: 'boundDrawFn',
		value: function boundDrawFn() {
			this.draw(true);
		}
	}, {
		key: 'unbindWindowEvents',
		value: function unbindWindowEvents() {
			window.removeEventListener('resize', BOUND_DRAW_FN);
			window.removeEventListener('orientationchange', this.boundDrawFn.bind(this));
		}

		// Has to be called manually

	}, {
		key: 'setup',
		value: function setup() {
			this.makeContainer();
			this.updateWidth();
			this.makeTooltip();

			this.draw(false, true);
		}
	}, {
		key: 'makeContainer',
		value: function makeContainer() {
			// Chart needs a dedicated parent element
			this.parent.innerHTML = '';

			var args = {
				inside: this.parent,
				className: 'chart-container'
			};

			if (this.independentWidth) {
				args.styles = { width: this.independentWidth + 'px' };
				this.parent.style.overflow = 'auto';
			}

			this.container = $$1.create('div', args);
		}
	}, {
		key: 'makeTooltip',
		value: function makeTooltip() {
			this.tip = new SvgTip({
				parent: this.container,
				colors: this.colors
			});
			this.bindTooltip();
		}
	}, {
		key: 'bindTooltip',
		value: function bindTooltip() {}
	}, {
		key: 'draw',
		value: function draw() {
			var _this = this;

			var onlyWidthChange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
			var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.updateWidth();

			this.calc(onlyWidthChange);
			this.makeChartArea();
			this.setupComponents();

			this.components.forEach(function (c) {
				return c.setup(_this.drawArea);
			});
			// this.components.forEach(c => c.make());
			this.render(this.components, false);

			if (init) {
				this.data = this.realData;
				setTimeout(function () {
					_this.update(_this.data);
				}, this.initTimeout);
			}

			this.renderLegend();

			this.setupNavigation(init);
		}
	}, {
		key: 'calc',
		value: function calc() {} // builds state

	}, {
		key: 'updateWidth',
		value: function updateWidth() {
			this.baseWidth = getElementContentWidth(this.parent);
			this.width = this.baseWidth - getExtraWidth(this.measures);
		}
	}, {
		key: 'makeChartArea',
		value: function makeChartArea() {
			if (this.svg) {
				this.container.removeChild(this.svg);
			}
			var m = this.measures;

			this.svg = makeSVGContainer(this.container, 'frappe-chart chart', this.baseWidth, this.baseHeight);
			this.svgDefs = makeSVGDefs(this.svg);

			if (this.title.length) {
				this.titleEL = makeText('title', m.margins.left, m.margins.top, this.title, {
					fontSize: m.titleFontSize,
					fill: '#666666',
					dy: m.titleFontSize
				});
			}

			var top = getTopOffset(m);
			this.drawArea = makeSVGGroup(this.type + '-chart chart-draw-area', 'translate(' + getLeftOffset(m) + ', ' + top + ')');

			if (this.config.showLegend) {
				top += this.height + m.paddings.bottom;
				this.legendArea = makeSVGGroup('chart-legend', 'translate(' + getLeftOffset(m) + ', ' + top + ')');
			}

			if (this.title.length) {
				this.svg.appendChild(this.titleEL);
			}
			this.svg.appendChild(this.drawArea);
			if (this.config.showLegend) {
				this.svg.appendChild(this.legendArea);
			}

			this.updateTipOffset(getLeftOffset(m), getTopOffset(m));
		}
	}, {
		key: 'updateTipOffset',
		value: function updateTipOffset(x, y) {
			this.tip.offset = {
				x: x,
				y: y
			};
		}
	}, {
		key: 'setupComponents',
		value: function setupComponents() {
			this.components = new Map();
		}
	}, {
		key: 'update',
		value: function update(data) {
			if (!data) {
				console.error('No data to update.');
			}
			this.data = this.prepareData(data);
			this.calc(); // builds state
			this.render();
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.components;
			var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (this.config.isNavigable) {
				// Remove all existing overlays
				this.overlays.map(function (o) {
					return o.parentNode.removeChild(o);
				});
				// ref.parentNode.insertBefore(element, ref);
			}
			var elementsToAnimate = [];
			// Can decouple to this.refreshComponents() first to save animation timeout
			components.forEach(function (c) {
				elementsToAnimate = elementsToAnimate.concat(c.update(animate));
			});
			if (elementsToAnimate.length > 0) {
				runSMILAnimation(this.container, this.svg, elementsToAnimate);
				setTimeout(function () {
					components.forEach(function (c) {
						return c.make();
					});
					_this2.updateNav();
				}, CHART_POST_ANIMATE_TIMEOUT);
			} else {
				components.forEach(function (c) {
					return c.make();
				});
				this.updateNav();
			}
		}
	}, {
		key: 'updateNav',
		value: function updateNav() {
			if (this.config.isNavigable) {
				this.makeOverlay();
				this.bindUnits();
			}
		}
	}, {
		key: 'renderLegend',
		value: function renderLegend() {}
	}, {
		key: 'setupNavigation',
		value: function setupNavigation() {
			var _this3 = this;

			var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (!this.config.isNavigable) { return; }

			if (init) {
				this.bindOverlay();

				this.keyActions = {
					'13': this.onEnterKey.bind(this),
					'37': this.onLeftArrow.bind(this),
					'38': this.onUpArrow.bind(this),
					'39': this.onRightArrow.bind(this),
					'40': this.onDownArrow.bind(this)
				};

				document.addEventListener('keydown', function (e) {
					if (isElementInViewport(_this3.container)) {
						e = e || window.event;
						if (_this3.keyActions[e.keyCode]) {
							_this3.keyActions[e.keyCode]();
						}
					}
				});
			}
		}
	}, {
		key: 'makeOverlay',
		value: function makeOverlay$$1() {}
	}, {
		key: 'updateOverlay',
		value: function updateOverlay$$1() {}
	}, {
		key: 'bindOverlay',
		value: function bindOverlay() {}
	}, {
		key: 'bindUnits',
		value: function bindUnits() {}
	}, {
		key: 'onLeftArrow',
		value: function onLeftArrow() {}
	}, {
		key: 'onRightArrow',
		value: function onRightArrow() {}
	}, {
		key: 'onUpArrow',
		value: function onUpArrow() {}
	}, {
		key: 'onDownArrow',
		value: function onDownArrow() {}
	}, {
		key: 'onEnterKey',
		value: function onEnterKey() {}
	}, {
		key: 'addDataPoint',
		value: function addDataPoint() {}
	}, {
		key: 'removeDataPoint',
		value: function removeDataPoint() {}
	}, {
		key: 'getDataPoint',
		value: function getDataPoint() {}
	}, {
		key: 'setCurrentDataPoint',
		value: function setCurrentDataPoint() {}
	}, {
		key: 'updateDataset',
		value: function updateDataset() {}
	}, {
		key: 'export',
		value: function _export() {
			var chartSvg = prepareForExport(this.svg);
			downloadFile(this.title || 'Chart', [chartSvg]);
		}
	}]);

	return BaseChart;
}();

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

var _get$1 = function get$$1(object, property, receiver) { if (object === null) { object = Function.prototype; } var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get$$1(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) { Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } }

var AggregationChart = function (_BaseChart) {
	_inherits$1(AggregationChart, _BaseChart);

	function AggregationChart(parent, args) {
		_classCallCheck$2(this, AggregationChart);

		return _possibleConstructorReturn$1(this, (AggregationChart.__proto__ || Object.getPrototypeOf(AggregationChart)).call(this, parent, args));
	}

	_createClass$1(AggregationChart, [{
		key: 'configure',
		value: function configure(args) {
			_get$1(AggregationChart.prototype.__proto__ || Object.getPrototypeOf(AggregationChart.prototype), 'configure', this).call(this, args);

			this.config.maxSlices = args.maxSlices || 20;
			this.config.maxLegendPoints = args.maxLegendPoints || 20;
		}
	}, {
		key: 'calc',
		value: function calc() {
			var _this2 = this;

			var s = this.state;
			var maxSlices = this.config.maxSlices;
			s.sliceTotals = [];

			var allTotals = this.data.labels.map(function (label, i) {
				var total = 0;
				_this2.data.datasets.map(function (e) {
					total += e.values[i];
				});
				return [total, label];
			}).filter(function (d) {
				return d[0] >= 0;
			}); // keep only positive results

			var totals = allTotals;
			if (allTotals.length > maxSlices) {
				// Prune and keep a grey area for rest as per maxSlices
				allTotals.sort(function (a, b) {
					return b[0] - a[0];
				});

				totals = allTotals.slice(0, maxSlices - 1);
				var remaining = allTotals.slice(maxSlices - 1);

				var sumOfRemaining = 0;
				remaining.map(function (d) {
					sumOfRemaining += d[0];
				});
				totals.push([sumOfRemaining, 'Rest']);
				this.colors[maxSlices - 1] = 'grey';
			}

			s.labels = [];
			totals.map(function (d) {
				s.sliceTotals.push(d[0]);
				s.labels.push(d[1]);
			});

			s.grandTotal = s.sliceTotals.reduce(function (a, b) {
				return a + b;
			}, 0);

			this.center = {
				x: this.width / 2,
				y: this.height / 2
			};
		}
	}, {
		key: 'renderLegend',
		value: function renderLegend() {
			var _this3 = this;

			var s = this.state;
			this.legendArea.textContent = '';
			this.legendTotals = s.sliceTotals.slice(0, this.config.maxLegendPoints);

			var count = 0;
			var y = 0;
			this.legendTotals.map(function (d, i) {
				var barWidth = 110;
				var divisor = Math.floor((_this3.width - getExtraWidth(_this3.measures)) / barWidth);
				if (count > divisor) {
					count = 0;
					y += 20;
				}
				var x = barWidth * count + 5;
				var dot = legendDot(x, y, 5, _this3.colors[i], s.labels[i] + ': ' + d);
				_this3.legendArea.appendChild(dot);
				count++;
			});
		}
	}]);

	return AggregationChart;
}(BaseChart);

// Playing around with dates

var NO_OF_YEAR_MONTHS = 12;
var NO_OF_DAYS_IN_WEEK = 7;

var NO_OF_MILLIS = 1000;
var SEC_IN_DAY = 86400;

var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


var DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


// https://stackoverflow.com/a/11252167/6495043
function treatAsUtc(date) {
	var result = new Date(date);
	result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
	return result;
}

function getYyyyMmDd(date) {
	var dd = date.getDate();
	var mm = date.getMonth() + 1; // getMonth() is zero-based
	return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
}

function clone(date) {
	return new Date(date.getTime());
}





// export function getMonthsBetween(startDate, endDate) {}

function getWeeksBetween(startDate, endDate) {
	var weekStartDate = setDayToSunday(startDate);
	return Math.ceil(getDaysBetween(weekStartDate, endDate) / NO_OF_DAYS_IN_WEEK);
}

function getDaysBetween(startDate, endDate) {
	var millisecondsPerDay = SEC_IN_DAY * NO_OF_MILLIS;
	return (treatAsUtc(endDate) - treatAsUtc(startDate)) / millisecondsPerDay;
}

function areInSameMonth(startDate, endDate) {
	return startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
}

function getMonthName(i) {
	var short = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	var monthName = MONTH_NAMES[i];
	return short ? monthName.slice(0, 3) : monthName;
}

function getLastDateInMonth(month, year) {
	return new Date(year, month + 1, 0); // 0: last day in previous month
}

// mutates
function setDayToSunday(date) {
	var newDate = clone(date);
	var day = newDate.getDay();
	if (day !== 0) {
		addDays(newDate, -1 * day);
	}
	return newDate;
}

// mutates
function addDays(date, numberOfDays) {
	date.setDate(date.getDate() + numberOfDays);
}

var _slicedToArray$3 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) { break; } } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) { _i["return"](); } } finally { if (_d) { throw _e; } } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChartComponent = function () {
	function ChartComponent(_ref) {
		var _ref$layerClass = _ref.layerClass,
		    layerClass = _ref$layerClass === undefined ? '' : _ref$layerClass,
		    _ref$layerTransform = _ref.layerTransform,
		    layerTransform = _ref$layerTransform === undefined ? '' : _ref$layerTransform,
		    constants = _ref.constants,
		    getData = _ref.getData,
		    makeElements = _ref.makeElements,
		    animateElements = _ref.animateElements;

		_classCallCheck$5(this, ChartComponent);

		this.layerTransform = layerTransform;
		this.constants = constants;

		this.makeElements = makeElements;
		this.getData = getData;

		this.animateElements = animateElements;

		this.store = [];
		this.labels = [];

		this.layerClass = layerClass;
		this.layerClass = typeof this.layerClass === 'function' ? this.layerClass() : this.layerClass;

		this.refresh();
	}

	_createClass$4(ChartComponent, [{
		key: 'refresh',
		value: function refresh(data) {
			this.data = data || this.getData();
		}
	}, {
		key: 'setup',
		value: function setup(parent) {
			this.layer = makeSVGGroup(this.layerClass, this.layerTransform, parent);
		}
	}, {
		key: 'make',
		value: function make() {
			this.render(this.data);
			this.oldData = this.data;
		}
	}, {
		key: 'render',
		value: function render(data) {
			var _this = this;

			this.store = this.makeElements(data);

			this.layer.textContent = '';
			this.store.forEach(function (element) {
				_this.layer.appendChild(element);
			});
			this.labels.forEach(function (element) {
				_this.layer.appendChild(element);
			});
		}
	}, {
		key: 'update',
		value: function update() {
			var animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this.refresh();
			var animateElements = [];
			if (animate) {
				animateElements = this.animateElements(this.data) || [];
			}
			return animateElements;
		}
	}]);

	return ChartComponent;
}();

var componentConfigs = {
	pieSlices: {
		layerClass: 'pie-slices',
		makeElements: function makeElements(data) {
			return data.sliceStrings.map(function (s, i) {
				var slice = makePath(s, 'pie-path', 'none', data.colors[i]);
				slice.style.transition = 'transform .3s;';
				return slice;
			});
		},
		animateElements: function animateElements(newData) {
			return this.store.map(function (slice, i) {
				return animatePathStr(slice, newData.sliceStrings[i]);
			});
		}
	},
	percentageBars: {
		layerClass: 'percentage-bars',
		makeElements: function makeElements(data) {
			var _this2 = this;

			return data.xPositions.map(function (x, i) {
				var y = 0;
				var bar = percentageBar(x, y, data.widths[i], _this2.constants.barHeight, _this2.constants.barDepth, data.colors[i]);
				return bar;
			});
		},
		animateElements: function animateElements(newData) {
			if (newData) { return []; }
		}
	},
	yAxis: {
		layerClass: 'y axis',
		makeElements: function makeElements(data) {
			var _this3 = this;

			return data.positions.map(function (position, i) {
				return yLine(position, data.labels[i], _this3.constants.width, { mode: _this3.constants.mode, pos: _this3.constants.pos });
			});
		},
		animateElements: function animateElements(newData) {
			var newPos = newData.positions;
			var newLabels = newData.labels;
			var oldPos = this.oldData.positions;
			var oldLabels = this.oldData.labels;

			var _equilizeNoOfElements = equilizeNoOfElements(oldPos, newPos);

			var _equilizeNoOfElements2 = _slicedToArray$3(_equilizeNoOfElements, 2);

			oldPos = _equilizeNoOfElements2[0];
			newPos = _equilizeNoOfElements2[1];

			var _equilizeNoOfElements3 = equilizeNoOfElements(oldLabels, newLabels);

			var _equilizeNoOfElements4 = _slicedToArray$3(_equilizeNoOfElements3, 2);

			oldLabels = _equilizeNoOfElements4[0];
			newLabels = _equilizeNoOfElements4[1];


			this.render({
				positions: oldPos,
				labels: newLabels
			});

			return this.store.map(function (line, i) {
				return translateHoriLine(line, newPos[i], oldPos[i]);
			});
		}
	},

	xAxis: {
		layerClass: 'x axis',
		makeElements: function makeElements(data) {
			var _this4 = this;

			return data.positions.map(function (position, i) {
				return xLine(position, data.calcLabels[i], _this4.constants.height, { mode: _this4.constants.mode, pos: _this4.constants.pos });
			});
		},
		animateElements: function animateElements(newData) {
			var newPos = newData.positions;
			var newLabels = newData.calcLabels;
			var oldPos = this.oldData.positions;
			var oldLabels = this.oldData.calcLabels;

			var _equilizeNoOfElements5 = equilizeNoOfElements(oldPos, newPos);

			var _equilizeNoOfElements6 = _slicedToArray$3(_equilizeNoOfElements5, 2);

			oldPos = _equilizeNoOfElements6[0];
			newPos = _equilizeNoOfElements6[1];

			var _equilizeNoOfElements7 = equilizeNoOfElements(oldLabels, newLabels);

			var _equilizeNoOfElements8 = _slicedToArray$3(_equilizeNoOfElements7, 2);

			oldLabels = _equilizeNoOfElements8[0];
			newLabels = _equilizeNoOfElements8[1];


			this.render({
				positions: oldPos,
				calcLabels: newLabels
			});

			return this.store.map(function (line, i) {
				return translateVertLine(line, newPos[i], oldPos[i]);
			});
		}
	},

	yMarkers: {
		layerClass: 'y-markers',
		makeElements: function makeElements(data) {
			var _this5 = this;

			return data.map(function (m) {
				return yMarker(m.position, m.label, _this5.constants.width, { labelPos: m.options.labelPos, mode: 'span', lineType: 'dashed' });
			});
		},
		animateElements: function animateElements(newData) {
			var _equilizeNoOfElements9 = equilizeNoOfElements(this.oldData, newData);

			var _equilizeNoOfElements10 = _slicedToArray$3(_equilizeNoOfElements9, 2);

			this.oldData = _equilizeNoOfElements10[0];
			newData = _equilizeNoOfElements10[1];


			var newPos = newData.map(function (d) {
				return d.position;
			});
			var newLabels = newData.map(function (d) {
				return d.label;
			});
			var newOptions = newData.map(function (d) {
				return d.options;
			});

			var oldPos = this.oldData.map(function (d) {
				return d.position;
			});

			this.render(oldPos.map(function (pos, i) {
				return {
					position: oldPos[i],
					label: newLabels[i],
					options: newOptions[i]
				};
			}));

			return this.store.map(function (line, i) {
				return translateHoriLine(line, newPos[i], oldPos[i]);
			});
		}
	},

	yRegions: {
		layerClass: 'y-regions',
		makeElements: function makeElements(data) {
			var _this6 = this;

			return data.map(function (r) {
				return yRegion(r.startPos, r.endPos, _this6.constants.width, r.label, { labelPos: r.options.labelPos });
			});
		},
		animateElements: function animateElements(newData) {
			var _equilizeNoOfElements11 = equilizeNoOfElements(this.oldData, newData);

			var _equilizeNoOfElements12 = _slicedToArray$3(_equilizeNoOfElements11, 2);

			this.oldData = _equilizeNoOfElements12[0];
			newData = _equilizeNoOfElements12[1];


			var newPos = newData.map(function (d) {
				return d.endPos;
			});
			var newLabels = newData.map(function (d) {
				return d.label;
			});
			var newStarts = newData.map(function (d) {
				return d.startPos;
			});
			var newOptions = newData.map(function (d) {
				return d.options;
			});

			var oldPos = this.oldData.map(function (d) {
				return d.endPos;
			});
			var oldStarts = this.oldData.map(function (d) {
				return d.startPos;
			});

			this.render(oldPos.map(function (pos, i) {
				return {
					startPos: oldStarts[i],
					endPos: oldPos[i],
					label: newLabels[i],
					options: newOptions[i]
				};
			}));

			var animateElements = [];

			this.store.map(function (rectGroup, i) {
				animateElements = animateElements.concat(animateRegion(rectGroup, newStarts[i], newPos[i], oldPos[i]));
			});

			return animateElements;
		}
	},

	heatDomain: {
		layerClass: function layerClass() {
			return 'heat-domain domain-' + this.constants.index;
		},
		makeElements: function makeElements(data) {
			var _this7 = this;

			var _constants = this.constants,
			    index = _constants.index,
			    colWidth = _constants.colWidth,
			    rowHeight = _constants.rowHeight,
			    squareSize = _constants.squareSize,
			    xTranslate = _constants.xTranslate;

			var monthNameHeight = -12;
			var x = xTranslate,
			    y = 0;

			this.serializedSubDomains = [];

			data.cols.map(function (week, weekNo) {
				if (weekNo === 1) {
					_this7.labels.push(makeText('domain-name', x, monthNameHeight, getMonthName(index, true).toUpperCase(), {
						fontSize: 9
					}));
				}
				week.map(function (day, i) {
					if (day.fill) {
						var _data = {
							'data-date': day.yyyyMmDd,
							'data-value': day.dataValue,
							'data-day': i
						};
						var square = heatSquare('day', x, y, squareSize, day.fill, _data);
						_this7.serializedSubDomains.push(square);
					}
					y += rowHeight;
				});
				y = 0;
				x += colWidth;
			});

			return this.serializedSubDomains;
		},
		animateElements: function animateElements(newData) {
			if (newData) { return []; }
		}
	},

	barGraph: {
		layerClass: function layerClass() {
			return 'dataset-units dataset-bars dataset-' + this.constants.index;
		},
		makeElements: function makeElements(data) {
			var c = this.constants;
			this.unitType = 'bar';
			this.units = data.yPositions.map(function (y, j) {
				return datasetBar(data.xPositions[j], y, data.barWidth, c.color, data.labels[j], j, data.offsets[j], {
					zeroLine: data.zeroLine,
					barsWidth: data.barsWidth,
					minHeight: c.minHeight
				});
			});
			return this.units;
		},
		animateElements: function animateElements(newData) {
			var newXPos = newData.xPositions;
			var newYPos = newData.yPositions;
			var newOffsets = newData.offsets;
			var newLabels = newData.labels;

			var oldXPos = this.oldData.xPositions;
			var oldYPos = this.oldData.yPositions;
			var oldOffsets = this.oldData.offsets;
			var oldLabels = this.oldData.labels;

			var _equilizeNoOfElements13 = equilizeNoOfElements(oldXPos, newXPos);

			var _equilizeNoOfElements14 = _slicedToArray$3(_equilizeNoOfElements13, 2);

			oldXPos = _equilizeNoOfElements14[0];
			newXPos = _equilizeNoOfElements14[1];

			var _equilizeNoOfElements15 = equilizeNoOfElements(oldYPos, newYPos);

			var _equilizeNoOfElements16 = _slicedToArray$3(_equilizeNoOfElements15, 2);

			oldYPos = _equilizeNoOfElements16[0];
			newYPos = _equilizeNoOfElements16[1];

			var _equilizeNoOfElements17 = equilizeNoOfElements(oldOffsets, newOffsets);

			var _equilizeNoOfElements18 = _slicedToArray$3(_equilizeNoOfElements17, 2);

			oldOffsets = _equilizeNoOfElements18[0];
			newOffsets = _equilizeNoOfElements18[1];

			var _equilizeNoOfElements19 = equilizeNoOfElements(oldLabels, newLabels);

			var _equilizeNoOfElements20 = _slicedToArray$3(_equilizeNoOfElements19, 2);

			oldLabels = _equilizeNoOfElements20[0];
			newLabels = _equilizeNoOfElements20[1];


			this.render({
				xPositions: oldXPos,
				yPositions: oldYPos,
				offsets: oldOffsets,
				labels: newLabels,

				zeroLine: this.oldData.zeroLine,
				barsWidth: this.oldData.barsWidth,
				barWidth: this.oldData.barWidth
			});

			var animateElements = [];

			this.store.map(function (bar, i) {
				animateElements = animateElements.concat(animateBar(bar, newXPos[i], newYPos[i], newData.barWidth, newOffsets[i], { zeroLine: newData.zeroLine }));
			});

			return animateElements;
		}
	},

	lineGraph: {
		layerClass: function layerClass() {
			return 'dataset-units dataset-line dataset-' + this.constants.index;
		},
		makeElements: function makeElements(data) {
			var c = this.constants;
			this.unitType = 'dot';
			this.paths = {};
			if (!c.hideLine) {
				this.paths = getPaths(data.xPositions, data.yPositions, c.color, {
					heatline: c.heatline,
					areaFill: c.areaFill
				}, {
					svgDefs: c.svgDefs,
					zeroLine: data.zeroLine
				});
			}

			this.units = [];
			if (!c.hideDots) {
				this.units = data.yPositions.map(function (y, j) {
					return datasetDot(data.xPositions[j], y, data.radius, c.color, c.valuesOverPoints ? data.values[j] : '', j);
				});
			}

			return Object.values(this.paths).concat(this.units);
		},
		animateElements: function animateElements(newData) {
			var newXPos = newData.xPositions;
			var newYPos = newData.yPositions;
			var newValues = newData.values;

			var oldXPos = this.oldData.xPositions;
			var oldYPos = this.oldData.yPositions;
			var oldValues = this.oldData.values;

			var _equilizeNoOfElements21 = equilizeNoOfElements(oldXPos, newXPos);

			var _equilizeNoOfElements22 = _slicedToArray$3(_equilizeNoOfElements21, 2);

			oldXPos = _equilizeNoOfElements22[0];
			newXPos = _equilizeNoOfElements22[1];

			var _equilizeNoOfElements23 = equilizeNoOfElements(oldYPos, newYPos);

			var _equilizeNoOfElements24 = _slicedToArray$3(_equilizeNoOfElements23, 2);

			oldYPos = _equilizeNoOfElements24[0];
			newYPos = _equilizeNoOfElements24[1];

			var _equilizeNoOfElements25 = equilizeNoOfElements(oldValues, newValues);

			var _equilizeNoOfElements26 = _slicedToArray$3(_equilizeNoOfElements25, 2);

			oldValues = _equilizeNoOfElements26[0];
			newValues = _equilizeNoOfElements26[1];


			this.render({
				xPositions: oldXPos,
				yPositions: oldYPos,
				values: newValues,

				zeroLine: this.oldData.zeroLine,
				radius: this.oldData.radius
			});

			var animateElements = [];

			if (Object.keys(this.paths).length) {
				animateElements = animateElements.concat(animatePath(this.paths, newXPos, newYPos, newData.zeroLine));
			}

			if (this.units.length) {
				this.units.map(function (dot, i) {
					animateElements = animateElements.concat(animateDot(dot, newXPos[i], newYPos[i]));
				});
			}

			return animateElements;
		}
	}
};

function getComponent(name, constants, getData) {
	var keys = Object.keys(componentConfigs).filter(function (k) {
		return name.includes(k);
	});
	var config = componentConfigs[keys[0]];
	Object.assign(config, {
		constants: constants,
		getData: getData
	});
	return new ChartComponent(config);
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

var _get = function get$$1(object, property, receiver) { if (object === null) { object = Function.prototype; } var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get$$1(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) { Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } }

var PercentageChart = function (_AggregationChart) {
	_inherits(PercentageChart, _AggregationChart);

	function PercentageChart(parent, args) {
		_classCallCheck$1(this, PercentageChart);

		var _this = _possibleConstructorReturn(this, (PercentageChart.__proto__ || Object.getPrototypeOf(PercentageChart)).call(this, parent, args));

		_this.type = 'percentage';
		_this.setup();
		return _this;
	}

	_createClass(PercentageChart, [{
		key: 'setMeasures',
		value: function setMeasures(options) {
			var m = this.measures;
			this.barOptions = options.barOptions || {};

			var b = this.barOptions;
			b.height = b.height || PERCENTAGE_BAR_DEFAULT_HEIGHT;
			b.depth = b.depth || PERCENTAGE_BAR_DEFAULT_DEPTH;

			m.paddings.right = 30;
			m.legendHeight = 80;
			m.baseHeight = (b.height + b.depth * 0.5) * 8;
		}
	}, {
		key: 'setupComponents',
		value: function setupComponents() {
			var s = this.state;

			var componentConfigs = [['percentageBars', {
				barHeight: this.barOptions.height,
				barDepth: this.barOptions.depth
			}, function () {
				return {
					xPositions: s.xPositions,
					widths: s.widths,
					colors: this.colors
				};
			}.bind(this)]];

			this.components = new Map(componentConfigs.map(function (args) {
				var component = getComponent.apply(undefined, _toConsumableArray(args));
				return [args[0], component];
			}));
		}
	}, {
		key: 'calc',
		value: function calc() {
			var _this2 = this;

			_get(PercentageChart.prototype.__proto__ || Object.getPrototypeOf(PercentageChart.prototype), 'calc', this).call(this);
			var s = this.state;

			s.xPositions = [];
			s.widths = [];

			var xPos = 0;
			s.sliceTotals.map(function (value) {
				var width = _this2.width * value / s.grandTotal;
				s.widths.push(width);
				s.xPositions.push(xPos);
				xPos += width;
			});
		}
	}, {
		key: 'makeDataByIndex',
		value: function makeDataByIndex() {}
	}, {
		key: 'bindTooltip',
		value: function bindTooltip() {
			var _this3 = this;

			var s = this.state;
			this.container.addEventListener('mousemove', function (e) {
				var bars = _this3.components.get('percentageBars').store;
				var bar = e.target;
				if (bars.includes(bar)) {

					var i = bars.indexOf(bar);
					var gOff = getOffset(_this3.container),
					    pOff = getOffset(bar);

					var x = pOff.left - gOff.left + parseInt(bar.getAttribute('width')) / 2;
					var y = pOff.top - gOff.top;
					var title = (_this3.formattedLabels && _this3.formattedLabels.length > 0 ? _this3.formattedLabels[i] : _this3.state.labels[i]) + ': ';
					var fraction = s.sliceTotals[i] / s.grandTotal;

					_this3.tip.setValues(x, y, { name: title, value: (fraction * 100).toFixed(1) + "%" });
					_this3.tip.showTip();
				}
			});
		}
	}]);

	return PercentageChart;
}(AggregationChart);

var _createClass$5 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

var _get$2 = function get$$1(object, property, receiver) { if (object === null) { object = Function.prototype; } var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get$$1(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray$2(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) { Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } }

var PieChart = function (_AggregationChart) {
	_inherits$2(PieChart, _AggregationChart);

	function PieChart(parent, args) {
		_classCallCheck$6(this, PieChart);

		var _this = _possibleConstructorReturn$2(this, (PieChart.__proto__ || Object.getPrototypeOf(PieChart)).call(this, parent, args));

		_this.type = 'pie';
		_this.initTimeout = 0;
		_this.init = 1;

		_this.setup();
		return _this;
	}

	_createClass$5(PieChart, [{
		key: 'configure',
		value: function configure(args) {
			_get$2(PieChart.prototype.__proto__ || Object.getPrototypeOf(PieChart.prototype), 'configure', this).call(this, args);
			this.mouseMove = this.mouseMove.bind(this);
			this.mouseLeave = this.mouseLeave.bind(this);

			this.hoverRadio = args.hoverRadio || 0.1;
			this.config.startAngle = args.startAngle || 0;

			this.clockWise = args.clockWise || false;
		}
	}, {
		key: 'calc',
		value: function calc() {
			var _this2 = this;

			_get$2(PieChart.prototype.__proto__ || Object.getPrototypeOf(PieChart.prototype), 'calc', this).call(this);
			var s = this.state;
			this.radius = this.height > this.width ? this.center.x : this.center.y;

			var radius = this.radius,
			    clockWise = this.clockWise;


			var prevSlicesProperties = s.slicesProperties || [];
			s.sliceStrings = [];
			s.slicesProperties = [];
			var curAngle = 180 - this.config.startAngle;

			s.sliceTotals.map(function (total, i) {
				var startAngle = curAngle;
				var originDiffAngle = total / s.grandTotal * FULL_ANGLE;
				var diffAngle = clockWise ? -originDiffAngle : originDiffAngle;
				var endAngle = curAngle = curAngle + diffAngle;
				var startPosition = getPositionByAngle(startAngle, radius);
				var endPosition = getPositionByAngle(endAngle, radius);

				var prevProperty = _this2.init && prevSlicesProperties[i];

				var curStart = void 0,
				    curEnd = void 0;
				if (_this2.init) {
					curStart = prevProperty ? prevProperty.startPosition : startPosition;
					curEnd = prevProperty ? prevProperty.endPosition : startPosition;
				} else {
					curStart = startPosition;
					curEnd = endPosition;
				}
				var curPath = makeArcPathStr(curStart, curEnd, _this2.center, _this2.radius, _this2.clockWise);

				s.sliceStrings.push(curPath);
				s.slicesProperties.push({
					startPosition: startPosition,
					endPosition: endPosition,
					value: total,
					total: s.grandTotal,
					startAngle: startAngle,
					endAngle: endAngle,
					angle: diffAngle
				});
			});
			this.init = 0;
		}
	}, {
		key: 'setupComponents',
		value: function setupComponents() {
			var s = this.state;

			var componentConfigs = [['pieSlices', {}, function () {
				return {
					sliceStrings: s.sliceStrings,
					colors: this.colors
				};
			}.bind(this)]];

			this.components = new Map(componentConfigs.map(function (args) {
				var component = getComponent.apply(undefined, _toConsumableArray$2(args));
				return [args[0], component];
			}));
		}
	}, {
		key: 'calTranslateByAngle',
		value: function calTranslateByAngle(property) {
			var radius = this.radius,
			    hoverRadio = this.hoverRadio;

			var position = getPositionByAngle(property.startAngle + property.angle / 2, radius);
			return 'translate3d(' + position.x * hoverRadio + 'px,' + position.y * hoverRadio + 'px,0)';
		}
	}, {
		key: 'hoverSlice',
		value: function hoverSlice(path, i, flag, e) {
			if (!path) { return; }
			var color = this.colors[i];
			if (flag) {
				transform(path, this.calTranslateByAngle(this.state.slicesProperties[i]));
				path.style.fill = lightenDarkenColor(color, 50);
				var g_off = getOffset(this.svg);
				var x = e.pageX - g_off.left + 10;
				var y = e.pageY - g_off.top - 10;
				var title = (this.formatted_labels && this.formatted_labels.length > 0 ? this.formatted_labels[i] : this.state.labels[i]) + ': ';
				var percent = (this.state.sliceTotals[i] * 100 / this.state.grandTotal).toFixed(1);
				this.tip.setValues(x, y, { name: title, value: percent + "%" });
				this.tip.showTip();
			} else {
				transform(path, 'translate3d(0,0,0)');
				this.tip.hideTip();
				path.style.fill = color;
			}
		}
	}, {
		key: 'bindTooltip',
		value: function bindTooltip() {
			this.container.addEventListener('mousemove', this.mouseMove);
			this.container.addEventListener('mouseleave', this.mouseLeave);
		}
	}, {
		key: 'mouseMove',
		value: function mouseMove(e) {
			var target = e.target;
			var slices = this.components.get('pieSlices').store;
			var prevIndex = this.curActiveSliceIndex;
			var prevAcitve = this.curActiveSlice;
			if (slices.includes(target)) {
				var i = slices.indexOf(target);
				this.hoverSlice(prevAcitve, prevIndex, false);
				this.curActiveSlice = target;
				this.curActiveSliceIndex = i;
				this.hoverSlice(target, i, true, e);
			} else {
				this.mouseLeave();
			}
		}
	}, {
		key: 'mouseLeave',
		value: function mouseLeave() {
			this.hoverSlice(this.curActiveSlice, this.curActiveSliceIndex, false);
		}
	}]);

	return PieChart;
}(AggregationChart);

var _slicedToArray$4 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) { break; } } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) { _i["return"](); } } finally { if (_d) { throw _e; } } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray$4(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function normalize$1(x) {
	// Calculates mantissa and exponent of a number
	// Returns normalized number and exponent
	// https://stackoverflow.com/q/9383593/6495043

	if (x === 0) {
		return [0, 0];
	}
	if (isNaN(x)) {
		return { mantissa: -6755399441055744, exponent: 972 };
	}
	var sig = x > 0 ? 1 : -1;
	if (!isFinite(x)) {
		return { mantissa: sig * 4503599627370496, exponent: 972 };
	}

	x = Math.abs(x);
	var exp = Math.floor(Math.log10(x));
	var man = x / Math.pow(10, exp);

	return [sig * man, exp];
}

function getChartRangeIntervals(max) {
	var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	var upperBound = Math.ceil(max);
	var lowerBound = Math.floor(min);
	var range = upperBound - lowerBound;

	var noOfParts = range;
	var partSize = 1;

	// To avoid too many partitions
	if (range > 5) {
		if (range % 2 !== 0) {
			upperBound++;
			// Recalc range
			range = upperBound - lowerBound;
		}
		noOfParts = range / 2;
		partSize = 2;
	}

	// Special case: 1 and 2
	if (range <= 2) {
		noOfParts = 4;
		partSize = range / noOfParts;
	}

	// Special case: 0
	if (range === 0) {
		noOfParts = 5;
		partSize = 1;
	}

	var intervals = [];
	for (var i = 0; i <= noOfParts; i++) {
		intervals.push(lowerBound + partSize * i);
	}
	return intervals;
}

function getChartIntervals(maxValue) {
	var minValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	var _normalize = normalize$1(maxValue),
	    _normalize2 = _slicedToArray$4(_normalize, 2),
	    normalMaxValue = _normalize2[0],
	    exponent = _normalize2[1];

	var normalMinValue = minValue ? minValue / Math.pow(10, exponent) : 0;

	// Allow only 7 significant digits
	normalMaxValue = normalMaxValue.toFixed(6);

	var intervals = getChartRangeIntervals(normalMaxValue, normalMinValue);
	intervals = intervals.map(function (value) {
		return value * Math.pow(10, exponent);
	});
	return intervals;
}

function calcChartIntervals(values) {
	var withMinimum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	//*** Where the magic happens ***

	// Calculates best-fit y intervals from given values
	// and returns the interval array

	var maxValue = Math.max.apply(Math, _toConsumableArray$4(values));
	var minValue = Math.min.apply(Math, _toConsumableArray$4(values));

	// Exponent to be used for pretty print
	var exponent = 0,
	    intervals = []; // eslint-disable-line no-unused-vars

	function getPositiveFirstIntervals(maxValue, absMinValue) {
		var intervals = getChartIntervals(maxValue);

		var intervalSize = intervals[1] - intervals[0];

		// Then unshift the negative values
		var value = 0;
		for (var i = 1; value < absMinValue; i++) {
			value += intervalSize;
			intervals.unshift(-1 * value);
		}
		return intervals;
	}

	// CASE I: Both non-negative

	if (maxValue >= 0 && minValue >= 0) {
		exponent = normalize$1(maxValue)[1];
		if (!withMinimum) {
			intervals = getChartIntervals(maxValue);
		} else {
			intervals = getChartIntervals(maxValue, minValue);
		}
	}

	// CASE II: Only minValue negative

	else if (maxValue > 0 && minValue < 0) {
			// `withMinimum` irrelevant in this case,
			// We'll be handling both sides of zero separately
			// (both starting from zero)
			// Because ceil() and floor() behave differently
			// in those two regions

			var absMinValue = Math.abs(minValue);

			if (maxValue >= absMinValue) {
				exponent = normalize$1(maxValue)[1];
				intervals = getPositiveFirstIntervals(maxValue, absMinValue);
			} else {
				// Mirror: maxValue => absMinValue, then change sign
				exponent = normalize$1(absMinValue)[1];
				var posIntervals = getPositiveFirstIntervals(absMinValue, maxValue);
				intervals = posIntervals.map(function (d) {
					return d * -1;
				});
			}
		}

		// CASE III: Both non-positive

		else if (maxValue <= 0 && minValue <= 0) {
				// Mirrored Case I:
				// Work with positives, then reverse the sign and array

				var pseudoMaxValue = Math.abs(minValue);
				var pseudoMinValue = Math.abs(maxValue);

				exponent = normalize$1(pseudoMaxValue)[1];
				if (!withMinimum) {
					intervals = getChartIntervals(pseudoMaxValue);
				} else {
					intervals = getChartIntervals(pseudoMaxValue, pseudoMinValue);
				}

				intervals = intervals.reverse().map(function (d) {
					return d * -1;
				});
			}

	return intervals;
}

function getZeroIndex(yPts) {
	var zeroIndex = void 0;
	var interval = getIntervalSize(yPts);
	if (yPts.indexOf(0) >= 0) {
		// the range has a given zero
		// zero-line on the chart
		zeroIndex = yPts.indexOf(0);
	} else if (yPts[0] > 0) {
		// Minimum value is positive
		// zero-line is off the chart: below
		var min = yPts[0];
		zeroIndex = -1 * min / interval;
	} else {
		// Maximum value is negative
		// zero-line is off the chart: above
		var max = yPts[yPts.length - 1];
		zeroIndex = -1 * max / interval + (yPts.length - 1);
	}
	return zeroIndex;
}



function getIntervalSize(orderedArray) {
	return orderedArray[1] - orderedArray[0];
}

function getValueRange(orderedArray) {
	return orderedArray[orderedArray.length - 1] - orderedArray[0];
}

function scale(val, yAxis) {
	return floatTwo(yAxis.zeroLine - val * yAxis.scaleMultiplier);
}





function getClosestInArray(goal, arr) {
	var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	var closest = arr.reduce(function (prev, curr) {
		return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
	});

	return index ? arr.indexOf(closest) : closest;
}

function calcDistribution(values, distributionSize) {
	// Assume non-negative values,
	// implying distribution minimum at zero

	var dataMaxValue = Math.max.apply(Math, _toConsumableArray$4(values));

	var distributionStep = 1 / (distributionSize - 1);
	var distribution = [];

	for (var i = 0; i < distributionSize; i++) {
		var checkpoint = dataMaxValue * (distributionStep * i);
		distribution.push(checkpoint);
	}

	return distribution;
}

function getMaxCheckpoint(value, distribution) {
	return distribution.filter(function (d) {
		return d < value;
	}).length;
}

var _createClass$6 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

function _toConsumableArray$3(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$3(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) { Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } }

var COL_WIDTH = HEATMAP_SQUARE_SIZE + HEATMAP_GUTTER_SIZE;
var ROW_HEIGHT = COL_WIDTH;
// const DAY_INCR = 1;

var Heatmap = function (_BaseChart) {
	_inherits$3(Heatmap, _BaseChart);

	function Heatmap(parent, options) {
		_classCallCheck$7(this, Heatmap);

		var _this = _possibleConstructorReturn$3(this, (Heatmap.__proto__ || Object.getPrototypeOf(Heatmap)).call(this, parent, options));

		_this.type = 'heatmap';

		_this.countLabel = options.countLabel || '';

		var validStarts = ['Sunday', 'Monday'];
		var startSubDomain = validStarts.includes(options.startSubDomain) ? options.startSubDomain : 'Sunday';
		_this.startSubDomainIndex = validStarts.indexOf(startSubDomain);

		_this.setup();
		return _this;
	}

	_createClass$6(Heatmap, [{
		key: 'setMeasures',
		value: function setMeasures(options) {
			var m = this.measures;
			this.discreteDomains = options.discreteDomains === 0 ? 0 : 1;

			m.paddings.top = ROW_HEIGHT * 3;
			m.paddings.bottom = 0;
			m.legendHeight = ROW_HEIGHT * 2;
			m.baseHeight = ROW_HEIGHT * NO_OF_DAYS_IN_WEEK + getExtraHeight(m);

			var d = this.data;
			var spacing = this.discreteDomains ? NO_OF_YEAR_MONTHS : 0;
			this.independentWidth = (getWeeksBetween(d.start, d.end) + spacing) * COL_WIDTH + getExtraWidth(m);
		}
	}, {
		key: 'updateWidth',
		value: function updateWidth() {
			var spacing = this.discreteDomains ? NO_OF_YEAR_MONTHS : 0;
			var noOfWeeks = this.state.noOfWeeks ? this.state.noOfWeeks : 52;
			this.baseWidth = (noOfWeeks + spacing) * COL_WIDTH + getExtraWidth(this.measures);
		}
	}, {
		key: 'prepareData',
		value: function prepareData() {
			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data;

			if (data.start && data.end && data.start > data.end) {
				throw new Error('Start date cannot be greater than end date.');
			}

			if (!data.start) {
				data.start = new Date();
				data.start.setFullYear(data.start.getFullYear() - 1);
			}
			if (!data.end) {
				data.end = new Date();
			}
			data.dataPoints = data.dataPoints || {};

			if (parseInt(Object.keys(data.dataPoints)[0]) > 100000) {
				var points = {};
				Object.keys(data.dataPoints).forEach(function (timestampSec$$1) {
					var date = new Date(timestampSec$$1 * NO_OF_MILLIS);
					points[getYyyyMmDd(date)] = data.dataPoints[timestampSec$$1];
				});
				data.dataPoints = points;
			}

			return data;
		}
	}, {
		key: 'calc',
		value: function calc() {
			var s = this.state;

			s.start = clone(this.data.start);
			s.end = clone(this.data.end);

			s.firstWeekStart = clone(s.start);
			s.noOfWeeks = getWeeksBetween(s.start, s.end);
			s.distribution = calcDistribution(Object.values(this.data.dataPoints), HEATMAP_DISTRIBUTION_SIZE);

			s.domainConfigs = this.getDomains();
		}
	}, {
		key: 'setupComponents',
		value: function setupComponents() {
			var _this2 = this;

			var s = this.state;
			var lessCol = this.discreteDomains ? 0 : 1;

			var componentConfigs = s.domainConfigs.map(function (config, i) {
				return ['heatDomain', {
					index: config.index,
					colWidth: COL_WIDTH,
					rowHeight: ROW_HEIGHT,
					squareSize: HEATMAP_SQUARE_SIZE,
					xTranslate: s.domainConfigs.filter(function (config, j) {
						return j < i;
					}).map(function (config) {
						return config.cols.length - lessCol;
					}).reduce(function (a, b) {
						return a + b;
					}, 0) * COL_WIDTH
				}, function () {
					return s.domainConfigs[i];
				}.bind(_this2)];
			});

			this.components = new Map(componentConfigs.map(function (args, i) {
				var component = getComponent.apply(undefined, _toConsumableArray$3(args));
				return [args[0] + '-' + i, component];
			}));

			var y = 0;
			DAY_NAMES_SHORT.forEach(function (dayName, i) {
				if ([1, 3, 5].includes(i)) {
					var dayText = makeText('subdomain-name', -COL_WIDTH / 2, y, dayName, {
						fontSize: HEATMAP_SQUARE_SIZE,
						dy: 8,
						textAnchor: 'end'
					});
					_this2.drawArea.appendChild(dayText);
				}
				y += ROW_HEIGHT;
			});
		}
	}, {
		key: 'update',
		value: function update(data) {
			if (!data) {
				console.error('No data to update.');
			}

			this.data = this.prepareData(data);
			this.draw();
			this.bindTooltip();
		}
	}, {
		key: 'bindTooltip',
		value: function bindTooltip() {
			var _this3 = this;

			this.container.addEventListener('mousemove', function (e) {
				_this3.components.forEach(function (comp) {
					var daySquares = comp.store;
					var daySquare = e.target;
					if (daySquares.includes(daySquare)) {

						var count = daySquare.getAttribute('data-value');
						var dateParts = daySquare.getAttribute('data-date').split('-');

						var month = getMonthName(parseInt(dateParts[1]) - 1, true);

						var gOff = _this3.container.getBoundingClientRect(),
						    pOff = daySquare.getBoundingClientRect();

						var width = parseInt(e.target.getAttribute('width'));
						var x = pOff.left - gOff.left + width / 2;
						var y = pOff.top - gOff.top;
						var value = count + ' ' + _this3.countLabel;
						var name = ' on ' + month + ' ' + dateParts[0] + ', ' + dateParts[2];

						_this3.tip.setValues(x, y, { name: name, value: value, valueFirst: 1 }, []);
						_this3.tip.showTip();
					}
				});
			});
		}
	}, {
		key: 'renderLegend',
		value: function renderLegend() {
			var _this4 = this;

			this.legendArea.textContent = '';
			var x = 0;
			var y = ROW_HEIGHT;

			var lessText = makeText('subdomain-name', x, y, 'Less', {
				fontSize: HEATMAP_SQUARE_SIZE + 1,
				dy: 9
			});
			x = COL_WIDTH * 2 + COL_WIDTH / 2;
			this.legendArea.appendChild(lessText);

			this.colors.slice(0, HEATMAP_DISTRIBUTION_SIZE).map(function (color, i) {
				var square = heatSquare('heatmap-legend-unit', x + (COL_WIDTH + 3) * i, y, HEATMAP_SQUARE_SIZE, color);
				_this4.legendArea.appendChild(square);
			});

			var moreTextX = x + HEATMAP_DISTRIBUTION_SIZE * (COL_WIDTH + 3) + COL_WIDTH / 4;
			var moreText = makeText('subdomain-name', moreTextX, y, 'More', {
				fontSize: HEATMAP_SQUARE_SIZE + 1,
				dy: 9
			});
			this.legendArea.appendChild(moreText);
		}
	}, {
		key: 'getDomains',
		value: function getDomains() {
			var this$1 = this;

			var s = this.state;
			var _ref = [s.start.getMonth(), s.start.getFullYear()],
			    startMonth = _ref[0],
			    startYear = _ref[1];
			var _ref2 = [s.end.getMonth(), s.end.getFullYear()],
			    endMonth = _ref2[0],
			    endYear = _ref2[1];


			var noOfMonths = endMonth - startMonth + 1 + (endYear - startYear) * 12;

			var domainConfigs = [];

			var startOfMonth = clone(s.start);
			for (var i = 0; i < noOfMonths; i++) {
				var endDate = s.end;
				if (!areInSameMonth(startOfMonth, s.end)) {
					var _ref3 = [startOfMonth.getMonth(), startOfMonth.getFullYear()],
					    month = _ref3[0],
					    year = _ref3[1];

					endDate = getLastDateInMonth(month, year);
				}
				domainConfigs.push(this$1.getDomainConfig(startOfMonth, endDate));

				addDays(endDate, 1);
				startOfMonth = endDate;
			}

			return domainConfigs;
		}
	}, {
		key: 'getDomainConfig',
		value: function getDomainConfig(startDate) {
			var this$1 = this;

			var endDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
			var _ref4 = [startDate.getMonth(), startDate.getFullYear()],
			    month = _ref4[0],
			    year = _ref4[1];

			var startOfWeek = setDayToSunday(startDate); // TODO: Monday as well
			endDate = clone(endDate) || getLastDateInMonth(month, year);

			var domainConfig = {
				index: month,
				cols: []
			};

			addDays(endDate, 1);
			var noOfMonthWeeks = getWeeksBetween(startOfWeek, endDate);

			var cols = [],
			    col = void 0;
			for (var i = 0; i < noOfMonthWeeks; i++) {
				col = this$1.getCol(startOfWeek, month);
				cols.push(col);

				startOfWeek = new Date(col[NO_OF_DAYS_IN_WEEK - 1].yyyyMmDd);
				addDays(startOfWeek, 1);
			}

			if (col[NO_OF_DAYS_IN_WEEK - 1].dataValue !== undefined) {
				addDays(startOfWeek, 1);
				cols.push(this.getCol(startOfWeek, month, true));
			}

			domainConfig.cols = cols;

			return domainConfig;
		}
	}, {
		key: 'getCol',
		value: function getCol(startDate, month) {
			var this$1 = this;

			var empty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var s = this.state;

			// startDate is the start of week
			var currentDate = clone(startDate);
			var col = [];

			for (var i = 0; i < NO_OF_DAYS_IN_WEEK; i++, addDays(currentDate, 1)) {
				var config = {};

				// Non-generic adjustment for entire heatmap, needs state
				var currentDateWithinData = currentDate >= s.start && currentDate <= s.end;

				if (empty || currentDate.getMonth() !== month || !currentDateWithinData) {
					config.yyyyMmDd = getYyyyMmDd(currentDate);
				} else {
					config = this$1.getSubDomainConfig(currentDate);
				}
				col.push(config);
			}

			return col;
		}
	}, {
		key: 'getSubDomainConfig',
		value: function getSubDomainConfig(date) {
			var yyyyMmDd = getYyyyMmDd(date);
			var dataValue = this.data.dataPoints[yyyyMmDd];
			var config = {
				yyyyMmDd: yyyyMmDd,
				dataValue: dataValue || 0,
				fill: this.colors[getMaxCheckpoint(dataValue, this.state.distribution)]
			};
			return config;
		}
	}]);

	return Heatmap;
}(BaseChart);

function dataPrep(data, type) {
	data.labels = data.labels || [];

	var datasetLength = data.labels.length;

	// Datasets
	var datasets = data.datasets;
	var zeroArray = new Array(datasetLength).fill(0);
	if (!datasets) {
		// default
		datasets = [{
			values: zeroArray
		}];
	}

	var overridingType = void 0;
	if (AXIS_DATASET_CHART_TYPES.includes(type)) {
		overridingType = type;
	}

	datasets.map(function (d) {
		// Set values
		if (!d.values) {
			d.values = zeroArray;
		} else {
			// Check for non values
			var vals = d.values;
			vals = vals.map(function (val) {
				return !isNaN(val) ? val : 0;
			});

			// Trim or extend
			if (vals.length > datasetLength) {
				vals = vals.slice(0, datasetLength);
			} else {
				vals = fillArray(vals, datasetLength - vals.length, 0);
			}
		}

		// Set labels

		// Set type
		if (overridingType) {
			d.chartType = overridingType;
		} else if (!d.chartType) {
			d.chartType = AXIS_CHART_DEFAULT_TYPE;
		}
	});

	// Markers

	// Regions
	// data.yRegions = data.yRegions || [];
	if (data.yRegions) {
		data.yRegions.map(function (d) {
			if (d.end < d.start) {
				var _ref = [d.end, d.start];
				d.start = _ref[0];
				d.end = _ref[1];
			}
		});
	}

	return data;
}

function zeroDataPrep(realData) {
	var datasetLength = realData.labels.length;
	var zeroArray = new Array(datasetLength).fill(0);

	var zeroData = {
		labels: realData.labels.slice(0, -1),
		datasets: realData.datasets.map(function (d) {
			return {
				name: '',
				values: zeroArray.slice(0, -1),
				chartType: d.chartType
			};
		})
	};

	if (realData.yMarkers) {
		zeroData.yMarkers = [{
			value: 0,
			label: ''
		}];
	}

	if (realData.yRegions) {
		zeroData.yRegions = [{
			start: 0,
			end: 0,
			label: ''
		}];
	}

	return zeroData;
}

function getShortenedLabels(chartWidth) {
	var labels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	var isSeries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	var allowedSpace = chartWidth / labels.length;
	if (allowedSpace <= 0) { allowedSpace = 1; }
	var allowedLetters = allowedSpace / DEFAULT_CHAR_WIDTH;

	var calcLabels = labels.map(function (label, i) {
		label += "";
		if (label.length > allowedLetters) {

			if (!isSeries) {
				if (allowedLetters - 3 > 0) {
					label = label.slice(0, allowedLetters - 3) + " ...";
				} else {
					label = label.slice(0, allowedLetters) + '..';
				}
			} else {
				var multiple = Math.ceil(label.length / allowedLetters);
				if (i % multiple !== 0) {
					label = "";
				}
			}
		}
		return label;
	});

	return calcLabels;
}

var _createClass$7 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

var _get$3 = function get$$1(object, property, receiver) { if (object === null) { object = Function.prototype; } var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get$$1(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toConsumableArray$5(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$4(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$4(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) { Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } }

var AxisChart = function (_BaseChart) {
	_inherits$4(AxisChart, _BaseChart);

	function AxisChart(parent, args) {
		_classCallCheck$8(this, AxisChart);

		var _this = _possibleConstructorReturn$4(this, (AxisChart.__proto__ || Object.getPrototypeOf(AxisChart)).call(this, parent, args));

		_this.barOptions = args.barOptions || {};
		_this.lineOptions = args.lineOptions || {};

		_this.init = 1;

		_this.setup();
		return _this;
	}

	_createClass$7(AxisChart, [{
		key: 'setMeasures',
		value: function setMeasures() {
			if (this.data.datasets.length <= 1) {
				this.config.showLegend = 0;
				this.measures.paddings.bottom = 30;
			}
		}
	}, {
		key: 'configure',
		value: function configure(options) {
			_get$3(AxisChart.prototype.__proto__ || Object.getPrototypeOf(AxisChart.prototype), 'configure', this).call(this, options);

			options.axisOptions = options.axisOptions || {};
			options.tooltipOptions = options.tooltipOptions || {};

			this.config.xAxisMode = options.axisOptions.xAxisMode || 'span';
			this.config.yAxisMode = options.axisOptions.yAxisMode || 'span';
			this.config.xIsSeries = options.axisOptions.xIsSeries || 0;

			this.config.formatTooltipX = options.tooltipOptions.formatTooltipX;
			this.config.formatTooltipY = options.tooltipOptions.formatTooltipY;

			this.config.valuesOverPoints = options.valuesOverPoints;
		}
	}, {
		key: 'prepareData',
		value: function prepareData() {
			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data;

			return dataPrep(data, this.type);
		}
	}, {
		key: 'prepareFirstData',
		value: function prepareFirstData() {
			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data;

			return zeroDataPrep(data);
		}
	}, {
		key: 'calc',
		value: function calc() {
			var onlyWidthChange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			this.calcXPositions();
			if (!onlyWidthChange) {
				this.calcYAxisParameters(this.getAllYValues(), this.type === 'line');
			}
			this.makeDataByIndex();
		}
	}, {
		key: 'calcXPositions',
		value: function calcXPositions() {
			var s = this.state;
			var labels = this.data.labels;
			s.datasetLength = labels.length;

			s.unitWidth = this.width / s.datasetLength;
			// Default, as per bar, and mixed. Only line will be a special case
			s.xOffset = s.unitWidth / 2;

			// // For a pure Line Chart
			// s.unitWidth = this.width/(s.datasetLength - 1);
			// s.xOffset = 0;

			s.xAxis = {
				labels: labels,
				positions: labels.map(function (d, i) {
					return floatTwo(s.xOffset + i * s.unitWidth);
				})
			};
		}
	}, {
		key: 'calcYAxisParameters',
		value: function calcYAxisParameters(dataValues) {
			var withMinimum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'false';

			var yPts = calcChartIntervals(dataValues, withMinimum);
			var scaleMultiplier = this.height / getValueRange(yPts);
			var intervalHeight = getIntervalSize(yPts) * scaleMultiplier;
			var zeroLine = this.height - getZeroIndex(yPts) * intervalHeight;

			this.state.yAxis = {
				labels: yPts,
				positions: yPts.map(function (d) {
					return zeroLine - d * scaleMultiplier;
				}),
				scaleMultiplier: scaleMultiplier,
				zeroLine: zeroLine
			};

			// Dependent if above changes
			this.calcDatasetPoints();
			this.calcYExtremes();
			this.calcYRegions();
		}
	}, {
		key: 'calcDatasetPoints',
		value: function calcDatasetPoints() {
			var s = this.state;
			var scaleAll = function scaleAll(values) {
				return values.map(function (val) {
					return scale(val, s.yAxis);
				});
			};

			s.datasets = this.data.datasets.map(function (d, i) {
				var values = d.values;
				var cumulativeYs = d.cumulativeYs || [];
				return {
					name: d.name,
					index: i,
					chartType: d.chartType,

					values: values,
					yPositions: scaleAll(values),

					cumulativeYs: cumulativeYs,
					cumulativeYPos: scaleAll(cumulativeYs)
				};
			});
		}
	}, {
		key: 'calcYExtremes',
		value: function calcYExtremes() {
			var s = this.state;
			if (this.barOptions.stacked) {
				s.yExtremes = s.datasets[s.datasets.length - 1].cumulativeYPos;
				return;
			}
			s.yExtremes = new Array(s.datasetLength).fill(9999);
			s.datasets.map(function (d) {
				d.yPositions.map(function (pos, j) {
					if (pos < s.yExtremes[j]) {
						s.yExtremes[j] = pos;
					}
				});
			});
		}
	}, {
		key: 'calcYRegions',
		value: function calcYRegions() {
			var s = this.state;
			if (this.data.yMarkers) {
				this.state.yMarkers = this.data.yMarkers.map(function (d) {
					d.position = scale(d.value, s.yAxis);
					if (!d.options) { d.options = {}; }
					// if(!d.label.includes(':')) {
					// 	d.label += ': ' + d.value;
					// }
					return d;
				});
			}
			if (this.data.yRegions) {
				this.state.yRegions = this.data.yRegions.map(function (d) {
					d.startPos = scale(d.start, s.yAxis);
					d.endPos = scale(d.end, s.yAxis);
					if (!d.options) { d.options = {}; }
					return d;
				});
			}
		}
	}, {
		key: 'getAllYValues',
		value: function getAllYValues() {
			var _this2 = this,
			    _ref;

			var key = 'values';

			if (this.barOptions.stacked) {
				key = 'cumulativeYs';
				var cumulative = new Array(this.state.datasetLength).fill(0);
				this.data.datasets.map(function (d, i) {
					var values = _this2.data.datasets[i].values;
					d[key] = cumulative = cumulative.map(function (c, i) {
						return c + values[i];
					});
				});
			}

			var allValueLists = this.data.datasets.map(function (d) {
				return d[key];
			});
			if (this.data.yMarkers) {
				allValueLists.push(this.data.yMarkers.map(function (d) {
					return d.value;
				}));
			}
			if (this.data.yRegions) {
				this.data.yRegions.map(function (d) {
					allValueLists.push([d.end, d.start]);
				});
			}

			return (_ref = []).concat.apply(_ref, _toConsumableArray$5(allValueLists));
		}
	}, {
		key: 'setupComponents',
		value: function setupComponents() {
			var _this3 = this;

			var componentConfigs = [['yAxis', {
				mode: this.config.yAxisMode,
				width: this.width
				// pos: 'right'
			}, function () {
				return this.state.yAxis;
			}.bind(this)], ['xAxis', {
				mode: this.config.xAxisMode,
				height: this.height
				// pos: 'right'
			}, function () {
				var s = this.state;
				s.xAxis.calcLabels = getShortenedLabels(this.width, s.xAxis.labels, this.config.xIsSeries);

				return s.xAxis;
			}.bind(this)], ['yRegions', {
				width: this.width,
				pos: 'right'
			}, function () {
				return this.state.yRegions;
			}.bind(this)]];

			var barDatasets = this.state.datasets.filter(function (d) {
				return d.chartType === 'bar';
			});
			var lineDatasets = this.state.datasets.filter(function (d) {
				return d.chartType === 'line';
			});

			var barsConfigs = barDatasets.map(function (d) {
				var index = d.index;
				return ['barGraph' + '-' + d.index, {
					index: index,
					color: _this3.colors[index],
					stacked: _this3.barOptions.stacked,

					// same for all datasets
					valuesOverPoints: _this3.config.valuesOverPoints,
					minHeight: _this3.height * MIN_BAR_PERCENT_HEIGHT
				}, function () {
					var s = this.state;
					var d = s.datasets[index];
					var stacked = this.barOptions.stacked;

					var spaceRatio = this.barOptions.spaceRatio || BAR_CHART_SPACE_RATIO;
					var barsWidth = s.unitWidth / 2 * (2 - spaceRatio);
					var barWidth = barsWidth / (stacked ? 1 : barDatasets.length);

					var xPositions = s.xAxis.positions.map(function (x) {
						return x - barsWidth / 2;
					});
					if (!stacked) {
						xPositions = xPositions.map(function (p) {
							return p + barWidth * index;
						});
					}

					var labels = new Array(s.datasetLength).fill('');
					if (this.config.valuesOverPoints) {
						if (stacked && d.index === s.datasets.length - 1) {
							labels = d.cumulativeYs;
						} else {
							labels = d.values;
						}
					}

					var offsets = new Array(s.datasetLength).fill(0);
					if (stacked) {
						offsets = d.yPositions.map(function (y, j) {
							return y - d.cumulativeYPos[j];
						});
					}

					return {
						xPositions: xPositions,
						yPositions: d.yPositions,
						offsets: offsets,
						// values: d.values,
						labels: labels,

						zeroLine: s.yAxis.zeroLine,
						barsWidth: barsWidth,
						barWidth: barWidth
					};
				}.bind(_this3)];
			});

			var lineConfigs = lineDatasets.map(function (d) {
				var index = d.index;
				return ['lineGraph' + '-' + d.index, {
					index: index,
					color: _this3.colors[index],
					svgDefs: _this3.svgDefs,
					heatline: _this3.lineOptions.heatline,
					areaFill: _this3.lineOptions.areaFill,
					hideDots: _this3.lineOptions.hideDots,
					hideLine: _this3.lineOptions.hideLine,

					// same for all datasets
					valuesOverPoints: _this3.config.valuesOverPoints
				}, function () {
					var s = this.state;
					var d = s.datasets[index];
					var minLine = s.yAxis.positions[0] < s.yAxis.zeroLine ? s.yAxis.positions[0] : s.yAxis.zeroLine;

					return {
						xPositions: s.xAxis.positions,
						yPositions: d.yPositions,

						values: d.values,

						zeroLine: minLine,
						radius: this.lineOptions.dotSize || LINE_CHART_DOT_SIZE
					};
				}.bind(_this3)];
			});

			var markerConfigs = [['yMarkers', {
				width: this.width,
				pos: 'right'
			}, function () {
				return this.state.yMarkers;
			}.bind(this)]];

			componentConfigs = componentConfigs.concat(barsConfigs, lineConfigs, markerConfigs);

			var optionals = ['yMarkers', 'yRegions'];
			this.dataUnitComponents = [];

			this.components = new Map(componentConfigs.filter(function (args) {
				return !optionals.includes(args[0]) || _this3.state[args[0]];
			}).map(function (args) {
				var component = getComponent.apply(undefined, _toConsumableArray$5(args));
				if (args[0].includes('lineGraph') || args[0].includes('barGraph')) {
					_this3.dataUnitComponents.push(component);
				}
				return [args[0], component];
			}));
		}
	}, {
		key: 'makeDataByIndex',
		value: function makeDataByIndex() {
			var _this4 = this;

			this.dataByIndex = {};

			var s = this.state;
			var formatX = this.config.formatTooltipX;
			var formatY = this.config.formatTooltipY;
			var titles = s.xAxis.labels;

			titles.map(function (label, index) {
				var values = _this4.state.datasets.map(function (set$$1, i) {
					var value = set$$1.values[index];
					return {
						title: set$$1.name,
						value: value,
						yPos: set$$1.yPositions[index],
						color: _this4.colors[i],
						formatted: formatY ? formatY(value) : value
					};
				});

				_this4.dataByIndex[index] = {
					label: label,
					formattedLabel: formatX ? formatX(label) : label,
					xPos: s.xAxis.positions[index],
					values: values,
					yExtreme: s.yExtremes[index]
				};
			});
		}
	}, {
		key: 'bindTooltip',
		value: function bindTooltip() {
			var _this5 = this;

			// NOTE: could be in tooltip itself, as it is a given functionality for its parent
			this.container.addEventListener('mousemove', function (e) {
				var m = _this5.measures;
				var o = getOffset(_this5.container);
				var relX = e.pageX - o.left - getLeftOffset(m);
				var relY = e.pageY - o.top;

				if (relY < _this5.height + getTopOffset(m) && relY > getTopOffset(m)) {
					_this5.mapTooltipXPosition(relX);
				} else {
					_this5.tip.hideTip();
				}
			});
		}
	}, {
		key: 'mapTooltipXPosition',
		value: function mapTooltipXPosition(relX) {
			var s = this.state;
			if (!s.yExtremes) { return; }

			var index = getClosestInArray(relX, s.xAxis.positions, true);
			var dbi = this.dataByIndex[index];

			this.tip.setValues(dbi.xPos + this.tip.offset.x, dbi.yExtreme + this.tip.offset.y, { name: dbi.formattedLabel, value: '' }, dbi.values, index);

			this.tip.showTip();
		}
	}, {
		key: 'renderLegend',
		value: function renderLegend() {
			var _this6 = this;

			var s = this.data;
			if (s.datasets.length > 1) {
				this.legendArea.textContent = '';
				s.datasets.map(function (d, i) {
					var barWidth = AXIS_LEGEND_BAR_SIZE;
					// let rightEndPoint = this.baseWidth - this.measures.margins.left - this.measures.margins.right;
					// let multiplier = s.datasets.length - i;
					var rect = legendBar(
					// rightEndPoint - multiplier * barWidth,	// To right align
					barWidth * i, '0', barWidth, _this6.colors[i], d.name);
					_this6.legendArea.appendChild(rect);
				});
			}
		}

		// Overlay

	}, {
		key: 'makeOverlay',
		value: function makeOverlay$$1() {
			var _this7 = this;

			if (this.init) {
				this.init = 0;
				return;
			}
			if (this.overlayGuides) {
				this.overlayGuides.forEach(function (g) {
					var o = g.overlay;
					o.parentNode.removeChild(o);
				});
			}

			this.overlayGuides = this.dataUnitComponents.map(function (c) {
				return {
					type: c.unitType,
					overlay: undefined,
					units: c.units
				};
			});

			if (this.state.currentIndex === undefined) {
				this.state.currentIndex = this.state.datasetLength - 1;
			}

			// Render overlays
			this.overlayGuides.map(function (d) {
				var currentUnit = d.units[_this7.state.currentIndex];

				d.overlay = makeOverlay[d.type](currentUnit);
				_this7.drawArea.appendChild(d.overlay);
			});
		}
	}, {
		key: 'updateOverlayGuides',
		value: function updateOverlayGuides() {
			if (this.overlayGuides) {
				this.overlayGuides.forEach(function (g) {
					var o = g.overlay;
					o.parentNode.removeChild(o);
				});
			}
		}
	}, {
		key: 'bindOverlay',
		value: function bindOverlay() {
			var _this8 = this;

			this.parent.addEventListener('data-select', function () {
				_this8.updateOverlay();
			});
		}
	}, {
		key: 'bindUnits',
		value: function bindUnits() {
			var _this9 = this;

			this.dataUnitComponents.map(function (c) {
				c.units.map(function (unit) {
					unit.addEventListener('click', function () {
						var index = unit.getAttribute('data-point-index');
						_this9.setCurrentDataPoint(index);
					});
				});
			});

			// Note: Doesn't work as tooltip is absolutely positioned
			this.tip.container.addEventListener('click', function () {
				var index = _this9.tip.container.getAttribute('data-point-index');
				_this9.setCurrentDataPoint(index);
			});
		}
	}, {
		key: 'updateOverlay',
		value: function updateOverlay$$1() {
			var _this10 = this;

			this.overlayGuides.map(function (d) {
				var currentUnit = d.units[_this10.state.currentIndex];
				updateOverlay[d.type](currentUnit, d.overlay);
			});
		}
	}, {
		key: 'onLeftArrow',
		value: function onLeftArrow() {
			this.setCurrentDataPoint(this.state.currentIndex - 1);
		}
	}, {
		key: 'onRightArrow',
		value: function onRightArrow() {
			this.setCurrentDataPoint(this.state.currentIndex + 1);
		}
	}, {
		key: 'getDataPoint',
		value: function getDataPoint() {
			var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.currentIndex;

			var s = this.state;
			var data_point = {
				index: index,
				label: s.xAxis.labels[index],
				values: s.datasets.map(function (d) {
					return d.values[index];
				})
			};
			return data_point;
		}
	}, {
		key: 'setCurrentDataPoint',
		value: function setCurrentDataPoint(index) {
			var s = this.state;
			index = parseInt(index);
			if (index < 0) { index = 0; }
			if (index >= s.xAxis.labels.length) { index = s.xAxis.labels.length - 1; }
			if (index === s.currentIndex) { return; }
			s.currentIndex = index;
			fire(this.parent, "data-select", this.getDataPoint());
		}

		// API

	}, {
		key: 'addDataPoint',
		value: function addDataPoint(label, datasetValues) {
			var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.state.datasetLength;

			_get$3(AxisChart.prototype.__proto__ || Object.getPrototypeOf(AxisChart.prototype), 'addDataPoint', this).call(this, label, datasetValues, index);
			this.data.labels.splice(index, 0, label);
			this.data.datasets.map(function (d, i) {
				d.values.splice(index, 0, datasetValues[i]);
			});
			this.update(this.data);
		}
	}, {
		key: 'removeDataPoint',
		value: function removeDataPoint() {
			var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.datasetLength - 1;

			if (this.data.labels.length <= 1) {
				return;
			}
			_get$3(AxisChart.prototype.__proto__ || Object.getPrototypeOf(AxisChart.prototype), 'removeDataPoint', this).call(this, index);
			this.data.labels.splice(index, 1);
			this.data.datasets.map(function (d) {
				d.values.splice(index, 1);
			});
			this.update(this.data);
		}
	}, {
		key: 'updateDataset',
		value: function updateDataset(datasetValues) {
			var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			this.data.datasets[index].values = datasetValues;
			this.update(this.data);
		}
		// addDataset(dataset, index) {}
		// removeDataset(index = 0) {}

	}, {
		key: 'updateDatasets',
		value: function updateDatasets(datasets) {
			this.data.datasets.map(function (d, i) {
				if (datasets[i]) {
					d.values = datasets[i];
				}
			});
			this.update(this.data);
		}

		// updateDataPoint(dataPoint, index = 0) {}
		// addDataPoint(dataPoint, index = 0) {}
		// removeDataPoint(index = 0) {}

	}]);

	return AxisChart;
}(BaseChart);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chartTypes = {
	bar: AxisChart,
	line: AxisChart,
	// multiaxis: MultiAxisChart,
	percentage: PercentageChart,
	heatmap: Heatmap,
	pie: PieChart
};

function getChartByType() {
	var chartType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'line';
	var parent = arguments[1];
	var options = arguments[2];

	if (chartType === 'axis-mixed') {
		// options.type = 'line';
		return new AxisChart(parent, options);
	}

	if (!chartTypes[chartType]) {
		console.error("Undefined chart type: " + chartType);
		return;
	}

	return new chartTypes[chartType](parent, options);
}

var Chart = function Chart(parent, options) {
	_classCallCheck(this, Chart);

	return getChartByType(options.type, parent, options);
};


//# sourceMappingURL=frappe-charts.min.esm.js.map

// https://stackoverflow.com/a/29325222
function getRandomBias(min, max, bias, influence) {
	var range = max - min;
	var biasValue = range * bias + min;
	var rnd = Math.random() * range + min,		// random in range
		mix = Math.random() * influence;		// random mixer
	return rnd * (1 - mix) + biasValue * mix;	// mix full range and bias
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} array An array containing the items.
 */
function shuffle(array) {
	var assign;

	// Awesomeness: https://bost.ocks.org/mike/shuffle/
	// https://stackoverflow.com/a/2450976/6495043
	// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array?noredirect=1&lq=1

	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		(assign = [array[j], array[i]], array[i] = assign[0], array[j] = assign[1]);
	}

	return array;
}

var updateDataAllLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue",
	"Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri",
	"Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];

var baseLength = 10;
var fullLength = 30;

var getRandom = function () { return Math.floor(getRandomBias(-40, 60, 0.8, 1)); };
var updateDataAllValues = Array.from({length: fullLength}, getRandom);

// We're gonna be shuffling this
var updateDataAllIndices = updateDataAllLabels.map(function (d,i) { return i; });

var getUpdateArray = function (sourceArray, length) {
	if ( length === void 0 ) length=10;

	var indices = updateDataAllIndices.slice(0, length);
	return indices.map(function (index) { return sourceArray[index]; });
};

var currentLastIndex = baseLength;

var NO_OF_MILLIS$1 = 1000;
var SEC_IN_DAY$1 = 86400;

function clone$1(date) {
	return new Date(date.getTime());
}

function timestampToMidnight(timestamp, roundAhead) {
	if ( roundAhead === void 0 ) roundAhead = false;

	var midnightTs = Math.floor(timestamp - (timestamp % SEC_IN_DAY$1));
	if(roundAhead) {
		return midnightTs + SEC_IN_DAY$1;
	}
	return midnightTs;
}

function timestampSec(date) {
	return date.getTime()/NO_OF_MILLIS$1;
}

function addDays$1(date, numberOfDays) {
	var newDate = clone$1(date);
	newDate.setDate(newDate.getDate() + numberOfDays);
	return newDate;
}

function getHeatmapData() {
	var today = new Date();
	var start = clone$1(today);
	start = addDays$1(start, 4);
	var end = clone$1(start);
	start.setFullYear( start.getFullYear() - 2 );
	end.setFullYear( end.getFullYear() - 1 );

	var dataPoints = {};

	var startTs = timestampSec(start);
	var endTs = timestampSec(end);

	startTs = timestampToMidnight(startTs);
	endTs = timestampToMidnight(endTs, true);

	while (startTs < endTs) {
		dataPoints[parseInt(startTs)] = Math.floor(getRandomBias(0, 5, 0.2, 1));
		startTs += SEC_IN_DAY$1;
	}

	return {
		dataPoints: dataPoints,
		start: start,
		end: end
	};
}

var methods = {
	getUpdateData: function getUpdateData() {
		shuffle(updateDataAllIndices);
		var value = getRandom();
		var start = getRandom();
		var end = getRandom();
		currentLastIndex = baseLength;

		return {
			labels: updateDataAllLabels.slice(0, baseLength),
			datasets: [{
				values: getUpdateArray(updateDataAllValues)
			}],
			yMarkers: [
				{
					label: "Altitude",
					value: value,
					type: 'dashed'
				}
			],
			yRegions: [
				{
					label: "Range",
					start: start,
					end: end
				} ],
		};
	},

	getAddUpdateData: function getAddUpdateData() {
		if(currentLastIndex >= fullLength) { return; }

		// TODO: Fix update on removal
		currentLastIndex++;
		var c = currentLastIndex -1;

		return [updateDataAllLabels[c], [updateDataAllValues[c]]];

		// updateChart.addDataPoint(
		// 	updateDataAllLabels[index], [updateDataAllValues[index]]
		// );
	}
};

var sampleData = {
	"0": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		datasets: [
			{ values: [18, 40, 30, 35, 8, 52, 17, -4] }
		]
	},
	"1": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		datasets: [
			{ name: "Dataset 1", values: [18, 40, 30, 35, 8, 52, 17, -4] },
			{ name: "Dataset 2", values: [30, 50, -10, 15, 18, 32, 27, 14] }
		]
	},
	"2": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"],
		datasets: [
			{ values: [300, 250, 720, 560, 370, 610, 690, 410,
				370, 480, 620, 260, 170, 510, 630, 710] }
		]
	},
	"3": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		datasets: [
			{ values: [300, 250, 720, 560, 370, 610, 690, 410,
				370, 480, 620, 260, 170, 510, 630, 710, 560, 370, 610, 260, 170] }
		]
	},
	"trends-data": {
		labels: [1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976,
			1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986,
			1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996,
			1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006,
			2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016] ,
		datasets: [
			{
				values: [132.9, 150.0, 149.4, 148.0, 94.4, 97.6, 54.1, 49.2, 22.5, 18.4,
					39.3, 131.0, 220.1, 218.9, 198.9, 162.4, 91.0, 60.5, 20.6, 14.8,
					33.9, 123.0, 211.1, 191.8, 203.3, 133.0, 76.1, 44.9, 25.1, 11.6,
					28.9, 88.3, 136.3, 173.9, 170.4, 163.6, 99.3, 65.3, 45.8, 24.7,
					12.6, 4.2, 4.8, 24.9, 80.8, 84.5, 94.0, 113.3, 69.8, 39.8]
			}
		]
	},
	"ymarkers": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"],
		datasets: [
			{ values: [300, 250, 720, 560, 370, 610, 690, 410,
				370, 480, 620, 260, 170, 510, 630, 710] }
		],
		yMarkers: [
			{
				label: "Threshold",
				value: 650,
				options: { labelPos: 'left' }
			}
		]
	},

	"yregions": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"],
		datasets: [
			{ values: [300, 250, 720, 560, -370, 610, 690, 410,
				370, 480, 620, -260, 170, 430, 630, 210] }
		],
		yRegions: [
			{
				label: "Optimum Value",
				start: 100,
				end: 600,
				options: { labelPos: 'right' }
			}
		]
	},

	"mixed-1": {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		datasets: [
		  {
			name: "Dataset 1",
			values: [18, 40, 30, 35, 8, 52, 17, -4],
			chartType: 'bar'
		  },
		  {
			name: "Dataset 2",
			values: [30, 50, -10, 15, 18, 32, 27, 14],
			chartType: 'line'
		  }
		]
	},

	"mixed-2": {
		labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
			"12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],

		datasets: [
			{
				name: "Some Data",
				values: [18, 40, 30, 35, 8, 52, 17, -4],
				chartType: 'bar'
			},
			{
				name: "Another Set",
				values: [30, 50, -10, 15, 18, 32, 27, 14],
				chartType: 'bar'
			},
			{
				name: "Yet Another",
				values: [15, 20, -3, -15, 58, 12, -17, 37],
				chartType: 'line'
			}
		]
	},

	"all-inclusive": {
		labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
		  "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],

		datasets: [
		  {
			name: "Some Data", chartType: 'bar',
			values: [25, 40, 30, 35, 8, 52, 17, -4]
		  },
		  {
			name: "Another Set", chartType: 'bar',
			values: [25, 50, -10, 15, 18, 32, 27, 14]
		  },
		  {
			name: "Yet Another", chartType: 'line',
			values: [15, 20, -3, -15, 58, 12, -17, 37]
		  }
		],

		yMarkers: [{ label: "Marker", value: 70,
		  options: { labelPos: 'left' }}],
		yRegions: [{ label: "Region", start: -10, end: 50,
		  options: { labelPos: 'right' }}]
	},

	"bar-composite-data": {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		datasets: [
			{
				name: "Over 25 reports",
				values: fireballOver25[9],
			},
			{
				name: "5 to 25 reports",
				values: fireball_5_25[9],
			},
			{
				name: "2 to 5 reports",
				values: fireball_2_5[9]
			}
		]
	},

	"get-update-data": methods.getUpdateData,

	"heatmap-data": getHeatmapData
};

frappe.projectDemos = {
	charts: {
		lib: Chart,
		methods: methods,
		getDemoConfig: function (vueContext) {
			var config = vueContext.config;
			var data = sampleData[vueContext.data];

			config.data = data;
			if(typeof data === "function") {
				config.data = data();
			}

			return {
				config: config,
				options: vueContext.options,
				actions: vueContext.actions
			};
		},
	}
};

var dataPath = document.querySelector("body").getAttribute("data-path");
var projectName = dataPath.indexOf('/') >= 0
	? dataPath.slice(0, dataPath.indexOf('/'))
	: dataPath;

if(projectName in frappe.projectDemos
	&& document.querySelectorAll(COMPONENT_NAME).length) {

	var project = frappe.projectDemos[projectName];

	Vue$3.component.apply(Vue$3, Object.values(
		getDemoVue(project.lib, project.getDemoConfig)
	));

	Vue$3.mixin({
		methods: project.methods
	});

	$(document).ready(function( ) {
		frappe.Vue = new Vue$3().$mount('.page_content');
	});
}

}());
//# sourceMappingURL=docs.js.map
