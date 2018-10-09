/**
 * @author : Donald Su
 * @class : OutTripClassView
 * @extends : Ext.Panel
 * @description : 出差类别管理
 * @company : 深圳捷达世软件有限公司
 * @createtime : 2011-06-13
 */
OutTripClassView = Ext.extend(Ext.Panel, {

	// 构造函数 - 开始
	constructor : function(_cfg) {
	
		Ext.applyIf(this, _cfg);
		
		this.initUIComponents();
		
		OutTripClassView.superclass.constructor.call(this, {
			id : 'OutTripClassView',
			title : '出差类别管理',
			region : 'center',
			layout : 'border',
			items : [this.searchPanel, this.gridPanel]
		});
		
	},// 构造函数 - 结束
			
	// 初始化界面控件 - 开始
	initUIComponents : function() {
		
		var dataStatus = [['1', '可用'], ['0', '禁用'],['','全部']];	
		
		// Part1：查询表单部分
		this.searchPanel = new HT.SearchPanel({
			id : 'OutTripClassSearchForm',
			region : 'north',
			layout : 'form',
			width : '100%',
			height : 300,
			frame : true,
			items : [
				{
			    	layout : 'column',
			    	height : 30,
			    	items : [
						{
							xtype : 'label',
							text : '类别名称：',
							width : 60
						}, 
						{
			    	    	xtype : 'textfield',
			    	    	id : 'name',
			    	    	name : 'Q_name_S_LK',
							width : '100',
							maxLength : 50,
							maxLengthText : '类别名称不能超过50个字符长度！'
			    	    },
			    	    {
							xtype : 'label',
			    	    	text : '类别状态：',
			    	    	width : 60,
			    	    	style : 'margin:0 0 0 20px'
			    	    },
			    	    {
							xtype : 'combo',
							hiddenName : 'Q_status_SN_EQ',
							valueField : 'realValue',
							displayField : 'displayValue',
							mode : 'local',
							width : 75,
							border : false,
							editable : false,
							triggerAction : 'all',
							forceSelection : true,
							store : new Ext.data.SimpleStore({
								fields : ['realValue', 'displayValue'],
								data : dataStatus
							})
			    	    }
			    	]
				}
            ],
		    buttons : [
				{
	    	    	xtype : 'button',
					text : '查询',
					iconCls : 'btn-search',
					handler : this.search
	    	    },
	    	    {
	    	    	xtype : 'button',
					text : '重置',
					iconCls : 'btn-reset',
					style : 'margin:0 0 0 10px',
					handler : this.reset
	    	    }
			]
		});

		// Part2：Toolbar部分
		this.topbar = new Ext.Toolbar({
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
					handler : function() {
						var grid = Ext.getCmp("OutTripClassGrid");
						var selectRecords = grid.getSelectionModel().getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = new Array();
						for ( var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.id);
						}
						OutTripClassView.remove(ids);
					}
				}]
		});

		// Part3：查询结果列表部分
		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			rowActions : true,
			id : 'OutTripClassGrid',
			url : __ctxPath + "/admin/listOutTripClass.do",
			fields : [
	            {
					name : 'id',
					type : 'int'
	            }
	            ,'name'
				,'description'
				,'status'
			],
			columns : [
	            {
					header : 'id',
					dataIndex : 'id',
					hidden : true
				},
				{
					header : '类别名称',
					dataIndex : 'name'
				},
				{
					header : '类别描述',
					dataIndex : 'description'
				},
				{
					header : '类别状态',
					dataIndex : 'status',
					renderer : function(value){
						if(value=='0'){
							return  "<span>禁用</span>";
						}
						else{
							return "<span>可用</span>";
						}
					}
				},
				new Ext.ux.grid.RowActions({
					header : '管理',
					width : 100,
					actions : [
	                    {
	                    	iconCls : 'btn-del',
	                    	qtip : '删除',
	                    	style : 'margin:0 3px 0 3px'
						},
						{
							iconCls : 'btn-edit',
							qtip : '编辑',
							style : 'margin:0 3px 0 3px'
						}
					],
					listeners:{
						scope : this,
						'action' : this.onRowAction
					}
				})
			]
		});
		
		this.gridPanel.addListener('rowdblclick',this.rowClick);
			
	},// 初始化界面控件 - 结束

	// 重置查询表单
	reset : function(){
		
		Ext.getCmp('OutTripClassSearchForm').getForm().reset();
		
	},

	// 按条件搜索
	search : function() {
		
		var searchPanel = Ext.getCmp('OutTripClassSearchForm');
		var gridPanel = Ext.getCmp('OutTripClassGrid');
		
		$search({
			searchPanel : searchPanel,
			gridPanel : gridPanel
		});
		
	},
	
	//GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		
		grid.getSelectionModel().each(function(rec) {
			new OutTripClassForm({
				id : rec.data.id
			}).show();
		});
		
	},
	
	// 创建记录
	createRs : function() {
		
		new OutTripClassForm().show();
		
	},
	
	// 按ID删除记录
	removeRs : function(id) {
	/*	
		$postDel({
			url : __ctxPath+ '/admin/multiDelOutTripClass.do',
			ids : id,
			grid : this.gridPanel
		});
		*/
		var gd = Ext.getCmp("OutTripClassGrid");
		Ext.MessageBox.confirm("操作提示", "您真的要删除这条数据吗？", function(btn) {
			if (btn == "yes") {
				Ext.Ajax.request( {
					url : __ctxPath + '/admin/multiDelOutTripClass.do',
					method : 'post',
					params : {
					ids : id
					},
					success : function(response, options ) {
						var dbJson = response.responseText;
	                    dbJson = eval("("+ dbJson + ")");
						Ext.ux.Toast.msg("操作提示", dbJson.msg);
						gd.getStore().reload( {
							params : {
								start : 0,
								limit : 25
							}
						});
					},
					failure : function() {
						Ext.ux.Toast.msg('操作提示', '对不起，删除数据操作失败！');
					}
				});
			}
		});
	
		
	},
	
/*	// 把选中ID删除
	removeSelRs : function() {
		
		$delGridRs({
			url : __ctxPath + '/admin/multiDelOutTripClass.do',
			grid : this.gridPanel,
			idName : 'id'
		});
		
	},*/
	
	// 编辑Rs
	editRs : function(record) {
		
		new OutTripClassForm({
			id : record.data.id
		}).show();
		
	},
	
	// 行管理(删除、编辑)功能的Action
	onRowAction : function(grid, record, action, row, col) {
		
		switch (action) {
			case 'btn-del' :
				this.removeRs.call(this,record.data.id);
				break;
			case 'btn-edit' :
				this.editRs.call(this,record);
				break;
			default :
				break;
		}
		
	}
	
});

/**
 * @description 删除数据操作
 * @param id 类别Id
 *           
 */
OutTripClassView.remove = function(Id) {
	if (Id != "") {
		var gd = Ext.getCmp("OutTripClassGrid");
		Ext.MessageBox.confirm("操作提示", "您真的要删除这条数据吗？", function(btn) {
			if (btn == "yes") {
				Ext.Ajax.request( {
					url : __ctxPath + '/admin/multiDelOutTripClass.do',
					method : 'post',
					params : {
						ids : Id
					},
					success : function(response, options ) {
						var dbJson = response.responseText;
	                    dbJson = eval("("+ dbJson + ")");
						Ext.ux.Toast.msg("操作提示", dbJson.msg);
						gd.getStore().reload( {
							params : {
								start : 0,
								limit : 25
							}
						});
					},
					failure : function() {
						Ext.ux.Toast.msg('操作提示', '对不起，数据删除失败！');
					}
				});
			}
		});
	} else {
		Ext.ux.Toast.msg("温馨提示", "对不起，请选择要删除的数据！");
	}
};	
