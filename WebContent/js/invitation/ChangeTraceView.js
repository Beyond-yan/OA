Ext.ns('ChangeTraceView');

var ChangeTraceView = function() {
	return this.setup();
};
/**
 * 建立视图
 */
ChangeTraceView.prototype.setup = function() {
	return this.grid();
};
/**
 * 建立DataGrid
 */
ChangeTraceView.prototype.grid = function() {
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
				columns : [sm, new Ext.grid.RowNumberer(), {
							header : 'changeId',
							dataIndex : 'changeId',
							hidden : true
						}, {
							header : '合同是否已签订',
							width : 100,
							dataIndex : 'isSign',
							editor : new Ext.form.ComboBox ({
										allowBlank : false,
										editable : false,
										forceSelection : true,
										store :  ['否','是']
//										listeners : {
//											select : function(cbo) {
//												Ext.getCmp('isSign').setValue(cbo.getValue());
//											}
//										}					
									})
						}, {
							header : '发起时间',
							width : 90,
							dataIndex : 'launchTime',
							renderer: Ext.util.Format.dateRenderer('m/d/Y'),
							editor : new Ext.form.DateField({
								allowBlank : false
							})
						},{
							header : '核准时间',
							width : 90,
							dataIndex : 'checkTime',
							renderer: Ext.util.Format.dateRenderer('m/d/Y'),
							editor : new Ext.form.DateField({
								allowBlank : false
							})
						},{
							header : '变更内容说明',
							width : 90,
							dataIndex : 'content',
							editor : new Ext.form.TextField({
										allowBlank : false
									})
						},{
							header : '备注',
							width : 90,
							dataIndex : 'remarks',
							editor : new Ext.form.TextField({})
						}],
				defaults : {
					sortable : true,
					menuDisabled : false,
					width : 100
				}
			});

	var store = this.store();// 这里不load数据

	var editor = new Ext.ux.grid.RowEditor({
				saveText : 'Update'
			});
	var grid = new Ext.grid.EditorGridPanel({
				id : 'ChangeTraceGrid',
				tbar : this.topbar(),
				store : store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				width : 800,/*350*/
				height : 120,
				autoScroll:true,
				clicksToEdit : 1,
				stripeRows : true,
				cm : cm,
				sm : sm,
				viewConfig : {
					forceFit : true,
					enableRowBody : false,
					showPreview : false,
					getRowClass : function(record, rowIndex, rowParams, store) {
						if (record.data.isSign == '否') {
							return 'x-grid-record-no';
						} else {
							return 'x-grid-record-yes';
						}
					}
				}
			});
	return grid;

};

/**
 * 初始化数据
 */
ChangeTraceView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/invitation/listChangeTrace.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'changeId',
										type : 'int'
									}
							,{name: 'launchTime', type: 'date', dateFormat:'m/d/Y'},
							{name: 'checkTime', type: 'date', dateFormat:'m/d/Y'},
									'content', 'isSign','remarks']
						}),
				remoteSort : false //20121115
			});
	store.setDefaultSort('isSign', 'asc');
	return store;
};

/**
 * 建立操作的Toolbar
 */
ChangeTraceView.prototype.topbar = function() {

	var toolbar = new Ext.Toolbar({
		id : 'ChangeTraceFootBar',
		height : 28,
		bodyStyle : 'text-align:left',
		items : [{
					iconCls : 'btn-add',
					text : '添加变更记录',
					xtype : 'button',
					handler : function() {
						var grid = Ext.getCmp('ChangeTraceGrid');
						var store = grid.getStore();
						var Plant = grid.getStore().recordType;
						var p = new Plant();
						grid.stopEditing();
						store.insert(store.getCount(), p);
						store.sort();
						grid.getView().refresh();
						grid.startEditing(0, 0);
					}
				}, {
					iconCls : 'btn-del',
					text : '删除变更记录',
					xtype : 'button',
					handler : function() {

						var grid = Ext.getCmp("ChangeTraceGrid");
						grid.stopEditing();
						var selectRecords = grid.getSelectionModel()
								.getSelections();
						var store = grid.getStore();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						Ext.Msg.confirm('信息确认', '确定要删除该记录么？', function(btn) {
							if (btn == 'yes') {
								var ids = Array();
								for (var i = 0; i < selectRecords.length; i++) {
									var changeId = selectRecords[i].data.changeId;
									if (changeId == '' || changeId == -1
											|| changeId == undefined
											|| changeId == null) {
										store.remove(selectRecords[i], true);
									} else {
										ids.push(changeId);
										store.remove(selectRecords[i], true);
									}
								}
								if (ids.length > 0) {
									Ext.Ajax.request({
										url : __ctxPath
												+ '/invitation/multiDelChangeTrace.do',
										params : {
											ids : ids
										},
										method : 'post',
										success : function() {
											Ext.ux.Toast.msg("信息提示",
													"成功删除所选记录！");
										}
									});
								}
								store.sort();
								grid.getView().refresh();
								grid.startEditing(0, 0);
							}
						});
					}
				}]
	});
	return toolbar;
};

/**
 * 删除单个记录
 */
PayConditionView.remove = function(id, changeId) {
	var grid = Ext.getCmp("ChangeTraceGrid");
	var store = grid.getStore();
	Ext.Msg.confirm('信息确认', '确定要删除该记录么？', function(btn) {
				if (btn == 'yes') {
					if (changeId == '' || changeId == -1
							|| changeId == undefined || changeId == null) {
						store.remove(id);
						grid.getView().refresh();
					} else {
						Ext.Ajax.request({
									url : __ctxPath
											+ '/invitation/multiDelChangeTrace.do',
									params : {
										ids : changeId
									},
									method : 'post',
									success : function() {
										Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
										store.remove(id);
										grid.getView().refresh();
									}
								});
					}
				}
			});
};
