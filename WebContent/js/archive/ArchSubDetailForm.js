/**
 * @author
 * @createtime
 * @class MonitorDealHistoryForm
 * @extends Ext.Window
 * @description MonitorDealHistory表单
 * @company 捷达世软件
 */
ArchSubDetailForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		if (_cfg == null) {
			_cfg = {};
		}
		Ext.apply(this, _cfg);
		// 初始化组件
		this.initComponents();
		// 调用父类构造
		ArchSubDetailForm.superclass.constructor.call(this, {
					id : 'ArchSubDetailForm',
					title : '收文明细',
					iconCls : 'menu-arch-controll',
					region : 'center',
					layout : 'fit',
					items : [this.gridPanel]
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

		var parentArchId = this.parentArchId;
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					height : 40,
					region : 'north',
					frame : false,
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
								text : '发文字号'
							}, {
								name : 'Q_archivesNo_S_LK',
								xtype : 'textfield',
								anchor : '98%'
							}, {
								text : '文件标题'
							}, {
								name : 'Q_subject_S_LK',
								xtype : 'textfield',
								anchor : '98%'
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : this.search.createCallback(this)
							}, {
								xtype : 'hidden',
								name : 'Q_status_SN_GT',
								value : 0
							}]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/archive/listArchives.do",
					baseParams : {
						'Q_status_SN_GT' : 0,
						'Q_archType_SN_EQ' : 1,
						'Q_parentArchId_L_EQ' : parentArchId
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'archivesId',
								type : 'int'
							}, 'typeId', 'typeName', 'archivesNo', 'issueDep',
							'depId', 'subject', 'issueDate', 'status',
							'shortContent', 'fileCounts', 'handleOpinion',
							'privacyLevel', 'urgentLevel', 'issuer',
							'issuerId', 'keywords', 'sources', 'odFlowtype',
							'processRun']
				});
		this.store.setDefaultSort('archivesId', 'desc');
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'archivesId',
						dataIndex : 'archivesId',
						hidden : true
					}, {
						header : 'odFlowtype',
						dataIndex : 'odFlowtype',
						hidden : true
					}, {
						header : 'processRun',
						dataIndex : 'processRun',
						hidden : true
					}, {
						header : '发文字号',
						dataIndex : 'archivesNo'
					}, {
						header : '发文机关或部门',
						dataIndex : 'issueDep'
					}, {
						header : '文件标题',
						dataIndex : 'subject'
					}, {
						header : '发布日期',
						dataIndex : 'issueDate'
					}, {
						header : '秘密等级',
						dataIndex : 'privacyLevel'
					}, {
						header : '紧急程度',
						dataIndex : 'urgentLevel'
					}, {
						header : '公文状态',
						dataIndex : 'status',
						renderer : function(value) {
							if (value == 0) {
								return '<font color="orange">草稿</font>';
							} else if (value == 1) {
								return '<font color="red">待签收</font>';
							} else if (value == 2) {
								return '<font color="red">待拟办</font>';
							} else if (value == 3) {
								return '<font color="red">等待分管领导批示</font>';
							} else if (value == 4) {
								return '<font color="red">等待总经理审批</font>';
							} else if (value == 5) {
								return '<font color="red">待承办</font>';
							} else if (value == 6) {
								return '<font color="copper">待归档</font>';
							} else if (value == 7) {
								return '<font color="green">已归档</font>';
							} else if (value == 8) {
								return '<font color="sienna">不归档</font>';
							} else if (value == 9) {
								return '<font color="red">退回</font>';
							} else if (value == 10) {
								return '<font color="gray">已取消</font>';
							} else {
								return '<font color="#777">完成</font>';
							}
						}
					}, {
						header : '管理',
						width : 100,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.archivesId;
							var type = record.data.odFlowtype.flowType;
							var status = record.data.status;
							var str = '';
							str += '<button title="查阅详情" value=" " class="btn-archives-detail" onclick="ArchSubDetailForm.detail('
									+ editId + ')">&nbsp;&nbsp;</button>';
							if (status > 0) {
								var obj = record.data.processRun;
								if (obj != null && obj != undefined
										&& obj != '') {
									var runId = record.data.processRun.runId;
									var defId = record.data.processRun.proDefinition.defId;;
									var piId = record.data.processRun.piId;
									var subject = record.data.processRun.subject;
									if (runId != null && runId != undefined
											&& runId != '') {
										str += '&nbsp;<button type="button" title="审批明细" value=" " class="btn-flowView" onclick="ArchSubDetailForm.proDetail('
												+ runId
												+ ','
												+ defId
												+ ',\''
												+ piId
												+ '\',\''
												+ subject
												+ '\')"></button>';
									}
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
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchivesSubGrid',
					region : 'center',
					stripeRows : true,
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
								emptyMsg : "当前没有记录"
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

	/**
	 * 编辑记录
	 * 
	 * @param {}
	 *            record
	 */
	editRecord : function(record) {
		new ArchivesDetail({
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
ArchSubDetailForm.detail = function(editId) {
	new ArchivesDetailWin({
				archivesId : editId
			}).show();
}

/**
 * 显示明细
 * 
 * @param {}
 *            runId
 * @param {}
 *            name
 */
ArchSubDetailForm.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};
