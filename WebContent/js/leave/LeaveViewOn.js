/**
 * @author:Ropen
 * @class LeaveViewOn
 * @extends Ext.Panel
 * @description 拟稿管理
 */
LeaveViewOn = Ext.extend(Ext.Panel, {
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
		LeaveViewOn.superclass.constructor.call(this, {
					id : 'LeaveViewOn',
					iconCls : 'menu-leave-on',
					title : '在办件',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var _url = __ctxPath + '/system/listByDepIdDepartment.do?depId='+roleMap.get('DepartmentCommonId');
		var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			height : 110,
			region : 'north',
			frame : false,
			id : 'LeaveViewOnSearchForm',
			layout : 'form',
			bodyStyle:'padding:5px;',
			defaults : {
				border : false
			},
			items : [{
						name : 'startDate',
						xtype : 'hidden',
						id : 'ZBsentStoredStartDt'
					}, {
						xtype : 'hidden',
						name : 'endDate',
						id : 'ZBsentStoredendDate'
					}, {
						layout : 'column',
						defaults : {
							border : false
						},
						items : [{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '流程名称',
								width : 180,
								xtype : 'combo',
								listWidth : 450,
								hiddenName : 'defId',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/flow/comQuickProDefinition.do?typeId=6668842',
									fields : ['id', 'name']
								})
							}

							]
						},{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '标题',
								name : 'subject',
								xtype : 'textfield',
								width : 180
							}]
						}, {
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										fieldLabel : '拟稿人',
										name : 'issuerName',
										xtype : 'textfield',
										width : 180
									}]
						},{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [new TreeSelectorName('depTreeSelectorOn', _url, '部门',
									'issuerDepId', true)]
						},{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '年份',
								width : 130,
								xtype : 'combo',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : arr,
								emptyText : '---年份---',
								listeners : {
									select : function() {
										Ext
												.getCmp('ZBsentStoredStartDt')
												.setValue((this.getValue() + '-01-01'));
										Ext
												.getCmp('ZBsentStoredendDate')
												.setValue(Ext.util.Format
														.substr(
																this.getValue(),
																0, 4)
														+ '-12-31');
									}
								}
							}]
						},{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										width : 60,
										fieldLabel : '当前办理人',
										name : 'assignUserNameSearch',
										xtype : 'textfield'
									}]
						}]
					}, {
						xtype : 'panel',
						border : false,
						layout : 'hbox',
						layoutConfig : {
							pack : 'center',
							align : 'middle'
						},
						items : [{
									xtype : 'button',
									text : '查询',
									iconCls : 'search',
									handler : this.search.createCallback(this)
								}, {
									xtype : 'button',
									text : '重置',
									style : 'padding-left:5px;',
									iconCls : 'btn-reseted',
									handler : function() {
										var searchPanel = Ext
												.getCmp('LeaveViewOnSearchForm');
										searchPanel.getForm().reset();
									}
								}]
					}, {
						xtype : 'hidden',
						name : 'archiveType',
						value : 88
					}, {
						xtype : 'hidden',
						name : 'toDoType',
						value : 5
					}, {
						xtype : 'hidden',
						name : 'issuerDepId',
						id : 'issuerDepId'
					}]
		});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/leave/listFlowLeaveArchives.do",
					baseParams : {
						'archiveType' : 88,
						'toDoType' : 5
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'defId',
								type : 'int'
							}, 'runId', 'taskId', 'taskName', 'activityname',
							'runSubject', 'preActivityname', 'preUserId',
							'preUserName', 'assignUserId', 'assignUserName',
							'archiveId', 'issuerId', 'issuer',
							'archCreateTime', 'sendTime', 'isReply',
							'archivesNo', 'orgdepName', 'issuedep', 'curDepId',
							'curDepName', 'flowName', 'dataValue', 'piid',
							'creatorDepName', 'creatorDepId','isComSetting']
				});
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});
		this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 200,
					actions : [
							// {
							// iconCls : 'btn-archives-detail',
							// qtip : '公文信息',
							// text : '公文信息',
							// style : 'margin:4px 3px 4px 3px'
							// },
							{
						iconCls : 'btn-flowView',
						text : '流程信息',
						qtip : '流程信息',
						style : 'margin:4px 3px 4px 3px'
					}, {
						iconCls : 'btn-edit',
						text : '流程编辑',
						qtip : '流程编辑',
						style : 'margin:4px 3px 4px 3px'
					}, {
						iconCls : 'menu-holiday',
						text : '删除',
						qtip : '删除',
						style : 'margin:4px 3px 4px 3px'
					}]
				});
		// 初始化ColumnModel
		var record_start = 0;
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer({
								header : "序号",
								width : 35,
								renderer : function(value, metadata, record,
										rowIndex) {
									return record_start + 1 + rowIndex;
								}
							}), {
						header : 'archiveId',
						dataIndex : 'archiveId',
						hidden : true
					}, {
						header : '标题',
						dataIndex : 'runSubject',
						width : 250,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
								    metadata.attr = 'style="white-space:normal;"'; 
									var str='';
									if(record.data.isComSetting==1){
										str+='<img src="'+__ctxPath +'/images/system/flower.png" style="height:12px;width:13px;"/>'
									}
							 str += '<a href="#"  title='+value+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="LeaveViewOn.detail('
									+ record.data.archiveId
									+ ','
									+ record.data.runId
									+ ','
									+ record.data.defId
									+ ')">'
									+ value
									+ '</a>';
							return str;
						}
					}, {
						header : '步骤名称',
						dataIndex : 'taskName'
					}, {
						header : '当前办理人',
						dataIndex : 'assignUserName'
					}, {
						header : '当前办理部门',
						dataIndex : 'curDepName'
					}, {
						header : '拟稿人',
						dataIndex : 'issuer'
					}, {
						header : '拟稿人部门',
						dataIndex : 'creatorDepName'
					}, {
						header : '拟稿时间',
						dataIndex : 'archCreateTime'
					}, {
						header : '管理',
						width : 250,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var preUserId = record.data.preUserId;
							var preActivityname = record.data.preActivityname;
							var taskName = record.data.taskName;
							var str = '';
						
							if (isGranted('_ArchiveIssueEdit')) {
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="LeaveViewOn.edit('
										+ record.data.taskId
										+ ',\''
										+ record.data.activityname
										+ '\')"><img src="'
										+ __ctxPath
										+ '/images/system/edit.gif" />流程编辑</a>&nbsp;';
							}
							if (isGranted('_ArchiveIssueDel')) {
								if (curUserInfo.isAdmin || curUserInfo.iscommonAdmin
										|| curUserInfo.userId == record.data.issuerId) {
									str += '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="LeaveViewOn.stopProcess('
											+ record.data.archiveId
											+ ',\''
											+ record.data.piid
											+ '\')"><img src="'
											+ __ctxPath
											+ '/images/newImages/outCaseSearch.png" />删除</a>&nbsp;';
								}
							}
							if (isGranted('_ArchiveIssueBack')) {
								if (curUserInfo.userId == preUserId
										&& preActivityname.toString()
												.indexOf("会签") == -1
//										&& taskName.toString().indexOf("会签") == -1
										) {
									// if(taskName!="编号"&&taskName!="重新发起"&&taskName!="生成电子公文"&&taskName!="编号"&&taskName!="分发"){
									if (taskName != "重新发起"&&preActivityname!="退回"&&preActivityname!="撤回"&&preActivityname!="流程编辑") {
										str += '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="LeaveViewOn.backProcess('
												+ record.data.taskId
												+ ',\''
												+ record.data.activityname
												+ '\',\''
												+ record.data.preActivityname
												+ '\','
												+ record.data.preUserId
												+ ')"><img src="'
												+ __ctxPath
												+ '/images/btn/flow/changeTask.png" />撤回</a>';
									}
								}
							}
							str += '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="LeaveViewOn.proDetail('
								+ record.data.runId
								+ ','
								+ record.data.defId
								+ ',\''
								+ record.data.piid
								+ '\',\''
								+ record.data.runSubject
								+ '\')"><img src="'
								+ __ctxPath
								+ '/images/btn/flow/view.png" />流程信息</a>&nbsp;';
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false
			}
		});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchivesIssueGrid',
					region : 'center',
					stripeRows : true,
					// tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					// plugins : this.rowActions,
					autoHeight : true,
					cm : cm,
					sm : sm,
					viewConfig : {
						forceFit : true,
						autoFill : true, // 自动填充
						forceFit : true
						// showPreview : false
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
								emptyMsg : "当前没有记录",
								doLoad : function(start) {
									record_start = start;
									var o = {}, pn = this.getParams();
									o[pn.start] = start;
									o[pn.limit] = this.pageSize;
									this.store.load({
												params : o
											});
								}
							})
				});

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
							});
				});
		// this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()

	/**
	 * 
	 * @param {}
	 *            self 当前窗体对象
	 */
	search : function(self) {
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
						searchPanel : self.searchPanel,
						gridPanel : self.gridPanel
					});
		}
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-archives-detail' :
				LeaveViewOn.detail(record.data.archiveId,
						record.data.taskId, record.data.defId);
				break;
			case 'btn-flowView' :
				LeaveViewOn.proDetail(record.data.runId,
						record.data.defId, record.data.piid,
						record.data.runSubject);
				break;
			case 'btn-edit' :
				LeaveViewOn.edit(record.data.taskId,
						record.data.activityname);
				break;
			case 'menu-holiday' :
				LeaveViewOn.stopProcess(record.data.archiveId,
						record.data.piid);
				break;
			default :
				break;
		}
	},
	/**
	 * 查阅详情
	 * 
	 * @param {}
	 *            record
	 */
	detail : function(record) {
		new ArchivesDetailWin({
					archivesId : record.data.archivesId
				}).show();
	}
});

/**
 * 展示公文详细信息
 * 
 * @param {}
 *            editId
 */
LeaveViewOn.detail = function(editId, runId, defId) {
	var isGranted=false;
	if(curUserInfo.isOfficeStaffRole||curUserInfo.isAdmin||curUserInfo.isArchivesManager)
		{
		  isGranted=true;
		}
	new LeaveViewDetail({
		archivesId : editId,
		runId : runId,
		defId : defId,
		archType : 0,
		isGranted:isGranted
	}).show();
}

/**
 * 
 * 流程编辑功能
 * 
 * @param {}
 * 
 */
LeaveViewOn.edit = function(taskId, activityname) {
	new ArchivesFreeJumpWin({
				taskId : taskId,
				activityName : activityname
			}).show();
}

/**
 * 展示公文子收文明细
 * 
 * @param {}
 *            editId
 */
LeaveViewOn.subDetail = function(editId) {
	new ArchSubDetailForm({
				parentArchId : editId
			});
}

LeaveViewOn.stopProcess = function(editId, piId) {
	Ext.Msg.confirm('提示', '删除后文件不可恢复，请确认是否要删除该流程？', function(btn, text) {
				if (btn == 'yes') {
					// 终止流程
					Ext.Ajax.request({
								url : __ctxPath + '/flow/stopProcessRun.do',
								params : {
									'piId' : piId
								},
								method : 'post',
								success : function(resp, options) {
									Ext.ux.Toast.msg('操作信息', '操作成功');
									Ext.getCmp('ArchivesIssueGrid').getStore()
											.reload()
								},
								failure : function(response) {
									Ext.Msg.alert("提示", "终止失败！");
								}
							});
				}
			})
}

/**
 * 显示明细
 * 
 * @param {}
 *            runId
 * @param {}
 *            name
 */
LeaveViewOn.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}
/**
 * 
 * 撤回流程
 * 
 * @param {}
 */
LeaveViewOn.backProcess = function(taskId, activityName,
		preActivityname, preUserId) {
	Ext.Msg.confirm('提示', '确定撤回该流程？', function(btn, text) {
		if (btn == 'yes') {
			// 撤回流程
			var formPanel = Ext.getCmp('LeaveViewOnSearchForm');
			if (preActivityname.toString().indexOf("拟稿") == -1) {
				Ext.Ajax.request({
							url : __ctxPath
									+ '/flow/getPreviousStepProcessRun.do',
							params : {
								'taskId' : taskId
							},
							method : 'post',
							success : function(response, options) {
								var processForm = Ext.util.JSON
										.decode(response.responseText).data;
								var prevSignalName = processForm[0].signalName;
								var prevDestName = processForm[0].activityName;
								var prevFlowAssignId = processForm[0].creatorId;
								if(prevDestName.toString().indexOf("会签") == -1){
									if(activityName.toString().indexOf("会签")==-1){
										formPanel.getForm().submit({
											url : __ctxPath
													+ "/flow/nextProcessActivity.do",
											method : 'post',
											waitMsg : '正在提交处理，请稍等',
											scope : this,
											params : {
												taskId : taskId,
												signalName : prevSignalName,
												activityName : activityName,
												destName : prevDestName,
												status : '撤回',
												isBack : true,
												flowAssignId : prevFlowAssignId
											},
											success : function(fp, action) {
												Ext.ux.Toast.msg('操作信息', '撤回成功！');
												Ext.getCmp('ArchivesIssueGrid')
														.getStore().reload();
												refreshTaskPanelView();
											},
											failure : function(fp, action) {
												Ext.ux.Toast
														.msg('操作信息', '操作出错，请联系管理员！');
											}
										});
									}else{
										formPanel.getForm().submit({
											url : __ctxPath
													+ "/flow/backSignProcessActivity.do",
											method : 'post',
											waitMsg : '正在提交处理，请稍等',
											scope : this,
											params : {
												taskId : taskId,
												signalName : prevSignalName,
												activityName : activityName,
												destName : prevDestName,
												status : '撤回',
												isBack : true,
												flowAssignId : prevFlowAssignId
											},
											success : function(fp, action) {
												Ext.ux.Toast.msg('操作信息', '撤回成功！');
												Ext.getCmp('ArchivesIssueGrid')
														.getStore().reload();
												refreshTaskPanelView();
											},
											failure : function(fp, action) {
												Ext.ux.Toast
														.msg('操作信息', '操作出错，请联系管理员！');
											}
										});	
									}
								}else{
									Ext.MessageBox.show({
						              title:'操作信息',
						              msg:'该会签任务已经处理，不能撤回！',
						              buttons:Ext.MessageBox.OK,
						              icon:Ext.MessageBox.INFO
									});
									return false;
								}
							},
							failure : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '撤回出错，请联系管理员！');
							}
						});
			} else {
				formPanel.getForm().submit({
							url : __ctxPath + "/flow/nextProcessActivity.do",
							method : 'post',
							waitMsg : '正在提交处理，请稍等',
							scope : this,
							params : {
								taskId : taskId,
								signalName : 'to重新发起',
								activityName : activityName,
								destName : '重新发起',
								status : '撤回',
								isBack : true,
								flowAssignId : preUserId
							},
							success : function(fp, action) {
								Ext.ux.Toast.msg('操作信息', '退回上一步成功！');
								Ext.getCmp('ArchivesIssueGrid').getStore()
										.reload();
								refreshTaskPanelView();
							},
							failure : function(fp, action) {
								Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
							}
						});
			}
		}
	})
}