/**
 * 选择常用单位
 */
var OutMsgSelector = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 */
	getView : function(callback, isSingle) {
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
						header : '姓名',
						dataIndex : 'personName'
					}, {
						header : '手机号码',
						dataIndex : 'mobile'
					}]
		});

		var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + "/personal/listAddrbookOuter.do"
						}),
				
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
						name : 'id',
						type : 'int'
					}, 'personName', 'mobile']
						}),
				remoteSort : true
			});
	     store.setDefaultSort('id', 'desc');

		var gridPanel = new Ext.grid.GridPanel({
					id : 'UnitsSelectorGrid',
					width : 400,
					height : 300,
					region : 'center',
					title : '通讯录列表',
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

		var formPanel = new Ext.FormPanel({});

		var window = new Ext.Window({
			title : '通讯录',
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
							//var unitsIds = '';
							var personName = '';
							var unitmobile = '';
							for (var i = 0; i < rows.length; i++) {

								if (i > 0) {
									//unitsIds += ',';
									personName += ',';
									unitmobile += ',';
								}

								//unitsIds += rows[i].data.id;
								personName += rows[i].data.personName;
								unitmobile += rows[i].data.mobile;

							}

							if (callback != null) {
								callback.call(this, personName, unitmobile);
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