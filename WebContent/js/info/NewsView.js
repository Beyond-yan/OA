Ext.ns('NewsView');
/**
 * 新闻列表
 */

NewsView = Ext.extend(Ext.Panel, 
{
	// 新闻类别树
	newsTypeTree : null,
	constructor : function(config) 
	{
		Ext.applyIf(this, config);
		this.initUIComponents();
		NewsView.superclass.constructor.call(this, {
					id : 'NewsView' + this.suffix,
					title : this.title,
					iconCls : 'menu-news',
					layout : 'border',
					autoScroll : true
		});
	},
	initUIComponents : function() {
		// this.newsTypeTree = new NewsTypeTree();
 		var searchPanel = Ext.getCmp('NewsView.NewsSearchForm'+ this.suffix);
		if(searchPanel == null){
			this.initGridPanel();
			this.items = [this.gridPanel];
		}
		
	}
});

/**
 * 显示列表
 * 
 * @return {}
 */
NewsView.prototype.initGridPanel = function() {
	var type = this.type;
	var suffix = this.suffix;
	return this.gridPanel = new Ext.Panel({
		region : 'center',
		layout : 'form',
		border : false,
		anchor : '100%',
		items : [{
			items : [new Ext.FormPanel({
				id : 'NewsView.NewsSearchForm' + suffix,
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
						}, */{
							text : '标题'
						}, {
							id : 'NewsView.subject' + suffix,
							xtype : 'textfield',
							name : 'Q_subject_S_LK',
							width : 80
						}, {
							text : '作者'
						}, {
							id : 'NewsView.author' + suffix,
							xtype : 'textfield',
							name : 'Q_author_S_LK',
							width : 80
						}, {
							text : '审核状态'
						}, {
							id : 'NewsView.auditingStatus' + suffix,
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
								var searchPanel = Ext.getCmp('NewsView.NewsSearchForm'
										+ suffix);
								var gridPanel = Ext.getCmp('NewsView.NewsGrid' + suffix);
								var auditingStatus = Ext
										.getCmp('NewsView.auditingStatus' + suffix);
								var subject = Ext.getCmp('NewsView.subject' + suffix);
								var author = Ext.getCmp('NewsView.author' + suffix);		
								var btnDel = Ext.getCmp('NewsView.btnDel' + suffix);
								if (searchPanel.getForm().isValid()) {
									
  		 				searchPanel.getForm().submit({
										waitMsg : '正在提交查询',
										url : __ctxPath
												+ '/info/listNews.do?actionFlag=0&Q_typeId_L_EQ='
												+ type
												+ '&Q_auditingStatus_N_EQ='
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
				//auditingStatus指的是审核状态凡,0:未审核 1:已经审核通过 2:已拒绝
								if (auditingStatus.value == 1) {
									btnDel.setVisible(false);
									gridPanel.getColumnModel().setHidden(0,
											true);
/*									gridPanel.getColumnModel().setHidden(11,
											true);*/

								} else if (auditingStatus.value == 2) {
									btnDel.setVisible(true);
									gridPanel.getColumnModel().setHidden(0,
											false);
/*									gridPanel.getColumnModel().setHidden(11,
											true);*/

								} else {
									btnDel.setVisible(true);
									gridPanel.getColumnModel().setHidden(0,
											false);
/*									gridPanel.getColumnModel().setHidden(11,
											false);*/
								}
 							}
						}, {
							xtype : 'button',
							text : '重置',
							iconCls : 'reset',
							handler : function() { 
/*								var searchPanel = Ext.getCmp('NewsSearchForm'
										+ this.suffix);*/
								//searchPanel.getForm().reset();  
								
								var searchSendPerson = Ext.getCmp('NewsView.subject' + suffix);
								var searchSendTitle= Ext.getCmp('NewsView.author'+ suffix);
								var searchAuditStatus= Ext.getCmp('NewsView.auditingStatus'+suffix);
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
NewsView.prototype.setup = function() {
	return this.grid();
};
/**
 * 建立DataGrid
 */
NewsView.prototype.grid = function() {
	var suffix = this.suffix;
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer(), {
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
				},*/ {
					header : '新闻标题',
					width : 300,
					dataIndex : 'subject'
				}, {
					header : '作者',
					width : 130,
					dataIndex : 'author'
				}, {
					header : '创建时间',
					width : 140,
					dataIndex : 'createtime'

				}, {
					header : '回复次数',
					width : 100,
					dataIndex : 'replyCounts'
				}, {
					header : '浏览数',
					width : 90,
					dataIndex : 'viewCounts'
				}, {
					header : '状态',
					width : 60,
					dataIndex : 'status',
					renderer : function(value) {
						return value == 0 ? '禁用' : '生效'
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
					header : '是否已置顶',
					//id : 'ordertop' + suffix,
					width : 130,
					dataIndex : 'ordertop',
					renderer : function(value) {
						var str = '否';
						if (value == null||value == 0) {
							str = '否';
						} else if (value == 1) {
							str = '是';
						}
						return str;
					}
				}, {
					header : '管理',
					dataIndex : 'newsId',
					width : 150,
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var editId = record.data.newsId;
					    var auditingStatus =record.data.auditingStatus;//["auditingStatus"];//add by smart on 20110514

						var str = '';
					if(auditingStatus==0)
					{
						if (isGranted('_NewsDel_'+suffix)) {
							str = '<button title="删除" value=" " class="btn-del" onclick="NewsView.remove('
									+ editId
									+ ','
									+ suffix
									+ ')">&nbsp</button>';
						}
						if (isGranted('_NewsEdit_'+suffix)) {
							str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="NewsView.edit('
									+ editId
									+ ',0,'
									+ auditingStatus
									+','
									+ suffix
									+ ')">&nbsp</button>';
							str += '&nbsp;&nbsp;<button title="置顶" value=" " class="btn-up" onclick="NewsView.sort('
									+ editId
									+ ','
									+ 1
									+ ','
									+ suffix
									+ ')">&nbsp</button>&nbsp;&nbsp;<button title="取消置顶" value=" " class="btn-down" onclick="NewsView.sort('
									+ editId
									+ ','
									+ 0
									+','
									+suffix
									+ ')">&nbsp</button>';
						}
				}
				else if(auditingStatus==1||auditingStatus==2)
				{
							str = '&nbsp;<button title="查看" value=" " class="btn-showDetail" onclick="NewsView.edit('
									+ editId
									+ ',0,'
									+ auditingStatus
									+','
									+ suffix
									+ ')">&nbsp</button>';
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
				id : 'NewsView.NewsGrid' + suffix,
				tbar : this.topbar(),
				store : store,
				trackMouseOver : true,
				disableSelection : false,
				height : 630,
		        autoScroll:true,
				loadMask : true,
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
							if (isGranted('_NewsEdit_'+suffix)) {
								NewsView.edit(rec.data.newsId, 0,rec.data.auditingStatus, suffix);
							}
						});
			});
	return grid;

};

/**
 * 初始化数据
 */

// actionType=personal
NewsView.prototype.store = function() {
	var type = this.type;
	var suffix = this.suffix;

	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : __ctxPath
							+ '/info/listNews.do?actionFlag=0&Q_typeId_L_EQ='
							+ type + '&Q_auditingStatus_N_EQ=0' // edit
							// by
						// smart
						// on
						// 20110511''

					}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id' + suffix,
							fields : [{
										name : 'newsId',
										type : 'int'
									}, 'typeId', 'subjectIcon', 'subject',
									'author', 'createtime', 'replyCounts',
									'viewCounts', 'content', 'updateTime',
									'status', 'auditingStatus', 'ordertop']
						}),
				remoteSort : true
			});
	// store.setDefaultSort('newsId', 'desc');
	return store;
};

/**
 * 建立操作的Toolbar
 */
NewsView.prototype.topbar = function() {
	var type = this.type;
	var suffix = this.suffix;

	var toolbar = new Ext.Toolbar({
				id : 'NewsView.NewsFootBar' + suffix,
				height : 30,
				bodyStyle : 'text-align:left',
				items : []
			});
	if (isGranted('_NewsAdd_'+suffix)) {
		toolbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '添加',
					handler : function() {
						// new NewsForm().show();
						NewsView.add(type, '0', suffix);// 0代表公司级别的
					}
				}));
	}
	if (isGranted('_NewsDel_'+suffix)) {
		toolbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除',
					id : 'NewsView.btnDel' + suffix,
					handler : function() {

						var grid = Ext.getCmp("NewsView.NewsGrid" + suffix);
						//alert("suffixsuffixsuffixsuffix: " + grid.id);
						var selectRecords = grid.getSelectionModel()
								.getSelections();
						//alert("selectRecords: " + selectRecords);
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.newsId);
						}

						NewsView.remove(ids, suffix);
					}
				}));
	}
	return toolbar;
};

/**
 * 删除单个记录
 */
NewsView.remove = function(id, suffix) {
	var grid = Ext.getCmp("NewsView.NewsGrid" + suffix);
	Ext.Msg.confirm('信息确认',
			'删除新闻,则新闻下的<font color="red">评论</font>也删除,您确认要删除该记录吗？', function(
					btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + '/info/multiDelNews.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
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
 * 
 */
NewsView.edit = function(id, actionFlag,auditingStatus, suffix) {
	new NewsForm({
				newsId : id,
				actionFlag : actionFlag,
				auditingStatus:auditingStatus,
				suffix : suffix
			}).show();
}

NewsView.add = function(id, actionFlag, suffix) {
	new NewsForm({
				typeId : id,
				actionFlag : actionFlag,
				suffix : suffix
			}).show();
}

/**
 * 类别排序 sortId :需要置顶的ID,opt: 置顶的值
 */
NewsView.sort = function(sortId, opt, suffix) {
	var grid = Ext.getCmp("NewsView.NewsGrid" + suffix);
	Ext.Ajax.request({
				url : __ctxPath + '/info/sortNews.do',
				method : 'post',
				params : {
					sortId : sortId,
					opt : opt
				},
				success : function() {
					if(opt==1)
					{
						Ext.ux.Toast.msg("信息提示", "成功[置顶]所选记录！");
					}
					else
					{
						Ext.ux.Toast.msg("信息提示", "成功[取消置顶]所选记录！");
					}
					grid.getStore().reload({
								params : {
									start : 0,
									limit : 25
								}
							});
				},
				failure : function() {
					Ext.ux.Toast.msg("操作信息", "操作失败");
				}
			});
}
