/**
 * 工资项目选择器
 */
var WageConfigSelector = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 * @param isSelect
	 *            是否过滤
	 * 
	 * 
	 */
	getView : function(callback, isSingle){
		// ---------------------------------start grid
		// panel--------------------------------
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
				header : "项目类型",
				dataIndex : 'typeName',
				width : 60
			}, {
				header : "项目名称",
				dataIndex : 'name',
				width : 60
			} ]
		});
		
		var store = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy( {
				url : __ctxPath + '/wage/listProWageconfig.do'
			}),
			reader : new Ext.data.JsonReader( {
				root : 'result',
				totalProperty : 'totalCounts',
				id : 'id',
				fields : [ {
					name : 'id',
					type : 'int'
				}, {
					name:'typeName',
					mapping:'proWagetype.name'	
				}, 'name' ]
			}),
			remoteSort : true
		});

		var gridPanel = new Ext.grid.GridPanel( {
			id : 'WageSelectorGrid',
			width : 400,
			height : 300,
			region : 'center',
			title : '项目列表',
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
			
			}
		});
		// --------------------------------end grid
		// panel-------------------------------------

		var formPanel = new Ext.FormPanel(
				{
					width : 400,
					region : 'north',
					id : 'RoomSearchForm',
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
					items : [
							{
								text : '请输入查询条件:'
							},
							{
								text : '房间编号'
							},
							{
								xtype : 'textfield',
								name : 'Q_code_S_LK'
							},
							{
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext
											.getCmp('RoomSearchForm');
									var grid = Ext.getCmp('WageSelectorGrid');
									if (searchPanel.getForm().isValid()) {
										searchPanel
												.getForm()
												.submit(
														{
															waitMsg : '正在提交查询',
															url : __ctxPath + '/operations/listProDormRoom.do',
															params : {
																start : 0,
																limit : 10,
																'Q_proDormRoom.code_SN_EQ' : code
															},
															method : 'post',
															success : function(
																	formPanel,
																	action) {
																var result = Ext.util.JSON
																		.decode(action.response.responseText);
																grid
																		.getStore()
																		.loadData(
																				result);
															}
														});
									}

								}
							} ]
				});

		var window = new Ext.Window( {
			title : '项目选择',
//			iconCls : 'menu-car',
			width : 630,
			height : 380,
			layout : 'border',
			border : false,
			items : [  gridPanel ],
			modal : true,
			buttonAlign : 'center',
			buttons : [ {
				iconCls : 'btn-ok',
				text : '确定',
				handler : function() {
					var grid = Ext.getCmp('WageSelectorGrid');
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