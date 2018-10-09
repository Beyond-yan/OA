/**
 * @author:
 * @class SysServiceAccessLogView
 * @extends Ext.Panel
 * @description [SysServiceAccessLog]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SysServiceAccessLogView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SysServiceAccessLogView.superclass.constructor.call(this, {
							id : 'SysServiceAccessLogView',
							title : '服务日志管理',
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
							colNums : 4,
							items : [{
										fieldLabel : '服务名称',
										id : 'SysServiceAccessLogView.serviceId',
										hiddenName : 'Q_sysServiceInterface.id_L_EQ',
										flex : 1,
										xtype : 'combo',
										valueField : 'id',
										displayField : 'serviceName',
										mode : 'local',
										editable : false,
										emptyText : '请选择服务名称',
										triggerAction : 'all',
										store : new Ext.data.SimpleStore({
											url : __ctxPath + '/system/getIdAndNameSysServiceInterface.do?', //
											autoLoad : true,
											fields : ['id', 'serviceName'],
											listeners : {
												scope : this,
												load : function() {
													var cmp = Ext.getCmp('SysServiceAccessLogView.serviceId');
													if(cmp.hiddenField.value =='') cmp.setValue('');
													if (cmp.hiddenField.value && cmp.hiddenField.value !='')
														cmp.setValue(cmp.hiddenField.value);
												}
											}
										})
									}, {
										fieldLabel : '调用账号',
										name : 'Q_serviceAccount_S_LK',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '访问时间',
										name : 'Q_accessDate_D_GE',
										flex : 1,
										xtype : 'datefield',
										format : 'Y-m-d'
									},{
										fieldLabel : '至',
										name : 'Q_accessDate_D_LE',
										flex : 1,
										xtype : 'datefield',
										format : 'Y-m-d'
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

				this.topbar = new Ext.Toolbar({
							items : [{
										iconCls : 'btn-add',
										text : '添加日志',
										hidden : true,
										xtype : 'button',
										scope : this,
										handler : this.createRs
									}, {
										iconCls : 'btn-del',
										text : '删除日志',
										hidden : true,
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
					id : 'SysServiceAccessLogGrid',
					url : __ctxPath + "/system/listSysServiceAccessLog.do",
					fields : [{
								name : 'id',
								type : 'int'
							}, 'serviceId', 'serviceAccount', 'accessDate',
							'status', 'errorMessage', 'sysServiceInterface.serviceName', 'ipAddress'],
					columns : [{
								header : 'id',
								dataIndex : 'id',
								hidden : true
							}, {
								header : '服务名称',
								dataIndex : 'sysServiceInterface.serviceName'
							}, {
								header : '调用账号',
								dataIndex : 'serviceAccount'
							}, {
								header : '访问时间',
								dataIndex : 'accessDate'
							}, {
								header : '访问结果',
								dataIndex : 'status',
								renderer : function(value) {
									if(0 == value){
										return '初始状态';
									}else if(1 == value){
										return '成功';
									}else if(2 == value){
										return '失败';
									}else{
										return '';
									}
								}
							}, {
								header : '访问结果信息',
								dataIndex : 'errorMessage'
							}, {
								header : '来源IP',
								dataIndex : 'ipAddress'
							}, new Ext.ux.grid.RowActions({
										header : '管理',
										hidden : true,
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
							new SysServiceAccessLogForm({
										id : rec.data.id
									}).show();
						});
			},
			//创建记录
			createRs : function() {
				new SysServiceAccessLogForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
							url : __ctxPath
									+ '/system/multiDelSysServiceAccessLog.do',
							ids : id,
							grid : this.gridPanel
						});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
							url : __ctxPath
									+ '/system/multiDelSysServiceAccessLog.do',
							grid : this.gridPanel,
							idName : 'id'
						});
			},
			//编辑Rs
			editRs : function(record) {
				new SysServiceAccessLogForm({
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
