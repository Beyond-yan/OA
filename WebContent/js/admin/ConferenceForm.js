/**
 * @createtime 2010-10-9 PM
 * @class ConferenceForm
 * @extends Ext.Window
 * @description 会议信息管理
 * @company 捷达世软件
 * @author YHZ
 */
ConferenceForm = Ext.extend(Ext.Window, {
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
		ConferenceForm.superclass.constructor.call(this, {
					id : 'ConferenceFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					maximizable : true,
					width : 730,
					height : 550,
					autoScroll : false,
					title : '会议申请审核',
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		// 会议信息设置
		this.basePanel = new Ext.form.FieldSet({
			id : 'ConferenceForm.basePanel',
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
							}, {
								xtype : 'textfield',
								id : 'ConferenceForm.confTopic001',
								name : 'conference.confTopic',
								fieldLabel : '会议主题',
								allowBlank : false,
								blankText : '会议标题不能为空！',
								maxLength : 128,
								maxLengthText : '会议标题不能超过128个字符长度！'
//								readOnly : true
							}, {
								xtype : 'hidden',
								name : 'conference.typeId'
							}/*, {
								xtype : 'combo',
								id : 'ConferenceForm.confProperty001',
								name : 'conference.confProperty',
								fieldLabel : '会议类型',
								valueField : 'typeId',
								displayField : 'typeName',
								mode : 'local',
								readOnly : true,
								emptyText : '--请选择会议类型--',
								triggerAction : 'all',
								forceSelection : true,
								allowBlank : false,
								blankText : '请选择会议类型！',
								store : new Ext.data.SimpleStore({
											url : __ctxPath
													+ '/admin/getTypeAllConference.do',
											autoLoad : true,
											fields : ['typeId', 'typeName']
										}),
								listeners : {
									select : function(cbo, record, index) {
										var fm = Ext
												.getCmp('ConferenceForm.basePanel');
										fm.getCmpByName('conference.typeId')
												.setValue(cbo.getRawValue());
									}
								}
							}*/, {								
								xtype : 'datetimefield',
								format : 'Y-m-d H:i',
								editable : false,
								width : 200,
								id : 'ConferenceForm.startTime001',
								name : 'conference.startTime',
								fieldLabel : '开始时间',
								allowBlank : false,
								minValue: today.format('Y-m-d'),
								blankText : '请输入会议开始时间！'
//								readOnly : true
							},{
								xtype : 'textfield',
								name : 'conference.contUser.fullname',
								id : 'ConferenceForm.createBy001',
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
								id : 'conference.applyStatus',
								name : 'conference.applyStatus'
							},{
								xtype : 'textfield',
								id : 'ConferenceForm.depName001',
								name : 'conference.depName',
								fieldLabel : '申请人部门',
								allowBlank : false,
								blankText : '申请人部门不能为空！',
								maxLength : 128,
								maxLengthText : '申请人部门信息不能超过128个字符长度！',
								editable : false,
								readOnly : true
							}
					]
				}, {
					layout : 'form',
					columnWidth : .5,
					defaults : {
						width : 200
					},
					items : [{
								xtype : 'hidden',
								id : 'AddConferenceForm.roomName',
								name : 'conference.roomName',
								value : this.roomName != null ? this.roomName : ''
							},{
						xtype : 'combo',
						// xtype : 'textfield',
						hiddenName : 'conference.roomId',
						fieldLabel : '会议室名称',
						valueField : 'roomId',
						id : 'ConferenceForm.roomId007',
						displayField : 'roomName',
						mode : 'local',
//						readOnly : true,
						editable : false,
						emptyText : '--请选择会议室--',
						triggerAction : 'all',
						forceSelection : true,
						allowBlank : false,
						blankText : '请选择会议室！',
						store : new Ext.data.SimpleStore({
							url : __ctxPath + '/admin/getBoardrooConference.do',
							autoLoad : true,							
							fields : ['roomId', 'roomName'],
							listeners : {
								scope : this,
								load : function() {
									var cmp = Ext.getCmp('ConferenceForm.roomId007');
//									alert("--777----"+cmp.hiddenField.value);
									if (!(cmp.hiddenField.value==null||cmp.hiddenField.value==''))
									{	
									cmp.setValue(cmp.hiddenField.value);
									}
								}
							}
						}),
						listeners : {
							select : function(cbo, record, index) {
								var fm = Ext.getCmp('ConferenceForm.basePanel');
								fm.getCmpByName('conference.roomName')
										.setValue(cbo.getRawValue());
								fm.getCmpByName('conference.roomLocation')
										.setValue(cbo.getRawValue());
							}
						}
					}/*,{
						xtype : 'combo',
						id : 'ConferenceForm.radiogroup',
						name : 'conference.importLevel',
						fieldLabel : '会议级别',
						border : false,
						readOnly : true,
						width:150,
						mode : 'local',
						triggerAction : 'all',
						store : [ [ '1', '总部' ],
						          [ '2', '分公司' ],
						          [ '3', '部' ],
						          [ '4', '科室' ]],
						emptyText : '---请选择会议级别---'
					}*/, {
						width : 200,
						name : 'conference.endTime',						
						id : 'ConferenceForm.endTime001',
						xtype : 'datetimefield',
						format : 'Y-m-d H:i',
//						readOnly : true,
						fieldLabel : '结束时间',
						allowBlank : false,
						minValue: today.format('Y-m-d'),
						blankText : '请输入会议结束时间！'
					}, {
						xtype : 'textfield',
						id : 'ConferenceForm.phone001',
						name : 'conference.contactTel',
						fieldLabel : '联系人电话',						
						maxLength : 128,
						maxLengthText : '申请人电话信息不能超过128个字符长度！'
//						readOnly : true
					}/*, {
						xtype : 'combo',
						id : 'conferenceForm.timeType001',
						name : 'conference.timeType',
						fieldLabel : '持续时间',
						readOnly : true,
						editable : false,
						store : [ [ '0', '上午' ],
						          [ '1', '下午' ],
						          [ '2', '全天' ] ]
					}*//*,{
						xtype : 'container',
						id : 'ConferenceEditForm.isLongBook2',
						layout : 'column',
						//hidden : true,
						items : [{
									xtype : 'label',
									text : '是否长期预定:',
									width : 95
								}, {								
						hiddenName : 'conference.isLong',
						id : 'ConferenceEditForm.isLongMy',
						xtype : 'combo',
						mode : 'local',
						width : 105,
						allowBlank : false,
						readOnly : true,
						editable : false,
						triggerAction : 'all',
						value : '0',
						store : [['0', '否'], ['2', '是']], //2表示是长期预定的父笔
						listeners : {
							scope : this,
							'select' : function(combo, record, index) {
								if (index == '0') {											
							 Ext.getCmp('ConferenceEditForm.typeAboultBookEditForm').hide();
							 Ext.getCmp('ConferenceEditForm.bookTypeEditForm').hide();								   
						  //   Ext.getCmp('ConferenceEditForm.eTimeForLongEditForm').hide();								    							     
								}
								if (index == '1') {											
							  Ext.getCmp('ConferenceEditForm.typeAboultBookEditForm').show();
							  Ext.getCmp('ConferenceEditForm.bookTypeEditForm').show();								    
						     // Ext.getCmp('ConferenceEditForm.eTimeForLongEditForm').show();								     								     
						    	}
							}
						}
					}]							
					}*/]
				}, {
					columnWidth : 1,
					layout : 'form',
					height : 100,
					width : 550,
					border : false,
					items : [{
								name : 'conference.confContent',
								id : 'ConferenceForm.confContent001',
								xtype : 'htmleditor',
								height : 100,
								width : 550,
								fieldLabel : '准备事项',
								allowBlank : false,
								maxLength : 4000,
								maxLengthText : '会议内容文本不能超过4000个字符长度！'
//								readOnly : true
							}]
				}/*,{
					columnWidth : 1,
					layout : 'form',
					height : 75,
					width : 550,
					border : false,
					items : [{
								id : 'ConferenceEditForm.attendConfine',
								name : 'conference.attendConfine',
								xtype : 'textarea',
								fieldLabel : '参会人员要求',
								allowBlank : true,
								readOnly : true,
								width : 550,
								height : 75,
								maxLength : '500',
								maxLengthText : '会议室描述不能超过500个字符长度！'
							}]
				}*//*,{
					columnWidth : 1,
					layout : 'form',
					id : 'ConferenceFormPanel.jonerPanel',
					border : false,
					width : 550,
					items : [
					         {	xtype : 'hidden',
						name : 'conference.sponsorDept'
					   },{
						xtype : 'container',
						layout : 'hbox',
						layoutConfigs : {
							align : 'middle'
						},
						defaults : {
							margins : '5px 5px 5px 5px '
						},
						items : [{
									xtype : 'label',
									text : '主办部门:'
								}, {
									xtype : 'textfield',
									id : 'sponsorDeptName',
									name : 'conference.sponsorDeptName',
									readOnly : true,
									allowBlank : false,
									blankText : '请选择主办部门！',
									width : 300,
									maxLength : 256,
									maxLengthText : '数据长度不能超过500个字符！'
								}, {
									xtype : 'button',
									id : 'sponsorDeptBtn',
									text : '选择',
									iconCls : 'btn-select',
									width : 80,
									handler : function() {
										DepSelector3.getView(function(ids, names) {
											var fm = Ext
											.getCmp('ConferenceFormPanel.jonerPanel');
									fm
											.getCmpByName('conference.sponsorDept')
											.setValue(ids);
									fm
											.getCmpByName('conference.sponsorDeptName')
											.setValue(names);
										}).show();
									}
								}]
					   		},{
								xtype : 'hidden',
								name : 'conference.compere'
							},{	xtype : 'hidden',
								name : 'conference.compereDept'
							},{	xtype : 'hidden',
								name : 'conference.compereName'
							},{	xtype : 'hidden',
								name : 'conference.compereDeptName'
							}, {
								xtype : 'container',
								layout : 'hbox',
								layoutConfigs : {
									align : 'middle'
								},
								defaults : {
									margins : '5px 5px 5px 5px '
								},
								items : [{
											xtype : 'label',
											text : '主持人:'
										}, {
											xtype : 'textfield',
											id : 'ConferenceForm.compereName',
											name : 'conference.comName',
											readOnly : true,
											allowBlank : false,
											blankText : '请选择主持人！',
											width : 300,
											maxLength : 256,
											maxLengthText : '数据长度不能超过256个字符！'
										}, {
											xtype : 'button',
											id:'compereNameBtn',
											text : '请选择',
											iconCls : 'btn-user-sel',
											handler : function() {
												UserSelector.getView(
														function(userId, fullName) {
															var fm = Ext
																	.getCmp('ConferenceFormPanel.jonerPanel');
															fm
																	.getCmpByName('conference.compere')
																	.setValue(userId);
															fm
																	.getCmpByName('conference.compereName')
																	.setValue(fullName);
															fm.getCmpByName('conference.comName')
															.setValue(fm.getCmpByName('conference.compereDeptName')
															.getValue()+','+fullName);
														}).show();
											}
										}, {
											xtype : 'button',
											id : 'compereDeptNameBtn',
											text : '选择',
											iconCls : 'btn-select',
											width : 80,
											handler : function() {
												DepSelector3.getView(function(ids, names) {
													var fm = Ext
													.getCmp('ConferenceFormPanel.jonerPanel');
											fm
													.getCmpByName('conference.compereDept')
													.setValue(ids);
											fm
													.getCmpByName('conference.compereDeptName')
													.setValue(names);
											fm.getCmpByName('conference.comName')
													.setValue(fm.getCmpByName('conference.compereName')
													.getValue()+','+names);
												}).show();
											}
										}]
							}, {
								xtype : 'hidden',
								name : 'conference.recorder'
							}, {
								xtype : 'container',
								layout : 'hbox',
								defaults : {
									margins : '5px 5px 5px 5px'
								},
								layoutConfigs : {
									align : 'middle'
								},
								items : [{
											xtype : 'label',
											text : '记录人:'
										}, {
											xtype : 'textfield',
											id : 'ConferenceForm.recorderName',
											name : 'conference.recorderName',
											readOnly : true,
											allowBlank : true,									
											width : 300,
											maxLength : 256,
											maxLengthText : '数据长度不能超过256个字符！'
										}, {
											xtype : 'button',
											id:'recorderNameBtn',
											text : '请选择',
											iconCls : 'btn-user-sel',
											handler : function() {
												UserSelector.getView(
														function(userId, fullName) {
															var fm = Ext
																	.getCmp('ConferenceFormPanel.jonerPanel');
															fm
																	.getCmpByName('conference.recorder')
																	.setValue(userId);
															fm
																	.getCmpByName('conference.recorderName')
																	.setValue(fullName);
														}).show();
											}
										}]
							}, {
								xtype : 'hidden',
								name : 'conference.attendUsers'
							},{	xtype : 'hidden',
								name : 'conference.attendDept'
							},{
								xtype : 'hidden',
								name : 'conference.attendDeptName'
							},{	xtype : 'hidden',
								name : 'conference.attendUsersName'
							}, {
								xtype : 'container',
								layout : 'hbox',
								defaults : {
									margins : '5px 5px 5px 5px'
								},
								layoutConfigs : {
									align : 'middle'
								},
								items : [{
											xtype : 'label',
											text : '参加人:'
										}, {
											xtype : 'textfield',
											id : 'ConferenceForm.attendUsersName',
											name : 'conference.attendName',
											readOnly : true,
											allowBlank : false,
											blankText : '请选择参加会议的人员！',
											width : 300,
											maxLength : 4000,
											maxLengthText : '参加人员不能超过4000个字符长度！'
										}, {
											xtype : 'button',
											id:'attendUsersNameBtn',
											text : '请选择',
											iconCls : 'btn-user-sel',
											handler : function() {
												UserSelector.getView(
														function(userId, fullName) {
															var fm = Ext
																	.getCmp('ConferenceFormPanel.jonerPanel');
															fm
																	.getCmpByName('conference.attendUsers')
																	.setValue(userId);
															fm
																	.getCmpByName('conference.attendUsersName')
																	.setValue(fullName);
															fm.getCmpByName('conference.attendName').setValue(fm.getCmpByName('conference.attendDeptName')
																	.getValue()+','+fullName);
														}).show();
											}
										},{
											xtype : 'button',
											id : 'attendDeptNameBtn',
											text : '选择',
											iconCls : 'btn-select',
											width : 80,
											handler : function() {
												DepSelector3.getView(function(ids, names) {
													var fm = Ext.getCmp('ConferenceFormPanel.jonerPanel');
													fm.getCmpByName('conference.attendDept')
															.setValue(ids);
													fm.getCmpByName('conference.attendDeptName')
															.setValue(names);
													
													fm.getCmpByName('conference.attendName').setValue(fm.getCmpByName('conference.attendUsersName')
															.getValue()+','+names);
												}).show();
											}
										}]
							}]
				}*/]
			}]
		}); // end of this basePanel

		// 会议参加人员jonerPanel
		this.jonerPanel = new Ext.form.FieldSet({
					id : 'ConferenceForm.jonerPanel',
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
											id : 'AddConferenceForm.attendConfine',
											allowBlank : false,
											width : 150,
											blankText : '请填写联系人！'
										}/*{
											xtype : 'hidden',
											id : 'AddConferenceForm.contactUserName',
											name : 'AddConferenceForm.contactUserName',
											value : this.userName != null ? this.userName : ''
										}, {
											xtype : 'combo',
											fieldLabel : '会议室负责人',
											hiddenName : 'conference.roomContactUser.userId',
											id : 'AddConferenceForm.roomContactUser',
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
//											allowBlank : false,
											blankText : '请选择会议室负责人！',
											store : new Ext.data.SimpleStore({
												url : __ctxPath
														+ '/system/getByDepIdAppUser.do?depId='+1249939,
												autoLoad : true,
												fields : ['roomContactUser', 'contactUserName'],
												listeners : {
													scope : this,
													load : function() {
														var cmp = Ext.getCmp('AddConferenceForm.roomContactUser');
														if (cmp.hiddenField.value)
															cmp.setValue(cmp.hiddenField.value);
														this.getCmpByName('conference.roomName').setValue(cmp.dom.value);
													}
												}
											}),
											listeners : {
												select : function(cbo, record, index) {
													Ext.getCmp('AddConferenceForm.contactUserName')
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
												name : 'conference.roomContactTel',
												id : 'AddConferenceForm.roomContactTel',
												fieldLabel : '负责人联系电话',
												allowBlank : false,
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
											id:'ConferenceForm.checkReason',
											name : 'conference.checkReason',
											xtype : 'textarea',
											readOnly : false,
											maxLength : 256,
											maxLengthText : '数据不能超过256字符！',
											width : 550,
											height : 80,
											margins : '5px 60px 5px 60px '
									}]
							}

					]
				}); // end of this jonerPanel

		this.formPanel = new Ext.FormPanel({
					id : 'ConferenceFormPanel',
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
//							Ext.getCmp('ConferenceForm.radiogroup').disable();
							/*Ext.getCmp('ConferenceForm.confTopic001').disable();*/
//							Ext.getCmp('ConferenceForm.confProperty001').disable();
//							Ext.getCmp('ConferenceEditForm.isLongMy').disable();
							/*Ext.getCmp('ConferenceForm.roomId007').disable();
							Ext.getCmp('conferenceForm.timeType001').disable();
							Ext.getCmp('ConferenceForm.phone001').disable();
							Ext.getCmp('ConferenceForm.startTime001').disable();
							Ext.getCmp('ConferenceForm.endTime001').disable();
							Ext.getCmp('ConferenceForm.confContent001').enable();
							Ext.getCmp('ConferenceForm.depName001').disable();
							Ext.getCmp('ConferenceForm.createBy001').disable();*/
//							Ext.getCmp('ConferenceEditForm.attendConfine').disable();
//							Ext.getCmp('sponsorDeptName').disable();
//							Ext.getCmp('ConferenceForm.compereName').disable();
//							Ext.getCmp('ConferenceForm.recorderName').disable();
//							Ext.getCmp('ConferenceForm.attendUsersName').disable();
//							Ext.getCmp('sponsorDeptBtn').disable();
//							Ext.getCmp('compereNameBtn').disable();
//							Ext.getCmp('compereDeptNameBtn').disable();
//							Ext.getCmp('recorderNameBtn').disable();
//							Ext.getCmp('attendUsersNameBtn').disable();
//							Ext.getCmp('attendDeptNameBtn').disable();
							var cf = Ext.util.JSON.decode(response.responseText);	
//							var comp = (cf.data.compereDeptName?cf.data.compereDeptName:'')+(cf.data.compereName?','+cf.data.compereName:'');
//							Ext.getCmp('ConferenceForm.compereName').setValue(comp);
//							var comp = (cf.data.attendDeptName?cf.data.attendDeptName:'')+(cf.data.attendUsersName?','+cf.data.attendUsersName:'');
//							Ext.getCmp('ConferenceForm.attendUsersName').setValue(comp);
						},
						failure : function() {
							Ext.ux.Toast.msg('操作提示', '数据加载失败！');
						}
					});
		}// end of this 数据加载

		this.buttons = [{
					text : '同意',
					iconCls : 'btn-save',
					handler : this.save.createCallback(this.formPanel, this)
				}, {
					text : '拒绝',
					iconCls : 'btn-cancel',
					handler : this.disagree
							.createCallback(this.formPanel, this)
				}/*, {
					text : '取消本次申请',
					iconCls : 'btn-save',
					handler : this.display.createCallback(this.formPanel, this)
				},{
					text : '取消',
					iconCls : 'btn-cancel',
					handler : this.cancel.createCallback(this)
				}*/];
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
		Ext.getCmp('AddConferenceForm.attendConfine').allowBlank = false;
		Ext.getCmp('AddConferenceForm.roomContactTel').allowBlank = false;
		var jp = Ext.getCmp('ConferenceForm.jonerPanel');
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConferenceFormPanel');
			if (fm.getCmpByName('conference.startTime').value > fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			Ext.getCmp('conference.applyStatus').setValue(2);
			formPanel.getForm().submit({
				url : __ctxPath + '/admin/saveConference.do',
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
			var fm = Ext.getCmp('ConferenceFormPanel');
			if (fm.getCmpByName('conference.startTime').value > fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			// 获取当前时间,判断是否开会时间在当前时间之前
			var dateTimeNow = new Date().format('Y-m-d');
			if (dateTimeNow > fm.getCmpByName('conference.startTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间必须在当前时间之前，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			// 会议主持人和记录人重复人员验证
			/*
			 * if (!ConferenceForm.validateCompereAndRecorder()) return;
			 */
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
		
		Ext.getCmp('AddConferenceForm.attendConfine').allowBlank = true;
		Ext.getCmp('AddConferenceForm.roomContactTel').allowBlank = true;
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConferenceFormPanel');
			if (fm.getCmpByName('conference.startTime').value >fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开始时间大于或等于结束时间，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}if((Ext.getCmp('ConferenceForm.checkReason').getValue()==null)||(Ext.getCmp('ConferenceForm.checkReason').getValue()=='')){
		
				Ext.ux.Toast.msg('操作提示', '退回操作需填写审核意见！');		
				return;
				
			}	
			Ext.getCmp('conference.applyStatus').setValue(3);
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
		}
	},
	display : function(formPanel, window) {
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConferenceFormPanel');
			if (fm.getCmpByName('conference.startTime').value > fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}			
		if((Ext.getCmp('ConferenceForm.checkReason').getValue()==null)||(Ext.getCmp('ConferenceForm.checkReason').getValue()=='')){
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
	},
	/**
	 * 文件上传
	 */
	upLoadFile : function() {
		var dialog = App.createUploadDialog({
			file_cat : 'admin/conference',
			callback : function(arr) {
				var fileIds = '';
				var filePanel = Ext.getCmp('resumeFilePanel');
				for (var i = 0; i < arr.length; i++) {
					fileIds += arr[i].fileId + ',';
					Ext.DomHelper
							.append(
									filePanel.body,
									'<span><a href="#" onclick="FileAttachDetail.show('
											+ arr[i].fileId
											+ ')">'
											+ arr[i].fileName
											+ '</a><img class="img-delete" src="'
											+ __ctxPath
											+ '/images/system/delete.gif" onclick="removeResumeFile(this,'
											+ arr[i].fileId
											+ ')"/>&nbsp;|&nbsp;</span>');
				}
				Ext.getCmp('conferenceForm.filePath').getCmpByName('filePath')
						.setValue(fileIds.substring(0, fileIds.length - 1));
			}
		});
		dialog.show('querybtn');
	}
});

/**
 * 显示上传文件列表
 */
ConferenceForm.setFilePanel = function(records) {
	var fileIds = '';
	var filePanel = Ext.getCmp('resumeFilePanel');
	for (var i = 0; i < records.length; i++) {
		fileIds += records[i].data.fileId + ',';
		var del = '</a><img class="img-delete" src="' + __ctxPath
				+ '/images/system/delete.gif" onclick="removeResumeFile(this,'
				+ records[i].data.fileId + ')"/>';
		Ext.DomHelper.append(filePanel.body,
				'<span><a href="#" onclick="FileAttachDetail.show('
						+ records[i].data.fileId + ')">'
						+ records[i].data.fileName + del
						+ '&nbsp;|&nbsp;</span>');
	}
	Ext.getCmp('conferenceForm.filePath').getCmpByName('filePath')
			.setValue(fileIds.substring(0, fileIds.length - 1));
};