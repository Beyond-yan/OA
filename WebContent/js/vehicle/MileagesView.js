Ext.ns('MileagesView');
MileagesView = Ext.extend(Ext.Panel, {
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
		MileagesView.superclass.constructor.call(this, {
					id : 'MileagesView',
					title : '里程管理',
					iconCls : '',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},

	// 初始化组件
	initUIComponents : function() {

		// 查询Panel
		this.searchPanel = new Ext.FormPanel({
			id : 'MileagesSearchForm',
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
				text : '车牌号'
			}, {
				xtype : 'textfield',
				name : 'Q_car.carno_S_LK'
			},

			{
				text : '日期'
			}, {
				xtype : 'datefield',
				format : 'Y-m-d',
				name : 'Q_travelDate_D_GE'
			}, {
				text : '~'
			}, {
				xtype : 'datefield',
				format : 'Y-m-d',
				name : 'Q_travelDate_D_LE'
			}, {
				xtype : 'button',
				text : '查询',
				iconCls : 'search',
				handler : function() {
					var searchPanel = Ext.getCmp('MileagesSearchForm');
					var grid = Ext.getCmp('MileagesGrid');
					if (searchPanel.getForm().isValid()) {
						$search({
							searchPanel : searchPanel,
							gridPanel : grid
						});
					}

				}
			}, {
				xtype : 'button',
				text : '重置',
				iconCls : 'btn-reset',
				handler : function() {
					var searchPanel = Ext.getCmp('MileagesSearchForm');
					searchPanel.getForm().reset();
				}
			} ]
		});// end of the searchPanel

		// 数据源
		var store = new Ext.data.JsonStore({
					url : __ctxPath + "/mileages/listMileages.do",
					root : 'result',
					totalProperty : 'totalCounts',
					fields : ['id', {
								name : 'carno',
								mapping : 'car.carno'
							},  'travelDate', 'endNumber',
							'monthMileage','createUser','createDate','updateDate','updateUser']
				});
		store.load({
					params : {
						start : 0,
						limit : 10
					}
				});
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						dataIndex : 'id',
						hidden : true
					}, {
						header : '车牌号码',
						width:40,
						dataIndex : 'carno'
						// renderer : function(value) {
					// return value.fullname;
					// }
				}	, {
						header : '日期',
						width:40,
						dataIndex : 'travelDate'
					}, {
						header : '本月里程',
						width:40,
						dataIndex : 'monthMileage'
					}, {
						header : '里程表止数',
						width:40,
						dataIndex : 'endNumber'
					},{
						header : '创建人',
						width:40,
						dataIndex : 'createUser'
					},{
						header : '创建时间',
						width:40,
						dataIndex : 'createDate'
					},{
						header : '修改人',
						width:40,
						dataIndex : 'updateUser'
					},{
						header : '修改时间',
						width:40,
						dataIndex : 'updateDate'
					}, {
						header : '管理',
						dataIndex : 'id',
						width : 50,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.id;
							var str = '';
							str = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" value=" " class="btn-del" onclick="MileagesView.remove('
									+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';
							str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="编辑" value=" " class="btn-edit" onclick="MileagesView.edit('
									+ editId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</a>';
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});// end of the cm

		// Toolbar
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '添加里程',
					xtype : 'button',
					handler : function() {
						new MileagesForm().show();
					}
				}));

		this.topbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除',
					xtype : 'button',
					handler : function() {
						var grid = Ext.getCmp("MileagesGrid");
						var selectRecords = grid.getSelectionModel()
								.getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.id);
						}
						MileagesView.remove(ids);
					}
				}));// end of the topbar

		// gridPanel
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'MileagesGrid',
					tbar : this.topbar,
					region : 'center',
					store : store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 10,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});// end of the gridPaenl

		// 监听器
		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
								if (isGranted('_AllScheduleEdit')) {
									MileagesView.edit(rec.data.Id);
								}
							});
				});
	}
});

// 删除
MileagesView.remove = function(id) {

	var grid = Ext.getCmp("MileagesGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath
										+ '/mileages/multiDelMileages.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
									grid.getStore().reload({
												params : {
													start : 0,
													limit : 10
												}
											});
								}
							});
				}
			});
};
MileagesView.edit = function(id) {
	new MileagesForm({
				Id : id
			}).show();
};
