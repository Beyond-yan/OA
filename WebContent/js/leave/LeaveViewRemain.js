Ext.ns('LeaveViewRemain');
LeaveViewRemain = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		LeaveViewRemain.superclass.constructor.call(this, {
			title : '审批说明',
			id : 'LeaveViewRemain',
			iconCls : 'menu-archive-draft',
			layout : 'form',
			modal : true,
			autoScroll:true,
			height : 380,
			width : 650,
			border : false,
			buttonAlign : 'center',
			buttons :  [{
				text : '关闭',
				iconCls : 'btn-del',
				handler : this.closePanel,
				scope : this
			}],
			items : [this.panel]
		});
	},
	/**
	 * 关闭Panel
	 */
	closePanel : function() {
		this.close();
	},
	
	/**
	 * init the components
	 */
	init : function() {
		this.panel = new Ext.Panel({
			//columnWidth : 1,
			id:'LeaveViewRemain.displayPanel',
			width:620,
			autoScroll:true,
			autoHeight:true,
			autoLoad:{
				url:__ctxPath+ '/pages/leave/leaveRemain.jsp'
			}
		});
	}// end of init
});