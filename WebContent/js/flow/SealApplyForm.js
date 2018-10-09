/**
 * @author 
 * @createtime 
 * @class SealApplyForm
 * @extends Ext.Window
 * @description SealApply表单
 * @company 捷达世软件
 */
SealApplyForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SealApplyForm.superclass.constructor.call(this, {
							id : 'SealApplyFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[SealApply]详细信息',
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
							//id : 'SealApplyForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'sealApply.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'APPLY_USER_ID',
								 								name : 'sealApply.applyUserId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'DEPARTMENT_ID',
								 								name : 'sealApply.departmentId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'SEAL_NAME',
								 								name : 'sealApply.sealName'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'OPPOSITE_NAME',
								 								name : 'sealApply.oppositeName'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'REASON',
								 								name : 'sealApply.reason'
								 																 								,xtype:'textarea'
								 								,maxLength: 300
								 							}
																																										,{
																fieldLabel : 'SEALED_STATE',
								 								name : 'sealApply.sealedState'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'SEALED_DATE',
								 								name : 'sealApply.sealedDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'APPLY_STATE',
								 								name : 'sealApply.applyState'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'PROCESS_INS_ID',
								 								name : 'sealApply.processInsId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'sealApply.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'sealApply.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'sealApply.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'sealApply.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/flow/getSealApply.do?id='+ this.id,
								root : 'data',
								preName : 'sealApply'
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
						url:__ctxPath + '/flow/saveSealApply.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('SealApplyGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});