Ext.ns('NewsTypeView');

NewsTypeView = Ext.extend(Ext.Panel, {
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
		NewsTypeView.superclass.constructor.call(this, {
					id : 'NewsTypeView',
					title : '新闻类别',
					iconCls : 'menu-news_type',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		this.searchPanel = new Ext.FormPanel({
			id : 'NewTypeSearchForm',
			region : 'north',
			height : 35,
			frame : false,
			border : false,
			layout : 'hbox',
			layoutConfig : {
				padding : '5',
				align : 'middle'
			},
			defaults : {
				style : 'padding:0px 5px 0px 5px;',
				xtype : 'label'
			},
			items : [{
						text : '查询条件:'
					}, {
						text : '类别名称'
					}, {
						xtype : 'textfield',
						name : 'Q_typeName_S_LK'
					}, {
						text : '类别顺序'
					}, {
						xtype : 'numberfield',
						name : 'Q_sn_SN_EQ'
					}, {
						text : '查询',
						xtype : 'button',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext.getCmp("NewTypeSearchForm");
							var gridPanel = Ext.getCmp('NewsTypeGrid');
							if(searchPanel.getForm().isValid()){
								$search({
									searchPanel :searchPanel,
									gridPanel : gridPanel
								});
							}
						}
					}, {
						text : '重置',
						xtype : 'button',
						iconCls : 'reset',
						handler : function() {
							Ext.getCmp('NewTypeSearchForm').getForm().reset();
						}
					}]
		});// end of the searchPanel

		this.store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/info/listNewsType.do'
							}),
					// create reader that reads the Topic records
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'typeId',
								fields : [{
											name : 'typeId',
											type : 'int'
										}, 'typeName', {
											name : 'sn',
											type : 'int'
										}]
							}),
					remoteSort : true
				}); // end of the store

		this.store.setDefaultSort('typeId', 'desc');
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : "类别ID",
						hidden : true,
						dataIndex : 'typeId',
						width : 40
					}, {
						header : "类别名",
						dataIndex : 'typeName',
						width : 100
					}, {
						header : "类别顺序",
						dataIndex : 'sn',
						width : 50
					}, {
						header : '管理',
						dataIndex : 'typeId',
						width : 150,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.typeId;
							var str = '';
							if (isGranted('_NewsTypeDel')) {
								str = '<button title="删除" value=" " class="btn-del" onclick="NewsTypeView.remove('
										+ editId + ')">&nbsp</button>';
							}
							if (isGranted('_NewsTypeEdit')) {
								str += '&nbsp;&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="NewsTypeView.edit('
										+ editId + ')">&nbsp</button>';
								str += '&nbsp;&nbsp;<button title="置顶" value=" " class="btn-up" onclick="NewsTypeView.sort('
										+ editId
										+ ','
										+ 1
										+ ')">&nbsp</button>'
								str += '&nbsp;&nbsp;<button title="上移" value=" " class="btn-top" onclick="NewsTypeView.sort('
										+ editId
										+ ','
										+ 2
										+ ')">&nbsp</button>'
								str += '&nbsp;&nbsp;<button title="下移" value=" " class="btn-down" onclick="NewsTypeView.sort('
										+ editId
										+ ','
										+ 3
										+ ')">&nbsp</button>'
								str += '&nbsp;&nbsp;<button title="置末" value=" " class="btn-last" onclick="NewsTypeView.sort('
										+ editId
										+ ','
										+ 4
										+ ')">&nbsp</button>'
							}
							return str;
						}
					}],
			defaults : {
				menuDisabled : true,
				width : 100
			},
			listeners : {
				hiddenchange : function(cm, colIndex, hidden) {
					saveConfig(colIndex, hidden);
				}
			}
		});// end of cm
		this.topbar = new Ext.Toolbar({
					height : 30,
					items : []
				});
		if (isGranted('_NewsTypeAdd')) {
			this.topbar.add(new Ext.Button({
						text : '添加',
						iconCls : 'btn-add',
						handler : function() {
							new NewsTypeForm().show();
						}
					}));
		}// end of topbar

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'NewsTypeGrid',
					region : 'center',
					autoWidth : true,
					autoHeight : true,
					tbar : this.topbar,
					closable : true,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					cm : cm,
					sm : sm,
					// customize view config
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},

					// paging bar on the bottom
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});// end of gridPanel
		this.gridPanel.addListener('rowdblclick', rowdblclickFn);
		function rowdblclickFn(grid, rowindex, e) {
			grid.getSelectionModel().each(function(rec) {
						if (isGranted('_NewsTypeEdit')) {
							NewsTypeView.edit(rec.data.typeId);
						}
					});
		}

	}// end of the initUIComponents
});

/**
 * 类别删除
 * 
 * @param {}
 *            userId
 */
NewsTypeView.remove = function(typeId) {
	Ext.Msg.confirm('删除操作', '你确定要删除该类别吗?', function(btn) {
				var newsTypeView = Ext.getCmp('NewsTypeView');
				var type = Ext.getCmp('typeTree');
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + '/info/removeNewsType.do',
								method : 'post',
								params : {
									typeId : typeId
								},
								success : function() {
									var typeTree = Ext.getCmp('typeTree');
									Ext.ux.Toast.msg("操作信息", "类别删除成功");
									Ext.getCmp('NewsTypeGrid').getStore().reload();
									if (typeTree != null) {
										typeTree.root.reload();
									}
								},
								failure : function() {
									Ext.ux.Toast.msg("操作信息", "类别删除失败");
								}
							});
				}
			});

}
/**
 * 类别编辑
 * 
 * @param {}
 *            userId
 */
NewsTypeView.edit = function(typeId) {
	var newsTypeForm = Ext.getCmp('newsTypeForm');
	if (newsTypeForm == null) {
		new NewsTypeForm().show();
		newsTypeForm = Ext.getCmp('newsTypeForm');
	}
	newsTypeForm.form.load({
				url : __ctxPath + '/info/detailNewsType.do',
				params : {
					typeId : typeId
				},
				method : 'post',
				deferredRender : true,
				layoutOnTabChange : true,
				waitMsg : '正在载入数据...',
				success : function() {
				},
				failure : function() {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});
}
/**
 * 类别排序
 */
NewsTypeView.sort = function(typeId, opt) {
	Ext.Ajax.request({
				url : __ctxPath + '/info/sortNewsType.do',
				method : 'post',
				params : {
					typeId : typeId,
					opt : opt
				},
				success : function() {
					var typeTree = Ext.getCmp('typeTree');
					Ext.getCmp('NewsTypeGrid').getStore().reload();
					if (typeTree != null) {
						typeTree.root.reload();
					}
				},
				failure : function() {
					Ext.ux.Toast.msg("操作信息", "操作失败");
					Ext.getCmp('NewsTypeGrid').getStore().reload();
				}
			});
}
