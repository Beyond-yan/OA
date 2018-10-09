DocFilesAndProcessDetailForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	displayPanel : null,
	gridPanel:null,
	docFilesId:null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DocFilesAndProcessDetailForm.superclass.constructor.call(this, {
			id:'DocFilesAndProcessDetailForm',
			layout : 'form',
			items : [this.displayPanel, this.runDisplayPanel],
			modal : true,
			height : 600,
			title : '文件详情',
			width : 720,
			autoScroll:true,
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
			id : 'DocFilesAndProcessDetailPanel',
			width:690,
			autoScroll : true,
			autoHeight : true,
			border : false,
			autoLoad : {
				url : __ctxPath
						+ '/pages/doc/DocFileDetail.jsp?docFilesId='+this.id +'&defId='+this.defId,
				nocache : true
			}
		});
		this.runDisplayPanel = new Ext.Panel({
			title:'审批信息',
			autoScroll:true,
			width:690,
			autoHeight:true,
			autoLoad:{
				url:__ctxPath+'/flow/processRunDetail.do?randId='+Math.random()+'&taskId='+this.taskId+'&runId='+this.runId
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
		freshId:'DocFilesAndProcessDetailForm',
		fileId : docFilesId
	}).show();}// end of save

});