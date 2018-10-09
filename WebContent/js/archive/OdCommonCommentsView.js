/**
 * @author:Ropen
 * @class OdCommoncommentsView
 * @extends Ext.Panel
 * @description 常用批示语管理（添加批示语类别）
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
OdCommonCommentsView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		OdCommonCommentsView.superclass.constructor.call(this, {
					id : 'OdCommonCommentsView',
					title : '常用批示语管理',
					iconCls :'menu-archive-sign',
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
							columnWidth : 0.25,
							layout : 'form',
							items : [{
										fieldLabel : '批示内容',
										name : 'Q_commentTitle_S_LK',
										flex : 1,
										xtype : 'textfield',
										width : 130
									}]
						}, {
							columnWidth : 0.25,
							layout : 'form',
							items : [{
										xtype : 'radiogroup',
										fieldLabel : '批示语类型',
										items : [{
													boxLabel : '通用',
													name : 'Q_commentType_SN_EQ',
													inputValue : 1
												}, {
													boxLabel : '个人',
													name : 'Q_commentType_SN_EQ',
													inputValue : 0
												}]
									}]
						}, {
							columnWidth : 0.25,
							layout : 'form',
							items : [{
										xtype : 'radiogroup',
										fieldLabel : '批示语类别',
										items : [{
													boxLabel : '发文',
													name : 'Q_ref1_S_EQ',
													inputValue : 0
												},{
													boxLabel : '收文',
													name : 'Q_ref1_S_EQ',
													inputValue : 1
												}, {
													boxLabel : '会议',
													name : 'Q_ref1_S_EQ',
													inputValue : 2
												}, {
													boxLabel : '退文',
													name : 'Q_ref1_S_EQ',
													inputValue : 3
												}]
									}]
						}, {
							columnWidth : 0.25,
							layout : 'form',
							items : [{
										fieldLabel : '批示人',
										name : 'Q_appUser.fullname_S_LK',
										flex : 1,
										xtype : 'textfield',
										width : 130
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
								text : '添加常用批示语',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							}, {
								iconCls : 'btn-del',
								text : '删除常用批示语',
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
			id : 'OdCommonCommentsGrid',
			url : __ctxPath + "/archive/listOdCommonComments.do",
			fields : [{
						name : 'id',
						type : 'int'
					}, 'commentTitle', 'commentDesc', 'commentType','appUser','ref1',
					'createDate', 'createBy', 'updateDate', 'updateBy'],
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '批示内容',
						dataIndex : 'commentTitle'
					}, {
						header : '批示描述',
						dataIndex : 'commentDesc'
					}, {
						header : '批示类型',
						dataIndex : 'commentType',
						renderer : function(value) {
							if (value == '1') {
								return "<span>通用</span>";
							} else {
								return "<span>个人</span>";
							}
						}

					}, {
						header : '批示类别',
						dataIndex : 'ref1',
						renderer : function(value) {
							if (value == '2') {
								return "<span>会议</span>";
							}else if (value == '3') {
								return "<span>退文</span>";
							}else if (value == '1') {
								return "<span>收文</span>";
							}else if(value == '0') {
								return "<span>发文</span>";
							}else {
								return "<span>所有</span>";
							}
						}
					}, {
						header : '批示人',
						dataIndex : 'appUser',
						renderer:function(appUser){
							if(appUser!=null){
								return appUser.fullname;
							}
						}
					}, {
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
					new OdCommonCommentsForm({
								id : rec.data.id
							}).show();
				});
	},
	// 创建记录
	createRs : function() {
		new OdCommonCommentsForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/archive/multiDelOdCommonComments.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs({
					url : __ctxPath + '/archive/multiDelOdCommonComments.do',
					grid : this.gridPanel,
					idName : 'id'
				});
	},
	// 编辑Rs
	editRs : function(record) {
		new OdCommonCommentsForm({
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
