// AMD modules for Strange Eons scripts: useLibrary( 'amd' ) defines a global
// define( [ id, ] [ dependencies, ] factory ).
//
// Each module file is evaluated in its own script engine and must call
// define; a file that doesn't is an error. Dependencies are resolved and
// factories run synchronously, once per loader (one loader per script engine
// that uses this library). Module engines share the loading script's setting
// and language providers.
//
// Ids are paths relative to define.config().baseUrl, without '.js'; the
// default base is the directory of the script that loads this library.
//
// Special dependencies:
//   'require'   require( id ) returns a module. require( id, environment )
//               evaluates a script that is not a module (a plain library, or
//               a standard SE library such as 'ui') in an engine whose
//               globals start as the environment's properties, and returns
//               that engine's global scope. Scripts required with the same
//               environment object share an engine, so they see each other's
//               globals.
//
// Exports: define.
/* global useLibrary, __dirname, globalThis */
(function (exports) {
    const ScriptMonkey = arkham.plugins.ScriptMonkey;
    const host = useLibrary.__$;

    const config = { baseUrl: __dirname };
    const modules = {};
    const loading = {};
    const environments = [];

    function getUrl(id) {
        return id.indexOf(':') >= 0 ? id : config.baseUrl + '/' + id + '.js';
    }

    function createMonkey(name) {
        var monkey = new ScriptMonkey(name);
        monkey.setSettingProvider(host.getSettingProvider());
        monkey.setUiLangProvider(host.getUiLangProvider());
        monkey.setGameLangProvider(host.getGameLangProvider());
        return monkey;
    }

    // define( [ id, ] [ dependencies, ] factory )
    function parseDefinition(args) {
        var i = 0;
        var definition = { id: null, dependencies: [], factory: null };
        if (typeof args[i] === 'string') definition.id = args[i++];
        if (Array.isArray(args[i])) definition.dependencies = args[i++];
        definition.factory = args[i];
        return definition;
    }

    function instantiate(definition) {
        var values = definition.dependencies.map(function (id) {
            return id === 'require' ? require : loadModule(id);
        });
        return typeof definition.factory === 'function'
            ? definition.factory.apply(null, values)
            : definition.factory;
    }

    function loadModule(id) {
        if (Object.prototype.hasOwnProperty.call(modules, id))
            return modules[id];
        if (loading[id]) throw new Error('circular module dependency: ' + id);

        loading[id] = true;
        try {
            var url = getUrl(id);
            var monkey = createMonkey(url);
            var definition = null;
            monkey.bind('define', function () {
                if (definition != null)
                    throw new Error('module defined more than once: ' + id);
                definition = parseDefinition(arguments);
            });

            // unlike ScriptMonkey.eval, the engine reports errors to the caller
            monkey.getEngine().eval(ScriptMonkey.getLibrary(url));
            if (definition == null)
                throw new Error('not a module (define was not called): ' + id);

            modules[id] = instantiate(definition);
        } finally {
            delete loading[id];
        }
        return modules[id];
    }

    // the engine for an environment object, created on first use
    function getEnvironmentEngine(environment) {
        for (let i = 0; i < environments.length; i++) {
            if (environments[i].environment === environment)
                return environments[i].engine;
        }

        var monkey = createMonkey('environment');
        for (let name in environment) {
            monkey.bind(name, environment[name]);
        }
        environments.push({
            environment: environment,
            engine: monkey.getEngine(),
        });
        return monkey.getEngine();
    }

    // a library under the base URL, or else a standard SE library
    function getLibraryName(id) {
        var url = getUrl(id);
        try {
            ScriptMonkey.getLibrary(url);
            return url;
        } catch (ex) {
            if (id.indexOf(':') >= 0) throw ex;
            return id;
        }
    }

    function require(id, environment) {
        if (arguments.length < 2) return loadModule(id);

        var engine = getEnvironmentEngine(environment);
        engine.eval('useLibrary(' + JSON.stringify(getLibraryName(id)) + ');');
        return engine.eval('globalThis');
    }

    function define() {
        var definition = parseDefinition(arguments);
        var value = instantiate(definition);
        if (definition.id != null) modules[definition.id] = value;
        return value;
    }

    define.amd = {};

    define.config = function (options) {
        if (options && options.baseUrl != null)
            config.baseUrl = String(options.baseUrl).replace(/\/$/, '');
        return { baseUrl: config.baseUrl };
    };

    exports.define = define;
})(globalThis);
