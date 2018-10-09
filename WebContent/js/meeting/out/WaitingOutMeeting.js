Ext.ns('WaitingOutMeeting');

WaitingOutMeeting = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		WaitingOutMeeting.superclass.constructor.call(this, {
					id : 'WaitingOutMeeting',
					iconCls : 'menu-archive-draft-manage',
					title : '待办件',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},
	initUIComponents : function() {
		this.searchPanel = new Ext.FormPanel({
					height : 35,
					region : 'north',
					frame : false,
					border : false,
					layout : 'hbox',
					layoutConfig : {
						padding : '5',
						align : 'middle'
					},
					defaults : {
						style : 'padding:0px 5px 0px 5px;',
						border : false,
						anchor : '98%,98%',
						labelWidth : 70,
						xtype : 'label'
					},
					items : [{
								text : '主　　题:',
								xtype : 'label'
							}, {
								name : 'meetingName',
								xtype : 'textfield'
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : this.search.createCallback(this)
							}, {
								xtype : 'hidden',
								name : 'toDoType',
								value : 0
							}]
				});
		
		this.store = new Ext.data.JsonStore({
			url : __ctxPath + "/meeting/listFlowOutMeeting.do",
			root : 'result',
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : ['meetingId','runId','host','meetingName','holdTime','holdDep'
			          ,'holdLocation','attendLeaders','attendOfficers','activityName','assignUserName'
			          ,'taskId','taskName','activityName']
		});
		this.store.setDefaultSort('meetingId', 'desc');
		this.store.baseParams = {
			toDoType:'0'
		};
		// 加载数据
		this.store.load({
					params : {
						start : '0',
						limit : '25'
					}
				});

		// 初始化ColumnModel
		var cm = new Ext.grid.ColumnModel({
			columns : [new Ext.grid.RowNumberer(), {
						header : '主　　题',
						width:160,
						dataIndex : 'meetingName',
						renderer : function(v, m, r){
							return '<a href="#" title="处理任务" onclick="WaitingOutMeeting.nextStep(\''
							+ r.get('taskId') +'\',\''+r.get('activityName')+'\',\''+ r.get('taskName') 
							+'\');" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'">'+v+'</a>';
						}
					}, {
						header : '开会时间',
						dataIndex : 'holdTime'
					}, {
						header : '会议地点',
						dataIndex : 'holdLocation'
					},  {
						header : '发起单位',
						dataIndex : 'holdDep'
					}, {
						header : '参会人员',
						dataIndex : 'attendLeaders',
						renderer:function(v,m,r,i,c){
							var v0 = r.get('attendOfficers');
							return (v?v0?v+"("+v0+")":v:v0?"("+v0+")":"");
						}
					}, {
						header : '步骤名称',
						dataIndex : 'activityName'
					}, {
						header : '当前办理人',
						dataIndex : 'assignUserName'
					}, {
						header : '管理',
						width : 120,
						dataIndex : 'meetingId',
						sortable : false,
						renderer : function(v, m, r, i,c) {
							return ('<button title="详情" value=" " class="btn-archives-detail div_button" onclick="WaitingOutMeeting.detail('
									+ v + ','+ r.data.runId+')">详情</button>');
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'OutMeetingGrid',
					region : 'center',
					stripeRows : true,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					viewConfig : {
						autoFill : true, // 自动填充
						forceFit : true
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});
	},
	search : function(self) {
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
				searchPanel :self.searchPanel,
				gridPanel : self.gridPanel
			});
		}
	}
});

WaitingOutMeeting.detail = function(meetingId,runId){
	new Ext.Window({
		title : '外来会议详情',
		iconCls : 'btn-archives-detail',
		modal : true,
		height : 430,
		width : 750,
		autoScroll:true,
		maximizable : true,
		border : false,
		items : [new Ext.Panel({
			autoScroll:true,
			autoLoad:{
				url:__ctxPath+ '/pages/meeting/OutMeetingDetail.jsp?meetingId='+ meetingId+'&status=0&rand='+Math.random()
			}
		}),new Ext.Panel({
			title:'审批信息',
			autoLoad:{
				url:__ctxPath+'/flow/processRunDetail.do?randId='+Math.random()+'&runId='+runId
			}
		})]
	}).show();
}
/**
 * 下一步的任务
 * @param {} taskdbid
 */
WaitingOutMeeting.nextStep=function(taskId,activityName,taskName){
	var contentPanel=App.getContentPanel();
	if(taskName.indexOf('--')>=0){
		taskName = taskName.substring(0,taskName.indexOf('--'));
	}
	for(var i=0;i<contentPanel.items.length;i++){
		if(contentPanel.getItem(i).title == taskName){
			var formView=contentPanel.getItem(i);
			contentPanel.activate(formView);
			Ext.ux.Toast.msg("操作提示","请先处理上一个同类型的任务！");
			return;
		}
	}
	var formView=contentPanel.getItem('ProcessNextForm'+taskId);
	if(formView==null){
		formView=new ProcessNextForm({taskId:taskId,activityName:activityName, taskName:taskName});
		contentPanel.add(formView);
	}
	contentPanel.activate(formView);
}