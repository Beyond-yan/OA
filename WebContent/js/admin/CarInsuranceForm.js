/**
 * @author 
 * @createtime 
 * @class CarInsuranceForm
 * @extends Ext.Window
 * @description CarInsurance表单
 * @company 捷达世软件
 */
CarInsuranceForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				CarInsuranceForm.superclass.constructor.call(this, {
							id : 'CarInsuranceFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[CarInsurance]详细信息',
							buttonAlign : 'center',
							buttons : [
										{
											text : '保存',
											iconCls : 'btn-save',
											scope : this,
											handler : this.save
										},
//										{
//											text : '重置',
//											iconCls : 'btn-reset',
//											scope : this,
//											handler : this.reset
//										}, 
										{
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
							//id : 'CarInsuranceForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'carInsurance.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'CAR_ID',
								 								name : 'carInsurance.carId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'BUY_DATE',
								 								name : 'carInsurance.buyDate'
																,allowBlank:false
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'INSR_S_DATE',
								 								name : 'carInsurance.insrSDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'INSR_E_DATE',
								 								name : 'carInsurance.insrEDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'INSR_COMPANY',
								 								name : 'carInsurance.insrCompany'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'REF1',
								 								name : 'carInsurance.ref1'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'REF2',
								 								name : 'carInsurance.ref2'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'REF3',
								 								name : 'carInsurance.ref3'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'carInsurance.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'carInsurance.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'carInsurance.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'carInsurance.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getCarInsurance.do?id='+ this.id,
								root : 'data',
								preName : 'carInsurance'
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
						url:__ctxPath + '/admin/saveCarInsurance.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('CarInsuranceGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});