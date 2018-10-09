/**
 * @author:
 * @class AppTeamView
 * @extends Ext.Panel
 * @description [AppTeam]管理
 * @company 广州宏天软件有限公司
 * @createtime:
 */
AppTeamView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	searchPanel : null,
	// GridPanel的数据Store
	store : null,
	// 数据展示Panel
	gridPanel : null,
	// 头部工具栏
	topbar : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		AppTeamView.superclass.constructor.call(this, {
			id : 'AppTeamView',
			title : '我的工作组',
			iconCls : 'menu-flowWait',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel( {
			height:38,
			region:'north',
			layout:'hbox',
			bodyStyle:'padding:6px 2px 2px 2px',
			layoutConfigs:{
				align:'middle'
			},
			defaultType:'label',
			defaults:{
				margins:'0 4 0 4'
			},
			items : [{
					xtype : 'label',
					text : '请输入查询条件:'
				}, {
			    		text:'群组名称:'
			    },{
				name : 'Q_teamName_S_LK',
				xtype : 'textfield',
				width:200
			}, {
				text : '查询',
				iconCls : 'btn-search',
				handler : this.search,
				scope:this,
				xtype : 'button'
			}, {
				iconCls : 'btn-reset',
				xtype : 'button',
				text : '重置',
				scope:this,
				handler : this.reset
			}]
		});// end of searchPanel
		
		this.store = new Ext.data.JsonStore({
			url : __ctxPath + "/system/listAppTeam.do",
			root : 'result',
			remoteSort : true,
			totalProperty : 'totalCounts',
			fields : [{
						name : 'teamId',
						type : 'int'
					}, 'teamName', 'teamDesc', 'creatorId', 'createTime']
		});
		
		this.store.setDefaultSort('teamId', 'desc');
				
		this.store.load({
			params : {
				start : 0,
				limit : 25
			}
		});
				
		this.rowActions = new Ext.ux.grid.RowActions({
			header : '管理',
			width : 80,
			actions : [{
					iconCls : 'btn-del',
					text : '删除',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-edit',
					text : '编辑',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-showDetail',
					text : '组员管理',
					qtip : '组员管理',
					style : 'margin:0 3px 0 3px'
				}]
		});
		
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
				header : 'teamId',
				dataIndex : 'teamId',
				hidden : true
			}, {
				header : '群组名称',
				dataIndex : 'teamName',
				width : 100
			}, {
				header : '群组描述',
				dataIndex : 'teamDesc',
				width : 180
			}, {
				header : 'creatorId',
				dataIndex : 'creatorId',
				hidden : true
			}, {
				header : '创建时间',
				dataIndex : 'createTime',
				width : 80
			}, this.rowActions],
				defaults : {
					sortable : true,
					menuDisabled : false,
					width : 40
				}
			});
			
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : [{
						iconCls : 'btn-add',
						text : '添加工作组',
						xtype : 'button',
						scope : this,
						handler : this.createRs
					}, {
						iconCls : 'btn-del',
						text : '删除工作组',
						xtype : 'button',
						scope : this,
						handler : this.removeSelRs
					} ]
				});
				
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'AppTeamGrid',
					region : 'center',
					stripeRows : true,
					tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					height : 700,
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
				
		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
								new SmsMobileForm({smsId : rec.data.smsId}).show();
							});
				});
		this.rowActions.on('action', this.onRowAction, this);

		/*this.topbar = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-add',
				text : '添加工作组',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}, {
				iconCls : 'btn-del',
				text : '删除工作组',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			} ]
		});*/

		/*this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'AppTeamGrid',
			url : __ctxPath + "/system/listAppTeam.do",
			fields : [ {
				name : 'teamId',
				type : 'int'
			}, 'teamName', 'teamDesc', 'creatorId', 'createTime' ],
			columns : [ {
				header : 'teamId',
				dataIndex : 'teamId',
				hidden : true
			}, {
				header : '群组名称',
				dataIndex : 'teamName',
				width : 60
			}, {
				header : '群组描述',
				dataIndex : 'teamDesc',
				width : 100
			}, {
				header : 'creatorId',
				dataIndex : 'creatorId',
				hidden : true
			}, {
				header : '创建时间',
				dataIndex : 'createTime',
				width : 80
			}, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 300,
				actions : [ {
					iconCls : 'btn-del',
					text : '删除',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-edit',
					text : '编辑',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-showDetail',
					text : '组员管理',
					qtip : '组员管理',
					style : 'margin:0 3px 0 3px'
				} ],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		// end of columns
				});
*/
		/*this.gridPanel.addListener('rowdblclick', this.rowClick);*/

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search( {
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new AppTeamForm( {
				teamId : rec.data.teamId
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new AppTeamForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/system/multiDelAppTeam.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/system/multiDelAppTeam.do',
			grid : this.gridPanel,
			idName : 'teamId'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new AppTeamForm( {
			teamId : record.data.teamId
		}).show();
	},
	
	// 成员管理Rs
	manMem : function(record) {
		new TeamMemberForm( {
			teamId : record.data.teamId
		}).show();
	},
	
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.teamId);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		case 'btn-showDetail':
			this.manMem.call(this, record);
			break;
		default:
			break;
		}
	}
});
