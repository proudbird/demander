
# demander #

Loades modules in an alternative to node.js native 'require' method, allowing to load a module with additional global-like variables (like __dirname or __filename).

Also useful, if you want to hide some global methods or variabels from your module scope.

## Quickstart

```shell
npm install demander
```

Then make reference inside yor module...

```javascript
const demand = require('demander');

const result = demand('filename');

```

## API

### demander(path, [context], [arguments], [options])

Loads the module with desired behavior

#### Arguments

* `path` - (string) A full path to the module
* `context` - (any) optional; Any context, that will be eccesable ander "this"
* `arguments` - (object) optional; An object with arguments names as its properties names and arguments values as its properties values. For example:

```javascript
{
  paramA: 'value A',
  paramB: 'value B'
}
```

* `options` - (object) optional; An object with options
* `options.clearCache` - (boolen) optional; `true`, if we want to delete saved module from the 'require' cache; by default it is `false`
* `options.hideGlobals` - (array<sting>) optional; A list of names of globals, that we want to hide in a loading module scope; by default it does't hide anything

Possible values:

```javascript
// to hide defaults globals 'require', '__dirname' and '__filename'
options.hideGlobals = [];
// or
options.hideGlobals = ['all'];

// to hide only a spacific global variable
options.hideGlobals = ['require'];
// in this case it will not be possible to require another module from the loading module
```

#### Returns 
`any` - loaded module "exports" property


## Testing

```shell
npm test
```

## License

[MIT](./LICENSE)