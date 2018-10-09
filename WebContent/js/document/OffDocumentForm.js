var OffDocumentForm = function(docId) {
	this.docId = docId;
	var fp = this.setup();
	var window = new Ext.Window({
		id : 'OffDocumentFormWin',
		title : '文档详细信息',
		iconCls:'menu-personal-doc',
		width : 500,
		height : 200,
		modal : true,
		maximizable:true,
		layout : 'fit',
		buttonAlign : 'center',
		items : [this.setup()],
		buttons : [{
			text : '保存',
			iconCls : 'btn-save',
			handler : function() {
				var offfieldIds=Ext.getCmp('DocumentForm.fileIds').getValue();
				var fp = Ext.getCmp('OffDocumentForm');
				var selectValue = Ext.getCmp('folderSelect').getValue();
				if(offfieldIds==null||offfieldIds==''){
				  Ext.MessageBox.show({
				    title:'提示信息',
				    msg:'请添加文档！',
				    buttons:Ext.MessageBox.OK,
				    icon:Ext.MessageBox.INFO
				  });
				  return;
				}
					if (fp.getForm().isValid()) {
						fp.getForm().submit({
									method : 'post',
									waitMsg : '正在提交数据...',
									success : function(fp, action) {
										var result = Ext.util.JSON.decode(action.response.responseText);
										if(result.message=='error'){
											Ext.ux.Toast.msg('提示', '个人空间不足！');
											window.close();
										}else{
											Ext.ux.Toast.msg('操作信息', '成功信息保存！');
											Ext.getCmp('AllOffDocumentGrid').getStore()
													.reload();
											window.close();
										}
									},
									failure : function(fp, action) {
										Ext.MessageBox.show({
													title : '操作信息',
													msg : '信息保存出错，请联系管理员！',
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-error'
												});
										window.close();
									}
								});
					}
				/*} else {
					Ext.MessageBox.show({
								title : '操作信息',
								msg : '请选择文件夹！',
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
				}*/
			}
		}, {
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				window.close();
			}
		}]
	});
	window.show();
};

OffDocumentForm.prototype.setup = function() {
	var _url = __ctxPath + '/document/listDocFolder.do?method=1';// 不把根目录显示出来
	var folderSelector = new TreeSelector('folderSelect', _url, '文件夹*',
			'DocumentForm.folderId');
	var formPanel = new Ext.FormPanel({
		url : __ctxPath + '/document/saveDocument.do',
		id : 'OffDocumentForm',
		bodyStyle : 'padding:5px;',
		frame : false,
		border:false,
		formId : 'DocumentFormId',
		defaults : {
				anchor : '98%,98%',
				margins:{top:4, right:4, bottom:4, left:4}
		},
		reader : new Ext.data.JsonReader({
						root : 'data'
					}, [{
					            name:'DocumentForm.folderId',
					            mapping:'folderId'
					        },{
								name : 'DocumentForm.docId',
								mapping : 'docId'
							}, {
								name : 'DocumentForm.docName',
								mapping : 'docName'
							}, {
								name : 'DocumentForm.content',
								mapping : 'content'
							}, {
								name : 'DocumentForm.fileIds',
								mapping : 'fileIds'
							}]),
		items : [{
					name : 'folderId',
					id : 'DocumentForm.folderId',
					xtype : 'hidden'
				},{
					name : 'depId',
					xtype : 'hidden',
					value:curUserInfo.depId
				}, {
					name : 'document.docId',
					id : 'DocumentForm.docId',
					xtype : 'hidden',
					value : this.docId == null ? '' : this.docId
				}, {
					xtype : 'textfield',
					fieldLabel : '文档名称',
					name : 'document.docName',
					id : 'DocumentForm.docName',
					anchor : '98%',
					allowBlank : false
				}, {
					layout : 'column',
					border:false,
					defaults:{border:false},
					items : [{
								columnWidth : .84,
								layout : 'form',
								border:false,
								items : [{
											fieldLabel : '文档',
											xtype : 'panel',
											id : 'OffFilePanel',
											frame : false,
											border:true,
											bodyStyle:'padding:4px 4px 4px 4px',
											height : 80,
											autoScroll : true,
											html : ''
										}]
							}, {
								columnWidth : .16,
								items : [{
									border:false,
									xtype : 'button',
									text : '添加文档',
									iconCls:'menu-attachment',
									handler : function() {
										var dialog = App.createUploadDialog({
											file_cat : 'document',
											judge_size : 'no',
										    upload_autostart : true,
											callback : function(data) {
												
												var fileIds = Ext
														.getCmp("DocumentForm.fileIds");
												var filePanel = Ext
														.getCmp('OffFilePanel');

												for (var i = 0; i < data.length; i++) {
													if (fileIds.getValue() != '') {
														fileIds
																.setValue(fileIds
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
																			+ '/images/system/delete.gif" onclick="removeFile(this,'
																			+ data[i].fileId
																			+ ')"/>&nbsp;|&nbsp;</span>');
												}
											}
										});
										dialog.show(this);
									}
								}, {
									xtype : 'button',
									text : '清除文档',
									iconCls : 'reset',
									handler : function() {
										var fileAttaches = Ext
												.getCmp("DocumentForm.fileIds");
										var filePanel = Ext.getCmp('OffFilePanel');

										filePanel.body.update('');
										fileAttaches.setValue('');
									}
								}, {
									xtype : 'hidden',
									id : 'DocumentForm.fileIds',
									name : 'fileIds'
								}]
							}]
				}]
	});
	if (this.docId != null && this.docId != 'undefined') {
		formPanel.getForm().load({
			url : __ctxPath + '/document/getDocument.do?docId=' + this.docId,		
			method:'post',
			waitMsg : '正在载入数据...',
			success : function(form, action) {
				var doc=Ext.util.JSON.decode(action.response.responseText).data[0];
				var folderId = doc.docFolder.folderId;
				var folderName = doc.docFolder.folderName;
				Ext.getCmp('DocumentForm.folderId').setValue(folderId);
				Ext.getCmp('folderSelect').setValue(folderName);
				var af = doc.attachFiles;
				var filePanel = Ext.getCmp('OffFilePanel');
				var fileIds = Ext.getCmp("DocumentForm.fileIds");
				for (var i = 0; i < af.length; i++) {
					if (fileIds.getValue() != '') {
						fileIds.setValue(fileIds.getValue() + ',');
					}
					fileIds.setValue(fileIds.getValue() + af[i].fileId);
					Ext.DomHelper
							.append(
									filePanel.body,
									'<span><a href="#" onclick="FileAttachDetail.show('
											+ af[i].fileId
											+ ')">'
											+ af[i].fileName
											+ '</a><img class="img-delete" src="'
											+ __ctxPath
											+ '/images/system/delete.gif" onclick="removeFile(this,'
											+ af[i].fileId
											+ ')"/>&nbsp;|&nbsp;</span>');
				}
			},
			failure : function(form, action) {
				Ext.MessageBox.show({
							title : '操作信息',
							msg : '载入信息失败，请联系管理员！',
							buttons : Ext.MessageBox.OK,
							icon : 'ext-mb-error'
						});
			}
		});
	}
	return formPanel;

};

function removeFile(obj, fileId) {
	var fileIds = Ext.getCmp("DocumentForm.fileIds");
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
