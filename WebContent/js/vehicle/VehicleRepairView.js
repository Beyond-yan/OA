/**
 * @author:
 * @class VehicleManagementView
 * @extends Ext.Panel
 * @description [Car]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
VehicleRepairView = Ext
		.extend(
				Ext.Panel,
				{
					// 条件搜索Panel
					searchPanel : null,
					// 数据展示Panel
					gridPanel : null,
					// GridPanel的数据Store
					store : null,
					// 头部工具栏
					topbar : null,
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 初始化组件
						this.initUIComponents();
						// 调用父类构造
						VehicleRepairView.superclass.constructor.call(this, {
							id : 'VehicleRepairView',
							title : '车辆维修管理',
							iconCls : 'menu-car',
							region : 'center',
							layout : 'border',
							items : [ this.searchPanel, this.gridPanel ]
						});
					},// end of constructor

					// 初始化组件
					initUIComponents : function() {
						// 初始化搜索条件Panel
						this.searchPanel = new Ext.FormPanel(
								{
									id : 'VehicleRepairSearchForm',
									height : 40,
									frame : false,
									region : 'north',
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
									items : [

											{
												text : '车牌号码'
											},
											{
												xtype : 'textfield',
												name : 'Q_car.carno_S_LK'
											},
											{
												text : '维修类型'
											},
											{
												name : 'Q_repairType_S_LK',
												xtype : 'combo',
												anchor : '95%',
												mode : 'local',
												editable : false,
												triggerAction : 'all',
												store : [ [ '1', '保养' ],
														[ '2', '维修' ] ]
											},
											{
												text : '维修状态'
											},
											{
												hiddenName : 'Q_status_SN_EQ',
												xtype : 'combo',
												anchor : '95%',
												mode : 'local',
												editable : false,
												triggerAction : 'all',
												store : [ [ '1', '维修中' ],
														[ '2', '已完成' ] ]
											},
											{
												xtype : 'button',
												text : '查询',
												iconCls : 'search',
												handler : function() {
													var searchPanel = Ext
															.getCmp('VehicleRepairSearchForm');
													var gridPanel = Ext
															.getCmp('VehicleRepairGrid');
													if (searchPanel.getForm()
															.isValid()) {
														$search({
															searchPanel : searchPanel,
															gridPanel : gridPanel
														});
													}

												}
											},
											{
												xtype : 'button',
												text : '重置',
												iconCls : 'btn-reset',
												handler : function() {
													var searchPanel = Ext
															.getCmp('VehicleRepairSearchForm');
													searchPanel.getForm()
															.reset();
												}
											} ]
								});// end of the searchPanel

						this.store = new Ext.data.Store({
							proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/admin/listCartRepair.do'
							}),
							reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'id',
								fields : [ {
									name : 'repairId',
									type : 'int'
								}

								, {
									name : 'carno',
									mapping : 'car.carno'
								}, 'repairDate', 'reason', 'executant',
										'notes', 'repairType', 'fee', 'endDt',
										'status' ]
							}),
							remoteSort : true
						});
						this.store.setDefaultSort('repairId', 'desc');
						this.store.load({
							params : {
								start : 0,
								limit : 25
							}
						});

						var sm = new Ext.grid.CheckboxSelectionModel();
						var cm = new Ext.grid.ColumnModel(

								{

									columns : [
											sm,
											new Ext.grid.RowNumberer(),
											{
												header : 'repairId',
												dataIndex : 'repairId',
												hidden : true
											},
											{
												header : '车辆车牌号',
												dataIndex : 'carno'
											},
											{
												header : '维护日期',
												dataIndex : 'repairDate'

											},
											{
												header : '维护结束日期',
												dataIndex : 'endDt'

											},
											{
												header : '维护原因',
												dataIndex : 'reason'
											},
											{
												header : '经办人',
												dataIndex : 'executant'
											},
											{
												header : '备注',
												dataIndex : 'notes'
											},
											{
												header : '维修类型',
												dataIndex : 'repairType'
											},
											{
												header : '费用',
												dataIndex : 'fee'
											},
											{
												header : '状态',
												dataIndex : 'status',
												renderer : function(value) {

													if (value == 2) {
														return '已完成';
													} else {
														return '维修中';
													}
												}
											},
											{
												header : '管理',
												dataIndex : 'repairId',
												width : 50,
												sortable : false,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {
													var editId = record.data.repairId;
													var str = '';
													if (isGranted('_CarRepairDel')) {
														str = '<button title="删除" value=" " class="btn-del" onclick="VehicleRepairView.remove('
																+ editId
																+ ')">&nbsp;</button>';
													}
													if (isGranted('_CarRepairEdit')) {
														str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="VehicleRepairView.edit('
																+ editId
																+ ')">&nbsp;</button>';
													}
													return str;
												}
											} ],
									defaults : {
										sortable : true,
										menuDisabled : false,
										width : 100
									}
								});// end of the cm

						this.topbar = new Ext.Toolbar({
							id : 'CartRepairFootBar',
							height : 30,
							bodyStyle : 'text-align:left',
							items : []
						});
						if (isGranted('_CarRepairAdd')) {
							this.topbar.add(new Ext.Button({
								iconCls : 'btn-add',
								text : '添加',
								handler : function() {
									new VehicleRepairForm().show();
								}
							}));
						}
						if (isGranted('_CarRepairDel')) {
							this.topbar
									.add(new Ext.Button(
											{
												iconCls : 'btn-del',
												text : '删除',
												handler : function() {

													var grid = Ext
															.getCmp("VehicleRepairGrid");

													var selectRecords = grid
															.getSelectionModel()
															.getSelections();

													if (selectRecords.length == 0) {
														Ext.ux.Toast.msg("信息",
																"请选择要删除的记录！");
														return;
													}
													var ids = Array();
													for ( var i = 0; i < selectRecords.length; i++) {
														ids
																.push(selectRecords[i].data.repairId);
													}

													CartRepairView.remove(ids);
												}
											}));
						}
						// end of the topbar

						this.gridPanel = new Ext.grid.GridPanel({
							id : 'VehicleRepairGrid',
							tbar : this.topbar,
							region : 'center',
							store : this.store,
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
								store : this.store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
						});

						this.gridPanel.addListener('rowdblclick', function(
								grid, rowindex, e) {
							grid.getSelectionModel().each(function(rec) {
								if (isGranted('_CarRepairEdit')) {
									CartRepairView.edit(rec.data.repairId);
								}
							});
						});
					}// end of the initUIComponents
				});
/**
 * 删除单个记录
 */
VehicleRepairView.remove = function(id) {
	var grid = Ext.getCmp("VehicleGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath + '/admin/multiDelCartRepair.do',
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
 * 
 */
VehicleRepairView.edit = function(id) {
	new VehicleRepairForm({
		repairId : id
	}).show();
}