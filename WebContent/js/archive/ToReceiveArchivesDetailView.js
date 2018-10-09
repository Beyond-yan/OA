/**
 * @description 公文详情界面
 * @class ToReceiveArchivesDetailView
 * @extends Ext.Panel
 */
ToReceiveArchivesDetailView = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		ToReceiveArchivesDetailView.superclass.constructor.call(this, {
					title : '公文详情',
					id : 'ToReceiveArchivesDetailView',
					iconCls : 'btn-archives-detail',
					layout : 'form',
					modal : true,
					autoScroll:true,
					height : 430,
					width : 750,
					border : false,
					buttonAlign : 'center',
					buttons :  [{
									text:'收文登记',
									iconCls:'btn-myAssign',
									id : 'ToReceiveArchivesDetailView.receive',
									handler : this.openPanel,
									scope : this
								},{
									text:'关闭',
									iconCls:'btn-close',
									handler : this.closePanel,
									scope : this
								}],
					items : [this.panel,this.displayPanel]
				});
				var isReceive=this.isReceive;
				if(isReceive==0){
					Ext.getCmp('ToReceiveArchivesDetailView.receive').show();
				}else{
					Ext.getCmp('ToReceiveArchivesDetailView.receive').hide();
				}
	},
	/**
	 * 打开收文登记
	 */
	openPanel : function() {
		var archivesId=this.archivesId;
		new ToReceiveArchFlowView(archivesId);
	},
	/**
	 * 关闭Panel
	 */
	closePanel : function() {
		var freshId= this.freshId;
		if(freshId){
			Ext.getCmp(freshId).getStore().reload();
		}
		if(Ext.getCmp('AwaitDownloadFileView') != null){ //首页
			Ext.getCmp('AwaitDownloadFileView').getUpdater().update( __ctxPath+'/system/displaySysDataTransfer.do?Q_receiveFlag_L_EQ=0&start=0&limit=8&l=1&ran=' + Math.random());
		}
		this.close();
	},
	
	/**
	 * init the components
	 */
	init : function() {
		this.panel = new Ext.Panel({
			//columnWidth : 1,
			width:720,
			autoScroll:true,
			autoHeight:true,
			autoLoad:{
				url:__ctxPath+ '/pages/archive/archtransfer.jsp?archivesId='+ this.archivesId+'&archType='+this.archType+ 
				'&down=' + this.download + '&dataSource='+this.dataSource+'&runid='+this.runid+'&taskId='+this.taskId+'&fromSchema='+this.fromSchema+'&ran='+ Math.random()
			}
		});
		if(this.dataSource==0&&this.runid!=0){
		this.displayPanel = new Ext.Panel({
			title:'审批信息',
			autoScroll:true,
			width:720,
			autoHeight:true,
			autoLoad:{
				url:__ctxPath+'/flow/schemaprocessRunDetail.do?randId='+Math.random()+'&taskId='+this.taskId+'&runId='+this.runid+'&schemacode='+this.fromSchema,
			}
		});}
		else{this.displayPanel =new Ext.Panel({});}
	}// end of init
});