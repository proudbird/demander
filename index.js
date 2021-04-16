const vm    = require('vm');
const fs    = require('fs');
const path  = require('path');

function demander (filename, context, args, options) {

    args    = args    || {};
    options = options || {};

    const nativeArgs = ['require', '__filename', '__dirname'];

    let hide = [];options.hideGlobals || demander.hideGlobals || [];
    if(typeof hide === 'object') {
        if(hide[0] === 'all' || hide.length === 0) {
            hide = nativeArgs;
        }
    };

    // TODO to add the abillity to cache already loaded modules
    // loke native 'require' does. 
    // if (options.clearCache || demander.clearCache) {
    //     const id = require.resolve(filename);
    //     if (require.cache[id]) {
    //         delete require.cache[id];
    //     }
    // }

    // TODO to add the abillity clear cache if module vas beeb changed

    const argNames  = [];
    let argValues = [];

    // TODO parametr args can be any abject whith 'length' property
    if (!isObject(args)) {
        throw new Error(`Error on loading module '${filename}'.\nThird argument can be an object only.`);
    } else {
        for (let key in args) {
            argNames .push(key);
            argValues.push(args[key]);
        }
    }

    const wrapperStart = [
        '(function (exports, module'
    ];

    nativeArgs.forEach(nativeArg => {
        if (!hide.includes(nativeArg)) {
            wrapperStart.push(nativeArg);
            switch (nativeArg) {
                case 'require':
                    [require].concat(argValues);    
                case '__filename':
                    [filename].concat(argValues);
                case '__dirname':
                    [path.dirname(filename)].concat(argValues);
            }
        }
    });

    wrapperStart.push(argNames.join(', '));

    
    const wrapper = [
        [wrapperStart.join(', '), ') { '].join(''), 
        '\n});'
    ];
  
    const script = fs.readFileSync(filename);
    // TODO maybe to add th e abillity load 'json' files and convert them to the object

    const newModule = [
        wrapper[0], 
        script,
        wrapper[1]
    ].join('');

    let compiledModule = vm.runInThisContext(newModule, 
        {
            filename,
            lineOffset: 0,  // we need such values of that options 
            columnOffset: 1,// to make vs code debug our file pro
            displayErrors: true
        });

    const _module = { exports: {}};
    argValues = [_module.exports, _module].concat(argValues);

    compiledModule.apply(context, argValues);

    return _module.exports;

}

// setting defaults
demander.clearCache     = false;
demander.hideGlobals    = undefined;

module.exports = demander;

// helpers
let isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};