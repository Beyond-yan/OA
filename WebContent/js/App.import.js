/**
 * 系统导入的模块js，主要用于后加载方式，需要使用某些js时，需要在此指定加载哪一些。
 */
Ext.ns("App");
App.importJs = {

	/**
	 * 领导活动
	 */
	WeiLeaderCalendarView : [
			__ctxPath + '/js/leaderActivities/WeiLeaderCalendarView.js',
			__ctxPath + '/js/leaderActivities/LeaderCalendarForm.js' ],
	GLJLeaderCalendarView : [
	             			__ctxPath + '/js/leaderActivities/GLJLeaderCalendarView.js',
	             			__ctxPath + '/js/leaderActivities/LeaderCalendarForm.js' ],
	LeaderCalendarView : [
			__ctxPath + '/js/leaderActivities/LeaderCalendarForm.js',
			__ctxPath + '/js/leaderActivities/LeaderCalendarView.js' ],
	AllScheduleView : [ __ctxPath + '/js/leaderActivities/AllScheduleView.js',
			__ctxPath + '/js/leaderActivities/EditScheduleForm.js' ],
	EditScheduleNewForm : [
			__ctxPath + '/js/leaderActivities/AllScheduleView.js',
			__ctxPath + '/js/leaderActivities/EditScheduleNewForm.js' ],
	/**
	 * 外出登记
	 */
	SysUserAllView : [ __ctxPath + '/js/system/SysUserAllView.js',
			__ctxPath + '/js/system/SysUserAllForm.js' ],

	/**
	 * Schema管理
	 * 
	 * @type
	 */
	SysSchemaConfigView : [ __ctxPath + '/js/system/SysSchemaConfigView.js',
			__ctxPath + '/js/system/SysSchemaConfigForm.js' ],

	/**
	 * 部署点管理
	 * 
	 * @typeCheckSelect
	 */
	SysOaSiteView : [ __ctxPath + '/js/system/SysOaSiteView.js',
			__ctxPath + '/js/system/SysOaSiteForm.js' ],

	SysDataTransferView : [ __ctxPath + '/js/system/SysDataTransferView.js',
			__ctxPath + '/js/system/SysDataTransferForm.js' ],

	SysDataTransferHisView : [
			__ctxPath + '/js/system/SysDataTransferHisView.js',
			__ctxPath + '/js/archive/ToReceiveArchivesDetailView.js',
			__ctxPath + '/js/archive/FeedbackForm.js' ],
	/**
	 * 接口服务管理
	 * 
	 */
	SysServiceAccountView : [
			__ctxPath + '/js/system/SysServiceAccountView.js',
			__ctxPath + '/js/system/SysServiceAccountForm.js',
			__ctxPath + '/js/system/SysServiceAccountPsdChangeForm.js',
			__ctxPath + '/js/system/SysInterfaceAccountView.js' ],

	SysServiceInterfaceView : [
			__ctxPath + '/js/system/SysServiceInterfaceView.js',
			__ctxPath + '/js/system/SysServiceInterfaceForm.js' ],

	SysServiceAccessLogView : [
			__ctxPath + '/js/system/SysServiceAccessLogView.js',
			__ctxPath + '/js/system/SysServiceAccessLogForm.js' ],
	/**
	 * 外出登记
	 */
	OutPersonView : [ __ctxPath + '/js/out/OutPersonView.js',
			__ctxPath + '/js/out/emailForm.js',
			__ctxPath + '/js/out/EditOutForm.js' ],
	EditOutNewView : [ __ctxPath + '/js/out/OutPersonView.js',
			__ctxPath + '/js/out/emailForm.js',
			__ctxPath + '/js/out/EditOutNewView.js' ],
	/**
	 * 旧OA数据查询
	 */
	JwArchivesView : [ __ctxPath + '/js/jw/JwArchivesView.js',
			__ctxPath + '/js/jw/JwArchivesForm.js',
			__ctxPath + '/js/jw/JwArchivesDetailForm.js' ],
	JwRecArchivesView : [ __ctxPath + '/js/jw/JwRecArchivesView.js',
			__ctxPath + '/js/jw/JwRecArchivesDetailForm.js' ],
	JwSentArchivesView : [ __ctxPath + '/js/jw/JwSentArchivesView.js',
			__ctxPath + '/js/jw/JwSentArchivesDetailForm.js' ],
	JwAttachfileView : [ __ctxPath + '/js/jw/JwAttachfileView.js',
			__ctxPath + '/js/jw/JwAttachfileForm.js' ],
	JwReceivedDocsView : [ __ctxPath + '/js/jw/JwReceivedDocsView.js',
			__ctxPath + '/js/jw/JwReceivedDocsForm.js',
			__ctxPath + '/js/jw/JwReceivedDocsDetailForm.js' ],
	JwSentDocsView : [ __ctxPath + '/js/jw/JwSentDocsView.js',
			__ctxPath + '/js/jw/JwSentDocsForm.js',
			__ctxPath + '/js/jw/JwSentDocsDetailForm.js' ],
	//督查事项
	CheckSelect : [ __ctxPath + '/js/work/CheckSelect.js',
   	        __ctxPath + '/js/work/CheckSelectAddView.js',
   	        __ctxPath + '/js/work/CheckSelectEditUser.js',
   	        __ctxPath + '/js/work/CheckSelectDetailView.js',
   	        __ctxPath + '/js/work/CheckSelectProcessView.js' ],
   	CheckSelectView : [ __ctxPath + '/js/work/CheckSelectView.js',
   	        __ctxPath + '/js/work/CheckSelectAddView.js',
   	        __ctxPath + '/js/work/CheckSelectEditUser.js',
   	        __ctxPath + '/js/work/CheckSelectDetailView.js',
   	        __ctxPath + '/js/work/CheckSelectProcessView.js' ],
	/**
	 * 发文管理
	 */
	/**
	 * 发文拟稿修改
	 * 
	 * @author Ropen
	 * @Date 2013.10.11
	 */
	ArchivesInitialView : [ __ctxPath + '/js/archive/ArchivesInitialView.js',
			__ctxPath + '/js/flow/ProDefinitionDetail.js',
			__ctxPath + '/js/flow/ProDefinitionView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	ArchivesInitView : [ __ctxPath + '/js/archive/ArchivesInitView.js',
			__ctxPath + '/js/flow/ProDefinitionDetail.js',
			__ctxPath + '/js/flow/ProDefinitionView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	ArchivesDraftManage : [ __ctxPath + '/js/archive/ArchivesDraftManage.js',
			__ctxPath + '/js/archive/ArchivesDraftView.js',
			__ctxPath + '/js/archive/ArchivesDraftWin.js',
			__ctxPath + '/js/archive/ArchTemplateView.js',
			__ctxPath + '/js/archive/ArchTemplateSelector.js',
			__ctxPath + '/js/archive/ArchivesDocForm.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/archive/ArchivesDocHistoryWin.js',
			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js',
			__ctxPath + '/js/core/ntkoffice/NtkOfficePanel.js' ],
	DispatchDraftView : [ __ctxPath + '/js/archive/DispatchDraftView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/archive/DispatchSentEdit.js' ],
	IncomingDraftView : [ __ctxPath + '/js/archive/IncomingDraftView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/archive/ArchivesReceiveEdit.js' ],
	ArchivesIssueMonitor : [ __ctxPath + '/js/archive/ArchivesIssueMonitor.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/archive/JcgsDetailView.js',
			__ctxPath + '/js/archive/WfbaDetailView.js',
			__ctxPath + '/js/archive/ArchSubDetailForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js' ],
	ArchivesIssueSearch : [ __ctxPath + '/js/archive/ArchivesIssueSearch.js',
	            			__ctxPath + '/js/archive/JcgsDetailView.js',
	            			__ctxPath + '/js/archive/WfbaDetailView.js',
	            			__ctxPath + '/js/archive/ArchDetailView.js' ],
	ArchivesIssueManage : [ __ctxPath + '/js/archive/ArchivesIssueManage.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/archive/ArchivesShareForm.js' ],
	JWArchivesIssueSearch : [ __ctxPath + '/js/archive/JWArchivesIssueSearch.js',
			          __ctxPath + '/js/archive/ArchDetailView.js' ],
	JWArchivesHandleView : [ __ctxPath + '/js/archive/JWArchivesHandleView.js',
		           	__ctxPath + '/js/archive/ArchivesHandleForm.js',
		           	__ctxPath + '/js/archive/ArchDetailView.js',
		           	 __ctxPath + '/js/flow/ProcessRunDetail.js' ],
	JWArchivesRecAllView : [__ctxPath + '/js/archive/JWArchivesRecAllView.js',
	            		  __ctxPath + '/js/archive/ArchDetailView.js',
	            		  __ctxPath + '/js/flow/ProcessRunDetail.js',
	            		  __ctxPath + '/js/archive/ArchivesShareForm.js'],
    	JWArchivesDraftAllManage : [
	               		__ctxPath + '/js/archive/JWArchivesDraftAllManage.js',
	               		__ctxPath + '/js/archive/ArchDetailView.js',
	               		__ctxPath + '/js/archive/ArchivesDetail.js',
	               		__ctxPath + '/js/archive/ArchSubDetailForm.js',
	               		__ctxPath + '/js/flow/ProcessRunDetail.js',
	               		__ctxPath + '/js/archive/ArchivesFreeJumpWin.js' ],
	/**
	 * 收文管理
	 */
	/**
	 * 收文登记修改
	 * 
	 * @author Ropen
	 * @Date 2013.10.11
	 */
	ArchivesRecRecordView : [
			__ctxPath + '/js/archive/ArchivesRecRecordView.js',
			__ctxPath + '/js/flow/ProDefinitionDetail.js',
			__ctxPath + '/js/flow/ProDefinitionView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	ArchDispatchView : [ __ctxPath + '/js/archive/ArchDispatchView.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/flow/ReWriteFlowOpinionForm.js',
			__ctxPath + '/js/flow/FlowDetailEditCommentsForm.js',
			__ctxPath + '/js/archive/ArchivesWriteOpionView.js',
			__ctxPath + '/js/archive/ArchDistributeForm.js' ],
	ArchReadView : [ __ctxPath + '/js/archive/ArchReadView.js',
			__ctxPath + '/js/archive/ArchReadForm.js',
			__ctxPath + '/js/archive/ArchivesDocWin.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	ArchWorkView : [ __ctxPath + '/js/archive/ArchWorkView.js',
            __ctxPath + '/js/archive/ArchDetailView.js',
            __ctxPath + '/js/flow/ProcessRunDetail.js',
            __ctxPath + '/js/flow/ProcessRunStart.js' ],
	ArchivesRecCtrlView : [ __ctxPath + '/js/archive/ArchivesRecCtrlView.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/archive/ArchSubDetailForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/flow/ReWriteFlowOpinionForm.js',
			__ctxPath + '/js/flow/FlowDetailEditCommentsForm.js',
			__ctxPath + '/js/archive/ArchivesWriteOpionView.js',
			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js',
			__ctxPath + '/js/archive/ArchivesRecCtrlDetailView.js'],
	ArchivesRecCtrlViewGroup : [ __ctxPath + '/js/archive/ArchivesRecCtrlViewGroup.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/archive/ArchSubDetailForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/flow/ReWriteFlowOpinionForm.js',
			__ctxPath + '/js/flow/FlowDetailEditCommentsForm.js',
			__ctxPath + '/js/archive/ArchivesWriteOpionView.js',
			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js' ,
			__ctxPath + '/js/archive/ArchivesRecCtrlDetailView.js'],
	ArchivesHandleView : [ __ctxPath + '/js/archive/ArchivesHandleView.js',
			__ctxPath + '/js/archive/ArchivesHandleForm.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],
	ArchivesRecAllManage : [__ctxPath + '/js/archive/ArchivesRecAllManage.js',
	            			__ctxPath + '/js/archive/ArchDetailView.js',
	            			__ctxPath + '/js/flow/ProcessRunDetail.js',
	            			__ctxPath + '/js/archive/ArchivesShareForm.js'],
	/**报文管理开始*/
	/**发文登记**/
	ArchiveReportApply : [ __ctxPath + '/js/report/ArchiveReportApply.js',
	        __ctxPath + '/js/report/ArchiveReportAddView.js',
  			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/archive/SysArchivesFilesUtil.js' ],
	/**签发公文**/
	ArchiveReportIssue : [ __ctxPath + '/js/report/ArchiveReportIssue.js',
	        __ctxPath + '/js/report/ArchiveReportIssueView.js'],
	/**待套红公文**/
	ArchiveReportRed : [ __ctxPath + '/js/report/ArchiveReportRed.js',
	        __ctxPath + '/js/report/ArchiveReportRedView.js'],
	/**签发公文**/
	ArchiveReportSign : [ __ctxPath + '/js/report/ArchiveReportSign.js',
	        __ctxPath + '/js/report/ArchiveReportSignView.js'],
	/**待发公文**/
	ArchiveReportSend : [ __ctxPath + '/js/report/ArchiveReportSend.js',
	        __ctxPath + '/js/report/ArchiveReportSendView.js'],
	/**已内退公文**/
	ArchiveReportBack : [ __ctxPath + '/js/report/ArchiveReportBack.js',
	        __ctxPath + '/js/report/ArchiveReportAddView.js',
	        __ctxPath + '/js/report/ArchiveReportBackView.js'],
	ToReportArchivesView : [
 			__ctxPath + '/js/report/ToReportArchivesView.js',
 			__ctxPath + '/js/archive/ToReceiveArchivesDetailView.js',
 			__ctxPath + '/js/archive/ToReceiveArchFlowView.js',
 			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/archive/ArchivesDepView.js',
 			__ctxPath + '/js/archive/FeedbackForm.js',
 			__ctxPath + '/js/flow/ProcessRunStart.js' ],
  	/**报文管理结束*/
 			
 	/**会议通知开始*/
 	ArchMeetingApply : [ __ctxPath + '/js/archMeeting/ArchMeetingApply.js',
            __ctxPath + '/js/flow/ProcessRunStart.js',
	        __ctxPath + '/js/flow/ProDefinitionView.js',
	        __ctxPath + '/js/archive/ArchivesRecRecordView.js',
	        __ctxPath + '/js/archive/SysArchivesFilesUtil.js'],
    ArchMeetingWait : [ __ctxPath + '/js/archMeeting/ArchMeetingWait.js',
 			__ctxPath + '/js/archMeeting/ArchMeetingDetailView.js',
 			__ctxPath + '/js/flow/ProcessRunDetail.js',
 			__ctxPath + '/js/flow/ReWriteFlowOpinionForm.js',
 			__ctxPath + '/js/flow/FlowDetailEditCommentsForm.js',
 			__ctxPath + '/js/archive/ArchivesWriteOpionView.js',
 			__ctxPath + '/js/archive/ArchDistributeForm.js' ],
	ArchMeetingOn : [ __ctxPath + '/js/archMeeting/ArchMeetingOn.js',
	        __ctxPath + '/js/archMeeting/ArchMeetingActForWin.js',
	        __ctxPath + '/js/archMeeting/ArchMeetingDetailView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/archive/ArchSubDetailForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/flow/ReWriteFlowOpinionForm.js',
			__ctxPath + '/js/flow/FlowDetailEditCommentsForm.js',
			__ctxPath + '/js/archive/ArchivesWriteOpionView.js',
			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js',
			__ctxPath + '/js/archive/ArchivesRecCtrlDetailView.js'],
	ArchMeetingView : [ __ctxPath + '/js/archMeeting/ArchMeetingView.js',
   			__ctxPath + '/js/archive/ArchivesHandleForm.js',
   			__ctxPath + '/js/archMeeting/ArchMeetingDetailView.js',
   			__ctxPath + '/js/flow/ProcessRunDetail.js' ],
	ArchMeetingAttend : [ __ctxPath + '/js/archMeeting/ArchMeetingAttend.js',
            __ctxPath + '/js/archive/ArchivesHandleForm.js',
            __ctxPath + '/js/archMeeting/ArchMeetingDetailView.js',
            __ctxPath + '/js/flow/ProcessRunDetail.js' ],
 	/**会议通知结束*/
 			
 	/**主任办公会开始*/
 	OfficeMeetingApply : [ __ctxPath + '/js/officeMeeting/OfficeMeetingApply.js',
 	        __ctxPath + '/js/flow/ProcessRunStart.js',
 	        __ctxPath + '/js/flow/ProDefinitionView.js',
 	        __ctxPath + '/js/archive/ArchivesRecRecordView.js',
 	        __ctxPath + '/js/archive/SysArchivesFilesUtil.js' ],
 	OfficeMeetingWait : [ __ctxPath + '/js/officeMeeting/OfficeMeetingWait.js',
 			__ctxPath + '/js/archive/ArchDetailView.js',
 			__ctxPath + '/js/flow/ProcessRunDetail.js',
 			__ctxPath + '/js/flow/ReWriteFlowOpinionForm.js',
 			__ctxPath + '/js/flow/FlowDetailEditCommentsForm.js',
 			__ctxPath + '/js/archive/ArchivesWriteOpionView.js',
 			__ctxPath + '/js/archive/ArchDistributeForm.js' ],
 	OfficeMeetingOn : [ __ctxPath + '/js/officeMeeting/OfficeMeetingOn.js',
 	        __ctxPath + '/js/officeMeeting/OfficeMeetingEdit.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/archive/ArchSubDetailForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/flow/ReWriteFlowOpinionForm.js',
			__ctxPath + '/js/flow/FlowDetailEditCommentsForm.js',
			__ctxPath + '/js/archive/ArchivesWriteOpionView.js',
			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js',
			__ctxPath + '/js/officeMeeting/OfficeMeetingChangeTaskWin.js',
			__ctxPath + '/js/archive/ArchivesRecCtrlDetailView.js'],
	OfficeMeetingTimes : [ __ctxPath + '/js/officeMeeting/OfficeMeetingTimes.js',
	        __ctxPath + '/js/officeMeeting/OfficeMeetingEdit.js',
	        __ctxPath + '/js/officeMeeting/OfficeMeetingTimesAddForm.js',
	        __ctxPath + '/js/officeMeeting/OfficeMeetingTimesSetForm.js',
	        __ctxPath + '/js/officeMeeting/OfficeMeetingTimesSendBGSForm.js',
	        __ctxPath + '/js/officeMeeting/OfficeMeetingNumberSetForm.js',
	        __ctxPath + '/js/archive/ArchDetailView.js'],
	OfficeMeetingBGSZR : [ __ctxPath + '/js/officeMeeting/OfficeMeetingBGSZR.js',
		    __ctxPath + '/js/officeMeeting/OfficeMeetingEdit.js',
		    __ctxPath + '/js/officeMeeting/OfficeMeetingBGSZRSendForm.js',
		    __ctxPath + '/js/archive/ArchDetailView.js'],
	OfficeMeetingWleader : [ __ctxPath + '/js/officeMeeting/OfficeMeetingWleader.js',
            __ctxPath + '/js/officeMeeting/OfficeMeetingEdit.js',
            __ctxPath + '/js/officeMeeting/OfficeMeetingWleaderSendForm.js',
            __ctxPath + '/js/archive/ArchDetailView.js'],
 	/**主任办公会结束*/
 			
 			
 			
	/**请假管理开始*/
	LeaveViewApply : [
			__ctxPath + '/js/leave/LeaveViewApply.js',
			__ctxPath + '/js/flow/ProDefinitionDetail.js',
			__ctxPath + '/js/flow/ProDefinitionView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	/**草稿箱**/
	LeaveViewDraft : [ __ctxPath + '/js/leave/LeaveViewDraft.js',
  			__ctxPath + '/js/flow/ProcessRunStart.js'],
  	/**待办件**/
  	LeaveViewWait : [ __ctxPath + '/js/leave/LeaveViewWait.js',
			__ctxPath + '/js/archive/ArchivesDraftView.js',
			__ctxPath + '/js/archive/ArchivesDraftWin.js',
			__ctxPath + '/js/archive/ArchTemplateView.js',
			__ctxPath + '/js/archive/ArchTemplateSelector.js',
			__ctxPath + '/js/archive/ArchivesDocForm.js',
			__ctxPath + '/js/leave/LeaveViewDetail.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/archive/ArchivesDocHistoryWin.js',
			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js' ],		
	/**在办件**/
	LeaveViewOn : [ __ctxPath + '/js/leave/LeaveViewOn.js',
			__ctxPath + '/js/leave/LeaveViewDetail.js',
			__ctxPath + '/js/archive/ArchSubDetailForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js' ],
  	/**统计信息**/
  	LeaveViewStatic : [ __ctxPath + '/js/leave/LeaveViewStatic.js',
			__ctxPath + '/js/leave/LeaveViewDetail.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js'],	
  	/**请假记录**/
  	LeaveViewRecord : [ __ctxPath + '/js/leave/LeaveViewRecord.js',
			__ctxPath + '/js/leave/LeaveViewDetail.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js'],	
	/**请假管理结束*/
	/**
	 * 公文下载
	 */

	documentChangeTrainsView : [
			__ctxPath + '/js/task/documentChangeTrainsView.js',
			__ctxPath + '/js/task/DocumentChangeView.js' ],

	ArchivesDepReceiveView : [
			__ctxPath + '/js/archive/ArchivesDepReceiveView.js',
			__ctxPath + '/js/archive/HandleBackForm.js',
			__ctxPath + '/js/archive/ArchivesDetail.js',
			__ctxPath + '/js/archive/ToReceiveArchivesDetailView.js' ],
	ArchivesPeopleReceiveView : [
  			__ctxPath + '/js/archive/ArchivesPeopleReceiveView.js',
  			__ctxPath + '/js/archive/HandleBackForm.js',
  			__ctxPath + '/js/archive/ArchivesDetail.js',
  			__ctxPath + '/js/archive/ToReceiveArchivesDetailView.js' ],
	/**
	 * 公文发送
	 */
	DocumentSentView : [ __ctxPath + '/js/task/DocumentSentView.js',
			__ctxPath + '/js/task/DocumentSentForm.js',
			__ctxPath + '/js/archive/ToReceiveArchivesDetailView.js',
			__ctxPath + '/js/archive/ToReceiveArchFlowView.js',
			__ctxPath + '/js/archive/FeedbackForm.js',
			__ctxPath + '/js/archive/SysArchivesFilesUtil.js' ],
	/**
	 * 公下载监控
	 */
	ArchivesDownloadMonitor : [
			__ctxPath + '/js/archive/ArchivesDownloadMonitor.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/archive/DownNoticeForm.js',
			__ctxPath + '/js/archive/ArchivesDepView.js',
			__ctxPath + '/js/archive/FeedbackForm.js' ],
			/**
			 * 收文载监控
			 */
			ArchivesReceiveDownloadMonitor : [
					__ctxPath + '/js/archive/ArchivesReceiveDownloadMonitor.js',
					__ctxPath + '/js/archive/ArchDetailView.js',
					__ctxPath + '/js/archive/DownNoticeForm.js',
					__ctxPath + '/js/archive/ArchivesDepView.js',
					__ctxPath + '/js/archive/FeedbackForm.js' ],
	/**
	 * 公文统计
	 */
	FlowStatisticsSendView : [ __ctxPath + '/js/flow/FlowStatisticsSendView.js' ],
	FlowStatisticsReceiveView : [ __ctxPath
			+ '/js/flow/FlowStatisticsReceiveView.js' ],
	FlowStatisticsByComStepView : [
			__ctxPath + '/js/flow/FlowStatisticsByComStepView.js',
			__ctxPath + '/js/flow/FlowStatisticsStepBySendView.js',
			__ctxPath + '/js/flow/FlowStatisticsStepByReceiveView.js' ],
	/**
	 * 档案管理
	 */
	DocFilesView : [ __ctxPath + '/js/system/DocFilesView.js',
			__ctxPath + '/js/system/DocDirectoryForm.js',
			__ctxPath + '/js/system/DocFilesForm.js',
			__ctxPath + '/js/system/DocFilesDetailForm.js',
			__ctxPath + '/js/system/DocFileListForm.js',
			__ctxPath + '/js/system/DocFileListView.js',
			__ctxPath + '/js/archive/JwArchivesDetail.js',
			__ctxPath + '/js/system/DocFilesAndProcessDetailForm.js',
			__ctxPath + '/js/arch/ViewFileWindow.js' ],
	ToBeDocFilesView : [ __ctxPath + '/js/system/ToBeDocFilesView.js',
 			__ctxPath + '/js/system/DocDirectoryForm.js',
 			__ctxPath + '/js/system/DocFilesForm.js',
 			__ctxPath + '/js/system/DocFilesDetailForm.js',
			__ctxPath + '/js/system/DocFilesAndProcessDetailForm.js',
 			__ctxPath + '/js/system/DocFileListForm.js',
 			__ctxPath + '/js/system/DocFileListView.js',
 			__ctxPath + '/js/archive/JwArchivesDetail.js',
 			__ctxPath + '/js/arch/ViewFileWindow.js' ],
 	DocDirectoryView : [ __ctxPath + '/js/system/DocDirectoryView.js',
 			__ctxPath + '/js/system/DocDirectoryForm.js',
 			__ctxPath + '/js/system/DocDirectoryDetailForm.js',
 			__ctxPath + '/js/system/RowNumberResetForm.js',
 			__ctxPath + '/js/archive/JwArchivesDetail.js',
			__ctxPath + '/js/system/DocFilesAndProcessDetailForm.js',
 			__ctxPath + '/js/system/ToBeDocFilesForm.js'],
	/**
	 * 值班管理
	 */
	DutyPlanView : [ __ctxPath + '/js/duty/DutyPlanView.js',
			__ctxPath + '/js/duty/DutyPlanForm.js' ],
	DutySignView : [ __ctxPath + '/js/duty/DutySignView.js',
			__ctxPath + '/js/duty/DutySignForm.js',
			__ctxPath + '/js/duty/AttendCompanyCalendarView.js' ],

	/**
	 * 会议管理
	 */
	ConfBoardroom : [ __ctxPath + '/js/admin/ConfBoardroom.js',
			__ctxPath + '/js/admin/AddConferenceForm.js' ],
	ZanCunConferenceView : [ __ctxPath + '/js/admin/ZanCunConferenceView.js',
			__ctxPath + '/js/admin/ConferenceDetailForm.js',
			__ctxPath + '/js/admin/ConferenceForm.js' ],
	MyJoinedConferenceView : [
			__ctxPath + '/js/admin/MyJoinedConferenceView.js',
			__ctxPath + '/js/admin/ConferenceForm.js',
			__ctxPath + '/js/admin/ConferenceDetailForm.js',
			__ctxPath + '/js/admin/ConferenceEditForm.js',
			__ctxPath + '/js/communicate/ConferenceSmsMobileForm.js',
			__ctxPath + '/js/admin/ConferenceEditView.js' ],
	MeetingRoomView : [ __ctxPath + '/js/meeting/MeetingRoomView.js',
			__ctxPath + '/js/meeting/MeetingRoomForm.js' ],
	MeetingRecord : [ __ctxPath + '/js/flow/ProDefinitionView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/meeting/out/MeetingRecord.js' ],
	WaitingOutMeeting : [ __ctxPath + '/js/meeting/out/WaitingOutMeeting.js' ],
	GoingOutMeeting : [ __ctxPath + '/js/meeting/out/GoingOutMeeting.js' ],
	AllOutMeeting : [ __ctxPath + '/js/meeting/out/AllOutMeeting.js' ],

	/**
	 * 车辆管理
	 */
	CarConditionView : [ __ctxPath + '/js/vehicle/CarConditionView.js' ],
	CarApplyStartForm : [ __ctxPath + '/js/vehicle/CarApplyStartForm.js',
			__ctxPath + '/js/flow/ProDefinitionView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	VehicleManagementView : [
			__ctxPath + '/js/vehicle/VehicleManagementView.js',
			__ctxPath + '/js/vehicle/VehicleForm.js' ],
	VehicleDriverView : [ __ctxPath + '/js/vehicle/VehicleDriverView.js',
			__ctxPath + '/js/vehicle/VehicleDriverForm.js' ],
	WaitApplyView : [ __ctxPath + '/js/vehicle/WaitApplyView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/vehicle/VehicleApplyForm.js',
			__ctxPath + '/js/vehicle/CarApplyEditForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],
	AppliedView : [ __ctxPath + '/js/vehicle/AppliedView.js',
	      			__ctxPath + '/js/flow/ProcessRunStart.js',
	      			__ctxPath + '/js/vehicle/VehicleApplyForm.js',
	      			__ctxPath + '/js/vehicle/CarApplyEditForm.js',
	      			__ctxPath + '/js/flow/ProcessRunDetail.js' ],
	VehicleApplyView : [ __ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/vehicle/VehicleDistributionForm.js',
			__ctxPath + '/js/vehicle/VehicleApplyView.js',
			__ctxPath + '/js/vehicle/VehicleApplyForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],
	VehicleUsingView : [ __ctxPath + '/js/vehicle/VehicleUsingView.js',
			__ctxPath + '/js/vehicle/AgainCarApplyForm.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/flow/ProDefinitionView.js',
			__ctxPath + '/js/vehicle/CarApplyEditForm.js' ],
	VehicleDistributionView : [
			__ctxPath + '/js/vehicle/VehicleDistributionView.js',
			__ctxPath + '/js/vehicle/CarApplyEditForm.js',
			__ctxPath + '/js/vehicle/VehicleDistributionForm.js' ],
	ClassifyView : [ __ctxPath + '/js/vehicle/ClassifyView.js' ],
	MileagesView : [ __ctxPath + '/js/vehicle/MileagesView.js',
			__ctxPath + '/js/vehicle/MileagesForm.js' ],
	CarCostRecordView : [ __ctxPath + '/js/admin/CarCostRecordView.js',
			__ctxPath + '/js/admin/CarCostRecordForm.js',
			__ctxPath + '/js/selector/CarCostTypeSelector.js',
			__ctxPath + '/js/selector/CarAllSelector.js',
			__ctxPath + '/js/selector/CarAllDriverSelector.js' ],
	/**
	 * 费用类别管理
	 */
	CarCostTypeView : [ __ctxPath + '/js/admin/CarCostTypeView.js',
			__ctxPath + '/js/admin/CarCostTypeForm.js' ],
	CostStatisticsView : [ __ctxPath + '/js/admin/CostStatisticsView.js',
			__ctxPath + '/js/selector/CarAllSelector.js' ],

	/**
	 * 我的办公
	 */
	MyTaskView : [ __ctxPath + '/js/flow/MyTaskView.js',
			__ctxPath + '/js/flow/ChangeTaskView.js',
			__ctxPath + '/js/flow/ProcessNextForm.js' ],
	MyPlanTaskView : [ __ctxPath + '/js/task/CalendarPlanView.js',
			__ctxPath + '/js/task/CalendarPlanForm.js',
			__ctxPath + '/js/task/CalendarPlanFinishForm.js',
			__ctxPath + '/ext3/ux/caltask/e2cs_zh_CN.js',
			__ctxPath + '/ext3/ux/caltask/calendar.js',
			__ctxPath + '/ext3/ux/caltask/scheduler.gzjs',
			__ctxPath + '/ext3/ux/caltask/monthview.js',
			__ctxPath + '/ext3/ux/caltask/weekview.gzjs',
			__ctxPath + '/ext3/ux/caltask/dayview.gzjs',
			__ctxPath + '/ext3/ux/caltask/task.gzjs',
			__ctxPath + '/js/task/MyPlanTaskView.js',
			__ctxPath + '/js/task/CalendarPlanDetailView.js' ],
	AppTeamView : [ __ctxPath + '/js/system/AppTeamForm.js',
			__ctxPath + '/js/system/TeamMemberForm.js',
			__ctxPath + '/js/system/AppTeamView.js' ],
	ProfileForm : [ __ctxPath + '/js/system/ProfileForm.js',
			__ctxPath + '/js/system/ResetPasswordForm.js' ],

	/**
	 * 我的邮箱
	 */

	/**
	 * 我的文件夹
	 */
	NewPublicDocumentForm : [
			__ctxPath + '/js/document/NewPublicDocumentForm.js',
			__ctxPath + '/js/document/DocFolderSelector.js' ],
	DocFolderSharedView : [
			__ctxPath + '/js/document/FindPublicDocumentView.js',
			__ctxPath + '/js/document/DocFolderView.js',
			__ctxPath + '/js/document/DocFolderForm.js',
			__ctxPath + '/js/document/DocFolderSharedView.js',
			__ctxPath + '/js/document/DocFolderSharedForm.js',
			__ctxPath + '/js/document/DocPrivilegeForm.js',
			__ctxPath + '/js/document/DocPrivilegeView.js' ],
	FindPublicDocumentView : [
			__ctxPath + '/js/document/FindPublicDocumentView.js',
			__ctxPath + '/js/document/PublicDocumentView.js',
			__ctxPath + '/js/document/PublicDocumentDetail.js',
			__ctxPath + '/js/document/NewPublicDocumentForm.js',
			__ctxPath + '/js/document/DocFolderSelector.js' ],
	PersonalDocumentView : [
			__ctxPath + '/js/document/PersonalDocumentView.js',
			__ctxPath + '/js/document/DocumentView.js',
			__ctxPath + '/js/document/DocumentForm.js',
			__ctxPath + '/js/document/DocumentSharedForm.js',
			__ctxPath + '/js/document/DocFolderForm.js' ],
	DocumentSharedView : [ __ctxPath + '/js/document/DocumentSharedView.js',
			__ctxPath + '/js/document/DocumentSharedDetail.js' ],
	DocFolderMoveForm : [ __ctxPath + '/js/document/DocFolderMoveForm.js',
			__ctxPath + '/js/document/PersonalDocFolderSelector.js' ],
	/**
	 * 电子签核管理
	 */
	FlowManagerView : [ __ctxPath + '/js/flow/ProTypeForm.js',
			__ctxPath + '/js/flow/ProDefinitionForm.js',
			__ctxPath + '/js/flow/ProDefinitionView.js',
			__ctxPath + '/js/flow/FlowManagerView.js',
			__ctxPath + '/js/flow/ProDefinitionDetail.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/flow/ProDefinitionSetting.js',
			__ctxPath + '/js/flow/MyTaskView.js',
			__ctxPath + '/js/flow/ProcessNextForm.js',
			__ctxPath + '/js/flow/FormDesignWindow.js',
			__ctxPath + '/js/flow/FormEditorWindow.js',
			__ctxPath + '/js/flowDesign/FlowDesignerWindow.js' ],
	NewProcess : [ __ctxPath + '/js/flow/NewProcess.js',
			__ctxPath + '/js/flow/ProDefinitionDetail.js',
			__ctxPath + '/js/flow/ProDefinitionView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	ProcessReportView : [ __ctxPath + '/js/flow/ProcessReportView.js',
			__ctxPath + '/js/flow/ProcessReportForm.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js',
			__ctxPath + '/js/archive/ArchivesDetailUrlWin.js',
			__ctxPath + '/js/flow/WbPsPrinForm.js' ],
	ProcessCreatorReportView : [
			__ctxPath + '/js/flow/ProcessCreatorReportView.js',
			__ctxPath + '/js/flow/ProcessReportForm.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js',
			__ctxPath + '/js/archive/ArchivesDetailUrlWin.js' ],
	ProcessTPReportView : [ __ctxPath + '/js/flow/ProcessTPReportView.js',
			__ctxPath + '/js/flow/ProcessReportForm.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js',
			__ctxPath + '/js/archive/ArchivesDetailUrlWin.js' ],
	ProcessRunFinishView : [ __ctxPath + '/js/flow/ProcessRunFinishView.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],
	// 公文管理--常用批示语管理--added by Ropen
	OdCommonCommentsView : [ __ctxPath + '/js/archive/OdCommonCommentsView.js',
			__ctxPath + '/js/archive/OdCommonCommentsForm.js' ],
	// 公文管理--常用单位管理--added by Ropen
	CommonUnitsView : [ __ctxPath + '/js/archive/CommonUnitsView.js',
			__ctxPath + '/js/archive/CommonUnitsForm.js' ],
	// 公文管理--个性签名管理 --added by Ropen
	OdPersonalSignView : [ __ctxPath + '/js/archive/OdPersonalSignView.js',
			__ctxPath + '/js/archive/OdPersonalSignForm.js' ],
	FileSnConfigView : [ __ctxPath + '/js/snconfig/FileSnConfigView.js',
			__ctxPath + '/js/snconfig/FileSnConfigForm.js' ],
	FlowSnConfigView : [ __ctxPath + '/js/snconfig/FlowSnConfigView.js',
			__ctxPath + '/js/snconfig/FlowSnConfigForm.js',
			__ctxPath + '/js/snconfig/FileSnConfigForm.js',
			__ctxPath + '/js/snconfig/FlowSnConfigOrderForm.js' ],
	SeeFlowSnConfigOrderView : [
			__ctxPath + '/js/snconfig/SeeFlowSnConfigOrderView.js',
			__ctxPath + '/js/snconfig/FlowSnConfigForm.js',
			__ctxPath + '/js/snconfig/FileSnConfigForm.js',
			__ctxPath + '/js/snconfig/FlowSnConfigOrderForm.js' ],
	ArchiveTypeTempView : [ __ctxPath + '/js/archive/ArchiveTypeTempView.js',
			__ctxPath + '/js/archive/ArchivesTypeForm.js',
			__ctxPath + '/js/archive/ArchTemplateView.js',
			__ctxPath + '/js/archive/ArchTemplateForm.js',
			__ctxPath + '/js/archive/ArchTemplatePasswordForm.js',
			__ctxPath + '/js/archive/OfficeTemplateView.js',
			__ctxPath + '/js/document/DocumentTemplateForm.js',
			__ctxPath + '/js/core/ntkoffice/NtkOfficePanel.js' ],

	/**
	 * 系统设置
	 */
	DepartmentView : [ __ctxPath + '/js/system/DepartmentView.js',
			__ctxPath + '/js/system/DepartmentForm.js',
			__ctxPath + '/js/system/AppUserView.js',
			__ctxPath + '/ext3/ux/ItemSelector.js',
			__ctxPath + '/ext3/ux/MultiSelect.js',
			__ctxPath + '/js/system/AppUserForm.js',
			__ctxPath + '/js/system/UserAgentWindow.js',
			__ctxPath + '/js/system/ResetPasswordForm.js',
			__ctxPath + '/js/system/UserSubForm.js',
			__ctxPath + '/js/system/UserSubWindow.js' ],
	AppUserView : [ __ctxPath + '/js/system/AppUserView.js',
			__ctxPath + '/js/system/AppUserForm.js',
			__ctxPath + '/js/system/UserAgentWindow.js',
			__ctxPath + '/ext3/ux/ItemSelector.js',
			__ctxPath + '/ext3/ux/MultiSelect.js',
			__ctxPath + '/js/system/ResetPasswordForm.js',
			__ctxPath + '/js/system/changePasswordForm.js',
			__ctxPath + '/js/system/UserSubForm.js',
			__ctxPath + '/js/system/CapacityUpdateForm.js',
			__ctxPath + '/js/system/UserSubWindow.js' ],
	AppRoleView : [ __ctxPath + '/js/system/AppRoleView.js',
			__ctxPath + '/ext3/ux/CheckTreePanel.js',
			__ctxPath + '/js/system/RoleGrantRightView.js',
			__ctxPath + '/js/system/AppRoleForm.js' ],
	FileAttachView : [ __ctxPath + '/js/system/FileAttachView.js',
			__ctxPath + '/js/system/FileAttachDetail.js' ],
	/**
	 * 其他
	 */
	ArchUndertakeView : [ __ctxPath + '/js/archive/ArchUndertakeView.js',
			__ctxPath + '/js/archive/ArchUndertakeForm.js' ],
	DocFilesForm : [ __ctxPath + '/js/arch/ViewFileWindow.js' ],
	TodayOutView : [ __ctxPath + '/js/out/TodayOutView.js',
			__ctxPath + '/js/out/EditOutForm.js' ],
	TodayScheduleView : [
			__ctxPath + '/js/leaderActivities/TodayScheduleView.js',
			__ctxPath + '/js/leaderActivities/EditScheduleForm.js',
			__ctxPath + '/js/leaderActivities/LeaderCalendarView.js',
			__ctxPath + '/js/leaderActivities/LeaderCalendarForm.js' ],
	VehicleRepairView : [ __ctxPath + '/js/vehicle/VehicleRepairView.js',
			__ctxPath + '/js/vehicle/VehicleRepairForm.js' ],
	UserSubView : [ __ctxPath + '/js/system/UserSubView.js',
			__ctxPath + '/js/system/UserSubForm.js' ],
	ReportTemplateView : [ __ctxPath + '/js/system/ReportTemplateView.js',
			__ctxPath + '/js/system/ReportTemplateForm.js',
			__ctxPath + '/js/system/ReportParamForm.js',
			__ctxPath + '/js/system/ReportParamView.js',
			__ctxPath + '/js/system/ReportTemplatePreview.js',
			__ctxPath + '/ext3/ux/ext-basex.js' ],
	MessageView : [ __ctxPath + '/js/info/MessageView.js',
			__ctxPath + '/js/info/MessageForm.js',
			__ctxPath + '/js/info/MessageWin.js' ],
	MessageManageView : [ __ctxPath + '/js/info/MessageManageView.js',
			__ctxPath + '/js/info/MessageForm.js' ],
	PhoneBookView : [ __ctxPath + '/js/communicate/PhoneBookView.js',
			__ctxPath + '/js/communicate/PhoneGroupForm.js',
			__ctxPath + '/js/communicate/PhoneBookForm.js' ],
	NewsTypeView : [ __ctxPath + '/js/info/NewsTypeView.js',
			__ctxPath + '/js/info/NewsTypeForm.js' ],
	CompanyView : [ __ctxPath + '/js/system/CompanyView.js' ],

	DiaryView : [ __ctxPath + '/js/system/DiaryView.js',
			__ctxPath + '/js/system/DiaryForm.js' ],
	MySubUserDiaryView : [ __ctxPath + '/js/system/MySubUserDiaryView.js',
			__ctxPath + '/js/system/DiaryDetail.js',
			__ctxPath + '/js/system/DiaryComment.js' ],
	PersonalMailBoxView : [
			__ctxPath + '/js/communicate/PersonalMailBoxView.js',
			__ctxPath + '/js/communicate/MailView.js',
			__ctxPath + '/js/communicate/MailForm.js',
			__ctxPath + '/js/communicate/MailFolderForm.js',
			__ctxPath + '/ext3/ux/RowExpander.js' ],
	MailForm : [ __ctxPath + '/js/communicate/MailForm.js' ],
	PersonalPhoneBookView : [
			__ctxPath + '/js/communicate/PersonalPhoneBookView.js',
			__ctxPath + '/js/communicate/PhoneBookView.js',
			__ctxPath + '/js/communicate/PhoneGroupForm.js',
			__ctxPath + '/js/communicate/PhoneBookForm.js' ],
	SharedPhoneBookView : [
			__ctxPath + '/js/communicate/SharedPhoneBookView.js',
			__ctxPath + '/js/communicate/SharedPhoneBookWin.js' ],
	ProcessRunView : [ __ctxPath + '/js/flow/ProcessRunView.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	BookManageView : [ __ctxPath + '/js/admin/BookManageView.js',
			__ctxPath + '/js/admin/BookView.js',
			__ctxPath + '/js/admin/BookForm.js',
			__ctxPath + '/js/admin/BookTypeForm.js',
			__ctxPath + '/js/admin/BookBorrowForm.js',
			__ctxPath + '/js/admin/BookAmountForm.js' ],
	BookTypeView : [ __ctxPath + '/js/admin/BookTypeView.js',
			__ctxPath + '/js/admin/BookTypeForm.js' ],
	BookBorrowView : [ __ctxPath + '/js/admin/BookBorrowView.js',
			__ctxPath + '/js/admin/BookBorrowForm.js',
			__ctxPath + '/js/admin/BookReturnForm.js' ],
	BookReturnView : [ __ctxPath + '/js/admin/BookReturnView.js',
			__ctxPath + '/js/admin/BookReturnForm.js' ],
	OfficeGoodsManageView : [ __ctxPath + '/js/admin/OfficeGoodsManageView.js',
			__ctxPath + '/js/admin/OfficeGoodsTypeForm.js',
			__ctxPath + '/js/admin/OfficeGoodsView.js',
			__ctxPath + '/js/admin/OfficeGoodsForm.js' ],
	InStockView : [ __ctxPath + '/js/admin/InStockView.js',
			__ctxPath + '/js/admin/InStockForm.js' ],
	GoodsApplyView : [ __ctxPath + '/js/admin/GoodsApplyView.js',
			__ctxPath + '/js/admin/GoodsApplyForm.js',
			__ctxPath + '/js/admin/GoodsApplyCheck.js' ],
	CarView : [ __ctxPath + '/js/admin/CarView.js',
			__ctxPath + '/js/admin/CarForm.js' ],
	CartRepairView : [ __ctxPath + '/js/admin/CartRepairView.js',
			__ctxPath + '/js/admin/CartRepairForm.js' ],
	CarApplyView : [ __ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/admin/CarApplyView.js',
			__ctxPath + '/js/admin/CarApplyForm.js',
			__ctxPath + '/js/admin/CarApplyCheck.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],
	AppointmentView : [ __ctxPath + '/js/task/AppointmentView.js',
			__ctxPath + '/js/task/AppointmentForm.js' ],
	CalendarPlanView : [ __ctxPath + '/js/task/CalendarPlanView.js',
			__ctxPath + '/js/task/CalendarPlanForm.js',
			__ctxPath + '/js/task/CalendarPlanFinishForm.js',
			__ctxPath + '/js/task/CalendarPlanDetailView.js' ],
	PlanTypeView : [ __ctxPath + '/js/task/PlanTypeView.js',
			__ctxPath + '/js/task/PlanTypeForm.js' ],
	WorkPlanView : [ __ctxPath + '/js/task/WorkPlanView.js',
			__ctxPath + '/js/task/NewWorkPlanForm.js' ],
	PersonalWorkPlanView : [ __ctxPath + '/js/task/PersonalWorkPlanView.js',
			__ctxPath + '/js/task/WorkPlanDetail.js' ],
	NewWorkPlanForm : [ __ctxPath + '/js/task/NewWorkPlanForm.js' ],
	DepWorkPlanView : [ __ctxPath + '/js/task/DepWorkPlanView.js',
			__ctxPath + '/js/task/WorkPlanDetail.js' ],

	/*
	 * NewsView : [ __ctxPath + '/js/info/NewsView.js', __ctxPath +
	 * '/js/info/NewsForm.js', __ctxPath + '/js/info/NewsTypeTree.js', __ctxPath +
	 * '/js/info/NewsTypeForm.js' ],
	 */

	// notice of company
	NoticeView : [ __ctxPath + '/js/info/NoticeView.js',
			__ctxPath + '/js/info/NoticeForm.js' ],
	// ===========notice of department
	// start add by smart on 20110513==========
	/*
	 * NoticeDepartmentView : [ __ctxPath + '/js/info/NoticeDepartmentView.js',
	 * __ctxPath + '/js/info/NoticeForm.js' ],
	 */
	// ===========end add by smart on 20110513==========
	NewsView : [ __ctxPath + '/js/info/NewsView.js',
			__ctxPath + '/js/info/NewsForm.js',
			__ctxPath + '/js/info/NewsTypeTree.js',
			__ctxPath + '/js/info/NewsTypeForm.js' ],
	// -----------------------------Start search news module-- create by smart
	// on 20110511----------------------
	PersonalNewsView : [ __ctxPath + '/js/info/PersonalNewsView.js',
			__ctxPath + '/js/info/NewsForm.js' ],
	// ----------------------------------------------------------------
	PartyNewsView : [ __ctxPath + '/js/info/PartyNewsView.js',
			__ctxPath + '/js/info/NewsForm.js' ],
	// ----------------------------------------------------------------
	CompanyCultureNewsView : [
			__ctxPath + '/js/info/CompanyCultureNewsView.js',
			__ctxPath + '/js/info/NewsForm.js' ],
	// ----------------------------------------------------------------
	ServiceNewsView : [ __ctxPath + '/js/info/ServiceNewsView.js',
			__ctxPath + '/js/info/NewsForm.js' ],
	// ------------------------------End----------------------------------

	// -----------------------------Start auditing module-- create by smart on
	// 20110512----------------------
	/*
	 * CompanyNoticeAuditingView : [ __ctxPath +
	 * '/js/info/CompanyNoticeAuditingView.js', __ctxPath +
	 * '/js/info/NoticeAuditingForm.js' ], DepartmentNoticeAuditingView : [
	 * __ctxPath + '/js/info/DepartmentNoticeAuditingView.js', __ctxPath +
	 * '/js/info/NoticeAuditingForm.js' ],
	 */

	NoticeAuditingView : [ __ctxPath + '/js/info/NoticeAuditingView.js',
			__ctxPath + '/js/info/NoticeAuditingForm.js' ],

	PersonalNewsAuditingView : [
			__ctxPath + '/js/info/PersonalNewsAuditingView.js',
			__ctxPath + '/js/info/NewsAuditingForm.js' ],
	CompanyNewsAuditingView : [
			__ctxPath + '/js/info/CompanyNewsAuditingView.js',
			__ctxPath + '/js/info/NewsAuditingForm.js' ],
	// ----------------------------------------------------------------
	PartyNewsAuditingView : [ __ctxPath + '/js/info/PartyNewsAuditingView.js',
			__ctxPath + '/js/info/NewsAuditingForm.js' ],
	// ----------------------------------------------------------------
	CompanyCultureNewsAuditingView : [
			__ctxPath + '/js/info/CompanyCultureNewsAuditingView.js',
			__ctxPath + '/js/info/NewsAuditingForm.js' ],
	// ----------------------------------------------------------------
	ServiceNewsAuditingView : [
			__ctxPath + '/js/info/ServiceNewsAuditingView.js',
			__ctxPath + '/js/info/NewsAuditingForm.js' ],
	NewsAuditingView : [ __ctxPath + '/js/info/NewsAuditingView.js',
			__ctxPath + '/js/info/NewsAuditingForm.js' ],
	// ------------------------------End----------------------------------

	BoardrooView : [ __ctxPath + '/js/admin/BoardrooView.js',
			__ctxPath + '/js/admin/BoardrooForm.js',
			__ctxPath + '/js/admin/ConfRoomEquipForm.js' ],
	BoardTypeView : [ __ctxPath + '/js/admin/BoardTypeView.js',
			__ctxPath + '/js/admin/BoardTypeForm.js' ],
	AddConfSummaryView : [ __ctxPath + '/js/admin/AddConfSummaryView.js',
			__ctxPath + '/js/selector/ConferenceSelector.js' ],
	AddConferenceView : [ __ctxPath + '/js/admin/AddConferenceView.js' ],
	ConfSummaryView : [ __ctxPath + '/js/admin/ConfSummaryView.js',
			__ctxPath + '/js/admin/ConfSummaryForm.js',
			__ctxPath + '/js/admin/ConfSummaryDetailForm.js' ],
	ConfSummarySearchView : [ __ctxPath + '/js/admin/ConfSummarySearchView.js',
			__ctxPath + '/js/admin/ConfSummaryForm.js' ],
	MyJoinConferenceView : [ __ctxPath + '/js/admin/MyJoinConferenceView.js',
			__ctxPath + '/js/admin/ConferenceForm.js',
			__ctxPath + '/js/admin/ConferenceDetailForm.js',
			__ctxPath + '/js/admin/ConferenceEditForm.js',
			__ctxPath + '/js/admin/AddConfSummaryForm.js' ],
	ConfCompletedView : [ __ctxPath + '/js/admin/ConfCompletedView.js',
			__ctxPath + '/js/admin/ConfCompletedForm.js',
			__ctxPath + '/js/admin/ConfCompletedDetailForm.js',
			__ctxPath + '/js/admin/ConfDateEditForm.js' ],

	ConfBoardrooSearch : [ __ctxPath + '/js/admin/ConfBoardrooSearch.js',
			__ctxPath + '/js/admin/AddConferenceView.js' ],

	YiKaiConferenceView : [ __ctxPath + '/js/admin/YiKaiConferenceView.js',
			__ctxPath + '/js/admin/ConferenceDetailForm.js',
			__ctxPath + '/js/admin/ConferenceForm.js' ],
	DaiKaiConferenceView : [ __ctxPath + '/js/admin/DaiKaiConferenceView.js',
			__ctxPath + '/js/admin/ConferenceDetailForm.js',
			__ctxPath + '/js/admin/ConferenceForm.js' ],
	DaiConfApplyView : [ __ctxPath + '/js/admin/DaiConfApplyView.js',
			__ctxPath + '/js/admin/ConfApplyForm.js' ],
	ConfApplyView : [ __ctxPath + '/js/admin/ConfApplyView.js' ],

	FixedAssetsManageView : [ __ctxPath + '/js/admin/FixedAssetsManageView.js',
			__ctxPath + '/js/admin/FixedAssetsView.js',
			__ctxPath + '/js/admin/FixedAssetsForm.js',
			__ctxPath + '/js/admin/AssetsTypeForm.js',
			__ctxPath + '/js/admin/DepreWin.js',
			__ctxPath + '/js/admin/WorkGrossWin.js' ],
	DepreTypeView : [ __ctxPath + '/js/admin/DepreTypeForm.js',
			__ctxPath + '/js/admin/DepreTypeView.js' ],
	DepreRecordView : [ __ctxPath + '/js/admin/DepreRecordForm.js',
			__ctxPath + '/js/admin/DepreRecordView.js' ],
	// -------------personal moduels------------------------
	HolidayRecordView : [ __ctxPath + '/js/personal/HolidayRecordView.js',
			__ctxPath + '/js/personal/HolidayRecordForm.js' ],
	DutySectionView : [ __ctxPath + '/js/personal/DutySectionView.js',
			__ctxPath + '/js/personal/DutySectionForm.js' ],
	DutySystemView : [ __ctxPath + '/js/personal/DutySystemView.js',
			__ctxPath + '/js/personal/DutySystemForm.js',
			__ctxPath + '/js/selector/DutySectionSelector.js' ],
	SignInOffView : [ __ctxPath + '/js/personal/SignInOffView.js' ],
	DutyRegisterPersonView : [ __ctxPath
			+ '/js/personal/DutyRegisterPersonView.js' ],
	DutyRegisterView : [ __ctxPath + '/js/personal/DutyRegisterView.js',
			__ctxPath + '/js/personal/DutyRegisterForm.js' ],
	ErrandsRegisterView : [ __ctxPath + '/js/personal/ErrandsRegisterView.js',
			__ctxPath + '/js/personal/ErrandsRegisterDetail.js',
			__ctxPath + '/js/personal/ErrandsRegisterForm.js' ],
	ErrandsRegisterOutView : [
			__ctxPath + '/js/personal/ErrandsRegisterOutView.js',
			__ctxPath + '/js/personal/ErrandsRegisterOutForm.js' ],
	SysConfigView : [ __ctxPath + '/js/system/SysConfigView.js',
			__ctxPath + '/js/communicate/SmsMobileForm.js' ],
	// -------------personal moduels------------------------
	// -------------Home Message Detail moduels-------------
	NoticeDetail : [ __ctxPath + '/js/info/NoticeDetail.js' ],
	NewsDetail : [ __ctxPath + '/js/info/NewsDetail.js' ],
	PublicDocumentDetail : [ __ctxPath + '/js/document/PublicDocumentDetail.js' ],
	MailDetail : [ __ctxPath + '/js/communicate/MailDetail.js',
			__ctxPath + '/js/communicate/MailForm.js' ],
	CalendarPlanDetail : [ __ctxPath + '/js/task/CalendarPlanDetail.js' ],
	AppointmentDetail : [ __ctxPath + '/js/task/AppointmentDetail.js' ],
	// -------------Home Message Detail moduels-------------
	// -------------Search moduels--------------------------
	SearchNews : [ __ctxPath + '/js/search/SearchNews.js',
			__ctxPath + '/js/info/NewsDetail.js' ],
	SearchMail : [ __ctxPath + '/js/search/SearchMail.js',
			__ctxPath + '/ext3/ux/RowExpander.js',
			__ctxPath + '/js/communicate/MailView.js',
			__ctxPath + '/js/communicate/MailForm.js' ],
	SearchNotice : [ __ctxPath + '/js/search/SearchNotice.js' ],
	SearchDocument : [ __ctxPath + '/js/search/SearchDocument.js',
			__ctxPath + '/js/document/PublicDocumentDetail.js' ],
	HireIssueView : [ __ctxPath + '/js/hrm/HireIssueView.js',
			__ctxPath + '/js/hrm/HireIssueForm.js',
			__ctxPath + '/js/hrm/HireIssueCheckWin.js' ],
	ResumeView : [ __ctxPath + '/js/hrm/ResumeView.js',
			__ctxPath + '/js/hrm/ResumeForm.js' ],
	// -------------Search moduels--------------------------
	NewsCommentView : [ __ctxPath + '/js/info/NewsCommentView.js',
			__ctxPath + '/ext3/ux/RowExpander.js' ],
	DictionaryView : [ __ctxPath + '/js/system/DictionaryView.js',
			__ctxPath + '/js/system/DictionaryForm.js' ],
	SalaryItemView : [ __ctxPath + '/js/hrm/SalaryItemForm.js',
			__ctxPath + '/js/hrm/SalaryItemView.js' ],
	StandSalaryForm : [ __ctxPath + '/js/hrm/StandSalaryForm.js',
			__ctxPath + '/js/hrm/StandSalaryItemView.js',
			__ctxPath + '/js/selector/SalaryItemSelector.js' ],
	StandSalaryView : [ __ctxPath + '/js/hrm/StandSalaryView.js',
			__ctxPath + '/js/hrm/StandSalaryForm.js',
			__ctxPath + '/js/hrm/StandSalaryItemView.js',
			__ctxPath + '/js/hrm/CheckStandSalaryForm.js',
			__ctxPath + '/js/hrm/CheckStandSalaryItemView.js',
			__ctxPath + '/js/selector/SalaryItemSelector.js' ],
	JobChangeForm : [ __ctxPath + '/js/hrm/JobChangeForm.js',
			__ctxPath + '/js/selector/EmpProfileSelector.js' ],
	JobChangeView : [ __ctxPath + '/js/hrm/JobChangeView.js',
			__ctxPath + '/js/hrm/JobChangeForm.js',
			__ctxPath + '/js/selector/EmpProfileSelector.js',
			__ctxPath + '/js/hrm/CheckJobChangeWin.js' ],
	JobView : [ __ctxPath + '/js/hrm/JobView.js',
			__ctxPath + '/js/hrm/JobForm.js',
			__ctxPath + '/js/hrm/RecoveryJobWin.js' ],
	EmpProfileForm : [ __ctxPath + '/js/hrm/EmpProfileForm.js' ],
	EmpProfileView : [ __ctxPath + '/js/hrm/EmpProfileView.js',
			__ctxPath + '/js/hrm/EmpProfileForm.js',
			__ctxPath + '/js/hrm/CheckEmpProfileForm.js',
			__ctxPath + '/js/hrm/RecoveryProfileWin.js' ],
	SalaryPayoffForm : [ __ctxPath + '/js/hrm/SalaryPayoffForm.js',
			__ctxPath + '/js/selector/EmpProfileSelector.js' ],
	SalaryPayoffView : [ __ctxPath + '/js/hrm/SalaryPayoffForm.js',
			__ctxPath + '/js/selector/EmpProfileSelector.js',
			__ctxPath + '/js/hrm/CheckSalaryPayoffForm.js',
			__ctxPath + '/js/hrm/SalaryPayoffView.js' ],

	OdFlowtypeChooseView : [ __ctxPath + '/js/archive/OdFlowtypeChooseView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/flow/ProDefinitionDetail.js' ],
	PersonalSalaryView : [ __ctxPath + '/js/personal/PersonalSalaryView.js',
			__ctxPath + '/ext3/ux/RowExpander.js' ],
	ArchRecTypeView : [ __ctxPath + '/js/archive/ArchRecTypeView.js',
			__ctxPath + '/js/archive/ArchRecTypeForm.js' ],
	ArchivesRecView : [ __ctxPath + '/js/archive/ArchivesRecView.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/flow/ProDefinitionDetail.js' ],

	LeaderReadView : [ __ctxPath + '/js/archive/LeaderReadView.js',
			__ctxPath + '/js/archive/LeaderReadForm.js' ],

	ArchivesRecAllView : [ __ctxPath + '/js/archive/ArchivesRecAllView.js',
			__ctxPath + '/js/archive/ArchivesDetail.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/archive/ArchSubDetailForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/flow/ReWriteFlowOpinionForm.js',
			__ctxPath + '/js/flow/FlowDetailEditCommentsForm.js',
			__ctxPath + '/js/archive/ArchivesWriteOpionView.js',
			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js' ],

	ArchivesDraftAllManage : [
			__ctxPath + '/js/archive/ArchivesDraftAllManage.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/archive/ArchivesDetail.js',
			__ctxPath + '/js/archive/ArchSubDetailForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js' ],

	ArchivesIssueProof : [ __ctxPath + '/js/archive/ArchivesIssueProof.js',
			__ctxPath + '/js/archive/ArchivesDocWin.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js' ],
	ArchivesIssueAudit : [ __ctxPath + '/js/archive/ArchivesIssueAudit.js',
			__ctxPath + '/js/archive/ArchivesDraftWin.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js',
			__ctxPath + '/js/archive/ArchivesDocHistoryWin.js' ],
	ArchivesIssueLead : [ __ctxPath + '/js/archive/ArchivesIssueLead.js',
			__ctxPath + '/js/archive/ArchivesDraftWin.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js',
			__ctxPath + '/js/archive/ArchivesDocHistoryWin.js' ],
	ArchivesIssueCharge : [ __ctxPath + '/js/archive/ArchivesIssueCharge.js',
			__ctxPath + '/js/archive/ArchivesDraftWin.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js',
			__ctxPath + '/js/archive/ArchivesDocHistoryWin.js' ],
	ArchivesDocument : [ __ctxPath + '/js/archive/ArchivesDocument.js',
			__ctxPath + '/js/archive/ArchivesDocWin.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js' ],
	MyCCArchives : [__ctxPath + '/js/archive/MyCCArchives.js',
	    			__ctxPath + '/js/archive/ArchDetailView.js',
	    			__ctxPath + '/js/flow/ProcessRunStart.js',
	    			__ctxPath + '/js/archive/ArchSubDetailForm.js',
	    			__ctxPath + '/js/flow/ProcessRunDetail.js',
	    			__ctxPath + '/js/flow/ReWriteFlowOpinionForm.js',
	    			__ctxPath + '/js/flow/FlowDetailEditCommentsForm.js',
	    			__ctxPath + '/js/archive/ArchivesWriteOpionView.js',
	    			__ctxPath + '/js/archive/ArchivesFreeJumpWin.js'],
	DocHistoryView : [ __ctxPath + '/js/archive/DocHistoryView.js' ],
	ArchFlowConfView : [ __ctxPath + '/js/archive/ArchFlowConfView.js',
			__ctxPath + '/js/selector/FlowSelector.js' ],
	ArchivesSignView : [ __ctxPath + '/js/archive/ArchivesSignView.js',
			__ctxPath + '/js/archive/ArchivesRecForm.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js' ],
	SystemLogView : [ __ctxPath + '/js/system/SystemLogView.js' ],
	MyProcessRunView : [ __ctxPath + '/js/flow/MyProcessRunView.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],
	PersonalTipsView : [ __ctxPath + '/js/info/PersonalTipsView.js' ],
	OutMailUserSetingForm : [ __ctxPath
			+ '/js/communicate/OutMailUserSetingForm.js' ],
	OutMailBoxView : [ __ctxPath + '/js/communicate/OutMailBoxView.js',
			__ctxPath + '/js/communicate/OutMailView.js',
			__ctxPath + '/js/communicate/OutMailForm.js',
			__ctxPath + '/js/communicate/OutMailFolderForm.js',
			__ctxPath + '/js/selector/EMailSelector.js',
			__ctxPath + '/ext3/ux/RowExpander.js' ],
	OutMailForm : [ __ctxPath + '/js/communicate/OutMailForm.js',
			__ctxPath + '/js/selector/EMailSelector.js' ],

	KnowledgeView : [ __ctxPath + '/js/info/KnowledgeView.js',
			__ctxPath + '/js/document/PublicDocumentView.js',
			__ctxPath + '/js/document/PublicDocumentDetail.js',
			__ctxPath + '/js/document/NewPublicDocumentForm.js',
			__ctxPath + '/js/document/DocFolderSelector.js' ],

	SuggestBoxView : [ __ctxPath + '/js/info/SuggestBoxView.js',
			__ctxPath + '/js/info/SuggestBoxForm.js',
			__ctxPath + '/js/info/SuggestBoxReplyForm.js',
			__ctxPath + '/js/info/SuggestBoxDisplay.js' ],

	OutMailSetView : [ __ctxPath + '/js/system/OutMailSetView.js',
			__ctxPath + '/js/system/OutMailSetForm.js' ],
	// 档案管理
	ArchFondView : [ __ctxPath + '/js/arch/ArchFondView.js',
			__ctxPath + '/js/arch/ArchFondForm.js',
			__ctxPath + '/js/system/GlobalTypeForm.js' ],

	ArchRollView : [ __ctxPath + '/js/arch/ArchRollView.js',
			__ctxPath + '/js/arch/ArchRollForm.js',
			__ctxPath + '/js/system/GlobalTypeForm.js' ],
	RollFileView : [ __ctxPath + '/js/arch/RollFileView.js',
			__ctxPath + '/js/arch/RollFileForm.js',
			__ctxPath + '/js/system/GlobalTypeForm.js',
			__ctxPath + '/js/arch/RollFileListView.js',
			// __ctxPath + '/js/arch/RollFileListForm.js',//屏蔽查看附件明细
			__ctxPath + '/js/arch/ViewFileWindow.js' ],
	TidyFileView : [ __ctxPath + '/js/arch/TidyFileView.js',
	// __ctxPath + '/js/arch/RollFileForm.js',//屏蔽增加
	__ctxPath + '/js/arch/TidyFileForm.js',
	// __ctxPath + '/js/system/GlobalTypeForm.js',//屏蔽增加分类
	__ctxPath + '/js/arch/ViewFileWindow.js',
			__ctxPath + '/js/arch/MyBorrowFileViewWindow.js',
			__ctxPath + '/js/arch/MyBorrowFileSlaveListGrid.js' ],
	NewBorrowRecordFormPan : [
			__ctxPath + '/js/arch/NewBorrowRecordFormPan.js',
			__ctxPath + '/js/arch/BorrowFileListView.js',
			__ctxPath + '/js/arch/SelectFondWindow.js',
			__ctxPath + '/js/arch/SelectRollWindow.js',
			__ctxPath + '/js/arch/SelectFileWindow.js'

	],
	CheckBorrowRecordView : [ __ctxPath + '/js/arch/CheckBorrowRecordView.js',
			__ctxPath + '/js/arch/CheckBorrowRecordForm.js',
			// __ctxPath + '/js/arch/CheckBorrowFileListView.js',
			__ctxPath + '/js/arch/MyBorrowFilePanel.js',
			__ctxPath + '/js/arch/MyBorrowFileTypePanel.js',
			__ctxPath + '/js/arch/MyBorrowFileListPanel.js',
			__ctxPath + '/js/arch/ViewFileWindow.js',

			__ctxPath + '/js/arch/MyBorrowFileViewWindow.js',
			__ctxPath + '/js/arch/MyBorrowFileSlaveListGrid.js'

	],
	MyBorrowRecordView : [ __ctxPath + '/js/arch/MyBorrowRecordView.js',
			__ctxPath + '/js/arch/MyBorrowFilePanel.js',
			__ctxPath + '/js/arch/MyBorrowFileTypePanel.js',
			__ctxPath + '/js/arch/MyBorrowFileListPanel.js',
			__ctxPath + '/js/arch/ViewFileWindow.js',

			__ctxPath + '/js/arch/MyBorrowFileViewWindow.js',
			__ctxPath + '/js/arch/MyBorrowFileSlaveListGrid.js',
			/** ********************************************** */
			__ctxPath + '/js/arch/BorrowRecordForm.js',
			__ctxPath + '/js/arch/BorrowFileListView.js',
			__ctxPath + '/js/arch/SelectFondWindow.js',
			__ctxPath + '/js/arch/SelectRollWindow.js',
			__ctxPath + '/js/arch/SelectFileWindow.js' ],
	DicManager : [ __ctxPath + '/js/system/GlobalTypeForm.js',
			__ctxPath + '/js/system/DicManager.js',
			__ctxPath + '/js/system/DicTypeChangeWin.js',
			__ctxPath + '/js/system/DictionaryForm.js' ],
	GlobalTypeManager : [ __ctxPath + '/js/system/GlobalTypeManager.js',
			__ctxPath + '/js/system/GlobalTypeForm.js' ],
	archSetingManager : [ __ctxPath + '/js/arch/archSetingManager.js',
	// __ctxPath + '/js/system/GlobalTypeForm.js',
	// __ctxPath + '/js/system/DicTypeChangeWin.js',
	__ctxPath + '/js/system/DictionaryForm.js' ],
	RegulationView : [ __ctxPath + '/js/admin/RegulationForm.js',
			__ctxPath + '/js/admin/RegulationView.js',
			__ctxPath + '/js/admin/RegulationScanWin.js',
			__ctxPath + '/js/selector/GlobalTypeSelector.js' ],
	RegulationScanView : [ __ctxPath + '/js/admin/RegulationScanView.js',
			__ctxPath + '/js/admin/RegulationScanWin.js' ],
	StatisticsArchYearReportPanel : [ __ctxPath
			+ '/js/arch/StatisticsArchYearReportPanel.js' ],
	StatisticsArchRollReportPanel : [ __ctxPath
			+ '/js/arch/StatisticsArchRollReportPanel.js' ],
	StatisticsArchFileReportPanel : [ __ctxPath
			+ '/js/arch/StatisticsArchFileReportPanel.js' ],
	SealView : [ __ctxPath + '/js/document/SealView.js',
			__ctxPath + '/js/document/SealForm.js',
			__ctxPath + '/js/archive/ArchTemplateView.js',
			__ctxPath + '/js/archive/ArchTemplateForm.js',
			__ctxPath + '/js/archive/ArchTemplatePasswordForm.js',
			__ctxPath + '/js/core/ntkosign/NtkoSignPanel.js',
			__ctxPath + '/js/document/MakeSealForm.js',
			__ctxPath + '/js/document/SealShowPanel.js' ],
	PaintTemplateView : [ __ctxPath + '/js/document/PaintTemplateView.js',
			__ctxPath + '/js/document/PaintTemplateForm.js',
			__ctxPath + '/js/archive/ArchTemplateView.js',
			__ctxPath + '/js/archive/ArchTemplateForm.js',
			__ctxPath + '/js/archive/ArchTemplatePasswordForm.js',
			__ctxPath + '/js/core/ntkoffice/NtkOfficePanel.js',
			__ctxPath + '/js/document/DocumentTemplateForm.js' ],
	SmsMobileView : [ __ctxPath + '/js/communicate/SmsMobileView.js',
			__ctxPath + '/js/communicate/OutMsgForm.js',
			__ctxPath + '/js/communicate/SmsMobileForm.js',
			__ctxPath + '/js/communicate/SmsMobileExamineView.js' ],
	SalesOrderView : [ __ctxPath + '/js/sales/SalesOrderView.js',
			__ctxPath + '/js/sales/SalesOrderForm.js' ],
	OrderDetailView : [ __ctxPath + '/js/sales/OrderDetailView.js',
			__ctxPath + '/js/sales/OrderDetailForm.js' ],
	// 司机管理
	CarDriverView : [ __ctxPath + '/js/admin/CarDriverView.js',
			__ctxPath + '/js/admin/CarDriverForm.js' ],

	// 油卡/粤通卡管理
	OilCardFeeCardView : [ __ctxPath + '/js/admin/OilCardFeeCardView.js',
			__ctxPath + '/js/admin/CarOilCardView.js',
			__ctxPath + '/js/admin/CarOilCardForm.js',
			__ctxPath + '/js/admin/CarPassFeeCardForm.js',
			__ctxPath + '/js/admin/CarPassFeeCardView.js' ],

	// 公文管理--公文流程类型配置--added by Ropen
	OdFlowtypeView : [ __ctxPath + '/js/archive/OdFlowtypeView.js',
			__ctxPath + '/js/archive/OdFlowtypeForm.js',
			__ctxPath + '/js/selector/FlowSelector.js' ],

	CarDriverView : [ __ctxPath + '/js/admin/CarDriverView.js',
			__ctxPath + '/js/admin/CarDriverForm.js' ],

	CarUsingView : [ __ctxPath + '/js/admin/CarUsingView.js',
			__ctxPath + '/js/admin/CarUsingForm.js' ],

	ItInviteTendersApplyView : [
			__ctxPath + '/js/operations/ItInviteTendersApplyView.js',
			__ctxPath + '/js/operations/ItInviteTendersApplyForm.js' ],

	ProDormRoomView : [ __ctxPath + '/js/operations/ProDormRoomView.js',
			__ctxPath + '/js/operations/ProDormRoomForm.js',
			__ctxPath + '/js/operations/ProRoomEquipmentView.js',
			__ctxPath + '/js/operations/ProRoomEquipmentForm.js',
			__ctxPath + '/js/operations/ProRoomBedsView.js',
			__ctxPath + '/js/operations/ProRoomBedsForm.js',
			__ctxPath + '/js/operations/RoomUserHistory.js',
			__ctxPath + '/js/operations/RoomUserFeeHistory.js' ],

	ProDormitoryView : [ __ctxPath + '/js/operations/ProDormitoryForm.js',
			__ctxPath + '/js/operations/ProDormitoryView.js' ],

	ProRoomEquipmentView : [
			__ctxPath + '/js/operations/ProRoomEquipmentView.js',
			__ctxPath + '/js/operations/ProRoomEquipmentForm.js' ],

	CarCardHistoryView : [ __ctxPath + '/js/admin/CarCardHistoryView.js' ],

	ProUserFeeView : [ __ctxPath + '/js/operations/ProUserFeeView.js',
			__ctxPath + '/js/operations/ProUserFeeForm.js' ],

	ProHydropowerDetailView : [
			__ctxPath + '/js/operations/ProHydropowerDetailView.js',
			__ctxPath + '/js/operations/ProHydropowerDetailForm.js' ],

	ProUserRoomView : [ __ctxPath + '/js/operations/ProUserRoomView.js',
			__ctxPath + '/js/operations/ProUserRoomOutForm.js',
			__ctxPath + '/js/operations/ProUserRoomForm.js' ],

	CarDistributionView : [ __ctxPath + '/js/admin/CarDistributionView.js',
			__ctxPath + '/js/admin/CarDistributionForm.js' ],
	MonitorApplyView : [ __ctxPath + '/js/admin/MonitorApplyView.js',
			__ctxPath + '/js/admin/MonitorApplyForm.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/admin/MonitorHastenForm.js' ],
	MonitorParticipantView : [
			__ctxPath + '/js/admin/MonitorParticipantView.js',
			__ctxPath + '/js/admin/MonitorParticipantForm.js' ],
	InnerPhoneBKView : [ __ctxPath + '/js/system/InnerPhoneBKView.js',
			__ctxPath + '/js/system/InnerPhoneBKForm.js' ],
	AddrbookOuterView : [ __ctxPath + '/js/personal/AddrbookOuterView.js',
			__ctxPath + '/js/personal/AddrbookOuterForm.js' ],
	MonitorDealHistoryView : [
			__ctxPath + '/js/admin/MonitorDealHistoryView.js',
			__ctxPath + '/js/admin/MonitorDealHistoryForm.js',
			__ctxPath + '/js/admin/MoniDealHisDetailForm.js' ],
	MonitorStatisticReportView : [ __ctxPath + '/ext3/ux/MonthPicker.js',
			__ctxPath + '/js/admin/MonitorStatisticReportView.js' ],
	SuperviseTaskReportView : [ __ctxPath
			+ '/js/admin/SuperviseTaskReportView.js' ],
	SuperviseFinishedStatusReportView : [
			__ctxPath + '/ext3/ux/MonthPicker.js',
			__ctxPath + '/js/admin/SuperviseFinishedStatusReportView.js' ],
	WorkSummaryView : [ __ctxPath + '/js/summary/WorkSummaryView.js',
			__ctxPath + '/js/summary/WorkSummaryForm.js',
			__ctxPath + '/js/summary/WorkSummaryFormRO.js' ],

	WorkSummarySumView : [ __ctxPath + '/js/summary/WorkSummarySumView.js',
			__ctxPath + '/js/summary/WorkSummarySumForm.js',
			__ctxPath + '/js/summary/WorkSummarySumFormRO.js',
			__ctxPath + '/js/summary/WorkSummaryFormRO.js' ],
	WorkSummaryAuthView : [ __ctxPath + '/js/summary/WorkSummaryAuthView.js',
			__ctxPath + '/js/summary/WorkSummaryAuthForm.js',
			__ctxPath + '/js/summary/WorkSummaryFormRO.js' ],
	WorkSummarySumAuthView : [
			__ctxPath + '/js/summary/WorkSummarySumAuthView.js',
			__ctxPath + '/js/summary/WorkSummarySumAuthForm.js',
			__ctxPath + '/js/summary/WorkSummarySumFormRO.js',
			__ctxPath + '/js/summary/WorkSummaryFormRO.js' ],

	DiningMenuView : [ __ctxPath + '/js/diningMgnt/DiningMenuView.js',
			__ctxPath + '/js/diningMgnt/DiningMenuForm.js' ],

	DiningMealtypeView : [ __ctxPath + '/js/diningMgnt/DiningMealtypeView.js',
			__ctxPath + '/js/diningMgnt/DiningMealtypeForm.js' ],

	DiningFoodtypeView : [ __ctxPath + '/js/diningMgnt/DiningFoodtypeView.js',
			__ctxPath + '/js/diningMgnt/DiningFoodtypeForm.js' ],

	DiningBookingView : [ __ctxPath + '/js/diningMgnt/DiningBookingView.js',
			__ctxPath + '/js/diningMgnt/DiningBookingForm.js',
			__ctxPath + '/js/diningMgnt/DiningBookingFormEdit.js',
			__ctxPath + '/js/diningMgnt/DiningBookingFormDetail.js',
			__ctxPath + '/js/selector/UserSelectorExtend.js' ],

	DiningSongCanView : [ __ctxPath + '/js/diningMgnt/DiningSongCanView.js',
			__ctxPath + '/js/diningMgnt/DiningBookingDtlSongCan.js' ],

	DiningMenuBrowseView : [ __ctxPath
			+ '/js/diningMgnt/DiningMenuBrowseView.js' ],

	DiningReceptionView : [ __ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/diningMgnt/DiningReceptionView.js',
			__ctxPath + '/js/diningMgnt/DiningReceptionForm.js' ],

	DiningWorkinglunchView : [ __ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/diningMgnt/DiningWorkinglunchView.js',
			__ctxPath + '/js/diningMgnt/DiningWorkinglunchForm.js' ],

	DiningChargeView : [ __ctxPath + '/js/diningMgnt/DiningChargeView.js',
			__ctxPath + '/js/diningMgnt/DiningChargeForm.js',
			__ctxPath + '/js/diningMgnt/DiningChargeDetail.js',
			__ctxPath + '/js/diningMgnt/DiningCustHistory.js' ],

	CustChargeHistoryView : [
			__ctxPath + '/js/diningMgnt/CustChargeHistoryView.js',
			__ctxPath + '/js/diningMgnt/CustChargeHistoryForm.js',
			__ctxPath + '/js/diningMgnt/DiningCustHistory.js' ],

	SealApplyView : [ __ctxPath + '/js/flow/SealApplyView.js',
			__ctxPath + '/js/flow/SealApplyForm.js',
			__ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],
	PersonnelLeaveApplyView : [
			__ctxPath + '/js/personal/PersonnelLeaveApplyView.js',
			__ctxPath + '/js/personal/PersonnelLeaveApplyForm.js',
			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	PublicApplyView : [ __ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/admin/PublicApplyForm.js',
			__ctxPath + '/js/admin/PublicApplyView.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],

	ExpenseTotalView : [ __ctxPath + '/js/admin/ExpenseTotalView.js',
			__ctxPath + '/js/admin/ExpenseAccountPersonalView.js',
			__ctxPath + '/js/admin/ExpenseAccountPersonalForm.js',
			__ctxPath + '/js/admin/ExpenseAccountCompanyView.js',
			__ctxPath + '/js/admin/ExpenseAccountCompanyForm.js',
			__ctxPath + '/js/admin/ExpenseAccountPersonalDetailView.js',
			__ctxPath + '/js/admin/ExpenseAccountPersonalDetailForm.js'

	],
	ExpenseTotalSetView : [ __ctxPath + '/js/admin/ExpenseTotalSetView.js',
			__ctxPath + '/js/admin/ExpenseAccountPersonal2View.js',
			__ctxPath + '/js/admin/ExpenseAccountCompany2View.js',
			__ctxPath + '/js/admin/ExpenseAccountHistoryView.js',
			__ctxPath + '/js/admin/ExpenseAccountHistoryForm.js',
			__ctxPath + '/js/admin/ExpenseAccountHisDetailForm.js',
			__ctxPath + '/js/admin/ExpenseAccountCompanyForm.js',
			__ctxPath + '/js/admin/ExpenseAccountPersonalForm.js'

	],
	RoomMessageView : [ __ctxPath + '/js/operations/RoomMessageView.js',
			__ctxPath + '/js/operations/RoomMessageForm.js',
			__ctxPath + '/js/info/SuggestBoxReplyForm.js',
			__ctxPath + '/js/info/SuggestBoxDisplay.js' ],

	// 外出调研管理 - 调研申请管理
	OutResearchApplyView : [ __ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/admin/OutResearchApplyView.js',
			__ctxPath + '/js/admin/OutResearchApplyWinForm.js',
			__ctxPath + '/js/admin/OutResearchDetailForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],

	OutTripApplyView : [ __ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/admin/OutTripApplyView.js',
			__ctxPath + '/js/admin/OutTripApplyWinForm.js',
			__ctxPath + '/js/admin/OutTripDetailForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],

	OutTripClassView : [ __ctxPath + '/js/admin/OutTripClassView.js',
			__ctxPath + '/js/admin/OutTripClassForm.js',
			__ctxPath + '/js/admin/OutTripClassForm.js' ],

	// 宿舍入住/退宿申请
	ProApplyView : [ __ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js',
			__ctxPath + '/js/operations/ProApplyView.js',
			__ctxPath + '/js/operations/ProApplyForm.js' ],

	// IT服务申请管理
	TsItserviceApplyView : [ __ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/admin/TsItserviceApplyView.js',
			__ctxPath + '/js/admin/TsItserviceApplyForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],

	// 故障处理申请管理
	TsProblemView : [ __ctxPath + '/js/flow/ProcessRunStart.js',
			__ctxPath + '/js/admin/TsProblemView.js',
			__ctxPath + '/js/admin/TsProblemForm.js',
			__ctxPath + '/js/flow/ProcessRunDetail.js' ],

	OffsupplyInfoView : [ __ctxPath + '/js/admin/OffsupplyInfoView.js',
			__ctxPath + '/js/admin/OffsupplyInfoForm.js' ],
	OffsupplyApplyOneView : [ __ctxPath + '/js/admin/OffsupplyApplyOneView.js',
			__ctxPath + '/js/admin/OffsupplyApplyOneForm.js',
			__ctxPath + '/js/admin/OffsupplyApplyOneVForm.js' ],
	OffsupplyApplyDeptView : [
			__ctxPath + '/js/admin/OffsupplyApplyDeptView.js',
			__ctxPath + '/js/admin/OffsupplyApplyDeptForm.js',
			__ctxPath + '/js/admin/OffsupplyApplyOneVForm.js' ],
	DiningPlaceView : [ __ctxPath + '/js/diningMgnt/DiningPlaceView.js',
			__ctxPath + '/js/diningMgnt/DiningPlaceForm.js' ],
	ProWagetypeView : [ __ctxPath + '/js/wage/ProWagetypeView.js',
			__ctxPath + '/js/wage/ProWagetypeForm.js' ],
	ProWageconfigView : [ __ctxPath + '/js/wage/ProWageconfigView.js',
			__ctxPath + '/js/wage/ProWageconfigForm.js' ],
	ProWagedetailsView : [ __ctxPath + '/js/wage/ProWagedetailsView.js',
			__ctxPath + '/js/wage/ProWagedetailsForm.js' ],
	ProWagetotalView : [ __ctxPath + '/js/wage/ProWagetotalView.js',
			__ctxPath + '/js/wage/ProWagetotalForm.js' ],
	ProcessCCReportView : [ __ctxPath + '/js/flow/ProcessCCReportView.js',
			__ctxPath + '/js/flow/ProcessReportForm.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js',
			__ctxPath + '/js/archive/ArchivesDetailUrlWin.js' ],
	TopicTecAndAdjuForm : [ __ctxPath + '/js/archive/TopicTecAndAdjuForm.js',
			__ctxPath + '/js/archive/ArchivesDraftManage.js',
			__ctxPath + '/js/archive/ArchivesDraftView.js',
			__ctxPath + '/js/archive/ArchivesDraftWin.js',
			__ctxPath + '/js/archive/ArchTemplateView.js',
			__ctxPath + '/js/archive/ArchTemplateSelector.js',
			__ctxPath + '/js/archive/ArchivesDocForm.js',
			__ctxPath + '/js/archive/ArchivesDetailWin.js',
			__ctxPath + '/js/archive/ArchivesDocHistoryWin.js',
			__ctxPath + '/js/core/ntkoffice/NtkOfficePanel.js' ],
	OdCirUserView : [ __ctxPath + '/js/archive/OdCirPaperForm.js',
			__ctxPath + '/js/archive/OdCirUserView.js',
			__ctxPath + '/js/archive/OdCirUserWin.js' ],

	CusConnectionView : [ __ctxPath + '/js/customer/CusConnectionView.js',
			__ctxPath + '/js/customer/CusConnectionForm.js' ],
	CusLinkmanView : [ __ctxPath + '/js/customer/CusLinkmanView.js',
			__ctxPath + '/js/customer/CusLinkmanForm.js' ],
	CustomerView : [ __ctxPath + '/js/customer/CustomerView.js',
			__ctxPath + '/js/customer/CustomerForm.js',
			__ctxPath + '/js/customer/CusLinkmanForm.js',
			__ctxPath + '/js/customer/CusLinkmanView.js' ],

	ProjectView : [ __ctxPath + '/js/customer/ProjectView.js',
			__ctxPath + '/js/customer/ProjectForm.js',
			__ctxPath + '/js/customer/ContractForm.js',
			__ctxPath + '/js/customer/ContractConfigView.js' ],
	ProviderView : [ __ctxPath + '/js/customer/ProviderView.js',
			__ctxPath + '/js/customer/ProviderForm.js' ],
	ProductView : [ __ctxPath + '/js/customer/ProductView.js',
			__ctxPath + '/js/customer/ProductForm.js',
			__ctxPath + '/js/customer/ProviderView.js',
			__ctxPath + '/js/customer/ProviderForm.js' ],

	UserContractView : [ __ctxPath + '/js/hrm/UserContractView.js',
			__ctxPath + '/js/hrm/UserContractForm.js',
			__ctxPath + '/js/hrm/ContinueContractForm.js',
			__ctxPath + '/js/hrm/EndContractForm.js',
			__ctxPath + '/js/hrm/UserContractDetailWin.js' ],

	ContractEventView : [ __ctxPath + '/js/hrm/ContractEventView.js'

	],

	ContractView : [ __ctxPath + '/js/customer/ContractForm.js',
			__ctxPath + '/js/customer/ContractConfigView.js',
			__ctxPath + '/js/customer/ContractView.js' ],

	ContractConfigView : [ __ctxPath + '/js/customer/ContractConfigView.js' ],
	ArchivesAddWin : [ __ctxPath + '/js/archive/ArchivesAddWin.js' ],

	FlowStatisticsView : [ __ctxPath + '/js/flow/FlowStatisticsView.js',
			__ctxPath + '/js/flow/FlowStatisticsRecDepAllNoEndView.js',
			__ctxPath + '/js/flow/FlowStatisticsSendDepAllStaView.js' ],
	FlowStatisticsByDeptView : [
			__ctxPath + '/js/flow/FlowStatisticsByDeptView.js',
			__ctxPath + '/js/flow/FlowStatisticsRecDepAllNoEndView.js',
			__ctxPath + '/js/flow/FlowStatisticsSendDepAllStaView.js' ],

	ProWageView : [ __ctxPath + '/js/wage/ProWageView.js' ],
	UserAgentView : [ __ctxPath + '/js/system/UserAgentView.js',
			__ctxPath + '/js/system/MySelfUserAgentWindow.js' ],
	RepairRecArchiveView : [ __ctxPath + '/js/archive/RepairRecArchiveView.js' ],
	VPersonalcardinfoView : [ __ctxPath
			+ '/js/personal/VPersonalcardinfoView.js' ],
	InvitationView : [ __ctxPath + '/js/invitation/InvitationForm.js',
			__ctxPath + '/js/invitation/InvitationView.js' ],
	InvitationContractView : [
			__ctxPath + '/js/invitation/InvitationContractView.js',
			__ctxPath + '/js/invitation/InvitationContractForm.js',
			__ctxPath + '/js/invitation/PayConditionView.js',
			__ctxPath + '/js/invitation/ProgressTraceView.js',
			__ctxPath + '/js/invitation/ChangeTraceView.js' ],
	FlowStatisticsByComView : [
			__ctxPath + '/js/flow/FlowStatisticsByComView.js',
			__ctxPath + '/js/flow/FlowStatisticsRecDepAllNoEndView.js',
			__ctxPath + '/js/flow/FlowStatisticsSendDepAllStaView.js' ],
	LawsView : [ __ctxPath + '/js/law/LawsView.js',
			__ctxPath + '/js/law/LawsForm.js' ],
	LawsForm : [ __ctxPath + '/js/law/LawsForm.js' ],
	LawsTypeView : [ __ctxPath + '/js/law/LawsTypeView.js',
			__ctxPath + '/js/law/LawsTypeForm.js',
			__ctxPath + '/js/law/LawsForm.js' ],
	LawsAuthorView : [ __ctxPath + '/js/law/LawsAuthorView.js',
			__ctxPath + '/js/law/LawsForm.js',
			__ctxPath + '/js/law/LawsAuthorForm.js' ],
	DocFilesSearchView : [ __ctxPath + '/js/system/DocFilesSearchView.js',
			__ctxPath + '/js/system/DocFileListForm.js',
			__ctxPath + '/js/system/DocFilesForm.js' ],
	CarCostSelectByCarAndTimeView : [ __ctxPath
			+ '/js/admin/CarCostSelectByCarAndTimeView.js' ],
	CarCostSelectByCostTypeView : [ __ctxPath
			+ '/js/admin/CarCostSelectByCostTypeView.js' ],
	CarCostSelectByRecordTimeView : [ __ctxPath
			+ '/js/admin/CarCostSelectByRecordTimeView.js' ],
	CarCostSelectByCarAndTypeView : [ __ctxPath
			+ '/js/admin/CarCostSelectByCarAndTypeView.js' ],
	CarCostTypeSelector : [ __ctxPath + '/js/selector/CarCostTypeSelector.js',
			__ctxPath + '/js/admin/CarCostTypeForm.js' ],

	DocFilesSearchView : [ __ctxPath + '/js/system/DocFilesSearchView.js',
			__ctxPath + '/js/system/DocFileListForm.js',
			__ctxPath + '/js/system/DocFilesForm.js' ],

	CarCostSelectByCarAndTimeView : [ __ctxPath
			+ '/js/admin/CarCostSelectByCarAndTimeView.js' ],
	CarCostSelectByCostTypeView : [ __ctxPath
			+ '/js/admin/CarCostSelectByCostTypeView.js' ],
	CarCostSelectByRecordTimeView : [ __ctxPath
			+ '/js/admin/CarCostSelectByRecordTimeView.js' ],
	CarCostSelectByCarAndTypeView : [ __ctxPath
			+ '/js/admin/CarCostSelectByCarAndTypeView.js' ],
	CarCostTypeSelector : [ __ctxPath + '/js/selector/CarCostTypeSelector.js',
			__ctxPath + '/js/admin/CarCostTypeForm.js' ],

	OutMeetingView : [ __ctxPath + '/js/meeting/out/OutMeetingView.js' ],
	ExpiredOutMeeting : [ __ctxPath + '/js/meeting/out/ExpiredOutMeeting.js' ],
	FinishedOutMeeting : [ __ctxPath + '/js/meeting/out/FinishedOutMeeting.js' ],
	ToReceiveArchivesView : [
			__ctxPath + '/js/archive/ToReceiveArchivesView.js',
			__ctxPath + '/js/archive/ToReceiveArchivesDetailView.js',
			__ctxPath + '/js/archive/ToReceiveArchFlowView.js',
			__ctxPath + '/js/archive/ArchDetailView.js',
			__ctxPath + '/js/archive/FeedbackForm.js',
			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	ToRejectArchivesView : [
 			__ctxPath + '/js/archive/ToRejectArchivesView.js',
 			__ctxPath + '/js/archive/ToReceiveArchivesDetailView.js',
 			__ctxPath + '/js/archive/ToReceiveArchFlowView.js',
 			__ctxPath + '/js/archive/ArchDetailView.js',
 			__ctxPath + '/js/archive/FeedbackForm.js',
 			__ctxPath + '/js/flow/ProcessRunStart.js' ],
	ArchiveOutMeeting : [ __ctxPath + '/js/meeting/out/ArchiveOutMeeting.js' ],
	ArchivesIsStandardView : [
			__ctxPath + '/js/archive/ArchivesIsStandardView.js',
			__ctxPath + '/js/archive/ArchDetailView.js' ],
	ArchivesIsStandardXZView : [
	              			__ctxPath + '/js/isStandard/ArchivesIsStandardXZView.js',
	              			__ctxPath + '/js/archive/ArchDetailView.js' ],
	ArchivesIsStandardDWView : [
	              			__ctxPath + '/js/isStandard/ArchivesIsStandardDWView.js',
	              			__ctxPath + '/js/archive/ArchDetailView.js' ],
	ArchivesIsStandardBAView : [
	              			__ctxPath + '/js/isStandard/ArchivesIsStandardBAView.js',
	              			__ctxPath + '/js/archive/ArchDetailView.js' ],
	ArchivesIsStandardYFBAView : [
	              			__ctxPath + '/js/isStandard/ArchivesIsStandardYFBAView.js',
	              			__ctxPath + '/js/archive/ArchDetailView.js' ],
	OAsearchArchivesView : [
			              			__ctxPath + '/js/archive/OAsearchArchivesView.js',
			              			__ctxPath + '/js/jw/JwSentArchivesDetailForm.js' ],
	PartyInfoView : [__ctxPath + '/js/info/PartyInfoView.js',
	                 __ctxPath + '/js/info/PartyInfoForm.js'],
    InfoTypeView  : [__ctxPath + '/js/info/InfoTypeView.js',
			                 __ctxPath + '/js/info/InfoTypeForm.js'],
	PartyInfoDetail : [ __ctxPath + '/js/info/PartyInfoDetail.js' ],
	OffDocumentView : [ __ctxPath + '/js/document/OffDocumentView.js',
			__ctxPath + '/js/document/AllOffDocumentView.js',
			__ctxPath + '/js/document/OffDocumentForm.js',
			__ctxPath + '/js/document/DocumentSharedForm.js',
			__ctxPath + '/js/document/DocFolderForm.js' ],
	//2017/7/19 公文回收站
	ArchivesRecycleLogView : [ __ctxPath + '/js/archive/ArchivesRecycleLogView.js',
	                           __ctxPath + '/js/archive/ArchDetailView.js'],
	ArchivesRecycleLogView1 : [ __ctxPath + '/js/archive/ArchivesRecycleLogView1.js',
	                            __ctxPath + '/js/archive/ArchDetailView.js'],
	ArchivesRecycleLog : [ __ctxPath + '/js/archive/ArchivesRecycleLog.js',
                            __ctxPath + '/js/archive/ArchDetailView.js']
}
