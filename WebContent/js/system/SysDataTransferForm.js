/**
 * @author 
 * @createtime 
 * @class SysDataTransferForm
 * @extends Ext.Window
 * @description SysDataTransfer表单
 * @company 捷达世软件
 */
SysDataTransferForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SysDataTransferForm.superclass.constructor.call(this, {
							id : 'SysDataTransferFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[SysDataTransfer]详细信息',
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
							//id : 'SysDataTransferForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'sysDataTransfer.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'ARCHIVES_ID',
								 								name : 'sysDataTransfer.archivesId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ARCHIVESNO',
								 								name : 'sysDataTransfer.archivesno'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'SEND_DEP',
								 								name : 'sysDataTransfer.sendDep'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'SUBJECT',
								 								name : 'sysDataTransfer.subject'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'ARCHTYPE',
								 								name : 'sysDataTransfer.archtype'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ISSUERID',
								 								name : 'sysDataTransfer.issuerid'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ISSUER',
								 								name : 'sysDataTransfer.issuer'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'PRIVACYLEVEL',
								 								name : 'sysDataTransfer.privacylevel'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'URGENTLEVEL',
								 								name : 'sysDataTransfer.urgentlevel'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'SOURCES',
								 								name : 'sysDataTransfer.sources'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'WRITTEN_DATE',
								 								name : 'sysDataTransfer.writtenDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'RECEIVE_DEP',
								 								name : 'sysDataTransfer.receiveDep'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'TRANSFER_TYPE',
								 								name : 'sysDataTransfer.transferType'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'FROM_SCHEMA',
								 								name : 'sysDataTransfer.fromSchema'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'TO_SCHEMA_ID',
								 								name : 'sysDataTransfer.toSchemaId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'RECEIVE_DATE',
								 								name : 'sysDataTransfer.receiveDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'RECEIVE_FLAG',
								 								name : 'sysDataTransfer.receiveFlag'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'REJECT_MSG',
								 								name : 'sysDataTransfer.rejectMsg'
								 																 								,xtype:'textarea'
								 								,maxLength: 500
								 							}
																																										,{
																fieldLabel : 'CREATE_USER',
								 								name : 'sysDataTransfer.createUser'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'sysDataTransfer.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'TRANSACTION_ID',
								 								name : 'sysDataTransfer.transactionId'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'RECEIVE_USER',
								 								name : 'sysDataTransfer.receiveUser'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'RECEIVE_USER_NAME',
								 								name : 'sysDataTransfer.receiveUserName'
								 																 								,maxLength: 100
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/system/getSysDataTransfer.do?id='+ this.id,
								root : 'data',
								preName : 'sysDataTransfer'
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
						url:__ctxPath + '/system/saveSysDataTransfer.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('SysDataTransferGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});