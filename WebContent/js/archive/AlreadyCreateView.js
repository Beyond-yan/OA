/**
 * 已生成文件
 */
var AlreadyCreateView = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 */
	getView : function(snname) {
		//var endDate = Ext.util.Format.date(endTime, 'Y-m-d H:i:s');
		//var startDate = Ext.util.Format.date(startTime, 'Y-m-d H:i:s');
		this.searchPanel = new Ext.FormPanel({
					id : 'AlreadySearchForm',
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
								text : '标题'
							}, {
								xtype : 'textfield',
								name : 'Q_subject_S_LK'
							},
							{
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext
											.getCmp('AlreadySearchForm');
									var gridPanel = Ext.getCmp('AlreadySelectorGrid');
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
											.getCmp('AlreadySearchForm');
									searchPanel.getForm().reset();
								}
							}]
				});// end of the searchPanel
		var cm = new Ext.grid.ColumnModel( {
			columns : [{
						header : 'archiveId',
						dataIndex : 'archiveId',
						hidden : true
					},{
						header : '标题',
						dataIndex : 'subject',
                                                width : 400
					},{
						header : '公文编号',
						dataIndex : 'archivesNo'
					}/*,{
						header : '发文单位',
						dataIndex : 'issueDep'
					},{
						header : '秘密程度',
						dataIndex : 'privacyLevel'
					},{
						header : '紧急程度',
						dataIndex : 'urgentLevel'
					},{
						header : '拟稿人',
						dataIndex : 'issuer'
					},{
						header : '拟稿单位',
						dataIndex : 'orgDepName'
					}*/]
		});

		var store = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy( {
			    url : __ctxPath + "/archive/listArchives.do?Q_snConfigId_L_EQ="+snname +'&Q_createtime_D_GE='+Ext.util.Format.date(new Date(),'Y'),
			    	baseParams : {
			    		Q_snConfigId_L_EQ:snname,
			    		Q_createtime_D_GE:Ext.util.Format.date(new Date(),'Y'),
						start : 0,
					    limit : 10
					}
			}),
			
			reader : new Ext.data.JsonReader( {
				root : 'result',
				totalProperty : 'totalCounts',
				id : 'carid',
				fields : ['archiveId', 'archivesNo','issueDep','privacyLevel','urgentLevel','issuer','orgDepName','subject',
							'createtime', 'signDate', 'defId', 'runId']
			}),
			remoteSort : true
		});
         store.setDefaultSort('createtime','desc');
		var gridPanel = new Ext.grid.GridPanel( {
			id : 'AlreadySelectorGrid',
			width : 400,
			height : 300,
			region : 'center',
			title : '公文列表',
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
			title : '已编号文件',
			iconCls : 'btn-operation',
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
