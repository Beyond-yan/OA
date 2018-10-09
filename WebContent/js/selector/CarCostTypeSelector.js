/**
 * 车辆费用类别选择器
 */
var CarCostTypeSelector = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 * 
	 */
	getView : function(callback, isSingle) {
		// ---------------------------------start grid
		// panel--------------------------------
		var sm = null;
		if (isSingle) {
			var sm = new Ext.grid.CheckboxSelectionModel({
						singleSelect : true
					});
		} else {
			sm = new Ext.grid.CheckboxSelectionModel();
		}
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(),/* {
								header : 'id',
								dataIndex : 'id',
								hidden : true
							}, */{
								header : "费用类别",
								dataIndex : 'costTypeName',
								width : 60
							},{
							   header:'类别ID',
							   dataIndex:'costNo',
							   width:60
							   }/*, {
								header : '管理',
								dataIndex : 'id',
								width : 50,
								sortable : false,
								renderer : function(value, metadata, record, rowIndex,
										colIndex) {
									var editId = record.data.id;
									var str = '';
									str = '<button title="删除" value=" " class="btn-del" onclick="CarCostTypeSelector.remove('
											+ editId + ')">&nbsp;&nbsp;</button>';
									str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="CarCostTypeSelector.edit('
											+ editId + ')">&nbsp;&nbsp;</button>';
									return str;
								}
							}*/]
				});

		var store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/admin/listCarCostType.do'
							
							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								id : 'carid',
								fields : [{
											name : 'id',
											type : 'int'
										}, 'costTypeName','costNo']
							}),
					remoteSort : true
				});

		this.topbar = new Ext.Toolbar({
			id : 'CarCostTypeFootBar',
			height : 30,
			bodyStyle : 'text-align:left',
			items : []
		});
   this.topbar.add(new Ext.Button({
			iconCls : 'btn-add',
			text : '添加费用类别',
			scope : this,
			handler : function() {
				new CarCostTypeForm().show();
			}
		}));
/*this.topbar.add(new Ext.Button({
			iconCls : 'btn-del',
			text : '删除费用类别',
			xtype : 'button',
			handler : function() {

				var grid = Ext.getCmp("CarCostTypeSelectorGrid");

				var selectRecords = grid.getSelectionModel()
						.getSelections();

				if (selectRecords.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var ids = Array();
				for (var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.id);
				}
				CarCostTypeSelector.remove(ids);
			}
		}));*/
		
		var gridPanel = new Ext.grid.GridPanel({
					id : 'CarCostTypeSelectorGrid',
					width : 400,
					height : 350,
					region : 'center',
					title : '费用类别列表',
					//tbar : this.topbar,
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

		var window = new Ext.Window({
			title : '费用类别选择',
			iconCls : 'menu-car',
			width : 630,
			height : 430,
			layout : 'border',
			border : false,
			items :  gridPanel,
			modal : true,
			buttonAlign : 'center',
			buttons : [{
						iconCls : 'btn-ok',
						text : '确定',
						handler : function() {
							var grid = Ext.getCmp('CarCostTypeSelectorGrid');
							var rows = grid.getSelectionModel().getSelections();
							var ids = '';
							var costTypeNames = '';
							for (var i = 0; i < rows.length; i++) {

								if (i > 0) {
									ids += ',';
									costTypeNames += ',';
								}

								ids += rows[i].data.id;
								costTypeNames += rows[i].data.costTypeName;

							}

							if (callback != null) {
								callback.call(this, ids, costTypeNames);
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

CarCostTypeSelector.remove = function(id) {
	var grid = Ext.getCmp("CarCostTypeSelectorGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath
										+ '/admin/multiDelCarCostType.do',
								params : {
									carCostTypeId : id
								},
								method : 'post',
								success : function(result,request) {
									var res = Ext.util.JSON.decode(result.responseText);
									if(res.success==false){
									  Ext.ux.Toast.msg('操作信息',res.message);
									}else{
									Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
									}
									grid.getStore().reload({
												params : {
													start : 0,
													limit : 25
												}
											});
								}
							});
				}
			});
};
/**
 * 编辑
 */
CarCostTypeSelector.edit = function(id) {
	new CarCostTypeForm({
		carCostTypeId : id
	}).show();
};