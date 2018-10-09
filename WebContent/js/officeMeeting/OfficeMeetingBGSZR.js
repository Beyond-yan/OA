OfficeMeetingBGSZR = Ext.extend(Ext.Panel, {
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
		OfficeMeetingBGSZR.superclass.constructor.call(this, {
					id : 'OfficeMeetingBGSZR',
					iconCls : 'menu-arch-dispatch',
					title : '办公室主任审核',
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
					height : 60,
					id:'OfficeMeetingBGSZRSearchForm',
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
							},{
								xtype : "hidden",
								name : "timesId",
								id : "OfficeMeetingBGSZR.timesId"
							}]
	                	},{
							layout:'column',
		                	defaults:{border:false},
		                	items : [{
		                		columnWidth : .31,
				                layout : 'form',
				                defaults : {border:false,anchor:'96%,96%'},
								items :[{
									xtype : "combo",
									fieldLabel : "期数",
									id : "OfficeMeetingBGSZR.times",
									valueField : 'timesId',
									displayField : 'times',
									editable : false,
									allowBlank : true,
									triggerAction : 'all',
									forceSelection : true,
									width : 200,
									store : new Ext.data.SimpleStore({
											url : __ctxPath + '/meetingTimes/getByTypeMeetingTimes.do?type=1',
											autoLoad : true,
											fields : ['timesId', 'times']
										}),
									listeners : {
										select : function(cbo, record, index) {
											Ext.getCmp('OfficeMeetingBGSZR.timesId')
															.setValue(cbo.getValue());
												}
											}
								}]
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
							var searchPanel = Ext.getCmp('OfficeMeetingBGSZRSearchForm');
								searchPanel.getForm().reset();
							}
						},{
						    xtype:'button',
							text:'批量处理',
							iconCls:'menu-archive-issue',
							id:'sendBgs',
							handler : this.sendBGSBatch.createCallback(this)
						},{
							xtype:'hidden',
							name:'archiveType',
							value:7
						},{
							xtype:'hidden',
							name:'toDoType',
							value:0
						}]
					}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/flow/OfficeMeetingBGSZRlistFlowTaskReport.do",
					baseParams : {},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'defId',
								type : 'int'
							}, 'SUBJECT', 'STATUS', 'YEAR', 'TIMES','PROCESS_INS_ID',
							'ARCHIVESID', 'RUNID', 'DEFID','CURRENTSTEP','URGENTLEVEL','PRIVACYLEVEL',
							'ISSUEDEP','TASKID','ACTIVITY_NAME','bangongshiUserId']
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
							},{
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
						header : 'archiveId',
						dataIndex : 'archiveId',
						hidden : true
					}, {
						header:'piid',
						dataIndex:'piid',
						hidden:true
					},{
						header : '议题编号',
						dataIndex : 'URGENTLEVEL',
						width:80
					},{
						header : '标题',
						dataIndex : 'SUBJECT',
						width:200,
						renderer : function(value, metadata, record, rowIndex,colIndex){
							metadata.attr = 'style="white-space:normal;"'; 
//							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="OfficeMeetingBGSZR.detail('+record.data.archiveId+','+record.data.runId+','+record.data.defId+')">'+value+'</a>';
//							return str;
							var str = '<a href="#"  title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="OfficeMeetingBGSZR.detail('+record.data.ARCHIVESID+','+record.data.PROCESS_INS_ID+','+record.data.DEFID+')">'+value+'</a>';
							return str;
						}
					},{
						header : '提案处室',
						dataIndex : 'ISSUEDEP',
						width:100
					}, {
						header : '议题状态',
						width : 60,
						dataIndex : 'STATUS',
						renderer : function(value, metadata, record, rowIndex,colIndex){
							var activity_name = record.data.ACTIVITY_NAME;
							if(value == '2'){
								return '办结';
							}else{
								return activity_name;
							}
						}
					}, {
						header : '期数',
						width : 100,
						dataIndex : 'PRIVACYLEVEL'
					}, {
						header : '管理',
						width : 100,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var str =  '';
							if(record.data.STATUS != 2){
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="OfficeMeetingBGSZR.nextStep('
									+record.data.TASKID+','+record.data.RUNID+',\''+record.data.ACTIVITY_NAME+'\',\''+record.data.ACTIVITY_NAME+'\')"><img src="'+__ctxPath +'/images/system/edit.gif" />处理</a>&nbsp;';
							}
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
					id : 'OfficeMeetingBGSZRGrid',
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
	
	addTimes : function(self) {
		new OfficeMeetingBGSZRAddForm();
	},
	
	setTimes : function(self){
		var grid = Ext.getCmp("OfficeMeetingBGSZRGrid");
		var archivesIds=""
		 if (grid.getSelectionModel().hasSelection()){
			   var records=grid.getSelectionModel().getSelections();
			   for(var i=0; i < records.length; i++){
				   if(records[i].data.STATUS == 2){
					   Ext.MessageBox.show({
							title : '操作信息',
							msg : '请选择未办结的记录进行设置！',
							buttons : Ext.MessageBox.OK,
							icon : 'ext-mb-error'
						});
					   return;
				   }
				   archivesIds += records[i].data['ARCHIVESID'] + ','
			   }
			   new OfficeMeetingBGSZRSetForm(archivesIds.substring(0,archivesIds.length-1));
		 }else{
			 Ext.MessageBox.show({
					title : '操作信息',
					msg : '请选择一条记录！',
					buttons : Ext.MessageBox.OK,
					icon : 'ext-mb-error'
				});
		 }
	},
	
	sendBGSBatch : function(self){
		var grid = Ext.getCmp("OfficeMeetingBGSZRGrid");
		if (grid.getSelectionModel().hasSelection()){
			var records=grid.getSelectionModel().getSelections();
			var archives = new Array();
			for(var i=0; i < records.length; i++){
			   if(records[i].data.CURRENTSTEP != 5){
				   Ext.MessageBox.show({
						title : '操作信息',
						msg : '请选择议题状态为"办公室主任审批"的记录进行发送！',
						buttons : Ext.MessageBox.OK,
						icon : 'ext-mb-error'
					});
				   return;
			   }
			   archives.push(records[i].data);
			}
			new OfficeMeetingBGSZRSendForm(archives);
		 }else{
			 Ext.MessageBox.show({
					title : '操作信息',
					msg : '请选择一条记录！',
					buttons : Ext.MessageBox.OK,
					icon : 'ext-mb-error'
				});
		 }
	},
	
	sendBGS : function(self){
		var grid = Ext.getCmp("OfficeMeetingBGSZRGrid");
		var taskIds=new Array();
		 if (grid.getSelectionModel().hasSelection()){
			   var records=grid.getSelectionModel().getSelections();
			   for(var i=0; i < records.length; i++){
				   if(records[i].data.CURRENTSTEP != 4){
					   Ext.MessageBox.show({
							title : '操作信息',
							msg : '请选择议题状态为"办公室汇总"的记录进行发送！',
							buttons : Ext.MessageBox.OK,
							icon : 'ext-mb-error'
						});
					   return;
				   }
				   if(records[i].data.URGENTLEVEL == null || records[i].data.URGENTLEVEL == "" 
					   || records[i].data.PRIVACYLEVEL == null || records[i].data.PRIVACYLEVEL == ""){
					   Ext.MessageBox.show({
							title : '操作信息',
							msg : '请确认选择的议题中议题编号和期数不为空！',
							buttons : Ext.MessageBox.OK,
							icon : 'ext-mb-error'
						});
					   return;
				   }
				   taskIds.push(records[i].data['TASKID'])
			   }
			   sendBGSForeach(records, taskIds, 0, taskIds.length);
		 }else{
			 Ext.MessageBox.show({
					title : '操作信息',
					msg : '请选择一条记录！',
					buttons : Ext.MessageBox.OK,
					icon : 'ext-mb-error'
				});
		 }
	},
	
	//行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-flowView' :
				OfficeMeetingBGSZR.proDetail(record.data.runId,record.data.defId,record.data.piid,record.data.runSubject);
				break;
			case 'menu-public-fol' :
				OfficeMeetingBGSZR.nextStep(record.data.taskId,record.data.activityname,record.data.taskName);
				break;
			case 'btn-archives-detail' :
				OfficeMeetingBGSZR.detail(record.data.archiveId,record.data.runId,record.data.defId);
				break;
			case 'menu-archive-draft':
				OfficeMeetingBGSZR.writeOpinion(record.data.runId,record.data.defId,record.data.piid,record.data.runSubject);
				break;
			default :
				break;
		}
	}
});

/**
 * 
 * 编辑主任办公会
 * @param {}
 */
OfficeMeetingBGSZR.openOfficeMeetingEditWindow = function(archiveId,defId) {
	new OfficeMeetingEdit(archiveId,defId,1,function(){
		refreshTaskPanelView();
		if(Ext.getCmp('OfficeMeetingBGSZRGrid') != null){
			Ext.getCmp('OfficeMeetingBGSZRGrid').getStore().reload();
		}
	});	
}

OfficeMeetingBGSZR.detail = function(editId,runId,defId) {
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

OfficeMeetingBGSZR.setTimesSingle = function(archivesId) {
	new OfficeMeetingBGSZRSetForm(archivesId);
}

OfficeMeetingBGSZR.setNumberSingle = function(archivesId) {
	new OfficeMeetingNumberSetForm(archivesId);
}

/**
 * 显示明细
 * 
 */
OfficeMeetingBGSZR.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}

OfficeMeetingBGSZR.stopProcess = function(editId, piId) {
	Ext.Msg.confirm('提示', '确定终止该流程？', function(btn, text) {
				if (btn == 'yes') {
					// 终止流程
					Ext.Ajax.request({
								url : __ctxPath + '/flow/stopProcessRun.do',
								params : {
									'piId' : piId
								},
								success : function(resp, options) {
									Ext.ux.Toast.msg('操作信息', '操作成功');
									Ext.getCmp('OfficeMeetingBGSZRGrid')
											.getStore().reload()
								},
								failure : function(response) {
									Ext.Msg.alert("提示", "终止失败！");
								}
							});
					// 修改数据库的审核状态
					Ext.Ajax.request({
								url : __ctxPath + '/archive/updateStaArchives.do',
								params : {
									'archivesId' : editId
								},
								success : function(resp, options) {
									Ext.getCmp('OfficeMeetingBGSZRGrid')
											.getStore().reload();
								}
							});
				}
			})
}
/**
 * 代填意见
 * 
 * @param {}
 */
OfficeMeetingBGSZR.writeOpinion = function(runId, defId, piId, name) {
	 new ArchivesWriteOpionView({
		 		type : 1,
				runId : runId
			}).show();
}
/**
 * 下一步的任务
 * @param {} taskdbid
 */
OfficeMeetingBGSZR.nextStep=function(taskId,runId,activityName,taskName){
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
                    if(Ext.getCmp('OfficeMeetingBGSZRGrid') != null){
						Ext.getCmp('OfficeMeetingBGSZRGrid').getStore().reload();
					}
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
 		var grid = Ext.getCmp('OfficeMeetingBGSZRGrid'); // auditwuGrid 是grid 的id                                         
 		grid.store.reload();
 		refeshTaskPanelView3();
	},60*1000);
}

function sendBGSForeach(records, taskIds, index, max){
	if(index == max){
		return;
	}
	var form=Ext.getCmp('OfficeMeetingBGSZRSearchForm').getForm();
	var params = {
		taskId : taskIds[index],
		signalName : 'to 办公室主任审批',
		activityName : '办公室汇总',
		destName : '办公室主任审批',
		currentStep : 5,
		bangongshiUserId : curUserInfo.userId,
		bangongshiResult : 1
	};
   var subject = "[" + records[index].data.SUBJECT + "]";
   form.submit({
		url:__ctxPath+ "/flow/nextProcessActivity.do",
		method:'post',
		waitMsg:'正在发送' + subject + '，请稍等...',
		scope:this,
		params:params,
		success : function(fp, action) {
			Ext.ux.Toast.msg('操作信息',subject + '发送成功！');
			refreshTaskPanelView();
			if(Ext.getCmp('OfficeMeetingBGSZRGrid') != null){
				Ext.getCmp('OfficeMeetingBGSZRGrid').getStore().reload();
			}
			index++;
			sendBGSForeach(records,taskIds,index,max);
		},
		failure : function(fp, action) {
			Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
			refreshTaskPanelView();
			if(Ext.getCmp('OfficeMeetingBGSZRGrid') != null){
				Ext.getCmp('OfficeMeetingBGSZRGrid').getStore().reload();
			}
		}
	});
}
