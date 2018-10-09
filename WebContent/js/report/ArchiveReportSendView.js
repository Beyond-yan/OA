ArchiveReportSendView  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ArchiveReportSendView.superclass.constructor.call(this, {
			layout : 'fit',
			id : 'ArchiveReportSendViewWin',
			title : '待发公文',
			iconCls : 'menu-product',
			width : 850,
			height : 550,
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
		this.docGridPanel = new ArchivesUtil({
			panelId : 'ArchiveReportSendViewWin',
			isStart : false,
			archType: 3,
			archivesId : this.archivesId
		}).getGridPanelWithFullTools();
		//初始化form表单
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			id : 'ArchiveReportSendView',
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
				},{
					name : 'archives.parentArchId',
					mapping : 'parentArchId'
				}, {
				    name:'archives.archType',
				    mapping:'archType'
				}, {
					name : 'archives.issuerId',
					mapping : 'issuerId'
				}, {
					name : 'archives.issuer',
					mapping : 'issuer'
				}, {
					name : 'archives.privacyLevel',
					mapping : 'privacyLevel'
				}, {
					name : 'archives.status',
					mapping : 'status'
				}, {
					name : 'archives.fileCounts',
					mapping : 'fileCounts'
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
					name : 'archives.recDepNames',
					mapping : 'recDepNames'
				}, {
					name : 'archives.recDepIds',
					mapping : 'recDepIds'
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
				items:[{
					items:[{
						name : 'archives.archivesId',
						id : 'ArchivesReportIssueView.archivesId',
						xtype : 'hidden'
					},{
						fieldLabel : '公文字号',
						width : 420,
						xtype : 'textfield',
						name : 'archives.archivesNo'
					}]
				},{
					xtype : 'tbtext',
					width:50,
					text : '&nbsp;'
				},{
					items:[{
					    fieldLabel : '发文日期',
						width : 150,
					    name : 'archives.writtenDate',
						xtype : 'datefield',
						format : 'Y-m-d',
						editable : false,
						readOnly:true,
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
						width : 150,
						name : 'archives.urgentLevel',
						triggerAction : 'all',
						editable : false,
						allowBlank : true,
						readOnly:true,
						store : ['平急', '加急','特急']
					}]
				},{
					items:[{
					    fieldLabel : '签发人',
						width : 150,
					    id : 'archives.issuer',
					    name : 'archives.issuer',
						xtype : 'textfield',
						value:'',
						allowBlank : false
					}]
				},{
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
							url : __ctxPath
									+ '/archive/comboArchivesType.do',
							autoLoad : true,
							fields : ['typeId', 'typeName']
						})
					}]
				}]
			},{
						xtype : 'textfield',
						fieldLabel : '发文单位',
						name : 'archives.issueDep',
						width:695,
						readOnly:true,
						allowBlank : false
					}, {
						xtype : 'textfield',
						fieldLabel : '公文标题',
						name : 'archives.subject',
						width:695,
						readOnly:true,
						allowBlank : false
					},{
					    name : "archives.issuer",
						value : curUserInfo.fullname,
						xtype : 'hidden'
					},{
						name : 'archives.issuerId',
						value : curUserInfo.userId,
						xtype : 'hidden'
					},{
						name : 'archives.status',
						xtype : 'hidden',
						value :  1
					},{
						name : 'archives.fileCounts',
						xtype : 'hidden',
						value :  0
					},{
						name : 'archives.transfered',
						xtype : 'hidden',
						value :  0
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
					columnWidth : .94,
					items : [{
						fieldLabel : '公文附件',
						xtype : 'panel',
						id : 'ArchiveReportSendView.personFilePanel',
						frame : false,
						border : true,
						bodyStyle : 'padding:4px 4px 4px 4px;',
						height : 40,
						autoScroll : true,
						html : ''
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
					id : 'DocumentSentForm.receiveDep'
				},{
					xtype : 'label',
					style : 'padding-top:4px;',
					hideParent :true,
					text : '收文单位：',
					width : 75
				},{
					xtype : 'textfield',
					width : 620,
					hideParent :true,
					readOnly : true,
					name:'archives.recDepNames',
					id : 'DocumentSentForm.checkNames'
				},{
					xtype : 'hidden',
					name:'archives.recDepIds',
					id : 'DocumentSentForm.checkIds'
				}/*,{
					layout : 'column',
					border : false,
					defaults : {
						layout : 'form',
						border : false
					},
					items:[{
						xtype : 'tbtext',
						text:'完成套红：',
						width:100
					},{
						xtype : 'textfield',
						readOnly:true,
						id : 'ArchiveReportSendView.redOption'
					},{
						xtype : 'tbtext',
						text:'&nbsp;',
						width:50
					},{
						xtype : 'tbtext',
						text:'完成盖章：',
						width:100
					},{
						xtype : 'textfield',
						readOnly:true,
						id : 'ArchiveReportSendView.signOption'
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
					/*var status = action.result.data['archives.status'];
					if(status==1){
						 Ext.getCmp('ArchiveReportSendView.signOption').setValue('未完成');
					}else{
						 Ext.getCmp('ArchiveReportSendView.signOption').setValue('已完成');
					}
					var fileCounts = action.result.data['archives.fileCounts'];
					if(fileCounts==1){
						 Ext.getCmp('ArchiveReportSendView.redOption').setValue('未完成');
					}else{
						 Ext.getCmp('ArchiveReportSendView.redOption').setValue('已完成');
					}*/
					var filePanel = Ext.getCmp('ArchiveReportSendView.personFilePanel');
				    var af=action.result.data['archives.archivesFiles'];
					if (af != null) {
						for (var i = 0; i < af.length; i++) {
							Ext.DomHelper.append(
									filePanel.body,
							'<span>'+ af[i].fileName+ '&nbsp;&nbsp;</span>');
						}
					}
				},
				failure : function(form, action) {
				}
			});
		}
		this.buttons = [{
			text : '发送',
			iconCls : 'btn-save',
			scope : this,
			handler : this.save
		},{
			text : '退回',
			iconCls : 'btn-save',
			scope : this,
			handler : this.back
		},{
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('ArchiveReportSendViewWin').close();
			}
		}];
	},	//end of the initUIComponents
	
	/**
	 * 保存记录
	 */
	save : function() {
		var depIds=Ext.getCmp('DocumentSentForm.checkIds').getValue();
		var data =Ext.getCmp('ArchiveReportSendViewWin').store.data;
		var verify=false;
		for(var i=0;i<data.length;i++){
			var ds=data.items[i].data.docName.split(".");
			var d=ds[ds.length-1].toLowerCase();
			if(d!='pdf'){
				verify=true;
				break;
			}
		}
	    if(verify){
			Ext.ux.Toast.msg('操作信息', '请将文件转换为PDF ! ! ！');
		}else
		if(data.length==0){
			Ext.ux.Toast.msg('操作信息', '请上传正文！！！');
		}else{
			var archivesId=this.archivesId;
			Ext.Ajax.request({
				url : __ctxPath + '/archive/updateDraftArchives.do',
				params : {
					'archivesId' : archivesId,
					'isDraft':4
				},
				method:'post',
				success : function(response, options) {
					Ext.Ajax.request({
						url : __ctxPath + "/archive/saveArchivesDep.do",
						params : {
						    depIds : depIds,
						    archivesId:archivesId
						},
						method : 'POST',
						success : function(fp, action) {
							var gridPanel = Ext.getCmp('ArchiveReportSendGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							Ext.getCmp('ArchiveReportSendViewWin').close();
							Ext.ux.Toast.msg('操作信息', '操作成功！');
						},
						failure : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
						}
					});
				}
			});
		}
	},
	back : function() {
		var archivesId=this.archivesId;
		new ArchiveReportRejectView({
			'archivesId':archivesId
		}).show();
	}//end of save
});