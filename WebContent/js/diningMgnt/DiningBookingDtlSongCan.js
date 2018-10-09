/**
 * @author
 * @createtime
 * @class DiningBookingDtlSongCan
 * @extends Ext.Window
 * @description DiningCharge表单
 * @company 捷达世软件
 */
DiningBookingDtlSongCan = Ext.extend(Ext.Window, {
	// 构造函数
	
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiningBookingDtlSongCan.superclass.constructor.call(this, {
			id : 'DiningBookingDtlSongCanWin',
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
		var gridstore = new Ext.data.Store(
			{
				id:'DBDtlSongCanStore',
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + "/diningMgnt/listDiningBookingDetail.do"
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'diningSongCanViewRid',
							fields : [ {
								name : 'id',
								type : 'int'
							},{'name':'appUser.userId',mapping:'userId'},'appUser.fullname','diningBooking.menudate',
									'diningBooking.diningMealtype.typename', 'diningBooking.diningroom',
									'diningBooking.diningFoodtype.foodtypename','qty','amount','subAmount']
						}),
				remoteSort : true
			
			});
		gridstore.load({
			params : {
				start : 0,
				limit : 15,
				'Q_diningBooking.menudate_D_EQ':this.menudate,
				'Q_diningBooking.diningroom_S_EQ':this.dineroom,
				'Q_diningBooking.dineplace_S_EQ':this.dineplace,
				'Q_diningBooking.deptid_L_EQ':this.deptid,
				'Q_diningBooking.mealtypeid_L_EQ': this.mealtype
			}
		});		
		
		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			noSel:true,
			id : 'DBDtlSongcanGrid',
			store:gridstore,
//			url : __ctxPath + "/diningMgnt/listDiningBookingDetail.do?"
//					+ 'Q_diningBooking.menudate_D_EQ='+ this.menudate
//					+ '&Q_diningBooking.diningroom_S_EQ='+ this.dineroom
//					+ '&Q_diningBooking.dineplace_S_EQ='+ this.dineplace
//					+ '&Q_diningBooking.deptid_L_EQ='+ this.deptid 
//					+ '&Q_diningBooking.mealtypeid_L_EQ=' + this.mealtype,					
//			fields : [ {
//				name : 'id',
//				type : 'int'
//			},{'name':'appUser.userId',mapping:'userId'},'appUser.fullname','diningBooking.menudate',
//					'diningBooking.diningMealtype.typename', 'diningBooking.diningroom',
//					'diningBooking.diningFoodtype.foodtypename','qty','amount','subAmount'],
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
//			bbar : new HT.PagingBar({store : gridstore,pageSize : 15})
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