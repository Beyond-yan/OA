/**
 * @author 
 * @createtime 
 * @class SysServiceAccessLogForm
 * @extends Ext.Window
 * @description SysServiceAccessLog表单
 * @company 捷达世软件
 */
SysServiceAccessLogForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SysServiceAccessLogForm.superclass.constructor.call(this, {
							id : 'SysServiceAccessLogFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[SysServiceAccessLog]详细信息',
							buttonAlign : 'center',
							buttons : [
										{
											text : '保存',
											iconCls : 'btn-save',
											scope : this,
											handler : this.save
										}, {
											text : '重置',
											iconCls : 'btn-reset',
											scope : this,
											handler : this.reset
										}, {
											text : '取消',
											iconCls : 'btn-cancel',
											scope : this,
											handler : this.cancel
										}
							         ]
				});
			},//end of the constructor
			//初始化组件
			initUIComponents : function() {
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px',
							border : false,
							autoScroll:true,
							//id : 'SysServiceAccessLogForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'sysServiceAccessLog.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'SERVICE_ID',
								 								name : 'sysServiceAccessLog.serviceId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'SERVICE_ACCOUNT',
								 								name : 'sysServiceAccessLog.serviceAccount'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ACCESS_DATE',
								 								name : 'sysServiceAccessLog.accessDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'STATUS',
								 								name : 'sysServiceAccessLog.status'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ERROR_MESSAGE',
								 								name : 'sysServiceAccessLog.errorMessage'
								 																 								,xtype:'textarea'
								 								,maxLength: 4000
								 							}
																																										,{
																fieldLabel : 'IP_ADDRESS',
								 								name : 'sysServiceAccessLog.ipAddress'
								 																 								,maxLength: 200
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/system/getSysServiceAccessLog.do?id='+ this.id,
								root : 'data',
								preName : 'sysServiceAccessLog'
							});
				}
				
			},//end of the initcomponents

			/**
			 * 重置
			 * @param {} formPanel
			 */
			reset : function() {
				this.formPanel.getForm().reset();
			},
			/**
			 * 取消
			 * @param {} window
			 */
			cancel : function() {
				this.close();
			},
			/**
			 * 保存记录
			 */
			save : function() {
				$postForm({
						formPanel:this.formPanel,
						scope:this,
						url:__ctxPath + '/system/saveSysServiceAccessLog.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('SysServiceAccessLogGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});