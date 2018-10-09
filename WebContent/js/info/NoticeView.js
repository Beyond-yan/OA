Ext.ns('NoticeView');
/**
 * @author:
 * @class NoticeView
 * @extends Ext.Panel
 * @description 公告列表
 * @company  
 * @createtime:2010-04-12
 */
var suffixStr;
NoticeView = Ext.extend(Ext.Panel, {
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
/*		var searchPanel = Ext.getCmp('NoticeSearchForm'+ _cfg.suffix);
		if(searchPanel == null){*/
		Ext.applyIf(this, _cfg); 
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		NoticeView.superclass.constructor.call(this, {
					id : 'NoticeView'+ this.suffix,
					title :  this.title,
					iconCls : 'menu-notice',
					region : 'center',
					layout : 'border',
					autoScroll : true//,
					//items : [this.searchPanel, this.gridPanel]
				});
		//}
	},// end of constructor

	// 初始化组件
	initUIComponents : function() { 
 	    //该句话是防止查询或者是删除数据的时候出现未选中数据或者是查询数据的时候出错 
		// this.newsTypeTree = new NewsTypeTree(); 
		suffixStr = this.suffix;
		var searchPanel = Ext.getCmp('NoticeSearchForm'+ this.suffix);
		if(searchPanel == null){
			this.initGridPanel(); 

			this.items = [// this.newsTypeTree,
			              this.gridPanel];
			} 
	}//end of the initUIComponents
});

/**
 * 显示列表
 * 
 * @return {}
 */
NoticeView.prototype.initGridPanel = function() {
	var record_start = 0;
	var type=this.type;
 	var suffix=this.suffix;
 	return this.gridPanel = new Ext.Panel({
		region : 'center',
		layout : 'form',
		border : false,
		anchor : '100%',
		autoScroll : true,
		items : [{
			items : [new Ext.FormPanel({
				id : 'NoticeSearchForm'+ suffix,
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
				items : [/*{
							text : '请输入查询条件:'
						},*/ {
							text : '发布者'
						}, {
							id:'noticeAuthor'+ suffix,
							xtype : 'textfield',
							width : 80,
							name : 'Q_postName_S_LK'
						}, {
							text : '标题'
						}, {
							id:'noticeTitle'+ suffix,
							xtype : 'textfield',
							width : 220,
							name : 'Q_noticeTitle_S_LK'
						}/*, {
							text : '审核状态'
						}, {
							id : 'noticeAuditingStatus'+ suffix,
							xtype :'combo',
							name:'Q_auditingStatus_N_EQ',
							width:80,
							mode : 'local',
							editable : false, 
							triggerAction : 'all',
							store : [['','全部'],['0', '未审核'], ['1', '审核通过'],['2', '已拒绝']],
							value:'0'
							}*/,{
							xtype : 'button',
							text : '查询',
							id:'noticeViewSearchBtn'+suffix,
							iconCls : 'search',
							handler : function() {  
								/*
								var searchPanel = Ext.getCmp('NoticeSearchForm');
								var gridPanel = Ext.getCmp('NoticeGrid');
								if (searchPanel.getForm().isValid()) {
									$search({
										searchPanel :searchPanel,
										gridPanel : gridPanel
									});
								}*/ 
									var searchPanel = Ext.getCmp('NoticeSearchForm'+ suffix);
									var gridPanel = Ext.getCmp('NoticeGrid'+ suffix);
//									var auditingStatus=Ext.getCmp('noticeAuditingStatus'+ suffix);
								 	//var btnDel = Ext.getCmp('NC_btnDel');
									gridPanel.getStore().baseParams={
										'Q_postName_S_LK': Ext.getCmp('noticeAuthor'+ suffix).getValue(),
										'Q_noticeTitle_S_LK':Ext.getCmp('noticeTitle'+ suffix).getValue()
									};
									var btnDel = Ext.getCmp('btnDel'+ suffix);
										if (searchPanel.getForm().isValid()) {
											searchPanel.getForm().submit({
											waitMsg : '正在提交查询',
                                                url : __ctxPath + '/info/listNotice.do?Q_type_N_EQ=1&intType='+type,
//												url : __ctxPath + '/info/listNotice.do?Q_type_N_EQ=1&intType='+type+'&actionFlag=0&Q_auditingStatus_N_EQ='+auditingStatus.value,  //edit by smart on 20110511''
												success : function(formPanel, action) {
															var result = Ext.util.JSON.decode(action.response.responseText);
															gridPanel.getStore().loadData(result);
													  }
											});//success结束
										}//if结束
										//auditingStatus指的是审核状态凡,0:未审核 1:已经审核通过 2:已拒绝
										/*if (auditingStatus.value == 1) {
											btnDel.setVisible(false);
											gridPanel.getColumnModel().setHidden(0,
													true);
											gridPanel.getColumnModel().setHidden(13,
													true);

										} else if (auditingStatus.value == 2) {
											btnDel.setVisible(true);
											gridPanel.getColumnModel().setHidden(0,
													false);
											gridPanel.getColumnModel().setHidden(13,
													true);

										} else {
											btnDel.setVisible(true);
											gridPanel.getColumnModel().setHidden(0,
													false);
											gridPanel.getColumnModel().setHidden(13,
													false);
										}*/
									 
							
							}
						}, {
							xtype : 'button',
							text : '重置',
							iconCls : 'reset',
							handler : function() {
			/*							var searchPanel = Ext.getCmp('NoticeSearchForm');
								searchPanel.getForm().reset();*/
							
								var searchSendPerson = Ext.getCmp('noticeAuthor' + suffix);
							var searchSendTitle= Ext.getCmp('noticeTitle'+ suffix);
//							var searchAuditStatus= Ext.getCmp('noticeAuditingStatus'+suffix);
								searchSendPerson.setValue("");
								searchSendTitle.setValue("");
//								searchAuditStatus.setValue(0);  
							}
						}]
			}), this.setup()]
		}]
	});
 			

};

/**
 * 建立视图
 */
NoticeView.prototype.setup = function() {
	return this.grid();
};


/**
 * 建立DataGrid
 */
NoticeView.prototype.grid = function() {
		var type=this.type;
	var suffix=this.suffix; 
	var sm = new Ext.grid.CheckboxSelectionModel();

	var cm = new Ext.grid.ColumnModel({
	columns : [sm, new Ext.grid.RowNumberer(), {
				header : 'noticeId',
				dataIndex : 'noticeId',
				hidden : true
			},{
				header : '公告标题',
				dataIndex : 'noticeTitle',
				width : 180,
				renderer : function(value, metadata, record, rowIndex,
						colIndex) {
					var editId = record.data.noticeId;
					var User=record.data.createUser;
					var createuser=0;
					if(curUserInfo.isAdmin||curUserInfo.iscommonAdmin||curUserInfo.username==User)
					var createuser=1;
					var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="NoticeView.edit('
						+ editId 
						+','
						+type
						+','
						+0
						+','
						+ suffix+','+createuser+')">'+ value
						+ '</a>';
					return str;
				}
			},{
				header : '发布者',
				dataIndex : 'postName',
				width : 70
			}, 				 
				{
					header : '发布时间',
					dataIndex : 'createtime',
					width : 100
			},/*{
				header : '生效日期',
				dataIndex : 'effectiveDate',
				width : 100
			}, {
				header : '失效日期',
				dataIndex : 'expirationDate',
				width : 100,
				renderer : function(value){
					if(value != null)
					{
						return value;						
					}
				}
			},  {
				header : '回复次数',
				width : 90,
				dataIndex : 'replyCounts'
			}, {
				header : '浏览数',
				width : 75,
				dataIndex : 'viewCounts'
			},{
				header : '状态',
				width : 60,
				dataIndex : 'state',
				renderer : function(value) {
					var strValue="未知";
					if(value==0)
					{
						strValue="草稿";
					}
					else if(value==1)
					{
						strValue="生效";
					}
					else if(value == 2)
					{
						strValue="<font color='red'>失效</font>";
					}
					return strValue;
				}
			},  {
				header : '审核状态',
				width : 100,
				dataIndex : 'auditingStatus',
				renderer : function(value) {
				var strValue="未知";
			 
					if(value==0)
					{
						strValue='未审核';
					}
					else if(value==1)
					{
						strValue='审核通过';
					}
					else if(value==2)
					{
						strValue='已拒绝';
					} 
					
					return strValue;
				}
			},*//*{
				header : '是否已置顶',
				width : 110,
				dataIndex : 'ordertop',
				renderer : function(value) {
					var str='否';
					if(value==null||value == 0){
					 str = '否';
					}
					else if(value==1)
					{
						str='是';
					}
					return str;
				}
			},*//* {
				header : '序号',
				width : 75,
				dataIndex : 'auditingStatus'
			},*/{
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
					var createuser=1;
//					var auditingStatus =record.data.auditingStatus;//["auditingStatus"];//add by smart on 20110514
 					var str = '';
					/*if(auditingStatus==0)
					{*/
 					if(curUserInfo.isAdmin||curUserInfo.iscommonAdmin||curUserInfo.username==record.get("createUser")){
						if (isGranted('_NoticeDel_'+suffix)) {
							str = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" value=" " class="btn-del" onclick="NoticeView.remove('
									+ editId + ','+suffix+')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';
						}
						if (isGranted('_NoticeEdit_'+suffix)) {
							str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="编辑" value=" " class="btn-edit" onclick="NoticeView.edit('
									+ editId 
									+','
									+type
									+','
									+0
									+','
									+ suffix+','+createuser
									+')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</a>';
/*							str += '&nbsp;&nbsp;<button title="置顶" value=" " class="btn-up" onclick="NoticeView.sort('
								+ editId
								+ ','
								+ 1
								+','
								+suffix
								+ ')">&nbsp</button>&nbsp;&nbsp;<button title="取消置顶" value=" " class="btn-down" onclick="NoticeView.sort('
								+ editId
								+ ','
								+ 0
								+','
								+suffix
								+ ')">&nbsp</button>';*/
						}}
				/*}
				else if(auditingStatus==1||auditingStatus==2)
				{*/
						/*str += '&nbsp;<button title="查看" value=" " class="btn-showDetail" onclick="NoticeView.edit('
								+ editId 
								+','
								+type
								+','
								+1
								+','
								+ suffix+')"></button>';*/
//				}
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
 		params : {
 			start : 0,
 			limit : 20
 		}
 		});

	var grid = new Ext.grid.GridPanel({
		id : 'NoticeGrid'+suffix,
		tbar : this.topbar(),
		region : 'center',
		store : store,
		trackMouseOver : true,
		disableSelection : false,
		loadMask : true,
//		height : 450,
		autoHeight : true,
		autoScroll:true,
		cm : cm,
		sm : sm,
		viewConfig : {
			forceFit : true,
			enableRowBody : false,
			showPreview : false
		},
		bbar : new Ext.PagingToolbar({
					pageSize : 20,
					store : store,
					displayInfo : true,
					displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
					emptyMsg : "当前没有记录",
					doLoad : function(start){
					   	record_start = start;
					          var o = {}, pn = this.getParams();
					          o[pn.start] = start;
					          o[pn.limit] = this.pageSize;
					          this.store.load({params:o});
					     }
				})
	});

	grid.addListener('rowdblclick', function(grid, rowindex, e){
		grid.getSelectionModel().each(function(rec) {
			if (isGranted('_NoticeEdit_'+suffix)) {
				NoticeView.edit(rec.data.noticeId,type,rec.data.auditingStatus,suffix);
			}
		});
	});
	return grid;
};


/**
 * 初始化数据
 */
 
NoticeView.prototype.store = function() {
	 	var type=this.type;
//	var store = new Ext.data.Store({
//		proxy : new Ext.data.HttpProxy({
//			url : __ctxPath + '/info/listNotice.do?Q_type_N_EQ=1&intType='+type
////			url : __ctxPath + '/info/listNotice.do?intType='+type+'&actionFlag=0&Q_auditingStatus_N_EQ=' + auditingStatus//edit by smart on 20110511''
//		}),
//		reader : new Ext.data.JsonReader({
//					root : 'result',
//					totalProperty : 'totalCounts',
//					id : 'id',
//					fields : [{
//						name : 'noticeId',
//						type : 'int'
//					}, 'postName', 'noticeTitle', 'effectiveDate',
//					'expirationDate','attachFiles','state','auditingStatus','replyCounts','viewCounts','ordertop','createUser','createtime']
//				}),
//		remoteSort : true
//	});
	
	var store = new Ext.data.JsonStore({
		url :__ctxPath + '/info/listNotice.do?Q_type_N_EQ=1&intType='+type,
//		baseParams : {
//			archiveType : 1
//		},
		root : 'result',
		totalProperty : 'totalCounts',
		remoteSort : true,
		fields : [{
			name : 'noticeId',
			type : 'int'
		}, 'postName', 'noticeTitle', 'effectiveDate',
		'expirationDate','attachFiles','state','auditingStatus','replyCounts','viewCounts','ordertop','createUser','createtime']
	});
	//store.setDefaultSort('createtime', 'desc');
	//this.store.setDefaultSort('noticeId', 'desc');
	return store;
};

/**
 * 建立操作的Toolbar
 */
NoticeView.prototype.topbar = function() {
	var type = this.type;
	var suffix = this.suffix;  
 
	var toolbar =  new Ext.Toolbar({
			id : 'NoticeFootBar'+suffix,
			height : 30,
			bodyStyle : 'text-align:left',
			items : []
		});
	if (isGranted('_NoticeAdd_'+suffix)) {
	toolbar.add(new Ext.Button({
				iconCls : 'btn-add',
				text : '添加',
				handler : function() {
					//new NoticeForm().show();
					NoticeView.add(type,suffix);//type用于区分公司公告/部门公告/部门文件
				}
			}));
	};
	if (isGranted('_NoticeDel_'+suffix)) {
	toolbar.add(new Ext.Button({
				iconCls : 'btn-del',
				text : '删除',
				//id:'NC_btnDel'+suffix,
				id:'btnDel'+suffix,
				handler : function() { 
					var grid = Ext.getCmp("NoticeGrid"+suffix);
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

					NoticeView.remove(ids,suffix);
				}
			}));
	};//end of the topbar
	return toolbar;
};
 
	
/**
 * 删除单个记录
 */
NoticeView.remove = function(id,suffix) {
 	var grid = Ext.getCmp("NoticeGrid"+suffix);
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
													limit : 20
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
NoticeView.edit = function(id,type,addType,suffix,createuser) {
	new NoticeForm({
		noticeId : id,
		type:type,
		addType:addType,
		suffix:suffix,
		createuser:createuser
	}).show();
};
NoticeView.add = function(type, suffix) {
	new NoticeForm({
 		type:type,
		addType:0,
		createuser:1,
		suffix:suffix
		}).show();
};

/**
 * 类别排序  sortId :需要置顶的ID,opt: 置顶的值
 */
NoticeView.sort = function(sortId, opt,suffix) {
	var grid = Ext.getCmp("NoticeGrid"+suffix);
	Ext.Ajax.request({
				url : __ctxPath + '/info/sortNotice.do',
				method : 'post',
				params : {
					sortId : sortId,
					opt : opt
				},
				success : function() {
					if(opt==1){
									Ext.ux.Toast.msg("信息提示", "成功置顶所选记录！");
									grid.getStore().reload({
												params : {
													start : 0,
													limit : 20
												}
											});
								
				}
				else if(opt==0)
				{
									Ext.ux.Toast.msg("信息提示", "成功取消置顶所选记录！");
									grid.getStore().reload({
												params : {
													start : 0,
													limit : 20
												}
											});
				}
								},
				failure : function() {
					Ext.ux.Toast.msg("操作信息", "操作失败");
 				}
			});
};