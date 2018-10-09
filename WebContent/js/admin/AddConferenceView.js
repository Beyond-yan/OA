/**
 * @description 会议申请
 * @author YHZ
 * @company
 * @dateTime 2010-11-5PM
 */
AddConferenceView = Ext.extend(Ext.Panel, {
	// store
	store : null,
	gridPanel : null,
	// 内嵌FormPanel
	formPanel : null,
	// 会议基本信息
	basePanel : null,
	// 会议内容
	contextPanel : null,
	// 参加人员
	jonerPanel : null,

	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		AddConferenceView.superclass.constructor.call(this, {
					id : 'AddConferenceViewWin',
					layout : 'form',
					region : 'center',
					iconCls : 'menu-conference_add',
					items : this.formPanel,
					modal : true,
					maximizable : true,
					bodyStyle : 'padding : 5px 5px 5px 5px',
					autoScroll : true,
					title : '会议室申请'
				});

	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var newDate = new Date();		
		var today =  new Date();
		today.setTime(newDate.getTime()-24*60*60*1000);	
		// 会议信息设置
		this.basePanel = new Ext.form.FieldSet({
			id : 'AddConferenceView.basePanel',
			title : '会议信息',
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
								xtype : 'hidden',
								name : 'conference.confId',
								value : this.confId != null ? this.confId : ''
							}, {
								xtype : 'textfield',
								name : 'conference.confTopic',
								fieldLabel : '会议议题',
								allowBlank : false,
								blankText : '会议议题不能为空！',
								maxLength : 128,
								maxLengthText : '会议议题不能超过128个字符长度！',
								width : 150
							}, {
								xtype : 'hidden',
								name : 'conference.typeId'
							}, {
								xtype : 'combo',
								name : 'conference.confProperty',
								fieldLabel : '会议类型',
								valueField : 'typeId',
								displayField : 'typeName',
								mode : 'local',
								editable : false,
								emptyText : '--请选择会议类型--',
								triggerAction : 'all',
								forceSelection : true,
								allowBlank : false,
								width : 150,
								blankText : '请选择会议类型！',
								store : new Ext.data.SimpleStore({
											url : __ctxPath
													+ '/admin/getTypeAllConference.do',
											autoLoad : true,
											fields : ['typeId', 'typeName']
										}),
								listeners : {
									scope : this,
									select : function(cbo, record, index) {
										this.getCmpByName('conference.typeId')
												.setValue(cbo.getValue());
									}
								}
							},{
								xtype:'hidden',
								id:'conference.contactUser',
								name:'conference.contUser.userId'
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
											text : '会议联系人:',
											width : 80
										},{
											xtype : 'textfield',
											id:'contactUserName',
											readOnly : true,
											allowBlank : false,
											blankText : '请选择联系人！',
											width : 150,
											maxLength : 256,
											maxLengthText : '数据长度不能超过256个字符！'
										}, {
											xtype : 'button',
											text : '请选择',
											iconCls : 'btn-user-sel',
											handler : function() {
												UserSelector.getView(
														function(userId, fullName) {
																	Ext.getCmp('conference.contactUser')
																	.setValue(userId);
															 
																	Ext.getCmp('contactUserName')
																	.setValue(fullName);
														},true).show();
											}
										}]
							}, {
								fieldLabel : '是否长期预定',
								hiddenName : 'conference.isLong',
								id : 'AddConferenceView.isLong',
								xtype : 'combo',
								mode : 'local',
								allowBlank : false,
								editable : false,
								width : 150,
								triggerAction : 'all',
								value : '0',
								store : [['0', '否'], ['1', '是']],
								listeners : {
									scope : this,
									'select' : function(combo, record, index) {
										if (index == '0') {
											// index从0开始										
											Ext.getCmp('AddConferenceView.typeAboultBook').hide();
											Ext.getCmp('AddConferenceView.countNum').hide();
											Ext.getCmp('AddConferenceView.tempStartDate').setValue('');
											Ext.getCmp('AddConferenceView.tempEndDate').setValue('');											
										}
										if (index == '1') {											
											Ext.getCmp('AddConferenceView.typeAboultBook').show();
											Ext.getCmp('AddConferenceView.countNum').show();
											Ext.getCmp('AddConferenceView.tempStartDate').setValue('');
											Ext.getCmp('AddConferenceView.tempEndDate').setValue('');							
										}
									}
								}
							},{
								xtype : 'container',
								id : 'AddConferenceView.countNum',
								layout : 'column',
								hidden : true,
								items : [{
											xtype : 'label',
											text : '预定星期:',
											width : 104
										}, {
											hiddenName : 'countNum2',
											id : 'AddConferenceView.countNum2',
											xtype : 'combo',
											mode : 'local',
											allowBlank : false,
											editable : false,
											width : 150,
											triggerAction : 'all',
											value : '1',
											store : [['1', '星期一'],
													['2', '星期二'], ['3', '星期三'],
													['4', '星期四'], ['5', '星期五'],
													['6', '星期六'], ['7', '星期日']]
										}]
							}]								 
				}, {
					layout : 'form',
					columnWidth : .5,
					defaults : {
						width : 400
					},
					items : [{
								xtype : 'hidden',
								id : 'AddConferenceView.roomName',
								name : 'conference.roomName'
							},{
								xtype : 'combo',
								id : 'AddConferenceView.roomId',
								hiddenName : 'conference.roomId',
								fieldLabel : '会议室名称',
								valueField : 'roomId',
								displayField : 'roomName',
								mode : 'local',
								editable : false,
								emptyText : '--请选择会议室--',
								triggerAction : 'all',
								width : 150,
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
											var cmp = Ext.getCmp('AddConferenceView.roomId');
											if (cmp.hiddenField.value)
												cmp.setValue(cmp.hiddenField.value);
											this.getCmpByName('conference.roomName').setValue(cmp.getRawValue());
										}
									}
								}),
								listeners : {
									select : function(cbo, record, index) {										
										Ext.getCmp('AddConferenceView.roomName')
												.setValue(cbo.getRawValue());
									}
								}
							}, {
								fieldLabel : '会议级别',
								width : 150,
								hiddenName : 'conference.importLevel',
								xtype : 'combo',
								mode : 'local',
								editable : false,
								allowBlank : false,
								triggerAction : 'all',
								store : [ [ '1', '总部' ],
								          [ '2', '分公司' ],
								          [ '3', '部' ],
								          [ '4', '科室' ]],
								emptyText : '---请选择会议级别---'
							}, {
								xtype : 'numberfield',
								name : 'conference.contactTel',
								fieldLabel : '联系电话',
								width : 130,
								allowBlank : false,
								blankText : '请输入正确类型的联系电话！'
							}, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'AddConferenceView.typeAboultBook',
								layout : 'column',								
								hidden : true,
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '预定类别:',
											width : 104
										}, {
											hiddenName : 'isTypeAboultBook',
											id : 'AddConferenceView.typeAboultBook2',
											xtype : 'combo',
											mode : 'local',
											allowBlank : false,
											editable : false,
											width : 150,
											triggerAction : 'all',
											value : '1',
											store : [['1', '按星期预定'],
													['2', '按天数预定']],
											listeners : {
												scope : this,
												'select' : function(combo,
														record, index) {
													if (index == '0') {														
														Ext.getCmp('AddConferenceView.countNum')
																.show();
													}
													if (index == '1') {														
														Ext.getCmp('AddConferenceView.countNum')
																.hide();
													}

												}
											}										
										}]
							}]
				}]
			}]								
		}); // end of this basePanel
   		
		// 会议参加人员jonerPanel
		this.jonerPanel = new Ext.form.FieldSet({
			id : 'AddConferenceView.jonerPanel',
			title : '参加人员',
			layout : 'form',
			border : true,
			items : [{	xtype : 'hidden',
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
							text : '主办部门:',
							width : 105
						}, {
							xtype : 'textfield',
							name : 'conference.sponsorDeptName',
							readOnly : true,
							allowBlank : false,
							blankText : '请选择主办部门！',
							width : 400,
							maxLength : 256,
							maxLengthText : '数据长度不能超过500个字符！'
						}, {
							xtype : 'button',
							text : '选择',
							iconCls : 'btn-select',
							width : 80,
							handler : function() {
								DepSelector3.getView(function(ids, names) {
									var fm = Ext
									.getCmp('AddConferenceView.jonerPanel');
							fm
									.getCmpByName('conference.sponsorDept')
									.setValue(ids);
							fm
									.getCmpByName('conference.sponsorDeptName')
									.setValue(names);
								}).show();
							}
						}]
			   		},{	xtype : 'hidden',
						name : 'conference.compere'
					},{	xtype : 'hidden',
						name : 'conference.compereDept'
					},{	xtype : 'hidden',
						name : 'conference.compereName'
					},{	xtype : 'hidden',
						name : 'conference.compereDeptName'
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
									text : '主持人:',
									width : 105
								}, {
									xtype : 'textfield',
									name : 'conference.comName',
									readOnly : true,
									allowBlank : false,
									blankText : '请选择主持人！',
									width : 400,
									maxLength : 256,
									maxLengthText : '数据长度不能超过256个字符！'
								}, {
									xtype : 'button',
									text : '请选择',
									iconCls : 'btn-user-sel',
									handler : function() {
										UserSelector.getView(
												function(userId, fullName) {

													var fm = Ext
															.getCmp('AddConferenceView.jonerPanel');
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
									text : '选择',
									iconCls : 'btn-select',
									width : 80,
									handler : function() {
										DepSelector3.getView(function(ids, names) {
											var fm = Ext
											.getCmp('AddConferenceView.jonerPanel');
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
									text : '记录人:',
									width : 105
								}, {
									xtype : 'textfield',
									name : 'conference.recorderName',
									readOnly : true,
									allowBlank : false,
									// blankText : '请选择记录人！',
									width : 400,
									maxLength : 256,
									maxLengthText : '数据长度不能超过256个字符！'
								}, {
									xtype : 'button',
									text : '请选择',
									iconCls : 'btn-user-sel',
									handler : function() {
										UserSelector.getView(
												function(userId, fullName) {
													var fm = Ext
															.getCmp('AddConferenceView.jonerPanel');
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
									text : '参加人:',
									width : 105
								}, {
									xtype : 'textarea',
									name : 'conference.attendName',
									readOnly : true,
									allowBlank : false,
									blankText : '请选择参加会议的人员！',
									width : 400,
									maxLength : 4000,
									maxLengthText : '参加人员不能超过4000个字符长度！'
								}, {
									xtype : 'button',
									text : '请选择',
									iconCls : 'btn-user-sel',
									handler : function() {
										UserSelector.getView(
												function(userId, fullName) {
													var fm = Ext.getCmp('AddConferenceView.jonerPanel');
													fm.getCmpByName('conference.attendUsers')
															.setValue(userId);
													fm.getCmpByName('conference.attendUsersName')
															.setValue(fullName);
													
													fm.getCmpByName('conference.attendName').setValue(fm.getCmpByName('conference.attendDeptName')
															.getValue()+','+fullName);
												}).show();
									}
								},{
									xtype : 'button',
									text : '选择',
									iconCls : 'btn-select',
									width : 80,
									handler : function() {
										DepSelector3.getView(function(ids, names) {
											var fm = Ext.getCmp('AddConferenceView.jonerPanel');
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
		}); // end of this jonerPanel

		// 会议内容contextPanel
		this.contextPanel = new Ext.form.FieldSet({
			title : '时间和内容设置',
			layout : 'column',
			columnWidth : 1,
			border : true,
			items : [{
						columnWidth : .5,
						layout : 'form',
						border : false,
						defaults : {
						width : 400
					},
						items : [/*{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'AddConferenceView.startTimeforShort',
									layout : 'column',
									anchor : '98%,98%',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '开始日期:',//短期会议的开始时间
												width : 105
											}, {
											    id : 'AddConferenceView.startTime2',
												xtype : 'datetimefield',
												format : 'Y-m-d',
												editable : false,
												allowBlank : false,
												//name : 'conference.startTime',
												name:'shortStartTime',
												width :165,
												minValue:today,
												listeners:{select:function(){												
													var startDate=Ext.getCmp('AddConferenceView.startTime2').getValue();
													Ext.getCmp('AddConferenceView.endTime2').setValue(startDate);													
												}
												}
										}]
								},*/{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'AddConferenceView.startDateforLong',
									layout : 'column',
									//hidden : true,
									anchor : '98%,98%',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '开始日期:',//长期会议的开始日期
												width : 105
											}, {
												id : 'AddConferenceView.tempStartDate',
												style:'padding-left:72px',
												xtype : 'datetimefield',
												format : 'Y-m-d',
												editable : false,
												name : 'tempStartDate',
												width : 160,
												minValue:today,												
												allowBlank : false,
												listeners:{select:function(){
													var value=Ext.getCmp('AddConferenceView.isLong').getValue();
													if(value==0){
													var startDate=Ext.getCmp('AddConferenceView.tempStartDate').getValue();
													Ext.getCmp('AddConferenceView.tempEndDate').setValue(startDate);													
												    }
												}
											}
										}]
								},{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'AddConferenceView.startTimeforLong',
									layout : 'column',								
//									anchor : '98%,98%',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '开始时间:',//长期会议的开始时间
												width : 105
											}, {
												id : 'AddConferenceView.tempStartTime',											
												xtype : 'timefield',
												format : ' H:i',
												editable : false,
												name : 'tempStartTime',
												style:'padding-left:100px',
												minValue:'07:00',
												increment:30,
												allowBlank : false
										}]
								}]
					}, {
						columnWidth : .5,
						layout : 'form',
						border : false,
						defaults : {
						width : 600
					},items : [/*{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id:'AddConferenceView.endTimeforShort',
									layout : 'column',
									anchor : '98%,98%',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '结束日期:', //短期会议的结束时间
												width : 105
											}, {
												id : 'AddConferenceView.endTime2',
												//name : 'conference.endTime',
												name : 'shortEndTime',
												xtype : 'datetimefield',
												format : 'Y-m-d',
												editable : false,
												allowBlank : false,
												width : 165,
												readOnly:true												
										}]
								}, */{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'AddConferenceView.endDateforLong',
									layout : 'column',
									//hidden : true,
									anchor : '98%,98%',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '结束日期:',//长期会议的结束日期
												width : 105
											}, {

												id : 'AddConferenceView.tempEndDate',
												name : 'tempEndDate',
												xtype : 'datetimefield',
												style:'padding-left:72px',
												format : 'Y-m-d',
												editable : false,
										    	width : 160,
												minValue:today,
												allowBlank:false,
												listeners:{select:function(){
													var value=Ext.getCmp('AddConferenceView.isLong').getValue();
													if(value==0){
													var startDate=Ext.getCmp('AddConferenceView.tempEndDate').getValue();
													Ext.getCmp('AddConferenceView.tempStartDate').setValue(startDate);													
												    }
												}
											}											
										}]
								},{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'AddConferenceView.endTimeforLong',
									layout : 'column',
									//anchor : '98%,98%',									
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '结束时间',//长期会议的结束时间
												width : 105
											}, {
												id : 'AddConferenceView.tempEndTime',
												//xtype : 'datetimefield',
												xtype : 'timefield',
												format : 'H:i',
												editable : false,
												name : 'tempEndTime',
												style:'padding-left:100px',
												width : 160,
												minValue:'07:00',
												increment:30,
												allowBlank : false
												// blankText : '请输入会议结束时间！'
										}]
								}]
					}, {
						columnWidth : 1,
						layout : 'form',
						height : 130,
						width : 550,
						border : false,
						items : [{
									name : 'conference.confContent',
									xtype : 'htmleditor',
									height : 120,
									width : 550,
									fieldLabel : '会议要求',
									allowBlank : false,
									blankText : '请输入会议内容！',
									maxLength : 4000,
									maxLengthText : '会议内容不能超过4000个字符长度！'
								}]
					},{
						columnWidth : 1,
						layout : 'form',
						border : false,
						items : [{
									name : 'conference.attendConfine',
									xtype : 'textarea',
									fieldLabel : '参会人员要求',
									allowBlank : true,											
									width : 550,
									height : 75,
									maxLength : '500',
									maxLengthText : '会议室描述不能超过500个字符长度！'
								}]
					}]
		}); // end of this contextPanel
	
		this.formPanel = new Ext.FormPanel({
					id : 'AddConferenceViewPanel',
					autoScroll : true,
					layout : 'form',
					region : 'center',
					bodyStyle : 'padding-left: 5%;padding-right : 100px',
					border : false,
					defaults : {
						readOnly : true
					},
					items : [{
								id : 'addConferenceViewAllfieldset',
								xtype : 'fieldset',
								title : '会议申请',
								bodyStyle : 'padding:5px 5px 5px 5px',
								layout : 'form',
								buttonAlign : 'center',
								items : [this.basePanel, this.contextPanel, {
									layout : 'column',
									border : false,
									columnWidth : 1,
									defaults : {
										border : false
									},
									items : [{
												columnWidth : 1,
												width : '360',
												layout : 'form',
												items : [this.jonerPanel]
											}]
								}		
								],
								buttons : [{
											// text : '暂存会议信息',
											text : '保存',
											iconCls : 'temp',
											handler : this.save
													.createCallback(this)
										},
										/*
										 * { text : '发送会议通知', iconCls :
										 * 'btn-mail_send', handler : this.send
										 * .createCallback(this) },
										 */{
											text : '重置',
											iconCls : 'btn-reset',
											handler : this.reset
										}]
							}]
				});// end of this formPanel   
	}, // end of this initUIComponent
	/**
	 * 重置
	 */
	reset : function() {
		Ext.getCmp('AddConferenceViewPanel').getForm().reset();
		// Ext.getCmp('resumeFilePanel').body.update('');
	},

	/**
	 * 保存
	 */
	save : function(window) {
		var fm = Ext.getCmp('AddConferenceViewPanel');
		var fmSearch = Ext.getCmp('AddConferenceView.basePanel');			
		// 非长期预定会议室
		if (Ext.getCmp("AddConferenceView.isLong").getValue() == 0) {
			if (fm.getForm().isValid()) {
				var bo=checkStartAndEndTime();//检查会议的开始以及结束时间段	
				if(!bo){//如果开会时间不可用					
					Ext.ux.Toast.msg('操作提示', '对不起，开会时间段有误。开始时间必须大于结束时间，请重新输入！');
					Ext.getCmp('AddConferenceView.tempStartTime').focus(true);
					return;
				}
			    var bookStartT = fm.getCmpByName('tempStartTime').value;
				//var bookEndT = fm.getCmpByName('conference.endTime').value;
				// 开会时间验证
				if (bookStartT == null) {
					Ext.ux.Toast.msg('操作提示', '请输入会议开始日期！');
					fm.getCmpByName('tempStartDate').focus(true);
					return;
				}					
			/*	// 转换日期
				var d3 = bookStartT.replace(/\-/g, '\/');
				var date3 = new Date(d3);
				var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
						+ "-" + date3.getDate() + " " + date3.getHours() + ":"
						+ date3.getMinutes();
				var d3 = dd3.replace(/\-/g, '\/');
				var newDateStart = new Date(d3);

				// 转换日期
				var d3 = bookEndT.replace(/\-/g, '\/');
				var date3 = new Date(d3);
				var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
						+ "-" + date3.getDate() + " " + date3.getHours() + ":"
						+ date3.getMinutes();
				var d3 = dd3.replace(/\-/g, '\/');
				var newDateEnd = new Date(d3);

				
				  var date = new Date();
				if (fm.getCmpByName('conference.startTime').value < date) {
					Ext.ux.Toast.msg('操作提示', '会议开始日期比实际时间小！');
					fm.getCmpByName('conference.startTime').focus(true);
					return;
				}				
				
				  if(newDateStart.getHours()<7){//20110728
					Ext.ux.Toast.msg('操作提示', '对不起，开始时间必须从7:00开始，请重新输入！');
					fm.getCmpByName('conference.startTime').focus(true);
					return;				
				}

				if (fm.getCmpByName('conference.startTime').value >= fm
						.getCmpByName('conference.endTime').value) {
					Ext.ux.Toast.msg('操作提示', '对不起，开始时间必须小于结束时间，请重新输入！');
					fm.getCmpByName('conference.startTime').focus(true);
					return;
				}
				if (newDateStart.getDate() != newDateEnd.getDate()
						|| newDateStart.getYear() != newDateEnd.getYear()
						|| newDateStart.getMonth() != newDateEnd.getMonth()) {
					Ext.ux.Toast.msg('操作提示', '非长期会议：开始时间与结束时间必须是同一天，请重新输入！');
					fm.getCmpByName('conference.startTime').focus(true);
					return;
				}
				
				if (newDateStart.getHours() == newDateEnd.getHours()
						&& newDateStart.getMinutes() == newDateEnd.getMinutes()
						&& newDateStart.getSeconds() == newDateEnd.getSeconds()) {
					Ext.ux.Toast.msg('操作提示', '请选择不同开会时间段，请重新输入！');
					fm.getCmpByName('conference.startTime').focus(true);
					return;
				}
				*/		
				fm.getForm().submit({
					url : __ctxPath + '/admin/tempConference.do',
					method : 'post',
					waitMsg : '数据正在保存，请稍后...',
					success : function(fp, action) {
						Ext.ux.Toast.msg('操作信息', '成功保存信息！');					
						AppUtil.removeTab("AddConferenceViewWin");
						App.clickTopTab('MyJoinedConferenceView');							
						//如果我发起的页面已经打开则进行重新加载
						if((null!=(Ext.getCmp('MyJoinedConferenceGrid')))&&('undenfied'!=Ext.getCmp('MyJoinedConferenceGrid'))){							
							Ext.getCmp('MyJoinedConferenceGrid').getStore().reload({
							params : {
								start : 0,
								limit : 25
							}
						});										
						}
						//刷新会议申请图形页面					
						var search=Ext.getCmp('ConfBoardrooSearch');
						var storeSearch=search.store;														
						if((null!=(storeSearch))&&('undenfied'!=storeSearch)){
						//storeSearch.load();							
						storeSearch.reload();		
						var picP=Ext.getCmp('ConfBoardrooSearch.picPanel');							
						picP.update(picP.getHtml(storeSearch));
						}			
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
		}
		// 长期预定会议室
		else if (Ext.getCmp("AddConferenceView.isLong").getValue() == 1) {
			// var times = Ext.getCmp('countText2').getValue();// 预定的频率
			var bookTempStartD = Ext.getCmp('AddConferenceView.tempStartDate').getValue();
			var bookTempStartT = Ext.getCmp('AddConferenceView.tempStartTime').getValue();
			var bookTempEndD = Ext.getCmp('AddConferenceView.tempEndDate').getValue();
			var bookTempEndT = Ext.getCmp('AddConferenceView.tempEndTime').getValue();			
			var bookType = Ext.getCmp('AddConferenceView.typeAboultBook2').getValue();// 预定的类别
			// var bookStartT=fm.getCmpByName('conference.startTime').value;
			var countNum = Ext.getCmp('AddConferenceView.countNum2').getValue();			
			if (bookTempStartD == null) {

				Ext.ux.Toast.msg('操作提示', '请输入会议开始日期！');
				Ext.getCmp('AddConferenceView.bookTempStartD').focus(true);
				return;
			}
			if (bookTempStartT == null) {

				Ext.ux.Toast.msg('操作提示', '请输入会议开始时间！');
				Ext.getCmp('AddConferenceView.tempStartDate').focus(true);
				return;
			}
			if (bookTempEndD == null) {

				Ext.ux.Toast.msg('操作提示', '请输入会议结束日期！');
				Ext.getCmp('AddConferenceView.tempEndDate').focus(true);
				return;
			}
			if (bookTempEndT == null) {
				Ext.ux.Toast.msg('操作提示', '请输入会议结束时间！');
				Ext.getCmp('AddConferenceView.tempStartTime').focus(true);
				return;
			}
				if (Ext.getCmp('AddConferenceView.tempStartDate').getValue() == Ext
					.getCmp('AddConferenceView.tempEndDate').getValue()) {
				Ext.ux.Toast.msg('操作提示', '长期会议：开始日期与结束日期不能是同一天，请重新输入！');
				Ext.getCmp('AddConferenceView.tempStartDate').focus(true);
				return;
			}	
				if (Ext.getCmp('AddConferenceView.tempStartDate').getValue() >= Ext
						.getCmp('AddConferenceView.tempEndDate').getValue()) {
					Ext.ux.Toast.msg('操作提示', '长期会议：会议开始日期必须小于结束日期，请重新输入！');
					Ext.getCmp('AddConferenceView.tempStartDate').focus(true);
					return;
				}			
				var bo=checkStartAndEndTime();//检查会议的开始以及结束时间段	
				if(!bo){//如果开会时间不可用					
					Ext.ux.Toast.msg('操作提示', '对不起，开会时间段有误。开始时间必须大于结束时间，请重新输入！');
					Ext.getCmp('AddConferenceView.tempStartTime').focus(true);
					return;
				}
			var date = new Date();
			var dd3 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
					+ date.getDate();
			var d3 = dd3.replace(/\-/g, '\/');
			var tempDateNow = new Date(d3);

			if (Ext.getCmp('AddConferenceView.tempStartDate').getValue() < tempDateNow) {
				Ext.ux.Toast.msg('操作提示', '会议开始日期比实际时间小！');
				Ext.getCmp('AddConferenceView.tempStartDate').focus(true);
				return;
			} else {				
				fm.getForm().submit({
					url : __ctxPath + '/admin/bookRoomLongConference.do',
					method : 'post',
					params : {
						// times : times,
						bookType : bookType,
						startTime : bookTempStartT,
						countNum : countNum,
						endTime : bookTempEndT,
						startDate : bookTempStartD,
						endDate : bookTempEndD
					},
					waitMsg : '数据正在保存，请稍后...',
					success : function(fp, action) {
						Ext.ux.Toast.msg('操作信息', '成功保存信息！');	
						AppUtil.removeTab("AddConferenceViewWin");												
						App.clickTopTab('MyJoinedConferenceView');
						//如果我发起的页面已经打开则进行重新加载
						if((null!=(Ext.getCmp('MyJoinedConferenceGrid')))&&('undenfied'!=Ext.getCmp('MyJoinedConferenceGrid'))){							
							Ext.getCmp('MyJoinedConferenceGrid').getStore().reload({
							params : {
								start : 0,
								limit : 25
							}
						});										
						}
						//刷新会议申请图形页面					
						var search=Ext.getCmp('ConfBoardrooSearch');					
						var storeSearch=search.store;														
						if((null!=(storeSearch))&&('undenfied'!=storeSearch)){
						//storeSearch.load();
						storeSearch.reload();
						var picP=Ext.getCmp('ConfBoardrooSearch.picPanel');
						picP.update(picP.getHtml(storeSearch));
						}
					},
					failure : function(fp, action) {
						Ext.MessageBox.show({
									title : '操作信息',
									msg :(('undefined'!=action.response)==true?( Ext.util.JSON
											.decode(action.response.responseText).msg):'网络异常！'),
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
					}
				});
			  }
			}
	},
	/**
	 * 发送
	 */
	send : function(window) {
		var fm = Ext.getCmp('AddConferenceViewPanel');
		if (fm.getForm().isValid()) {
			// 开会时间验证
			if (fm.getCmpByName('tempStartDate').value >= fm
					.getCmpByName('tempEndDate').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('tempStartDate').focus(true);
				return;
			}
			// 会议主持人和记录人重复人员验证
			/*
			 * if (!AddConferenceView.validateCompereAndRecorder()) return;
			 */
			fm.getForm().submit({
				url : __ctxPath + '/admin/sendConference.do',
				method : 'post',
				waitMsg : '数据正在发送，请稍后...',
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作信息', '成功发送会议申请信息,等待审批！');
					Ext.getCmp('AddConferenceViewPanel').getForm().reset();
					// Ext.getCmp('resumeFilePanel').body.update('');
					App.clickTopTab('DaiConfApplyView');
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
	}

});

/**
 * 判断会议主持人和记录人是否存在重复,重复false 主持人---记录人,一对一，一对多,多对一时才会重复
 */
AddConferenceView.validateCompereAndRecorder = function() {
	var fm = Ext.getCmp('AddConferenceView.jonerPanel');
	var compere = fm.getCmpByName('conference.compere').value.split(',');
	var recorder = fm.getCmpByName('conference.recorder').value.split(',');
	var bo = true;
	if (compere.length == 1 && recorder.length == 1) { // 一对一
		if (compere[0].search(recorder) >= 0)
			bo = false;
	} else if (compere.length == 1 && recorder.length != 1) {// 一对多
		for (var i = 0; i < recorder.length; i++) {
			if (recorder[i].search(compere) >= 0)
				bo = false;
		}
	} else if (compere.length != 1 && recorder.length == 1) { // 多对一
		for (var i = 0; i < compere.length; i++) {
			if (compere[i].search(recorder) >= 0)
				bo = false;
		}
	}
	if (bo == false) {
		fm.getCmpByName('conference.compereName').focus(true);
		Ext.ux.Toast.msg('操作提示', '对不起，会议主持人和记录人不能出现重复，请重新选择！');
	}
	return bo;
};


checkStartAndEndTime=function(){	
	var bo = true;
	var fm = Ext.getCmp('AddConferenceViewPanel');
	// 转换日期	,长/短期会议的开始以及结束时间的判断			
	var date3 = new Date();
	var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
			+ "-" + date3.getDate() + " " +fm.getCmpByName('tempStartTime').value;
	var d3 = dd3.replace(/\-/g, '\/');
	var testST = new Date(d3); //会议开始时间

    var date3 = new Date();
	var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
			+ "-" + date3.getDate() + " " +fm.getCmpByName('tempEndTime').value;
	var d3 = dd3.replace(/\-/g, '\/');
	var testET = new Date(d3);//会议结束时间			
if (testST >=testET) {	
	bo=false;
}	
return bo;
};
