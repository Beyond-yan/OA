/**
 * 选择所有司机选择器
 */
var CarAllDriverSelector = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 */
	getView : function(callback, isSingle) {

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
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : "司机名称",
				dataIndex : 'name',
				width : 60
			} ]
		});

		var store = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy( {
				url : __ctxPath + '/admin/listCarDriver.do'
			}),
			reader : new Ext.data.JsonReader( {
				root : 'result',
				totalProperty : 'totalCounts',
				id : 'id',
				fields : [ {
					name : 'id',
					type : 'int'
				}, 'name' ]
			}),
			remoteSort : true
		});

		var gridPanel = new Ext.grid.GridPanel( {
			id : 'CarAllDriverSelectorGrid',
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

		var window = new Ext.Window( {
			title : '选择司机',
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
					var grid = Ext.getCmp('CarAllDriverSelectorGrid');
					var rows = grid.getSelectionModel().getSelections();
					var carids = '';
					var carNos = '';
					for ( var i = 0; i < rows.length; i++) {

						if (i > 0) {
							carids += ',';
							carNos += ',';
						}

						carids += rows[i].data.id;
						carNos += rows[i].data.name;

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