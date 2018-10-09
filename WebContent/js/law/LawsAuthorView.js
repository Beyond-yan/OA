Ext.ns('LawsAuthorView');
/**
 * @author F3229233
 * @class ProjectManageView
 * @extends Ext.Panel
 * @description 项目楼栋管理
 * @company 深圳捷达世软件有限公司
 * @createDate 2013-5-13
 */
LawsAuthorView = Ext
		.extend(
				Ext.Panel,
				{
					searchPanel : null,
					topbar : null,
					gridPanel : null,
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						this.initUIComponents();
						LawsAuthorView.superclass.constructor.call(this, {
							id : 'LawsAuthorView',
							title : '颁布单位',
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
							},*/ this.treePanel, this.rightPanel]
						});
					},
					initUIComponents : function() {

						this.searchPanel = new HT.SearchPanel(
								{
									
									id : 'lawsAuthorView.searchPanel',
									layout : 'form',
									region : 'north',
									width : '100%',
									colNums : 3,
									items : [{
										id:'hiddenAuthorId',
										fieldLabel : '单位标题',
										xtype : 'hidden',
										flex : 1,
										// width : 130,
										name : 'Q_lawsAuthor.authorId_L_EQ'
									 },
									         {
												fieldLabel : '标题',
												xtype : 'textfield',
												flex : 1,
												// width : 130,
												name : 'Q_title_S_LK'
											 },
											
											{
												fieldLabel : '颁布日期',
												xtype : 'datetimefield',
												name : 'Q_publishDate_D_GE',
												format : 'Y-m-d',
												flex : 1,
												// width : 200,
												border : false
											},
											
											{
											    fieldLabel : '~',
												xtype : 'datetimefield',
												name : 'Q_publishDate_DG_LE',
												flex : 1,
												format : 'Y-m-d',
												flex : 1,
												// width : 200,
												border : false
											},
											{
											    fieldLabel : '审核状态',
												xtype : 'combo',
												hiddenName : 'Q_status_L_EQ',
												flex : 1,
												// width : 130,
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
												// width : 200,
												border : false
											},
											
											{
											    fieldLabel : '~',
												xtype : 'datetimefield',
												name : 'Q_implementDate_DG_LE',
												format : 'Y-m-d',
												flex : 1,
												// width : 200,
												border : false
											}
						
											],
											buttons:[{
												xtype : 'button',
												text : '查询',
												iconCls : 'search',
												handler : function() {
													var searchPanel = Ext
															.getCmp('lawsAuthorView.searchPanel');
													var gridPanel = Ext
															.getCmp('lawsAuthorViewGrid');
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
																	'lawsAuthorView.searchPanel')
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
											}, {
												header : '颁布日期',
												dataIndex : 'publishDate'
											}, {
												header : '实施日期',
												dataIndex : 'implementDate'
											}, /*
												 * { header : '创建日期', dataIndex :
												 * 'createTime', renderer :
												 * function(v) { return new
												 * Date(v) .format('Y-m-d'); } }, {
												 * header : '创建者', dataIndex :
												 * 'createUser' }, { header :
												 * '修改日期', dataIndex :
												 * 'updateTime', renderer :
												 * function(v) { return new
												 * Date(v) .format('Y-m-d'); } }, {
												 * header : '修改者', dataIndex :
												 * 'updateUser' },
												 */{
												header : '管理',
												dataIndex : 'id',
												sortable : false,
												width : 100,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {
													var editName = record.data.title;
													var str = '';

													str += '<button title="删除" value=" " class="btn-del" onclick="LawsAuthorView.remove('
															+ value
															+ ')"></button>';

													str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="LawsAuthorView.edit('
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
							id : 'lawsAuthorTreeMenu',
							items : [ {
								text : '新建单位',
								iconCls : 'btn-add',
								scope : this,
								handler : function() {
									createNode();
								}
							},{
								text : '修改单位',
								iconCls:'btn-edit',
								scope : this,
								handler : function(){
									editNode();
								}
							}, {
								text : '删除单位',
								iconCls : 'btn-delete',
								scope : this,
								handler : function() {
									deteleNode();
								}
							} ]
						});
				
						
						this.treePanel = new Ext.tree.TreePanel({
							region : 'west',
							id : 'authorTreePanel',
							title : '颁布单位',
							collapsible : true,
							autoScroll : true,
							split : true,
							height : 800,
							width : 180,
							tbar : new Ext.Toolbar({
								items : [{
											xtype : 'button',
											iconCls : 'btn-refresh',
											text : '刷新',
											handler : function() {
												Ext.getCmp('authorTreePanel').root.reload();
											}
										}, {
											xtype : 'button',
											text : '展开',
											iconCls : 'btn-expand',
											handler : function() {
												Ext.getCmp('authorTreePanel').expandAll();
											}
										}, {
											xtype : 'button',
											text : '收起',
											iconCls : 'btn-collapse',
											handler : function() {
												Ext.getCmp('authorTreePanel').collapseAll();
											}
										}]
							}),
							loader : new Ext.tree.TreeLoader({
								url : __ctxPath + '/law/rootLawsAuthor.do'
							}),
							root : new Ext.tree.AsyncTreeNode({
								expanded : true
							}),
							rootVisible : false,
							listeners : {
								'click' : LawsAuthorView.clickNode
							}
						});
						
						this.topbar = new Ext.Toolbar({
							id : 'LawsAuthorFootBar',
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
									gridId : 'lawsAuthorViewGrid'
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
														.getCmp("lawsAuthorViewGrid");

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
												LawsAuthorView.remove(ids);
											}
										}));
						
						this.gridPanel = new Ext.grid.GridPanel({
							region : 'center',
							id : 'lawsAuthorViewGrid',
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
						this.treePanel.on('contextmenu', contextmenu, this.treePanel);
						function contextmenu(node, e) {
							selected = new Ext.tree.TreeNode({
								id : node.id,
								text : node.text
							});
							// if(selected.id>0){
							treeMenu.showAt(e.getXY());
							// }
						}
						
						
					this.rightPanel = new Ext.Panel({
							closable : true,
							region:'center',
							iconCls : 'menu-department',
							layout : 'border',
							items : [this.searchPanel,this.gridPanel]
						});
						
						function createNode() {
							new LawsAuthorForm().show();
						};
						function editNode(){	
							var depId = selected.id;
					
							var lawsAuthorForm = Ext.getCmp('LawsAuthorForm');
							if (lawsAuthorForm == null) {
								new LawsAuthorForm().show();
								lawsAuthorForm = Ext.getCmp('LawsAuthorForm');
							}
							lawsAuthorForm.form.load({
										url : __ctxPath + '/law/getLawsAuthor.do',
										params : {
											authorId : depId
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
							var type = Ext.getCmp('authorTreePanel');
							if (tId > 0) {
								Ext.Msg.confirm('删除操作', '你确定删除?', function(btn) {
									if (btn == 'yes') {
										Ext.Ajax.request({
											url : __ctxPath + '/law/removeLawsAuthor.do',// ?typeId='+tId,
											params : {
												authorId : tId
											},
											method : 'post',
											success : function(result,request) {
												// Ext.ux.Toast.msg("信息提示",
												// "成功删除所选记录！");
												var res = Ext.util.JSON.decode(result.responseText);
												if(res.success==false){
												  Ext.ux.Toast.msg('操作信息',res.message);
												}else{
												  Ext.ux.Toast.msg('操作信息','删除成功!');
												}
												Ext.getCmp('authorTreePanel').root.reload();
												/*
												 * grid.getStore().reload({
												 * params : { start : 0, limit :
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
LawsAuthorView.edit = function(lawsId) {
	new LawsForm({
		id : lawsId,
		gridId : 'lawsAuthorViewGrid'
	}).show();
};

/**
 * 用户删除
 * 
 * @param {}
 *            userId
 */
LawsAuthorView.remove = function(id) {
	var grid = Ext.getCmp("lawsAuthorViewGrid");
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
LawsAuthorView.clickNode = function(node) {
	if (node != null) {
		var users = Ext.getCmp('lawsAuthorViewGrid');
		var store = users.getStore();
		if (node.id == 0) {
			store.url = __ctxPath + '/law/listLaws.do';
			store.baseParams = {
				authorId : ''
			};
		} else {
			Ext.getCmp('hiddenAuthorId').setValue(node.id);
			store.url = __ctxPath + '/law/listLaws.do';
			store.baseParams = {
				authorId : node.id
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
