/**
 * @author
 * @createtime
 * @class MonitorDealHistoryForm
 * @extends Ext.Window
 * @description MonitorDealHistory表单
 * @company 捷达世软件
 */
TeamMemberForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		if (_cfg == null) {
			_cfg = {};
		}
		Ext.apply(this, _cfg);
		// 初始化组件
		this.initComponents();
		// 调用父类构造
		TeamMemberForm.superclass.constructor.call(this, {
					id : 'TeamMemberForm',
					title : '工作组成员管理',
					iconCls : 'menu-arch-controll',
					region : 'center',
					autoHeight:true,
					width:460,
					layout : 'fit',
					items : [this.gridPanel]
				});
	},// end of constructor

	// 群组ID
	teamId : null,


	// 数据展示Panel
	gridPanel : null,

	// GridPanel的数据Store
	store : null,

	// 头部工具栏
	topbar : null,

	// 初始化组件
	initComponents : function() {

		var teamId = this.teamId;
		/*// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					height : 40,
					region : 'north',
					frame : false,
					border : false,
					layout : 'hbox',
					layoutConfig : {
						padding : '5',
						align : 'middle'
					},
					defaults : {
						xtype : 'label',
						margins : {
							top : 0,
							right : 4,
							bottom : 4,
							left : 4
						}
					},
					items : [{
								text : '工号'
							}, {
								name : 'Q_archivesNo_S_LK',
								xtype : 'textfield',
								anchor : '98%'
							}, {
								text : '姓名'
							}, {
								name : 'Q_subject_S_LK',
								xtype : 'textfield',
								anchor : '98%'
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : this.search.createCallback(this)
							}, {
								xtype : 'hidden',
								name : 'Q_status_SN_GT',
								value : 0
							}]
				});// end of the searchPanel
*/
		this.topbar = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-add',
				text : '添加成员',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}, {
				iconCls : 'btn-del',
				text : '删除成员',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			} ]
		});
		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/system/listMembersAppTeam.do?teamId="+teamId,
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'userId',
								type : 'int'
							}, 'username', 'fullname']
				});
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 10
					}
				});

		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'userId',
						dataIndex : 'userId',
						hidden : true
					}, {
						header : '工号',
						dataIndex : 'username'
					}, {
						header : '姓名',
						dataIndex : 'fullname'
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'TeamMemberFormGrid',
					region : 'center',
					tbar : this.topbar,
					stripeRows : true,
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
					bbar : new Ext.PagingToolbar({
								pageSize : 10,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});
	},// end of the initComponents()

	// 创建记录
	createRs : function() {
		var teamId=this.teamId;
		UserSelector.getView(
				function(userIds,fullnames) {
					Ext.Ajax.request({
						url : __ctxPath
								+ '/system/addMembersAppTeam.do',
						params : {
				           teamId:teamId,
							ids : userIds
						},
						method : 'POST',
						success : function(response, options) {
							Ext.ux.Toast.msg('操作信息', '添加成功！');
							Ext.getCmp('TeamMemberFormGrid').getStore()
									.reload();
						},
						failure : function(response, options) {
							Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
						}
					});
				}, false, false)
		.show();
	
	},
	// 按ID删除记录
	removeRs : function(id) {
		var teamId = this.teamId;
		Ext.Msg.confirm('信息确认', '您确认要删除该条记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
							url : __ctxPath
									+ '/system/multiDelMembersAppTeam.do',
							params : {
					            teamId:teamId,
								ids : ids
							},
							method : 'POST',
							success : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '成功删除该组员！');
								Ext.getCmp('TeamMemberFormGrid').getStore()
										.reload();
							},
							failure : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
							}
						});
			}
		});// end of comfirm
	},
	// 把选中记录删除
	removeSelRs : function() {
		var teamId = this.teamId;
		var selRs = this.gridPanel.getSelectionModel().getSelections();
		var ids = Array();
		for (var i = 0; i < selRs.length; i++) {
			ids.push(eval('selRs[i].data.'+'userId'));
		}
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
							url : __ctxPath
									+ '/system/multiDelMembersAppTeam.do',
							params : {
								teamId:teamId,
								ids : ids
							},
							method : 'POST',
							success : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '成功删除！');
								Ext.getCmp('TeamMemberFormGrid').getStore()
										.reload();
							},
							failure : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
							}
						});
			}
		});// end of comfirm
	}
});

