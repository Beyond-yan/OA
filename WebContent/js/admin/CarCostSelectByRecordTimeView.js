Ext.ns('CarCostSelectByRecordTimeView');

CarCostSelectByRecordTimeView = Ext.extend(Ext.Panel, {
	searchPanel : null,
	// 数据展示Panel
	gridPanel : null,

	topbar : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		CarCostSelectByRecordTimeView.superclass.constructor.call(this, {
					id : 'CarCostSelectByRecordTimeView',
					title : '按时间分',
					layout : 'border',
					iconCls : 'menu-appuser',
					autoScroll : true,
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {

		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
			id : 'carCostSelectByRecordTimeSearchForm',
			layout : 'column',
			region : 'north',
			width : '100%',
			// colNums : 5,
			items : [{
						boxLabel : '按天统计',
						xtype : 'radio',
						name : 'sele',
						id : 'selectD',
						style : 'margin-left:50px;',
						checked : true,
						listeners : {
							'focus' : function() {							
									Ext.getCmp('select').setValue('D');
							}
						}
					}, {
						boxLabel : '按月统计',
						xtype : 'radio',
						id : 'selectM',
						name : 'sele',
						style : 'margin-left:50px;',
						listeners : {
							'focus' : function() {						
									Ext.getCmp('select').setValue('M');
							}
						}
					}, {
						boxLabel : '按年统计',
						xtype : 'radio',
						name : 'sele',
						id : 'selectY',
						style : 'margin-left:50px;',
						listeners : {
							'focus' : function() {								
									Ext.getCmp('select').setValue('Y');
							}
						}
					}, {
						xtype : 'textfield',
						id : 'select',
						name:'select',
						value : 'D',
						hidden : true
					}, {
						xtype : 'label',
						text : '开始时间:',
						style : 'margin-left:50px;margin-top:5px;'
					}, {

						xtype : 'datetimefield',
						name : 'startDate',
						id : 'byRecordTimeStartDate',
						format : 'Y-m-d',
						width : '20%',
						flex : 1,
						border : false
					},

					{
						xtype : 'label',
						text : '结束时间:',
						style : 'margin-left:10px;margin-top:5px;'
					}, {

						xtype : 'datetimefield',
						name : 'endDate',
						id : 'byRecordTimeEndDate',
						flex : 1,
						format : 'Y-m-d',
						width : '20%',
						border : false

					}

			],
			buttons : [{
				iconCls : 'search',
				text : '查询',
				handler : function() {
					var searchPanel = Ext
							.getCmp('carCostSelectByRecordTimeSearchForm');
					var gridPanel = Ext.getCmp('carCostSelectByRecordTimeGrid');
					if (searchPanel.getForm().isValid()) {
						$search({
									searchPanel : searchPanel,
									gridPanel : gridPanel
								});
					}

				}
			}, {
				iconCls : 'btn-reset',
				text : '重置',
				handler : function() {
					Ext.getCmp('carCostSelectByRecordTimeSearchForm').getForm()
							.reset();
							Ext.getCmp('select').setValue('D');
				}
			}]

		});

		var store = new Ext.data.JsonStore({
					url : __ctxPath + '/admin/listByCostDateCarCostRecord.do',
					root : 'result',
					fields : ['totalAmt', 'costComment', 'itemQty']
				});

		store.load({
					params : {
						start : 0,
						limit : 10,
						select:Ext.getCmp('select').getValue()
					}
				});

		store.proxy.getConnection().on('requestcomplete',
				function(conn, resp, opt) {
					if (opt.url.indexOf('listByCostDateCarCostRecord.do') != -1) {
						var totalAmtSum = eval("(" + resp.responseText + ")").totalAmtSum;
						Ext.getCmp('totalAmtSumRT_display').setText("总金额总计："
								+ totalAmtSum);
					}
				});
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [new Ext.grid.RowNumberer({
										header : '序号',
										width : 35
									}), {
								header : '时间',
								dataIndex : 'costComment'
							}, {
								header : '记录条数',
								dataIndex : 'itemQty'
							}, {
								header : '总金额',
								dataIndex : 'totalAmt'
							}],
					defaults : {
						sortable : true,
						menuDisabled : false,
						width : 100
					}
				});
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'carCostSelectByRecordTimeGrid',
					region : 'center',
					store : store,
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
								pageSize : 10,
								store : store,
								items : [{
											xtype : 'label',
											id : 'totalAmtSumRT_display',
											style : 'margin-left:200px;',
											text : ''
										}],
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});// end of the gridPaenl
	}// end of the initUIComponents

});
