DocumentSentForm  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DocumentSentForm.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'DocumentSentFormWin',
					title : '公文发送',
					iconCls : 'menu-product',
					width : 850,
					height : 600,
					items:this.formPanel,
					maximizable : true,
					border : false,
					modal : true,
					plain : true,
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},
	// 初始化组件
	initUIComponents : function() {
		this.docGridPanel = new SysArchivesFilesUtil({
			panelId : 'DocumentSentFormWin',
			isStart : true,
			dataId : this.id,
			fileType : 1
			}).getGridPanelWithFullTools();
		//初始化form表单
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			id : 'DocumentSentForm',
			url : __ctxPath + '/system/saveSysDataTransfer.do',
			frame : false,
			border : false,
			labelWidth:70,
			width : 800,
			padding : '5px',
				reader : new Ext.data.JsonReader({
						root : 'data'
			}, [ {
					name : 'sysDataTransfer.id',
					mapping : 'id'
				}, {
					name : 'sysDataTransfer.archivesId',
					mapping : 'archivesId'
				}, {
					name : 'sysDataTransfer.archivesno',
					mapping : 'archivesno'
				}, {
					name : 'sysDataTransfer.sendDep',
					mapping : 'sendDep'
				}, {
					name : 'sysDataTransfer.subject',
					mapping : 'subject'
				}, {
				    name:'sysDataTransfer.archtype',
				    mapping:'archtype'
				}, {
					name : 'sysDataTransfer.issuerid',
					mapping : 'issuerid'
				}, {
					name : 'sysDataTransfer.issuer',
					mapping : 'issuer'
				}, {
					name : 'sysDataTransfer.privacylevel',
					mapping : 'privacylevel'
				}, {
					name : 'sysDataTransfer.urgentlevel',
					mapping : 'urgentlevel'
				}, {
					name : 'sysDataTransfer.sources',
					mapping : 'sources'
				}, {
					name : 'sysDataTransfer.writtenDate',
					mapping : 'writtenDate'
				}, {
					name:'sysDataTransfer.receiveDep',
					mapping:'receiveDep'
				}, {
					name:'sysDataTransfer.transferType',
					mapping:'transferType'
				}, {
					name:'sysDataTransfer.fromSchema',
					mapping:'fromSchema'
				}, {
					name:'sysDataTransfer.toSchemaId',
					mapping:'toSchemaId'
				}, {
					name:'sysDataTransfer.receiveDate',
					mapping:'receiveDate'
				},{
					name:'sysDataTransfer.receiveFlag',
					mapping:'receiveFlag'
				},{
					name:'sysDataTransfer.rejectMsg',
					mapping:'rejectMsg'
				},{
					name:'sysDataTransfer.createUser',
					mapping:'createUser'
				},{
					name:'sysDataTransfer.createDate',
					mapping:'createDate'
				},{
					name:'sysDataTransfer.transactionId',
					mapping:'transactionId'
				},{
					name:'sysDataTransfer.receiveUser',
					mapping:'receiveUser'
				},{
					name:'sysDataTransfer.receiveUserName',
					mapping:'receiveUserName'
				},{
					name:'sysDataTransfer.dataSource',
					mapping:'dataSource'
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
//								xtype : 'textfield',
								allowBlank : false
							}
						},
						items:[{
								items:[
							/*{
								xtype:'hidden',
								id:'DocumentSentForm.snId'
							},*/ {
								name : 'sysDataTransfer.id',
								xtype : 'hidden'
//								value : this.id == null ? '' : this.id
							},{
								xtype : 'combo',
								fieldLabel : '密級',
								name : 'sysDataTransfer.privacylevel',
								triggerAction : 'all',
								editable : false,
								allowBlank : true,
								store : ['一般', '秘密', '机密','绝密']/*,
								listeners: {
									'select':function(combo){
										if(combo.getValue()!='一般'){
											Ext.getCmp('archivesReceivePanelCounts').show();
											Ext.getCmp('PanelCount').allowBlank = false;
										}else{
											Ext.getCmp('archivesReceivePanelCounts').hide();
											Ext.getCmp('PanelCount').allowBlank = true;
										}
									}
								}*/
							},{
								xtype : 'combo',
								width : 150,
								fieldLabel : '文种分类',
								id: 'DocumentSentForm.sources',
								hiddenName : "sysDataTransfer.sources",
								valueField : 'typeName',
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
							}/*, {
								xtype : 'container',
								style : 'padding:0px 0px 5px 0px;',
								id : 'archivesReceivePanelCounts',
								layout : 'column',
								width : 260,
								hidden : true,
								items : [
									{
										xtype : 'label',
										style:"padding-top:4px;",
										text : '份号：',
										width : 75
									},{
										xtype : 'numberfield',
										editable : false,
										id : 'PanelCount',
										mode : 'local',
										name : 'sysDataTransfer.fileCounts',
										width : 155
								}]
							}*/]
						},{
							items:[/*{
								fieldLabel : '发文日期',
								xtype : 'datefield',
								format : 'Y-m-d',
								editable : false,
								allowBlank : false,
								name : 'sysDataTransfer.writtenDate',
								value:new Date()
							},*/{
								xtype : 'combo',
								fieldLabel : '缓急',
								name : 'sysDataTransfer.urgentlevel',
								triggerAction : 'all',
								editable : false,
								allowBlank : true,
								store : ['特急', '急件', '加急','平急']
							}/*,{
								xtype : 'container',
								id:'archivesReceiveFormlimitedDate',
								style : 'padding:0px 0px 5px 0px;',
								layout : 'column',
								width : 260,
								hidden : true,
								items : [{
										xtype : 'label',
										text : '限办日期',
										width : 75
									}, {
									name : 'sysDataTransfer.limitedDate',
									xtype : 'datefield',
									format : 'Y-m-d',
									mode : 'local',
									editable : false,
									value: new Date().add(Date.MONTH,1),
									width : 150
								}]
										}*/, {
							    fieldLabel : '成文日期',
							    name : 'sysDataTransfer.writtenDate',
								xtype : 'datefield',
								format : 'Y-m-d',
								editable : false,
								allowBlank : false	
						}]
						},{
							items:[{
								xtype : 'textfield',
								fieldLabel : '公文字号',
								name : 'sysDataTransfer.archivesno',
								allowBlank : true
							}]
					}]
					},{
						xtype : 'textfield',
						fieldLabel : '发文单位',
						name : 'sysDataTransfer.sendDep',
						width:695,
						allowBlank : false
					}, {
					xtype : 'container',
					layout : 'column',
					id : 'DocumentSentForm.sentGroup',
					style : 'padding:0px 0px 5px 0px;margin-left:0px;',
					defaults : {
						border : false
					},
					items : [{
								xtype : 'hidden',
								width : '60%',
								id : 'DocumentSentForm.receiveDep'
							},{
								xtype : 'label',
								style : 'padding-top:4px;',
								hideParent :true,
								text : '收文单位：',
								width : 75
							}, {
								xtype : 'textfield',
								width : 620,
								hideParent :true,
								allowBlank: false,
								readOnly : true,
								id : 'DocumentSentForm.checkNames'
							}, {
								style : 'padding-left:5px;',
								xtype : 'button',
								iconCls : 'menu-department',
								hideParent :true,
								text : '收文单位',
								handler : function() {
									var url1=__ctxPath + '/system/sentListDepartment.do';
									var url2=__ctxPath + '/system/selectLE3Department.do';
									var depIdsTemp = Ext.getCmp('DocumentSentForm.receiveDep').getValue();
									var depNamesTemp = Ext.getCmp('DocumentSentForm.checkNames').getValue();
									var array1 = [];
									var array2 = [];
									var map= new Map();
									if (depIdsTemp != null&& depIdsTemp != '') {
										array1 = depIdsTemp.split(',');
										array2 = depNamesTemp.split(',');
										for (var i = 0; i < array1.length; i++) {
											map.put(array1[i],array2[i]);
										}
									}
									DepSelector.getView(function(formPanel,id, name) {
										Ext.getCmp('DocumentSentForm.checkNames').setValue(name);
										Ext.getCmp('DocumentSentForm.receiveDep').setValue(id);
									},true,map,url1,url2).show();
								}
								/*handler : function() {
									var url1=__ctxPath + '/system/listDepartment.do';
									DepSelector.getView(function(formPanel,id, name) {
										Ext.getCmp('DocumentSentForm.checkNames').setValue(name);
										Ext.getCmp('DocumentSentForm.checkIds').setValue(id);
									},false,null,url1,null).show();
								}*/
							}]
			}, {
						xtype : 'textfield',
						fieldLabel : '主   题',
						name : 'sysDataTransfer.subject',
						width:695,
						allowBlank : false
					}/*,{
						name : 'sysDataTransfer.status',
						xtype : 'hidden',
						value :  1
					}*/,{
					    name : "sysDataTransfer.issuer",
						value : curUserInfo.fullname,
						xtype : 'hidden'
					}, {
						name : 'sysDataTransfer.createUser',
						value : curUserInfo.username,
						xtype : 'hidden'
					}, {
						name : 'sysDataTransfer.issuerid',
						value : curUserInfo.userId,
						xtype : 'hidden'
					}/*,{
						name : 'sysDataTransfer.sendDep',
						value : curUserInfo.depId,
						xtype : 'hidden'
					}*/,{
						name : 'sysDataTransfer.archType',
						id : 'archType',
						value : 1,
						xtype : 'hidden'
					}/*,{
						name : 'sysDataTransfer.id',
						id:'id',
						xtype : 'hidden'
					}*//*,{
						name : 'sysDataTransfer.isdraft',
						id : 'isdraft',
						value : 1,
						xtype : 'hidden'
					}*/,{
						name : 'sysDataTransfer.receiveFlag',
						id : 'receiveFlag',
						value : 0,
						xtype : 'hidden'
					}, {
						name : 'sysDataTransfer.dataSource',
						id : 'dataSource',
						value : 1,
						xtype : 'hidden'
					},{
				xtype : 'fieldset',
				style:'padding-top:6px',
				border : false,
				defaults : {
					anchor : '95%,95%'
				},
				items : [this.docGridPanel]
			} ,{
				layout : 'column',
				border : false,
				defaults : {
					layout : 'form',
					border : false
				},
				items : [{
							columnWidth : .8,
							items : [{
										fieldLabel : '公文附件',
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
			}]
			
		});
	if (this.id != null && this.id != 'undefined') {
			this.formPanel.getForm().load({
//				deferredRender : false,
				url : __ctxPath + '/system/getSysDataTransfer.do?id='
						+ this.id,
//				waitMsg : '正在载入数据...',
//				method:'post',
				root : 'data',
				preName : 'sysDataTransfer',
				success : function(form, action) {
					Ext.getCmp('DocumentSentForm.checkNames').setValue(Ext.decode(action.response.responseText).data.confs.depName);
					Ext.getCmp('DocumentSentForm.receiveDep').setValue(Ext.decode(action.response.responseText).data.confs.depId);
					/*var fileAttach=new Array();
					Ext.getCmp('DocumentSentForm.archivesType').getStore().load({ 
					callback: function () { 
					//等待数据加载完成才进行赋值，不然由于异步会出现先赋值后加载完成。 
					Ext.getCmp('DocumentSentForm.archivesType').setValue(Ext.decode(action.response.responseText).data[0].parentArchId);
					}, 
					scope: Ext.getCmp('DocumentSentForm.archivesType').getStore(),//表示作用范围 
					add: false //为false表示数据不累加 
					});*/
					var filePanel = Ext.getCmp('DocumentSentForm.personFilePanel');
				    var fileIds = Ext.getCmp("DocumentSentForm.fileIds");
				    var ids = Ext.getCmp('DocumentSentForm.ids');//删除已保存过的附件使用
				    var affileId;
					var af=Ext.decode(action.response.responseText).data.archivesFiles;
					if(af!=null){
							for (var i = 0; i < af.length; i++) {
								if (fileIds.getValue() != '') {
									fileIds.setValue(fileIds.getValue() + ',');
								}
								fileIds.setValue(fileIds.getValue() + af[i].fileId);
								
								//删除已保存过的附件使用
								if(ids.getValue() != ''){
									ids.setValue(ids.getValue() + ',');
								}
								ids.setValue(ids.getValue() + af[i].id);
								
								if('undefined' ==af[i].fileId || null ==af[i].fileId || "" ==af[i].fileId){
									affileId='-1';
								}else{
									affileId = af[i].fileId;
								}
								
								Ext.DomHelper
										.append(
												filePanel.body,
												'<span><a href="#" onclick="FileAttachDetail.show('
														+ affileId + ',' + af[i].id
														+ ')">'
														+ af[i].fileName
														+ '</a><img class="img-delete" src="'
														+ __ctxPath
														+ '/images/system/delete.gif" onclick="removeFile(this,\'DocumentSentForm.ids\','
														+ af[i].id
														+ ')"/>&nbsp;|&nbsp;</span>');
							  }
				    }
					/*var privacyLevel=action.result.data['sysDataTransfer.privacyLevel'];
					if(privacyLevel!='一般'&&privacyLevel!=''&&privacyLevel!=null){
						Ext.getCmp('archivesReceivePanelCounts').show();
						Ext.getCmp('archivesReceivePanelCounts').allowBlank = false;
					}
					if(privacyLevel=='一般'){
						Ext.getCmp('archivesReceivePanelCounts').hide();
						Ext.getCmp('archivesReceivePanelCounts').allowBlank = true;
					}
					var data = Ext.decode(action.response.responseText).data[0];
					Ext.getCmp('DocumentSentForm.archivesType').setValue(data.parentArchId);*/
				},
				failure : function(form, action) {
				}
			});
		}
		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					scope : this,
					handler : this.save
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						Ext.getCmp('DocumentSentFormWin').close();
					}
				}];
	},	//end of the initUIComponents
	
	/**
	 * 保存记录
	 */
	save : function() {
		var docParams = [];
		for (var i = 0; i < this.store.getCount(); i++) {
							docParams.push(this.docGridPanel.store.getAt(i).data);
						}
		$postForm({
					formPanel : this.formPanel,
					scope : this,
					url : __ctxPath + '/system/saveSysDataTransfer.do',
					params : {		
						docs :docParams.length>0?Ext.encode(docParams):null,
						depId : Ext.getCmp('DocumentSentForm.receiveDep').getValue()
					},
					callback : function(fp, action) {
						var gridPanel = Ext.getCmp('DocumentSentGrid');
						if (gridPanel != null) {
							gridPanel.getStore().reload();
						}
						this.close();
					}
				});
	}//end of save
});