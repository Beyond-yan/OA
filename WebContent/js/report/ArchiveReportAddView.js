ArchiveReportAddView  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ArchiveReportAddView.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'ArchiveReportAddViewWin',
					title : '报文登记',
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
		Ext.Ajax.request({
			url : __ctxPath + '/system/findChiarManByParentIdAppUser.do',
			params : {
				'parentId':curUserInfo.parentDepId,
				'deptName':'领导'
			},
			method:'post',
			success : function(response, options) {
				Ext.getCmp("archives.issuer").setValue(response.responseText);
				//Ext.getCmp("archives.issueDep").setValue(curUserInfo.depName);
			}
		});
		this.docGridPanel = new ArchivesUtil({
			panelId : 'ArchiveReportAddViewWin',
			isStart : true,
			archType: 3,
			archivesId : this.archivesId
		}).getGridPanelWithFullTools();
		//初始化form表单
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			id : 'ArchiveReportAddView',
			url : __ctxPath + '/archive/saveNormalArchivesAction.do',
			frame : false,
			border : false,
			labelWidth:70,
			width : 800,
			padding : '5px',
				reader : new Ext.data.JsonReader({
						root : 'data'
			}, [ {
					name : 'archives.id',
					mapping : 'id'
				}, {
					name : 'archives.archivesId',
					mapping : 'archivesId'
				}, {
					name : 'archives.archivesNo',
					mapping : 'archivesNo'
				}, {
					name : 'archives.issueDep',
					mapping : 'issueDep'
				}, {
					name : 'archives.subject',
					mapping : 'subject'
				}, {
				    name:'archives.archType',
				    mapping:'archType'
				}, {
					name : 'archives.issuerId',
					mapping : 'issuerId'
				},{
					name : 'archives.archivesType.typeId',
					mapping : 'typeId'
				},{
					name : 'archives.parentArchId',
					mapping : 'parentArchId'
				}, {
					name : 'archives.issuer',
					mapping : 'issuer'
				}, {
					name : 'archives.privacyLevel',
					mapping : 'privacyLevel'
				}, {
					name : 'archives.urgentLevel',
					mapping : 'urgentLevel'
				}, {
					name : 'archives.sendTo',
					mapping : 'sendTo'
				}, {
					name : 'archives.ccTo',
					mapping : 'ccTo'
				}, {
					name:'archives.archivesFiles',
					mapping:'archivesFiles'
				}, {
					name : 'archives.writtenDate',
					mapping : 'writtenDate'
				}]),
				items : [{
						border : false,
						layout : 'column',
						defaults : {
							border : false,
							layout : 'form',
							defaults : {
								width : 150,
								allowBlank : false
							}
						},
						fieldLabel : '公文字号',
						items:[{
							border : false,
							layout : 'column',
							items:[{
								xtype : 'textfield',
								width:150,
								name : 'archives.archivesNoFirst',
								id:'archivesNoFirst',
								allowBlank : false
							},{
								xtype : 'combo',
								width:150,
								name : 'archives.archivesNoSecond',
								id:'archivesNoSecond',
								triggerAction : 'all',
								editable : false,
								allowBlank : false,
								value:'2018',
								store : ['2017', '2018', '2019']
							},{
								xtype : 'textfield',
								name : 'archives.archivesNoThird',
								id:'archivesNoThird',
								width:120,
								allowBlank : false
							},{
								xtype : 'textfield',
								width:20,
								value : '号'
							},{
								xtype : 'tbtext',
								width:35,
								text : '&nbsp;'
							}]
						},{
							xtype : 'tbtext',
							width:15,
							text : '&nbsp;'
						},{
							items:[{
							    fieldLabel : '发文日期',
							    name : 'archives.writtenDate',
								xtype : 'datefield',
								format : 'Y-m-d',
								editable : false,
								value:new Date(),
								allowBlank : false
							}]
						}]
					},{
						border : false,
						layout : 'column',
						defaults : {
							border : false,
							columnWidth : .33,
							layout : 'form',
							defaults : {
								width : 150,
								allowBlank : false
							}
						},
						items:[{
							items:[{
								xtype : 'combo',
								fieldLabel : '紧急程度',
								name : 'archives.urgentLevel',
								triggerAction : 'all',
								editable : false,
								allowBlank : true,
								value:'平急',
								store : ['平急', '加急','特急']
							}]
						},{
							items:[{
							    fieldLabel : '签发人',
							    id : 'archives.issuer',
							    name : 'archives.issuer',
								xtype : 'textfield',
								value:'',
								allowBlank : false
							}]
						}, {
							items:[{
							xtype : 'combo',
							fieldLabel : '文种',
							hiddenName : "archives.archivesType.typeId",
							id : 'WSOfficeFW.archivesType',
							valueField : 'typeId',
							displayField : 'typeName',
							editable : false,
							allowBlank:false,
							triggerAction : 'all',
							forceSelection : true,
							store : new Ext.data.SimpleStore({
								url : __ctxPath+ '/archive/comboArchivesType.do',
								autoLoad : true,
								fields : ['typeId', 'typeName']
							})
							}]
						}]
					}, {
						xtype : 'textfield',
						fieldLabel : '发文单位',
						name : 'archives.issueDep',
						width:695,
						value:curUserInfo.deptName,
						allowBlank : false
					}, {
						xtype : 'textfield',
						fieldLabel : '公文标题',
						name : 'archives.subject',
						width:695,
						allowBlank : false
					},{
						name : 'archives.issuerId',
						value : curUserInfo.userId,
						xtype : 'hidden'
					},{
						name : 'archives.archivesId',
						value : this.archivesId,
						xtype : 'hidden'
					},{
						name : 'archives.status',
						xtype : 'hidden',
						value :  1
					},{
						name : 'archives.fileCounts',
						xtype : 'hidden',
						value :  1
					},{
						name : 'archives.archType',
						id : 'archType',
						value : 3,
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
										id : 'ArchiveReportAddView.personFilePanel',
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
										permitted_extensions : ['pdf'],
										upload_autostart : true,
										callback : function(data) {
											var fileIds = Ext.getCmp('ArchiveReportAddView.fileIds');
											var filePanel = Ext.getCmp('ArchiveReportAddView.personFilePanel');

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
																		+ '/images/system/delete.gif" onclick="removeFile(this,\'ArchiveReportAddView.fileIds\','
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
									var fileAttaches = Ext.getCmp('ArchiveReportAddView.fileIds');
									var filePanel = Ext.getCmp('ArchiveReportAddView.personFilePanel');
									var fileAttachesIds = Ext.getCmp('ArchiveReportAddView.ids');

									filePanel.body.update('');
									fileAttaches.setValue('');
									fileAttachesIds.setValue('');
								}
							}, {
								xtype : 'hidden',
								id : 'ArchiveReportAddView.fileIds',
								name : 'fileIds'
							}, {
								xtype : 'hidden',
								id : 'ArchiveReportAddView.ids',
								name : 'ids'
							}]
						}]
			},{
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
					name:'archives.recDepIds',
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
				//	allowBlank: false,
					readOnly : true,
					name:'archives.recDepNames',
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
						},false,map,url1,url2).show();
					}
				}/*,{
					layout : 'column',
					border : false,
					defaults : {
						layout : 'form',
						border : false
					},
					items:[{
						xtype : 'tbtext',
						text:'是否套红：',
						width:100
					},{
						xtype : 'radiogroup',
						id : 'ArchiveReportIssueView.redOption',
						allowBlank : false,
						items : [{
							boxLabel : '是',
							width :160,
							name : 'redOption',
							inputValue : 1,
							checked : true
						},{
							boxLabel : '否',
							width :160,
							name : 'redOption',
							inputValue : 0
						}]
					},{
						xtype : 'tbtext',
						text:'&nbsp;',
						width:50
					},{
						xtype : 'tbtext',
						text:'是否盖章：',
						width:100
					},{
						xtype : 'radiogroup',
						id : 'ArchiveReportIssueView.signOption',
						allowBlank : false,
						items : [{
							boxLabel : '是',
							width :120,
							name : 'signOption',
							inputValue : 1,
							checked : true
						},{
							boxLabel : '否',
							width :120,
							name : 'signOption',
							inputValue : 0
						}]
					}]
				}*/]
			}]
			
		});
	if (this.archivesId) {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/archive/getArchDataArchives.do?archivesId='+ this.archivesId,
				waitMsg : '正在载入数据...',
				method:'post',
				success : function(form, action) {
					var archivesNo = action.result.data['archives.archivesNo'];
					var typeId=action.result.data['archives.parentArchId'];
					Ext.getCmp('WSOfficeFW.archivesType').setValue(typeId);
					Ext.getCmp('archivesNoFirst').setValue(archivesNo.substring(0,archivesNo.indexOf('〔')));
					Ext.getCmp('archivesNoSecond').setValue(archivesNo.substring(archivesNo.indexOf('〔')+1,archivesNo.indexOf('〕')));
					Ext.getCmp('archivesNoThird').setValue(archivesNo.substring(archivesNo.indexOf('〕')+1,archivesNo.length-1));
					var filePanel = Ext.getCmp('ArchiveReportAddView.personFilePanel');
				    var fileIds = Ext.getCmp("ArchiveReportAddView.fileIds");
				    var ids = Ext.getCmp('ArchiveReportAddView.ids');//删除已保存过的附件使用
				    var affileId;
				    var af=action.result.data['archives.archivesFiles'];
					if (af != null) {
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
													+ '/images/system/delete.gif" onclick="removeFile(this,\'ZSGHSentArchiveRestart.fileIds\','
													+ af[i].fileId
													+ ')"/>&nbsp;|&nbsp;</span>');
						}
					}
					/*var privacyLevel=action.result.data['archives.privacyLevel'];
					if(privacyLevel!='一般'&&privacyLevel!=''&&privacyLevel!=null){
						Ext.getCmp('archivesReceivePanelCounts').show();
						Ext.getCmp('archivesReceivePanelCounts').allowBlank = false;
					}
					if(privacyLevel=='一般'){
						Ext.getCmp('archivesReceivePanelCounts').hide();
						Ext.getCmp('archivesReceivePanelCounts').allowBlank = true;
					}
					var data = Ext.decode(action.response.responseText).data[0];
					Ext.getCmp('ArchiveReportAddView.archivesType').setValue(data.parentArchId);*/
				},
				failure : function(form, action) {
				}
			});
		}
		this.buttons = [{
			text : '提交',
			iconCls : 'btn-save',
			scope : this,
			handler : this.save
		},{
			text : '草稿',
			iconCls : 'btn-save',
			scope : this,
			handler : this.saveDraft
		},{
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('ArchiveReportAddViewWin').close();
			}
		}];
	},	//end of the initUIComponents
	
	/**
	 * 保存记录
	 */
	save : function() {
		Ext.getCmp('DocumentSentForm.checkNames').allowBlank=false;
		var docParams = [];
		for (var i = 0; i < this.store.getCount(); i++) {//.docGridPanel
			docParams.push(this.store.getAt(i).data);
		}
		var archivesNo=Ext.getCmp('archivesNoFirst').getValue()+'〔'+
		Ext.getCmp('archivesNoSecond').getValue()+'〕'+
		Ext.getCmp('archivesNoThird').getValue()+'号';
		var url1=__ctxPath + '/archive/saveNormalArchives.do';
		var url2=__ctxPath + '/archive/saveArchives.do';
		this.formPanel.getForm().submit({
			method : 'POST',
			waitMsg : '正在提交表单数据...',
			url : this.archivesId?url2:url1,
			params : {		
				'archives.archivesNo':archivesNo,
				'archives.isdraft':2,
				docs :docParams.length>0?Ext.encode(docParams):null
			},
			success : function(fp, action) {
				var gridPanel = Ext.getCmp('ArchiveReportApplyGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				var gridPanel2 = Ext.getCmp('ArchiveReportBackGrid');
				if (gridPanel2 != null) {
					gridPanel2.getStore().reload();
				}
				Ext.getCmp('ArchiveReportAddViewWin').close();
				Ext.ux.Toast.msg('操作信息', '操作成功！');
			}
		});
	},
	saveDraft : function() {
		var docParams = [];
		for (var i = 0; i < this.store.getCount(); i++) {//.docGridPanel
			docParams.push(this.store.getAt(i).data);
		}
		var archivesNo=Ext.getCmp('archivesNoFirst').getValue()+'〔'+
		Ext.getCmp('archivesNoSecond').getValue()+'〕'+
		Ext.getCmp('archivesNoThird').getValue()+'号';
		var url1=__ctxPath + '/archive/saveNormalArchives.do';
		var url2=__ctxPath + '/archive/saveArchives.do';
		this.formPanel.getForm().submit({
			method : 'POST',
			waitMsg : '正在提交表单数据...',
			url : this.archivesId?url2:url1,
			params : {		
				'archives.archivesNo':archivesNo,
				'archives.isdraft':1,
				docs :docParams.length>0?Ext.encode(docParams):null
			},
			success : function(fp, action) {
				var gridPanel = Ext.getCmp('ArchiveReportApplyGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				var gridPanel2 = Ext.getCmp('ArchiveReportBackGrid');
				if (gridPanel2 != null) {
					gridPanel2.getStore().reload();
				}
				Ext.getCmp('ArchiveReportAddViewWin').close();
				Ext.ux.Toast.msg('操作信息', '操作成功！');
			}
		});
	}//end of save
});