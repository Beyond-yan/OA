/**
 * @author
 * @createtime
 * @class CustChargeHistoryForm
 * @extends Ext.Window
 * @description CustChargeHistory表单
 * @company 捷达世软件
 */
var usercid;
function $delGridRswithCallBack(conf){
	var ids=$getGdSelectedIds(conf.grid,conf.idName);
	if (ids.length == 0) {
		Ext.ux.Toast.msg("操作信息", "请选择要删除的记录！");
		return;
	}
	var params={
		url:conf.url,
		ids:ids,
		grid:conf.grid,
		callback:conf.callback
	};
	$postDelwithCallBack(params);
}
function $postDelwithCallBack(conf){
	Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url :conf.url,
					params : {ids : conf.ids},method : 'POST',
					success : function(response,options) {
						Ext.ux.Toast.msg('操作信息','成功删除该记录！');
						if(conf.callback){
							conf.callback.call(this);
							//return;
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

CustChargeHistoryForm = Ext.extend(Ext.Window, {
	// 构造函数
	
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CustChargeHistoryForm.superclass.constructor.call(this, {
			id : 'CustChargeHistoryFormWin',
			layout : 'form',
			items : this.gridPanel,
			modal : true,
			height : 550,
			width : 750,
			maximizable : true,
			title : '用餐费用详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '关闭',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			// 使用RowActions
			noSel:true,			
			id : 'DCFrmCustChargeHistoryGrid',
			url : __ctxPath + "/diningMgnt/listDiningCharge.do?Q_appUser3.userId_L_EQ="+this.id,
			fields : [ {
				name : 'id',
				type : 'int'
			},{'name':'appUser3.userId',mapping:'userId'},'chargeamount', 'chargedate', 'createuserid',
					'createdate', 'lastedituserid', 'lasteditdate' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : 'userid',
				dataIndex : 'userId',
				hidden : true
			}, {
				header : '缴费日期',
				dataIndex : 'chargedate'
			}, {
				header : '缴费金额',
				dataIndex : 'chargeamount'
			}]
		// end of columns
				});
		
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			usercid = this.id;
//			this.formPanel.loadData( {
//				url : __ctxPath + '/diningMgnt/getDiningCharge.do?id='
//						+ this.id,
//				root : 'data',
//				preName : 'diningCharge'
//			});
			
		}

	},// end of the initcomponents

	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new CustChargeHistoryDetail( {
				id : rec.data.id,
				userid:rec.data.userId
			}).show();
		});
	},	
	
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function() {

		this.close();
	},
	/**
	 * 保存记录
	 */

	// 创建记录
	createRs : function() {
		
		new CustChargeHistoryDetail({userid:usercid}).show();
	},	
	// 编辑Rs
	editRs : function(record) {
		new CustChargeHistoryDetail( {
			id : record.data.id,
			userid:record.data.userId
		}).show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDelwithCallBack( {
			url : __ctxPath + '/diningMgnt/multiDelDiningCharge.do',
			ids : id,
			grid : this.gridPanel,
			callback:function(){
				var totalgridPanel = Ext.getCmp('CustChargeHistoryGrid');
				if (totalgridPanel != null) {
					totalgridPanel.getStore().reload();
				}			
			}
		});


	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRswithCallBack( {
			url : __ctxPath + '/diningMgnt/multiDelDiningCharge.do',
			grid : this.gridPanel,
			idName : 'id',
			callback:function(){
				var totalgridPanel = Ext.getCmp('CustChargeHistoryGrid');
				if (totalgridPanel != null) {
					totalgridPanel.getStore().reload();
				}			
		}
		});


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