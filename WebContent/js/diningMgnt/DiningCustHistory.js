/**
 * @author
 * @createtime
 * @class DiningCustHistory
 * @extends Ext.Window
 * @description DiningCharge表单
 * @company 捷达世软件
 */


DiningCustHistory = Ext.extend(Ext.Window, {
	// 构造函数
	
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiningCustHistory.superclass.constructor.call(this, {
			id : 'DiningCustHistoryWin',
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

		var gridstore = new Ext.data.JsonStore(
				{
					url : __ctxPath + "/diningMgnt/listDiningBookingDetail.do?Q_isSent_N_EQ=1",
					root : 'result',
					totalProperty : 'totalCounts',
					fields : [ {
						name : 'id',
						type : 'int'
					},{'name':'appUser.userId',mapping:'userId'},'appUser.fullname','diningBooking.menudate',
							'diningBooking.diningMealtype.typename', 'diningBooking.diningroom',
							'diningBooking.diningFoodtype.foodtypename','qty','amount','subAmount']				
				});
		//gridstore.load();
			gridstore.load({
				params : {
					start : 0,
					limit : 15,
					'Q_appUser.userId_L_EQ':this.id
				}
			});
		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			// 使用RowActions
			id : 'DCFrmDiningChargeGrid',
			store:gridstore,
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : 'userid',
				dataIndex : 'userId',
				hidden : true
			}, {
				header : '消费人姓名',
				dataIndex : 'appUser.fullname'
			}, {
				header : '用餐日期',
				dataIndex : 'diningBooking.menudate'
			},
			{
				header : '用餐类别',
				dataIndex : 'diningBooking.diningMealtype.typename'
			}, {
				header : '用餐类型',
				dataIndex : 'diningBooking.diningFoodtype.foodtypename'
			}, {
				header : '供餐食堂',
				dataIndex : 'diningBooking.diningroom'
			}, {
				header : '数量',
				dataIndex : 'qty'
			}, {
				header : '价格',
				dataIndex : 'amount'
			}, {
				header : '合计',
				dataIndex : 'subAmount'
			}]
		// end of columns
				});
	
	},// end of the initcomponents
	
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function() {

		this.close();
	}
	
});