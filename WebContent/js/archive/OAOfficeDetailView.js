/**
 * @createtime:2014-08-27
 * @description 办公助手公文详情界面
 * @class OAOfficeDetailView
 * @extends Ext.Panel
 */
OAOfficeDetailView = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		OAOfficeDetailView.superclass.constructor.call(this, {
					title : '公文详情',
					id : 'OAOfficeDetailView',
					iconCls : 'btn-archives-detail',
					layout : 'form',
					modal : true,
					autoScroll:true,
					height : 430,
					width : 750,
					border : false,
					buttonAlign : 'center',
					buttons :  [{
									text : '关闭',
									iconCls : 'btn-del',
									handler : this.closePanel,
									scope : this
								}],
					items : [this.panel,this.displayPanel]
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
			width:720,
			autoScroll:true,
			autoHeight:true,
			autoLoad:{
				url:__ctxPath+ '/pages/archive/oaOfficeArchivesInfo.jsp?archivesId='+ this.archivesId+'&defId='+this.defId
			}
		});
		this.displayPanel = new Ext.Panel({
			title:'审批信息',
			autoScroll:true,
			width:720,
			autoHeight:true,
			autoLoad:{
				url:__ctxPath+'/flow/processRunDetail.do?randId='+Math.random()+'&taskId='+this.taskId+'&runId='+this.runId
			}
		});
	}// end of init
});