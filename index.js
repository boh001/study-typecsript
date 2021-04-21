function call(f) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return f.apply(void 0, args);
}
var a = call(console.log, 10, 'a');
var b = call(console.log, 10);
