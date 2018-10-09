Ext.ns('LawsTypeView');

LawsTypeView = Ext
		.extend(
				Ext.Panel,
				{
					searchPanel : null,
					topbar : null,
					gridPanel : null,
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						this.initUIComponents();
						LawsTypeView.superclass.constructor.call(this, {
							id : 'LawsTypeView',
							title : '法规分类',
							layout : 'border',
							iconCls : 'menu-appuser',
							items : [ /*{
								region : 'north',
								xtype : 'panel',
								layout : 'form',
								height : 110,
								frame : true,
								border : false,
								items : [ this.searchPanel, {
									xtype : 'panel',
									html : ''
								} ]
							},*/ this.treePanel, this.rightPanel ]
						});
					},
					initUIComponents : function() {

						this.searchPanel = new HT.SearchPanel(
								{
								
									id : 'lawsTypeView.searchPanel',
									layout : 'form',
									region : 'north',
									width : '100%',
									colNums : 3,
									items : [{
										id:'hiddenTypeId',
										fieldLabel : '类型标题',
										xtype : 'hidden',
										flex : 1,
										// width : 130,
										name : 'Q_lawsType.typeId_L_EQ'
									 },
									         {
												fieldLabel : '标题',
												xtype : 'textfield',
												flex : 1,
												//width : 130,
												name : 'Q_title_S_LK'
											 },
											
											{
												fieldLabel : '颁布日期',
												xtype : 'datetimefield',
												name : 'Q_publishDate_D_GE',
												format : 'Y-m-d',
												flex : 1,
												//width : 200,
												border : false
											},
											
											{
											    fieldLabel : '~',
												xtype : 'datetimefield',
												name : 'Q_publishDate_DG_LE',
												flex : 1,
												format : 'Y-m-d',
												flex : 1,
												//width : 200,
												border : false
											},
											{
											    fieldLabel : '审核状态',
												xtype : 'combo',
												hiddenName : 'Q_status_L_EQ',
												flex : 1,
												//width : 130,
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
												flex : 1,
												format : 'Y-m-d',
												//width : 200,
												border : false
											},
											
											{
											    fieldLabel : '~',
												xtype : 'datetimefield',
												name : 'Q_implementDate_DG_LE',
												flex : 1,
												format : 'Y-m-d',
												//width : 200,
												border : false
											}
						
											],
											buttons:[{
												xtype : 'button',
												text : '查询',
												iconCls : 'search',
												handler : function() {
													var searchPanel = Ext
															.getCmp('lawsTypeView.searchPanel');
													var gridPanel = Ext
															.getCmp('lawsTypeViewGrid');
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
																	'lawsTypeView.searchPanel')
															.getForm().reset();

												}
											} ]

								});// end of search panel
						var store = new Ext.data.Store({
							proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/law/listLaws.do'
							}),
							// create reader that reads the Topic records
							reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'id',
								fields : [ {
									name : 'id',
									type : 'int'
								}, 'lawsType.typeName', 'title',
										'lawsAuthor.authorName', 'content',
										'status', 'publishDate',
										'implementDate', 'createTime',
										'updateTime', 'createUser',
										'updateUser' ]
							}),
							remoteSort : true
						});
						store.load();
						var sm = new Ext.grid.CheckboxSelectionModel();
						var cm = new Ext.grid.ColumnModel(
								{
									columns : [
											sm,
											new Ext.grid.RowNumberer(),
											{
												header : "id",
												dataIndex : 'id',
												hidden : true
											},
											{
												header : "标题",
												dataIndex : 'title',
												width : 60
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
												sortable : false,
												width : 100,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {
													var editName = record.data.title;
													var str = '';

													str += '<button title="删除" value=" " class="btn-del" onclick="LawsTypeView.remove('
															+ value
															+ ')"></button>';

													str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="LawsTypeView.edit('
															+ value
															+ ',\''
															+ editName
															+ '\')"></button>';
													return str;
												}
											} ],
									defaults : {
										sortable : true,
										menuDisabled : true,
										width : 100
									}
								});
						var selected;
						var treeMenu = new Ext.menu.Menu({
							id : 'lawsTypeTreeMenu',
							items : [ {
								text : '新建分类',
								iconCls : 'btn-add',
								scope : this,
								handler : createNode
							},{
								text : '修改分类',
								iconCls:'btn-edit',
								scope : this,
								handler : function(){
									editNode();
								}
							}, {
								text : '删除分类',
								iconCls : 'btn-delete',
								scope : this,
								handler : deteleNode
							} ]
						});

						this.treePanel = new Ext.tree.TreePanel(
								{
									region : 'west',
									id : 'typeTreePanel',
									title : '法律分类',
									collapsible : true,
									autoScroll : true,
									split : true,
									height : 800,
									width : 180,
									tbar : new Ext.Toolbar(
											{
												items : [
														{
															xtype : 'button',
															iconCls : 'btn-refresh',
															text : '刷新',
															handler : function() {
																Ext
																		.getCmp('typeTreePanel').root
																		.reload();
															}
														},
														{
															xtype : 'button',
															text : '展开',
															iconCls : 'btn-expand',
															handler : function() {
																Ext
																		.getCmp(
																				'typeTreePanel')
																		.expandAll();
															}
														},
														{
															xtype : 'button',
															text : '收起',
															iconCls : 'btn-collapse',
															handler : function() {
																Ext
																		.getCmp(
																				'typeTreePanel')
																		.collapseAll();
															}
														} ]
											}),
									loader : new Ext.tree.TreeLoader({
										url : __ctxPath
												+ '/law/rootLawsType.do'
									}),
									root : new Ext.tree.AsyncTreeNode({
										expanded : true
									}),
									rootVisible : false,
									listeners : {
										'click' : LawsTypeView.clickNode
									}
								});

						this.topbar = new Ext.Toolbar({
							id : 'LawsTypeFootBar',
							height : 30,
							bodyStyle : 'text-align:left',
							items : []
						});
						this.topbar.add(new Ext.Button({
							iconCls : 'btn-add',
							text : '添加法规',
							xtype : 'button',
							handler : function() {
								new LawsForm({
									gridId : 'lawsTypeViewGrid'
								}).show();
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
														.getCmp("lawsTypeViewGrid");

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
												LawsTypeView.remove(ids);
											}
										}));
						this.gridPanel = new Ext.grid.GridPanel({
							region : 'center',
							id : 'lawsTypeViewGrid',
							//height : 800,
							title : '法律列表',
							tbar : this.topbar,
							store : store,
							shim : true,
							trackMouseOver : true,
							disableSelection : false,
							autoHeight : true,
							loadMask : true,
							cm : cm,
							sm : sm,
							viewConfig : {
								forceFit : true,
								enableRowBody : false,
								showPreview : false
							},
							// paging bar on the bottom
							bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
						});
						this.treePanel.on('contextmenu', contextmenu,
								this.treePanel);
						function contextmenu(node, e) {
							selected = new Ext.tree.TreeNode({
								id : node.id,
								text : node.text
							});
							// if(selected.id>0){
							treeMenu.showAt(e.getXY());
							// }
						};
						this.rightPanel = new Ext.Panel({
							closable : true,
							region:'center',
							iconCls : 'menu-department',
							layout : 'border',
							items : [this.searchPanel,this.gridPanel]
						});
						function createNode() {
							new LawsTypeForm().show();
						};
						function editNode(){	
							var depId = selected.id;
					
							var lawsTypeForm = Ext.getCmp('LawsTypeForm');
							if (lawsTypeForm == null) {
								new LawsTypeForm().show();
								lawsTypeForm = Ext.getCmp('LawsTypeForm');
							}
							lawsTypeForm.form.load({
										url : __ctxPath + '/law/getLawsType.do',
										params : {
											typeId : depId
										},
										method : 'post',
										deferredRender : true,
										layoutOnTabChange : true,
										success : function() {
										},
										failure : function() {
											Ext.ux.Toast.msg('编辑', '载入失败');
										}
									});
						
						}
						function deteleNode() {
							var tId = selected.id;
							var type = Ext.getCmp('typeTreePanel');
							if (tId > 0) {
								Ext.Msg.confirm('删除操作', '你确定删除?', function(btn) {
									if (btn == 'yes') {
										Ext.Ajax.request({
											url : __ctxPath + '/law/removeLawsType.do',// ?typeId='+tId,
											params : {
												typeId : tId
											},
											method : 'post',
											success : function(result, request) {
												//Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
												var res = Ext.util.JSON.decode(result.responseText);
												if(res.success==false){
												  Ext.ux.Toast.msg('操作信息',res.message);
												}else{
												  Ext.ux.Toast.msg('操作信息','删除成功!');
												}
												Ext.getCmp('typeTreePanel').root.reload();
												/*
												 * grid.getStore().reload({ params : { start : 0, limit :
												 * 25 } });
												 */
											},
											failure : function(result, request) {
											}
										});
									}
								});
							}
						};
					}

				});


/**
 * 编辑
 */
LawsTypeView.edit = function(lawsId) {
	new LawsForm({
		id : lawsId,
		gridId : 'lawsTypeViewGrid'
	}).show();
};

/**
 * 用户删除
 * 
 * @param {}
 *            userId
 */
LawsTypeView.remove = function(id) {
	var grid = Ext.getCmp("lawsTypeViewGrid");
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
LawsTypeView.clickNode = function(node) {
	if (node != null) {
		var users = Ext.getCmp('lawsTypeViewGrid');
		var store = users.getStore();
		if (node.id == 0) {
			store.url = __ctxPath + '/law/listLaws.do';
			store.baseParams = {
				typeId : ''
			};
		} else {
			Ext.getCmp('hiddenTypeId').setValue(node.id);
			store.url = __ctxPath + '/law/listLaws.do';
			store.baseParams = {
				typeId : node.id
			};
		}
		store.params = {
			start : 0,
			limit : 25
		};
		store.reload({
			params : {
				start : 0,
				limit : 25
			}
		});
	}

}
