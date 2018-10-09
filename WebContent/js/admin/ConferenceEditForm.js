/**
 * @createtime 2010-10-9 PM
 * @class ConferenceEditForm
 * @extends Ext.Window
 * @description 申请人查看以及修改会议信息
 * @company 捷达世软件
 * @author YHZ
 */
ConferenceEditForm = Ext.extend(Ext.Window, {
	// store
	store : null,
	gridPanel : null,
	formPanel : null,	// 会议基本信息	
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
		ConferenceEditForm.superclass.constructor.call(this, {
					id : 'ConferenceEditFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					maximizable : true,
					width : 820,
					height : 590,
					autoScroll : false,
					title : '会议信息查询|修改',
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		// 会议信息设置
		this.basePanel = new Ext.form.FieldSet({
			id : 'ConferenceEditForm.basePanel',
			title : '会议信息',
			layout : 'form',
			border : true,
			items : [{
				layout : 'column',
				columnWidth : 1,
				border : false,
				defaults : {
					border : false,
					width : 350
				},
				items : [{
					layout : 'form',
					columnWidth : .5,
					defaults : {
						width : 600
					},
					items : [{
								xtype : 'hidden',
								name : 'conference.confId',
								value : this.confId != null ? this.confId : ''
							}, {
								xtype : 'hidden',
								id:'ConferenceEditForm_statusVal2',
								name : 'statusVal2',
								value : this.statusVal2 != null
										? this.statusVal2
										: 0
							},{
								xtype : 'hidden',
								id:'ConferenceEditForm_isLong0',
								name : 'isLong0',
								value : this.ifIsLong != null
										? this.ifIsLong
										: 0
							
							}, {
								xtype : 'textfield',
								id:'ConferenceEditForm_confTopic',
								//id : 'conference.confTopic',
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
								id : 'ConferenceEditForm.confProperty',
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
											name:'conference.contUser.fullname',
											readOnly : true,
											allowBlank : false,
											blankText : '请选择联系人！',
											width : 150,
											maxLength : 256,
											maxLengthText : '数据长度不能超过256个字符！'
										}, {
											xtype : 'button',
											id : 'contactUserNameBtn',
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
										},{
											xtype:'hidden',
											id:'conference.contactUser',
											name:'conference.contUser.userId'
										}]
							},{
								xtype : 'container',
								id : 'ConferenceEditForm.isLongBook2',
								layout : 'column',
								//hidden : true,
								items : [{
											xtype : 'label',
											text : '是否长期预定:',
											width : 104
										}, {								
								hiddenName : 'conference.isLong',
								id : 'ConferenceEditForm.isLongMy',
								xtype : 'combo',
								mode : 'local',
								width : 150,
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
							},{
								xtype : 'container',
								id : 'ConferenceEditForm.bookTypeEditForm',
								layout : 'column',
								//hidden : true,
								items : [{
											xtype : 'label',
											text : '预定星期:',
											width : 104
										}, {
											hiddenName : 'countNum2',
											id : 'ConferenceEditForm.countNum2My',
											xtype : 'combo',
											mode : 'local',
											allowBlank : false,
											editable : false,
											width : 96,
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
						width : 260
					},
					items : [{
								xtype : 'hidden',
								id : 'ConferenceEditForm.roomName',
								name : 'conference.roomName'
							},{
								xtype : 'combo',
								id : 'ConferenceEditForm.roomId00',
								hiddenName : 'conference.roomId',
								fieldLabel : '会议室名称',
								valueField : 'roomId',
								displayField : 'roomName',
								mode : 'local',
								editable : false,
								emptyText : '--请选择会议室--',
								triggerAction : 'all',
								forceSelection : true,
								allowBlank : false,
								width : 150,
								blankText : '请选择会议室！',
								store : new Ext.data.SimpleStore({
									url : __ctxPath
											+ '/admin/getBoardrooConference.do',
									autoLoad : true,
									fields : ['roomId', 'roomName'],
									listeners : {
										scope : this,
										load : function() {
											var cmp = Ext.getCmp('ConferenceEditForm.roomId00');
//											alert(cmp.hiddenField.value);
											if (cmp.hiddenField.value)
												cmp
														.setValue(cmp.hiddenField.value);
											this
													.getCmpByName('conference.roomName')
													.setValue(cmp.getRawValue());
										}
									}
								}),
								listeners : {
									select : function(cbo, record, index) {
										// alert(cbo.getRawValue());
										Ext.getCmp('ConferenceEditForm.roomName')
												.setValue(cbo.getRawValue());
									}
								}
							}, {
								xtype : 'combo',
								id : 'ConferenceEditForm.radiogroup',
								name : 'conference.importLevel',
								fieldLabel : '会议级别',
								border : false,
								width:150,
								mode : 'local',
								triggerAction : 'all',
								store : [ [ '1', '总部' ],
								          [ '2', '分公司' ],
								          [ '3', '部' ],
								          [ '4', '科室' ]],
								emptyText : '---请选择会议级别---'
							}, {
								xtype : 'numberfield',
								id : 'ConferenceEditForm.contactTel',
								name : 'conference.contactTel',
								fieldLabel : '联系电话',
								width : 150,
								allowBlank : false,
								blankText : '请输入正确类型的联系电话！'
							},{
								
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConferenceEditForm.typeAboultBookEditForm',
								layout : 'column',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '预定类别:',
											width : 104
										}, {
											hiddenName : 'isTypeAboultBook',
											id : 'ConferenceEditForm.typeAboultBook2My',
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
														Ext.getCmp('ConferenceEditForm.bookTypeEditForm')
																.show();														
														Ext.getCmp('ConferenceEditForm.tempStartDateMy').show();
														Ext.getCmp('ConferenceEditForm.tempStartTimeMy').show();
														Ext.getCmp('ConferenceEditForm.tempEndDateMy').show();
													}
													if (index == '1') {														
														//Ext.getCmp('countText').show();
														Ext.getCmp('ConferenceEditForm.bookTypeEditForm')
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
			id : 'ConferenceEditForm.jonerPanel',
			title : '参加人员',
			layout : 'form',
			border : true,
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
									id : 'ConferenceEditForm.compereName',
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
															.getCmp('ConferenceEditForm.jonerPanel');
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
											.getCmp('ConferenceEditForm.jonerPanel');
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
									id : 'ConferenceEditForm.recorderName',
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
															.getCmp('ConferenceEditForm.jonerPanel');
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
									id : 'ConferenceEditForm.attendUsersName',
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
															.getCmp('ConferenceEditForm.jonerPanel');
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
											var fm = Ext.getCmp('ConferenceEditForm.jonerPanel');
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
					id : 'ConferenceEditForm.contextPanel',
					layout : 'column',
					columnWidth : 1,
					border : true,
					items : [{
								columnWidth : .5,
								layout : 'form',
								border : false,
								defaults : {
						        width : 600
					           },
								items : [{
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfEditForm_sDateEditForm',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '开始日期:',
											width : 105
										}, {
											width:200,
											id:'ConferenceEditForm.tempStartDateMy',
											xtype : 'datetimefield',
											format : 'Y-m-d',
											editable : false,
											anchor : '98%,98%',
											name : 'tempStartDate',
											listeners:{select:function(){
												var ifIsLong=Ext.getCmp('ConferenceEditForm_isLong0').getValue();
												if(ifIsLong==0){//短期会议同步开始日期以及结束日期													
													var startDate=Ext.getCmp('ConferenceEditForm.tempStartDateMy').getValue();
													Ext.getCmp('ConferenceEditForm.tempEndDateMy').setValue(startDate);													
												}
												}
											}
										}]
								},{
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfEditForm_sTimeEditForm',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '开始时间:',
											width : 105
										}, {
											width:200,
											id:'ConferenceEditForm.tempStartTimeMy',
										    xtype : 'timefield',
											format : ' H:i',
											editable : false,
											anchor : '98%,98%',
											name : 'tempStartTime',
											minValue:'07:00',
											increment:30
											}]								
								}]
							}, {
								columnWidth : .5,
								layout : 'form',
								border : false,
								defaults : {
								width : 600								
								},
								items : [{								
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfEditForm_eDateEditForm',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '结束日期:',
											width : 105
										}, {
											width:200,
											id:'ConferenceEditForm.tempEndDateMy',
											anchor : '98%,98%',
											name : 'tempEndDate',//名字不可更改（后台接收数据）
											xtype : 'datetimefield',
											format : 'Y-m-d',
											listeners:{select:function(){
												var ifIsLong=Ext.getCmp('ConferenceEditForm_isLong0').getValue();
												if(ifIsLong==0){//短期会议同步开始日期以及结束日期														
													var startDate=Ext.getCmp('ConferenceEditForm.tempEndDateMy').getValue();
													Ext.getCmp('ConferenceEditForm.tempStartDateMy').setValue(startDate);													
												   }
											     }	
										       }
										      }]
								},{								
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfEditForm_eTimeEditForm',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '结束时间:',
											width : 105
										}, {
											width:200,
											id:'ConferenceEditForm.tempEndTimeMy',
										    xtype : 'timefield',
											format : 'H:i',
											editable : false,
											anchor : '98%,98%',
											name : 'tempEndTime',
											minValue:'07:00',
											increment:30										
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
											id : 'ConferenceEditForm.confContent',
											xtype : 'htmleditor',
											height : 100,
											width : 800,
											fieldLabel : '会议要求',
											allowBlank : false,
											blankText : '请输入会议内容！',
											maxLength : 4000,
											maxLengthText : '会议内容不能超过4000个字符长度！'
										}]
							},{
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
											width : 800,
											height : 75,
											maxLength : '500',
											maxLengthText : '会议室描述不能超过500个字符长度！'
										}]
							}]
				}); // end of this contextPanel

		this.formPanel = new Ext.FormPanel({
					id : 'ConferenceEditFormPanel',
					autoScroll : true,
					layout : 'form',
					region : 'center',
					bodyStyle : 'padding-left: 5%;padding-right : 100px',
					border : false,
					defaults : {
						readOnly : true
					},
					items : [{
								id : 'ConferenceEditFormAllfieldset',
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
								}		// this.applyPanel, this.filePanel
								],
								buttons : [{
											// text : '暂存会议信息',
											text : '保存',
											id : 'ConferenceEditForm.saveBtn',
											iconCls : 'temp',
											handler : this.save
													.createCallback(this)
										},{
											text : '取消',
											iconCls : 'btn-cancel',
											handler : this.cancel.createCallback(this)
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
							var valueS=Ext.getCmp('ConferenceEditForm_statusVal2').getValue();							
					//赋值													
							var startTTemp=cf.data.startTime;
							var endTTemp=cf.data.endTime;
									// 转换日期
							var d3 = startTTemp.replace(/\-/g, '\/');
							var date3 = new Date(d3);
							var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
									+ "-" + date3.getDate();
							var d3 = dd3.replace(/\-/g, '\/');
							var startTTemp1 = new Date(d3);
							
							var d3 = endTTemp.replace(/\-/g, '\/');
							var date3 = new Date(d3);
							var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
									+ "-" + date3.getDate();
							var d3 = dd3.replace(/\-/g, '\/');
							var endTTemp1 = new Date(d3);
							
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
							var fm = Ext.getCmp('ConferenceEditFormPanel');
							fm.getCmpByName('tempStartDate').setValue(startTTemp1);
							fm.getCmpByName('tempStartTime').setValue(startTTemp2);
							fm.getCmpByName('tempEndDate').setValue(endTTemp1);
							fm.getCmpByName('tempEndTime').setValue(endTTemp2);
							
							var comp = (cf.data.compereDeptName?cf.data.compereDeptName:'')+(cf.data.compereName?','+cf.data.compereName:'');
							Ext.getCmp('ConferenceEditForm.compereName').setValue(comp);
							var comp = (cf.data.attendDeptName?cf.data.attendDeptName:'')+(cf.data.attendUsersName?','+cf.data.attendUsersName:'');
							Ext.getCmp('ConferenceEditForm.attendUsersName').setValue(comp);
							if (valueS == 0) {
								//只可查看，隐藏以及置灰某些控件
								var cmp = Ext.getCmp('ConferenceEditForm.basePanel');
								Ext.getCmp('ConferenceEditForm_confTopic').disable();
								Ext.getCmp('ConferenceEditForm.confProperty').disable();
								Ext.getCmp('ConferenceEditForm.contactTel').disable();
								Ext.getCmp('contactUserName').disable();
								Ext.getCmp('ConferenceEditForm.roomId00').disable();
								Ext.getCmp('ConferenceEditForm.radiogroup').disable();
								var cmp2 = Ext
										.getCmp('ConferenceEditForm.jonerPanel');
								Ext.getCmp('ConferenceEditForm.compereName').disable();
								Ext.getCmp('ConferenceEditForm.recorderName').disable();
								Ext.getCmp('sponsorDeptName').disable();
								Ext.getCmp('sponsorDeptBtn').disable();
								Ext.getCmp('ConferenceEditForm.attendUsersName')
										.disable();
								var cmp3 = Ext.getCmp('ConferenceEditForm.contextPanel');
								cmp3.getCmpByName('conference.confContent')
										.disable();
								cmp3.getCmpByName('conference.attendConfine')
								.disable();
								Ext.getCmp('compereNameBtn').disable();
								Ext.getCmp('compereDeptNameBtn').disable();
								Ext.getCmp('contactUserNameBtn').disable();
								Ext.getCmp('recorderNameBtn').disable();	
								Ext.getCmp('attendUsersNameBtn').disable();
								Ext.getCmp('attendDeptNameBtn').disable();
								Ext.getCmp('ConferenceEditForm.saveBtn').hide();
								//Ext.getCmp('ConferenceEditForm.typeAboultBookEditForm').disable();								
							   // Ext.getCmp('ConferenceEditForm.eTimeForLongEditForm').hide();
							    Ext.getCmp('ConferenceEditForm.bookTypeEditForm').hide();
							    Ext.getCmp('ConferenceEditForm.typeAboultBookEditForm').hide();   
							    Ext.getCmp('ConferenceEditForm.isLongBook2').disable();	
							    Ext.getCmp('ConferenceEditForm.tempEndDateMy').disable();//结束日期
							    Ext.getCmp('ConferenceEditForm.tempStartDateMy').disable();//开始日期
							    Ext.getCmp('ConferenceEditForm.tempStartTimeMy').disable();//开始时间
							    Ext.getCmp('ConferenceEditForm.tempEndTimeMy').disable();//结束时间
							}
							var ifIsLong=Ext.getCmp('ConferenceEditForm_isLong0').getValue();	
								Ext.getCmp('ConferenceEditForm.isLongBook2').disable();	
							if(ifIsLong==0){							
							   // Ext.getCmp('ConferenceEditForm.eTimeForLongEditForm').show();
								Ext.getCmp('ConferenceEditForm.typeAboultBookEditForm').hide();									
								Ext.getCmp('ConferenceEditForm.bookTypeEditForm').hide();														
								}
								else {//长期								
								 if(ifIsLong==1){									
									//只用于与我相关会议的子笔查询时可查看会议的开始以及结束时间
									 Ext.getCmp('ConferenceEditForm.isLongBook2').hide();															
								}
								 var cfCountNum=cf.data.bookType;
								if(cfCountNum!=8){								
								 Ext.getCmp('ConferenceEditForm.typeAboultBook2My').setValue(1);//按星期
								 Ext.getCmp('ConferenceEditForm.countNum2My').setValue(cfCountNum);	
								}else{
								Ext.getCmp('ConferenceEditForm.typeAboultBook2My').setValue(2);//按天数
								Ext.getCmp('ConferenceEditForm.bookTypeEditForm').hide();
								}
									
							}		  				
			},
				failure : function() {
					Ext.ux.Toast.msg('操作提示', '数据加载失败！');
				}
					});
		          }
	}, // end of this initUIComponent
	/**
	 * 取消
	 */
	cancel : function(window) {
		window.close();
	},
	save : function(window) {
        var fm = Ext.getCmp('ConferenceEditFormPanel');		
	if (fm.getForm().isValid()) {		
		var ifIsLong=Ext.getCmp('ConferenceEditForm.isLongMy').getValue();			
		var bookTempStartD= Ext.getCmp('ConferenceEditForm.tempStartDateMy').getValue();
		var bookTempStartT= Ext.getCmp('ConferenceEditForm.tempStartTimeMy').getValue();
		var bookTempEndD= Ext.getCmp('ConferenceEditForm.tempEndDateMy').getValue();
		var bookTempEndT= Ext.getCmp('ConferenceEditForm.tempEndTimeMy').getValue();
		var bookType = Ext.getCmp('ConferenceEditForm.typeAboultBook2My').getValue();// 预定的类别			
		var countNum = Ext.getCmp('ConferenceEditForm.countNum2My').getValue();
	        if (bookTempStartD == null) {				
				Ext.ux.Toast.msg('操作提示', '请输入会议开始日期！');
				Ext.getCmp('ConferenceEditForm.tempStartDateMy').focus(true);
				return;
			}
			if (bookTempStartT == null) {				
				Ext.ux.Toast.msg('操作提示', '请输入会议开始时间！');
				Ext.getCmp('ConferenceEditForm.tempStartDateMy').focus(true);
				return;
			}
			if (bookTempEndD == null) {				
				Ext.ux.Toast.msg('操作提示', '请输入会议结束日期！');
				Ext.getCmp('ConferenceEditForm.tempEndDateMy').focus(true);
				return;
			}			
			if (bookTempEndT == null) {				
				Ext.ux.Toast.msg('操作提示', '请输入会议结束时间！');
				Ext.getCmp('ConferenceEditForm.tempEndTimeMy').focus(true);
				return;
			}						
		   var startDC = bookTempStartD.getFullYear() + "-" + (bookTempStartD.getMonth() + 1) + "-"
				+ bookTempStartD.getDate();		  
		   var endDC = bookTempEndD.getFullYear() + "-" + (bookTempEndD.getMonth() + 1) + "-"
				+ bookTempEndD.getDate();				
			var ifIsLong=Ext.getCmp('ConferenceEditForm.isLongMy').getValue();	
		    if(ifIsLong==0){//短期会议室日期的判断
				if (!(startDC==endDC)) {
					Ext.ux.Toast.msg('操作提示', '短期会议:开始日期以及结束日期必须是同一天，请重新输入！');
					Ext.getCmp('ConferenceEditForm.tempStartDateMy').focus(true);
					return;
				}			
			}else{//长期会议室日期的判断
				if (Ext.getCmp('ConferenceEditForm.tempStartDateMy').getValue() >= Ext
						.getCmp('ConferenceEditForm.tempEndDateMy').getValue()) {
					Ext.ux.Toast.msg('操作提示', '长期会议:结束日期必须比开始日期大，请重新输入！');
					Ext.getCmp('ConferenceEditForm.tempStartDateMy').focus(true);
					return;
				}				
			}				
		   var date = new Date();			
		   var dd3 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-"
				+ date.getDate();
		   var d3 = dd3.replace(/\-/g, '\/');
		   var tempDateNow=new Date(d3);	
		
		if (Ext.getCmp('ConferenceEditForm.tempStartDateMy').getValue() < tempDateNow) {
			Ext.ux.Toast.msg('操作提示', '会议开始日期比实际时间小！');
			Ext.getCmp('ConferenceEditForm.tempStartDateMy').focus(true);
			return;
		} 		
		   var date3 = new Date();
		   var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
						+ "-" + date3.getDate() + " " +fm.getCmpByName('tempStartTime').value
		   var d3 = dd3.replace(/\-/g, '\/');
		   var testST = new Date(d3); //长期会议室的开始时间
			
		   var date3 = new Date();
		   var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
						+ "-" + date3.getDate() + " " +fm.getCmpByName('tempEndTime').value
		   var d3 = dd3.replace(/\-/g, '\/');
		   var testET = new Date(d3);//长期会议室的结束时间		
			if (testST >=testET) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间段有误，请重新输入！');
				Ext.getCmp('ConferenceEditForm.tempStartTimeMy').focus(true);
				return;
			}						
			else{												
				fm.getForm().submit({
							url : ( ifIsLong==0?(__ctxPath + '/admin/tempConference.do'):(__ctxPath + '/admin/myLongConfAdjustConference.do')),
							method : 'post',
							params : {						
									bookType : bookType,
									//tempStartTime : bookTempStartT, 从form中传入
									countNum : countNum
									//tempEndTime : bookTempEndT 从form中传入
									//tempStartDate:bookTempStartD, 从form中传入
									//tempEndDate:bookTempEndD 从form中传入
								},
							waitMsg : '数据正在保存，请稍后...',
							success : function(fp, action) {
								Ext.ux.Toast.msg('操作信息', '成功保存信息！');				
									Ext.getCmp('ConferenceEditFormWin').close();
										var gridPanel = Ext.getCmp('MyJoinedConferenceGrid');
										if (gridPanel != null) {
											gridPanel.getStore().reload();
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
	},
reset : function() {
		Ext.getCmp('AddConferenceViewPanel').getForm().reset();		
	}
});