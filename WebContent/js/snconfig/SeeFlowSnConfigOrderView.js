/**
 * @author:
 * @class SeeFlowSnConfigOrderView
 * @extends Ext.Panel
 * @description [FlowSnConfig]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SeeFlowSnConfigOrderView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		//var flowId = "";
		this.initUIComponents();
		// 调用父类构造
		SeeFlowSnConfigOrderView.superclass.constructor.call(this, {
					id : 'SeeFlowSnConfigOrderView',
					title : '预约编号管理',
					iconCls : 'menu-archive-handout',
					layout : 'border',
					items : [this.searchPanel,this.rightPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					id : 'SeeFlowSnConfigOrderSearchForm',
					height : 40,
					region : 'north',
					frame : false,
					border : false,
					layout : 'hbox',
					layoutConfig : {
						padding : '5',
						align : 'middle'
					},
					defaults : {
						xtype : 'label',
						margins : {
							top : 0,
							right : 4,
							bottom : 4,
							left : 4
						}
					},
					items : [{
								text : '预约编号名称:'
							}, {
								xtype : 'textfield',
								name : 'Q_orderSnName_S_LK'
							},{
								text : '编号方式:'
							}, {
								xtype : 'textfield',
								name : 'Q_fileSnConfig.snName_S_LK'
							}, {
								text : '是否已使用:'
							}, {
								xtype : 'combo',
								hiddenName : 'Q_isUsed_N_EQ',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								width : 120,
								store : [[null,'全部'],['0', '否'], ['1', '是']]
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext
											.getCmp('SeeFlowSnConfigOrderSearchForm');
									var grid = Ext.getCmp('SeeFlowSnConfigOrderGrid');
									if (searchPanel.getForm().isValid()) {
										$search({
													searchPanel : searchPanel,
													gridPanel : grid
												});
									}
								}
							}, {
								xtype : 'button',
								text : '重置',
								iconCls : 'btn-reset',
								handler : function() {
									var searchPanel = Ext
											.getCmp('SeeFlowSnConfigOrderSearchForm');
									searchPanel.getForm().reset();
								}
							}, {
								xtype : 'hidden',
								id : 'SeeFlowSnConfigOrderSearchForm.flowId',
								name : 'flowId'
							}]
				});// end of the searchPanel

		this.topbar = new Ext.Toolbar({
					items : [{
								iconCls : 'btn-add',
								text : '预约文件编号',
								xtype : 'button',
								scope : this,
								handler : this.orderRs
							}]
				});
		var store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath
										+ '/snconfig/listByPageFileSnConfigOrder.do?'
							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'id',
								fields : [{
											name : 'id',
											type : 'int'
										},'flowName','fileSnConfig.snName', 'userName','orderSnName',
										'isUsed', 'createUser', 'createDate']
							}),
					sortInfo :{field: "id", direction: "DESC"},
					  remoteSort :true
				});
		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			layout : 'anchor',
			autoHeight : true,
			id : 'SeeFlowSnConfigOrderGrid',
			store : store,
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					},{
						header : '流程名称',
						dataIndex : 'flowName',
						width:200
					}, {
						header : '预约编号名称',
						dataIndex : 'orderSnName'
					},{
						header : '编号方式',
						dataIndex : 'fileSnConfig.snName'
					}, {
						header : '是否已使用',
						dataIndex : 'isUsed',
						renderer : function(value) {
							var strValue = "是";
							if (value == 0) {
								strValue = "否";
							}
							return strValue;
						}
					},{
						header : '使用者',
						dataIndex : 'userName'
					}]
				// end of columns
			});
		store.load();
		this.rightPanel = new Ext.Panel({
					region : 'center',
					autoScroll : true,
					iconCls : 'menu-department',
					layout : 'anchor',
					items : [this.gridPanel]
				});

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search({
					searchPanel : this.searchPanel,
					gridPanel : this.gridPanel
				});
	},
	
	// 预约编号
	orderRs : function() {		
				new FlowSnConfigOrderForm().show();
			}
});
