Ext.ns('LeaveViewDetail');
/**
 * @createtime:2013-12-04
 * @description 公文详情界面
 * @class LeaveViewDetail
 * @extends Ext.Panel
 */
LeaveViewDetail = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		LeaveViewDetail.superclass.constructor.call(this, {
			title : '流程详情',
			id : 'LeaveViewDetail',
			iconCls : 'btn-archives-detail',
			layout : 'form',
			modal : true,
			autoScroll:true,
			height : 430,
			width : 750,
			border : false,
			buttonAlign : 'center',
			buttons :  [ {
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
			//columnWidth : 1,
			id:'LeaveViewDetail.displayPanel',
			width:720,
			autoScroll:true,
			autoHeight:true,
			autoLoad:{
				url:__ctxPath+ '/pages/leave/leaveInfo.jsp?archivesId='+ this.archivesId+'&defId='+this.defId+'&archType='+this.archType+'&sentPanelId=archivesSentInfoDetail'+'&detailId=archivesSentInfoDetail.displayPanel'+'&isGranted='+this.isGranted
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