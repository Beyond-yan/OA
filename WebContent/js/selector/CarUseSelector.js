/**
 * 车辆选择器
 */
var CarUseSelector = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 * @param status
	 *            状态：1,可用；2,维修中，3,报废
	 */
	getView : function(callback, isSingle, startTime, endTime, onDutyTime,
			offDutyTime) {
		// ---------------------------------start grid
		// panel--------------------------------
		var endDate = Ext.util.Format.date(endTime, 'Y-m-d H:i:s');
		var startDate = Ext.util.Format.date(startTime, 'Y-m-d H:i:s');
/*		var onDutyTime = Ext.util.Format.date(onDutyTime, 'H:i');
		var offDutyTime = Ext.util.Format.date(offDutyTime, 'H:i');*/
	
		var sm = null;
		if (isSingle) {
			var sm = new Ext.grid.CheckboxSelectionModel( {
				singleSelect : true
			});
		} else {
			sm = new Ext.grid.CheckboxSelectionModel();
		}
		var cm = new Ext.grid.ColumnModel( {
			columns : [ sm, new Ext.grid.RowNumberer(), {
				header : 'carid',
				dataIndex : 'carid',
				hidden : true
			}, {
				header : "车辆车牌号",
				dataIndex : 'carno',
				width : 60
			}, {
				header : "可承载人数",
				dataIndex : 'passAmount',
				width : 60
			}]
		});

		var store = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy( {
				url : __ctxPath + '/admin/getVilabeCarApply.do?startTime='
						+ startDate + '&endTime='+ endDate ,
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
					name : 'carid',
					type : 'int'
				}, 'carno','passAmount' ]
			}),
			remoteSort : true
		});

		var gridPanel = new Ext.grid.GridPanel( {
			id : 'CarSelectorGrid',
			width : 400,
			height : 300,
			region : 'center',
			title : '车辆列表',
			store : store,
			shim : true,
			trackMouseOver : true,
			disableSelection : false,
			loadMask : true,
			cm : cm,
			sm : sm,
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
			// startTime : startTime,
				// endTime : endTime
				}
			});
		// --------------------------------end grid
		// panel-------------------------------------


		var window = new Ext.Window( {
			title : '车辆选择',
			iconCls : 'menu-car',
			width : 630,
			height : 380,
			layout : 'border',
			border : false,
			items : [ gridPanel ],
			modal : true,
			buttonAlign : 'center',
			buttons : [ {
				iconCls : 'btn-ok',
				text : '确定',
				handler : function() {
					var grid = Ext.getCmp('CarSelectorGrid');
					var rows = grid.getSelectionModel().getSelections();
					var carids = '';
					var carNos = '';
					for ( var i = 0; i < rows.length; i++) {

						if (i > 0) {
							carids += ',';
							carNos += ',';
						}

						carids += rows[i].data.carid;
						carNos += rows[i].data.carno;

					}

					if (callback != null) {
						callback.call(this, carids, carNos);
					}
					window.close();
				}
			}, {
				text : '取消',
				iconCls : 'btn-cancel',
				handler : function() {
					window.close();
				}
			} ]
		});
		return window;
	}

};