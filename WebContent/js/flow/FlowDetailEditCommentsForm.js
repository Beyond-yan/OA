/**
 * @author
 * @createtime
 * @class FlowDetailEditCommentsForm
 * @extends Ext.Window
 */
FlowDetailEditCommentsForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				FlowDetailEditCommentsForm.superclass.constructor.call(this, {
							id : 'FlowDetailEditCommentsFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 220,
							width : 500,
							iconCls : 'btn-edit',
							maximizable : true,
							title : '修改意见',
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
							url : __ctxPath + '/flow/saveOpinProcessForm.do',
							id : 'FlowDetailEditCommentsForm',
							defaults : {
								anchor : '98%,98%'
							},
							defaultType : 'textfield',
							items : [{
										name : 'processForm.formId',
										id : 'formId',
										xtype : 'hidden'
									}, {
										fieldLabel : '任务名',
										id : 'activityName',
										disabled  : true,
										readOnly: true,
										name : 'processForm.activityName'
									}, {
										fieldLabel : '办理人',
										id : 'creatorName',
										disabled  : true,
										readOnly: true,
										name : 'processForm.creatorName'
									}, {
										fieldLabel : '办理时间',
										name : 'processForm.createtime',
										id : 'createtime',
										disabled  : true,
										xtype : 'datetimefield',
										format : 'Y-m-d H:i'
									}, {
										fieldLabel : '办理意见',
										id : 'comments',
										name : 'processForm.comments',
										allowBlank : true,
										xtype : 'textarea'
									},{
										id:'taskId',
										value: this.taskId,
										hidden : true
									},{
										id:'taskName',
										value:this.taskName,
										hidden:true
									},{
										id:'activityName',
										value:this.activityName,
										hidden :true
									},{
										id:'runId',
										value:this.runId,
										hidde:true
									}

							]
						});
				// 加载表单对应的数据
				if (this.formId != null && this.formId != 'undefined') {
					this.formPanel.getForm().load({
						deferredRender : false,
						url : __ctxPath+ '/flow/getProcessForm.do?formId='+ this.formId,
						waitMsg : '正在载入数据...',
						method:'post',
						success : function(form, action) {
						},
						failure : function(form, action) {
						}
					});
				}
				// 初始化功能按钮
				this.buttons = [{
							text : '保存',
							iconCls : 'btn-save',
							handler : this.save.createCallback(this.formPanel,
									this)
						}, {
							text : '取消',
							iconCls : 'btn-cancel',
							handler : this.cancel.createCallback(this)
						}];
			},// end of the initcomponents
			/**
			 * 取消
			 * 
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
									var gridPanel = Ext.getCmp('ArchivesWriteOpionGrid');
									if (gridPanel != null) {
										gridPanel.getStore().reload();
									}
									var taskvalue = Ext.getCmp('taskId').getValue();
									var contentPanel=App.getContentPanel();
									var formOpinView=contentPanel.getItem('ProcessForm'+taskvalue);
									if(formOpinView!=null){
									AppUtil.removeTab('ProcessForm' + taskvalue);
									var formView=new ProcessNextForm({
										taskId:Ext.getCmp('taskId').getValue(),
										activityName:Ext.getCmp('taskName').getValue(), 
										taskName:Ext.getCmp('taskName').getValue(),
										runId:Ext.getCmp('runId').getValue()
										});
									contentPanel.add(formView);
									contentPanel.activate(formView);
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