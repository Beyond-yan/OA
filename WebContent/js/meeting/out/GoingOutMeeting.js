Ext.ns('GoingOutMeeting');

GoingOutMeeting = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		GoingOutMeeting.superclass.constructor.call(this, {
					id : 'GoingOutMeeting',
					iconCls : 'menu-archive-draft-manage',
					title : '在办件',
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
								value : 1
							}]
				});
		
		this.store = new Ext.data.JsonStore({
			url : __ctxPath + "/meeting/listFlowOutMeeting.do",
			root : 'result',
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : ['meetingId','runId','host','meetingName','holdTime','holdDep'
			          ,'holdLocation','attendLeaders','attendOfficers','activityName','assignUserName','assignUn','imStatus']
		});
		this.store.setDefaultSort('meetingId', 'desc');
		this.store.baseParams = {
			toDoType:'1'
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
						width : 160,
						dataIndex : 'meetingName',
						renderer : function(v, m, r){
							return '<a href="#" title="查看详情" onclick="GoingOutMeeting.detail('
							+ r.data.meetingId + ','+r.data.runId+')" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'">'+v+'</a>';
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
						dataIndex : 'assignUserName',
						renderer:function(v,m,r){
							var ol = IMClient.IMStatus.ONLINE;
							return (r.get('imStatus')===ol?'<button title="即时通对话" value=" " class="btn-im-on" onclick="IMClient.fn(\'lt\',\''
									+ r.get('assignUn') + '\')">'+v+'</button>' :'<button title="不在线" value=" " class="btn-im-off">'+v+'</button>');
						}
					}, {
						header : '管理',
						width : 160,
						dataIndex : 'meetingId',
						sortable : false,
						renderer : function(v, m, r) {
							return '<button title="取消会议" value=" " class="btn-cancel" onclick="GoingOutMeeting.cancel('
							+ r.get('runId') + ')">&nbsp;&nbsp;</button>取消会议&nbsp;&nbsp;<button title="修改参会人" value=" " class="btn-archive-copy div_button" onclick="GoingOutMeeting.leaderEdit('
							+ v +');">修改参会人</button>';
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'GoingOutMeeting.Grid',
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


GoingOutMeeting.cancel = function(runId){
	Ext.Msg.confirm('信息确认', '您确认要取消该外来会议吗？<span style="color:#f00;">这将同时终止所有参与人处理的流程。</span>', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath + '/meeting/cancelFlowOutMeeting.do',
				params : {
					runId : runId
				},
				method : 'post',
				success : function() {
					Ext.ux.Toast.msg("信息提示", "成功终止流程！");
					var grid = Ext.getCmp("GoingOutMeeting.Grid");
					grid.getStore().reload({params : {start : 0,limit : 25}});
				}
			});
		}
	});

}

GoingOutMeeting.detail = function(meetingId,runId){
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
				url:__ctxPath+ '/pages/meeting/OutMeetingDetail.jsp?meetingId='+ meetingId+'&status=1&rand='+Math.random()
			}
		}),new Ext.Panel({
			title:'审批信息',
			autoLoad:{
				url:__ctxPath+'/flow/processRunDetail.do?randId='+Math.random()+'&runId='+runId
			}
		})]
	}).show();
}

GoingOutMeeting.leaderEdit = function(meetingId){
	if(jsCache['OutMeetingEditWin']){
		OutMeetingEditWin(meetingId);
	}else{
		ScriptMgr.load({
			scripts : [__ctxPath + '/js/meeting/out/OutMeetingEditWin.js'],
			callback : function() {
				jsCache['OutMeetingEditWin'] = 0;
				OutMeetingEditWin(meetingId);
			}
		});
	}
}