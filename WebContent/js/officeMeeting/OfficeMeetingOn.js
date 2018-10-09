/**
 * @author:Ropen
 * @class ArchivesView
 * @extends Ext.Panel
 * @description 主任办公会管理
 */
OfficeMeetingOn = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		if (_cfg == null) {
			_cfg = {};
		}
		Ext.apply(this, _cfg);
		// 初始化组件
		this.initComponents();
		// 调用父类构造
		OfficeMeetingOn.superclass.constructor.call(this, {
					id : 'OfficeMeetingOn',
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
					height : 60,
					id:'OfficeMeetingOnSearchForm',
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
								width:200,
								fieldLabel : '标题',
								name : 'subject',
								xtype : 'textfield'
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
							var searchPanel = Ext.getCmp('OfficeMeetingOnSearchForm');
								searchPanel.getForm().reset();
							}
						},{
							xtype:'hidden',
							name:'archiveType',
							value:7
						},{
							xtype:'hidden',
							name:'toDoType',
							value:5
						}]
					}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/flow/officeMeetinglistFlowTaskReport.do",
					baseParams : {
						'archiveType' : 7,
						'toDoType' : 5
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'defId',
								type : 'int'
							}, 'runId', 'taskId', 'taskName', 'activityname',
							'runSubject', 'preActivityname','isEnd', 'preUserId', 'preUserName',
							'assignUserId', 'assignUserName', 'archiveId', 'currentStep', 'chuzhangUserId','bangongshiUserId','fenguanUserId',
							'issuerId', 'issuer', 'archCreateTime', 'sendTime',
							'isReply', 'archivesNo', 'orgdepName', 'issuedep','curDepId','curDepName','flowName','dataValue','piid','creatorDepName','creatorDepId']
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
							var str = '<a href="#"  title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="OfficeMeetingOn.detail('+record.data.archiveId+','+record.data.runId+','+record.data.defId+')">'+value+'</a>';
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
						dataIndex : 'issuer'
					}, {
						header : '登记部门',
						dataIndex : 'creatorDepName'
					}, {
						header : '登记时间',
						dataIndex : 'archCreateTime',
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var d = new Date(value);
					        var s = Ext.util.Format.date(d, 'Y-m-d');
					        return s;
						}
					} ,{
						header : '管理',
						width : 350,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var preUserId=record.data.preUserId;
							var preActivityname = record.data.preActivityname;
							var taskName=record.data.taskName;
							var isEnd=record.data.isEnd;
							var assignUserId=record.data.assignUserId;
							var taskName = record.data.taskName;
							var currentStep = record.data.currentStep;
							var str = '';
							if (isGranted('_ArchiveReceiveEdit')) {//taskName!="领导批示3"&&
								str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="OfficeMeetingOn.edit('
									+record.data.taskId+',\''+record.data.activityname+'\')"><img src="'+__ctxPath +'/images/system/edit.gif" />流程编辑</a>&nbsp;';
							}
							if (isGranted('_ArchiveReceiveWriteOpinion')) {
								str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="OfficeMeetingOn.writeOpinion('
									+record.data.runId+','+record.data.defId+',\''+record.data.piid+'\',\''+record.data.runSubject+'\')"><img src="'+__ctxPath +'/images/menus/archive/archives_draft.png" />代填意见</a>&nbsp;';
							}
							if (isGranted('_ArchiveReceiveDel')) {
								if(curUserInfo.isAdmin||curUserInfo.iscommonAdmin||curUserInfo.userId==record.data.issuerId){
								str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="OfficeMeetingOn.stopProcess('
										+record.data.archiveId+',\''+record.data.piid+'\')"><img src="'+__ctxPath +'/images/newImages/outCaseSearch.png" />删除</a>&nbsp;';}
							}
							if(currentStep < 5 && currentStep != 2 && currentStep != 0 && ((curUserInfo.userId==record.data.issuerId) || (curUserInfo.userId==record.data.chuzhangUserId && currentStep >2) || (curUserInfo.userId==record.data.fenguanUserId && currentStep >3))){
								str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="OfficeMeetingOn.backProcess('
									+record.data.taskId+',\''+record.data.activityname+'\',' + record.data.issuerId + ',\'' + record.data.fenguanUserId + '\',\'' + record.data.chuzhangUserId + '\',' 
									+ record.data.assignUserId + ',' + currentStep + ')"><img src="'+__ctxPath +'/images/btn/flow/changeTask.png" />撤回</a>';
							}
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="OfficeMeetingOn.proDetail('
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
					id : 'OfficeMeetingOnGrid',
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
				OfficeMeetingOn.detail(record.data.archiveId,record.data.runId,record.data.defId);
				break;
			case 'btn-flowView' :
				OfficeMeetingOn.proDetail(record.data.runId,record.data.defId,record.data.piid,record.data.runSubject);
				break;
			case 'btn-edit' :
				OfficeMeetingOn.edit(record.data.taskId,record.data.activityname);
				break;
			case 'menu-holiday' :
				OfficeMeetingOn.stopProcess(record.data.archiveId,record.data.piid);
				break;
			case 'btn-changeTask' :
				OfficeMeetingOn.backProcess(record.data.taskId,record.data.activityname,record.data.activityname,record.data.issuerId,record.data.runSubject,record.data.assignUserId);
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
OfficeMeetingOn.detail = function(editId,runId,defId) {
	var isGranted=false;
	if(curUserInfo.isOfficeStaffRole||curUserInfo.isAdmin||curUserInfo.isArchivesManager)
		{
		  isGranted=true;
		}
	new ArchDetailView({
				archivesId : editId,
				runId: runId,
				defId: defId,
				archType:7,
				isGranted:isGranted
			}).show();
}

/**
 * 
 * 流程编辑功能
 * @param {}
 *  
 */
OfficeMeetingOn.edit = function(taskId,activityname) {
	new OfficeMeetingChangeTaskWin({
				taskId: taskId,
				activityName:activityname
			}).show();
}

/**
 * 展示公文子收文明细
 * 
 * @param {}
 *            
 */
OfficeMeetingOn.subDetail = function(editId) {
	new ArchSubDetailForm({
				parentArchId : editId
			}).show();
}

/**
 * 显示明细
 * 
 * @param {}
 */
OfficeMeetingOn.proDetail = function(runId, defId, piId, name) {
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
OfficeMeetingOn.writeOpinion = function(runId, defId, piId, name) {
	 new ArchivesWriteOpionView({
				runId : runId
			}).show();
}

/**
 * 
 * 删除流程
 * @param {}
 */
OfficeMeetingOn.stopProcess = function(editId, piId) {
	Ext.Msg.confirm('提示', '确定删除该流程？', function(btn, text) {
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
									refreshTaskPanelView();
									if(Ext.getCmp('OfficeMeetingTimesGrid') != null){
										Ext.getCmp('OfficeMeetingTimesGrid').getStore().reload();
									}
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
OfficeMeetingOn.backProcess = function(taskId,activityName,issuerId, fenguanUserId, chuzhangUserId,assignUserId,currentStep) {
	var currentUserId = curUserInfo.userId;
	Ext.Msg.confirm('提示', '确定执行撤回操作？', function(btn, text) {
		if (btn == 'yes') {
						// 撤回流程
			var form=Ext.getCmp('OfficeMeetingOnSearchForm').getForm();
			var params;
			if(currentUserId == issuerId){
				params={
					taskId : taskId,
					signalName : 'to 议题变更',
					activityName : activityName,
					destName : '议题变更',
					status : '撤回',
					flowAssignId:issuerId,
					currentStep : 0
				};
			}else if(currentUserId == chuzhangUserId){
				params={
					taskId : taskId,
					signalName : 'to 处长审核',
					activityName : activityName,
					destName : '处长审核',
					status : '撤回',
					flowAssignId : chuzhangUserId,
					currentStep : 1
				};
			}else if(currentUserId == fenguanUserId){
				params={
					taskId : taskId,
					signalName : 'to 分管领导审核',
					activityName : activityName,
					destName : '分管领导审核',
					status : '撤回',
					flowAssignId : fenguanUserId,
					currentStep : 3
				};
			}
			if(currentStep == 1){
				Ext.apply(params,{
					chuzhangUserId : assignUserId
				});
			}else if(currentStep == 3){
				Ext.apply(params,{
					fenguanUserId : assignUserId
				});
			}else if(currentStep == 4){
				Ext.apply(params,{
					bangongshiUserId : assignUserId
				});
			}
			form.submit({
				url:__ctxPath+ "/flow/nextProcessActivity.do",
				method:'post',
				waitMsg:'正在提交处理，请稍等',
				scope:this,
				params:params,
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作信息','撤回成功！');
					refreshTaskPanelView();
					if(Ext.getCmp('OfficeMeetingTimesGrid') != null){
						Ext.getCmp('OfficeMeetingTimesGrid').getStore().reload();
					}
				},
				failure : function(fp, action) {
					Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
				}
			});
		}
	})
}


/**
 * 
 * 编辑主任办公会
 * @param {}
 */
OfficeMeetingOn.openOfficeMeetingEditWindow = function(archiveId,defId) {
	new OfficeMeetingEdit(archiveId,defId,1,function(){
		refreshTaskPanelView();
		if(Ext.getCmp('OfficeMeetingTimesGrid') != null){
			Ext.getCmp('OfficeMeetingTimesGrid').getStore().reload();
		}
	});	
}