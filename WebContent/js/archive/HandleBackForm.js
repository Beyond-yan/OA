/**
 * @author Ropen
 * @createtime 2014-02-27
 * @class HandleBackForm
 * @extends Ext.Window
 * @description 反馈办理结果
 */
HandleBackForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				HandleBackForm.superclass.constructor.call(this, {
							id : 'HandleBackFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 240,
							width : 400,
							maximizable : true,
							title : '反馈办理结果',
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
							url : __ctxPath + '/archive/handleBackArchivesDep.do',
							id : 'HandleBackForm',
							defaults : {
								anchor : '98%,98%'
							},
							items : [{
										xtype:'hidden',
										name : 'archDepId',
										value:this.archDepId
									}, {
										fieldLabel : '反馈内容',
										name : 'content',
										xtype:'textarea',
										height : 140
									}
							]
						});
				// 初始化功能按钮
				this.buttons = [{
							text : '确定',
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
									Ext.ux.Toast.msg('操作信息', '成功反馈办理结果！');
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