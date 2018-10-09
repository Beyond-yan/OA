/**
 * @author:
 * @class ProWagedetailsView
 * @extends Ext.Panel
 * @description 工资明细管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProWageView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProWageView.superclass.constructor.call(this, {
					id : 'ProWageView',
					title : '工资管理',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		var nowdate = new Date();
		var nowMonth = nowdate.getMonth() + 1;
		var nowYear = nowdate.getFullYear();
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
					id : 'ProWageSearchForm',
					height : 40,
					region : 'north',
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
								text : '工号'
							}, {
								xtype : 'textfield',
								name : 'Q_appUser.username_S_LK'
							}, {
								text : '年'
							}, {
								xtype : 'textfield',
								name : 'Q_wageDateY_S_EQ'
							}, {
								text : '月份'
							}, {
								xtype : 'textfield',
								name : 'Q_wageDateM_S_EQ'
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext
											.getCmp('ProWageSearchForm');
									var grid = Ext.getCmp('ProWageGrid');
									if (searchPanel.getForm().isValid()) {
										$search({
													searchPanel : searchPanel,
													gridPanel : grid
												});
									}
								}
							}, {
								xtype : 'button',
								text : '重置',
								iconCls : 'btn-reset',
								handler : function() {
									var searchPanel = Ext
											.getCmp('ProWageSearchForm');
									searchPanel.getForm().reset();

								}
							}]

				});// end of searchPanel

		this.topbar = new Ext.Toolbar({
					items : [{
								iconCls : 'excel-cls',
								text : '导入Excel',
								xtype : 'button',
								scope : this,
								handler : this.importFromExcel
							}, {
								iconCls : 'btn-del',
								text : '删除',
								xtype : 'button',
								scope : this,
								handler : this.removeSelRs
							}, {
								iconCls : 'menu-message',
								text : '发短信',
								xtype : 'button',
								scope : this,
								handler : this.wageMobiles
							}, {
								iconCls : 'menu-leader-mail',
								text : '发邮件',
								xtype : 'button',
								scope : this,
								handler : this.wageMails
							}]
				});

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/wage/listProWage.do",
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'id',
								type : 'int'
							}, {
								name : 'username',
								mapping : 'appUser.username'
							}, {
								name : 'fullname',
								mapping : 'appUser.fullname'
							},

							'userId', 'wageDateY', 'wageDateM', 'isdel',
							'isMobile', 'isEmail', 'createDate', 'createBy',
							'updateDate', 'updateBy']
				});
		// 加载数据
		this.store.load({
					params : {
						'Q_wageDateM_S_EQ' : nowMonth,
						'Q_wageDateY_S_EQ' : nowYear
					}
				});
		this.gridPanel = new HT.GridPanel({
			// this.gridPanel = new Ext.grid.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			stripeRows : true,
			disableSelection : false,
			store : this.store,
			id : 'ProWageGrid',
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, {
						header : '工号',
						dataIndex : 'username'
					}, {
						header : '姓名',
						dataIndex : 'fullname'
					}, {
						header : '年',
						dataIndex : 'wageDateY'
					}, {
						header : '月份',
						dataIndex : 'wageDateM'
					}, {
						header : '是否已发送短信',
						dataIndex : 'isMobile',
						renderer : function(value) {
							if (value == '0') {
								return '否';
							} else if (value == '1') {
								return '是';
							} else {
								return '否';
							}
						}
					}, {
						header : '是否已发送邮件',
						dataIndex : 'isEmail',
						renderer : function(value) {
							if (value == '0') {
								return '否';
							} else if (value == '1') {
								return '是';
							} else {
								return '否';
							}
						}
					}, new Ext.ux.grid.RowActions({
								header : '管理',
								width : 100,
								actions : [{
											iconCls : 'btn-del',
											qtip : '删除',
											style : 'margin:0 3px 0 3px'
										}, {
											iconCls : 'menu-message',
											qtip : '发短信',
											style : 'margin:0 3px 0 3px'
										}, {
											iconCls : 'menu-leader-mail',
											qtip : '发邮件',
											style : 'margin:0 3px 0 3px'
										}],
								listeners : {
									scope : this,
									'action' : this.onRowAction
								}
							})]
				// end of columns
			});

		// this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search({
					searchPanel : this.searchPanel,
					gridPanel : this.gridPanel
				});
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/wage/multiDelProWage.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs({
					url : __ctxPath + '/wage/multiDelProWage.do',
					grid : this.gridPanel,
					idName : 'id'
				});
	},

	// 导入Excel
	importFromExcel : function() {
		new Ext.Window({
			id : 'UploadAddrBKOuterWin',
			title : '选择Excel',
			layout : 'fit',
			width : 300,
			height : 150,
			closeAction : 'close',
			items : [new Ext.form.FormPanel({
				id : 'UploadAddrBKOuterForm',
				bodyStyle : 'padding:10px',
				labelAlign : 'right',
				labelWidth : 60,
				url : __ctxPath + '/wage/importExcelProWage.do',
				fileUpload : true,
				enctype : 'multipart/form-data',

				items : [new Ext.ux.form.FileUploadField({
							id : 'file',
							buttonText : '浏览...',
							AllowBlank : false,
							BlankText : '请选择上传资源',
							width : 190
						})],
				buttons : [{
					text : '上传',
					handler : function() {
						var fm = Ext.getCmp('UploadAddrBKOuterForm');
						fm.getForm().submit({
							waitMsg : '工资导入中，请稍候',
							success : function(fp, action) {
								Ext.Msg.alert('信息', '工资明细导入成功！');
								Ext.getCmp('UploadAddrBKOuterWin').close();
								Ext.getCmp('ProWageGrid').getStore().reload();
							},
							failure : function(fp, action) {
								var result=Ext.util.JSON
										.decode(action.response.responseText);
								Ext.MessageBox.show({
									title : '操作信息',
									msg : '工资明细导入完成。共有数据'+result.totalNum+'笔,其中成功完成'
											+ result.successNum
											+ '笔,未成功导入部分的原因为:' + result.reason,
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
								Ext.getCmp('UploadAddrBKOuterWin').close();
								Ext.getCmp('ProWageGrid').getStore().reload();
							}

						});
					}
				}]
					// end of buttons
			}) // end of FormPanel
			]
				// end of Window's items
		}).show();
	},
	wageMails : function() {
		var grid = Ext.getCmp('ProWageGrid');
		var rows = grid.getSelectionModel().getSelections();
		var ids = '';

		for (var i = 0; i < rows.length; i++) {
			if (i > 0) {
				ids += ',';
			}
			ids += rows[i].data.id;
		}
		Ext.Ajax.request({
					url : __ctxPath + '/wage/sendWageEmailProWage.do?ids='
							+ ids,
					// params:{
					// ids : ids
					// },
					success : function(userform, o) {
						Ext.ux.Toast.msg('操作信息', '邮件发送成功！');
						Ext.getCmp('ProWageGrid').getStore().reload();
					}
				});
	},

	wageMobiles : function() {
		var grid = Ext.getCmp('ProWageGrid');
		var rows = grid.getSelectionModel().getSelections();
		var ids = '';
		for (var i = 0; i < rows.length; i++) {
			if (i > 0) {
				ids += ',';
			}
			ids += rows[i].data.id;
		}

		Ext.Ajax.request({
					url : __ctxPath + '/wage/sendWageMoblieProWage.do?ids='
							+ ids,
					// params:{
					// ids : ids
					// },
					success : function(userform, o) {
						Ext.ux.Toast.msg('操作信息', '短信发送成功！');
						Ext.getCmp('ProWageGrid').getStore().reload();
					}
				});
	},
	// 按ID发送短信记录
	wageMobile : function(id) {
		Ext.Ajax.request({
			url : __ctxPath + '/wage/sendWageMoblieProWage.do',
			params : {
				ids : id
			},
			success : function(userform, o) {
				Ext.ux.Toast.msg('操作信息', '短信发送成功！');
				Ext.getCmp('ProWageGrid').getStore().reload();
			}
				// grid : this.gridPanel
			});
	},

	// 按ID发送邮件记录
	wageEmail : function(id) {
		Ext.Ajax.request({
			url : __ctxPath + '/wage/sendWageEmailProWage.do',
			params : {
				ids : id
			},
			success : function(userform, o) {
				Ext.ux.Toast.msg('操作信息', '邮件发送成功！');
				Ext.getCmp('ProWageGrid').getStore().reload();
			}

				// grid : this.gridPanel
			});
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-del' :
				this.removeRs.call(this, record.data.id);
				break;
			case 'menu-message' :
				this.wageMobile.call(this, record.data.id);
				break;
			case 'menu-leader-mail' :
				this.wageEmail.call(this, record.data.id);
				break;
			default :
				break;
		}
	}
});
