CheckSelectDetailView  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CheckSelectDetailView.superclass.constructor.call(this, {
			layout : 'fit',
			id : 'CheckSelectDetailViewWin',
			title : '事项详情',
			iconCls : 'menu-product',
			width : 720,
			height : 520,
			items:this.detailPanel,
			maximizable : true,
			border : false,
			modal : true,
			plain : true,
			buttonAlign : 'center',
			bodyStyle :'overflow-x:hidden;overflow-y:scroll',
			buttons : this.buttons
		});
	},
	// 初始化组件
	initUIComponents : function() {
		this.detailPanel = new Ext.Panel({
			//title:'事项信息',
			autoHeight : true,
			columnWidth : 1,
			id:'CheckSelectDetailPanel',
			autoScroll : true,
			autoLoad : {
				url : __ctxPath+'/pages/work/detail.jsp?id='+this.id,
				nocache : true
			}
		});
	}
});