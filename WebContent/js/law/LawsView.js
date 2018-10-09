Ext.ns('LawsView');

LawsView = Ext.extend(Ext.Panel,{
               searchPanel : null,
					// 数据展示Panel
			   gridPanel : null,

			   topbar : null,
					// 构造函数
			   constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 初始化组件
						this.initUIComponents();
						// 调用父类构造
						LawsView.superclass.constructor.call(this, {
							id : 'LawsView',
							title : '法律列表',
							layout : 'border',
							iconCls : 'menu-appuser',
							autoScroll : true,
							items : [ this.searchPanel, this.gridPanel ]
						});
					},// end of constructor

					// 初始化组件
					initUIComponents : function() {
						// 初始化搜索条件Panel
						this.searchPanel = new HT.SearchPanel(
								{
									id : 'LawsSearchForm',
									layout : 'form',
									region : 'north',
									width : '100%',
									colNums : 3,
									items : [{
												fieldLabel : '标题',
												xtype : 'textfield',
												//width : '17%',
												flex : 1,
												name : 'Q_title_S_LK'
											 },
											
											{
												fieldLabel : '颁布日期',
												xtype : 'datetimefield',
												name : 'Q_publishDate_D_GE',
												format : 'Y-m-d',
												//width : '20%',
												flex : 1,
												border : false
											},
											
											{
											    fieldLabel : '~',
												xtype : 'datetimefield',
												name : 'Q_publishDate_DG_LE',
												flex : 1,
												format : 'Y-m-d',
												//width : '20%',
												border : false
											},
											{
											    fieldLabel : '审核状态',
												xtype : 'combo',
												hiddenName : 'Q_status_L_EQ',
												//width : 130,
												flex : 1,
												editable : false,
												mode : 'local',
												triggerAction : 'all',
												store : [ [ '0', '审核失败' ],
														[ '1', '审核通过' ],
														[ '2', '审核中' ] ]

											},
											
											{
											    fieldLabel : '实施日期',
												xtype : 'datetimefield',
												name : 'Q_implementDate_D_GE',
												format : 'Y-m-d',
												//width : 200,
												flex : 1,
												border : false
											},
											
											{
											    fieldLabel : '~',
												xtype : 'datetimefield',
												name : 'Q_implementDate_DG_LE',
												format : 'Y-m-d',
												//width : 200,
												flex : 1,
												border : false
											}
						
											],
											buttons:[{
												xtype : 'button',
												text : '查询',
												iconCls : 'search',
												handler : function() {
													var searchPanel = Ext
															.getCmp('LawsSearchForm');
													var gridPanel = Ext
															.getCmp('LawsGrid');
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
												iconCls : 'reset',
												handler : function() {
													Ext
															.getCmp(
																	'LawsSearchForm')
															.getForm().reset();

												}
											} ]

								});
						var store = new Ext.data.JsonStore({
							url : __ctxPath + '/law/listLaws.do',
							root : 'result',
							totalProperty : 'totalCounts',
							fields : [ 'id', 'lawsType.typeName', 'title',
									'lawsAuthor.authorName', 'content',
									'status', 'publishDate', 'implementDate',
									'createTime', 'updateTime', 'createUser',
									'updateUser' ]
						});

						store.load();

						var sm = new Ext.grid.CheckboxSelectionModel();
						var cm = new Ext.grid.ColumnModel(
								{
									columns : [
											sm,
											new Ext.grid.RowNumberer(),
											{
												header : '法律标题',
												dataIndex : 'title'
											},
											{
												header : '颁布单位',
												dataIndex : 'lawsAuthor.authorName'
											},
											{
												header : '法规类型',
												dataIndex : 'lawsType.typeName'
											},
											{
												header : '内容',
												dataIndex : 'content'
											},
											{
												header : '审核状态',
												dataIndex : 'status',
												renderer : function(value) {
													var strValue = "审核通过";
													if (value == 0) {
														strValue = '审核失败';
													} else if (value == 2) {
														strValue = '审核中';
													}
													return strValue;
												}
											},
											{
												header : '颁布日期',
												dataIndex : 'publishDate'
											},
											{
												header : '实施日期',
												dataIndex : 'implementDate'
											},
											/*{
												header : '创建日期',
												dataIndex : 'createTime',
												renderer : function(v) {
													return new Date(v)
															.format('Y-m-d');
												}
											},
											{
												header : '创建者',
												dataIndex : 'createUser'
											},
											{
												header : '修改日期',
												dataIndex : 'updateTime',
												renderer : function(v) {
													return new Date(v)
															.format('Y-m-d');
												}

											},
											{
												header : '修改者',
												dataIndex : 'updateUser'
											},*/
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
													str = '<button title="删除" value=" " class="btn-del" onclick="LawsView.remove('
															+ editId
															+ ')">&nbsp;&nbsp;</button>';
													str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="LawsView.edit('
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
								});

						this.topbar = new Ext.Toolbar({
							id : 'LawsFootBar',
							height : 30,
							bodyStyle : 'text-align:left',
							items : []
						});
						this.topbar.add(new Ext.Button({
							iconCls : 'btn-add',
							text : '添加法规',
							xtype : 'button',
							handler : function() {
								new LawsForm().show();
							}
						}));
						this.topbar
								.add(new Ext.Button(
										{
											iconCls : 'btn-del',
											text : '删除法规',
											xtype : 'button',
											handler : function() {

												var grid = Ext
														.getCmp("LawsGrid");

												var selectRecords = grid
														.getSelectionModel()
														.getSelections();

												if (selectRecords.length == 0) {
													Ext.ux.Toast.msg("信息",
															"请选择要删除的记录！");
													return;
												}
												var ids = Array();
												for ( var i = 0; i < selectRecords.length; i++) {
													ids
															.push(selectRecords[i].data.id);
												}
												LawsView.remove(ids);
											}
										}));

						this.gridPanel = new Ext.grid.GridPanel({
							id : 'LawsGrid',
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
					}// end of the initUIComponents
				});

/**
 * 删除单个记录
 */
LawsView.remove = function(id) {
	var grid = Ext.getCmp("LawsGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath + '/law/multiDelLaws.do',
				params : {
					ids : id
				},
				method : 'post',
				success : function() {
					Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
					grid.getStore().reload({
						params : {
							start : 0,
							limit : 25
						}
					});
				}
			});
		}
	});
};
/**
 * 编辑
 */
LawsView.edit = function(lawsId) {
	new LawsForm({
		id : lawsId,
		gridId : 'LawsGrid'
	}).show();
};
