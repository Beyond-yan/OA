/**
 * @author YHZ
 * @createtime 2010-11-13
 * @class ConfSummaryForm
 * @extends Ext.Window
 * @description ConfSummary表单
 * @company 捷达世软件
 */
ConfSummaryForm = Ext
		.extend(
				Ext.Window,
				{
					// 内嵌FormPanel
					formPanel : null,
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 必须先初始化组件
						this.initUIComponents();
						ConfSummaryForm.superclass.constructor.call(this, {
							id : 'ConfSummaryFormWin',
							iconCls : 'menu-confSummary',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 350,
							width : 400,
							maximizable : false,
							resizable : false,
							title : '会议纪要详情',
							buttonAlign : 'center',
							buttons : this.buttons,
							keys : {
								key : Ext.EventObject.ENTER,
								fn : this.save(this.formPanel, this, 0),
								scope : this
							}
						});
					},// end of the constructor
					// 初始化组件
					initUIComponents : function() {
						this.formPanel = new Ext.FormPanel(
								{
									layout : 'form',
									bodyStyle : 'padding:10px 10px 10px 10px',
									border : false,
									id : 'ConfSummaryForm',
									defaults : {
										anchor : '98%,98%',
										width : 250
									},
									items : [
											{
												name : 'confSummary.sumId',
												xtype : 'hidden',
												value : this.sumId == null ? ''
														: this.sumId
											},
											{
												fieldLabel : '会议议题',
												name : 'confSummary.confId.confTopic',
												xtype : 'textfield',
												readOnly : true
											},
											{
												xtype : 'hidden',
												name : 'confSummary.confId.confId'
											},
											{
												fieldLabel : '纪要创建时间',
												name : 'confSummary.createtime',
												xtype : 'textfield',
												readOnly : true
											},{
												

												fieldLabel : '纪要创建人',
												name : 'confSummary.createBy',
												xtype : 'hidden'												
											
											},{
												fieldLabel : '纪要创建人员',
												name : 'confSummary.creator',
												xtype : 'textfield',
												readOnly : true
											},{
												xtype : 'container',
												layout : 'hbox',
												items : [
														{
															xtype : 'label',
															text : '纪要更新人员:'
														},
														{
															style : 'margin-left:30px;width: 180px;',
															xtype : 'textfield',
															name : 'confSummary.updateBy',
															readOnly : true,
															allowBlank : false,
															blankText : '请选择纪要人',
															maxLength : 256,
															maxLengthText : '纪要人输入不能超过256个字符长度！'
														},
														{
															id:'summaryCreatorId',
															style : 'margin-left: 25px;',
															xtype : 'button',
															text : '请选择',
															iconCls : 'btn-user-sel',
															handler : function() {
															UserSelector.getView(
																	function(userId,fullName) {
																		Ext.getCmp('ConfSummaryForm').getCmpByName('confSummary.updateBy').setValue(fullName);
																} ,true).show(); //修改为当选的
															}
														} ]
											},
											{
												xtype : 'textarea',
												fieldLabel : '纪要内容',
												name : 'confSummary.sumContent',
												width : 250,
												allowBlank : false,
												blankText : '会议纪要内容不能为空！',
												maxLength : 4000,
												maxLengthText : '会议纪要内容不能超过4000个字符！'
											},
											/*{
												fieldLabel : '状态',
												hiddenName : 'confSummary.status',
												xtype : 'combo',
												mode : 'local',
												readOnly : true,
												editable : false,
												triggerAction : 'all',
												store : [ [ '0', '未发送' ],
														[ '1', '发送' ] ]
											},*/ {
												xtype : 'compositefield',
												fieldLabel : '附件',
												items : [ {
													xtype : 'panel',
													id : 'confSummaryFormFilePanel',
													name : 'confSummaryFormFilePanel',
													border : true,
													height : 50,
													width : 190
												}, {
													id:'upButtonId',
													xtype : 'button',
													iconCls : 'btn-upload',
													text : '上传',
													handler : this.upLoadFile.createCallback(this)
												}, {
													xtype : 'hidden',
													name : 'fileIds'
												} ]
											} ]
								});

						// 加载表单对应的数据
						if (this.sumId != null && this.sumId != 'undefined') {
						
							var hideDelete=this.valueTemp;
							this.formPanel.loadData(
											{
												url : __ctxPath
														+ '/admin/getConfSummary.do?sumId='
														+ this.sumId,
												root : 'data',
												preName : 'confSummary',
												success : function(response, obj) {
													var cf = Ext.util.JSON.decode(response.responseText);
													
													if(hideDelete==0){
														//hideDelete==0表示不可以编辑
														ConfSummaryForm.setFilePanelWithOutsh(cf.data.attachFiles);
														Ext.getCmp('upButtonId').hide();
														Ext.getCmp('saveBtnId').hide();
														Ext.getCmp('summaryCreatorId').hide();
														
													}
													else{
														ConfSummaryForm.setFilePanel(cf.data.attachFiles);
	
														
													}
													
													
												},
												failure : function(form, action) {
													Ext.ux.Toast.msg('操作提示','对不起，数据加载有误！');
												}
											});
						}
						// 初始化功能按钮
						this.buttons = [
								{
									id:'saveBtnId',
									text : '保存',
									iconCls : 'btn-save',
									handler : this.save.createCallback(
											this.formPanel, this, 0)
								},
								/*{
									text : '发送',
									iconCls : 'btn-mail_send',
									handler : this.save.createCallback(this.formPanel, this, 1)
								}, */{
									text : '取消',
									iconCls : 'btn-cancel',
									handler : this.cancel.createCallback(this)
								} ];
					},// end of the initcomponents

					/**
					 * 取消
					 * 
					 * @param {}
					 *            window
					 */
					cancel : function(window) {
						window.close();
					},
					/**
					 * 保存记录,type=0保存，否则，发送(深地铁三号线已不设置发送功能)
					 */
					save : function(formPanel, window, type) {
						var url = type == 0 ? __ctxPath + '/admin/editConfSummary.do'
								: __ctxPath + '/admin/sendConfSummary.do';
						if (formPanel.getForm().isValid()) {
							formPanel.getForm().submit(
									{
										url : url,
										method : 'post',
										waitMsg : '正在提交数据，请稍后...',
										success : function(fp, action) {
										/*	Ext.ux.Toast.msg('操作信息',
													type == 0 ? '会议纪要保存成功！'
															: '会议纪要发送成功！');*/
										Ext.ux.Toast.msg('操作信息','会议纪要保存成功！'	);
											var gridPanel = Ext
													.getCmp('ConfSummaryGrid');
											if (gridPanel != null) {
												gridPanel.getStore().reload();
											}
											window.close();
										},
										failure : function(fp, action) {
											Ext.MessageBox.show( {
												title : '操作信息',
												msg : '信息发送出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
											window.close();
										}
									});
						}
					},// end of save
					
					/**
					 * 上传文件
					 */
					upLoadFile : function(self) {
						var formPanel = Ext.getCmp('ConfSummaryForm');
						var dialog = App
								.createUploadDialog( {
									file_cat : 'admin/confSummary',
									callback : function(arr) {
									var tempFileIds=formPanel.getCmpByName('fileIds').getValue();
									var fileIds = '';
									if(!(tempFileIds==null||tempFileIds==''))
									{
									fileIds+=tempFileIds+',';
									
									}
									
										var filePanel = Ext.getCmp('confSummaryFormFilePanel');
										for ( var i = 0; i < arr.length; i++) {
											fileIds += arr[i].fileId + ',';
											Ext.DomHelper
													.append(
															filePanel.body,
															'<span><a href="#" onclick="FileAttachDetail.show('
																	+ arr[i].fileId + ')">'
																	+ arr[i].filename
																	+ '</a><img class="img-delete" src="'
																	+ __ctxPath
																	+ '/images/system/delete.gif" onclick="removeResumeFile(this,'
																	+ arr[i].fileId
																	+ ')"/>&nbsp;|&nbsp;</span>');
										}
										formPanel.getCmpByName('fileIds').setValue(fileIds.substring(0,fileIds.length - 1));
									}
								});
						dialog.show('confSummaryForm');
					}
				});

/**
 * 上传文件删除
 */
function removeResumeFile(obj, fileId) {
	var fileIds = Ext.getCmp('ConfSummaryForm').getCmpByName('fileIds');
	var value = fileIds.getValue();
	if (value.indexOf(',') < 0) {// 仅有一个附件
		fileIds.setValue('');
	} else {
		value = value.replace(',' + fileId, '').replace(fileId + ',', '');
		fileIds.setValue(value);
	}

	var el = Ext.get(obj.parentNode);
	el.remove();
};
/**
 * 显示附件列表
 */
ConfSummaryForm.setFilePanel = function(records) {
	var fileIds = '';
	var filePanel = Ext.getCmp('confSummaryFormFilePanel');
	for ( var i = 0; i < records.length; i++) {
		fileIds += records[i].fileId + ',';
		var del = '<img class="img-delete" src="'+ __ctxPath
				+ '/images/system/delete.gif" onclick="removeResumeFile(this,'
				+ records[i].fileId + ')"/>';
		Ext.DomHelper.append(filePanel.body,
				'<span><a href="#" onclick="FileAttachDetail.show('
						+ records[i].fileId + ')">' + records[i].fileName + '</a>'
						+ del + '&nbsp;|&nbsp;</span>');
	}
	Ext.getCmp('ConfSummaryForm').getCmpByName('fileIds').setValue(fileIds.substring(0, fileIds.length - 1));
};



//用于显示不可以编辑的附件框，去掉删除以及上传按钮

ConfSummaryForm.setFilePanelWithOutsh = function(records) {
	var fileIds = '';
	var filePanel = Ext.getCmp('confSummaryFormFilePanel');
	for ( var i = 0; i < records.length; i++) {
		fileIds += records[i].fileId + ',';
	/*	var del = '<img class="img-delete" src="'+ __ctxPath
				+ '/images/system/delete.gif" onclick="removeResumeFile(this,'
				+ records[i].fileId + ')"/>';*/
		Ext.DomHelper.append(filePanel.body,
				'<span><a href="#" onclick="FileAttachDetail.show('
						+ records[i].fileId + ')">' + records[i].fileName + '</a>'
						+ '&nbsp;|&nbsp;</span>');
	}
	Ext.getCmp('ConfSummaryForm').getCmpByName('fileIds').setValue(fileIds.substring(0, fileIds.length - 1));
};