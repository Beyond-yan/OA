var EditScheduleFormJsp = function(activeId, fullname,userId, CurrentUserId,callback,
		Q_startTime_D_GE, weekType) {
	this.userId=userId;
	this.CurrentUserId=CurrentUserId;
	var saveHidden = false;
	if(this.CurrentUserId!=this.userId && this.CurrentUserId !=1)
		saveHidden = true;
	this.activeId = activeId;
	var fp = this.setup();
	var window = new Ext.Window({
				id : 'EditScheduleFormJspWin',
				iconCls : 'menu-cal-plan-view',
				title : fullname +'的日程',
				border : false,
				width : 500,
				height : 300,
				maximizable : true,
				modal : true,
				layout : 'fit',
				buttonAlign : 'center',
				items : [fp],
				buttons : [{
					text : '保存',
					id:'save',
					hidden: saveHidden,
					iconCls : 'btn-save',
					handler : function() {
						var fp = Ext.getCmp('EditScheduleFormJsp');
						if (fp.getForm().isValid()) {
							fp.getForm().submit({
								method : 'post',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存信息！');
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
						Ext.getCmp('EditScheduleFormJspWin').close();
					}
				}]
			});
	window.show();
};

EditScheduleFormJsp.prototype.setup = function() {
	var formPanel = new Ext.FormPanel({
		url : __ctxPath + '/leaderActivities/saveSchedule.do',
		layout : 'form',
		id : 'EditScheduleFormJsp',
		bodyStyle : 'padding:5px;',
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
				},{
					fieldLabel : '领导姓名',
					xtype : 'textfield',
					readOnly :true,
					id:'fullname',
					allowBlank : false
				},{
					fieldLabel : '简单描述',
					xtype : 'textarea',
					name : 'leaderActivities.activeName',
					allowBlank : false,
					blankText : '描述不能为空!',
					maxLength : 1000,
					id : 'activeName'
				}, {
					fieldLabel : '开始日期',
					name : 'leaderActivities.startTime',
					xtype : 'datetimefield',
					format : 'Y-m-d H:i',
					allowBlank : false,
					id : 'startTime'
				},  {
					xtype : 'container',
					id : 'leaderActivities.signDep',
					layout : 'column',
					style : 'padding-left:0px;margin-top:10px;',
					height : 30,
					width : 560,
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
								allowBlank : false,
								allowDecimals:false,
								minValue:1,
								id : 'timeNumber',
								xtype : 'numberfield',
								width : 330
							}, {
								id : 'timeType',
								hiddenName : 'leaderActivities.timeType',
								xtype : 'combo',
								editable : false,
								mode : 'local',
								triggerAction : 'all',
								value : '0',
								width : 70,
								store : [['0', '几天'], ['1', '几小时'], ['2', '时刻']]
							}]
				}]
	});
	if (this.activeId != null && this.activeId != 'undefined') {
		formPanel.getForm().load({
			deferredRender : false,
			url : __ctxPath + '/leaderActivities/getSchedule.do?activeId='
					+ this.activeId,
			waitMsg : '正在载入数据...',
			success : function(form, action) {
				 var type=Ext.getCmp('timeType').getValue();
				 if(type==2){
					 Ext.getCmp('timeNumber').show();
				 }
				var result = action.result.data;
				var data = eval("(" + action.response.responseText + ")").data;
				Ext.getCmp('fullname')
				.setValue(data.appUser.fullname);
				Ext.getCmp('startTime').setValue(new Date(data.startTime));
			},
			failure : function(form, action) {
				Ext.ux.Toast.msg('编辑', '载入失败');
			}
		});
	}
	return formPanel;
};