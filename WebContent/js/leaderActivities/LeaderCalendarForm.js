/**
 * @author 
 * @createtime 
 * @class AttendCompanyCalendarForm
 * @extends Ext.Window
 * @description AttendCompanyCalendar表单
 * @company 捷达世软件
 */
LeaderCalendarForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				LeaderCalendarForm.superclass.constructor.call(this, {
							id : 'LeaderCalendarFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 400,
							width : 500,
							maximizable : true,
							title : '[AttendCompanyCalendar]详细信息',
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
							//id : 'AttendCompanyCalendarForm',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [{
								name : 'attendCompanyCalendar.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}
																																																	,{
																fieldLabel : 'DAY',
								 								name : 'attendCompanyCalendar.day'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'IS_DELETED',
								 								name : 'attendCompanyCalendar.isDeleted'
								 																,xtype:'numberfield'
								 							}
																																										,{
																fieldLabel : 'CREATE_DATE',
								 								name : 'attendCompanyCalendar.createDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'CREATE_BY',
								 								name : 'attendCompanyCalendar.createBy'
								 																 								,maxLength: 50
								 							}
																																										,{
																fieldLabel : 'UPDATE_DATE',
								 								name : 'attendCompanyCalendar.updateDate'
								 																,xtype:'datefield',
								format:'Y-m-d',
								value:new Date()
								 							}
																																										,{
																fieldLabel : 'UPDATE_BY',
								 								name : 'attendCompanyCalendar.updateBy'
								 																 								,maxLength: 50
								 							}
																																			]
						});
				//加载表单对应的数据	
				if (this.id != null && this.id != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath + '/attend/getAttendCompanyCalendar.do?id='+ this.id,
								root : 'data',
								preName : 'attendCompanyCalendar'
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
						url:__ctxPath + '/attend/saveAttendCompanyCalendar.do',
						callback:function(fp,action){
							var gridPanel = Ext.getCmp('AttendCompanyCalendarGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							this.close();
						}
					}
				);
			}//end of save

		});