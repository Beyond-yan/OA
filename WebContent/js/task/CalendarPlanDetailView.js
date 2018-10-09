/**
 * 显示计划任务中的详细信息
 * @param {} planId
 */
var CalendarPlanDetailView=function(planId,callback){
	this.planId=planId;
	var detailPanell = new Ext.Panel({
				autoHeight : true,
				autoWidth:true,
				border : false,
				autoLoad : {
					url : __ctxPath
							+ '/pages/task/calendarplandetail.jsp?planId=' + planId
				}
	});	
	
	var formPanel = new Ext.FormPanel({
		url : __ctxPath + '/task/saveCalendarPlan.do',
		layout : 'form',
		id : 'CalendarPlanFinishFormFirst',
		frame : true,		
		defaults : {
			anchor : '98%,98%'
		},
		items : [{
					name : 'calendarPlan.planId',
					id : 'planId',
					xtype : 'hidden',
					value : this.planId == null ? '' : this.planId
				},
				{
					xtype:'textarea',
					fieldLabel:'备注',
					allowBlank:false,
					name:'calendarPlan.feedback',
					id:'feedbackTextArea'
				}]
	});
	
	var window = new Ext.Window({
				title:'任务信息',
				iconCls:'menu-cal-plan',
				id : 'CalendarPlanDetailView',
				width : 580,
				height : 400,
				modal : true,
				autoScroll:true,
				layout : 'form',
				buttonAlign : 'center',
				items : [detailPanell,formPanel],
				buttons : [/*{
							text : '关闭',
							iconCls : 'btn-cancel',
							handler : function() {
								window.close();
							}
						}*/]
	});
	
	$request({
		url:__ctxPath+'/task/getCalendarPlan.do?planId=' + planId,
		method:'post',
		success:function(resp,options){
			var result = Ext.util.JSON.decode(resp.responseText);
			var plan=result.data;
			if(plan.status=='0'){//尚未完成 
				window.addButton(new Ext.Button({
							text : '完成任务',
							iconCls : 'btn-save',
							handler : function() {
								//new CalendarPlanFinishForm(planId);
								var fp = Ext.getCmp('CalendarPlanFinishFormFirst');
								if (fp.getForm().isValid()) {
									fp.getForm().submit({
										method : 'post',
										params:{'calendarPlan.status':1},
										waitMsg : '正在提交数据...',
										success : function(fp, action) {
											Ext.ux.Toast.msg('操作信息', '成功保存信息！');
											if (callback != null) {
												callback
														.call(this);
											}
											window.close();
										},
										failure : function(fp, action) {
											Ext.MessageBox.show({
														title : '操作信息',
														msg : '信息保存出错，请联系管理员！',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
											window.close();
										}
									});
								}								
							}
				}));
				//window.doLayout();
			}		
			else{		
				var feedback=plan.feedback;
				Ext.getCmp('feedbackTextArea').setValue(feedback);
				Ext.getCmp('feedbackTextArea').disable();
			}
			window.addButton(new Ext.Button({
				text : '关闭',
				iconCls : 'btn-cancel',
				handler : function() {
					window.close();
				}
			}));
			window.addButton(new Ext.Button({
				text : '删除任务',
				iconCls : 'btn-del',
				handler : function() {
					Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
								if (btn == 'yes') {
									Ext.Ajax.request({
												url : __ctxPath
														+ '/task/multiDelCalendarPlan.do',
												params : {
													ids :planId
												},
												method : 'post',
												success : function() {
													Ext.ux.Toast.msg('操作信息', '成功删除信息！');
													if (callback != null) {
														callback
																.call(this);
													}
													window.close();
												},	
												failure : function(fp, action) {
												Ext.MessageBox.show({
														title : '操作信息',
														msg : '信息保存出错，请联系管理员！',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
											window.close();
										}
											});
								}
							});
				}
	}));
			window.doLayout();
			window.show();
		},
		failure:function(response,options){
			window.show();
		}
	});
};