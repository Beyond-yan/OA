/**
 * @author 
 * @createtime 
 * @class TsProblemForm
 * @extends Ext.Window
 * @description TsProblem表单
 * @company 捷达世软件
 */
TsProblemForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				TsProblemForm.superclass.constructor.call(this, {
							id : 'TsProblemFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[TsProblem]详细信息',
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
							//id : 'TsProblemForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'tsProblem.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'USER_ID',
								 								name : 'tsProblem.userId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'PRO_TYPE_ID',
								 								name : 'tsProblem.proTypeId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'PRO_PLACE',
								 								name : 'tsProblem.proPlace'
																,allowBlank:false
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'PRO_DESC',
								 								name : 'tsProblem.proDesc'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'PRO_STATUS',
								 								name : 'tsProblem.proStatus'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'DEALING_USER_ID',
								 								name : 'tsProblem.dealingUserId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'DEALING_RESULT',
								 								name : 'tsProblem.dealingResult'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'PROCESS_INSTANCE_ID',
								 								name : 'tsProblem.processInstanceId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'REF1',
								 								name : 'tsProblem.ref1'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'REF2',
								 								name : 'tsProblem.ref2'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'REF3',
								 								name : 'tsProblem.ref3'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'tsProblem.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'tsProblem.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'tsProblem.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'tsProblem.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getTsProblem.do?id='+ this.id,
								root : 'data',
								preName : 'tsProblem'
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
						url:__ctxPath + '/admin/saveTsProblem.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('TsProblemGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});