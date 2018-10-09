Ext.ns('CarCostTypeView');

CarCostTypeView = Ext.extend(Ext.Panel, {
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
		CarCostTypeView.superclass.constructor.call(this, {
					id : 'CarCostTypeView',
					title : '费用类别管理',
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
					id : 'carCostTypeSearchForm',
					layout : 'form',
					region : 'north',
					width : '100%',
					colNums : 2,
					items : [{
								fieldLabel : '车费类别',
								name : 'Q_costTypeName_S_LK',
								anchor : '30%',
								xtype : 'textfield'
							},{
								fieldLabel : '类别ID:',
								name : 'Q_costNo_S_LK',
								anchor : '30%',
								xtype : 'textfield'
							}

					],
					buttons : [{
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext
									.getCmp('carCostTypeSearchForm');
							var gridPanel = Ext.getCmp('carCostTypeGrid');
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
							Ext.getCmp('carCostTypeSearchForm').getForm()
									.reset();

						}
					}]

				});
		var store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/admin/listCarCostType.do'

							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'carid',
								fields : [{
											name : 'id',
											type : 'int'
										}, 'costTypeName', 'costNo']
							}),
					remoteSort : true
				});

		store.load();

		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : "车费类别",
						dataIndex : 'costTypeName',
						width : 60
					}, {
						header : '类别ID',
						dataIndex : 'costNo',
						width : 60
					}, {
						header : '管理',
						dataIndex : 'id',
						width : 50,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.id;
							var str = '';
							str = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" value=" " class="btn-del" onclick="CarCostTypeView.remove('
									+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';
							str += '<a href="#" style="text-decoration:none;color:#3D3D3D"  title="编辑" value=" " class="btn-edit" onclick="CarCostTypeView.edit('
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
					id : 'CarCostTypeFootBar',
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '添加车费类别',
					scope : this,
					handler : function() {
						new CarCostTypeForm().show();
					}
				}));
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除车费类别',
					xtype : 'button',
					handler : function() {

						var grid = Ext.getCmp("carCostTypeGrid");

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
						CarCostTypeView.remove(ids);
					}
				}));

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'carCostTypeGrid',
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
CarCostTypeView.remove = function(id) {
	var grid = Ext.getCmp("carCostTypeGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
						url : __ctxPath + '/admin/multiDelCarCostType.do',
						params : {
							carCostTypeId : id
						},
						method : 'post',
						success : function(result, request) {
							var res = Ext.util.JSON.decode(result.responseText);
							if (res.success == false) {
								Ext.ux.Toast.msg('操作信息', res.message);
							} else {
								Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
							}
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
CarCostTypeView.edit = function(id) {
	new CarCostTypeForm({
				carCostTypeId : id
			}).show();
};