/**
 * @createtime 2010-10-9 PM
 * @class ConfDateEditForm
 * @extends Ext.Window
 * @description 会议使用权调整
 * @company 捷达世软件
 * @author YHZ
 */
ConfDateEditForm = Ext.extend(Ext.Window, {
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
	// 权限分配
	buttons : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ConfDateEditForm.superclass.constructor.call(this, {
					id : 'ConfDateEditFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					maximizable : true,
					width : 730,
					height : 480,
					autoScroll : false,
					title : '选择会议室',
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件	

	initUIComponents : function() {
		var startT = this.startTime;
		var endT = this.endTime;
		var startD = this.startDate;
		var endD = this.endDate;
		var bookType = this.bookType;
		var ifIsLong = this.ifIsLong;
		var realStartT = this.realStartTime;
		var realEndT = this.realEndTime;
		// 会议信息设置
		this.basePanel = new Ext.form.FieldSet({
			id : 'ConfDateEditForm.basePanel',
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
								xtype : 'hidden',
								name : 'conference.startTime'
							}, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfDateEditForm.sTimeDateFormForShort',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '开始时间:',
											width : 105
										}, {								
								xtype : 'textfield',								
								id : 'ConfDateEditForm.startTimeDateForm',
								readOnly : true,
								width : 200,
								name : 'tempStartTime',
								fieldLabel : '开始时间',								
								value : this.realStartTime
							}]
							
							}, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfDateEditForm.sDateDateFormForLong',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '开始日期:',
											width : 105
										}, {

								id : 'ConfDateEditForm.tempStartDate2',
								xtype : 'textfield',
								format : 'Y-m-d',
								readOnly : true,
								anchor : '98%,98%',
								name : 'tempStartDate2',							
								value : this.startDate,
								width : 200
							}]							
							},{							
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfDateEditForm.sTimeDateFormForLong',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '开始时间:',
											width : 105
										}, {
								id : 'ConfDateEditForm.tempStartTime1',
								xtype : 'textfield',
								format : ' H:i',
								readOnly : true,
								anchor : '98%,98%',
								name : 'tempStartTime1',
								value : this.startTime,
								width : 200
							}]							
							} , {
								xtype : 'hidden',
								name : 'conference.roomId'
							}, {
								xtype : 'hidden',
								name : 'conference.roomName'
							}, {
								xtype : 'combo',								
								hiddenName : 'roomId2',
								fieldLabel : '会议室名称',
								valueField : 'roomId',
								id : 'confDateEdit.roomId',
								displayField : 'roomName',
								mode : 'local',
								editable : false,
								emptyText : '--请选择会议室--',
								triggerAction : 'all',
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
										var fm = Ext
												.getCmp('ConfDateEditForm.basePanel');
										if (cbo.getRawValue() == null) {
											
										} else {
											fm
													.getCmpByName('conference.roomName')
													.setValue(cbo.getRawValue());
											fm
													.getCmpByName('conference.roomId')
													.setValue(cbo.getValue());

										}
									}
								}
							}]
				}, {
					layout : 'form',
					columnWidth : .5,
					defaults : {
						width : 200
					},
					items : [{
								xtype : 'hidden',
								name : 'conference.endTime'
							}, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfDateEditForm.eTimeDateForm2',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '结束时间:',
											width : 105
										}, {
											width : 200,
											id : 'ConfDateEditForm.eTimeDateForm',
											name : 'tempEndTime',											
											xtype : 'textfield',
											format : 'Y-m-d H:i:s',
											value : this.endTime,
											readOnly : true,										
											value : this.realEndTime
										}]
							}, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfDateEditForm.eDateDateFormForLong',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '结束日期:',
											width : 105
										}, {
											id : 'ConfDateEditForm.tempEndDate2',
											anchor : '98%,98%',
											name : 'tempEndDate2',
											xtype : 'textfield',
											format : 'Y-m-d',
											readOnly : true,
											value : this.endDate,
											width : 200

										}]
							}, {
								xtype : 'container',
								style : 'padding-left:0px;margin-bottom:4px;',
								id : 'ConfDateEditForm.eTimeDateFormForLong',
								layout : 'column',
								anchor : '98%,98%',
								items : [{
											xtype : 'label',
											style : 'padding-left:0px;',
											text : '结束时间:',
											width : 105
										}, {
											id : 'ConfDateEditForm.tempEndTime2',
											xtype : 'textfield',
											format : 'H:i',
											readOnly : true,
											anchor : '98%,98%',
											name : 'tempEndTime2',
											value : this.endTime,
											width : 200										
									}]
							}, {
								xtype : 'hidden',
								name : 'bookTypeNext',
								value : this.bookType != null
										? this.bookType
										: ''
							}, {
								xtype : 'hidden',
								name : 'ifIsLong',
								value : this.ifIsLong != null
										? this.ifIsLong
										: ''
											}]
				}]
			}]
		}); // end of this basePanel

		// 会议参加人员jonerPanel
		this.jonerPanel = new Ext.form.FieldSet({
					id : 'ConfDateEditForm.jonerPanel',
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
											id : 'ConfDateEditForm.checkReason',
											name : 'conference.checkReason',
										//	allowBlank : false,
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
					id : 'ConfDateEditFormPanel',
					autoScroll : true,
					layout : 'form',
					region : 'center',
					border : false,
					defaults : {
						readOnly : false

					},
					items : [this.basePanel,
							// this.contextPanel,
							{
						layout : 'column',
						border : false,
						columnWidth : 1,
						defaults : {
							border : false
						},
						items : [{
									columnWidth : 1,
									// width : '300',
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
							/*
							 * var action = Ext.util.JSON
							 * .decode(response.responseText);
							 * ConfDateEditForm.setGrantPanel(action);
							 * ConfDateEditForm
							 * .setFilePanel(action.data.attachFiles);
							 */
							/*
							 * Ext.getCmp('conference.confTopic').disable();
							 * Ext.getCmp('conference.confProperty').disable();
							 * Ext.getCmp('conference.createBy').disable();
							 * Ext.getCmp('conference.confContent').disable();
							 * Ext.getCmp('radiogroupLv').disable();
							 * Ext.getCmp('conference.phone').disable();
							 * Ext.getCmp('conference.checkReason').disable();
							 * Ext.getCmp('conference.depName').disable();
							 */

						},
						failure : function() {
							Ext.ux.Toast.msg('操作提示', '数据加载失败！');
						}
					});
		}// end of this 数据加载

		Ext.getCmp('ConfDateEditForm.sTimeDateFormForShort').hide();
		Ext.getCmp('ConfDateEditForm.eTimeDateForm2').hide();
	/*	if (ifIsLong == 0) {
			Ext.getCmp('ConfDateEditForm.sTimeDateFormForLong').hide();
			Ext.getCmp('ConfDateEditForm.eTimeDateFormForLong').hide();
			Ext.getCmp('ConfDateEditForm.sDateDateFormForLong').hide();
			Ext.getCmp('ConfDateEditForm.eDateDateFormForLong').hide();
		} else {
				Ext.getCmp('ConfDateEditForm.sTimeDateFormForShort').hide();
				Ext.getCmp('ConfDateEditForm.eTimeDateForm2').hide();
				}*/

		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					handler : this.save.createCallback(this.formPanel, this)
				},/*
					 * { text : '发送会议通知', iconCls : 'btn-mail_send', handler :
					 * this.send.createCallback(this.formPanel, this) },
					 */{
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

	/**
	 * 同意并保存
	 */
	save : function(formPanel, window) {
		if (formPanel.getForm().isValid()) {
			var fm1 = Ext.getCmp('ConfDateEditFormPanel');
			var startT = fm1.getCmpByName('tempStartTime1').value;
			var endTime = fm1.getCmpByName('tempEndTime2').value;
			var startDate = fm1.getCmpByName('tempStartDate2').value;
			var endDate = fm1.getCmpByName('tempEndDate2').value;
			var bookType = fm1.getCmpByName('bookTypeNext').value;
			var ifIsLong = fm1.getCmpByName('ifIsLong').value;			
			/*if (ifIsLong == 0) {
				// 开会时间验证
				var fm = Ext.getCmp('ConfDateEditFormPanel');
				if (fm.getCmpByName('tempStartTime').value >= fm
						.getCmpByName('tempEndTime').value) {
					Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
					fm.getCmpByName('tempStartTime').focus(true);
					return;
				}
				fm.getCmpByName('conference.startTime').setValue(fm
						.getCmpByName('tempStartTime').value);
				fm.getCmpByName('conference.endTime').setValue(fm
						.getCmpByName('tempEndTime').value);

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
			} */			
				var fm = Ext.getCmp('ConfDateEditFormPanel');
				fm.getForm().submit({
					url : __ctxPath + '/admin/updateLongConfConference.do',
					method : 'post',
					params : {						
						//bookType : ifIsLong,// isLong为预定类型
						isLong:ifIsLong,
						startTime : startT,
						countNum : bookType,// 此处bookType为星期类型
						endTime : endTime,
						startDate : startDate,
						endDate : endDate
					},
					waitMsg : '数据正在保存，请稍后...',
					success : function(fp, action) {
						Ext.ux.Toast.msg('操作信息', '成功保存信息！');
						Ext.getCmp('ConfCompletedViewGrid').getStore().reload({
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
											.decode(action.response.responseText).msg,
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
					}
				});
			
		}
	}
});