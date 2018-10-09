/**
 * @author 
 * @createtime 
 * @class ExpenseAccountPersonalDetailForm
 * @extends Ext.Window
 * @description ExpenseAccountPersonalDetail表单
 * @company 捷达世软件
 */
ExpenseAccountPersonalDetailForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				ExpenseAccountPersonalDetailForm.superclass.constructor.call(this, {
							id : 'ExpenseAccountPersonalDetailFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '详细信息',
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
							//id : 'ExpenseAccountPersonalDetailForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'expenseAccountPersonalDetail.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'EXPENSE_ID',
								 								name : 'expenseAccountPersonalDetail.expenseId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'NAME',
								 								name : 'expenseAccountPersonalDetail.name'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'AMOUNT',
								 								name : 'expenseAccountPersonalDetail.amount'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'PRICE',
								 								name : 'expenseAccountPersonalDetail.price'
								 																 								,maxLength: 18
								 							}
																																										,{
																fieldLabel : 'ACCOUNT',
								 								name : 'expenseAccountPersonalDetail.account'
								 																 								,maxLength: 18
								 							}
																																										,{
																fieldLabel : 'DESCRIPTION',
								 								name : 'expenseAccountPersonalDetail.description'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'expenseAccountPersonalDetail.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'expenseAccountPersonalDetail.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'expenseAccountPersonalDetail.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'expenseAccountPersonalDetail.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getExpenseAccountPersonalDetail.do?id='+ this.id,
								root : 'data',
								preName : 'expenseAccountPersonalDetail'
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
						url:__ctxPath + '/admin/saveExpenseAccountPersonalDetail.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('ExpenseAccountPersonalDetailGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});