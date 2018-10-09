/**
 * @createtime:2013-12-04
 * @description 公文详情界面
 * @class ArchMeetingDetailView
 * @extends Ext.Panel
 */
ArchMeetingDetailView = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		ArchMeetingDetailView.superclass.constructor.call(this, {
					title : '公文详情',
					id : 'ArchMeetingDetailView',
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
		var url = __ctxPath+ '/pages/meetingNotice/meetingNoticeInfo.jsp?noticeId='+ this.noticeId+'&defId='+this.defId+'&sentPanelId=archivesSentInfoDetail'+'&detailId=archivesSentInfoDetail.displayPanel'+'&isGranted='+this.isGranted;
		
		this.panel = new Ext.Panel({
			//columnWidth : 1,
			id:'archivesSentInfoDetail.displayPanel',
			width:720,
			autoScroll:true,
			autoHeight:true,
			autoLoad:{
				url:url
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