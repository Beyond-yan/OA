OutResearchDetailForm = Ext.extend(Ext.Window, {
	
	// 构造函数 - 开始
	constructor : function(_cfg) {
		
		Ext.applyIf(this, _cfg);
		
		this.initUIComponents();
		
		OutResearchDetailForm.superclass.constructor.call(this, {
			id : 'OutResearchDetailForm',
			layout : 'form',
			items : [this.formPanel,this.gridPanel],
			modal : true,
			height : 480,
			width : 800,
			maximizable : true,
			title : '调研申请明细',
			buttonAlign : 'center',
			buttons : [
				{
					text : '关闭视窗',
					iconCls : 'btn-cancel',
					scope : this,
					handler : this.cancel.createCallback(this)
				}
			]
		});
		
	},// 构造函数 - 结束
	
	// 初始化界面控件 - 开始
	initUIComponents : function() {
		
		// 取得外出调研申请ID
		var outResearchApplyId = this.outResearchApplyId;
		
		// Panel1：主表单部分
		this.formPanel = new Ext.form.FormPanel({
			id : 'OutResearchDetailForm',
			layout : 'form',
			bodyStyle : 'padding:10px',
			autoScroll : true,
			defaults : {
				border : false,
				anchor : '98%,98%'
			},
			items : [
				{
					layout : 'column',
					items : [
						{
							columnWidth : 0.35,
							layout : 'form',
							labelWidth : 60,
							border : false,
							items : {
								fieldLabel : '申请人员',
								xtype : 'textfield',
								name : 'fieldApplicantId',
								id : 'OutResearchDetailForm.fieldApplicantId',
								width : 100,
								allowBlank : false,
								maxLength : 128,
								value : curUserInfo.fullname,
								editable : false,
								readOnly : true
							}
						},
						{
							columnWidth : 0.5,
							layout : 'form',
							labelWidth : 60,
							border : false,
							items : {
								fieldLabel : '参与人员',
								xtype : 'textfield',
								name : 'fieldParticipantId',
								id : 'OutResearchDetailForm.fieldParticipantId',
								width : 250,
								allowBlank : false,
								maxLength : 128,
								editable : false,
								readOnly : true
							}
						}
					]
				},
				{
					layout : 'column',
					items : [
						{
							columnWidth : 0.37,
							layout : 'form',
							labelWidth : 60,
							border : false,
							items : {
								fieldLabel : '开始日期',
								xtype : 'datetimefield',
								format : 'Y-m-d H:i:s',
								name : 'researchSDt',
								width : 200,
								editable : false,
								readOnly : true
							}
						},
						{
							columnWidth : 0.37,
							layout : 'form',
							labelWidth : 60,
							border : false,
							items : {
								fieldLabel : '结束日期',
								xtype : 'datetimefield',
								format : 'Y-m-d H:i:s',
								name : 'researchEDt',
								width : 200,
								editable : false,
								readOnly : true
							}
						},
						{
							columnWidth : 0.25,
							layout : 'form',
							labelWidth : 60,
							border : false,
							items : {
								fieldLabel : '调研地点',
								xtype : 'textfield',
								name : 'site',
								width : 118,
								allowBlank : false,
								maxLength : 128,
								editable : false,
								readOnly : true
							}
						}
					]
				},
				{
					
					columnWidth : 0.95,
					layout : 'form',
					labelWidth : 60,
					items : {
						fieldLabel : '调研主题',
						xtype : 'textfield',
						name : 'topic',
						width : 650,
						allowBlank : false,
						maxLength : 300,
						editable : false,
						readOnly : true
					}
				},
				{
					columnWidth : 0.95,
					layout : 'form',
					labelWidth : 60,
					items : {
						fieldLabel : '调研事由',
						xtype : 'textarea',
						name : 'description',
						width : 650,
						maxLength : 300,
						editable : false,
						readOnly : true
					}
				},
				{
					
					columnWidth : 0.95,
					layout : 'form',
					labelWidth : 60,
					items : {
						fieldLabel : '备注说明',
						xtype : 'textarea',
						name : 'remark',
						width : 650,
						maxLength : 300,
						editable : false,
						readOnly : true
					}
				}/*,
				{
					// Panel3：附件部分
					layout : 'column',
					border : false,
					defaults : {
						border : false
					},
					items : [
						{
							columnWidth : .7,
							layout : 'form',
							labelWidth : 60,
							items : [
								{
									fieldLabel : '附件',
									xtype : 'panel',
									id : 'outResearchAttachFilePanel',
									border : true,
									height : 80,
									autoScroll : true,
									html : ''
								}
							]
						}
					]
				}*/
			]
		});
		
		// 获取原申请数据
		if (outResearchApplyId != null && outResearchApplyId != 'undefined') {
			
			this.formPanel.getForm().load({
				
				url : __ctxPath + '/admin/getOutResearchApply.do?applyId=' + outResearchApplyId,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
					
					// 取得申请人ID
					var applicantIdUrl = __ctxPath + '/admin/getMemberIdOutResearchApply.do?applyId=' + outResearchApplyId + '&role=1';
					conn = Ext.lib.Ajax.getConnectionObject().conn;
					conn.open("GET", applicantIdUrl, false);
					conn.send(null); 
					var applicantIdObject = Ext.util.JSON.decode(conn.responseText);
					var applicantId = applicantIdObject.data;
					
					// 取得申请人ID
					var participantIdUrl = __ctxPath + '/admin/getMemberIdOutResearchApply.do?applyId=' + outResearchApplyId + '&role=2';
					conn = Ext.lib.Ajax.getConnectionObject().conn;
					conn.open("GET", participantIdUrl, false);
					conn.send(null); 
					var participantIdObject = Ext.util.JSON.decode(conn.responseText);
					var participantId = participantIdObject.data;
					
					// 转换申请人ID为申请人姓名
					var applicantUrl = __ctxPath + '/system/getUserNameAppUser.do?memberId=' + applicantId + '&nameType=1';
					conn = Ext.lib.Ajax.getConnectionObject().conn;
					conn.open("GET", applicantUrl, false);
					conn.send(null); 
					var applicantObject = Ext.util.JSON.decode(conn.responseText);
					var applicantName = applicantObject.data;
					
					// 转换参与人ID为参与人姓名
					var participantUrl = __ctxPath+ '/system/getUserNameAppUser.do?memberId=' + participantId + '&nameType=2';
					conn = Ext.lib.Ajax.getConnectionObject().conn;
					conn.open("GET", participantUrl, false);
					conn.send(null); 
					var participantObject = Ext.util.JSON.decode(conn.responseText);
					var participantName = participantObject.data;
					
					var fm = Ext.getCmp("OutResearchDetailForm");
					fm.getCmpByName('fieldApplicantId').setValue(applicantName);
					fm.getCmpByName('fieldParticipantId').setValue(participantName);
					fm.getCmpByName('researchSDt').setValue(action.result.data.researchSDt);
					fm.getCmpByName('researchEDt').setValue(action.result.data.researchEDt);
					fm.getCmpByName('site').setValue(action.result.data.site);
					fm.getCmpByName('topic').setValue(action.result.data.topic);
					fm.getCmpByName('description').setValue(action.result.data.description);
					fm.getCmpByName('remark').setValue(action.result.data.remark);
					
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('异常','载入失败');
				}
			});
		}
		
		// Panel2：费用明细部分
		// 栏位架构部分
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(),
				{
						header : 'configKey',
						dataIndex : 'configKey',
						hidden : true
				},
				{
					header : '费用名目',
					dataIndex : 'feeItem',
					width : 30
				},
				{
					header : '费用标准',
					dataIndex : 'feeStandard',
					width : 30
				},
				{
					header : '人数',
					dataIndex : 'peopleAmount',
					width : 15
				},
				{
					header : '天数',
					dataIndex : 'dayAmount',
					width : 15
				},
				{
					header : '合计',
					dataIndex : 'feeAmount',
					width : 30,
					value : 0
				}
			],
			defaults : {
				sortable : true,
				menuDisabled : true,
				width : 100
			}
		});
		
		// Grid内容部分
		this.store = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
				url : __ctxPath + '/admin/listOutResearchApplyDetail.do'
			}),
			reader : new Ext.data.JsonReader({
				root : 'result',
				totalProperty : 'totalCounts',
				fields : [
					{name : 'id'},
					{name : 'feeItem'},
					{name : 'feeStandard'},
					{name : 'peopleAmount'},
					{name : 'dayAmount'},
					{name : 'feeAmount'}
				]
			}),
			remoteSort : false
		});
		this.store.setDefaultSort('id', 'ASC');
		this.store.load({
			params : {
				'Q_outResearchApply.id_L_EQ' : outResearchApplyId,
				start : 0,
				limit : 10
			}
		});
		
		// Toolbar部分
		this.topbar = new Ext.Toolbar({
			id : 'OutResearchDetailFormGridToolbar',
			height : 30,
			bodyStyle : 'text-align:right',
			menuAlign : 'center',
			items : [
			    {
			    	text : '费用明细'
			    }
			]
		});
		
		// 产生Grid部分
		this.gridPanel = new Ext.grid.EditorGridPanel({
			id : 'OutResearchDetailFormGrid',
			region : 'center',
			tbar : this.topbar,
			store : this.store,
		    trackMouseOver : true,
			disableSelection : false,
			loadMask : true,
			clicksToEdit:1,
		    stripeRows:true,
			height : 150,
			cm : cm,
			sm : sm,
			viewConfig : {
				forceFit : true,
				autoFill : true
			}
		});
		
	},// 初始化界面控件 - 结束
	
	// 取消(关闭Panel视窗)
	cancel : function(window) {
		
		window.close();
		
	}
	
});