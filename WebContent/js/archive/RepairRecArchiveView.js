/**
 * @author:
 * @class RepairRecArchiveView
 * @extends Ext.Panel
 * @description [RepairRecArchive]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
RepairRecArchiveView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		RepairRecArchiveView.superclass.constructor.call(this, {
					id : 'RepairRecArchiveView',
					title : '公文补充管理',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			frame : true,
			items : [{
						layout : 'column',
						items : [{
									columnWidth : 0.33,
									layout : 'form',
									items : [{
												fieldLabel : '公文标题',
												name : 'Q_archives.subject_S_LK',
												xtype : 'textfield',
												width : 150
											}]
								}, {
									columnWidth : 0.33,
									layout : 'form',
									items : [{
												fieldLabel : '发文人',
												name : 'Q_appUser.fullname_S_LK',
												xtype : 'textfield',
												width : 150
											}]
								}, {
									columnWidth : 0.33,
									layout : 'form',
									items : [{
												fieldLabel : '收文部门',
												name : 'Q_childDepNames_S_LK',
												xtype : 'textfield',
												width : 150
											}]
								}]
					}],
			buttons : [{
						text : '查询',
						scope : this,
						iconCls : 'btn-search',
						handler : this.search
					}, {
						text : '重置',
						scope : this,
						iconCls : 'btn-reset',
						handler : this.reset
					}]
		});// end of searchPanel

		this.gridPanel = new HT.GridPanel({
			region : 'center',
			// 使用RowActions
			rowActions : true,
			id : 'RepairRecArchiveGrid',
			url : __ctxPath + "/archive/listRepairRecArchive.do",
			fields : [{
						name : 'id',
						type : 'int'
					}, 'archives', 'archives.subject',
					'proDefinition', 'proDefinition.name',
					'appUser', 'appUser.fullname', 'childDepNames',
					'department', 'appRole', 
					'status'],
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : 'archives',
						dataIndex : 'archives',
						hidden : true
					}, {
						header : 'proDefinition',
						dataIndex : 'proDefinition',
						hidden : true
					}, {
						header : 'appUser',
						dataIndex : 'appUser',
						hidden : true
					},{
						header : 'department',
						dataIndex : 'department',
						hidden : true
					}, {
						header : 'appRole',
						dataIndex : 'appRole',
						hidden : true
					}, {
						header : '公文标题',
						dataIndex : 'archives.subject'
					}, {
						header : '发文人',
						dataIndex : 'appUser.fullname'
					}, {
						header : '丢失单据类型',
						dataIndex : 'proDefinition.name'
					}, {
						header : '收文部门',
						dataIndex : 'childDepNames'
					}, {
						header : '状态',
						dataIndex : 'status',
						renderer : function(value) {
							if (value == 0) {
								return '<font color="red">未补</font>';
							} else if (value == 1) {
								return '<font color="green">已补</font>';
							}
						}
					}, new Ext.ux.grid.RowActions({
								header : '管理',
								width : 120,
								actions : [{
											iconCls : 'btn-save',
											qtip : '补文',
											style : 'margin:0 3px 0 3px'
										}, {
											iconCls : '',
											qtip : '',
											style : 'margin:0 3px 0 3px'
										}
								],
								listeners : {
									scope : this,
									'action' : this.onRowAction
								}
							})]
				// end of columns
			});
	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search({
					searchPanel : this.searchPanel,
					gridPanel : this.gridPanel
				});
	},
	// 按ID删除记录
	// 编辑Rs
	repair : function(record) {
		var id = record.id;
		var depNames = record.data.childDepNames;
		var archivesId = record.data.archives.archivesId;
		var processName = record.data.proDefinition.name;
		var startNodeName = '开始';
		var userId = record.data.appUser.userId;
		var roleId = record.data.appRole.roleId;
		var roleName = record.data.appRole.roleName;
		var depIds = record.data.department.depId;
		
		Ext.Msg.confirm('信息确认', '您确认补充该公文么？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					waitMsg : '正在提交数据...',
					method : 'POST',
					url : __ctxPath + "/archive/satrtSubProcessTempArchives.do",
					params : {
						archivesId : archivesId,
						processName : processName,
						startNodeName : startNodeName,
						userId : userId,
						roleId : roleId,
						roleName : roleName,
						depIds : depIds,
						depNames : depNames
					},
					success : function(response, options) {
						Ext.ux.Toast.msg('操作信息', '成功补文！');
						Ext.Ajax.request({
									waitMsg : '正在提交数据...',
									method : 'POST',
									url : __ctxPath
											+ "/archive/saveRepairRecArchive.do",
									params : {
										'repairRecArchive.id' : id,
										'repairRecArchive.status' : 1
									},
									success : function(response, options) {
										Ext.ux.Toast.msg('操作信息', '成功补文！');
										var gridPanel = Ext
												.getCmp('RepairRecArchiveGrid');
										gridPanel.getStore().reload();
									}
								});
					},
					failure : function(fp, action) {
						Ext.MessageBox.show({
									title : '操作信息',
									msg : '信息保存出错，请联系管理员！',
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
			}
		});
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-save' :
				this.repair.call(this, record);
				break;
			default :
				break;
		}
	}
});
