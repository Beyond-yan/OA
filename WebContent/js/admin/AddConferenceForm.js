/**
 * @description 会议申请
 * @author YHZ
 * @company
 * @dateTime 2010-11-5PM
 */
AddConferenceForm = Ext.extend(Ext.Panel, {
	// store
	store : null,
	gridPanel : null,
	// 内嵌FormPanel
	formPanel : null,
	// 会议基本信息
	basePanel : null,
	// 会议内容
	contextPanel : null,

	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		AddConferenceForm.superclass.constructor.call(this, {
					id : 'AddConferenceForm',
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
		var systemDate = document.getElementById('systemDate').value;
		today = Date.parseDate(systemDate,'Y-m-d h:i:s');
//		today.setTime(newDate.getTime()-24*60*60*1000);	
		// 会议信息设置
		this.basePanel = new Ext.form.FieldSet({
			id : 'AddConferenceForm.basePanel',
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
								fieldLabel : '会议名称',
								allowBlank : false,
								blankText : '会议名称不能为空！',
								maxLength : 128,
								maxLengthText : '会议名称不能超过128个字符长度！',
								width : 150
							}, {
								xtype : 'hidden',
								name : 'conference.typeId'
							}, {
								id:'conference.contactUser',
								name:'conference.contUser.userId',
								xtype : 'hidden',
								value : curUserInfo.userId
							}, {
								name : 'conference.importLevel',
								xtype : 'hidden',
								value : 1
							}, {
								xtype : 'textfield',
								fieldLabel : '会议联系人',
								name : 'contactName',
								readOnly : true,
								maxLength : 128,
								width : 150,
								value : curUserInfo.fullname
							}/*, {
								fieldLabel : '是否长期预定',
								hiddenName : 'conference.isLong',
								id : 'AddConferenceForm.isLong',
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
											Ext.getCmp('AddConferenceForm.typeAboultBook').hide();
											Ext.getCmp('AddConferenceForm.countNum').hide();
											Ext.getCmp('AddConferenceForm.tempStartDate').setValue('');
											Ext.getCmp('AddConferenceForm.tempEndDate').setValue('');											
										}
										if (index == '1') {											
											Ext.getCmp('AddConferenceForm.typeAboultBook').show();
											Ext.getCmp('AddConferenceForm.countNum').show();
											Ext.getCmp('AddConferenceForm.tempStartDate').setValue('');
											Ext.getCmp('AddConferenceForm.tempEndDate').setValue('');							
										}
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
								xtype : 'hidden',
								id : 'AddConferenceForm.roomName',
								name : 'conference.roomName',
								value : this.roomName != null ? this.roomName : ''
							},{
								xtype : 'combo',
								id : 'AddConferenceForm.roomId',
								hiddenName : 'conference.roomId',
								value : this.roomId != null ? this.roomId : '',
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
											var cmp = Ext.getCmp('AddConferenceForm.roomId');
											if (cmp.hiddenField.value)
												cmp.setValue(cmp.hiddenField.value);
											/*this.getCmpByName('conference.roomName').setValue(cmp.dom.value);*/
										}
									}
								}),
								listeners : {
									select : function(cbo, record, index) {										
										Ext.getCmp('AddConferenceForm.roomName')
												.setValue(cbo.getRawValue());
									}
								}
							}, {
								xtype : 'textfield',
								name : 'conference.contactTel',
								fieldLabel : '联系电话',
								width : 130,
								blankText : '请输入正确类型的联系电话！'
							}]
				}]
			}]								
		}); // end of this basePanel

		// 会议内容contextPanel
		this.contextPanel = new Ext.form.FieldSet({
			title : '时间和内容设置',
			layout : 'column',
			columnWidth : 1,
			border : true,
			items : [/*{
						columnWidth : .33,
						layout : 'form',
						border : false,
						defaults : {
						width : 600
					},
						items : [{
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
								},{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'AddConferenceForm.startDateforLong',
									layout : 'column',
									//hidden : true,
									anchor : '98%,98%',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '会议日期:',//长期会议的开始日期
												width : 105
											}, {
												id : 'AddConferenceForm.tempDate',
												style:'padding-left:72px',
												xtype : 'datetimefield',
												format : 'Y-m-d',
												editable : false,
												value : this.startDate != null ? this.startDate : null,
												name : 'tempDate',
												width : 160,
												minValue:new Date().format('Y-m-d'),
												allowBlank : false,
												listeners:{select:function(){
													//申请日期不能小于当天
													var startDate = Ext.getCmp('AddConferenceForm.tempDate').getValue();
													
												}
											}
										}]
								}]
					}, *//*{
						columnWidth : .33,
						layout : 'form',
						border : false,
						width : 600,
						defaults : {
							width : 600
						},
						items : [{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'AddConferenceView.dateStartTime',
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
												format : 'H:i',
												editable : false,
												minValue: '9:00',
   												maxValue: '17:30',
												name : 'tempStartTime',
												style:'padding-left:110px',
												value : this.tempStartTime != null ? this.tempStartTime : null,
												increment:15,
												allowBlank : false
										}]
								}]
					}, *//*{
						columnWidth : .33,
						layout : 'form',
						border : false,
						width : 600,
						defaults : {
							width : 600
						},
						items : [{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'AddConferenceView.dateEndTime',
									layout : 'column',
//									anchor : '98%,98%',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '结束时间:',//长期会议的开始时间
												width : 105
											}, {
												id : 'AddConferenceView.tempEndTime',
												xtype : 'timefield',
												format : 'H:i',
												editable : false,
												name : 'tempEndTime',
												style:'padding-left:110px',
												minValue: '9:00',
   												maxValue: '17:30',
												value : this.tempEndTime != null ? this.tempEndTime : null,
												increment:15,
												allowBlank : false
										}]
								}]
					}, */{
						columnWidth : .5,
						layout : 'form',
						border : false,
						width : 600,
						defaults : {
							width : 600
						},
						items : [{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'AddConferenceView.dateStartTime',
									layout : 'column',
//									anchor : '98%,98%',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '开始时间:',//长期会议的开始时间
												width : 105
											}, {
												id : 'AddConferenceView.tempStartTime',
												xtype : 'datetimefield',
												format : 'Y-m-d H:i',
												editable : false,
												width : 170,
												minValue: today.format('Y-m-d'),
												name : 'tempStartTime',
//												style:'padding-left:30px',
												value : this.tempStartTime != null ? this.tempStartTime : null,
												increment:15,
												allowBlank : false
										}]
								}]
					}, {
						columnWidth : .5,
						layout : 'form',
						border : false,
						width : 600,
						defaults : {
							width : 600
						},
						items : [{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'AddConferenceView.dateEndTime',
									layout : 'column',
//									anchor : '98%,98%',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '结束时间:',//长期会议的开始时间
												width : 105
											}, {
												id : 'AddConferenceView.tempEndTime',
												xtype : 'datetimefield',
												format : 'Y-m-d H:i',
												width : 170,
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
						height : 130,
						width : 550,
						border : false,
						items : [{
									name : 'conference.confContent',
									xtype : 'htmleditor',
									height : 120,
									width : 550,
									fieldLabel : '准备事项',
									allowBlank : false,
									blankText : '请输入会议内容！',
									maxLength : 4000,
									maxLengthText : '会议内容不能超过4000个字符长度！',
									value : '是否需要座牌栏位，如果需要，请填写座牌栏位信息！'
								}]
					}]
		}); // end of this contextPanel
		this.noticePanel=new Ext.Panel({
			style : 'padding:0px 0px 0px 0px;margin-left:6px;',
			id : 'conferenceNoticePanel',
			border:false,
			autoHeight:true,
			layout:'column',
			items:[{
					xtype : 'label',
					style : 'padding:0px 0px 0px 0px;',
					text : '提醒审核人：',
					width : 80
				},{
					xtype:'checkbox',
					name:'sendConferenceMsg',
					inputValue:'true',
					boxLabel:'发送短信',
					columnWidth:.16,
					listeners : {
						'check' : function(checkbox, checked){
							if(checked){//只有在点击时触发
								Ext.getCmp('conferenceNoticePanel').getCmpByName('sendConferenceMsg').setValue(true);
							}   
						}
					}
				}
			]//end of panel items
		});
		this.formPanel = new Ext.FormPanel({
					id : 'AddConferenceFormPanel',
					autoScroll : true,
					layout : 'form',
					region : 'center',
					bodyStyle : 'padding-left: 5%;padding-right : 100px',
					border : false,
					defaults : {
						readOnly : true
					},
					items : [{
								id : 'AddConferenceFormAllfieldset',
								xtype : 'fieldset',
								title : '会议室申请',
								bodyStyle : 'padding:5px 5px 5px 5px',
								layout : 'form',
								buttonAlign : 'center',
								items : [this.basePanel, this.contextPanel,this.noticePanel, {
									layout : 'column',
									border : false,
									columnWidth : 1,
									defaults : {
										border : false
									}
								}],
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
		Ext.getCmp('AddConferenceFormPanel').getForm().reset();
		// Ext.getCmp('resumeFilePanel').body.update('');
	},

	/**
	 * 保存
	 */
	save : function(window) {
//		var startDate = Ext.getCmp('AddConferenceForm.tempDate').getValue();
		var startTime = Ext.getCmp('AddConferenceView.tempStartTime').getValue();
		var endTime = Ext.getCmp('AddConferenceView.tempEndTime').getValue();
/*		var nowStartDate = startDate.format('Y/m/d');
		var nowStartTime = nowStartDate+" "+startTime;
		var nowEndTime = nowStartDate+ " "+ endTime;*/
		if(!(startTime < endTime)){
			alert("请确认开始时间是否小于结束时间！");
			return false;
		}
		var fm = Ext.getCmp('AddConferenceFormPanel');
			if (fm.getForm().isValid()) {
				fm.getForm().submit({
					url : __ctxPath + '/admin/tempConference.do',
					method : 'post',
					waitMsg : '数据正在保存，请稍后...',
					success : function(fp, action) {
						Ext.ux.Toast.msg('操作信息', '成功保存信息！');					
						AppUtil.removeTab("AddConferenceForm");
//						App.clickTopTab('MyJoinedConferenceView');
						//如果我发起的页面已经打开则进行重新加载
						/*if((null!=(Ext.getCmp('MyJoinedConferenceGrid')))&&('undenfied'!=Ext.getCmp('MyJoinedConferenceGrid'))){							
							Ext.getCmp('MyJoinedConferenceGrid').getStore().reload({
							params : {
								start : 0,
								limit : 25
							}
						});										
						}*/
						//刷新会议申请图形页面					
						var search=Ext.getCmp('ConfBoardroom');
						var storeSearch=search.store;
						if((null!=(storeSearch))&&('undenfied'!=storeSearch)){
						//storeSearch.load();							
						storeSearch.reload();		
						var picP=Ext.getCmp('ConfBoardroom.picPanel');							
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
	/**
	 * 发送
	 */
	/*send : function(window) {
		var fm = Ext.getCmp('AddConferenceFormPanel');
		if (fm.getForm().isValid()) {
			// 开会时间验证
			if (fm.getCmpByName('conference.tempStartDate').value >= fm
					.getCmpByName('conference.tempEndDate').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.tempStartDate').focus(true);
				return;
			}
			// 会议主持人和记录人重复人员验证
			
			 * if (!AddConferenceView.validateCompereAndRecorder()) return;
			 
			fm.getForm().submit({
				url : __ctxPath + '/admin/sendConference.do',
				method : 'post',
				waitMsg : '数据正在发送，请稍后...',
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作信息', '成功发送会议申请信息,等待审批！');
					Ext.getCmp('AddConferenceFormPanel').getForm().reset();
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
	}*/

});

/*checkStartAndEndTime=function(){	
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
};*/
