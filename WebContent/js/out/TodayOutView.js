Ext.ns('TodayOutView');
TodayOutView = Ext
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
						TodayOutView.superclass.constructor.call(this, {
							id : 'TodayOutView',
							title : '今日外出人员',
							iconCls : '',
							region : 'center',
							layout : 'border',
							items : [ this.searchPanel, this.gridPanel ]
						});
					},
					// 初始化组件
					initUIComponents : function() {

						// 查询Panel
						this.searchPanel = new HT.SearchPanel(
								{
									id : 'TodayOutSearchForm',
									layout : 'form',
									region : 'north',
									colNums : 4,
									items : [
											{
												fieldLabel : '外出人员姓名',
												name : 'Q_appUser.fullname_S_LK',
												flex : 1,
												xtype : 'textfield'

											},
											{
												fieldLabel : '部门:',
												name : 'Q_depName_S_LK',
												flex : 1,
												xtype : 'combo',
												editable : true,
												allowBlank : true,
												triggerAction : 'all',
												displayField : 'depname',
												valueField : 'depid',
												mode : 'local',
												store : new Ext.data.SimpleStore(
														{
															autoLoad : true,
															url : __ctxPath
																	+ '/system/comboDep3Department.do',
															fields : [ 'depid',
																	'depname' ]
														})
											},{
												fieldLabel : '外出日期从',
												name : 'Q_startDate_D_GE',
												flex : 1,
												xtype : 'datefield',
												format : 'Y-m-d'
											}, {
												fieldLabel : '至',
												name : 'Q_startDate_D_LE',
												flex : 1,
												xtype : 'datefield',
												format : 'Y-m-d'
											} ],

									buttons : [
											{
												xtype : 'button',
												text : '查询',
												iconCls : 'search',
												handler : function() {
													var searchPanel = Ext
															.getCmp('TodayOutSearchForm');
													var gridPanel = Ext
															.getCmp('TodayGrid');
													if (searchPanel.getForm()
															.isValid()) {
														$search({
															searchPanel : searchPanel,
															gridPanel : gridPanel
														});
													}

												}
											},
											{
												xtype : 'button',
												text : '重置',
												iconCls : 'btn-reseted',
												handler : function() {
													var searchPanel = Ext
															.getCmp('TodayOutSearchForm');
													searchPanel.getForm()
															.reset();
												}
											} ]
								});// end of the searchPanel

						// 数据源
						var store = new Ext.data.JsonStore({
							url : __ctxPath
									+ '/Out/listOut.do?Q_startDate_D_GE='
									+ new Date().format('Y-m-d')+'&Q_deleted_S_EQ='
									+ 0,
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'TodayGrid',
							fields : [ 'id', 'appUser.fullname','appUser.department.depName',
									'destiantionAddress', 'outReson',
									'startDate', 'endDate', 'workConsign',
									'zipCode', 'contactAddress', 'deleted',
									'contactName', 'telphone', 'mobilephone',
									'fax', 'updateUser', 'updateDate' ]
						});
						store.baseParams = {
							Q_startDate_D_GE : new Date().format('Y-m-d')
						}
						store.load({
							params : {
								start : 0,
								limit : 10
							}
						});// end of the store

						// ColumnModel
						var sm = new Ext.grid.CheckboxSelectionModel();
						var cm = new Ext.grid.ColumnModel(
								{
									columns : [
											sm,
											new Ext.grid.RowNumberer(),
											{
												dataIndex : 'Id',
												hidden : true
											},
											{
												header : '外出人员名称',
												dataIndex : 'appUser.fullname'
											// renderer : function(value) {
											// return value.fullname;
											// }
											},
											{
												header : '部门',
												dataIndex : 'appUser.department.depName'
											},
											{
												header : '外出事由',
												dataIndex : 'outReson'
											},
											{
												header : '目的地',
												dataIndex : 'destiantionAddress'
											},
											{
												header : '外出日期',
												dataIndex : 'startDate'
											},
											{
												header : '返回日期',
												dataIndex : 'endDate'
											},
											{
												header : '联系地址',
												dataIndex : 'contactAddress'
											},
											{
												header : '联系人',
												dataIndex : 'contactName'
											},
											{
												header : '电话',
												dataIndex : 'telphone'
											},
											{
												header : '管理',
												dataIndex : 'id',
												width : 50,
												sortable : false,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {
													var editId = record.data.id;
													var str = '';
													str = '<button title="删除" value=" " class="btn-del" onclick="TodayOutView.remove('
															+ editId
															+ ')">&nbsp;&nbsp;</button>';
													str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="TodayOutView.edit('
															+ editId
															+ ')">&nbsp;&nbsp;</button>';
													return str;
												}
											} ],
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
						this.topbar
								.add(new Ext.Button(
										{
											iconCls : 'btn-del',
											text : '撤销外出人员',
											xtype : 'button',
											handler : function() {
												var grid = Ext
														.getCmp("TodayGrid");
												var selectRecords = grid
														.getSelectionModel()
														.getSelections();
												if (selectRecords.length == 0) {
													Ext.ux.Toast.msg("信息",
															"请选择要撤销的记录！");
													return;
												}
												var ids = Array();
												for ( var i = 0; i < selectRecords.length; i++) {
													ids
															.push(selectRecords[i].data.id);
												}
												TodayOutView.remove(ids);
											}
										}));// end of the topbar

						// gridPanel
						this.gridPanel = new Ext.grid.GridPanel({
							id : 'TodayGrid',
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
								displayMsg : '当前显示从{0} 至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
						});// end of the gridPaenl

						// 监听器
						this.gridPanel.addListener('rowdblclick', function(
								grid, rowindex, e) {
							grid.getSelectionModel().each(function(rec) {
								if (isGranted('_AllScheduleEdit')) {
									TodayOutView.edit(rec.data.Id);
								}
							});
						});
					}
				});

// 删除
TodayOutView.remove = function(id) {

	var grid = Ext.getCmp("TodayGrid");
	Ext.Msg.confirm('信息确认', '您确认要撤销该记录吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath + '/Out/multiDelOut.do',
				params : {
					ids : id
				},
				method : 'post',
				success : function() {
					Ext.ux.Toast.msg("信息提示", "成功撤销所选记录！");
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
TodayOutView.edit = function(id) {
	new EditOutForm({
		Id : id
	}).show();
};
