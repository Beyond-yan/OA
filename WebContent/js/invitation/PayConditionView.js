Ext.ns('PayConditionView');

var PayConditionView = function() {
	return this.setup();
};
/**
 * 建立视图
 */
PayConditionView.prototype.setup = function() {
	return this.grid();
};



/**
 * 建立DataGrid
 */
PayConditionView.prototype.grid = function() {

//	function formatDate(value){
//		alert(value)
//	    return value ? new Date(value).dateFormat('Y-m-d') : '';
//	}
	
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
				columns : [sm, new Ext.grid.RowNumberer(), {
							header : 'conditionId',
							dataIndex : 'conditionId',
							hidden : true
						}, {
							header : '付款期数',
							width : 90,
							dataIndex : 'payPeriods',
							editor : new Ext.form.NumberField({
										allowBlank : false
									})
						}, {
							header : '付款时间',
							width : 90,
							dataIndex : 'payTime',
							renderer: Ext.util.Format.dateRenderer('m/d/Y'),
							editor : new Ext.form.DateField({
								allowBlank : false
							})
						},{
							header : '付款条件',
							width : 90,
							dataIndex : 'payConditon',
							editor : new Ext.form.TextField({
										allowBlank : false
									})
						},{
							header : '付款金额',
							width : 90,
							dataIndex : 'payMoney',
							editor : new Ext.form.TextField({
										allowBlank : false
									})
						}, {
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
				id : 'PayConditionGrid',
				tbar : this.topbar(),
				store : store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				autoScroll:true,
				width :800,/*350*/
				height : 120,
				clicksToEdit : 1,
				stripeRows : true,
				cm : cm,
				sm : sm,
				viewConfig : {
					forceFit : true,
					enableRowBody : false,
					showPreview : false
				}
			});
	return grid;

};

/**
 * 初始化数据
 */
PayConditionView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/invitation/listPayCondition.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'conditionId',
										type : 'int'
									}
									,{name: 'payTime', type: 'date', dateFormat:'m/d/Y'},
									'payPeriods', 'payConditon', 'payMoney','remarks']
						}),
				remoteSort : false //20121109 xt
			});
	store.setDefaultSort('conditionId', 'asc'); //20121115
	return store;
};

/**
 * 建立操作的Toolbar
 */
PayConditionView.prototype.topbar = function() {

	var toolbar = new Ext.Toolbar({
		id : 'PayConditionFootBar',
		height : 28,
		bodyStyle : 'text-align:left',
		items : [{
					iconCls : 'btn-add',
					text : '添加付款条件',
					xtype : 'button',
					handler : function() {
						var grid = Ext.getCmp('PayConditionGrid');
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
					text : '删除付款条件',
					xtype : 'button',
					handler : function() {

						var grid = Ext.getCmp("PayConditionGrid");
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
									var conditionId = selectRecords[i].data.conditionId;
									if (conditionId == '' || conditionId == -1
											|| conditionId == undefined
											|| conditionId == null) {
										store.remove(selectRecords[i], true);
									} else {
										ids.push(conditionId);
										store.remove(selectRecords[i], true);
									}
								}
								
								if (ids.length > 0) {
									Ext.Ajax.request({
										url : __ctxPath
												+ '/invitation/multiDelPayCondition.do',
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
PayConditionView.remove = function(id, conditionId) {
	var grid = Ext.getCmp("PayConditionGrid");
	var store = grid.getStore();
	Ext.Msg.confirm('信息确认', '确定要删除该记录么？', function(btn) {
				if (btn == 'yes') {
					if (conditionId == '' || conditionId == -1
							|| conditionId == undefined || conditionId == null) {
						store.remove(id);
						grid.getView().refresh();
					} else {
						Ext.Ajax.request({
									url : __ctxPath
											+ '/invitation/multiDelPayCondition.do',
									params : {
										ids : conditionId
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
