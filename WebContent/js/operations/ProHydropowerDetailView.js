/**
 * @author:
 * @class ProHydropowerDetailView
 * @extends Ext.Panel
 * @description 水电费明细管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProHydropowerDetailView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProHydropowerDetailView.superclass.constructor.call(this, {
			id : 'ProHydropowerDetailView',
			title : '水电费明细管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {
			height : 40,
			frame : false,
			region : 'north',
			layout : 'hbox',
			layoutConfig :
			{
				padding : '5',
				align : 'middle'
			},
			defaults :
			{
				xtype : 'label',
				margins :
				{
					top : 0,
					right : 4,
					bottom : 4,
					left : 4
				}
			},
			items : [ 
			          
			 {
				text : '房间编号'
			},
			{
				name : 'Q_proDormRoom.code_S_LK',
				flex : 1,
				xtype : 'textfield'
			}, 
			 {
				text : '统计开始时间'
			},{
				name : 'Q_startTime_D_GE',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				text : '统计截止时间'
			},{
				name : 'Q_endTime_D_LE',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			} ,
			 {
				text : '查询',
				scope : this,
				xtype : 'button',
				iconCls : 'btn-search',
				handler : this.search
			}, {
				text : '重置',
				scope : this,
				xtype : 'button',
				iconCls : 'btn-reset',
				handler : this.reset
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
			} ,
			{
				iconCls : 'excel-cls',
				text : '导入Excel',
				xtype : 'button',
				scope : this,
				handler : this.importFromExcel
			},
			{
				iconCls : 'btn-downLoad',
				text : 'Excel模板',
				xtype : 'button',
				handler : function()
				{
					window.open( __ctxPath +  '/js/fee.xls    ');
				}
			}]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ProHydropowerDetailGrid',
			url : __ctxPath + "/operations/listProHydropowerDetail.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, {
				name : 'code',
				mapping : 'proDormRoom.code'
			}, 'type', 'lastMonthAmount', 'thisMonthAmount', 'useAmount',
					'basicPrice', 'unitPrice', 'startTime', 'endTime', 'ref1',
					'ref2', 'ref3', 'createDate', 'createBy', 'updateDate',
					'updateBy' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '房间编号',
				dataIndex : 'code'
			}, {
				header : '水电费类型',
				dataIndex : 'type',
				renderer : function(value) {
					if (value == '1') {
						return '水费';
					}
					if (value == '2') {
						return '电费';
					}
				}
			}, {
				header : '上月使用量',
				dataIndex : 'lastMonthAmount'
			}, {
				header : '本月使用量',
				dataIndex : 'thisMonthAmount'
			},
			{
				header : '使用量',
				dataIndex : 'useAmount'
			}, 
			{
				header : '统计开始时间',
				dataIndex : 'startTime'
			}, {
				header : '统计截止时间',
				dataIndex : 'endTime'
			}, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ {
					iconCls : 'btn-del',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-edit',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px'
				} ],
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
			new ProHydropowerDetailForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new ProHydropowerDetailForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/operations/multiDelProHydropowerDetail.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	

	// 导入Excel
	importFromExcel:function()
	{
		new Ext.Window(
				{
					id:'UploadAddrBKOuterWin',
					title:'选择Excel',
					layout : 'fit',
					width : 300,
					height : 150,
					closeAction : 'close',
					items : [ new Ext.form.FormPanel(
					{
						id:'UploadAddrBKOuterForm',
						bodyStyle : 'padding:10px',
						labelAlign : 'right',
						labelWidth : 60,
						url : __ctxPath + '/operations/importExcelProHydropowerDetail.do',
						fileUpload: true, 
					    enctype:'multipart/form-data', 
					    
						items : [
						          new Ext.ux.form.FileUploadField({
						        	  id: 'file',
						        	  buttonText:'浏览...',
				                      AllowBlank:false, 
				                      BlankText:'请选择上传资源', 
						             width: 190
						         }) ],
						buttons : [
						{
							text : '上传',
							handler : function()
							{
							   var fm = Ext.getCmp('UploadAddrBKOuterForm');
							   
							   fm.getForm().submit(
								{
									success : function(form, action)
									{
										Ext.Msg.alert('信息', '水电费明细导入成功！');
										Ext.getCmp('UploadAddrBKOuterWin').close();
									},
									failure : function()
									{
										Ext.Msg.alert('错误', '水电费明细导入失败');
										Ext.getCmp('UploadAddrBKOuterWin').close();
									}

									
								});
							}
						} ]// end of buttons  
						}) // end of FormPanel
					]// end of Window's items
				}).show();
	},
	
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/operations/multiDelProHydropowerDetail.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new ProHydropowerDetailForm( {
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
	}
});
