/**
 * @author 
 * @createtime 
 * @class PersonnelLeaveApplyForm
 * @extends Ext.Window
 * @description PersonnelLeaveApply表单
 * @company 捷达世软件
 */
PersonnelLeaveApplyForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				PersonnelLeaveApplyForm.superclass.constructor.call(this, {
							id : 'PersonnelLeaveApplyFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[PersonnelLeaveApply]详细信息',
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
							//id : 'PersonnelLeaveApplyForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'personnelLeaveApply.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'APPLICANT_ID',
								 								name : 'personnelLeaveApply.applicantId'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'TYPE',
								 								name : 'personnelLeaveApply.type'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'START_DT',
								 								name : 'personnelLeaveApply.startDt'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'END_DT',
								 								name : 'personnelLeaveApply.endDt'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'BACK_DT',
								 								name : 'personnelLeaveApply.backDt'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'DESCRIPTION',
								 								name : 'personnelLeaveApply.description'
								 																 								,xtype:'textarea'
								 								,maxLength: 400
								 							}
																																										,{
																fieldLabel : 'REMARK',
								 								name : 'personnelLeaveApply.remark'
								 																 								,xtype:'textarea'
								 								,maxLength: 400
								 							}
																																										,{
																fieldLabel : 'IS_DELETED',
								 								name : 'personnelLeaveApply.isDeleted'
																,allowBlank:false
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'PROCESS_INS_ID',
								 								name : 'personnelLeaveApply.processInsId'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'personnelLeaveApply.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'personnelLeaveApply.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'personnelLeaveApply.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'personnelLeaveApply.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/personal/getPersonnelLeaveApply.do?id='+ this.id,
								root : 'data',
								preName : 'personnelLeaveApply'
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
						url:__ctxPath + '/personal/savePersonnelLeaveApply.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('PersonnelLeaveApplyGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});