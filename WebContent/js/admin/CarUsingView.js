/**
 * @author:
 * @class CarUsingView
 * @extends Ext.Panel
 * @description 用车记录管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
CarUsingView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		CarUsingView.superclass.constructor.call(this, {
			id : 'CarUsingView',
			title : '用车记录管理',
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
				text : '车牌号'
			}, {
				xtype : 'textfield',
				name : 'Q_car.carno_S_LK'
			}, {
				xtype : 'button',
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			}, {
				xtype : 'button',
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			} ]
		// buttons : [ {
				// text : '查询',
				// scope : this,
				// iconCls : 'btn-search',
				// handler : this.search
				// }, {
				// text : '重置',
				// scope : this,
				// iconCls : 'btn-reset',
				// handler : this.reset
				// } ]
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
			// 使用RowActions
			rowActions : true,
			id : 'CarUsingGrid',
			url : __ctxPath + "/admin/listCarUsing.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 
			{
				name : 'department',
				mapping : 'carApply.department'
			}, 
			{
				name : 'carno',
				mapping : 'car.carno'
			},
			{
				name : 'iseffective',
				mapping : 'carApply.iseffective'
			},
			
//			{
//				name : 'code',
//				mapping : 'carOilCard.code'
//			}, 
//			{
//				name : 'passCode',
//				mapping : 'carPassFeeCard.code'
//			}, 
			'applyId', 'carId', 'driverId', 'oilCardId', 'payCardId',
					'leavingDt', 'comingDt', 'distance', 'passFee', 'parkFee',
					'otherFee', 'feeAmount', 'feeId', 'createDate', 'createBy',
					'updateDate', 'updateBy', 'des' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '车牌号码',
				dataIndex : 'carno'
			}, {
				header : '申请部门',
				dataIndex : 'department'
			}, 
//			{
//				header : '油卡',
//				dataIndex : 'code'
//			}, {
//				header : '粤通卡',
//				dataIndex : 'passCode'
//			}, 
			{
				header : '出车时间',
				dataIndex : 'leavingDt'
			}, {
				header : '收车时间',
				dataIndex : 'comingDt'
			}, {
				header : '行驶里程数',
				dataIndex : 'distance'
			}, {
				header : '过路费',
				dataIndex : 'passFee'
			}, {
				header : '停车费',
				dataIndex : 'parkFee'
			}, {
				header : '其它费用',
				dataIndex : 'otherFee'
			}, {
				header : '费用总额',
				dataIndex : 'feeAmount'
			}, {
				header : '备注',
				dataIndex : 'des'
			}, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ {
					iconCls : 'btn-del',
					id:'delete',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-edit',
					qtip : '收车',
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
			new CarUsingForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new CarUsingForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/admin/multiDelCarUsing.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/admin/multiDelCarUsing.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new CarUsingForm( {
			id : record.data.id
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
		if(record.data.iseffective==1){
			Ext.MessageBox
			.show( {
				title : '操作信息',
				msg : '不能刪除此数据！',
				buttons : Ext.MessageBox.OK,
				icon : 'ext-mb-error'
			});
		}else{
			this.removeRs.call(this, record.data.id);
			}
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		default:
			break;
		}
	}
});
