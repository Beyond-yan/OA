Ext.ns('CarCostSelectByCarAndTimeView');

CarCostSelectByCarAndTimeView = Ext.extend(Ext.Panel, {
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
		CarCostSelectByCarAndTimeView.superclass.constructor.call(this, {
					id : 'CarCostSelectByCarAndTimeView',
					title : '按车辆和时间分',
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
			id : 'carCostSelectByCarAndTimeSearchForm',
			layout : 'form',
			region : 'north',
			width : '100%',
			colNums : 2,
			items : [

			{
						fieldLabel : '开始时间',
						xtype : 'datetimefield',
						name : 'startDate',
						id : 'byCarAndTimeStartDate',
						format : 'Y-m-d',
						width : '20%',
						flex : 1,
						border : false
					},

					{
						fieldLabel : '结束时间',
						xtype : 'datetimefield',
						name : 'endDate',
						id : 'byCarAndTimeEndDate',
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
							.getCmp('carCostSelectByCarAndTimeSearchForm');
					var gridPanel = Ext.getCmp('carCostSelectByCarAndTimeGrid');
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
					Ext.getCmp('carCostSelectByCarAndTimeSearchForm').getForm()
							.reset();

				}
			}]

		});

		var store = new Ext.data.JsonStore({
					url : __ctxPath + '/admin/listByCarAndTimeCarCostRecord.do',
					params : {
						start : 0,
						limit : 10
					},
					root : 'result',
					totalProperty : 'totalCounts',
					fields : ['typeName', 'totalAmt', 'costDate', 'itemQty']
				});

		store.load({
					params : {
						start : 0,
						limit : 10
					}
				});
				
		store.proxy.getConnection().on('requestcomplete',function(conn,resp,opt){
			if(opt.url.indexOf('listByCarAndTimeCarCostRecord.do')!=-1){
				var totalAmtSum = eval("("+resp.responseText+")").totalAmtSum;
				Ext.getCmp('totalAmtSumCT_display').setText("总金额总计："+totalAmtSum);
			}			
		});

		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [new Ext.grid.RowNumberer({
										header : '序号',
										width : 35
									}),  {
								header : '车牌号',
								dataIndex : 'typeName'
							}, {
								header : '时间',
								// id : 'timeByCarAndTime',
								dataIndex : 'costDate',
								renderer : function(v) {
									if (v == null) {
										return null;
									} else {
										return new Date(v).format('Y-m-d');
									}
								}
							},{
								header : '记录条数',
								dataIndex : 'itemQty',
								hidden:true
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
					id : 'carCostSelectByCarAndTimeGrid',
					region : 'center',
					store : store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
				/*	listeners:{'afterrender':function(g){
					
						//alert(g.getStore().data.items);
						g.getStore().each(function(record){
							alert(record);
						},this)
					}},*/
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 10,
								store : store,
									items:[{
									xtype:'label',
									id:'totalAmtSumCT_display',
									style:'margin-left:500px;',
									text:''
								}],
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});// end of the gridPaenl
	}// end of the initUIComponents

});
