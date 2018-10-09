/**
 * @author:Ropen
 * @createtime
 * @class OdPersonalSignForm
 * @extends Ext.Window
 * @description OdPersonalSign表单
 * @company 捷达世软件
 */
OdPersonalSignForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		OdPersonalSignForm.superclass.constructor.call(this, {
					id : 'OdPersonalSignFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					height : 400,
					width : 500,
					maximizable : true,
					title : '个性签名详细信息',
					buttonAlign : 'center',
					buttons : [{
								text : '保存',
								id:'savebutton',
								iconCls : 'btn-save',
								scope : this,
								handler : this.save
							}, /*{
								text : '重置',
									id:'resetbutton',
								iconCls : 'btn-reset',
								scope : this,
								handler : this.reset
							},*/ {
								text : '取消',
								id:'cancelbutton',
								iconCls : 'btn-cancel',
								scope : this,
								handler : this.cancel
							}]
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			id : 'OdPersonalSignForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [{
						name : 'odPersonalSign.id',
						xtype : 'hidden',
						value : this.id == null ? '' : this.id
					}, {
						fieldLabel : '个性签名标题',
						name : 'odPersonalSign.signTitle',
						allowBlank : false,
						maxLength : 50
					}, {
						fieldLabel : '个性签名描述',
						name : 'odPersonalSign.signDesc',
						xtype : 'textarea',
						maxLength : 400
					}, /*
						 * { fieldLabel : '个性签名人', name :
						 * 'odPersonalSign.userId', allowBlank : false, xtype :
						 * 'numberfield' },
						 */{
						xtype : 'container',
						style : 'padding-top:3px;',
						layout : 'column',
						items : [{
									xtype : 'label',
									text : '个性签名人:',
									width : 105
								}, {
									xtype : 'textfield',
									name : 'odPersonalSign.appUser.username',
									id : 'odPersonalSign.appUser.username',
									width : 284,
									readOnly : true,
									allowBlank : false
								}, {
									xtype : 'hidden',
									name : 'odPersonalSign.appUser.userId',
									id : 'odPersonalSign.appUser.userId'
								}, {
									xtype : 'button',
									text : '请选择',
									iconCls : 'btn-user-sel',
									handler : function() {
										UserSelector.getView(
												function(userId, fullName) {
													var fm = Ext
															.getCmp("OdPersonalSignForm");
													fm
															.getCmpByName('odPersonalSign.appUser.userId')
															.setValue(userId);
													fm.getCmpByName('odPersonalSign.appUser.username')
															.setValue(fullName);
												}, true).show();
									}
								}]
					}, {
						xtype : 'container',
						style : 'padding-top:3px;',
						layout : 'column',
						items : [{
									xtype : 'label',
									text : '个性签名:',
									width : 105
								}, {
									xtype : 'hidden',
									id : 'odPersonalSign.fileAttach.fileId',
									name : 'odPersonalSign.fileAttach.fileId'
								},{
									xtype : 'textfield',
									id : 'odPersonalSign.fileAttach.fileName',
									name : 'odPersonalSign.fileAttach.fileName',
									allowBlank : false,
									readOnly : true,
									width : 297
								}, {
									columnWidth : .1,
									xtype : 'button',
									iconCls : 'btn-upload',
									text : '上传',
									handler : this.upLoadFile
								}]
					}/*,
					
					{
						xtype : 'container',
						title : '个性签名:',
						layout : 'column',
						items : [{
									columnWidth : .8,
									layout : 'form',
									items : [{
												xtype : 'panel',
												id : 'archivesRecFilePanel',
												height : 50,
												border : false,
												name : 'archivesRecFilePanel',
												autoScroll : true,
												html : ''
											}]
								}, {
									columnWidth : .2,
									border : false,
									items : [{
										xtype : 'button',
										text : '添加附件',
										iconCls : 'menu-attachment',
										handler : function() {
											var dialog = App
													.createUploadDialog({
														file_cat : 'hrm',
														callback : function(
																data) {
															var fileIds = Ext
																	.getCmp("archivesRecfileIds");
															var filePanel = Ext
																	.getCmp('archivesRecFilePanel');

															for (var i = 0; i < data.length; i++) {
																if (fileIds
																		.getValue() != '') {
																	fileIds
																			.setValue(fileIds
																					.getValue()
																					+ ',');
																}
																fileIds
																		.setValue(fileIds
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
																						+ '/images/system/delete.gif" onclick="ArchivesRecFormVm.removeFile(this,'
																						+ data[i].fileId
																						+ ')"/>&nbsp;|&nbsp;</span>');
															}
														}
													});
											dialog.show(this);
										}
									}, {
										xtype : 'button',
										text : '清除附件',
										iconCls : 'reset',
										handler : function() {
											var fileAttaches = Ext
													.getCmp("archivesRecfileIds");
											var filePanel = Ext
													.getCmp('archivesRecFilePanel');
											filePanel.body.update('');
											fileAttaches.setValue('');
										}
									}, {
										xtype : 'hidden',
										id : 'archivesRecfileIds',
										name : 'archivesRecfileIds'
									}]
								}]
					}*/

				]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
				url : __ctxPath + '/archive/getOdPersonalSign.do?id=' + this.id,
				root : 'data',
				preName : 'odPersonalSign'
			});
		}

	},// end of the initcomponents

	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function() {
		this.close();
	},
	/**
	 * 保存记录
	 */
	save : function() {
		if( this.formPanel.getForm().isValid()){
			 this.formPanel.getForm().submit({
					scope:this,
					url : __ctxPath + '/archive/saveOdPersonalSign.do',
					method : 'post',
					waitMsg : '正在提交数据...',
					success : function(fp, action) {
						Ext.ux.Toast.msg('操作信息', '成功信息保存！');
					    var gridPanel = Ext.getCmp('OdPersonalSignGrid');
						if (gridPanel != null) {
							gridPanel.getStore().reload();
						}
						this.close();
					},
					failure : function(fp, action) {
						Ext.MessageBox.show({
								title : '操作信息',
								msg : Ext.util.JSON
										.decode(action.response.responseText).msg,
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
					}
				});
		}
	},// end of save

	/**
	 * 文件上传
	 */
	upLoadFile : function() {
		var dialog = App.createUploadDialog({
			file_cat : 'archive/personalSign',
			file_single : 'true',
			upload_autostart : true,
			callback : function(arr) {
				var fileIds = '';
				var fileName='';
				var filePanel = Ext.getCmp('resumeFilePanel');
				for (var i = 0; i < arr.length; i++) {
					fileIds += arr[i].fileId;
					fileName+=arr[i].filename;
//					Ext.DomHelper
//							.append(
//									filePanel.body,
//									'<span><a href="#" onclick="FileAttachDetail.show('
//											+ arr[i].fileId
//											+ ')">'
//											+ arr[i].filename
//											+ '</a><img class="img-delete" src="'
//											+ __ctxPath
//											+ '/images/system/delete.gif" onclick="removeResumeFile(this,'
//											+ arr[i].fileId
//											+ ')"/>&nbsp;|&nbsp;</span>');
				}
				Ext.getCmp('OdPersonalSignForm')
						.getCmpByName('odPersonalSign.fileAttach.fileId').setValue(fileIds);
				Ext.getCmp('OdPersonalSignForm')
						.getCmpByName('odPersonalSign.fileAttach.fileName').setValue(fileName);
						
			}
		});
		dialog.show('querybtn');
	}
});

/**
 * 上传文件删除
 */
/*function removeResumeFile(obj, fileId) {
	var fileIds = Ext.getCmp("OdPersonalSignForm")
			.getCmpByName('odPersonalSign.signFileId');
	var value = fileIds.getValue();
	if (value.indexOf(',') < 0) {// 仅有一个附件
		fileIds.setValue('');
	} else {
		value = value.replace(',' + fileId, '').replace(fileId + ',', '');
		fileIds.setValue(value);
	}
	var el = Ext.get(obj.parentNode);
	el.remove();
};*/