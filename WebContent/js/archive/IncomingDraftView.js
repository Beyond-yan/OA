Ext.ns('IncomingDraftView');

/**
 * @author:Ropen
 * @class ArchivesDraftManage
 * @extends Ext.Panel
 * @description 拟稿管理
 */
IncomingDraftView = Ext.extend(Ext.Panel, {
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
		IncomingDraftView.superclass.constructor.call(this, {
					id : 'IncomingDraftView',
					iconCls : 'menu-archive-draft-manage',
					title : '收文草稿',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
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
			id : 'IncomingDraftManageSearchForm',
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
								fieldLabel : '稿笺名称',
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
									+ '/flow/comQuickProDefinition.do?typeId=1205687',
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
												.getCmp('IncomingDraftManageSearchForm');
										searchPanel.getForm().reset();
									}
								}]
					},{
						xtype : 'hidden',
						name : 'Q_archType_SN_GE',
						value : 1
						//
				},{
					xtype : 'hidden',
					name : 'Q_archType_SN_LE',
					value : 2
					//
			}	, {
					xtype : 'hidden',
					name : 'Q_isdraft_L_EQ',
					value : 1
					//
			}, {
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
				'Q_archType_SN_GE' : 1,
				'Q_archType_SN_LE' : 2,
				'Q_isdraft_L_EQ' : 1
			},
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : [{
						name : 'archivesId',
						type : 'int'
					}, 'typeId', 'typeName', 'archivesNo', 'issueDep', 'depId',
					'subject', 'issueDate', 'status', 'shortContent',
					'fileCounts', 'privacyLevel', 'urgentLevel', 'issuer',
					'issuerId', 'keywords', 'sources', 'archType','recDepIds','recDepNames','depSignNo','isdraft','createtime']
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
						header : '公文类型',
						dataIndex : 'typeId',
						hidden : true
					}, {
						header : '文件标题',
						dataIndex : 'subject',
							renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.archivesId;
							var defId = record.data.recDepIds;
							var flowName = record.data.recDepNames;
							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'"  onclick="IncomingDraftView.edit('
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
						header : '来文单位',
						dataIndex : 'issueDep'
					},  {
						header : '公文状态',
						dataIndex : 'isdraft',
						renderer : function(value) {
							if (value == 1) {
								return '<font color="#777">草稿</font>';
							} else if (value == 0) {
								return '<font color="red">待审核</font>';
							}
						}
					}, {
						header : '来文号',
						dataIndex : 'depSignNo'
					},{
						header : '秘密等级',
						dataIndex : 'privacyLevel'
					}, {
						header : '紧急程度',
						dataIndex : 'urgentLevel'
					}, {
						header : '收文时间',
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
							var defId = record.data.recDepIds;
							var flowName = record.data.recDepNames;
							var str = '';	
									str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" value=" " class="btn-del" onclick="IncomingDraftView.remove('
											+ editId
											+ ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';
									str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="继续拟稿" value=" " class="btn-archive-draft" onclick="IncomingDraftView.edit('
										+ editId
										+ ','
										+ defId
										+ ',\''
										+ flowName
										+ '\')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;继续拟稿</a>';
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
					id : 'IncomingGrid',
					region : 'center',
					stripeRows : true,
					tbar : this.topbar,
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
				searchPanel :self.searchPanel,
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
										Ext.ux.Toast.msg('操作信息', '成功删除该拟稿！');
										Ext.getCmp('IncomingGrid').getStore()
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
IncomingDraftView.edit = function(editId, defId, flowName) {
	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);
	if (startForm == null) {
		startForm = new ProcessRunStart({
					id : 'ProcessRunStart' + defId,
					defId : defId,
					archivesId : editId,
					flowName : flowName
				});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
}
/**
 * 编辑草稿
 * 
 * @param {}
 *            editId
 */
IncomingDraftView.editDraft = function(editId) {
	var tabs = Ext.getCmp('centerTabPanel');
	var edit = Ext.getCmp('ArchivesDraftView');
	if (edit == null) {
		edit = new ArchivesDraftView({
					archivesId : editId
				});
		tabs.add(edit);
	} else {
		tabs.remove('ArchivesDraftView');
		edit = new ArchivesDraftView({
					archivesId : editId
				});
		tabs.add(edit);
	}
	tabs.activate(edit);
}
/**
 * 删除
 * 
 * @param {}
 *            ids
 */
IncomingDraftView.remove = function(ids) {
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
									Ext.ux.Toast.msg('操作信息', '成功删除该拟稿！');
									Ext.getCmp('IncomingGrid').getStore()
											.reload();
								},
								failure : function(response, options) {
									Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
								}
							});
				}
			});// end of comfirm
}
