/**
 * @author:Ropen
 * @class DocHistoryView
 * @extends Ext.Panel
 * @description [DocHistory]管理
 */
DocHistoryView = Ext.extend(Ext.Panel, {
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
				DocHistoryView.superclass.constructor.call(this, {
							id : 'DocHistoryView',
							iconCls : 'menu-archive-history',
							title : '版本管理',
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
								labelWidth : 70,
								xtype : 'label'
							},
							items : [{
										text : '文档名称'
									}, {
										name : 'Q_docName_S_LK',
										xtype : 'textfield'
									}, {
										text : '更新时间'
									}, {
										name : 'Q_updatetime_S_LK',
										xtype : 'textfield'
									}, {
										text : '修改人'
									}, {
										name : 'Q_mender_S_LK',
										xtype : 'textfield'
									}, {
										xtype : 'button',
										text : '查询',
										iconCls : 'search',
										handler : this.search
												.createCallback(this)
									}]
						});// end of the searchPanel

				// 加载数据至store
				this.store = new Ext.data.JsonStore({
							url : __ctxPath + "/archive/listDocHistory.do",
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							fields : [{
										name : 'historyId',
										type : 'int'
									}, 'archivesDoc', 'fileAttach', 'docName',
									'path', 'version', 'updatetime', 'mender']
						});
				this.store.setDefaultSort('historyId', 'desc');
				// 加载数据
				this.store.load({
							params : {
								start : 0,
								limit : 25
							}
						});
				var actions = [];
				if (isGranted('_DocHistoryDel')) {
					actions.push({
								iconCls : 'btn-del',
								qtip : '删除',
								style : 'margin:0 3px 0 3px'
							})
				}
				this.rowActions = new Ext.ux.grid.RowActions({
							header : '管理',
							width : 80,
							actions : actions
						});

				// 初始化ColumnModel
				var sm = new Ext.grid.CheckboxSelectionModel();
				var cm = new Ext.grid.ColumnModel({
							columns : [sm, new Ext.grid.RowNumberer(), {
										header : 'historyId',
										dataIndex : 'historyId',
										hidden : true
									}, {
										header : '所属公文主版本',
										dataIndex : 'archivesDoc',
										renderer : function(value) {
											return value.docName;
										}
									}, {
										header : '所属附件',
										dataIndex : 'fileAttach',
										renderer : function(value) {
											return value.fileName;
										}
									}, {
										header : '文档名称',
										dataIndex : 'docName'
									}, {
										header : '版本',
										dataIndex : 'version'
									}, {
										header : '路径',
										dataIndex : 'path'
									}, {
										header : '更新时间',
										dataIndex : 'updatetime',
										renderer : function(value){
											return value.substring(0,10);
										}
									}, {
										header : '修改人',
										dataIndex : 'mender'
									}, this.rowActions],
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
				if (isGranted('_DocHistoryDel')) {
					this.topbar.add({
								iconCls : 'btn-del',
								text : '删除历史版本',
								xtype : 'button',
								handler : this.delRecords,
								scope : this
							})
				}
				this.gridPanel = new Ext.grid.GridPanel({
							id : 'DocHistoryGrid',
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

				this.rowActions.on('action', this.onRowAction, this);
			},// end of the initComponents()

			/**
			 * 
			 * @param {}
			 *            self 当前窗体对象
			 */
			search : function(self) {
				if (self.searchPanel.getForm().isValid()) {// 如果合法
					$search({
						searchPanel :self.searchPanel,
						gridPanel : self.gridPanel
					});
				}
			},

			/**
			 * 添加记录
			 */
			createRecord : function() {
				new DocHistoryForm().show();
			},
			/**
			 * 按IDS删除记录
			 * 
			 * @param {}
			 *            ids
			 */
			delByIds : function(ids) {
				Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
							if (btn == 'yes') {
								Ext.Ajax.request({
											url : __ctxPath
													+ '/archive/multiDelDocHistory.do',
											params : {
												ids : ids
											},
											method : 'POST',
											success : function(response,
													options) {
												Ext.ux.Toast.msg('操作信息',
														'成功删除该[DocHistory]！');
												Ext.getCmp('DocHistoryGrid')
														.getStore().reload();
											},
											failure : function(response,
													options) {
												Ext.ux.Toast.msg('操作信息',
														'操作出错，请联系管理员！');
											}
										});
							}
						});// end of comfirm
			},
			/**
			 * 删除多条记录
			 */
			delRecords : function() {
				var gridPanel = Ext.getCmp('DocHistoryGrid');
				var selectRecords = gridPanel.getSelectionModel()
						.getSelections();
				if (selectRecords.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var ids = Array();
				for (var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.historyId);
				}
				this.delByIds(ids);
			},

			/**
			 * 管理列中的事件处理
			 * 
			 * @param {}
			 *            grid
			 * @param {}
			 *            record
			 * @param {}
			 *            action
			 * @param {}
			 *            row
			 * @param {}
			 *            col
			 */
			onRowAction : function(gridPanel, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.delByIds(record.data.historyId);
						break;
					// case 'btn-edit' :
					// this.editRecord(record);
					// break;
					default :
						break;
				}
			}
		});
