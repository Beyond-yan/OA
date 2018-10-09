var EditScheduleForm = function(activeId, callback) {
	this.activeId = activeId;
	var fp = this.setup();
	var window = new Ext.Window({
				id : 'EditScheduleFormWin',
				iconCls : 'menu-cal-plan-view',
				title : '日程详细信息',
				border : false,
				width :530,
				height : 300,
				maximizable : true,
				modal : true,
				layout : 'fit',
				buttonAlign : 'center',
				items : [fp],
				buttons : [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						var fp = Ext.getCmp('EditScheduleForm');
						if (fp.getForm().isValid()) {
/*							if (Ext.getCmp('timeType').getValue() != 2)
								Ext.getCmp('timeNumber').setValue(0);*/
							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
									var ScheduleGrid = Ext
											.getCmp('ScheduleGrid');
									var TodayScheduleGrid = Ext
											.getCmp('TodayScheduleGrid');
									if (ScheduleGrid != null) {
										ScheduleGrid.getStore().reload();
									}
									if (TodayScheduleGrid != null) {
										TodayScheduleGrid.getStore().reload();
									}
									if (callback != null) {
										callback.call(this);
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
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						Ext.getCmp('EditScheduleFormWin').close();
					}
				}]
			});
	window.show();
};

EditScheduleForm.prototype.setup = function() {
	var combox = new Ext.form.ComboBox({
				fieldLabel : '领导姓名',
				hiddenName : 'leaderActivities.appUser.userId',
				id : 'leaderActivities_userId',
				xtype : 'combo',
				editable : false,
				triggerAction : 'all',
				displayField : 'fullname',
				valueField : 'userId',
				allowBlank : false,
				value : curUserInfo.depId==100406?curUserInfo.userId:null,
				store : [[curUserInfo.userId, curUserInfo.fullname]]
			});

	var formPanel = new Ext.FormPanel({
		url : __ctxPath + '/leaderActivities/saveSchedule.do',
		layout : 'form',
		id : 'EditScheduleForm',
		bodyStyle : 'padding:10px;',
		labelWidth: 65, 
		frame : false,
		defaults : {
			width : 400,
			anchor : '98%,98%'
		},
		formId : 'EditScheduleFormId',
		defaultType : 'textfield',
		items : [{
					name : 'leaderActivities.activeId',
					id : 'activeId',
					xtype : 'hidden'
				}, combox, {
					xtype : 'container',
					layout : 'column',
					height : 80,
					width : 450,
					style : 'padding:5px 0px 10px 0px;',
					defaults : {
						border : false
					},
					items : [{
								xtype : 'label',
								text : '简单描述:',
								width : 70
							}, {
								name : 'leaderActivities.activeName',
								id : 'activeName',
								allowBlank : false,
					            blankText : '描述不能为空!',
					            maxLength : 1000,
								xtype : 'textarea',
								width : 415
							}]
				},{
					fieldLabel : '开始日期',
					name : 'leaderActivities.startTime',
					labelWidth:70,
					xtype : 'datetimefield',
					value: new Date(),
					format : 'Y-m-d H:i',
					allowBlank : false,
					id : 'startTime'
				}, {
					xtype : 'container',
					id : 'leaderActivities.signDep',
					layout : 'column',
					style : 'padding-left:0px;margin-top:10px;',
					height : 30,
					width : 450,
					defaults : {
						border : false
					},
					items : [{
								xtype : 'label',
								text : '持续(天):',
								style : 'padding:0px 0px 0px 0px;',
								width : 70
							}, {
								name : 'leaderActivities.timeNumber',
								id : 'timeNumber',
								allowBlank : false,
								allowDecimals:false,
								xtype : 'numberfield',
								width : 342
							}, {
								id : 'timeType',
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
	});
	Ext.Ajax.request({
				url : __ctxPath + '/system/getUserByRoleIdAppUser.do?roleId='+roleMap.get('diaryLeaderRoleId'),
				success : function(r, o) {
					var data = eval("(" + r.responseText + ")");
					Ext.getCmp('leaderActivities_userId').getStore()
							.loadData(data);
				}
			});
	if (this.activeId != null && this.activeId != 'undefined') {
		formPanel.getForm().load({
			deferredRender : false,
			url : __ctxPath + '/leaderActivities/getSchedule.do?activeId='
					+ this.activeId,
			waitMsg : '正在载入数据...',
			success : function(form, action) {
				var type = Ext.getCmp('timeType').getValue();
				if (type == 2) {
					Ext.getCmp('timeNumber').show();
				}
				var result = action.result.data;
				var data = eval("(" + action.response.responseText + ")").data;
				Ext.getCmp('leaderActivities_userId')
						.setValue(data.appUser.userId);
				Ext.getCmp('startTime').setValue(new Date(data.startTime));
			},
			failure : function(form, action) {
				Ext.ux.Toast.msg('编辑', '载入失败');
			}
		});
	}
	return formPanel;
};
