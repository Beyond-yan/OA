CarApplyForm = Ext.extend(Ext.Panel, {
	// 构造函数 - 开始
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		
		this.initUIComponents();
		CarApplyForm.superclass.constructor.call(this, {
			id : 'CarApplyFormWin',
			layout : 'form',
			items : [this.formPanel],
			modal : true,
			height : 550,
			width : 800,
			maximizable : true,
			title : '录入车辆申请表单',
			buttonAlign : 'center',
			buttons : [
			           #set ($count=0)
						#foreach ($v in $nextTrans)
						#if($count>0),
						#end
						new Ext.Button({
						   iconCls:'btn-transition',
						   text:'转至[${v.destination}]',
						   handler:this.save.createCallback(this,'${v.name}','${v.source}','${v.destination}')
						})
						#set ($count=$count+1)
					#end
					]
		});
	},// 构造函数 - 结束
	
	// 初始化界面控件 - 开始
	initUIComponents : function() {
		var applyId = ${applyId};
		alert(applyId);
		this.applyId=applyId;
		this.formPanel = new Ext.FormPanel(
				{	
					layout : 'form',
					id : 'CarApplyForm',
					frame : false,
					border : true,
					defaults : {
						width : 400,
						anchor : '98%,98%'
					},
					bodyStyle : 'padding-top:5px;padding-left:5px;',
					formId : 'CarApplyFormId',
					defaultType : 'textfield',
					items : [
							{
								name : 'carApply.applyId',
								id : 'applyId',
								xtype : 'hidden',
								value : this.applyId == null ? ''
										: this.applyId
							},{
								name : 'carApply.userId',
								id : 'userId',
								xtype : 'hidden'
							},
							{
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'depContainer',
								layout : 'column',
								items : [
										{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '用车部门:',
											width : 105
										},
										{
											xtype : 'textfield',
											name : 'carApply.department',
											id : 'department',
											value : curUserInfo.depName,
											allowBlank : false,
											editable : false,
											readOnly : true,
											width : 320
										},
										{
											xtype : 'button',
											iconCls : 'btn-dep-sel',
											text : '选择部门',
											handler : function() {
												DepSelector
														.getView(
																function(
																		id,
																		name) {
																	Ext
																			.getCmp(
																					'department')
																			.setValue(
																					name);
																})
														.show();
											}
										},
										{
											xtype : 'button',
											text : '清除记录',
											iconCls : 'reset',
											handler : function() {
												Ext
														.getCmp(
																'department')
														.setValue(
																'');
											}
										} ]
							},
							{
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								layout : 'column',
								items : [
										{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '用车人:',
											width : 105
										},
										{
											xtype : 'textfield',
											name : 'carApply.userFullname',
											id : 'userFullname',
											value : curUserInfo.fullname,
											allowBlank : false,
											editable : false,
											readOnly : true,
											width : 320
										},
										{
											xtype : 'button',
											iconCls : 'btn-user-sel',
											text : '选择人员',
											handler : function() {
												UserAllSelector
														.getView(
																function(
																		id,
																		name) {
																	Ext
																			.getCmp(
																					'userFullname')
																			.setValue(
																					name);
																},
																true)
														.show();
											}
										},
										{
											xtype : 'button',
											text : '清除记录',
											iconCls : 'reset',
											handler : function() {
												Ext
														.getCmp(
																'userFullname')
														.setValue(
																'');
											}
										} ]
							},
							{
								xtype : 'container',
								layout : 'column',
								style : 'padding-left:0px;margin-bottom:4px;',
								items : [
										{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '申请人:',
											width : 105
										},
										{
											xtype : 'textfield',
											name : 'carApply.proposer',
											id : 'proposer',
											editable : false,
											allowBlank : false,
											readOnly : true,
											value : curUserInfo.fullname,
											width : 320
										},
										{
											xtype : 'button',
											iconCls : 'btn-user-sel',
											text : '选择人员',
											handler : function() {
												UserSelector
														.getView(
																function(
																		id,
																		name) {
																	Ext
																			.getCmp(
																					'proposer')
																			.setValue(
																					name);
																	Ext
																			.getCmp(
																					'userId')
																			.setValue(
																					id);
																},
																true,
																true)
														.show();
											}
										},
										{
											xtype : 'button',
											text : '清除记录',
											iconCls : 'reset',
											handler : function() {
												Ext
														.getCmp(
																'proposer')
														.setValue(
																'');
												Ext
												.getCmp(
														'userId')
												.setValue(
														'');
											}
										} ]
							},
							{
								fieldLabel : '是否需要司机',
								hiddenName : 'carApply.ishavecardriver',
								id : 'ishavecardriver',
								xtype : 'combo',
								mode : 'local',
								allowBlank : false,
								editable : false,
								triggerAction : 'all',
								value : '1',
								store : [ [ '1', '需要' ],
										[ '2', '不需要' ] ]
										
							},
							{
								fieldLabel : '是否长期有效',
								hiddenName : 'carApply.iseffective',
								id : 'iseffective',
								xtype : 'combo',
								mode : 'local',
								allowBlank : false,
								editable : false,
								triggerAction : 'all',
								value : '1',
								store : [ [ '1', '否' ],
										[ '2', '是' ] ],
								listeners : {
											scope : this,
											'select' : function(combo, record, index) {
												if(index=='0'){
//													 alert(index);
													 Ext.getCmp('onDutyTime2').hide();
													 Ext.getCmp('offDutyTime2').hide();
													
													 }
												if(index=='1'){
//													 alert(index);
													 Ext.getCmp('onDutyTime2').show();
													 Ext.getCmp('offDutyTime2').show();
													
													 }	

											}													}
							}, {
								fieldLabel : '原因',
								name : 'carApply.reason',
								id : 'reason',
								allowBlank : false,
								xtype : 'textarea'
							}, {
								fieldLabel : '开始日期',
								name : 'carApply.startTime',
								id : 'startTime',
								xtype : 'datetimefield',
								format : 'Y-m-d H:i:s',
								allowBlank : true,
								editable : false
							}
							, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'onDutyTime2',
								layout : 'column',
								items:[{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '开始时间',
									width : 105
								},
								{
									xtype : 'datetimefield',
									name : 'carApply.onDutyTime',
									id : 'onDutyTime',

									format : 'H:i',
//									
									width : 400
								}]// G标示为24时计时法]
								
							}, {
								fieldLabel : '截止日期',
								name : 'carApply.endTime',
								id : 'endTime',
								allowBlank : true,
								xtype : 'datetimefield',
								format : 'Y-m-d H:i:s'
							}, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'offDutyTime2',
								layout : 'column',
								items:[{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '截止时间',
									width : 105
								},
								{
									xtype : 'datetimefield',
									name : 'carApply.offDutyTime',
									id : 'offDutyTime',
									format : 'H:i',
									width : 400
								}]// G标示为24时计时法]
//								
							}
							
							, {
								fieldLabel : '里程(公里)',
								name : 'carApply.mileage',
								id : 'mileage',
								xtype : 'numberfield'
							}, {
								fieldLabel : '油耗(升)',
								name : 'carApply.oilUse',
								id : 'oilUse',
								xtype : 'numberfield'
							}, {
								fieldLabel : '备注',
								name : 'carApply.notes',
								id : 'notes',
								xtype : 'textarea'
							}

					]
				});// end of the formPanel

		if (this.applyId != null && this.applyId != 'undefined') {
//			var applyRepId=null;
		
			this.formPanel
					.getForm()
					.load(
							{
								deferredRender : false,
								url : __ctxPath
										+ '/admin/getCarApply.do?applyRepId='
										+ applyId,
								waitMsg : '正在载入数据...',
								success : function(form, action) {
								var	com2 = action.result.data.iseffective;
								if(com2=='1'){
									  Ext.getCmp('onDutyTime2').hide();
									  Ext.getCmp('offDutyTime2').hide();
								}
							
									Ext
											.getCmp('carNo')
											.setValue(
													action.result.data.car.carNo);
									Ext
											.getCmp('carId')
											.setValue(
													action.result.data.car.carId);
									Ext
											.getCmp('applyDate')
											.setValue(
													new Date(
															getDateFromFormat(
																	action.result.data.applyDate,
																	"yyyy-MM-dd")));
									Ext
											.getCmp('startTime')
											.setValue(
													new Date(
															getDateFromFormat(
																	action.result.data.startTime,
																	"yyyy-MM-dd")));
									var endTime = action.result.data.endTime;
									if (endTime != null
											&& endTime != '') {
										Ext
												.getCmp(
														'endTime')
												.setValue(
														new Date(
																getDateFromFormat(
																		endTime,
																		"yyyy-MM-dd")));
									}
								},
								failure : function(form, action) {
									Ext.ux.Toast.msg('编辑',
											'载入失败');
								}
							});
		}
		;// end of the load formPanel
		
	},// 初始化界面控件 - 结束
	
	// 保存并启动申请流程 - 开始
	save : function(panel,signalName,taskName,destName) {
		
		var taskId=panel.taskId;
        var userId=${userId};
        var flowAssignId=${flowAssignId};
		var startTime = Ext.util.Format.date(Ext.getCmp("startTime").getValue(),'Y-m-d');
		var onDutyTime = Ext.getCmp("onDutyTime").getValue();
		var startDateTimeString = startTime.toString() + " "+onDutyTime.toString()+":00";
		var d1 = startDateTimeString.replace(/\-/g,'\/');
		var stratDate =new Date(d1);
		
		var endTime = Ext.util.Format.date(Ext.getCmp("endTime").getValue(),'Y-m-d');
		var offDutyTime = Ext.getCmp("offDutyTime").getValue();
		var endDateString = endTime.toString() + " "+offDutyTime.toString()+":00";
		var d2 = endDateString.replace(/\-/g,'\/');
		var endDate =new Date(d2);
	
		if(stratDate>=endDate){
			Ext.Msg.alert("注意", "开始时间应小于截止时间！");
			return;
		}
		
			var fp = Ext.getCmp('CarApplyForm');
			
			if (fp.getForm().isValid()) {
				fp.getForm().submit(
								{
									url : __ctxPath + '/admin/saveCarApply.do', 
									method : 'post',
									waitMsg : '正在提交数据...',
									success : function(fp,action) {
									     var rollFileObj = Ext.decode(action.response.responseText);
									     var applyId = rollFileObj.applyId;
							
									     var department=Ext.getCmp('department').getValue();
									     var department=Ext.getCmp('department').getValue();
									     var userFullname=Ext.getCmp('userFullname').getValue();
									     var proposer=Ext.getCmp('proposer').getValue();
									     var reason=Ext.getCmp('reason').getValue();
									     var startDate=Ext.getCmp('startTime').getValue();
									 	 var startTime = Ext.util.Format.date(startDate, 'Y-m-d H:i:s');
									     var onDutyTime=Ext.getCmp('onDutyTime').getValue();
									     var offDutyTime=Ext.getCmp('offDutyTime').getValue();
									     var endDate=Ext.getCmp('endTime').getValue();
									     var endTime = Ext.util.Format.date(endDate, 'Y-m-d H:i:s');
									     var mileage=Ext.getCmp('mileage').getValue();
									     var oilUse=Ext.getCmp('oilUse').getValue();
									     var notes=Ext.getCmp('notes').getValue();
										Ext.ux.Toast.msg('操作信息','成功保存信息！');
										if (fp != null) {
										
											Ext.Ajax.request({
														url : __ctxPath + '/flow/nextProcessActivity.do',
														params:{
															taskId:taskId,signalName:signalName,activityName:taskName,
												            destName:destName,
															department:department,
															proposer:proposer,
															userFullname:userFullname,
															reason:reason,
															startTime:startTime,
															onDutyTime:onDutyTime,
															endTime:endTime,
															offDutyTime:offDutyTime,
															mileage:mileage,
															oilUse:oilUse,
															notes:notes,
															userId:userId,
															flowAssignId:flowAssignId,
															applyId:applyId},
															method : 'POST',
															async : false,
															success : function(response, opts){
																Ext.ux.Toast.msg('操作信息','重新启动车辆流程申请');
																var tabPanel = Ext.getCmp('centerTabPanel');
																
																tabPanel.remove(Ext.getCmp('ProcessRunStart'+taskId));
															}
													
												});
										}
									},
									failure : function(fp,action) {
										var resultResp = Ext.util.JSON
												.decode(action.response.responseText);
										if (resultResp.result == 1) {
											Ext.MessageBox
													.show( {
														title : '操作信息',
														msg : '开始时间不能大于结束时间！',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
										} else {
											Ext.MessageBox
													.show( {
														title : '操作信息',
														msg : '信息保存出错，请联系管理员！',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
										}

										Ext
												.getCmp(
														'CarApplyFormWin')
												.close();
									}
								});
			}
		}// 保存并启动申请流程 - 结束
})