/**
 * @createtime:2013-12-04
 * @description 公文详情界面
 * @class ArchDetailView
 * @extends Ext.Panel
 */
MyccArchDetailView = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		MyccArchDetailView.superclass.constructor.call(this, {
					title : '公文详情',
					id : 'MyccArchDetailView',
					iconCls : 'btn-archives-detail',
					layout : 'form',
					modal : true,
					autoScroll:true,
					height : 430,
					width : 750,
					border : false,
					buttonAlign : 'center',
					buttons :  [ {
									text : '已阅读',
									iconCls : 'btn-del',
									handler : this.closePanel,
									scope : this
								}],
					items : [this.panel,this.displayPanel]
				});
	},
	/**
	 * 关闭Panel
	 */
	closePanel : function() {
			Ext.Ajax.request({
				url : __ctxPath + "/archive/saveCCArchives.do?Id="+this.Id,
				method : 'POST',
				success : function(fp, action) {
					var  MyCCArchivesGrid=Ext.getCmp('MyCCArchivesGrid')
					if (MyCCArchivesGrid != null) {
										MyCCArchivesGrid.getStore().reload();
									}
					Ext.getCmp('MyGivemeCCArchives').getUpdater().update(
						__ctxPath + '/archive/listreadArchives.do?userId='
					+ curUserInfo.userId +'&start=0&limit=8'+'&ran=' + Math.random());
				},
				failure : function(fp, action) {
					Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
				}
			});
		this.close();
	},
	
	/**
	 * init the components
	 */
	init : function() {
		this.panel = new Ext.Panel({
			//columnWidth : 1,
			id:'archivesSentInfoDetail.displayPanel',
			width:720,
			autoScroll:true,
			autoHeight:true,
			autoLoad:{
				url:__ctxPath+ '/pages/archive/archInfo.jsp?archivesId='+ this.archivesId+'&defId='+this.defId+'&archType='+this.archType+'&sentPanelId=archivesSentInfoDetail&detailId=archivesSentInfoDetail.displayPanel&isGranted=false'
				//url:__ctxPath+ '/pages/archive/archInfo.jsp?archivesId='+ this.archivesId+'&defId='+this.defId+'&archType='+this.archType
			}
		});
		this.displayPanel = new Ext.Panel({
			title:'审批信息',
			autoScroll:true,
			width:720,
			autoHeight:true,
			autoLoad:{
				url:__ctxPath+'/flow/processRunDetail.do?randId='+Math.random()+'&taskId='+this.taskId+'&runId='+this.runId
			}
		});
	}// end of init
});