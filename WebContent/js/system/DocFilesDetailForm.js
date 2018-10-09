DocFilesDetailForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	displayPanel : null,
	gridPanel:null,
	docFilesId:null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DocFilesDetailForm.superclass.constructor.call(this, {
			id:'DocFilesDetailForm',
			layout : 'form',
			items : [this.displayPanel],
			modal : true,
			height : 650,
			title : '文件详情',
			width : 700,
			autoHeight : true,
			maximizable : true,
			buttonAlign : 'center',
			buttonAlign : 'center',
			buttons : [/*{
						text : '原件',
						iconCls : 'btn-search',
						scope : this,
						handler : this.init
					},*/{
						text : '编辑',
						iconCls : 'btn-edit',
						scope : this,
						handler : this.edit.createCallback(this.docFilesId)
					},{
						text : '取消',
						iconCls : 'btn-cancel',
						scope : this,
						handler : this.cancel
					}]
		});
	},
	initUIComponents : function() {
		this.docFilesId=this.id;
		this.displayPanel = new Ext.Panel({
			id : 'DocFilesDetailPanel',
			autoScroll : true,
			autoHeight : true,
			border : false,
			autoLoad : {
				url : __ctxPath
						+ '/pages/doc/DocFileDetail.jsp?docFilesId='+this.id,
				nocache : true
			}
		});
	},

	init : function() {
		
	},

	cancel : function() {
		var freshId=this.freshId;
		 Ext.getCmp(freshId).getStore().reload();
		this.close();
	},

	edit : function(docFilesId) {
		new DocFilesForm({
		freshId:'DocFilesDetailForm',
		fileId : docFilesId
	}).show();}// end of save

});