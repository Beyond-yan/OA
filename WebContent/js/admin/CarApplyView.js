Ext.ns('CarApplyView');

/**
 * @author:
 * @class CarApplyView
 * @extends Ext.Panel
 * @description 车辆申请列表
 * @createtime:2010-04-12
 */
CarApplyView = Ext
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
						CarApplyView.superclass.constructor.call(this, {
							id : 'CarApplyView',
							title : '车辆申请管理',
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
									id : 'CarApplySearchForm',
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
												text : '审批状态'
											},
											{
												xtype : 'textfield',
												hiddenName : 'Q_approvalStatus_SN_EQ',
												xtype : 'combo',
												mode : 'local',
												allowBlank : true,
												editable : false,
												triggerAction : 'all',
												store : [ [ '2', '审批中' ],
														['1', '通过审批' ] ,
														['3', '终止' ] ]
											},
											{
												xtype : 'button',
												text : '查询',
												iconCls : 'search',
												handler : function() {
													var searchPanel = Ext
															.getCmp('CarApplySearchForm');
													var grid = Ext
															.getCmp('CarApplyGrid');
											
													if (searchPanel.getForm()
															.isValid()) {
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
												.getCmp('CarApplySearchForm');
													searchPanel.getForm().reset();
												}
											} ]
								});// end of the searchPanel

						this.store = new Ext.data.Store(
								{
									proxy : new Ext.data.HttpProxy(
											{
												url : __ctxPath + '/admin/listCarApply.do'
											}),
									reader : new Ext.data.JsonReader(
											{
												root : 'result',
												totalProperty : 'totalCounts',
												id : 'id',
												fields : [
														{
															name : 'applyId',
															type : 'int'
														},
														// {
														// name : 'carno',
														// mapping : 'car.carno'
														// },
														{
															name : 'runId',
															mapping : 'processRun ? obj.processRun.runId : null'
														},
														{
															name : 'defId',
															mapping : 'processRun ? obj.processRun.proDefinition.defId : null'
														},
														{
															name : 'piId',
															mapping : 'processRun ? obj.processRun.piId : null'
														},
														{
															name : 'subject',
															mapping : 'processRun ? obj.processRun.subject : null'
														}, 'department',
														'userFullname',
														'applyDate', 'reason',
														'startTime', 'endTime',
														'proposer', 'mileage',
														'oilUse', 'notes',
														'approvalStatus',
														'ishavecardriver',
														'iseffective',
														'onDutyTime',
														'offDutyTime',
														'status', 'driver',
														'carNo', 'userId' ]
											}),
									remoteSort : true
								});
						this.store.setDefaultSort('applyId', 'desc');
						this.store.load( {
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
												header : 'applyId',
												dataIndex : 'applyId',
												hidden : true
											},
											{
												header : '车辆车牌号',
												dataIndex : 'carNo'
											},
											{
												header : '司机',
												dataIndex : 'driver'
											},
											{
												header : '用车部门',
												dataIndex : 'department'
											},
											{
												header : '用车人',
												dataIndex : 'userFullname'
											},
											// {
											// header : '申请日期',
											// dataIndex : 'applyDate',
											// renderer : function(value) {
											// return value.substring(0,
											// 10);
											// }
											// },
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
												id : 'startDate',
												dataIndex : 'onDutyTime'
											},
											{
												header : '结束时间',
												id : 'endDate',
												dataIndex : 'offDutyTime'
											},
											{
												header : '申请人',
												dataIndex : 'proposer'
											},
											{
												header : '是否需要司机', // 
												dataIndex : 'ishavecardriver',
												renderer : function(value) {
													if (value == '1') {
														return '<font color="red">需要</font>';
													}
													if (value == '2') {
														return '<font color="green">不需要</font>';
													}

												}
											},
											{
												header : '是否长期有效', // 
												dataIndex : 'iseffective',
												renderer : function(value) {
													if (value == '1') {
														return '否';
													}
													if (value == '2') {
														return '是';
													}

												}
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
														return '审批中';
													} else if (value == '1') {
														return '<font color="red">通过审批</font>';
													} else {
														return '<font color="green">终止</font>';
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
													var status = record.data.status;

													var runId = record.data.runId;
													var defId = record.data.defId;
													var piId = record.data.piId;
													var subject = record.data.subject;
													if (record.data.iseffective == 1) {
														// Ext.getCmp('startDate').hide();
														// Ext.getCmp('endDate').hide();
													}
													var str = '';
													if (isGranted('__CarApplyDel')) {
//														if (approvalStatus != '1') {
//															str = '<button title="删除" value=" " class="btn-del" onclick="CarApplyView.remove(' + editId + ')">&nbsp;</button>';
//														}
													}
													// str += '<button
													// title="查看" value=" "
													// class="btn-flowView"
													// onclick="CarApplyView.proDetail('+runId+','+defId+','+piId+','+subject+')">&nbsp;</button>';
													if (isGranted('_CarApplyEdit')) {

														str += '&nbsp;<button title="查看" value=" " class="btn-flowView" onclick="CarApplyView.proDetail('
																+ runId
																+ ','
																+ defId
																+ ',\''
																+ piId
																+ '\',\''
																+ subject
																+ '\')">&nbsp;</button>';
														if (approvalStatus == 2) {
															str += '&nbsp;<button title="终止流程" value=" " class="btn-stop" onclick="CarApplyView.endSealed('
																	+ editId
																	+ ',\''
																	+ piId
																	+ '\')">&nbsp;</button>';

														}

													}
													

													if (isGranted('_CarApplyCheck')) {
														if (approvalStatus == 0) {
															str += '&nbsp;<button title="审批" value=" " class="btn-ok" onclick="CarApplyView.check(' + editId + ')">&nbsp;</button>';
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
							id : 'CarApplyFootBar',
							height : 30,
							bodyStyle : 'text-align:left',
							items : []
						});
						if (isGranted('_CarApplyAdd')) {
							this.topbar.add(new Ext.Button( {
								iconCls : 'btn-add',
								text : '添加',
								handler : function() {
								var defId = FlowDefIdPro.carApplyId_V1_Id;
								var flowName = FlowDefIdPro.carApplyId_V1_Name;
								CarApplyView.newFlow(defId, flowName);
								// new CarApplyForm().show();
								// Ext.getCmp('CarApplyForm').remove('depContainer');
								// Ext.getCmp('CarApplyForm').remove('approvalStatus');

							}
							}));
						};
						this.gridPanel = new Ext.grid.GridPanel( {
							id : 'CarApplyGrid',
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

						this.gridPanel.addListener('rowdblclick', function(
								grid, rowindex, e) {
							grid.getSelectionModel().each(function(rec) {
								if (isGranted('_CarApplyEdit')) {
									if (rec.data.approvalStatus == 0) {
										CarApplyView.edit(rec.data.applyId);
									}
								}
							});
						});
					}// end of the initUIComponents
				});
/**
 * 删除单个记录
 */
CarApplyView.remove = function(id) {
	var grid = Ext.getCmp("CarApplyGrid");
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
 * 新建流程
 * 
 * @param {}
 *            defId
 * @param {}
 *            name
 */
CarApplyView.newFlow = function(defId, name) {
	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);

	if (startForm == null) {
		startForm = new ProcessRunStart( {
			id : 'ProcessRunStart' + defId,
			defId : defId,
			flowName : name
		});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
};

/**
 * 显示明细
 * 
 * @param {}
 *            runId
 * @param {}
 *            name
 */
CarApplyView.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};

/**
 * 
 * 终止流程
 * 
 * @param id
 * @param piId
 * @return
 */
CarApplyView.endSealed=function(id, piId) {
	Ext.Msg.confirm('提示', '确定终止该流程？', function(btn, text){
		if (btn == 'yes'){	
			// 修改数据库的审核状态
			Ext.Ajax.request( {
				url : __ctxPath + '/flow/stopProcessRun.do',
				params : {
					'piId' : piId
				},
				success : function(resp, options) {
					Ext.ux.Toast.msg('操作信息', '操作成功');
					Ext.getCmp('CarApplyGrid').getStore().reload();
				},
				failure : function(response) {
					Ext.Msg.alert("提示", "终止失败！");
				}
			});
			Ext.Ajax.request( {
				url : __ctxPath + '/admin/saveCarApply.do',
				params : {
					'carApply.applyId' : id,
					'carApply.approvalStatus' : 3
				},
				success : function(resp, options) {
					Ext.getCmp('CarApplyGrid').getStore().reload();
				}
			});
		}
	});
	
};
/**
 * 
 */
CarApplyView.edit = function(id) {
	new CarApplyForm( {
		applyId : id
	}).show();
};
CarApplyView.check = function(id) {
	new CarApplyCheck( {
		applyId : id
	}).show();
};
