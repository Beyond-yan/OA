/**
 * @author
 * @createtime
 * @class MonitorHastenForm
 * @extends Ext.Window
 * @description ArchHasten表单
 */
WbPsPrinForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				WbPsPrinForm.superclass.constructor.call(this, {
							id : 'WbPsPrinFormWin',
							layout : 'fit',
							items :this.formPanel,
							modal : true,
							height : 200,
							width : 400,
							maximizable : true,
							title : '文本评审打印',
							buttonAlign : 'center',
							buttons : this.buttons
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px 10px 10px 10px',
							border : false,
							id : 'WbPsPrinForm',
							defaults : {
								anchor : '98%,98%'
							},
							items : [{
	                            xtype : 'label',
	                            id : 'ps',
	                            html : '&nbsp;<a href="' + __ctxPath +'/report/archivesDocumentReviewV1Report.do'+'?runId='+this.runid+'" target="_blank">文本评审表打印</a>'
	                            }, {
	                            xtype : 'label',
	                            id : 'sp',
	                            html : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="' + __ctxPath +'/report/archivesDocumentSpV1Report.do'+'?runId='+this.runid+'" target="_blank">文本评审表打印</a>'
	                            
	                            }]

						});
				
				// 初始化功能按钮
				this.buttons = [{
							text : '关闭',
							iconCls : 'btn-cancel',
							handler : this.cancel.createCallback(this)
						}];
			},
			/**
			 * 取消
			 * 
			 * @param {}
			 *            window
			 */
			cancel : function(window) {
				window.close();
			}
		});