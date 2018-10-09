ArchMeetingWait = Ext.extend(Ext.Panel, {
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
		ArchMeetingWait.superclass.constructor.call(this, {
					id : 'ArchMeetingWait',
					iconCls : 'menu-arch-dispatch',
					title : '待办件',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					height : 70,
					id:'ArchDispatchSearchForm',
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
	                	},{
	                		columnWidth : .31,
			                layout : 'form',
			                defaults : {border:false,anchor:'96%,96%'},
							items :[{
								width:60,
								fieldLabel : '召集单位',
								name : 'holdDep',
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
							var searchPanel = Ext.getCmp('ArchDispatchSearchForm');
								searchPanel.getForm().reset();
							}
						},{
							xtype:'hidden',
							name:'toDoType',
							value:0
						}]
					}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/meetingNotice/listFlowMeetingNotice.do",
					baseParams : {
						'toDoType' : 0
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'defId',
								type : 'int'
							}, 'runId', 'taskId', 'taskName', 'activityName','forkNextUserId',
							'runSubject', 'preActivityname', 'preUserId', 'preUserName',
							'assignUserId', 'assignUserName', 'noticeId',
							'issuerId', 'issuer', 'meetingDate', 'sendTime',
							'isReply', 'archivesNo', 'orgdepName', 'issuedep','curDepId','curDepName','flowName','dataValue','piid','creatorDepName','creatorDepId']
				});
		//this.store.setDefaultSort('archCreateTime', 'desc');
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

		this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 64,
					actions : [{
								iconCls : 'menu-archive-draft',
								text : '代填意见',
								qtip : '代填意见',
								style : 'margin:4px 3px 4px 3px'
							},{
								iconCls : 'btn-archives-detail',
								text : '公文信息',
								qtip : '公文信息',
								style : 'margin:4px 3px 4px 3px'
							},/*{
								iconCls : 'menu-public-fol',
								text : '处理任务',
								qtip : '处理任务',
								style : 'margin:4px 3px 4px 3px'
							},*/{
								iconCls : 'btn-flowView',
								qtip : '流程信息',
								text : '流程信息',
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
						  renderer:function(value,metadata,record,rowIndex){
						   return record_start + 1 + rowIndex;
						  }
					}), {
						header : 'noticeId',
						dataIndex : 'noticeId',
						hidden : true
					}, {
						header:'piid',
						dataIndex:'piid',
						hidden:true
					},{
						header : '标题',
						dataIndex : 'runSubject',
						width:300,
						renderer : function(value, metadata, record, rowIndex,colIndex){
							metadata.attr = 'style="white-space:normal;"'; 
//							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchMeetingWait.detail('+record.data.noticeId+','+record.data.runId+','+record.data.defId+')">'+value+'</a>';
//							return str;
							var str = '<a href="#"  title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchMeetingWait.nextStep('+record.data.taskId+','+record.data.runId+',\''+record.data.activityName+'\',\''+record.data.taskName+'\')">'+value+'</a>';
							return str;
						}
					}, {
						header : '上一个处理人',
						width : 40,
						dataIndex : 'preUserName'
					}, {
						header : '会议日期',
						width : 40,
						dataIndex : 'meetingDate',
						renderer : function(value){
							if(value != null && value != ''){
								return new Date(value).format('Y-m-d H:i:s');
							}else{
								return '';
							}
						}
					} ,{
						header : '管理',
						width : 100,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var str = '';
							if(curUserInfo.userId == record.data.forkNextUserId){
								str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingWait.sendSms('
									+record.data.noticeId + ',\'' +record.data.runId+'\')"><img src="'+__ctxPath +'/images/menus/archive/archives_draft.png" />发送短信</a>&nbsp;';
							}
							if (isGranted('_ArchDispathWriteOpinion')) {
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingWait.writeOpinion('
									+record.data.runId+','+record.data.defId+',\''+record.data.piid+'\',\''+record.data.runSubject+'\')"><img src="'+__ctxPath +'/images/menus/archive/archives_draft.png" />代填意见</a>&nbsp;';
							}
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingWait.detail('
								+record.data.noticeId+','+record.data.runId+','+record.data.defId+')"><img src="'+__ctxPath +'/images/btn/archive/archives_detail.png" />公文信息</a>&nbsp;';
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingWait.proDetail('
								+record.data.runId+','+record.data.defId+',\''+record.data.piid+'\',\''+record.data.runSubject+'\')"><img src="'+__ctxPath +'/images/btn/flow/view.png" />流程信息</a>&nbsp;';
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchMeetingWaitGrid',
					region : 'center',
					stripeRows : true,
					//tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					plugins : this.rowActions,
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
								doLoad : function(start){
							   		  record_start = start;
							          var o = {}, pn = this.getParams();
							          o[pn.start] = start;
							          o[pn.limit] = this.pageSize;
							          this.store.load({params:o});
								}
							})
				});

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
							});
				});
		this.rowActions.on('action',this.onRowAction, this);
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
			case 'btn-flowView' :
				ArchMeetingWait.proDetail(record.data.runId,record.data.defId,record.data.piid,record.data.runSubject);
				break;
			case 'menu-public-fol' :
				ArchMeetingWait.nextStep(record.data.taskId,record.data.activityname,record.data.taskName);
				break;
			case 'btn-archives-detail' :
				ArchMeetingWait.detail(record.data.noticeId,record.data.runId,record.data.defId);
				break;
			case 'menu-archive-draft':
				ArchMeetingWait.writeOpinion(record.data.runId,record.data.defId,record.data.piid,record.data.runSubject);
				break;
			default :
				break;
		}
	}
});

ArchMeetingWait.detail = function(editId,runId,defId) {
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
 * 显示明细
 * 
 */
ArchMeetingWait.proDetail = function(runId, defId, piId, name) {
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
ArchMeetingWait.writeOpinion = function(runId, defId, piId, name) {
	 new ArchivesWriteOpionView({
		 		type : 1,
				runId : runId
			}).show();
}

/**
 * 发送短信
 * 
 * @param {}
 */
ArchMeetingWait.sendSms = function(noticeId, runId) {
	var deptWin=new Ext.Window({
		id:'leaderSmsSendForm',
		autoScroll:true,
		iconCls:'btn-flow-chart',
		bodyStyle:'background-color:white',
		maximizable : true,
		title:'发送短信',
		width:400,
		height:400,
		plain : true,
		modal : true,
		layout:'fit'
	});	
	deptWin.show();
	deptWin.load({
        url :__ctxPath+ '/meetingNotice/getLeaderInfoMeetingNotice.do?noticeId='+noticeId+ '&runId='+runId + '&rand=' + Math.random(),   
        params : { 
        	couId : 'task',   
            subMainId : "tab-task-main"
        },   
        scripts: true  
    });   
}
/**
 * 下一步的任务
 * @param {} taskdbid
 */
ArchMeetingWait.nextStep=function(taskId,runId,activityName,taskName){
	var contentPanel=App.getContentPanel();
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
            var formView=contentPanel.getItem('ProcessNextForm'+taskId);
            if(formView==null){
                formView=new ProcessNextForm({taskId:taskId,activityName:activityName, taskName:taskName,runId:runId});
                contentPanel.add(formView);
            }
            contentPanel.activate(formView);

        },
        failure : function(fp, action) {
            Ext.ux.Toast.msg('操作信息', '当前网络繁忙，请刷新后操作！');
        }
    });

	// var formView=contentPanel.getItem('ProcessNextForm'+taskId);
	// if(formView==null){
	// 	formView=new ProcessNextForm({taskId:taskId,activityName:activityName, taskName:taskName,runId:runId});
	// 	contentPanel.add(formView);
	// }
	// contentPanel.activate(formView);
};
refeshTaskPanelView3();
function refeshTaskPanelView3(){
 	setTimeout(function(){
 		var grid = Ext.getCmp('ArchMeetingWaitGrid'); // auditwuGrid 是grid 的id                                         
 		grid.store.reload();
 		refeshTaskPanelView3();
	},60*1000);
}
