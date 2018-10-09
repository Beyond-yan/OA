/**
 * @author:Ropen
 * @class OdFlowtypeView
 * @extends Ext.Panel
 * @description [OdFlowtype]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
OdFlowtypeView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		OdFlowtypeView.superclass.constructor.call(this, {
					id : 'OdFlowtypeView',
					title : '公文流程管理',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		
		var dataStatus = [['1', '内发文流程'], ['2', '外发文流程'],
										['3', '外收文流程'],['4', '内收文流程']];
		
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			id : 'odFlowtype.searchPanel',
			region : 'north',
			frame : true,
			items : [{
				layout : 'column',
				items : [{
					columnWidth : 0.33,
					layout : 'form',
					items : [{

								fieldLabel : '公文流程名称',
								name : 'Q_flowName_S_LK',
								flex : 1,
								xtype : 'textfield'
							} ]

				}, {
					columnWidth : 0.33,
					layout : 'form',
					items : [ {
								fieldLabel : '公文流程类型',
								hiddenName : 'Q_flowType_SN_EQ',
								xtype : 'combo',
								emptyText : '请选择',
								mode : 'local',
								valueField : 'flowType',
								displayField : 'flowTypeName',
								editable : false,
								triggerAction : 'all',
								forceSelection : true,
								store :new Ext.data.SimpleStore({
									fields : ['flowType', 'flowTypeName'],
									data : dataStatus
								})
							}]

				},{
					columnWidth : 0.33,
					layout : 'form',
					items : [ {
								xtype : 'radiogroup',
								fieldLabel : '是否自动保存',
								items : [{
											boxLabel : '是',
											name : 'Q_isAutoSave_N_EQ',
											inputValue : 1
										}, {
											boxLabel : '否',
											name : 'Q_isAutoSave_N_EQ',
											inputValue : 0,
											checked : true
										}]
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

		this.topbar = new Ext.Toolbar({
					items : [{
								iconCls : 'btn-add',
								text : '添加公文流程',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							}, {
								iconCls : 'btn-del',
								text : '删除公文流程',
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
			id : 'OdFlowtypeGrid',
			url : __ctxPath + "/archive/listOdFlowtype.do",
			fields : [{
						name : 'id',
						type : 'int'
					}, 'flowName', 'flowDesc', 'flowType',
					'proDefinition.defId', 'proDefinition.name', 'isAutoSave',
					'createDate', 'createBy', 'updateDate', 'updateBy'],
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '公文流程名称',
						dataIndex : 'flowName'
					}, {
						header : '公文流程描述',
						dataIndex : 'flowDesc'
					}, {
						header : '公文流程类型',
						dataIndex : 'flowType',
						renderer : function(value) {
							if (value == '1') {
								return "<span>内发文流程</span>";
							} else if (value == '2') {
								return "<span>外发文流程</span>";
							} else if (value == '3') {
								return "<span>外收文流程</span>";
							} else if (value == '4') {
								return "<span>内收文流程</span>";
							}
						}
					}, {
						header : '流程',
						dataIndex : 'proDefinition.name'
					}, {
						header : '是否自动保存',
						dataIndex : 'isAutoSave',
						renderer : function(value) {
							if (value == '1') {
								return "<span>是</span>";
							} else {
								return "<span>否</span>";
							}
						}
					}, {
						header : '创建日期',
						dataIndex : 'createDate'
					}, {
						header : '创建人',
						dataIndex : 'createBy'
					}, {
						header : '修改日期',
						dataIndex : 'updateDate'
					}, {
						header : '修改人',
						dataIndex : 'updateBy'
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
					new OdFlowtypeForm({
								id : rec.data.id
							}).show();
				});
	},
	// 创建记录
	createRs : function() {
		new OdFlowtypeForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/archive/multiDelOdFlowtype.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs({
					url : __ctxPath + '/archive/multiDelOdFlowtype.do',
					grid : this.gridPanel,
					idName : 'id'
				});
	},
	// 编辑Rs
	editRs : function(record) {
		new OdFlowtypeForm({
					id : record.data.id
				}).show();
	},
	// 行的Action
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
