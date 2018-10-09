/**
 * 选择常用单位
 */
var UnitsSelector = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 */
	getView : function(callback, isSingle,unitType) {
		var sm = null;
		if (isSingle) {
			var sm = new Ext.grid.CheckboxSelectionModel({
						singleSelect : true
					});
		} else {
			sm = new Ext.grid.CheckboxSelectionModel();
		}
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					},{
						header : '单位名称',
						dataIndex : 'unitName'
					}, {
						header : '单位描述',
						dataIndex : 'unitDesc'
					}]
		});

		var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + "/archive/getUnitsForSelectorCommonUnits.do"
						}),
				baseParams : {
						unitType : unitType
					},
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
						name : 'id',
						type : 'int'
					}, 'unitName', 'unitDesc']
						}),
				remoteSort : true
			});
	     store.setDefaultSort('id', 'desc');

		var gridPanel = new Ext.grid.GridPanel({
					id : 'UnitsSelectorGrid',
					width : 400,
					height : 300,
					region : 'center',
					title : '常用单位列表',
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
					bbar : new Ext.PagingToolbar({
								pageSize : 10,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

		store.load({
					params : {
						start : 0,
						limit : 10
					}
				});
		// --------------------------------end grid
		// panel-------------------------------------

		var formPanel = new Ext.FormPanel({
			width : 400,
			region : 'north',
			id : 'UnitsForm',
			height : 40,
			frame : false,
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
						text : '请输入查询条件:'
					}, {
						text : '单位名称'
					}, {
						xtype : 'textfield',
						name : 'unitName'
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							if (formPanel.getForm().isValid()) {
								formPanel.getForm().submit({
									waitMsg : '正在提交查询',
									url : __ctxPath + "/archive/getUnitsForSelectorCommonUnits.do",
									params:{
										unitType : unitType
									},
									success : function(fp, action) {
										var result = Ext.util.JSON.decode(action.response.responseText);
										gridPanel.getStore().loadData(result);
									}
								});
							}

						}
					}]
		});

		var window = new Ext.Window({
			title : '常用单位',
			width : 630,
			height : 380,
			layout : 'border',
			border : false,
			items : [formPanel, gridPanel],
			modal : true,
			buttonAlign : 'center',
			buttons : [{
						iconCls : 'btn-ok',
						text : '确定',
						handler : function() {
							var grid = Ext.getCmp('UnitsSelectorGrid');
							var rows = grid.getSelectionModel().getSelections();
							var unitsIds = '';
							var unitNames = '';
							for (var i = 0; i < rows.length; i++) {

								if (i > 0) {
									unitsIds += ',';
									unitNames += ',';
								}

								unitsIds += rows[i].data.id;
								unitNames += rows[i].data.unitName;

							}

							if (callback != null) {
								callback.call(this, unitsIds, unitNames);
							}
							window.close();
						}
					}, {
						text : '取消',
						iconCls : 'btn-cancel',
						handler : function() {
							window.close();
						}
					}]
		});
		return window;
	}

};