Ext.ns("App");
Ext.ns("AppUtil");
//用于标记已经加载过的js库
var jsCache=new Array();

/*
 * XML字符串转化为Dom对象
 */
function strToDom(xmlData) {
	if (window.ActiveXObject) {
		//for IE
		var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(xmlData);
		return xmlDoc;
	} else if (document.implementation && document.implementation.createDocument) {
		//for Mozila
		var parser=new DOMParser();
		var xmlDoc=parser.parseFromString(xmlData,"text/xml");
		return xmlDoc;
	}
}

function newView(viewName,params){
	var str='new ' + viewName ;
	if(params!=null){
		str+='(params);';
	}else{
		str+='();';
	}
	return eval(str);
}

/**
 * Import Js
 * @return {}
 */
function $ImportJs(viewName,callback,params) {
	var b = jsCache[viewName];
	
	if (b != null) {
		var view =newView(viewName,params);
		callback.call(this, view);
	} else {
		var jsArr = eval('App.importJs.' + viewName);
		if(jsArr==undefined || jsArr.length==0){
			try{
				var view = newView(viewName,params);
				callback.call(this, view);
			}catch(e){
			}
			return ;
		}
		ScriptMgr.load({
					scripts : jsArr,
					callback : function() {
						jsCache[viewName]=0;
						var view = newView(viewName,params);
						callback.call(this, view);
					}
		});
	}
}
/**
 * 加载的js,并调用回调函数
 * @param {} jsArr
 * @param {} callback
 */
function $ImportSimpleJs(jsArr,callback){
	ScriptMgr.load({
					scripts : jsArr,
					callback : function() {
						if(callback){
							callback.call(this);
						}
					}
	});
}

/**
 * 取得中间的内容面板
 * @return {}
 */
App.getContentPanel=function(){
	var tabs = Ext.getCmp('centerTabPanel');
	return tabs;
};

/**
 * 创建上传的对话框
 * @param {} config
 * @return {}
 */
App.createUploadDialog=function(config){
	var defaultConfig={
		file_cat:'others',
		judge_size:'no',
		file_single : 'false',
		url:__ctxPath+'/file-upload',
		reset_on_hide: false,
		upload_autostart:false,
		modal : true
	};
	Ext.apply(defaultConfig,config);
	var	dialog = new Ext.ux.UploadDialog.Dialog(defaultConfig);
	return dialog;
};

App.createUploadDialog2 = function(config){
	var defaultConfig = {
		file_cat : 'others',
		url : __ctxPath + '/file-upload',
		reset_on_hide : false,
		upload_autostart : false,
		modal : true
	};
	Ext.apply(defaultConfig,config);	
	var	dialog = new Ext.ux.UploadDialog.Dialog(defaultConfig);
	return dialog;
};
/**
 * 把数组中的重复元素去掉
 * @param {} data 传入一个数组
 * @return {}　返回一个元素唯一的数组
 */
function uniqueArray(data) {
	data = data || [];
	var a = {};
	for (var i = 0; i < data.length; i++) {
		var v = data[i];
		if (typeof(a[v]) == 'undefined') {
			a[v] = 1;
		}
	};
	data.length = 0;
	for (var i in a) {
		data[data.length] = i;
	}
	return data;
};

/* This function is used to set cookies */
function setCookie(name,value,expires,path,domain,secure) {
  document.cookie = name + "=" + escape (value) +
    ((expires) ? "; expires=" + expires.toGMTString() : "") +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
}

/*This function is used to get cookies */
function getCookie(name) {
	var prefix = name + "=" 
	var start = document.cookie.indexOf(prefix); 
	
	if (start==-1) {
		return null;
	}
	
	var end = document.cookie.indexOf(";", start+prefix.length);
	if (end==-1) {
		end=document.cookie.length;
	}

	var value=document.cookie.substring(start+prefix.length, end) ;
	return unescape(value);
}

/* This function is used to delete cookies */
function deleteCookie(name,path,domain) {
  if (getCookie(name)) {
    document.cookie = name + "=" +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      "; expires=Thu, 01-Jan-70 00:00:01 GMT";
  }
}

String.prototype.trim = function() {
	return(this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""))
};

/**
 * 封装请求
 * @param {} config
 */
function $request(config){
		Ext.Ajax.request({
			url:config.url,
			params:config.params,
			method:config.method==null?'POST':config.method,
			success:function(response,options){
				if(config.success!=null){
					config.success.call(this,response,options);
				}
			},
			failure:function(response,options){
				Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
				if(config.success!=null){
					config.failure.call(this,response,options);
				}
			}
		});
}

function asynReq(){
	var conn = Ext.Ajax.getConnectionObject().conn;
	conn.open("GET", url,false);
	conn.send(null); 
}

/**
 * 为GridPanel添加打印及导出功能
 * @param {} grid GridPanel
 */
AppUtil.addPrintExport=function(grid){
	/*	
	var exportButton = new Ext.ux.Exporter.Button({
          component: grid,
          iconCls: 'btn-excel',
          text     : '导出'
        });
        
        grid.getTopToolbar().add('->');
        grid.getTopToolbar().add(exportButton);
		grid.getTopToolbar().add(
				new Ext.Button({
					text:'打印',
					iconCls:'btn-print',
					handler:function(){
						Ext.ux.Printer.print(grid);
					}
				})
		);
		*/
};
/*
 * 删除Content中的Tab
 */
AppUtil.removeTab=function(tabId){
	var contentPanel=App.getContentPanel();
	var tabItem = contentPanel.getItem(tabId);
	if(tabItem!=null){
		contentPanel.remove(tabItem,true);
	}
};
/**
 * 激活Content中的Tab
 * @param {} panel
 */
AppUtil.activateTab=function(panel){
	var contentPanel=App.getContentPanel();
	contentPanel.activate(panel);
};


Ext.override(Ext.layout.ContainerLayout, {
    setContainer : function(ct){ // Don't use events!
        this.container = ct;
    }
});

Ext.override(Ext.BoxComponent, {
    setSize: function(w, h){
        // support for standard size objects
        if(typeof w == 'object'){
            h = w.height, w = w.width;
        }
        if (Ext.isDefined(w) && Ext.isDefined(this.minWidth) && (w < this.minWidth)) {
            w = this.minWidth;
        }
        if (Ext.isDefined(h) && Ext.isDefined(this.minHeight) && (h < this.minHeight)) {
            h = this.minHeight;
        }
        if (Ext.isDefined(w) && Ext.isDefined(this.maxWidth) && (w > this.maxWidth)) {
            w = this.maxWidth;
        }
        if (Ext.isDefined(h) && Ext.isDefined(this.maxHeight) && (h > this.maxHeight)) {
            h = this.maxHeight;
        }
        // not rendered
        if(!this.boxReady){
            this.width = w, this.height = h;
            return this;
        }

        // prevent recalcs when not needed
        if(this.cacheSizes !== false && this.lastSize && this.lastSize.width == w && this.lastSize.height == h){
            return this;
        }
        this.lastSize = {width: w, height: h};
        var adj = this.adjustSize(w, h),
            aw = adj.width,
            ah = adj.height,
            rz;
        if(aw !== undefined || ah !== undefined){ // this code is nasty but performs better with floaters
            rz = this.getResizeEl();
            if(!this.deferHeight && aw !== undefined && ah !== undefined){
                rz.setSize(aw, ah);
            }else if(!this.deferHeight && ah !== undefined){
                rz.setHeight(ah);
            }else if(aw !== undefined){
                rz.setWidth(aw);
            }
            this.onResize(aw, ah, w, h);
        }
        return this;
    },

    onResize: function(adjWidth, adjHeight, rawWidth, rawHeight){
        this.fireEvent('resize', this, adjWidth, adjHeight, rawWidth, rawHeight);
    }
});

Ext.override(Ext.Container, {
	/**
	 * 取某个容器下的名称为name变量值的组件
	 * @param {} name
	 * @return {}
	 */
	getCmpByName:function(name){
		var getByName=function(container,name){
			var items=container.items;
			if(items!=null){
				for(var i=0;i<items.getCount();i++){
					var comp=items.get(i);
					var cp=getByName(comp,name);
					if(cp!=null)return cp;
					if(name==comp.name ||(comp.getName && name==comp.getName())){
						return comp;
						break;
					}
				}
			}
			return null;
		};
		return getByName(this,name);
	},
    onResize: function(adjWidth, adjHeight, rawWidth, rawHeight){
        Ext.Container.superclass.onResize.apply(this, arguments);
        if ((this.rendered && this.layout && this.layout.monitorResize) && !this.suspendLayoutResize) {
            this.layout.onResize();
        }
    },

    canLayout: function() {
        var el = this.getVisibilityEl();
        return el && !el.isStyle("display", "none");
    },

    /**
     * Force this container's layout to be recalculated. A call to this function is required after adding a new component
     * to an already rendered container, or possibly after changing sizing/position properties of child components.
     * @param {Boolean} shallow (optional) True to only calc the layout of this component, and let child components auto
     * calc layouts as required (defaults to false, which calls doLayout recursively for each subcontainer)
     * @param {Boolean} force (optional) True to force a layout to occur, even if the item is hidden.
     * @return {Ext.Container} this
     */
    doLayout: function(shallow, force){
        var rendered = this.rendered,
            forceLayout = force || this.forceLayout,
            cs, i, len, c;

        if(!this.canLayout() || this.collapsed){
            this.deferLayout = this.deferLayout || !shallow;
            if(!forceLayout){
                return;
            }
            shallow = shallow && !this.deferLayout;
        } else {
            delete this.deferLayout;
        }

        cs = (shallow !== true && this.items) ? this.items.items : [];

//      Inhibit child Containers from relaying on resize. We plan to explicitly call doLayout on them all!
        for(i = 0, len = cs.length; i < len; i++){
            if ((c = cs[i]).layout) {
                c.suspendLayoutResize = true;
            }
        }

//      Tell the layout manager to ensure all child items are rendered, and sized according to their rules.
//      Will not cause the child items to relayout.
        if(rendered && this.layout){
            this.layout.layout();
        }

//      Lay out all child items
        for(i = 0; i < len; i++){
            if((c = cs[i]).doLayout){
                c.doLayout(false, forceLayout);
            }
        }
        if(rendered){
            this.onLayout(shallow, forceLayout);
        }
        // Initial layout completed
        this.hasLayout = true;
        delete this.forceLayout;

//      Re-enable child layouts relaying on resize.
        for(i = 0; i < len; i++){
            if ((c = cs[i]).layout) {
                delete c.suspendLayoutResize;
            }
        }
    }
});

Ext.override(Ext.Panel, {
    onResize: Ext.Panel.prototype.onResize.createSequence(Ext.Container.prototype.onResize)
});

Ext.override(Ext.Viewport, {
    fireResize : function(w, h){
        this.onResize(w, h, w, h);
    }
});

Ext.useShims = true;

/**
 * 移除附件
 * @param {} obj img
 * @param {} fileIdsElId ID控件ID名稱
 * @param {} fileId 要刪除的附件ID
 */
function removeFile(obj, fileIdsElId, fileId) {
	var fileIds = Ext.getCmp(fileIdsElId);
	var value = fileIds.getValue();
	if (value.indexOf(',') < 0) {// 仅有一个附件
		fileIds.setValue('');
	} else {
		value = value.replace(',' + fileId, '').replace(fileId + ',', '');
		fileIds.setValue(value);
	}

	var el = Ext.get(obj.parentNode);
	el.remove();
};
