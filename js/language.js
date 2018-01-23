/**
 * 语言处理
 */

'use strict';

//创建命名空间
var Language = {};
/**
 *
 * @type {{zh-hans: string, zh-hant: string, en: string, spa: string}}
 */
Language.LANGUAGE_NAME = {
    'zh-hans': '简体中文',
    'zh-hant': '繁體中文',
    'en': 'English',
    'spa': 'Español'

};

/**
 *
 * @type {[string,string,string,string]}
 */
Language.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];
/**
 *
 * @param name
 * @param defaultValue
 * @returns {string}
 */
Language.getStringParamFromUrl = function (name, defaultValue) {
    var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 *
 * @returns {string}
 */
Language.getLang = function () {
    var lang = Language.getStringParamFromUrl('lang', '');
    if (Language.LANGUAGE_NAME[lang] === undefined) {
        // Default to zh-hans.
        lang = 'zh-hans';
    }
    return lang;
};

/**
 *
 * @type {string}
 */
Language.LANG = Language.getLang();


/**
 *
 * @returns {boolean}
 */
Language.isRtl = function () {
    return Language.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};
/**
 * 语言改变事件
 */
Language.changeLanguage = function () {
    // Store the blocks for the duration of the reload.
    // This should be skipped for the index page, which has no blocks and does
    // not load Blockly.
    // MSIE 11 does not support sessionStorage on file:// URLs.
    if (typeof Blockly != 'undefined' && window.sessionStorage) {
        var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var text = Blockly.Xml.domToText(xml);
        window.sessionStorage.loadOnceBlocks = text;
    }

    var languageMenu = document.getElementById('languageMenu');
    var newLang = encodeURIComponent(
        languageMenu.options[languageMenu.selectedIndex].value);
    var search = window.location.search;
    if (search.length <= 1) {
        search = '?lang=' + newLang;
    } else if (search.match(/[?&]lang=[^&]*/)) {
        search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
    } else {
        search = search.replace(/\?/, '?lang=' + newLang + '&');
    }

    window.location = window.location.protocol + '//' +
        window.location.host + window.location.pathname + search;

};


/**
 * 初始化页面语言。
 */
Language.initLanguage = function () {
    //设置HTML语言和方向。
    var rtl = Language.isRtl();
    document.dir = rtl ? 'rtl' : 'ltr';
    document.head.parentElement.setAttribute('lang', Language.LANG);

    // Sort languages alphabetically.
    var languages = [];
    for (var lang in Language.LANGUAGE_NAME) {
        languages.push([Language.LANGUAGE_NAME[lang], lang]);
    }
    var comp = function (a, b) {
        // Sort based on first argument ('English', 'Русский', '简体字', etc).
        if (a[0] > b[0]) return 1;
        if (a[0] < b[0]) return -1;
        return 0;
    };
    languages.sort(comp);
    // 填充语言选择菜单。
    var languageMenu = document.getElementById('languageMenu');
    languageMenu.options.length = 0;
    for (var i = 0; i < languages.length; i++) {
        var tuple = languages[i];
        var lang = tuple[tuple.length - 1];
        var option = new Option(tuple[0], lang);
        if (lang == Language.LANG) {
            option.selected = true;
        }
        languageMenu.options.add(option);
    }
    //添加语言改变事件
    languageMenu.addEventListener('change', Language.changeLanguage, true);
    //读取块数据内容
    var categories = ['catInOut', 'catControl', 'catMath', 'catText', 'catLists',
        'catLogic', 'catSerialPort', 'catGroup', 'catStorage', 'catSensor', 'catActuator', 'catMonitor', 'catVar', 'catFun', 'catEthernet', 'catEthernet_init', 'catEthernet_clinet', 'catSense', 'catSense2', 'catLuxe'];
    for (var i = 0, cat; cat = categories[i]; i++) {
        if (document.getElementById(cat) != null) {
            document.getElementById(cat).setAttribute('name', MSG[cat]);
        }
    }
    //注入语言字符串.
    document.getElementById('copyright').textContent = MSG['copyright'];
    document.getElementById('viewMode1').textContent = MSG['viewNormal'];
    document.getElementById('viewMode2').textContent = MSG['viewAdvanced'];

    var textVars = document.getElementsByClassName('textVar');

    for (var i = 0, textVar; textVar = textVars[i]; i++) {
        textVar.textContent = MSG['textVariable'];
    }
    var listVars = document.getElementsByClassName('listVar');
    for (var i = 0, listVar; listVar = listVars[i]; i++) {
        listVar.textContent = MSG['listVariable'];
    }
};