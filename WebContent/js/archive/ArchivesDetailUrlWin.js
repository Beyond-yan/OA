/**
 * @createtime:2010-05-20
 * @author Ropen
 * @description 公文拟稿发文界面
 * @class ArchivesDetailUrlWin
 * @extends Ext.Panel
 */
ArchivesDetailUrlWin = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		ArchivesDetailUrlWin.superclass.constructor.call(this, {
					title : '表单详情',
					id : 'ArchivesDetailUrlWin',
					iconCls : 'btn-archives-detail',
					layout : 'fit',
					modal : true,
					height : 430,
					width : 750,
					maximizable : true,
					border : false,
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
			//columnWidth : 1,
			autoScroll:true,
			autoLoad:{
				url:__ctxPath+ this.archivesurl+ this.archivesId+'&rand='+Math.random()
			}
		});
	}// end of init
});