/**
 * @author:
 * @class VehicleDriverView
 * @extends Ext.Panel
 * @description [CarDriver]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
Ext.ns('VehicleDriverView');
VehicleDriverView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		VehicleDriverView.superclass.constructor.call(this, {
					id : 'VehicleDriverView',
					title : '司机管理',
					iconCls : 'menu-driverManage',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件

	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
			id : 'VehicleDriverSearchForm',
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
			items : [{
						text : '驾驶证编号'
					}, {
						name : 'Q_code_S_LK',
						anchor : '95%',
						xtype : 'textfield'
					}, {
						text : '姓名'
					}, {
						name : 'Q_name_S_LK',
						anchor : '95%',
						xtype : 'textfield'
					}, {
						text : '准驾车型'
					}, {
						hiddenName : 'Q_licenseClass_SN_EQ',
						anchor : '95%',
						xtype : 'combo',
						mode : 'local',
						triggerAction : 'all',
						editable : false,
						store : [['1', 'A1'], ['2', 'A2'], ['3', 'A3'],
								['4', 'B1'], ['5', 'B2'], ['6', 'C1'],
								['7', 'C2'], ['8', 'C3'], ['9', 'C4'],
								['10', 'D'], ['11', 'E'], ['12', 'F'],
								['13', 'M'], ['14', 'N'], ['15', 'P']]
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext.getCmp('VehicleDriverSearchForm');
							var gridPanel = Ext.getCmp('VehicleDriverGrid');
							$search({
										searchPanel : searchPanel,
										gridPanel : gridPanel
									});
						}

					} ,{
						xtype : 'button',
						text : '重置',
						iconCls : 'btn-reset',
						handler : function() {
							var searchPanel = Ext
									.getCmp('VehicleDriverSearchForm');
							searchPanel.getForm().reset();
						}
					}]

		});// end of searchPanel

		this.topbar = new Ext.Toolbar({
					items : [{
								iconCls : 'btn-add',
								text : '添加',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							}, {
								iconCls : 'btn-del',
								text : '删除',
								xtype : 'button',
								scope : this,
								handler : this.removeSelRs
							}]
				});
	this.rowActions = new Ext.ux.grid.RowActions( {
					header : '管理',
					width : 80,
					actions : [ {
						iconCls : 'btn-del',
						text : '删除',
						qtip : '删除',
						style : 'margin:0 3px 0 3px'
					}, {
						iconCls : 'btn-edit',
						text : '编辑',
						qtip : '编辑',
						style : 'margin:0 3px 0 3px'
					} ],
					listeners : {
									scope : this,
									'action' : this.onRowAction
								}
				});
		this.gridPanel = new HT.GridPanel({
			id : 'VehicleDriverGridPanel',
			region : 'center',
			tbar : this.topbar,
			plugins : this.rowActions,
			id : 'VehicleDriverGrid',
			url : __ctxPath + "/admin/listCarDriver.do?Q_isLeaving_SN_NEQ=0",
			fields : [{
						name : 'id',
						type : 'int'
					}, 'code', 'name', 'cellPhone', 'shortPhone', 'homePhone',
					'email', 'isLeaving', 'imageSource', 'licenseClass',
					'licenseSDt', 'licenseEDt', 'createDate', 'createBy',
					'updateDate', 'updateBy', 'status'],
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '驾驶证编号',
						dataIndex : 'code'
					}, {
						header : '姓名',
						dataIndex : 'name'
					}, {
						header : '手机',
						dataIndex : 'cellPhone'
					},/* {
						header : '短号',
						dataIndex : 'shortPhone'
					},*//* {
						header : '家庭电话',
						dataIndex : 'homePhone'
					},*/ /*{
						header : 'email',
						dataIndex : 'email'
					},*/ {
						header : '状态',
						dataIndex : 'isLeaving',
						renderer : function(value) {
							if (value == '1' || value == '2')
								return '在职';
							else {
								return '已离职';
							}
						}
					},/* {
						header : '是否已出车',
						dataIndex : 'isLeaving',
						renderer : function(value) {
							return String(value).replace('1', '空闲').replace(
									'2', '出车').replace('0', '');
						}
					},
*/
					{
						header : '准驾车型',
						dataIndex : 'licenseClass',
						renderer : function(value) {
							switch (value) {
								case 1 :
									return 'A1';
								case 2 :
									return 'A2';
								case 3 :
									return 'A3';
								case 4 :
									return 'B1';
								case 5 :
									return 'B2';
								case 6 :
									return 'C1';
								case 7 :
									return 'C2';
								case 8 :
									return 'C3';
								case 9 :
									return 'C4';
								case 10 :
									return 'D';
								case 11 :
									return 'E';
								case 12 :
									return 'F';
								case 13 :
									return 'M';
								case 14 :
									return 'N';
								case 15 :
									return 'P';
							}
							return '未知';

						}
					},this.rowActions/*, {
						header : '有效期至',
						dataIndex : 'licenseEDt',
						format : 'M d, Y'
					}, new Ext.ux.grid.RowActions({
								header : '管理',
								width : 200,
								actions : [{
											iconCls : 'btn-del',
											qtip : '删除',
											style : 'margin:0 3px 0 3px'
										}, {
											iconCls : 'btn-edit',
											qtip : '编辑',
											style : 'margin:0 3px 0 3px'
										}],
								listeners : {
									scope : this,
									'action' : this.onRowAction
								}
							})*/]
				// end of columns
			});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},

	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
					new VehicleDriverForm({
								id : rec.data.id
							}).show();
				});
	},
	// 创建记录
	createRs : function() {
		new VehicleDriverForm().show();
	},

	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
			url : __ctxPath + '/admin/multiDelCarDriver.do',
					ids : id,
					grid : this.gridPanel
				});

	},
	// 批量删除
	removeSelRs : function() {
		$delGridRs({
			url : __ctxPath + '/admin/multiDelCarDriver.do',
					grid : this.gridPanel,
					idName : 'id'
				});
	},

	// 按条件搜索
	search : function() {
		$search({
					searchPanel : this.searchPanel,
					gridPanel : this.gridPanel
				});
	},
	// 编辑Rs
	editRs : function(record) {
		new VehicleDriverForm({
					id : record.data.id
				}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-del' :
				this.removeRs.call(this, record.data.id);
				break;
			case 'btn-edit' :
				this.editRs.call(this, record);
				break;
			default :
				break;
		}
	}
});
