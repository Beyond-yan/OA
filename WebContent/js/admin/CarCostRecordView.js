Ext.ns('CarCostRecordView');

CarCostRecordView = Ext.extend(Ext.Panel, {
	searchPanel : null,
	// 数据展示Panel
	gridPanel : null,

	topbar : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		CarCostRecordView.superclass.constructor.call(this, {
					id : 'CarCostRecordView',
					title : '费用记录',
					layout : 'border',
					iconCls : 'menu-appuser',
					autoScroll : true,
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
					id : 'carCostRecordSearchForm',
					layout : 'form',
					region : 'north',
					width : '100%',
					colNums : 5,
					items : [{
								fieldLabel : '车牌号码',
								xtype : 'textfield',
								// width : '17%',
								flex : 1,
								name : 'Q_car.carno_S_LK'
							},

							{
								fieldLabel : '费用日期:',
								xtype : 'datefield',
								name : 'Q_costDate_D_GE',
								format : 'Y-m-d',
								// width : '20%',
								flex : 1,
								border : false
							},

							{
								fieldLabel : '~',
								xtype : 'datefield',
								name : 'Q_costDate_DG_LE',
								flex : 1,
								format : 'Y-m-d',
								// width : '20%',
								border : false
							}, {
								fieldLabel : '费用类别:',
								name : 'Q_costType.costTypeName_S_LK',
								//anchor : '30%',
								xtype : 'combo',
								//allowBlank : false,
								editable : false,
								flex : 1,
								//mode:'local',
								resizable : true,
								triggerAction : 'all',
								displayField : 'costTypeName',
								//valueField : 'id',
								store : new Ext.data.SimpleStore({
											autoLoad : true,
											url : __ctxPath
													+ '/admin/listComboCarCostType.do',
											fields : ['id', 'costTypeName']
										})
							}, {
								fieldLabel : '经办人:',
								xtype : 'textfield',
								name : 'Q_carDriver.name_S_LK',
								//width : '30%',
								flex : 1

							}

					],
					buttons : [{
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext
									.getCmp('carCostRecordSearchForm');
							var gridPanel = Ext.getCmp('carCostRecordGrid');
							if (searchPanel.getForm().isValid()) {
								$search({
											searchPanel : searchPanel,
											gridPanel : gridPanel
										});
							}
						}
					}, {
						xtype : 'button',
						text : '重置',
						iconCls : 'reset',
						handler : function() {
							Ext.getCmp('carCostRecordSearchForm').getForm()
									.reset();

						}
					}]

				});
		var store = new Ext.data.JsonStore({
					url : __ctxPath + '/admin/listCarCostRecord.do',
					root : 'result',
					totalProperty : 'totalCounts',
					fields : ['id', 'car.carno', 'costDate', 'carDriver.name',
							'costType.costTypeName', 'totalAmt', 'itemQty',
							'unitPrice', 'costComment', 'createTime',
							'updateTime', 'createUser', 'updateUser']
					
				});

				
		store.load();

		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : '车牌号码',
						dataIndex : 'car.carno'
					}, {
						header : '费用日期',
						dataIndex : 'costDate',
						renderer : function(v) {
							return new Date(v).format('Y-m-d');
						}
					}, {
						header : '费用类别',
						dataIndex : 'costType.costTypeName'
					}, {
						header : '经办人',
						dataIndex : 'carDriver.name'
					}, {
						header : '总金额',
						dataIndex : 'totalAmt'
					}, {
						header : '管理',
						dataIndex : 'id',
						width : 50,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.id;
							var str = '';
							str = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" value=" " class="btn-del" onclick="CarCostRecordView.remove('
									+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';
							str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="编辑" value=" " class="btn-edit" onclick="CarCostRecordView.edit('
									+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</a>';
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});

		this.topbar = new Ext.Toolbar({
					id : 'CarCostRecordFootBar',
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '添加费用记录',
					scope : this,
					handler : function() {
						new CarCostRecordForm().show();
					}
				}));
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除费用记录',
					xtype : 'button',
					handler : function() {

						var grid = Ext.getCmp("carCostRecordGrid");

						var selectRecords = grid.getSelectionModel()
								.getSelections();

						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.id);
						}
						CarCostRecordView.remove(ids);
					}
				}));

				
				
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'carCostRecordGrid',
					tbar : this.topbar,
					region : 'center',
					store : store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});// end of the gridPaenl
	}// end of the initUIComponents
});

/**
 * 删除记录
 */
CarCostRecordView.remove = function(id) {
	var grid = Ext.getCmp("carCostRecordGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath
										+ '/admin/multiDelCarCostRecord.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
									grid.getStore().reload({
												params : {
													start : 0,
													limit : 25
												}
											});
								}
							});
				}
			});
};
/**
 * 编辑
 */
CarCostRecordView.edit = function(recordId) {
	new CarCostRecordForm({
				id : recordId,
				tag : 'tag'
			}).show();
};