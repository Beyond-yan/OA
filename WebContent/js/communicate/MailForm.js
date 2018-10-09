var MailForm = function(mailId, boxId, opt) {
	return this.setup(mailId, boxId, opt);
};

MailForm.prototype.setup = function(mailId, boxId, opt) {
	var toolbar = this.initToolbar();
	var copyFieldItem = new copyFieldItems();
	
	var reader=new Ext.data.JsonReader({
					root : 'data'
				}, [{
							name : 'mail.recipientIDs',
							mapping : 'recipientIDs'
						}, {
							name : 'mail.copyToIDs',
							mapping : 'copyToIDs'
						}, {
							name : 'mail.mailStatus',
							mapping : 'mailStatus'
						}, {
							name : 'mail.fileIds',
							mapping : 'fileIds'
						}, {
							name : 'mail.mailId',
							mapping : 'mailId'
						}, {
							name : 'mail.recipientNames',
							mapping : 'recipientNames'
						}, {
							name : 'mail.subject',
							mapping : 'subject'
						}, {
							name : 'mailImportantFlag',
							mapping : 'importantFlag'
						}, {
							name : 'mail.filenames',
							mapping : 'filenames'
						}, {
							name : 'mail.content',
							mapping : 'content'
						}, {
							name : 'mail.copyToNames',
							mapping : 'copyToNames'
						}]);
	
				var formPanel = new Ext.FormPanel({
					url : __ctxPath + '/communicate/saveMail.do',
					id:'mailFormPanel',
					border:false,
					width:680,
					reader : reader,
					layout:'form',
					defaults:{
						anchor:'100%,100%'
					},
					items : [
					{
						name : 'mail.recipientIDs',
						id : 'mail.recipientIDs',
						xtype : 'hidden'
					}, {
						name : 'mail.copyToIDs',
						id : 'mail.copyToIDs',
						xtype : 'hidden'
					}, {
						name : 'mail.mailStatus',
						id : 'mail.mailStatus',
						xtype : 'hidden',
						value : 1
					}, {
						name : 'mail.fileIds',
						xtype : 'hidden',
						id : 'mail.fileIds'
					}, {
						fieldLabel : 'BOXID',
						name : 'boxId',
						xtype : 'hidden',
						id : 'mailBoxId'
					}, {
						fieldLabel : 'MailId',
						name : 'mail.mailId',
						xtype : 'hidden',
						id : 'mail.mailId'
					}, {
						name : 'replyBoxId',
						xtype : 'hidden',
						id : 'mail.replyBoxId'
					}, {
						name : 'mail.filenames',
						xtype : 'hidden',
						id : 'mail.filenames'
					},
					// ------------------------------------------ hidden end

							{
								fieldLabel : '主题',
								xtype:'textfield',
								name : 'mail.subject',
								id : 'mail.subject',
								allowBlank:false,
								width:530,
								blankText : '邮件主题为必填'
							},
							{
								fieldLabel:'发件人',
								anchor:'50%',
								xtype:'combo',
								triggerAction:'all',
								editable:false,
								value:curUserInfo.fullname,
								displayField:'grantFullname',
								valueField:'grantUId',
								hiddenName:'senderId',
								store:new Ext.data.JsonStore({
									autoLoad:true,
									root : 'result',
									url:__ctxPath+'/system/agentAppUser.do?isCombo=true&userId='+curUserInfo.userId,
									fields:[
										'grantUId',
										'grantFullname'
									]
								})
							},
							{
								xtype:'compositefield',
								fieldLabel : '收件人',
								items:[
									{
										xtype:'textfield',
										name : 'mail.recipientNames',
										id : 'mail.recipientNames',
										allowBlank:false,
										blankText : '请选择收件人',
										width:320,
										readOnly : true
									},{
										xtype:'button',
										text : '选择收件人',
										iconCls : 'btn-mail_recipient',
										handler : function() {
											UserSelector.getView(
													function(userIds, fullnames) {
														var recipientIDs = Ext.getCmp('mail.recipientIDs');
														var recipientNames = Ext.getCmp('mail.recipientNames');
														recipientIDs.setValue(userIds);
														recipientNames.setValue(fullnames);
													}).show();
										}
									},{
											xtype : 'button',
											text : '我要抄送',
											iconCls : 'btn-mail_copy',
											handler : function() {
												var copyField = Ext.getCmp('copyField');
												copyField.show();
											}
									}
									
								]
							},
							{
								xtype : 'container',// 抄送人container
								id : 'copyField',
								layout : 'hbox',
								height:32,
								hidden : true,
								defaultType : 'textfield',
								items : [copyFieldItem]
							}, {
								xtype : 'compositefield',
								fieldLabel:'优先级',
								items : [{
											width : 250,
											hiddenName : 'mail.importantFlag',
											id : 'mailImportantFlag',
											xtype : 'combo',
											mode : 'local',
											editable : false,
											value : '1',
											triggerAction : 'all',
											store : [['1', '一般'], ['2', '重要'],
													['3', '非常重要']]
										}, {
											xtype : 'checkbox',
											name : 'sendMessage',
											boxLabel : '告诉他有信'
										}]
							}, {
								xtype : 'container',
								layout : 'hbox',
								autoHeight:true,
								defaultType : 'textfield',
								items : [{
											xtype : 'label',
											text : '附件:',
											width : 105
										}, {
											xtype : 'panel',
											width : 355,
											layout : 'column',
											name : 'filenames.display',
											defaults:{border:false},
											id : 'filenames.display',
											items : [
												{xtype:'label',height:40,id:'placeholder'}
											]
										}, {
											xtype : 'button',
											text : '上传',
											iconCls : 'btn-upload',
											handler : function() {
												var dialog = App.createUploadDialog({
															file_cat : 'communicate/mail',
															callback : uploadMailAttach
														});
												dialog.show();
											}
										}]
							}, {
								fieldLabel : '内容',
								name : 'mail.content',
								id : 'mail.content',
								xtype : 'htmleditor'
							}

					]
			// form items
	});
	if (mailId != null && mailId != 'undefined') {
		var _mailId = Ext.getCmp('mail.mailId');
		_mailId.setValue(mailId);
		if (opt == 'draft') {// 重载草稿
			formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/communicate/getMail.do',
				method : 'post',
				params : {
					mailId : mailId,
					folderId : 3,
					boxId : boxId
				},
				waitMsg : '正在载入数据...',
				success : function(form, action) {
					var copyToIDs = Ext.getCmp('mail.copyToIDs');
					if (copyToIDs.value != '') {// 假如草稿有抄送人,激活抄送人控件
						var copyField = Ext.getCmp('copyField');
						copyField.show();
					}

					var filenames = Ext.getCmp('mail.filenames').value;
					if (filenames != '') {
						var display = Ext.getCmp('filenames.display');
						var placeholder = Ext.getCmp('placeholder');
						if (placeholder != null) {// 载入草稿并有附件时,点位行隐藏
							placeholder.hide();
						}
						var fnames = filenames.split(',');
						var fids = Ext.getCmp('mail.fileIds').value.split(',');
						for (var i = 0; i < fnames.length; i++) {// 显示附件
							display.add(new Ext.form.FieldSet({
								border:false,
								frame:false,
								id : 'mailAttachDisplay' + fids[i],
								columnWidth : .5,
								html : '<img src="'+ __ctxPath+ '/images/flag/attachment.png"/>&nbsp;&nbsp;'+ fnames[i]+ '&nbsp;&nbsp;<a href="javascript:deleteAttach('+ fids[i] + ')" >删除</a>'
							}));
						}
						display.doLayout(true);
					}
				},
				failure : function(form, action) {

				}
			});
		} else if (opt == 'reply') {// 回复
			formPanel.getForm().load({
						deferredRender : false,
						url : __ctxPath + '/communicate/optMail.do',
						method : 'post',
						params : {
							mailId : mailId,
							boxId : boxId,
							opt : '回复'
						},
						waitMsg : '正在载入数据...',
						success : function(form, action) {
							Ext.getCmp('mail.replyBoxId').setValue(boxId);
						},
						failure : function(form, action) {
						}
					});
		} else if (opt == 'forward') {
			formPanel.getForm().load({
						deferredRender : false,
						url : __ctxPath + '/communicate/optMail.do',
						method : 'post',
						params : {
							mailId : mailId,
							opt : '转发'
						},
						waitMsg : '正在载入数据...',
						success : function(form, action) {
						},
						failure : function(form, action) {
						}
					});
		}
	}
	if (boxId != null && boxId != 'undefined') {
		var mailBoxId = Ext.getCmp('mailBoxId');
		mailBoxId.setValue(boxId);
	}
	
	var mailFormPanel=new Ext.Panel({
					title : '发送邮件',
					iconCls : 'menu-mail_send',
					autoScroll:true,
					tbar : toolbar,
					id:'MailForm',
					layout:'hbox',
					margins:'0 0 6 0',
					layoutConfig: {
                                    padding:'5',
                                    pack:'center',
                                    align:'middle'
                                },
                    defaults:{margins:'0 5 0 0'},
                    items:[formPanel]
	});
	
	return mailFormPanel;

};

/**
 * 
 * @return {}
 */
MailForm.prototype.initToolbar = function() {

	var toolbar = new Ext.Toolbar({
		height : 30,
		items : [{
			text : '立即发送',
			iconCls : 'btn-mail_send',
			handler : function() {
				var mailform = Ext.getCmp('mailFormPanel');
				var mailStatus = Ext.getCmp('mail.mailStatus');
				if(mailform.getForm().isValid()){
					mailStatus.setValue(1);
					mailform.getForm().submit({
						waitMsg : '正在发送邮件,请稍候...',
						success : function(mailform, o) {
							Ext.Msg.confirm('操作信息', '邮件发送成功！继续发邮件?', function(btn) {
										if (btn == 'yes') {
											mailform.getForm().reset();
										} else {
											var tabs = Ext.getCmp('centerTabPanel');
											tabs.remove('MailForm');
										}
									});
						},
						failure : function(mailform, o) {
							Ext.ux.Toast.msg('错误信息', o.result.msg);
						}
					});
				}
			}

		}, {
			text : '存草稿',
			iconCls : 'btn-mail_save',
			handler : function() {
				var mailStatus = Ext.getCmp('mail.mailStatus');
				mailStatus.setValue(0);
				var mailform = Ext.getCmp('mailFormPanel');
				if(mailform.getForm().isValid()){
					mailform.getForm().submit({
						waitMsg : '正在保存草稿,请稍候...',
						success : function(mailform, o) {
							Ext.Msg.confirm('操作信息', '草稿保存成功！继续发邮件?', function(btn) {
										if (btn == 'yes') {
											mailform.getForm().reset();
										} else {
											var tabs = Ext.getCmp('centerTabPanel');
											tabs.remove('MailForm');
										}
									});
						},
						failure : function(mailform, o) {
							Ext.ux.Toast.msg('错误信息', o.result.msg);
						}
					})
				}
			}
		}, {
			text : '重置',
			iconCls : 'reset',
			handler : function() {
				var mailForm = Ext.getCmp('MailFormPanel');
				mailForm.getForm().reset();
			}
		}, {
			text : '取消',
			iconCls : 'btn-mail_remove',
			handler : function() {
				var tabs = Ext.getCmp('centerTabPanel');
				tabs.remove('MailForm');
			}
		}]
	});
	return toolbar;
};
/**
 * 增加抄送控件
 * 
 * @return {}
 */
function copyFieldItems() {
	var items = [{
				xtype : 'label',
				text : '抄送人:',
				style : 'padding-left:0px;padding-top:3px;',
				width : 105
			},{
				width : 320,
				fieldLabel : '抄送人姓名列表',
				name : 'mail.copyToNames',
				id : 'mail.copyToNames',
				emptyText : '请选择抄送人',
				readOnly : true
			}, {
				xtype : 'button',
				text : '选择抄送人',
				iconCls : 'btn-mail_recipient',
				handler : function() {
					UserSelector.getView(function(userIds, fullnames) {
								var copyToIDs = Ext.getCmp('mail.copyToIDs');
								var copyToNames = Ext
										.getCmp('mail.copyToNames')
								copyToIDs.setValue(userIds);
								copyToNames.setValue(fullnames);
							}).show();
				}
			}, {
				xtype : 'button',
				text : '取消抄送',
				iconCls : 'btn-delete_copy',
				handler : function() {// 取消抄送时设置为空
					var copyField = Ext.getCmp('copyField');
					var mailForm = Ext.getCmp('mailFormPanel');
					mailForm.getForm().findField('mail.copyToIDs').setValue('');
					mailForm.getForm().findField('mail.copyToNames').setValue('');
					copyField.hide();
				}
			}];
	return items;
}
/**
 * 附件上传,可多附件
 * 
 * @param {}
 *            data
 */
function uploadMailAttach(data) {
	// var ids = null
	var fileIds = Ext.getCmp('mail.fileIds');
	var filenames = Ext.getCmp('mail.filenames');
	var display = Ext.getCmp('filenames.display');
	var placeholder = Ext.getCmp('placeholder');
	if (placeholder != null) {// 隐藏点位符
		placeholder.hide();
	}
	for (var i = 0; i < data.length; i++) {
		if (fileIds.getValue() != '') {
			fileIds.setValue(fileIds.getValue() + ',');
			filenames.setValue(filenames.getValue() + ',');
		}
		fileIds.setValue(fileIds.getValue() + data[i].fileId);
		filenames.setValue(filenames.getValue() + data[i].filename)
		display.add(new Ext.form.FieldSet({// 显示附件
			id : 'mailAttachDisplay' + data[i].fileId,
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
	// alert('_fileId'+_fileId);
	// 删除隐藏域中的附件信息
	var fids = Ext.getCmp('mail.fileIds').value.split(',');
	var fnames = Ext.getCmp('mail.filenames').value.split(',');
	var fileIds = '';
	var filenames = '';
	for (var i = 0; i < fids.length; i++) {
		if (fids[i] != _fileId) {
			fileIds += fids[i] + ','
			filenames += fnames[i] + ','
		}
	}
	if (fileIds != '') {
		fileIds = fileIds.substring(0, fileIds.length - 1)
		filenames = filenames.substring(0, filenames.length - 1)
	}
	Ext.getCmp('mail.fileIds').setValue(fileIds);
	Ext.getCmp('mail.filenames').setValue(filenames);

	var display = Ext.getCmp('filenames.display')
	var deleteField = Ext.getCmp('mailAttachDisplay' + _fileId);
	display.remove(deleteField);// 删除附件显示

	if (Ext.getCmp('mail.fileIds').value == '') {// 假如没有附件，则显示占位行
		Ext.getCmp('placeholder').show();
	}
	display.doLayout(true);

	var _mailId = Ext.getCmp('mail.mailId').value;
	if (_mailId != '' && _mailId != 'undefined') {// 假如是草稿,则存草稿
		Ext.Ajax.request({
			url : __ctxPath + '/communicate/attachMail.do',
			method : 'post',
			params : {
				mailId : _mailId,
				fileId : _fileId,
				fileIds : fileIds,
				filenames : filenames
			},
			success : function() {
			}
		})
	} else {// 新邮件的时候
		Ext.Ajax.request({
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
