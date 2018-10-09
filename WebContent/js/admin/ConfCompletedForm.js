/**
 * @createtime 2010-10-9 PM
 * @class ConfCompletedForm
 * @extends Ext.Window
 * @description 会议使用权调整
 * @company 捷达世软件
 * @author YHZ
 */
ConfCompletedForm = Ext.extend(Ext.Window, {
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
		ConfCompletedForm.superclass.constructor.call(this, {
					id : 'ConfCompletedFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					maximizable : true,
					width : 730,
					height : 540,
					autoScroll : false,
					title : '会议使用权调整/使用时间调整',
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var btnV = this.btnV;
		var isLong11 = this.isLong11;
		// 会议信息设置
		this.basePanel = new Ext.form.FieldSet({
			id : 'ConfCompletedForm.basePanel',
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
								id : 'ConfCompletedForm.confTopic',
								name : 'conference.confTopic',
								fieldLabel : '会议主题',
								allowBlank : false,
								blankText : '会议标题不能为空！',
								maxLength : 128,
								maxLengthText : '会议标题不能超过128个字符长度！',
								readOnly : true

							}, {
								xtype : 'hidden',
								name : 'conference.typeId'
							}, {
								xtype : 'combo',
								id : 'ConfCompletedForm.confProperty',
								name : 'conference.confProperty',
								fieldLabel : '会议类型',
								valueField : 'typeId',
								displayField : 'typeName',
								mode : 'local',

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
												.getCmp('ConfCompletedForm.basePanel');
										fm.getCmpByName('conference.typeId')
												.setValue(cbo.getRawValue());
									}
								}
							}, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfCompletedForm.sTimeforShort',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '开始日期:',//短期会议的开始日期
											width : 105
										}, {
											xtype : 'datetimefield',
											format : 'Y-m-d H:i:s',
											editable : false,
											width : 200,
											name : 'conference.startTime',
											id : 'ConfCompletedForm.startTime'
										}]
							},{

								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfCompletedForm.sDateforLong',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '开始日期:',
											width : 105
										}, {
											width : 200,
											id : 'ConfCompletedForm.tempStartDate1',
											xtype : 'datefield',
											format : 'Y-m-d',
											editable : false,
											anchor : '98%,98%',
											name : 'tempStartDate1',
											listeners:{select:function(){												
												if(isLong11==0){//如果是短期会议室，则开始时间以及结束时间必须是同 一天
												var startDate=Ext.getCmp('ConfCompletedForm.tempStartDate1').getValue();
												Ext.getCmp('ConfCompletedForm.tempEndDate1').setValue(startDate);													
											    }
											}
										}
										}]
							}, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfCompletedForm.sTime2forLong',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '开始时间:',
											width : 105
										}, {
											width : 200,
											id : 'ConfCompletedForm.tempStartTime1',
											xtype : 'timefield',
											format : ' H:i',
											editable : false,
											anchor : '98%,98%',
											name : 'tempStartTime1',
											minValue:'07:00',
											increment:30
										}]
							},{
								xtype : 'hidden',
								name : 'conference.depId',
								value : this.confId != null ? this.confId : ''
							}, {
								xtype : 'textfield',
								id : 'ConfCompletedForm.depName',
								name : 'conference.depName',
								fieldLabel : '申请人部门',
								allowBlank : false,
								blankText : '申请人部门不能为空！',
								maxLength : 128,
								maxLengthText : '申请人部门信息不能超过128个字符长度！',
								readOnly : true
							}, {							
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfCompletedForm.typeConfCompleted',
								layout : 'column',								
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '预定类别:',
											width : 104
										}, {
											hiddenName : 'conference.isLong',
											id : 'ConfCompletedForm.isLong',
											xtype : 'combo',
											mode : 'local',
											allowBlank : false,
											editable : false,
											width : 96,
											triggerAction : 'all',
										    value : '0',
											store : [['0', '非长期预定'], ['2', '长期预定']],
											listeners : {
												scope : this,
												'select' : function(combo,
														record, index) {
													if (index == '0') {														
														Ext.getCmp('ConfCompletedForm.bookType2')
																.hide();
													}
													if (index == '1') {														
																Ext.getCmp('ConfCompletedForm.bookType2')
																.show();
													}
												}
											}										
										}]					
							}]
				}, {
					layout : 'form',
					columnWidth : .5,
					defaults : {
						width : 200
					},
					items : [{
								xtype : 'combo',
								id : 'ConfCompletedForm.radiogroupLv',
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
							}, {
								xtype : 'textfield',
								id : 'ConfCompletedForm.createBy',
								name : 'conference.contUser.fullname',
								fieldLabel : '联系人',
								readOnly : true,
								allowBlank : false,
								maxLength : 256,
								maxLengthText : '数据不能超过256字符！'

							}, {

								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfCompletedForm.eTimeforShort',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '结束时间:',
											width : 105
										}, {
											width : 200,
											name : 'conference.endTime',
											xtype : 'datetimefield',
											// xtype:'textfield',
											format : 'Y-m-d H:i:s',
											id : 'ConfCompletedForm.endTime'
										}]
							}, {

								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfCompletedForm.eDateforLong',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '结束日期:',
											width : 105
										}, {
											width : 200,
											id : 'ConfCompletedForm.tempEndDate1',
											anchor : '98%,98%',
											name : 'tempEndDate1',
											xtype : 'datefield',
											format : 'Y-m-d',
											listeners:{select:function(){												
												if(isLong11==0){//如果是短期会议室，则开始时间以及结束时间必须是同 一天
												var endDateS=Ext.getCmp('ConfCompletedForm.tempEndDate1').getValue();
												Ext.getCmp('ConfCompletedForm.tempStartDate1').setValue(endDateS);													
											    }
											}
										}
									}]
							}, {

								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfCompletedForm.eTime2forLong',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '结束时间:',
											width : 105
										}, {
											width : 200,
											id : 'ConfCompletedForm.tempEndTime1',
											xtype : 'timefield',
											format : 'H:i',
											editable : false,
											anchor : '98%,98%',
											name : 'tempEndTime1',
											minValue:'07:00',
											increment:30
										}]
							}, {
								xtype : 'textfield',
								id : 'ConfCompletedForm.phone',
								name : 'conference.contactTel',
								fieldLabel : '联系人电话',						
								maxLength : 128,
								maxLengthText : '申请人电话信息不能超过128个字符长度！',
								readOnly : true
							},{
								xtype : 'container',
								id : 'ConfCompletedForm.bookType2',
								layout : 'column',								
								items : [{
											xtype : 'label',
											text : '申请类型:',
											width : 104
										}, {
											hiddenName : 'conference.bookType',
											id : 'ConfCompletedForm.bookType',
											xtype : 'combo',
											mode : 'local',
											allowBlank : false,
											editable : false,
											width : 94,
											triggerAction : 'all',
											value : '1',
											store : [['1', '星期一'], ['2', '星期二'],
										['3', '星期三'], ['4', '星期四'],
										['5', '星期五'], ['6', '星期六'],
										['7', '星期日'], ['8', '按天数预定']]
										}]
							}					
					]
				}, {
					columnWidth : 1,
					layout : 'form',
					height : 100,
					width : 550,
					border : false,
					items : [{
								name : 'conference.confContent',
								id : 'ConfCompletedForm.confContent',
								xtype : 'textarea',
								height : 100,
								width : 550,
								fieldLabel : '会议内容',
								// allowBlank : false,
								// blankText : '请输入会议内容！',
								maxLength : 4000,
								maxLengthText : '会议内容文本不能超过4000个字符长度！',
								readOnly : true
							}]
				}]
			}]
		}); // end of this basePanel

		// 会议参加人员jonerPanel
		this.jonerPanel = new Ext.form.FieldSet({
					id : 'ConfCompletedForm.jonerPanel',
					title : '审批信息',
					layout : 'form',
					border : true,
					items : [{
								xtype : 'container',
								layout : 'hbox',								
								items : [{
											xtype : 'label',
											text : '审批意见'
										}, {
											xtype : 'textarea',
											id : 'ConfCompletedForm.checkReason',
											name : 'conference.checkReason',
											//allowBlank : false,
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
					id : 'ConfCompletedFormPanel',
					autoScroll : true,
					layout : 'form',
					region : 'center',
					border : false,
					defaults : {
						readOnly : false
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
							if (btnV == 1) {
								// 表示查看
								Ext.getCmp('ConfCompletedForm.confTopic').disable();
								Ext.getCmp('ConfCompletedForm.confProperty').disable();
								Ext.getCmp('ConfCompletedForm.createBy').disable();
								Ext.getCmp('ConfCompletedForm.confContent').disable();
								Ext.getCmp('ConfCompletedForm.radiogroupLv').disable();
								Ext.getCmp('ConfCompletedForm.phone').disable();
								//Ext.getCmp('conference.checkReason').disable();
								Ext.getCmp('ConfCompletedForm.depName').disable();
								Ext.getCmp('ConfCompletedForm.startTime').disable();
								Ext.getCmp('ConfCompletedForm.endTime').disable();
								Ext.getCmp('ConfCompletedForm.isLong').disable();
								Ext.getCmp('ConfCompletedForm.bookType2').disable();
								Ext.getCmp('ConfCompletedForm.nextBtn').hide();
								Ext.getCmp('ConfCompletedForm.sDateforLong').hide();
								Ext.getCmp('ConfCompletedForm.eDateforLong').hide();
							    Ext.getCmp('ConfCompletedForm.sTime2forLong').hide();
								Ext.getCmp('ConfCompletedForm.eTime2forLong').hide();
							} else {
								// 表示使用权调整
								Ext.getCmp('ConfCompletedForm.confTopic').disable();
								Ext.getCmp('ConfCompletedForm.confProperty').disable();
								Ext.getCmp('ConfCompletedForm.createBy').disable();
								Ext.getCmp('ConfCompletedForm.confContent').disable();
								Ext.getCmp('ConfCompletedForm.radiogroupLv').disable();
								Ext.getCmp('ConfCompletedForm.phone').disable();
								Ext.getCmp('ConfCompletedForm.checkReason').disable();
								Ext.getCmp('ConfCompletedForm.depName').disable();
								Ext.getCmp('ConfCompletedForm.disagreeBtn').hide();
								Ext.getCmp('ConfCompletedForm.displayBtn').hide();							
								Ext.getCmp('ConfCompletedForm.isLong').disable();  
								
								// 会议修改									
								  Ext.getCmp('ConfCompletedForm.sTimeforShort').hide();
								  Ext.getCmp('ConfCompletedForm.eTimeforShort').hide();
								//设置 会议室的四个时间栏位初始值									    
							   var cf = Ext.util.JSON.decode(response.responseText);													
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
							
								var fm = Ext.getCmp('ConfCompletedFormPanel');
						    	fm.getCmpByName('tempStartDate1').setValue(startTTemp1);
								fm.getCmpByName('tempStartTime1').setValue(startTTemp2);
								fm.getCmpByName('tempEndDate1').setValue(endTTemp1);
								fm.getCmpByName('tempEndTime1').setValue(endTTemp2);								
								if (isLong11 != 2) {
									 Ext.getCmp('ConfCompletedForm.typeConfCompleted').hide();
									 Ext.getCmp('ConfCompletedForm.bookType2').hide();
								} 
							}
						},
						failure : function() {
							Ext.ux.Toast.msg('操作提示', '数据加载失败！');
						}
					});
		}// end of this 数据加载
		this.buttons = [{
					text : '退回并保存',
					id : 'ConfCompletedForm.disagreeBtn',
					iconCls : 'btn-save',
					handler : this.disagree
							.createCallback(this.formPanel, this)
				}, {
					text : '取消本次申请',
					id : 'ConfCompletedForm.displayBtn',
					iconCls : 'btn-save',
					handler : this.display.createCallback(this.formPanel, this)
				}, {
					text : '下一步',
					iconCls : 'btn-save',
					id : 'ConfCompletedForm.nextBtn',
					handler : this.next.createCallback(this.formPanel, this)
				},{
					text : '取消',
					iconCls : 'btn-cancel',
					handler : this.cancel.createCallback(this)
				}];
	}, // end of this initUIComponent
	/**
	 * 取消
	 */
	cancel : function(window) {
		window.close();
	},
	next : function(window) {
		var fm = Ext.getCmp('ConfCompletedFormPanel');
		var fm1 = Ext.getCmp('ConfCompletedForm.basePanel');
		var confId = fm1.getCmpByName('conference.confId').value;
		var bookType = Ext.getCmp('ConfCompletedForm.bookType').getValue();
		var startDate = fm.getCmpByName('tempStartDate1').value;
		var endDate = fm.getCmpByName('tempEndDate1').value;
		var startTime = fm.getCmpByName('tempStartTime1').value;
		var endTime = fm.getCmpByName('tempEndTime1').value;
			// 转换日期20110728				
				var date3 = new Date();
				var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
						+ "-" + date3.getDate() + " " +startTime;
				var d3 = dd3.replace(/\-/g, '\/');
				var testST = new Date(d3); //长期会议室的开始时间
			
			    var date3 = new Date();
				var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1)
						+ "-" + date3.getDate() + " " +endTime;
				var d3 = dd3.replace(/\-/g, '\/');
				var testET = new Date(d3);//长期会议室的结束时间		
		var endDate22=Ext.getCmp('ConfCompletedForm.tempEndDate1').getValue();//结束日期与实际日期比较
		var dateTemp = new Date();
		var dd3 = dateTemp.getFullYear() + "-" + (dateTemp.getMonth() + 1) + "-"
				+ dateTemp.getDate();
		var d3 = dd3.replace(/\-/g, '\/');
		var tempDateNow=new Date(d3);		

		var ifIsLong = Ext.getCmp('ConfCompletedForm.isLong').getValue();
		if (ifIsLong == 2) {
			//长期会议
		if(startDate==null){		
		  Ext.ux.Toast.msg('操作提示', '会议开始日期为空！');
			fm.getCmpByName('tempStartDate1').focus(true);
			return;
		}
		if(endDate==null){		
		  Ext.ux.Toast.msg('操作提示', '会议结束日期为空！');
			fm.getCmpByName('tempEndDate1').focus(true);
			return;
		}	
		if(startTime==null){		
		  Ext.ux.Toast.msg('操作提示', '会议开始时间为空！');
			fm.getCmpByName('tempStartTime1').focus(true);
			return;
		}
		if(endTime==null){		
		  Ext.ux.Toast.msg('操作提示', '会议结束时间为空！');
			fm.getCmpByName('tempEndTime1').focus(true);
			return;
		}		
		if (startDate >= endDate) {
					Ext.ux.Toast.msg('操作提示', '长期会议室，开始日期必须小于结束日期，请重新输入！');
					fm.getCmpByName('tempStartDate1').focus(true);
					return;
				}	
		
	        if (testST >= testET) {
					Ext.ux.Toast.msg('操作提示', '开会时间段有误:开始时间应比结束时间小，请重新输入！');
					fm.getCmpByName('tempStartTime1').focus(true);
					return;
				}
	
	
		/*	if (endDate < tempDateNow) {
			
			Ext.ux.Toast.msg('操作提示', '会议结束时间比实际时间小！');
			fm.getCmpByName('tempStartDate1').focus(true);
			return;
		}*/
		
		
			if (endDate22 < tempDateNow) {
			
			Ext.ux.Toast.msg('操作提示', '会议结束时间比实际时间小！');
			fm.getCmpByName('tempEndDate1').focus(true);
			return;
		}			

		} else if (ifIsLong == 0) {
			//非长期会议
    	var realStartTime = fm.getCmpByName('conference.startTime').value;
		var realEndTime = fm.getCmpByName('conference.endTime').value;
			
		if(realStartTime==null){
		
		  Ext.ux.Toast.msg('操作提示', '会议开始时间为空！');
			fm.getCmpByName('conference.startTime').focus(true);
			return;
		}
		if(realEndTime==null){
		
		  Ext.ux.Toast.msg('操作提示', '会议结束时间为空！');
			fm.getCmpByName('conference.endTime').focus(true);
			return;
		}
		
			if (realStartTime < tempDateNow) {
			Ext.ux.Toast.msg('操作提示', '会议开始时间比实际时间小！');
			fm.getCmpByName('conference.startTime').focus(true);
			return;
		}
			// 非长期会议必须是同一天
			// 转换日期
			
			var d3 = realStartTime.replace(/\-/g, '\/');
			var date3 = new Date(d3);
			var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1) + "-"
					+ date3.getDate() + " " + date3.getHours() + ":"
					+ date3.getMinutes();
			var d3 = dd3.replace(/\-/g, '\/');
			var newDateStart = new Date(d3);

			// 转换日期
			var d3 = realEndTime.replace(/\-/g, '\/');
			var date3 = new Date(d3);
			var dd3 = date3.getFullYear() + "-" + (date3.getMonth() + 1) + "-"
					+ date3.getDate() + " " + date3.getHours() + ":"
					+ date3.getMinutes();
			var d3 = dd3.replace(/\-/g, '\/');
			var newDateEnd = new Date(d3);

			if (newDateStart.getDate() != newDateEnd.getDate()
					|| newDateStart.getYear() != newDateEnd.getYear()
					|| newDateStart.getMonth() != newDateEnd.getMonth()) {
				Ext.ux.Toast.msg('操作提示', '非长期会议：开始时间与结束时间必须是同一天，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}			
				if(newDateStart.getHours()<7){//20110728
					Ext.ux.Toast.msg('操作提示', '对不起，开始时间必须从7:00开始，请重新输入！');
					fm.getCmpByName('conference.startTime').focus(true);
					return;				
				}			
		}		
		Ext.getCmp('ConfCompletedFormWin').close();
		new ConfDateEditForm({
					confId : confId,
					startTime : startTime,
					endTime : endTime,
					ifIsLong : ifIsLong,
					bookType : bookType,
					startDate : startDate,
					endDate : endDate,
					realStartTime : realStartTime,
					realEndTime : realEndTime					
				}).show();
	},

	/**
	 * 同意并保存
	 */
	save : function(formPanel, window) {
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConfCompletedFormPanel');
			if (fm.getCmpByName('conference.startTime').value >= fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			
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
	 * 发送
	 */
	send : function(formPanel, window) {
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConfCompletedFormPanel');
			if (fm.getCmpByName('conference.startTime').value >= fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			// 获取当前时间,判断是否开会时间在当前时间之前
			var dateTimeNow = new Date().format('Y-m-d H:i:s');
			if (dateTimeNow > fm.getCmpByName('conference.startTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间必须在当前时间之前，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			// 会议主持人和记录人重复人员验证
			/*
			 * if (!ConfCompletedForm.validateCompereAndRecorder()) return;
			 */
			formPanel.getForm().submit({
				url : __ctxPath + '/admin/sendConference.do',
				method : 'post',
				waitMsg : '数据正在发送，请稍后...',
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作提示', '会议信息数据发送成功，等待审批！');
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

	//退回并保存
	disagree : function(formPanel, window) {
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConfCompletedFormPanel');
			if (fm.getCmpByName('conference.startTime').value >= fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '开始时间必须小于结束时间，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}			
	if((Ext.getCmp('ConfCompletedForm.checkReason').getValue()==null)||(Ext.getCmp('ConfCompletedForm.checkReason').getValue()=='')){
				Ext.ux.Toast.msg('操作提示', '退回操作需填写审核意见！');		
				return;				
			}			
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

	//取消操作
	display : function(formPanel, window) {
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConfCompletedFormPanel');
			if (fm.getCmpByName('conference.startTime').value >= fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开始时间必须小于结束时间，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			
	if((Ext.getCmp('ConfCompletedForm.checkReason').getValue()==null)||(Ext.getCmp('ConfCompletedForm.checkReason').getValue()=='')){

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