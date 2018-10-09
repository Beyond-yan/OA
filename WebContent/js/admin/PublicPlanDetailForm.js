/**
 * @author 
 * @createtime 
 * @class PublicPlanDetailForm
 * @extends Ext.Window
 * @description PublicPlanDetail表单
 * @company 捷达世软件
 */
PublicPlanDetailForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				PublicPlanDetailForm.superclass.constructor.call(this, {
							id : 'PublicPlanDetailFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[PublicPlanDetail]详细信息',
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
							//id : 'PublicPlanDetailForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'publicPlanDetail.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'PUBLIC_PLAN_ID',
								 								name : 'publicPlanDetail.publicPlanId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'ITEM_NAME',
								 								name : 'publicPlanDetail.itemName'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'EXEC_TIME',
								 								name : 'publicPlanDetail.execTime'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'USER_ID',
								 								name : 'publicPlanDetail.userId'
								 																 								,maxLength: 100
								 							}
																																										,{
																fieldLabel : 'TOTAL',
								 								name : 'publicPlanDetail.total'
								 																 								,maxLength: 9
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'publicPlanDetail.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'publicPlanDetail.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'publicPlanDetail.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'publicPlanDetail.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getPublicPlanDetail.do?id='+ this.id,
								root : 'data',
								preName : 'publicPlanDetail'
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
						url:__ctxPath + '/admin/savePublicPlanDetail.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('PublicPlanDetailGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});