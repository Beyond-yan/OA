var OutMailForm = function(mailId, opt) {

	return this.setup(mailId, opt);
};

OutMailForm.prototype.setup = function(mailId, opt) {
	var toolbar = this.initToolbar();
	var copyFieldItem = new copyFieldItems();
	var formPanel = new Ext.FormPanel(
			{
				url : __ctxPath + '/communicate/saveOutMail_.do',
				title : '发送邮件',
				iconCls : 'menu-mail_send',
				layout : 'form',
				id : 'OutMailForm',
				tbar : toolbar,
				timeout:120000,
				border : false,
				formId : 'OutMailFormId',
				labelWidth : 60,
				style : 'padding-bottom:25px;',
				reader : new Ext.data.JsonReader( {
					root : 'result'
				}, [

				{
					name : 'mailId',
					mapping : 'mailId'
				},
				{
					name : 'outMail.title',
					mapping : 'title'
				}

				, {
					name : 'content',
					mapping : 'content'
				}, {
					name : 'senderName',
					mapping : 'senderName'
				}, {
					name : 'receiverAddresses',
					mapping : 'receiverAddresses'
				}, , {
					name : 'receiverNames',
					mapping : 'receiverNames'
				}, {
					name : 'senderAddresses',
					mapping : 'senderAddresses'
				}, {
					name : 'cCNames',
					mapping : 'cCNames'
				}, {
					name : 'cCAddresses',
					mapping : 'cCAddresses'
				},
				{
					name : 'mailDate',
					mapping : 'mailDate'
				}, {
					name : 'fileIds',
					mapping : 'fileIds'
				}, {
					name : 'fileNames',
					mapping : 'fileNames'
				}, {
					name : 'readFlag',
					mapping : 'readFlag'
				}, {
					name : 'replyFlag',
					mapping : 'replyFlag'
				}, {
					name : 'folderId',
					mapping : 'folderid'
				}, {
					name : 'userId',
					mapping : 'userId'
				}, {
					name : 'userName',
					mapping : 'userName'
				}

				]),
				items : [
				// -----------------------------------------hidden 的属性
				{
					xtype : 'panel',
					layout : 'form',
					border : false,

					style : 'padding-left:10%;padding-top:20px;',
					defaultType : 'textfield',
					labelWidth : 60,
					width : 650,
					items : [

							{
								fieldLabel : '发送人地址',
								name : 'outMail.senderAddresses',
								xtype : 'hidden',
								id : 'senderAddresses'
							},
							{
								fieldLabel : '发送人名称',
								name : 'outMail.senderName',
								xtype : 'hidden',
								id : 'senderName'
							},
							{
								fieldLabel : '接受人址',
								name : 'outMail.receiverAddresses',
								xtype : 'hidden',
								id : 'receiverAddresses'
							},
							{
								fieldLabel : '抄送人地址',
								name : 'outMail.cCAddresses',
								value : '',
								xtype : 'hidden',
								id : 'cCAddresses'
							},

							{
								fieldLabel : '操作',
								name : 'opt',
								xtype : 'hidden',
								value : opt,
								id : 'opt'
							},

							{
								fieldLabel : '附件IDs',
								name : 'outMail.fileIds',
								xtype : 'hidden',
								value : '',
								id : 'fileIds'
							},

							{
								fieldLabel : 'MailId',
								name : 'outMail.mailId',
								xtype : 'hidden',
								id : 'mailId'
							},
							{
								fieldLabel : '已回复',
								name : 'outMail.replyFlag',
								xtype : 'hidden',
								id : 'replyFlag'
							},
							{
								fieldLabel : '附件名称列表',
								name : 'outMail.fileNames',
								xtype : 'hidden',
								id : 'fileNames'
							},
							// ------------------------------------------ hidden
							// end
							{
								xtype : 'container',
								border : false,
								layout : 'column',
								height : 26,
								bodyStyle : 'padding-top:20px;',
								defaultType : 'textfield',
								items : [
										{
											xtype : 'label',
											text : '收件人:',
											style : 'padding-left:0px;padding-top:3px;',
											width : 61
										},
										{
											width : 350,
											fieldLabel : '收件人姓名列表',
											name : 'outMail.receiverNames',
											id : 'receiverNames',
											allowBlank : false,
											blankText : '请选择收件人',
											readOnly : false
										},
										{
											xtype : 'button',
											text : '选择收件人',
											iconCls : 'btn-mail_recipient',
											handler : function() {
												EMailSelector
														.getView(
																function(
																		fullnames) {

																	var receiverNames = Ext
																			.getCmp('receiverNames');

																	receiverNames
																			.setValue(fullnames);
																}).show();
											}
										},
										{
											xtype : 'button',
											text : '我要抄送',
											iconCls : 'btn-mail_copy',
											handler : function() {
												var ccField = Ext
														.getCmp('ccField');
												ccField.show();
											}
										} ]
							},
							{
								xtype : 'container',// 抄送人container
								id : 'ccField',
								layout : 'column',
								style : 'padding-left:0px;',
								height : 26,
								hidden : true,
								defaultType : 'textfield',
								items : [ copyFieldItem ]
							},
							{
								width : 350,
								fieldLabel : '主题',
								name : 'outMail.title',
//								id : 'title',
								allowBlank : false,
								blankText : '邮件主题为必填'
							},

							{
								xtype : 'container',
								id : 'outMailFileContainer',
								layout : 'column',
								autoHeight : true,
								style : 'padding-left:0px;',
								defaultType : 'textfield',
								items : [
										{
											xtype : 'label',
											text : '附件:',
											style : 'padding-left:0px;padding-top:3px;',
											width : 59
										},
										{
											// autoWidth:true,
											autoHeight : true,
											xtype : 'panel',
											border : false,
											width : 355,
											layout : 'column',
											name : 'outMailFileNames.display',
											id : 'outMailFileNames.display',
											items : [ {
												columnWidth : 1,
												xtype : 'fieldset',
												height : 26,
												id : 'outmail_placeholder'
											} ]
										},
										{
											xtype : 'button',
											text : '上传',
											iconCls : 'btn-upload',
											handler : function() {
												var dialog = App
														.createUploadDialog( {
															file_cat : 'communicate/outmail/upload',
															callback : outMailUploadMailAttach
														});
												dialog.show('queryBtn');
											}
										} ]
							}, {
								fieldLabel : '内容',
								name : 'outMail.content',
								id : 'content',
								xtype : 'htmleditor',
								height : 280
							} ]
				} ]
			// form items
			});
	if (mailId != null && mailId != undefined) {
		var _mailId = Ext.getCmp('mailId');
		_mailId.setValue(mailId);
		if (opt == 'draft') {// 重载草稿
			formPanel
					.getForm()
					.load(
							{
								deferredRender : false,
								url : __ctxPath + '/communicate/getOutMail_.do',
								method : 'post',
								params : {
									mailId : mailId,
									folderId : 3

								},
								waitMsg : '正在载入数据...',
								success : function(form, action) {

									var cCNames = Ext.getCmp('cCNames');
									if(cCNames.value=='null'){cCNames.value='';}
									
									if (cCNames.value != null
											&& cCNames.value != '') {// 假如草稿有抄送人,激活抄送人控件
										var ccField = Ext.getCmp('ccField');
										ccField.show();
									}
										

									var fileNames = Ext.getCmp('fileNames').value;

									if (fileNames != '') {
										var display = Ext
												.getCmp('outMailFileNames.display');
										var outmail_placeholder = Ext
												.getCmp('outmail_placeholder');
										if (outmail_placeholder != null) {// 载入草稿并有附件时,点位行隐藏
											outmail_placeholder.hide();
										}
										var fnames = fileNames.split(',');
										var fids = Ext.getCmp('fileIds').value
												.split(',');
										for ( var i = 0; i < fnames.length; i++) {// 显示附件
											display
													.add(new Ext.form.FieldSet(
															{
																id : 'outMailAttachDisplay' + fids[i],
																columnWidth : 1,
																html : '<img src="'
																		+ __ctxPath
																		+ '/images/flag/attachment.png"/>&nbsp;&nbsp;'
																		+ fnames[i]
																		+ '&nbsp;&nbsp;<a href="javascript:deleteAttach('
																		+ fids[i]
																		+ ')" >删除</a>'
															}));
										}
										display.doLayout(true);
									}
									var data = action.result.data;

									var receiverAddresses = data.receiverAddresses;
									var receiverNames = data.receiverNames;
									var receiver = getStrToEmail(
											receiverAddresses, receiverNames);
									form.findField("receiverNames").setValue(
											receiver);

									var cCAddresses = data.cCAddresses;
									var cCNames = data.cCNames;
									var cC = getStrToEmail(cCAddresses, cCNames);
									Ext.getCmp('cCNames').setValue(cC);

								},
								failure : function(form, action) {

								}
							});
		} else if (opt == 'reply') {// 回复
			formPanel
					.getForm()
					.load(
							{
								deferredRender : false,
								url : __ctxPath + '/communicate/optOutMail_.do',
								method : 'post',
								params : {
									mailId : mailId,

									opt : '回复'
								},
								waitMsg : '正在载入数据...',
								success : function(form, action) {
									Ext.getCmp('mailId').setValue(mailId);

									var cCNames = Ext.getCmp('cCNames');
									if (cCNames.value != null
											&& cCNames.value != '') {// 假如草稿有抄送人,激活抄送人控件
										var ccField = Ext.getCmp('ccField');
										ccField.show();
									}

									var fileNames = Ext.getCmp('fileNames').value;

									if (fileNames != '') {
										var display = Ext
												.getCmp('outMailFileNames.display');
										var outmail_placeholder = Ext
												.getCmp('outmail_placeholder');
										if (outmail_placeholder != null) {// 载入草稿并有附件时,点位行隐藏
											outmail_placeholder.hide();
										}
										var fnames = fileNames.split(',');
										var fids = Ext.getCmp('fileIds').value
												.split(',');
										for ( var i = 0; i < fnames.length; i++) {// 显示附件
											display
													.add(new Ext.form.FieldSet(
															{
																id : 'outMailAttachDisplay' + fids[i],
																columnWidth : 1,
																html : '<img src="'
																		+ __ctxPath
																		+ '/images/flag/attachment.png"/>&nbsp;&nbsp;'
																		+ fnames[i]
																		+ '&nbsp;&nbsp;<a href="javascript:deleteAttach('
																		+ fids[i]
																		+ ')" >删除</a>'
															}));
										}
										display.doLayout(true);
									}

									var data = action.result.data;
									var cCAddresses = data.cCAddresses;
									var cCNames = data.cCNames;
									var cC = getStrToEmail(cCAddresses, cCNames);
									Ext.getCmp('cCNames').setValue(cC);
									// 回复 收件人与发件人地址互换
									var receiverAddresses = data.senderAddresses;
									var receiverNames = data.senderName;
									var receiver = getStrToEmail(
											receiverAddresses, receiverNames);
									form.findField("receiverNames").setValue(
											receiver);
								},
								failure : function(form, action) {
								}
							});
		} else if (opt == 'forward') {//转发
			formPanel
					.getForm()
					.load(
							{
								deferredRender : false,
								url : __ctxPath + '/communicate/optOutMail_.do',
								method : 'post',
								params : {
									mailId : mailId,
									opt : '转发'
								},
								waitMsg : '正在载入数据...',
								success : function(form, action) {
									Ext.getCmp('mailId').setValue(mailId);
									var cCNames = Ext.getCmp('cCNames');
									if (cCNames.value != null
											&& cCNames.value != '') {// 假如草稿有抄送人,激活抄送人控件
										var ccField = Ext.getCmp('ccField');
										ccField.show();
									}

									var fileNames = Ext.getCmp('fileNames').value;

									if (fileNames != '') {
										var display = Ext
												.getCmp('outMailFileNames.display');
										var outmail_placeholder = Ext
												.getCmp('outmail_placeholder');
										if (outmail_placeholder != null) {// 载入草稿并有附件时,点位行隐藏
											outmail_placeholder.hide();
										}
										var fnames = fileNames.split(',');
										var fids = Ext.getCmp('fileIds').value
												.split(',');
										for ( var i = 0; i < fnames.length; i++) {// 显示附件
											display
													.add(new Ext.form.FieldSet(
															{
																id : 'outMailAttachDisplay' + fids[i],
																columnWidth : 1,
																html : '<img src="'
																		+ __ctxPath
																		+ '/images/flag/attachment.png"/>&nbsp;&nbsp;'
																		+ fnames[i]
																		+ '&nbsp;&nbsp;<a href="javascript:deleteAttach('
																		+ fids[i]
																		+ ')" >删除</a>'
															}));
										}
										display.doLayout(true);
									}								
											
									form.findField("receiverNames").setValue('');
								},
								failure : function(form, action) {
								}
							});
		}
	}

	return formPanel;

};

/**
 * 
 * @return {}
 */
OutMailForm.prototype.initToolbar = function() {

	var toolbar = new Ext.Toolbar( {
		width : '100%',
		height : 30,
		items : [ {
			text : '立即发送',
			iconCls : 'btn-mail_send',
			handler : function() {
				var outMailForm = Ext.getCmp('OutMailForm');

				outMailForm.getForm().submit( {
					waitMsg : '正在发送邮件,请稍候...',
					timeout:120000,
					success : function(outMailForm, o) {
						Ext.Msg.confirm('操作信息', '邮件发送成功！继续发邮件?', function(btn) {
							if (btn == 'yes') {
								var outMailForm = Ext.getCmp('OutMailForm');
								outMailForm.getForm().reset();
							} else {
								var tabs = Ext.getCmp('centerTabPanel');
								tabs.remove('OutMailForm');
							}
						});
					},
					failure : function(mailform, o) {
						if (o.result != null && o.result != undefined) {
							Ext.ux.Toast.msg('错误信息', o.result.msg);
						}
					}
				});
			}

		}, {
			text : '存草稿',
			iconCls : 'btn-mail_save',
			handler : function() {
				var mailform = Ext.getCmp('OutMailForm');

				mailform.getForm().findField("opt").setValue("attach");

				mailform.getForm().submit( {
					waitMsg : '正在保存草稿,请稍候...',

					success : function(mailform, o) {
						Ext.Msg.confirm('操作信息', '草稿保存成功！继续发邮件?', function(btn) {
							if (btn == 'yes') {
								var mailform = Ext.getCmp('OutMailForm');
								mailform.getForm().reset();
							} else {
								var tabs = Ext.getCmp('centerTabPanel');
								tabs.remove('OutMailForm');
							}
						});
					},
					failure : function(mailform, o) {
						if (o.result != null && o.result != undefined) {
							Ext.ux.Toast.msg('错误信息', o.result.msg);
						}
					}
				})
			}
		}, {
			text : '重置',
			iconCls : 'reset',
			handler : function() {
				var mailForm = Ext.getCmp('OutMailForm');
				mailForm.getForm().reset();
			}
		}, {
			text : '取消',
			iconCls : 'btn-mail_remove',
			handler : function() {
				var tabs = Ext.getCmp('centerTabPanel');
				tabs.remove('OutMailForm');
			}
		} ]
	});
	return toolbar;
};
/**
 * 增加抄送控件
 * 
 * @return {}
 */
function copyFieldItems() {
	var items = [ {
		xtype : 'label',
		text : '抄送人:',
		style : 'padding-left:0px;padding-top:3px;',
		width : 61
	}, {
		width : 350,
		fieldLabel : '抄送人姓名列表',
		name : 'outMail.cCNames',
		value : '',
		id : 'cCNames',
		emptyText : '',
		readOnly : false
	}, {
		xtype : 'button',
		text : '选择抄送人',
		iconCls : 'btn-mail_recipient',
		handler : function() {
			EMailSelector.getView(function(fullnames) {

				var cCNames = Ext.getCmp('cCNames')

				cCNames.setValue(fullnames);
			}).show();
		}
	}, {
		xtype : 'button',
		text : '取消抄送',
		iconCls : 'btn-delete_copy',
		handler : function() {// 取消抄送时设置为空
			var ccField = Ext.getCmp('ccField');
			var mailForm = Ext.getCmp('OutMailForm');
			Ext.getCmp('cCNames').setValue('');
			mailForm.getForm().findField('cCAddresses').setValue('');
			ccField.hide();
		}
	} ];
	return items;
}
/**
 * 附件上传,可多附件
 * 
 * @param {}
 *            data
 */
function outMailUploadMailAttach(data) {
	// var ids = null
	var fileIds = Ext.getCmp('fileIds');
	var fileNames = Ext.getCmp('fileNames');
	var display = Ext.getCmp('outMailFileNames.display');
	var outmail_placeholder = Ext.getCmp('outmail_placeholder');
	if (outmail_placeholder != null) {// 隐藏点位符
		outmail_placeholder.hide();
	}
	for ( var i = 0; i < data.length; i++) {
		if (fileIds.getValue() != '') {
			fileIds.setValue(fileIds.getValue() + ',');
			fileNames.setValue(fileNames.getValue() + ',');
		}
		fileIds.setValue(fileIds.getValue() + data[i].fileId);
		fileNames.setValue(fileNames.getValue() + data[i].filename)
		display.add(new Ext.form.FieldSet( {// 显示附件
					id : 'outMailAttachDisplay' + data[i].fileId,
					columnWidth : 1,
					html : '<img src="' + __ctxPath
							+ '/images/flag/attachment.png"/>&nbsp;&nbsp;'
							+ data[i].filename
							+ '&nbsp;&nbsp;<a href="javascript:deleteAttach('
							+ data[i].fileId + ')">删除</a>'
				}));
	}
	display.doLayout(true);
}

/*
 * 附件删除
 */
function deleteAttach(_fileId) {
	
	// 删除隐藏域中的附件信息
	var fids = Ext.getCmp('fileIds').value.split(',');
	var fnames = Ext.getCmp('fileNames').value.split(',');
	var fileIds = '';
	var fileNames = '';
	for ( var i = 0; i < fids.length; i++) {
		if (fids[i] != _fileId) {
			fileIds += fids[i] + ','
			fileNames += fnames[i] + ','
		}
	}
	if (fileIds != '') {
		fileIds = fileIds.substring(0, fileIds.length - 1)
		fileNames = fileNames.substring(0, fileNames.length - 1)
	}
	Ext.getCmp('fileIds').setValue(fileIds);
	Ext.getCmp('fileNames').setValue(fileNames);

	var display = Ext.getCmp('outMailFileNames.display')
	var deleteField = Ext.getCmp('outMailAttachDisplay' + _fileId);
	display.remove(deleteField);// 删除附件显示

	if (Ext.getCmp('fileIds').value == '') {// 假如没有附件，则显示占位行
		Ext.getCmp('outmail_placeholder').show();
	}
	display.doLayout(true);

	var _mailId = Ext.getCmp('mailId').value;

	if (_mailId != '' && _mailId != undefined) {// 假如是草稿,则存草稿
		Ext.Ajax.request( {
			url : __ctxPath + '/communicate/attachOutMail_.do',
			method : 'post',
			params : {
				mailId : _mailId,
				fileId : _fileId,
				fileIds : fileIds,
				fileNames : fileNames
			},
			success : function() {

			}
		})
	} else {// 新邮件的时候

		Ext.Ajax.request( {
			url : __ctxPath + '/system/multiDelFileAttach.do',
			params : {
				ids : _fileId
			},
			method : 'post',
			success : function() {
				Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
			}
		})
	}
}

/**
 * 
 * @param address
 * @param name
 * @return 将字附串组成 "xx"<xxx@xx.com>;"aa"<aa@aa.com>;形式返回
 */

function getStrToEmail(address, name) {
	var emailStr = "";
	if (address == null || address=='null')
		address = "";
	if (name == null || name=='null')
		name = "";
	if(address.length>1){
		var a = address.split(",");
		var n = name.split(",");
		if (a != null && a.length > 0) {
			if (n != null && n.length > 0) {
				for ( var i = 0; i < a.length; i++) {
					if (n.length >= i) {
						emailStr += "" + n[i].replace("\"", "") + "" + "<" + a[i]
								+ ">" + ";";
					} else {
						emailStr += "" + a[i] + "" + "<" + a[i] + ">" + ";";
					}
				}
			} else {
				for ( var i = 0; i < a.length; i++) {
	
					emailStr += "" + a[i] + "" + "<" + a[i] + ">" + ";";
	
				}
			}
	
		}
	}

	return emailStr;
}