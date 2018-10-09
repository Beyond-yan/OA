Ext.ns('PartyInfoView');
/**
 * @author:
 * @class PartyInfoView
 * @extends Ext.Panel
 * @description 党群信息
 */
PartyInfoView = Ext.extend(Ext.Panel, {
/*	// 条件搜索Panel
	searchPanel : null,
	// 数据展示Panel
	gridPanel : null,
	// GridPanel的数据Store
	store : null,
	// 头部工具栏
	topbar : null,*/
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg); 
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		PartyInfoView.superclass.constructor.call(this, {
					id : 'PartyInfoView',
					title : '党群信息',
					iconCls : 'menu-flowPr',
					region : 'center',
					layout : 'border',
					autoScroll : true
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var searchPanel = Ext.getCmp('PartyInfoSearchForm');
		if(searchPanel == null){
			this.initGridPanel(); 

			this.items = [
			              this.gridPanel];
			} 
	}//end of the initUIComponents
});

/**
 * 显示列表
 * 
 * @return {}
 */
PartyInfoView.prototype.initGridPanel = function() {
 	return this.gridPanel = new Ext.Panel({
		region : 'center',
		layout : 'form',
		border : false,
		anchor : '100%',
		items : [{
			items : [new Ext.FormPanel({
				id : 'PartyInfoSearchForm',
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
							text : '发布者'
						}, {
							id:'noticeAuthor',
							xtype : 'textfield',
							width : 80,
							name : 'Q_postName_S_LK'
						},{
							text : '主题'
						}, {
							id:'noticeTitle',
							xtype : 'textfield',
							width : 220,
							name : 'Q_noticeTitle_S_LK'
						},{
							text : '信息分类'
						},{
							id:'comboInfoType',
							hiddenName : 'Q_infoType.typeid_L_EQ',
							xtype : 'combo',
							editable : false,
							triggerAction : 'all',
							displayField : 'typeName',
							valueField : 'typeId',
							store : new Ext.data.SimpleStore({
										autoLoad : true,
										url : __ctxPath
										+ '/info/comboInfoType.do',
										fields : ['typeId', 'typeName']
									})
						},{
							xtype : 'button',
							text : '查询',
							id:'PartyInfoViewSearchBtn',
							iconCls : 'search',
							handler : function() {
									var searchPanel = Ext.getCmp('PartyInfoSearchForm');
									var gridPanel = Ext.getCmp('PartyInfoGrid');
									if (searchPanel.getForm().isValid()) {
										searchPanel.getForm().submit({
										waitMsg : '正在提交查询',
											url : __ctxPath + '/info/partyListNotice.do?intType=2',
											success : function(formPanel, action) {
														var result = Ext.util.JSON.decode(action.response.responseText);
														gridPanel.getStore().loadData(result);
												  }
										});//success结束
									}
							}
						}, {
							xtype : 'button',
							text : '重置',
							iconCls : 'reset',
							handler : function() {
								var searchSendPerson = Ext.getCmp('noticeAuthor');
								var searchSendTitle= Ext.getCmp('noticeTitle');
								var comboInfoType= Ext.getCmp('comboInfoType');
								searchSendPerson.setValue("");
								searchSendTitle.setValue(""); 
								comboInfoType.setValue(""); 
							}
						}]
			}), this.setup()]
		}]
	});
 			

};

/**
 * 建立视图
 */
PartyInfoView.prototype.setup = function() {
	return this.grid();
};


/**
 * 建立DataGrid
 */
PartyInfoView.prototype.grid = function() {
	var sm = new Ext.grid.CheckboxSelectionModel();

	var cm = new Ext.grid.ColumnModel({
	columns : [sm, new Ext.grid.RowNumberer(), {
				header : 'noticeId',
				dataIndex : 'noticeId',
				hidden : true
			},{
				header : '主题',
				dataIndex : 'noticeTitle',
				width : 180,
				renderer : function(value, metadata, record, rowIndex,
						colIndex) {
					var editId = record.data.noticeId;
					var User=record.data.createUser;
					var createuser=0;
					if(curUserInfo.isAdmin||curUserInfo.iscommonAdmin||curUserInfo.username==User)
					 createuser=1;
					var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="PartyInfoView.edit('
						+ editId 
						+','
						+0
						+','
						+createuser+')">'+ value
						+ '</a>';
					return str;
				}
			},{
				header : '信息分类',
				dataIndex : 'auditingPerson',
				width : 70
			},{
				header : '发布者',
				dataIndex : 'postName',
				width : 70
			}, 				 
				{
					header : '发布时间',
					dataIndex : 'createtime',
					width : 100
			}, {
				header : '附件',
				dataIndex : 'attachFiles',
				width:200,
				renderer:function(value,metadata,record){
					if(value=='' || value=='0'){
						return '无附件';
					}else{
						var attachFiles=record.data.attachFiles;
						var str='';
						for(var i=0;i<attachFiles.length;i++){
							str+='<a href="#" onclick="FileAttachDetail.show('+attachFiles[i].fileId+');" class="attachment">'+attachFiles[i].fileName+'</a>';
							str+='&nbsp;';
						}
						
						return str;
					}
				}
			},{
				header : '管理',
				dataIndex : 'noticeId',
				sortable : false,
				width : 140,
				renderer : function(value, metadata, record, rowIndex,
						colIndex) {
					var editId = record.data.noticeId;
					var User=record.data.createUser;
					var createuser=0;
					if(curUserInfo.isAdmin||curUserInfo.iscommonAdmin||curUserInfo.username==User)
					createuser=1;
 					var str = '';
 					if(curUserInfo.isAdmin||curUserInfo.iscommonAdmin||curUserInfo.username==record.get("createUser")){
						if (isGranted('_PartyInfoDel_1')) {
							str = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" value=" " class="btn-del" onclick="PartyInfoView.remove('
									+ editId +')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';
						}
						if (isGranted('_PartyInfoEdit_1')) {
							str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="编辑" value=" " class="btn-edit" onclick="PartyInfoView.edit('
									+ editId 
									+','
									+0
									+','
									+createuser
									+')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</a>';}}
					return str;
			}
		}],
	defaults : {
		sortable : true,
		menuDisabled : false,
		width : 100
	}
	});//end of the cm
	

	
 	var store = this.store();
 	store.load({
 		param : {
 			start : 0,
 			limit : 25
 		}
 		});

	var grid = new Ext.grid.GridPanel({
		id : 'PartyInfoGrid',
		tbar : this.topbar(),
		region : 'center',
		store : store,
		trackMouseOver : true,
		disableSelection : false,
		loadMask : true,
		height : 360,
		autoScroll:true,
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

	grid.addListener('rowdblclick', function(grid, rowindex, e){
		grid.getSelectionModel().each(function(rec) {
			if (isGranted('_PartyInfoEdit_1')) {
				PartyInfoView.edit(rec.data.noticeId,rec.data.auditingStatus);
			}
		});
	});
	return grid;
};


/**
 * 初始化数据
 */
 
PartyInfoView.prototype.store = function() {
	var store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : __ctxPath + '/info/partyListNotice.do?intType=2'
		}),
		reader : new Ext.data.JsonReader({
					root : 'result',
					totalProperty : 'totalCounts',
					id : 'id',
					fields : [{
						name : 'noticeId',
						type : 'int'
					}, 'postName', 'noticeTitle', 'effectiveDate',
					'expirationDate','attachFiles','state','auditingStatus','replyCounts','viewCounts','ordertop','createUser','createtime','auditingPerson']
				}),
		remoteSort : true
	});
	store.setDefaultSort('createtime', 'desc');
	return store;
};

/**
 * 建立操作的Toolbar
 */
PartyInfoView.prototype.topbar = function() {
	var toolbar =  new Ext.Toolbar({
			id : 'NoticeFootBar',
			height : 30,
			bodyStyle : 'text-align:left',
			items : []
		});
	if (isGranted('_PartyInfoAdd_1')) {
	toolbar.add(new Ext.Button({
				iconCls : 'btn-add',
				text : '添加',
				handler : function() {
					PartyInfoView.add();
				}
			}));
	};
	if (isGranted('_PartyInfoDel_1')) {
	toolbar.add(new Ext.Button({
				iconCls : 'btn-del',
				text : '删除',
				id:'btnDel',
				handler : function() { 
					var grid = Ext.getCmp("PartyInfoGrid");
					var selectRecords = grid.getSelectionModel()
							.getSelections();
					if (selectRecords.length == 0) {
						Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
						return;
					}
					var ids = Array();
					for (var i = 0; i < selectRecords.length; i++) {
						ids.push(selectRecords[i].data.noticeId);
							if(!curUserInfo.iscommonAdmin&&!curUserInfo.isAdmin&&curUserInfo.fullname!=selectRecords[i].data["createUser"])
								{Ext.ux.Toast.msg("信息", "只能删除自己的记录！");
								return;
								}
					}

					PartyInfoView.remove(ids);
				}
			}));
	};//end of the topbar
	return toolbar;
};
 
	
/**
 * 删除单个记录
 */
PartyInfoView.remove = function(id) {
 	var grid = Ext.getCmp("PartyInfoGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + '/info/multiDelNotice.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("操作信息", "成功删除所选记录！");
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
 * type用来区分公司公告/部门公告/部门文件 (actionFlag用来区分是公司公告还是部门公告)
 */
PartyInfoView.edit = function(id,addType,createuser) {
	new PartyInfoForm({
		noticeId : id,
		addType:addType,
		createuser:createuser
	}).show();
};
PartyInfoView.add = function() {
	new PartyInfoForm({
 		addType:0,
 		createuser:1
		}).show();
};