ArchMeetingView = Ext.extend(Ext.Panel, {
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
		ArchMeetingView.superclass.constructor.call(this, {
					id : 'ArchMeetingView',
					iconCls : 'menu-arch-reader',
					title : '办结会议',
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
					id:'ArchMeetingSearchForm',
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
												fieldLabel : '会议名称',
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
												fieldLabel : '召集单位',
												name : 'holdDep',
												xtype : 'textfield',
												width : 180
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
								var searchPanel = Ext.getCmp('ArchMeetingSearchForm');
									searchPanel.getForm().reset();
								}
							},{
								xtype:'hidden',
								name:'archiveType',
								value: 5
							},{
								xtype:'hidden',
								name:'toDoType',
								id:'ArchMeetingSearchForm.toDoType',
								value: 2
							}]
						}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/meetingNotice/listFlowMeetingNotice.do",
					baseParams : {
						'toDoType': 2
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'defId',
								type : 'int'
							}, 'runId', 'taskId', 'taskName', 'activityname',
							'runSubject', 'preActivityname', 'preUserId', 'preUserName',
							'assignUserId', 'assignUserName', 'noticeId',
							'issuerId', 'issuer', 'archCreateTime', 'sendTime','meetingDate',
							'isReply', 'isEnd', 'archivesNo', 'orgdepName', 'holdDep','curDepId','curDepName',
							'flowName','dataValue','piid','creatorDepName','creatorDepId','status','issueDate']
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
					}),  {
						header : '会议名称',
						dataIndex : 'runSubject',
						width: 300,
						renderer : function(value, metadata, record, rowIndex,colIndex){
							metadata.attr = 'style="white-space:normal;"'; 
							var str = '<a href="#" title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchMeetingView.detail('+record.data.noticeId+','+record.data.runId+','+record.data.defId+')">'+value+'</a>';
							return str;
						}
					}, {
						header : 'archiveId',
						dataIndex : 'archiveId',
						hidden : true
					}, {
						header : '召集单位',
						dataIndex : 'holdDep'
					}, {
						header : '会议时间',
						dataIndex : 'meetingDate',
						renderer : function(value){
							if(value != null && value != ''){
								return new Date(value).format('Y-m-d H:i:s');
							}else{
								return '';
							}
						}
					}, {
						header : '管理',
						width : 200,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var status = record.data.status;
							var preActivityname = record.data.preActivityname;
							var issuerId=record.data.issuerId;
							var str = '';
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchMeetingView.proDetail('
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
					id : 'ArchMeetingViewGrid',
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

});

/**
 * 展示公文详细信息
 * 
 * @param {}
 *            editId
 */
ArchMeetingView.detail = function(editId,runId,defId) {
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
ArchMeetingView.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}
