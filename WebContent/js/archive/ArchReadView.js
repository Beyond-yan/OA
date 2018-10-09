ArchReadView = Ext.extend(Ext.Panel, {
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
		ArchReadView.superclass.constructor.call(this, {
					id : 'ArchReadView',
					iconCls : 'menu-arch-reader',
					title : '督办件',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					height : 88,
					region : 'north',
					frame : false,
					border : false,
					id:'ArchReadSearchForm',
					layout : 'form',
					bodyStyle : 'padding:5px',
					defaults : {
						border : false
					},
					items : [{
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
												fieldLabel : '来文时间',
												name : 'startDate',
												xtype : 'datefield',
												format:'Y-m-d',
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
										fieldLabel : '至',
										xtype:'datefield',
										name:'endDate',
										format:'Y-m-d',
										width : 130
									}]
								},{
									columnWidth : .3,
									layout : 'form',
									defaults : {
										border : false,
										anchor : '96%,96%'
									},
									items : [{
												fieldLabel : '来文单位',
												name : 'depName',
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
										fieldLabel : '承办部门',
										width : 180,
										xtype : 'combo',
										hiddenName : 'orgDepId',
										editable : false,
										triggerAction : 'all',
										displayField : 'depName',
										valueField : 'depId',
										store : new Ext.data.SimpleStore({
											autoLoad : true,
											url : __ctxPath
													+ '/system/comboDep3AllDepartment.do',
											fields : ['depId','depName'],
											baseParams : {
												start : 0,
												limit : 10000
											}
										})
									}]
								},{
									columnWidth : .3,
									layout : 'form',
									defaults : {
										border : false,
										anchor : '96%,96%'
									},
									items : [{
										fieldLabel : '状态',
										width : 180,
										xtype : 'combo',
										mode : 'local',
										editable : true,
										triggerAction : 'all',
										store : [[ '0', '待办'],['1','在办'],['2', '办结' ], ['-1', '全部']],
										listeners : {
											select : function(cbo, record, index) {
												Ext.getCmp('ArchReadSearchForm.toDoType').setValue(cbo.getValue());
											}
										}
									}]
								}
							]},{
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
							}, {
								xtype:'button',
								text:'重置',
								iconCls:'btn-reseted',
								handler:function(){
								var searchPanel = Ext.getCmp('ArchReadSearchForm');
									searchPanel.getForm().reset();
								}
							},{
								xtype:'hidden',
								name:'archiveType',
								value: 2
							},{
								xtype:'hidden',
								name:'toDoType',
								id:'ArchReadSearchForm.toDoType',
								value: -1
							}]
						}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/flow/listFlowTaskReport.do",
					baseParams : {
						'archiveType' : 2,
						'toDoType': -1
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'defId',
								type : 'int'
							}, 'runId', 'taskId', 'taskName', 'activityname',
							'runSubject', 'preActivityname', 'preUserId', 'preUserName',
							'assignUserId', 'assignUserName', 'archiveId',
							'issuerId', 'issuer', 'archCreateTime', 'sendTime','limitedDate',
							'isReply', 'isEnd', 'archivesNo', 'orgdepName', 'issuedep','curDepId','curDepName',
							'flowName','dataValue','piid','creatorDepName','creatorDepId','status']
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
						header : '文件编号',
						dataIndex : 'archivesNo',
						renderer : function(value){
							 if(value=='0'){
								 var str='未生成编号';
								 return str;
							 }else{
							 	return value;
							 }
						}
					}, {
						header : '是否需要回复',
						dataIndex : 'isReply',
						renderer : function(value){
							 var str='';
							 if(value=='0'){
								 str='否';
							 }else if(value=='1'){
								 str='是';
							 }
							 return str;
						}
					}, {
						header : '是否办结',
						dataIndex : 'isEnd',
						renderer : function(value){
							 var str='';
							 if(value=='0'){
								 str='否';
							 }else if(value=='1'){
								 str='是';
							 }
							 return str;
						}
					}, {
						header : '来文单位',
						dataIndex : 'issuedep'
					}, {
						header : '来文时间',
						dataIndex : 'archCreateTime'
					}, {
						header : '标题',
						dataIndex : 'runSubject',
						width: 300,
						renderer : function(value, metadata, record, rowIndex,colIndex){
							metadata.attr = 'style="white-space:normal;"'; 
							var str = '<a href="#" title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchReadView.detail('+record.data.archiveId+','+record.data.runId+','+record.data.defId+')">'+value+'</a>';
							return str;
						}
					}, {
						header : '承办部门',
						dataIndex : 'orgdepName'
					}, {
						header : '限办日期',
						dataIndex : 'limitedDate'
					}, {
						header : '管理',
						width : 200,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var status = record.data.status;
							var preActivityname = record.data.preActivityname;
							var issuerId=record.data.issuerId;
							var str = '';
							if(status==0){
								str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchReadView.nextStep('
									+record.data.taskId+',\''+record.data.activityname+'\',\''+record.data.taskName+'\')"> <img src="'+__ctxPath +'/images/menus/document/public_folder.png" />处理任务</a>&nbsp;';
							}
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchReadView.proDetail('
									+record.data.runId+','+record.data.defId+',\''+record.data.piid+'\',\''+record.data.runSubject+'\')"><img src="'+__ctxPath +'/images/btn/flow/view.png" />流程信息</a>&nbsp;';
							if(status==1){
								if(preActivityname!=null&&preActivityname=="收文登记"&&curUserInfo.userId==issuerId){
									str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchReadView.backProcess('
											+record.data.defId+',\''+record.data.piid+'\',\''+record.data.flowName+'\','+record.data.archiveId+')"><img src="'+__ctxPath +'/images/btn/flow/changeTask.png" />撤回</a>';
								}
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
					id : 'ArchReadGrid',
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
								// new ArchivesForm(rec.data.archivesId).show();
							});
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

	/**
	 * 编辑记录
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
ArchReadView.detail = function(editId,runId,defId) {
	var isGranted=false;
	if(curUserInfo.isOfficeStaffRole||curUserInfo.isAdmin||curUserInfo.isArchivesManager)
		{
		  isGranted=true;
		}
	new ArchDetailView({
				archivesId : editId,
				runId: runId,
				defId: defId,
				archType:1,
				isGranted:isGranted
			}).show();
}
/**
 * 管理公文附件
 * 
 * @param {}
 *            editId
 */
ArchReadView.attach = function(editId) {
	new ArchivesDocWin({
				archivesId : editId
			}).show();
}
/**
 * 公文归档
 * 
 * @param {}
 *            editId
 */
ArchReadView.arch = function(archivesId) {
	Ext.Msg.confirm('信息确认', '您确认要对该公文进行归档吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + "/archive/archArchives.do",
								method : 'POST',
								async : false,
								success : function(response, opts) {
									Ext.ux.Toast.msg('操作信息', '归档成功！');
								},
								failure : function(response, opts) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '归档出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								},
								params : {
									archivesId : archivesId
								}
							});
				}
			});// end of comfirm
}
/**
 * 显示明细
 * 
 */
ArchReadView.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}
ArchReadView.stopProcess = function(editId, piId) {
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
									Ext.getCmp('ArchReadGrid').getStore().reload()
								},
								failure : function(response) {
									Ext.Msg.alert("提示", "终止失败！");
								}
					});
				}
			})
}

/**
 * 下一步的任务
 * @param {} taskdbid
 */
ArchReadView.nextStep=function(taskId,activityName,taskName){
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
	var formView=contentPanel.getItem('ProcessNextForm'+taskId);
	if(formView==null){
		formView=new ProcessNextForm({taskId:taskId,activityName:activityName, taskName:taskName});
		contentPanel.add(formView);
	}
	contentPanel.activate(formView);
}
/**
 * 
 * 撤回流程
 * @param {}
 */
ArchReadView.backProcess = function(defId,piId,name,archivesId) {
	Ext.Msg.confirm('提示', '确定撤回该流程？', function(btn, text) {
				if (btn == 'yes') {
						// 撤回流程
							var contentPanel = App.getContentPanel();
							var startForm = contentPanel.getItem('ProcessRunStart' + defId);
							if (startForm == null) {
								startForm = new ProcessRunStart({
											id : 'ProcessRunStart' + defId,
											defId : defId,
											archivesId :archivesId,
											piId: piId,
											flowName : name
										});
								contentPanel.add(startForm);
							}
							contentPanel.activate(startForm);
				}
			})
}