/**
 * @author 
 * @createtime 
 * @class CarCardHistoryForm
 * @extends Ext.Window
 * @description CarCardHistory表单
 * @company 捷达世软件
 */
CarCardHistoryForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				CarCardHistoryForm.superclass.constructor.call(this, {
							id : 'CarCardHistoryFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[CarCardHistory]详细信息',
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
							//id : 'CarCardHistoryForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'carCardHistory.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'CARD_TYPE',
								 								name : 'carCardHistory.cardType'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'CARD_ID',
								 								name : 'carCardHistory.cardId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'USE_TYPE',
								 								name : 'carCardHistory.useType'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'AMOUNT',
								 								name : 'carCardHistory.amount'
								 																 								,maxLength: 18
								 							}
																																										,{
																fieldLabel : 'USE_DATE',
								 								name : 'carCardHistory.useDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'DESCRIPTION',
								 								name : 'carCardHistory.description'
								 																 								,xtype:'textarea'
								 								,maxLength: 400
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'carCardHistory.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'carCardHistory.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'carCardHistory.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'carCardHistory.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getCarCardHistory.do?id='+ this.id,
								root : 'data',
								preName : 'carCardHistory'
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
						url:__ctxPath + '/admin/saveCarCardHistory.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('CarCardHistoryGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});