var EditScheduleNewForm = function() {
	var formPanel = this.setup();
	var formPanelBottom = this.setupbottom();
	// var toolbar = this.initToolbar();
	var topPanel = new Ext.Panel({
		        bodyStyle : "margin-top:2%;margin-left: 30px;",
				layout : 'fit',
				iconCls : 'menu-cal-plan-view',
				id : 'EditScheduleNewFormWin',
				title : '新增安排',
				autoScroll : true,
				items : [formPanel, formPanelBottom]
			});

	return topPanel;
};
EditScheduleNewForm.prototype.setupbottom = function() {
	var formPanelBottom = new Ext.FormPanel({
		height : 30,
		frame : false,
		border : false,
		id : 'NewOutPlanSaveForm',
		layout : 'hbox',
		layoutConfig : {
			padding : '0',
			align : 'middle'
		},
		defaults : {
			xtype : 'label',
			margins : {
				top : 0,
				right : 4,
				bottom : 4,
				left : 10
			}
		},
		items : [{
			xtype : 'button',
			text : '保存',
			iconCls : 'btn-save',
			width : 70,
			style : 'margin-left:180px;font-size:50px;',
			handler : function() {
				var fp = Ext.getCmp('EditScheduleNewfrom');
				if (fp.getForm().isValid()) {
					var userform = Ext.getCmp('EditScheduleNewfrom');
					userform.getForm().submit({
								waitMsg : '正在提交用户信息',
								success : function(userform, o) {
									Ext.ux.Toast.msg('操作信息', '保存成功！')
									var contentPanel = Ext
											.getCmp('centerTabPanel');
									contentPanel
											.remove('EditScheduleNewFormWin');
									App.clickTopTab('LeaderCalendarView');
									if(Ext.Cmp('LeaderCalendarView.detailPanel'))
									Ext.Cmp('LeaderCalendarView.detailPanel').load({
						                url:__ctxPath+
					                    '/pages/leader/leaderCalendar.jsp',
					                nocache : true
					            });
								}
							});
				}
			}
		}, {
			xtype : 'button',
			text : '取消',
			iconCls : 'btn-reseted',
			width : 70,
			style : 'margin-left:200px;font-size:50px;',
			handler : function() {
            Ext.getCmp('centerTabPanel').remove('EditScheduleNewFormWin');
			}
		}]
	});
	return formPanelBottom;
};

EditScheduleNewForm.prototype.setup = function() {
 	var combox = new Ext.form.ComboBox({
				fieldLabel : '领导姓名',
				hiddenName : 'leaderActivities.appUser.userId',
				id : 'EditScheduleNewInfo.leaderActivities_userId',
				width : 494,
				xtype : 'combo',
				labelStyle: 'font-size:13px;width:60px;',
				style : 'fontSize:13px',
				editable : false,
				triggerAction : 'all',
				displayField : 'fullname',
				valueField : 'userId',
				allowBlank : false,
				value : curUserInfo.depId==100406?curUserInfo.userId:null,
				store : [[curUserInfo.userId, curUserInfo.fullname]]
			});

	var profileform = new Ext.FormPanel({
		url : __ctxPath + '/leaderActivities/saveSchedule.do',
		autoHeight : true,
		frame : false,
		border : false,
		layout : 'column',
		id : 'EditScheduleNewfrom',
		bodyStyle : 'padding-left:20px;padding-bottom:10px;',
		formId : 'EditScheduleNewfromId',
		items : [{
			xtype : 'panel',
			frame : false,
			autoWidth : true,
			autoHeight : true,
			border : true,
			layout : 'table',
			bodyStyle : "margin-top:5px;",
			items : [{
				xtype : "panel",
				id : 'EditScheduleNewInfo',
				width : 650,
				height : 320,
				title : "新增安排",
				iconCls : 'menu-cal-plan-view',
				layout : 'form',
				textAlign : 'center',
				defaultType : "textfield",
				defaults : {
					width : 650
				},
				labelWidth : 55,
				labelAlign : "right",
				hideLabels : false,
				items : [{
					name : 'leaderActivities.activeId',
					id : 'EditScheduleNewfrom.activeId',
					xtype : 'hidden'
				},{
							xtype : 'container',
							layout : 'form',
							style : 'padding-left:40px;margin-top:25px;',
							width : 650,
							defaults : {
								border : false
							},
							items : [combox]
						},{
					xtype : 'container',
					layout : 'column',
					height : 80,
					width : 900,
					style : 'padding-left:45px;margin-top:20px;',
					defaults : {
						border : false,
						style : 'fontSize:13px'
					},
					items : [{
								xtype : 'label',
								text : '简单描述:',
								style : 'fontSize:13px',
								width : 60
							}, {
								name : 'leaderActivities.activeName',
								id : 'EditScheduleNewfrom.activeName',
								allowBlank : false,
					            blankText : '描述不能为空!',
					            maxLength : 1000,
								xtype : 'textarea',
								width :495
							}]
				}, {
							xtype : 'container',
							layout : 'column',
						   style : 'padding-left:45px;margin-top:20px;',
							width : 900,
							defaults : {
								border : false,
								style : 'fontSize:13px'
							},
							items : [
				                    {
										xtype : 'label',
									    style : 'fontSize:13px',
										text : '开始日期:',
										width : 60
									}, {
							name : 'leaderActivities.startTime',
							xtype : 'datetimefield',
							format : 'Y-m-d H:i',
							editable:true,
							allowBlank : false,
							value: new Date(),
							width : 495,
							id : 'EditScheduleNewInfo.startTime',
							listeners : {
								blur : function() {
									getnumber()
								}
							}
						}]
						}, {
					xtype : 'container',
					id : 'leaderActivities.signDep',
					layout : 'column',
					style : 'padding-left:45px;margin-top:20px;',
					height : 30,
					width : 900,
					defaults : {
						border : false,
						style : 'fontSize:13px'
					},
					items : [{
								xtype : 'label',
								text : '持续(天):',
							    style : 'fontSize:13px',
								width : 60
							}, {
								name : 'leaderActivities.timeNumber',
								id : 'EditScheduleNewfrom.timeNumber',
								allowBlank : false,
								allowDecimals:false,
								minValue:1,
								value:1,
								xtype : 'numberfield',
								width : 422
							}, {
								id : 'EditScheduleNewfrom.timeType',
								hiddenName : 'leaderActivities.timeType',
								xtype : 'combo',
								allowBlank : false,
								editable : false,
								mode : 'local',
								triggerAction : 'all',
								value : '0',
								width : 80,
								store : [['0', '几天'], ['1', '几小时'], ['2', '时刻']]
							}]
				}]
			}]
		}]
	});
		Ext.Ajax.request({
				url : __ctxPath + '/system/getUserByRoleIdAppUser.do?roleId='+roleMap.get('diaryLeaderRoleId'),
				success : function(r, o) {
					var data = eval("(" + r.responseText + ")");
					Ext.getCmp('EditScheduleNewInfo.leaderActivities_userId')
							.getStore().loadData(data);
				}
			});
	return profileform;

};