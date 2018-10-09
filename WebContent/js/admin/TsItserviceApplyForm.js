/**
 * @author 
 * @createtime 
 * @class TsItserviceApplyForm
 * @extends Ext.Window
 * @description TsItserviceApply表单
 * @company 捷达世软件
 */
TsItserviceApplyForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				TsItserviceApplyForm.superclass.constructor.call(this, {
							id : 'TsItserviceApplyFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[TsItserviceApply]详细信息',
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
							//id : 'TsItserviceApplyForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'tsItserviceApply.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'USER_ID',
								 								name : 'tsItserviceApply.userId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'APPLY_TYPE_ID',
								 								name : 'tsItserviceApply.applyTypeId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'APPLY_DESC',
								 								name : 'tsItserviceApply.applyDesc'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'PRO_STATUS',
								 								name : 'tsItserviceApply.proStatus'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'DEALING_USER_ID',
								 								name : 'tsItserviceApply.dealingUserId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'DEALING_RESULT',
								 								name : 'tsItserviceApply.dealingResult'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'PROCESS_INSTANCE_ID',
								 								name : 'tsItserviceApply.processInstanceId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'REF1',
								 								name : 'tsItserviceApply.ref1'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'REF2',
								 								name : 'tsItserviceApply.ref2'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'REF3',
								 								name : 'tsItserviceApply.ref3'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'tsItserviceApply.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'tsItserviceApply.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'tsItserviceApply.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'tsItserviceApply.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getTsItserviceApply.do?id='+ this.id,
								root : 'data',
								preName : 'tsItserviceApply'
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
						url:__ctxPath + '/admin/saveTsItserviceApply.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('TsItserviceApplyGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});