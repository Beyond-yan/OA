
var CarCostRecordDetailView = {
	
	getView : function(recordId) {
	var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [new Ext.grid.RowNumberer(), {
										header : '零件名称/单项名称',
										dataIndex : 'costName'
									}, {
										header : '金额',
										dataIndex : 'costPrice'
									}]
				});

		var store = new Ext.data.JsonStore({
							url : __ctxPath
									+ '/admin/listCarCostRecordDetail.do?recordId='+recordId,
							root : 'result',
							totalProperty : 'totalCounts',
							fields : ['id', 'costName', 'costPrice']
						});

				store.load();

			this.gridPanel = new Ext.grid.GridPanel({
							id : 'carCostRecordDetailGrid',
							tbar : this.topbar,
							region : 'center',
							store : store,
							trackMouseOver : true,
							disableSelection : false,
							loadMask : true,
							//autoHeight : true,
							cm : cm,
							sm : sm,
							viewConfig : {
								forceFit : true,
								enableRowBody : false,
								showPreview : false
							},
							bbar : new Ext.PagingToolbar({
										pageSize : 25,
										store : store,
										displayInfo : true,
										displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
										emptyMsg : "当前没有记录"
									})
						});// end of the gridPaenl


		var window = new Ext.Window({
			title : '费用明细列表',
			iconCls : 'menu-car',
			width : 630,
			height:300,
			//autoHeight : true,
			layout : 'border',
			border : false,
			items :  this.gridPanel,
			modal : true
		});
		return window;
	}

};
