/**
 * @author YHZ
 * @createtime 2010-11-13
 * @class AddConfSummaryForm
 * @extends Ext.Window
 * @description ConfSummary表单
 * @company 捷达世软件
 */
AddConfSummaryForm = Ext
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
						AddConfSummaryForm.superclass.constructor.call(this, {
							id : 'AddConfSummaryFormWin',
							iconCls : 'menu-confSummary',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 600,
							width : 900,
							maximizable : false,
							resizable : false,
							title : '创建会议纪要',
							buttonAlign : 'center',
							buttons : this.buttons
//							keys : {
//								key : Ext.EventObject.ENTER,
//								fn : this.save(this.formPanel, this),
//								scope : this
//							}
						});
					},// end of the constructor
					// 初始化组件
					initUIComponents : function() {
						this.formPanel = new Ext.FormPanel(
								{
									layout : 'form',
									bodyStyle : 'padding:10px 10px 10px 10px',
									border : false,
									id : 'AddConfSummaryForm',
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
												readOnly : true,
												value:this.confTopic
											},
											{
												xtype : 'hidden',
												name : 'confSummary.confId.confId',
												value:this.confId
											},
											/*{
												fieldLabel : '纪要创建时间',
												name : 'confSummary.createtime',
												xtype : 'textfield',
												readOnly : true
											},{
												xtype : 'container',
												layout : 'hbox',
												items : [
														{
															xtype : 'label',
															text : '纪要人:'
														},
														{
															style : 'margin-left:65px;width: 200px;',
															xtype : 'textfield',
															name : 'confSummary.creator',
															readOnly : true,
															allowBlank : false,
															blankText : '请选择纪要人',
															maxLength : 256,
															maxLengthText : '纪要人输入不能超过256个字符长度！'
														},
														{
															style : 'margin-left: 50px;',
															xtype : 'button',
															text : '请选择',
															iconCls : 'btn-user-sel',
															handler : function() {
															UserSelector.getView(
																	function(userId,fullName) {
																		Ext.getCmp('AddConfSummaryForm').getCmpByName('confSummary.creator').setValue(fullName);
																}).show();
															}
														} ]
											}{
											
												xtype:'hidden',
												name:'confSummary.creator',
												value:curUserInfo.userId
											},*/{
											    fieldLabel : '创建会议纪要人',
												xtype:'textfield',
												name:'confSummarycreator',
												value:curUserInfo.fullname,
												readOnly:true
												
											},
											{
							xtype : 'htmleditor',
							fieldLabel : '纪要内容',
							id : 'AddConfSummaryForm.sumContent',
							name : 'confSummary.sumContent',
							width : 600,
							heigth : 400,
							allowBlank : false,
							blankText : '对不起，请输入会议纪要内容！',
							maxLength : 4000,
							maxLengthtext : '会议纪要内容不能超过4000个字符长度！'
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
											}, */{
							xtype : 'hidden',
							name : 'fileIds'
						},{
							xtype : 'compositefield',
							fieldLabel : '上传附件',
							layout : 'form',
							items : [{
										xtype : 'textfield',
										fieldLabel : '地址',
										name : 'filePath',
										width : 300,
										readOnly : true
									}, {
										xtype : 'button',
										iconCls : 'btn-upload',
										text : '请选择',
										handler : this.upLoadFile
									}, {
										xtype : 'button',
										iconCls : 'btn-cancel',
										text : '取消',
										handler : this.delLoadFile
									}]
						} ]
								});
								
/*						// 加载表单对应的数据
						if (this.sumId != null && this.sumId != 'undefined') {
							this.formPanel.loadData(
											{
												url : __ctxPath
														+ '/admin/getConfSummary.do?sumId='
														+ this.sumId,
												root : 'data',
												preName : 'confSummary',
												success : function(response, obj) {
													var cf = Ext.util.JSON.decode(response.responseText);
													AddConfSummaryForm.setFilePanel(cf.data.attachFiles);
												},
												failure : function(form, action) {
													Ext.ux.Toast.msg('操作提示','对不起，数据加载有误！');
												}
											});
						}*/
						// 初始化功能按钮
						this.buttons = [
								{
									text : '保存',
									iconCls : 'btn-save',
									handler : this.save.createCallback(
											this.formPanel, this)
								},
								/*{
									text : '发送',
									iconCls : 'btn-mail_send',
									handler : this.save.createCallback(this.formPanel, this)
								},*/ {
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
	 * 保存
	 */
	/*save : function() {
		var fm = Ext.getCmp('AddConfSummaryViewForm');
		if (fm.getForm().isValid()) {
			fm.getForm().submit({
						url : __ctxPath + '/admin/saveConfSummary.do',
						method : 'post',
						
						
						success : function(form, action) {
							Ext.ux.Toast.msg('操作提示', '恭喜您，保存会议纪要成功！');
							fm.getForm().reset();
							App.clickTopTab('ConfSummaryView');
							Ext.getCmp('ConfSummaryGrid').getStore().reload();
						},
						failure : function(fm, action) {
							Ext.ux.Toast.msg('操作提示', action.result.msg);
							Ext.getCmp('sumContent').focus(true);
						}
					});
		}
	},*/
					/**
					 * 保存记录
					 */
					save : function(formPanel, window) {
				//	url : __ctxPath + '/admin/saveConfSummary.do'
						if (formPanel.getForm().isValid()) {
							
								
						//var fm=Ext.getCmp('AddConfSummaryForm');
						var sumContentVar=Ext.getCmp('AddConfSummaryForm.sumContent').getValue();
						if(sumContentVar==null||sumContentVar==''){
							Ext.ux.Toast.msg('操作提示', '纪要内容是必填项，请输入！');
							return;						
						}												
							formPanel.getForm().submit(
									{
										url : __ctxPath + '/admin/saveConfSummary.do',
										method : 'post',
										waitMsg : '正在提交数据，请稍后...',
										success : function(fp, action) {
											Ext.ux.Toast.msg('操作信息', '会议纪要保存成功！'	);
												var gridPanel = Ext.getCmp('MyJoinConferenceGrid');
						                  	if (gridPanel != null) {
							               	gridPanel.getStore().reload();
							         }
											
											/* Ext.getCmp('AddConfSummaryForm').getForm().reset();
											var gridPanel = Ext
													.getCmp('ConfSummaryGrid');
											if (gridPanel != null) {
												gridPanel.getStore().reload();
											}*/
											window.close();
											
										//Ext.getCmp('')	20110706	
											},
										failure : function(fp, action) {
											Ext.MessageBox.show( {
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
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
					upLoadFile : function() {
		var dialog = App.createUploadDialog({
					url : __ctxPath + '/file-upload',
					file_cat : 'admin/confSummary',
					callback : function(arr) {
						var str = '';
						var filePath = '';
						for (var i = 0; i < arr.length; i++) {
							str += arr[i].fileId + ",";
							filePath += arr[i].filepath + ',';
						}
						str = str.substring(0, str.length - 1);
						var fm = Ext.getCmp('AddConfSummaryFormWin');
						fm.getCmpByName('fileIds').setValue(str);
						fm.getCmpByName('filePath').setValue(filePath
								.substring(0, filePath.length - 1));

					}
				});
		dialog.show('querybtn');
	},

	/**
	 * 删除上传文件
	 */
	delLoadFile : function() {
		var fm = Ext.getCmp('AddConfSummaryFormWin');
		var fileIds = fm.getCmpByName('fileIds').value;
		if (fileIds != null && fileIds != '' && fileIds != 'undefined') {
			Ext.Msg.confirm('确认信息', '您真的要删除上传文件吗？', function(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
										url : __ctxPath
												+ '/system/multiDelFileAttach.do',
										method : 'post',
										params : {
											ids : fileIds
										},
										success : function() {
											Ext.ux.Toast.msg('操作提示',
													'上传文件删除成功！');
											fm.getCmpByName('fileIds')
													.setValue('');
											fm.getCmpByName('filePath')
													.setValue('');
										},
										failure : function() {
											Ext.ux.Toast.msg('操作提示',
													'对不起，您上传文件删除失败！');
										}
									});
						}
					});
		} else {
			Ext.ux.Toast.msg('操作提示', '对不起，你还没有上传文件！');
		}
	}
				});
