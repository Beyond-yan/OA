/**
 * @author:
 * @class FlowSnConfigView
 * @extends Ext.Panel
 * @description [FlowSnConfig]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
FlowSnConfigView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		var flowId = "";
		this.initUIComponents();
		// 调用父类构造
		FlowSnConfigView.superclass.constructor.call(this, {
					id : 'FlowSnConfigView',
					title : '公文编号配置',
					iconCls : 'menu-archive-handout',
					layout : 'border',
					items : [this.treePanel, this.rightPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.treePanel = new Ext.tree.TreePanel({
			region : 'west',
			id : 'TreePanel',
			title : '流程名称',
			collapsible : true,
			autoScroll : true,
			split : true,
			width : 400,
			tbar : new Ext.Toolbar({
						items : [{
									xtype : 'hidden',
									id : 'flowId'
								}, {
									xtype : 'hidden',
									id : 'parentFlowId'
								}, {
									xtype : 'button',
									iconCls : 'btn-refresh',
									text : '刷新',
									handler : function() {
										Ext.getCmp('TreePanel').root.reload();
									}
								}, {
									xtype : 'button',
									text : '展开',
									iconCls : 'btn-expand',
									handler : function() {
										Ext.getCmp('TreePanel').expandAll();
									}
								}, {
									xtype : 'button',
									text : '收起',
									iconCls : 'btn-collapse',
									handler : function() {
										Ext.getCmp('TreePanel').collapseAll();
									}
								}]
					}),
			loader : new Ext.tree.TreeLoader({
						url : __ctxPath + '/snconfig/rootFlowSnConfig.do'
					}),
			root : new Ext.tree.AsyncTreeNode({
						expanded : true
					}),
			rootVisible : false,
			listeners : {
				'click' : function(node) {
					if (node.id != null && node.parentNode.id != 0
							&& node.id != 0) {
						Ext.getCmp('FlowSnConfigSearchForm').getForm().reset();
						var defGridView = Ext.getCmp('FlowSnConfigGrid');
						Ext.getCmp("flowId").setValue(node.id);
						Ext.getCmp("parentFlowId").setValue(node.parentNode.id);
						defGridView.getStore().baseParams = {
							flowId : node.id
						}
						Ext.getCmp('FlowSnConfigSearchForm.flowId')
								.setValue(node.id);
						Ext.Ajax.request({
									url : __ctxPath
											+ '/snconfig/getCheckSignsFlowSnConfig.do',
									params : {
										flowId : Ext.getCmp("flowId")
												.getValue()
									},
									method : 'post',
									success : function(res, opt) {
										var data = Ext.util.JSON
												.decode(res.responseText);
										var gridPanel = Ext
												.getCmp('FlowSnConfigGrid');
										gridPanel.getStore().loadData(data);
										// var recordArr =
										// gridPanel.getStore().queryBy(function(r,id){
										// //判定是否是指定的record
										// return ids.indexOf(r.get('id'))!=-1;
										// },this).getRange();
										// gridPanel.getSelectionModel().selectRecords(recordArr,true);
									}
								});
					} else {
						Ext.Ajax.request({
									url : __ctxPath
											+ '/snconfig/getCheckSignsFlowSnConfig.do',
									method : 'post',
									success : function(res, opt) {
										var data = Ext.util.JSON
												.decode(res.responseText);
										var gridPanel = Ext
												.getCmp('FlowSnConfigGrid');
										gridPanel.getStore().loadData(data);
										Ext.getCmp("flowId").setValue(node.id);
										Ext.getCmp("parentFlowId")
												.setValue(node.parentNode.id);
									}
								});
					}
				}
			}
		});
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
					id : 'FlowSnConfigSearchForm',
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
								text : '编号名称'
							}, {
								xtype : 'textfield',
								name : 'Q_snName_S_LK'
							}, {
								text : '编号序号'
							}, {
								name : 'Q_snNumber_L_EQ',
								xtype : 'numberfield'
							}, {
								text : '编号类型'
							}, {
								xtype : 'combo',
								hiddenName : 'Q_snType_L_EQ',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								width : 120,
								store : [['0', '发文'], ['1', '收文']]
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext
											.getCmp('FlowSnConfigSearchForm');
									var grid = Ext.getCmp('FlowSnConfigGrid');
									if (searchPanel.getForm().isValid()) {
										$search({
													searchPanel : searchPanel,
													gridPanel : grid
												});
									}
								}
							}, {
								xtype : 'button',
								text : '重置',
								iconCls : 'btn-reset',
								handler : function() {
									var searchPanel = Ext
											.getCmp('FlowSnConfigSearchForm');
									searchPanel.getForm().reset();
									var flowId = Ext.getCmp("flowId")
											.getValue();
									Ext.getCmp("FlowSnConfigSearchForm.flowId")
											.setValue(flowId);
								}
							}, {
								xtype : 'hidden',
								id : 'FlowSnConfigSearchForm.flowId',
								name : 'flowId'
							}]
				});// end of the searchPanel

		this.topbar = new Ext.Toolbar({
					items : [{
								iconCls : 'btn-add',
								text : '添加文件编号',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							}, {
								iconCls : 'btn-del',
								text : '删除文件编号',
								xtype : 'button',
								scope : this,
								handler : this.delRecords
							}]
				});
		var store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath
										+ '/snconfig/getCheckSignsFlowSnConfig.do?'
							}),
					reader : new Ext.data.JsonReader({
								root : 'data',
								totalProperty : 'totalCounts',
								id : 'id',
								fields : [{
											name : 'id',
											type : 'int'
										}, 'snName', 'snNumber', 'snFormat',
										'snType', 'expirationDate',
										'createUser', 'createDate',
										'updateUser', 'updateDate']
							}),
					remoteSort : true
				});
		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			layout : 'anchor',
			autoHeight : true,
			id : 'FlowSnConfigGrid',
			store : store,
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '编号名称',
						dataIndex : 'snName'
					}, {
						header : '编号序号',
						width : 80,
						dataIndex : 'snNumber'
					}, {
						header : '编号格式',
						dataIndex : 'snFormat'
					}, {
						header : '编号类型',
						dataIndex : 'snType',
						renderer : function(value) {
							var strValue = "发文";
							if (value == 1) {
								strValue = "收文";
							}
							return strValue;
						}
					}, {
						header : '失效日期',
						dataIndex : 'expirationDate'
					}]
				// end of columns
			});
		store.load({
					params : {
						start : 0,
						limit : 10
					}
				});
		this.rightPanel = new Ext.Panel({
					region : 'center',
					autoScroll : true,
					iconCls : 'menu-department',
					layout : 'anchor',
					items : [this.searchPanel, this.gridPanel]
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
	// 创建记录
	createRs : function() {
		var flowId = Ext.getCmp("flowId").getValue();
		var parentFlowId = Ext.getCmp("parentFlowId").getValue();
		if (null != flowId && flowId != "" && flowId != '0'
				&& parentFlowId != '0') {
			new FlowSnConfigForm({
						flowId : flowId
					}).show();
		} else {
			Ext.ux.Toast.msg("信息提示", "请选择相应的流程！");
		}
	},
	// 预约编号
	orderRs : function() {
		var flowId = Ext.getCmp("flowId").getValue();
		var parentFlowId = Ext.getCmp("parentFlowId").getValue();
		if (null != flowId && flowId != "" && flowId != '0'
				&& parentFlowId != '0') {
			var gridPanel = Ext.getCmp('FlowSnConfigGrid');
			var selectRecords = gridPanel.getSelectionModel().getSelections();
			if (selectRecords.length == 0) {
				Ext.ux.Toast.msg("信息", "请选择编号方式！");
				return;
			}
			var ids = Array();
			var sn_name;
			var sn_id;
			for (var i = 0; i < selectRecords.length; i++) {
				ids.push(selectRecords[i].data.id);
			    sn_name=selectRecords[i].data.snName;
			    sn_id=selectRecords[i].data.id;
			    
			}
			if (ids.length > 1) {
				Ext.ux.Toast.msg("信息", "编号方式只能选择一种！");
				return;
			} else {
				new FlowSnConfigOrderForm({
							flowId : flowId,
							snon:sn_name,
							snid:sn_id
						}).show();
			}

		} else {
			Ext.ux.Toast.msg("信息提示", "请选择相应的流程！");
		}
	},
	// 把选中ID删除
	removeSelRs : function(ids, flowId) {
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url : __ctxPath + '/snconfig/multiDelFlowSnConfig.do',
					params : {
						ids : ids,
						flowId : flowId
					},
					method : 'POST',
					success : function(response, options) {
						Ext.ux.Toast.msg('操作信息', '成功删除编号！');
						Ext.Ajax.request({
									url : __ctxPath
											+ '/snconfig/getCheckSignsFlowSnConfig.do',
									params : {
										flowId : flowId
									},
									method : 'post',
									success : function(res, opt) {
										var data = Ext.util.JSON
												.decode(res.responseText);
										var gridPanel = Ext
												.getCmp('FlowSnConfigGrid');
										gridPanel.getStore().loadData(data);
									}
								});
					},
					failure : function(response, options) {
						Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
					}
				});
			}
		});// end of comfirm

	},
	/**
	 * 删除多条记录
	 */
	delRecords : function() {
		var flowId = Ext.getCmp("flowId").getValue();
		var parentFlowId = Ext.getCmp("parentFlowId").getValue();
		if (null != flowId && flowId != "" && flowId != '0'
				&& parentFlowId != '0') {
			var gridPanel = Ext.getCmp('FlowSnConfigGrid');
			var selectRecords = gridPanel.getSelectionModel().getSelections();
			if (selectRecords.length == 0) {
				Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
				return;
			}
			var ids = Array();
			for (var i = 0; i < selectRecords.length; i++) {
				ids.push(selectRecords[i].data.id);
			}
			this.removeSelRs(ids, flowId);
		} else {
			Ext.ux.Toast.msg("信息提示", "请选择相应的流程！");
		}
	}
});
