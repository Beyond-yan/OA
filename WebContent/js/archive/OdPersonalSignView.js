/**
 * @author:Ropen
 * @class OdPersonalSignView
 * @extends Ext.Panel
 * @description [OdPersonalSign]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
OdPersonalSignView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		OdPersonalSignView.superclass.constructor.call(this, {
					id : 'OdPersonalSignView',
					title : '个性签名管理',
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
												fieldLabel : '个性签名标题',
												name : 'Q_signTitle_S_LK',
												flex : 1,
												xtype : 'textfield'
											}]
								}, {
									columnWidth : 0.33,
									layout : 'form',
									items : [{
												fieldLabel : '个性签名人',
												name : 'Q_appUser.fullname_S_LK',
												flex : 1,
												xtype : 'textfield'
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
						text : '添加个性签名',
						xtype : 'button',
						scope : this,
						handler : this.createRs
					}, {
						iconCls : 'btn-del',
						text : '删除个性签名',
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
			id : 'OdPersonalSignGrid',
			url : __ctxPath + "/archive/listOdPersonalSign.do",
			fields : [{
						name : 'id',
						type : 'int'
					}, 'signTitle', 'signDesc', 'appUser.userId',
					'appUser.fullname', 'fileAttach',
					'createDate', 'createBy',
					'updateDate', 'updateBy'],
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '个性签名标题',
						dataIndex : 'signTitle'
					}, {
						header : '个性签名描述',
						dataIndex : 'signDesc'
					}, {
						header : '个性签名人',
						dataIndex : 'appUser.fullname'
					}, {
						header : '个性签名档案',
						dataIndex : 'fileAttach',
						renderer : function(fileAttach) {
							if (fileAttach==null) {
								return '无附件';
							} else {
								var attachFileId = fileAttach.fileId;
								var str = '';
									str += '<a href="#" onclick="FileAttachDetail.show('
											+ attachFileId
											+ ');" class="attachment">'
											+ fileAttach.fileName + '</a>';
								return str;
							}
						}
					},
					{
						header : '创建日期',
						dataIndex : 'createDate'
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
					new OdPersonalSignForm({
								id : rec.data.id
							}).show();
				});
	},
	// 创建记录
	createRs : function() {
		new OdPersonalSignForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/archive/multiDelOdPersonalSign.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs({
					url : __ctxPath + '/archive/multiDelOdPersonalSign.do',
					grid : this.gridPanel,
					idName : 'id'
				});
	},
	// 编辑Rs
	editRs : function(record) {
		new OdPersonalSignForm({
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
