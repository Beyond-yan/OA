Ext.ns('MyCCArchives');
MyCCArchives = Ext.extend(Ext.Panel, {
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
		MyCCArchives.superclass.constructor.call(this, {
					id : 'MyCCArchives',
					title : '抄送公文',
					iconCls : 'menu-holiday',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},

	// 初始化组件
	initUIComponents : function() {

		// 查询Panel
		this.searchPanel = new Ext.FormPanel({
					height : 88,
					region : 'north',
					frame : false,
					id : 'MyCCArchivesSearchForm',
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
									columnWidth : .25,
									layout : 'form',
									defaults : {
										border : false,
										anchor : '96%,96%'
									},
									items : [{
												fieldLabel : '标题',
												name : 'subject',
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
												fieldLabel : '收文编号',
												name : 'archivesNo',
												xtype : 'textfield'
											}]
								}, {
									columnWidth : .25,
									layout : 'form',
									defaults : {
										border : false,
										anchor : '96%,96%'
									},
									items : [{
												fieldLabel : '来文字号',
												name : 'depSignNo',
												xtype : 'textfield'
											}]
								}, {
									columnWidth : .25,
									layout : 'form',
									defaults : {
										border : false,
										anchor : '96%,96%'
									},
									items : [{
												fieldLabel : '阅读状态',
												hiddenName : 'status',
												xtype : 'combo',
												anchor : '95%',
												mode : 'local',
												editable : false,
												triggerAction : 'all',
												store : [['-1','全部'],['1', '已阅读'],
														['0', '未阅读']]
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
							handler : function() {
								var searchPanel = Ext
										.getCmp('MyCCArchivesSearchForm');
								var gridPanel = Ext.getCmp('MyCCArchivesGrid');
								if (searchPanel.getForm().isValid()) {
									$search({
												searchPanel : searchPanel,
												gridPanel : gridPanel

											});
								}

							}
						}, {
							xtype : 'button',
							text : '重置',
							style : 'padding-left:5px;',
							iconCls : 'btn-reseted',
							handler : function() {
								var searchPanel = Ext
										.getCmp('MyCCArchivesSearchForm');
								searchPanel.getForm().reset();
							}
						}]
					}]
				});// end of the searchPanel

		// 数据源
		var store = new Ext.data.JsonStore({
					url : __ctxPath + '/archive/getCCArchives.do?userId='
							+ curUserInfo.userId,
					params : {
					status:0
					},
					root : 'result',
					totalProperty : 'totalCounts',
					fields : [{
								name : 'archivesId',
								type : 'int'
							}, 'id', 'subject', 'issuer', 'createtime',
							'runId', 'defId', 'status', 'taskName',
							'assignUserName']
				});
		store.load({
					params : {
						start : 0,
						limit : 25
					}
				});
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'issuerId',
						dataIndex : 'issuerId',
						hidden : true
					}, {
						header : '标题',
						dataIndex : 'subject',
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var Id = record.data.id;
							var editId = record.data.archivesId;
							var runId = record.data.runId;
							var defId = record.data.defId;
							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'"  onclick="MyCCArchives.detail('
									+ editId
									+ ','
									+ defId
									+ ','
									+ Id
									+ ',\''
									+ runId + '\')">' + value + '</a>';
							return str;
						}
					}, {
						header : '当前办理步骤',
						dataIndex : 'taskName'
					}, {
						header : '当前办理人',
						dataIndex : 'assignUserName'
					}, {
						header : '登记人',
						dataIndex : 'issuer'
					}, {
						header : '登记时间',
						dataIndex : 'createtime'
					}, {
						header : '阅读状态',
						dataIndex : 'status',
						renderer : function(value) {
							if (value == 0) {
								return '<font color="#777">未阅读</font>';
							} else if (value == 1) {
								return '<font color="red">已阅读</font>';
							}
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
		// gridPanel
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'MyCCArchivesGrid',
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
								pageSize : 25,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});// end of the gridPaenl

	}
});

MyCCArchives.detail = function(editId, defId, Id, runId) {
	new MyccArchDetailView({
				archivesId : editId,
				runId : runId,
				defId : defId,
				archType : 1,
				isGranted : isGranted,
				Id : Id
			}).show();
}
