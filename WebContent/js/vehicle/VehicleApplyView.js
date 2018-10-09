Ext.ns('VehicleApplyView');

/**
 * @author:
 * @class VehicleApplyView
 * @extends Ext.Panel
 * @description 车辆申请列表
 * @createtime:2010-04-12
 */
VehicleApplyView = Ext
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
						VehicleApplyView.superclass.constructor.call(this, {
							id : 'VehicleApplyView',
							title : '审批中的文件',
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
									id : 'VehicleApplySearchForm',
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
												text : '用车事由'
											},
											{
												xtype : 'textfield',
												name : 'Q_reason_S_LK'
											},{
												text : '用车时间'
											},
											{
												xtype : 'datefield',
												format:'Y-m-d',
												width:130,
												name : 'Q_startTime_D_GE'
											},{
												text : '~'
											},
											{
												xtype : 'datefield',
												format:'Y-m-d',
												width:130,
												name : 'Q_startTime_DG_LE'
											},
											{
												xtype : 'button',
												text : '查询',
												iconCls : 'search',
												handler : function() {
													var searchPanel = Ext
															.getCmp('VehicleApplySearchForm');
													var grid = Ext
															.getCmp('VehicleApplyGrid');
											
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
												.getCmp('VehicleApplySearchForm');
													searchPanel.getForm().reset();
												}
											} ]
								});// end of the searchPanel

						this.store = new Ext.data.Store(
								{
									proxy : new Ext.data.HttpProxy(
											{
												url : __ctxPath + '/admin/listCarApply.do?Q_approvalStatus_SN_EQ=2'
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
															name : 'taskId',
															mapping : 'task ? obj.task.executionDbid:null'
														},
														{
															name : 'taskName',
															mapping : 'task ? obj.task.name:null'
														},
														{
															name : 'activityName',
															mapping : 'task ? obj.task.activityName:null'
														},
														{
															name : 'subject',
															mapping : 'processRun ? obj.processRun.subject : null'
														}, 'department',
														'userFullname',
														'applyDate', 'reason','fromSite',
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
											},{
												header : '用车事由',
												dataIndex : 'reason',
													renderer : function(value, metadata, record, rowIndex,
															colIndex) {
														var taskId = record.data.taskId;
														var taskName = record.data.taskName;
														var activityName = record.data.activityName;
														var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="VehicleApplyView.nextStep(\''+taskId+'\',\''+activityName+'\',\''+ taskName +'\')">'
																+ value
																+ '</a>';
														return str;
													}
											},{
												header : '上一个办理人',
												width:50,
												dataIndex : 'proposer'
											},{
												header : '用车部门',
												dataIndex : 'department'
											},
											{
												header : '用车时间',
												dataIndex : 'startTime'
											},
											{
												header : '结束时间',
												dataIndex : 'endTime'
											},{
												header : '用车人',
												width:50,
												dataIndex : 'userFullname'
											},
											/*{
												header : '车辆车牌号',
												width:50,
												dataIndex : 'carNo'
											},
											{
												header : '司机',
												width:50,
												dataIndex : 'driver'
											},*/
											
											
										/*{
											header : '到达地点',
											dataIndex : 'fromSite'
										},*/
											/*{
												header : '开始时间',
												id : 'startDate',
												dataIndex : 'onDutyTime'
											},
											{
												header : '结束时间',
												id : 'endDate',
												dataIndex : 'offDutyTime'
											},*/
											
/*											{
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
											},											{
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
											},*/
										/*	{
												header : '车辆分配状态',
												dataIndex : 'status',
												renderer : function(value) {
													if (value == '	') {
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
											},*/
											{
												header : '审批状态',
												dataIndex : 'approvalStatus',
												width:40,
												renderer : function(value) {
													if (value == '2') {
														return '审批中';
													} else if (value == '1') {
														return '<font color="red">新申请</font>';
													} else if (value == '3') {
														return '<font color="green">批准用车</font>';
													}else if (value == '4') {
														return '<font color="blue">取消申请</font>';
													}else if (value == '5') {
														return '<font color="orange">用车完成</font>';
													}else if (value == '6') {
														return '<font color="blue">已拒绝</font>';
													}
												}
											},
											{
												header : '管理',
												dataIndex : 'applyId',
												width : 140,
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
													var taskId = record.data.taskId;
													var taskName = record.data.taskName;
													var activityName = record.data.activityName;
													var subject = record.data.subject;
													if (record.data.iseffective == 1) {
														// Ext.getCmp('startDate').hide();
														// Ext.getCmp('endDate').hide();
													}
													var str = '';
													if (isGranted('__CarApplyDel')) {
//														if (approvalStatus != '1') {
//															str = '<button title="删除" value=" " class="btn-del" onclick="VehicleApplyView.remove(' + editId + ')">&nbsp;</button>';
//														}
													}
													// str += '<button
													// title="查看" value=" "
													// class="btn-flowView"
													// onclick="VehicleApplyView.proDetail('+runId+','+defId+','+piId+','+subject+')">&nbsp;</button>';
													if (isGranted('_CarApplyQuery')) {
														str += '&nbsp;<button title="查看" value=" " class="btn-flowView" onclick="VehicleApplyView.proDetail('
																+ runId
																+ ','
																+ defId
																+ ',\''
																+ piId
																+ '\',\''
																+ subject
																+ '\')">&nbsp;</button>查看';}
													if (isGranted('_CarApplyDel')){
														if (approvalStatus == 2) {
															str += '&nbsp;<button title="取消流程" value=" " class="btn-stop" onclick="VehicleApplyView.endSealed('
																	+ editId
																	+ ',\''
																	+ piId
																	+ '\')">&nbsp;</button>取消';

														}}
													if (isGranted('_CarApplyRefuse')){
														if (approvalStatus == 2) {
															str += '&nbsp;<button title="拒绝" value=" " class="btn-stop" onclick="VehicleApplyView.refuse('
																	+ editId
																	+ ',\''
																	+ piId
																	+ '\')">&nbsp;</button>拒绝';

														}}
													if (isGranted('_CarApplyCheck')) {
														if (status == 1) {
															str += '&nbsp;<button title="分配车辆" value=" " class="btn-ok" onclick="VehicleApplyView.nextStep(\''+taskId+'\',\''+activityName+'\',\''+ taskName +'\')">&nbsp;</button>分配';
														}}
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
							id : 'VehicleApplyFootBar',
							height : 30,
							bodyStyle : 'text-align:left',
							items : []
						});
						if (isGranted('_CarApplyAdd')) {
							this.topbar.add(new Ext.Button( {
								iconCls : 'btn-add',
								text : '添加',
								handler : function() {
						        var defId = FlowDefIdPro.vehicleApplyId;
								var flowName = FlowDefIdPro.vehicleApplyName;
								VehicleApplyView.newFlow(defId, flowName);
							}
							}));
						};
						this.gridPanel = new Ext.grid.GridPanel( {
							id : 'VehicleApplyGrid',
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
										VehicleApplyView.edit(rec.data.applyId);
									}
								}
							});
						});
					}// end of the initUIComponents
				});
/**
 * 删除单个记录
 */
VehicleApplyView.remove = function(id) {
	var grid = Ext.getCmp("VehicleApplyGrid");
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
VehicleApplyView.newFlow = function(defId, name) {
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
VehicleApplyView.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('Proce、ssRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};

/**
 * 拒绝
 */
VehicleApplyView.refuse=function(id, piId) {
	Ext.MessageBox.show({
	    title:'提示',
	    msg:'拒绝原因',
	    modal:true,
	    prompt:true,
	    multiline:true,
	    width:'350',
	    value:'',
	    fn:callBack,
	    buttons:Ext.Msg.OKCANCEL,
	    icon:Ext.Msg.QUESTION
	});
	function callBack(btn,msg){
	    //alert('单击的按钮ID是：'+btn+'\n'+'输入的内容是：'+msg);
	    if (btn == 'ok'){	
			// 修改数据库的审核状态
			Ext.Ajax.request( {
				url : __ctxPath + '/flow/stopProcessRun.do',
				params : {
					'piId' : piId
				},
				success : function(resp, options) {
					Ext.ux.Toast.msg('操作信息', '操作成功');
					Ext.getCmp('VehicleApplyGrid').getStore().reload();
				},
				failure : function(response) {
					Ext.Msg.alert("提示", "取消失败！");
				}
			});
			Ext.Ajax.request( {
				url : __ctxPath + '/admin/saveCarApply.do',
				params : {
					'carApply.applyId' : id,
					'carApply.approvalStatus' : 6,
					'carApply.notes' : msg
				},
				success : function(resp, options) {
					Ext.getCmp('VehicleApplyGrid').getStore().reload();
				}
			});
		}
	}
}

/**
 * 
 * 终止流程
 * 
 * @param id
 * @param piId
 * @return
 */
VehicleApplyView.endSealed=function(id, piId) {
	Ext.Msg.confirm('提示', '确定取消申请？', function(btn, text){
		if (btn == 'yes'){	
			// 修改数据库的审核状态
			Ext.Ajax.request( {
				url : __ctxPath + '/flow/stopProcessRun.do',
				params : {
					'piId' : piId
				},
				success : function(resp, options) {
					Ext.ux.Toast.msg('操作信息', '操作成功');
					Ext.getCmp('VehicleApplyGrid').getStore().reload();
				},
				failure : function(response) {
					Ext.Msg.alert("提示", "取消失败！");
				}
			});
			Ext.Ajax.request( {
				url : __ctxPath + '/admin/saveCarApply.do',
				params : {
					'carApply.applyId' : id,
					'carApply.approvalStatus' : 4
				},
				success : function(resp, options) {
					Ext.getCmp('VehicleApplyGrid').getStore().reload();
				}
			});
		}
	});
};
VehicleApplyView.check = function(id) {
	new VehicleDistributionForm({
		applyId : id
	}).show();
};
VehicleApplyView.nextStep=function(taskId,activityName,taskName){
	var contentPanel=App.getContentPanel();
	//alert(contentPanel.getItem(0).title)
	if(taskName.indexOf('--')>=0){
		taskName = taskName.substring(0,taskName.indexOf('--'));
	}
	for(var i=0;i<contentPanel.items.length;i++){
		if(contentPanel.getItem(i).title == taskName){
			var formView=contentPanel.getItem(i);
			contentPanel.activate(formView);
			Ext.ux.Toast.msg("操作提示","请先处理上一个同类型的任务！");
			return;
		}
	}
	var formView=contentPanel.getItem('ProcessNextForm'+taskId);
	if(formView==null){
		formView=new ProcessNextForm({taskId:taskId,activityName:activityName, taskName:taskName});
		contentPanel.add(formView);
	}
	contentPanel.activate(formView);
};