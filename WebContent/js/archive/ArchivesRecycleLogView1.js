ArchivesRecycleLogView1 = Ext.extend(Ext.Panel, {
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
		ArchivesRecycleLogView1.superclass.constructor.call(this, {
					id : 'ArchivesRecycleLogView1',
					iconCls : 'menu-recyle',
					title : '收文回收站',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					height : 78,
					region : 'north',
					frame : false,
					border : false,
					id:'ArchivesRecycleLogForm1',
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
									columnWidth : .25,
									layout : 'form',
									defaults : {
										border : false,
										anchor : '96%,96%'
									},
									items : [{
												fieldLabel : '标题',
												name : 'Q_archives.subject_S_LK',
												xtype : 'textfield',
												width : 180
									},{
										name : 'Q_archives.archType_SN_EQ',
										xtype : 'textfield',
										value:1,
										hidden : true
									},{
										name : 'Q_logType_N_EQ',
										xtype : 'textfield',
										value:3,
										hidden : true
									}]
								},{
									columnWidth : .25,
									layout : 'form',
									defaults : {
										border : false,
										anchor : '96%,96%'
									},
									items : [{
												fieldLabel : '删除人',
												name : 'Q_user.fullname_S_EQ',
												xtype : 'textfield',
												width : 180
									}]
								},{
									columnWidth : .25,
									layout : 'form',
									defaults : {
										border : false,
										anchor : '96%,96%'
									},
									items : [{
												fieldLabel : '删除时间',
												name : 'startDate',
												xtype : 'datefield',
												format:'Y-m-d',
												width : 180
									}]
								},{
									columnWidth : .25,
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
								var searchPanel = Ext.getCmp('ArchivesRecycleLogForm1');
									searchPanel.getForm().reset();
								}
							}]
						}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/archive/listArchivesRecycleLog.do",
					baseParams : {
						'Q_archives.archType_SN_EQ' : 1,
						'Q_archives.archType_SN_EQ' : 2,
						'Q_logType_N_EQ' : 3
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'id',
								type : 'int'
							}, 'createDate', 'user.fullname', 'archives.subject', 'archives','logType','processRun',
							'runSubject', 'preActivityname', 'preUserId', 'preUserName']
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
						header : 'archives.archivesId',
						dataIndex : 'archives.archivesId',
						hidden : true
					}, {
						header : 'processRun',
						dataIndex : 'processRun',
						hidden : true
					},   {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					},{
						header : '文件名',
						dataIndex : 'archives.subject',
						width: 300,
						renderer : function(value, metadata, record, rowIndex,colIndex){
							metadata.attr = 'style="white-space:normal;"'; 
							var str = '<a href="#" title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ArchivesRecycleLogView1.detail('+record.data.archives.archivesId+','+record.data.processRun.runId+','+record.data.processRun.proDefinition.defId+')">'+value+'</a>';
							return str;
						}
					}, {
						header : '删除人',
						dataIndex : 'user.fullname'
					}, {
						header : '删除时间',
						dataIndex : 'createDate',
						width: 150
					}, {
						header : '状态',
						dataIndex : 'logType',
						renderer : function(value) {
							if (value == '2') {
								return "<span>恢复</span>";
							} else if(value == '3'){
								return "<span>删除</span>";
							} else if(value == '4'){
								return "<span>彻底删除</span>";
							}
						}
					},{
						header : '管理',
						width : 200,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var str="";
							if(record.data.logType==3){
							 str =  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesRecycleLogView1.recover('
									+record.data.id+')"> <img src="'+__ctxPath +'/images/btn/flow/changeTask.png" />恢复</a>&nbsp;';
							str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesRecycleLogView1.multiDel('
									+record.data.id+')"><img src="'+__ctxPath +'/images/newImages/outCaseSearch.png" />彻底删除</a>&nbsp;';
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
		this.topbar.add(new Ext.Button({
			iconCls : 'btn-del',
			text : '批量删除',
			xtype : 'button',
			handler : function() {
				ArchivesRecycleLogView1.multiDel("");
			}
		}));
		this.topbar.add(new Ext.Button({
			iconCls : 'btn-changeTask',
			text : '批量恢复',
			xtype : 'button',
			handler : function() {
				ArchivesRecycleLogView1.recover("");
			}
		}));
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchivesRecycleLogGrid1',
					region : 'center',
					stripeRows : true,
					tbar : this.topbar,
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
ArchivesRecycleLogView1.detail = function(editId,runId,defId) {
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
 * 恢复流程  
 */
ArchivesRecycleLogView1.recover = function(logIds) {
	Ext.Msg.confirm('信息确认', '您确认要对该流程进行恢复吗？', function(btn) {
				if (btn == 'yes') {
					if(logIds==""){
						var grid = Ext.getCmp("ArchivesRecycleLogGrid1");
						var selectRecords = grid.getSelectionModel().getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息","请选择要恢复的文件！");
							return;
						}
						logIds = Array();
						for ( var i = 0; i < selectRecords.length; i++) {
							logIds.push(selectRecords[i].data.id);
						};
					}
					Ext.Ajax.request({
								url : __ctxPath + "/archive/recoverArchivesRecycleLog.do",
								params : {
									'logIds' : logIds
								},
								method : 'POST',
								success : function(response, opts) {
									Ext.ux.Toast.msg('操作信息', '恢复成功！！！');
									Ext.getCmp('ArchivesRecycleLogGrid1').getStore().reload()
								},
								failure : function(response, opts) {
									Ext.Msg.alert("提示", "恢复失败！");
								}
							});
				}
			});// end of comfirm
}
/**
 * 彻底删除
 */
ArchivesRecycleLogView1.multiDel = function(logIds) {
	Ext.Msg.confirm('提示', '确定彻底删除该流程？', function(btn, text) {
				if (btn == 'yes') {
					if(logIds==""){
						var grid = Ext.getCmp("ArchivesRecycleLogGrid1");
						var selectRecords = grid.getSelectionModel().getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息","请选择要彻底删除的文件！");
							return;
						}
						logIds = Array();
						for ( var i = 0; i < selectRecords.length; i++) {
							logIds.push(selectRecords[i].data.id);
						};
					}
					Ext.Ajax.request({
								url : __ctxPath + '/archive/multiDelArchivesRecycleLog.do',
								params : {
									'logIds' : logIds
								},
								method : 'post',
								success : function(resp, options) {
									Ext.ux.Toast.msg('操作信息', '删除成功');
									Ext.getCmp('ArchivesRecycleLogGrid').getStore().reload()
								},
								failure : function(response) {
									Ext.Msg.alert("提示", "删除失败！");
								}
					});
				}
			})
}
