/**
 * @author:Ropen
 * @class ArchivesView
 * @extends Ext.Panel
 * @description 收文管理
 */
ToReceiveArchivesView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		if (_cfg == null) {
			_cfg = {};
		}
		Ext.apply(this, _cfg);
		// 初始化组件
		this.initComponents();
		// 调用父类构造
		ToReceiveArchivesView.superclass.constructor.call(this, {
					id : 'ToReceiveArchivesView',
					title : '待收公文',
					iconCls : 'menu-flowPr',
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
	/* topbar : null, */

	// 初始化组件
	initComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					height : 40,
					region : 'north',
					frame : false,
					id : 'ToReceiveArchivesSearchForm',
					border : false,
					layout : 'hbox',
					layoutConfig : {
						padding : '5',
						align : 'middle'
					},
					defaults : {
						xtype : 'label',
						margins : {
							top : 0,
							right : 4,
							bottom : 4,
							left : 4
						}
					},
					items : [{
								xtype : 'label',
								text : '请输入查询条件:'
							}, {
								text : '标题',
								xtype : 'label'
							}, {
								name : 'Q_subject_S_LK',
								xtype : 'textfield',
								anchor : '98%'
							}, {
								text : '状态'
							}, {
								xtype : 'combo',
								hiddenName : 'Q_receiveFlag_L_EQ',
								mode : 'local',
								editable : false,
								value : '0',
								triggerAction : 'all',
								store : [['', '全部'], ['0', '未接收'],
										['1', '已接收'], ['2', '已退文']]
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : this.search.createCallback(this)
							}, {
								xtype : 'button',
								text : '重置',
								iconCls : 'btn-reseted',
								handler : function() {
									var searchPanel = Ext
											.getCmp('ToReceiveArchivesSearchForm');
									searchPanel.getForm().reset();
								}
							},{
								name : 'Q_archtype_L_LE',
								xtype : 'hidden',
								value:'3'
							}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath
							+ "/system/listSysDataTransfer.do?queryType=receive",
					baseParams:{'Q_receiveFlag_L_EQ':0,'Q_archtype_L_LE':3},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : ['sources', 'archivesId','runid', 'archivesno', 'id',
							'subject', 'sendDep', 'transferType','dataSource',
							'writtenDate', 'createDate', 'issuer','archtype','fromSchema',
							'receiveFlag','createUserFullName']
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
								renderer : function(value, metadata, record,
										rowIndex) {
									return record_start + 1 + rowIndex;
								}
							}), {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					},{
						header : '公文字号',
						dataIndex : 'archivesno'
					}, {
						header : '标题',
						dataIndex : 'subject',
						width : 300,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var isreceive = record.data.receiveFlag;
							var archtype=record.data.archtype;
							var fromSchema=record.data.fromSchema;
							var str = '';
							if(archtype==0){
							if (isreceive == 0)
								str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToReceiveArchivesView.UnRecDetail('
									+ record.data.id+')">'
									+ value
									+ '</a>';
							else
								str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToReceiveArchivesView.RecDetail('
									+ record.data.id+')">'
									+ value
									+ '</a>';}
							else if(archtype==1||archtype==3){
								if (isreceive == 0)
								str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToReceiveArchivesView.sentUnRecDetail('
									+ record.data.id+','+
									+ record.data.runid+','+record.data.dataSource+','+fromSchema+')">'
									+ value
									+ '</a>';
							else
								str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToReceiveArchivesView.sentRecDetail('
									+ record.data.id+','+
									+ record.data.runid+','+record.data.dataSource+','+fromSchema+')">'
									+ value
									+ '</a>';
							}
							return str;
						}
					}, {
						header : '发送人',
						dataIndex : 'createUserFullName'
					}, {
						header : '成文日期',
						dataIndex : 'writtenDate'
					}, {
						header : '发送时间',
						width : 120,
						dataIndex : 'createDate'
					}, {
						header : '发送单位',
						dataIndex : 'sendDep'
					}, {
						header : '状态',
						dataIndex : 'receiveFlag',
						renderer : function(value) {
							var str = '';
							if (value == 0) {
								str = "未接收";
							} else if (value == 2) {
								str = "已退文";
							} else {
								str = "已接收";
							}
							return str;
						}
					}, {
						header : '管理',
						width : 200,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var isreceive = record.data.receiveFlag;
							var fromSchema=record.data.fromSchema;
							var archtype=record.data.archtype;
							var str = '';
							if(archtype==0){
							if (isreceive == 0) {
								str = '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ToReceiveArchivesView.UnRecDetail('
										+ record.data.id+','+record.data.runid
										+ ')"><img src="'
										+ __ctxPath
										+ '/images/btn/archive/archives_detail.png" />查看公文</a>&nbsp;';
							} else {
								str = '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ToReceiveArchivesView.RecDetail('
										+ record.data.id+','+record.data.runid
										+ ')"><img src="'
										+ __ctxPath
										+ '/images/btn/archive/archives_detail.png" />查看公文</a>&nbsp;';
							}}
							else if(archtype==1||archtype==3){
								if (isreceive == 0) {
									str = '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ToReceiveArchivesView.sentUnRecDetail('
											+ record.data.id+','+record.data.runid
											+','+record.data.dataSource+','+fromSchema+')"><img src="'
											+ __ctxPath
											+ '/images/btn/archive/archives_detail.png" />查看公文</a>&nbsp;';
								} else {
									str = '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ToReceiveArchivesView.sentRecDetail('
											+ record.data.id+','+record.data.runid
											+','+record.data.dataSource+','+fromSchema+')"><img src="'
											+ __ctxPath
											+ '/images/btn/archive/archives_detail.png" />查看公文</a>&nbsp;';
								}}
							if (isreceive == 0&&curUserInfo.ownerSchema=='oa') {
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="退文" value=" " class="btn-top" onclick="ToReceiveArchivesView.edit('
										+ record.data.id
										+ ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;退文</a>';
							}else if (isreceive == 1&&curUserInfo.ownerSchema=='oa') {
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="退文" value=" " class="btn-top" onclick="ToReceiveArchivesView.edit('
									+ record.data.id
									+ ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;退文</a>';
							} /*else if (isreceive == 2) {
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="反馈意见" value=" " class="btn-archive-save-trace" onclick="ToReceiveArchivesView.edit('
										+ record.data.id
										+ ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;反馈意见</a>';
							}*/

							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false
			}
		});
		// 初始化工具栏
		this.topbar =  new Ext.Toolbar({
			id : 'ToReceiveArchivesTopBar',
			height : 30,
			bodyStyle : 'text-align:left',
			items : []
		});
		this.topbar.add(new Ext.Button({
			iconCls : 'menu-flowPr',
			text : '标记为已收',
			handler : function() {
				var grid = Ext.getCmp("ToReceiveArchivesGrid");
				var selectRecords = grid.getSelectionModel()
						.getSelections();
				if (selectRecords.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要标记为已收的记录！");
					return;
				}
				var ids = Array();
				for (var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.id);
				}
				ToReceiveArchivesView.check(ids);
			}
		}));
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ToReceiveArchivesGrid',
					tbar : this.topbar,
					region : 'center',
					stripeRows : true,
					/* tbar : this.topbar, */
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
				ToReceiveArchivesView.detail(record.data.archiveId,
						record.data.runId, record.data.defId);
				break;
			case 'btn-flowView' :
				ToReceiveArchivesView.proDetail(record.data.runId,
						record.data.defId, record.data.piid,
						record.data.runSubject);
				break;
			case 'btn-edit' :
				ToReceiveArchivesView.edit(record.data.taskId,
						record.data.activityname);
				break;
			default :
				break;
		}
	}
});

/**
 * 未接收发文公文详细信息
 * 
 * @param {}
 * 
 */
ToReceiveArchivesView.UnRecDetail = function(archivesId) {
	new ToReceiveArchivesDetailView({
				archivesId : archivesId,
				isReceive : 0,
				archType : 1,
				download :1,
				dataSource:1
			}).show();
}
/**
 * 已接收收文公文详细信息
 * 
 * @param {}
 *          
 */
ToReceiveArchivesView.RecDetail = function(archivesId) {
	new ToReceiveArchivesDetailView({
				archivesId : archivesId,
				isReceive : 1,
				archType : 1,
				download :1,
				dataSource:1
			}).show();
}
/**
 * 未接收收文公文详细信息
 * 
 * @param {}
 * 
 */
ToReceiveArchivesView.sentUnRecDetail= function(archivesId,runid,dataSource,fromSchema) {
	new ToReceiveArchivesDetailView({
				archivesId : archivesId,
				isReceive : 0,
				archType : 1,
				download :1,
				runid:runid,
				dataSource:dataSource,
				fromSchema:fromSchema
			}).show();
}
/**
 * 已接收收文公文详细信息
 * 
 * @param {}
 *          
 */
ToReceiveArchivesView.sentRecDetail= function(archivesId,runid,dataSource,fromSchema) {
	new ToReceiveArchivesDetailView({
				archivesId : archivesId,
				isReceive : 1,
				archType : 1,
				download :1,
				runid:runid,
				dataSource:dataSource,
				fromSchema:fromSchema
			}).show();
}
ToReceiveArchivesView.edit = function(id) {
	new FeedbackForm(id);
};

ToReceiveArchivesView.check = function(id) {
 	var grid = Ext.getCmp("ToReceiveArchivesGrid");
	Ext.Msg.confirm('信息确认', '您确认标记为已收吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath + '/system/checkSysDataTransfer.do',
				params : {
					ids : id
				},
				method : 'post',
				success : function() {
					Ext.ux.Toast.msg("操作信息", "成功标记所选记录！");
					grid.getStore().reload({
								params : {
									start : 0,
									limit : 25
								}
							});
				}
			});
		}
	});
};