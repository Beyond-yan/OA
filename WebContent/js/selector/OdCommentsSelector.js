/**
 * 选择常用批示语
 */
var OdCommentsSelector = {
	/**
	 * @param callback
	 *            回调函数
	 * @param commentType
	 *            批示语类型
	 */
	getView : function(callback, commentType) {
//		var sm = null;
//		if (isSingle) {
			var sm = new Ext.grid.CheckboxSelectionModel({
						singleSelect : true
					});
//		} else {
//			sm = new Ext.grid.CheckboxSelectionModel();
//		}
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					},{
						header : '批示语内容',
						dataIndex : 'commentTitle'
					}, {
						header : '批示语描述',
						dataIndex : 'commentDesc'
					}]
		});

		var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + "/archive/getCommentsForSelectorOdCommonComments.do?commentType="+commentType
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
						name : 'id',
						type : 'int'
					}, 'commentTitle', 'commentDesc']
						}),
				remoteSort : true
			});
	     store.setDefaultSort('id', 'desc');

		var gridPanel = new Ext.grid.GridPanel({
					id : 'OdCommentsSelectorGrid',
					width : 400,
					height : 300,
					region : 'center',
					title : '批示语列表',
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
								pageSize : 15,
								store : store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

		store.load({
					params : {
						start : 0,
						limit : 15
					}
				});
		// --------------------------------end grid
		// panel-------------------------------------

		var formPanel = new Ext.FormPanel({
			width : 400,
			region : 'north',
			id : 'OdCommentsForm',
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
						text : '批示语内容'
					}, {
						xtype : 'textfield',
						name : 'commentTitle'
					}, {
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							if (formPanel.getForm().isValid()) {
								formPanel.getForm().submit({
									waitMsg : '正在提交查询',
									url : __ctxPath + "/archive/getCommentsForSelectorOdCommonComments.do?commentType="+commentType,
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
			title : '常用批示语',
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
							var grid = Ext.getCmp('OdCommentsSelectorGrid');
							var rows = grid.getSelectionModel().getSelections();
							var flowIds = '';
							var flowNos = '';
							for (var i = 0; i < rows.length; i++) {

								if (i > 0) {
									flowIds += ',';
									flowNos += ',';
								}

								flowIds += rows[i].data.id;
								flowNos += rows[i].data.commentTitle;

							}

							if (callback != null) {
								callback.call(this, flowIds, flowNos);
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