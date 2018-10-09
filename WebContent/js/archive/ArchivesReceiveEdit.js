var ArchivesReceiveEdit = function(archiveId,proName,defId,isshow,callback) {
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
			id:'ArchivesReceiveEditfp',
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
						}]),
			items : [{
						border : false,
						layout : 'column',
						defaults : {
							border : false,
							columnWidth : .33,
							layout : 'form',
							defaults : {
								width : 150,
								xtype : 'textfield',
								allowBlank : false
							}
						},
						items:[{
								items:[{
								fieldLabel : '收文编号',
								name:'archives.archivesNo'
								},
							   {
								xtype : 'combo',
								fieldLabel : '密級',
								name : 'archives.privacyLevel',
								triggerAction : 'all',
								editable : false,
								allowBlank : true,
								store : ['一般', '秘密', '机密','绝密'],
								listeners: {
									'select':function(combo){
										if(combo.getValue()!='一般'){
											Ext.getCmp('ArchivesReceiveEditPanelCounts').show();
											Ext.getCmp('ArchivesReceiveEditForm.fileCounts').allowBlank = false;
										}else{
											Ext.getCmp('ArchivesReceiveEditPanelCounts').hide();
											Ext.getCmp('ArchivesReceiveEditForm.fileCounts').allowBlank = true;
										}
									}
								}
							},{
								xtype : 'combo',
								width : 150,
								fieldLabel : '文种分类',
								id: 'ArchivesReceiveEditForm.archivesType',
								hiddenName : "archives.archivesType.typeId",
								valueField : 'typeId',
								displayField : 'typeName',
								editable : false,
								allowBlank : true,
								triggerAction : 'all',
								store : new Ext.data.SimpleStore({
											url : __ctxPath
													+ '/archive/comboArchivesType.do',
											autoLoad : true,
											fields : ['typeId', 'typeName']
										})
							}]
						},{
							items:[{
								fieldLabel : '收文日期',
								xtype : 'datefield',
								format : 'Y-m-d',
								editable : false,
								allowBlank : false,
								name : 'archives.issueDate',
								value:new Date()
							},{
								xtype : 'combo',
								fieldLabel : '缓急',
								name : 'archives.urgentLevel',
								triggerAction : 'all',
								editable : false,
								allowBlank : true,
								store : ['特急', '急件', '加急','平急']
							}]
						},{
							items:[{
								xtype : 'textfield',
								fieldLabel : '来文号',
								name : 'archives.depSignNo',
								allowBlank : true
							},{ 
							    fieldLabel : '成文日期',
							    name : 'archives.writtenDate',
								xtype : 'datefield',
								format : 'Y-m-d',
								editable : false,
								allowBlank : true
						}]
					}, {
								xtype : 'container',
								style : 'padding:0px 0px 5px 0px;',
								id : 'ArchivesReceiveEditPanelLimitedDate',
								layout : 'form',
								width : 260,
								hidden : true,
								items : [
									{
									fieldLabel : '限办日期',	
									name : 'archives.limitedDate',
									xtype : 'datefield',
									format : 'Y-m-d',
									id : 'archivesRceciveEdit.limitedDate',
									editable : false,
									allowBlank : true,
									value: new Date().add(Date.MONTH,1)
								
										}]
							} ,{
								xtype : 'container',
								style : 'padding:0px 0px 5px 0px;',
								id : 'ArchivesReceiveEditPanelCounts',
								layout : 'column',
								width : 260,
								hidden : true,
								items : [
									{
										xtype : 'label',
										style:"padding-top:4px;",
										text : '份号:',
										width : 84
									},{
										xtype : 'numberfield',
										editable : false,
										id : 'ArchivesReceiveEditForm.fileCounts',
										mode : 'local',
										name : 'archives.fileCounts',
										width : 155
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
						fieldLabel : '标   题',
						name : 'archives.subject',
						width:640,
						allowBlank : false
					} ,{
						name : 'userId',
						id : 'ArchivesReceiveEditForm.userId',
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
						id : 'ArchivesReceiveEditForm.snConfigId',
						xtype : 'hidden'
					}, {
						name : 'archives.issuerId',
						value : curUserInfo.userId,
						xtype : 'hidden'
					}, {
						xtype : 'container',
						layout : 'column',
						style : 'padding:10px 0px 8px 0px;margin-left:0px;',
						defaults : {
							allowBlank : true,
							border : false
						},
						items : [{
									xtype : 'label',
									text : '附件：',
									width : 84
								}, {
									xtype : 'textarea',
									name : 'archives.enclosure',
									width : '85%',
									id : 'ArchivesReceiveEditForm.enclosure'
								}]
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
			},{
				layout : 'column',
				xtype : 'radiogroup',
				//columns :[.3,.15,.3,.1],
				id:'archives.archPrinters',
				allowBlank : false,
				fieldLabel : '是否办结',
				width : 700,
				items : [{
					boxLabel : '是',
					name : 'archives.archPrinter',
					inputValue : 1
				},{
					boxLabel : '否',
					name : 'archives.archPrinter',
					inputValue : 0,
					checked : true
				}]
			},{
				layout : 'column',
				xtype : 'radiogroup',
				//columns :[.3,.15,.3,.1],
				id:'archives.archCheckers',
				allowBlank : false,
				fieldLabel : '是否需要回复',
				width : 700,
				items : [{
					boxLabel : '是',
					name : 'archives.archChecker',
					inputValue : 1
				},{
					boxLabel : '否',
					name : 'archives.archChecker',
					inputValue : 0,
					checked : true
				}]
			}]
		});
		Ext.Ajax.request({
			url :__ctxPath + '/snconfig/getSigIdFlowSnConfig.do?flowId='+defId,
			method : 'POST',
			success : function(response, options) {
						var signId = Ext.util.JSON.decode(response.responseText).data;
						var signName = Ext.util.JSON.decode(response.responseText).dataName;
						if(signName != '督办件'){
							//Ext.getCmp('archivesReceiveEditArchType').setValue('1');
							Ext.getCmp('ArchivesReceiveEditPanelLimitedDate').hide();
							//Ext.getCmp('archivesRceciveEdit.limitedDate').el.parent().parent().hide();
							Ext.getCmp('archivesRceciveEdit.limitedDate').allowBlank = true;
						}else{
							//Ext.getCmp('archivesReceiveEditArchType').setValue('2');
							Ext.getCmp('ArchivesReceiveEditPanelLimitedDate').show();
							//Ext.getCmp('archivesRceciveEdit.limitedDate').el.parent().parent().show();
							Ext.getCmp('archivesRceciveEdit.limitedDate').allowBlank = false;
						}
			}
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
					var privacyLevel=action.result.data['archives.privacyLevel'];
					var archType=action.result.data['archives.archType'];
					var archPrinter=action.result.data['archives.archPrinter'];
					var archChecker=action.result.data['archives.archChecker'];
					if(archPrinter==1)Ext.getCmp('archives.archPrinters').setValue(1);
					if(archChecker==1)Ext.getCmp('archives.archCheckers').setValue(1);
					if(archType == 2){//督办件未办结
						if(archPrinter!=1){
							Ext.getCmp('archives.archPrinters').show();
							Ext.getCmp('archivesRceciveEdit.limitedDate').allowBlank = false;
						}else{
							Ext.getCmp('ArchivesReceiveEditPanelLimitedDate').hide();
							Ext.getCmp('archivesRceciveEdit.limitedDate').allowBlank = true;
						}
						Ext.getCmp('archives.archPrinters').show();
						Ext.getCmp('archives.archPrinters').getEl().up('.x-form-item').setDisplayed(true);
						Ext.getCmp('archives.archCheckers').show();
						Ext.getCmp('archives.archCheckers').getEl().up('.x-form-item').setDisplayed(true);
					}else{
						Ext.getCmp('ArchivesReceiveEditPanelLimitedDate').hide();
						Ext.getCmp('archivesRceciveEdit.limitedDate').allowBlank = true;
						Ext.getCmp('archives.archPrinters').hide();
						Ext.getCmp('archives.archPrinters').getEl().up('.x-form-item').setDisplayed(false);
						Ext.getCmp('archives.archCheckers').hide();
						Ext.getCmp('archives.archCheckers').getEl().up('.x-form-item').setDisplayed(false);
					}
					Ext.getCmp('ArchivesReceiveEditForm.archivesType').getStore().load({ 
					callback: function () { 
					//等待数据加载完成才进行赋值，不然由于异步会出现先赋值后加载完成。 
					Ext.getCmp('ArchivesReceiveEditForm.archivesType').setValue(Ext.decode(action.response.responseText).data[0].parentArchId);
					}, 
					scope: Ext.getCmp('ArchivesReceiveEditForm.archivesType').getStore(),//表示作用范围 
					add: false //为false表示数据不累加 
					}); 
					/*Ext.getCmp('ZGPartyArchivesReceiveForm.snName').getStore().load({ 
					callback: function () { 
					//等待数据加载完成才进行赋值，不然由于异步会出现先赋值后加载完成。 
					Ext.getCmp('ZGPartyArchivesReceiveForm.snName').setValue(Ext.decode(action.response.responseText).data[0].snConfigId);
					Ext.getCmp('ZGPartyArchivesReceiveForm.snId').setValue(Ext.decode(action.response.responseText).data[0].snConfigId);
					Ext.getCmp('ZGPartyArchivesReceiveForm.snConfigId').setValue(Ext.decode(action.response.responseText).data[0].snConfigId);
					}, 
					scope: Ext.getCmp('ZGPartyArchivesReceiveForm.snName').getStore(),//表示作用范围 
					add: false //为false表示数据不累加 
					}); */
					
					//Ext.getCmp('ZGPartyReceiveArchivesReStart.flowAssignId').setValue(action.result.data['archives.reviewUser']);
					if(privacyLevel!='一般'){
						 Ext.getCmp('ArchivesReceiveEditPanelCounts').show();
						 Ext.getCmp('ArchivesReceiveEditForm.fileCounts').allowBlank = false;
					}
					if(privacyLevel=='一般'){
						Ext.getCmp('ArchivesReceiveEditPanelCounts').hide();
						Ext.getCmp('ArchivesReceiveEditForm.fileCounts').allowBlank = true;
					}
					Ext.getCmp('ArchivesReceiveEditForm.enclosure').setValue(Ext.decode(action.response.responseText).data[0].enclosure);
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
		var fp = Ext.getCmp('ArchivesReceiveEditfp');
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