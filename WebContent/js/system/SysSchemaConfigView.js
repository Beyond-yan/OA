/**
 * @author:
 * @class SysSchemaConfigView
 * @extends Ext.Panel
 * @description [SysSchemaConfig]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SysSchemaConfigView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SysSchemaConfigView.superclass.constructor.call(this, {
							id : 'SysSchemaConfigView',
							title : 'SCHEMA管理',
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
									columnWidth : 0.3,
									layout : 'form',
									defaults : {
										anchor : '85%,85%'
									},
									items : [{
										fieldLabel : '名称',
										name : 'Q_schemaCode_S_LK',
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
										fieldLabel : '描述',
										name : 'Q_schemaDesc_S_LK',
										flex : 1,
										xtype : 'textfield'
									}/*, {
										fieldLabel : '创建时间',
										name : 'Q_createDate_D_EQ',
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
										fieldLabel : '所属部署点',
										id : 'SysSchemaConfigView.siteId',
										hiddenName : 'Q_sysOaSite.id_L_EQ',
										flex : 1,
										xtype : 'combo',
										valueField : 'id',
										displayField : 'siteName',
										mode : 'local',
										editable : false,
										emptyText : 'siteName',
										triggerAction : 'all',
										store : new Ext.data.SimpleStore({
											url : __ctxPath + '/system/getSysOaSiteSysSchemaConfig.do?', //
											//method : 'post',
											autoLoad : true,
											fields : ['id', 'siteName'],
											listeners : {
												scope : this,
												load : function() {
													var cmp = Ext.getCmp('SysSchemaConfigView.siteId');
													if(cmp.hiddenField.value =='') cmp.setValue('');
													if (cmp.hiddenField.value && cmp.hiddenField.value !='')
														cmp.setValue(cmp.hiddenField.value);
												}
											}
										})
									}/*, {
										fieldLabel : '修改人',
										name : 'Q_updateUser_S_LK',
										flex : 1,
										xtype : 'textfield'
									}*/]
								}]
							}],
							/*colNums : 3,
							items : [{
										fieldLabel : '名称',
										name : 'Q_schemaCode_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '描述',
										name : 'Q_schemaDesc_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '所属部署点',
										name : 'Q_siteId_L_EQ',
										flex : 1,
										xtype : 'numberfield'
									}, {
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
							items : [{
										iconCls : 'btn-add',
										text : '添加SCHEMA',
										xtype : 'button',
										scope : this,
										handler : this.createRs
									}, {
										iconCls : 'btn-del',
										text : '删除SCHEMA',
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
					id : 'SysSchemaConfigGrid',
					url : __ctxPath + "/system/listSysSchemaConfig.do",
					fields : [{
								name : 'id',
								type : 'int'
							}, 'schemaCode', 'schemaDesc', 'siteId','sysOaSite',
							'createUser', 'createDate', 'updateUser',
							'updateDate'],
					columns : [{
								header : 'id',
								dataIndex : 'id',
								hidden : true
							}, {
								header : '名称',
								dataIndex : 'schemaCode'
							}, {
								header : '描述',
								dataIndex : 'schemaDesc'
							}, {
								header : '所属部署点',
								dataIndex : 'sysOaSite',
								renderer : function(value) {
									if(value==null){
										return '';
									}else{
										return value.siteName;
									}
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
							new SysSchemaConfigForm({
										id : rec.data.id
									}).show();
						});
			},
			//创建记录
			createRs : function() {
				new SysSchemaConfigForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
							url : __ctxPath
									+ '/system/multiDelSysSchemaConfig.do',
							ids : id,
							grid : this.gridPanel
						});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
							url : __ctxPath
									+ '/system/multiDelSysSchemaConfig.do',
							grid : this.gridPanel,
							idName : 'id'
						});
			},
			//编辑Rs
			editRs : function(record) {
				new SysSchemaConfigForm({
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
