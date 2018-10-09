/**
 * @author:
 * @class SysServiceAccountView
 * @extends Ext.Panel
 * @description [SysServiceAccount]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SysServiceAccountView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		SysServiceAccountView.superclass.constructor.call(this, {
			id : 'SysServiceAccountView',
			title : '服务账号管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel : '服务账号',
				name : 'Q_serviceAccount_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '描述',
				name : 'Q_description_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '状态',
				name : 'Q_status_L_EQ',
				flex : 1,
				xtype : 'combo',
				mode : 'local',
				editable : false,
				triggerAction : 'all',
				store : [ [ '1', '激活' ], [ '0', '禁用' ] ],
				value : 1
			}],
			buttons : [ {
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			}, {
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			} ]
		});// end of searchPanel

		this.topbar = new Ext.Toolbar({
			items : [ {
				iconCls : 'btn-add',
				text : '添加账号',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}, {
				iconCls : 'btn-del',
				text : '删除账号',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			} ]
		});

		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			//使用RowActions
			rowActions : true,
			id : 'SysServiceAccountGrid',
			url : __ctxPath + "/system/listSysServiceAccount.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'serviceAccount', 'password', 'description', 'status',
					'createUser', 'createDate', 'updateUser', 'updateDate' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '服务账号',
				dataIndex : 'serviceAccount'
			}, {
				header : '描述',
				dataIndex : 'description'
			},  {
				header : '账号状态',
				dataIndex : 'status',
				renderer : function(value) {
					var str = '';
					if(value == 1){//激活用户
						str += '<img title="激活" src="'+ __ctxPath +'/images/flag/customer/effective.png"/>'
					}else{//禁用用户
						str += '<img title="禁用" src="'+ __ctxPath +'/images/flag/customer/invalid.png"/>'
					}
					return str;
				}
			}, {
				header : '创建人',
				dataIndex : 'createUser'
			}, {
				header : '创建时间',
				dataIndex : 'createDate'
			}, new Ext.ux.grid.RowActions({
				header : '管理',
				width : 100,
				actions : [ {
					iconCls : 'btn-del',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-edit',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-password',
					qtip : '重置密码',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-grant',
					qtip : '授权',
					style : 'margin:0 3px 0 3px'
				} ],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		//end of columns
		});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	//重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	//按条件搜索
	search : function() {
		$search({
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	//GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new SysServiceAccountForm({
				id : rec.data.id
			}).show();
		});
	},
	//创建记录
	createRs : function() {
		new SysServiceAccountForm().show();
	},
	//按ID删除记录
	removeRs : function(id) {
		$postDel({
			url : __ctxPath + '/system/multiDelSysServiceAccount.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	//把选中ID删除
	removeSelRs : function() {
		$delGridRs({
			url : __ctxPath + '/system/multiDelSysServiceAccount.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	//编辑Rs
	editRs : function(record) {
		new SysServiceAccountForm({
			id : record.data.id
		}).show();
	},
	accredit : function(record){
		new SysInterfaceAccountView({
			accountId : record.data.id
		}).show();
	},
	resetPsd : function(record){
		new SysServiceAccountPsdChangeForm(record.data.id);
	},
	//行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.id);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		case 'btn-grant':
			this.accredit.call(this,record);
			break;
		case 'btn-password':
			this.resetPsd.call(this, record);
		default:
			break;
		}
	}
});
