/**
 * @author:
 * @class SysUserAllView
 * @extends Ext.Panel
 * @description [SysUserAll]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SysUserAllView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SysUserAllView.superclass.constructor.call(this, {
							id : 'SysUserAllView',
							title : '账号设置',
							region : 'center',
							layout : 'border',
							width : 'auto',
							autoScroll : true,
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
									columnWidth : 0.3,
									layout : 'form',
									defaults : {
										anchor : '85%,85%'
									},
									items : [{
										fieldLabel : '用户账号',
										name : 'Q_userName_S_LK',
										flex : 1,
										xtype : 'textfield'
									}/*, {
										fieldLabel : '创建人',
										name : 'Q_createUser_S_LK',
										flex : 1,
										xtype : 'textfield'
									}*/]
								}, {
									columnWidth : 0.3,
									layout : 'form',
									defaults : {
										anchor : '85%,85%'
									},
									items : [{
										fieldLabel : 'SCHEMA',
										id : 'SysUserAllView.siteId',
										hiddenName : 'Q_sysSchemaConfig.id_L_EQ',
										flex : 1,
										xtype : 'combo',
										valueField : 'id',
										displayField : 'schemaCode',
										mode : 'local',
										editable : false,
										emptyText : 'schemaCode',
										triggerAction : 'all',
										store : new Ext.data.SimpleStore({
											url : __ctxPath + '/system/getSchemaSysSchemaConfig.do?', //
											//method : 'post',
											autoLoad : true,
											fields : ['id', 'schemaCode'],
											listeners : {
												scope : this,
												load : function() {
													var cmp = Ext.getCmp('SysUserAllView.siteId');
													if(cmp.hiddenField.value =='') cmp.setValue('');
													if (cmp.hiddenField.value && cmp.hiddenField.value !='')
														cmp.setValue(cmp.hiddenField.value);
												}
											}
										})
									}/*, {
										fieldLabel : '创建日期',
										name : 'Q_createDate_D_GE',
										editable : false,
										flex : 1,
										xtype : 'datefield',
										format : 'Y-m-d'
									}*/]
								}, {
									columnWidth : 0.3,
									layout : 'form',
									defaults : {
										anchor : '85%,85%'
									},
									items : [{
										fieldLabel : '用户状态',
										hiddenName : 'Q_status_L_EQ',
										flex : 1,
										xtype : 'combo',
										mode : 'local',
										editable : false,
										triggerAction : 'all',
										store : [ [ '1', '激活' ], [ '0', '禁用' ] ],
										value : 1
									}/*, {
										fieldLabel : '修改人',
										name : 'Q_updateUser_S_LK',
										flex : 1,
										xtype : 'textfield'
									}*/]
								}]
							}],
							/*defaults : {
								anchor : '96%,96%'
							},
							colNums : 3,
							items : [{
										fieldLabel : '用户账号',
										name : 'Q_userName_S_LK',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '密码:',
										name : 'Q_userPassword_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : 'SCHEMA',
										name : 'Q_schemaId_L_EQ',
										flex : 1,
										xtype : 'numberfield'
									}, {
										fieldLabel : '用户状态',
										hiddenName : 'Q_status_L_EQ',
										flex : 1,
										xtype : 'combo',
										mode : 'local',
										editable : false,
										triggerAction : 'all',
										store : [ [ '1', '激活' ], [ '0', '禁用' ] ],
										value : 1
									}, {
										fieldLabel : '创建人',
										name : 'Q_createUser_S_LK',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '创建日期',
										name : 'Q_createDate_D_GE',
										flex : 1,
										xtype : 'datefield',
										format : 'Y-m-d'
									}, {
										fieldLabel : '修改人',
										name : 'Q_updateUser_S_LK',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '修改日期',
										name : 'Q_updateDate_D_EQ',
										flex : 1,
										xtype : 'datefield',
										format : 'Y-m-d'
									}],*/
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
							items : [/*{
										iconCls : 'btn-add',
										text : '添加账号设置',
										xtype : 'button',
										scope : this,
										handler : this.createRs
									}, {
										iconCls : 'btn-del',
										text : '删除账号设置',
										xtype : 'button',
										scope : this,
										handler : this.removeSelRs
									}*/]
						});

				this.gridPanel = new HT.GridPanel({
					region : 'center',
					tbar : this.topbar,
					//使用RowActions
					rowActions : true,
					id : 'SysUserAllGrid',
					url : __ctxPath + "/system/listSysUserAll.do",
					fields : [{
								name : 'id',
								type : 'int'
							}, 'userName', 'userPassword', 'sysSchemaConfig.schemaCode',
							'status', 'createUser', 'createDate', 'updateUser',
							'updateDate'],
					columns : [{
								header : 'id',
								dataIndex : 'id',
								hidden : true
							}, {
								header : '用户账号',
								dataIndex : 'userName'
							}/*, {
								header : '密码',
								dataIndex : 'userPassword'
							}*/, {
								header : 'SCHEMA',
								dataIndex : 'sysSchemaConfig.schemaCode'
							}, {
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
								header : '创建日期',
								dataIndex : 'createDate'
							}, {
								header : '修改人',
								dataIndex : 'updateUser'
							}, {
								header : '修改日期',
								dataIndex : 'updateDate'
							}, new Ext.ux.grid.RowActions({
										header : '管理',
										width : 100,
										hidden : true,
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
							new SysUserAllForm({
										id : rec.data.id
									}).show();
						});
			},
			//创建记录
			createRs : function() {
				new SysUserAllForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
							url : __ctxPath + '/system/multiDelSysUserAll.do',
							ids : id,
							grid : this.gridPanel
						});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
							url : __ctxPath + '/system/multiDelSysUserAll.do',
							grid : this.gridPanel,
							idName : 'id'
						});
			},
			//编辑Rs
			editRs : function(record) {
				new SysUserAllForm({
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
