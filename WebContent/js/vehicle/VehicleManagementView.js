/**
 * @author:
 * @class VehicleManagementView
 * @extends Ext.Panel
 * @description [Car]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
VehicleManagementView = Ext.extend(Ext.Panel, {
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
		VehicleManagementView.superclass.constructor.call(this, {
					id : 'VehicleManagementView',
					title : '车辆档案',
					iconCls : 'menu-car',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					id : 'VehicleSearchForm',
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
								text : '车牌号码'
							}, {
								xtype : 'textfield',
								name : 'Q_carno_S_LK'
							}, {
								text : '车类型'
							}, {
								hiddenName : 'Q_cartype_S_EQ',
								xtype : 'combo',
								anchor : '95%',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : [['1', '轿车'], ['2', '货车'],
										['3', '商务车'], ['4', '客车'],
										['5', '大客车'], ['6', '面包车'],
										['7', '本田轿车'], ['8', '风度轿车']
										, ['9', '吉普车'], ['10', '陆地巡洋舰']
										, ['11', '福克斯']]
							},
							{
								text : '当前状态' // 1=可用2=维修中
							// 0=报废
							},
							{
								hiddenName : 'Q_status_SN_EQ',
								xtype : 'combo',
								anchor : '95%',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : [ [ '1', '可用' ],
										[ '2', '维修中' ],
										[ '5', '已停用' ]
										]
							},
							{
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext
											.getCmp('VehicleSearchForm');
									var gridPanel = Ext.getCmp('VehicleGrid');
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
								iconCls : 'btn-reset',
								handler : function() {
									var searchPanel = Ext
											.getCmp('VehicleSearchForm');
									searchPanel.getForm().reset();
								}
							}]
				});// end of the searchPanel

		this.store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/admin/listCar.do?Q_status_SN_NEQ=0'
							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'VehicleDetailGrid',
								fields : [{
											name : 'carid',
											type : 'int'
										}, 'carno', 'cartype',
										'department.depName', 'factorymodel',
										'driver', 'distance', 'isPublic',
										'passAmount','status']
							}),
					remoteSort : true
				});
		this.store.setDefaultSort('carid', 'desc');
		this.store.reload({
					params : {
						start : 0,
						limit : 25,
						'Q_status_SN_NEQ':0
					}
				});

		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel(

		{

			columns : [sm, new Ext.grid.RowNumberer(),

			{
						header : 'carid',
						dataIndex : 'carid',
						hidden : true
					}, {
						header : '车牌号码',
						width:50,
						dataIndex : 'carno'
					}, {
						header : '驾驶员',
						width:30,
						dataIndex : 'driver'
					},

					{
						header : '车辆类型',
						width:30,
						dataIndex : 'cartype',
						renderer : function(value) {
							if (value == '1') {
								return '轿车';
							}else if (value == '2') {
								return '货车';
							}else if (value == '3') {
								return '商务车';
							}else if (value == '4') {
								return '客车';
							}else if (value == '5') {
								return '大客车';
							}else if (value == '6') {
								return '面包车';
							}else if (value == '7') {
								return '本田轿车';
							}else if (value == '8') {
								return '风度轿车';
							}else if (value == '9') {
								return '吉普车';
							}else if (value == '10') {
								return '陆地巡洋舰';
							}else if (value == '11') {
								return '福克斯';
							}
						}
					}, {
						header : '座位',
						width:20,
						dataIndex : 'passAmount'
					}, {
						header : '使用者',
						width:50,
						dataIndex : 'department.depName'
					},
					/*{
						header : '车架号',
						dataIndex : 'engineno'
					},*/
					/*{
						header : '购买保险时间',
						dataIndex : 'buyinsuretime'
					},
					{
						header : '年审时间',
						dataIndex : 'audittime'
					},*/
					{
						header : '厂牌型号',
						width:50,
						dataIndex : 'factorymodel'
					},

					/*{
						header : '购置日期',
						dataIndex : 'buydate'
					},*/
					/*{
						header : '购置金额',
						dataIndex : 'purchase'
					},{
						header : '发动机号',
						dataIndex : 'engineSpec'
					},*/{
						header : '总里程',
						width:40,
						dataIndex : 'distance'
					}, {
						header : '是否公用',
						dataIndex : 'isPublic',
						width:20,
						renderer : function(value) {
							if (value == '1') {
								return '是';
							}
							if (value == '2') {
								return '否';
							}
						}
					},

					{
						header : '当前状态', // 1=可用2=维修中0=报废
						dataIndex : 'status',
						renderer : function(value) {
							if (value == '2') {
								return '维修中';
							}
							if (value == '0') {
								return '已报废';
							}
							if (value == '5') {
								return '已停用';
							}
							else {
								return '可用';
							}
						}
					},
					{
						header : '管理',
						dataIndex : 'carid',
						width : 50,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.carid;
							var str = '';
							if (isGranted('_CarDel')) {
								str = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" value=" " class="btn-del" onclick="VehicleManagementView.remove('
										+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';

							}
							if (isGranted('_CarEdit')) {
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="编辑" value=" " class="btn-edit" onclick="VehicleManagementView.edit('
										+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</a>';
							}
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});// end of the cm

		this.topbar = new Ext.Toolbar({
					id : 'VehicleFootBar',
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});
		if (isGranted('_CarAdd')) {
			this.topbar.add(new Ext.Button({
						iconCls : 'btn-add',
						text : '添加',
						handler : function() {
							App.clickTopTab('VehicleForm');
						/*	new VehicleForm().show();*/
						}
					}));
		}

		if (isGranted('_CarDel')) {
			this.topbar.add(new Ext.Button({
						iconCls : 'btn-del',
						text : '删除',
						handler : function() {

							var grid = Ext.getCmp("VehicleGrid");

							var selectRecords = grid.getSelectionModel()
									.getSelections();

							if (selectRecords.length == 0) {
								Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
								return;
							}
							var ids = Array();
							for (var i = 0; i < selectRecords.length; i++) {
								ids.push(selectRecords[i].data.carid);
							}

							VehicleManagementView.remove(ids);
						}
					}));

		}// end of the topbar
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-car',
					text : '设公用车',
					handler : function() {
						var grid = Ext.getCmp("VehicleGrid");
						var selectRecords = grid.getSelectionModel()
								.getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要设为公车的记录！");
							return;
						}
						var ids = Array();
					    for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.carid);
						 var publish=selectRecords[i].data.isPublic
						if(publish==1){
								Ext.ux.Toast.msg("信息", "已经为公用车！");
								return;
						}
						}
						for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.carid);
						}
						VehicleManagementView.gongyong(ids);
					}
				}));
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'VehicleGrid',
					region : 'center',
					tbar : this.topbar,
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

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
								if (isGranted('_CarEdit')) {
									VehicleManagementView.edit(rec.data.carid);
								}
							});
				});
	}// end of the initUIComponents
});
/**
 * 删除单个记录
 */
VehicleManagementView.remove = function(id) {
	var grid = Ext.getCmp("VehicleGrid");
	Ext.Msg.confirm('信息确认', '删除车辆会把该车辆申请记录一起删除，您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + '/admin/multiDelCar.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function(resp, options) {
									var resultResp = Ext
											.decode(resp.responseText);
									if (resultResp.result == 1) {
										Ext.MessageBox.show({
													title : '操作信息',
													msg : '已申请的车辆暂时不能删除！',
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-error'
												});
									} else {
										Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
										grid.getStore().reload({
													params : {
														start : 0,
														limit : 25,
														'Q_status_SN_NEQ':0
													}
												});
									}
								}
							});
				}
			});
};
/**
 * 设置公用车
 */
VehicleManagementView.gongyong = function(id) {
	var grid = Ext.getCmp("VehicleGrid");
	Ext.Msg.confirm('信息确认', '确定设置为公用车吗？', function(btn) {
		if (btn == 'yes') {
				Ext.Ajax.request({
							url : __ctxPath + '/admin/updatecarCar.do',
							params : {
								ids : id
							},
							method : 'post',
							success : function(resp, options) {
								var resultResp = Ext.decode(resp.responseText);
								Ext.ux.Toast.msg("信息提示", "成功设置！");
								grid.getStore().reload({
											params : {
												start : 0,
												limit : 25,
												'Q_status_SN_NEQ':0
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
VehicleManagementView.edit = function(id) {
	new VehicleForm({
				carid : id
			}).show();
}