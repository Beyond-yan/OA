/**
 * @author
 * @createtime
 * @class MonitorHastenForm
 * @extends Ext.Window
 * @description ArchHasten表单
 */
MonitorHastenForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				MonitorHastenForm.superclass.constructor.call(this, {
							id : 'MonitorHastenFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 200,
							width : 400,
							maximizable : true,
							title : '催办信息',
							buttonAlign : 'center',
							buttons : this.buttons
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				this.msgPanel=new Ext.Panel({
					border:false,
					autoHeight:true,
					layout:'column',
					items:[
						{
							xtype:'checkbox',
							name:'sendMail',
							inputValue:'true',
							boxLabel:'发送邮件',
							columnWidth:.2
						},{
							xtype:'checkbox',
							name:'sendMsg',
							inputValue:'true',
							boxLabel:'发送短信',
							columnWidth:.2
						}//end of fieldset
					]//end of panel items
				});
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px 10px 10px 10px',
							border : false,
							url : __ctxPath + '/admin/hastenMonitorApply.do',
							id : 'MonitorHastenForm',
							defaults : {
								anchor : '98%,98%'
							},
							items : [{
										xtype:'hidden',
										name : 'monitorApply.id',
										value:this.id
									}, {
										fieldLabel : '催办内容',
										name : 'content',
										xtype:'textarea',
										allowBlank : false,
										value:'你有['+this.topic+']督办任务,截止日期为:'+this.finishDt+',请速去办理！'
									},{
										xtype : 'container',
										style : 'padding-left:20px;margin-top:4px;',
										border:false,
										autoHeight:true,
										layout:'column',
										items:[
											{
												xtype:'checkbox',
												name:'sendMail',
												inputValue:'true',
												boxLabel:'发送邮件',
												columnWidth:.2
											},{
												xtype:'checkbox',
												name:'sendMsg',
												inputValue:'true',
												boxLabel:'发送短信',
												columnWidth:.2
											}//end of fieldset
										]//end of panel items
									
									}

							]
						});
				
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.getForm().load({
						url : __ctxPath
						+ '/admin/getMonitorApply.do?id='
						+ this.id,	
						waitMsg : '正在载入数据...',
						success : function(form, action) {}
					});
				}
				// 初始化功能按钮
				this.buttons = [{
							text : '发送',
							
							iconCls : 'btn-save',
							handler : this.save.createCallback(this.formPanel,
									this)
						},{
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
									Ext.ux.Toast.msg('操作信息', '成功发送催办信息！');
									window.close();
								},
								failure : function(fp, action) {
									var message=action.result.message;
									Ext.MessageBox.show({
												title : '操作信息',
												msg :message!=''?message:'信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
									window.close();
								}
							});
				}
			}// end of save

		});