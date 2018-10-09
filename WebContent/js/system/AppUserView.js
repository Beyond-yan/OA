/**
 * 用户管理
 * @class AppUserView
 * @extends Ext.Panel
 */
AppUserView=Ext.extend(Ext.Panel,{
	constructor:function(config){
		Ext.applyIf(this,config);
		this.initUIComponents();
		AppUserView.superclass.constructor.call(this,{
			id : 'AppUserView',
			title : '帐号管理',
			iconCls:'menu-appuser',
			autoScroll : true
		});
	},
	initUIComponents:function(){
		this.initSearchPanel();
		this.initGridPanel();

		this.items=[this.searchPanel,this.gridPanel];
	},
	onSearch:function(obj){
							var searchPanel = Ext.getCmp('AppUserSearchForm');
		
							var gridPanel = Ext.getCmp('AppUserGrid');
							if (searchPanel.getForm().isValid()) {
								$search({
									searchPanel :searchPanel,
									gridPanel : gridPanel
								});
							}
	}
});

/**
 * 初始化SearchPanel
 */
AppUserView.prototype.initSearchPanel=function(){
	this.searchPanel=new Ext.FormPanel({
			height : 35,
			frame : false,
			border:false,
			id : 'AppUserSearchForm',
			layout : 'hbox',
			layoutConfig: {
                    padding:'5',
                    align:'middle'
            },
			defaults : {
				xtype : 'label',
				border:false,
				margins:{top:0, right:4, bottom:0, left:4}
			},
			
			items : [ {
						text : '用户账号'
					}, {
						xtype : 'textfield',
						name : 'Q_username_S_LK'
					}, {
						text : '用户姓名'
					}, {
						xtype : 'textfield',
						name : 'Q_fullname_S_LK'
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						scope:this,
						handler : this.onSearch.createCallback(this)
					},{
                         xtype:'button',
                         text:'重置',
                         iconCls:'reset',
                         scope:this,
                         handler:function(){
                           Ext.getCmp('AppUserSearchForm').getForm().reset();
                         }
					}
					]
		});//end of search panel
};

AppUserView.prototype.initGridPanel=function(){
		
	this.toolbar = new Ext.Toolbar({
			height : 30,
			items : []
		});
	if (isGranted('_AppUserAdd')) {
		this.toolbar.add(new Ext.Button({
					text : '添加账号',
					iconCls : 'add-user',
					handler : function() {
						var tabs = Ext.getCmp('centerTabPanel');
						var addUser = Ext.getCmp('AppUserForm');
						if (addUser == null) {
							addUser = new AppUserForm('增加账号');
							tabs.add(addUser);
						} else {
							tabs.remove(addUser)
							addUser = new AppUserForm('增加账号');
							tabs.add(addUser);
						}
						tabs.activate(addUser);
					}
				}));
	}
	if (isGranted('_AppUserDel')) {
			this.toolbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除账号',
					handler : function() {
						var grid = Ext.getCmp("AppUserGrid");

						var selectRecords = grid.getSelectionModel()
								.getSelections();

						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						var idsN = '';
						for (var i = 0; i < selectRecords.length; i++) {
							if (selectRecords[i].data.userId != 1) {
								ids.push(selectRecords[i].data.userId);
							} else {
								idsN += selectRecords[i].data.fullname + ',';
							}
						}
						if (idsN == '') {
							AppUserView.remove(ids);
						} else {
							Ext.ux.Toast.msg("信息", idsN + "不能被删除！");
						}
					}
				}));
	}
		
		var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/system/listAppUser.do?isAccountManger='+curUserInfo.isAccountManager
						}),		
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							fields : [{
										name : 'userId',
										type : 'int'
									}, 'username', 'password', 'fullname','address',
									'email', 'department', 'title',// 性别
									'position', {
										name : 'status',
										type : 'int'
									}]
						}),
				remoteSort : true
			});
		store.setDefaultSort('userId', 'desc');
		
		store.load({
					params : {
						start : 0,
						limit : 25
					}
		});
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : "userId",
						dataIndex : 'userId',
						hidden : true
					},{
						header : "状态",
						dataIndex : 'status',
						width : 30,
						renderer : function(value) {
							var str = '';
							if(value == '1'){//激活用户
								str += '<img title="激活" src="'+ __ctxPath +'/images/flag/customer/effective.png"/>'
							}else{//禁用用户
								str += '<img title="禁用" src="'+ __ctxPath +'/images/flag/customer/invalid.png"/>'
							}
							return str;
						}
					}, {
						header : "账号",
						dataIndex : 'username',
						width : 60
					}, {
						header:'地址',
						dataIndex:'address',
						hidden:true,
						exprint:true
					},{
						header : "用户名",
						dataIndex : 'fullname',
						width : 60
					}, {
						header : "邮箱",
						dataIndex : 'email',
						width : 120
					}, {// 先不显示
						header : "所属部门",
						dataIndex : 'department',
						renderer : function(value) {
							if(value==null){
							  return '';
							}else{
							  return value.depName;
							}
						},
						width : 60
					},
					{
						header : "所在职位",
						dataIndex : 'position',
						width : 60
					},  {
						header : '管理',
						dataIndex : 'userId',
						sortable:false,
						//width : 60,
						width : 75,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.userId;
							var editName = record.data.username;
							var editPassword = record.data.password;
							var str='';
							if(editId!=1){
								if (isGranted('_AppUserDel')) {
									str += '<button title="删除" value=" " class="btn-del" onclick="AppUserView.remove('
											+ editId + ')"></button>';
								}
								if(isGranted('_AppUserEdit')){
									str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="AppUserView.edit('
											+ editId + ',\'' + editName + '\')"></button>';
								}
								if(isGranted('_AppUserAgent')){
									str += '&nbsp;<button title="代办" value=" " class="btn-super" onclick="AppUserView.agent('
											+ editId + ',\'' + editName + '\')"></button>';
								}
								if(isGranted('_AppUserReset')){
									str += '&nbsp;<button title="重置" value=" " class="btn-password" onclick="AppUserView.reset('
											+ editId + ',\''+editName+'\')"></button>';
								}
								if(isGranted('_AppUserCapacity')){
									str += '&nbsp;<button title="共享空间大小" value=" " class="btn-edit" onclick="AppUserView.capacityUpdate('
										+ editId + ')">&nbsp</button>';
								}
							}
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : true,
				width : 100
			}
		});
	
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'AppUserGrid',
					// title:'账号基本信息',
					tbar : this.toolbar,
					store : store,
					autoHeight:true,
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
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});
		// 为Grid增加双击事件,双击行可编辑
		this.gridPanel.addListener('rowdblclick', rowdblclickFn);
		var gridPanel=this.gridPanel;
		function rowdblclickFn(gridPanel, rowindex, e) {
			gridPanel.getSelectionModel().each(function(rec) {
			   var userId=rec.data.userId;
			        if(isGranted('_AppUserEdit')&&userId!=1){
					AppUserView.edit(userId, rec.data.username);
			        }
				});
		}
		
};//end of the init GridPanel


/**
 * 用户删除
 * 
 * @param {}
 *            userId
 */
AppUserView.remove = function(_ids) {
	Ext.Msg.confirm('删除操作', '你确定要删除该用户吗?', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + '/system/multiDelAppUser.do',
								method : 'post',
								params : {
									ids : _ids
								},
								success : function(response) {
									var result = Ext.util.JSON.decode(response.responseText);
									if(result.msg == ''){
										Ext.ux.Toast.msg("操作信息", "用户删除成功");
									}else{
										Ext.ux.Toast.msg("操作信息", result.msg);
									}
									Ext.getCmp('AppUserGrid').getStore().reload();
								},
								failure : function() {
									Ext.ux.Toast.msg("操作信息", "用户删除失败");
								}
							});
				}
			});

};

AppUserView.agent=function(userId,username){
	new UserAgentWindow({userId:userId,username:username}).show();
};

AppUserView.reset=function(userId){
	new changePasswordForm(userId);
};

AppUserView.add = function(userId,username){
	new UserSubWindow({userId:userId,username:username}).show();
};
/**
 * 用户编辑
 * 
 * @param {}
 *            userId
 */
AppUserView.edit = function(userId, username) {
	// 只允许有一个编辑窗口
	var tabs = Ext.getCmp('centerTabPanel');
	var edit = Ext.getCmp('AppUserForm');
	if (edit == null) {
		edit = new AppUserForm(username + '-详细信息', userId);
		tabs.add(edit);
	} else {
		tabs.remove('AppUserForm');
		edit = new AppUserForm(username + '-详细信息', userId);
		tabs.add(edit);
	}
	tabs.activate(edit);
	// 不可显示密码,不能修改账号
	var appUserMustInfo = Ext.getCmp('AppUserMustInfo');
	appUserMustInfo.remove('appUser.password');
	Ext.getCmp('appUser.username').getEl().dom.readOnly = true;
	appUserMustInfo.doLayout(true);
	// 显示修改密码按钮
	var appUserFormToolbar = Ext.getCmp('AppUserFormToolbar');
	Ext.getCmp('resetPassword').show();
	appUserFormToolbar.doLayout(true);
	// 往编辑窗口中填充新闻数据
	edit.form.load({
				url : __ctxPath + '/system/getAppUser.do',
				params : {
					userId : userId
				},
				method : 'post',
				waitMsg : '正在载入数据...',
				success : function(edit, o) {
					// 载入照片
					var photo = Ext.getCmp('appUser.photo');
					var display = Ext.getCmp('displayUserPhoto');
					var appUserTitle = Ext.getCmp('appUserTitle');
					if (photo.value != '' && photo.value !=null && photo.value !='undefined') {
						display.body.update('<img src="' + __ctxPath
								+ '/attachFiles/' + photo.value + '" width="100%" height="100%"/>');
					}else if(appUserTitle.value == '0'){
						display.body.update('<img src="' + __ctxPath
								+ '/images/default_image_female.jpg" />');
					}
					var user = Ext.util.JSON.decode(o.response.responseText).data[0];

					// 载入部门信息
					Ext.getCmp('appUser.depId').setValue(user.department.depId);
					Ext.getCmp('depTreeSelector').setValue(user.department.depName);
				},
				failure : function() {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
				});
}
AppUserView.capacityUpdate = function(id) {
	new CapacityUpdateForm({
		userId : id
	}).show();
}