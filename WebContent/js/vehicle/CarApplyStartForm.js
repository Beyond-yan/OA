CarApplyStartForm = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		CarApplyStartForm.superclass.constructor.call(this, {
					id : 'CarApplyStartFormWin',
					title : '用车申请',
					iconCls : 'menu-car',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				})
	},
	initUIComponents : function() {
		this.searchPanel = new Ext.FormPanel({
			id : 'CarApplyStartForm',
			height : 65,
			frame : false,
			region : 'north',
			layout : 'form',
			bodyStyle : 'padding:5px',
			defaults : {
				border : false
			},
			items : [{
				layout : 'column',
				defaults : {
					border : false
				},
				items : [{
							columnWidth : .20,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										fieldLabel : '车牌号码',
										xtype : 'textfield',
										name : 'carNo'
									}]
						}, {
							columnWidth : .20,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '状态',
								xtype : 'combo',
								hiddenName : 'status',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								value : '',
								store : [['', '全部'], ['2', '使用中'], ['1', '预订'],
										['3', '可用'],
										['4', '维修中'],
										['0', '已报废'],
										['5', '已停用']]
							}]
						}, {
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										width : 40,
										fieldLabel : '开始时间',
										xtype : 'datetimefield',
										format : 'Y-m-d H:i',
										name : 'startTime',
										width : 200,
										editable : false

									}]
						}, {

							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
										width : 40,
										fieldLabel : '结束时间',
										xtype : 'datetimefield',
										format : 'Y-m-d H:i',
										width : 200,
										name : 'endTime',
										editable : false

									}]
						}]
			}, {
				xtype : 'panel',
				border : false,
				layout : 'hbox',
				layoutConfig : {
					pack : 'center',
					align : 'middle'
				},
				items : [{
							xtype : 'button',
							text : '查询',
							iconCls : 'search',
							handler : function() {
								var searchPanel = Ext
										.getCmp('CarApplyStartForm');
								var gridPanel = Ext.getCmp('CarApplyStartGrid');
								if (searchPanel.getForm().isValid()) {
									$search({
												searchPanel : searchPanel,
												gridPanel : gridPanel
											});
								}

							}
						}, {
							xtype : 'button',
							text : '重置',
							style:'padding-left:10px',
							iconCls : 'btn-reset',
							handler : function() {
								var searchPanel = Ext
										.getCmp('CarApplyStartForm');
								searchPanel.getForm().reset();
							}
						}, {
							xtype : 'button',
							style:'padding-left:10px',
							iconCls : 'btn-car',
							text : '用车申请',
							width : 50,
							handler : function() {
								var defId = flowMap.get("carApplyFlowId");
								var flowName = FlowDefIdPro.vehicleApplyName;
								ProDefinitionView.newFlow(defId, flowName);
								Ext.getCmp('centerTabPanel').remove(this);
							}
						}]
			}]
		});// end of the searchPanel
		var cm = new Ext.grid.ColumnModel({
			columns : [new Ext.grid.RowNumberer(), /*
													 * { header : 'carid',
													 * dataIndex : 'carid',
													 * hidden : true },
													 */	{
						header : "车牌号",
						dataIndex : 'carNo'
					}, {
						header : "驾驶员",
						dataIndex : 'driver'
					}, {
						header : "车型",
						dataIndex : 'carType',
						renderer : function(value) {
							if (value == '1') {
								return '轿车';
							} else if (value == '2') {
								return '货车';
							} else if (value == '3') {
								return '商务车';
							} else if (value == '4') {
								return '客车';
							} else if (value == '5') {
								return '大客车';
							} else if (value == '6') {
								return '面包车';
							} else if (value == '7') {
								return '本田轿车';
							} else if (value == '8') {
								return '风度轿车';
							} else if (value == '9') {
								return '吉普车';
							} else if (value == '10') {
								return '陆地巡洋舰';
							} else if (value == '11') {
								return '福克斯';
							}

						}
					}, {
						header : "座位",
						dataIndex : 'peopleAmount'
					}, {
						header : "使用者",
						dataIndex : 'userFullname'

					}, /*{
						header : "总里程数",
						dataIndex : 'totalDistance'
					},*/ {
						header : "用车时间",
						dataIndex : 'startTime'
					}, {
						header : "结束时间",
						dataIndex : 'endTime'
					}, {
						header : "车辆状态",
						dataIndex : 'status',
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var str = '';
							if (value == 1) {
								str += '&nbsp;<span  style="font-size:40px;color:green;vertical-align: middle;padding-right:3px">&bull;</span>预定';

							} else if (value == 2) {
								str += '&nbsp;<span  style="font-size:40px;color:green;vertical-align: middle;padding-right:3px">&bull;</span>使用中';
							}else if (value == 4) {
								str += '&nbsp;<span  style="font-size:40px;color:green;vertical-align: middle;padding-right:3px">&bull;</span>维修中';
							}else if (value == 0) {
								str += '&nbsp;<span  style="font-size:40px;color:green;vertical-align: middle;padding-right:3px">&bull;</span>已报废';
							}else if (value == 5) {
								str += '&nbsp;<span  style="font-size:40px;color:green;vertical-align: middle;padding-right:3px">&bull;</span>已停用';
							}
							else {
								str += '&nbsp;<span  style="font-size:40px;color:yellow;vertical-align: middle;padding-right:3px">&bull;</span>可用';
							}
							return str;
						}
					}]
		});

		var store = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
						url : __ctxPath + '/admin/listHasStatusCar.do?',
						params : {
							start : 0,
							limit : 25
						}
					}),
			reader : new Ext.data.JsonReader({
						root : 'result',
						totalProperty : 'totalCounts',
						id : 'carApplyId',
						fields : [{
									name : 'applyId',
									type : 'int'
								}, 'carNo', 'driver', 'carType',
								'peopleAmount', 'startTime', 'endTime',
								'totalDistance', 'status', 'userFullname']
					})
				// ,
				// remoteSort : true,
				// sortInfo :{field: "status", direction: "ASC"}
			});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'CarApplyStartGrid',
					width : 400,
					height : 300,
					region : 'center',
					title : '车况列表',
					store : store,
					shim : true,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					// paging bar on the bottom
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

		store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

	}
});
