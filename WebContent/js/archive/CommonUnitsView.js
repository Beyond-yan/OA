/**
 * @author:Ropen
 * @class CommonUnitsView
 * @extends Ext.Panel
 * @description 常用单位管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
CommonUnitsView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		CommonUnitsView.superclass.constructor.call(this, {
					id : 'CommonUnitsView',
					title : '常用单位管理',
					iconCls :'menu-archive-charge',
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
										fieldLabel : '单位名称',
										name : 'Q_unitName_S_LK',
										flex : 1,
										xtype : 'textfield',
										width : 130
									}]
						}, {
							columnWidth : 0.33,
							layout : 'form',
							items : [{
										xtype : 'radiogroup',
										fieldLabel : '单位类型',
										items : [{
													boxLabel : '主送',
													name : 'Q_unitType_SN_EQ',
													inputValue : 1
												}, {
													boxLabel : '抄送',
													name : 'Q_unitType_SN_EQ',
													inputValue : 2
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
								text : '添加常用单位',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							}, {
								iconCls : 'btn-del',
								text : '删除常用单位',
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
			id : 'CommonUnitsGrid',
			url : __ctxPath + "/archive/listCommonUnits.do",
			fields : [{
						name : 'id',
						type : 'int'
					}, 'unitName', 'unitDesc', 'unitType',
					'createDate', 'createBy', 'updateDate', 'updateBy'],
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '单位名称',
						dataIndex : 'unitName'
					}, {
						header : '单位描述',
						dataIndex : 'unitDesc'
					}, {
						header : '单位类型',
						dataIndex : 'unitType',
						renderer : function(value) {
							if (value == '1') {
								return "<span>主送</span>";
							} else {
								return "<span>抄送</span>";
							}
						}

					},{
						header : '创建时间',
						dataIndex : 'createDate'
					},{
						header : '更新时间',
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
					new CommonUnitsForm({
								id : rec.data.id
							}).show();
				});
	},
	// 创建记录
	createRs : function() {
		new CommonUnitsForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/archive/multiDelCommonUnits.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs({
					url : __ctxPath + '/archive/multiDelCommonUnits.do',
					grid : this.gridPanel,
					idName : 'id'
				});
	},
	// 编辑Rs
	editRs : function(record) {
		new CommonUnitsForm({
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
