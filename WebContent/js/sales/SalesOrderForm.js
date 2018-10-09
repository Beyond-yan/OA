/**
 * @author 
 * @createtime 
 * @class SalesOrderForm
 * @extends Ext.Window
 * @description SalesOrder表单
 * @company 捷达世软件
 */
SalesOrderForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				SalesOrderForm.superclass.constructor.call(this, {
							id : 'SalesOrderFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[SalesOrder]详细信息',
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
							//id : 'SalesOrderForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'salesOrder.orderid',
								xtype : 'hidden',
								value : this.orderid == null ? '' : this.orderid
							}
																																																	,{
																fieldLabel : 'userId',
								 								name : 'salesOrder.userid'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'orderNo',
								 								name : 'salesOrder.orderno'
																,allowBlank:false
								 																 								,maxLength: 64
								 							}
																																										,{
																fieldLabel : 'createtime',
								 								name : 'salesOrder.createtime'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'total',
								 								name : 'salesOrder.total'
																,allowBlank:false
								 																 								,maxLength: 18
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.orderid != null && this.orderid != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/sales/getSalesOrder.do?orderid='+ this.orderid,
								root : 'data',
								preName : 'salesOrder'
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
						url:__ctxPath + '/sales/saveSalesOrder.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('SalesOrderGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});