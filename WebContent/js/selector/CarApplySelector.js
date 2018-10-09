/**
 * 车辆选择器
 */
var CarApplySelector = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 * @param status
	 *            状态：1,可用；2,维修中，3,报废
	 */
	getView : function(callback, isSingle, carNo) {
		// ---------------------------------start grid
		// panel--------------------------------

		/*if (carNo == '') {
			Ext.MessageBox.show( {
				title : '操作信息',
				msg : '请输入正确车牌！',
				buttons : Ext.MessageBox.OK,
				icon : 'ext-mb-error'
			});
			//window.close();
		}*/
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
				dataIndex : 'carId',
				hidden : true
			}, {
				header : "车辆车牌号",
				dataIndex : 'carNo',
				width : 30
			}, {
				header : "司机",
				dataIndex : 'driver',
				width : 30
			}, {
				header : "用车部门",
				dataIndex : 'department',
				width : 30
			}, {
				header : "开始日期",
				dataIndex : 'startTime',
				width : 30
			}, {
				header : "开始时间",
				dataIndex : 'onDutyTime',
				width : 30
			}, {
				header : "截止日期",
				dataIndex : 'endTime',
				width : 30
			}, {
				header : "截止时间",
				dataIndex : 'offDutyTime',
				width : 30
			}, {
				header : 'applyId',
				dataIndex : 'applyId',
				hidden : true
			} ]
		});

		var store = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy( {
				url : __ctxPath + "/admin/getListCarCarApply.do"
			}),
			reader : new Ext.data.JsonReader( {
				root : 'result',
				totalProperty : 'totalCounts',
				id : 'carid',
				fields : [ {
					name : 'carId',
					type : 'int'
				}, 'carNo', 'driver', 'applyId', 'department', 'startTime',
						'onDutyTime', 'endTime', 'offDutyTime', 'carIds',
						'driverIds' ]
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
				limit : 10,
				carNo : carNo
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
					var driver = '';
					var applyId = '';
					var driverIds = '';
					for ( var i = 0; i < rows.length; i++) {

						if (i > 0) {
							carids += ',';
							carNos += ',';
							driver = +',';
						}

						carids += rows[i].data.carIds;
						// alert(carids);
				carNos += rows[i].data.carNo;
				driver += rows[i].data.driver;
				applyId += rows[i].data.applyId;
				driverIds += rows[i].data.driverIds;
			}

			var num = carNos.split(",", 100).length;
			//alert("num:"+num);
			 //alert("driver"+driver);
			var drivers = null;
			var carID = null;
			var driverId = null;
			for ( var n = 0; n < num; n++) {

				//if (carNos.split(",", 100)[n] == carNo) {
					drivers = driver.split(",", 100)[n];
					carID = carids.split(",", 100)[n];
					driverId = driverIds.split(",", 100)[n];
					//break;
				//}
			}
			
				if (callback != null) {
					callback.call(this, carID, carNo, drivers, applyId,driverId);
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