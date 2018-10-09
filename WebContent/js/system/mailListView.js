mailListView = Ext.extend(Ext.Panel, {
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
		mailListView.superclass.constructor.call(this, {
					id : 'mailListView',
					iconCls : 'menu-mail_box',
					title : '邮件列表',
					region : 'center',
					layout : 'border',
					items : [this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		this.store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/communicate/unReadListMail.do'
							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								fields : ['dfirstKeyColumnName', 'sendTimeStr', 'sender', 'subject','fileIds','mid']
							}),
					remoteSort : true
				});
		//this.store.setDefaultSort('dicId', 'desc');
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});
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
						header : 'mid',
						dataIndex : 'mid',
						hidden : true
					}, {
						header : '主题',
						width : 350,
						dataIndex : 'subject',
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var str = '<a href="#" title="'+value+'"'+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="App.eMailLoginOpen(\''
									+ record.data.mid+'\')">'
									+ value
									+ '</a>';
							return str;
						}
					}, {
						header : '发送人',
						dataIndex : 'sender'
					}, {
						header : '发送时间',
						dataIndex : 'sendTimeStr'
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});

		this.topbar = new Ext.Toolbar({
					id : 'DictionaryFootBar',
					height : 28,
					bodyStyle : 'text-align:left',
					items : [{
							text : '刷新',
							iconCls : 'btn-refresh',
							handler : function() {
								Ext.getCmp('mailListGrid').getStore().reload();
							}
						}]
				});
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'mailListGrid',
					region : 'center',
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
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前显示{0}至{1}， 共{2}条记录',
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
	},// end of init();
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
				new DictionaryForm().show();
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
													+ '/system/multiDelDictionary.do',
											params : {
												ids : ids
											},
											method : 'POST',
											success : function(response,
													options) {
												Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
												Ext.getCmp('DictionaryGrid').getStore().reload();
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
				var gridPanel = Ext.getCmp('DictionaryGrid');
				var selectRecords = gridPanel.getSelectionModel()
						.getSelections();
				if (selectRecords.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var ids = Array();
				for (var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.dicId);
				}
				this.delByIds(ids);
			},
			editRecord : function(record) {
				new DictionaryForm({dicId : record.data.dicId}).show();
			}
});