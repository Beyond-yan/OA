Ext.ns('ProgressTraceView');
var ProgressTraceView = function() {
	return this.setup();
};
/**
 * 建立视图
 */
ProgressTraceView.prototype.setup = function() {
	return this.grid();
};
/**
 * 建立DataGrid
 */
ProgressTraceView.prototype.grid = function() {
	// 自动计算费用合计
	var ProgressTraceCheckFeeAmount =function() {	
	
		var gridPanel = Ext.getCmp('ProgressTraceGrid');
		if(gridPanel != null) {
			var store = gridPanel.getStore();
			var sumMoney=0;
			for (var i = 0; i < store.getCount(); i++) {
				if(store.getAt(i).get('payMoney') != null) {
					sumMoney+=Number(store.getAt(i).get('payMoney'));
					store.getAt(i).set('sumAmount',sumMoney);
				}
			}
		//	var initsumMoney=Ext.getCmp('invitationContract.alreadyPay').getValue();
		 Ext.getCmp('invitationContract.alreadyPay').setValue(sumMoney);
		// alert(Ext.getCmp('invitationContract.alreadyPay').getValue());
		}
		
	};
	
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
				columns : [sm, new Ext.grid.RowNumberer(), {
							header : 'traceId',
							dataIndex : 'traceId',
							hidden : true
						}, {
							header : '支付期数',
							width : 100,
							dataIndex : 'payPeriods',
							editor : new Ext.form.NumberField({
										allowBlank : false
									})
						}, {
							header : '工作完成状况',
							width : 100,
							dataIndex : 'status',
							editor : new Ext.form.TextField({
										allowBlank : false
									})
						},{
							header : '支付时间',
							width : 100,
							dataIndex : 'payTime',
							renderer: Ext.util.Format.dateRenderer('m/d/Y'),
							editor : new Ext.form.DateField({
								allowBlank : false
							})
						},{
							header : '支付金额',
							width : 100,
							dataIndex : 'payMoney',
							//xtype : 'numberfield',
							editor : new Ext.form.TextField({
										allowBlank : false
										//validator : ProgressTraceView.CheckFeeAmount
									})
						}, {
							header : '预计下次支付时间',
							width : 120,
							dataIndex : 'nextPayTime',
							renderer: Ext.util.Format.dateRenderer('m/d/Y'),
							editor : new Ext.form.DateField({
								allowBlank : false
							})
						},{
							header : '付款金额累计',
							width : 90,
							dataIndex : 'sumAmount'
							//xtype : 'numberfield'
							
						},{
							header : '备注',
							width : 80,
							dataIndex : 'remarks',
							editor : new Ext.form.TextField({})
						}],
				defaults : {
					sortable : true,
					menuDisabled : true,
					width : 100
				}
			});

	var store = this.store();// 这里不load数据

	var editor = new Ext.ux.grid.RowEditor({
				saveText : 'Update'
			});
	var grid = new Ext.grid.EditorGridPanel({
				id : 'ProgressTraceGrid',
				tbar : this.topbar(),
				store : store,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				width :800,/*350*/
				height : 120,
				autoScroll:true,
				clicksToEdit : 1,
				stripeRows : true,
				cm : cm,
				sm : sm,
				viewConfig : {
					forceFit : true,
					enableRowBody : false,
					showPreview : false
				},
			  listeners: {
				"afteredit": function(e) {
					ProgressTraceCheckFeeAmount();
				}
			}
			});
	return grid;

};

/**
 * 初始化数据
 */
ProgressTraceView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/invitation/listProgressTrace.do'
						}),
						
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'traceId',
										type : 'int'
									}
							,{name: 'payTime', type: 'date', dateFormat:'m/d/Y'},
							{name: 'nextPayTime', type: 'date', dateFormat:'m/d/Y'},
                              'payPeriods', 'status', 'payMoney','sumAmount','remarks']

						}),
				remoteSort : false //20121109 xt
			});
	store.setDefaultSort('traceId', 'asc'); //20121115
	return store;
};

/**
 * 建立操作的Toolbar
 */
ProgressTraceView.prototype.topbar = function() {

	var toolbar = new Ext.Toolbar({
		id : 'ProgressTraceFootBar',
		height : 28,
		bodyStyle : 'text-align:left',
		items : [{
					iconCls : 'btn-add',
					text : '添加进度记录',
					xtype : 'button',
					handler : function() {
						var grid = Ext.getCmp('ProgressTraceGrid');
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
					text : '删除进度记录',
					xtype : 'button',
					handler : function() {

						var grid = Ext.getCmp("ProgressTraceGrid");
						grid.stopEditing();
						var selectRecords = grid.getSelectionModel()
								.getSelections();
						var store = grid.getStore();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						Ext.Msg.confirm('信息确认', '确定要删除该进度追踪记录么？', function(btn) {
							if (btn == 'yes') {
								var ids = Array();
								for (var i = 0; i < selectRecords.length; i++) {
									var traceId = selectRecords[i].data.traceId;
									if (traceId == '' || traceId == -1
											|| traceId == undefined
											|| traceId == null) {
										store.remove(selectRecords[i], true);
									} else {
										ids.push(traceId);
										store.remove(selectRecords[i], true);
									}
								}
								if (ids.length > 0) {
									Ext.Ajax.request({
										url : __ctxPath
												+ '/invitation/multiDelProgressTrace.do',
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
ProgressTraceView.remove = function(id, traceId) {
	
	var grid = Ext.getCmp("ProgressTraceGrid");
	var store = grid.getStore();
	Ext.Msg.confirm('信息确认', '确定要删除该记录么？', function(btn) {
				if (btn == 'yes') {
					if (traceId == '' || traceId == -1
							|| traceId == undefined || traceId == null) {
						store.remove(id);
						grid.getView().refresh();
					} else {
						Ext.Ajax.request({
									url : __ctxPath
											+ '/invitation/multiDelProgressTrace.do',
									params : {
										ids : traceId
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

