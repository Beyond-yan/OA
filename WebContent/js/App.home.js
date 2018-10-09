/**
 * @author YungLocke
 * @panel AppHome
 */

// 首页的设置
// 日志模块
DiaryPanelView = Ext
		.extend(
				Ext.ux.Portlet,
				{
					tools : null,
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						this.initTool();
						DiaryPanelView.superclass.constructor
								.call(
										this,
										{
											id : 'DiaryPanelView',
											title : '我的日志',
											iconCls : 'menu-diary',
											tools : this.tools,
											autoLoad : {
												url : __ctxPath + '/system/displayDiary.do?start=0&limit=8'
											}
										});
					},
					initTool : function() {
						this.tools = [
								{
									id : 'refresh',
									handler : function() {
										Ext
												.getCmp('DiaryPanelView')
												.getUpdater()
												.update(
														__ctxPath + '/system/displayDiary.do?start=0&limit=8');
									}
								},
								{
									id : 'close',
									handler : function(e, target, panel) {
										Ext.Msg.confirm('提示信息', '确认删除此模块吧？',
												function(btn) {
													if (btn == 'yes') {
														panel.ownerCt.remove(
																panel, true);
													}
												});
									}
								} ];
					}

				});
// 新闻模块
NewsPanelView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		NewsPanelView.superclass.constructor.call(this, {
			id : 'NewsPanelView',
			title : '新闻中心',
			iconCls : 'menu-news',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/info/displayNews.do'
			}
		});
	},
	initTool : function() {
		this.tools = [ {
			id : 'refresh',
			handler : function() {
				Ext.getCmp('NewsPanelView').getUpdater().update(
						__ctxPath + '/info/displayNews.do');
			}
		} ];
	}

});
// 个人消息模块
MessagePanelView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		MessagePanelView.superclass.constructor.call(this, {
			id : 'MessagePanelView',
			title : '个人消息',
			iconCls : 'menu-message',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/info/displayInMessage.do'
			}
		});
	},
	initTool : function() {
		this.tools = [ {
			id : 'refresh',
			handler : function() {
				Ext.getCmp('MessagePanelView').getUpdater().update(
						__ctxPath + '/info/displayInMessage.do');
			}
		} ];
	}

});
// 党群信息模块
PartyInfoPanelView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		PartyInfoPanelView.superclass.constructor.call(this, {
			id : 'PartyInfoPanelView',
			title : '党群信息',
			iconCls : 'menu-flowPr',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/info/partyDisplayNotice.do?start=0&limit=8'
			}
		});
	},
	initTool : function() {
		this.tools = [ {
			id : 'refresh',
			handler : function() {
				Ext.getCmp('PartyInfoPanelView').getUpdater().update(
						__ctxPath + '/info/partyDisplayNotice.do?start=0&limit=8&ran=' + Math.random());
			}
		}
		 , {
		 id : 'close',
		 handler : function(e, target, panel) {
		 Ext.Msg.confirm('提示信息', '确认删除此模块吧？', function(btn) {
		 if (btn == 'yes') {
		 panel.ownerCt.remove(panel, true);
		 }
		 });
		 }
		 }
		];
	}

});
/**
 * OA办公小助手模块
 * add by sicen.liu
 */
OAOfficeSearchPanelView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		OAOfficeSearchPanelView.superclass.constructor.call(this, {
			id : 'OAOfficeSearchPanelView',
			title : '办公小助手',
			iconCls : 'menu-archive-issue-manage',
			tools : this.tools,
			items :[new Ext.FormPanel({
				height : 40,
				frame : false,
				id : 'OAMenuSearchArchivesForm',
				border : false,
				layout : 'hbox',
				layoutConfig : {
					padding : '5',
					align : 'middle'
				},
				defaults : {
					margins : '4 4 4 4'
				},
				items : [{
							xtype : 'label',
							text : '请输入搜索条件:'
						}, {
							xtype : 'textfield',
							name : 'searchText',
							id :'OAMenuSearchArchivesForm.searchText',
							width:500
						}, {
							xtype : 'button',
							text : '查询',
							iconCls : 'search',
							scope : this,
							handler : function() {
								var contentPanel = App.getContentPanel();
								var searchForm = contentPanel.getItem('OAsearchArchivesView');
								if(searchForm!=null){
									contentPanel.remove(searchForm);
								}
								var startForm = new OAsearchArchivesView({
									isDesk :true,
									searchText:Ext.getCmp('OAMenuSearchArchivesForm.searchText').getValue()
								});
								contentPanel.add(startForm);
								contentPanel.activate(startForm);
							}
						},{
							xtype:'button',
							text:'重置',
							iconCls:'btn-reseted',
							handler:function(){
								var searchPanel = Ext.getCmp('OAMenuSearchArchivesForm');
								searchPanel.getForm().reset();
							}
						}]
			})]
		});
	},
	initTool : function() {
		this.tools = [{
			id : 'refresh',
			handler : function() {
				Ext.getCmp('OAMenuSearchArchivesForm.searchText').setValue(null);
			}
		}, {
		 id : 'close',
		 handler : function(e, target, panel) {
			 Ext.Msg.confirm('提示信息', '确认删除此模块吧？', function(btn) {
			 if (btn == 'yes') {
			 	panel.ownerCt.remove(panel, true);
			 }
			 });
		 }
		 }
		];
	}
});
//公告模块
NoticePanelView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		NoticePanelView.superclass.constructor.call(this, {
			id : 'NoticePanelView',
			title : '公告牌',
			iconCls : 'menu-notice',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/info/displayNotice.do'
			}
		});
	},
	initTool : function() {
		this.tools = [ {
			id : 'refresh',
			handler : function() {
				Ext.getCmp('NoticePanelView').getUpdater().update(
						__ctxPath + '/info/displayNotice.do?l=1&ran=' + Math.random());
			}
		}
		 , {
		 id : 'close',
		 handler : function(e, target, panel) {
		 Ext.Msg.confirm('提示信息', '确认删除此模块吧？', function(btn) {
		 if (btn == 'yes') {
		 panel.ownerCt.remove(panel, true);
		 }
		 });
		 }
		 }
		];
	}

});
// 待办事项
TaskPanelView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		TaskPanelView.superclass.constructor.call(this, {
			id : 'TaskPanelView',
			title : '待办事项',
			iconCls : 'menu-flowWait',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/flow/displayTask.do?l=1&ran=' + Math.random()
			}
		});
	},
	initTool : function() {
		this.tools = [ {
			id : 'refresh',
			handler : function() {
				Ext.getCmp('TaskPanelView').getUpdater().update(
						__ctxPath + '/flow/displayTask.do?l=1&ran=' + Math.random());
			}
		}];
	}

});
//会议通知
MeetingNoticeView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		TaskPanelView.superclass.constructor.call(this, {
			id : 'MeetingNoticeView',
			title : '会议通知',
			iconCls : 'menu-flowWait',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/meetingNotice/displayMeetingNotice.do?l=1&ran=' + Math.random()
			}
		});
	},
	initTool : function() {
		this.tools = [ {
			id : 'refresh',
			handler : function() {
				Ext.getCmp('MeetingNoticeView').getUpdater().update(
						__ctxPath + '/meetingNotice/displayMeetingNotice.do?l=1&ran=' + Math.random());
			}
		},{
			id : 'close',
			handler : function(e, target, panel) {
				Ext.Msg.confirm('提示信息', '确认删除此模块吧？',
						function(btn) {
							if (btn == 'yes') {
								panel.ownerCt.remove(
										panel, true);
							}
						});
			}
		}];
	}

});
//督查事项
WorkContentView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		WorkContentView.superclass.constructor.call(this, {
			id : 'WorkContentView',
			title : '督查事项',
			iconCls : 'menu-flowWait',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/work/displayWorkContent.do?Q_status_N_EQ=0&l=1&ran=' + Math.random()
			}
		});
	},
	initTool : function() {
		this.tools = [ {
			id : 'refresh',
			handler : function() {
				Ext.getCmp('WorkContentView').getUpdater().update(
						__ctxPath + '/work/displayWorkContent.do?Q_status_N_EQ=0&l=1&ran=' + Math.random());
			}
		}];
	}

});
// 抄送公文
MyGivemeCCArchives = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		MyGivemeCCArchives.superclass.constructor.call(this, {
			id : 'MyGivemeCCArchives',
			title : '抄送公文',
			iconCls : 'menu-flowWait',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/archive/listreadArchives.do?userId='
					+ curUserInfo.userId+'&start=0&limit=18'+'&ran=' + Math.random()
			}
		});
	},
	initTool : function() {
		this.tools = [ {
			id : 'refresh',
			handler : function() {
				Ext.getCmp('MyGivemeCCArchives').getUpdater().update(
						__ctxPath + '/archive/listreadArchives.do?userId='
					+ curUserInfo.userId +'&start=0&limit=18'+'&ran=' + Math.random());
			}
		},		{
			id : 'close',
			handler : function(e, target, panel) {
				Ext.Msg.confirm('提示信息', '确认删除此模块吧？',
						function(btn) {
							if (btn == 'yes') {
								panel.ownerCt.remove(
										panel, true);
							}
						});
			}
		} ];
	}

});
/**
 * @description 我的会议信息
 * @author YHZ 
 * @dateTime 2010-11-4 AM
 */
MyConferencePanelView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg){
		Ext.applyIf(_cfg);
		this.initTool();
		MyConferencePanelView.superclass.constructor.call(this,{
			id : 'MyConferencePanelView',
			title : '我的会议通知',
			iconCls : 'menu-conference_myjoin',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/admin/displayMyconfConference.do'
			}
		});
	},
	initTool : function(){
		this.tools = [{
			id : 'refresh',
			handler : function() {
				Ext.getCmp('MyConferencePanelView').getUpdater().update(__ctxPath + '/admin/displayMyconfConference.do');
			}
		},
		{
			id : 'close',
			handler : function(e, target, panel) {
				Ext.Msg.confirm('提示信息', '确认删除此模块吧？',
						function(btn) {
							if (btn == 'yes') {
								panel.ownerCt.remove(
										panel, true);
							}
						});
			}
		} ];
	}
});

/**
 * @description 待我审核的会议提示
 * @author YHZ
 * @company www.jee-soft.cn
 * @datetime 2010-11-29PM
 */
MyApplyConferenceView = Ext.extend(Ext.ux.Portlet,{
	tools : null,
	constructor : function(_cfg){
		Ext.applyIf(this,_cfg);
		this.initTool();
		MyApplyConferenceView.superclass.constructor.call(this,{
			id : 'MyApplyConferenceView',
			title : '待我审核的会议',
			iconCls : 'menu-daiConfApply',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/admin/displyApplyConference.do'
			}
		});
	},
	initTool : function(){
		this.tools = [{
			id : 'refresh',
			handler : function(){
				Ext.getCmp('MyApplyConferenceView').getUpdater().update({
					url : __ctxPath + '/admin/displyApplyConference.do'
				});
			}
		},{
			id : 'close',
			handler : function(e, target, panel){
			Ext.Msg.confirm('提示信息','您真的要删除待我审核的会议模块吗？',function(btn){
				if(btn == 'yes'){
					panel.ownerCt.remove(panel, true);
				}
			});
			}
		}];
	}
});

/**
 * @description 会议纪要提示
 * @author YHZ
 * @company www.jee-soft.cn
 * @datetime 2010-11-8 AM
 */
ConfSummaryPanelView = Ext.extend(Ext.ux.Portlet,{
	tools : null,
	constructor : function(_cfg){
		Ext.applyIf(this,_cfg);
		this.initTool();
		ConfSummaryPanelView.superclass.constructor.call(this,{
			id : 'ConfSummaryPanelView',
			title : '我的会议纪要',
			iconCls : 'menu-confSummary',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/admin/displayConfSummary.do'
			}
		});
	},
	initTool : function(){
		this.tools = [{
			id : 'refresh',
			handler : function(){
				Ext.getCmp('ConfSummaryPanelView').getUpdater().update({
					url : __ctxPath + '/admin/displayConfSummary.do'
				});
			}
		},{
			id : 'close',
			handler : function(e, target, panel){
				Ext.Msg.confirm('提示信息','您真的要删除会议纪要模块吗？',function(btn){
					if(btn == 'yes'){
						panel.ownerCt.remove(panel, true);
					}
				});
			}
		}];
	}
});

// 我的约会
AppointmentPanelView = Ext
		.extend(
				Ext.ux.Portlet,
				{
					tools : null,
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						this.initTool();
						AppointmentPanelView.superclass.constructor
								.call(
										this,
										{
											id : 'AppointmentPanelView',
											title : '我的约会',
											iconCls : 'menu-appointment',
											tools : this.tools,
											autoLoad : {
												url : __ctxPath + '/task/displayAppointment.do?start=0&limit=8'
											}
										});
					},
					initTool : function() {
						this.tools = [
								{
									id : 'refresh',
									handler : function() {
										Ext
												.getCmp('AppointmentPanelView')
												.getUpdater()
												.update(
														__ctxPath + '/task/displayAppointment.do?start=0&limit=8');
									}
								},
								{
									id : 'close',
									handler : function(e, target, panel) {
										Ext.Msg.confirm('提示信息', '确认删除此模块吧？',
												function(btn) {
													if (btn == 'yes') {
														panel.ownerCt.remove(
																panel, true);
													}
												});
									}
								} ];
					}

				});
// 我的日程
CalendarPlanPanelView = Ext
		.extend(
				Ext.ux.Portlet,
				{
					tools : null,
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						this.initTool();
						CalendarPlanPanelView.superclass.constructor
								.call(
										this,
										{
											id : 'CalendarPlanPanelView',
											title : '我的日程',
											iconCls : 'menu-cal-plan-view',
											tools : this.tools,
											autoLoad : {
												url : __ctxPath + '/task/displayCalendarPlan.do?start=0&limit=8'
											}
										});
					},
					initTool : function() {
						this.tools = [
								{
									id : 'refresh',
									handler : function() {
										Ext
												.getCmp('CalendarPlanPanelView')
												.getUpdater()
												.update(
														__ctxPath + '/task/displayCalendarPlan.do?start=0&limit=8');
									}
								},
								{
									id : 'close',
									handler : function(e, target, panel) {
										Ext.Msg.confirm('提示信息', '确认删除此模块吧？',
												function(btn) {
													if (btn == 'yes') {
														panel.ownerCt.remove(
																panel, true);
													}
												});
									}
								} ];
					}

				});
// 我的计划
MyPlanPanelView = Ext
		.extend(
				Ext.ux.Portlet,
				{
					tools : null,
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						this.initTool();
						MyPlanPanelView.superclass.constructor
								.call(
										this,
										{
											id : 'MyPlanPanelView',
											title : '我的计划',
											iconCls : 'menu-myplan',
											tools : this.tools,
											autoLoad : {
												url : __ctxPath + '/task/displayWorkPlan.do?start=0&limit=8'
											}
										});
					},
					initTool : function() {
						this.tools = [
								{
									id : 'refresh',
									handler : function() {
										Ext
												.getCmp('MyPlanPanelView')
												.getUpdater()
												.update(
														__ctxPath + '/task/displayWorkPlan.do?start=0&limit=8');
									}
								},
								{
									id : 'close',
									handler : function(e, target, panel) {
										Ext.Msg.confirm('提示信息', '确认删除此模块吧？',
												function(btn) {
													if (btn == 'yes') {
														panel.ownerCt.remove(
																panel, true);
													}
												});
									}
								} ];
					}

				});

// 桌面新闻
DeskNewsPanelView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		DeskNewsPanelView.superclass.constructor.call(this, {
			id : 'DeskNewsPanelView',
			title : '桌面新闻',
			iconCls : 'menu-news',
			tools : this.tools,
			border : false,
			height : 330,
			autoLoad : {
				url : __ctxPath + '/info/imageNews.do',
				scripts : true
			}
		});
	},
	initTool : function() {
		this.tools = [ {
			id : 'refresh',
			handler : function() {
				Ext.getCmp('DeskNewsPanelView').getUpdater().update( {
					url : __ctxPath + '/info/imageNews.do',
					scripts : true
				});
			}
		}, {
			id : 'close',
			handler : function(e, target, panel) {
				Ext.Msg.confirm('提示信息', '确认删除此模块吧？', function(btn) {
					if (btn == 'yes') {
						panel.ownerCt.remove(panel, true);
					}
				});
			}
		} ];
	}

});
// 滚动的公告
NoticeScollPanelView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		NoticeScollPanelView.superclass.constructor.call(this, {
			id : 'NoticeScollPanelView',
			title : '滚动公告栏',
			iconCls : 'menu-notice',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/info/scrollerNotice.do?',
				scripts : true
			}
		});
	},
	initTool : function() {
		this.tools = [ {
			id : 'refresh',
			handler : function() {
				Ext.getCmp('NoticeScollPanelView').getUpdater().update( {
					url : __ctxPath + '/info/scrollerNotice.do',
					scripts : true
				});
			}
		}, {
			id : 'close',
			handler : function(e, target, panel) {
				Ext.Msg.confirm('提示信息', '确认删除此模块吧？', function(btn) {
					if (btn == 'yes') {
						panel.ownerCt.remove(panel, true);
					}
				});
			}
		} ];
	}

});

// 个人文档
MyDocumentPanelView = Ext
		.extend(
				Ext.ux.Portlet,
				{
					tools : null,
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						this.initTool();
						MyDocumentPanelView.superclass.constructor
								.call(
										this,
										{
											id : 'MyDocumentPanelView',
											title : '我的文档',
											iconCls : 'menu-document',
											tools : this.tools,
											autoLoad : {
												url : __ctxPath + '/document/displayDocument.do?start=0&limit=8'
											}
										});
					},
					initTool : function() {
						this.tools = [
								{
									id : 'refresh',
									handler : function() {
										Ext
												.getCmp('MyDocumentPanelView')
												.getUpdater()
												.update(
														__ctxPath + '/document/displayDocument.do?start=0&limit=8');
									}
								},
								{
									id : 'close',
									handler : function(e, target, panel) {
										Ext.Msg.confirm('提示信息', '确认删除此模块吧？',
												function(btn) {
													if (btn == 'yes') {
														panel.ownerCt.remove(
																panel, true);
													}
												});
									}
								} ];
					}

				});
// 我的邮件
MyMailPanelView = Ext
		.extend(
				Ext.ux.Portlet,
				{
					tools : null,
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						this.initTool();
						MyMailPanelView.superclass.constructor
								.call(
										this,
										{
											id : 'MyMailPanelView',
											title : '我的新邮件',
											iconCls : 'menu-mail',
											tools : this.tools,
											autoLoad : {
												url : __ctxPath + '/communicate/displayMail.do?start=0&limit=8'
											}
										});
					},
					initTool : function() {
						this.tools = [
								{
									id : 'refresh',
									handler : function() {
										Ext
												.getCmp('MyMailPanelView')
												.getUpdater()
												.update(
														__ctxPath + '/communicate/displayMail.do?start=0&limit=8');
									}
								}
								/*{
									id : 'close',
									handler : function(e, target, panel) {
										Ext.Msg.confirm('提示信息', '确认删除此模块吧？',
												function(btn) {
													if (btn == 'yes') {
														panel.ownerCt.remove(
																panel, true);
													}
												});
									}
								}*/ ];
					}

				});
// 部门计划
DepPlanPanelView = Ext.extend(Ext.ux.Portlet, {
	tools : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initTool();
		DepPlanPanelView.superclass.constructor.call(this, {
			id : 'DepPlanPanelView',
			title : '部门计划',
			iconCls : 'menu-depplan',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath + '/task/displayDepWorkPlan.do'
			}
		});
	},
	initTool : function() {
		this.tools = [
				{
					id : 'refresh',
					handler : function() {
						Ext.getCmp('DepPlanPanelView').getUpdater().update(
								__ctxPath + '/task/displayDepWorkPlan.do');
					}
				}, {
					id : 'close',
					handler : function(e, target, panel) {
						Ext.Msg.confirm('提示信息', '确认删除此模块吧？', function(btn) {
							if (btn == 'yes') {
								panel.ownerCt.remove(panel, true);
							}
						});
					}
				} ];
	}

});

//待下载公文
AwaitDownloadFileView = Ext.extend(Ext.ux.Portlet,{
	tools : null,
	constructor : function(_cfg){
		Ext.applyIf(this, _cfg);
		this.initTool();
		AwaitDownloadFileView.superclass.constructor.call(this,{
			id : 'AwaitDownloadFileView',
			title : '待下载公文',
			iconCls : 'menu-planmanage',
			tools : this.tools,
			autoLoad : {
				url : __ctxPath+'/system/displaySysDataTransfer.do?Q_receiveFlag_L_EQ=0&start=0&limit=8&l=1&ran=' + Math.random()
			}
		});
	},
	initTool : function(){
		this.tools = [{
			id : 'refresh',
			handler : function () {
				Ext.getCmp('AwaitDownloadFileView').getUpdater().update(
					__ctxPath + '/system/displaySysDataTransfer.do?Q_receiveFlag_L_EQ=0&start=0&limit=8&l=1&ran=' + Math.random());
			}
		}, {
			id : 'close',
			handler : function(e, target, panel){
				Ext.Msg.confirm('提示信息', '确认删除此模块吧？',function(btn){
					if('yes' == btn){
						panel.ownerCt.remove(panel, true);
					}
				})
			}
		}]
	}
});

// 模板选择器
PanelSelectorWin = Ext.extend(Ext.Window, {
	formPanel : null,
	buttons : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUI();
		PanelSelectorWin.superclass.constructor.call(this, {
			id : 'PanelSelectorWin',
			title : '选择显示模块',
			layout : 'fit',
			height : 300,
			width : 400,
			modal : true,
			buttons : this.buttons,
			buttonAlign : 'center',
			items : this.formPanel
		});
	},
	initUI : function() {
		this.formPanel = new Ext.FormPanel( {
			border : false,
			id : 'PanelSelectorForm',
			layout : 'column',
			bodyStyle : 'padding:5px',
			items : [ {
				columnWidth : .49,
				border : false,
				items : [ {
					xtype : 'checkbox',
					boxLabel : '待办事项',
					hideLabel : true,
					id : 'TaskPanelViewCheckBox',
					name : 'TaskPanelView'
				},{
					xtype : 'checkbox',
					boxLabel : '督查事项',
					hideLabel : true,
					id : 'WorkContentViewCheckBox',
					name : 'WorkContentView'
				},{
					xtype : 'checkbox',
					boxLabel : '会议通知',
					hideLabel : true,
					id : 'MeetingNoticeViewCheckBox',
					name : 'MeetingNoticeView'
				},/* {
					xtype : 'checkbox',
					boxLabel : '我的日志',
					hideLabel : true,
					id : 'DiaryPanelViewCheckBox',
					name : 'DiaryPanelView'
				}, {
					xtype : 'checkbox',
					hideLabel : true,
					boxLabel : '我的约会',
					id : 'AppointmentPanelViewCheckBox',
					name : 'AppointmentPanelView'
				},*/ {
					xtype : 'checkbox',
					boxLabel : '我的日程',
					hideLabel : true,
					id : 'CalendarPlanPanelViewCheckBox',
					name : 'CalendarPlanPanelView'
				}, /*{
					xtype : 'checkbox',
					boxLabel : '部门计划',
					hideLabel : true,
					id : 'DepPlanPanelViewCheckBox',
					name : 'DepPlanPanelView'
				}, */{
					xtype : 'checkbox',
					boxLabel : '公告牌',
					hideLabel : true,
					hidden:!curUserInfo.isGearOfficeRole,
					id : 'NoticePanelViewCheckBox',
					name : 'NoticePanelView'
				}, {
					xtype : 'checkbox',
					boxLabel : '我的新邮件',
					hideLabel : true,
					id : 'MyMailPanelViewCheckBox',
					name : 'MyMailPanelView'
				}/*, {
					xtype : 'checkbox',
					boxLabel : '我的会议纪要',
					id : 'ConfSummaryPanelViewCheckBox',
					name : 'ConfSummaryPanelView'
				}*/ ,{
					xtype : 'checkbox',
					boxLabel : '待下载公文',
					hideLabel : true,
					hidden : !(curUserInfo.isDocumentLoader || curUserInfo.isAdmin),
					id : 'AwaitDownloadFileViewCheckBox',
					name : 'AwaitDownloadFileView'
				}, {
					xtype : 'checkbox',
					boxLabel : '抄送公文',
					hideLabel : true,
					id : 'MyGivemeCCArchivesCheckBox',
					name : 'MyGivemeCCArchives'
				},{
					xtype : 'checkbox',
					boxLabel : '党群信息',
					hideLabel : true,
					hidden:!(curUserInfo.isGearOfficeRole ||curUserInfo.isAdmin),
					id : 'PartyInfoPanelViewCheckBox',
					name : 'PartyInfoPanelView'
				},{
					xtype : 'checkbox',
					boxLabel : '办公小助手',
					hideLabel : true,
					id : 'OAOfficeSearchPanelViewCheckBox',
					name : 'OAOfficeSearchPanelView'
				}]
			}, {
				// layout:'form',
				columnWidth : .49,
				border : false,
				items : [/* {
					xtype : 'checkbox',
					hideLabel : true,
					boxLabel : '我的计划',
					id : 'MyPlanPanelViewCheckBox',
					name : 'MyPlanPanelView'
				}, {
					xtype : 'checkbox',
					boxLabel : '桌面新闻',
					hideLabel : true,
					id : 'DeskNewsPanelViewCheckBox',
					name : 'DeskNewsPanelView'
				}, {
					xtype : 'checkbox',
					boxLabel : '滚动公告栏',
					hideLabel : true,
					id : 'NoticeScollPanelViewCheckBox',
					name : 'NoticeScollPanelView'
				},{
					xtype : 'checkbox',
					boxLabel : '我的文档',
					hideLabel : true,
					id : 'MyDocumentPanelViewCheckBox',
					name : 'MyDocumentPanelView'
				}, {
					xtype : 'checkbox',
					boxLabel : '我的消息',
					hideLabel : true,
					id : 'MessagePanelViewCheckBox',
					name : 'MessagePanelView'
				}, {
					xtype : 'checkbox',
					boxLabel : '我的会议',
					hideLabel : true,
					id : 'MyConferencePanelViewCheckBox',
					name : 'MyConferencePanelView'
				}, {
					xtype : 'checkbox',
					boxLabel : '待我审核的会议',
					hideLabel : true,
					id : 'MyApplyConferenceViewCheckBox',
					name : 'MyApplyConferenceView'
				}*/ ]
			} ]
		});

		// 将已经显示的PORTALITEM勾上
		var portal = Ext.getCmp('Portal');
		curUserInfo.portalConfig = [];
		var items = portal.items;
		for ( var i = 0; i < items.length; i++) {
			var v = items.itemAt(i);
			for ( var j = 0; j < v.items.getCount(); j++) {
				var m = v.items.itemAt(j);
				var portalItem = new PortalItem(m.id, i, j);
				curUserInfo.portalConfig.push(portalItem);
			}
		}

		var confs = curUserInfo.portalConfig;
		for ( var i = 0; i < confs.length; i++) {
			var panelView = confs[i].panelId;
			var panelCheck = Ext.getCmp(panelView + 'CheckBox');
			if (panelCheck != null) {
				panelCheck.setValue(true);
				panelCheck.disable();
			}
		}

		this.buttons = [
				{
					xtype : 'button',
					text : '确定',
					iconCls : 'btn-save',
					handler : function() {
						var fd = Ext.getCmp('PortalItem');
						var portal = Ext.getCmp('Portal');
						var array = [ 'DiaryPanelView', 'TaskPanelView','WorkContentView','MyGivemeCCArchives',
								'NoticePanelView', 'AppointmentPanelView','MeetingNoticeView',
								'CalendarPlanPanelView', 'DepPlanPanelView',
								'MyPlanPanelView', 'DeskNewsPanelView','MessagePanelView',
								'NoticeScollPanelView', 'MyDocumentPanelView',
								'MyMailPanelView','MyConferencePanelView',
								'ConfSummaryPanelView','MyApplyConferenceView',
								'AwaitDownloadFileView','PartyInfoPanelView','OAOfficeSearchPanelView' ];
						for ( var v = 0; v < array.length; v++) {
							var check = Ext.getCmp(array[v] + 'CheckBox');
							if (check != null) {
								if (check.getValue()
										&& Ext.getCmp(array[v]) == null) {
									var panel = eval('new ' + array[v] + '()');
									fd.add(panel);
								}
							}
						}
						fd.doLayout();
						portal.doLayout();
						Ext.getCmp('PanelSelectorWin').close();
					}
				}, {
					xtype : 'button',
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						Ext.getCmp('PanelSelectorWin').close();
					}
				} ];
	}
});

AppHome = Ext.extend(Ext.Panel, {
	portalPanel : null,
	toolbar : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		AppHome.superclass.constructor.call(this, {
			title : '我的桌面',
			closable : false,
			id : 'AppHome',
			iconCls : 'menu-company',
			layout : 'fit',
			defaults : {
				padding : '0 5 0 0'
			},
			tbar : this.toolbar,
			items : this.portalPanel
		});
	},
	initUIComponents : function() {
		this.toolbar = new Ext.Toolbar( {
			height : 23,
			cls :'hometbar',
			items : [ '->',/* {
				xtype : 'button',
				text : '重庆交通在线',
				iconCls : 'btn-traffic',
				handler : function() {
				}
			},'-',*/ {
				xtype : 'button',
				text : '添加模块',
				iconCls : 'btn-add',
				handler : function() {
					new PanelSelectorWin().show();
				}
			}, '-', {
				xtype : 'button',
				text : '保存',
				iconCls : 'btn-save',
				handler : function() {
					var portal = Ext.getCmp('Portal');
					curUserInfo.portalConfig = [];
					var items = portal.items;
					for ( var i = 0; i < items.length; i++) {
						var v = items.itemAt(i);
						for ( var j = 0; j < v.items.getCount(); j++) {
							var m = v.items.itemAt(j);
							var portalItem = new PortalItem(m.id, i, j);
							curUserInfo.portalConfig.push(portalItem);
						}
					}
					Ext.Ajax.request( {
						method : 'post',
						url : __ctxPath + '/system/saveIndexDisplay.do',
						success : function(request) {
							Ext.ux.Toast.msg('操作信息', '保存成功');
						},
						failure : function(request) {
							Ext.MessageBox.show( {
								title : '操作信息',
								msg : '信息保存出错，请联系管理员！',
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
						},
						params : {
							items : Ext.encode(curUserInfo.portalConfig)
						}
					});

				}
			} ]

		});

		var tools = [ {
			id : 'gear',
			handler : function() {
				Ext.Msg.alert('Message', 'The Settings tool was clicked.');
			}
		}, {
			id : 'close',
			handler : function(e, target, panel) {
				panel.ownerCt.remove(panel, true);
			}
		} ];

		var confs = curUserInfo.portalConfig;

		if (confs == null || confs == undefined || confs.length < 1) {
			confs = new Array();
			var p1 = {
				panelId : 'MessagePanelView',
				column : 1,
				row : 0
			};
			var p2 = {
				panelId : 'NoticePanelView',
				column : 0,
				row : 1
			};
			var p3 = {
				panelId : 'NewsPanelView',
				column : 0,
				row : 0
			};
			var p4 = {
				panelId : 'TaskPanelView',
				column : 0,
				row : 2
			};
			var p5 = {
				panelId : 'MyConferencePanelView',
				column : 0,
				row : 3
			};
			var p6 = {
				panelId : 'MyMailPanelView',
				column : 0,
				row : 3
			};
			var p7 = {
				panelId : 'MyGivemeCCArchives',
				column : 0,
				row : 3
			};
			/*var p8 = {
				panelId : 'WorkContentView',
				column : 0,
				row : 4
			};*/

			//confs.push(p3);
			//confs.push(p2);
			//confs.push(p1);
			confs.push(p4);
			//confs.push(p5);
			//confs.push(p6);
			//confs.push(p7);
			//confs.push(p8);
		}
		var column0 = [];
		var column1 = [];
		var portalFlag=true;
		for ( var v = 0; v < confs.length; v++) {
			if(confs[v].panelId=="WorkContentView"){
				portalFlag=false;
			}
		}
		//添加默认项
		if(curUserInfo.ownerSchema=="oa"&&portalFlag){
			var p8 = {
				panelId : 'WorkContentView',
				column : 0,
				row : 4
			};
			confs.push(p8);
		}
		for ( var v = 0; v < confs.length; v++) {
			if (confs[v].column == 0) {
				column0.push(eval('new ' + confs[v].panelId + '()'));
			} else {
				column1.push(eval('new ' + confs[v].panelId + '()'));
			}
		}
		this.portalPanel = {
			id : 'Portal',
			xtype : 'portal',
			region : 'center',
			margins : '35 5 5 0',
			items : [ {
				columnWidth : .65,
				style : 'padding:10px 0 10px 10px',
				id : 'PortalItem',
				items : column0
			}, {
				columnWidth : .35,
				style : 'padding:10px 10px 10px 10px',
				items : column1
			} ]
		};

	}

});
