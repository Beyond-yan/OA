/**
 * @author:
 * @class AddrbookOuterView
 * @extends Ext.Panel
 * @description [AddrbookOuter]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
AddrbookOuterView = Ext.extend(Ext.Panel,
{
	// 构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		AddrbookOuterView.superclass.constructor.call(this,
		{
			id : 'AddrbookOuterView',
			title : '外部通讯录管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function()
	{
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel(
		{
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
				text : '姓名'
			},
			{
				name : 'Q_personName_S_LK',
				flex : 1,
				width : 150,
				xtype : 'textfield'
			},
			{
				text : '公司'
			},
			{
				name : 'Q_company_S_LK',
				flex : 1,
				width : 150,
				xtype : 'textfield'
			},
			{
				text : '部门'
			},
			{
				name : 'Q_department_S_LK',
				flex : 1,
				width : 150,
				xtype : 'textfield'
			},
			{
				text : '科室'
			},
			{
				name : 'Q_room_S_LK',
				flex : 1,
				width : 150,
				xtype : 'textfield'
			},
			{
				text : '查询',
				scope : this,
				xtype : 'button',
				iconCls : 'btn-search',
				handler : this.search
			},
			{
				text : '重置',
				xtype : 'button',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			}

			]
		});// end of searchPanel

		this.topbar = new Ext.Toolbar(
		{
			items : [
			{
				iconCls : 'btn-add',
				text : '添加',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			},
			{
				iconCls : 'btn-del',
				text : '删除',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			},
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
					window.open( __ctxPath +  '/js/AddrBook.xls    ');
				}
			} ]
		});

		this.rowActions = new Ext.ux.grid.RowActions( {
					header : '管理',
					width : 160,
					actions : [ {
						iconCls : 'btn-del',
						text : '删除',
						qtip : '删除',
						style : 'margin:0 3px 0 3px'
					}, {
						iconCls : 'btn-edit',
						text : '编辑',
						qtip : '编辑',
						style : 'margin:0 3px 0 3px'
					} ],
					listeners : {
									scope : this,
									'action' : this.onRowAction
								}
				});
		this.gridPanel = new HT.GridPanel(
		{
			region : 'center',
			tbar : this.topbar,
			
			// 使用RowActions
			//rowActions : true,
			plugins : this.rowActions,
			id : 'AddrbookOuterGrid',
			url : __ctxPath + "/personal/listAddrbookOuter.do",
			fields : [
			{
				name : 'id',
				type : 'int'
			}, 'personName', 'personSex', 'company', 'department', 'room',
					'officePhone', 'ext', 'mobile', 'shortMobile',
					'createDate', 'createBy', 'updateDate', 'updateBy','email' ],
			columns : [
			{
				header : 'id',
				dataIndex : 'id',
				hidden : true
			},
			{
				header : '姓名',
				dataIndex : 'personName'
			},
			{
				header : '称呼',
				dataIndex : 'personSex',
				renderer : function(value)
				{
					return String(value).replace('1', '先生').replace('2', '女士');
				}
			},
			{
				header : '公司',
				dataIndex : 'company'
			},
			{
				header : '部门',
				dataIndex : 'department'
			},
			{
				header : '科室',
				dataIndex : 'room'
			},
			{
				header : '办公电话',
				dataIndex : 'officePhone'
			},
			{
				header : '内线分机',
				dataIndex : 'ext'
			},
			{
				header : '手机',
				dataIndex : 'mobile'
			},
			{
				header : '短号',
				dataIndex : 'shortMobile'
			},
			{
				header : '邮箱',
				dataIndex : 'email'
			},this.rowActions/*, new Ext.ux.grid.RowActions(
			{
				header : '管理',
				width : 100,
				actions : [
				{
					iconCls : 'btn-del',
					qtip : '删除',
					text : '删除',
					style : 'margin:0 3px 0 3px'
				},
				{
					iconCls : 'btn-edit',
					qtip : '编辑',
					text : '编辑',
					style : 'margin:0 3px 0 3px'
				} ],
				listeners :
				{
					scope : this,
					'action' : this.onRowAction
				}
			}) */]
		// end of columns
				});

		this.gridPanel.addListener('rowdblclick', this.rowClick);
        this.rowActions.on('action',this.onRowAction, this);
	},// end of the initComponents()
	// 重置查询表单
	reset : function()
	{
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function()
	{
		$search(
		{
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e)
	{
		grid.getSelectionModel().each(function(rec)
		{
			new AddrbookOuterForm(
			{
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function()
	{
		new AddrbookOuterForm().show();
	},
	// 按ID删除记录
	removeRs : function(id)
	{
		$postDel(
		{
			url : __ctxPath + '/personal/multiDelAddrbookOuter.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function()
	{
		$delGridRs(
		{
			url : __ctxPath + '/personal/multiDelAddrbookOuter.do',
			grid : this.gridPanel,
			idName : 'id'
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
						url : __ctxPath + '/personal/importExcelAddrbookOuter.do',
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
										Ext.Msg.alert('信息', '通讯录导入成功！');
										Ext.getCmp('UploadAddrBKOuterWin').close();
										
										var gridPanel = Ext.getCmp('AddrbookOuterGrid');
										if (gridPanel != null) 
										{
											gridPanel.getStore().reload();
										}
										
									},
									failure : function()
									{
										Ext.Msg.alert('错误', '通讯录导入失败');
										Ext.getCmp('UploadAddrBKOuterWin').close();
									}

									
								});
							}
						} ]// end of buttons  
						}) // end of FormPanel
					]// end of Window's items
				}).show();
	},
	// 编辑Rs
	editRs : function(record)
	{
		new AddrbookOuterForm(
		{
			id : record.data.id
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col)
	{
		switch (action)
		{
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

