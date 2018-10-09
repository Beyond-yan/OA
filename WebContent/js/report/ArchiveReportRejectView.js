ArchiveReportRejectView  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ArchiveReportRejectView.superclass.constructor.call(this, {
			layout : 'fit',
			id : 'ArchiveReportRejectViewWin',
			title : '退文信息',
			iconCls : 'menu-product',
			width : 400,
			height : 200,
			items:this.formPanel,
			maximizable : true,
			border : false,
			modal : true,
			plain : true,
			buttonAlign : 'center',
			buttons : this.buttons
		});
	},
	// 初始化组件
	initUIComponents : function() {
		//初始化form表单
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			id : 'ArchiveReportRejectViewPanel',
			url : __ctxPath + '/archive/saveNormalArchivesAction.do',
			frame : false,
			border : false,
			labelWidth:70,
			width : 400,
			padding : '5px',
			items : [{
				layout : 'column',
				defaults : {
					border : false
				},
				fieldLabel : '退文原因',
				width : 280,
				autoScroll:true,
				id:'ArchiveReportRejectView.shortContent',
				xtype : 'textarea',
				maxLength:500,
				height:80
			}]	
		});
		this.buttons = [{
			text : '确定',
			iconCls : 'btn-save',
			scope : this,
			handler : this.save
		},{
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('ArchiveReportRejectViewWin').close();
			}
		}];
	},	//end of the initUIComponents
	
	/**
	 * 保存记录
	 */
	save : function() {
		var shortContent=Ext.getCmp('ArchiveReportRejectView.shortContent').getValue();
		if(shortContent==""){
			alert("请填写退文原因！");
			return false;
		}
		var archivesId=this.archivesId;
	    Ext.Msg.confirm('信息确认', '请确认是否需要退文。', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url : __ctxPath + '/archive/updateDraftArchives.do',
					params : {
						'archivesId' : archivesId,
						'isDraft':-1,
						'shortContent':shortContent
					},
					method:'post',
					success : function(response, options) {
						var gridPanel = Ext.getCmp('ArchiveReportSendGrid');
						if (gridPanel != null) {
							gridPanel.getStore().reload();
						}
						Ext.getCmp('ArchiveReportSendViewWin').close();
						Ext.getCmp('ArchiveReportRejectViewWin').close();
						Ext.ux.Toast.msg('操作信息', '操作成功！');
					}
				});
			}
		});
	}
});