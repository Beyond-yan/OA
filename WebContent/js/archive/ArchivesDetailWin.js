/**
 * @createtime:2010-05-20
 * @author Ropen
 * @description 公文拟稿发文界面
 * @class ArchivesDetailWin
 * @extends Ext.Panel
 */
ArchivesDetailWin = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		ArchivesDetailWin.superclass.constructor.call(this, {
					title : '公文详情',
					id : 'ArchivesDetailWin',
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
				url:__ctxPath+ '/pages/archive/archiveInfo.jsp?archivesId='+ this.archivesId+'&rand='+Math.random()
			}
		});
	}// end of init
});