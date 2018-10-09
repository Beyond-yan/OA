Ext.ns('LeaveViewStatic');

/**
 * @author:Ropen
 * @class ArchivesDraftManage
 * @extends Ext.Panel
 * @description 拟稿管理
 */
LeaveViewStatic = Ext.extend(Ext.Panel, {
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
		LeaveViewStatic.superclass.constructor.call(this, {
			id : 'LeaveViewStatic',
			iconCls : 'menu-leave-static',
			title : '统计信息',
			region : 'center',
			layout : 'border',
			items : [this.searchPanel, this.gridPanel]
		});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var _url = __ctxPath + '/system/listByDepIdDepartment.do?depId='+roleMap.get('DepartmentCommonId');
		var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}
		var arr2 = [];
		for (var i = 1; i <= 12; i++) {
			arr2[i] = i;
		}
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			height : 120,
			region : 'north',
			frame : false,
			id : 'LeaveViewStaticSearchForm',
			layout : 'form',
			bodyStyle : 'padding:5px',
			defaults : {
				border : false
			},
			items : [{
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
								xtype : 'combo',
								fieldLabel : "休假类别",
								name : 'Q_privacyLevel_S_EQ',
								id : 'LeaveViewStaticStart.privacyLevel',
								triggerAction : 'all',
								lazyRender : true,
								editable : false,
								width : 780,
								store : ['事假','病假','年休假','探亲假','婚假','产假','丧假','学习假','考试假','补休','其他']
							}]
						},{
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '标题',
								name : 'Q_subject_S_LK',
								id : 'LeaveViewStaticStart.subject',
								xtype : 'textfield',
								width : 180
							}]
						},{
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [new TreeSelectorName('depTreeSelectorStatic', _url, '部门',
									'LeaveViewStaticStart.issueDep', true)]
						},{
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '职务',
								name : 'Q_typeName_S_LK',
								id : 'LeaveViewStaticStart.typeName',
								xtype : 'combo',
								editable : false,
								width : 180,	
								store : ['局领导','处长','副处长','调研员、副调研员','主任科员及以下']
							}]
						},{
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '年份',
								width : 130,
								xtype : 'combo',
								mode : 'local',
								editable : false,
								id : 'LeaveViewStaticStart.year',
								triggerAction : 'all',
								store : arr,
								emptyText : '',
								listeners : {
									select : function() {
										Ext.getCmp('LeaveViewStaticStart.archivesNoBegin').setValue((this.getValue() + '-01-01'));
										Ext.getCmp('LeaveViewStaticStart.archivesNoEnd').setValue(((this.getValue()+1) + '-01-01'));
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
							items : [{
								fieldLabel : '月份',
								width : 130,
								xtype : 'combo',
								mode : 'local',
								editable : false,
								id : 'LeaveViewStaticStart.month',
								triggerAction : 'all',
								store : arr2,
								emptyText : '',
								listeners : {
									select : function() {
										var year=Ext.getCmp('LeaveViewStaticStart.year').getValue();
										var month=this.getValue();
										if(year==""){
											Ext.ux.Toast.msg('操作信息', '请先选择年份！');
											Ext.getCmp('LeaveViewStaticStart.month').setValue('');
										}else{
											if(month<10){
												Ext.getCmp('LeaveViewStaticStart.archivesNoBegin').setValue((year +'-0'+month+'-01'));
											}else{
												Ext.getCmp('LeaveViewStaticStart.archivesNoBegin').setValue((year +'-'+month+'-01'));
											}
											if(month==12){
												Ext.getCmp('LeaveViewStaticStart.archivesNoEnd').setValue(((year+1) +'-01-01'));
											}
											else if(month<9){
												Ext.getCmp('LeaveViewStaticStart.archivesNoEnd').setValue((year +'-0'+(month+1)+'-01'));
											}else{
												Ext.getCmp('LeaveViewStaticStart.archivesNoEnd').setValue((year +'-'+(month+1)+'-01'));
											}
										}
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
							items : [{
								xtype : 'datetimefield',
								format : 'Y-m-d',
								name : 'Q_createtime_D_GE',
								editable : false,
								id : 'LeaveViewStaticStart.signDate',
								allowBlank : true,
								fieldLabel : '开始时间'
							}]
						},{
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								xtype : 'datetimefield',
								format : 'Y-m-d',
								name : 'Q_createtime_D_LE',
								editable : false,
								id : 'LeaveViewStaticStart.receiveDate',
								allowBlank : true,
								fieldLabel : '结束时间'
							}]
						},{
							columnWidth : .25,
							layout : 'form',
							defaults : {
								border : false,
								anchor : '96%,96%'
							},
							items : [{
								fieldLabel : '申请人',
								name : 'Q_handlerUids_S_LK',
								id : 'LeaveViewStaticStart.handlerUids',
								xtype : 'textfield',
								width : 180
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
								var searchPanel = Ext.getCmp('LeaveViewStaticSearchForm');
								searchPanel.getForm().reset();
							}
						},{
						    xtype:'button',
							iconCls : 'excel-cls',
							 style : 'padding-left:10px;',
							text : '导出Excel',
							handler : this.tableToExcel.createCallback(this)
						}]
					},{
						xtype : 'hidden',
						name : 'Q_archType_SN_EQ',
						value : 88
					}	, {
						xtype : 'hidden',
						name : 'Q_status_SN_EQ',
						value : 2
					},/*{
						xtype : 'hidden',
						name : 'Q_issuerId_L_EQ',
						value : curUserInfo.userId
					},*/{
						xtype : 'hidden',
						name:'Q_issueDep_S_EQ',
						id:'LeaveViewStaticStart.issueDep',
					}]
		});// end of the searchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
			url : __ctxPath + "/leave/listLeaveArchives.do",
			root : 'result',
			baseParams : {
				//'Q_issuerId_L_EQ' : curUserInfo.userId,
				'Q_archType_SN_EQ' : 88,
				'Q_status_SN_EQ' : 2
			},
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : [{
						name : 'archivesId',
						type : 'int'
					}, 'privacyLevel', 'subject', 'archivesNo', 'typeName',
					'sendTo', 'ccTo', 'shortContent', 'handlerUids','issueDep','recDepIds','recDepNames','isdraft', 'createtime']
		});
		this.store.setDefaultSort('archivesId', 'desc');
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
						header : 'archivesId',
						dataIndex : 'archivesId',
						hidden : true
					}, {
						header : '休假类别',
						dataIndex : 'privacyLevel'
					}, {
						header : '文件标题',
						dataIndex : 'subject',
						width : 250,
						renderer : function(value, metadata, Static, rowIndex,
								colIndex) {
								    metadata.attr = 'style="white-space:normal;"'; 
									var str='';
									if(Static.data.isComSetting==1){
										str+='<img src="'+__ctxPath +'/images/system/flower.png" style="height:12px;width:13px;"/>'
									}
							 str += '<a href="#"  title='+value+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="LeaveViewStatic.detail('
									+ Static.data.archivesId
									+ ','
									+ Static.data.runId
									+ ','
									+ 63383333
									+ ')">'
									+ value
									+ '</a>';
							return str;
						}
					}, {
						header : '部门',
						dataIndex : 'issueDep'
					}, {
						header : '职务',
						dataIndex : 'typeName'
					}, {
						header : '申请人',
						dataIndex : 'handlerUids'
					}, {
						header : '请假时间',
						dataIndex : 'archivesNo'
					},{
						header : '休假天数',
						dataIndex : 'sendTo'
					}, {
						header : '管理',
						width : 100,
						sortable : false,
						renderer : function(value, metadata, Static, rowIndex,
								colIndex) {
							var editId = Static.data.archivesId;
							var defId = Static.data.recDepIds;
							var flowName = Static.data.recDepNames;
							var str = '';
							 str += '<a href="#"  title='+value+' style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="LeaveViewStatic.detail('
								+ Static.data.archivesId
								+ ','
								+ Static.data.runId
								+ ','
								+ 63383333
								+ ')">流程详情</a>';
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
					items : [
					]
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'LeaveViewStaticGrid',
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
			var url  = __ctxPath+ '/leave/listToExcelLeaveArchives.do?Q_archType_SN_EQ=88&Q_status_SN_EQ=2'
			//+'&Q_issuerId_L_EQ='+curUserInfo.userId
			+'&Q_privacyLevel_S_EQ='+Ext.getCmp('LeaveViewStaticStart.privacyLevel').getValue()
			+'&Q_subject_S_LK='+Ext.getCmp('LeaveViewStaticStart.subject').getValue()
			+'&Q_typeName_S_LK='+Ext.getCmp('LeaveViewStaticStart.typeName').getValue()
			+'&Q_createtime_D_GE='+Ext.getCmp('LeaveViewStaticStart.archivesNoBegin').getValue()
			+'&Q_createtime_D_LE='+Ext.getCmp('LeaveViewStaticStart.archivesNoEnd').getValue()
			+'&Q_handlerUids_S_LK='+Ext.getCmp('LeaveViewStaticStart.handlerUids').getValue()
			+'&Q_issueDep_S_EQ='+Ext.getCmp('LeaveViewStaticStart.issueDep').getValue()
			;
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
	createStatic : function() {
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
										Ext.ux.Toast.msg('操作信息', '成功删除该拟稿！');
										Ext.getCmp('LeaveViewStaticGrid').getStore()
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
/**
 * 修改
 */
LeaveViewStatic.edit = function(editId, defId, flowName) {
	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);
	if (startForm == null) {
		startForm = new ProcessRunStart({
					id : 'ProcessRunStart' + defId,
					defId : defId,
					archivesId : editId,
					flowName : flowName
				});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
}
/**
 * 删除
 * 
 * @param {}
 *            ids
 */
LeaveViewStatic.remove = function(ids) {
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
					Ext.ux.Toast.msg('操作信息', '成功删除该申请单！');
					Ext.getCmp('LeaveViewStaticGrid').getStore().reload();
				},
				failure : function(response, options) {
					Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
				}
			});
		}
	});
}

/**
 * 展示公文详细信息
 * 
 * @param {}
 *            editId
 */
LeaveViewStatic.detail = function(editId, runId, defId) {
	 Ext.Ajax.request({
		url : __ctxPath + '/leave/getRunIdByArchivesIdLeaveArchives.do',
		params : {
			'archivesId' : editId
		},
		method:'post',
		success : function(response, options) {
			var data = Ext.util.JSON.decode(response.responseText);
			var isGranted=false;
			if(curUserInfo.isOfficeStaffRole||curUserInfo.isAdmin||curUserInfo.isArchivesManager)
			{
			  isGranted=true;
			}
			new LeaveViewDetail({
				archivesId : editId,
				runId : data.runId,
				defId : defId,
				archType : 88,
				isGranted:isGranted
			}).show();
		 }
	 });
}
