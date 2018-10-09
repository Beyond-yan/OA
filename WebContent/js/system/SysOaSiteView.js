/**
 * @author:
 * @class SysOaSiteView
 * @extends Ext.Panel
 * @description [SysOaSite]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SysOaSiteView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SysOaSiteView.superclass.constructor.call(this, {
							id : 'SysOaSiteView',
							title : '部署点管理',
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
										fieldLabel : '部署点编号',
										name : 'Q_siteCode_S_LK',
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
										fieldLabel : '部署点名称',
										name : 'Q_siteName_S_LK',
										flex : 1,
										xtype : 'textfield'
									}/*, {
										fieldLabel : '创建日期',
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
										fieldLabel : '类型',
										hiddenName : 'Q_ownerType_L_EQ',
										flex : 1,
										xtype : 'combo',
										mode : 'local',
										editable : false,
										triggerAction : 'all',
										store : [ ['', '全部'], [ '1', '本站点' ], [ '2', '外站点' ] ],
										value : ''
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
										fieldLabel : '部署点编号',
										name : 'Q_siteCode_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '部署点名称',
										name : 'Q_siteName_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '类型',
										name : 'Q_ownerType_L_EQ',
										flex : 1,
										xtype : 'combo',
										mode : 'local',
										editable : false,
										triggerAction : 'all',
										store : [ [ '1', '本站点' ], [ '2', '外站点' ] ],
										value : 1
									}, {
										fieldLabel : '创建人',
										name : 'Q_createUser_S_EQ',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '创建日期',
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
										text : '添加部署点',
										xtype : 'button',
										scope : this,
										handler : this.createRs
									}, {
										iconCls : 'btn-del',
										text : '删除部署点',
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
					id : 'SysOaSiteGrid',
					url : __ctxPath + "/system/listSysOaSite.do",
					fields : [{
								name : 'id',
								type : 'int'
							}, 'siteCode', 'siteName', 'ownerType',
							'createUser', 'createDate', 'updateUser',
							'updateDate'],
					columns : [{
								header : 'id',
								dataIndex : 'id',
								hidden : true
							}, {
								header : '部署点编号',
								dataIndex : 'siteCode'
							}, {
								header : '部署点名称',
								dataIndex : 'siteName'
							}, {
								header : '类型',
								dataIndex : 'ownerType',
								renderer : function(value) {
									if(1 == value){
										return '本站点';
									}else if(2 == value ){
										return '外站点';
									}else{
										return '';
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
							new SysOaSiteForm({
										id : rec.data.id
									}).show();
						});
			},
			//创建记录
			createRs : function() {
				new SysOaSiteForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				var gridPanel = this.gridPanel;
//				var id = id;
				Ext.Ajax.request({
							url : __ctxPath + '/system/multiDelSysOaSite.do',
							params : {
										ids : id
									},
//							ids : id,
							grid : this.gridPanel,
							success : function(result,request) {
								var res = Ext.util.JSON.decode(result.responseText);
											if(res.success==false){
											  Ext.ux.Toast.msg('操作信息',res.message);
											}else{
											  Ext.ux.Toast.msg('操作信息','删除成功!');
											  gridPanel.getStore().reload();
											}
							}
						});
			},
			//把选中ID删除
			removeSelRs : function() {
				var gridPanel = this.gridPanel;
				var gridPanel = Ext.getCmp('SysOaSiteGrid');
				var selectRecords = gridPanel.getSelectionModel().getSelections();
				if (selectRecords.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var ids = Array();
				for (var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.id);
				}
				this.removeRs(ids);
				/*$delGridRs({
							url : __ctxPath + '/system/multiDelSysOaSite.do',
							grid : this.gridPanel,
							idName : 'id',
							success : function(result,request) {
								var res = Ext.util.JSON.decode(result.responseText);
											if(res.success==false){
											  Ext.ux.Toast.msg('操作信息',res.message);
											}else{
											  Ext.ux.Toast.msg('操作信息','删除成功!');
											  gridPanel.getStore().reload();
											}
							}
						});*/
			},
			//编辑Rs
			editRs : function(record) {
				new SysOaSiteForm({
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
