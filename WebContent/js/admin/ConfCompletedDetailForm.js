/**
 * @createtime 2010-10-9 PM
 * @class ConfCompletedDetailForm
 * @extends Ext.Window
 * @description 查看已审核会议明细
 * @company 捷达世软件
 * @author YHZ
 */
ConfCompletedDetailForm = Ext.extend(Ext.Window, {
	// store
	store : null,
	gridPanel : null,
	// end of 附件信息

	// 内嵌FormPanel
	formPanel : null,
	// 会议基本信息
//	basePanel : null,
	// 会议内容
	contextPanel : null,
	// 参加人员
	jonerPanel : null,
	// 权限分配
	//grantPanel : null,
	// 附件管理
//	filePanel : null,
	//审核人
	//applyPanel : null,
	buttons : null,

	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ConfCompletedDetailForm.superclass.constructor.call(this, {
					id : 'ConfCompletedDetailFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					maximizable : true,
					width : 730,
					height : 590,
					autoScroll : false,
					title : '查看会议明细',
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {

		// 会议信息设置
		this.basePanel = new Ext.form.FieldSet({
			//id : 'conference.basePanel',
			id : 'ConfCompletedDetailForm.basePanel',
			
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
								//id:'conference.confTopicId',
								id:'ConfCompletedDetailForm.confTopicId',
								
								xtype : 'textfield',
								name : 'conference.confTopic',
								fieldLabel : '会议议题',
								allowBlank : false,
								blankText : '会议议题不能为空！',
								maxLength : 128,
								maxLengthText : '会议议题不能超过128个字符长度！',
								readOnly : true
							}, {
								xtype : 'hidden',
								name : 'conference.typeId'
							}, {
								id:'ConfCompletedDetailForm.confPropertyId',
								xtype : 'combo',
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
												.getCmp('ConfCompletedDetailForm.basePanel');
										fm.getCmpByName('conference.typeId')
												.setValue(cbo.getRawValue());
									}
								}
							},{
								id:'ConfCompletedDetailForm.startTimeId',
								//xtype : 'datetimefield',
								xtype:'textfield',
								format : 'Y-m-d H:i:s',
								editable : false,
								width : 200,
								name : 'conference.startTime',
								fieldLabel : '开始时间',
								allowBlank : false,
								blankText : '请输入会议开始时间！',
								readOnly : true
							},
							
							{
								id:'ConfCompletedDetailForm.createById',
								xtype : 'textfield',
								name : 'conference.createBy',
								fieldLabel : '申请人',
								readOnly : true,
								allowBlank : false,								
								maxLength : 256,
								maxLengthText : '数据不能超过256字符！',
								editable:false
									
							},
							{
								xtype : 'hidden',
								name : 'conference.depId',
								value : this.confId != null ? this.confId : ''
							}, {
								id:'ConfCompletedDetailForm.depNameId',
								xtype : 'textfield',
								name : 'conference.depName',
								fieldLabel : '申请人部门',
								allowBlank : false,
								blankText : '申请人部门不能为空！',
								maxLength : 128,
								maxLengthText : '申请人部门信息不能超过128个字符长度！',
								editable:false,
								readOnly : true
							}
							
							/* {
								name : 'conference.feeBudget',
								fieldLabel : '经费(人民币)',
								text : '0',
								xtype : 'numberfield',
								maxLength : 21,
								maxLengthText : '经费不能超过21个字符长度！'
							}, {
								xtype : 'container',
								layout : 'hbox',
								width : 300,
								defaults : {
									margins : '0 20 0 10'
								},
								items : [{
											xtype : 'label',
											text : '留言方式：'
										}, {
											xtype : 'checkbox',
											boxLabel : '普通留言',
											name : 'conference.isEmail',
											inputValue : 1,
											checked : true,
											width : 100
										}, {
											xtype : 'checkbox',
											boxLabel : '手机留言',
											name : 'conference.isMobile',
											inputValue : 1,
											width : 100
										}]
							}*/]
				}, {
					layout : 'form',
					columnWidth : .5,
					defaults : {
						width : 200
					},
					items : [
					        {
					        	
						xtype : 'combo',
						//xtype : 'textfield',
						hiddenName : 'conference.roomId',
						fieldLabel : '会议室名称',
						valueField : 'roomId',
						id:'ConfCompletedDetailForm.roomId',
						displayField : 'roomName',
						mode : 'local',
						readOnly : true,
						editable : false,
						emptyText : '--请选择会议室--',
						triggerAction : 'all',
						forceSelection : true,
						allowBlank : false,
						blankText : '请选择会议室！',
						store : new Ext.data.SimpleStore({
							url : __ctxPath + '/admin/getBoardrooConference.do',
							autoLoad : true,
							//params:{ 'Q_roomId_L_EQ': this.conference.roomId},
							fields : ['roomId', 'roomName'],
							listeners:{
												scope:this,
												load:function(){
													var cmp=Ext.getCmp('ConfCompletedDetailForm.roomId');
													if(cmp.hiddenField.value)
													cmp.setValue(cmp.hiddenField.value);
												}
											}
						}),
						listeners : {
							select : function(cbo, record, index) {
								var fm = Ext.getCmp('ConfCompletedDetailForm.basePanel');
								fm.getCmpByName('conference.roomName')
										.setValue(cbo.getRawValue());
								fm.getCmpByName('conference.roomLocation')
										.setValue(cbo.getRawValue());
							}
						}
					},/* {
						xtype : 'textfield',
						readOnly : true,
						fieldLabel : '会议室',
						name : 'conference.roomName'
					}, {
						xtype : 'textfield',
						fieldLabel : '地址',
						name : 'conference.roomLocation',
						allowBlank : false,
						blankText : '会议室地址不能为空！',
						maxLength : 128,
						maxLengthText : '会议室地址不能超过128个字符长度！'
					},*/  {
						id:'ConfCompletedDetailForm.radiogroupDatail',
						xtype : 'radiogroup',
						fieldLabel : '会议级别',
						border : false,
						items : [{
									boxLabel : '集团',
									name : 'conference.importLevel',
									inputValue : 1,
									checked : true,
									readOnly : true
								}, {
									boxLabel : '部门',
									name : 'conference.importLevel',
									inputValue : 2,
									readOnly : true
								},
								{
									boxLabel : '科室',
									name : 'conference.importLevel',
									inputValue : 3,
									readOnly : true
									
								},
								{
									boxLabel : '小组',
									name : 'conference.importLevel',
									inputValue : 4,
									readOnly : true
									
								}]
					},
					{
						id:'ConfCompletedDetailForm.endTimeId',
						width : 200,
						name : 'conference.endTime',
						//xtype : 'datetimefield',
						xtype:'textfield',
						format : 'Y-m-d H:i:s',
						readOnly : true,
						fieldLabel : '结束时间',
						allowBlank : false,
						blankText : '请输入会议结束时间！'
					},
					 {
						id:'ConfCompletedDetailForm.phoneId',
						xtype : 'textfield',
						name : 'conference.phone',
						fieldLabel : '申请人电话',
						//allowBlank : false,
						//blankText : '申请人电话不能为空！',
						maxLength : 128,
						maxLengthText : '申请人电话信息不能超过128个字符长度！',
						readOnly : true
					}
					
					//
					]
				},
				{
					columnWidth : 1,
					layout : 'form',
					height : 100,
					width : 550,
					border : false,
					items : [{
								id:'ConfCompletedDetailForm.confContentId',
								name : 'conference.confContent',
								xtype : 'textarea',
								height : 100,
								width : 550,
								fieldLabel : '会议内容',	
								maxLength : 4000,
								maxLengthText : '会议内容文本不能超过4000个字符长度！',
								readOnly : true
							}]
				}]
			}]
		}); // end of this basePanel

		// 会议参加人员jonerPanel
		this.jonerPanel = new Ext.form.FieldSet({
			id : 'conference.jonerPanel',
			title : '审批信息',
			layout : 'form',
			border : true,
			items : [ {
						xtype : 'container',
						layout : 'hbox',
						/*layoutConfigs : {
							align : 'left'
						},*/
						/*defaults : {
							margins : '5px 5px 5px 5px ',
							width : 400,
							height : 100
						},*/
						items : [{
									xtype : 'label',
									text : '审批意见'
								}, {
									id:'ConfCompletedDetailForm.checkReasonId',
									xtype : 'textarea',
									name : 'conference.checkReason',
									readOnly : false,
									//allowBlank : false,								
									maxLength : 256,
									maxLengthText : '数据不能超过256字符！',
									width : 550,
									height : 100,
									margins : '5px 60px 5px 60px '
								//	editable:false
										
								}]
					}
					
					]
		}); // end of this jonerPanel

		this.formPanel = new Ext.FormPanel({
					id : 'ConfCompletedDetailFormPanel',
					autoScroll : true,
					layout : 'form',
					region : 'center',
					border : false,
					defaults : {
						readOnly : true					
					  
						
					},
					items : [this.basePanel, 
					       //  this.contextPanel, 
					         {
								layout : 'column',
								border : false,
								columnWidth : 1,
								defaults : {
									border : false
								},
								items : [{
											columnWidth : 1,
											//width : '300',
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
				
				Ext.getCmp('ConfCompletedDetailForm.radiogroupDatail').disable();			
				Ext.getCmp('ConfCompletedDetailForm.confTopicId').disable();
			
				Ext.getCmp('ConfCompletedDetailForm.confPropertyId').disable();
				Ext.getCmp('ConfCompletedDetailForm.createById').disable();
				Ext.getCmp('ConfCompletedDetailForm.confContentId').disable();				
				Ext.getCmp('ConfCompletedDetailForm.phoneId').disable();
				Ext.getCmp('ConfCompletedDetailForm.checkReasonId').disable();
				Ext.getCmp('ConfCompletedDetailForm.depNameId').disable();
				Ext.getCmp('ConfCompletedDetailForm.startTimeId').disable();
				Ext.getCmp('ConfCompletedDetailForm.endTimeId').disable();
				Ext.getCmp('ConfCompletedDetailForm.roomId').disable();
				
			
						/*	var action = Ext.util.JSON
									.decode(response.responseText);
							ConfCompletedDetailForm.setGrantPanel(action);
							ConfCompletedDetailForm
									.setFilePanel(action.data.attachFiles);*/
						},
						failure : function() {
							Ext.ux.Toast.msg('操作提示', '数据加载失败！');
						}
					});
		}// end of this 数据加载

		this.buttons = [/*{
					text : '同意并保存',
					iconCls : 'btn-save',
					handler : this.save.createCallback(this.formPanel, this)
				},
				{
					text : '退回并保存',
					iconCls : 'btn-save',
					handler : this.disagree.createCallback(this.formPanel, this)
				},
				{
					text : '取消本次申请',
					iconCls : 'btn-save',
					handler : this.display.createCallback(this.formPanel, this)
				},{
					text : '发送会议通知',
					iconCls : 'btn-mail_send',
					handler : this.send.createCallback(this.formPanel, this)
				}, */{
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
			// 开会时间验证
			var fm = Ext.getCmp('ConfCompletedDetailFormPanel');
			if (fm.getCmpByName('conference.startTime').value >= fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			// 会议主持人和记录人重复人员验证
			/*if (!ConfCompletedDetailForm.validateCompereAndRecorder())
				return;*/
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
			var fm = Ext.getCmp('ConfCompletedDetailFormPanel');
			if (fm.getCmpByName('conference.startTime').value >= fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			//获取当前时间,判断是否开会时间在当前时间之前
			var dateTimeNow = new Date().format('Y-m-d H:i:s');
			if (dateTimeNow > fm.getCmpByName('conference.startTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间必须在当前时间之前，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			// 会议主持人和记录人重复人员验证
		/*	if (!ConfCompletedDetailForm.validateCompereAndRecorder())
				return;*/
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
	 * */
	
	disagree: function(formPanel, window) {
		if (formPanel.getForm().isValid()) {
			// 开会时间验证
			var fm = Ext.getCmp('ConfCompletedDetailFormPanel');
			if (fm.getCmpByName('conference.startTime').value >= fm
					.getCmpByName('conference.endTime').value) {
				Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
				fm.getCmpByName('conference.startTime').focus(true);
				return;
			}
			// 会议主持人和记录人重复人员验证
			/*if (!ConfCompletedDetailForm.validateCompereAndRecorder())
				return;*/
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
	
		display:function(formPanel, window) {
			if (formPanel.getForm().isValid()) {
				// 开会时间验证
				var fm = Ext.getCmp('ConfCompletedDetailFormPanel');
				if (fm.getCmpByName('conference.startTime').value >= fm
						.getCmpByName('conference.endTime').value) {
					Ext.ux.Toast.msg('操作提示', '对不起，开会时间有误，请重新输入！');
					fm.getCmpByName('conference.startTime').focus(true);
					return;
				}
				// 会议主持人和记录人重复人员验证
				/*if (!ConfCompletedDetailForm.validateCompereAndRecorder())
					return;*/
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
				Ext.getCmp('ConfCompletedDetailForm.filePath').getCmpByName('filePath')
						.setValue(fileIds.substring(0, fileIds.length - 1));
			}
		});
		dialog.show('querybtn');
	}
});

/**
 * 显示上传文件列表
 */
ConfCompletedDetailForm.setFilePanel = function(records) {
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
	Ext.getCmp('ConfCompletedDetailForm.filePath').getCmpByName('filePath')
			.setValue(fileIds.substring(0, fileIds.length - 1));
};
/*
*//**
 * 权限设置面板绑定数据
 *//*
ConfCompletedDetailForm.setGrantPanel = function(action) {
	var cp = action.data.confPrivilege;
	var viewer = '';
	var viewers = '';
	var updater = '';
	var updaters = '';
	var summary = '';
	var summarys = '';
	for (var i = 0; i < cp.length; i++) {
		if (cp[i].rights == 1) { // 查看
			viewer += cp[i].userId + ',';
			viewers += cp[i].fullname + ',';
		}
		if (cp[i].rights == 2) {// 修改
			updater += cp[i].userId + ',';
			updaters += cp[i].fullname + ',';
		}
		if (cp[i].rights == 3) { // 创
			summary += cp[i].userId + ',';
			summarys += cp[i].fullname + ',';
		}
	}
	var fm = Ext.getCmp('conference.grantPanel');
	fm.getCmpByName('viewer').setValue(viewer.substring(0, viewer.length - 1));
	fm.getCmpByName('viewers').setValue(viewers
			.substring(0, viewers.length - 1));
	fm.getCmpByName('updater').setValue(updater
			.substring(0, updater.length - 1));
	fm.getCmpByName('updaters').setValue(updaters.substring(0, updaters.length
					- 1));
	fm.getCmpByName('summary').setValue(summary
			.substring(0, summary.length - 1));
	fm.getCmpByName('summarys').setValue(summarys.substring(0, summarys.length
					- 1));
};
*/
/**
 * 判断会议主持人和记录人是否存在重复,重复false
 */
/*
ConfCompletedDetailForm.validateCompereAndRecorder = function() {
	var fm = Ext.getCmp('conference.jonerPanel');
	var compere = fm.getCmpByName('conference.compere').value.split(',');
	var recorder = fm.getCmpByName('conference.recorder').value.split(',');
	var bo = true;
	if (compere.length == 1 && recorder.length == 1) { //一对一
		if (compere[0].search(recorder) >= 0)
			bo = false;
	} else if (compere.length == 1 && recorder.length != 1) {//一对多
		for (var i = 0; i < recorder.length; i++) {
			if (recorder[i].search(compere) >= 0)
				bo = false;
		}
	} else if (compere.length != 1 && recorder.length == 1) { //多对一
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
*/

