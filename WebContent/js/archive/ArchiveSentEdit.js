var ArchiveSentEdit=function(archivesId,defName,isshow,callback){
	this.archivesId=archivesId; 
	this.isshow=isshow; 
	// 初始化附件文档
	var formPanel = new Ext.FormPanel({
			url : __ctxPath + '/archive/saveArchives.do',
			frame : false,
			border : false,
			layout : 'form',
			labelWidth : 80,
			width : 800,
			padding : '5px',
			reader : new Ext.data.JsonReader({
						root : 'data'
					}, [	{
								name : 'archives.archivesId',
								mapping : 'archivesId'
							}, {
							   name:'archives.archivesNo',
							   mapping:'archivesNo'		
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
								name:'archives.sources',
								mapping:'sources'
							}, {
								name:'archives.archType',
								mapping:'archType'
							}, /* {
								name : 'archives.reviewUser',
								mapping : 'reviewUser'
							}, {
								name : 'archives.reviewUserName',
								mapping : 'reviewUserName'
							},*/ {
								name : 'archives.sendTo',
								mapping : 'sendTo'
							}, {
								name : 'archives.ccTo',
								mapping : 'ccTo'
							},{
								name : 'archives.examineRecordNumber',
								mapping : 'examineRecordNumber'
							},{
								name : 'archives.limitedDate',
								mapping : 'limitedDate'
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
				items : [{
					items : [{
								fieldLabel : "拟稿部门",
								value : curUserInfo.depName,
								readOnly : true
							}, {
								xtype : 'combo',
								fieldLabel : "发文单位",
								name : 'archives.issueDep',
								triggerAction : 'all',
								listWidth:200,
								lazyRender : true,
								editable : false,
								fieldLabel : '发文单位',
								store : ['重庆市交通委员会',
											'中共重庆市交通委员会', '中共重庆市交通委员会机关党委',
											'中共重庆市交通纪律检查委员会', '共青团重庆市交通委员会',
											'重庆市交通委员会直属机关工会']
							}, {
								xtype : 'combo',
								fieldLabel : '文种',
								hiddenName : "archives.archivesType.typeId",
								valueField : 'typeId',
								id : 'ArchiveSentEdit.archivesType',
								displayField : 'typeName',
								editable : false,
								triggerAction : 'all',
								forceSelection : true,
								store : new Ext.data.SimpleStore({
											url : __ctxPath
													+ '/archive/comboArchivesType.do',
											autoLoad : true,
											fields : ['typeId', 'typeName']
										})
							}]
				}, {
					items : [{
								xtype : "combo",
								fieldLabel : '缓急',
								triggerAction : 'all',
								allowBlank : true,
								editable : false,
								name : 'archives.urgentLevel',
								emptyText : '急缓程度',
								store : ['特急', '急件', '加急', '平急']
							}, {
								fieldLabel : '拟稿',
								name : "archives.issuer",
								readOnly : true
								//value : curUserInfo.fullname
							}, {
								xtype : 'combo',
								name : 'archives.sources',
								triggerAction : 'all',
								editable : false,
								fieldLabel : '行文方向',
								store : ['上行文', '平行文', '下行文']
							}]
				}, {
					items : [{
								xtype : "combo",
								fieldLabel : '密级',
								allowBlank : true,
								triggerAction : 'all',
								editable : false,
								name : 'archives.privacyLevel',
								emptyText : '密级程度',
								store : ['一般', '秘密', '机密', '绝密']
							},/* {
								xtype : "combo",
								hiddenName : "archives.reviewUser",
								fieldLabel : "核稿",
								id : 'ArchiveSentEdit.flowAssignId',
								valueField : 'flowAssignId',
								displayField : 'flowAssignName',
								editable : false,
								triggerAction : 'all',
								forceSelection : true,
								store : new Ext.data.SimpleStore({
											url : __ctxPath
													+ '/system/arrLeadersAppUser.do?roles='+roleMap.get('officeDeputyDirectorRoleID')+','+roleMap.get('officeDirectorRoleID'),
											autoLoad : true,
											fields : ['flowAssignId',
													'flowAssignName']
										}),
								listeners:{'select':function(){
								Ext.getCmp('ArchiveSentEdit.reviewUserName').setValue(Ext
									.get('ArchiveSentEdit.flowAssignId').dom.value);
								}}
							},*/ {
								xtype : 'textfield',
								id: 'ArchiveSentEdit.fileCounts',
								name : 'archives.fileCounts',
								fieldLabel : '份数',
								value : 1
							},{
								fieldLabel : "发文字号",
								//name:'archives.archivesNo',
								id:'ArchiveSentEditArchivesNo'
								//readOnly : true
							}]
				}]
			}, {
				xtype : 'textfield',
				name : 'archives.subject',
				allowBlank : false,
				width : '94%',
				fieldLabel : '标题'
			}, {
				xtype : 'container',
				layout : 'hbox',
				style : 'padding:0px 0px 5px 0px;margin-left:0px;',
				defaults : {
					allowBlank : false,
					border : false
				},
				items : [{
							xtype : 'label',
							style:'padding-top:4px;',
							text : '主送:',
							width : 84
						}, {
							xtype : 'textfield',
							name : 'archives.sendTo',
							width : '71.1%',
							id : 'ArchiveSentEdit.sendTo'
						}, {
							style : 'padding-left:5px;',
							xtype : 'button',
							iconCls : 'btn-dep-sel',
							text : '常用主送单位',
							handler : function() {
								UnitsSelector.getView(
									function(ids, names) {
										Ext.getCmp('ArchiveSentEdit.sendTo')
											.setValue(names);
										}, false,1).show();
							}
						}]
			}, {
				xtype : 'container',
				layout : 'hbox',
				defaults : {
					allowBlank : false,
					border : false
				},
				items : [{
							xtype : 'label',
							style:'padding-top:4px;',
							text : '抄送:',
							width : 84
						}, {
							xtype : 'textfield',
							name : 'archives.ccTo',
							allowBlank : true,
							id : 'ArchiveSentEdit.ccTo',
							width : '71.1%'
						}, {
							xtype : 'button',
							style : 'padding-left:5px;',
							iconCls : 'menu-department',
							text : '常用抄送单位',
							handler : function() {
								UnitsSelector.getView(
									function(ids, names) {
										Ext.getCmp('ArchiveSentEdit.ccTo')
											.setValue(names);
										}, false,2).show();
							}
						}]
			},{
				layout : 'column',
				border : false,
				style:'padding-top:4px;',
				id:'ArchiveSentEditDocFiles.person',
				hidden:true,
				defaults : {
					layout : 'form',
					border : false
				},
				items : [{
							columnWidth : .85,
							items : [{
										fieldLabel : '公文正文',
										xtype : 'panel',
										id : 'ArchiveSentEditDocFiles.personFilePanel',
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
											var fileIds = Ext.getCmp('ArchiveSentEdit.docfileIds');
											var filePanel = Ext.getCmp('ArchiveSentEditDocFiles.personFilePanel');

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
																		+ '/images/system/delete.gif" onclick="removeFile(this,\'ArchiveSentEdit.docfileIds\','
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
									var fileAttaches = Ext.getCmp('ArchiveSentEdit.docfileIds');
									var filePanel = Ext.getCmp('ArchiveSentEditDocFiles.personFilePanel');

									filePanel.body.update('');
									fileAttaches.setValue('');
								}
							}, {
								xtype : 'hidden',
								id : 'ArchiveSentEdit.docfileIds'
							}]
						}]
			},{
				xtype : 'textfield',
				name : 'archives.examineRecordNumber',
				allowBlank : true,
				width : '94%',
				fieldLabel : '审查备案号'
			},{
				xtype : 'datefield',
				name : 'archives.limitedDate',
				id: 'ArchiveSentEdit.limitedDate',
				format : 'Y-m-d',
				editable : false,
				allowBlank : true,
				width : 672,
				fieldLabel : '备案时间',
				hidden : false,
				value : new Date()
			},{
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
							xtype : 'textfield',
							name : 'archives.enclosure',
							width : '85%',
							id : 'ArchiveSentEdit.enclosure'
						}]
			},{
				layout : 'column',
				style:'padding-top:10px',
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
										id : 'ArchiveSentEditReFiles.personFilePanel',
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
											var fileIds = Ext.getCmp('ArchiveSentEditReFiles.fileIds');
											var filePanel = Ext.getCmp('ArchiveSentEditReFiles.personFilePanel');

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
																		+ '/images/system/delete.gif" onclick="removeFile(this,\'ArchiveSentEditReFiles.fileIds\','
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
									var fileAttaches = Ext.getCmp('ArchiveSentEditReFiles.fileIds');
									var filePanel = Ext.getCmp('ArchiveSentEditReFiles.personFilePanel');

									filePanel.body.update('');
									fileAttaches.setValue('');
								}
							}, {
								xtype : 'hidden',
								id : 'ArchiveSentEditReFiles.fileIds',
								name : 'fileIds'
							}]
						}]
			},{
				xtype:'hidden',
				name:'archives.issuerId'
			},{
				xtype:'hidden',
				name:'archives.archType',
				value:0
			},{
				xtype:'hidden',
				name:'archives.archivesId'
			},{
				xtype:'hidden',
				name:'archives.status'
			}]
		});
	if (this.archivesId != null && this.archivesId != 'undefined') {
		if(isshow==1)
		Ext.getCmp('ArchiveSentEditDocFiles.person').hidden=false
		var archivesId=this.archivesId;
			formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/archive/getArchDataArchives.do?archivesId='
						+ this.archivesId,
				waitMsg : '正在载入数据...',
				method:'post',
				success : function(form, action) {
					Ext.getCmp('ArchiveSentEdit.archivesType').getStore().load({ 
					callback: function () { 
					//等待数据加载完成才进行赋值，不然由于异步会出现先赋值后加载完成。 
					Ext.getCmp('ArchiveSentEdit.archivesType').setValue(Ext.decode(action.response.responseText).data[0].parentArchId);
					}, 
					scope: Ext.getCmp('ArchiveSentEdit.archivesType').getStore(),//表示作用范围 
					add: false //为false表示数据不累加 
					}); 
					//Ext.get('ArchiveSentEdit.flowAssignId').dom.value=action.result.data['archives.reviewUserName'];
					//Ext.getCmp('ArchiveSentEdit.flowAssignId').setValue(action.result.data['archives.reviewUser']);
						Ext.getCmp('ArchiveSentEdit.enclosure').setValue(Ext.decode(action.response.responseText).data[0].enclosure);
					var archivesNo=action.result.data['archives.archivesNo'];
					if(archivesNo=='0'){
					Ext.getCmp('ArchiveSentEditArchivesNo').setValue('未生成编号');
					}else{
						Ext.getCmp('ArchiveSentEditArchivesNo').setValue(archivesNo);
					}
					var filePanel = Ext.getCmp('ArchiveSentEditReFiles.personFilePanel');
					var fileIds = Ext.getCmp("ArchiveSentEditReFiles.fileIds");
					var docfilePanel = Ext.getCmp('ArchiveSentEditDocFiles.personFilePanel');
					var docFileIds=Ext.getCmp('ArchiveSentEdit.docfileIds');
//					Ext.Ajax.request({
//									url : __ctxPath + '/archive/getAttachFilesArchives.do',
//									params : {
//										'fileIds' : RefileIds
//									},
//									method:'post',
//									success : function(response, options) {
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
																	+ '/images/system/delete.gif" onclick="removeFile(this,\'ArchiveSentEditReFiles.fileIds\','
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
																	+ '/images/system/delete.gif" onclick="removeFile(this,\'ArchiveSentEdit.docfileIds\','
																	+ docfile[i].fileAttach.fileId
																	+ ')"/>&nbsp;|&nbsp;</span>');
										}
									}
//									}
//						});
				},
				failure : function(form, action) {
				}
			});
		}
	var win=new Ext.Window({
		title: defName,
		iconCls:'menu-archive-draft',
		width: 815,
		id : 'ArchiveSentEdit',
		height: 500,
		autoScroll: true,
		modal:true,
		layout:'form',
	    items:[formPanel],
	    buttonAlign:'center',
		buttons:[{
					text:'保存',
					iconCls:'btn-save',
					handler : function() {
							if (formPanel.getForm().isValid()) {
								var archNo=Ext.getCmp('ArchiveSentEditArchivesNo').getValue();
								formPanel.getForm().submit({
									method : 'post',
									waitMsg : '正在提交数据...',
									params :{
										'archives.archivesNo':archNo=="未生成编号"?0:archNo
									},
									success : function(response, options) {
										if(isshow==1){
											Ext.Ajax.request({
												url : __ctxPath + "/archive/updateArchDocsArchives.do",
												params : {
														  arcRecfileIds : Ext.getCmp('ArchiveSentEdit.docfileIds').getValue(),
														  'archives.archivesId':archivesId
														  },
												method : 'POST',
												success : function(fp, action) {
												Ext.ux.Toast.msg('操作信息', '成功保存！');
												if (callback != null) {
													callback.call(this);
												}
												win.close();
												},
												failure : function(fp, action) {
													Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
												}
											});
										}else{
											Ext.ux.Toast.msg('操作信息', '成功保存！');
											if (callback != null) {
												callback.call(this);
											}
											win.close();
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