/**
 * @author:
 * @class DiningMenuView
 * @extends Ext.Panel
 * @description [DiningMenu]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
DiningMenuView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		DiningMenuView.superclass.constructor.call(this, {
			id : 'DiningMenuView',
			title : '食堂菜单管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel : '菜单日期',
				name : 'Q_menudate_D_EQ',
				flex : 1,
				width : 150,
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				fieldLabel : '供餐食堂:',
				hiddenName : 'Q_diningroom_S_EQ',
				id:'DiningMenuVdiningroom',
				flex : 1,
				width : 150,
				xtype : 'combo',
				editable : true,
				allowBlank : true,
				triggerAction : 'all',
				displayField : 'configname',
				valueField : 'configname',
				mode : 'local',
				store : new Ext.data.SimpleStore(
						{
							autoLoad : true,
							url : __ctxPath + '/diningMgnt/getDiningRoomComboDiningBooking.do',
							fields : [ 'configname','configname' ]
						})
			}, {
				fieldLabel : '用餐类别:',
				hiddenName : 'Q_diningMealtype.id_L_EQ',
				id:'DiningMenuVmealtypeid',
				flex : 1,
				width : 150,
				xtype : 'combo',
				editable : true,
				allowBlank : true,
				triggerAction : 'all',
				displayField : 'typename',
				valueField : 'id',
				mode : 'local',
				store : new Ext.data.SimpleStore(
						{
							autoLoad : true,
							url : __ctxPath + '/diningMgnt/comboDiningMealtype.do',
							fields : [ 'id','typename' ]
						})
			},{
				fieldLabel : '食品名称',
				name : 'Q_foodname_S_LK',
				flex : 1,
				width : 150,
				xtype : 'textfield'
			}],
			buttons : [ {
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			}, {
				text : '重置',
				scope : this,
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
			},
			{
				iconCls : 'excel-cls',
				text : 'Excel导入',
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
					window.open( __ctxPath +  '/js/DiningMenuBlank.xls');
				}
			}]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'DiningMenuGrid',
			//store:gridstore,
			url : __ctxPath + "/diningMgnt/listDiningMenu.do",
			root:'result',				
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'menudate', 'diningMealtype.typename', 'foodname', 'price',
					'createuserid', 'createdate', 'lastedituserid',
					'lasteditdate','unitname','diningroom'],			
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '日期',
				dataIndex : 'menudate',
				sortable:false
			}, {
				header : '供餐食堂',
				dataIndex : 'diningroom'
			},{
				header : '餐别',
				dataIndex : 'diningMealtype.typename'
			}, {
				header : '名称',
				dataIndex : 'foodname'
			},  {
				header : '价格',
				dataIndex : 'price'
			},
			{
				header : '单位',
				dataIndex : 'unitname'
			},
			/*{
				header : 'createuserid',
				dataIndex : 'createuserid'
			}, {
				header : 'createdate',
				dataIndex : 'createdate'
			}, {
				header : 'lastedituserid',
				dataIndex : 'lastedituserid'
			}, {
				header : 'lasteditdate',
				dataIndex : 'lasteditdate'
			},*/
			new Ext.ux.grid.RowActions( {
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
			new DiningMenuForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new DiningMenuForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/diningMgnt/multiDelDiningMenu.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/diningMgnt/multiDelDiningMenu.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new DiningMenuForm( {
			id : record.data.id
		}).show();
	},
	
	// 导入Excel
	importFromExcel:function()
	{
		new Ext.Window(
				{
					id:'UploadDiningMenuWin',
					title:'选择Excel',
					layout : 'fit',
					width : 300,
					height : 150,
					closeAction : 'close',
					items : [ new Ext.form.FormPanel(
					{
						id:'UploadDiningMenuForm',
						bodyStyle : 'padding:10px',
						labelAlign : 'right',
						labelWidth : 60,
						url : __ctxPath + '/diningMgnt/importexcelDiningMenu.do',
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
							   var fm = Ext.getCmp('UploadDiningMenuForm');
							   
							   fm.getForm().submit(
								{
									success : function(form, action)
									{
										Ext.Msg.alert('信息', '菜单导入成功！');
										Ext.getCmp('UploadDiningMenuWin').close();
										
										var gridPanel = Ext.getCmp('DiningMenuGrid');
										if (gridPanel != null) 
										{
											gridPanel.getStore().reload();
										}
										
									},
									failure : function(form, action)
									{
										//alert(action.result.exmsg);
										Ext.Msg.alert('错误', '菜单导入失败,'+action.result.exmsg);
										//Ext.Msg.alert('错误', '菜单导入失败,请检查导入的数据');
										Ext.getCmp('UploadDiningMenuWin').close();
									}

									
								});
							}
						} ]// end of buttons  
						}) // end of FormPanel
					]// end of Window's items
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
