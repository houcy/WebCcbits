/**
 * 高级视图
 * @type {boolean}
 */
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
 *标签名称的列表。
 * @private
 */
var TABS_ = ['blocks', 'arduino', 'xml'];

var selected = 'blocks';

/**
 * 在单击选项卡时切换可见窗格。
 * @param {string} clickedName Name of tab clicked.
 */
function tabClick(clickedName) {
    // 如果XML选项卡打开，则保存并呈现内容
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
    // 取消所有选项卡并隐藏所有窗格。
    for (var i = 0; i < TABS_.length; i++) {
        var name = TABS_[i];
        document.getElementById('tab_' + name).className = 'taboff';
        document.getElementById('content_' + name).style.visibility = 'hidden';
    }

    //选择活动选项卡。
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
 *用块生成的内容填充当前选中的面板。
 */
function renderContent() {
    var content = document.getElementById('content_' + selected);
    //初始化面板。
    if (content.id == 'content_blocks') {
        // 如果改变了工作空间的XML标签,Firefox将会执行
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

//------------------------------------代码保存
document.querySelector("#savecode").addEventListener("click",function () {
    //获取代码Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace)
    var code=Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace);
    window.localStorage.setItem("code",code);
});

//判断操作系统
function isOs(){
    var UserAgent = navigator.userAgent.toLowerCase();
    return {
        isIpad          : /ipad/.test(UserAgent),
        isIphone        : /iphone os/.test(UserAgent),
        isAndroid       : /android/.test(UserAgent),
        isWindowsCe     : /windows ce/.test(UserAgent),
        isWindowsMobile : /windows mobile/.test(UserAgent),
        isWin2K         : /windows nt 5.0/.test(UserAgent),
        isXP            : /windows nt 5.1/.test(UserAgent),
        isVista         : /windows nt 6.0/.test(UserAgent),
        isWin7          : /windows nt 6.1/.test(UserAgent),
        isWin8          : /windows nt 6.2/.test(UserAgent),
        isWin81         : /windows nt 6.3/.test(UserAgent),
        isMac           : /mac os/.test(UserAgent)
    };
}


//---------------------------------加载语言模块
var viewMode1 = document.getElementById('viewMode1');
viewMode1.href = 'index_simple.html?lang=' + Code.LANG;
document.getElementById('span_blocks').textContent = MSG['tab_blocks'];
document.getElementById('span_arduino').textContent = MSG['tab_arduino'];

