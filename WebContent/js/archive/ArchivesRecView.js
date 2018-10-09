ArchivesRecView = Ext.extend(Ext.Panel, {
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
		ArchivesRecView.superclass.constructor.call(this, {
					id : 'ArchivesRecView',
					title : '发文选择',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {

		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			frame : true,
			items : [{
						layout : 'column',
						items : [{
									columnWidth : 0.33,
									layout : 'form',
									items : [{

												fieldLabel : '收文流程名称',
												name : 'Q_flowName_S_LK',
												flex : 1,
												xtype : 'textfield'
											}]

								}, {
									columnWidth : 0.33,
									layout : 'form',
									items : [{
												text : '查询',
												xtype : 'button',
												scope : this,
												width : 100,
												iconCls : 'btn-search',
												handler : this.search
											}, {
												xtype : 'hidden',
												name : 'Q_flowType_SN_EQ',
												value : 3
											}]

								}]
					}]
			});// end of searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/archive/listOdFlowtype.do",
					root : 'result',
					baseParams : {
						'Q_flowType_SN_EQ' : 3
					},
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'id',
								type : 'int'
							}, 'flowName', 'flowDesc', 'flowType',
							'proDefinition.defId', 'proDefinition.name',
							'isAutoSave']
				});
		this.store.setDefaultSort('id', 'desc');
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});
		// 初始化ColumnModel
		var cm = new Ext.grid.ColumnModel({
			columns : [new Ext.grid.RowNumberer(), {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '公文流程名称',
						dataIndex : 'flowName'
					}, {
						header : '公文流程描述',
						dataIndex : 'flowDesc'
					}, {
						header : '公文流程类型',
						dataIndex : 'flowType',
						renderer : function(value) {
							if (value == '3') {
								return "<span>外收文流程</span>";
							}
						}
					}, {
						header : '工作流id',
						dataIndex : 'proDefinition.deployId',
						hidden : 'true'
					}, {
						header : '是否自动保存',
						dataIndex : 'isAutoSave',
						renderer : function(value) {
							if (value == '1') {
								return "<span>是</span>";
							} else {
								return "<span>否</span>";
							}
						}
					}, {
						header : '管理',
						dataIndex : 'proDefinition.defId',
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var defId = value;
							var name = record.data.flowName;
							var str = '';
							str += '&nbsp;<button title="查看" class="btn-preview" onclick="ArchivesRecView.view('
									+ defId + ',\'' + name + '\')"></button>';
							str += '&nbsp;<button title="新建流程" class="btn-newFlow" onclick="ArchivesRecView.newFlow('
									+ ''
									+ defId
									+ ',\''
									+ name
									+ '\')"></button>';
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
					region : 'center',
					stripeRows : true,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					height : 600,
					cm : cm,
					viewConfig : {
						forceFit : true,
						autoFill : true, // 自动填充
						forceFit : true
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
	// 按条件搜索
	search : function() {
		$search({
					searchPanel : this.searchPanel,
					gridPanel : this.gridPanel
				});
	}
});

/**
 * 流程信息查看
 * 
 * @param {}
 *            id
 * @param {}
 *            name
 * @param {}
 *            deployId
 */
ArchivesRecView.view = function(defId, name) {
	var contentPanel = App.getContentPanel();
	var detail = contentPanel.getItem('ProDefinitionDetail' + defId);

	if (detail == null) {
		detail = new ProDefinitionDetail(defId, name);
		contentPanel.add(detail);
	}
	contentPanel.activate(detail);
};

/**
 * 新建流程
 * 
 * @param {}
 *            defId
 * @param {}
 *            name
 */
ArchivesRecView.newFlow = function(defId, name) {

	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);

	if (startForm == null) {
		startForm = new ProcessRunStart({
					id : 'ProcessRunStart' + defId,
					defId : defId,
					flowName : name
				});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
};