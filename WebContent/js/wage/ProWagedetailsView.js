/**
 * @author:
 * @class ProWagedetailsView
 * @extends Ext.Panel
 * @description 工资明细管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProWagedetailsView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProWagedetailsView.superclass.constructor.call(this, {
			id : 'ProWagedetailsView',
			title : '工资明细管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {

			id : 'ProWageDetailsSearchForm',
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
			items : [ {
				text : '工号'
			}, {
				xtype : 'textfield',
				name : 'Q_appUser.username_S_LK'
			}, {
				text : '年'
			}, {
				xtype : 'textfield',
				name : 'Q_year_S_EQ'
			}, {
				text : '月份'
			}, {
				xtype : 'textfield',
				name : 'Q_month_S_EQ'
			}, {
				xtype : 'button',
				text : '查询',
				iconCls : 'search',
				handler : function() {
					var searchPanel = Ext.getCmp('ProWageDetailsSearchForm');
					var grid = Ext.getCmp('ProWagedetailsGrid');
					if (searchPanel.getForm().isValid()) {
						$search( {
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
					var searchPanel = Ext.getCmp('ProWageDetailsSearchForm');
					searchPanel.getForm().reset();

				}
			} ]

		});// end of searchPanel

		this.topbar = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-add',
				text : '添加',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}, {
				iconCls : 'btn-del',
				text : '删除',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			}, {
				iconCls : 'excel-cls',
				text : '导入Excel',
				xtype : 'button',
				scope : this,
				handler : this.importFromExcel
			} ]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ProWagedetailsGrid',
			url : __ctxPath + "/wage/listProWagedetails.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, {
				name : 'username',
				mapping : 'appUser.username'
			},{
				name : 'fullname',
				mapping : 'appUser.fullname'
			},  {
				name : 'name',
				mapping : 'proWageconfig.name'
			},  {
				name : 'nametype',
				mapping : 'proWageconfig.proWagetype.name'
			}, 'userid', 'value', 'wageconfigId', 'wageDate', 'isdel',
					'createDate', 'createBy', 'updateDate', 'updateBy', 'year',
					'month' ],
			columns : [ {
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
				header : '项目',
				dataIndex : 'name'
			}, {
				header : '项目类型',
				dataIndex : 'nametype'
			},{
				header : '金额(元)',
				dataIndex : 'value'
			}, {
				header : '年',
				dataIndex : 'year'
			}, {
				header : '月份',
				dataIndex : 'month'
			}, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ 
//				{
//					iconCls : 'btn-del',
//					qtip : '删除',
//					style : 'margin:0 3px 0 3px'
//				}
//				, 
				{
					iconCls : 'btn-edit',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px'
				}
				],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		// end of columns
				});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search( {
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new ProWagedetailsForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new ProWagedetailsForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/wage/multiDelProWagedetails.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/wage/multiDelProWagedetails.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new ProWagedetailsForm( {
			id : record.data.id
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.id);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		default:
			break;
		}
	},

	// 导入Excel
	importFromExcel : function() {
		new Ext.Window( {
			id : 'UploadAddrBKOuterWin',
			title : '选择Excel',
			layout : 'fit',
			width : 300,
			height : 150,
			closeAction : 'close',
			items : [ new Ext.form.FormPanel( {
				id : 'UploadAddrBKOuterForm',
				bodyStyle : 'padding:10px',
				labelAlign : 'right',
				labelWidth : 60,
				url : __ctxPath + '/wage/importExcelProWagedetails.do',
				fileUpload : true,
				enctype : 'multipart/form-data',
                 
				items : [ new Ext.ux.form.FileUploadField( {
					id : 'file',
					buttonText : '浏览...',
					AllowBlank : false,
					BlankText : '请选择上传资源',
					width : 190
				}) ],
				buttons : [ {
					text : '上传',
					handler : function() {
						var fm = Ext.getCmp('UploadAddrBKOuterForm');
						fm.getForm().submit( {
							waitMsg:'工资导入中，请稍候',
							success : function(form, action) {
								Ext.Msg.alert('信息', '工资明细导入成功！');
								Ext.getCmp('UploadAddrBKOuterWin').close();
								Ext.getCmp('ProWagedetailsGrid').getStore().reload();
							},
							failure : function() {
								Ext.Msg.alert('错误', '工资明细导入失败');
								Ext.getCmp('UploadAddrBKOuterWin').close();
							}

						});
					}
				} ]
			// end of buttons
					}) // end of FormPanel
			]
		// end of Window's items
				}).show();
	}
});
