/**
 * @author
 * @createtime
 * @class OutMsgForm
 * @extends Ext.Window
 * @description OutMsg表单
 * @company 宏天软件
 */
OutMsgForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				OutMsgForm.superclass.constructor.call(this, {
							id : 'OutMsgFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 300,
							width : 718,
							iconCls : 'menu-mobile',
							maximizable : true,
							title : '手机详细信息',
							buttonAlign : 'center',
							buttons : this.buttons
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px 10px 10px 10px',
							border : false,
							url : __ctxPath + '/communicate/saveOutMsg.do',
							id : 'OutMsgForm',
							defaults : {
								anchor : '98%,98%'
							},
							//defaultType : 'textfield',
							items : [{
										name : 'OutMsg.smsId',
										id : 'smsId',
										xtype : 'hidden',
										value : this.smsId == null
												? ''
												: this.smsId
									},  {// 2 row
										xtype : 'container',
										//anchor : '99%,99%',
										layout : 'hbox',
										layoutConfig : {
											align : 'middle'
										},
										items : [{
													style : 'padding-left:0px;',
													xtype : 'displayfield',
													value : '收信号码:',
													width : 105
												},{
													xtype : 'textfield',
													id : 'phoneNumber',
													name : 'phoneNumber',
													width : 350,
													allowBlank : false,
													style : 'padding-right:8px;'
												}, {
													xtype : 'button',
													text : '选择',
													iconCls : 'btn-add',
													handler : function() {
										OutMsgSelector.getView(
											function(personName, unitmobile) {
												Ext.getCmp('phoneNumber').setValue(unitmobile);
												Ext.getCmp('personname').setValue(personName);   
												}, false).show();
										}
												}]
									}, 
									{
										fieldLabel : '收信人',
										name : 'personname',
										style : 'margin-top:4px;',
										xtype : 'textfield',
										allowBlank : false,
										value : '无',
										id : 'personname'
									}  ,{
										fieldLabel : '发信人',
										name : 'OutMsg.userName',
										id : 'userName',
										xtype : 'textfield',
										style : 'margin-top:4px;',
										value : curUserInfo.fullname
									}, {
										fieldLabel : '短信内容',
										name : 'OutMsg.smsContent',
										allowBlank : false,
										id : 'smsContent',
										xtype : 'textarea'
										
									}

							]
						});
				// 加载表单对应的数据
				if (this.smsId != null && this.smsId != 'undefined') {
					this.formPanel.getForm().load({
						deferredRender : false,
						url : __ctxPath
								+ '/communicate/getSmsHistory.do?smsId='
								+ this.smsId,
						waitMsg : '正在载入数据...',
						success : function(form, action) {
						},
						failure : function(form, action) {
						}
					});
				}
				// 初始化功能按钮
				this.buttons = [{
							text : '发送',
							iconCls : 'btn-save',
							handler : this.save.createCallback(this.formPanel,
									this)
						}, {
							text : '重置',
							iconCls : 'btn-reset',
							handler : this.reset.createCallback(this.formPanel)
						}, {
							text : '取消',
							iconCls : 'btn-cancel',
							handler : this.cancel.createCallback(this)
						}];
			},// end of the initcomponents

			/**
			 * 重置
			 * 
			 * @param {}
			 *            formPanel
			 */
			reset : function(formPanel) {
				formPanel.getForm().reset();
			},
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
			 * 保存记录
			 */
			save : function(formPanel, window) {
				if (formPanel.getForm().isValid()) {
					formPanel.getForm().submit({
								method : 'POST',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									var msg = action.result.msg;
									if(msg != null && msg !='' && msg !='undefined'){
										Ext.ux.Toast.msg('操作信息',msg);
									}else{
										Ext.ux.Toast.msg('操作信息', '短信正在发送,请等待接收！');
									}
									var gridPanel = Ext.getCmp('SmsMobileGrid');
									if (gridPanel != null) {
										gridPanel.getStore().reload();
									}
									window.close();
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
									window.close();
								}
							});
				}
			}// end of save

		});