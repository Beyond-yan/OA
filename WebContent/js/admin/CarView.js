/**
 * @author:
 * @class CarView
 * @extends Ext.Panel
 * @description [Car]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
CarView = Ext
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
						CarView.superclass.constructor.call(this, {
							id : 'CarView',
							title : '车辆管理',
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
									id : 'CarSearchForm',
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
												name : 'Q_carno_S_LK'
											},
											{
												text : '车类型'
											},
											{
												name : 'Q_cartype_S_LK',
												xtype : 'combo',
												anchor : '95%',
												mode : 'local',
												editable : false,
												triggerAction : 'all',
												store : [ [ '1', '轿车' ],
														[ '2', '货车' ],
														[ '3', '商务车' ] ]
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
														[ '0', '已报废' ],
														[ '3', '已申请' ] ]
											},
											{
												xtype : 'button',
												text : '查询',
												iconCls : 'search',
												handler : function() {
													var searchPanel = Ext
															.getCmp('CarSearchForm');
													var gridPanel = Ext
															.getCmp('CarGrid');
													if (searchPanel.getForm()
															.isValid()) {
														$search( {
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
												.getCmp('CarSearchForm');
												  searchPanel.getForm().reset();
											}
											} ]
								});// end of the searchPanel

						this.store = new Ext.data.Store( {
							proxy : new Ext.data.HttpProxy( {
								url : __ctxPath + '/admin/listCar.do'
							}),
							reader : new Ext.data.JsonReader( {
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'CarDetailGrid',
								fields : [
										{
											name : 'carid',
											type : 'int'
										},
										// {
										// name : 'code',
										// mapping : 'carOilCard.code'
										// } ,
										'carno', 'cartype', 'engineno',
										'buyinsuretime', 'audittime', 'notes',
										'factorymodel', 'driver', 'buydate',
										'status', 'cartimage', 'passAmount' ]
							}),
							remoteSort : true
						});
						this.store.setDefaultSort('carid', 'desc');
						this.store.reload( {
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
												header : 'carid',
												dataIndex : 'carid',
												hidden : true
											},
											// {
											// header : '油卡号',
											// dataIndex : 'code'
											// },
											{
												header : '车牌号码',
												dataIndex : 'carno'
											},

											{
												header : '车辆类型',
												dataIndex : 'cartype'
											},
											{
												header : '车架号',
												dataIndex : 'engineno'
											},
											{
												header : '购买保险时间',
												dataIndex : 'buyinsuretime'
											},
											{
												header : '年审时间',
												dataIndex : 'audittime'
											},
											{
												header : '厂牌型号',
												dataIndex : 'factorymodel'
											},
											{
												header : '驾驶员',
												dataIndex : 'driver'
											},
											{
												header : '购置日期',
												dataIndex : 'buydate'
											},
											{
												header : '可承载人数',
												dataIndex : 'passAmount'
											},
											{
												header : '当前状态', // 1=可用2=维修中0=报废
												dataIndex : 'status',
												renderer : function(value) {
													if (value == '1') {
														return '可用';
													}
													if (value == '2') {
														return '维修中';
													}
													if (value == '0') {
														return '已报废';
													}
													if (value == '3') {
														return '已申请';
													}

												}
											},
											{
												header : '管理',
												dataIndex : 'carid',
												width : 50,
												sortable : false,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {
													var editId = record.data.carid;
													var str = '';
													if (isGranted('_CarDel')) {
														 str = '<button title="删除" value=" " class="btn-del" onclick="CarView.remove(' + editId + ')">&nbsp;</button>';
														
													}
													if (isGranted('_CarEdit')) {
														str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="CarView.edit(' + editId + ')">&nbsp;</button>';
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

						this.topbar = new Ext.Toolbar( {
							id : 'CarFootBar',
							height : 30,
							bodyStyle : 'text-align:left',
							items : []
						});
						if (isGranted('_CarAdd')) {
							this.topbar.add(new Ext.Button( {
								iconCls : 'btn-add',
								text : '添加',
								handler : function() {
									new CarForm().show();
								}
							}));
						}
						if (isGranted('_CarDel')) {
							this.topbar
									.add(new Ext.Button(
											{
												iconCls : 'btn-del',
												text : '删除',
												handler : function() {

													var grid = Ext
															.getCmp("CarGrid");

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
																.push(selectRecords[i].data.carid);
													}

													CarView.remove(ids);
												}
											}));

						}// end of the topbar

						this.gridPanel = new Ext.grid.GridPanel( {
							id : 'CarGrid',
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
							bbar : new Ext.PagingToolbar( {
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
								if (isGranted('_CarEdit')) {
									CarView.edit(rec.data.carid);
								}
							});
						});
					}// end of the initUIComponents
				});
/**
 * 删除单个记录
 */
CarView.remove = function(id) {
	var grid = Ext.getCmp("CarGrid");
	Ext.Msg.confirm('信息确认', '删除车辆会把该车辆申请记录和维修记录一起删除，您确认要删除该记录吗？',
			function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request( {
						url : __ctxPath + '/admin/multiDelCar.do',
						params : {
							ids : id
						},
						method : 'post',
						success : function(resp, options) {
							var resultResp = Ext.decode(resp.responseText);

							if (resultResp.result == 1) {
								Ext.MessageBox.show( {
									title : '操作信息',
									msg : '已申请的车辆暂时不能删除！',
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
							} else {
								Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
								grid.getStore().reload( {
									params : {
										start : 0,
										limit : 25
									}
								});
							}
						}
					});
				}
			});
};

/**
 * 
 */
CarView.edit = function(id) {
	new CarForm( {
		carid : id
	}).show();
}