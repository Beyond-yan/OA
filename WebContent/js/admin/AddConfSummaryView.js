Ext.ns('AddConfSummaryView');

/**
 * @description 新建会议纪要
 * @author YHZ
 * @data 2010-9-29 PM
 */




AddConfSummaryView = Ext.extend(Ext.Panel, {
	// top工具栏
	topbar : null,
	form : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 加载组件
		this.initUIComponent();
		AddConfSummaryView.superclass.constructor.call(this, {
					id : 'AddConfSummaryViewPanel',
					title : '新建会议纪要',
					iconCls : 'menu-confSummary_add',
					header : true,
					region : 'center',
					layout : 'border',
					bodyStyle : 'padding:5px 5px 5px 5px',
					items : [this.form]
				});
	},// end of constructor
	initUIComponent : function() {
		this.topbar = new Ext.Toolbar({
					id : 'AddConfSummaryViewTool',
					heigth : 30,
					defaultType : 'button',
					items : [{
								iconCls : 'btn-mail_send',
								text : '发送',
								handler : this.send
							}, {
								iconCls : 'btn-save',
								text : '保存',
								handler : this.save
							}]
				});
		this.form = new Ext.form.FormPanel({
			id : 'AddConfSummaryViewForm',
			region : 'center',
			layout : 'form',
			tbar : this.topbar,
			frame : false,
			border : true,
			bodyStyle : 'padding-left:50px;',
			defaultType : 'texfield',
			items : [{
				xtype : 'fieldset',
				title : '新增会议纪要信息',
				width : 900,
				layout : 'form',
				buttonAlign : 'center',
				defaults : {
					margins : {
						top : 5,
						left : 5,
						bottom : 5,
						right : 5
					}
				},
				items : [{
							xtype : 'hidden',
							name : 'confSummary.confId.confId',
							Id:'confSummary.confId.confId'
						}, {
							xtype : 'container',
							layout : 'hbox',
							items : [ {
										xtype : 'label',
										text : '会议议题：'
									}, {
										style : 'margin-left:45px; margin-right:10px;margin-bottom:80px;',
										xtype : 'textfield',
										name : 'confTopic',
										id:'confTopic',
										width : 350,
										readOnly : true,
										allowBlank : false,
										blankText : '请输入会议纪要！',
										maxLength : 128,
										maxLengthText : '会议议题不能超过128个字符长度！'
									}/*, {
										xtype : 'button',
										text : '请选择',
										iconCls : 'btn-user-sel',
										handler : function() {
											ConferenceSelector
													.getView(
															function(confId,
																	confTopic) {
																var fm = Ext
																		.getCmp('AddConfSummaryViewForm');
																fm
																		.getCmpByName('confSummary.confId.confId')
																		.setValue(confId);
																fm
																		.getCmpByName('confTopic')
																		.setValue(confTopic);
															}, true).show();
										}
									}*/]
						}, {
							xtype : 'htmleditor',
							fieldLabel : '纪要内容',
							id : 'sumContent',
							name : 'confSummary.sumContent',
							width : 600,
							heigth : 400,
							allowBlank : false,
							blankText : '对不起，请输入会议纪要内容！',
							maxLength : 4000,
							maxLengthtext : '会议纪要内容不能超过4000个字符长度！'
						}, {
							xtype : 'hidden',
							name : 'fileIds'
						}, {
							xtype : 'compositefield',
							fieldLabel : '上传附件',
							layout : 'form',
							items : [{
										xtype : 'textfield',
										fieldLabel : '地址',
										name : 'filePath',
										width : 300,
										readOnly : true
									}, {
										xtype : 'button',
										iconCls : 'btn-upload',
										text : '请选择',
										handler : this.upLoadFile
									}, {
										xtype : 'button',
										iconCls : 'btn-cancel',
										text : '取消',
										handler : this.delLoadFile
									}]
						},
						{			xtype : 'hidden',
										name : 'confSummary.creator'
									}, {
										xtype : 'label',
										text : '拟稿人：'
									}, {
										style : 'margin-left:45px; margin-right:10px;margin-bottom:5px;',
										xtype : 'textfield',
										name : 'creatorName',
										width : 350,
										readOnly : true,
										allowBlank : false,
										blankText : '请选择拟稿人！',
										maxLength : 128,
										maxLengthText : '会议标题不能超过128个字符长度！'
									}, {
										xtype : 'button',
										text : '请选择',
										iconCls : 'btn-user-sel',
										handler : function() {
											UserSelector.getView(
													function(userId, fullName) {
														var fm = Ext
																.getCmp('AddConfSummaryViewForm');
														fm
																.getCmpByName('confSummary.creator')
																.setValue(userId);
														fm
																.getCmpByName('creatorName')
																.setValue(fullName);
													}).show();
										}
									}],
				buttons : [{
							text : '发送',
							iconCls : 'btn-mail_send',
							handler : this.send
						}, {
							text : '保存',
							iconCls : 'btn-save',
							handler : this.save
						}]
			}]
		});
		
		
	if (this.confId != null && this.confId != ''
				&& this.confId != 'undenfied') {
			
		/*	this.formPanel.loadData({
						//url : __ctxPath + '/admin/getConference.do?confId='
							//	+ this.confId,
						//root : 'data',
						//preName : 'conference',
						success : function(response, options) {
							var action = Ext.util.JSON
									.decode(response.responseText);
							ConfCompletedForm.setGrantPanel(action);
							ConfCompletedForm
									.setFilePanel(action.data.attachFiles);
							
							
						},
						failure : function() {
							Ext.ux.Toast.msg('操作提示', '数据加载失败！');
						}
					});*/
			
				var form1=Ext.getCmp('AddConfSummaryViewForm')
					Ext.getCmp('confSummary.confId.confId').setValue(this.confId);
							alert("======confSummary.confId.confId========"+Ext.getCmp('confSummary.confId.confId').getValue());
						   Ext.getCmp('confTopic').setValue(this.confTopic);

					
					
					
					
		}
		
		
		
		
		
		
	},// end of initUIComponent

	/**
	 * 保存
	 */
	save : function() {
		var fm = Ext.getCmp('AddConfSummaryViewForm');
		if (fm.getForm().isValid()) {
			fm.getForm().submit({
						url : __ctxPath + '/admin/saveConfSummary.do',
						method : 'post',
						success : function(form, action) {
							Ext.ux.Toast.msg('操作提示', '恭喜您，保存会议纪要成功！');
							fm.getForm().reset();
							App.clickTopTab('ConfSummaryView');
							Ext.getCmp('ConfSummaryGrid').getStore().reload();
						},
						failure : function(fm, action) {
							Ext.ux.Toast.msg('操作提示', action.result.msg);
							Ext.getCmp('sumContent').focus(true);
						}
					});
		}
	},

	/**
	 * 发送
	 */
	send : function() {
		var fm = Ext.getCmp('AddConfSummaryViewForm');
		if (fm.getForm().isValid()) {
			fm.getForm().submit({
						url : __ctxPath + '/admin/sendConfSummary.do',
						method : 'post',
						success : function() {
							Ext.ux.Toast.msg('操作提示', '恭喜您，会议纪要发送成功！');
							fm.getForm().reset();
							App.clickTopTab('ConfSummaryView');
							Ext.getCmp('ConfSummaryGrid').getStore().reload();
						},
						failure : function(fm, action) {
							Ext.ux.Toast.msg('操作提示', action.result.msg);
							Ext.getCmp('sumContent').focus(true);
						}
					});
		}
	},

	/**
	 * 文件上传
	 */
	upLoadFile : function() {
		var dialog = App.createUploadDialog({
					url : __ctxPath + '/file-upload',
					file_cat : 'admin/confSummary',
					callback : function(arr) {
						var str = '';
						var filePath = '';
						for (var i = 0; i < arr.length; i++) {
							str += arr[i].fileId + ",";
							filePath += arr[i].filepath + ',';
						}
						str = str.substring(0, str.length - 1);
						var fm = Ext.getCmp('AddConfSummaryViewForm');
						fm.getCmpByName('fileIds').setValue(str);
						fm.getCmpByName('filePath').setValue(filePath
								.substring(0, filePath.length - 1));
					}
				});
		dialog.show('querybtn');
	},

	/**
	 * 删除上传文件
	 */
	delLoadFile : function() {
		var fm = Ext.getCmp('AddConfSummaryViewForm');
		var fileIds = fm.getCmpByName('fileIds').value;
		if (fileIds != null && fileIds != '' && fileIds != 'undefined') {
			Ext.Msg.confirm('确认信息', '您真的要删除上传文件吗？', function(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
										url : __ctxPath
												+ '/system/multiDelFileAttach.do',
										method : 'post',
										params : {
											ids : fileIds
										},
										success : function() {
											Ext.ux.Toast.msg('操作提示',
													'上传文件删除成功！');
											fm.getCmpByName('fileIds')
													.setValue('');
											fm.getCmpByName('filePath')
													.setValue('');
										},
										failure : function() {
											Ext.ux.Toast.msg('操作提示',
													'对不起，您上传文件删除失败！');
										}
									});
						}
					});
		} else {
			Ext.ux.Toast.msg('操作提示', '对不起，你还没有上传文件！');
		}
	}
});