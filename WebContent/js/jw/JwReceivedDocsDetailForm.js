JwReciivedDocsDetailForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	displayPanel : null,
	gridPanel:null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		JwReciivedDocsDetailForm.superclass.constructor.call(this, {
			id:'JwReciivedDocsDetailForm',
			layout : 'form',
			items : [this.displayPanel],
			modal : true,
			height : 650,
			title : '收文详情',
			width : 800,
			autoHeight : true,
			maximizable : true,
			buttonAlign : 'center',
			buttons : [{
						text : '关闭',
						iconCls : 'btn-cancel',
						scope : this,
						handler : this.cancel
					}]
		});
	},
	initUIComponents : function() {
		this.displayPanel = new Ext.Panel({
			id : 'JwReciivedDocsDetailPanel',
			autoScroll : true,
			autoHeight : true,
			border : false,
			autoLoad : {
				url : __ctxPath
						+ '/pages/oldjwArchives/JwReceivedDocsDetail.jsp?id='+this.id,
				nocache : true
			}
		});
	},

	cancel : function() {
		this.close();
	}
});