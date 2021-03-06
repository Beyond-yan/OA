ArchiveReportRedView  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ArchiveReportRedView.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'ArchiveReportRedViewWin',
					title : '待套红公文',
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
		ntkoTemplate=true;//显示套红
		this.docGridPanel = new ArchivesUtil({
			panelId : 'ArchiveReportRedViewWin',
			isStart : true,
			archType: 3,
			archivesId : this.archivesId
		}).getGridPanelWithFullTools();
		//初始化form表单
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			id : 'ArchiveReportRedView',
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
					name : 'archives.recDepNames',
					mapping : 'recDepNames'
				}, {
					name : 'archives.status',
					mapping : 'status'
				}, {
					name : 'archives.fileCounts',
					mapping : 'fileCounts'
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
							columnWidth : .33,
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
								xtype : 'combo',
								fieldLabel : '安全密級',
								name : 'archives.privacyLevel',
								triggerAction : 'all',
								editable : false,
								allowBlank : true,
								readOnly:true,
								store : ['内部', '秘密', '机密']
							}]
						},{
							items:[{
								xtype : 'combo',
								fieldLabel : '紧急程度',
								name : 'archives.urgentLevel',
								triggerAction : 'all',
								editable : false,
								allowBlank : true,
								readOnly:true,
								store : ['平急', '加急','特急']
							}]
						},{
							items:[{
							    fieldLabel : '发文日期',
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
								fieldLabel : '公文字号',
								xtype : 'textfield',
								columnWidth : .33,
								name : 'archives.archivesNo'
							}]
						},{
							items:[{
								xtype : 'combo',
								columnWidth : .33,
								fieldLabel : '保密期限',
								name : 'archives.sendTo',
								triggerAction : 'all',
								editable : false,
								allowBlank : true,
								readOnly:true,
								store : ['10年', '20年', '30年','永久']
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
						id : 'ArchiveReportRedView.personFilePanel',
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
				}, {
					xtype : 'textfield',
					width : 620,
					hideParent :true,
					readOnly : true,
					name:'archives.recDepNames',
					id : 'DocumentSentForm.checkNames'
				},{
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
						id : 'ArchiveReportRedView.redOption'
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
						id : 'ArchiveReportRedView.signOption'
					}]
				}]
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
					var status = action.result.data['archives.status'];
					if(status==1){
						 Ext.getCmp('ArchiveReportRedView.signOption').setValue('未完成');
					}else{
						 Ext.getCmp('ArchiveReportRedView.signOption').setValue('已完成');
					}
					var fileCounts = action.result.data['archives.fileCounts'];
					if(fileCounts==1){
						 Ext.getCmp('ArchiveReportRedView.redOption').setValue('未完成');
					}else{
						 Ext.getCmp('ArchiveReportRedView.redOption').setValue('已完成');
					}
					var filePanel = Ext.getCmp('ArchiveReportRedView.personFilePanel');
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
			text : '完成套红',
			iconCls : 'btn-save',
			scope : this,
			handler : this.save
		},{
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				ntkoTemplate=false;//影藏套红
				Ext.getCmp('ArchiveReportRedViewWin').close();
			}
		}];
	},	//end of the initUIComponents
	
	/**
	 * 保存记录
	 */
	save : function() {
		ntkoTemplate=false;//隐藏套红
		var archivesId=this.archivesId;
		Ext.Ajax.request({
			url : __ctxPath + '/archive/updateDraftArchives.do',
			params : {
				'archivesId' : archivesId,
				'fileCounts':0
			},
			method:'post',
			success : function(response, options) {
				var gridPanel = Ext.getCmp('ArchiveReportRedGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				Ext.getCmp('ArchiveReportRedViewWin').close();
				Ext.ux.Toast.msg('操作信息', '操作成功！');
			}
		});
	}//end of save
});