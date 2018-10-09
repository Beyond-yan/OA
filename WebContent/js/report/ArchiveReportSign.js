Ext.ns('ArchiveReportSign');

/**
 * @author:Ropen
 * @class ArchivesDraftManage
 * @extends Ext.Panel
 * @description 拟稿管理
 */
ArchiveReportSign = Ext.extend(Ext.Panel, {
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
		ArchiveReportSign.superclass.constructor.call(this, {
					id : 'ArchiveReportSign',
					iconCls : 'menu-archive-draft',
					title : '格式管理',
					region : 'center',
					layout : 'border',
					items : [this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
			var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			height : 88,
			region : 'north',
			frame : false,
			id : 'ArchiveReportSignSearchForm',
			layout : 'form',
			bodyStyle : 'padding:5px',
			defaults : {
				border : false
			},
			items : [{
						name : 'Q_createtime_D_GE',
						xtype : 'hidden',
						id : 'Q_createtime_D_GE'
					}, {
						xtype : 'hidden',
						name : 'Q_createtime_D_LE',
						id : 'Q_createtime_D_LE'
					},  {
						layout : 'column',
						defaults : {
							border : false
						},
						items : [{
							columnWidth : .24,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '流程名称',
								width : 180,
								xtype : 'combo',
								listWidth : 450,
								hiddenName : 'Q_recDepIds_S_EQ',
								editable : false,
								triggerAction : 'all',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/flow/comQuickProDefinition.do?typeId=6668842',
									fields : ['id', 'name']
								})
							}

							]
						}, {
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										fieldLabel : '标题',
										name : 'Q_subject_S_LK',
										xtype : 'textfield',
										width : 180
									}]
						}, {
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '年份',
								width : 130,
								xtype : 'combo',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : arr,
								emptyText : '---年份---',
								listeners : {
									select : function() {
										Ext
												.getCmp('Q_createtime_D_GE')
												.setValue((this.getValue() + '-01-01'));
										Ext
												.getCmp('Q_createtime_D_LE')
												.setValue(Ext.util.Format
														.substr(
																this.getValue(),
																0, 4)
														+ '-12-31');
									}
								}
							}]
						}]
					},{
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
									style : 'padding-left:5px;',
									iconCls : 'btn-reseted',
									handler : function() {
										var searchPanel = Ext
												.getCmp('ArchiveReportSignSearchForm');
										searchPanel.getForm().reset();
									}
								}]
					},{
								xtype : 'hidden',
								name : 'Q_archType_SN_EQ',
								value : 3
								//
						}	, {
								xtype : 'hidden',
								name : 'Q_isdraft_L_EQ',
								value : 3
								//
						}, /*{
							xtype : 'hidden',
							name : 'Q_status_SN_EQ',
							value : 1
							//
						}	,*/ {
								xtype : 'hidden',
								name : 'Q_issuerId_L_EQ',
								value : curUserInfo.userId
							}]
		});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/archive/listArchives.do",
					root : 'result',
					baseParams : {
						'Q_issuerId_L_EQ' : curUserInfo.userId,
						'Q_archType_SN_EQ' : 3,
						//'Q_status_SN_EQ' : 1,
						'Q_isdraft_L_EQ' : 2
					},
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'archivesId',
								type : 'int'
							}, 'urgentLevel','privacyLevel', 'subject', 'archivesNo', 'typeName',
							'sendTo', 'ccTo', 'shortContent', 'handlerUids','issueDep','recDepIds','recDepNames','isdraft', 'issueDate']
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
						header : '公文字号',
						dataIndex : 'archivesNo'
					}, {
						header : '公文标题',
						width:150,
						dataIndex : 'subject',
							renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.archivesId;
							var defId = record.data.recDepIds;
							var flowName = record.data.recDepNames;
							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'"  onclick="ArchiveReportSign.edit('
									+ editId
									+ ','
									+ defId
									+ ',\''
									+ flowName
									+ '\')">'
									+ value
									+ '</a>';
							return str;
						}
					}, {
						header : '发文单位',
						dataIndex : 'issueDep'
					}, {
						header : '发文日期',
						dataIndex : 'issueDate'
					},{
						header : '管理',
						width : 100,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.archivesId;
							var defId = record.data.recDepIds;
							var flowName = record.data.recDepNames;
							var str = '';
							str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="格式管理" value=" " class="btn-archive-draft" onclick="ArchiveReportSign.edit('
									+ editId
									+ ','
									+ defId
									+ ',\''
									+ flowName
									+ '\')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格式管理</a>';
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
			items : [{
				iconCls : 'btn-add',
				text : '公文登记',
				xtype : 'button',
				handler : function() {
					new ArchiveReportAddView().show();
				}
			}]
		});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ArchiveReportSignGrid',
					region : 'center',
					stripeRows : true,
					tbar : null,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					height : 600,
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
	 * 添加记录
	 */
	createRecord : function() {
		new ArchivesDraftView().show();
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
											+ '/archive/multiDelArchives.do',
									params : {
										ids : ids
									},
									method : 'POST',
									success : function(response, options) {
										Ext.ux.Toast.msg('操作信息', '成功删除该信息！');
										Ext.getCmp('ArchiveReportSignGrid').getStore()
												.reload();
									},
									failure : function(response, options) {
										Ext.ux.Toast
												.msg('操作信息', '操作出错，请联系管理员！');
									}
								});
					}
				});// end of comfirm
	}
});
/**
 * 修改
 */
ArchiveReportSign.edit = function(editId, defId, flowName) {
	new ArchiveReportSignView({
		archivesId:editId
	}).show();
}
/**
 * 删除
 * 
 * @param {}
 *            ids
 */
ArchiveReportSign.remove = function(ids) {
	Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath
						+ '/archive/multiDelArchives.do',
				params : {
					ids : ids
				},
				method : 'POST',
				success : function(response, options) {
					Ext.ux.Toast.msg('操作信息', '成功删除该登记单！');
					Ext.getCmp('ArchiveReportSignGrid').getStore().reload();
				},
				failure : function(response, options) {
					Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
				}
			});
		}
	});
}
