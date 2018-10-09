Ext.ns('ArchivesDraftManage');

/**
 * @author:Ropen
 * @class ArchivesDraftManage
 * @extends Ext.Panel
 * @description 拟稿管理
 */
ArchivesDraftManage = Ext.extend(Ext.Panel, {
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
		ArchivesDraftManage.superclass.constructor.call(this, {
					id : 'ArchivesDraftManage',
					iconCls : 'menu-archive-draft-manage',
					title : '待办件',
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
			height : 88,
			region : 'north',
			frame : false,
			id : 'ArchivesDraftManageSearchForm',
			layout : 'form',
			bodyStyle : 'padding:5px',
			defaults : {
				border : false
			},
			items : [{
						name : 'startDate',
						xtype : 'hidden',
						id : 'DBsentStoredStartDt'
					}, {
						xtype : 'hidden',
						name : 'endDate',
						id : 'DBsentStoredendDate'
					}, {
						layout : 'column',
						defaults : {
							border : false
						},
						items : [/*{
							columnWidth : .24,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '稿笺名称',
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
											+ '/flow/comQuickProDefinition.do?typeId=1205686',
									fields : ['id', 'name']
								})
							}]
						},*/ {
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
						},{
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
						}, {
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [/*{
								fieldLabel : '拟稿部门',
								width : 180,
								xtype : 'combo',
								hiddenName : 'issuerDepId',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/system/select3ByComboDepartment.do?depId=100130',
									fields : ['id', 'name'],
									baseParams : {
										start : 0,
										limit : 10000
									}
								})
							}*/new TreeSelector('depTreeSelector2', _url, '拟稿部门',
									'issuerDepId', true)]
						},{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{

								width : 60,
								//id : 'sentStoredsnConfigId',
								fieldLabel : '编号办法',
								hiddenName : 'snConfigId',
								xtype : 'combo',
								editable : false,
								mode:'local',
								triggerAction : 'all',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/snconfig/signComboFileSnConfig.do?snType=0',
									fields : ['id', 'name'],
									baseParams : {
										start : 0,
										limit : 10000
									}
								})
							}]
						} ,{
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '年份',
								width : 60,
								xtype : 'combo',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : arr,
								emptyText : '---年份---',
								listeners : {
									select : function() {
										Ext
												.getCmp('DBsentStoredStartDt')
												.setValue((this.getValue() + '-01-01'));
										Ext
												.getCmp('DBsentStoredendDate')
												.setValue(Ext.util.Format
														.substr(
																this.getValue(),
																0, 4)
														+ '-12-31');
									}
								}
							}]
						}, {
							columnWidth : .3,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										width : 130,
										//id : 'sentStoredArchivesNo',
										fieldLabel : '发文编号',
										name : 'archiveNo',
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
												.getCmp('ArchivesDraftManageSearchForm');
										searchPanel.getForm().reset();
									}
								}]
					}, {
						xtype : 'hidden',
						name : 'archiveType',
						value : 0
					}, {
						xtype : 'hidden',
						name : 'toDoType',
						value : 0
					}, {
						xtype : 'hidden',
						name : 'issuerDepId',
						id : 'issuerDepId'
					}]
		});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/flow/listFlowTaskReport.do",
					baseParams : {
						'archiveType' : 0,
						'toDoType' : 0
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'defId',
								type : 'int'
							}, 'runId', 'taskId', 'taskName', 'activityname',
							'runSubject', 'preActivityname', 'preUserId',
							'preUserName', 'preDepName', 'assignUserId',
							'assignUserName', 'archiveId', 'issuerId',
							'issuer', 'archCreateTime', 'sendTime', 'isReply',
							'archivesNo', 'orgdepName', 'issuedep', 'curDepId',
							'curDepName', 'flowName', 'dataValue', 'piid',
							'creatorDepName', 'creatorDepId','isComSetting','flowName']
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
					width : 120,
					actions : [{
								iconCls : 'btn-archives-detail',
								text : '公文信息',
								qtip : '公文信息',
								style : 'margin:4px 3px 4px 3px'
							},/*
								 * { iconCls : 'menu-public-fol', text : '处理任务',
								 * qtip : '处理任务', style : 'margin:4px 3px 4px
								 * 3px' },
								 */{
								iconCls : 'btn-flowView',
								qtip : '流程信息',
								text : '流程信息',
								style : 'margin:4px 3px 4px 3px'
							},{
								iconCls : 'btn-edit',
								qtip : '流程编辑',
								text : '流程编辑',
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
						width : 300,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							metadata.attr = 'style="white-space:normal;"'; 
							// var str = '<a href="#"
							// style="text-decoration:none;color:#0358A3"
							// onMouseOver = "this.style.color =\'red\'"
							// onMouseOut = "this.style.color=\'#0358A3\'"
							// onclick="ArchivesDraftManage.detail('+record.data.archiveId+','+record.data.runId+','+record.data.defId+')">'+value+'</a>';
							// return str;
									var str='';
									if(record.data.isComSetting==1){
										str+='<img src="'+__ctxPath +'/images/system/flower.png" style="height:12px;width:13px;"/>'
									}
							 str += '<a href="#"  title="'+value+'"'+' style="text-decoration:none;color:#0358A3"  onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchivesDraftManage.nextStep('
									+ record.data.taskId
									+ ',\''
									+ record.data.activityname
									+ '\',\''
									+ record.data.taskName
									+ '\')">'
									+ value
									+ '</a>';
							return str;
						}
					}, {
						header : '上一个办理人',
						width : 60,
						dataIndex : 'preUserName'
					}, {
						header : '上一个办理部门',
						width : 65,
						dataIndex : 'preDepName'
					}, {
						header : '拟稿人',
						width : 40,
						dataIndex : 'issuer'
					}, {
						header : '拟稿部门',
						width : 60,
						dataIndex : 'creatorDepName'
					}, {
						header : '拟稿时间',
						width : 60,
						dataIndex : 'archCreateTime'
					}, {
						header : 'keywords',
						dataIndex : 'keywords',
						hidden : true
					}, /*this.rowActions,*/ {
						header : '管理',
						width : 250,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var preUserId = record.data.preUserId;
							var preActivityname = record.data.preActivityname;
							var taskName = record.data.taskName;
							var str = '';
							str += '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesDraftManage.detail('
								+ record.data.archiveId
								+ ',\''
								+ record.data.runId
								+ '\',\''
								+ record.data.defId
								+ '\',\''
								+ record.data.flowName
								+ '\')"><img src="'
								+ __ctxPath
								+ '/images/btn/archive/archives_detail.png" />公文信息</a>&nbsp;';
							str += '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesDraftManage.proDetail('
									+ record.data.runId
									+ ','
									+ record.data.defId
									+ ',\''
									+ record.data.piid
									+ '\')"><img src="'
									+ __ctxPath  
									+ '/images/btn/flow/view.png" />流程信息</a>&nbsp;';
							if (isGranted('_ArchivesDraftManageEdit')) {
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesDraftManage.edits('
										+ record.data.taskId
										+ ',\''
										+ record.data.activityname
										+ '\')"><img src="'
										+ __ctxPath
										+ '/images/system/edit.gif" />流程编辑</a>&nbsp;';
							}
						
							return str;
						}
					}],
			defaults : {
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
					id : 'ArchivesDraftGrid',
					region : 'center',
					stripeRows : true,
					// tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
					plugins : this.rowActions,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
					plugins : this.rowActions,
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
		this.rowActions.on('action', this.onRowAction, this);

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
			case 'btn-flowView' :
				ArchivesDraftManage.proDetail(record.data.runId,
						record.data.defId, record.data.piid,
						record.data.runSubject);
				break;
			case 'menu-public-fol' :
				ArchivesDraftManage.nextStep(record.data.taskId,
						record.data.activityname, record.data.taskName);
				break;
			case 'btn-archives-detail' :
				ArchivesDraftManage.detail(record.data.archiveId,
						record.data.runId, record.data.defId);
				break;			
			case 'btn-edit' :
					ArchivesDraftManage.edits(record.data.taskId,
							record.data.activityname);
					break;
			default :
				break;
		}
	},

	/**
	 * 添加记录
	 */
	createRecord : function() {
		new ArchivesDraftView().show();
	}
});
/**
 * 修改
 */
ArchivesDraftManage.edit = function(editId) {
	// 只允许有一个编辑窗口
	new ArchivesDraftWin({
				archivesId : editId
			}).show();
}
/**
 * 
 * 流程编辑功能
 * 
 * @param {}
 * 
 */
ArchivesDraftManage.edits = function(taskId, activityname) {
	new ArchivesFreeJumpWin({
				taskId : taskId,
				activityName : activityname
			}).show();}
/**
 * 编辑草稿
 * 
 * @param {}
 *            editId
 */
ArchivesDraftManage.editDraft = function(editId) {
	var tabs = Ext.getCmp('centerTabPanel');
	var edit = Ext.getCmp('ArchivesDraftView');
	if (edit == null) {
		edit = new ArchivesDraftView({
					archivesId : editId
				});
		tabs.add(edit);
	} else {
		tabs.remove('ArchivesDraftView');
		edit = new ArchivesDraftView({
					archivesId : editId
				});
		tabs.add(edit);
	}
	tabs.activate(edit);
}
/**
 * 显示公文详情
 * 
 * @param {}
 *            editId
 */
ArchivesDraftManage.detail = function(editId, runId, defId, flowName) {
	var flowName1s="委发规范性文件备案材料移交,"
		 +"委发规范性文件备案材料移交1,"
		 +"委发规范性文件审查（备案）材料移交";
	var isGranted=false;
	var winType = null;
	if(curUserInfo.isOfficeStaffRole||curUserInfo.isAdmin||curUserInfo.isArchivesManager)
		{
		  isGranted=true;
		}
	if (flowName1s.indexOf(flowName)!=-1) {
		winType = 'wfba';
	}
	new ArchDetailView({
				archivesId : editId,
				runId : runId,
				defId : defId,
				archType : 0,
				isGranted:isGranted,
				winType:winType
			}).show();
}

/**
 * 显示明细
 * 
 */
ArchivesDraftManage.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}
/**
 * 下一步的任务
 * 
 * @param {}
 *            taskdbid
 */
ArchivesDraftManage.nextStep = function(taskId, activityName, taskName) {
	var contentPanel = App.getContentPanel();
	if (taskName.indexOf('--') >= 0) {
		taskName = taskName.substring(0, taskName.indexOf('--'));
	}
	for (var i = 0; i < contentPanel.items.length; i++) {
		if (contentPanel.getItem(i).title == taskName) {
			var formView = contentPanel.getItem(i);
			contentPanel.activate(formView);
			Ext.ux.Toast.msg("操作提示", "请先处理上一个同类型的任务！");
			return;
		}
	}
    // 先判断任务是否存在
    Ext.Ajax.request({
        url : __ctxPath + "/flow/queryTaskProcessActivity.do",
        params : {
            taskId : taskId
        },
        method : 'POST',
        success : function(fp, action) {
            var jsonResult = JSON.parse(fp.responseText);
            if (!jsonResult || jsonResult.success != "true") {
                if (jsonResult.code && jsonResult.code == "-1") {
                    Ext.MessageBox.show({
                        title : '操作信息',
                        msg : '该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！',
                        buttons : Ext.MessageBox.OK,
                        icon : Ext.MessageBox.WARNING
                    });
                    refreshTaskPanelView();
                    return;
                }
            }

            // 执行打开审批操作界面
            var formView = contentPanel.getItem('ProcessNextForm' + taskId);
            if (formView == null) {
                formView = new ProcessNextForm({
                    taskId : taskId,
                    activityName : activityName,
                    taskName : taskName
                });
                contentPanel.add(formView);
            }
            contentPanel.activate(formView);

        },
        failure : function(fp, action) {
            Ext.ux.Toast.msg('操作信息', '当前网络繁忙，请刷新后操作！');
        }
    });



	// var formView = contentPanel.getItem('ProcessNextForm' + taskId);
	// if (formView == null) {
	// 	formView = new ProcessNextForm({
	// 				taskId : taskId,
	// 				activityName : activityName,
	// 				taskName : taskName
	// 			});
	// 	contentPanel.add(formView);
	// }
	// contentPanel.activate(formView);
}
refeshTaskPanelView2();
function refeshTaskPanelView2(){
 	setTimeout(function(){
 		var grid = Ext.getCmp('ArchivesDraftGrid'); // auditwuGrid 是grid 的id                                         
 		grid.store.reload();
 		refeshTaskPanelView2();
	},60*1000);
}
