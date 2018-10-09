var OfficeMeetingEdit = function(archiveId,defId,isshow,callback) {
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
			id:'OfficeMeetingEditfp',
			layout : 'form',
			labelWidth : 140,
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
						}, {
							name : 'archives.handlerUnames',
							mapping : 'handlerUnames'
						},{
							name : 'archives.enclosure',
							mapping : 'enclosure'
						},{
							name : 'archives.unPublicReasons',
							mapping : 'unPublicReasons'
						},{
							name : 'archives.isShared',
							mapping : 'isShared'
						}]),
			items : [{
						xtype : 'textfield',
						fieldLabel : '提案名称',
						name : 'archives.subject',
						width:475,
						allowBlank : false
					},{
						xtype : 'container',
						layout : 'column',
						style : 'padding:0px 0px 4px 0px',
						defaults : {
							allowBlank : true,
							border : false
						},
						items : [{
									xtype : 'label',
									text : '提案背景以及主要内容：',
									width : 140
								}, {
									xtype : 'textarea',
									name : 'archives.shortContent',
									width : 475,
									height : 50,
									style : 'margin-left:5px'
								}]
						},{
							xtype : 'container',
							layout : 'column',
							style : 'padding:0px 0px 4px 0px',
							defaults : {
								allowBlank : true,
								border : false
							},
							items : [{
										xtype : 'label',
										text : '提案建议事项：',
										width : 140
									}, {
										xtype : 'textarea',
										name : 'archives.enclosure',
										width : 475,
										height : 50,
										style : 'margin-left:5px'
									}]
						},{
							xtype : 'container',
							style : 'padding-left:0px;margin-bottom:4px;',
							id : 'depContainer',
							layout : 'column',
							items : [{
										xtype : 'label',
										text : '建议列席处室:',
										width : 140
									}, {
										xtype : 'textfield',
										name : 'archives.handlerUnames',
										id : 'handlerUnames',
										allowBlank : false,
										editable : false,
										readOnly : true,
										width : 480,
										style : 'margin-left:5px'
									}, {
										xtype : 'button',
										iconCls : 'btn-dep-sel',
										text : '选择部门',
										handler : function() {
											DepSelector3.getView(function(id, name) {
												Ext.getCmp('handlerUnames')
														.setValue(name);
												Ext.getCmp('handlerUids')
														.setValue(id);
											}, false).show();
										}
									}]
						},{
							xtype : 'textfield',
							fieldLabel : '提案处室（单位）',
							name : 'archives.issueDep',
							width:475,
							value:curUserInfo.deptName,
							allowBlank : false,
							readOnly: true
						},{
							fieldLabel:"各处室是否达成一致意见",
							labelWidth:130,
							xtype:'radiogroup',
							id:'shareRG',
							width:180,
							items:[{ 
								boxLabel: '否', 
								name: 'archives.isShared', 
								inputValue:'0',
								id:'shared0',
								checked:true,
								listeners : {
	 								'check' : function(checkbox, checked){
										if(checked){//只有在点击时触发
											Ext.getCmp('OfficeMeetingEditForm.unPublicReasons').show();
										}   
									}
								}
							},{ 
								boxLabel: '是', 
								name: 'archives.isShared', 
								id:'shared1',
								inputValue:'1',
								listeners : {
	 								'check' : function(checkbox, checked){
										if(checked){//只有在点击时触发
											Ext.getCmp('OfficeMeetingEditForm.unPublicReasons').hide();
										}   
									}
								}
							}]
					},{
						xtype : 'container',
						style : 'padding-left:0px;margin-bottom:4px;',
						id : 'OfficeMeetingEditForm.unPublicReasons',
						layout : 'column',
						items : [{
									xtype : 'label',
									text : '备注:',
									width : 140
								}, {
									xtype : 'textfield',
									name : 'archives.unPublicReasons',
									id : 'unPublicReasons',
									width : 480,
									style : 'margin-left:5px'
								}]
					},{
						xtype : 'textfield',
						fieldLabel : '议题编号',
						labelWidth:140,
						name : 'archives.urgentLevel',
						width:475,
						allowBlank : false
					},{
						xtype : "combo",
						fieldLabel : "议题期数",
						id : "OfficeMeetingEditForm.keywords",
						hiddenName : 'archives.keywords',
						valueField : 'timesId',
						displayField : 'times',
						editable : false,
						allowBlank : false,
						triggerAction : 'all',
						forceSelection : true,
						width : 475,
						store : new Ext.data.SimpleStore({
								url : __ctxPath + '/meetingTimes/getByTypeMeetingTimes.do?type=1',
								autoLoad : true,
								fields : ['timesId', 'times']
							}),
						listeners : {
							select : function(cbo, record, index) {
								Ext.getCmp('OfficeMeetingEditForm.keywords').setValue(cbo.getValue());
								Ext.getCmp('OfficeMeetingEditForm.privacyLevel').setValue(cbo.getRawValue());
							}
						}
					},{
						name : 'archives.issuerId',
						value : curUserInfo.userId,
						xtype : 'hidden'
					},{
					    name : "archives.issuer",
						value : curUserInfo.fullname,
						xtype : 'hidden'
					},{
						name : 'archives.archivesId',
						xtype : 'hidden'
					},{
						name : 'archives.status',
						xtype : 'hidden',
						value :  1
					},{
						name : 'archives.handlerUids',
						xtype : 'hidden',
						id : 'handlerUids'
					},{
						name : 'archives.archType',
						id : 'archivesArchType',
						xtype : 'hidden'
					},{
						name : 'archives.privacyLevel',
						xtype : 'hidden',
						id : 'OfficeMeetingEditForm.privacyLevel'
					},{
						xtype : "hidden",
						name : "archives.recDepNames",
						id : "ZRBGHYTDJForm.recDepNames"
					},{
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
							},{
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
					var isShared = Ext.decode(action.response.responseText).data[0].isShared;
					if(isShared == '1'){
						var shareRG = Ext.getCmp('shareRG');//一次被选中
						shareRG.setValue(1);
						Ext.getCmp('OfficeMeetingEditForm.unPublicReasons').hide();
					}else{
						Ext.getCmp('OfficeMeetingEditForm.unPublicReasons').show();
					}
					
					Ext.getCmp('OfficeMeetingEditForm.keywords').getStore().load({
				    	callback : function () {
				    		Ext.getCmp('OfficeMeetingEditForm.keywords').setValue(Ext.decode(action.response.responseText).data[0].keywords);
				    	},
				    	scope : Ext.getCmp('OfficeMeetingEditForm.keywords').getStore(),
				    	add : false
				    });
					
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
				
			});
		} 


	var window = new Ext.Window({
				id : 'ReceiveArchivesEdit',
				iconCls : 'menu-archive-draft',
				title : "主任办公会",
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
						var fp = Ext.getCmp('OfficeMeetingEditfp');
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
									}else {
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