/**
 * @author:
 * @class ProWageconfigView
 * @extends Ext.Panel
 * @description 工资项目管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProWageItemView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProWageItemView.superclass.constructor.call(this, {
			id : 'ProWageItemView',
			title : '工资项目管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {

		var combomealtype = new Ext.form.ComboBox({
			fieldLabel : '项目类型',
			hiddenName : 'Q_proWagetype.id_L_EQ',
			id:'proWageconfigTypeId2',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			displayField : 'name',
			valueField : 'id',
			mode : 'local',
			store : new Ext.data.SimpleStore(
					{
						autoLoad : true,
						url : __ctxPath + '/wage/comProWagetype.do',
						fields : [ 'id','name' ]
						           }
					   )		
		});
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {

			id : 'ProWageconfigSearchForm',
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
			items : [
					{
						text : '项目名称'
					},
					{
						xtype : 'textfield',
						name : 'Q_name_S_EQ'
					},
					{
						text : '项目类型'
					},
					combomealtype,
					{
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext
									.getCmp('ProWageconfigSearchForm');
							var grid = Ext
									.getCmp('ProWageconfigGrid');
							
							if (searchPanel.getForm()
									.isValid()) {
								$search( {
									searchPanel : searchPanel,
									gridPanel : grid
								});
							}
						}
					},
					{
						xtype : 'button',
						text : '重置',
						iconCls : 'btn-reset',
						handler : function() {
//						window.open("http://localhost:8080/SZ_Metro3_OA/wage/createXLSProWageconfig.do");
						var searchPanel = Ext
						.getCmp('ProWageconfigSearchForm');
							searchPanel.getForm().reset();
						
						}
					} 
//					,
//					 {
//						iconCls : 'btn-downLoad',
//						text : '导出',
//						xtype : 'button',
//						handler : function(){
//						if(Ext.getCmp('proWageconfigTypeId2')!=null){
//						var id=Ext.getCmp('proWageconfigTypeId2').getValue();
//						typeId=id;
//						if(id==""||id==null)
//						{
//							Ext.MessageBox
//							.show( {
//								title : '操作信息',
//								msg : '只能导出相关项目类型的数据，项目类型不能为空!',
//								buttons : Ext.MessageBox.OK,
//								icon : 'ext-mb-error'
//							});
//						}else
//						{
//							window.open(__ctxPath+"/wage/createXLSProWageconfig.do?Q_proWagetype.id_L_EQ="+id);
//						}
//						}
//						}
//					}
					]
		
			
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
				iconCls : 'btn-downLoad',
				text : '导出',
				xtype : 'button',
				scope : this,
				handler : this.exportWage
			} ]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ProWageconfigGrid',
			url : __ctxPath + "/wage/listProWageconfig.do",
			fields : [ {
				name : 'id',
				type : 'int'
			},{
				name:'typeName',
				mapping:'proWagetype.name'	
			}, 
			'name', 'typeId', 'isdel', 'createDate', 'createBy',
					'updateDate', 'updateBy' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '项目名称',
				dataIndex : 'name'
			}, {
				header : '项目类型',
				dataIndex : 'typeName'
			},  new Ext.ux.grid.RowActions( {
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
			new ProWageconfigForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new ProWageconfigForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/wage/multiDelProWageconfig.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/wage/multiDelProWageconfig.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new ProWageconfigForm( {
			id : record.data.id
		}).show();
	},
	
	exportWage:function(){
		var grid = Ext.getCmp('ProWageconfigGrid');
		var rows = grid.getSelectionModel().getSelections();
		var ids = '';
		
		for (var i = 0; i < rows.length; i++) {
			if (i > 0) {
				ids += ',';
			}
			ids += rows[i].data.id;    
		}
//		alert(ids);
		if(ids==""||ids==null){
			Ext.MessageBox
			.show( {
				title : '操作信息',
				msg : '请选择要导入的项目名称',
				buttons : Ext.MessageBox.OK,
				icon : 'ext-mb-error'
			});
			return 
		}
		window.open(__ctxPath+"/wage/createXLSProWageconfig.do?ids="+ids);
//		if(Ext.getCmp('proWageconfigTypeId2')!=null){
//		var typeId=Ext.getCmp('proWageconfigTypeId2').getValue();
//		if(typeId==""||typeId==null)
//		{
//			Ext.MessageBox
//			.show( {
//				title : '操作信息',
//				msg : '只能导出一种项目类型的数据，项目类型不能为空,请先"查询"某一项目类型的数据，然后导出数据！',
//				buttons : Ext.MessageBox.OK,
//				icon : 'ext-mb-error'
//			});
//			return 
//		}
//		
//		}
	
		
//		Ext.Ajax.request( {
//			url : __ctxPath + '/wage/sendWageEmailProWagetotal.do?ids='+ids,
//
//			success : function(userform,o) {
//				Ext.ux.Toast.msg('操作信息','邮件发送成功！');
//			}
//		});
	
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
