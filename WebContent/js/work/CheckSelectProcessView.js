CheckSelectProcessView  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CheckSelectProcessView.superclass.constructor.call(this, {
			layout : 'fit',
			id : 'CheckSelectProcessViewWin',
			title : '办理进度',
			iconCls : 'menu-product',
			width : 450,
			height : 250,
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
			id : 'CheckSelectProcessView',
			url : __ctxPath + '/work/saveProcessWorkContent.do',
			frame : false,
			border : false,
			labelWidth:70,
			width : 450,
			padding : '5px',
		    reader : new Ext.data.JsonReader({
				root : 'data'
			},[{
				name : 'workContentProcess.id',
				mapping : 'id'
			},{
				name : 'workContentProcess.workContentId',
				mapping : 'workContentId'
			},{
				name : 'workContentProcess.content',
				mapping : 'content'
			}]),
			items : [{
				xtype : 'hidden',
				name:'workContentProcess.workContentId',
				id : 'workContentProcess.workContentId',
				value:this.id
			},{
				fieldLabel : '办理进度',
				xtype : 'textarea',
				width : 350,
				allowBlank : false,
				name : 'workContentProcess.content',
				id : 'workContentProcess.content'
			},{
				layout : 'column',
				border : false,
				defaults : {
					layout : 'form',
					padding : '5px',
					border : false
				},
				items : [{
							columnWidth : .8,
							items : [{
										fieldLabel : '上传附件',
										xtype : 'panel',
										id : 'WorkContentProcessView.personFilePanel',
										frame : false,
										border : true,
										bodyStyle : 'padding:4px 4px 4px 4px;',
										height : 80,
										autoScroll : true,
										html : ''
									}]
						}, {
							columnWidth : .2,
							padding : '5px 0 0 20px',
							items : [{
								border : false,
								xtype : 'button',
								text : '添加文件',
								iconCls : 'menu-attachment',
								handler : function() {
									var dialog = App.createUploadDialog({
										file_cat : 'document',
										judge_size : 'no',
										upload_autostart : true,
										callback : function(data) {
											var fileIds = Ext.getCmp('WorkContentProcessView.fileIds');
											var filePanel = Ext.getCmp('WorkContentProcessView.personFilePanel');

											for (var i = 0; i < data.length; i++) {
												if (fileIds.getValue() != '') {
													fileIds.setValue(fileIds
															.getValue()
															+ ',');
												}
												fileIds.setValue(fileIds
														.getValue()
														+ data[i].fileId);

												Ext.DomHelper
														.append(
																filePanel.body,
																'<span><a href="#" onclick="FileAttachDetail.show('
																		+ data[i].fileId
																		+ ')">'
																		+ data[i].filename
																		+ '</a> <img class="img-delete" src="'
																		+ __ctxPath
																		+ '/images/system/delete.gif" onclick="removeFile(this,\'WorkContentProcessView.fileIds\','
																		+ data[i].fileId
																		+ ')"/>&nbsp;|&nbsp;</span>');

											}
										}
									});
									dialog.show(this);
								}
							}, {
								xtype : 'button',
								text : '清除文件',
								iconCls : 'reset',
								handler : function() {
									var fileAttaches = Ext.getCmp('WorkContentProcessView.fileIds');
									var filePanel = Ext.getCmp('WorkContentProcessView.personFilePanel');

									filePanel.body.update('');
									fileAttaches.setValue('');
								}
							}, {
								xtype : 'hidden',
								id : 'WorkContentProcessView.fileIds',
								name : 'fileIds'
							}]
						}]
			}]
		});
		this.buttons = [{
			text : '提交',
			iconCls : 'btn-save',
			scope : this,
			handler : this.save
		},{
			text : '办结',
			iconCls : 'btn-save',
			scope : this,
			handler : this.end
		},{
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('CheckSelectProcessViewWin').close();
			}
		}];
	},	//end of the initUIComponents
	
	/**
	 * 保存记录
	 */
	save : function() {
		var url=__ctxPath + '/work/saveProcessWorkContent.do';
		this.formPanel.getForm().submit({
			method : 'POST',
			waitMsg : '正在提交表单数据...',
			url : url,
			params : {	
			},
			success : function(fp, action) {
				var gridPanel = Ext.getCmp('CheckSelectGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				Ext.getCmp('CheckSelectProcessViewWin').close();
				Ext.getCmp('CheckSelectDetailViewWin').close();
				Ext.ux.Toast.msg('操作信息', '操作成功！');
			}
		});
	},
	end : function() {
		var url=__ctxPath + '/work/saveProcessEndWorkContent.do';
		this.formPanel.getForm().submit({
			method : 'POST',
			waitMsg : '正在提交表单数据...',
			url : url,
			params : {	
			},
			success : function(fp, action) {
				var gridPanel = Ext.getCmp('CheckSelectGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				Ext.getCmp('CheckSelectProcessViewWin').close();
				Ext.getCmp('CheckSelectDetailViewWin').close();
				Ext.ux.Toast.msg('操作信息', '操作成功！');
			}
		});
	}
});