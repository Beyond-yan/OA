Ext.ns('InvitationView');
/**
 * @author:
 * @class InvitationView
 * @extends Ext.Panel
 * @description 标案列表
 */

InvitationView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	searchPanel : null,
	// 数据展示Panel
	gridPanel : null,
	// GridPanel的数据Store
	store : null,
	// 头部工具栏
	topbar : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		InvitationView.superclass.constructor.call(this, {
					id : 'InvitationView',
					title : '标案管理',
					iconCls : 'menu-Invitation',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			id : 'InvitationSearchForm',
			height : 35,
			region : 'north',
			frame : false,
			border : false,
			layout : 'hbox',
			layoutConfig : {
				padding : '5',
				align : 'middle'
			},
			defaults : {
				style : 'padding:0px 5px 0px 5px;',
				border : false,
				anchor : '98%,98%',
				labelWidth : 75,
				xtype : 'label'
			},
			items : [{
						text : '查询条件:'
					}, {
						text : '标案主题'
					}, {
						xtype : 'textfield',
						width : 80,
						name : 'Q_theme_S_LK'
					}, {
						text : '标案类别'
					}, {
						xtype : 'textfield',
						width : 80,
						name : 'Q_invitationType_S_LK'
					}, {
						text : '合同经办人'
					}, {
						xtype : 'textfield',
						width : 80,
						name : 'Q_draftsman_S_LK'
					}, {
						text : '中标供应商'
					}, {
						xtype : 'textfield',
						width : 80,
						name : 'Q_supplier_S_LK'
					},{
						text : '标案状态'
					}, {
						xtype : 'textfield',
						width : 80,
						name : 'Q_invitationStatus_S_LK'
					},{
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext.getCmp('InvitationSearchForm');
							var gridPanel = Ext.getCmp('InvitationGrid');
							if (searchPanel.getForm().isValid()) {
								$search({
									searchPanel :searchPanel,
									gridPanel : gridPanel
								});
							}

						}
					}]
		});//end of the searchPanel
		
		this.store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/invitation/listInvitation.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'invitationId',
										type : 'int'
									}

									, 'invitationNo', 'theme',
									'invitationType', 'draftsman','supplier',
									'invitationStatus']
						}),
				remoteSort : true
			});//end of the store
	this.store.setDefaultSort('invitationId', 'desc');
	this.store.load({
		params : {
			start : 0,
			limit : 25
		}
	});

	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer(), {
					header : 'invitationId',
					dataIndex : 'invitationId',
					hidden : true
				}, {
					header : '标案编号',
					dataIndex : 'invitationNo'
				}, {
					header : '标案主题',
					dataIndex : 'theme'
//					renderer : function(value, metadata, record, rowIndex,
//							colIndex) {
//						metadata.attr='ext:qtitle="" ext:qtip="'+value+'" style="cursor:pointer;"';
//						return value;
//					}
				}, {
					header : '标案类别',
					dataIndex : 'invitationType'
				}, {
					header : '合同经办人',
					dataIndex : 'draftsman'
				}, {
					header : '中标供应商',
					dataIndex : 'supplier'
				}, {
					header : '标案状态',
					dataIndex : 'invitationStatus'
				}, {
					header : '管理',
					dataIndex : 'invitationId',
					width : 50,
					sortable : false,
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var editId = record.data.invitationId;
						var str = '';
							str = '<button title="删除" value=" " class="btn-del" onclick="InvitationView.remove('
									+ editId + ')">&nbsp</button>';
							str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="InvitationView.edit('
									+ editId + ')">&nbsp</button>';
						return str;
					}
				}],
		defaults : {
			sortable : true,
			menuDisabled : false,
			width : 100
		}
	});//end of the cm
	this.topbar = new Ext.Toolbar({
				id : 'InvitationFootBar',
				height : 30,
				bodyStyle : 'text-align:left',
				items : []
			});
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '添加标案',
					handler : function() { 
						new InvitationForm().show();
					}
				}));
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除标案',
					handler : function() {

						var grid = Ext.getCmp("InvitationGrid");

						var selectRecords = grid.getSelectionModel()
								.getSelections();

						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.invitationId);
						}

						InvitationView.remove(ids);
					}
				}));//end of the topbar
	
	this.gridPanel = new Ext.grid.GridPanel({
				id : 'InvitationGrid',
				tbar : this.topbar,
				region : 'center',
				store : this.store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				autoHeight : true,
				cm : cm,
				sm : sm,
				viewConfig : {
					forceFit : true,
					enableRowBody : false,
					showPreview : false
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 25,
							store : this.store,
							displayInfo : true,
							displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
							emptyMsg : "当前没有记录"
						})
			});

//	this.gridPanel.addListener('cellclick', function(grid, rowIndex, columnIndex, e) {
//	    var record = grid.getStore().getAt(rowIndex);  // 返回Record对象 Get the Record
//        if(columnIndex == 4)//先alert一下就知道了
//        {
//	     var fieldName = grid.getColumnModel().getDataIndex(columnIndex); // 返回字段名称 Get field name
//	     var data = record.get(fieldName);
//	     alert(data);
//        }
//	 });/**/
	
	this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
							if (isGranted('_InvitationEdit')) {
								InvitationView.edit(rec.data.invitationId);
							}
						});
			});
	}//end of the initUIComponents
});
/**
 * 删除单个记录
 */
InvitationView.remove = function(id) {
	var grid = Ext.getCmp("InvitationGrid");
	Ext.Msg.confirm('信息确认', '删除标案，则标案下的<font color="red">附件</font>也删除，您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath
										+ '/invitation/multiDelInvitation.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
									grid.getStore().reload({
												params : {
													start : 0,
													limit : 25
												}
											});
								}
							});
				}
			});
};

/**
 * 
 */
InvitationView.edit = function(id) {
	new InvitationForm({
		invitationId : id
	}).show();
}
