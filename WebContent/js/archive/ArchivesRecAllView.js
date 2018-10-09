/**
 * @author:Ropen
 * @class ArchivesView
 * @extends Ext.Panel
 * @description 收文管理
 */
ArchivesRecAllView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		if (_cfg == null) {
			_cfg = {};
		}
		Ext.apply(this, _cfg);
		// 初始化组件
		this.initComponents();
		// 调用父类构造
		ArchivesRecAllView.superclass.constructor.call(this, {
					id : 'ArchivesRecAllView',
					title : '收文查询',
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
/*	topbar : null,*/

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
					height : 88,
					region : 'north',
					frame : false,
					id:'ArchivesRecAllSearchForm',
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
							},{
								fieldLabel : '收文编号',
								name : 'archiveNo',
								xtype : 'textfield'
							}]
	                	}, {
	                		columnWidth : .31,
			                layout : 'form',
			                defaults : {border:false,anchor:'96%,96%'},
							items :[{
								width:60,
								fieldLabel : '来文字号',
								name : 'depSignNo',
								xtype : 'textfield'
							} ,{
								fieldLabel : '年份',
								width : 130,
								xtype : 'combo',
								mode : 'local',
								store : arr,
								editable : false,
								triggerAction : 'all',
								emptyText : '---年份---',
								listeners : {
									select : function() {
										Ext.getCmp('ArchivesRecAllSearchViewStartDt').setValue((this.getValue()+'-01-01'));
										Ext.getCmp('ArchivesRecAllSearchViewDate').setValue(Ext.util.Format.substr(this.getValue(),0,4)+'-12-31');	
										
									}
								}
							}, {
								name : 'startDate',
								xtype : 'hidden',
								id : 'ArchivesRecAllSearchViewStartDt'
							}, {
								xtype : 'hidden',
								name : 'endDate',
								id:'ArchivesRecAllSearchViewDate'
							}]		
	                	}, {
	                		columnWidth : .31,
			                layout : 'form',
			                defaults : {border:false,anchor:'96%,96%'},
							items :[{
								columnWidth : 0.25,
								layout : 'form',
								defaults : {
									border : false,
									anchor : '100%,100%'
								},
								items : [{
									width : 65,
									fieldLabel : '主办部门',
									id : 'ArchivesRecAllSearchViewDepNames',
									xtype : 'textfield',
									readOnly:true,
									editable : false
								},{
									width:60,
									fieldLabel : '来文单位',
									name : 'depName',
									xtype : 'textfield'
								},{
									xtype : 'hidden',
									name : 'orgDepId',
									id : 'ArchivesRecAllSearchViewOrgDepIds'
																																									
								}]
							}]		
	                	},{
	                		columnWidth:.07,
	                		layout: 'form',
	                		defaults:{border:false,anchor:'96%,96%'},
	                		items: [{
	                			style:'padding-right:20px',
	                			xtype : 'button',
	                			iconCls : 'btn-dep-sel',
	                			text : '选择部门',
	                			handler : function() {
									var url = __ctxPath +"/system/selectDepartment.do?depId="+roleMap.get('DepartmentCommonId');
									DepSelector3.getView(function(id, name) {
										Ext.getCmp('ArchivesRecAllSearchViewDepNames').setValue(name);
										Ext.getCmp('ArchivesRecAllSearchViewOrgDepIds').setValue(id);
									}, false,null,url).show();
								}
	                		}]
	                	}]
					},{
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
								var searchPanel = Ext.getCmp('ArchivesRecAllSearchForm');
									searchPanel.getForm().reset();
								}
							},{
								xtype:'hidden',
								name:'archiveType',
								value:1
							},{
								xtype:'hidden',
								name:'toDoType',
								value:-1
							}]
						}]
				});// end of the searchPanel

		this.store = new Ext.data.JsonStore({
					url :__ctxPath + "/flow/listJWFlowTaskReport.do",
					baseParams : {
						'archiveType' : 1,
						'toDoType' : -1
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
							var str = '<a href="#" title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchivesRecAllView.detail('+record.data.archiveId+','+record.data.runId+','+record.data.defId+')">'+value+'</a>';
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
						dataIndex : 'archCreateTime'
					} ,{
						header : '管理',
						width : 200,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var preActivityname = record.data.preActivityname;
							var str = '';
							if (isGranted('_ArchiveDraftAllEdit')){
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesRecAllView.edit('
									+record.data.taskId+',\''+record.data.activityname+'\')"><img src="'+__ctxPath +'/images/system/edit.gif" />流程编辑</a>&nbsp;';}
//							if(preActivityname!=null&&preActivityname=="收文登记"){
//								str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesRecAllView.backProcess('
//										+record.data.taskId+',\''+record.data.activityname+'\','+record.data.issuerId+')"><img src="'+__ctxPath +'/images/btn/flow/changeTask.png" />撤回</a>';
//							}
							if (isGranted('_ArchiveRecWriteOpinion')) {
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesRecAllView.writeOpinion('
									+record.data.runId+','+record.data.defId+',\''+record.data.piid+'\',\''+record.data.runSubject+'\')"><img src="'+__ctxPath +'/images/menus/archive/archives_draft.png" />代填意见</a>&nbsp;';
							}
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesRecAllView.proDetail('
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
/*		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});*/
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchivesRecAllGrid',
					region : 'center',
					stripeRows : true,
					/*tbar : this.topbar,*/
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					plugins : this.rowActions,
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
				ArchivesRecAllView.detail(record.data.archiveId,record.data.runId,record.data.defId);
				break;
			case 'btn-flowView' :
				ArchivesRecAllView.proDetail(record.data.runId,record.data.defId,record.data.piid,record.data.runSubject);
				break;
			case 'btn-edit' :
				ArchivesRecAllView.edit(record.data.taskId,record.data.activityname);
				break;
			case 'menu-holiday' :
				ArchivesRecAllView.stopProcess(record.data.archiveId,record.data.piid);
				break;
			case 'btn-changeTask' :
				ArchivesRecAllView.backProcess(record.data.taskId,record.data.activityname,record.data.activityname,record.data.issuerId);
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
ArchivesRecAllView.detail = function(editId,runId,defId) {
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
 * 
 * 流程编辑功能
 * @param {}
 *  
 */
ArchivesRecAllView.edit = function(taskId,activityname) {
	new ArchivesFreeJumpWin({
				taskId: taskId,
				activityName:activityname
			}).show();
}

/**
 * 代填意见
 * 
 */
ArchivesRecAllView.writeOpinion = function(runId, defId, piId, name) {
	 new ArchivesWriteOpionView({
				runId : runId
			}).show();
}

/**
 * 展示公文子收文明细
 * 
 * @param {}
 *            
 */
ArchivesRecAllView.subDetail = function(editId) {
	new ArchSubDetailForm({
				parentArchId : editId
			}).show();
}

/**
 * 显示明细
 * 
 * @param {}
 */
ArchivesRecAllView.proDetail = function(runId, defId, piId, name) {
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
 * 撤销流程
 * @param {}
 */
ArchivesRecAllView.stopProcess = function(editId, piId) {
	Ext.Msg.confirm('提示', '确定撤销该流程？', function(btn, text) {
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
									Ext.getCmp('ArchivesRecAllGrid').getStore().reload()
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
ArchivesRecAllView.backProcess = function(taskId,activityName,issuerId) {
	Ext.Msg.confirm('提示', '确定撤回该流程？', function(btn, text) {
				if (btn == 'yes') {
						// 撤回流程
						var form=Ext.getCmp('ArchivesRecAllSearchForm').getForm();
						form.submit({
						url:__ctxPath+ "/flow/nextProcessActivity.do",
						method:'post',
						waitMsg:'正在提交处理，请稍等',
						params:{
								taskId : taskId,
								signalName : 'to重新登记',
								activityName : activityName,
								destName:'重新登记',
								status: '撤回',
								flowAssignId: issuerId
						},
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息','成功保存！');
							Ext.getCmp('ArchivesRecAllGrid').getStore().reload();
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
			})
}
