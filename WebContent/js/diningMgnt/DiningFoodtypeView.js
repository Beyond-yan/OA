/**
 * @author:
 * @class DiningFoodtypeView
 * @extends Ext.Panel
 * @description [DiningFoodtype]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
DiningFoodtypeView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		DiningFoodtypeView.superclass.constructor.call(this, {
			id : 'DiningFoodtypeView',
			title : '订餐类型管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {

		var comboType = new Ext.form.ComboBox( {
			fieldLabel : '分类:',
			hiddenName : 'Q_category_S_EQ',
			id : 'DiningFoodVCombotype',
			editable : false,
			triggerAction : 'all',
			store : ['普通餐','接待餐','工作餐' ],
			maxLength : 10,
			anchor : '30%'
		});
		var comboMeal = new Ext.form.ComboBox({
			fieldLabel : '用餐类别:',
			hiddenName : 'Q_diningMealtype.id_L_EQ',
			id:'DiningFoodVmealtypeid',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
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
		});
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel : '订餐类型名称',
				name : 'Q_foodtypename_S_LK',
				flex : 1,
				xtype : 'textfield',
				width:150
			},comboType,comboMeal
			],
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
			} ]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			//使用RowActions
			rowActions : true,
			id : 'DiningFoodtypeGrid',
			url : __ctxPath + "/diningMgnt/listDiningFoodtype.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'foodtypename','category','price','diningMealtype.typename' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '订餐类型名称',
				dataIndex : 'foodtypename'
			},{
				header : '分类',
				dataIndex : 'category'
			},{
				header : '用餐类别',
				dataIndex : 'diningMealtype.typename'
			},{
				header : '价格',
				dataIndex : 'price'
			},
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
		//end of columns
				});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	//重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	//按条件搜索
	search : function() {
		$search( {
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	//GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new DiningFoodtypeForm( {
				id : rec.data.id
			}).show();
		});
	},
	//创建记录
	createRs : function() {
		new DiningFoodtypeForm().show();
	},
	//按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/diningMgnt/multiDelDiningFoodtype.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	//把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/diningMgnt/multiDelDiningFoodtype.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	//编辑Rs
	editRs : function(record) {
		new DiningFoodtypeForm( {
			id : record.data.id
		}).show();
	},
	//行的Action
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
