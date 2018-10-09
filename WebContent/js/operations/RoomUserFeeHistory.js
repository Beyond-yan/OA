
RoomUserFeeHistory = Ext.extend(Ext.Window,
{
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		RoomUserFeeHistory.superclass.constructor.call(this,
		{
			id : 'RoomUserFeeHistoryWin',
			modal : true,
			height : 500,
			width : 800,
			maximizable : true,
			title : '缴费记录',
			items : [this.formPanel,this.gridPanel]
		});
	
	},// end of the constructor
	initUIComponents : function()
	{	
		this.formPanel = new Ext.FormPanel
		({
			border:false,
	        bodyStyle:'padding:5px 5px 0',
	        width: 800,
	        height:160,
	        items: 
	        [{
	        	border:false,
	            layout:'column',
	            items:
	            [{
	                columnWidth:.5,
	                layout: 'form',
	                border:false,
	                items : 
	                [
						{
							fieldLabel : '帐号',
							xtype:'textfield',
							name : 'personnelEmployee.appUser.username',
							anchor : '95%'
						}, 
						{
							fieldLabel : '姓名',
							xtype:'textfield',
							name : 'personnelEmployee.appUser.fullname',
							anchor : '95%'
						}, 
						{
							fieldLabel : '称呼',
							hiddenName : 'personnelEmployee.appUser.title',
							allowBlank : false,
							editable : false,
							xtype : 'combo',
							mode : 'local',
							triggerAction : 'all',
							store : [ [ '1', '先生' ], [ '2', '女士' ] ],
							disabled:'true',
							anchor : '95%'
						},			
						{
							fieldLabel : '所属部门',
							xtype:'textfield',
							name:'personnelEmployee.appUser.department.depName',
							anchor : '95%'
						},	
						{
							fieldLabel : '处室',
							xtype:'textfield',
							name:'personnelEmployee.room',
							anchor : '95%'
						},
						{
							fieldLabel : 'eMail',
							xtype:'textfield',
							name:'personnelEmployee.appUser.email',
							vtype :'email',
							anchor : '95%'
						}]
	            }, //end of column 1
	            {
	                columnWidth:.5,
	                layout: 'form',
	                border:false,
	                items: [
			                	{
									xtype:'numberfield',
									fieldLabel : '家庭电话',
									name:'personnelEmployee.appUser.phone',
									anchor : '95%'					
								},
		                		{
									xtype:'numberfield',
									fieldLabel : '办公电话',
									name:'personnelEmployee.officePhone',
									anchor : '95%'
								},	
								{
									xtype:'numberfield',
									fieldLabel : '内线分机',
									name:'personnelEmployee.ext',
									anchor : '95%'
								},	
								{
									xtype:'numberfield',
									fieldLabel : '移动电话',
									name:'personnelEmployee.appUser.mobile',
									anchor : '95%'
								},	
								{
									xtype:'numberfield',
									fieldLabel : '短号',
									name:'personnelEmployee.shortPhone',
									anchor : '95%'
								}
	                		]
	              }// end of column 2

	            ]
	        }
	        ]
    });		
		
		this.gridPanel = new HT.GridPanel
		({
			region : 'center',
			id : 'ProUserFeeGrid',
			noSel:true,
			url : __ctxPath + "/operations/userFeeListProUserFee.do?month="+ this.roomid +"&id=" + this.userid,
			fields : [ 
					'startTime', 'endTime', 'amount',		
					'waterFee', 'powerFee', 'roomFee'],
			columns : [
			        {
						header : '水费',
						dataIndex : 'waterFee'
					}, {
						header : '电费',
						dataIndex : 'powerFee'
					}, {
						header : '房费',
						dataIndex : 'roomFee'
					}, {
						header : '总费用',
						dataIndex : 'amount'
					}, {
						header : '统计开始时间',
						dataIndex : 'startTime'
					}, {
						header : '统计截止时间',
						dataIndex : 'endTime'
					}]
				// end of columns
			});
			
		// 加载表单对应的数据
		if (this.userid != null && this.userid != 'undefined') 
		{		
			this.formPanel.loadData( {
				url : __ctxPath + '/personal/getPersonnelEmployee.do?pid=' + this.userid,
				root : 'data',
				preName:'personnelEmployee'
			});
		}
		
	}
});