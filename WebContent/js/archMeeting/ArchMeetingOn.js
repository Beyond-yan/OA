/**
 * @author:Ropen
 * @class ArchivesView
 * @extends Ext.Panel
 * @description 收文管理
 */
ArchMeetingOn = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		if (_cfg == null) {
			_cfg = {};
		}
		Ext.apply(this, _cfg);
		// 初始化组件
		this.initComponents();
		// 调用父类构造
		ArchMeetingOn.superclass.constructor.call(this, {
					id : 'ArchMeetingOn',
					title : '在办件',
					iconCls : 'menu-arch-controll',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// [Archives]分类ID
	typeId : null,

	// 条件搜索Panel
	searchPanel : null,

	// 数据展示Panel
	gridPanel : null,

	// GridPanel的数据Store
	store : null,

	// 头部工具栏
	topbar : null,

	// 初始化组件
	initComponents : function() {
		var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					height : 70,
					id:'ArchivesRecCtrlSearchForm',
					region : 'north',
					layout : 'form',
					bodyStyle:'padding:5px',
					defaults:{border:false},
					items : [{
						layout:'column',
	                	defaults:{border:false},
	                	items : [{
	                		columnWidth : .31,
			                layout : 'form',
			                defaults : {border:false,anchor:'96%,96%'},
							items :[{
								width:60,
								fieldLabel : '标题',
								name : 'subject',
								xtype : 'textfield'
							}]
	                	}, {
	                		columnWidth : .31,
			                layout : 'form',
			                defaults : {border:false,anchor:'96%,96%'},
							items :[{
								width:60,
								fieldLabel : '召集单位',
								name : 'holdDep',
								xtype : 'textfield'
							}]
	                	}, {
	                		columnWidth : .31,
			                layout : 'form',
			                defaults : {border:false,anchor:'96%,96%'},
							items :[{
								fieldLabel : '当前办理人',
								name : 'assignUserNameSearch',
								xtype : 'textfield'
							}, {
								name : 'startDate',
								xtype : 'hidden',
								id : 'ArchMeetingOnStartDt'
							}, {
								xtype : 'hidden',
								name : 'endDate',
								id:'ArchMeetingOnDate'
							}]		
	                	}]
					}, {
		            	xtype:'panel',
		            	border:false,
		            	layout:'hbox',
		            	layoutConfig:{
		            		pack:'center',
		            		align:'middle'
		            	},
		            	items:[{   
		            		xtype : 'button',
							text : '查询',
							iconCls : 'search',
							handler : this.search.createCallback(this)
						},{
						    xtype:'button',
							text:'重置',
							iconCls:'btn-reseted',
							handler:function(){
							var searchPanel = Ext.getCmp('ArchivesRecCtrlSearchForm');
								searchPanel.getForm().reset();
							}
						},{
							xtype:'hidden',
							name:'toDoType',
							value:1
						}]
					}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/meetingNotice/listFlowMeetingNotice.do",
					baseParams : {
						'toDoType' : 1
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'defId',
								type : 'int'
							}, 'runId', 'taskId', 'taskName', 'activityName','meetingState',
							'runSubject', 'preActivityname','isEnd', 'preUserId', 'preUserName',
							'assignUserId', 'assignUserName', 'noticeId','forkNextUserId',
							'issuerId', 'issuer', 'archCreateTime', 'sendTime','creator',
							'isReply', 'archivesNo', 'orgdepName', 'issuedep','curDepId','curDepName','flowName','dataValue','piid','createDep','creatorDepId']
				});
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});
		// 初始化ColumnModel
		var record_start = 0;
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer({
						  header : "序号",
						  width : 35,
						  renderer:function(value,metadata,record,rowIndex){
						   return record_start + 1 + rowIndex;
						  }
					}), {
						header : 'archiveId',
						dataIndex : 'archiveId',
						hidden : true
					}, {
						header : '标题',
						dataIndex : 'runSubject',
						width: 300,
						renderer : function(value, metadata, record, rowIndex,colIndex){
							metadata.attr = 'style="white-space:normal;"'; 
							var str = '<a href="#"  title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchMeetingOn.detail('+record.data.noticeId+','+record.data.runId+','+record.data.defId+')">'+value+'</a>';
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
						header : '登记人',
						dataIndex : 'creator'
					}, {
						header : '登记部门',
						dataIndex : 'createDep'
					},{
						header : '管理',
						width : 350,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var preUserId=record.data.preUserId;
							var preActivityname = record.data.preActivityname;
							var taskName=record.data.taskName;
							var isEnd=record.data.isEnd;
							var assignUserId=record.data.assignUserId;
							var str = '';
							if(curUserInfo.userId == record.data.forkNextUserId && taskName.toString().indexOf("领导批示") != -1){
								str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingOn.editProcess('
									+record.data.noticeId + ',\'' +record.data.taskId+'\',\''+record.data.activityName+'\',\''+record.data.assignUserId+'\',\'' + record.data.assignUserName + '\',\'' + record.data.meetingState + '\')"><img src="'+__ctxPath +'/images/menus/archive/archives_draft.png" />代处理</a>&nbsp;';
							}
							if (isGranted('_ArchiveReceiveEdit')) {//taskName!="领导批示3"&&
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingOn.edit('
									+record.data.taskId+',\''+record.data.activityName+'\')"><img src="'+__ctxPath +'/images/system/edit.gif" />流程编辑</a>&nbsp;';
							}
							if (isGranted('_ArchiveReceiveWriteOpinion')) {
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingOn.writeOpinion('
									+record.data.runId+','+record.data.defId+',\''+record.data.piid+'\',\''+record.data.runSubject+'\')"><img src="'+__ctxPath +'/images/menus/archive/archives_draft.png" />代填意见</a>&nbsp;';
							}
							if (isGranted('_ArchiveReceiveDel')) {
								if(curUserInfo.isAdmin||curUserInfo.iscommonAdmin||curUserInfo.userId==record.data.issuerId){
								str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingOn.stopProcess('
										+record.data.noticeId+',\''+record.data.runId+'\')"><img src="'+__ctxPath +'/images/newImages/outCaseSearch.png" />删除</a>&nbsp;';}
							}
							if(isGranted('_ArchiveReceiveBack')){
								if(curUserInfo.userId==preUserId||curUserInfo.isAdmin||curUserInfo.iscommonAdmin){
									if(isEnd=="1"){//taskName!="处内拟办"&&
										if(taskName!="重新登记"&&preActivityname!="退回"&&preActivityname!="撤回"&&preActivityname!="流程编辑"&&taskName.toString().indexOf("领导批示")==-1&&taskName.toString().indexOf("处室内勤")==-1){
										str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingOn.backProcess('
												+record.data.taskId+',\''+record.data.activityName+'\',\''+record.data.preActivityname+'\','+record.data.preUserId+',\''+record.data.taskName+'\','+record.data.assignUserId+')"><img src="'+__ctxPath +'/images/btn/flow/changeTask.png" />撤回</a>';
										}
									}else if(isEnd=="0"&&preActivityname!=null&&preActivityname.toString().indexOf("领导批示")==-1){
										if(taskName!="重新登记"&&taskName.toString().indexOf("领导批示")==-1&&taskName.toString().indexOf("处室内勤")==-1&&preActivityname!="退回"&&preActivityname!="撤回"&&preActivityname!="流程编辑"){
										str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingOn.backProcess('
												+record.data.taskId+',\''+record.data.activityName+'\',\''+record.data.preActivityname+'\','+record.data.preUserId+',\''+record.data.taskName+'\','+record.data.assignUserId+')"><img src="'+__ctxPath +'/images/btn/flow/changeTask.png" />撤回</a>';
										}
									}
								}
							}
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingOn.proDetail('
								+record.data.runId+','+record.data.defId+',\''+record.data.piid+'\',\''+record.data.runSubject+'\')"><img src="'+__ctxPath +'/images/btn/flow/view.png" />流程信息</a>&nbsp;';
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
					id : 'ArchMeetingOnGrid',
					region : 'center',
					stripeRows : true,
					//tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
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
								doLoad : function(start){
							   		  record_start = start;
							          var o = {}, pn = this.getParams();
							          o[pn.start] = start;
							          o[pn.limit] = this.pageSize;
							          this.store.load({params:o});
								}
							})
				});

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
	//行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-archives-detail' :
				ArchMeetingOn.detail(record.data.archiveId,record.data.runId,record.data.defId);
				break;
			case 'btn-flowView' :
				ArchMeetingOn.proDetail(record.data.runId,record.data.defId,record.data.piid,record.data.runSubject);
				break;
			case 'btn-edit' :
				ArchMeetingOn.edit(record.data.taskId,record.data.activityName);
				break;
			case 'menu-holiday' :
				ArchMeetingOn.stopProcess(record.data.archiveId,record.data.piid);
				break;
			case 'btn-changeTask' :
				ArchMeetingOn.backProcess(record.data.taskId,record.data.activityName,record.data.activityName,record.data.issuerId,record.data.runSubject,record.data.assignUserId);
				break;
			default :
				break;
		}
	}
});

/**
 * 展示公文详细信息
 * 
 * @param {}
 *          
 */
ArchMeetingOn.detail = function(editId,runId,defId) {
	var isGranted=false;
	if(curUserInfo.isOfficeStaffRole||curUserInfo.isAdmin||curUserInfo.isArchivesManager)
		{
		  isGranted=true;
		}
	new ArchMeetingDetailView({
				noticeId : editId,
				runId: runId,
				defId: defId,
				isGranted:isGranted
			}).show();
}

/**
 * 
 * 流程编辑功能
 * @param {}
 *  
 */
ArchMeetingOn.edit = function(taskId,activityName) {
	new ArchivesFreeJumpWin({
				taskId: taskId,
				activityName:activityName
			}).show();
}

/**
 * 展示公文子收文明细
 * 
 * @param {}
 *            
 */
ArchMeetingOn.subDetail = function(editId) {
	new ArchSubDetailForm({
				parentArchId : editId
			}).show();
}

//代处理
ArchMeetingOn.editProcess = function(noticeId, taskId, activityName, assignee, assigneeName, meetingState) {
	new ArchMeetingActForWin({
		noticeId: noticeId,
		taskId: taskId,
		activityName:activityName,
		assignee : assignee,
		assigneeName : assigneeName,
		meetingState : meetingState
	}).show();
}

/**
 * 显示明细
 * 
 * @param {}
 */
ArchMeetingOn.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}

/**
 * 代填意见
 * 
 * @param {}
 */
ArchMeetingOn.writeOpinion = function(runId, defId, piId, name) {
	 new ArchivesWriteOpionView({
				runId : runId
			}).show();
}

/**
 * 
 * 删除流程
 * @param {}
 */
ArchMeetingOn.stopProcess = function(editId, runId) {
	Ext.Msg.confirm('提示', '确定删除该流程？', function(btn, text) {
				if (btn == 'yes') {
					// 终止流程
					Ext.Ajax.request({
								url : __ctxPath + '/meetingNotice/cancelFlowMeetingNotice.do',
								params : {
									'runId' : runId
								},
								method : 'post',
								success : function(resp, options) {
									Ext.ux.Toast.msg('操作信息', '操作成功');
									Ext.getCmp('ArchMeetingOnGrid').getStore().reload()
								},
								failure : function(response) {
									Ext.Msg.alert("提示", "终止失败！");
								}
							});
				}
			})
}

/**
 * 
 * 撤回流程
 * @param {}
 */
ArchMeetingOn.backProcess = function(taskId,activityName,preActivityname,preUserId,taskName,assignUserId) {
	Ext.Msg.confirm('提示', '确定撤回该流程？', function(btn, text) {
				if (btn == 'yes') {
						// 撤回流程
				var form=Ext.getCmp('ArchivesRecCtrlSearchForm').getForm();
				if(preActivityname.toString().indexOf("收文登记")==-1){
						Ext.Ajax.request({
						url : __ctxPath + '/flow/getPreviousStepProcessRun.do',
						params : {
							'taskId' : taskId
						},
						method:'post',
						success : function(response, options) {
							var processForm = Ext.util.JSON.decode(response.responseText).data;
							var prevSignalName  = processForm[0].signalName;
							var prevDestName  = processForm[0].activityName;
							var prevFlowAssignId =  processForm[0].creatorId; 
							var isForkFlow =  processForm[0].isForkFlow; 
							var params={
								taskId : taskId,
								signalName : prevSignalName,
								activityName : activityName,
								destName : prevDestName,
								isForkFlow:isForkFlow,
								status : '撤回',
								isBack : true
							};
							if(preActivityname=="领导批示"&&curUserInfo.depName=="公路局"){
								Ext.apply(params,{
									signUserIds:curUserInfo.userId,
									niBanUid:assignUserId
								});
							}else{
								Ext.apply(params,{
									flowAssignId : prevFlowAssignId
								});
							}
							form.submit({
									url:__ctxPath+ "/flow/nextProcessActivity.do",
									method:'post',
									waitMsg:'正在提交处理，请稍等',
									scope:this,
									params:params,
									success : function(fp, action) {
										Ext.ux.Toast.msg('操作信息','撤回上一步成功！');
										Ext.getCmp('ArchMeetingOnGrid').getStore().reload();
										refreshTaskPanelView();
									},
									failure : function(fp, action) {
										Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
									}
								});
						},
						failure : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '撤回出错，请联系管理员！');
							}
						});
					}else{
						form.submit({
								url:__ctxPath+ "/flow/nextProcessActivity.do",
								method:'post',
								waitMsg:'正在提交处理，请稍等',
								params:{
										taskId : taskId,
										signalName : 'to 重新登记',
										activityName : activityName,
										destName:'重新登记',
										status: '撤回',
										isBack : true,
										flowAssignId: preUserId
								},
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息','成功保存！');
									Ext.getCmp('ArchMeetingOnGrid').getStore().reload();
									var appHomeTaskGrid=Ext.getCmp('TaskPanelView');
									if(appHomeTaskGrid!=null){
										appHomeTaskGrid.getUpdater().update(__ctxPath+ '/flow/displayTask.do');
									}
								},
								failure : function(fp, action) {
									Ext.Msg.alert("提示", "撤回失败！");
								}
							});
					}
				}
			})
}