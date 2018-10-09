/**
 * @author 
 * @createtime 
 * @class ProcessReportForm
 * @extends Ext.Window
 * @description ProcessReport表单
 * @company 捷达世软件
 */
FlowSendForm = Ext.extend(Ext.Window, {
			//构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				//必须先初始化组件
				this.initUIComponents();
				FlowSendForm.superclass.constructor.call(this, {
							id : 'ProcessReportFormWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 550,
							width : 700,
							maximizable : true,
							title : '来文流程审批信息',
							buttonAlign : 'center',
							buttons : [
							           	{
											text : '关闭',
											iconCls : 'btn-cancel',
											scope : this,
											handler : this.cancel
										}
							         ]
				});
			},//end of the constructor
			//初始化组件
			initUIComponents : function() {
				this.formPanel = new Ext.Panel({
					//title:'流程审批信息',
					region:'center',
					width:400,
					autoScroll:true,
					autoLoad:{
						url:__ctxPath+'/flow/processRunDetailSend.do?piId='+this.piid + "&runId="+ this.runid
					}
				});				
			},//end of the initcomponents

			/**
			 * 取消
			 * @param {} window
			 */
			cancel : function() {
				this.close();
			}

		});