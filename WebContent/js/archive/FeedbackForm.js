var FeedbackForm=function(id,callback,isHis){
	this.id=id;
	this.callback =callback;
	this.isHis = isHis;
	var saveHidden = false;
	var systemDate = document.getElementById('systemDate').value;//获取当前时间
	var newSystemDate = Date.parseDate(systemDate,'Y-m-d h:i:s');
	if(2 == callback){
		saveHidden = true;
	}
	var formPanel=new Ext.FormPanel({
		id:'FeedbackForm',
		layout:'form',
		bodyStyle:'padding:4px 4px 4px 4px',
		border:false,
		reader : new Ext.data.JsonReader({
			root : 'data'
		},[{
			name : 'sysDataTransfer.id',
			mapping : 'id'
		}, {
			name : 'sysDataTransfer.rejectMsg',
			mapping : 'rejectMsg'
		}]),
		items:[{
			name : 'sysDataTransfer.id',
			value : id,
			id : 'sysDataTransfer.id',
			xtype : 'hidden'
		},{
			layout : 'column',
			defaults : {
				border : false
			},
			fieldLabel : '错情原因',
			width : 280,
			xtype : 'combo',
			listWidth : 280,
			hiddenName : 'sysDataTransfer.transferType',
			editable : false,
			triggerAction : 'all',
			displayField : 'name',
			valueField : 'id',
			store : new Ext.data.SimpleStore({
				autoLoad : true,
				url : __ctxPath
						+ '/archive/comQuickOdCommonComments.do?Q_ref1_S_EQ=3',
				fields : ['id', 'name']
			})
		},{
			xtype:'textarea',
			allowBlank:false,
			name:'sysDataTransfer.rejectMsg',
			id:'sysDataTransfer.rejectMsg',
			height:100,
			anchor:'98%,98%',
			fieldLabel:'请编辑反馈意见'
		},/*{
				layout : 'column',
				border : false,
				defaults : {
					layout : 'form',
					border : false
				},
				items : [{
							columnWidth : .8,
							items : [{
										fieldLabel : '退文通知单',
										xtype : 'panel',
										id : 'DocumentSentForm.personFilePanel',
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
										file_cat : 'document/'+curUserInfo.ownerSchema,
										judge_size : 'no',
										upload_autostart : true,
										callback : function(data) {
											var fileIds = Ext.getCmp('DocumentSentForm.fileIds');
											var filePanel = Ext.getCmp('DocumentSentForm.personFilePanel');

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
																		+ data[i].fileId + ',' +data[i].id
																		+ ')">'
																		+ data[i].filename
																		+ '</a> <img class="img-delete" src="'
																		+ __ctxPath
																		+ '/images/system/delete.gif" onclick="removeFile(this,\'DocumentSentForm.fileIds\','
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
									var fileAttaches = Ext.getCmp('DocumentSentForm.fileIds');
									var filePanel = Ext.getCmp('DocumentSentForm.personFilePanel');
									var fileAttachesIds = Ext.getCmp('DocumentSentForm.ids');

									filePanel.body.update('');
									fileAttaches.setValue('');
									fileAttachesIds.setValue('');
								}
							}, {
								xtype : 'hidden',
								id : 'DocumentSentForm.fileIds',
								name : 'fileIds'
							}, {
								xtype : 'hidden',
								id : 'DocumentSentForm.ids',
								name : 'ids'
							}]
						}]
			},*/{
				name : 'sysDataTransfer.receiveFlag',
				id : 'sysDataTransfer.receiveFlag',
				value:2,
				xtype : 'hidden'
			},  {
				name : 'sysDataTransfer.receiveUserName',
				id : 'sysDataTransfer.receiveUserName',
				xtype : 'hidden',
				value : curUserInfo.fullname
			},
			{
				name : 'sysDataTransfer.receiveUser',
				id : 'sysDataTransfer.receiveUser',
				xtype : 'hidden',
				value : curUserInfo.username
			}, {
				name : 'sysDataTransfer.receiveDate',
				id : 'sysDataTransfer.receiveDate',
				xtype : 'hidden',
				value : systemDate
			}
		]
	});
	if (id != null && id != 'undefined') {
		if(isHis){
			formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/system/getSysDataTransferHis.do?id=' +id,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});
		}else{
		    formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/system/getSysDataTransfer.do?id=' +id,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});
		}
	}
	var win=new Ext.Window({
		title:'反馈意见',
		height:300,
		iconCls:'btn-archive-save-trace',
		buttonAlign:'center',
		width:500,
		modal:true,
		layout:'fit',
	    items:[formPanel],
		buttons:[{
					text:'确定',
					hidden : saveHidden,
					iconCls:'btn-save',
					handler : function() {
							if (formPanel.getForm().isValid()) {	
								formPanel.getForm().submit({
									url : __ctxPath + '/system/saveRejectAndFileSysDataTransfer.do?limit=10000',
									method : 'post',
									waitMsg : '正在提交数据...',
									success : function(formPanel, action) {
										Ext.ux.Toast.msg('操作信息', '成功保存信息！');
										if (callback != null) {
											callback.call(this);
										}
										win.close();
										Ext.getCmp('ToReceiveArchivesGrid').getStore().reload();
									},
									failure : function(fp, action) {
										Ext.MessageBox.show({
													title : '操作信息',
													msg : '信息保存出错，请联系管理员！',
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-error'
												});
										win.close();
									}
								});
							}
						}
				},{
					text:'关闭',
					iconCls:'btn-close',
					handler:function(){
						win.close();
					}
				}]
	});
	win.show();
};