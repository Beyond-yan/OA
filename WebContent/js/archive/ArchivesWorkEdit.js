var ArchivesWorkEdit = function(archiveId,proName,defId,isshow,callback) {
	this.archiveId=archiveId;
	this.isshow=isshow; 
	// 初始化附件文档
	   /* this.docGridPanel = new ArchivesUtil({
			panelId : 'ReceiveArchivesEdit',
			archivesId : this.archivesId
		}).getGridPanelWithFullTools();*/
	var formPanel = new Ext.FormPanel({
			url : __ctxPath + '/archive/saveArchives.do',
			frame : false,
			border : false,
			id:'ArchivesWorkEditfp',
			layout : 'form',
			labelWidth : 80,
			width : 740,
			padding : '5px',
			reader : new Ext.data.JsonReader({
						root : 'data'
					}, [{
							name : 'archives.archivesId',
							mapping : 'archivesId'
						},{
							   name:'archives.archivesNo',
							   mapping:'archivesNo'		
							}, {
							name : 'archives.issueDate',
							mapping : 'issueDate'
						}, {
							name : 'archives.depSignNo',
							mapping : 'depSignNo'
						}, {
							name : 'archives.writtenDate',
							mapping : 'writtenDate'
						}, {
							name : 'archives.issueDep',
							mapping : 'issueDep'
						}, {
						    name:'archives.status',
						    mapping:'status'
						}, {
							name : 'archives.subject',
							mapping : 'subject'
						}, {
							name : 'archives.fileCounts',
							mapping : 'fileCounts'
						}, {
							name : 'archives.privacyLevel',
							mapping : 'privacyLevel'
						}, {
							name : 'archives.urgentLevel',
							mapping : 'urgentLevel'
						}, {
							name : 'archives.issuer',
							mapping : 'issuer'
						}, {
							name : 'archives.issuerId',
							mapping : 'issuerId'
						}, {
							name:'archives.orgDepName',
							mapping:'orgDepName'
						}, {
							name:'archives.archType',
							mapping:'archType'
						}, {
							name:'archives.archPrinter',
							mapping:'archPrinter'
						}, {
							name:'archives.archChecker',
							mapping:'archChecker'
						}, {
							name:'archives.orgDepId',
							mapping:'orgDepId'
						}, {
							name:'archives.archivesFiles',
							mapping:'archivesFiles'
						}, {
							name:'archives.limitedDate',
							mapping:'limitedDate'
						}, {
							name:'archives.sources',
							mapping:'sources'
						}, {
							name:'archives.shortContent',
							mapping:'shortContent'
						}]),
			items : [{
						border : false,
						layout : 'column',
						defaults : {
							border : false,
							columnWidth : .3,
							layout : 'form',
							defaults : {
								width : 120,
								xtype : 'textfield',
								allowBlank : false
							}
						},
						items:[{
								columnWidth:.39,
								items:[{
									xtype : 'textfield',
									fieldLabel : '来文号',
									name : 'archives.depSignNo',
									allowBlank : true,
									width:180
								},{
									fieldLabel : '限办时间',	
									name : 'archives.limitedDate',
									xtype : 'datetimefield',
									format : 'Y-m-d H:i:s',
									id : 'archivesRceciveEdit.limitedDate',
									editable : false,
									allowBlank : false,
									width:180
								
								}]
						},{
							items:[{ 
							    fieldLabel : '收文日期',
							    name : 'archives.writtenDate',
								xtype : 'datefield',
								format : 'Y-m-d',
								editable : false,
								allowBlank : true
							}]
						},{
							items:[{
								xtype : 'combo',
								fieldLabel : '紧急程度',
								name : 'archives.urgentLevel',
								triggerAction : 'all',
								editable : false,
								allowBlank : true,
								store : ['特急', '急件', '加急','平急']
							}]
						}]
					}, {
						xtype : 'textfield',
						fieldLabel : '来文单位',
						name : 'archives.issueDep',
						width:640,
						allowBlank : false
					},{
						xtype : 'textfield',
						fieldLabel : '标题',
						name : 'archives.subject',
						width:640,
						allowBlank : false
					} ,{
						name : 'userId',
						id : 'ArchivesWorkEditForm.userId',
						xtype : 'hidden'
					}, {
						name : 'archives.status',
						xtype : 'hidden',
						value :  1
					},{
					    name : "archives.issuer",
						value : curUserInfo.fullname,
						xtype : 'hidden'
					}, {
						name : 'archives.snConfigId',
						id : 'ArchivesWorkEditForm.snConfigId',
						xtype : 'hidden'
					}, {
						name : 'archives.issuerId',
						value : curUserInfo.userId,
						xtype : 'hidden'
					}, {
				layout : 'column',
				id:'ReceiveArchivesEditDocFiles.person',
				hidden:true,
				border : false,
				defaults : {
					layout : 'form',
					border : false
				},
				items : [{
						columnWidth : .85,
						items : [{
									fieldLabel : '公文正文',
									xtype : 'panel',
									id : 'ReceiveArchivesEditDocFiles.personFilePanel',
									frame : false,
									border : true,
									bodyStyle : 'padding:4px 4px 4px 4px;',
									height : 80,
									autoScroll : true,
									html : ''
								}]
					}, {
						columnWidth : .12,
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
										var fileIds = Ext.getCmp('ReceiveArchivesEdit.docfileIds');
										var filePanel = Ext.getCmp('ReceiveArchivesEditDocFiles.personFilePanel');

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
																	+ '/images/system/delete.gif" onclick="removeFile(this,\'ReceiveArchivesEdit.docfileIds\','
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
								var fileAttaches = Ext.getCmp('ReceiveArchivesEdit.docfileIds');
								var filePanel = Ext.getCmp('ReceiveArchivesEditDocFiles.personFilePanel');

								filePanel.body.update('');
								fileAttaches.setValue('');
							}
						}, {
							xtype : 'hidden',
							id : 'ReceiveArchivesEdit.docfileIds'
						}]
					}]
			},{
				layout : 'column',
				border : false,
				defaults : {
					layout : 'form',
					border : false
				},
				items : [{
							columnWidth : .85,
							items : [{
										fieldLabel : '公文附件',
										xtype : 'panel',
										id : 'ReceiveArchivesEditReFiles.personFilePanel',
										frame : false,
										border : true,
										bodyStyle : 'padding:4px 4px 4px 4px;',
										height : 100,
										autoScroll : true,
										html : ''
									}]
						}, {
							columnWidth : .12,
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
											var fileIds = Ext.getCmp('ReceiveArchivesEdit.fileIds');
											var filePanel = Ext.getCmp('ReceiveArchivesEditReFiles.personFilePanel');

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
																		+ '/images/system/delete.gif" onclick="removeFile(this,\'ReceiveArchivesEdit.fileIds\','
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
									var fileAttaches = Ext.getCmp('ReceiveArchivesEdit.fileIds');
									var filePanel = Ext.getCmp('ReceiveArchivesEditReFiles.personFilePanel');

									filePanel.body.update('');
									fileAttaches.setValue('');
								}
							}, {
								xtype : 'hidden',
								id : 'ReceiveArchivesEdit.fileIds',
								name : 'fileIds'
							},{
								xtype:'hidden',
								id:'ReceiveArchivesEdit.reFileId'
							},{
								xtype:'hidden',
								name:'archives.archivesId'
							}]
						}]
			}]
		});
    if (this.archiveId != null && this.archiveId != 'undefined') {
    	if(isshow==1)
    		Ext.getCmp('ReceiveArchivesEditDocFiles.person').hidden=false
    	var archiveId=this.archiveId;
			formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/archive/getArchDataArchives.do?archivesId='
						+ this.archiveId,
				waitMsg : '正在载入数据...',
				method:'post',
				success : function(form, action) {
					var filePanel = Ext.getCmp('ReceiveArchivesEditReFiles.personFilePanel');
					var fileIds = Ext.getCmp("ReceiveArchivesEdit.fileIds");
					var docfilePanel = Ext.getCmp('ReceiveArchivesEditDocFiles.personFilePanel');
					var docFileIds=Ext.getCmp('ReceiveArchivesEdit.docfileIds');
					/*Ext.Ajax.request({
									url : __ctxPath + '/archive/getAttachFilesArchives.do',
									params : {
										'fileIds' : fIds
									},
									method:'post',
									success : function(response, options) {*/
										var af=Ext.decode(action.response.responseText).data[0].archivesFiles;
										if(af!=null){
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
																	+ '/images/system/delete.gif" onclick="removeFile(this,\'ReceiveArchivesEdit.fileIds\','
																	+ af[i].fileId
																	+ ')"/>&nbsp;|&nbsp;</span>');
										}
									}
								var docfile=Ext.decode(action.response.responseText).data[0].archivesDocs;
										if(docfile!=null){
										for (var i = 0; i < docfile.length; i++) {
											if (docFileIds.getValue() != '') {
												docFileIds.setValue(docFileIds.getValue() + ',');
											}
											docFileIds.setValue(docFileIds.getValue() + docfile[i].fileAttach.fileId);
											Ext.DomHelper
													.append(
															docfilePanel.body,
															'<span><a href="#" onclick="FileAttachDetail.show('
																	+ docfile[i].fileAttach.fileId
																	+ ')">'
																	+ docfile[i].fileAttach.fileName
																	+ '</a><img class="img-delete" src="'
																	+ __ctxPath
																	+ '/images/system/delete.gif" onclick="removeFile(this,\'ReceiveArchivesEdit.docfileIds\','
																	+ docfile[i].fileAttach.fileId
																	+ ')"/>&nbsp;|&nbsp;</span>');
										}
									}
									}
						//});
				
			});
		} 


	var window = new Ext.Window({
				id : 'ReceiveArchivesEdit',
				iconCls : 'menu-archive-draft',
				title : proName,
				width : 775,
				height : 470,
				autoScroll:true,
				modal : true,
				layout : 'form',
				buttonAlign : 'center',
				items : [formPanel],
				buttons : [{
					text : '保存',
					id:'save',
					iconCls : 'btn-save',
					handler : function() {
		var fp = Ext.getCmp('ArchivesWorkEditfp');
		//var panel=fp.getStore();alert(panel);
		var fileIds = Ext.getCmp('ReceiveArchivesEdit.fileIds').getValue();
		if (fp.getForm().isValid()) {	
			
			fp.getForm().submit({
				method : 'POST',
				waitMsg : '正在提交数据...',
				success : function(fp, action) {
					if(isshow==1){
					Ext.Ajax.request({
								url : __ctxPath + "/archive/updateArchDocsArchives.do",
								params : {
										  arcRecfileIds : Ext.getCmp('ReceiveArchivesEdit.docfileIds').getValue(),
										  'archives.archivesId':archiveId
										  },
								method : 'POST',
								success : function(fp, action) {
								Ext.ux.Toast.msg('操作信息', '成功保存！');
								if (callback != null) {
									callback.call(this);
								}
								window.close();
								},
								failure : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
								}
							});
					}
							else {
								Ext.ux.Toast.msg('操作信息', '成功保存！');
								if (callback != null) {
									callback.call(this);
								}
								window.close();
							}       
							},
				failure : function(fp, action) {
					Ext.MessageBox.show({
								title : '操作信息',
								msg : '信息保存出错，请联系管理员！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}

	}
				}, {
					text : '关闭',
					iconCls : 'btn-cancel',
					handler : function() {
						window.close();
					}
				}]
			});
	window.show();
};