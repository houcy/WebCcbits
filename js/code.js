/**
 * @fileoverview JavaScript代码块.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * 为应用程序创建一个名称空间。
 */
var Code = {};

/**
 * 加载模块保存在App Engine存储或会话/本地存储。
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function (defaultXml) {
    try {
        var loadOnce = window.sessionStorage.loadOnceBlocks;
    } catch (e) {
        // Firefox sessionStorage有时会抛出一个SecurityError当访问。
        // 重新启动Firefox修复这个,所以它看起来像一个bug。
        var loadOnce = null;
    }
    if ('BlocklyStorage' in window && window.location.hash.length > 1) {
        // An href with #key trigers an AJAX call to retrieve saved blocks.
        BlocklyStorage.retrieveXml(window.location.hash.substring(1));
    } else if (loadOnce) {
        //语言切换存储块在重载。
        delete window.sessionStorage.loadOnceBlocks;
        var xml = Blockly.Xml.textToDom(loadOnce);
        Blockly.Xml.domToWorkspace(xml, Code.workspace);
    } else if (defaultXml) {
        //加载编辑默认的起点。
        var xml = Blockly.Xml.textToDom(defaultXml);
        Blockly.Xml.domToWorkspace(xml, Code.workspace);
    } else if ('BlocklyStorage' in window) {
        // 恢复保存在一个单独的线程,以便后续
        // 初始化失败的负载不受影响。
        window.setTimeout(BlocklyStorage.restoreBlocks, 0);
    }
};

/**
 * 将函数绑定到一个按钮的单击事件。
 * 在触摸启用浏览器,ontouchend被视为等同于onclick。
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function (el, func) {
    if (typeof el == 'string') {
        el = document.getElementById(el);
    }
    el.addEventListener('click', func, true);
    el.addEventListener('touchend', func, true);
};

/**
 * 用于美化页面
 * 加载 prettify CSS 与 JavaScript.
 */
Code.importPrettify = function () {
    //<link rel="stylesheet" href="../prettify.css">
    //<script src="../prettify.js"></script>
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'style/prettify.css');
    document.head.appendChild(link);
    var script = document.createElement('script');
    script.setAttribute('src', 'js/prettify.js');
    document.head.appendChild(script);
};


/**
 * 标签名称的列表。
 * @private
 */
Code.TABS_ = ['blocks', 'javascript', 'php', 'python', 'dart', 'lua', 'xml'];

Code.selected = 'blocks';

/**
 * 当单击选项卡切换可见窗格。
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function (clickedName) {
    // If the XML tab was open, save and render the content.
    if (document.getElementById('tab_xml').className == 'tabon') {
        var xmlTextarea = document.getElementById('content_xml');
        var xmlText = xmlTextarea.value;
        var xmlDom = null;
        try {
            xmlDom = Blockly.Xml.textToDom(xmlText);
        } catch (e) {
            var q =
                window.confirm(MSG['badXml'].replace('%1', e));
            if (!q) {
                // Leave the user on the XML tab.
                return;
            }
        }
        if (xmlDom) {
            Code.workspace.clear();
            Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
        }
    }

    if (document.getElementById('tab_blocks').className == 'tabon') {
        Code.workspace.setVisible(false);
    }
    // Deselect all tabs and hide all panes.
    for (var i = 0; i < Code.TABS_.length; i++) {
        var name = Code.TABS_[i];
        document.getElementById('tab_' + name).className = 'taboff';
        document.getElementById('content_' + name).style.visibility = 'hidden';
    }

    // Select the active tab.
    Code.selected = clickedName;
    document.getElementById('tab_' + clickedName).className = 'tabon';
    // Show the selected pane.
    document.getElementById('content_' + clickedName).style.visibility =
        'visible';
    Code.renderContent();
    if (clickedName == 'blocks') {
        Code.workspace.setVisible(true);
    }
    Blockly.asyncSvgResize(this.workspace_);
};

/**
 * 当前选择的面板填充内容产生的块。
 */
Code.renderContent = function () {
    var content = document.getElementById('content_' + Code.selected);
    // Initialize the pane.
    if (content.id == 'content_xml') {
        var xmlTextarea = document.getElementById('content_xml');
        var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        xmlTextarea.value = xmlText;
        xmlTextarea.focus();
    } else if (content.id == 'content_javascript') {
        var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
        content.textContent = code;
        if (typeof prettyPrintOne == 'function') {
            code = content.innerHTML;
            code = prettyPrintOne(code, 'js');
            content.innerHTML = code;
        }
    } else if (content.id == 'content_python') {
        code = Blockly.Python.workspaceToCode(Code.workspace);
        content.textContent = code;
        if (typeof prettyPrintOne == 'function') {
            code = content.innerHTML;
            code = prettyPrintOne(code, 'py');
            content.innerHTML = code;
        }
    } else if (content.id == 'content_php') {
        code = Blockly.PHP.workspaceToCode(Code.workspace);
        content.textContent = code;
        if (typeof prettyPrintOne == 'function') {
            code = content.innerHTML;
            code = prettyPrintOne(code, 'php');
            content.innerHTML = code;
        }
    } else if (content.id == 'content_dart') {
        code = Blockly.Dart.workspaceToCode(Code.workspace);
        content.textContent = code;
        if (typeof prettyPrintOne == 'function') {
            code = content.innerHTML;
            code = prettyPrintOne(code, 'dart');
            content.innerHTML = code;
        }
    } else if (content.id == 'content_lua') {
        code = Blockly.Lua.workspaceToCode(Code.workspace);
        content.textContent = code;
        if (typeof prettyPrintOne == 'function') {
            code = content.innerHTML;
            code = prettyPrintOne(code, 'lua');
            content.innerHTML = code;
        }
    }
};
/**
 *计算一个HTML元素的绝对坐标和维度。
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Code.getBBox_ = function (element) {
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
};
/**
 * 初始化块，页面加载
 */
Code.init = function () {
    //初始化语言
    Language.initLanguage();
    //增加保留字列表:局部变量在执行环境(runJS)
    // 和无限循环检测功能。
    Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');
    //加载代码块
    Code.loadBlocks('');

    if ('BlocklyStorage' in window) {
        //
        BlocklyStorage.backupOnUnload(Code.workspace);
    }

    Code.tabClick(Code.selected);

    Code.bindClick('trashButton',
        function () {
            Code.discard();
            Code.renderContent();
        });
    Code.bindClick('runButton', Code.runJS);

    //禁用链接按钮如果页面不是由App Engine存储。
    var linkButton = document.getElementById('linkButton');
    if ('BlocklyStorage' in window) {
        BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
        BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
        BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
        BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
        Code.bindClick(linkButton,
            function () {
                BlocklyStorage.link(Code.workspace);
            });
    } else if (linkButton) {
        linkButton.className = 'disabled';
    }

    for (var i = 0; i < Code.TABS_.length; i++) {
        var name = Code.TABS_[i];
        Code.bindClick('tab_' + name,
            function (name_) {
                return function () {
                    Code.tabClick(name_);
                };
            }(name));
    }

    //延迟加载的语法突出显示。
    window.setTimeout(Code.importPrettify, 1);
};


/**
 * 执行用户代码
 * Just a quick and dirty eval.  Catch infinite loops.
 */
Code.runJS = function () {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
    var timeouts = 0;
    var checkTimeout = function () {
        if (timeouts++ > 1000000) {
            throw MSG['timeout'];
        }
    };
    var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
        eval(code);
    } catch (e) {
        alert(MSG['badCode'].replace('%1', e));
    }
};

/**
 * 删除工作区所有代码块
 */
Code.discard = function () {
    var count = Code.workspace.getAllBlocks().length;
    if (count < 2 ||
        window.confirm(Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1', count))) {
        Code.workspace.clear();
        if (window.location.hash) {
            window.location.hash = '';
        }
    }
};

//加载块的语言字符串。
//document.write('<script src="msg/' + Code.LANG + '.js"></script>\n');
//加载块的语言字符串。
document.write('<script src="blockly/msg/js/' + Language.LANG + '.js"></script>\n');
document.write('<script src="blockly/msg/js/company/' + Language.LANG + '.js"></script>\n');

window.addEventListener('load', Code.init);
