OutTripDetailForm = Ext.extend(Ext.Window, {

	// 构造函数 - 开始
	constructor : function(_cfg) {
		
		Ext.applyIf(this, _cfg);
		
		this.initUIComponents();
		
		OutTripDetailForm.superclass.constructor.call(this, {
			id : 'OutTripDetailForm',
			layout : 'form',
			items : [this.formPanel,this.gridPanel],
			modal : true,
			height : 480,
			width : 800,
			maximizable : true,
			title : '出差申请明细',
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
		var outTripApplyId = this.outTripApplyId;
		
		// 取得出差类别
		var classIdStore = new Ext.data.SimpleStore({
			url : __ctxPath + '/admin/combolistOutTripClass.do',
			autoLoad : true,
			fields : ['realValue', 'displayValue']
		});
		
		// Panel1：主表单部分
		this.formPanel = new Ext.form.FormPanel({
			id : 'OutTripDetailForm',
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
							columnWidth : 0.20,
							layout : 'form',
							labelWidth : 60,
							border : false,
							items : {
								fieldLabel : '申请人员',
								xtype : 'textfield',
								name : 'fieldApplicantId',
								id : 'OutTripDetailForm.fieldApplicantId',
								width : 80,
								maxLength : 128,
								editable : false,
								readOnly : true
							}
						},
						{
							// 下拉选单 - 出差类别
							columnWidth : 0.23,
							layout : 'form',
							labelWidth : 60,
							border : false,
							style : 'margin:0 0 0 10px',
							items : {
								fieldLabel : "出差类别",
								xtype : "combo",
								name : "comboClassId",
								id : "OutTripDetailForm.comboClassId",
								valueField : 'realValue',
								displayField : 'displayValue',
								width : 90,
								mode : 'local',
								editable : false,
								readOnly : true,
								typeAhead : true,
								triggerAction : 'all',
								store : classIdStore
							}
						},
						{
							// 下拉选单 - 出差费用类型
							columnWidth : 0.28,
							layout : 'form',
							labelWidth : 80,
							border : false,
							style : 'margin:0 0 0 20px',
							items : {
								fieldLabel : '出差费用类型',
								xtype : 'combo',
								hiddenName : 'feeType',
								width : 90,
								editable : false,
								readOnly : true,
								mode : 'local',
								triggerAction : 'all',
								store : [ [ '0', '不发生费用' ], [ '1', '发生费用' ] ]
							}
						},
						{
							columnWidth : 0.29,
							layout : 'form',
							labelWidth : 95,
							border : false,
							items : {
								fieldLabel : '出差费用提供者',
								xtype : 'textfield',
								name : 'feeSupplier',
								id : 'OutTripDetailForm.feeSupplier',
								width : 90,
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
								name : 'tripSDt',
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
								name : 'tripEDt',
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
								fieldLabel : '出差地点',
								xtype : 'textfield',
								name : 'site',
								width : 118,
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
						fieldLabel : '出差主题',
						xtype : 'textfield',
						name : 'topic',
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
						fieldLabel : '出差事由',
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
									id : 'outTripAttachFilePanel',
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
		if (outTripApplyId != null && outTripApplyId != 'undefined') {
			this.formPanel.getForm().load({
				url : __ctxPath + '/admin/getOutTripApply.do?applyId=' + outTripApplyId,
				waitMsg : '正在载入数据...',
				success : function(form, action) {
					
					// 取得申请人ID
					var applicantId = action.result.data.applicantId;
					// 转换申请人ID为申请人姓名
					var applicantUrl = __ctxPath + '/system/getUserNameAppUser.do?memberId=' + applicantId + '&nameType=1';
					conn = Ext.lib.Ajax.getConnectionObject().conn;
					conn.open("GET", applicantUrl, false);
					conn.send(null); 
					var applicantObject = Ext.util.JSON.decode(conn.responseText);
					var applicantName = applicantObject.data;
					
					var fm = Ext.getCmp("OutTripDetailForm");
					fm.getCmpByName('fieldApplicantId').setValue(applicantName);
				//	fm.getCmpByName('comboClassId').setValue(action.result.data.outTripClass.id);
					fm.getCmpByName('comboClassId').setValue(action.result.data.outTripClassId);
					fm.getCmpByName('feeType').setValue(action.result.data.feeType);
					fm.getCmpByName('feeSupplier').setValue(action.result.data.feeSupplier);
					fm.getCmpByName('tripSDt').setValue(action.result.data.tripSDt);
					fm.getCmpByName('tripEDt').setValue(action.result.data.tripEDt);
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
						header : 'id',
						dataIndex : 'id',
						hidden : true
				},
				{
					header : '费用名目',
					dataIndex : 'feeItem',
					width : 30
				},
				{
					header : '费用标准',
					dataIndex : 'feeCriterion',
					width : 30
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
				url : __ctxPath + '/admin/listOutTripApplyDetail.do'
			}),
			reader : new Ext.data.JsonReader({
				root : 'result',
				totalProperty : 'totalCounts',
				fields : [
					{name : 'id'},
					{name : 'feeItem'},
					{name : 'feeCriterion'},
					{name : 'dayAmount'},
					{name : 'feeAmount'}
				]
			}),
			remoteSort : false
		});
		this.store.setDefaultSort('id', 'ASC');
		this.store.load({
			params : {
				'Q_outTripApply.id_L_EQ' : outTripApplyId,
				start : 0,
				limit : 10
			}
		});
		
		// Toolbar部分
		this.topbar = new Ext.Toolbar({
			id : 'OutTripDetailFormGridToolbar',
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
			id : 'OutTripDetailFormGrid',
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