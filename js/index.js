

// //创建命名空间
// var Ccbits = {};
// /**
//  *
//  * @type {{zh-hans: string, zh-hant: string, en: string, spa: string}}
//  */
// Ccbits.LANGUAGE_NAME = {
//     'zh-hans': '简体中文',
//     'zh-hant': '繁體中文',
//     'en': 'English',
//     'spa': 'Español',
//
// };
// /**
//  *
//  * @type {string}
//  */
// Ccbits.LANG = Code.getLang();
// /**
//  *
//  * @type {[string,string,string,string]}
//  */
// Ccbits.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];
// /**
//  *
//  * @param name
//  * @param defaultValue
//  * @returns {string}
//  */
// Ccbits.getStringParamFromUrl = function (name, defaultValue) {
//     var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
//     return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
// };
// /**
//  *
//  * @returns {string}
//  */
// Ccbits.getLang = function () {
//     var lang = Code.getStringParamFromUrl('lang', '');
//     if (Code.LANGUAGE_NAME[lang] === undefined) {
//         // Default to zh-hans.
//         lang = 'zh-hans';
//     }
//     return lang;
// };
// /**
//  *
//  * @returns {boolean}
//  */
// Ccbits.isRtl = function () {
//     return Ccbits.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
// };
// /**
//  *
//  */
// Ccbits.changeLanguage = function () {
//     // Store the blocks for the duration of the reload.
//     // This should be skipped for the index page, which has no blocks and does
//     // not load Blockly.
//     // MSIE 11 does not support sessionStorage on file:// URLs.
//     if (typeof Blockly != 'undefined' && window.sessionStorage) {
//         var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
//         var text = Blockly.Xml.domToText(xml);
//         window.sessionStorage.loadOnceBlocks = text;
//     }
//
//     var languageMenu = document.getElementById('languageMenu');
//     var newLang = encodeURIComponent(
//         languageMenu.options[languageMenu.selectedIndex].value);
//     var search = window.location.search;
//     if (search.length <= 1) {
//         search = '?lang=' + newLang;
//     } else if (search.match(/[?&]lang=[^&]*/)) {
//         search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
//     } else {
//         search = search.replace(/\?/, '?lang=' + newLang + '&');
//     }
//
//     window.location = window.location.protocol + '//' +
//         window.location.host + window.location.pathname + search;
//
// };
//
//
// /**
//  * 初始化页面语言。
//  */
// Ccbits.initLanguage = function () {
//     //设置HTML语言和方向。
//     var rtl = Ccbits.isRtl();
//     document.dir = rtl ? 'rtl' : 'ltr';
//     document.head.parentElement.setAttribute('lang', Ccbits.LANG);
//
//     // Sort languages alphabetically.
//     var languages = [];
//     for (var lang in Ccbits.LANGUAGE_NAME) {
//         languages.push([Ccbits.LANGUAGE_NAME[lang], lang]);
//     }
//     var comp = function (a, b) {
//         // Sort based on first argument ('English', 'Русский', '简体字', etc).
//         if (a[0] > b[0]) return 1;
//         if (a[0] < b[0]) return -1;
//         return 0;
//     };
//     languages.sort(comp);
//     // Populate the language selection menu.
//     var languageMenu = document.getElementById('languageMenu');
//     languageMenu.options.length = 0;
//     for (var i = 0; i < languages.length; i++) {
//         var tuple = languages[i];
//         var lang = tuple[tuple.length - 1];
//         var option = new Option(tuple[0], lang);
//         if (lang == Ccbits.LANG) {
//             option.selected = true;
//         }
//         languageMenu.options.add(option);
//     }
//     //添加语言改变事件
//     languageMenu.addEventListener('change', Ccbits.changeLanguage, true);
//     //读取块数据内容
//     var categories = ['catInOut', 'catControl', 'catMath', 'catText', 'catLists',
//         'catLogic', 'catSerialPort', 'catGroup', 'catStorage', 'catSensor', 'catActuator', 'catMonitor', 'catVar', 'catFun', 'catEthernet', 'catEthernet_init', 'catEthernet_clinet', 'catSense', 'catSense2', 'catLuxe'];
//     for (var i = 0, cat; cat = categories[i]; i++) {
//         if (document.getElementById(cat) != null) {
//             document.getElementById(cat).setAttribute('name', MSG[cat]);
//         }
//     }
//     //注入语言字符串.
//     document.getElementById('copyright').textContent = MSG['copyright'];
//     document.getElementById('viewMode1').textContent = MSG['viewNormal'];
//     document.getElementById('viewMode2').textContent = MSG['viewAdvanced'];
//
//     var textVars = document.getElementsByClassName('textVar');
//
//     for (var i = 0, textVar; textVar = textVars[i]; i++) {
//         textVar.textContent = MSG['textVariable'];
//     }
//     var listVars = document.getElementsByClassName('listVar');
//     for (var i = 0, listVar; listVar = listVars[i]; i++) {
//         listVar.textContent = MSG['listVariable'];
//     }
// };


var sidecodeDisplay = false;
/**
 * 点击侧边显示代码按钮
 */
function sidecodeClick() {
    if (sidecodeDisplay) {
        document.getElementById('side_code_parent').style.display = 'none';
        document.getElementById('sidebar').className = 'right-top';
        document.getElementById('mid_td').style.display = 'none';
        sidecodeDisplay = false;
    } else {
        document.getElementById('side_code_parent').style.display = '';
        document.getElementById('sidebar').className = 'right-top2';
        document.getElementById('mid_td').style.display = '';
        sidecodeDisplay = true;
    }
    Blockly.fireUiEvent(window, 'resize');
}

/**
 * List of tab names.
 * @private
 */
var TABS_ = ['blocks', 'arduino', 'xml'];

var selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
function tabClick(clickedName) {
    // If the XML tab was open, save and render the content.
    if (document.getElementById('tab_xml').className == 'tabon') {
        var xmlTextarea = document.getElementById('content_xml');
        var xmlText = xmlTextarea.value;
        var xmlDom = null;
        try {
            xmlDom = Blockly.Xml.textToDom(xmlText);
        } catch (e) {
            var q =
                window.confirm('Error parsing XML:\n' + e + '\n\nAbandon changes?');
            if (!q) {
                // Leave the user on the XML tab.
                return;
            }
        }
        if (xmlDom) {
            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace(xmlDom, Blockly.mainWorkspace);
        }
    }
    if (document.getElementById('tab_blocks').className == 'tabon') {
        Blockly.mainWorkspace.setVisible(false);
    }
    // Deselect all tabs and hide all panes.
    for (var i = 0; i < TABS_.length; i++) {
        var name = TABS_[i];
        document.getElementById('tab_' + name).className = 'taboff';
        document.getElementById('content_' + name).style.visibility = 'hidden';
    }

    // Select the active tab.
    selected = clickedName;
    document.getElementById('tab_' + clickedName).className = 'tabon';
    // Show the selected pane.
    document.getElementById('content_' + clickedName).style.visibility =
        'visible';
    renderContent();
    if (clickedName == 'blocks') {
        Blockly.mainWorkspace.setVisible(true);
        //重新显示
        if (sidecodeDisplay) {
            document.getElementById('side_code_parent').style.display = '';
            document.getElementById('mid_td').style.display = '';
            document.getElementById('sidebar').className = 'right-top2';
        } else {
            document.getElementById('side_code_parent').style.display = 'none';
            document.getElementById('mid_td').style.display = 'none';
            document.getElementById('sidebar').className = 'right-top';
        }
        //显示右侧悬浮按钮
        document.getElementById('sidebar').style.visibility = 'visible';
    }
    if (clickedName == "arduino") {
        //隐藏右侧悬浮按钮
        document.getElementById('sidebar').style.visibility = 'hidden';
        //点击代码将隐藏右侧代码，否则出现两个代码区域
        document.getElementById('side_code_parent').style.display = 'none';
        document.getElementById('mid_td').style.display = 'none';
    }
    Blockly.fireUiEvent(window, 'resize');
}

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
function renderContent() {
    var content = document.getElementById('content_' + selected);
    // Initialize the pane.
    if (content.id == 'content_blocks') {
        // If the workspace was changed by the XML tab, Firefox will have performed
        // an incomplete rendering due to Blockly being invisible.  Rerender.
        Blockly.mainWorkspace.render();
        var arduinoTextarea = document.getElementById('side_code');
        var code = Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace) || '';
        arduinoTextarea.value = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function (s) {
            return decodeURIComponent(s.replace(/_/g, '%'));
        });
    } else if (content.id == 'content_xml') {
        var xmlTextarea = document.getElementById('content_xml');
        var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        xmlTextarea.value = xmlText;
        xmlTextarea.focus();
    } else if (content.id == 'content_arduino') {
        //content.innerHTML = Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace);
        var arduinoTextarea = document.getElementById('content_arduino');
        arduinoTextarea.value = Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace);
        arduinoTextarea.focus();
    }
}

/**
 * 计算一个HTML元素的绝对坐标和维度。
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
function getBBox_(element) {
    var height = element.offsetHeight;
    var width = element.offsetWidth;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    return {
        height: height,
        width: width,
        x: x,
        y: y
    };
}

/**
 * 页面加载调用初始化方法
 */
function init() {
    //初始化语言
    var rtl = Language.isRtl();
    var container = document.getElementById('content_area');
    var onresize = function (e) {
        var bBox = getBBox_(container);
        for (var i = 0; i < TABS_.length; i++) {
            var el = document.getElementById('content_' + TABS_[i]);
            el.style.top = bBox.y + 'px';
            el.style.left = bBox.x + 'px';
            // Height and width need to be set, read back, then set again to
            // compensate for scrollbars.
            el.style.height = bBox.height + 'px';
            el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
            el.style.width = bBox.width + 'px';
            el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
        }
        // Make the 'Blocks' tab line up with the toolbox.
        if (Blockly.mainWorkspace.toolbox_.width) {
            document.getElementById('tab_blocks').style.minWidth =
                (Blockly.mainWorkspace.toolbox_.width - 38) + 'px';
            // Account for the 19 pixel margin and on each side.
        }
    };
    window.addEventListener('resize', onresize, false);

    var toolbox = document.getElementById('toolbox');

    var masterWorkspace = Blockly.inject(document.getElementById('content_blocks'),
        {
            media: 'blockly/media/',
            toolbox: toolbox,
            // rtl: rtl,
            zoom:
                {
                    controls: true,
                    wheel: true
                }
        });

    //实时更新右侧对比代码
    masterWorkspace.addChangeListener(rightCodeEvent);

    function rightCodeEvent(masterEvent) {
        if (masterEvent.type == Blockly.Events.UI) {
            return;  //从不更新UI事件
        }
        //更新
        var arduinoTextarea = document.getElementById('side_code');
        var code = Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace) || '';
        arduinoTextarea.value = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function (s) {
            return decodeURIComponent(s.replace(/_/g, '%'));
        });
    }

    auto_save_and_restore_blocks();

    //从url加载参数(单参数)
    //http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
    var dest = unescape(location.search.replace(/^.*\=/, '')).replace(/\+/g, " ");
    if (dest) {
        load_by_url(dest);
    }
}
//------------------------------------------------------------------
// Ccbits.getBBox_=function(element) {
//     var height = element.offsetHeight;
//     var width = element.offsetWidth;
//     var x = 0;
//     var y = 0;
//     do {
//         x += element.offsetLeft;
//         y += element.offsetTop;
//         element = element.offsetParent;
//     } while (element);
//     return {
//         height: height,
//         width: width,
//         x: x,
//         y: y
//     };
// };
//
// Ccbits.init=function () {
//     //获取容器对象
//     var container = document.getElementById('content_area');
//     var onresize = function (e) {
//         var bBox = Ccbits.getBBox_(container);
//         for (var i = 0; i < TABS_.length; i++) {
//             var el = document.getElementById('content_' + TABS_[i]);
//             el.style.top = bBox.y + 'px';
//             el.style.left = bBox.x + 'px';
//             el.style.height = bBox.height + 'px';
//             el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
//             el.style.width = bBox.width + 'px';
//             el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
//         }
//         if (Blockly.mainWorkspace.toolbox_.width) {
//             document.getElementById('tab_blocks').style.minWidth =
//                 (Blockly.mainWorkspace.toolbox_.width - 38) + 'px';
//         }
//     };
//     //窗口改变调用事件
//     window.addEventListener('resize', onresize, false);
//
//     //读取数据块数据
//     var toolbox = document.getElementById('toolbox');
//     alert(document.getElementById('content_blocks'));
//     var masterWorkspace = Blockly.inject(document.getElementById('content_blocks'),
//     {
//         media: 'blockly/media/',
//         toolbox: toolbox,
//         zoom:
//             {
//                 controls: true,
//                 wheel: true
//             }
//     });
//
//    var rightCodeEvent= function(masterEvent) {
//         if (masterEvent.type == Blockly.Events.UI) {
//             return;  //不更新UI
//         }
//         //更新右边 arduino代码框内容
//         var arduinoTextarea = document.getElementById('side_code');
//         var code = Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace) || '';
//         arduinoTextarea.value = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function (s) {
//             return decodeURIComponent(s.replace(/_/g, '%'));
//         });
//     };
//     //右侧代码事件
//     masterWorkspace.addChangeListener(rightCodeEvent);
//     //自动保存与恢复块数据
//     auto_save_and_restore_blocks();
//     //加载本地参数
//     var dest = unescape(location.search.replace(/^.*\=/, '')).replace(/\+/g, " ");
//     if (dest) {
//         load_by_url(dest);
//     }
// };

//---------------------------------加载语言模块
document.getElementById('span_blocks').textContent = MSG['tab_blocks'];
document.getElementById('span_arduino').textContent = MSG['tab_arduino'];

