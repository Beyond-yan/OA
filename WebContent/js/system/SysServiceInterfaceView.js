/**
 * @author:
 * @class SysServiceInterfaceView
 * @extends Ext.Panel
 * @description [SysServiceInterface]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SysServiceInterfaceView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SysServiceInterfaceView.superclass.constructor.call(this, {
							id : 'SysServiceInterfaceView',
							title : '服务管理',
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
							colNums : 2,
							items : [{
										fieldLabel : '服务编号',
										name : 'Q_serviceCode_S_LK',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '服务名称',
										name : 'Q_serviceName_S_LK',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '服务访问地址',
										name : 'Q_servicePath_S_LK',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '服务描述',
										name : 'Q_serviceDesc_S_LK',
										flex : 1,
										xtype : 'textfield'
									}/*, {
										fieldLabel : '创建人',
										name : 'Q_createUser_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '创建时间',
										name : 'Q_createDate_D_EQ',
										flex : 1,
										xtype : 'datefield',
										format : 'Y-m-d'
									}, {
										fieldLabel : '修改人',
										name : 'Q_updateUser_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '修改时间',
										name : 'Q_updateDate_D_EQ',
										flex : 1,
										xtype : 'datefield',
										format : 'Y-m-d'
									}*/],
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

				this.topbar = new Ext.Toolbar({
							items : [{
										iconCls : 'btn-add',
										text : '添加服务',
										xtype : 'button',
										scope : this,
										handler : this.createRs
									}, {
										iconCls : 'btn-del',
										text : '删除服务',
										xtype : 'button',
										scope : this,
										handler : this.removeSelRs
									}]
						});

				this.gridPanel = new HT.GridPanel({
					region : 'center',
					tbar : this.topbar,
					//使用RowActions
					rowActions : true,
					id : 'SysServiceInterfaceGrid',
					url : __ctxPath + "/system/listSysServiceInterface.do",
					fields : [{
								name : 'id',
								type : 'int'
							}, 'serviceCode', 'serviceName', 'servicePath',
							'serviceDesc', 'createUser', 'createDate',
							'updateUser', 'updateDate'],
					columns : [{
								header : 'id',
								dataIndex : 'id',
								hidden : true
							}, {
								header : '服务编号',
								dataIndex : 'serviceCode'
							}, {
								header : '服务名称',
								dataIndex : 'serviceName'
							}, {
								header : '服务访问地址',
								dataIndex : 'servicePath'
							}, {
								header : '服务描述',
								dataIndex : 'serviceDesc'
							}, {
								header : '创建人',
								dataIndex : 'createUser'
							}, {
								header : '创建时间',
								dataIndex : 'createDate'
							}, {
								header : '修改人',
								dataIndex : 'updateUser'
							}, {
								header : '修改时间',
								dataIndex : 'updateDate'
							}, new Ext.ux.grid.RowActions({
										header : '管理',
										width : 100,
										actions : [{
													iconCls : 'btn-del',
													qtip : '删除',
													style : 'margin:0 3px 0 3px'
												}, {
													iconCls : 'btn-edit',
													qtip : '编辑',
													style : 'margin:0 3px 0 3px'
												}],
										listeners : {
											scope : this,
											'action' : this.onRowAction
										}
									})]
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
							new SysServiceInterfaceForm({
										id : rec.data.id
									}).show();
						});
			},
			//创建记录
			createRs : function() {
				new SysServiceInterfaceForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
							url : __ctxPath
									+ '/system/multiDelSysServiceInterface.do',
							ids : id,
							grid : this.gridPanel
						});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
							url : __ctxPath
									+ '/system/multiDelSysServiceInterface.do',
							grid : this.gridPanel,
							idName : 'id'
						});
			},
			//编辑Rs
			editRs : function(record) {
				new SysServiceInterfaceForm({
							id : record.data.id
						}).show();
			},
			//行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this, record.data.id);
						break;
					case 'btn-edit' :
						this.editRs.call(this, record);
						break;
					default :
						break;
				}
			}
		});
