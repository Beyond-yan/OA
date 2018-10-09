/**
 * @author:
 * @class DiningBookingView
 * @extends Ext.Panel
 * @description [DiningBooking]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
var isRestAdmin = curUserInfo.isRestAdmin?1:0;
function $postdelDiningBooking(conf)
{
	Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url :conf.url,
					params : {ids : conf.ids},method : 'POST',
					success : function(response,options) {
						Ext.ux.Toast.msg('操作信息','成功删除该记录！');
						if(conf.callback){
							conf.callback.call(this);
							return;
						}
						if(conf.grid){
							conf.grid.getStore().reload();
						}
					},
					failure : function(response,options) {
						Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
					}
				});								
			}
	});
}

function $checkIsAuthorize(conf)
{	
	var isTimeout = 1;
	var selRs = conf.grid.getSelectionModel().getSelections();
	for (var i = 0; i < selRs.length; i++) {
		//ids.push(eval('selRs[i].data.'+idName));
		if (selRs[i].data.isTimeout == 0 && (!curUserInfo.isRestAdmin))
		{
			isTimeout = 0;
			break;
		}
	}
	if (isTimeout == 0 )
	{
		Ext.MessageBox.show({
			title : '警告',
			msg : '您好，您不能删除当天及当天以前的订餐！',
			buttons : Ext.MessageBox.OK,
			icon : 'ext-mb-warning'
		});
		return;		
	}
	$delGridRs(conf);
}

DiningBookingView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		DiningBookingView.superclass.constructor.call(this, {
			id : 'DiningBookingView',
			title : '订餐管理',
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
				fieldLabel : '订餐日期',
				name : 'Q_menudate_D_EQ',
				flex : 1,
				width : 150,
				editable : false,
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				fieldLabel : '用餐类别:',
				hiddenName : 'Q_diningMealtype.id_L_EQ',
				id:'DiningBookingVmealtypeid',
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
			}
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
			// 使用RowActions
			rowActions : true,
			id : 'DiningBookingGrid',
			//store:gridbookingStore,
			url : __ctxPath + "/diningMgnt/listDiningBooking.do?isRestAdmin="+isRestAdmin,
			root:'result',
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'appUser3.fullname','menudate','diningMealtype.typename','userid',
					'menuid', 'createuserid', 'createdate','totalamount',
					'lastedituserid', 'lasteditdate','diningroom','diningFoodtype.foodtypename',
					'isTimeout' ],			
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '订餐人',
				dataIndex : 'appUser3.fullname'
			}, {
				header : '订餐日期',
				dataIndex : 'menudate'
			}, {
				header : '供餐食堂',
				dataIndex : 'diningroom'
			},{
				header : '用餐类别',
				dataIndex : 'diningMealtype.typename'
			},{
				header : '用餐类型',
				dataIndex : 'diningFoodtype.foodtypename'
			}, {
				header : '总金额（元）',
				dataIndex : 'totalamount'
			}, {
				header : '权限',
				dataIndex : 'isTimeout',
				hidden:true
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
				},{
					iconCls : 'btn-showDetail',
					qtip : '查看',
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
			new DiningBookingFormEdit( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new DiningBookingForm().show();
	},
	// 按ID删除记录
	removeRs : function(record) {
		if(record.data.isTimeout == 0 && (!curUserInfo.isRestAdmin))//非管理员不能删除当天以及当天以前的订餐数据
		{
			Ext.MessageBox.show({
				title : '警告',
				msg : '您好，您不能删除当天及当天以前的订餐！',
				buttons : Ext.MessageBox.OK,
				icon : 'ext-mb-warning'
			});
			return;
		}
		$postdelDiningBooking( {
			url : __ctxPath + '/diningMgnt/multiDelDiningBooking.do',
			ids : record.data.id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$checkIsAuthorize( {
			url : __ctxPath + '/diningMgnt/multiDelDiningBooking.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {		
		if(record.data.isTimeout == 0 && (!curUserInfo.isRestAdmin)){
			Ext.MessageBox.show({
				title : '警告',
				msg : '您好，您不能修改当天及当天以前的订餐！',
				buttons : Ext.MessageBox.OK,
				icon : 'ext-mb-warning'
			});
			return;
		}
		new DiningBookingFormEdit( {
			id : record.data.id
		}).show();
	},
	// 显示订餐明细
	showDetails : function(record) {
		new DiningBookingFormDetail( {
			id : record.data.id
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		case 'btn-showDetail':
			this.showDetails.call(this, record);
			break;
		default:
			break;
		}
	}
});
