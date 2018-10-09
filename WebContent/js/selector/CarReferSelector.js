/**
 * 车况参考
 */
var CarReferSelector = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 */
	getView : function(startTime, endTime) {
		//var endDate = Ext.util.Format.date(endTime, 'Y-m-d H:i:s');
		//var startDate = Ext.util.Format.date(startTime, 'Y-m-d H:i:s');
		this.searchPanel = new Ext.FormPanel({
					id : 'carReferSearchForm',
					height : 40,
					frame : false,
					region : 'north',
					border : false,
					layout : 'hbox',
					layoutConfig : {
						padding : '5',
						align : 'middle'
					},
					defaults : {
						xtype : 'label',
						margins : {
							top : 0,
							right : 4,
							bottom : 4,
							left : 4
						}
					},
					items : [{
								text : '车牌号码'
							}, {
								xtype : 'textfield',
								name : 'carNo'
							}, /*{
								text : '车类型'
							}, {
								hiddenName : 'Q_cartype_S_EQ',
								xtype : 'combo',
								anchor : '95%',
								mode : 'local',
								editable : false,
								triggerAction : 'all',
								store : [['1', '轿车'], ['2', '货车'],
										['3', '商务车'], ['4', '客车'],
										['5', '大客车'], ['6', '面包车'],
										['7', '本田轿车'], ['8', '风度轿车']
										, ['9', '吉普车'], ['10', '陆地巡洋舰']
										, ['11', '福克斯']]
							},*/
							{
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext
											.getCmp('carReferSearchForm');
									var gridPanel = Ext.getCmp('CarReferSelectorGrid');
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
								iconCls : 'btn-reset',
								handler : function() {
									var searchPanel = Ext
											.getCmp('carReferSearchForm');
									searchPanel.getForm().reset();
								}
							}]
				});// end of the searchPanel
		var cm = new Ext.grid.ColumnModel( {
			columns : [new Ext.grid.RowNumberer(), /*{
				header : 'carid',
				dataIndex : 'carid',
				hidden : true
			}, */{
				header : "车牌号",
				dataIndex : 'carNo'
			},{
				header : "驾驶员",
				dataIndex : 'driver'
			},{
				header : "车型",
				dataIndex : 'carType',
			    renderer : function(value) {
							if (value == '1') {
								return '轿车';
							}else if (value == '2') {
								return '货车';
							}else if (value == '3') {
								return '商务车';
							}else if (value == '4') {
								return '客车';
							}else if (value == '5') {
								return '大客车';
							}else if (value == '6') {
								return '面包车';
							}else if (value == '7') {
								return '本田轿车';
							}else if (value == '8') {
								return '风度轿车';
							}else if (value == '9') {
								return '吉普车';
							}else if (value == '10') {
								return '陆地巡洋舰';
							}else if (value == '11') {
								return '福克斯';
							}

						}
			},{
				header : "座位",
				dataIndex : 'peopleAmount'
			},{
				header : "使用者",
				dataIndex : 'userFullname'
			},/*{
				header : "总里程数",
				dataIndex : 'totalDistance'
			},*/{
				header : "用车时间",
				dataIndex : 'startTime'
			},{
				header : "结束时间",
				dataIndex : 'endTime'
			}, {
				header : "车辆状态",
				dataIndex : 'status',
				renderer : function(value,metadata, record,rowIndex, colIndex) {
							var str='';				
					if (value == 1) {
						str += '&nbsp;<span  style="font-size:40px;color:green;vertical-align: middle;padding-right:3px">&bull;</span>预定';
						
					} 
					else if(value==2) {
						str += '&nbsp;<span  style="font-size:40px;color:green;vertical-align: middle;padding-right:3px">&bull;</span>使用中';
					}
					else{
						str += '&nbsp;<span  style="font-size:40px;color:yellow;vertical-align: middle;padding-right:3px">&bull;</span>可用';
					}
					return str;
				}
			}]
		});

		var store = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy( {
				url : __ctxPath + '/admin/listHasStatusCar.do',
				params : {
					start : 0,
					limit : 10
				}
			}),
			reader : new Ext.data.JsonReader( {
				root : 'result',
				totalProperty : 'totalCounts',
				id : 'carid',
				fields : [ {
					name : 'applyId',
					type : 'int'
				}, 'carNo','driver','carType','peopleAmount','startTime','endTime','totalDistance','status','userFullname']
			}),
			remoteSort : true
		});

		var gridPanel = new Ext.grid.GridPanel( {
			id : 'CarReferSelectorGrid',
			width : 400,
			height : 300,
			region : 'center',
			title : '车况列表',
			store : store,
			shim : true,
			trackMouseOver : true,
			disableSelection : false,
			loadMask : true,
			cm : cm,
			viewConfig : {
				forceFit : true,
				enableRowBody : false,
				showPreview : false
			},
			// paging bar on the bottom
			bbar : new Ext.PagingToolbar( {
				pageSize : 10,
				store : store,
				displayInfo : true,
				displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
				emptyMsg : "当前没有记录"
			})
		});

		store.load( {
			params : {
				start : 0,
				limit : 10
				}
			});
	


		var window = new Ext.Window( {
			title : '车况参考',
			iconCls : 'menu-car',
			width : 800,
			height : 420,
			layout : 'border',
			border : false,
			items : [ this.searchPanel,gridPanel ],
			modal : true,
			buttonAlign : 'center',
			buttons : [{
				text : '关闭',
				iconCls : 'btn-cancel',
				handler : function() {
					window.close();
				}
			} ]
		});
		return window;
	}

};