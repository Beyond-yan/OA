/**
 * @author 
 * @createtime 
 * @class ConfRoomEquipForm
 * @extends Ext.Window
 * @description ConfRoomEquip表单
 * @company 捷达世软件
 */
ConfRoomEquipForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				ConfRoomEquipForm.superclass.constructor.call(this, {
							id : 'ConfRoomEquipFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[ConfRoomEquip]详细信息',
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
							//id : 'ConfRoomEquipForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'confRoomEquip.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'ROOM_ID',
								 								name : 'confRoomEquip.roomId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'NAME',
								 								name : 'confRoomEquip.name'
																,allowBlank:false
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'AMOUNT',
								 								name : 'confRoomEquip.amount'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'DESCRIPTION',
								 								name : 'confRoomEquip.description'
								 																 								,maxLength: 200
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'confRoomEquip.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'confRoomEquip.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'confRoomEquip.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'confRoomEquip.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				/*if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/admin/getConfRoomEquip.do?id='+ this.id,
								root : 'data',
								preName : 'confRoomEquip'
							});
				}*/
				
				if (this.id != null && this.id != '') {
					this.formPanel.loadData( {
						url : __ctxPath + '/admin/getConfRoomEquip.do?id='+ this.id,
						root : 'data',
						preName : 'confRoomEquip',
						success : function(response, options) {
						},
						failure : function() {
							Ext.ux.Toast.msg('操作提示', '对不起，数据加载失败！');
						}
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
						url:__ctxPath + '/admin/saveConfRoomEquip.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('ConfRoomEquipGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});