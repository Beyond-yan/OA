InnerPhoneBKView = Ext.extend(Ext.Panel,
{
	constructor : function(config)
	{
		Ext.applyIf(this, config);
		this.initUIComponents();
		InnerPhoneBKView.superclass.constructor.call(this,
		{
			id : 'InnerAppUserView',
			title : '内部通讯录管理',
			iconCls : 'menu-appuser',
			autoScroll : true,
			items : [ this.searchPanel, this.gridPanel ]
		});
	},
	
	initUIComponents : function()
	{
		var _url = __ctxPath + '/system/listDepartment.do?opt=appUser';
		var depSelector = new TreeSelector('depSelector', _url, '所属部门',
		'Q_department.depId_L_EQ', true);
			
		this.searchPanel = new Ext.FormPanel(
		{
			height : 35,
			frame : false,
			border : false,
			id : 'InnerAppUserSearchForm',
			layout : 'hbox',
			layoutConfig :
			{
				padding : '5',
				align : 'middle'
			},
			defaults :
			{
				xtype : 'label',
				border : false,
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
				text : '用户账号'
			},
			{
				xtype : 'textfield',
				name : 'Q_username_S_LK'
			},
			{
				text : '用户姓名'
			},
			{
				xtype : 'textfield',
				name : 'Q_fullname_S_LK'
			},
			{
					text : '所属部门'
			},
			depSelector,

			 {
				xtype : 'hidden',
				name : 'Q_department.depId_L_EQ',
				id : 'Q_department.depId_L_EQ',
				
					width : 150
			},
	
//			{
//				text : '单位'
//			},
//			{
//				name : 'Q_department.depName_S_LK',
//				flex : 1,
//				width : 150,
//				xtype : 'textfield'
//			},
			{
				xtype : 'button',
				text : '查询',
				iconCls : 'search',
				scope : this,
				handler :  function(obj)
							{
								var searchPanel = Ext.getCmp('InnerAppUserSearchForm');
						
								var gridPanel = Ext.getCmp('InnerAppUserGrid');
								if (searchPanel.getForm().isValid())
								{
									$search(
									{
										searchPanel : searchPanel,
										gridPanel : gridPanel
									});
								}
							}
			}			
			,{
					 xtype:'button',
					 text:'重置',
					 handler:function(){
					   var searchPanel = Ext.getCmp('InnerAppUserSearchForm');
					   searchPanel.getForm().reset();
					 }
			}
					 ]
		});// end of search panel
		

			
		this.gridPanel = new HT.GridPanel(
		{
			region : 'center',
			rowActions : true,
			noSel:true,
			id : 'InnerAppUserGrid',
			url : __ctxPath + '/system/listAppUser.do',
			fields : [
			            'userId' , 'username', 'password', 'fullname', 'address',
						'email', {name:'dep',mapping:'department.depName'}, 'title','position', 'accessionTime','status'
					],		
			columns : [
					{
						header : "userId",
						dataIndex : 'userId'
						,hidden : true
					},
					{
						header : "账号",
						dataIndex : 'username'
					},
					{
						header : "用户名",
						dataIndex : 'fullname'
					},
					{
						header : "邮箱",
						dataIndex : 'email'
					},
					{// 先不显示
						header : "所属部门",
						dataIndex : 'dep'
					},
					{
						header : "所在职位",
						dataIndex : 'position'
					},
					{
						header : "入职时间",
						dataIndex : 'accessionTime'
					}
					, new Ext.ux.grid.RowActions(
					{
						header : '管理',
						actions : [
						{
							iconCls : 'btn-edit',
							qtip : '编辑',
							style : 'margin:0 3px 0 3px'
						},
					     {
					     	// 占位符
						}],
						listeners :
						{
							scope : this,
							'action' : this.onRowAction
						}
					}) ]
		// end of columns
				});
				
					this.gridPanel.addListener('rowdblclick', this.rowClick);
	},
	
	
		//GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new InnerPhoneBKForm( {
				id : rec.data.userId
			}).show();
		});
	},
	
	//编辑Rs
	editRs : function(record) {
		new InnerPhoneBKForm( {
			id:record.data.userId
		}).show();
	},
		//行的Action
	onRowAction : function(grid, record, action, row, col) 
	{
		switch (action) 
		{
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		default:
			break;
		}
	}
});
 
