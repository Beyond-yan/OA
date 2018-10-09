Ext.ns('NewsView');
/**
 * 新闻列表
 */

NewsAuditingView = Ext.extend(Ext.Panel, {
			// 新闻类别树
			newsTypeTree : null,
			constructor : function(config) {
		 
				Ext.applyIf(this, config);
				this.initUIComponents();
				NewsAuditingView.superclass.constructor.call(this, {
							id : 'NewsAuditingView'+this.suffix,
							title : this.title,
							iconCls : 'menu-news',
							layout : 'border',
							autoScroll : true
						});
			},
			initUIComponents : function() {

				// this.newsTypeTree = new NewsTypeTree();
				
		var searchPanel = Ext.getCmp('NewsSearchForm'+ this.suffix);
		if(searchPanel == null){
				this.initGridPanel(); 
				this.items = [// this.newsTypeTree,
				this.gridPanel];
		}
			}
		});

/**
 * 显示列表
 * 
 * @return {}
 */
NewsAuditingView.prototype.initGridPanel = function() {
	var type=this.type;
 	var suffix=this.suffix;
 	return this.gridPanel = new Ext.Panel({
		region : 'center',
		layout : 'form',
		border : false,
		anchor : '100%',
		items : [{
			items : [new Ext.FormPanel({
				id : 'NewsSearchForm'+suffix,
				layout : 'column',
				height : 35,
				frame : false,
				border : false,
				layout : 'hbox',
				layoutConfig : {
					padding : '5',
					align : 'middle'
				},
				defaults : {
					style : 'padding:0px 5px 0px 5px;',
					xtype : 'label'
				},
				items : [/*{
							text : '请输入条件:'
						},*/ {
							text : '标题'
						}, {
							id:'NewsAuditingView.subject'+suffix,
							xtype : 'textfield',
							name : 'Q_subject_S_LK',
							width : 80
						}, {
							text : '作者'
						}, {
					 		id:'NewsAuditingView.author'+suffix, 
							xtype : 'textfield',
							name : 'Q_author_S_LK',
							width : 80
						}, {
							text : '审核状态'
						}, {
							id : 'NewsAuditingView.auditingStatus'+suffix,
							xtype : 'combo',
							name : 'Q_auditingStatus_N_EQ',
							width : 80,
							mode : 'local',
							editable : false,
							triggerAction : 'all',
							store : [[0, '未审核'], [1, '审核通过'], [2, '已拒绝']],
							value : 0
						}, {
							xtype : 'button',
							text : '查询',
							iconCls : 'search',
							handler : function() {
								var searchPanel = Ext
										.getCmp('NewsSearchForm'+suffix);
								var gridPanel = Ext.getCmp('NewsGrid'+suffix);
								var auditingStatus = Ext
										.getCmp('NewsAuditingView.auditingStatus'+suffix);
								if (searchPanel.getForm().isValid()) {
									searchPanel.getForm().submit({
										waitMsg : '正在提交查询',
										url : __ctxPath
												+ '/info/listNews.do?actionFlag=0&Q_typeId_L_EQ='+type+'&Q_auditingStatus_N_EQ='
												+ auditingStatus.value, // edit
																		// by
																		// smart
																		// on
																		// 20110511''
										success : function(formPanel, action) {
											var result = Ext.util.JSON
													.decode(action.response.responseText);
											gridPanel.getStore()
													.loadData(result);
										}
									});// success结束
								}// if结束

							}
						}, {
							xtype : 'button',
							text : '重置',
							iconCls : 'reset',
							handler : function() {
/*								var searchPanel = Ext
										.getCmp('NewsSearchForm'+suffix);
								searchPanel.getForm().reset();*/
								
								var searchSendPerson = Ext.getCmp('NewsAuditingView.subject' + suffix);
								var searchSendTitle= Ext.getCmp('NewsAuditingView.author'+ suffix);
								var searchAuditStatus= Ext.getCmp('NewsAuditingView.auditingStatus'+suffix);
 								searchSendPerson.setValue("");
 								searchSendTitle.setValue("");
 								searchAuditStatus.setValue(0); 
							}
						}]
			}), this.setup()]
		}]
	});
};
/**
 * 建立视图
 */
NewsAuditingView.prototype.setup = function() {
	return this.grid();
};
/**
 * 建立DataGrid
 */
NewsAuditingView.prototype.grid = function() {
		 	var suffix=this.suffix;
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [// sm,
		new Ext.grid.RowNumberer(), {
					header : 'newsId',
					dataIndex : 'newsId',
					hidden : true
				}, /*{
					header : '新闻图标',
					width : 120,
					dataIndex : 'subjectIcon',
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var icon = record.data.subjectIcon;
						var str = null;
						if (icon != '') {
							str = '<img style="border:0;" width="48" height="48" src="'
									+ __ctxPath
									+ '/attachFiles/'
									+ icon
									+ '" border="0"/>';
						} else {
							str = '<img style="border:0;" width="48" height="48" src="'
									+ __ctxPath
									+ '/images/default_newsIcon.jpg" border="0"/>';
						}
						return str;
					}
				}, */{
					header : '新闻标题',
					width : 360,
					dataIndex : 'subject'
				}, {
					header : '作者',
					width : 120,
					dataIndex : 'author'
				}, {
					header : '创建时间',
					width : 210,
					dataIndex : 'createtime'

				}, {
					header : '回复次数',
					width : 120,
					dataIndex : 'replyCounts'
				}, {
					header : '浏览数',
					width : 100,
					dataIndex : 'viewCounts'
				}, {
					header : '状态',
					width : 120,
					dataIndex : 'status',
					renderer : function(value) {
						return value == 0 ? '失效' : '生效'
					}
				}, {
					header : '审核状态',
					width : 120,
					dataIndex : 'auditingStatus',
					renderer : function(value) {
						var strValue = "未知";

						if (value == 0) {
							strValue = '未审核';
						} else if (value == 1) {
							strValue = '审核通过';
						} else if (value == 2) {
							strValue = '已拒绝';
						}

						return strValue;
					}
				}, {
					header : '审核操作',
					dataIndex : 'newsId',
					width : 150,
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var editId = record.data.newsId;
						var auditingStatus = record.data.auditingStatus;// ["auditingStatus"];//add
																		// by
																		// smart
																		// on
																		// 20110514
						var str = '';
						if (isGranted('_NewsAuditing_'+suffix)) {
							str += '&nbsp;<button title="查看" value=" " class="btn-showDetail" onclick="NewsAuditingView.edit('
									+ editId
									+ ','
									+ auditingStatus
									+ ',1'+ ','+suffix+')">&nbsp</button>';
						}
						return str;
					}
				}],
		defaults : {
			sortable : true,
			menuDisabled : false,
			width : 100
		}
	});
		
 	var store = this.store();
	store.load({
				params : {
					start : 0,
					limit : 25
				}
			});
	var grid = new Ext.grid.GridPanel({
				id : 'NewsGrid'+suffix,
				// tbar : this.topbar(),
				store : store,
				trackMouseOver : true,
				disableSelection : false,
				autoScroll : true,
				loadMask : true,
				height : 630,
				sortable : false,
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
			});

	grid.addListener('rowdblclick', function(grid, rowindex, e) {
 				grid.getSelectionModel().each(function(rec) {
					if (isGranted('_NewsAuditing_'+suffix)) {
						NewsAuditingView.edit(rec.data.newsId,
								rec.data.auditingStatus, 1,suffix);
					}
				});
			});
	return grid;

};

/**
 * 初始化数据
 */

// actionType=personal
NewsAuditingView.prototype.store = function() {
	 	 	var type=this.type;
 
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : __ctxPath
					+ '/info/listNews.do?actionFlag=0&Q_typeId_L_EQ='+type+'&Q_auditingStatus_N_EQ=0' // edit
																								// by
																								// smart
																								// on
																								// 20110511''

		}),
		reader : new Ext.data.JsonReader({
					root : 'result',
					totalProperty : 'totalCounts',
					id : 'id',
					fields : [{
								name : 'newsId',
								type : 'int'
							}

							, 'typeId', 'subjectIcon', 'subject', 'author',
							'createtime', 'replyCounts', 'viewCounts',
							'content', 'updateTime', 'status', 'auditingStatus']
				}),
		remoteSort : true
	});
	store.setDefaultSort('newsId', 'desc');
	return store;
};

/**
 * 
 */
NewsAuditingView.edit = function(id, auditingStatus, actionFlag,suffix) {
	new NewsAuditingForm({
				newsId : id,
				auditingStatus : auditingStatus,
				actionFlag : actionFlag,
				suffix:suffix
			}).show();
}
