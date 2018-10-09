Ext.ns('ClassifyView');

/**
 * @author:
 * @class CarDistributionView
 * @extends Ext.Panel
 * @description 车辆分配列表
 * @company 广州宏天软件有限公司
 * @createtime:2010-04-12
 */
ClassifyView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	searchPanel : null,
	// 数据展示Panel
	gridPanel : null,
	// GridPanel的数据Store
	store : null,
	// 头部工具栏
	topbar : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ClassifyView.superclass.constructor.call(this, {
			id : 'ClassifyView',
			title : '分类查询',
			iconCls : 'menu-car_apply',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		var nowYear = parseInt(new Date().format('Y'));
		var startYear = nowYear - 13;
		var arr = [];
		for (var i = 0; i <= 14; i++) {
			arr[i] = startYear + i;
		}
		// 初始化搜索条件Panel
		this.searchPanel = new Ext.FormPanel({
			id : 'ClassifyViewForm',
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
				text : '车牌号:'
			}, {
				xtype : 'textfield',
				name : 'carno'
			},{
				text : '年份:'
			},{
					width : 130,
					xtype : 'combo',
					mode : 'local',
					editable : false,
					triggerAction : 'all',
					store : arr,
					emptyText : '---年份---',
					listeners : {
						change : function() {
							Ext.getCmp('ClassifyViewForm.startDate').setValue((this.getValue()+'-01-01'));
							Ext.getCmp('ClassifyViewForm..endDate').setValue(Ext.util.Format.substr(this.getValue(),0,4)+'-12-31');	
							
						}
					}
				},{
				xtype : 'button',
				text : '查询',
				iconCls : 'search',
				handler : function() {
					var searchPanel = Ext.getCmp('ClassifyViewForm');
					var grid = Ext.getCmp('ClassifyViewGrid');
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
					var searchPanel = Ext.getCmp('ClassifyViewForm');
					searchPanel.getForm().reset();
				}
			} , {	
				name : 'startDate',
				xtype : 'hidden',
				id : 'ClassifyViewForm.startDate'
		}, {
				xtype : 'hidden',
				name : 'endDate',
				id:'ClassifyViewForm..endDate'
			}]
		});// end of the searchPanel

		this.store = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
				url : __ctxPath + "/mileages/listbycarMileages.do"
			}),
			reader : new Ext.data.JsonReader({
				root : 'result',
				totalProperty : 'totalCounts',
				id : 'id',
				fields : [ 'carno', 'endNumber', 'travelDate' ]
			}),
			remoteSort : true
		});
		this.store.load({
			params : {
				start : 0,
				limit : 25
			}
		});

		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [ sm, new Ext.grid.RowNumberer(), {
				header : '车辆车牌号',
				dataIndex : 'carno'
			}, {
				header : '年份',
				dataIndex : 'travelDate'
			}, {
				header : '总里程',
				dataIndex : 'endNumber'
			} ],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});// end of the cm

		this.topbar = new Ext.Toolbar({
			id : 'ClassifyViewFootBar',
			height : 30,
			bodyStyle : 'text-align:left',
			items : []
		});

		this.gridPanel = new Ext.grid.GridPanel({
			id : 'ClassifyViewGrid',
			tbar : this.topbar,
			region : 'center',
			store : this.store,
			trackMouseOver : true,
			disableSelection : false,
			loadMask : true,
			autoHeight : true,
			cm : cm,
			sm : sm,
		viewConfig : {
				forceFit : true,
				enableRowBody : false,
				showPreview : false
			},
			bbar : new Ext.PagingToolbar({
				pageSize : 25,
				store : this.store,
				displayInfo : true,
				displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
				emptyMsg : "当前没有记录"
			})
		});

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
			grid.getSelectionModel().each(function(rec) {
				if (isGranted('_CarApplyEdit')) {
					if (rec.data.approvalStatus == 0) {
						ClassifyView.edit(rec.data.applyId);
					}
				}
			});
		});
	}// end of the initUIComponents
});
/**
 * 删除单个记录
 */
ClassifyView.remove = function(id) {
	var grid = Ext.getCmp("ClassifyViewGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath + '/admin/multiDelCarApply.do',
				params : {
					ids : id
				},
				method : 'post',
				success : function() {
					Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
					grid.getStore().reload({
						params : {
							start : 0,
							limit : 25
						}
					});
				}
			});
		}
	});
};
