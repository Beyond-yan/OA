 /**
 * @author:Ropen
 * @class ToReportArchivesView
 * @extends Ext.Panel
 * @description 拟稿管理
 */
ToReportArchivesView = Ext.extend(Ext.Panel, {
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
		ToReportArchivesView.superclass.constructor.call(this, {
					id : 'ToReportArchivesView',
					iconCls : 'menu-archive-issue-manage',
					title : '报文查询',
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
			id : 'ToReportArchivesViewSearchForm',
			layout : 'form',
			defaults : {
				border : false
			},
			bodyStyle : 'padding:5px;',
			items : [{
						name : 'Q_createDate_D_GE',
						xtype : 'hidden',
						id : 'GWXZsentStoredStartDt'
					}, {
						xtype : 'hidden',
						name : 'Q_createDate_D_LE',
						id : 'GWXZsentStoredendDate'
					}, {
						layout : 'column',
						defaults : {
							border : false
						},
						items : [/*{
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
								hiddenName : 'defId',
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
						},*/ {
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
							columnWidth : .24,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										width : 60,
										// id : 'sentStoredArchivesNo',
										fieldLabel : '收文编号',
										name : 'Q_archivesno_S_LK',
										xtype : 'textfield'
									}]
						}/*, {
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{

								width : 60,
								// id : 'sentStoredsnConfigId',
								fieldLabel : '编号办法',
								hiddenName : 'snConfigId',
								xtype : 'combo',
								editable : false,
								mode : 'local',
								triggerAction : 'all',
								displayField : 'name',
								valueField : 'id',
								store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/snconfig/signComboFileSnConfig.do?snType=1',
									fields : ['id', 'name'],
									baseParams : {
										start : 0,
										limit : 10000
									}
								})
							}]
						}*/,{
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
												.getCmp('GWXZsentStoredStartDt')
												.setValue((this.getValue() + '-01-01'));
										Ext
												.getCmp('GWXZsentStoredendDate')
												.setValue(Ext.util.Format
														.substr(
																this.getValue(),
																0, 4)
														+ '-12-31');
									}
								}
							}]
						}]
					}, /*{
						layout : 'column',
						defaults : {
							border : false
						},
						items : [ {
							columnWidth : .24,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										width : 60,
										// id : 'sentStoredArchivesNo',
										fieldLabel : '收文编号',
										name : 'Q_archivesno_S_LK',
										xtype : 'textfield'
									}]
						}]
					},*/ {
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
									style:'padding-left:5px;',
									iconCls : 'btn-reseted',
									handler : function() {
										var searchPanel = Ext
												.getCmp('ToReportArchivesViewSearchForm');
										searchPanel.getForm().reset();
									}
								}]
					}, {
						xtype : 'hidden',
						name : 'Q_archtype_L_EQ',
						value : 3
					}]
		});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
			url : __ctxPath
			+ "/system/listReceiveDownloadSysDataTransfer.do",
					baseParams : {
						'Q_archtype_L_EQ':3
					},
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : ['sources', 'archivesId','runid', 'archivesno', 'id',
								'subject', 'sendDep', 'transferType','dataSource',
								'writtenDate', 'createDate', 'issuer','archtype','fromSchema',
								'receiveFlag','createUserFullName']
				});
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});
		this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 180,
					actions : [
							// {
							// iconCls : 'btn-archives-detail',
							// qtip : '公文信息',
							// text : '公文信息',
							// style : 'margin:4px 3px 4px 3px'
							// },
							{
						iconCls : 'btn-flowView',
						text : '监控列表',
						qtip : '监控列表',
						style : 'margin:4px 3px 4px 3px'
					}/*
						 * ,{ iconCls : 'menu-archive-template', text : '公文分发',
						 * qtip : '公文分发', style : 'margin:4px 3px 4px 3px' }
						 */]
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
						header : 'archivesId',
						dataIndex : 'archivesId',
						hidden : true
					}, {
						header : '收文字号',
						dataIndex : 'archivesno',
						renderer : function(value) {
							if (value == '0') {
								var str = '未生成编号';
								return str;
							} else {
								return value;
							}
						}
					}, {
						header : '分发日期',
						dataIndex : 'createDate'
					}, {
						header : '标题',
						dataIndex : 'subject',
						width : 300,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							metadata.attr = 'style="white-space:normal;"'; 
							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToReportArchivesView.detail('
								+ record.data.id+','
								+ record.data.runid+','+record.data.dataSource+','+record.data.fromSchema+')">'
									+ value
									+ '</a>';
							return str;
						}
					},{
						header : '管理',
						dataIndex : 'receiveFlag',
						width : 150,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var str='<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToReportArchivesView.proDetail('
								+ record.data.archivesId+')">'
								+ '<img src="'
								+ __ctxPath
								+ '/images/system/edit.gif"/>监控列表'
								+ '</a>';
							var receiveFlag=record.data.receiveFlag;
							if(receiveFlag=="0"){
								str += '&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="ToReportArchivesView.back('
									+ record.data.archivesId+')">'
										+'<img src="'
										+ __ctxPath
										+ '/images/system/delete.gif"/>撤回'
										+ '</a>';
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
					items : []
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ToReportArchivesViewGrid',
					region : 'center',
					stripeRows : true,
					// tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
					plugins : this.rowActions,
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
						searchPanel : self.searchPanel,
						gridPanel : self.gridPanel
					});
		}
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {

			case 'btn-flowView' :
				ToReportArchivesView.proDetail(record.data.archivesId);
				break;
			default :
				break;
		}
	}

});

/**
 * 查阅详情
 * 
 * @param {}
 *            record
 */
ToReportArchivesView.detail= function(archivesId,runid,dataSource,fromSchema) {
	new ToReceiveArchivesDetailView({
		archivesId : archivesId,
		isReceive : 1,
		archType : 3,
		download :1,
		runid:runid,
		dataSource:dataSource,
		fromSchema:fromSchema
	}).show();}

/**
 * 显示明细
 * 
 */
ToReportArchivesView.proDetail = function(archiveId) {
	if(Ext.getCmp('ArchivesDepView') != null){
		Ext.getCmp('centerTabPanel').remove(Ext.getCmp('ArchivesDepView'));
	}
	App.clickTopTab('ArchivesDepView', {
		archiveId : archiveId
	});
};
ToReportArchivesView.back= function(archiveId) {
	Ext.Msg.confirm('提示', '确定撤回该报文？', function(btn, text) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath
						+ '/archive/reportArchToBackArchives.do',
				params : {
					'archivesId' : archiveId
				},
				method : 'post',
				success : function(response, options) {
					var gridPanel = Ext.getCmp('ToReportArchivesViewGrid');
					if (gridPanel != null) {
						gridPanel.getStore().reload();
					}
					Ext.ux.Toast.msg('操作信息', '撤回成功！');
				}
			})
		}
	});
};
