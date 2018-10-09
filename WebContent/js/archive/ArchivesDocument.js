/**
 * @author:
 * @class ArchivesDocument
 * @extends Ext.Panel
 * @description 发文归档
 */
ArchivesDocument = Ext.extend(Ext.Panel, {
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
		ArchivesDocument.superclass.constructor.call(this, {
					id : 'ArchivesDocument',
					iconCls : 'menu-archive-handout',
					title : '手动归档',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					height : 35,
					region : 'north',
					frame : false,
					border : false,
					layout : 'hbox',
					layoutConfig : {
						padding : '5',
						align : 'middle'
					},
					defaults : {
						style : 'padding:0px 5px 0px 5px;',
						border : false,
						anchor : '98%,98%',
						labelWidth : 75,
						xtype : 'label'
					},
					items : [{
								text : '类型名称'
							}, {
								name : 'Q_typeName_S_LK',
								width : 100,
								xtype : 'textfield'
							}, {
								text : '发文字号'
							}, {
								width : 100,
								name : 'Q_archivesNo_S_LK',
								xtype : 'textfield'
							}, {
								text : '文件标题'
							}, {
								width : 100,
								name : 'Q_subject_S_LK',
								xtype : 'textfield'
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : this.search.createCallback(this)
							}, {
								xtype : 'hidden',
								name : 'Q_status_SN_GE',
								value : 5
								// 查询待归档，已归档，不归档的公文
						}	, {
								xtype : 'hidden',
								name : 'Q_status_SN_LE',
								value : 7
								// 查询待归档，已归档，不归档的公文
						}	, {
								xtype : 'hidden',
								name : 'Q_archType_SN_EQ',
								value : 0
								// 查找发文的公文
						} /*
							 * , { xtype : 'hidden', name : 'Q_issuerId_L_EQ',
							 * value : curUserInfo.userId }
							 */]
				});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/archive/listArchives.do",
					baseParams : {
						'Q_archType_SN_EQ' : 0,
						'Q_status_SN_GE' : 5,
						'Q_status_SN_LE' : 7
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'archivesId',
								type : 'int'
							}, 'typeId', 'typeName', 'archivesNo', 'issueDep',
							'depId', 'subject', 'issueDate', 'status',
							'shortContent', 'fileCounts', 'privacyLevel',
							'urgentLevel', 'issuer', 'issuerId', 'keywords',
							'sources', 'createtime']
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
						header : '公文类型名称',
						dataIndex : 'typeName'
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
						header : '公文状态',
						dataIndex : 'status',
						renderer : function(value) {
							if (value == '5') {
								return '<font color="red">待归档</font>';
							} else if (value == '7') {
								return '<font color="green">已归档</font>';
							} else {
								return '<font color="gray">不归档</font>';
							}
						}
					}, {
						header : '秘密等级',
						dataIndex : 'privacyLevel'
					}, {
						header : '紧急程度',
						dataIndex : 'urgentLevel'
					}, {
						header : '发文时间',
						dataIndex : 'createtime',
						renderer : function(value) {
							return value.substring(0, 10);
						}
					}, {
						header : '管理',
						width : 100,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.archivesId;
							var status = record.data.status;
							var archivesId = record.data.archivesId;
							var str = '';
							str += '<button title="查阅详情" value=" " class="btn-archives-detail" onclick="ArchivesDocument.detail('
									+ editId + ')">&nbsp;&nbsp;</button>';
							str += '<button title="档案管理" value=" " class="btn-archive-attachment" onclick="ArchivesDocument.attach('
									+ editId + ')">&nbsp;&nbsp;</button>';
							if (status == 5) {
								str += '<button title="发文归档" value=" " class="menu-archive-history" onclick="ArchivesDocument.arch('
										+ archivesId
										+ ')">&nbsp;&nbsp;</button>';
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
					items : [
					// {
					// iconCls : 'btn-archives-remind',
					// text : '催办',
					// xtype : 'button'
					// }
					]
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchivesGrid',
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
								emptyMsg : "当前没有记录"
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
ArchivesDocument.detail = function(editId) {
	new ArchivesDetailWin({
				archivesId : editId
			}).show();
}
/**
 * 管理公文附件
 * 
 * @param {}
 *            editId
 */
ArchivesDocument.attach = function(editId) {
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
ArchivesDocument.arch = function(archivesId) {
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