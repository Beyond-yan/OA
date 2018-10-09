Ext.ns('UserSubView');
/**
 * [UserSub]列表
 */
var UserSubView = function() {
	return new Ext.Panel({
		id : 'UserSubView',
		title : '我的下属',
		iconCls:'menu-subuser',
		autoScroll : true,
		items : [new Ext.FormPanel({
			id : 'UserSubSearchForm',
			height : 40,
			frame : false,
			border:false,
			layout : 'hbox',
			layoutConfig: {
                padding:'5',
                align:'middle'
            },
			defaults : {
				xtype : 'label',
				margins:{top:0, right:4, bottom:4, left:4}
			},
			items : [{
						text : '请输入查询条件:名字'
					}, {
						xtype : 'textfield',
						name : 'Q_subAppUser.fullname_S_LK'
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler :  function(){this.search.call(this);},
						search:function(){
					       var searchPanel=Ext.getCmp('UserSubSearchForm');
					       if(searchPanel.getForm().isValid()){//如果合法
					    	   var grid = Ext.getCmp('UserSubGrid');
					           var store=grid.getStore();
					           var baseParam=Ext.Ajax.serializeForm(searchPanel.getForm().getEl());
					           var deParams=Ext.urlDecode(baseParam);
					           deParams.start=0;
					           deParams.limit=store.baseParams.limit;
					           store.baseParams=deParams;
					           grid.getBottomToolbar().moveFirst();
					       }
					    }

					}, {
						xtype : 'button',
						text : '重置',
						iconCls:'btn-reseted',
						handler : function() {
							var searchPanel = Ext.getCmp('UserSubSearchForm');
							searchPanel.getForm().reset();
						}
					}]
		}), this.setup()]
	});
};
/**
 * 建立视图
 */
UserSubView.prototype.setup = function() {
	return this.grid();
};
/**
 * 建立DataGrid
 */
UserSubView.prototype.grid = function() {
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer(), {
					header : 'subId',
					dataIndex : 'subId',
					hidden : true
				}, {
					header : '名字',
					dataIndex : 'subAppUser',
					renderer:function(value){
					   if(value!=null){
					      return value.fullname;
					   }else{
					      return ''; 
					   }
				}
				}, {
					header : '性别',
					dataIndex : 'subAppUser',
					renderer:function(value){
						var sex=value.title;
						if (sex == '1') {
							return '男';
						}
						if (sex == '0') {
							return '女';
						}
					}
				}, {
					header : '所在部门',
					dataIndex : 'subAppUser',
					renderer:function(value){
					   if(value.department!=null){
					      return value.department.depName;
					   }else{
					      return '';
					   }
					}
				}, {
					header : '职位',
					dataIndex : 'subAppUser',
					renderer:function(value){
					   if(value.position!=null){
					      return value.position;
					   }else return '';
					}
				}, {
					header : '电话',
					dataIndex : 'subAppUser',
					renderer:function(value){
					   if(value.mobile!=null){
					     return value.mobile;
					   }else return '';
					}
				}, {
				    header:'入职时间',
				    dataIndex:'subAppUser',
				    renderer:function(value){
				        if(value.accessionTime!=null){
				           return value.accessionTime;
				        }else return '';
				    }
				}, {
					header : '管理',
					dataIndex : 'subId',
					width : 50,
					sortable : false,
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var editId = record.data.subId;
						var str = '<button title="删除" value=" " class="btn-del" onclick="UserSubView.remove('
								+ editId + ')">&nbsp;&nbsp;</button>';
						return str;
					}
				}],
		defaults : {
			sortable : true,
			menuDisabled : false,
			width : 100
		}
	});

	var store = this.store();
	store.load({
				params : {
					start : 0,
					limit : 25
				}
			});
	var grid = new Ext.grid.GridPanel({
				id : 'UserSubGrid',
				tbar : this.topbar(),
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
			});

	return grid;

};

/**
 * 初始化数据
 */
UserSubView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/system/listUserSub.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'subId',
										type : 'int'
									},'subAppUser']
						}),
				remoteSort : true
			});
	store.setDefaultSort('subId', 'desc');
	return store;
};

/**
 * 建立操作的Toolbar
 */
UserSubView.prototype.topbar = function() {
	var toolbar = new Ext.Toolbar({
				id : 'UserSubFootBar',
				height : 30,
				bodyStyle : 'text-align:left',
				items : [{
							iconCls : 'btn-add',
							text : '添加下属',
							xtype : 'button',
							handler : function() {
								new UserSubForm();
							}
						}, {
							iconCls : 'btn-del',
							text : '删除下属',
							xtype : 'button',
							handler : function() {

								var grid = Ext.getCmp("UserSubGrid");

								var selectRecords = grid.getSelectionModel().getSelections();

								if (selectRecords.length == 0) {
									Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
									return;
								}
								var ids = Array();
								for (var i = 0; i < selectRecords.length; i++) {
									ids.push(selectRecords[i].data.subId);
								}

								UserSubView.remove(ids);
							}
						}]
			});
	return toolbar;
};

/**
 * 删除单个记录
 */
UserSubView.remove = function(id) {
	var grid = Ext.getCmp("UserSubGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + '/system/multiDelUserSub.do',
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
 * 
 */
UserSubView.edit = function(id) {
	new UserSubForm(id);
};
