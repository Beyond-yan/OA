/**
 * @author:
 * @class SysInterfaceAccountView
 * @extends Ext.Panel
 * @description [SysInterfaceAccount]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SysInterfaceAccountView = Ext.extend(Ext.Window, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SysInterfaceAccountView.superclass.constructor.call(this, {
							id : 'SysInterfaceAccountWin',
							title : '服务权限管理',
							iconCls:'menu-flow',
							width : 630,
							height : 380,
							layout : 'border',
							maximizable : true,
							modal : true,
							buttonAlign : 'center',
							items : [this.searchPanel, this.gridPanel],
							buttons : [{
											text : '保存',
											iconCls : 'btn-save',
											scope : this,
											handler : this.save
										},{
											text : '取消',
											iconCls : 'btn-cancel',
											scope : this,
											handler : this.cancel
										}
							         ]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				
				var sm = new Ext.grid.CheckboxSelectionModel();
				var cm = new Ext.grid.ColumnModel({
					id:'SysInterfaceAccountViewGrid',
					columns : [sm, new Ext.grid.RowNumberer(),  {
								header : 'id',
								dataIndex : 'id',
								hidden : true
							}, {
								header : '服务账号',
								dataIndex : 'serviceName'
							}, {
								header : '描述',
								dataIndex : 'serviceDesc'
							}]
				});
				
				var store = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
									url : __ctxPath + "/system/listSysServiceInterface.do"
								}),
						reader : new Ext.data.JsonReader({
									root : 'result',
									totalProperty : 'totalCounts',
									id : 'id',
									fields : [{
										name : 'id',
										type : 'int'
									}, 'serviceCode', 'serviceName', 'servicePath',
									'serviceDesc', 'createUser', 'createDate',
									'updateUser', 'updateDate']
								}),
						remoteSort : true
					});
					
					store.setDefaultSort('id', 'asc');
				    store.load({
						params : {
							start : 0,
							limit : 10
						}
					});
				
				// 初始化搜索条件Panel
				this.searchPanel = new HT.SearchPanel({
							layout : 'form',
							region : 'north',
							colNums : 3,
							items : [{
										fieldLabel : '服务名称',
										name : 'Q_serviceAccount_S_LK',
										flex : 1,
										xtype : 'textfield'
									}, {
										fieldLabel : '描述',
										name : 'Q_description_S_LK',
										flex : 1,
										xtype : 'textfield'
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
				
				this.gridPanel = new Ext.grid.GridPanel({
							id : 'SysInterfaceAccountViewGrid',
							width : 400,
							height : 300,
							region : 'center',
							title : '服务列表',
							store : store,
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
							// paging bar on the bottom
							bbar : new Ext.PagingToolbar({
										pageSize :100,
										store : store,
										displayInfo : true,
										displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
										emptyMsg : "当前没有记录"
									})
						});
						
						if (this.accountId) {
							this.gridPanel.loadData({
								url : __ctxPath + '/system/getIdsSysInterfaceAccount.do?accountId='
											+ this.accountId,
										method : 'post',
										success : function(res,opt) {
											Ext.getCmp('SysInterfaceAccountViewGrid').getStore().load({
												callback : function() {
													var obj = Ext.util.JSON.decode(res.responseText);
													var ids = obj;
													var gridPanel = Ext.getCmp('SysInterfaceAccountViewGrid');
													var recordArr = gridPanel.getStore().queryBy(function(r,id){
														return ids.indexOf(r.get('id'))!=-1;
													},this).getRange();
													gridPanel.getSelectionModel().selectRecords(recordArr,true);
												},
												scope : Ext.getCmp('SysInterfaceAccountViewGrid').getStore(),
												add : false
											});
										}
							})
						}
						
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
			
			cancel : function() {
				this.close();
			},
			
			save : function() {
				var gridPanel = Ext.getCmp('SysInterfaceAccountViewGrid');
				var selectRecords = gridPanel.getSelectionModel().getSelections();
				var ids = Array();
				for (var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.id);
				}
				Ext.Ajax.request({
					url : __ctxPath + '/system/saveSysInterfaceAccount.do',
					params : {
						accountId:this.accountId,
						ids:ids
					},
					method : 'post',
					success : function() {
						Ext.getCmp('SysInterfaceAccountWin').close();
						Ext.ux.Toast.msg("信息提示", "服务权限设置成功！");
					}
				});
			}
		});
