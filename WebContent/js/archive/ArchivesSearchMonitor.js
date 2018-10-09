/**
 * @author:Ropen
 * @class ArchivesIssueMonitor
 * @extends Ext.Panel
 * @description 拟稿管理
 */
ArchivesSearchMonitor = Ext
		.extend(
				Ext.Panel,
				{
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
						ArchivesSearchMonitor.superclass.constructor
								.call(this,
										{
											id : 'ArchivesSearchMonitor',
											iconCls : 'menu-archive-monitor',
											title : '收发文监控查询',
											region : 'center',
											layout : 'border',
											items : [ this.searchPanel,
													this.gridPanel ]
										});
					},// end of constructor

					// 初始化组件
					initUIComponents : function() {
						// 初始化搜索条件Panel
						this.searchPanel = new Ext.FormPanel( {
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
								labelWidth : 75,
								xtype : 'label'
							},
							items : [ {
								text : '类型名称'
							}, {
								name : 'Q_typeName_S_LK',
								width : 100,
								xtype : 'textfield'
							}, {
								text : '公文编号'
							}, {
								width : 100,
								name : 'Q_archivesNo_S_LK',
								xtype : 'textfield'
							}, {
								text : '文件标题'
							}, {
								width : 100,
								name : 'Q_subject_S_LK',
								xtype : 'textfield'
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : this.search.createCallback(this)
							} ]
						});// end of the searchPanel

						// 加载数据至store
						this.store = new Ext.data.JsonStore( {
							url : __ctxPath + "/archive/listArchives.do",
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							fields : [ {
								name : 'archivesId',
								type : 'int'
							}, 'typeId', 'typeName', 'archivesNo', 'issueDep',
									'depId', 'subject', 'issueDate', 'status',
									'shortContent', 'fileCounts',
									'privacyLevel', 'urgentLevel', 'issuer',
									'issuerId', 'keywords', 'sources',
									'archType', 'createtime', 'odFlowtype',
									'processRun' ]
						});
						this.store.setDefaultSort('archivesId', 'desc');
						// 加载数据
						this.store.load( {
							params : {
								start : 0,
								limit : 25
							}
						});

						// 初始化ColumnModel
						var sm = new Ext.grid.CheckboxSelectionModel();
						var cm = new Ext.grid.ColumnModel(
								{
									columns : [
											sm,
											new Ext.grid.RowNumberer(),
											{
												header : 'archivesId',
												dataIndex : 'archivesId',
												hidden : true
											},
											{
												header : 'odFlowtype',
												dataIndex : 'odFlowtype',
												hidden : true
											},
											{
												header : 'processRun',
												dataIndex : 'processRun',
												hidden : true
											},
											{
												header : '公文类型名称',
												dataIndex : 'typeName'
											},
											{
												header : '发文字号',
												dataIndex : 'archivesNo'
											},
											{
												header : '发文机关或部门',
												dataIndex : 'issueDep'
											},
											{
												header : '文件标题',
												dataIndex : 'subject'
											},
											{
												header : '公文状态',
												renderer : function(value) {
													if (value == '0') {
														return '<font color="chocolate">草稿</font>';
													} else if (value == '1') {
														return '<font color="red">待审核</font>';
													} else if (value == '2') {
														return '<font color="red">待审批</font>';
													} else if (value == '3') {
														return '<font color="red">待签发</font>';
													} else if (value == '4') {
														return '<font color="red">待复核</font>';
													} else if (value == '5') {
														return '<font color="copper">待归档</font>';
													} else if (value == '6') {
														return '<font color="sienna">不归档</font>';
													} else if (value == '7') {
														return '<font color="green">已归档</font>';
													} else if (value ==  '8') {
														return '<font color="red">退回</font>';
													} else if (value == '9') {
														return '<font color="gray">已取消</font>';
													}
												}
											},
											{
												header : '秘密等级',
												dataIndex : 'privacyLevel'
											},
											{
												header : '紧急程度',
												dataIndex : 'urgentLevel'
											},
											{
												header : '发文时间',
												dataIndex : 'createtime',
												renderer : function(value) {
													return value.substring(0,
															10);
												}
											},
											{
												header : '管理',
												width : 100,
												sortable : false,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {
													var editId = record.data.archivesId;
													var status = record.data.status;
													var str = '';
													str += '<button title="查阅详情" value=" " class="btn-archives-detail" onclick="ArchivesSearchMonitor.detail(' + editId + ')">&nbsp;&nbsp;</button>';
													var obj = record.data.processRun;
													if (obj != null
															&& obj != undefined
															&& obj != '') {
														var runId = record.data.processRun.runId;
														var defId = record.data.processRun.proDefinition.defId;
														;
														var piId = record.data.processRun.piId;
														var subject = record.data.processRun.subject;
														var runStatus = record.data.processRun.runStatus;
														if (runId != null
																&& runId != undefined
																&& runId != '') {
															str += '&nbsp;<button type="button" title="审批明细" value=" " class="btn-flowView" onclick="ArchivesSearchMonitor.proDetail('
																	+ runId
																	+ ','
																	+ defId
																	+ ',\''
																	+ piId
																	+ '\',\''
																	+ subject
																	+ '\')"></button>';
														}
														if (runStatus == 2) {
															str += '<button title="查看收文执行明细" value=" " class="menu-archive-history" onclick="ArchivesSearchMonitor.subDetail(' + editId + ')">&nbsp;&nbsp;</button>';
														}
													}
													return str;
												}

											} ],
									defaults : {
										sortable : true,
										menuDisabled : false,
										width : 100
									}
								});
						// 初始化工具栏
						this.topbar = new Ext.Toolbar( {
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

						this.gridPanel = new Ext.grid.GridPanel( {
							id : 'ArchivesSearchMonitorGrid',
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
							viewConfig : {
								forceFit : true,
								autoFill : true, // 自动填充
								forceFit : true
							// showPreview : false
							},
							bbar : new HT.PagingBar( {
								store : this.store
							})
						});

						this.gridPanel.addListener('rowdblclick', function(
								grid, rowindex, e) {
							grid.getSelectionModel().each(function(rec) {
							});
						});
						// this.rowActions.on('action', this.onRowAction, this);
					},// end of the initComponents()

					/**
					 * 
					 * @param {}
					 *            self 当前窗体对象
					 */
					search : function(self) {
						if (self.searchPanel.getForm().isValid()) {// 如果合法
							$search( {
								searchPanel : self.searchPanel,
								gridPanel : self.gridPanel
							});
						}
					},
					/**
					 * 删除多条记录
					 */
					delRecords : function() {
						var gridPanel = Ext.getCmp('ArchivesSearchMonitorGrid');
						var selectRecords = gridPanel.getSelectionModel()
								.getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for ( var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.archivesId);
						}
						this.delByIds(ids);
					},

					/**
					 * 查阅详情
					 * 
					 * @param {}
					 *            record
					 */
					detail : function(record) {
						new ArchivesDetailWin( {
							archivesId : record.data.archivesId
						}).show();
					}
				});

/**
 * 展示公文详细信息
 * 
 * @param {}
 *            editId
 */
ArchivesSearchMonitor.detail = function(editId) {
	new ArchivesDetailWin( {
		archivesId : editId
	}).show();
};

/**
 * 展示公文子收文明细
 * 
 * @param {}
 *            editId
 */
ArchivesSearchMonitor.subDetail = function(editId) {
	new ArchSubDetailForm( {
		parentArchId : editId
	}).show();
};

/**
 * 显示明细
 * 
 * @param {}
 *            runId
 * @param {}
 *            name
 */
ArchivesSearchMonitor.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};