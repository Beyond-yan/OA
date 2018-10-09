/**
 * @createtime 2010-10-9 PM
 * @class ConferenceEditView
 * @extends Ext.Window
 * @description 会议信息管理
 * @company 捷达世软件
 * @author YHZ
 */
ConferenceEditView = Ext.extend(Ext.Window, {
	// store
	store : null,
	gridPanel : null,
	// 内嵌FormPanel
	formPanel : null,
	// 会议基本信息
	// basePanel : null,
	// 会议内容
	contextPanel : null,
	// 参加人员
	jonerPanel : null,	
	buttons : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ConferenceEditView.superclass.constructor.call(this, {
					id : 'ConferenceEditViewWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					maximizable : true,
					width : 730,
					height : 550,
					autoScroll : false,
					title : '会议申请信息',
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var today =  new Date();
		var systemDate = document.getElementById('systemDate').value;
		today = Date.parseDate(systemDate,'Y-m-d h:i:s');
		// 会议信息设置
		this.basePanel = new Ext.form.FieldSet({
			id : 'ConferenceEditView.basePanel',
			title : '会议信息',
			layout : 'form',
			border : true,
			items : [{
				layout : 'column',
				columnWidth : 1,
				border : false,
				defaults : {
					border : false,
					width : 300
				},
				items : [{
					layout : 'form',
					columnWidth : .5,
					defaults : {
						width : 200
					},
					items : [{
								xtype : 'hidden',
								name : 'conference.confId',
								value : this.confId != null ? this.confId : ''
							},{
								name:'conference.contUser.userId',
								xtype : 'hidden'
							},
							{
								xtype : 'textfield',
								id : 'ConferenceEditView.confTopic',
								name : 'conference.confTopic',
								fieldLabel : '会议主题',
								allowBlank : false,
								blankText : '会议标题不能为空！',
								maxLength : 128,
								maxLengthText : '会议标题不能超过128个字符长度！'
							}, {
								xtype : 'hidden',
								name : 'conference.typeId'
							},{
								xtype : 'textfield',
								name : 'conference.contUser.fullname',
								id : 'ConferenceEditView.contUser',
								fieldLabel : '联系人',
								readOnly : true,
								allowBlank : false,
								maxLength : 256,
								maxLengthText : '数据不能超过256字符！',
								editable : false
							}, {
								xtype : 'hidden',
								name : 'conference.depId',
								value : this.confId != null ? this.confId : ''
							},
							{
								xtype : 'hidden',
								id : 'ConferenceEditView.applyStatus',
								name : 'conference.applyStatus'
							},{
								xtype : 'textfield',
								id : 'ConferenceEditView.depName',
								name : 'conference.depName',
								fieldLabel : '申请人部门',
								allowBlank : false,
								blankText : '申请人部门不能为空！',
								maxLength : 128,
								maxLengthText : '申请人部门信息不能超过128个字符长度！',
								editable : false,
								readOnly : true
							}/*, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConferenceEditView.startDateforLong',
								layout : 'column',
								//hidden : true,
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '会议日期:',//长期会议的开始日期
											width : 105
										}, {
											id : 'ConferenceEditView.tempDate',
											style:'padding-left:110px',
											xtype : 'datetimefield',
											format : 'Y-m-d',
											width : 200,
											editable : false,
											value : this.startDate != null ? this.startDate : null,
											name : 'tempDate',
											allowBlank : false,
											listeners:{select:function(){
												//申请日期不能小于当天
												var startDate = Ext.getCmp('ConferenceEditView.tempDate').getValue();
												
											}
										}
									}]
								}*/]
				}, {
					layout : 'form',
					columnWidth : .5,
					defaults : {
						width : 200
					},
					items : [{
								xtype : 'hidden',
								id : 'ConferenceEditView.roomName',
								name : 'conference.roomName'
							},{
								xtype : 'combo',
								id : 'ConferenceEditView.roomId',
								hiddenName : 'conference.roomId',
								fieldLabel : '会议室名称',
								valueField : 'roomId',
								displayField : 'roomName',
								mode : 'local',
								editable : false,
								emptyText : '--请选择会议室--',
								triggerAction : 'all',
								width : 200,
								forceSelection : true,
								allowBlank : false,
								blankText : '请选择会议室！',
								store : new Ext.data.SimpleStore({
									url : __ctxPath
											+ '/admin/getBoardrooConference.do',
									autoLoad : true,
									fields : ['roomId', 'roomName'],
									listeners : {
										scope : this,
										load : function() {
											var cmp = Ext.getCmp('ConferenceEditView.roomId');
											if (cmp.hiddenField.value)
												cmp.setValue(cmp.hiddenField.value);
											/*this.getCmpByName('conference.roomName').setValue(cmp.dom.value);*/
										}
									}
								}),
								listeners : {
									select : function(cbo, record, index) {										
										Ext.getCmp('ConferenceEditView.roomName')
												.setValue(cbo.getRawValue());
									}
								}
					}, {
						xtype : 'textfield',
						id : 'ConferenceEditView.contactTel',
						name : 'conference.contactTel',
						fieldLabel : '联系人电话',						
						maxLength : 128,
						maxLengthText : '申请人电话信息不能超过128个字符长度！'
					}/*, {
						xtype : 'container',
						style : 'padding-left:0px;margin-bottom:4px;',
						id : 'ConferenceEditView.dateStartTime',
						layout : 'column',
						width : 350,
//									anchor : '98%,98%',
						items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '开始时间:',//长期会议的开始时间
									width : 105
								}, {
									id : 'ConferenceEditView.tempStartTime',
									xtype : 'timefield',
									format : 'H:i',
									editable : false,
									minValue: '9:00',
									maxValue: '17:30',
									name : 'tempStartTime',
									width : 200,
									style:'padding-left:140px',
									value : this.tempStartTime != null ? this.tempStartTime : null,
									increment:15,
									allowBlank : false
							}]
					}*//*, {
						xtype : 'container',
						style : 'padding-left:0px;margin-bottom:4px;',
						id : 'ConferenceEditView.dateEndTime',
						layout : 'column',
						width : 350,
//									anchor : '98%,98%',
						items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '结束时间:',//长期会议的开始时间
									width : 105
								}, {
									id : 'ConferenceEditView.tempEndTime',
									xtype : 'timefield',
									format : 'H:i',
									editable : false,
									name : 'tempEndTime',
									style:'padding-left:140px',
									width : 200,
									minValue: '9:00',
									maxValue: '17:30',
									value : this.tempEndTime != null ? this.tempEndTime : null,
									increment:15,
									allowBlank : false
							}]
					}]
				}*/, {
						xtype : 'container',
						style : 'padding-left:0px;margin-bottom:4px;',
						id : 'ConferenceEditView.dateStartTime',
						layout : 'column',
						width : 350,
//									anchor : '98%,98%',
						items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '开始时间:',//长期会议的开始时间
									width : 105
								}, {
									id : 'ConferenceEditView.tempStartTime',
									xtype : 'datetimefield',
									format : 'Y-m-d H:i',
									editable : false,
									width : 200,
									minValue: today.format('Y-m-d'),
									name : 'tempStartTime',
//												style:'padding-left:30px',
									value : this.tempStartTime != null ? this.tempStartTime : null,
									increment:15,
									allowBlank : false
							}]
					}, {
						xtype : 'container',
						style : 'padding-left:0px;margin-bottom:4px;',
						id : 'ConferenceEditView.dateEndTime',
						layout : 'column',
						width : 350,
//									anchor : '98%,98%',
						items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '结束时间:',//长期会议的开始时间
									width : 105
								}, {
									id : 'ConferenceEditView.tempEndTime',
									xtype : 'datetimefield',
									format : 'Y-m-d H:i',
									width : 200,
									minValue: today.format('Y-m-d'),
									editable : false,
									name : 'tempEndTime',
//												style:'padding-left:30px',
									value : this.tempEndTime != null ? this.tempEndTime : null,
									increment:15,
									allowBlank : false
							}]
					}]
				}, {
					columnWidth : 1,
					layout : 'form',
					height : 100,
					width : 550,
					border : false,
					items : [{
								name : 'conference.confContent',
								id : 'ConferenceEditView.confContent',
								xtype : 'htmleditor',
								height : 120,
								width : 550,
								fieldLabel : '准备事项',
								allowBlank : false,
								maxLength : 4000,
								maxLengthText : '会议内容文本不能超过4000个字符长度！'
							}]
				}]
			}]
		}); // end of this basePanel

		// 会议参加人员jonerPanel
		this.jonerPanel = new Ext.form.FieldSet({
					id : 'ConferenceEditView.jonerPanel',
					title : '审核信息',
					layout : 'form',
					border : true,
					items : [{
							layout : 'column',
							columnWidth : 1,
							border : false,
							defaults : {
								border : false,
								width : 400
							},
							items : [{
								layout : 'form',
								columnWidth : .5,
								defaults : {
									width : 400
								},
								items : [{
											fieldLabel : '会议室负责人',
											xtype : 'textfield',
											name : 'conference.attendConfine',
											id : 'ConferenceEditView.attendConfine',
											allowBlank : false,
											width : 150,
											blankText : '请填写联系人！'
										}/*{
											xtype : 'hidden',
											id : 'ConferenceEditView.contactUserName',
											name : 'ConferenceEditView.contactUserName',
											value : this.userName != null ? this.userName : ''
										}, {
											xtype : 'combo',
											fieldLabel : '会议室负责人',
											hiddenName : 'conference.roomContactUser.userId',
											id : 'ConferenceEditView.roomContactUser',
											maxLength : 128,
											width : 150,
											valueField : 'roomContactUser',
											displayField : 'contactUserName',
											mode : 'local',
											editable : false,
											emptyText : '--请选择会议室负责人--',
											triggerAction : 'all',
											width : 150,
											forceSelection : true,
											blankText : '请选择会议室负责人！',
											store : new Ext.data.SimpleStore({
												url : __ctxPath
														+ '/system/getByDepIdAppUser.do?depId='+1249939,
												autoLoad : true,
												fields : ['roomContactUser', 'contactUserName'],
												listeners : {
													scope : this,
													load : function() {
														var cmp = Ext.getCmp('ConferenceEditView.roomContactUser');
														if (cmp.hiddenField.value)
															cmp.setValue(cmp.hiddenField.value);
														this.getCmpByName('conference.roomName').setValue(cmp.dom.value);
													}
												}
											}),
											listeners : {
												select : function(cbo, record, index) {
													Ext.getCmp('ConferenceEditView.contactUserName')
															.setValue(cbo.getRawValue());
												}
											}
										}*/]								 
								}, {
									layout : 'form',
									columnWidth : .5,
									defaults : {
										width : 400
									},
									items : [{
												xtype : 'textfield',
												id : 'ConferenceEditView.roomContactTel',
												name : 'conference.roomContactTel',
												fieldLabel : '负责人联系电话',
												width : 130,
												blankText : '请输入正确类型的联系电话！'
											}]
							}]
							}, 
							{
								xtype : 'container',
								columnWidth : 1,
								layout : 'form',
								height : 100,
								border : false,
								items : [{
											xtype : 'label',
											text : '审核意见'
										}, {
											id:'ConferenceEditView.checkReason',
											name : 'conference.checkReason',
											xtype : 'textarea',
											readOnly : false,
											maxLength : 256,
											maxLengthText : '数据不能超过256字符！',
											width : 550,
											height : 100,
											margins : '5px 60px 5px 60px '
									}]
							}

					]
				}); // end of this jonerPanel

		this.formPanel = new Ext.FormPanel({
					id : 'ConferenceEditViewPanel',
					autoScroll : true,
					layout : 'form',
					region : 'center',
					border : false,
					defaults : {
						readOnly : true

					},
					items : [this.basePanel,
							{
						layout : 'column',
						border : false,
						columnWidth : 1,
						defaults : {
							border : false
						},
						items : [{
									columnWidth : 1,									
									layout : 'form',
									items : [this.jonerPanel]
								}]
					}]
				});// end of this formPanel

		// 数据加载
		if (this.confId != null && this.confId != ''
				&& this.confId != 'undenfied') {
			this.formPanel.loadData({
						url : __ctxPath + '/admin/getConference.do?confId='
								+ this.confId,
						root : 'data',
						preName : 'conference',
						success : function(response, options) {
							var cf = Ext.util.JSON.decode(response.responseText);
							var valueS=Ext.getCmp('ConferenceEditView.applyStatus').getValue();
							//会议日期
							/*var startTTemp=cf.data.startTime;
							var endTTemp=cf.data.endTime;
									// 转换日期
							var d3 = startTTemp.replace(/\-/g, '\/');
							var date3 = new Date(d3);
							var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
									+ "-" + date3.getDate();
							var d3 = dd3.replace(/\-/g, '\/');
							var startTTemp1 = new Date(d3);
							
							var d3 = startTTemp.replace(/\-/g, '\/');
							var date3 = new Date(d3);
							var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
									+ "-" + date3.getDate() + " " + date3.getHours() + ":"
									+ date3.getMinutes();
							var d3 = dd3.replace(/\-/g, '\/');
							var startTTemp2= new Date(d3);
							
							var d3 = endTTemp.replace(/\-/g, '\/');
							var date3 = new Date(d3);
							var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
									+ "-" + date3.getDate() + " " + date3.getHours() + ":"
									+ date3.getMinutes();
							var d3 = dd3.replace(/\-/g, '\/');
							var endTTemp2 = new Date(d3);
							Ext.getCmp('ConferenceEditView.tempDate').setValue(startTTemp1);
							Ext.getCmp('ConferenceEditView.tempStartTime').setValue(startTTemp2);
							Ext.getCmp('ConferenceEditView.tempEndTime').setValue(endTTemp2);*/
							//根据时间判断是否隐藏保存按钮
							/*var hideD = startTTemp.replace(/\-/g, '\/');
							var date3 = new Date(hideD);*/
							var startTTemp=cf.data.startTime;
							var endTTemp=cf.data.endTime;
							Ext.getCmp('ConferenceEditView.tempStartTime').setValue(startTTemp);
							Ext.getCmp('ConferenceEditView.tempEndTime').setValue(endTTemp);
							/*if(startTTemp < today){
								Ext.getCmp('ConferenceEditView.saveBtn').hide();
							}*/
							//判断是否是审核中的会议，是的话可以修改
							/*if(!((valueS == 1 || 2 == valueS) && startTTemp > today.format("Y-m-d H:i"))){
								var setTime = new Date(2000,0,1,0,0,0);//默认时间2000年1月1日
								Ext.getCmp('ConferenceEditView.confTopic').disable();
								Ext.getCmp('ConferenceEditView.roomId').disable();
								Ext.getCmp('ConferenceEditView.contactTel').disable();
								//Ext.getCmp('ConferenceEditView.confContent').disable();
								Ext.getCmp('ConferenceEditView.depName').disable();
								Ext.getCmp('ConferenceEditView.contUser').disable();
								Ext.getCmp('ConferenceEditView.saveBtn').hide();
//								Ext.getCmp('ConferenceEditView.tempDate').disable();
								Ext.getCmp('ConferenceEditView.tempStartTime').disable();
								Ext.getCmp('ConferenceEditView.tempStartTime').setMinValue();
								Ext.getCmp('ConferenceEditView.tempStartTime').setValue(startTTemp);
								Ext.getCmp('ConferenceEditView.tempEndTime').disable();
								Ext.getCmp('ConferenceEditView.tempEndTime').setMinValue();
								Ext.getCmp('ConferenceEditView.tempEndTime').setValue(endTTemp);
//								Ext.getCmp('ConferenceEditView.dateStartTime').disable();
//								Ext.getCmp('ConferenceEditView.dateEndTime').disable();
							}*/
							Ext.getCmp('ConferenceEditView.attendConfine').disable();
							Ext.getCmp('ConferenceEditView.roomContactTel').disable();
							Ext.getCmp('ConferenceEditView.checkReason').disable();
							var cf = Ext.util.JSON.decode(response.responseText);	
						},
						failure : function() {
							Ext.ux.Toast.msg('操作提示', '数据加载失败！');
						}
					});
		}// end of this 数据加载

		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					id : 'ConferenceEditView.saveBtn',
					handler : this.save.createCallback(this.formPanel, this)
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : this.disagree
							.createCallback(this.formPanel, this)
				}];
	}, // end of this initUIComponent
	/**
	 * 取消
	 */
	cancel : function(window) {
		window.close();
	},
	/**
	 * 同意并保存
	 */
	save : function(formPanel, window) {
		Ext.getCmp('ConferenceEditView.attendConfine').enable();
		Ext.getCmp('ConferenceEditView.roomContactTel').enable();
		Ext.getCmp('ConferenceEditView.checkReason').enable();
		Ext.getCmp('ConferenceEditView.attendConfine').allowBlank = true;
		Ext.getCmp('ConferenceEditView.roomContactTel').allowBlank = true;
		Ext.getCmp('ConferenceEditView.checkReason').allowBlank = true;
		Ext.getCmp('ConferenceEditView.attendConfine').setValue(null);
		Ext.getCmp('ConferenceEditView.roomContactTel').setValue(null);
		Ext.getCmp('ConferenceEditView.checkReason').setValue(null);
		Ext.getCmp('ConferenceEditView.applyStatus').setValue(1);
		
		var newSystemDate = document.getElementById('systemDate').value;
		var nowToday = new Date(Date.parseDate(newSystemDate,'Y-m-d h:i:s'));
//		var startDate = Ext.getCmp('ConferenceEditView.tempDate').getValue();
		var startTime = Ext.getCmp('ConferenceEditView.tempStartTime').getValue();
		var endTime = Ext.getCmp('ConferenceEditView.tempEndTime').getValue();
		/*var nowStartDate = startDate.format('Y/m/d');
		var nowStartTime = nowStartDate+" "+startTime;
		var nowEndTime = nowStartDate+" "+endTime;*/
		/*if(nowToday >= startTime){
			alert("会议开始时间必须大于当前时间！");
			return false;
		}*/
		if(!(startTime < endTime)){
			alert("请确认开始时间是否小于结束时间！");
			return false;
		}
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConferenceEditViewPanel');
			/*if (fm.getCmpByName('conference.startTime').value > fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}*/
			formPanel.getForm().submit({
				url : __ctxPath + '/admin/tempConference.do',
				method : 'post',
				waitMsg : '数据正在保存，请稍后...',
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作提示', '成功保存信息！');
					Ext.getCmp('MyJoinedConferenceGrid').getStore().reload({
								params : {
									start : 0,
									limit : 25
								}
							});
					window.close();
					refreshTaskPanelView();//20110708
					
				},
				failure : function(fp, action) {
					Ext.MessageBox.show({
								title : '操作信息',
								msg : Ext.util.JSON
										.decode(action.response.responseText).msg,
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
				}
			});
		}
	},
	/**
	 * 发送
	 */
	send : function(formPanel, window) {
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConferenceEditViewPanel');
			if (fm.getCmpByName('conference.startTime').value > fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			// 获取当前时间,判断是否开会时间在当前时间之前
			var dateTimeNow = today.format('Y-m-d');
			if (dateTimeNow > fm.getCmpByName('conference.startTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间必须在当前时间之前，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			formPanel.getForm().submit({
				url : __ctxPath + '/admin/sendConference.do',
				method : 'post',
				waitMsg : '数据正在发送，请稍后...',
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作提示', '会议信息数据发送成功，等待审核！');
					Ext.getCmp('ZanCunConferenceGrid').getStore().reload({
								params : {
									start : 0,
									limit : 25
								}
							});
					window.close();
				},
				failure : function(fp, action) {
					Ext.MessageBox.show({
								title : '操作信息',
								msg : Ext.util.JSON
										.decode(action.response.responseText),
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
				}
			});
		}
	},
	/**
	 * 审核不通过并保存
	 */
	disagree : function(formPanel, window) {
		window.close();
		/*if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConferenceEditViewPanel');
			if (fm.getCmpByName('conference.startTime').value >fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开始时间大于或等于结束时间，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}if((Ext.getCmp('ConferenceEditView.checkReason').getValue()==null)||(Ext.getCmp('ConferenceEditView.checkReason').getValue()=='')){
		
				Ext.ux.Toast.msg('操作提示', '退回操作需填写审核意见！');		
				return;
				
			}	
			Ext.getCmp('ConferenceEditView.applyStatus').setValue(3);
			formPanel.getForm().submit({
				url : __ctxPath + '/admin/disagreeConference.do',
				method : 'post',
				waitMsg : '数据正在保存，请稍后...',
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作提示', '成功保存信息！');
					Ext.getCmp('ZanCunConferenceGrid').getStore().reload({
								params : {
									start : 0,
									limit : 25
								}
							});
					window.close();
					refreshTaskPanelView();//20110708
				},
				failure : function(fp, action) {
					Ext.MessageBox.show({
								title : '操作信息',
								msg : Ext.util.JSON
										.decode(action.response.responseText),
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
				}
			});
		}*/
	},
	display : function(formPanel, window) {
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConferenceEditViewPanel');
			if (fm.getCmpByName('conference.startTime').value > fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}			
		if((Ext.getCmp('ConferenceEditView.checkReason').getValue()==null)||(Ext.getCmp('ConferenceEditView.checkReason').getValue()=='')){
				Ext.ux.Toast.msg('操作提示', '取消操作需填写审核意见！');		
				return;				
			}			
			formPanel.getForm().submit({
				url : __ctxPath + '/admin/displayConference.do',
				method : 'post',
				waitMsg : '数据正在保存，请稍后...',
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作提示', '成功保存信息！');
					Ext.getCmp('ZanCunConferenceGrid').getStore().reload({
								params : {
									start : 0,
									limit : 25
								}
							});
					window.close();
					refreshTaskPanelView();//20110708
				},
				failure : function(fp, action) {
					Ext.MessageBox.show({
								title : '操作信息',
								msg : Ext.util.JSON
										.decode(action.response.responseText),
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
				}
			});
		}
	}
});