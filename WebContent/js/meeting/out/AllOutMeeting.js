Ext.ns('AllOutMeeting');

AllOutMeeting = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		AllOutMeeting.superclass.constructor.call(this, {
					id : 'AllOutMeeting',
					iconCls : 'menu-archive-draft-manage',
					title : '所有会议',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},
	initUIComponents : function() {
		this.searchPanel = new Ext.FormPanel({
					height : 65,
					region : 'north',
					frame : false,
					border : false,
					layoutConfig : {
						padding : '5',
						align : 'middle'
					},
					defaults : {
						xtype:'panel',
						layout : 'hbox',
						style : 'padding:5px;',
						border : false,
						anchor : '98%,98%',
						defaults:{
							style : 'padding:0px 5px 0px 5px;',
							border : false,
							labelAlign:'right',
							labelWidth : 70,
							width : 120,
							xtype : 'label'
						}
					},
					items : [{
						items:[{
								text : '主　　题:',
								xtype : 'label'
							}, {
								name : 'meetingName',
								xtype : 'textfield'
							}, {
								text : '发文单位:',
								style : 'padding-left:55px;',
								xtype : 'label'
							}, {
								name : 'holdDep',
								xtype : 'textfield'
							}, {
								text : '参会人员:',
								style : 'padding-left:55px;',
								xtype : 'label'
							}, {
								name : 'attendUsers',
								xtype : 'textfield'
							}]
					},{
						items:[{
								text : '类　　型:',
								xtype : 'label'
							}, {
								xtype : 'combo',
								triggerAction : 'all',
								hiddenName:'toDoType',
								editable : false,
								triggerAction : 'all',
								forceSelection : true,
								value:-1,
								store:[[-1,'全　　部'],[2,'正常结束的会议'],[4,'过期未完成的会议']]
							}, {
								text : '开会时间:',
								style : 'padding-left:55px;',
								xtype : 'label'
							}, {
								name : 'startDate',
								format:'Y-m-d',
								xtype : 'datefield'
							}, {
								text : '到',
								width : 20,
								xtype : 'label'
							}, {
								name : 'endDate',
								format:'Y-m-d',
								xtype : 'datefield'
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : this.search.createCallback(this)
							}]
					}]
				});
		
		this.store = new Ext.data.JsonStore({
			url : __ctxPath + "/meeting/listFlowOutMeeting.do",
			root : 'result',
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : ['meetingId','runId','runStatus','host','meetingName','holdTime','holdDep'
			          ,'holdLocation','attendLeaders','attendOfficers','activityName','assignUserName']
		});
		this.store.baseParams = {
			toDoType:'-1'
		};
		// 加载数据
		this.store.load({
					params : {
						start : '0',
						limit : '25'
					}
				});

		var sm = new Ext.grid.CheckboxSelectionModel();
		// 初始化ColumnModel
		var cm = new Ext.grid.ColumnModel({
			columns : [new Ext.grid.RowNumberer(),{
						header : '主　　题',
						width : 160,
						dataIndex : 'meetingName',
						renderer : function(v, m, r){
							return '<a href="#" title="查看详情" onclick="AllOutMeeting.detail('
							+ r.data.meetingId + ','+r.data.runId+')" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'">'+v+'</a>';
						}
					}, {
						header : '发起单位',
						dataIndex : 'holdDep'
					}, {
						header : '参会人员',
						dataIndex : 'attendLeaders',
						renderer:function(v,m,r,i,c){
							var a = r.get('attendOfficers');
							return (v==null?a==null?'':a:a==null?v:v+"("+a+")");
						}
					}, {
						header : '主持人',
						dataIndex : 'host'
					}, {
						header : '开会时间',
						dataIndex : 'holdTime'
					}, {
						header:'流程状态',
						dataIndex:'runStatus',
						renderer:function(v){
							return (4==v?'<p style="color:#f00;">过期会议':3==v?'<p style="color:#f00;">已终止':2==v?'<p style="color:#0f0;">已结束':'<p style="color:#0000ff;">处理中')+'</p>';
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false
			}
		});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'AllOutMeeting.Grid',
					region : 'center',
					stripeRows : true,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
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

AllOutMeeting.detail = function(meetingId,runId){
	var items = [new Ext.Panel({
			title:'外来会议信息',
			autoLoad:{
				url:__ctxPath+ '/pages/meeting/OutMeetingDetail.jsp?meetingId='+ meetingId+'&rand='+Math.random()
			}
		})];
	if(runId>0){
		items.push(new Ext.Panel({
			title:'审批信息',
			autoLoad:{
				url:__ctxPath+'/flow/processRunDetail.do?randId='+Math.random()+'&runId='+runId
			}
		}));
	}
	new Ext.Window({
		title : '外来会议详情',
		iconCls : 'btn-archives-detail',
		modal : true,
		height : 430,
		width : 750,
		autoScroll:true,
		maximizable : true,
		border : false,
		autoScroll:true,
		defaults:{
			region:'center',
			autoScroll:true
		},
		items : items
	}).show();
}