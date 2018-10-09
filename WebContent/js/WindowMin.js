/**
 * 窗口最小化
 */

WindowMin = {
	getButton : function(win, id, title) {
		Buttons = new Ext.Button({
			win : win,
			id : "window" + id,
			text : title,
			pressed : true,
			type : "button",
			handler : function(btn) {
				if (btn.win.minimizable) {
					win.show();
					btn.win.minimizable = false;
				}
			},
		})
		return Buttons;
	}
};
/**  
 * Extjs消息提示框  
 * MsgTip.msg('消息标题', '消息内容');//不自动隐藏  
 * MsgTip.msg('消息标题', '消息内容',true);//默认1秒后自动隐藏  
 * MsgTip.msg('消息标题', '消息内容',true,10);//3秒后自动隐藏  
 */  
MsgTip = function(){  
    var msgCt;  
    function createBox(t, s){  
        return ['<div class="msg">',  
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',  
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc" style="font-size=12px;"><h3>', t, '</h3>', s, '</div></div></div>',  
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',  
                '</div>'].join('');  
    }  
    return {  
        msg : function(title, message,autoHide,pauseTime){  
            if(!msgCt){  
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div22',style:'position:absolute;top:10px;width:500px;margin:0 auto;z-index:20000;'}, true);  
            }  
            msgCt.alignTo(document, 't-t');  
            //给消息框右下角增加一个关闭按钮  
            message+='<br><span style="display:block;text-align:center;font-size:12px; width:100%;">' +  
              '<font color="blank"><u style="cursor:hand;" onclick="MsgTip.hide(this);">关闭</u></font></span>'  
            var m = Ext.DomHelper.append(msgCt, {html:createBox(title, message)}, true);  
            m.slideIn('t');  
            if(!Ext.isEmpty(autoHide)&&autoHide==true){  
             if(Ext.isEmpty(pauseTime)){  
              pauseTime=1000;  
             }  
             m.pause(pauseTime).ghost("tr",{remove:true});  
            }  
        },  
        hide:function(v){  
         var msg=Ext.get(v.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);  
         msg.ghost("tr", {remove:true});  
        }  
    };  
}(); 