/**
 * @author
 * @createtime
 * @class ArchivesForm
 * @extends Ext.Window
 * @description Archives表单
 */
ArchivesDetail = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				ArchivesDetail.superclass.constructor.call(this, {
							id : 'ArchivesDetailWin',
							layout : 'fit',
							items : this.displayPanel,
							modal : true,
							height : 560,
							iconCls:'menu-arch-detail',
							width : 700,
							maximizable : true,
							title : '公文详细信息',
							buttonAlign : 'center',
							buttons : this.buttons
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				this.displayPanel=new Ext.Panel({
				      id:'ArchivesDetailDisplayPanel',
				      autoScroll : true,
				      height:220,
				      border:false,
				      autoLoad:{
				    	url:__ctxPath+ '/pages/archive/archtransferDown.jsp?archivesId='+ this.archivesId+'&archType='+this.archType+ '&down=' + this.download + '&ran='+ Math.random(),
				      	nocache:true
				      }
				});
				var freshId=this.freshId;
				// 初始化功能按钮
				this.buttons = [{
							text : '关闭',
							iconCls : 'btn-close',
							handler : this.cancel.createCallback(this,freshId)
						}];
			},// end of the initcomponents
			/**
			 * 取消
			 * 
			 * @param {}
			 *            window
			 */
			cancel : function(window,freshId) {
				if(freshId){
				 Ext.getCmp(freshId).getStore().reload();
				}
				if(Ext.getCmp('AwaitDownloadFileView') != null){ //首页
					Ext.getCmp('AwaitDownloadFileView').getUpdater().update( __ctxPath+'/system/displaySysDataTransfer.do?Q_receiveFlag_L_EQ=0&start=0&limit=8&l=1&ran=' + Math.random());
				}
				window.close();
			}
		});