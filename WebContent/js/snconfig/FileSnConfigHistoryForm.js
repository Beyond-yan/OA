/**
 * @author 
 * @createtime 
 * @class FileSnConfigHistoryForm
 * @extends Ext.Window
 * @description FileSnConfigHistory表单
 * @company 捷达世软件
 */
FileSnConfigHistoryForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				FileSnConfigHistoryForm.superclass.constructor.call(this, {
							id : 'FileSnConfigHistoryFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[FileSnConfigHistory]详细信息',
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
							//id : 'FileSnConfigHistoryForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'FileSnConfigHistory.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'SN_ID',
								 								name : 'FileSnConfigHistory.snId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'SN_NUMBER',
								 								name : 'FileSnConfigHistory.snNumber'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'SN_FORMAT',
								 								name : 'FileSnConfigHistory.snFormat'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'IS_YEAR',
								 								name : 'FileSnConfigHistory.snType'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'EXPIRATION_DATE',
								 								name : 'FileSnConfigHistory.expirationDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_USER',
								 								name : 'FileSnConfigHistory.updateUser'
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'FileSnConfigHistory.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/snconfig/getFileSnConfigHistory.do?id='+ this.id,
								root : 'data',
								preName : 'FileSnConfigHistory'
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
						url:__ctxPath + '/snconfig/saveFileSnConfigHistory.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('FileSnConfigHistoryGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});