ArchiveReportIssueView  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ArchiveReportIssueView.superclass.constructor.call(this, {
					layout : 'fit',
					id : 'ArchiveReportIssueViewWin',
					title : '签发公文',
					iconCls : 'menu-product',
					width : 850,
					height : 650,
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
			panelId : 'ArchiveReportIssueViewWin',
			isStart : true,
			archType: 3,
			archivesId : this.archivesId
		}).getGridPanelWithFullTools();
		//初始化form表单
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			id : 'ArchiveReportIssueView',
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
							columnWidth : .5,
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
								width : 300,
								xtype : 'textfield',
								name : 'archives.archivesNo'
							}]
						},{
							items:[{
							    fieldLabel : '发文日期',
								width : 300,
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
							columnWidth : .5,
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
								width : 300,
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
								width : 300,
							    id : 'archives.issuer',
							    name : 'archives.issuer',
								xtype : 'textfield',
								value:'',
								allowBlank : false
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
						id : 'ArchiveReportIssueView.personFilePanel',
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
						},false,map,url1,url2).show();
					}
				},{
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
					var filePanel = Ext.getCmp('ArchiveReportIssueView.personFilePanel');
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
			text : '签发',
			iconCls : 'btn-save',
			scope : this,
			handler : this.save
		},{
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('ArchiveReportIssueViewWin').close();
			}
		}];
	},	//end of the initUIComponents
	
	/**
	 * 保存记录
	 */
	save : function() {
		var redOption=this.formPanel.getCmpByName('redOption').getGroupValue();
		var signOption=this.formPanel.getCmpByName('signOption').getGroupValue();
		var archivesId=this.archivesId;
		var receiveDep=Ext.getCmp('DocumentSentForm.receiveDep').getValue();
		var receiveDepNames=Ext.getCmp('DocumentSentForm.checkNames').getValue();
		if(receiveDep==""){
			alert("请选择收文单位！");
			return false;
		}
		Ext.Ajax.request({
			url : __ctxPath + '/archive/updateDraftArchives.do',
			params : {
				'archivesId' : archivesId,
				'status':signOption,
				'fileCounts':redOption,
				'isDraft':2,
				'receiveDep':receiveDep,
				'receiveDepNames':receiveDepNames
			},
			method:'post',
			success : function(response, options) {
				var gridPanel = Ext.getCmp('ArchiveReportIssueGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				Ext.getCmp('ArchiveReportIssueViewWin').close();
				Ext.ux.Toast.msg('操作信息', '操作成功！');
			}
		});
	}//end of save
});