/**
 * @author:Ropen
 * @class documentChangeTrainsView
 * @extends Ext.Panel
 * @description 拟稿管理
 */
documentChangeTrainsView = Ext.extend(Ext.Panel, {
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
		documentChangeTrainsView.superclass.constructor.call(this, {
					id : 'documentChangeTrainsView',
					iconCls : 'menu-planmanage',
					title : '单位公文下载',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			height : 88,
			region : 'north',
			id : 'documentChangeTrainsSearchForm',
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
					columnWidth : .35,
					layout : 'form',
					defaults : {
						border : false,
						anchor : '96%,96%'
					},
					items : [{
						width : 40,
						fieldLabel : '稿笺名称',
						id : 'documentChangeTrainsStoredDefId',
						xtype : 'combo',
						hiddenName : 'defId',
						editable : false,
						triggerAction : 'all',
						displayField : 'name',
						valueField : 'id',
						// emptyText:'请选择单位',
						store : new Ext.data.SimpleStore({
							autoLoad : true,
							url : __ctxPath
									+ '/flow/comQuickProDefinition.do?typeId=1205686',
							fields : ['id', 'name']
						})

					}]
				}, {
					columnWidth : .35,
					layout : 'form',
					defaults : {
						border : false,
						anchor : '96%,96%'
					},
					items : [{
								width : 60,
								id : 'documentChangeTrainsTrainsNo',
								fieldLabel : '标题',
								name : 'subject',
								xtype : 'textfield'
							}]
				}, {
					columnWidth : .3,
					layout : 'form',
					defaults : {
						border : false,
						anchor : '96%,96%'
					},
					items : [{
						width : 40,
						fieldLabel : '发文单位',
						xtype : "textfield",
						id : 'documentChangeTrainsPrivacyLevel',
						triggerAction : 'all',
						editable : false,
						name : 'depName'

					}]
				}]
			}, {
				xtype : 'panel',
				border : false,
				layout : 'hbox',
				layoutConfig : {
					pack : 'center',
					align : 'middle'
				},
				items : [{
							xtype : 'button',
							text : '查询',
							iconCls : 'search',
							handler : this.search.createCallback(this)
						}, {
							xtype : 'button',
							text : '重置',
							style : 'padding-left:10px;',
							iconCls : 'btn-reset',
							handler : function() {
								Ext.getCmp('documentChangeTrainsSearchForm').getForm()
										.reset();

							}
						}]
			}, {
				xtype : 'hidden',
				name : 'toDoType',
				value : 3
			}, {
				xtype : 'hidden',
				name : 'archiveType',
				value : 0
			}]
		});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/flow/listFlowTaskReport.do",
					baseParams : {
						archiveType : 0,
						toDoType : 3
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : ['archiveId', 'archivesNo', 'runSubject',
							'archCreateTime', 'signDate', 'defId', 'runId']
				});
		this.store.setDefaultSort('archiveId', 'desc');
		// 加载数据
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
								iconCls : 'btn-archives-detail',
								qtip : '公文信息',
								text : '公文信息',
								style : 'margin:0 3px 0 3px'
							}]
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
						header : 'archiveId',
						dataIndex : 'archiveId',
						hidden : true
					}, {
						header : '标题',
						dataIndex : 'runSubject'
					}, {
						header : '发文字号',
						dataIndex : 'archivesNo'
					}, {
						header : '拟稿日期',
						dataIndex : 'archCreateTime'
					}, {
						header : '签发日期',
						dataIndex : 'signDate'
					}, this.rowActions],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'documentChangeTrainsGrid',
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

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
							});
				});
		this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()

	/**
	 * 
	 * @param {}
	 *            self 当前窗体对象
	 */
	search : function(self) {// alert(Ext.getCmp('sentStoredPrivacyLevel').getValue());
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
						searchPanel : self.searchPanel,
						gridPanel : self.gridPanel
					});
		}
	},

	// 把表格导出到Excel
	/*tableToExcel : function(self) {
		var recordCount = self.store.getCount();
		if (recordCount > 0) {

			
			 * Ext.getCmp('SentStoreSearchForm').getForm().submit({ url :
			 * __ctxPath+ '/flow/sentArchivesToExcelDownLoad.do', method :
			 * 'POST', success : function(fp, action) { alert(action);
			 * alert(fp); //window.location.href = action. }, failure :
			 * function(fp, action) { Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！'); } })
			 

			var url = __ctxPath
					+ '/flow/sentArchivesToExcelDownLoad.do?archiveType=1'
					+ '&defId='
					+ Ext.getCmp('sentStoredDefId').getValue()
					+ '&urgentLevel='
					+ Ext.getCmp('sentStoredUrgetLevel').getValue()
					+ '&privacyLevel='
					+ Ext.getCmp('sentStoredPrivacyLevel').getValue()
					+ '&archiveNo='
					+ Ext.getCmp('sentStoredArchivesNo').getValue()
					+ '&startDate='
					+ Ext.util.Format.date(Ext.getCmp('sentStoredStartDt')
									.getValue(), 'Y-m-d')
					+ '&endDate='
					+ Ext.util.Format.date(Ext.getCmp('sentStoredEndDt')
									.getValue(), 'Y-m-d') + '&issuedep='
					+ Ext.getCmp('sentStoredIssuedep').getValue();
			url = encodeURI(url);
			url = encodeURI(url);
			window.location.href = url;
		} else {
			Ext.Msg.alert("提示", "没有数据需要导出！")
		}
	},*/
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
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-archives-detail' :
				documentChangeTrainsView.detail(record.data.archiveId,
						record.data.runId, record.data.defId);
				break;
			default :
				break;
		}
	}
});
documentChangeTrainsView.detail = function(editId, runId, defId) {
	new DocumentChangeView({
				archivesId : editId,
				runId : runId,
				defId : defId,
				archType : 0
			}).show();
}