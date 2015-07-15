/**
 * Internationalization package
 *
 */

var ROOT_NAMESPACE = "_root";
var DEFAULT_LANGUAGE = "en";
var LANGUAGE_HELPER_NAME = "_";
var NAMESPACE_SEPARATOR = ":";
var VARIATION_SEPARATOR = ".";

var langDeps = new Tracker.Dependency;

/**
 * I18n object
 *
 * @type {{_languages: {}, _currentLanguage: string, init: Function, loadLanguage: Function, getLanguage: Function, setLanguage: Function, get: Function}}
 */
I18n = {

  // language data set
  _languages: {},

  // current language set
  _currentLanguage: DEFAULT_LANGUAGE,

  // config I18n object
  config: function(options) {
    options = options || {};

    options = _.defaults(options, {
      rootNamespace: ROOT_NAMESPACE,
      defaultLanguage: DEFAULT_LANGUAGE,
      helperName: LANGUAGE_HELPER_NAME
    });

    ROOT_NAMESPACE = options.rootNamespace;
    DEFAULT_LANGUAGE = options.defaultLanguage;
    LANGUAGE_HELPER_NAME = options.helperName;
  },

  /**
   * load a language data
   * @param lang
   * @param dataName
   * @param namespace
   */
  loadLanguage: function(lang, dataName, namespace) {
    var data;

    if (typeof dataName === 'string') {
      data = (Meteor.isServer) ? global[dataName] : window[dataName];
      if (! data)
        throw new Meteor.Error(500, "data not found.");
    } else if (typeof dataName === 'object') {
      data = dataName;
    }

    namespace = namespace || ROOT_NAMESPACE;

    if (this._languages[lang] && this._languages[lang][namespace])
      throw new Meteor.Error(500, "the namespace already exists.");

    if (data) {
      if (! this._languages[lang])
        this._languages[lang] = {};

      this._languages[lang][namespace] = data;
    } else {
      throw new Meteor.Error(500, "language data not found.");
    }

    langDeps.changed();
  },

  // read the current language
  getLanguage: function() {
    langDeps.depend();

    return this._currentLanguage;
  },

  // set the current language
  setLanguage: function(lang) {
    this._currentLanguage = lang;

    langDeps.changed();
  },

  /**
   * get the string responding the parameter key value
   * @param key
   * @param args
   * @param lang
   * @returns {string}
   */
  get: function(key, args, lang) {
    var value = "";
    if (lang === undefined && typeof args === 'string') {
      lang = args;
    } else {
      lang = (lang) ? lang : this._currentLanguage;
    }

    var namespace;
    try {
      value = key.split(NAMESPACE_SEPARATOR);
      if (value.length > 1) {
        namespace = value[0]
        key = value[1];
      } else {
        namespace = ROOT_NAMESPACE;
        key = value[0]
      }

      value = key.split(VARIATION_SEPARATOR)
          .reduce(function(o, i) { return o[i] },
              this._languages[lang][namespace]);

      if (args) {
        value = this.sprintf(value, args);
      }
    } catch (ex) {
      if (! this.errors instanceof Array)
        this.errors = [];

      if (this.errors)
        this.errors.push(ex.message);
    }

    langDeps.depend();
    return (value) ? value : key;
  },

  // return the formatted string with the parameters
  sprintf: function(format, args) {
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  }

};


// register i18n helper function
if (Meteor.isClient) {
  Template.registerHelper(LANGUAGE_HELPER_NAME, function(key, options){
    if (options.hash) {
      var map = options.hash;
      var keys = Object.keys(map);
      var args = [];
      for (var i = 0; i < keys.length; i++) {
        args[parseInt(keys[i])] = map[keys[i]];
      }
      return I18n.get(key, args);
    } else {
      return I18n.get(key);
    }
  });
}
