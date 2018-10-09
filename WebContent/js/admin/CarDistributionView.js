Ext.ns('CarDistributionView');

/**
 * @author:
 * @class CarDistributionView
 * @extends Ext.Panel
 * @description 车辆分配列表
 * @company 广州宏天软件有限公司
 * @createtime:2010-04-12
 */
CarDistributionView = Ext
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
						CarDistributionView.superclass.constructor.call(this, {
							id : 'CarDistributionView',
							title : '车辆分配管理',
							iconCls : 'menu-car_apply',
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
									id : 'CarApplyAssignForm',
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
									items : [
											{
												text : '车牌号'
											},
											{
												xtype : 'textfield',
												name : 'Q_carNo_S_LK'
											},
											{
												text : '车辆分配状态'
											},
											{
												hiddenName : 'Q_status_SN_EQ',
												xtype : 'combo',
												anchor : '95%',
												mode : 'local',
												editable : true,
												triggerAction : 'all',
												store : [ [ '1', '未分配' ],
														[ '2', '已分配' ] ,
														['3', '已收车' ],
														['4', '无资源' ] ]
											},
											{
												xtype : 'button',
												text : '查询',
												iconCls : 'search',
												handler : function() {
													var searchPanel = Ext
															.getCmp('CarApplyAssignForm');
													var grid = Ext
															.getCmp('CarApplyAssignGrid');
//													if (searchPanel.getForm()
//															.isValid()) {
//														searchPanel
//																.getForm()
//																.submit(
//																		{
//																			waitMsg : '正在提交查询',
//																			url : __ctxPath + '/admin/listCarApply.do',
//																			method:'post',
//																			params : {
//																				start : 0,
//																				limit : 25,
//																				Q_approvalStatus_SN_EQ : 1
//																			},
//																			success : function(
//																					formPanel,
//																					action) {
//																				var result = Ext.util.JSON
//																						.decode(action.response.responseText);
//																				grid
//																						.getStore()
//																						.loadData(
//																								result);
//																			}
//																		});
//													}
													if (searchPanel.getForm().isValid()) {
														$search( {
															searchPanel : searchPanel,
															gridPanel : grid
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
												.getCmp('CarApplyAssignForm');
											 searchPanel.getForm().reset();
												}
											} ]
								});// end of the searchPanel

						this.store = new Ext.data.Store( {
							proxy : new Ext.data.HttpProxy( {
								url : __ctxPath + '/admin/listCarApply.do?Q_approvalStatus_SN_EQ=1'
							}),
							reader : new Ext.data.JsonReader( {
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'id',
								fields : [
										{
											name : 'applyId',
											type : 'int'
										}
										// ,
										// {
										// name : 'carno',
										// mapping : 'car.carno'
										// }
										, 'department', 'userFullname',
										'applyDate', 'reason', 'startTime',
										'endTime', 'proposer', 'mileage',
										'oilUse', 'notes', 'approvalStatus',
										'carNo', 'driver', 'onDutyTime',
										'offDutyTime', 'status' ,'peopleAmount']
							}),
							remoteSort : true
						});
						this.store.setDefaultSort('applyId', 'desc');
						this.store.load( {
							params : {
								start : 0,
								limit : 25,
								Q_approvalStatus_SN_EQ : 1
							}
						});

						var sm = new Ext.grid.CheckboxSelectionModel();
						var cm = new Ext.grid.ColumnModel(
								{
									columns : [
											sm,
											new Ext.grid.RowNumberer(),
											{
												header : 'applyId',
												dataIndex : 'applyId',
												hidden : true
											},

											{
												header : '车辆车牌号',
												dataIndex : 'carNo'
											},
											{
												header : '用车部门',
												dataIndex : 'department'
											},
											{
												header : '用车人',
												dataIndex : 'userFullname'
											},{
												header : '承载人数',
												dataIndex : 'peopleAmount'
											},
											{
												header : '司机',
												dataIndex : 'driver'
											},
											{
												header : '申请日期',
												dataIndex : 'applyDate',
												renderer : function(value) {
													return value.substring(0,
															10);
												}
											},
//											{
//												header : '原因',
//												dataIndex : 'reason'
//											},
											{
												header : '出发时间',
												dataIndex : 'startTime'
											},
											{
												header : '返回时间',
												dataIndex : 'endTime'
											},
											{
												header : '开始时间',
												dataIndex : 'onDutyTime'
											},
											{
												header : '截止时间',
												dataIndex : 'offDutyTime'
											},
											{
												header : '申请人',
												dataIndex : 'proposer'
											},
											{
												header : '车辆分配状态',
												dataIndex : 'status',
												renderer : function(value) {
												if (value == '1') {
													return '<font color="green">未分配</font>';
												}
												if (value == '2') {
													return '<font color="red">已分配</font>';
												}
												if (value == '3') {
													return '已收车';
												}
												if (value == '4') {
													return '无资源';
												}
												}
											},
											{
												header : '审批状态',
												dataIndex : 'approvalStatus',
												renderer : function(value) {
												if (value == '2') {
													return '<font color="green">审批中</font>';
												} else if (value == '1') {
													return '<font color="red">通过审批</font>';
												} else {
													return '未通过审批';
												}
												}
											},
											{
												header : '管理',
												dataIndex : 'applyId',
												width : 80,
												sortable : false,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {
													var editId = record.data.applyId;
													var approvalStatus = record.data.approvalStatus;
													var status= record.data.status;
													var str = '';
													// if
													// (isGranted('__CarDistributionDel'))
													// {
													// str = '<button title="删除"
													// value=" " class="btn-del"
													// onclick="CarDistributionView.remove('
													// + editId +
													// ')">&nbsp;</button>';
													// }
													if (isGranted('_CarDistributionEdit')) {
														if(status==1){
														str += '&nbsp;<button title="分配" value=" " class="btn-edit" onclick="CarDistributionView.edit(' + editId + ')">&nbsp;</button>';
														}
													}
													if (isGranted('_CarDistributionCheck')) {
														if (approvalStatus == 0) {
															str += '&nbsp;<button title="审批" value=" " class="btn-ok" onclick="CarDistributionView.check(' + editId + ')">&nbsp;</button>';
														}
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
							id : 'CarDistributionFootBar',
							height : 30,
							bodyStyle : 'text-align:left',
							items : []
						});
					
						this.gridPanel = new Ext.grid.GridPanel( {
							id : 'CarApplyAssignGrid',
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
							bbar : new Ext.PagingToolbar( {
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
						});

						this.gridPanel
								.addListener(
										'rowdblclick',
										function(grid, rowindex, e) {
											grid
													.getSelectionModel()
													.each(
															function(rec) {
																if (isGranted('_CarApplyEdit')) {
																	if (rec.data.approvalStatus == 0) {
																		CarDistributionView
																				.edit(rec.data.applyId);
																	}
																}
															});
										});
					}// end of the initUIComponents
				});
/**
 * 删除单个记录
 */
CarDistributionView.remove = function(id) {
	var grid = Ext.getCmp("CarApplyAssignGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request( {
				url : __ctxPath + '/admin/multiDelCarApply.do',
				params : {
					ids : id
				},
				method : 'post',
				success : function() {
					Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
					grid.getStore().reload( {
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
CarDistributionView.edit = function(id) {
	new CarDistributionForm( {
		applyId : id
	}).show();
};
CarDistributionView.check = function(id) {
	new CarApplyCheck( {
		applyId : id
	}).show();
};
