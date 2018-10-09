Ext.ns('DepartmentView');

var DepartmentView = function() {
	return this.setup();
};

DepartmentView.prototype.setup = function() {
	var ul='';
	if(curUserInfo.isAccountManager){
	ul=__ctxPath + '/system/finddepUserDepartment.do';
	}else{
	ul=__ctxPath + '/system/listDepartment.do';
	}
	var selected;
	var store = this.initData();
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer(), {
					header : "userId",
					dataIndex : 'userId',
					hidden : true
				}, {
					header : "状态",
					dataIndex : 'status',
					width : 30,
					renderer : function(value) {
						var str = '';
						if (value == '1') {// 激活用户
							str += '<img title="激活" src="' + __ctxPath
									+ '/images/flag/customer/effective.png"/>'
						} else {// 禁用用户
							str += '<img title="禁用" src="' + __ctxPath
									+ '/images/flag/customer/invalid.png"/>'
						}
						return str;
					}
				}, {
					header : "账号",
					dataIndex : 'username',
					width : 60
				}, {
					header : "用户名",
					dataIndex : 'fullname',
					width : 60
				}, {
					header : "邮箱",
					dataIndex : 'email',
					width : 120
				}, {// 先不显示
					header : "所属科室",
					dataIndex : 'department',
					renderer : function(value) {
						if(value==null){
						   return '';
						}else{
						   return value.depName;
						}
					},
					width : 60
				}, {
					header : "所在职位",
					dataIndex : 'position',
					width : 60
				}, {
					header : '管理',
					dataIndex : 'userId',
					sortable : false,
					width : 100,
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var editId = record.data.userId;
						var editName = record.data.username;
						var str = '';
						if (isGranted('_AppUserDel')&&editId!=1) {
						    str += '<button title="删除" value=" " class="btn-del" onclick="DepartmentView.remove('
										+ editId + ')"></button>';
						}
						if (isGranted('_AppUserEdit')&&editId!=1) {
							str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="AppUserView.edit('
									+ editId
									+ ',\''
									+ editName
									+ '\')"></button>';
						}
						if (isGranted('_UserSubAdd')&&editId!=1) {
							str += '&nbsp;<button title="下属管理" value=" " class="menu-subuser" onclick="AppUserView.add('
									+ editId
									+ ',\''
									+ editName
									+ '\')"></button>';
						}
						return str;
					}
				}],
		defaults : {
			sortable : true,
			menuDisabled : true,
			width : 100
		},
		listeners : {
			hiddenchange : function(cm, colIndex, hidden) {
				saveConfig(colIndex, hidden);
			}
		}
	});
	// 初始化搜索条件Panel
	this.searchPanel = new HT.SearchPanel( {
		layout : 'form',
		region : 'north',
		id:'departmentView.searchPanel',
		colNums : 1,
				items:[{
					xtype : 'container',
					layout : 'column',
					style : 'padding-left:0px;margin-bottom:4px;margin-top:10px;',
					items : [{
						xtype : 'label',
						text:'用户姓名:',
						style:'padding-left:0px;margin-top:3px;'
					},{
			    	    	xtype : 'label',
			    	    	fieldLabel : '用户姓名',
			    	    	flex : 1,
							xtype : 'textfield',
							id:'departmentView.name',
							width:130
			    	    },{
			    	    	xtype : 'label',
							text:'用户工号:',
							style:'padding-left:10px;margin-top:3px;'
			    	    },{
					    	xtype : 'label',
					    	fieldLabel : '用户工号',
					    	flex : 1,
							xtype : 'textfield',
							id:'departmentView.code',
							width:130
					},{
					iconCls : 'search',
					fieldLabel : '查询',
					text:'查询',
					xtype : 'button',
					style : 'margin-left:18px;',
					scope:this,
					iconCls:'btn-search',
					handler : function() {
						var formPanel = this.searchPanel;
						var grid = this.gridPanel;
						if (this.searchPanel.getForm()
								.isValid()) {
							store.load({
								params : {
									start : 0,
									limit : 25,//limit : 20,
									'name' : Ext
											.getCmp("departmentView.name")
											.getValue(),
									'code' : Ext
											.getCmp("departmentView.code")
											.getValue()
								}
							});
						}
					}
				}, {
				text : '重置',
				scope : this,
				xtype : 'button',
				style : 'margin-left:18px;',
				iconCls : 'btn-reset',
				handler : function(){
					Ext.getCmp('departmentView.searchPanel').getForm().reset();
				}
			}]
		}]
	});// end of searchPanel
	var grid = new Ext.grid.GridPanel({
				region:'center',
				id : 'DepartmentViewGrid',
				height:800,
				title : '账号基本信息',
				store : store,
				shim : true,
				trackMouseOver : true,
				disableSelection : false,
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
	grid.addListener('rowdblclick', rowdblclickFn);
	function rowdblclickFn(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new UserSubWindow({
				userId : rec.data.userId
				}).show();

				});
	}
	store.load({
				params : {
					start : 0,
					limit : 25
				}
			});

	var treePanel = new Ext.tree.TreePanel({
				region : 'west',
				id : 'treePanel',
				title : '科室信息显示',
				collapsible : true,
				autoScroll:true,
				split : true,
				height : 800,
				width : 180,
				tbar : new Ext.Toolbar({
							items : [{
										xtype : 'button',
										iconCls : 'btn-refresh',
										text : '刷新',
										handler : function() {
											treePanel.root.reload();
										}
									}, {
										xtype : 'button',
										text : '展开',
										iconCls : 'btn-expand',
										handler : function() {
											treePanel.expandAll();
										}
									}, {
										xtype : 'button',
										text : '收起',
										iconCls : 'btn-collapse',
										handler : function() {
											treePanel.collapseAll();
										}
									}]
						}),
				loader : new Ext.tree.TreeLoader({
							url : ul
						}),
				root : new Ext.tree.AsyncTreeNode({
							expanded : true
						}),
				rootVisible : false,
				listeners : {
					'click' : DepartmentView.clickNode
				}
			});

	if (isGranted('_DepartmentAdd') || isGranted('_DepartmentEdit')
			|| isGranted('_DepartmentDel')) {
		// 树的右键菜单的
		treePanel.on('contextmenu', contextmenu, treePanel);
	}
	
	// 创建右键菜单
	var treeMenu = new Ext.menu.Menu({
				id : 'DepartmentTreeMenu',
				items : []
			});
	if (isGranted('_DepartmentAdd')) {
		treeMenu.add({
					text : '新建科室',
					iconCls:'btn-add',
					scope : this,
					handler : createNode
				});
	}
	if (isGranted('_DepartmentEdit')) {
		treeMenu.add({
					text : '修改科室信息',
					iconCls:'btn-edit',
					scope : this,
					handler : editNode
				});
	}
	if (isGranted('_DepartmentDel')) {
		treeMenu.add({
					text : '删除科室',
					iconCls:'btn-delete',
					scope : this,
					handler : deteleNode
				});

	}

	function contextmenu(node, e) {
		selected = new Ext.tree.TreeNode({
					id : node.id,
					text : node.text
				});
		// if(selected.id>0){
		treeMenu.showAt(e.getXY());
		// }
	}
	/**
	 * 菜单事件
	 */

	function createNode() {
		var nodeId = selected.id;
		var departmentForm = Ext.getCmp('departmentForm');
		if (departmentForm == null) {
			if (nodeId > 0) {
				new DepartmentForm({nodeId : nodeId}).show();
			} else {
				new DepartmentForm({nodeId : 0}).show();
			}
		}

	}
	function deteleNode() {
		var depId = selected.id;
		var type = Ext.getCmp('treePanel');
		if (depId > 0) {
			Ext.Msg.confirm('删除操作', '你确定删除科室?', function(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
										url : __ctxPath
												+ '/system/removeDepartment.do?depId='
												+ depId,
										success : function(result,request) {
											var res = Ext.util.JSON.decode(result.responseText);
											if(res.success==false){
											  Ext.ux.Toast.msg('操作信息',res.message);
											}else{
											  Ext.ux.Toast.msg('操作信息','删除成功!');
											}
											type.root.reload();
										},
										failure : function(result,request){
										}
									});
						}
					});
		} else {
			Ext.ux.Toast.msg('警告', "不能被删除");
		}
	}
	function editNode() {
		var depId = selected.id;
		if (depId > 0) {
			var departmentForm = Ext.getCmp('departmentForm');
			if (departmentForm == null) {
				new DepartmentForm().show();
				departmentForm = Ext.getCmp('departmentForm');
			}
			departmentForm.form.load({
						url : __ctxPath + '/system/detailDepartment.do',
						params : {
							depId : depId
						},
						method : 'post',
						deferredRender : true,
						layoutOnTabChange : true,
						success : function() {
							var fm = Ext.getCmp('departmentForm');
							var value = fm.getCmpByName('department.appUser.userId').getValue();
							var cmp2 = Ext.getCmp('viceUserId');
							cmp2.setValue(value);
						},
						failure : function() {
							Ext.ux.Toast.msg('编辑', '载入失败');
						}
					});
		} else {
			Ext.ux.Toast.msg('警告', "不能修改！");
		}

	}
	var rightPanel = new Ext.Panel({
		id : 'DepartmentRightView',
		closable : true,
		region:'center',
		iconCls : 'menu-department',
		layout : 'border',
		items : [this.searchPanel,grid]
	});
	var panel = new Ext.Panel({
				id : 'DepartmentView',
				title : '部门管理',
				closable : true,
				iconCls : 'menu-department',
				layout : 'border',
				items : [treePanel, rightPanel]
			});

	return panel;

};

DepartmentView.prototype.initData = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/system/selectAppUser.do'
						}),
				// create reader that reads the Topic records
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'userId',
										type : 'int'
									}, 'username', 'fullname', 'email',
									'department', 'title',// 性别
									'position', {
										name : 'accessionTime'
									}, {
										name : 'status',
										type : 'int'
									}]
						}),
				remoteSort : true
			});
	store.setDefaultSort('id', 'desc');
	return store;
};

/**
 * 初始化
 * 
 * @return {}
 */

/**
 * 用户删除
 * 
 * @param {}
 *            userId
 */
DepartmentView.remove = function(userId) {
	Ext.Msg.confirm('删除操作', '你确定要删除该用户吗?', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + '/system/multiDelAppUser.do',
								method : 'post',
								params : {
									ids : userId
								},
								success : function(response) {
									var result = Ext.util.JSON.decode(response.responseText);
									if(result.msg == ''){
										Ext.ux.Toast.msg("操作信息", "用户删除成功");
									}else{
										Ext.ux.Toast.msg("操作信息", result.msg);
									}
									Ext.getCmp("DepartmentViewGrid").getStore().reload();
								},
								failure : function() {
									Ext.ux.Toast.msg("操作信息", "用户删除失败");
								}
							});
				}
			});

};

DepartmentView.clickNode = function(node) {
	if (node != null) {
		var dpId=node.id;
		if(curUserInfo.isAccountManager){
			Ext.Ajax.request({
						url : __ctxPath + "/system/depLevelValidDepartment.do",
						params : {
								  curdepId :node.id
								 },
						method : 'POST',
						success : function(response, action) {
								if(!Ext.util.JSON.decode(response.responseText).success){
									dpId=curUserInfo.depId;
								}else{
									dpId=node.id;
								} 
								var store = Ext.getCmp('DepartmentViewGrid').getStore();
								store.url = __ctxPath + '/system/selectAppUser.do';
								store.baseParams = {
									depId : dpId
								};
								store.params = {
									start : 0,
									limit : 25//limit : 20
								};
								store.reload({
											params : {
												start : 0,
												limit : 25//limit : 20
											}
								});
						}
				});
		}else{
			var store = Ext.getCmp('DepartmentViewGrid').getStore();
			store.url = __ctxPath + '/system/selectAppUser.do';
			store.baseParams = {
				depId : dpId
			};
			store.params = {
				start : 0,
				limit : 25//limit : 20
			};
			store.reload({
						params : {
							start : 0,
							limit : 25//limit : 20
						}
			});
		}
	}
};
