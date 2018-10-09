/**
 * @author
 * @createtime
 * @class ArchivesForm
 * @extends Ext.Window
 * @description Archives表单
 */
JwArchivesDetail = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				JwArchivesDetail.superclass.constructor.call(this, {
							id : 'JwArchivesDetailWin',
							layout : 'form',
							items : [this.displayPanel,this.flowPanel],
							modal : true,
							height : 400,
							iconCls:'menu-arch-detail',
							width : 750,
							autoScroll:true,
							title : '公文详细信息',
							buttonAlign : 'center',
							buttons : this.buttons
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				this.displayPanel=new Ext.Panel({
				      id:'JwArchivesDetailDisplayPanel',
				      autoScroll : true,
				      width:720,
				      autoHeight:true,
				      border:false,
				      autoLoad:{
				      	url:__ctxPath+'/pages/archive/archInfo.jsp?archivesId='+this.archivesId + '&defId=' +this.defId+ '&archType=' +this.fileType,
				      	nocache:true
				      }
				});
				this.flowPanel = new Ext.Panel({
					title:'审批信息',
					autoScroll:true,
					width:720,
					autoHeight:true,
					autoLoad:{
						url:__ctxPath+'/flow/processRunDetail.do?randId='+Math.random()+'&runId='+this.runId
					}
				});
				// 初始化功能按钮
				this.buttons = [{
							text : '关闭',
							iconCls : 'btn-close',
							handler : this.cancel.createCallback(this)
						}];
			},// end of the initcomponents
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