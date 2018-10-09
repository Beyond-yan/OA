/**
 * @author:
 * @class AttendCompanyCalendarView
 * @extends Ext.Panel
 * @description [AttendCompanyCalendar]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
LeaderCalendarView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				LeaderCalendarView.superclass.constructor.call(this, {
							id : 'LeaderCalendarView',
							title : '领导日程',
							iconCls:'menu-leaderSchedule',
							region : 'center',
							layout : 'border',
							items : [{	
								xtype: 'iframepanel', 
								height:800,
								region:'center',
								autoScroll:true,
								autoShow: true,				
								id:"ManualLeaderCalendarViewPanel", 
								loadMask:{msg:'正在加载，请稍候...'}, 
								deferredRender: false, 
								frameConfig:{name:'chatperadminForm'}, 
								border:false, 
								//frame:true, 
								defaultSrc: __ctxPath+'/leaderActivities/leaderActive.do?limit=500'								
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
				
				
			},// end of the initComponents()
			//重置查询表单
			reset : function(){
				this.searchPanel.getForm().reset();
			},
			//按条件搜索
			search : function() {
				$search({
					searchPanel:this.searchPanel,
					gridPanel:this.gridPanel
				});
			},
			//GridPanel行点击处理事件
			rowClick:function(grid,rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
					new AttendCompanyCalendarForm({id:rec.data.id}).show();
				});
			},
			//创建记录
			createRs : function() {
				new AttendCompanyCalendarForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/attend/multiDelAttendCompanyCalendar.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
					url:__ctxPath + '/attend/multiDelAttendCompanyCalendar.do',
					grid:this.gridPanel,
					idName:'id'
				});
			},
			//编辑Rs
			editRs : function(record) {
				new LeaderCalendarForm({
					id : record.data.id
				}).show();
			},
			//行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this,record.data.id);
						break;
					case 'btn-edit' :
						this.editRs.call(this,record);
						break;
					default :
						break;
				}
			}
});
