/**
 * @createtime:2010-01-20
 * @author csx
 * @description 公文拟稿发文界面
 * @class UserContractDetailWin
 * @extends Ext.Panel
 */
UserContractDetailWin = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		UserContractDetailWin.superclass.constructor.call(this, {
					title : '合同详情',
					id : 'UserContractDetailWin',
					iconCls : 'btn-archives-detail',
					layout : 'form',
					modal : true,
					height : 430,
					width : 750,
					maximizable : true,
					border : false,
					autoScroll : true,
					buttonAlign : 'center',
					buttons :  [ {
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
			autoHeight : true,
			//columnWidth : 1,
			autoScroll:true,
			autoLoad:{
				url:__ctxPath+ '/pages/hrm/contractFile.jsp?contractId='+ this.contractId
			}
		});
	}// end of init
});