Ext.ns('CheckSelectView');

/**
 * @author:Ropen
 * @class ArchivesDraftManage
 * @extends Ext.Panel
 * @description 事项查询
 */
CheckSelectView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	searchPanel : null,
	// 数据展示Panel
	gridPanel : null,
	// GridPanel的数据Store
	store : null,
	// 头部工具栏
	topbar : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		CheckSelectView.superclass.constructor.call(this, {
					id : 'CheckSelectView',
					iconCls : 'menu-archive-draft',
					title : '事项查询',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel,this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			height : 88,
			region : 'north',
			frame : false,
			id : 'CheckSelectViewSearchForm',
			layout : 'form',
			bodyStyle : 'padding:5px',
			defaults : {
				border : false
			},
			items : [{
				name : 'Q_createtime_D_GE',
				xtype : 'hidden',
				id : 'Q_createtime_D_GEView'
			}, {
				xtype : 'hidden',
				name : 'Q_createtime_D_LE',
				id : 'Q_createtime_D_LEView'
			},{
				name : 'Q_limitdate_D_GE',
				xtype : 'hidden',
				id : 'Q_limitdate_D_GEView'
			}, {
				xtype : 'hidden',
				name : 'Q_limitdate_D_LE',
				id : 'Q_limitdate_D_LEView'
			},{
				layout : 'column',
				defaults : {
					border : false
				},
				items : [{
					columnWidth : .25,
					layout : 'form',
					defaults : {
						border : false,
						anchor : '96%,96%'
					},
					items : [{
						fieldLabel : '事项名称',
						name : 'Q_name_S_LK',
						id:'checkSelectNameView',
						xtype : 'textfield',
						width : 180
					},{
						fieldLabel : '事项状态',
						xtype : 'combo',
						hiddenName : 'Q_status_N_EQ',
						id:'checkSelectStatusView',
						mode : 'local',
						editable : false,
						value : '0',
						triggerAction : 'all',
						store : [['0', '办理中'],
								['1', '已办结'],['', '全部']]
					}]
				},{
					columnWidth : .25,
					layout : 'form',
					defaults : {
						border : false,
						anchor : '96%,96%'
					},
					items:[{
						fieldLabel:'限办日期起',
						xtype : 'datefield',
						id:'checkSelectLimitdateSView',
						format : 'Y-m-d',
						width:160,
						listeners : {
							select : function() {
								Ext.getCmp('Q_limitdate_D_GEView').setValue(Ext.util.Format.date(this.getValue(), 'Y-m-d') + ' 00:00:00');
							}
						}
					},{
						fieldLabel:'登记日期起',
						id:'checkSelectCreatetimeSView',
						xtype : 'datefield',
						format : 'Y-m-d',
						width:160,
						listeners : {
							select : function() {
								Ext.getCmp('Q_createtime_D_GEView').setValue(Ext.util.Format.date(this.getValue(), 'Y-m-d') + ' 00:00:00');
							}
						}
					}]
				},{
					columnWidth : .25,
					layout : 'form',
					defaults : {
						border : false,
						anchor : '96%,96%'
					},
					items:[{
						fieldLabel:'限办日期止',
						id:'checkSelectLimitdateEView',
						xtype : 'datefield',
						format : 'Y-m-d',
						width:160,
						listeners : {
							select : function() {
								Ext.getCmp('Q_limitdate_D_LEView').setValue(Ext.util.Format.date(this.getValue(), 'Y-m-d') + ' 23:59:59');
							}
						}
					},{
						fieldLabel:'登记日期止',
						id:'checkSelectCreatetimeEView',
						xtype : 'datefield',
						format : 'Y-m-d',
						width:160,
						listeners : {
							select : function() {
								Ext.getCmp('Q_createtime_D_LEView').setValue(Ext.util.Format.date(this.getValue(), 'Y-m-d') + ' 23:59:59');
							}
						}
					}]
				},{
					columnWidth : .25,
					layout : 'form',
					defaults : {
						border : false,
						anchor : '96%,96%'
					},
					items : [/*{
						fieldLabel : '进度状态',
						xtype : 'combo',
						hiddenName : 'processStatus',
						id:'processStatusView',
						mode : 'local',
						editable : false,
						value : '',
						triggerAction : 'all',
						store : [ ['0', '可以新增'],['', '全部状态']]
					},*/{
						fieldLabel : '事项分类',
						xtype : 'combo',
						hiddenName : 'Q_type_N_EQ',
						id:'checkSelectTypeView',
						mode : 'local',
						editable : false,
						value : '',
						triggerAction : 'all',
						store : [['1', '市领导批示'],['2', '重要决策部署'],['3', '主任会党委会'],['4', '委领导指示'],['5', '其他'],['', '全部']]
					}]
				}]
			},{
				xtype : 'panel',
				border : false,
				layout : 'hbox',
				layoutConfig : {
					pack : 'center',
					align : 'middle'
				},
				items : [{
					xtype : 'button',
					text : '查询',
					iconCls : 'search',
					handler : this.search.createCallback(this)
				}, {
					xtype : 'button',
					text : '重置',
					style : 'padding-left:5px;',
					iconCls : 'btn-reseted',
					handler : function() {
						var searchPanel = Ext
								.getCmp('CheckSelectViewSearchForm');
						searchPanel.getForm().reset();
					}
				},{
				    xtype:'button',
					iconCls : 'excel-cls',
					 style : 'padding-left:10px;',
					text : '导出Excel',
					handler : this.tableToExcel.createCallback(this)
				}]
			}]
		});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
			url : __ctxPath + "/work/listWorkContent.do",
			root : 'result',
			baseParams : {
				'Q_status_N_EQ':0
			},
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : [{
						name : 'id',
						type : 'int'
					}, 'name','deptname','deptid','limitdate', 'username','userid', 'createtime','status','type']
		});
		this.store.setDefaultSort('orderid', 'desc');
		// 加载数据
		this.store.load({
			params : {
				start : 0,
				limit : 25
			}
		});

		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'id',
						dataIndex : 'id',
						hidden : true
					},{
						header : '事项名称',
						width:150,
						dataIndex : 'name',
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var id = record.data.id;
							var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'"  onclick="CheckSelectView.detail('
									+ id
									+ ')">'
									+ value
									+ '</a>';
							return str;
						}
					},{
						header : '事项分类',
						dataIndex : 'type',
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var str = '';
							if(value==1){
								str="市领导批示";
							}else if(value==2){
								str="重要决策部署";
							}else if(value==3){
								str="主任会党委会";
							}else if(value==4){
								str="委领导指示";
							}else if(value==5){
								str="其他";
							}
							return str;
						}
					},{
						header : '责任部门',
						dataIndex : 'deptname'
					}, {
						header : '登记日期',
						dataIndex : 'createtime'
					},{
						header : '限办日期',
						dataIndex : 'limitdate'
					},{
						header : '事项状态',
						dataIndex : 'status',
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var str = '';
							if(value==0){
								str="办理中";
							}else if(value==1){
								str="已办结";
							}
							return str;
						}
					},{
						header : '管理',
						width : 130,
						sortable : false,
						dataIndex : 'id',
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var id = record.data.id;
							var deptId=record.data.deptid+",";
							var str = '';
							if(curUserInfo.isArchivesManager||curUserInfo.isAdmin){
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="删除" value=" " class="btn-del" onclick="CheckSelectView.remove('
										+ id
										+ ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</a>';
								str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="编辑" value=" " class="btn-archive-draft" onclick="CheckSelectView.edit('
										+ id
										+ ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</a>';
							}
							if(curUserInfo.isOfficeDirector||curUserInfo.isOfficeDeputyDirector){
								if(deptId.indexOf(curUserInfo.depId)!=-1){
									str += '<a href="#" style="text-decoration:none;color:#3D3D3D" title="人员变更" value=" " class="btn-archive-draft" onclick=CheckSelectView.editUser('
										+ id
										+ ',"'
										+ record.data.userid
                                        + '","'
                                        + record.data.username
										+ '")>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;人员变更</a>';
								}
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
		// 初始化工具栏
		this.topbar = new Ext.Toolbar({
			height : 30,
			bodyStyle : 'text-align:left',
			items : [{
				iconCls : 'btn-add',
				text : '事项登记',
				xtype : 'button',
				handler : function() {
					new CheckSelectAddView().show();
				}
			}]
		});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'CheckSelectViewGrid',
					region : 'center',
					stripeRows : true,
					tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					height : 600,
					cm : cm,
					sm : sm,
					plugins : this.rowActions,
					viewConfig : {
						forceFit : true,
						autoFill : true, // 自动填充
						forceFit : true
						// showPreview : false
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

	},// end of the initComponents()
	//把表格导出到Excel
	tableToExcel:function (self) {
		var recordCount = self.store.getCount();
		if (recordCount > 0) {
			var url  = __ctxPath
	+ '/flow/workContentToExcelDownLoad.do?'
	+ 'Q_name_S_LK='+ Ext.getCmp('checkSelectNameView').getValue()
	+'&Q_status_N_EQ='+Ext.getCmp('checkSelectStatusView').getValue()
	+ '&Q_limitdate_D_GE=' + Ext.getCmp('checkSelectLimitdateSView').getValue()
	+ '&Q_limitdate_D_LE=' + Ext.getCmp('checkSelectLimitdateEView').getValue()
	+'&Q_createtime_D_GE='+Ext.getCmp('checkSelectCreatetimeSView').getValue()
	+ '&Q_createtime_D_LE='+ Ext.getCmp('checkSelectCreatetimeEView').getValue()
	+ '&processStatus='+ Ext.getCmp('processStatusView').getValue();
	url = encodeURI(url);
	url = encodeURI(url);
	window.location.href=url;
		} else {
			Ext.Msg.alert("提示", "没有数据需要导出！")
		}
	} ,
	/**
	 * 
	 * @param {}
	 *            self 当前窗体对象
	 */
	search : function(self) {
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
				searchPanel : self.searchPanel,
				gridPanel : self.gridPanel
			});
		}
	},

	/**
	 * 添加记录
	 */
	createRecord : function() {
		new ArchivesDraftView().show();
	},
	/**
	 * 按IDS删除记录
	 * 
	 * @param {}
	 *            ids
	 */
	delByIds : function(ids) {
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
					if (btn == 'yes') {
						Ext.Ajax.request({
									url : __ctxPath
											+ '/archive/multiDelArchives.do',
									params : {
										ids : ids
									},
									method : 'POST',
									success : function(response, options) {
										Ext.ux.Toast.msg('操作信息', '成功删除该信息！');
										Ext.getCmp('CheckSelectViewGrid').getStore()
												.reload();
									},
									failure : function(response, options) {
										Ext.ux.Toast
												.msg('操作信息', '操作出错，请联系管理员！');
									}
								});
					}
				});// end of comfirm
	}
});
CheckSelectView.detail = function(id) {
	new CheckSelectDetailView({
		id:id
	}).show();
}
/**
 * 修改
 */
CheckSelectView.edit = function(id) {
	new CheckSelectAddView({
		id:id
	}).show();
}
CheckSelectView.editUser = function(id,userid,username) {
	new CheckSelectEditUser({
		id:id,
		userid:userid,
		username:username
	}).show();
}
/**
 * 删除
 * 
 * @param {}
 *            ids
 */
CheckSelectView.remove = function(ids) {
	Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath
						+ '/work/delWorkContent.do',
				params : {
					ids : ids
				},
				method : 'POST',
				success : function(response, options) {
					Ext.ux.Toast.msg('操作信息', '成功删除该登记单！');
					Ext.getCmp('CheckSelectViewGrid').getStore().reload();
				},
				failure : function(response, options) {
					Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
				}
			});
		}
	});
}
