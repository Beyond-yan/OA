/**
 * @author:
 * @class DiningChargeView
 * @extends Ext.Panel
 * @description [DiningCharge]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
function $posthurry(conf){
	Ext.Ajax.request({
		url:conf.url,
		params:{'id':conf.id,'content':'管理员提示：您尚有'+conf.gap+"元用餐费用待结清，请及时缴费。"},
		method:'POST',
		success:function(response,options){
			Ext.ux.Toast.msg('操作信息','成功发送催办通知！');
		},
		failure : function(response,options) {
			Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
		}
	});
}

function $hurryGridRs(conf){
	var ids=$getGdSelectedIds(conf.grid,conf.idName);
	//var gaps = $getGdSelectedIds(conf.grid,conf.gapName);
	if (ids.length == 0) {
		Ext.ux.Toast.msg("操作信息", "请选择要接收催缴用餐费用短信通知的人员！");
		return;
	}
	var params={
		url:conf.url,
		ids:ids,
		//gap:gaps,
		grid:conf.grid
	};
	$postHurry(params);
}
function $postHurry(conf){
	Ext.Msg.confirm('信息确认', '您确认要发出短信通知吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url :conf.url,
					params : {ids : conf.ids,'content':'管理员提示：您的用餐费用尚未结清，请及时缴费。'},method : 'POST',
					success : function(response,options) {
						Ext.ux.Toast.msg('操作信息','短信已经成功发出！');
					},
					failure : function(response,options) {
						Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
					}
				});
			}
	});

}

DiningChargeView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		DiningChargeView.superclass.constructor.call(this, {
			id : 'DiningChargeView',
			title : '用餐交费管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		
		var comboDepartment = new Ext.form.ComboBox({
			fieldLabel : '所属部门',
			id : 'DCVwdepartmentcombo',
			hiddenName : 'Q_department.depId_L_EQ',
			flex : 1,
			width : 200,
			xtype : 'combo',
			editable : false,
			allowBlank : true,
			triggerAction : 'all',
			displayField : 'depname',
			valueField : 'depid',
			mode : 'local',
			store : new Ext.data.SimpleStore( {
				autoLoad : true,
				url : __ctxPath + '/system/comboDepartment.do?range=ALL',
				fields : [ 'depid', 'depname' ]
			})
		});
		this.topbar = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-hurry',
				text : '催缴用餐费用',
				xtype : 'button',
				scope : this,
				handler : this.multiHurryRs
			} ]
		});
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ 
			comboDepartment,			
			{
				fieldLabel : '员工姓名:',
				name : 'Q_fullname_S_LK',
				flex : 1,
				width:200,
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



		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			//noSel:true,
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'DiningChargeGrid',
			url : __ctxPath + "/diningMgnt/getuserdineDiningCharge.do",
			fields : [ {
				name : 'userid',
				type : 'int'				
			},'appUser3.fullname', 'dineTotalAmount', 'chargeTotalAmount',
					'gapTotalAmount'],
			columns : [ {
				header : 'id',
				dataIndex : 'userid',
				hidden : true
			}, {
				header : '用户名',
				dataIndex : 'appUser3.fullname'
			}, {
				header : '用餐费用总计',
				dataIndex : 'dineTotalAmount'
			}, {
				header : '餐费支付总计',
				dataIndex : 'chargeTotalAmount'
			}, {
				header : '尚欠费用',
				dataIndex : 'gapTotalAmount'
			},
			new Ext.ux.grid.RowActions( {
				header : '',
				width : 100,
				actions : [ {
					iconCls : 'btn-hurry',
					qtip : '催缴用餐费用',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-add',
					qtip : '新增缴费记录',
					style : 'margin:0 3px 0 3px'
				} ,{
					iconCls : 'btn-showDetail',
					qtip : '查看消费明细',
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
			new DiningChargeForm( {
				id : rec.data.userid
			}).show();
		});
	},
	//催缴用餐费用
	hurryRs:function(record){
		$posthurry({
			url:__ctxPath + '/diningMgnt/hurryDiningCharge.do',
			id:record.data.userid,
			gap:record.data.gapTotalAmount
		});
	},
	
	//催缴用餐费用(多人)
	multiHurryRs:function(){
		$hurryGridRs( {
			url : __ctxPath + '/diningMgnt/multiHurryDiningCharge.do',
			grid : this.gridPanel,
			idName : 'userid'
		});
	},
	
	// 编辑Rs
	editRs : function(record) {
		new DiningChargeForm( {
			id : record.data.userid
		}).show();
	},
	custRs:function(record){
		new DiningCustHistory({
			id:record.data.userid
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
		case 'btn-add':
			this.editRs.call(this, record);
			break;
		case 'btn-hurry':
			this.hurryRs.call(this,record);
			break;
		case 'btn-showDetail':
			this.custRs.call(this,record);
			break;
		default:
			break;
		}
	}
});
