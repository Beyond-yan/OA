/**
 * @author:
 * @class AttendCompanyCalendarView
 * @extends Ext.Panel
 * @description [AttendCompanyCalendar]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
WeiLeaderCalendarView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				WeiLeaderCalendarView.superclass.constructor.call(this, {
							id : 'WeiLeaderCalendarView',
							title : '委领导日程',
							iconCls:'menu-leaderSchedule',
							region : 'center',
							layout : 'border',
							items : [{	
								xtype: 'iframepanel', 
								height:800,
								region:'center',
								autoScroll:true,
								autoShow: true,				
								id:"ManualWeiLeaderCalendarViewPanel", 
								loadMask:{msg:'正在加载，请稍候...'}, 
								deferredRender: false, 
								frameConfig:{name:'chatperadminForm'}, 
								border:false, 
								//frame:true, 
								defaultSrc: __ctxPath+'/leaderActivities/WeileaderActive.do?limit=500&schamal=OA'								
							}]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				this.detailPanel = new Ext.Panel({
		            // title:'流程审批信息',
					region : 'center',
		            autoHeight : true,
		            columnWidth : 1,
		            autoScroll : true,
		            autoLoad : {
		                url:__ctxPath+
		                    '/pages/leader/leaderCalendar.jsp',
		                nocache : true
		            }
		        });
				
				
			}
});
