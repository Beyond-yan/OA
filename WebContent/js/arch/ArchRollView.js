/**
 * @author:
 * @class ArchRollView
 * @extends Ext.Panel
 * @description 案卷管理
 * @company 广州宏天软件有限公司
 * @createtime:
 */
ArchRollView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ArchRollView.superclass.constructor.call(this, {
					id : 'ArchRollView',
					title : '案卷管理',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.leftPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
					layout : 'form',
					region : 'north',
					id : 'ArchRollSearchPanel',
					colNums : 4,
					items : [

					{
								fieldLabel : '全宗号',
								name : 'Q_archFond.afNo_S_LK',
								flex : 1,
								xtype : 'combo',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : new Ext.data.JsonStore({
											url : __ctxPath
													+ "/arch/listArchFond.do",
											autoLoad : true,
											autoShow : true,
											// reader configs
											root : 'result',

											fields : ['afNo', 'afNo']
										}),
								valueField : 'afNo',
								displayField : 'afNo'

							}, {
								fieldLabel : '案卷号',
								name : 'Q_rollNo_S_LK',
								flex : 1,
								xtype : 'textfield'
							}

							, {
								fieldLabel : '案卷名称',
								name : 'Q_rolllName_S_LK',
								flex : 1,
								xtype : 'textfield'
							}

							, {
								fieldLabel : '目录号',
								name : 'Q_catNo_S_LK',
								flex : 1,
								xtype : 'textfield'
							}, {
								fieldLabel : '保管期限',
								name : 'Q_timeLimit_S_LK',
								editable : true,
								lazyInit : false,
								forceSelection : false,
								xtype : 'diccombo',
								editable:false,
								itemName : '案卷保管期限'
							},

							// {
							// fieldLabel : '起始日期',
							// name : 'Q_startTime_D_EQ',
							// flex : 1,
							// xtype : 'datefield',
							// format : 'Y-m-d'
							// }, {
							// fieldLabel : '结束日期',
							// name : 'Q_endTime_D_EQ',
							// flex : 1,
							// xtype : 'datefield',
							// format : 'Y-m-d'
							// },

							{
								fieldLabel : '开放形式',
								name : 'Q_openStyle_S_LK',
								flex : 1,
								editable : true,
								lazyInit : false,
								forceSelection : false,
								xtype : 'diccombo',
								itemName : '案卷开放形式'
							}

							// ,{
							// fieldLabel : '立卷人',
							// name : 'Q_author_S_EQ',
							// flex : 1,
							// xtype : 'textfield'
							// }, {
							// fieldLabel : '立卷时间',
							// name : 'Q_setupTime_D_EQ',
							// flex : 1,
							// xtype : 'datefield',
							// format : 'Y-m-d'
							// }, {
							// fieldLabel : '检查人',
							// name : 'Q_checker_S_EQ',
							// flex : 1,
							// xtype : 'textfield'
							// }, {
							// fieldLabel : '录入人',
							// name : 'Q_creator_S_EQ',
							// flex : 1,
							// xtype : 'textfield'
							// }, {
							// fieldLabel : '录入时间',
							// name : 'Q_createtime_D_EQ',
							// flex : 1,
							// xtype : 'datefield',
							// format : 'Y-m-d'
							// }, {
							// fieldLabel : '主题词',
							// name : 'Q_keywords_S_EQ',
							// flex : 1,
							// xtype : 'textfield'
							// }, {
							// fieldLabel : '制作单位',
							// name : 'Q_editCompany_S_EQ',
							// flex : 1,
							// xtype : 'textfield'
							// }, {
							// fieldLabel : '制作部门',
							// name : 'Q_editDep_S_EQ',
							// flex : 1,
							// xtype : 'textfield'
							// }, {
							// fieldLabel : '备考说明',
							// name : 'Q_decp_S_EQ',
							// flex : 1,
							// xtype : 'textfield'
							// }

							, {
								fieldLabel : '状态',
								hiddenName : 'Q_status_SN_EQ',
								flex : 1,
								xtype : 'combo',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								editable:false,
								store : [['', '全部'], ['1', '正常'], ['0', '销毁']]
							}

							, {
								fieldLabel : '案卷分类ID',
								id : 'ArchRollView.proTypeId',
								name : 'Q_globalType.proTypeId_L_EQ',
								flex : 1,
								xtype : 'hidden'
							}, {
								fieldLabel : '案卷分类名称',
								id : 'ArchRollView.typeName',
								name : 'Q_typeName_S_LK',
								flex : 1,
								xtype : 'hidden'
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

		this.leftPanel = new Ext.Panel({
			region : 'west',
			layout : 'anchor',
			collapsible : true,
			split : true,
			width : 200,
			items : [

			{
				xtype : 'treePanelEditor',
				id : 'ArchRollGlobalTypeTree',
				split : true,
				rootVisible : false,
				border : false,
				height : 380,
				autoScroll : true,
				scope : this,
				url : __ctxPath + '/system/treeGlobalType.do?catKey=AR_RL',
				onclick : function(node) {

					var proTypeId = node.id;
					var typeName = node.text;

					if (proTypeId == '0') {
						Ext.getCmp('ArchRollSearchPanel').getForm()
								.findField('ArchRollView.proTypeId')
								.setValue('');
						Ext.getCmp('ArchRollSearchPanel').getForm()
								.findField('ArchRollView.typeName')
								.setValue('');

					} else {
						Ext.getCmp('ArchRollSearchPanel').getForm()
								.findField('ArchRollView.proTypeId')
								.setValue(proTypeId);
						Ext.getCmp('ArchRollSearchPanel').getForm()
								.findField('ArchRollView.typeName')
								.setValue(typeName);

					}

					Ext.getCmp('ArchRollView').search();

				},
				contextMenuItems : [{
					text : '新建分类',
					scope : this,
					iconCls : 'btn-add',
					handler : function() {
						var globalTypeTree = Ext
								.getCmp('ArchRollGlobalTypeTree');
						var parentId = globalTypeTree.selectedNode.id;
						var globalTypeForm = new GlobalTypeForm({
									parentId : parentId,
									catKey : 'AR_RL',
									callback : function() {
										Ext.getCmp('ArchRollGlobalTypeTree').root
												.reload();
									}
								});
						globalTypeForm.show();

					}
				}, {
					text : '修改分类',
					scope : this,
					iconCls : 'btn-edit',
					handler : function() {
						var globalTypeTree = Ext
								.getCmp('ArchRollGlobalTypeTree');
						var proTypeId = globalTypeTree.selectedNode.id;

						var globalTypeForm = new GlobalTypeForm({
									proTypeId : proTypeId,
									callback : function() {
										Ext.getCmp('ArchRollGlobalTypeTree').root
												.reload();
									}
								});
						globalTypeForm.show();
					}
				}

				, {

					text : '删除分类',
					scope : this,
					iconCls : 'btn-del',
					handler : function() {
						var globalTypeTree = Ext
								.getCmp('ArchRollGlobalTypeTree');
						var proTypeId = globalTypeTree.selectedNode.id;
						var ids = Array();
						ids.push(proTypeId);
						Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
							if (btn == 'yes') {
								Ext.Ajax.request({
									url : __ctxPath
											+ '/system/multiDelGlobalType.do',
									params : {
										ids : ids,
										pageFlag : 'ArchRoll'
									},
									method : 'POST',
									success : function(response, options) {
										var res = Ext.util.JSON.decode(response.responseText);
										if(res.success==false){
											Ext.ux.Toast.msg('操作信息', res.message);
										}else{
											Ext.ux.Toast.msg('操作信息', '成功删除该分类！');
											Ext.getCmp('ArchRollGlobalTypeTree').root.reload();
											Ext.getCmp('ArchRollGrid').getStore().reload();
										}
									},
									failure : function(response, options) {
										Ext.ux.Toast
												.msg('操作信息', '操作出错，请联系管理员！');
									}
								});
							}
						});

					}

				}

				]
			}]
		}

		);

		this.topbar = new Ext.Toolbar({
					items : [{
								iconCls : 'btn-add',
								text : '添加案卷',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							}, {
								iconCls : 'btn-del',
								text : '删除案卷',
								xtype : 'button',
								scope : this,
								handler : this.removeSelRs
							}]
				});

		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ArchRollGrid',
			url : __ctxPath + "/arch/listArchRoll.do",
			fields : [{
						name : 'rollId',
						type : 'int'
					}, 'createTime', 'updateTime', 'creatorName', 'creatorId',
					'status', 'proTypeId', 'typeName', 'openStyle', 'archFond',
					'rolllName', 'rollNo', 'catNo', 'timeLimit', 'startTime',
					'endTime', 'author', 'setupTime', 'checker', 'keyWords',
					'editCompany', 'editDep', 'decp'],
			columns : [{
						header : 'rollId',
						dataIndex : 'rollId',
						hidden : true
					}

					// , {
					// header : '案卷分类ID',
					// dataIndex : 'proTypeId'
					// }
					// , {
					// header : '全宗ID',
					// dataIndex : 'archFond',
					// renderer:function(v){
					//							
					// return v.archFondId;
					// }
					// }

					, {
						header : '全宗号',
						dataIndex : 'archFond',
						renderer : function(v) {
							if(v)
							return v.afNo;
						}
					}, {
						header : '案卷号',
						dataIndex : 'rollNo'
					},

					{
						header : '案卷名称',
						dataIndex : 'rolllName'
					}, {
						header : '案卷分类',
						dataIndex : 'typeName'
					}

					, {
						header : '目录号',
						dataIndex : 'catNo'
					}, {
						header : '保管期限',
						dataIndex : 'timeLimit'
					}, {
						header : '开放形式',
						dataIndex : 'openStyle'
					}

					//					
					//
					// , {
					// header : '起始日期',
					// dataIndex : 'startTime'
					// }, {
					// header : '结束日期',
					// dataIndex : 'endTime'
					// }, {
					// header : '开放形式',
					// dataIndex : 'openStyle'
					// }, {
					// header : '立卷人',
					// dataIndex : 'author'
					// }, {
					// header : '立卷时间',
					// dataIndex : 'setupTime'
					// }, {
					// header : '检查人',
					// dataIndex : 'checker'
					// }, {
					// header : '录入人',
					// dataIndex : 'creatorName'
					// }, {
					// header : '录入时间',
					// dataIndex : 'createTime'
					// }, {
					// header : '主题词',
					// dataIndex : 'keyWords'
					// }, {
					// header : '制作单位',
					// dataIndex : 'editCompany'
					// }, {
					// header : '制作部门',
					// dataIndex : 'editDep'
					// }, {
					// header : '备考表',
					// dataIndex : 'decp'
					// }

					, {
						header : '状态',
						dataIndex : 'status',
						renderer : function(v) {
							switch (v) {
								case 1 :
									return '正常';
									break;
								case 0 :
									return '销毁';
									break;
							}

						}
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
				// end of columns
			});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

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
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
					new ArchRollForm({
								rollId : rec.data.rollId
							}).show();
				});
	},
	// 创建记录
	createRs : function() {
		new ArchRollForm({
					proTypeId : Ext.getCmp('ArchRollSearchPanel').getForm()
							.findField('ArchRollView.proTypeId').getValue(),
					typeName : Ext.getCmp('ArchRollSearchPanel').getForm()
							.findField('ArchRollView.typeName').getValue()
				}).show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/arch/multiDelArchRoll.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs({
					url : __ctxPath + '/arch/multiDelArchRoll.do',
					grid : this.gridPanel,
					idName : 'rollId'
				});
	},
	// 编辑Rs
	editRs : function(record) {
		new ArchRollForm({
					rollId : record.data.rollId
				}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-del' :
				this.removeRs.call(this, record.data.rollId);
				break;
			case 'btn-edit' :
				this.editRs.call(this, record);
				break;
			default :
				break;
		}
	}
});
